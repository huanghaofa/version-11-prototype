# 验证记录

> 记录每步验证和全局验证结果。失败项必须能追溯到具体步骤或需求。

## 最新状态

- Overall: Global Verification Passed（步骤01—12）
- Last verified: 2026-07-17

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

### 步骤01：建立移动端页面与活动状态模型

- Date: 2026-07-17
- Scope: 移动端框架、状态栏/返回图标、车辆和活动Mock
- Command / Check: Node语法检查、应用内浏览器390 × 844页面检查
- Result: Pass
- Evidence: 页面标题为“专属活动”；移动框架宽390、高844；文档横向宽度390；两辆绑定车辆与五个活动数据已写入独立Mock
- Failure Count: 0
- Issues: None
- Next Action: 进入步骤02

### 步骤02：实现聚合页与VIN联动

- Date: 2026-07-17
- Scope: SA来源、默认车辆、三级分区、活动状态、复选和VIN切换
- Command / Check: 应用内浏览器390 × 844 DOM与点击检查
- Result: Pass
- Evidence: 默认车辆为轩逸·粤A·8D23；3个活动分区、5张活动卡、3项默认勾选、2项置灰；切换天籁后4项默认勾选、1项已参与，认证级状态由需认证变为可参与；页面无横向溢出
- Failure Count: 0
- Issues: None
- Next Action: 进入步骤03

### 步骤03：实现一键参与与结果反馈

- Date: 2026-07-17
- Scope: 复选状态、底部按钮、一键执行、直接发券、自动抽奖、结果弹层
- Command / Check: 应用内浏览器复选与主路径点击检查
- Result: Pass
- Evidence: 取消/恢复一项后按钮数量由3变2再变3；一键参与后统一结果弹层展示3条结果，其中含2条领取成功和1条抽奖成功；活动卡片更新为已参与，按钮变为禁用状态；结果弹层提供“查看我的卡券”入口
- Failure Count: 0
- Issues: None
- Next Action: 进入步骤04

### 步骤04：绑车/认证外跳提示与交付文档

- Date: 2026-07-17
- Scope: 去绑车、去认证、不回跳提示、功能说明、README、标注按钮避让
- Command / Check: Node语法检查、应用内浏览器弹层检查、静态关键词检查
- Result: Pass
- Evidence: 去绑车和去认证均提示“不会自动返回”及“重新扫描SA二维码”；确认后反馈进入相应外部流程；标注系统只有1个按钮、0个业务标注点；未配置文件写回
- Failure Count: 0
- Issues: None
- Next Action: 全局验证

### 全局验证：390 × 844主路径与视觉对照

- Date: 2026-07-17
- Scope: 默认页、多VIN、复选、一键参与、结果、外跳、资源、响应式和视觉复用
- Command / Check: 应用内浏览器完整路径；375 × 812同尺寸视觉对照；JS语法与资源检查
- Result: Pass
- Evidence: 默认5张卡、3项勾选、2项置灰；第二辆VIN切换后4项勾选、1项已参与；一键参与产生4条结果并含卡包入口；主按钮完整位于视口内；390px无横向溢出；状态栏和返回图标加载成功；视觉QA见`design-qa.md`
- Failure Count: 1（首次标注按钮覆盖返回区域，调整位置后通过）
- Issues: None
- Next Action: Handoff

### 步骤05：SA选择活动与二维码生成闭环

- Date: 2026-07-17
- Scope: SA只读身份、三级可投活动、全选/逐项选择、二维码、冻结快照、扫码串联
- Command / Check: Node语法检查；应用内浏览器390 × 844完整路径；同图视觉对照；控制台日志检查
- Result: Pass
- Evidence: SA页展示5张可投活动卡并默认勾选5项；全选可切换为0项且生成按钮禁用；取消1项后按钮显示“生成动态二维码（4项）”；二维码页显示1张真实PNG码、4条冻结活动、V3快照和sceneId；模拟扫码后客户页只展示4张卡并默认勾选3项；390px无横向溢出；控制台日志为空；视觉证据见`qa/comparison-sa-select.png`
- Failure Count: 1（一键参与结果弹层首次被路由渲染的延迟清理移除，调整弹层关闭时机后复验通过）
- Issues: None
- Next Action: Handoff

### 步骤06：我的SA数据概览与活动下钻

