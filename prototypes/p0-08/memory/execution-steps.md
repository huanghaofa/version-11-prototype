# 执行步骤

> 每个步骤都必须小到可以独立实现、验证和修复。不要把不确定需求写成已确认任务。

## Step 01：呈现活动关联卡券页面

- 目标：展示活动创建页、步骤导航和已关联卡券列表。
- 文件：`index.html`、`assets/css/app.css`、`js/app.js`、`mock/data.js`
- 验收：页面可打开；已关联普通券正确展示；“选择卡券”入口可见。
- 验证技能：`prototype-verifier`、`playwright-cli`

## Step 02：完成兑换券筛选与选择

- 目标：弹窗支持类型筛选、搜索、禁用状态和跨筛选保留选择。
- 文件：`js/app.js`、`mock/data.js`、`assets/css/app.css`
- 验收：切换“兑换券”仅展示兑换券；搜索可过滤；草稿券不可选；选择计数正确。
- 验证技能：`prototype-verifier`、`playwright-cli`
- 依赖：Step 01

## Step 03：完成详情、回填与移除

- 目标：可查看兑换券只读规则，确认后回填，已选券可移除。
- 文件：`js/app.js`、`assets/css/app.css`
- 验收：详情字段齐全；确认回填有效；移除后再次打开弹窗状态同步。
- 验证技能：`prototype-verifier`、`playwright-cli`
- 依赖：Step 02

## Step 04：完善说明、标注与响应式

- 目标：补齐交互说明、页面标注和窄屏布局。
- 文件：`docs/interaction.html`、`annotations/annotations.js`、`assets/css/app.css`
- 验收：说明可访问；标注运行时不影响交互；390px 无横向溢出。
- 验证技能：`prototype-verifier`、`verification-before-completion`
- 依赖：Step 03

## Step 05：增加积分奖励分支

- 目标：按 SIT 页面结构扩展活动奖品，支持卡券、积分、组合三种模式。
- 文件：`js/app.js`、`mock/data.js`、`assets/css/app.css`
- 验收：准入表达不展示；可选择已启用积分配置；组合模式同时校验卡券和积分。
- 验证技能：`prototype-verifier`、`playwright-cli`
- 依赖：Step 03
