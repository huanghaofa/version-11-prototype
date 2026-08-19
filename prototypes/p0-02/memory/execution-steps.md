# 执行步骤

## Step 01：建立领域数据与导航骨架

### Goal

四个页面可从侧栏进入，页面使用统一的券模板、工单和核销 Mock 数据。

### Files

- `config/nav.json`
- `mock/data.js`
- `index.html`
- `js/common.js`
- `js/app.js`
- `js/nav.js`
- `assets/css/global.css`
- `assets/css/app.css`

### Acceptance

- 入口页可以打开。
- 四个导航项存在且可切换。
- Mock 数据与页面逻辑分离。

### Verification

- JavaScript 语法检查。
- 本地 HTTP 打开页面，检查导航、资源和控制台。

### Verification Skill

- `prototype-verifier`
- `playwright-cli`

### Dependencies

- None

## Step 02：实现新建/编辑卡券配置

### Goal

运营可以切换业务场景、适用类型、组合规则，逐项调整数量并保存草稿。

### Files

- `js/pages/coupon-create.js`
- `js/components/ui.js`
- `mock/data.js`
- `assets/css/app.css`

### Acceptance

- 维修保养/BIMC 显示多明细配置。
- 其他场景隐藏多明细配置。
- 可增删对象、调整数量、切换固定/可选组合。
- 优惠说明明确整券 100 元不按件数翻倍。

### Verification

- 浏览器点击和 DOM 状态检查。
- 检查保存提示与控制台。

### Verification Skill

- `prototype-verifier`
- `playwright-cli`

### Dependencies

- Step 01

## Step 03：实现试算与一次性批量核销

### Goal

核销端可以选择工单中的适用明细，获得优惠试算并一次性完成整单核销。

### Files

- `js/pages/redemption.js`
- `js/components/ui.js`
- `mock/data.js`
- `assets/css/app.css`

### Acceptance

- 不适用备件不能被勾选。
- 试算返回适用金额、优惠 100 元、应付金额和逐行分摊。
- 正式核销成功后展示核销流水。
- 重置演示可恢复未核销状态。

### Verification

- 浏览器完成“试算 → 确认核销 → 成功”路径。
- 验证数量、金额和分摊结果。

### Verification Skill

- `prototype-verifier`
- `playwright-cli`

### Dependencies

- Step 02

## Step 04：实现总览与核销记录

### Goal

评审者可以查看改造范围、系统边界和核销主从明细。

### Files

- `js/pages/overview.js`
- `js/pages/records.js`
- `mock/data.js`
- `assets/css/app.css`
- `docs/interaction.html`

### Acceptance

- 总览明确一次提交、整单校验、整券优惠。
- 核销记录可打开详情，明细优惠之和等于主记录优惠。
- 交互说明可从原型访问。

### Verification

- 页面导航、详情弹窗和金额一致性检查。

### Verification Skill

- `prototype-verifier`
- `playwright-cli`

### Dependencies

- Step 03

## Step 05：全局验证与交付整理

### Goal

完成全局路径、响应式、标注运行时兼容和交付文件检查。

### Files

- `memory/change-log.md`
- `memory/verification-log.md`
- `docs/interaction.html`

### Acceptance

- 所有步骤均有验证记录。
- 核心路径、桌面和窄屏布局可用。
- 无阻塞控制台错误和资源 404。
- 标注运行时不破坏业务交互。

### Verification Skill

- `prototype-verifier`
- `playwright-cli`
- `verification-before-completion`

### Dependencies

- Step 04

## Step 06：按指定任务原型重做页面基线

> 历史步骤：其中整券总数量口径已被 Step 07 删除，固定/可选组合口径已被 Step 10 的自由组合/分组组合替代，不作为当前验收标准。

### Goal

只读参照任务 `019f878b-b738-79f2-bb5b-d362dd57ff01` 的最终交付原型，把多备件配置嵌入完整卡券表单的“选择适用范围”位置。

### Files

- `index.html`
- `js/nav.js`
- `js/components/ui.js`
- `js/pages/coupon-create.js`
- `assets/css/app.css`
- `docs/requirements.md`
- `docs/decisions.md`

### Acceptance

- 具有参照原型同款窄图标栏、顶部工具栏、浅蓝模块页签、底部工作页签。
- 新建/编辑代金券保留基本信息、领取规则、核销规则、关联设置四区块和 26 行字段。
- 适用范围仍为备件、工时、精品、套餐单选。
- 选择备件后，在同一行下方可多选备件、逐项配置数量并设置整券最大核销数量。
- 核销端试算仍为 3 件、适用金额 550 元、优惠 100 元、应付 450 元。
- 参照原型关键文件校验值保持不变。

### Verification

- JavaScript 语法检查。
- 指定原型与当前原型浏览器截图对比。
- 浏览器完成备件多选、数量调整、优惠试算、一次核销、记录详情全链路。
- 对参照原型执行改造前后 SHA1 对比。

### Dependencies

- Step 05

## Step 07：收敛为建券配置原型

> 历史步骤：固定/可选组合表述已被 Step 10 更新，不作为当前组合方式命名。

### Goal

原型只展示卡券中心新增/编辑券的多对象逐项数量配置，不再展示优惠试算、外部核销端和核销明细改造。

### Files

