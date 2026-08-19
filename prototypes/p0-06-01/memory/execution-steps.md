# 执行步骤

## 步骤 01：建立现网风格后台骨架与Mock模型

### 需求来源
- `docs/requirements.md` 1、2、6节。
- `docs/decisions.md` D01、D03、D06。

### 目标
入口页面呈现与当前SIT一致的后台框架，可在六个路由之间切换并读取独立Mock数据。

### 文件
- `index.html`
- `assets/css/global.css`
- `assets/css/app.css`
- `config/nav.json`
- `mock/data.js`
- `js/common.js`
- `js/nav.js`
- `js/app.js`

### 工作
- 实现后台框架和通用组件。
- 建立六页导航和Mock数据。
- 建立Hash路由、Toast、抽屉及通用渲染方法。

### 验收
- 页面视觉与现网后台结构一致。
- 六个路由均可访问。
- 浏览器无阻塞错误和本地资源404。

### 验证
- JavaScript语法检查。
- HTTP 200。
- 浏览器检查标题、导航数量和路由切换。

### 验证技能
- `prototype-verifier`
- `browser:control-in-app-browser`
- `verification-before-completion`

### 依赖
- None。

### 失败处理
- 结构或资源失败回到步骤01修正，不进入步骤02。

## 步骤 02：实现SA活动报表三页

### 需求来源
- `docs/requirements.md` 4.1～4.3。
- `memory/business-rules.md` 来源规则、参与唯一口径、报表口径。

### 目标
完成活动总览、二维码明细、活动参与明细及其核心交互。

### 文件
- `assets/css/app.css`
- `mock/data.js`
- `js/app.js`
- `memory/change-log.md`
- `memory/verification-log.md`

### 工作
- 渲染筛选区、指标卡、趋势排行和汇总表。
- 渲染二维码与参与明细。
- 实现筛选、重置、展开、下钻、分页、详情和导出反馈。

### 验收
- 三个页签数据完整。
- 总览指标可下钻。
- 二维码、活动参与详情抽屉可打开和关闭。
- 手机号、VIN和oneID脱敏。

### 验证
- 浏览器切换三个活动路由。
- 操作查询、重置、下钻和详情抽屉。
- 检查console和关键DOM。

### 验证技能
- `prototype-verifier`
- `browser:control-in-app-browser`
- `verification-before-completion`

### 依赖
- 步骤01。

### 失败处理
- 留在步骤02修复并重新验证。

## 步骤 03：实现SA卡券报表与跨域下钻

### 需求来源
- `docs/requirements.md` 4.4～5。
- `memory/business-rules.md` 卡券来源、权限与脱敏。

### 目标
完成卡券总览、领取、核销三页，并打通活动参与与卡券明细双向跳转。

### 文件
- `assets/css/app.css`
- `mock/data.js`
- `js/app.js`
- `memory/change-log.md`
- `memory/verification-log.md`

### 工作
- 渲染卡券指标、排行和汇总表。
- 渲染领取、核销明细与详情抽屉。
- 实现跨店标识、来源快照和跨域下钻。
- 完成六页权限提示、导出反馈和分页状态。

### 验收
- 三个卡券页签数据完整。
- 领取、核销详情可打开。
- 活动参与与卡券记录可以相互跳转。
- 来源门店与实际核销门店明确区分。

### 验证
- 浏览器切换三个卡券路由。
- 操作查询、下钻、详情和跨域跳转。
- 检查console、脱敏字段和跨店状态。

### 验证技能
- `prototype-verifier`
- `browser:control-in-app-browser`
- `verification-before-completion`

### 依赖
- 步骤02。

### 失败处理
- 留在步骤03修复；跨域规则不清时回到需求确认。

## 步骤 04：统一卡券核销口径

### 需求来源
- 用户确认“使用就是核销”，不存在“已使用”状态和使用率。

### 目标
卡券总览、领取明细和详情只使用核销业务口径。

### 文件
- `mock/data.js`
- `js/app.js`
- `js/common.js`
- `docs/requirements.md`
- `memory/business-rules.md`
- `memory/change-log.md`
- `memory/verification-log.md`

### 验收
- 卡券页面无“已使用/使用率”。
- 指标、漏斗、排行、汇总表和状态均切换为核销口径。
- 卡券领取与核销详情、跨域跳转仍可操作。

### 验证技能
- `prototype-verifier`
- `verification-before-completion`

### 依赖
- 步骤03。

## 步骤 05：补齐原活动中心SA分享配置页面（历史方案，已由步骤09替代）

### 需求来源
- 用户确认复用原互斥能力、复制重置SA分享、准入级别读取活动原有准入配置。
- `docs/requirements.md` 2.3、7。

### 目标
在原活动中心风格中完成活动列表、新增/编辑、详情及启用/关闭/复制交互。

