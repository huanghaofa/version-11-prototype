# 可执行步骤

## 步骤01：建立移动端页面与活动状态模型

- 文件：`index.html`、`assets/css/global.css`、`assets/css/app.css`、`mock/data.js`、`js/common.js`、`js/app.js`
- 验收：390 × 844页面可打开；默认VIN、两辆绑定车辆和五个活动状态可读取。
- 验证技能：`prototype-verifier`。

## 步骤02：实现聚合页与VIN联动

- 文件：`js/app.js`、`assets/css/app.css`
- 依赖：步骤01。
- 验收：三个级别分区完整；可参与默认勾选；已参与/需认证置灰；切换VIN后状态变化。
- 验证技能：`prototype-verifier`。

## 步骤03：实现一键参与与结果反馈

- 文件：`js/app.js`、`js/common.js`、`assets/css/app.css`
- 依赖：步骤02。
- 验收：选择数实时变化；批量参与后直接领券和抽奖结果统一展示；卡片更新为已参与。
- 验证技能：`prototype-verifier`。

## 步骤04：实现绑车/认证外跳提示与交付

- 文件：`js/app.js`、`docs/interaction.html`、`README.md`、`memory/change-log.md`、`memory/verification-log.md`
- 依赖：步骤03。
- 验收：升级入口明确说明不回跳；功能说明完整；最终视觉与交互验证通过。
- 验证技能：`prototype-verifier`、`verification-before-completion`。

## 步骤05：补齐SA选择活动与二维码生成闭环

- 文件：`mock/data.js`、`js/app.js`、`assets/css/app.css`、`assets/images/sa-demo-qr.png`、`docs/*`、`memory/*`、`qa/*`
- 依赖：步骤04。
- 验收：SA身份和门店只读；活动按三级展示并可全选/逐项选择；二维码页显示真实PNG码和冻结清单；模拟扫码后仅出现所选活动；390 × 844无横向溢出。
- 验证技能：`prototype-verifier`、`verification-before-completion`。

## 步骤06：实现我的SA数据概览与活动下钻

- 文件：`mock/data.js`、`js/app.js`、`assets/css/app.css`、`config/nav.json`、`memory/change-log.md`、`memory/verification-log.md`
- 依赖：步骤05。
- 验收：选择活动页可进入我的数据；概览指标完整；活动列表可进入活动详情；参与记录可进入详情；手机号/VIN脱敏且页面不展示oneID。
- 验证技能：`prototype-verifier`、`verification-before-completion`。

## 步骤07：实现卡券下钻与二维码异常状态

- 文件：`mock/data.js`、`js/app.js`、`assets/css/app.css`、`config/nav.json`、`memory/change-log.md`、`memory/verification-log.md`
- 依赖：步骤06。
- 验收：卡券列表可进入详情；重新生成有确认和旧码失效反馈；失效/过期页、无可投活动页和活动下线结果状态可访问。
- 验证技能：`prototype-verifier`、`verification-before-completion`。

## 步骤08：全页面导航、文档与全局验证

- 文件：`README.md`、`docs/requirements.md`、`docs/decisions.md`、`docs/interaction.html`、`memory/*`、`qa/*`
- 依赖：步骤07。
- 验收：全部主页面和状态可通过页面入口或功能说明访问；390 × 844无横向溢出；核心路径、资源、脚本和标注运行时兼容。
- 验证技能：`prototype-verifier`、`verification-before-completion`。

## 步骤09：实现SA选活动详情与标签统一

- 文件：`mock/data.js`、`js/app.js`、`assets/css/app.css`、`config/nav.json`、`memory/change-log.md`、`memory/verification-log.md`
- 依赖：步骤08。
- 验收：活动卡片主体可进入详情；详情包含基本信息、规则、关联卡券、关联权益与互斥说明；活动类型标签只显示“领券/抽奖”。
- 验证技能：`prototype-verifier`、`verification-before-completion`。

