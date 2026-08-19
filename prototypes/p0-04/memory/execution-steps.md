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

## Step 02: 权益适用范围与弹窗

### Goal

在原适用范围类型后增加权益，并完成E3S权益查询、多选、内容展开和回显。

### Files

- `js/app.js`
- `mock/data.js`
- `assets/css/app.css`
- `annotations/annotations.js`

### Acceptance

- 页面显示五种适用范围，权益位于套餐之后。
- 五种范围一次只能选择一种。
- 权益弹窗可按编码和名称查询、多选，权益内容可展开。
- 确认后回显权益名称和编码。

### Verification

- 执行 `node scripts/verify-prototype.mjs`。
- 浏览器逐项验证选择、查询、展开、勾选、确认和回显。

## Step 03: SIT视觉与完整字段恢复

### Goal

将独立原型重做为卡券中心SIT后台视觉，并恢复原新增/编辑满减券完整字段。

### Files

- `index.html`
- `assets/css/app.css`
- `js/app.js`
- `scripts/verify-prototype.mjs`

### Acceptance

- 页面具有SIT窄图标栏、顶部工具栏、浅蓝模块页签和底部工作页签。
- 显示基本信息、领取规则、核销规则、关联设置四个区块。
- 原卡券关键字段完整存在，权益入口只作为适用范围新增类型。
- 旧原型无本次权益选择器残留。

### Verification

- 执行静态断言与JavaScript语法检查。
- 浏览器检查26行表单、四个区块、五个适用范围和权益完整链路。
- 回归旧车联网融合原型验证脚本并执行残留扫描。
