// ─── Types ────────────────────────────────────────────────────────────────────
export type Lang = 'en' | 'zh'
export type Tab = 'flow' | 'paths' | 'signals' | 'confidence' | 'matrix' | 'statemachine' | 'output'

// ─── Tab titles ───────────────────────────────────────────────────────────────
export const TAB_TITLES: Record<Tab, { en: string; zh: string }> = {
  flow:         { en: '🔄 Detection Flow',        zh: '🔄 检测总流程' },
  paths:        { en: '🛣️ Four Detection Paths',  zh: '🛣️ 四大检测路径' },
  signals:      { en: '📡 Signal Types',           zh: '📡 信号类型' },
  confidence:   { en: '🎯 Confidence Rules',       zh: '🎯 置信度规则' },
  matrix:       { en: '📊 Availability Matrix',   zh: '📊 可用性矩阵' },
  statemachine: { en: '🤖 State Machine',          zh: '🤖 状态机导航' },
  output:       { en: '📁 Output Files',           zh: '📁 输出文件' },
}

export const TABS: { id: Tab; icon: string; label: { en: string; zh: string } }[] = [
  { id: 'flow',         icon: '🔄', label: { en: 'Detection Flow',         zh: '检测总流程' } },
  { id: 'paths',        icon: '🛣️', label: { en: 'Four Detection Paths',   zh: '四大检测路径' } },
  { id: 'signals',      icon: '📡', label: { en: 'Signal Types',            zh: '信号类型' } },
  { id: 'confidence',   icon: '🎯', label: { en: 'Confidence Rules',        zh: '置信度规则' } },
  { id: 'matrix',       icon: '📊', label: { en: 'Availability Matrix',    zh: '可用性矩阵' } },
  { id: 'statemachine', icon: '🤖', label: { en: 'State Machine',           zh: '状态机导航' } },
  { id: 'output',       icon: '📁', label: { en: 'Output Files',            zh: '输出文件' } },
]

// ─── Data constants ───────────────────────────────────────────────────────────
export const SIGNAL_DATA = [
  { via: 'request-url', source: 'network', conf: 'high/medium', vis: false, raw: '[POST] https://api.stripe.com/v1/payment_intents' },
  { via: 'response-json', source: 'network', conf: 'high', vis: false, raw: 'payment_method_types: card, us_bank_account' },
  { via: 'html-script-src (network)', source: 'network', conf: 'medium', vis: false, raw: 'https://js.stripe.com/v3/' },
  { via: 'html-text', source: 'html', conf: 'low', vis: false, raw: '…publishableKey:"pk_live_xxx",stripe.js/v3…' },
  { via: 'html-script-src (DOM)', source: 'html', conf: 'medium', vis: false, raw: 'https://js.stripe.com/v3/' },
  { via: 'html-radio', source: 'html', conf: 'high', vis: true, raw: '<input type="radio" value="stripe" id="…">' },
  { via: 'html-radio-label', source: 'html', conf: 'medium', vis: true, raw: 'Credit / Debit Card (Stripe)' },
  { via: 'html-logo', source: 'html', conf: 'medium', vis: true, raw: '<img src="…stripe-logo.svg" alt="Stripe">' },
  { via: 'html-attribute', source: 'html', conf: 'medium', vis: true, raw: '<li class="payment-method" data-gateway="stripe">' },
]

