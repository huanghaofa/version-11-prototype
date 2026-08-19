# 执行步骤

## Step 01：建立后台事件页

### Goal

复用 Axure 图19的信息结构，展示商城订单已有事件与本期新增事件。

### Files

- `index.html`
- `config/nav.json`
- `mock/data.js`
- `js/pages/event-config.js`
- `assets/css/app.css`

### Acceptance

- 只有“行为事件配置”一个后台入口。
- 新事件位于“商城订单”一级分类。
- 行为编码为“待分配”。

## Step 02：实现金额规则配置

### Goal

支持配置 N、金额口径、触发时点和频次。

### Acceptance

- N 必须大于 0。
- 无效金额无法保存。
- 有效金额保存成功。
- 页面展示清晰的后台规则表达与系统边界。

## Step 03：全局验证与交付

### Acceptance

- 不存在用户抽奖流程入口或页面代码。
- 页面可由本地 HTTP 服务打开。
- 无阻塞级控制台错误或资源 404。
- 交互说明、标注和验收记录齐全。
