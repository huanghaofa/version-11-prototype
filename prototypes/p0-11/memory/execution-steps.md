# 执行步骤

> 每个步骤都必须小到可以独立实现、验证和修复。不要把不确定需求写成已确认任务。

## Step 01: 固化需求与兼容型规则数据模型

### Goal

在真实项目结构中写入需求、决策、活动/卡券 Mock 与导航入口。

### Files

- `index.html`
- `assets/css/global.css`
- `assets/css/app.css`
- `js/app.js`
- `js/common.js`
- `js/nav.js`
- `mock/data.js`
- `config/nav.json`
- `docs/requirements.md`
- `docs/decisions.md`
- `memory/business-rules.md`

### Inputs

- `docs/requirements.md`
- `docs/decisions.md`
- `memory/project.md`

### Work

- 定义活动主券、可选目标券、叠加规则和互斥规则。
- 配置活动编辑和关系预览两个入口。

### Acceptance

- Mock 数据不硬编码在页面逻辑中。
- 两个导航入口可由配置读取。
- 需求与业务规则边界可追溯。

### Verification

- Node 语法检查和 JSON 解析。
- `prototype-verifier` 单步验证。

### Dependencies

- None

### Failure Handling

- 如果资源路径失败，修复 HTML 中的 `src` / `href`。
- 如果脚本语法失败，先修复 JS 语法再继续。

## Step 02: 实现兼容型规则方式与新增双名单配置

### Goal

运营可沿用历史规则方式，或选择新增“部分叠加互斥”并看到实时摘要。

### Files

- `index.html`
- `assets/css/app.css`
- `js/app.js`
- `js/common.js`
- `js/pages/activity-edit.js`

### Acceptance

- 页面展示五种业务规则方式，历史“无”作为不配置入口。
- 方式 1–4 只展示对应单一配置；方式 5 同时展示两组名单。
- 历史方式与新增方式的回显含义清晰。
- 桌面端信息层级清楚，390px 下无横向溢出。

### Verification

- 浏览器打开活动编辑页，切换两组规则并检查 DOM 状态。
- 检查 console、资源和 390px 布局。
- `prototype-verifier` + `playwright-cli`。

### Dependencies

- Step 01

## Step 03: 实现指定券选择与冲突校验

### Goal

运营可维护部分叠加券和部分互斥券；新增方式中的重复目标券会被阻止。

### Files

- `js/pages/activity-edit.js`
- `assets/css/app.css`

### Acceptance

- 选择弹窗可搜索、筛选和勾选。
- 新增方式中，已在另一规则中的目标券置灰并解释原因。
- 确认后数量、标签和生效摘要同步更新。
- 指定模式空集合与无效券状态能被保存校验发现。

### Verification

- 点击打开两类选择弹窗，完成增删并验证状态。
- `prototype-verifier` + `playwright-cli`。

### Dependencies

- Step 02

## Step 04: 实现关系预览与交付说明

### Goal

评审人员能查看最终关系、判断顺序、组合矩阵和待确认边界。

### Files

- `js/pages/relation-preview.js`
- `docs/interaction.html`
- `memory/change-log.md`

### Acceptance

- 关系预览展示主券到叠加/互斥券的关系。
- 明确活动互斥 > 卡券互斥 > 卡券叠加 > 默认不可组合。
- 交互说明可独立打开。

### Verification

- 通过导航进入预览页，检查核心文案和动态数量。
- `prototype-verifier` + `playwright-cli`。

### Dependencies

- Step 03

## Step 05: 实现指定券批量导入

### Goal

运营可在部分叠加券和部分互斥券中通过模板批量导入，并在写入前查看逐行校验结果。

### Files

- `js/pages/activity-edit.js`
- `assets/css/app.css`
- `mock/data.js`
- `docs/interaction.html`

### Acceptance

- 两个指定规则区都展示批量导入入口。
- 导入弹窗支持模板下载、文件选择和示例文件演示。
- 预校验结果区分可导入、已存在、不可导入，并展示原因。
- 确认后仅将可导入券合并到当前指定规则。
- 390px 下弹窗无横向溢出，主要操作可见可用。

### Verification

- 分别从叠加规则和互斥规则打开批量导入。
- 加载示例文件，检查三类结果、错误原因、确认导入数量与回显。
- `prototype-verifier` + 浏览器交互检查。

### Dependencies

- Step 03