## 步骤10：实现用户端活动互斥

- 文件：`mock/data.js`、`js/app.js`、`assets/css/app.css`、`memory/change-log.md`、`memory/verification-log.md`
- 依赖：步骤09。
- 验收：同组活动默认只勾选一项；勾选另一项后原项自动取消并提示；成功参与后同组其他活动显示“互斥已参与”；提交前存在二次校验。
- 验证技能：`prototype-verifier`、`verification-before-completion`。

## 步骤11：统一卡券核销口径与全局回归

- 文件：移动端与后台项目的`mock/data.js`、`js/app.js`、`js/common.js`、`docs/*`、`memory/*`、`index.html`
- 依赖：步骤10。
- 验收：移动端和后台卡券报表不出现“已使用/使用率”，统一展示“已核销/核销率”；两个原型核心导航与原有下钻可用。
- 验证技能：`prototype-verifier`、`verification-before-completion`。

## 步骤12：调整SA视觉、活动详情与卡券状态

- 文件：`js/app.js`、`assets/css/app.css`、`mock/data.js`、`index.html`、`docs/*`、`memory/*`
- 依赖：步骤11。
- 验收：所有SA路由使用蓝色主题且用户聚合页仍为红色；SA选活动详情不展示主办方并显示领券方式；SA卡券列表与详情显示已生效。
- 验证技能：`prototype-verifier`、`verification-before-completion`。

## 步骤13：组合活动单卡片与VIN匹配

- 文件：`mock/data.js`、`js/app.js`、`assets/css/app.css`、`config/nav.json`、`docs/*`、`memory/*`
- 依赖：步骤12。
- 验收：组合活动只展示一张卡片；未绑车隐藏卡券且不可选；绑车后按当前VIN在原卡片展示对应券；切换VIN内容刷新；参与按组合活动ID + VIN去重。
- 多命中边界：同一VIN命中多个子活动时全部执行，不阻断、不记异常，不配置优先级和顺序。
- 验证技能：`prototype-verifier`、`verification-before-completion`。

## 步骤14：二维码有效期抽屉

- 文件：`mock/data.js`、`js/app.js`、`assets/css/app.css`、`docs/*`、`memory/*`
- 依赖：步骤13。
- 验收：生成和重新生成均先打开抽屉；默认30分钟；可选项范围5分钟至1天；取消不生成；结果页展示时长、失效时间和配置版本。
- 验证技能：`prototype-verifier`、`verification-before-completion`。

## 步骤15：静态直接预览交付

- 文件：`index.html`、`README.md`、`CLAUDE.md`、`docs/decisions.md`、`memory/*`、`../SA动态二维码原型_静态预览_20260810.html`
- 依赖：步骤14。
- 验收：直接通过file协议打开后，SA选择、本人数据、用户聚合页、组合活动和二维码时长交互均可用；无阻塞性资源或控制台错误。
- 验证技能：`prototype-verifier`、`browser:control-in-app-browser`、`verification-before-completion`。

## 步骤16：实现组合活动多子活动同时履约

- 文件：`mock/data.js`、`js/app.js`、`assets/css/app.css`、`annotations/annotations.js`、`docs/*`、`memory/*`、`index.html`。
- 依赖：步骤15。
- 验收：默认VIN同时命中两个子活动；一张组合活动卡片展示两类卡券及全部权益；一键参与结果明确命中2个子活动且已全部发放；组合活动仍只标记一次已参与。
- 边界：不展示人群包标签；不设优先级、顺序、阻断或异常态。
- 验证技能：`prototype-verifier`、`verification-before-completion`。

## 步骤17：同步组合活动展示名称与SA门店过滤

