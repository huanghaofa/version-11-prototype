# 执行步骤

> 每个步骤都必须小到可以独立实现、验证和修复。不要把不确定需求写成已确认任务。

## Step 01: 初始化项目骨架

### Goal

建立静态原型项目的基础结构和运行入口。

### Files

- `index.html`
- `assets/css/global.css`
- `assets/css/app.css`
- `js/app.js`
- `js/common.js`
- `js/nav.js`
- `mock/data.js`
- `config/nav.json`

### Inputs

- `docs/requirements.md`
- `docs/decisions.md`
- `memory/project.md`

### Work

- 确认入口页面、基础样式、导航配置和 Mock 数据已接入。
- 保持无构建步骤的静态前端结构。

### Acceptance

- `index.html` 可以通过本地 HTTP 服务打开。
- 页面无阻塞级控制台错误。
- 本地资源路径有效。
- 导航容器存在。

### Verification

- 运行本地 HTTP 服务并打开入口页。
- 检查控制台错误和本地资源加载状态。

### Dependencies

- None

### Failure Handling

- 如果资源路径失败，修复 HTML 中的 `src` / `href`。
- 如果脚本语法失败，先修复 JS 语法再继续。

## Step 02: 后台兑换券

- Files: `js/pages/admin-list.js`, `js/pages/admin-create.js`, `mock/data.js`
- Acceptance: 列表结构符合 SIT；新商城兑换券分支展示商品与数量配置。
- Status: Completed and verified.

## Step 03: 用户端兑换主链路

- Files: `js/pages/mobile-flow.js`
- Acceptance: 详情、选品、券实例VIN自动带入、确认、成功后已核销状态可走通。
- Status: Completed and verified.

## Step 04: 系统边界

- Files: `js/pages/interfaces.js`
- Acceptance: 卡券中心、商城、车联网职责与成功顺序清晰。
- Status: Completed and verified.

## Step 05: 全局验收

- Acceptance: JS 语法通过、核心资源 200、导航与关键交互可用。
- Status: Completed and verified.

## Step 06: 后台N选M规则

- Files: `js/pages/admin-create.js`, `mock/data.js`
- Acceptance: 可切换固定组合/N选M；默认展示5个候选商品、每券选2件、同SKU最多2件。
- Verification skill: `prototype-verifier`.
- Status: Completed and verified.

## Step 07: 完整前台原型

- Files: `js/pages/mobile-home.js`, `js/pages/mobile-flow.js`, `assets/css/app.css`, `config/nav.json`, `config/nav.js`, `index.html`
- Acceptance: 卡券中心→券详情→5选2→商品详情→直接确认→成功可走通，确认页只读展示券实例VIN。
- Verification skill: `prototype-verifier` and browser interaction checks.
- Status: Completed and verified.

## Step 08: 已核销卡券兑换详情

- Files: `mock/data.js`, `js/pages/mobile-home.js`, `js/pages/mobile-record.js`, `assets/css/app.css`, `config/nav.json`, `config/nav.js`, `index.html`.
- Acceptance: 我的卡券展示已核销兑换券；点击进入只读兑换详情并完整展示兑换与履约快照。
- Verification skill: `prototype-verifier` and browser interaction checks.
- Status: Completed and verified.

## Step 09: 券实例VIN与零库存限制

- Files: `mock/data.js`, `js/pages/mobile-home.js`, `js/pages/mobile-flow.js`, `js/pages/interfaces.js`, `assets/css/app.css`及对应需求与验收文档。
- Acceptance: 前台无选车页面；选品后直接确认并只读展示券实例车辆/VIN；库存为0的商品置灰、增加按钮禁用且不计入已选件数。
- Verification skill: `prototype-verifier` and browser interaction checks.
- Status: Completed and verified.

## Step 10: 全商城商品与履约配置

- Files: `mock/data.js`, `js/pages/admin-create.js`, `assets/css/app.css`。
- Acceptance: 商品池包含车联网、实物和到店服务；商品弹窗支持供应商筛选。（本步骤原按商品履约下拉，已被 Step 15 的整券单一履约规则替代。）
- Verification skill: `prototype-verifier` and browser interaction checks.
- Status: Completed and verified.

## Step 11: 后台兑换券履约表单

- Files: `js/pages/admin-fulfillment.js`, `mock/data.js`, `config/nav.json`, `config/nav.js`, `index.html`, `assets/css/app.css`。
- Acceptance: 可按兑换单号、履约方式、状态和供应商查询；履约单详情展示逐商品状态，以及物流单或核销信息。
- Verification skill: `prototype-verifier` and browser interaction checks.
- Status: Completed and verified.

## Step 12: 兑换即核销与前台履约查询