- Date: 2026-07-17
- Scope: 本人数据隔离、概览指标、时间范围、活动列表、活动详情和参与记录详情
- Command / Check: Node语法检查；应用内浏览器390 × 844逐页DOM、点击、返回和脱敏检查
- Result: Pass
- Evidence: 概览展示4个核心指标、4个转化/使用指标和近7日趋势；近7日/近30日切换后指标由`328/186/241/96`切换为`96/58/75/21`；活动列表3项，可进入活动详情并继续下钻参与记录；手机号码`136****7721`与VIN`LVH******4528`均脱敏；页面无用户统一标识值及导出入口；截图见`qa/page-complete-20260717/01—04`。
- Failure Count: 0
- Issues: None
- Next Action: 进入步骤07

### 步骤07：卡券下钻与二维码逆向状态

- Date: 2026-07-17
- Scope: 卡券列表/详情、重新生成、旧码失效/过期、无可投活动、活动提交前下线
- Command / Check: 应用内浏览器390 × 844路由、弹层和结果校验
- Result: Pass
- Evidence: 卡券列表3项，可进入汇总详情并展示3条最近生命周期；重新生成由`SCN-20260717-10086-0089 / V3`更新为`...0090 / V4`，旧码扫码进入失效页；过期参数显示“二维码已过期”；空状态说明准入原因并提供重新加载；活动下线场景反馈“2项成功，1项未处理”，其他有效活动继续执行；截图见`qa/page-complete-20260717/05—09`。
- Failure Count: 0
- Issues: None
- Next Action: 进入步骤08

### 步骤08：全页面导航与全局复验

- Date: 2026-07-17
- Scope: 12个主演示路由、原主路径、复选状态、资源、响应式、标注兼容和交付文档
- Command / Check: 390 × 844逐路由检查；SA选活动→生成4项快照→用户聚合页3项默认勾选→取消1项→一键执行2项；资源/控制台/标注检查
- Result: Pass
- Evidence: 12个路由均有标题和有效正文，移动框架固定390 × 844且无横向溢出，所有图片加载成功，控制台无错误日志；SA活动全选可清空至0项并禁用生成按钮，单项取消后生成4项快照，客户页仅展示4张活动卡且3项默认勾选；标注运行时仅1个显隐按钮、0个业务标注点，`annotations.js`保持空数据。
- Failure Count: 1（首次回归发现复选框在click阶段读取旧值；改为change事件后，全选、单选和客户侧复选均复验通过）
- Issues: None
- Next Action: Handoff

### 步骤09：SA选活动详情与标签统一

- Date: 2026-07-17
- Scope: SA活动卡片详情入口、活动基本信息/规则/关联卡券/关联权益/互斥说明、活动标签
- Command / Check: Node语法检查；应用内浏览器390 × 844活动卡片点击、详情DOM和返回状态检查
- Result: Pass
- Evidence: “夏日车主礼”卡片正文可进入活动详情；详情包含活动时间、适用品牌、主办方、3条规则、2张关联券、1项关联权益和号码级互斥说明；返回后仍保持5项勾选；SA选择页和用户聚合页仅显示“领券/抽奖”。
- Failure Count: 0
- Issues: None
- Next Action: 进入步骤10

### 步骤10：用户端活动互斥校验

- Date: 2026-07-17
- Scope: 互斥组默认勾选、自动切换、提示、提交复核和参与后锁定
- Command / Check: 应用内浏览器390 × 844默认状态、复选切换、一键参与和参与后卡片状态检查
- Result: Pass
- Evidence: 号码级互斥组默认仅勾选`ACT-SA-20260705`，默认总计2项；改选`ACT-SA-20260703`后原项自动取消并提示“互斥活动不可同时参与”；一键参与只执行抽奖活动与绑车级活动共2项；完成后抽奖活动显示“已参与”，同组“夏日车主礼”显示“互斥已参与”并禁用。
- Failure Count: 0
- Issues: None
- Next Action: 进入步骤11

### 步骤11：卡券核销口径与双端全局回归

- Date: 2026-07-17
- Scope: 移动端卡券列表/详情、后台卡券总览/领取/核销、资源版本、文档和控制台
- Command / Check: Node与JSON语法检查；静态残留词扫描；应用内浏览器移动端和后台逐页DOM检查；控制台日志检查
- Result: Pass
- Evidence: 移动端卡券列表使用“发放/已核销/核销率”，详情使用“发放数/已核销/已失效/核销率”，页面不含“已使用/使用率”；390px页面宽度无横向溢出；后台卡券总览表头为核销数/核销率，排行改为来源SA卡券核销排行；领取页状态为未激活/已激活/已核销/已过期；核销页显示“实际核销用户”；两个原型console均无warning/error。
- Failure Count: 0
- Issues: None
- Next Action: Handoff