- 文件：`mock/data.js`、`js/app.js`、`annotations/annotations.js`、`docs/*`、`memory/*`。
- 依赖：步骤16与组合活动创建/编辑字段完成。
- 验收：SA全链路使用展示名称优先/原名回退；当前门店命中组合可进入活动池，门店未命中组合被过滤且无法进入二维码快照。
- 边界：适用门店只控制SA查看与分享，不修改子活动或卡券核销门店。
- 验证技能：`prototype-verifier`、`browser:control-in-app-browser`、`verification-before-completion`。

## 步骤18：未绑车时不渲染卡券区域

- 文件：`js/app.js`、`assets/css/app.css`、`annotations/annotations.js`、`docs/*`、`memory/*`、`index.html`。
- 依赖：步骤17。
- 验收：未绑车路由仍展示1张组合活动卡片；卡内不存在`.combo-reward-hidden`、“卡券内容待解锁”或具体券文案；复选框禁用且保留去绑车入口；已绑车路由仍汇总展示2个命中子活动卡券。
- 边界：只隐藏未绑车时的卡券区域，不隐藏整张组合活动卡片。
- 验证技能：`prototype-verifier`、`browser:control-in-app-browser`、`verification-before-completion`。

## 步骤19：实现SA活动分享海报

- 文件：`mock/data.js`、`js/app.js`、`assets/css/app.css`、`config/nav.json`、`annotations/annotations.js`、`docs/*`、`memory/*`、`index.html`。
- 依赖：步骤18。
- 验收：二维码结果页可进入海报编辑；可切换系统模板或上传JPG/PNG自定义底图（≤10MB）；两种方式均固定展示当前二维码、SA姓名/工号、门店和有效期；标题、副标题、扫码引导语可编辑并实时更新预览；生成后可进入最终海报页并模拟保存/分享。
- 边界：SA只能编辑营销文案，不能修改二维码、sceneId或来源SA/门店；二维码重新生成后旧海报内旧码同步失效。
- 验证技能：`prototype-verifier`、`browser:control-in-app-browser`、`verification-before-completion`。

## 步骤20：实现长期有效二维码

- 文件：移动端与后台项目的`mock/data.js`、二维码页面脚本、样式、`docs/*`、`memory/*`、`index.html`及统一静态入口。
- 依赖：步骤19。
- 验收：后台二维码参数页可启用“长期有效（至活动有效期）”并设为默认；SA有效期抽屉展示该选项；选择后结果页、冻结快照和海报均显示长期有效及实际截止时间；固定时长仍可选择。
- 规则：聚合二维码的长期有效截止时间取本次冻结活动中最晚结束时间；活动自身结束或下线后仍实时过滤，全部冻结活动结束后二维码到期。
- 验证技能：`prototype-verifier`、`browser:control-in-app-browser`、`verification-before-completion`。

## 步骤21：移除客户海报内部状态说明

- 文件：`js/app.js`、`docs/requirements.md`、`memory/*`、`design-qa.md`、`index.html`。
- 依赖：步骤19、步骤20。
- 验收：海报编辑页和最终预览均不出现“二维码与活动范围已锁定”；系统模板和自定义上传底图状态保持一致；二维码、扫码引导语、SA、门店及有效期仍正常展示。
- 边界：只调整客户可见文案，不改变sceneId、活动范围冻结或最后触点规则。
- 验证技能：`prototype-verifier`、`browser:control-in-app-browser`、`verification-before-completion`。

## 步骤22：隐藏扫码用户活动等级表达

- 文件：`js/app.js`、`annotations/annotations.js`、`docs/*`、`memory/*`、`README.md`、`index.html`。
- 依赖：步骤21。
- 验收：`activity-aggregation`、`activity-aggregation-unbound`和指定活动范围状态均不展示号码级活动、绑车级活动、认证级活动标题或卡片等级标签；活动卡片数量、默认勾选、置灰、VIN切换和一键参与保持原逻辑。
- 边界：仅隐藏扫码用户可见等级表达；SA选择活动页和后台数据仍保留三级业务模型。
- 验证技能：`prototype-verifier`、`browser:control-in-app-browser`、`verification-before-completion`。
