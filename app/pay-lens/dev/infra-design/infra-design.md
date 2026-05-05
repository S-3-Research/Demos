# Payment Detection — Infra Design

## 整体架构

```
                      ┌──────────────────────────────────────────────────┐
                      │              API Gateway (REST)                  │
                      │  POST /jobs/submit                               │
                      │  GET  /jobs/status  /jobs/{jobId}                │
                      │  GET  /detections   /detections/latest           │
                      │  GET  /detections/summary                        │
                      └──────┬────────────┬────────────┬─────────────────┘
                             │            │            │
              ┌──────────────▼──┐   ┌─────▼─────┐  ┌──▼──────────────────┐
              │  submit-handler │   │  jobs-    │  │  query-handler /    │
              │  (Lambda)       │   │  handler  │  │  summary-handler    │
              └────────┬────────┘   └─────┬─────┘  └──────────────────┬──┘
                       │ submitJob()       │ Batch API    DynamoDB ▲   │ DynamoDB
                       ▼                  ▼              + Batch API  │
          ┌────────────────────────┐                                   │
          │   AWS Batch (Fargate)  │                                   │
          │   payment-detection-   │                                   │
          │   job (container)      │                                   │
          └─────────┬──────────────┘                                   │
                    │ batch-runner.ts                                   │
                    │ runDetection() → S3 + DynamoDB                    │
                    ▼                                                   │
          ┌──────────────────────┐    EventBridge (FAILED/SUCCEEDED)    │
          │   S3 artifacts       │◄──────────────────────────────┐      │
          │   DynamoDB jobs table│◄──────────────────────────────┼──────┘
          └──────────────────────┘                    ┌──────────┴──────────┐
                                                      │  status-sync Lambda │
                                                      │  updateJobStatus()  │
                                                      └─────────────────────┘

  单URL直接调用:
  invoke DetectorLambda → lambda-handler.ts
    writeJobSubmitted() → runDetection() → writeJobResult()
    catch: updateJobStatus(FAILED)
```

---

## 执行模式

| 模式 | 触发 | 入口文件 | jobId 来源 |
|------|------|----------|-----------|
| **Lambda** | 直接 invoke / API 直连 | `src/aws/lambda-handler.ts` | `context.awsRequestId` |
| **Batch** | `POST /jobs/submit` | `src/aws/batch-runner.ts` | `AWS_BATCH_JOB_ID` (Batch 自动注入) |

---

## Job 生命周期 & DynamoDB 写入时机

```
[Batch 模式]
  submit-handler
    → batch.submitJob()
    → writeJobSubmitted(jobId, hostname, url)   ← status: SUBMITTED

  Batch Container (batch-runner.ts)
    → runDetection()
    → writeJobResult(jobId, ...)               ← status: SUCCEEDED + 追加结果字段
    → exit 1 (失败时不写 DynamoDB)

  EventBridge Rule (aws.batch → FAILED/SUCCEEDED)
    → status-sync Lambda
    → updateJobStatus(jobId, status, stoppedAt) ← 覆盖最终状态 + stoppedAt

[Lambda 模式]
  lambda-handler.ts
    → writeJobSubmitted(jobId, hostname, url)   ← status: SUBMITTED
    → runDetection()
    → writeJobResult(jobId, ...)               ← status: SUCCEEDED
    → catch: updateJobStatus(jobId, 'FAILED')   ← 无 EventBridge，自己处理
```

---

## DynamoDB 表结构

| 属性 | 类型 | 说明 |
|------|------|------|
| `pk` | PK (S) | hostname，如 `example.com` |
| `sk` | SK (S) | `job#<jobId>` |
| `jobId` | S | AWS Batch Job ID / Lambda Request ID |
| `url` | S | 完整产品页 URL |
| `status` | S | `SUBMITTED` → `SUCCEEDED` / `FAILED` |
| `submittedAt` | N | epoch ms，提交时写入 |
| `completedAt` | N | epoch ms，成功时由 container/Lambda 写入 |
| `stoppedAt` | N | epoch ms，EventBridge Lambda 写入（Batch 模式） |
| `entities` | L | 统一实体列表，每条为 `{ name, category, available, confidence }` |
| `entityCount` | N | 检测到的实体总数 |
| `signalCount` | N | 信号总数 |
| `s3Paths` | M | artifact 文件名 → S3 URI 映射 |
| `logStreamName` | S | CloudWatch Batch 日志流名称，由 status-sync Lambda 在终态时写入，格式 `payment-detection-job/default/<hash>` |
| `navFinalState` | S | `navigateToCheckoutSM` 最终到达的 PageState；成功时为 `CHECKOUT_PAYMENT_STEP`，失败时为终止失败态（如 `SIGN_IN_WALL`、`CART_EMPTY`、`EXHAUSTED`） |
| `navBlockReason` | S | 导航失败时的可读原因字符串；成功时不写入 |
| `ttl` | N | Unix 秒，90天后自动过期 |

