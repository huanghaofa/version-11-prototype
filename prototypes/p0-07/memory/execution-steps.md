# 执行步骤

## Step 01: 建立卡包领域数据

### Goal

形成业务分类、车辆与券实例的可复用 Mock 数据。

### Files

- `mock/data.js`
- `memory/change-log.md`

### Acceptance

- 11 个业务分类可读取。
- 至少包含手机号券、两个 VIN 分组、可用/已使用/已过期数据。
- 同一 VIN 下存在多个业务分类券。

### Verification

- `node --check mock/data.js`

### Verification Skill

- `prototype-verifier`

### Dependencies

- None

## Step 02: 实现分类筛选与分组展示

### Goal

用户可以切换“全部/商城/维保”等分类，并看到筛选后的手机号券和 VIN 分组。

### Files

- `index.html`
- `assets/css/app.css`
- `js/app.js`
- `memory/change-log.md`

### Acceptance

- 分类支持横向滚动和点击。
- 切换分类后券数量、分组和卡片同步变化。
- 无数据分组不展示。
- 无结果分类展示空状态。

### Verification

- 浏览器点击分类，检查 DOM 和可见内容变化。
- 检查 375px 与桌面布局。

### Verification Skill

- `prototype-verifier`
- `playwright-cli`

### Dependencies

- Step 01

## Step 03: 实现卡券详情和操作反馈

### Goal

用户可以查看券详情、出示核销码和触发去使用提示。

### Files

- `index.html`
- `assets/css/app.css`
- `js/app.js`
- `memory/change-log.md`

### Acceptance

- 详情弹层展示业务分类、归属车辆、有效期和使用规则。
- 核销码弹层可打开和关闭。
- 去使用操作有明确反馈。
- 遮罩和 Escape 可关闭弹层。

### Verification

- 浏览器实际点击并检查弹层状态。

### Verification Skill

- `prototype-verifier`
- `playwright-cli`

### Dependencies

- Step 02

## Step 04: 扩充券种、状态和码类操作

### Goal

参照 Axure 卡包原型，覆盖多券种、待激活、历史状态、详情、核销码和第三方兑换码。

### Files

- `mock/data.js`
- `assets/css/app.css`
- `js/app.js`
- `docs/requirements.md`
- `docs/decisions.md`
- `docs/interaction.html`
- `memory/acceptance-map.md`
- `memory/verification-log.md`

### Acceptance

- 展示全部状态、可使用、待激活、已使用、已过期，并支持与业务分类组合筛选。
- 展示满减券、代金券、折扣券、权益券、服务券、兑换券和虚拟卡。
- 待激活券可激活并切换为可使用。
- VIN 券可出示核销码；第三方券可查看和复制兑换码。
- 已使用、已过期和激活超时仅保留详情。

### Verification

- 浏览器实际点击各状态、详情、激活、核销码、兑换码和复制按钮。
- 检查桌面设备壳和窄屏布局，确认最终浏览器日志为空。

### Verification Skill

- `analyze-axure-prototypes`
- `prototype-verifier`
- `verification-before-completion`

### Dependencies

- Step 03

## Step 05: 对齐核销码与通用兑换券参照原型

### Goal

修正核销码页面结构，并将通用兑换券接入既有兑换券任务的四步交互。

### Acceptance

- 核销码使用独立页面，同时展示券摘要、条形码、数字码和二维码。
- 通用兑换券支持5选2、同 SKU 两件和跨履约组合。
- 兑换单创建成功即核销卡券，履约/发货状态独立展示。
- 完成兑换后卡券从可使用移入已使用。

### Verification

- 浏览器点击 VIN 券核销码并截图。
- 浏览器完成通用兑换券详情、选品、确认、成功和完成全流程。
- 分别验证不同商品组合和同一商品2件。

### Verification Skill

- `analyze-axure-prototypes`
- `prototype-verifier`
- `verification-before-completion`

### Dependencies

- Step 04

## Step 06: 收敛卡包页头与个人卡券文案

### Goal

按 Axure 卡包结构移除无依据的页头摘要，并精简个人卡券归属文案。

### Acceptance

- 页头不展示总券数、车辆头像和关联车辆数量。
- 默认进入可使用状态，其他状态仍可通过筛选查看。
- 个人卡券只展示脱敏手机号，不出现“与车辆无关”。

### Verification

- 核对 Axure 页面结构与坐标。
- 检查渲染 DOM，并执行可使用、已使用状态切换。
- 通过本地 HTTP 检查入口和关联资源。

### Verification Skill

- `analyze-axure-prototypes`
- `prototype-verifier`
- `verification-before-completion`

### Dependencies

- Step 05

## Step 07: 强化默认车辆并收敛车辆提示

### Goal

提升默认车辆识别度，删除非必要能源标签，并将 VIN 共用券提示改成用户表达。

### Acceptance

- 轩逸展示醒目的品牌红“默认车辆”标识。
- N7 不展示“新能源”标签。
- VIN 可用券分组统一展示“车辆有效关联人均可使用”。

### Verification

- 检查渲染 DOM、移动端截图和 375px 页面宽度。
- 检查 JavaScript 语法和页面 error/warning 日志。

### Verification Skill

- `prototype-verifier`
- `verification-before-completion`

### Dependencies

- Step 06