### 步骤12：调整SA视觉、活动详情与卡券状态

- Date: 2026-07-17
- Scope: SA路由蓝色主题、用户路由红色主题、SA选活动详情字段、SA卡券状态、标注运行时主题兼容
- Command / Check: Node语法检查；静态残留词扫描；应用内浏览器390 × 844逐路由计算样式、DOM、宽度和控制台检查
- Result: Pass
- Evidence: `#sa-select`、`#sa-select-activity-detail`、`#sa-coupon-list`的主色变量均为`#2f80c5`，主按钮与详情头图均为蓝色；`#activity-aggregation`主色仍为`#c90732`且主按钮保持红色；活动详情基本信息仅展示活动时间、适用品牌、适用范围、领券方式，不包含主办方或执行方式；三张SA卡券列表状态均为已生效，详情头显示“号码级 · 已生效”；390px无横向溢出；console无warning/error；标注开关跟随当前路由主色且业务标注数据仍为空。
- Failure Count: 0
- Issues: None
- Next Action: Handoff

### 步骤13：组合活动与按VIN展示

- Date: 2026-08-10
- Scope: SA选择、用户未绑车/已绑车、组合活动卡片、VIN切换、参与唯一键
- Command / Check: 应用内浏览器390 × 844交互与DOM检查
- Result: Pass
- Evidence: SA选择页展示6张活动卡，其中组合活动只占1张；用户未绑车时组合活动卡片置灰且不展示任何具体券内容，只提供“去绑车”；绑定默认VIN后在同一张卡片内展示该VIN命中的100元券，切换第二VIN后刷新为80元券；页面未泄露“留存/流失/复购”分群名称；第二VIN参与后显示已参与，切回第一VIN仍可参与，符合`组合活动ID + VIN`唯一键。
- Failure Count: 0
- Issues: None
- Next Action: 进入步骤14

### 步骤14：生成前选择二维码有效时长

- Date: 2026-08-10
- Scope: 首次生成、取消、默认值、重新生成、快照和旧码失效
- Command / Check: 应用内浏览器抽屉与二维码结果检查
- Result: Pass
- Evidence: 点击生成先打开有效时长抽屉，6个候选项中默认30分钟已勾选；取消后不生成二维码；选择1小时确认后二维码结果展示有效时长、配置版本和对应过期时间；重新生成再次打开抽屉且默认仍按当前后台默认值勾选，选择5分钟后生成新sceneId并令旧码失效；每张码独立冻结durationMinutes/generatedAt/expiresAt/configVersion。
- Failure Count: 0
- Issues: None
- Next Action: 全局回归

### 全局验证：组合活动与二维码时长回归

- Date: 2026-08-10
- Scope: 14个移动端路由、SA生成码、组合活动、VIN切换、资源与控制台
- Command / Check: 全量JavaScript语法检查、导航JSON解析、应用内浏览器逐路由巡检
- Result: Pass
- Evidence: 14个Hash路由均返回有效页面；二维码时长选择、取消、生成和重新生成路径通过；组合活动在用户端始终为一张卡，未绑车隐藏券、绑定后按当前VIN展示匹配券；浏览器错误日志为空。
- Failure Count: 0
- Issues: None
- Next Action: Handoff

### 步骤15：静态直接预览交付

- Date: 2026-08-10
- Scope: 移动端index本地资源、统一入口跳转、SA选择、二维码有效期抽屉和用户组合活动聚合页
- Command / Check: 静态资源引用检查；统一入口链接检查；HTTP模式浏览器DOM、交互、布局和console回归
- Result: Pass
- Evidence: 移动端index不加载导航JSON或远程接口，8个本地资源引用全部存在；统一静态入口进入`#sa-select`后展示6张活动卡且组合活动只有1张；生成按钮打开6个有效时长选项，30分钟默认勾选；`#activity-aggregation`中组合活动只有1张并展示匹配券，无页面级横向溢出；浏览器错误日志为空。
- Failure Count: 0
- Issues: 应用内浏览器自动化策略不允许直接访问file协议；通过源文件依赖检查证明入口无异步本地请求，并在同一静态文件HTTP模式下完成视觉与交互回归。
- Next Action: Handoff

### 步骤16：组合活动多子活动同时履约