**entities 字段结构（方案 A 统一格式）：**
```json
[
  { "name": "Stripe",    "category": "gateway",    "available": true,  "confidence": "high" },
  { "name": "Apple Pay", "category": "wallet",     "available": false, "confidence": "medium" },
  { "name": "Klarna",    "category": "bnpl",       "available": true,  "confidence": "high" },
  { "name": "Visa",      "category": "card-brand", "available": true,  "confidence": "low" }
]
```
category 取値：`gateway` / `wallet` / `bnpl` / `card-brand` / `platform`

---

## API 端点

| 方法 | 路径 | Handler | 说明 |
|------|------|---------|------|
| `POST` | `/jobs/submit` | submit-handler | 提交 Batch 扫描任务，立即返回 jobId |
| `GET`  | `/jobs/status?status=RUNNING` | jobs-handler | Batch 队列当前状态（透传 Batch API） |
| `GET`  | `/jobs/{jobId}` | jobs-handler | 单个 job 详情（透传 Batch API，含 log stream） |
| `GET`  | `/detections?hostname=example.com&from=2026-01-01` | query-handler | 按 hostname 查历史扫描记录 |
| `GET`  | `/detections/latest?url=https://...` | query-handler | 查某 URL 最近一次成功扫描结果 |
| `GET`  | `/detections/summary` | summary-handler | **聚合视图**：DynamoDB 历史记录 + Batch 实时状态合并，用于 UI 任务面板 |
| `GET`  | `/artifacts?s3Uri=s3://...` | artifacts-handler | 生成 S3 Presigned URL（15分钟有效），用于下载 artifact 文件 |

### `/detections/summary` 参数

| 参数 | 类型 | 必须 | 默认 | 说明 |
|------|------|------|------|------|
| `hostname` | string | 否 | - | 过滤特定域名，不传则返回所有 |
| `from` | ISO日期 | 否 | 7天前 | 提交时间起点 |
| `to` | ISO日期 | 否 | 现在 | 提交时间终点 |
| `limit` | number | 否 | 50 | 最多返回条数（上限 200） |
| `includeBatchDetail` | boolean | 否 | true | 是否补充进行中任务的 Batch 实时状态 |

**Merge 逻辑：** 进行中的 job（DynamoDB status 为 SUBMITTED/RUNNING）会调用 `Batch.describeJobs()` 补充实时 status、logStreamName、statusReason；已完成的 job 直接用 DynamoDB 数据，`batchDetail: null`。

每条 job 响应包含顶层 `logStreamName` 字段，优先读取 DynamoDB 中持久化的值（由 status-sync Lambda 在任务终态时写入），若任务仍在运行则取 Batch 实时 API 中的值，否则为 `null`。CloudWatch 日志链接格式：

每条 job 响应同时透传以下 DynamoDB 字段（直接读取，不做计算）：

| 字段 | 来源 | 说明 |
|------|------|------|
| `navFinalState` | `item['navFinalState'] ?? null` | `navigateToCheckoutSM` 最终到达的 PageState；成功时为 `CHECKOUT_PAYMENT_STEP`，`NavError` 时为终止失败态 |
| `navBlockReason` | `item['navBlockReason'] ?? null` | 导航失败时的可读原因字符串（如 `SIGN_IN_WALL`、`CART_EMPTY`、`EXHAUSTED`）；成功时为 `null` |
```
https://us-west-2.console.aws.amazon.com/cloudwatch/home?region=us-west-2#logEventViewer:group=/aws/batch/job;stream=<logStreamName>
```

> `/jobs` 端点走 Batch API，Batch 保留 24h 历史。  
> `/detections` 端点走 DynamoDB，TTL 90 天。  
> `/detections/summary` 聚合两者，进行中走 Batch，完成的走 DynamoDB。

---

## CDK Stack 分层