export const STATES_DATA = [
  { code: 'PRODUCT_PAGE', desc: { en: 'Product page, no ATC success signal yet', zh: '产品页，尚无 ATC 成功信号' }, terminal: null, cls: 'neutral' },
  { code: 'PRODUCT_PAGE_ATC_DONE', desc: { en: 'Product page, ATC success indicator shown', zh: '产品页，已出现 ATC 成功提示' }, terminal: null, cls: 'neutral' },
  { code: 'CART_PAGE', desc: { en: 'Cart URL + cart item present', zh: '购物车 URL + 存在购物车商品' }, terminal: null, cls: 'neutral' },
  { code: 'CART_EMPTY', desc: { en: 'Cart URL but no items', zh: '购物车 URL 但无商品' }, terminal: { en: '❌ Terminal (fail)', zh: '❌ 终止失败' }, cls: 'fail' },
  { code: 'CHECKOUT_PAGE', desc: { en: 'Checkout URL, payment options not yet visible', zh: '结账 URL，支付选项尚未可见' }, terminal: null, cls: 'neutral' },
  { code: 'CHECKOUT_PAYMENT_STEP', desc: { en: 'Checkout URL + payment options visible — recorded as navFinalState on success', zh: '结账 URL + 支付选项可见 — 成功时记录为 navFinalState' }, terminal: { en: '✅ Terminal (success)', zh: '✅ 终止成功' }, cls: 'success' },
  { code: 'SIGN_IN_WALL', desc: { en: 'Login required', zh: '需要登录' }, terminal: { en: '❌ Terminal (fail)', zh: '❌ 终止失败' }, cls: 'fail' },
  { code: 'BLOCKED_MODAL', desc: { en: 'Age verification / cookie popup (disabled)', zh: '年龄验证 / Cookie 弹窗（已禁用）' }, terminal: { en: '⚠️ Disabled', zh: '⚠️ 禁用' }, cls: 'warn' },
  { code: 'UNKNOWN', desc: { en: 'None of the above match', zh: '以上均不匹配' }, terminal: null, cls: 'neutral' },
]

export const TRANSITIONS_DATA = [
  { state: 'PRODUCT_PAGE', t1: ['clickCheckout', 'clickViewCart'], t2: ['directCart', 'directCheckout'] },
  { state: 'PRODUCT_PAGE_ATC_DONE', t1: ['clickCheckout', 'clickViewCart'], t2: ['directCart', 'directCheckout'] },
  { state: 'CART_PAGE', t1: ['fillContact', 'clickCheckout'], t2: ['directCheckout'] },
  { state: 'CHECKOUT_PAGE', t1: ['fillContact', 'advanceCheckoutStep'], t2: [] },
  { state: 'UNKNOWN', t1: ['clickCheckout', 'clickViewCart'], t2: ['directCart', 'directCheckout'] },
  { state: 'BLOCKED_MODAL', t1: ['dismissModal'], t2: [] },
]

export const QUERIES_DATA = [
  { q: { en: 'Which payment methods are available?', zh: '当前哪些支付方式可用？' }, filter: 'available=true' },
  { q: { en: 'Gateways detected with high confidence?', zh: '高置信度检测到的网关？' }, filter: 'confidence=high' },
  { q: { en: 'Integrated but not visible to user?', zh: '已集成但用户不可见？' }, filter: 'available=false AND confidence=high' },
  { q: { en: 'Filter noise, only valuable signals?', zh: '过滤噪音，只要有价值的？' }, filter: 'confidence != low' },
  { q: { en: 'Is the gateway actually activated?', zh: '网关是否被实际激活？' }, filter: 'signals contains via=response-json or via=request-url(api)' },
  { q: { en: 'Supports Visa but not PayPal?', zh: '支持 Visa 但不支持 PayPal？' }, filter: 'name∈[Visa,MC] AND available=true; PayPal not in list' },
]