- `index.html`
- `config/nav.json`
- `js/app.js`
- `js/nav.js`
- `js/pages/overview.js`
- `js/pages/coupon-create.js`
- `js/pages/redemption.js`（删除）
- `js/pages/records.js`（删除）
- `mock/data.js`
- `docs/requirements.md`
- `docs/decisions.md`
- `docs/interaction.html`
- `memory/*.md`

### Acceptance

- 原型导航和工作页签不再提供核销试算、外部核销端演示或改造后的核销记录页。
- 卡券中心顶部原“核销列表”名称保留，但不绑定本次新增页面和交互。
- 新建/编辑券仍可选择多个备件并逐项配置数量。
- 固定组合和可选组合均不显示额外的总数量字段。
- Mock 数据和说明文档不再包含 `maxTotalQty`、试算数据或核销明细数据。

### Verification

- 校验 JavaScript 和 JSON 语法。
- 通过本地 HTTP 打开原型，检查导航、建券交互、控制台和资源请求。
- 切换固定/可选组合，确认只改变逐项数量语义，不出现总数量字段。
- 搜索已删除字段和页面引用，确认无残留。

### Verification Skill

- `prototype-verifier`
- `playwright-cli`
- `verification-before-completion`

### Dependencies

- Step 06

## Step 08：补充 E3S 多备件联动说明

### Goal

在不新增独立 E3S 页面、优惠试算页和核销记录改造的前提下，通过总览和功能说明表达 E3S 一次提交多备件、卡券中心整体校验的跨系统边界。

### Verification Skill

- `prototype-verifier`
- `verification-before-completion`

### Dependencies

- Step 07

## Step 09：实现组合折扣券与多核销组合

### Goal

运营在新建/编辑券时选择“组合折扣券”，配置券级共用折扣和多个核销组合；每组商品全部满足最低数量后才能核销，超量部分不优惠。

### Files

- `mock/data.js`
- `js/pages/coupon-create.js`
- `js/pages/overview.js`
- `assets/css/app.css`
- `index.html`
- `docs/requirements.md`
- `docs/decisions.md`
- `docs/interaction.html`
- `memory/*.md`

### Acceptance

- 卡券分类新增组合折扣券，其他券类型不展示多备件组合配置。
- 默认展示组合一 A+B、组合二 C，所有组合共用 8 折。
- 可新增/删除组合、选择商品和调整最低核销数量。
- 同一商品可以出现在多个组合，同一组合不能重复，商品集合相同的组合被拦截。
- 页面明确组内同时核销、组间任选一、实际数量可多不可少、超量不优惠。
- 原核销列表、优惠试算和独立 E3S 页面继续不在原型范围内。

### Verification

- JavaScript 与 JSON 静态检查。
- 浏览器切换普通券/组合折扣券并检查条件联动。
- 新增组合、跨组复用商品、调整最低数量、提交和重复组合拦截。
- 检查桌面布局、控制台、资源请求和说明文档。

### Verification Skill

- `prototype-verifier`
- `playwright-cli`
- `verification-before-completion`

### Dependencies

- Step 08

## Step 10：恢复自由组合并收敛固定组合

### Goal

组合折扣券提供自由组合和分组组合两种方式；分组组合只配置一组时覆盖原固定组合，页面不再单列固定组合。

### Files

- `mock/data.js`
- `js/pages/coupon-create.js`
- `js/pages/overview.js`
- `assets/css/app.css`
- `docs/requirements.md`
- `docs/decisions.md`
- `docs/interaction.html`
- `memory/*.md`

### Acceptance

- 组合方式清晰展示“自由组合”和“分组组合”，默认分组组合。
- 自由组合可手工选择商品、调整最大核销数量、删除商品并提交。
- 分组组合保留多组任选一和组内全部满足；仅一组时页面明确等同原固定组合。
- 切换组合方式不会丢失另一种方式已配置的演示数据。
- 不出现独立固定组合、固定组合总数量或整券最大核销数量字段。

### Verification

- JavaScript 语法检查。
- 浏览器切换两种组合方式，分别调整数量、选品、删除并提交。
- 检查 DOM 文案和不存在的废弃字段。

### Verification Skill

- `prototype-verifier`
- `playwright-cli`
- `verification-before-completion`

### Dependencies

- Step 09

## Step 11：实现 Excel 批量上传商品

### Goal

运营可按当前组合方式下载对应 Excel 模板，选择 Excel 文件，查看行级校验结果，并以追加或覆盖方式导入校验通过的商品。

### Files

- `assets/templates/组合折扣券_分组组合商品导入模板.xlsx`
- `assets/templates/组合折扣券_自由组合商品导入模板.xlsx`
- `mock/data.js`
- `js/pages/coupon-create.js`
- `assets/css/app.css`
- `docs/interaction.html`
- `annotations/annotations.js`
- `memory/*.md`

### Acceptance

- 当前组合方式展示匹配的 Excel 上传和模板下载入口。
- 两个 `.xlsx` 模板可下载且字段与页面说明一致。
- 选择文件后展示文件名、总行数、成功数、失败数及错误原因。
- 支持追加和覆盖；确认后配置区同步更新，并显示导入成功反馈。
- Excel 导入不改变现有手工选品能力。

### Verification

- 校验两个工作簿内容与格式并进行渲染检查。
- 浏览器触发上传弹窗，上传样例文件，切换追加/覆盖并确认导入。
- 检查下载链接、DOM 更新、控制台及资源请求。

### Verification Skill

- `Spreadsheets`
- `prototype-verifier`
- `playwright-cli`
- `verification-before-completion`

### Dependencies

- Step 10