```
infra/
  bin/app.ts               ← CDK App 入口，串联3个 stack
  lib/
    storage-stack.ts       ← 持久化资源（先部署，其他 stack 依赖它）
    compute-stack.ts       ← 计算资源（依赖 StorageStack）
    api-stack.ts           ← API 层（依赖 StorageStack + ComputeStack 输出）
```

### StorageStack
- **S3 Bucket** — `payment-detection-artifacts-<account>`，results/ 前缀 90 天过期
- **DynamoDB Table** — `payment-detection-jobs`，PAY_PER_REQUEST，TTL 字段 `ttl`
- **ECR Repository** — `payment-detection`，保留最近 10 个镜像
- 导出 `bucket` / `table` / `ecrRepo` 供其他 stack 使用

### ComputeStack
- **Shared IAM Role** — Lambda + ECS tasks 共用，按最小权限授 S3 PutObject / DynamoDB Write / ECR Pull
- **DetectorLambda** — ECR 容器镜像，CMD 覆盖为 `dist/lambda-handler.handler`，2GB 内存，5分钟超时
- **Batch** — Fargate 计算环境（默认 VPC 公有子网） + 任务队列 + 任务定义（2vCPU / 4GB，重试 2 次，超时 10 分钟）
- **StatusSyncLambda** — NodejsFunction，打包 `src/aws/status-sync-handler.ts`
- **EventBridge Rule** — 匹配 `aws.batch` + `status: [FAILED, SUCCEEDED]` + `jobQueue: payment-detection-queue`（ARN 精确匹配，防止其他队列的 job 触发） → StatusSyncLambda

### ApiStack
- **API Gateway RestApi** — stage `v1`，启用 CORS
- **SubmitFn** — `src/api/submit-handler.ts`，授 `batch:SubmitJob` + DynamoDB Write
- **JobsFn** — `src/api/jobs-handler.ts`，授 `batch:ListJobs` + `batch:DescribeJobs`
- **QueryFn** — `src/api/query-handler.ts`，授 DynamoDB Read
- **SummaryFn** — `src/api/summary-handler.ts`，授 DynamoDB Read + `batch:DescribeJobs`；聚合 DynamoDB 历史与 Batch 实时状态
- **ArtifactsFn** — `src/api/artifacts-handler.ts`，授 S3 Read；生成 Presigned URL，仅允许 `results/` 前缀路径

---

## 源码目录结构

```
payment_detection/
├── src/
│   ├── core/                  ← 纯检测逻辑，无 AWS 依赖
│   │   ├── types.ts           ← 所有 TypeScript 类型定义
│   │   ├── signatures.ts      ← 支付网关特征库
│   │   ├── detector.ts        ← 网络/HTML 信号采集
│   │   ├── actions.ts         ← 页面交互动作
│   │   ├── checkout_nav.ts    ← 结账流程导航状态机
│   │   ├── artifacts.ts       ← 本地 artifact 写入
│   │   └── runner.ts          ← 检测主流程（被 Lambda/Batch/test 调用）
│   │
│   ├── aws/                   ← AWS 运行时入口 & 存储
│   │   ├── storage.ts         ← S3 上传 + DynamoDB 读写
│   │   ├── lambda-handler.ts  ← Lambda 入口（单 URL）
│   │   ├── batch-runner.ts    ← Batch/Fargate 入口（批量）
│   │   └── status-sync-handler.ts ← EventBridge → DynamoDB 终态同步
│   │
│   └── api/                   ← API Gateway Lambda handlers
│       ├── submit-handler.ts  ← POST /jobs/submit
│       ├── jobs-handler.ts    ← GET  /jobs/status  /jobs/{jobId}
│       ├── query-handler.ts   ← GET  /detections   /detections/latest
│       ├── summary-handler.ts ← GET  /detections/summary（DynamoDB + Batch 聚合）
│       └── artifacts-handler.ts ← GET  /artifacts（S3 Presigned URL）
│
├── tests/                     ← Playwright 测试（本地开发用）
├── infra/                     ← CDK 基础设施
│   ├── bin/app.ts
│   └── lib/
│       ├── storage-stack.ts
│       ├── compute-stack.ts
│       └── api-stack.ts
├── Dockerfile                 ← 多阶段构建，builder: node:22-bookworm, runtime: public.ecr.aws/lambda/nodejs:22
├── tsconfig.json              ← 测试用
├── tsconfig.build.json        ← 生产构建（rootDir: src, outDir: dist）
└── infra-design.md            ← 本文档
```