export const OUTPUT_FILES = [
  { icon: '📋', name: 'result-summary.json', desc: { en: 'All DetectedEntity + metadata + navFinalState / navBlockReason', zh: '所有 DetectedEntity + 元数据 + navFinalState / navBlockReason' }, detail: { en: 'Contains each detected gateway entity, all signals, confidence, availability, unavailableReason, and checkout nav fields: navFinalState (last PageState reached) and navBlockReason (failure reason, if any).', zh: '包含每个检测到的网关实体、所有信号、置信度、可用性、unavailableReason，以及结账导航字段：navFinalState（最终到达的 PageState）和 navBlockReason（失败原因，如有）。' } },
  { icon: '🗂️', name: 'entities.json', desc: { en: 'Structured entity list', zh: '结构化实体列表' }, detail: { en: 'Structured array of gateway entities, easy for programmatic consumption.', zh: '网关实体的结构化数组，便于程序化消费。' } },
  { icon: '🌐', name: 'network-log.json', desc: { en: 'Network signals + full request list', zh: '网络信号 + 完整请求列表' }, detail: { en: 'All captured network request URLs, plus payment gateway signals detected from network paths.', zh: '所有捕获的网络请求 URL，以及从网络路径中检测到的支付网关信号。' } },
  { icon: '📊', name: 'evidence.csv', desc: { en: 'One signal record per row', zh: '每行一条信号记录' }, detail: { en: 'CSV format, each row represents a unique payment signal including via, gateway, rawValue, visible fields.', zh: 'CSV 格式，每行代表一个唯一的支付信号，包含 via、gateway、rawValue、visible 等字段。' } },
  { icon: '🖥️', name: 'payment-page.html', desc: { en: 'Full page HTML dump', zh: '完整页面 HTML 转储' }, detail: { en: 'Complete HTML snapshot of the checkout payment page.', zh: '结账支付页的完整 HTML 快照，用于离线分析和调试。' } },
  { icon: '📸', name: 'payment-page.png', desc: { en: 'Full-page screenshot', zh: '全页截图' }, detail: { en: 'fullPage:true screenshot recording the visual state of the payment page.', zh: 'fullPage:true 截图，记录支付页面的视觉状态。' } },
]

export const RR_STEPS = [
  { id: 'rr-fill', label: 'fillContactInfo', maxTries: 'maxTries:1' },
  { id: 'rr-checkout', label: 'clickCheckout', maxTries: 'maxTries:3' },
  { id: 'rr-cart', label: 'clickViewCart', maxTries: 'maxTries:3' },
  { id: 'rr-advance', label: 'advanceStep', maxTries: 'maxTries:5' },
]

