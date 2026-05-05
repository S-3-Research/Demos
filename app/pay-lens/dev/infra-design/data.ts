export type TabId = 'arch' | 'modes' | 'lifecycle' | 'stacks' | 'api' | 'schema' | 'deploy' | 'test' | 'docker' | 'src' | 'debug' | 'capacity'

export const TABS: { id: TabId; label: string }[] = [
  { id: 'arch',      label: 'Architecture' },
  { id: 'modes',     label: 'Execution Modes' },
  { id: 'lifecycle', label: 'Job Lifecycle' },
  { id: 'stacks',    label: 'CDK Stacks' },
  { id: 'api',       label: 'API Endpoints' },
  { id: 'schema',    label: 'DynamoDB Schema' },
  { id: 'deploy',    label: 'Deploy' },
  { id: 'test',      label: 'Testing' },
  { id: 'docker',    label: 'Dockerfile' },
  { id: 'src',       label: 'Source Structure' },
  { id: 'debug',     label: 'Debug Mode' },
  { id: 'capacity',  label: 'Capacity' },
]

export const CODE = {
  deployFull: `bash deploy.sh`,
  deployStack: `bash deploy.sh --stack-only`,
  deployLambda: `bash deploy.sh --lambda-only`,
  deployManual: `# 1. ECR login
aws ecr get-login-password --region us-west-2 \\
  | docker login --username AWS --password-stdin \\
    235134029580.dkr.ecr.us-west-2.amazonaws.com

# 2. Build both targets
docker build --platform linux/amd64 --target batch \\
  -t 235134029580.dkr.ecr.us-west-2.amazonaws.com/payment-detection:batch .
docker build --platform linux/amd64 --target lambda-runtime \\
  -t 235134029580.dkr.ecr.us-west-2.amazonaws.com/payment-detection:lambda .

# 3. Push + resolve digests
docker push 235134029580.dkr.ecr.us-west-2.amazonaws.com/payment-detection:batch
docker push 235134029580.dkr.ecr.us-west-2.amazonaws.com/payment-detection:lambda
IMAGE_DIGEST=$(aws ecr describe-images --region us-west-2 \\
  --repository-name payment-detection --image-ids imageTag=lambda \\
  --query 'imageDetails[0].imageDigest' --output text)
BATCH_DIGEST=$(aws ecr describe-images --region us-west-2 \\
  --repository-name payment-detection --image-ids imageTag=batch \\
  --query 'imageDetails[0].imageDigest' --output text)

# 4. CDK bootstrap (first time only)
cd infra &amp;&amp; npx cdk bootstrap

# 5. Deploy all stacks
npx cdk deploy --all \\
  --context "imageTag=${'{'}IMAGE_DIGEST{'}'}" \\
  --context "batchImageTag=${'{'}BATCH_DIGEST{'}'}" \\
  --require-approval never`,
  testPlaywright: `npm ci &amp;&amp; npx playwright install chromium
npx playwright test tests/checkout-gateway.spec.ts
# Debug with browser
npx playwright test tests/checkout-gateway.spec.ts --headed`,
  testDockerBatch: `docker build --platform linux/amd64 --target batch \\
  -t payment-detection:batch-local .
docker run --rm \\
  -e PRODUCT_URL="https://www.k9reproduction.com/product-page/wondfo-canine-progesterone-trilevel-qc-test-kit" \\
  payment-detection:batch-local`,
  testDockerLambda: `docker build --platform linux/amd64 --target lambda-runtime \\
  -t payment-detection:lambda-local .
docker run -d --rm -p 9000:8080 --name lambda-local payment-detection:lambda-local
curl -s -X POST \\
  "http://localhost:9000/2015-03-31/functions/function/invocations" \\
  -H "Content-Type: application/json" \\
  -d '{"url":"https://www.k9reproduction.com/product-page/wondfo-canine-progesterone-trilevel-qc-test-kit"}' \\
  | python3 -m json.tool
# Tail logs
docker logs -f lambda-local 2&gt;&amp;1 \\
  | grep -E "\\[state\\]|\\[atc\\]|\\[fill\\]|entities|Step [1-6]|✓|⛔"
docker stop lambda-local`,
  testE2eLambda: `aws lambda invoke \\
  --region us-west-2 \\
  --function-name payment-detector \\
  --payload '{"url":"https://www.k9reproduction.com/product-page/wondfo-canine-progesterone-trilevel-qc-test-kit"}' \\
  --cli-binary-format raw-in-base64-out \\
  --cli-read-timeout 120 \\
  /tmp/lambda-result.json \\
  &amp;&amp; cat /tmp/lambda-result.json | python3 -m json.tool`,
  testE2eBatch: `API_URL="https://dksxsk0f39.execute-api.us-west-2.amazonaws.com/v1"
# Submit
JOB_RESPONSE=$(curl -s -X POST "${'{'}API_URL{'}'}/jobs/submit" \\
  -H "Content-Type: application/json" \\
  -d '{"url":"https://www.k9reproduction.com/product-page/wondfo-canine-progesterone-trilevel-qc-test-kit"}')
JOB_ID=$(echo $JOB_RESPONSE | python3 -c "import sys,json; print(json.load(sys.stdin)['jobId'])")
echo "Job: $JOB_ID"
# Poll
watch -n 10 "aws batch describe-jobs --region us-west-2 \\
  --jobs ${'{'}JOB_ID{'}'} --query 'jobs[0].{'{'}status:status{'}'}' --output json"
# Fetch results
curl -s "${'{'}API_URL{'}'}/detections?hostname=www.k9reproduction.com" | python3 -m json.tool`,
}
