# 验证记录

> 记录每步验证和全局验证结果。失败项必须能追溯到具体步骤或需求。

## 最新状态

- Overall: Pass
- Last verified: 2026-07-28

## 记录格式

```text
Date:
Scope:
Command / Check:
Result:
Issues:
Next Action:
```

## History

### Step 01：活动中心页面骨架

- Date: 2026-07-28 10:12 CST
- Scope: 活动创建页、SIT 字段基线、奖励配置入口。
- Check: 本地 HTTP 打开；检查导航、标题、step1 快照、step2 领取方式/门店/车型字段和已关联卡券列表。
- Result: Pass
- Evidence: 页面加载成功；初始关联 1 张普通券；“选择卡券”和“选择积分配置”入口可见。

### Step 02：兑换券筛选与选择

- Date: 2026-07-28 10:15 CST
- Scope: 卡券选择弹窗。
- Check: 打开弹窗；切换“兑换券”；搜索“直邮”；重置；选择兑换券；检查草稿券禁用。
- Result: Pass
- Evidence: 兑换券筛选返回 4 行，其中 1 行草稿禁用；搜索返回 1 行，重置恢复 6 行；选择计数 1→2。

### Step 03：兑换券详情、回填与移除

- Date: 2026-07-28 10:17 CST
- Scope: 兑换券详情、确认关联、移除状态同步。
- Check: 查看 5选2 兑换券详情；确认回填；移除直邮券；重新打开弹窗检查勾选。
- Result: Pass
- Evidence: 详情包含 N选M、5 个候选/可兑 2 件、同 SKU 多件、车联网履约、VIN 和有效期；回填行存在；移除后 checkbox 未选中。

### Step 05：积分奖励与准入联动

- Date: 2026-07-28 10:19 CST
- Scope: 奖励类型、积分配置、准入门槛和组合校验。
- Check: 选择积分配置；检查待审核配置禁用；切换准入至绑车级并保存；恢复认证级；卡券+积分模式点击下一步。
- Result: Pass
- Evidence: 已启用配置成功回填 100 积分、V3、售后营销/维保活动、默认卡 VIN；1 条待审核配置禁用；绑车级保存被阻止；认证级组合配置校验通过。

### Step 04：响应式与标注运行时

- Date: 2026-07-28 10:21 CST
- Scope: 390×844 窄屏、桌面端、标注系统。
- Check: 视口切换、全页截图、横向溢出、标注按钮与标注点。
- Result: Pass
- Evidence: 390px 下 innerWidth/scrollWidth/bodyScrollWidth 均为 390；桌面端 1280px 无页面级横向溢出；标注按钮 1 个、空数据标注点 0 个。

### Global：全局交付验证

- Date: 2026-07-28 10:22 CST
- Tools: 原生语法检查、本地 HTTP、浏览器 DOM/交互、控制台、静态资源探测。
- Checks:
  - `node --check`：`js/app.js`、`js/common.js`、`js/nav.js`、`mock/data.js` 全部通过。
  - JSON：`config/nav.json`、`config/workflow.json` 解析通过。
  - HTTP：入口、CSS、Mock、JS、导航配置、标注资源、功能说明共 12 项全部返回 200。
  - Browser：兑换券筛选/搜索/详情/回填/移除、积分选择/禁用/准入/组合校验均通过。
  - Console：error 0。
  - Responsive：1280px 与 390px 均无页面级横向溢出。
- Result: Pass
- Issues: 真实接口字段、卡券+积分发放关系和兑换券参与互斥/叠加规则仍在 `memory/open-items.md`，不影响静态交互评审。

### Step 06：隐藏准入表达

- Date: 2026-07-28
- Scope: step1 配置快照、积分入口、保存及下一步校验。
- Check: 刷新本地 HTTP 原型；检查页面文本和控件；打开积分配置弹窗；选择 100 积分配置并回填；组合奖励点击下一步；检查控制台错误。
- Result: Pass
- Evidence: 页面中“准入表达”文本为 0、`#eligibilitySelect` 控件为 0；积分入口保持启用；积分配置成功回填；下一步提示“校验通过：进入 step3 活动对象”；console error 0。