export const MODALS: Record<string, { title: { en: string; zh: string }; body: string }> = {
  init: {
    title: { en: '🔌 Init — Register Network Listeners', zh: '🔌 初始化 — 注册网络监听器' },
    body: `<h4><span class="t-en">Key Rule</span><span class="t-zh">关键规则</span></h4><p><span class="t-en">All listeners must be registered <strong>before</strong> <code>goto()</code>, otherwise network requests from the initial page load will be missed.</span><span class="t-zh">所有监听器必须在 <code>goto()</code> <strong>之前</strong> 注册，否则初始页面加载的网络请求会被遗漏。</span></p><h4><span class="t-en">Registered Listeners</span><span class="t-zh">注册的监听器</span></h4><ul><li><code>browser.newContext()</code> — <span class="t-en">custom UA, isolated session</span><span class="t-zh">自定义 UA，独立会话</span></li><li><code>page.on('request')</code> — <span class="t-en">log all URLs + run URL scan</span><span class="t-zh">记录所有 URL + 运行 URL 扫描</span></li><li><code>context.on('page')</code> — <span class="t-en">auto-hook new tabs, track activePage</span><span class="t-zh">自动 hook 新 Tab，追踪 activePage</span></li><li><code>attachResponseListener()</code> — <span class="t-en">response JSON scan (Path 4)</span><span class="t-zh">响应 JSON 扫描（Path 4）</span></li></ul>`
  },
  step1: { title: { en: 'Step 1 — Load Product Page', zh: '步骤 1 — 加载产品页' }, body: `<p><code>page.goto(productUrl, { waitUntil: 'domcontentloaded' })</code></p><p><span class="t-en">Immediately after loading, calls <code>dismissModals()</code> to close popups and clear the stage for subsequent actions.</span><span class="t-zh">加载后立即调用 <code>dismissModals()</code> 关闭弹出框，为后续操作清场。</span></p>` },
  step2: { title: { en: 'Step 2 — Select Available Variant', zh: '步骤 2 — 选择在售变体' }, body: `<h4><span class="t-en">Supported Control Types</span><span class="t-zh">支持的控件类型</span></h4><ul><li><code>&lt;select&gt;</code> <span class="t-en">dropdown — skip options containing "sold out"</span><span class="t-zh">下拉框 — 跳过含 "sold out" 的选项</span></li><li><span class="t-en">Radio button — skip .disabled or .out-of-stock</span><span class="t-zh">Radio 单选 — 跳过 .disabled 或 .out-of-stock</span></li><li><span class="t-en">Color/size swatch — skip disabled styles</span><span class="t-zh">颜色/尺码 swatch — 跳过禁用样式</span></li></ul><p><span class="t-en">An in-stock variant must be selected for the ATC step to succeed.</span><span class="t-zh">必须选择在售变体，才能成功加入购物车。</span></p>` },
  step3: { title: { en: 'Step 3 — Add to Cart (ATC)', zh: '步骤 3 — 加入购物车 (ATC)' }, body: `<h4><span class="t-en">Selector Compatibility Strategy</span><span class="t-zh">选择器兼容策略</span></h4><p><span class="t-en">Tries multiple selector sets, compatible with WooCommerce, Shopify, Wix and other major platforms.</span><span class="t-zh">尝试多套选择器，兼容 WooCommerce、Shopify、Wix 等主流平台。</span></p><ul><li><span class="t-en">Skip disabled / "sold out" buttons</span><span class="t-zh">跳过 disabled / "sold out" 按钮</span></li><li><span class="t-en">Watch for new Tab (Shopify may open checkout inline)</span><span class="t-zh">监听新 Tab（Shopify 可能内联打开结账页）</span></li></ul>` },
  step5: { title: { en: 'Step 5 — Select Card Payment Option', zh: '步骤 5 — 选择卡支付选项' }, body: `<h4><span class="t-en">Main Path: iteratePaymentOptions()</span><span class="t-zh">主路径：iteratePaymentOptions()</span></h4><ol><li><span class="t-en">waitForPaymentUI (3s) — internal wait</span><span class="t-zh">waitForPaymentUI (3s) — 内部等待</span></li><li><span class="t-en">Find all payment radio buttons</span><span class="t-zh">找到所有支付 radio 按钮</span></li><li><span class="t-en">Click each → invoke collectEvidence() callback</span><span class="t-zh">逐个点击 → 调用 collectEvidence() 回调</span></li></ol><h4><span class="t-en">Fallback Path (iterCount = 0)</span><span class="t-zh">回退路径（iterCount = 0）</span></h4><p><span class="t-en">For tile/tab-style UI: calls <code>selectCardPaymentOption()</code> (broader selector set)</span><span class="t-zh">针对 tile/tab 样式 UI：调用 <code>selectCardPaymentOption()</code>（更宽泛的选择器集）</span></p>` },
  step6: { title: { en: 'Step 6 — Collect Evidence (Always Runs)', zh: '步骤 6 — 收集证据（始终执行）' }, body: `<p><span class="t-en">Regardless of Step 5's outcome, Step 6 <strong>always</strong> runs to guarantee at least one complete scan.</span><span class="t-zh">无论 Step 5 结果如何，Step 6 <strong>始终</strong>执行，保证至少一次完整扫描。</span></p><h4><span class="t-en">collectEvidence() Internal Structure</span><span class="t-zh">collectEvidence() 内部结构</span></h4><ul><li><code>collectAllHtml()</code> — <span class="t-en">activePage.content() + all frames + all open tabs</span><span class="t-zh">activePage.content() + 所有 frame + 所有开放 Tab</span></li><li><code>matchSignaturesInHtml()</code> — <span class="t-en">HTML regex scan (Path 2)</span><span class="t-zh">HTML 正则扫描（Path 2）</span></li><li><code>scanDomForEntities()</code> — <span class="t-en">precise DOM query (Path 3)</span><span class="t-zh">精准 DOM 查询（Path 3）</span></li></ul><p><span class="t-en">Finally takes a full-page screenshot (fullPage: true).</span><span class="t-zh">最后截取全页截图（fullPage: true）。</span></p>` },
  finalise: { title: { en: '🧮 finaliseEntities()', zh: '🧮 finaliseEntities()' }, body: `<h4><span class="t-en">Two-Step Processing</span><span class="t-zh">两步处理</span></h4><ol><li><strong>deriveAvailability()</strong> — <span class="t-en">derive the available state from the visible field of DOM signals</span><span class="t-zh">根据 DOM 信号的 visible 字段推导 available 状态</span></li><li><strong><span class="t-en">Sort</span><span class="t-zh">排序</span></strong> — <span class="t-en">descending by confidence (high &gt; medium &gt; low), then by signal count</span><span class="t-zh">先按 confidence 降序（high &gt; medium &gt; low），再按信号数量降序</span></li></ol>` },
  path1: { title: { en: 'Path 1 — Network Request URL Listener', zh: 'Path 1 — 网络请求 URL 监听' }, body: `<h4><span class="t-en">How it works</span><span class="t-zh">工作原理</span></h4><p><span class="t-en">Processes every network request in real time inside the <code>page.on('request')</code> and <code>context.on('page')</code> callbacks.</span><span class="t-zh">在 <code>page.on('request')</code> 和 <code>context.on('page')</code> 的回调中实时处理每条网络请求。</span></p><h4><span class="t-en">What it writes</span><span class="t-zh">写入内容</span></h4><ul><li><code>allNetworkUrls.push()</code> — <span class="t-en">written to network-log.json</span><span class="t-zh">写入 network-log.json</span></li><li><code>matchSignaturesInUrl()</code> — <span class="t-en">matches networkPatterns → via: 'request-url'</span><span class="t-zh">匹配 networkPatterns → via: 'request-url'</span></li><li><span class="t-en">matches scriptPatterns → via: 'html-script-src'</span><span class="t-zh">匹配 scriptPatterns → via: 'html-script-src'</span></li></ul><p><span class="t-en">Auto-hooks all newly opened tabs; captures from the first byte of page load.</span><span class="t-zh">自动 hook 所有新开 Tab，从页面加载第一个字节起捕获。</span></p>` },
  path2: { title: { en: 'Path 2 — Full-Page HTML Regex Scan', zh: 'Path 2 — 全页面 HTML 正则扫描' }, body: `<h4><span class="t-en">Data Sources</span><span class="t-zh">数据来源</span></h4><ul><li><span class="t-en">activePage.content() — current active page</span><span class="t-zh">activePage.content() — 当前活动页面</span></li><li><span class="t-en">Content of all activePage.frames()</span><span class="t-zh">所有 activePage.frames() 的内容</span></li><li><span class="t-en">All other open tabs (e.g. Wix checkout tab)</span><span class="t-zh">所有其他开放 Tab（如 Wix 结账 Tab）</span></li></ul><h4><span class="t-en">Match Rules</span><span class="t-zh">匹配规则</span></h4><p><span class="t-en">Each signature's htmlPatterns are matched one by one. On hit: rawValue = 80 chars before + 120 chars after the match, via: 'html-text'.</span><span class="t-zh">每个签名的 htmlPatterns 逐一匹配。命中时 rawValue = 匹配前 80 字符 + 匹配后 120 字符，via: 'html-text'。</span></p>` },
  path3: { title: { en: 'Path 3 — Precise DOM Query', zh: 'Path 3 — 精准 DOM 查询' }, body: `<h4><span class="t-en">Implementation</span><span class="t-zh">实现方式</span></h4><p><span class="t-en">Single page.evaluate() round-trip, batch executes all queries to reduce network overhead.</span><span class="t-zh">page.evaluate() 单次往返，批量执行所有查询，减少网络开销。</span></p><h4><span class="t-en">Query Types</span><span class="t-zh">查询类型</span></h4><ul><li><span class="t-en">Payment radio → via: 'html-radio' + 'html-radio-label'</span><span class="t-zh">支付 radio → via: 'html-radio' + 'html-radio-label'</span></li><li><span class="t-en">Payment logo image → via: 'html-logo'</span><span class="t-zh">支付 Logo 图片 → via: 'html-logo'</span></li><li><span class="t-en">data-gateway / data-payment-method attributes → via: 'html-attribute'</span><span class="t-zh">data-gateway / data-payment-method 属性 → via: 'html-attribute'</span></li><li>script[src] → via: 'html-script-src'</li></ul><h4><span class="t-en">Visibility Check</span><span class="t-zh">可见性检查</span></h4><p><span class="t-en">Calls <code>getComputedStyle</code> on each node, walks the ancestor chain to ensure the entire path is visible.</span><span class="t-zh">每个节点调用 <code>getComputedStyle</code>，逐级向上遍历祖先链，确保整条链路均可见。</span></p>` },
  path4: { title: { en: 'Path 4 — Response JSON Allowlist', zh: 'Path 4 — 响应 JSON 白名单' }, body: `<h4><span class="t-en">How it works</span><span class="t-zh">工作原理</span></h4><p><span class="t-en">context.on('response') listens in real time; after the response URL matches the allowlist, parses the JSON body and calls the signature's extract() function to extract {key, value}[] pairs, via: 'response-json'.</span><span class="t-zh">context.on('response') 实时监听，URL 匹配白名单后解析 JSON body，调用 extract() 函数提取 {key, value}[] 键值对，via: 'response-json'。</span></p><h4><span class="t-en">Why most authoritative?</span><span class="t-zh">为什么最权威？</span></h4><p><span class="t-en">response-json comes from the server's real payment configuration, directly reflecting the payment methods available in the current session.</span><span class="t-zh">response-json 来自服务端真实支付配置，直接反映当前会话可用的支付方式。</span></p>` },
  'cell-hh-t': { title: { en: '✅ HIGH × available=true — Confirmed Available', zh: '✅ HIGH × available=true — 已确认可用' }, body: `<h4><span class="t-en">Meaning</span><span class="t-zh">含义</span></h4><p><span class="t-en">The payment method was actually invoked (API request) and a visible, clickable DOM node exists. This is the strongest positive signal.</span><span class="t-zh">该支付方式被实际调用（API 请求）且 DOM 中存在可见可点击的节点。这是最强的正面信号。</span></p><h4><span class="t-en">Typical Cases</span><span class="t-zh">典型场景</span></h4><ul><li><span class="t-en">Stripe main payment flow</span><span class="t-zh">Stripe 主支付流程</span></li><li><span class="t-en">PayPal button fully rendered</span><span class="t-zh">PayPal 按钮完全渲染</span></li></ul><h4><span class="t-en">Business Action</span><span class="t-zh">业务动作</span></h4><p><span class="t-en">Can be directly presented as "supports this payment method".</span><span class="t-zh">可直接展示为"支持该支付方式"。</span></p>` },
  'cell-hh-f': { title: { en: '⚠️ HIGH × available=false — Integrated but Hidden', zh: '⚠️ HIGH × available=false — 已集成但隐藏' }, body: `<h4><span class="t-en">Meaning</span><span class="t-zh">含义</span></h4><p><span class="t-en">High-confidence signal exists, but the DOM node is CSS-hidden (display:none or visibility:hidden).</span><span class="t-zh">有高置信度信号，但 DOM 节点被 CSS 隐藏（display:none 或 visibility:hidden）。</span></p><h4><span class="t-en">Typical Cases</span><span class="t-zh">典型场景</span></h4><ul><li><span class="t-en">Apple Pay (not rendered on non-Safari browsers)</span><span class="t-zh">Apple Pay（非 Safari 浏览器不渲染）</span></li><li><span class="t-en">Payment option hidden by A/B test</span><span class="t-zh">A/B 测试中隐藏的支付选项</span></li></ul><h4>unavailableReason</h4><p><span class="t-en">Typically <code>css-hidden</code> or <code>browser-unsupported</code>.</span><span class="t-zh">通常为 <code>css-hidden</code> 或 <code>browser-unsupported</code>。</span></p>` },
  'cell-md-t': { title: { en: '🟡 MEDIUM × available=true — Likely Available', zh: '🟡 MEDIUM × available=true — 可能可用' }, body: `<h4><span class="t-en">Meaning</span><span class="t-zh">含义</span></h4><p><span class="t-en">SDK loaded or Logo visible, but no actual API call captured and no radio node.</span><span class="t-zh">SDK 已加载或 Logo 可见，但未捕获到实际 API 调用，也无 radio 节点。</span></p><h4><span class="t-en">Typical Cases</span><span class="t-zh">典型场景</span></h4><ul><li><span class="t-en">Newly integrated gateway: SDK imported but checkout button not yet triggered</span><span class="t-zh">新接入的支付网关，SDK 已引入但结账按钮尚未触发</span></li></ul>` },
  'cell-md-f': { title: { en: '🔶 MEDIUM × available=false — Status Unclear', zh: '🔶 MEDIUM × available=false — 状态不明' }, body: `<h4><span class="t-en">Meaning</span><span class="t-zh">含义</span></h4><p><span class="t-en">Script tag exists (SDK loaded), but no visible payment DOM node on the page.</span><span class="t-zh">script 标签存在（SDK 已加载），但页面上没有可见的支付 DOM 节点。</span></p><h4><span class="t-en">Typical Cases</span><span class="t-zh">典型场景</span></h4><ul><li><span class="t-en">A/B test has disabled rendering of this payment option</span><span class="t-zh">A/B 测试关闭了该支付选项的渲染</span></li><li><span class="t-en">Conditional load whose condition hasn't triggered</span><span class="t-zh">条件性加载但当前条件未触发</span></li></ul>` },
  'cell-lw-t': { title: { en: '🔵 LOW × available=true — Weak Signal', zh: '🔵 LOW × available=true — 弱信号' }, body: `<h4><span class="t-en">Meaning</span><span class="t-zh">含义</span></h4><p><span class="t-en">HTML source regex match, DOM node happens to be visible, but may just be footer copy or third-party content.</span><span class="t-zh">HTML 源码正则匹配，DOM 节点碰巧可见，但可能只是 footer 文案或第三方内容。</span></p><h4><span class="t-en">Business Recommendation</span><span class="t-zh">业务建议</span></h4><p><span class="t-en">Use as a reference signal; not recommended as sole evidence of "supports this payment method".</span><span class="t-zh">作为参考信号，不建议单独作为"支持该支付方式"的依据。</span></p>` },
  'cell-lw-f': { title: { en: '❌ LOW × available=false — Low Value', zh: '❌ LOW × available=false — 低价值' }, body: `<h4><span class="t-en">Meaning</span><span class="t-zh">含义</span></h4><p><span class="t-en">The gateway is mentioned in source (e.g. comments, dead code), but neither rendered in the DOM nor generating any network requests.</span><span class="t-zh">源码中提到该网关（如注释、死代码），但既未渲染到 DOM 也未产生网络请求。</span></p><h4><span class="t-en">Business Recommendation</span><span class="t-zh">业务建议</span></h4><p><span class="t-en">Usually safe to filter out with <code>confidence != low</code>.</span><span class="t-zh">通常可过滤掉此类信号，用 <code>confidence != low</code> 过滤。</span></p>` },
  'file_0': { title: { en: '📋 result-summary.json', zh: '📋 result-summary.json' }, body: `<p><span class="t-en">Contains each detected gateway entity, all signals, confidence, availability and unavailableReason.</span><span class="t-zh">包含每个检测到的网关实体、所有信号、置信度、可用性及 unavailableReason。</span></p><h4><span class="t-en">Checkout Nav Fields</span><span class="t-zh">结账导航字段</span></h4><ul><li><code>navFinalState</code> — <span class="t-en">last <code>PageState</code> reached by <code>navigateToCheckoutSM</code>; <code>CHECKOUT_PAYMENT_STEP</code> on success, terminal failure state on <code>NavError</code></span><span class="t-zh"><code>navigateToCheckoutSM</code> 最终到达的 <code>PageState</code>；成功时为 <code>CHECKOUT_PAYMENT_STEP</code>，<code>NavError</code> 时为终止失败态</span></li><li><code>navBlockReason</code> — <span class="t-en">human-readable failure reason when <code>NavError</code> is thrown (e.g. <code>SIGN_IN_WALL</code>, <code>CART_EMPTY</code>, <code>EXHAUSTED</code>); <code>undefined</code> on success</span><span class="t-zh"><code>NavError</code> 抛出时的可读失败原因（如 <code>SIGN_IN_WALL</code>、<code>CART_EMPTY</code>、<code>EXHAUSTED</code>）；成功时为 <code>undefined</code></span></li></ul><h4><span class="t-en">Path</span><span class="t-zh">路径</span></h4><p>test-results/[test-name]/attachments/result-summary.json</p>` },
  'file_1': { title: { en: '🗂️ entities.json', zh: '🗂️ entities.json' }, body: `<p><span class="t-en">Structured array of gateway entities, easy for programmatic consumption.</span><span class="t-zh">网关实体的结构化数组，便于程序化消费。</span></p><h4><span class="t-en">Path</span><span class="t-zh">路径</span></h4><p>test-results/[test-name]/attachments/entities.json</p>` },
  'file_2': { title: { en: '🌐 network-log.json', zh: '🌐 network-log.json' }, body: `<p><span class="t-en">All captured network request URLs, plus payment gateway signals detected from network paths.</span><span class="t-zh">所有捕获的网络请求 URL，以及从网络路径中检测到的支付网关信号。</span></p><h4><span class="t-en">Path</span><span class="t-zh">路径</span></h4><p>test-results/[test-name]/attachments/network-log.json</p>` },
  'file_3': { title: { en: '📊 evidence.csv', zh: '📊 evidence.csv' }, body: `<p><span class="t-en">CSV format, each row represents a unique payment signal including via, gateway, rawValue, visible fields.</span><span class="t-zh">CSV 格式，每行代表一个唯一的支付信号，包含 via、gateway、rawValue、visible 等字段。</span></p><h4><span class="t-en">Path</span><span class="t-zh">路径</span></h4><p>test-results/[test-name]/attachments/evidence.csv</p>` },
  'file_4': { title: { en: '🖥️ payment-page.html', zh: '🖥️ payment-page.html' }, body: `<p><span class="t-en">Complete HTML snapshot of the checkout payment page, for offline analysis and debugging.</span><span class="t-zh">结账支付页的完整 HTML 快照，用于离线分析和调试。</span></p><h4><span class="t-en">Path</span><span class="t-zh">路径</span></h4><p>test-results/[test-name]/attachments/payment-page.html</p>` },
  'file_5': { title: { en: '📸 payment-page.png', zh: '📸 payment-page.png' }, body: `<p><span class="t-en">fullPage:true screenshot recording the visual state of the payment page.</span><span class="t-zh">fullPage:true 截图，记录支付页面的视觉状态。</span></p><h4><span class="t-en">Path</span><span class="t-zh">路径</span></h4><p>test-results/[test-name]/attachments/payment-page.png</p>` },
}