---

## 部署

### deploy.sh（推荐）

```bash
# 完整流程：build → push → CDK deploy → Lambda force-update
bash deploy.sh

# 跳过 docker build/push，只重跑 CDK + Lambda 更新（镜像已推好时用）
bash deploy.sh --stack-only

# 跳过 CDK，只强制更新 Lambda 函数代码
bash deploy.sh --lambda-only
```

`deploy.sh` 内部四步：

1. **ECR 登录 + 构建两个镜像目标**
   - `--target batch` → `ECR_URI:batch`（Fargate 入口）
   - `--target lambda-runtime` → `ECR_URI:lambda`（Lambda 入口）
2. **从 ECR 解析精确 sha256 digest**（两个 tag 各自解析）
3. **CDK deploy** — 通过 `--context imageTag=sha256:... batchImageTag=sha256:...`
   传入 digest，确保 CloudFormation 每次检测到变化并更新资源
4. **force-update Lambda**（belt-and-suspenders）— 直接调用
   `aws lambda update-function-code --image-uri ECR@digest`

> ⚠️  直接用 `:latest` tag 跑 `cdk deploy` 会导致 CloudFormation 检测不到
> 镜像内容变化，Lambda 代码不更新。务必通过 `deploy.sh` 或手动指定 digest。

### 手动部署（首次 / CDK bootstrap）

```bash
# 1. ECR 登录
aws ecr get-login-password --region us-west-2 \
  | docker login --username AWS --password-stdin \
    235134029580.dkr.ecr.us-west-2.amazonaws.com

# 2. 构建两个 target
docker build --platform linux/amd64 --target batch \
  -t 235134029580.dkr.ecr.us-west-2.amazonaws.com/payment-detection:batch .
docker build --platform linux/amd64 --target lambda-runtime \
  -t 235134029580.dkr.ecr.us-west-2.amazonaws.com/payment-detection:lambda .

# 3. 推送并获取 digest
docker push 235134029580.dkr.ecr.us-west-2.amazonaws.com/payment-detection:batch
docker push 235134029580.dkr.ecr.us-west-2.amazonaws.com/payment-detection:lambda
IMAGE_DIGEST=$(aws ecr describe-images --region us-west-2 \
  --repository-name payment-detection --image-ids imageTag=lambda \
  --query 'imageDetails[0].imageDigest' --output text)
BATCH_DIGEST=$(aws ecr describe-images --region us-west-2 \
  --repository-name payment-detection --image-ids imageTag=batch \
  --query 'imageDetails[0].imageDigest' --output text)

# 4. CDK bootstrap（首次）
cd infra && npx cdk bootstrap

# 5. 部署（传 digest）
npx cdk deploy --all \
  --context "imageTag=${IMAGE_DIGEST}" \
  --context "batchImageTag=${BATCH_DIGEST}" \
  --require-approval never
```

---

## 本地开发测试

### 1. 纯本地 Playwright 测试（最快，无 Docker）

```bash
# 安装依赖 + 浏览器
npm ci
npx playwright install chromium

# 运行单条测试（k9reproduction 为参考 URL）
npx playwright test tests/checkout-gateway.spec.ts \
  --headed                    # 可视化调试，去掉则 headless
  # 期望: entities=5, Square(H✓), Afterpay(H✓)

# 运行所有测试
npx playwright test
```

### 2. 本地 Docker — Batch 模式

```bash
# 构建 batch target
docker build --platform linux/amd64 --target batch \
  -t payment-detection:batch-local .

# 运行（直接传 URL 环境变量）
docker run --rm \
  -e PRODUCT_URL="https://www.k9reproduction.com/product-page/wondfo-canine-progesterone-trilevel-qc-test-kit" \
  payment-detection:batch-local

# 查看日志 / 结果
# 容器内结果写到 /tmp/run_<timestamp>/  (S3_BUCKET 未设则跳过上传)
```

### 3. 本地 Docker — Lambda 模式（最接近云端行为）