### 文件
- `config/nav.json`
- `mock/data.js`
- `js/nav.js`
- `js/common.js`
- `js/app.js`
- `js/activity-config.js`（原活动中心配置页面独立领域模块，避免继续扩大报表文件）
- `assets/css/app.css`
- `index.html`
- `memory/change-log.md`
- `memory/verification-log.md`

### 工作
- 增加保客活动创建相关路由和活动Mock。
- 在Step1配置SA分享资格并联动触发方式，在Step3读取准入配置。
- 实现复制活动重置为否、启用确认和关闭影响提示。

### 验收
- 列表可查看SA分享状态并进入新增、编辑、复制、详情。
- 后台统一推送不能开启SA分享。
- 复制活动进入编辑态时SA分享为否。
- 启用和关闭弹窗明确二维码影响。

### 验证
- 浏览器检查四个活动配置路由和弹窗。
- 检查关键DOM、表单联动与console。

### 验证技能
- `prototype-verifier`
- `playwright-cli`
- `verification-before-completion`

### 依赖
- 步骤04。

## 步骤 06：复用并扩展活动互斥关系

### 需求来源
- 用户确认不新增SA互斥配置菜单。
- `docs/requirements.md` 2.3、7。

### 目标
通过原有互斥关系页面和选择弹窗维护参与互斥主体口径。

### 文件
- `mock/data.js`
- `js/app.js`
- `assets/css/app.css`
- `docs/interaction.html`
- `annotations/annotations.js`
- `memory/change-log.md`
- `memory/verification-log.md`

### 工作
- 增加互斥关系列表和详情。
- 在活动Step3提供选择互斥活动弹窗，并展示准入级别和主体口径。
- 补充功能说明与业务标注。

### 验收
- 左侧仅存在“保客活动互斥关系”，不存在“SA互斥配置”。
- 选择互斥活动时可查看准入级别和互斥主体。
- 互斥关系页可追溯配置来源和生效状态。

### 验证
- 浏览器检查互斥列表、详情和选择弹窗。
- 检查导航关键词、DOM和console。

### 验证技能
- `prototype-verifier`
- `playwright-cli`
- `verification-before-completion`

### 依赖
- 步骤05。

## 步骤 07：按原页面校正准入配置

### 需求来源
- 用户提供的原准入配置截图。
- 用户确认领券方式和门店来源本来已有。

### 目标
纠正Step3的配置形态和本次SA新增能力边界。

### 文件
- `js/activity-config.js`
- `assets/css/app.css`
- `mock/data.js`
- `annotations/annotations.js`
- `docs/requirements.md`
- `docs/interaction.html`
- `memory/change-log.md`
- `memory/verification-log.md`

### 工作
- Step2明确领券方式、门店来源和适用门店属于原页面已有能力。
- Step3使用准入开关、三级准入按钮和四个校验节点。
- 准入配置使用确认/取消，确认后联动互斥主体口径。

### 验收
- 不再出现准入等级下拉框或自动生成的准入节点列表。
- 配置弹窗字段和截图一致。
- 取消不保存；确认后摘要、详情和互斥主体同步更新。

### 验证
- 浏览器检查Step2、Step3、弹窗和详情。
- 回归互斥选择、活动列表和既有报表。

### 验证技能
- `prototype-verifier`
- `browser:control-in-app-browser`
- `verification-before-completion`

### 依赖
- 步骤06。

## 步骤 08：优化准入配置视觉

### 需求来源
- 用户反馈准入配置UI过于粗糙。

### 目标
在不改变业务字段和交互逻辑的前提下，提升弹窗的信息层级、密度和窄窗口适配。

### 文件
- `js/activity-config.js`
- `assets/css/app.css`
- `index.html`
- `design-qa.md`
- `memory/change-log.md`
- `memory/verification-log.md`

### 验收
- 三组配置采用统一横向表单布局。
- 选中、悬停、禁用状态使用活动中心蓝色体系。
- 当前应用内浏览器窄窗口中，三级按钮和四个校验节点不被裁切。
- 确认、取消和互斥主体联动保持不变。

### 验证技能
- `prototype-verifier`
- `browser:control-in-app-browser`
- `verification-before-completion`

### 依赖
- 步骤07。

## 步骤 09：迁移到独立SA活动配置

### 需求来源
- 客户确认普通活动与组合活动均应通过独立页面配置SA投放。

### 文件
- `mock/data.js`
- `js/activity-config.js`
- `js/app.js`
- `js/nav.js`
- `config/nav.json`
- `assets/css/app.css`

### 验收
- 原活动列表、创建/编辑和详情无“是否允许SA分享”。
- 独立SA活动配置支持普通活动、组合活动的列表、新增/编辑和详情。
- 组合活动详情展示子活动、人群包、卡券和权益只读快照。
- 原准入和互斥入口保持不变。

### 验证技能
- `prototype-verifier`
- `verification-before-completion`

## 步骤 10：二维码有效时长参数