- Files: `js/pages/mobile-home.js`, `js/pages/mobile-flow.js`, `js/pages/mobile-record.js`, `js/pages/mobile-fulfillment.js`, `mock/data.js`, `assets/css/app.css`。
- Acceptance: 确认兑换后立即显示卡券已核销；可进入兑换单履约页；三类履约状态按商品展示；失败弹窗联系客服；直邮可查物流。
- Verification skill: `prototype-verifier`, `playwright-cli`, and completion gate.
- Status: Completed and verified.

## Step 13: 规则与接口同步

- Files: `js/pages/overview.js`, `js/pages/interfaces.js`, `docs/*`, `memory/*`, `annotations/annotations.js`。
- Acceptance: 页面说明、接口顺序、状态枚举和验收文档与实现一致，不保留“履约成功后核销”“仅车联网履约”等旧口径。
- Verification skill: `prototype-verifier` and residual keyword checks.
- Status: Completed and verified.

## Step 14: 商品选择全选与分页

- Files: `js/pages/admin-create.js`, `assets/css/app.css`, `annotations/annotations.js`, `docs/requirements.md`, `memory/*`。
- Acceptance: 商品选择弹窗每页展示5条；可一键全选/取消当前页；翻页或筛选后已选商品不丢失；页面展示筛选结果总数、当前页和已选数量。
- Verification skill: `prototype-verifier`, browser DOM and interaction checks, completion gate.
- Status: Completed and verified.

## Step 15: 单一履约与商品级兑换上限

- Files: `mock/data.js`, `js/app.js`, `js/pages/admin-create.js`, `js/exchange-flow-core.js`。
- Acceptance: 整券履约方式下拉只能保存一个值；商品弹窗只展示兼容商品；切换履约方式会提示并移除不兼容商品；N选M的每个候选商品可单独配置最大兑换数量。
- Verification skill: `prototype-verifier`, browser DOM and interaction checks.
- Status: Completed and verified.

## Step 16: 到店核销与直邮商城下单

- Files: `js/pages/mobile-home.js`, `js/pages/mobile-flow.js`, `js/pages/mobile-store-code.js`, `js/pages/mobile-mall-order.js`, `js/pages/mobile-current-record.js`, `assets/css/app.css`, `config/nav.*`, `index.html`。
- Acceptance: 三张示例券分别使用单一履约；到店券选门店页面只读展示券实例车辆与VIN，按省市门店后选品并展示核销码；直邮券选品后进入商城确认订单，支持选择/新增地址，成功回跳后核销，失败不核销。
- Verification skill: `prototype-verifier`, browser interaction checks, completion gate.
- Status: Completed and verified.

## Step 17: 选门店页展示只读 VIN

- Files: `js/pages/mobile-flow.js`, `assets/css/app.css`, `docs/requirements.md`, `docs/interaction.html`, `annotations/annotations.js`, `memory/*`。
- Acceptance: 到店券进入“选择门店”步骤时展示券实例绑定车型、车牌和 VIN；卡片无输入框、下拉或按钮，不提供选车/换车能力；选择省、市、门店时车辆信息保持不变。
- Verification skill: `prototype-verifier`, browser DOM and interaction checks, completion gate.
- Status: Completed and verified.

## Step 18: 商品文件导入与模板下载弹窗

- Files: `js/pages/admin-create.js`, `assets/css/app.css`, `docs/requirements.md`, `docs/interaction.html`, `annotations/annotations.js`, `memory/*`。
- Acceptance: 点击上传文件展示追加/覆盖、Excel约束、SKU编码、商品名称、当前模式数量字段、供应商编码和模拟校验结果；点击下载模板展示模板版本、当前整券履约方式、兑换方式、字段规则和示例行；模板不提供商品级履约方式字段。
- Verification skill: `prototype-verifier`, browser DOM and interaction checks, completion gate.
- Status: Completed and verified.

## Step 19: 商品下钻到 SKU/规格并回显

- Files: `mock/data.js`, `js/pages/admin-create.js`, `assets/css/app.css`, `docs/*`, `annotations/annotations.js`, `memory/*`。
- Acceptance: 商品选择第一层按SPU分页和筛选；可进入规格弹窗选择一个或多个SKU；数量上限按SKU保存；提交后回显商品、规格与SKU编码；本页全选和翻页保留SKU选择状态。
- Verification skill: `prototype-verifier`, browser DOM and interaction checks, completion gate.
- Status: Implemented, pending verification.

## Step 20: 生成可直接打开的单文件静态原型

- Files: `scripts/build-standalone.mjs`, `../通用兑换券静态原型_20260810.html`, `memory/*`。
- Acceptance: CSS、Mock、导航、页面脚本与标注运行时全部内嵌；不包含外部CSS/JS引用；导航不请求JSON；双击HTML即可运行。
- Verification skill: Node内嵌脚本语法检查、外部资源残留检查、构建产物检查。
- Status: Completed and verified.