```bash
# 构建 lambda target
docker build --platform linux/amd64 --target lambda-runtime \
  -t payment-detection:lambda-local .

# 启动本地 Lambda Runtime Interface Emulator
docker run -d --rm -p 9000:8080 \
  --name lambda-local \
  payment-detection:lambda-local

# 调用（等同于 Lambda invoke）
curl -s -X POST \
  "http://localhost:9000/2015-03-31/functions/function/invocations" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.k9reproduction.com/product-page/wondfo-canine-progesterone-trilevel-qc-test-kit"}' \
  | python3 -m json.tool

# 实时查看日志
docker logs -f lambda-local 2>&1 | grep -E "\[state\]|\[atc\]|\[fill\]|entities|Step [1-6]|✓|⛔"

# 停止容器
docker stop lambda-local
```

---

## 端到端测试

### Lambda 模式（直接调用 AWS）

```bash
# --cli-read-timeout 120 必须加：检测耗时 ~60s，默认 60s 超时会断连
aws lambda invoke \
  --region us-west-2 \
  --function-name payment-detector \
  --payload '{"url":"https://www.k9reproduction.com/product-page/wondfo-canine-progesterone-trilevel-qc-test-kit"}' \
  --cli-binary-format raw-in-base64-out \
  --cli-read-timeout 120 \
  /tmp/lambda-result.json \
  && cat /tmp/lambda-result.json | python3 -m json.tool

# 期望：statusCode 200，entities=5，gateways 含 Square(high)，bnpl 含 Afterpay(high)
```

### Batch 模式（通过 API Gateway）

```bash
API_URL="https://dksxsk0f39.execute-api.us-west-2.amazonaws.com/v1"

# 1. 提交任务
JOB_RESPONSE=$(curl -s -X POST "${API_URL}/jobs/submit" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.k9reproduction.com/product-page/wondfo-canine-progesterone-trilevel-qc-test-kit"}')
echo $JOB_RESPONSE | python3 -m json.tool
JOB_ID=$(echo $JOB_RESPONSE | python3 -c "import sys,json; print(json.load(sys.stdin)['jobId'])")

# 2. 轮询状态（Batch 容器启动约需 60-90s）
watch -n 10 "aws batch describe-jobs --region us-west-2 \
  --jobs ${JOB_ID} \
  --query 'jobs[0].{status:status,reason:statusReason}' \
  --output json"

# 3. 查看 CloudWatch 日志
LOG_STREAM=$(aws batch describe-jobs --region us-west-2 \
  --jobs ${JOB_ID} \
  --query 'jobs[0].container.logStreamName' --output text)
aws logs get-log-events --region us-west-2 \
  --log-group-name /aws/batch/job \
  --log-stream-name "${LOG_STREAM}" \
  --query 'events[*].message' --output text

# 4. 查询 DynamoDB 结果（通过 API）
curl -s "${API_URL}/detections?hostname=www.k9reproduction.com" | python3 -m json.tool
```

### DynamoDB 直查

```bash
aws dynamodb query --region us-west-2 \
  --table-name payment-detection-jobs \
  --key-condition-expression "pk = :h" \
  --expression-attribute-values '{":h":{"S":"www.k9reproduction.com"}}' \
  --query 'Items[*].{status:status.S,jobId:jobId.S,entities:entityCount.N}' \
  --output json
```

---

## Dockerfile 关键设计点

```
Builder stage:  node:22-bookworm  (有 tsc，编译 TypeScript)
Runtime stage:  public.ecr.aws/lambda/nodejs:22  (AL2023，内置 Lambda RIC)
  ├── dnf install <chromium 系统依赖>       ← AL2023 不支持 apt-get
  ├── PLAYWRIGHT_BROWSERS_PATH=/ms-playwright ← 固定浏览器路径，避免 Lambda
  │                                            沙盒用户主目录找不到的问题
  ├── npm ci --omit=dev
  ├── playwright install chromium
  └── COPY --from=builder /app/dist ./dist
CMD ["dist/aws/batch-runner.js"]            ← Fargate/Batch 默认入口
  (Lambda 通过 CDK imageConfig.cmd 覆盖为 dist/aws/lambda-handler.handler)
```

### Lambda Chromium 启动 flags

Lambda 沙盒禁止进程 fork，必须加：

```
--single-process   ← 禁止 Chrome 多进程（Lambda 内 fork 会崩溃）
--no-zygote        ← 禁用 zygote 子进程
--no-sandbox
--disable-setuid-sandbox
--disable-dev-shm-usage
--disable-gpu
```

Batch/Fargate 环境无此限制，`batch-runner.ts` 不加 `--single-process`。