### 需求来源
- SA生成前可选择后台配置的二维码有效时长，范围5分钟至1天。

### 文件
- `mock/data.js`
- `js/activity-config.js`
- `assets/css/app.css`

### 验收
- 二维码参数页可配置候选项和默认值。
- 默认值必须属于候选项；候选值均在5—1440分钟。
- 页面明确新配置只影响后续新生成二维码。

### 验证技能
- `prototype-verifier`
- `verification-before-completion`

## 步骤 11：移除SA配置中的范围二次配置

### 需求来源
- 用户确认适用门店/SA范围改在普通活动和组合活动中配置，独立SA活动配置不再维护。

### 目标
SA活动配置只维护投放对象和配置状态，不产生第二套门店/SA范围数据。

### 文件
- `mock/data.js`
- `js/activity-config.js`
- `annotations/annotations.js`
- `docs/requirements.md`
- `docs/decisions.md`
- `docs/interaction.html`
- `memory/business-rules.md`
- `memory/acceptance-map.md`
- `memory/change-log.md`
- `memory/verification-log.md`

### 验收
- 新增/编辑页不存在可编辑“适用门店/SA范围”字段。
- SA投放Mock对象不保存范围字段。
- 列表、选择弹窗、详情和投放对象快照只读展示所选活动或组合活动的实时范围与来源。
- 保存投放配置不写入范围副本。

### 验证技能
- `prototype-verifier`
- `browser:control-in-app-browser`
- `verification-before-completion`

### 依赖
- 步骤09。

## 步骤 12：支持直接打开的静态预览

### 需求来源
- 用户确认本任务后续原型均需双击静态文件预览，不再依赖本地服务。

### 目标
后台、移动端和统一入口均可通过file协议直接访问，同时保留HTTP调试能力。

### 文件
- `index.html`
- `config/nav.inline.js`
- `js/nav.js`
- `README.md`
- `CLAUDE.md`
- `docs/decisions.md`
- `docs/interaction.html`
- `memory/change-log.md`
- `memory/verification-log.md`
- `../SA动态二维码原型_静态预览_20260810.html`

### 验收
- 后台file模式可以加载左侧导航和默认页。
- 后台Hash路由、详情与配置交互可用，控制台无阻塞错误。
- 统一静态入口可进入后台、SA移动端、用户聚合页和说明材料。
- HTTP模式仍可正常加载`config/nav.json`。

### 验证技能
- `prototype-verifier`
- `browser:control-in-app-browser`
- `verification-before-completion`

### 依赖
- 步骤11。

## 步骤 13：调整组合活动多命中规则

### 需求来源
- 用户确认同一VIN满足多个子活动时全部发放，无需优先级、顺序、阻断或异常记录。

### 目标
后台组合活动投放快照准确表达多子活动同时履约规则。

### 文件
- `js/activity-config.js`
- `assets/css/app.css`
- `docs/*`
- `memory/*`
- `index.html`

### 验收
- 组合活动快照不再展示多命中阻断、异常或优先级提示。
- 页面明确同一VIN命中的所有子活动卡券和权益全部发放。
- 页面明确组合活动参与主记录一条，发放明细可为多条。

### 验证技能
- `prototype-verifier`
- `verification-before-completion`

### 依赖
- 步骤12。

## 步骤14：同步组合活动展示名称与适用门店

### 需求来源
- 用户确认组合活动创建/编辑增加展示名称与适用门店，并沿用既有门店配置规则。

### 目标
- SA投放页实时读取展示名称和门店范围，展示回退分支与门店过滤公式。

### 文件
- `mock/data.js`
- `js/activity-config.js`
- `annotations/annotations.js`
- `docs/*`
- `memory/*`

### 验收
- 展示名称有值优先、无值回退原名，且后台可追溯原名。
- 指定门店显示数量与名称；空范围显示全部门店。
- 页面明确“投放有效 ∩ 组合启用 ∩ SA门店命中”。

### 验证技能
- `prototype-verifier`
- `verification-before-completion`

## 步骤15：扩展长期有效二维码参数

### 需求来源
- 用户要求SA选择二维码时长时增加“长期有效”，有效至活动有效期。

### 目标
- 在现有二维码参数页统一维护固定时长与长期有效候选。

### 文件
- `mock/data.js`
- `js/activity-config.js`
- `assets/css/app.css`
- `annotations/annotations.js`
- `docs/*`
- `memory/*`
- `index.html`

### 验收
- 固定时长候选仍限制为5分钟至1天。
- 增加“长期有效（至活动有效期）”候选卡，可启用并可设为默认。
- 默认值必须属于已启用候选，保存后只影响新生成二维码。
- 页面说明固定模式保存`durationMinutes`，长期模式按冻结活动最晚结束时间计算`expiresAt`。

### 验证技能
- `prototype-verifier`
- `browser:control-in-app-browser`
- `verification-before-completion`
