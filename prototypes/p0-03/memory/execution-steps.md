# 执行步骤

## Step 01: 数据与页面骨架

- Files: `mock/data.js`, `index.html`, `config/nav.json`, `js/nav.js`
- Acceptance: 两个菜单可切换；Mock 覆盖线上、线下、部分退款、全额退款、未结算、已结算、无需结算。
- Verification: JS 语法检查、导航加载检查。

## Step 02: 卡券补贴数据

- Files: `js/app.js`, `js/common.js`, `assets/css/*.css`
- Acceptance: 全部查询字段、重置、展开、分页、空结果、明细抽屉均可操作；一券一行，无金额汇总。
- Verification: 浏览器逐项点击并截屏，检查脱敏与金额空值。
- Failure handling: 查询或明细错误先修复数据映射，再继续规则页。

## Step 03: 补贴规则设置

- Files: `js/app.js`, `mock/data.js`, `assets/css/*.css`
- Acceptance: 查询、新增、查看、编辑、删除可演示；规则表单同时含线上和线下配置且无结算渠道字段。
- Verification: 浏览器完成一轮 CRUD；已使用规则限制能给出可见反馈。
- Dependency: Step 01。

## Step 04: 全局验证与交付

- Files: `annotations/annotations.js`, `docs/interaction.html`, `memory/verification-log.md`, `memory/change-log.md`, `README.md`
- Acceptance: 桌面和窄屏可用；本地资源无 404；无阻塞性 console error；核心流程、标注和文档一致。
- Verification: HTTP 浏览器验证、静态路径检查、JS 语法检查、截图复核。
- Failure handling: 未通过项记录为 Failed，修复并重验后才能交付。
