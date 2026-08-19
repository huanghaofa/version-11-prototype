# 执行步骤

| 步骤 | 目标 | 主要文件 | 验收标准 | 验证方式 |
|---|---|---|---|---|
| S1 | 建立独立项目与导航 | index.html、config/nav.json、CSS | 入口和 22 个页面路由可用 | HTTP 打开、导航点击 |
| S2 | 实现页面和 Mock 数据 | js/app.js、mock/data.js | 活动 8 页、卡券 13 页均可渲染 | DOM、截图、交互检查 |
| S3 | 实现标注与功能说明 | annotations、js/common.js | 每页有说明抽屉和结构化标注 | 点击说明和标注点 |
| S4 | 完成文档和项目记忆 | docs、memory | 需求、规则、待确认、验收均记录 | 文件与标题检查 |
| S5 | 全局验证 | verification-log.md | 无阻塞错误，核心路径通过 | 语法、资源、浏览器、响应式 |

## S8：组合活动展示名称与适用门店

- 需求来源：2026-08-10 组合活动原型调整。
- 目标：新增/编辑组合活动可配置展示名称和适用门店，编辑态正确回显；零选择按全部门店处理。
- 文件：`js/app.js`、`js/common.js`、`mock/data.js`、`assets/css/app.css`、`annotations/annotations.js`。
- 验收：创建和编辑均显示两个新增字段；门店选择器仅展示可用门店；支持搜索、分组选择、已选、清空、确认回填。
- 验证：Node 语法检查；浏览器创建/编辑/选店/清空路径；console 与资源检查。
- 验证技能：`prototype-verifier`、`verification-before-completion`。
- 依赖：S1-S7。
- 失败处理：停留在 S8 修复，不进入 SA 链路同步。

## S9：SA 动态二维码字段读取与门店过滤

- 需求来源：2026-08-10 组合活动原型调整。
- 目标：SA 侧统一读取组合活动展示名称和适用门店，不保存重复配置。
- 文件：SA 动态二维码后台/移动端原型的 `mock/data.js`、页面 JS、规则文档与标注。
- 验收：有展示名称优先显示，无展示名称回退原名称；全部门店与指定门店分别产生正确 SA 可见/分享结果。
- 验证：后台选择对象、SA 活动池、用户聚合卡片、详情和分享状态检查。
- 验证技能：`prototype-verifier`、`verification-before-completion`。

## S10：组合活动列表展示名称与表单精简

- 需求来源：2026-08-11 用户补充确认。
- 目标：组合活动列表直接展示“组合活动展示名称”，创建/编辑删除独立展示预览。
- 文件：`mock/data.js`、`js/app.js`、`assets/css/app.css`、`annotations/annotations.js`、`docs/*`、`memory/*`。
- 验收：列表列名和两条 Mock 数据正确；未配置显示“-”；新增/编辑保留展示名称输入框但不出现“SA 对外展示预览”。
- 验证：JS 语法、HTTP 页面、DOM、实际打开新增/编辑、console。
- 验证技能：`prototype-verifier`、`verification-before-completion`。
- 依赖：S8。
- 失败处理：停留在 S9 修复，不进入全局验证。
