window.AnnotationData = {
  'activity-manage': [{
    id: 1,
    target: '.rule-alert.neutral',
    title: '原活动与SA投放解耦',
    position: {placement:'top-right',offsetX:-12,offsetY:8},
    sections: {
      functionName: '原活动配置边界',
      functionDesc: '原活动列表、创建编辑和详情不再维护SA分享资格。',
      permissionScope: '活动中心运营。',
      dataSource: '活动中心活动主数据。',
      valueLogic: '复制活动不复制SA投放关系。',
      fieldDesc: '原活动字段保持不变。',
      interactionDesc: '需要投放时进入独立SA活动配置。',
      judgeRule: '活动启用不等于自动进入SA可选池。',
      exceptionRule: '活动关闭后，既有码提交时实时拦截。',
      otherDesc: '准入与互斥仍在原活动页维护。'
    }
  }],
  'activity-create': [{
    id: 1,
    target: '[data-anno="access-config-panel"]',
    title: '复用活动准入配置',
    position: {placement:'top-right',offsetX:-16,offsetY:12},
    sections: {
      functionName: '活动准入配置',
      functionDesc: '沿用原活动页面的准入开关、准入等级和校验节点。',
      permissionScope: '活动中心运营。',
      dataSource: '原活动准入配置。',
      valueLogic: '号码级对应oneID，绑车级对应VIN，认证级对应认证关系。',
      fieldDesc: '是否启用、三级准入、四类校验节点。',
      interactionDesc: '确认后同步更新准入摘要和互斥主体口径。',
      judgeRule: 'SA链路只读取，不重复配置。',
      exceptionRule: '变更准入等级时清空不兼容的互斥活动。',
      otherDesc: '组合活动同样读取子活动原准入。'
    }
  }],
  'sa-placement-manage': [{
    id: 1,
    target: '[data-anno="sa-placement-list"]',
    title: '独立SA活动配置',
    position: {placement:'top-right',offsetX:-12,offsetY:8},
    sections: {
      functionName: 'SA投放配置',
      functionDesc: '统一配置普通活动和组合活动进入SA可选池。',
      permissionScope: 'SA活动运营管理员。',
      dataSource: '活动中心与组合活动中心；范围直接读取投放对象配置。',
      valueLogic: '一个配置关联一个普通活动或组合活动对象；组合活动显示名为空时回退原名。',
      fieldDesc: '对象类型、对象ID、SA展示名称、原名称、状态、活动时间；范围仅只读继承。',
      interactionDesc: '支持新增、编辑、查看、生效和停用。',
      judgeRule: '普通活动须为用户主动领券或抽奖链路。',
      exceptionRule: '后台统一推券和用户行为触发不进入候选池。',
      otherDesc: '本页不配置门店/SA范围；当前范围实时读取组合活动，未配置时按全部门店。'
    }
  }],
  'sa-placement-edit': [{
    id: 1,
    target: '.placement-snapshot',
    title: '组合活动名称与门店快照',
    position: {placement:'top-right',offsetX:-12,offsetY:8},
    sections: {
      functionName: '组合活动只读快照',
      functionDesc: '同步展示SA展示名称、原组合活动名称和适用门店。',
      permissionScope: 'SA活动运营管理员只读；字段在组合活动中维护。',
      dataSource: '组合活动主数据。',
      valueLogic: '展示名称优先，空值回退原名；门店空配置等同全部门店。',
      fieldDesc: 'displayName、name、storeScope、activityState。',
      interactionDesc: '更换投放对象后实时刷新快照。',
      judgeRule: '投放有效、组合启用、SA门店命中三项取交集。',
      exceptionRule: '门店未命中时不向该SA展示，也不可分享。',
      otherDesc: '门店范围不修改子活动与卡券核销门店。'
    }
  }],
  'sa-qr-settings': [{
    id: 1,
    target: '[data-anno="qr-duration-settings"]',
    title: '二维码有效时长',
    position: {placement:'top-right',offsetX:-12,offsetY:8},
    sections: {
      functionName: '二维码时长参数',
      functionDesc: '配置SA生成前可选择的固定时长、长期有效选项和默认值。',
      permissionScope: 'SA活动运营管理员。',
      dataSource: 'SA二维码参数配置。',
      valueLogic: '固定时长范围5—1440分钟；长期有效截止到冻结活动中最晚结束时间；默认值必须属于候选集合。',
      fieldDesc: '固定候选时长、长期有效、默认值、配置版本。',
      interactionDesc: '保存后只影响新生成二维码。',
      judgeRule: '至少保留一个候选项。',
      exceptionRule: '既有码不回写新参数。',
      otherDesc: '固定模式保存durationMinutes；长期模式保存ACTIVITY_END并计算expiresAt。'
    }
  }]
};