// ─── Chart data ───────────────────────────────────────────────────────────────
export const SOURCE_CHART_DATA = [
  { name: 'network signals', value: 3, fill: '#0071e3' },
  { name: 'html signals', value: 6, fill: '#5e2ca5' },
]

export const CONF_CHART_DATA = [
  { name: 'response-json', weight: 3, fill: '#1d7d45' },
  { name: 'html-radio', weight: 3, fill: '#1d7d45' },
  { name: 'request-url(api)', weight: 3, fill: '#1d7d45' },
  { name: 'request-url(cdn)', weight: 2, fill: '#8e6000' },
  { name: 'html-script-src', weight: 2, fill: '#8e6000' },
  { name: 'html-radio-label', weight: 2, fill: '#8e6000' },
  { name: 'html-logo', weight: 2, fill: '#8e6000' },
  { name: 'html-attribute', weight: 2, fill: '#8e6000' },
  { name: 'html-text', weight: 1, fill: '#86868b' },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────
export function tt(val: string | { en: string; zh: string }, lang: Lang): string {
  if (typeof val === 'string') return val
  return val[lang]
}

export const CONF_COLOR: Record<string, string> = {
  high: '#1d7d45', medium: '#8e6000', low: '#86868b', 'high/medium': '#8e6000'
}