- Date: 2026-08-10
- Scope: 默认VIN多子活动匹配、组合活动单卡片、一键参与结果、VIN切换、移动端布局和console
- Command / Check: JavaScript语法检查；旧阻断文案扫描；应用内浏览器DOM、点击、截图、宽度和console检查；本地资源完整性检查
- Result: Pass
- Evidence: 默认VIN下组合活动卡片数为1，卡片明确“命中2个子活动”，展示专属保养抵扣券100元、专属回店抵扣券150元和免费车辆检测/空调系统检测两项权益；页面不展示人群包名称；一键参与结果明确“命中2个子活动，已全部发放”，完成后组合活动卡片标记一次已参与；切换第二VIN后组合活动仍可参与且仅展示其命中的1张券；组合卡片宽366px、高285px，无横向溢出；console无warning/error；HTTP资源均返200。
- Failure Count: 0
- Issues: 应用内浏览器自动化策略仍不允许访问file协议；本轮以入口本地资源完整性与无异步本地请求作为静态直开条件证据，以同份静态文件的HTTP模式完成视觉与交互验证。
- Next Action: Handoff

### 全局验证：多子活动同时履约与静态交付回归

- Date: 2026-08-10
- Scope: 组合活动绑车前后、默认/第二VIN、一键参与、资源、静态入口和运行错误
- Command / Check: 全量JavaScript语法检查；本地引用与统一入口目标检查；HTTP浏览器DOM、交互、响应宽度和console回归
- Result: Pass
- Evidence: 移动端index的8个本地资源与统一入口链接均存在；组合活动仍仅为一张大卡片；默认VIN汇总2个命中子活动，第二VIN汇总1个；组合活动参与状态仍按组合活动ID + VIN隔离；结果弹层统一展示所有发放结果；页面无横向溢出，浏览器错误日志为空。
- Failure Count: 0
- Issues: None
- Next Action: Handoff

### 步骤17：组合活动展示名称与SA门店过滤

- Date: 2026-08-10
- Scope: SA选择页、二维码冻结快照、用户聚合页、一键参与结果、门店过滤
- Command / Check: JavaScript语法检查；本地HTTP浏览器DOM与端到端点击；活动池数量、名称、冻结范围和console检查
- Result: Pass
- Evidence: Mock共7个活动，当前SA活动池过滤后为6个；已配置组合活动全链路显示“夏季专属成长礼”，不出现原名“2026夏季车主组合活动”；仅适用S003的“启辰秋季车主组合活动”不出现在SA选择页、二维码快照和用户聚合页；二维码快照为6项；默认VIN仍命中2个子活动并在结果中反馈全部发放；console为空。
- Failure Count: 0
- Issues: 当前浏览器执行环境不共享页面脚本全局变量，规则函数通过实际DOM结果和端到端冻结范围验证；file协议被浏览器安全策略阻止，未重新声称本轮file视觉验收。
- Next Action: Handoff

### 步骤18：未绑车时整体隐藏卡券区域

- Date: 2026-08-10
- Scope: 用户端组合活动未绑车卡片、默认VIN已绑车卡片、移动端布局、静态资源与控制台
- Command / Check: JavaScript语法检查；旧占位区类名与文案扫描；应用内浏览器430 × 932 DOM对照检查；本地资源引用存在性检查
- Result: Pass
- Evidence: 未绑车路由仍展示1张组合活动卡片，但`.combo-reward-hidden`、`.combo-reward-visible`和`.combo-reward-item`均为0，不包含“卡券内容待解锁”、绑定提示或具体卡券名称；组合活动复选框禁用且“去绑车”可见；已绑车默认VIN路由仍展示1个卡券区域与2条命中卡券，组合活动复选框可用；两个状态均无横向溢出，console无warning/error；8个本地资源引用全部存在。
- Failure Count: 0
- Issues: 应用内浏览器的全页截图未正确呈现页面内容，本轮以可访问DOM、计算布局、交互状态和控制台结果完成验收；静态入口仍为纯本地资源，可直接打开。
- Next Action: Handoff

### 全局验证：组合活动未绑车隐藏与已绑车展示回归

- Date: 2026-08-10
- Scope: 组合活动绑车前后、卡券区域、参与控件、资源版本和运行错误
- Command / Check: 源码与文档规则核对；JavaScript语法检查；HTTP模式浏览器DOM、响应宽度和console回归
- Result: Pass
- Evidence: 未绑车时只保留组合活动基本信息、禁用勾选和“去绑车”，卡券区域整体不渲染；绑定默认VIN后在原卡片内恢复展示2条匹配卡券；页面入口的8个静态资源版本统一为`20260810-4`，无旧占位区实现残留。
- Failure Count: 0
- Issues: None
- Next Action: Handoff

### 步骤19：SA活动分享海报与自定义上传