(function () {
  'use strict';

  function metricAnnotation(id, target, title, details) {
    var sections = {
      functionName: title,
      functionDesc: '',
      permissionScope: '按当前登录账号的总部、区域和来源门店授权范围统计；页面中的手机号、VIN和oneID均脱敏。',
      dataSource: '',
      valueLogic: '',
      fieldDesc: '',
      interactionDesc: '受当前页已确认的筛选条件影响；多活动条件内部按“或”，与其他条件按“且”。',
      judgeRule: '',
      exceptionRule: '',
      otherDesc: '当前页面为静态Mock演示，数字不会随筛选实时联算，也不证明正式聚合接口、同步频率或生产数据已经实现。'
    };
    Object.keys(details || {}).forEach(function (key) { sections[key] = details[key]; });
    return {
      id: String(id),
      target: '[data-anno="' + target + '"]',
      title: title,
      position: {placement:'top-right',offsetX:-8,offsetY:6},
      sections: sections
    };
  }

  window.AnnotationData['activity-overview'] = [
    metricAnnotation(1, 'activity-overview-stat-time', '统计时间如何作用', {
      functionDesc: '限定总览中各指标所取业务事实的发生时间，不直接按页面打开时间计算。',
      dataSource: '二维码生成记录、扫码记录、活动参与记录和券实例领取记录。',
      valueLogic: '生成二维码数取生成时间；扫码UV取扫码时间；活动参与数取参与完成时间；发券数取券实例领取时间。',
      fieldDesc: '开始时间和结束时间均计入统计区间。',
      judgeRule: '同一统计区间内，各指标按自己的业务发生时间入账。',
      exceptionRule: '总览同时展示多类业务时间，是否要求统一数据截止批次仍需研发/数据评审确认。'
    }),
    metricAnnotation(2, 'activity-overview-kpi-qr', '生成二维码数', {
      functionDesc: '统计筛选范围内生成的二维码场景数量。',
      dataSource: '二维码场景生成记录。',
      valueLogic: '生成二维码数 = 统计期内去重后的sceneId数量；同一码重复保存不新增sceneId，因此只计1个。',
      fieldDesc: '当前演示值128表示128个不同sceneId，不是扫码次数。',
      interactionDesc: '点击指标进入二维码明细；活动筛选按二维码冻结活动快照是否命中所选活动过滤。',
      judgeRule: '一个sceneId只计一次；同一SA可以生成多个不同sceneId。',
      exceptionRule: '同一二维码包含多个已选活动时仍只计1个sceneId，不按活动数重复。'
    }),
    metricAnnotation(3, 'activity-overview-kpi-scan', '扫码UV', {
      functionDesc: '统计有可识别oneID的独立扫码用户规模。',
      dataSource: '二维码扫码记录及扫码时识别到的oneID。',
      valueLogic: '扫码UV = 按“sceneId + oneID”去重后的数量；同一oneID扫同一码多次计1个，扫不同二维码可分别计数。',
      fieldDesc: '当前演示值3,240；下方“识别成功3,118”为另一个演示数字。',
      judgeRule: '未取得oneID的扫码只计PV，不计UV。',
      exceptionRule: '按已确认规则，UV已经依赖oneID识别；当前页面又单列较小的“识别成功”数，二者差异缺少正式定义，需甲方/数据评审统一。'
    }),
    metricAnnotation(4, 'activity-overview-kpi-participation', '活动参与数', {
      functionDesc: '统计已完成执行且已确认来源的活动参与主体数量。',
      dataSource: '活动参与记录。',
      valueLogic: '普通活动按参与唯一键去重：号码级=活动ID+oneID；绑车级=活动ID+VIN；认证级=活动ID+oneID+认证VIN。',
      fieldDesc: '当前演示值1,126；直接领券成功、抽奖中奖和抽奖未中奖均属于已完成参与。',
      judgeRule: '未勾选、未执行、准入未通过或执行未完成不计入。组合活动业务防重为组合活动ID+VIN，报表按命中子活动拆分计数。',
      exceptionRule: '下一期口径要求区分“成功参与记录数”和“参与主体数”；本P0当前只显示一个活动参与数，正式拆分方式待落地。'
    }),
    metricAnnotation(5, 'activity-overview-kpi-coupon', '发放卡券数', {
      functionDesc: '统计由SA来源活动成功生成的券实例数量。',
      dataSource: '与活动参与记录关联的券实例领取记录。',
      valueLogic: '发放卡券数 = 成功生成并关联来源参与记录的券实例ID数量；一条参与记录发2张券计2。',
      fieldDesc: '当前演示值1,986；统计券实例，不统计券模板种类。',
      judgeRule: '抽奖未中奖发券数为0；VIN共享券只按一个券实例计1张，不按可绑定oneID数量放大。',
      exceptionRule: '卡券后续核销、撤销或退款不回改本次发放数和来源快照。'
    }),
    metricAnnotation(6, 'activity-overview-kpi-rate', 'SA活动转化率', {
      functionDesc: '说明当前原型34.8%的实际计算方式，并显式保留正式口径冲突。',
      dataSource: '当前页活动参与数和扫码UV演示值。',
      valueLogic: '当前原型：SA活动转化率 = 活动参与数 ÷ 扫码UV × 100%，四舍五入保留1位小数；34.8% = 1,126 ÷ 3,240。',
      fieldDesc: '汇总表同样按本行参与数÷本行扫码UV计算，例如286÷748=38.2%。',
      judgeRule: '分母为0时不直接相除，正式展示“-”还是0%待统一。',
      exceptionRule: '既有业务规则文档曾写“参与主体数÷成功识别用户数”；若用1,126÷3,118则为36.1%，与当前34.8%不一致。此处只解释现页面，正式分母需甲方二次确认。',
      otherDesc: '未擅自修改Mock数值；确认正式口径后应同时更新KPI、汇总表、导出和接口说明。'
    }),
    metricAnnotation(7, 'activity-overview-trend', '近7日转化趋势', {
      functionDesc: '按自然日展示扫码UV与活动参与数两组日指标。',
      dataSource: '扫码记录和活动参与记录。',
      valueLogic: '每根扫码柱按当日sceneId+oneID去重；每根参与柱按当日对应活动参与唯一键去重。7天演示值分别合计3,240和1,126。',
      fieldDesc: '横轴为日期；浅蓝为扫码UV，深蓝为活动参与数。',
      judgeRule: '扫码按扫码发生日，参与按参与完成日；同一主体跨日完成时分别落入各自业务日期。',
      exceptionRule: '该图是两组独立日事实对比，不代表同一批用户的严格漏斗队列。'
    }),
    metricAnnotation(8, 'activity-overview-rank', '来源SA活动参与排行', {
      functionDesc: '按来源SA汇总已完成参与记录并从高到低排名。',
      dataSource: '最终成功触点已确认的活动参与记录及二维码生成时来源SA快照。',
      valueLogic: '排行值 = 统计范围内归属该SA的成功参与记录数；当前页面只展示前5名。',
      fieldDesc: '286、241等为参与记录数，不是扫码人数或发券数。',
      judgeRule: '来源按最终成功执行触点确认；后续SA改名、调店不回写历史快照。',
      exceptionRule: '前5名之和不等于总参与数，其余SA未展示；并列排名规则待正式报表确认。'
    }),
    metricAnnotation(9, 'activity-overview-table-scan-uv', '汇总表扫码UV', {
      functionDesc: '按“来源SA + 活动”汇总扫码独立用户。',
      dataSource: '包含该活动的二维码冻结快照及其扫码记录。',
      valueLogic: '本行扫码UV按相关sceneId内oneID去重后汇总；同一oneID扫同一码多次不重复。',
      fieldDesc: '例如748表示该SA来源且关联本活动的扫码UV演示值。',
      judgeRule: '活动多选只保留命中任一所选活动的汇总行。',
      exceptionRule: '同一二维码包含多个活动时，扫码如何在活动行间分摊尚无正式数据规则；汇总行不可直接相加反推全局UV。'
    }),
    metricAnnotation(10, 'activity-overview-table-eligible', '符合准入主体', {
      functionDesc: '统计通过当前活动准入等级和准入表达校验的参与主体。',
      dataSource: '活动准入配置、校验节点结果、oneID及车辆/认证关系快照。',
      valueLogic: '按活动级别去重：号码级按oneID、绑车级按VIN、认证级按oneID+认证VIN；仅保留校验通过主体。',
      fieldDesc: '该列是可参与主体规模，不等于已实际参与数。',
      judgeRule: '活动在不同节点校验时，以相应节点执行时的快照结果为准。',
      exceptionRule: '重复校验、资格变化以及多节点命中取哪次结果尚未形成正式聚合规则，当前数为演示。'
    }),
    metricAnnotation(11, 'activity-overview-table-participation', '汇总表活动参与数', {
      functionDesc: '统计本SA、本活动下已完成执行并确认来源的参与主体。',
      dataSource: '活动参与记录。',
      valueLogic: '按本活动对应唯一键去重；号码级=活动ID+oneID，绑车级=活动ID+VIN，认证级=活动ID+oneID+认证VIN。',
      fieldDesc: '点击数字进入活动参与明细；未中奖也属于抽奖活动完成。',
      judgeRule: '同一主体对同一活动最多计1次，参与不同活动可分别计数。',
      exceptionRule: '组合活动在报表中按命中子活动拆分，同一VIN命中多个子活动时各子活动可分别计1。'
    }),
    metricAnnotation(12, 'activity-overview-table-coupons', '汇总表发券数', {
      functionDesc: '统计本SA、本活动参与记录关联的券实例数量。',
      dataSource: '活动参与记录与券实例的关联关系。',
      valueLogic: '对关联券实例ID计数；一条参与记录关联N张券时计N张。',
      fieldDesc: '发券数可以大于参与数；抽奖未中奖记录贡献0张。',
      judgeRule: 'VIN共享券实例仍只计1张。',
      exceptionRule: '该值不表示已核销或已使用，卡券完成使用只看核销成功。'
    }),
    metricAnnotation(13, 'activity-overview-table-rate', '汇总表转化率', {
      functionDesc: '按每一汇总行计算活动参与转化。',
      dataSource: '本行活动参与数和本行扫码UV。',
      valueLogic: '当前原型：转化率 = 本行活动参与数 ÷ 本行扫码UV × 100%，保留1位小数。',
      fieldDesc: '例如陈晓明行：286÷748=38.2%。',
      judgeRule: '分母为0时正式空值规则待确认。',
      exceptionRule: '该公式沿用当前页面演示算法；与“参与主体数÷成功识别用户数”的文档口径冲突，需与顶部转化率一并确认。'
    }),
    metricAnnotation(14, 'activity-overview-table-last', '最后参与时间', {
      functionDesc: '展示本汇总分组内最近一次活动完成时间。',
      dataSource: '本行纳入统计的活动参与记录。',
      valueLogic: '最后参与时间 = MAX（本SA + 本活动分组内的参与完成时间）。',
      fieldDesc: '不是二维码生成时间、扫码时间或报表更新时间。',
      judgeRule: '只在当前筛选范围和数据权限范围内取最大值。',
      exceptionRule: '迟到数据或重跑后是否回刷该时间，取决于正式报表同步机制。'
    })
  ];

  window.AnnotationData['activity-qr'] = [
    metricAnnotation(1, 'activity-qr-generated-filter', '二维码明细统计时间', {
      functionDesc: '二维码明细按二维码生成时间筛选。',
      dataSource: '二维码场景生成记录。',
      valueLogic: '仅展示generatedAt落入开始时间至结束时间的sceneId。',
      fieldDesc: '失效时间不作为本页时间筛选字段。',
      interactionDesc: '与sceneId、状态、来源SA、门店、活动范围和活动ID等条件按“且”组合。',
      judgeRule: '开始和结束边界均包含。',
      exceptionRule: '正式时区、秒级边界和跨日批次由接口合同确认。'
    }),
    metricAnnotation(2, 'activity-qr-frozen-count', '冻结活动数/版本', {
      functionDesc: '说明二维码生成时锁定了多少个活动及使用的快照版本。',
      dataSource: '二维码生成时保存的活动ID集合和快照版本。',
      valueLogic: '冻结活动数 = 快照内去重后的活动ID数量；版本为该次冻结配置版本，不参与加总。',
      fieldDesc: '例如“4 / V3”表示冻结4个活动，快照版本为V3。',
      interactionDesc: '点击sceneId或查看可展开活动冻结快照。',
      judgeRule: '二维码生成后参数调整不回写既有码快照。',
      exceptionRule: '活动自身结束或下线仍可在扫码时实时过滤，但不改变历史冻结数量。'
    }),
    metricAnnotation(3, 'activity-qr-generated-time', '二维码生成时间', {
      functionDesc: '记录sceneId成功生成的业务时间。',
      dataSource: '二维码场景记录。',
      valueLogic: '一个sceneId只有一个生成时间；数据总览“生成二维码数”和本页时间筛选均使用该时间。',
      fieldDesc: '不是SA第一次分享时间，也不是用户第一次扫码时间。',
      judgeRule: '同一码重复保存不产生新的sceneId和生成时间。',
      exceptionRule: '重新创建新sceneId时产生新的生成时间，旧码记录保留。'
    }),
    metricAnnotation(4, 'activity-qr-expire-time', '二维码失效时间', {
      functionDesc: '记录二维码从何时起不再有效。',
      dataSource: '二维码生成参数、生成时间及活动有效期快照。',
      valueLogic: '固定时长：失效时间=生成时间+所选分钟数；长期有效：取本次冻结活动中最晚结束时间。',
      fieldDesc: '固定候选时长为5分钟至1天；长期有效截止活动有效期。',
      judgeRule: '各活动仍按自己的结束/下线状态实时过滤，不能用二维码较晚失效时间延长活动。',
      exceptionRule: '既有码不因后台时长参数变更而重算。'
    }),
    metricAnnotation(5, 'activity-qr-status', '二维码状态', {
      functionDesc: '根据失效时间展示当前二维码是否仍有效。',
      dataSource: '二维码失效时间和当前系统时间。',
      valueLogic: '当前时间早于失效时间显示“有效”；达到或超过失效时间显示“已过期”。',
      fieldDesc: '本页只保留“有效、已过期”两种状态。',
      judgeRule: '原“重新生成失效”不再作为独立报表枚举，历史记录按既有失效时间归入已过期。',
      exceptionRule: '本原型只收敛展示与Mock，不证明正式接口枚举或存量迁移已完成。'
    }),
    metricAnnotation(6, 'activity-qr-scan-pv-uv', '扫码PV/UV', {
      functionDesc: '同时展示该sceneId的总扫码次数和独立扫码用户数。',
      dataSource: '二维码扫码记录、scanId及扫码时识别到的oneID。',
      valueLogic: 'PV=该sceneId全部扫码记录数；UV=该sceneId内按oneID去重的数量。',
      fieldDesc: '例如“86 / 72”表示86次扫码、72个去重oneID。',
      judgeRule: '同一oneID多次扫同一码，PV累加、UV只计1；未识别oneID只计PV。',
      exceptionRule: '不同sceneId分别去重，同一oneID扫两个二维码可在两个二维码行中各计1个UV。'
    }),
    metricAnnotation(7, 'activity-qr-identified', '识别人数', {
      functionDesc: '当前页面用于展示二维码扫码后成功识别的人员演示数。',
      dataSource: '扫码识别结果。',
      valueLogic: '现有Mock把识别人数作为小于等于扫码UV的独立数展示，例如72个UV中识别69人。',
      fieldDesc: '该列与扫码UV的正式差异尚未定义。',
      judgeRule: '已确认的UV规则本身已经按oneID去重，未识别oneID不计UV。',
      exceptionRule: '因此按现有已确认规则，识别人数理论上应与UV一致；当前差异需甲方确认是删除该列、调整UV定义，还是补充另一层识别成功定义。',
      otherDesc: '本轮保留原Mock数字，只把口径冲突透明标出。'
    }),
    metricAnnotation(8, 'activity-qr-participation', '二维码参与数', {
      functionDesc: '统计最终来源归属于该sceneId的已完成活动参与。',
      dataSource: '带sceneId来源快照的活动参与记录。',
      valueLogic: '对本sceneId关联的已完成参与按活动参与唯一键计数；同一用户在一个二维码中完成不同活动可分别计数。',
      fieldDesc: '参与数不是扫码人数，可能因一人参与多个活动而高于独立参与用户数。',
      judgeRule: '扫码和浏览不确认来源，只有活动成功执行时才把参与归入该sceneId。',
      exceptionRule: '已参与活动不能被后续SA二维码覆盖来源。'
    }),
    metricAnnotation(9, 'activity-qr-coupons', '二维码发券数', {
      functionDesc: '统计最终来源归属于该sceneId的券实例数量。',
      dataSource: '继承sceneId来源快照的券实例记录。',
      valueLogic: '发券数 = 该sceneId下成功生成的券实例ID数量；一条参与记录发多张券逐张计数。',
      fieldDesc: '发券数可大于参与数；抽奖未中奖贡献0张。',
      judgeRule: '券实例后续核销、撤销或退款不改变来源sceneId。',
      exceptionRule: 'VIN共享券只计一个券实例，不按可绑定oneID数重复。'
    })
  ];

  window.AnnotationData['activity-participation'] = [
    metricAnnotation(1, 'activity-participation-time-filter', '参与明细统计时间', {
      functionDesc: '参与明细按活动参与完成时间筛选。',
      dataSource: '活动参与记录。',
      valueLogic: '仅展示参与完成时间落入所选区间的记录。',
      fieldDesc: '不按扫码时间、二维码生成时间或来源确认后续更新时间筛选。',
      interactionDesc: '活动多选内部按“或”，与来源SA、门店、级别、执行方式、手机号、VIN、sceneId和结果按“且”。',
      judgeRule: '开始和结束边界均包含。',
      exceptionRule: '正式时区、迟到数据和重跑回补规则仍需研发/数据评审。'
    }),
    metricAnnotation(2, 'activity-participation-subject', '参与主体与去重键', {
      functionDesc: '展示并决定本活动以哪个业务主体防重和计数。',
      dataSource: '活动准入级别、oneID、执行VIN和认证关系快照。',
      valueLogic: '号码级唯一键=活动ID+oneID；绑车级=活动ID+VIN；认证级=活动ID+oneID+认证VIN。',
      fieldDesc: '页面只展示脱敏主体摘要，后台计数使用完整业务键。',
      judgeRule: '同一主体对同一活动最多参与一次；同一用户/VIN参加不同活动可分别计数。',
      exceptionRule: '组合活动整体防重键=组合活动ID+VIN；报表按命中子活动拆分，同一VIN可在多个子活动行分别计数。'
    }),
    metricAnnotation(3, 'activity-participation-time', '参与时间', {
      functionDesc: '记录活动执行完成的业务时间。',
      dataSource: '活动执行结果和参与记录。',
      valueLogic: '直接领券取领取执行完成时间；抽奖取抽奖结果生成时间。',
      fieldDesc: '中奖、未中奖均有参与时间；未中奖仍是一条已完成参与。',
      judgeRule: '只有已执行并形成最终结果才生成参与记录。',
      exceptionRule: '该时间与来源确认时间当前通常相同，但二者业务含义不同，仍分别保存。'
    }),
    metricAnnotation(4, 'activity-participation-confirmed-time', '来源确认时间', {
      functionDesc: '记录最后触点来源被正式锁定的时间。',
      dataSource: '活动成功执行时的来源确认记录。',
      valueLogic: '用户通过某sceneId完成活动时，以该最终成功执行触点确认SA、门店、sceneId和scanId，并记录确认时间。',
      fieldDesc: '不是第一次扫码时间，也不是二维码生成时间。',
      judgeRule: '前面扫过多少个SA码都不直接归因；未勾选或未执行活动不产生来源确认。',
      exceptionRule: '已参与活动和已生成券实例不能被后续二维码覆盖来源。'
    }),
    metricAnnotation(5, 'activity-participation-result', '参与结果如何计数', {
      functionDesc: '说明哪些结果属于活动已完成并计入参与数。',
      dataSource: '直接领券或抽奖执行结果。',
      valueLogic: '直接领券成功、抽奖中奖、抽奖未中奖都形成已完成参与记录并计1次；未中奖发券数为0。',
      fieldDesc: '结果用于区分业务结果，不等同于是否计入参与。',
      judgeRule: '准入未通过、互斥拦截、未执行或中途退出不生成已完成参与记录。',
      exceptionRule: '本原型按用户确认不展开“发券失败”场景，正式异常状态及补偿另行设计。'
    }),
    metricAnnotation(6, 'activity-participation-coupons', '参与记录发券数', {
      functionDesc: '统计当前参与流水实际关联了多少个券实例。',
      dataSource: '参与记录与券实例ID的1:N关联。',
      valueLogic: '发券数 = 当前参与流水关联的券实例ID数量；关联2个实例显示2，抽奖未中奖显示0。',
      fieldDesc: '统计券实例，不统计券模板种类，也不表示已核销数量。',
      interactionDesc: '打开参与详情可查看并跳转关联券实例。',
      judgeRule: '普通活动一条参与记录可关联N张券；组合活动还保留父参与记录与子活动执行关系。',
      exceptionRule: '券实例后续状态变化不回改参与时发券数。'
    })
  ];
})();