- Date: 2026-08-14
- Scope: 二维码结果入口、海报编辑、系统模板、SA上传底图、文案实时预览、最终预览与分享反馈
- Command / Check: JavaScript语法检查；应用内浏览器DOM、文件选择、来源切换、预览、保存/分享、布局与console检查
- Result: Pass
- Evidence: 二维码结果页可进入海报编辑；系统模板与自定义上传两种来源均可用；上传JPG/PNG底图后页面仍叠加当前二维码、陈晓明·SA10086、广州花都专营店和二维码有效期；标题、副标题、扫码引导语编辑后实时更新；最终预览保留上传底图与系统信息；保存到相册、分享给客户均有明确反馈；切回系统模板后上传底图不再渲染；console无warning/error。
- Failure Count: 1（首次验证使用了同时命中海报卡片和分享按钮的宽泛选择器，改为明确按钮后通过，属于验证脚本定位问题）
- Issues: None
- Next Action: 进入步骤20

### 步骤20：长期有效二维码与海报联动

- Date: 2026-08-14
- Scope: SA有效期抽屉、长期有效选择、二维码快照、实际截止时间和分享海报
- Command / Check: 应用内浏览器从SA选择页端到端生成；DOM、文案、冻结快照与海报联动检查
- Result: Pass
- Evidence: 有效期抽屉共展示7个候选项，30分钟默认勾选；选择“长期有效（至活动有效期）”后生成二维码，结果显示“有效期至09-15 23:59:59”“长期有效·QR-TTL-V6”；冻结范围仍为6项；进入海报编辑后显示“长期有效·至09-15 23:59:59”，二维码、SA、门店信息完整，上传入口仍可用。
- Failure Count: 0
- Issues: None
- Next Action: 全局回归

### 全局验证：分享海报、自定义上传与长期有效回归

- Date: 2026-08-14
- Scope: 移动端新增路由、二维码生成、海报编辑/预览、上传、静态资源和运行日志
- Command / Check: 全量JavaScript语法检查；导航JSON解析；本地资源引用检查；应用内浏览器端到端交互和console回归
- Result: Pass
- Evidence: `sa-poster-editor`与`sa-poster-preview`可独立进入；固定时长和长期有效两类二维码均可制作海报；模板/上传来源切换不修改sceneId或SA来源；海报三段文案可编辑；全部引用均为本地资源，静态入口无需部署服务即可打开；浏览器warning/error日志为空。
- Failure Count: 0
- Issues: None
- Next Action: Handoff

### 步骤21：移除客户海报内部状态文案

- Date: 2026-08-14
- Scope: 海报共用组件、编辑页、最终预览、系统模板与上传底图共用渲染路径
- Command / Check: 源码全文扫描；JavaScript语法检查；应用内浏览器编辑页与最终预览DOM、二维码、SA来源、有效期和console检查
- Result: Pass
- Evidence: 实现与文档中已无“二维码与活动范围已锁定”客户展示文案；编辑页和`sa-poster-preview`均返回该文案0处，同时保留活动二维码、陈晓明·SA10086、广州花都专营店和二维码有效期；系统模板与上传底图复用同一`renderSharePoster`组件，因此两种来源同步生效；浏览器warning/error日志为空。
- Failure Count: 2（当前浏览器连接未暴露文件上传接口；尝试在页面执行环境构造File时相关全局对象不可用。该限制不影响本次共用组件文案移除的验证，上传功能已在上一步完成真实文件验证。）
- Issues: None
- Next Action: Handoff

### 步骤22：隐藏扫码用户活动等级表达

- Date: 2026-08-14
- Scope: 已绑车聚合页、未绑车聚合页、活动下线状态、绑车/认证升级提示、SA选择活动页回归
- Command / Check: JavaScript与标注语法检查；本地资源检查；应用内浏览器逐路由DOM、交互、视觉连续性和console检查
- Result: Pass
- Evidence: `activity-aggregation`展示1个连续列表和6张活动卡，三级分区标题、客户卡片等级标签均为0，默认勾选3项；`activity-aggregation-unbound`同样展示6张卡且无等级标题/标签，组合活动卡券区域仍为0、仅号码级可参与项默认勾选1项；绑车与认证提示均改为“系统将重新判断可参与活动”，不出现“绑车级活动/认证级活动”；`activity-aggregation-offline`同样无等级表达；SA选择页仍保留3个等级分区和6个等级标签。活动列表卡片间距8px，无分区残留空白；浏览器warning/error日志为空。
- Failure Count: 0
- Issues: None
- Next Action: Handoff
