(function () {
  'use strict';

  function note(id, target, title, functionName, functionDesc, dataSource, interactionDesc, judgeRule, exceptionRule) {
    return {
      id: id,
      target: target,
      title: title,
      position: {placement:'top-right',offsetX:-2,offsetY:2},
      sections: {
        functionName: functionName,
        functionDesc: functionDesc,
        permissionScope: 'PM、研发、测试、运营评审人员；本静态原型不连接真实权限系统。',
        dataSource: dataSource,
        valueLogic: 'SIT 当前页面结构优先；Axure 仅补充未安全触发的条件分支和历史规则。',
        fieldDesc: '字段名称与展示结构来自当前证据；记录值为演示 Mock。',
        interactionDesc: interactionDesc,
        judgeRule: judgeRule,
        exceptionRule: exceptionRule,
        otherDesc: '后续修改时同步更新 mock/data.js、docs/requirements.md 和本标注文件。'
      }
    };
  }

  var sourceNote = function (title, source) {
    return note(1,'[data-anno="source-strip"]',title + '证据口径','证据优先级说明','说明本页以 SIT 为准、Axure 为辅，并明确 Mock 数据边界。',source,'点击“标注与功能说明”可查看更完整的页面规则。','不得用 Axure 覆盖已确认的 SIT 现状。','SIT 无法安全触发的分支要保留“待确认”，不能猜测为已实现。');
  };

  var enumNote = function () {
    return note(3,'[data-anno="enum-cascade"]','下拉枚举与级联','查询枚举和父子联动','平铺已确认枚举；品牌→大区→小区→专营店、主场景→子场景等字段按上级选择动态刷新。','SIT 可见值与截图优先；Axure 业务场景切换辅助；组织数据为可验证演示子集。','选择上级字段后，下级清空并加载对应选项；重置会恢复全部级联初始态。','下级值不得脱离上级范围；业务场景切换同时影响卡券分类与适用范围。','没有已确认枚举时显示“暂无已确认枚举”并禁用，不用猜测值补齐。');
  };

  window.AnnotationData = {
    overview: [
      sourceNote('现状总览','SIT 菜单、活动中心 111 页 Axure、卡券中心 452 页 Axure。'),
      note(2,'[data-anno="module-map-panel"]','模块地图','后续修改入口','将活动中心 8 个核心页和卡券中心 13 个页面作为后续改造基线。','2026-07-16 SIT 菜单。','点击功能入口切换页面，URL hash 同步变化。','所有已纳入基线的核心页面都必须可从此处进入。','新增页面时必须同时加入导航和模块地图。'),
      note(3,'[data-anno="system-flow"]','系统边界标注','核心业务链路','每个步骤明确标记本系统操作或跨系统交互。','Axure 系统流程与 SIT 页面职责。','只读流程展示。','跨系统步骤必须同时写明发起方和接收方。','缺少交互对象时写“待确认”，不能省略。')
    ],
    'activity-list': [sourceNote('保客活动创建','SIT 保客活动创建列表；Axure 1.1 活动列表。'),note(2,'[data-anno="activity-table"]','活动列表与操作','保客活动查询','支持活动查询、查看、编辑以及后续的新建、复制、启停扩展。','SIT 页面与 Axure 活动列表。','查询刷新演示列表；查看/编辑打开原型弹窗。','首次提交后锁定字段不能在列表编辑中绕过。','无权限或状态不允许时应隐藏或禁用操作。'),enumNote()],
    'activity-editor': [sourceNote('活动新建/编辑','SIT 四步表单与页面配置；Axure 1.1.1~1.1.10。'),note(2,'[data-anno="activity-editor"]','活动配置四步','活动详情页','基础信息、关联卡券、活动对象、分享SEO及页面配置的统一动态表单。','SIT 页面 + Axure 条件分支。','点击步骤和页签切换配置区；保存动作只做原型提示。','触发方式、奖品和业务子版块共同决定字段显隐。','前置条件不满足时必须提示缺少项，不应只显示空白。')],
    'activity-combo': [
      sourceNote('组合活动','SIT 组合活动列表/新增；Axure 1.5；2026-08-10 已确认展示名称与适用门店增量。'),
      note(2,'[data-anno="result-table"]','组合活动列表','组合活动管理','列表同时展示组合活动名称、组合活动展示名称、渠道、活动数量和卡券数量。','SIT 只读检查 + 2026-08-11 用户确认。','新增、查看和编辑打开组合活动专用配置弹窗；展示名称未配置时列表显示“-”。','活动链接生成后不可修改。','素材或链接不完整时发布应拦截。'),
      note(3,'[data-anno="combo-editor-fields"]','组合活动展示名称','对外名称配置','新增选填展示名称，同时保留原组合活动名称作为后台主体名称。','组合活动配置。','在创建/编辑表单中直接配置，不再展示独立预览区。','展示名称非空时优先；空值回退原组合活动名称。','不得回退为子活动名称，历史数据无需补填。'),
      note(4,'[data-anno="combo-store-scope"]','组合活动适用门店','活动级门店范围','配置组合活动整体适用门店，并供SA动态二维码活动池过滤。','可用门店主数据。','支持配置、重新配置、清空；清空恢复全部门店。','零选择等同全部门店；指定门店只允许保存可用门店。','不修改子活动范围或卡券核销门店。'),
      note(5,'[data-anno="combo-store-selector"]','可用门店选择器','门店树选择','按品牌、省、市分组展示可用门店，支持搜索和已选查看。','门店主数据可用记录。','分组或单店勾选，确认回填数量与名称。','暂停营业、已停业等不可用门店不进入列表。','搜索无结果时显示空态，不展示营业状态标签。')
    ],
    'activity-benefit': [sourceNote('专属福利活动','SIT 专属福利列表/新增；Axure 福利页流程。'),note(2,'[data-anno="result-table"]','专属福利列表','福利页管理','管理露出时间、倒计时、人群包与页面素材。','SIT 只读检查。','新建按钮打开配置弹窗。','露出时间必须落在主活动时间内。','人群包不可用或素材缺失时需明确提示。')],
    'activity-exclusive': [sourceNote('互斥关系','SIT 活动互斥/卡券互斥页签；Axure 图2/图3/图9。'),note(2,'[data-anno="exclusive-tabs"]','两类互斥关系','售后活动规则查询','活动互斥与活动内卡券叠加/互斥分开查询。','SIT + Axure。','切换页签更新查询维度和列表字段。','不能与售前卡券中心独立叠加规则混写。','全部叠加/全部互斥在 SIT 列表不可审计，标记为待确认。')],
    'activity-qr': [sourceNote('一店一码','SIT 一店一码；Axure 1.2。'),note(2,'[data-anno="result-table"]','门店二维码','一店一码管理','按活动和门店生成页面地址及二维码。','SIT + Axure。','查看和下载仅模拟。','二维码必须绑定唯一活动、门店和渠道。','生成失败时应返回明确失败原因。')],
    'activity-report': [sourceNote('活动汇总表','SIT 汇总表；Axure 2.1。'),note(2,'[data-anno="result-table"]','活动统计','保客活动汇总','按活动统计 PV、UV、参与人数和转化。','SIT + Axure。','查询时间示意不超过3个月。','指标口径与明细必须一致。','超出时间范围应阻断并提示。')],
    'activity-trigger-report': [sourceNote('行为触发汇总','SIT 行为触发/激活/失效；Axure 2.2。'),note(2,'[data-anno="result-table"]','触发上报','行为触发追踪','按场景标识追踪上报成功、失败和最近时间。','SIT + Axure。','查询和详情仅模拟。','场景标识需同步中文含义与来源系统。','未知场景或上报失败需支持跨系统排查。')]
  };

  var couponPages = {
    'coupon-legacy-issue':['优惠券发放','历史模板式发券，SIT 414 条。','与新卡券发放主从关系待确认。'],
    'coupon-receive-record':['领券记录','SIT 本次暂无数据，表头 26 字段。','空态原因和批量领券记录入口待确认。'],
    'coupon-list':['卡券列表','SIT 列表空态，新建页可进入。','业务场景切换会改变车型、门店、商品范围。'],
    'coupon-limit':['卡券限额','SIT 28 条任务。','当前新建任务固定售前营销/在线购车。'],
    'coupon-after-report':['售后业务报表','SIT 总部汇总/明细。','店端报表不在 13 页范围。'],
    'coupon-business-report':['业务报表','SIT 在线购车统计。','新商城改造后统计维度需同步。'],
    'coupon-writeoff':['核销列表','SIT 36 个核销及补贴字段。','撤销与异常补偿需接口证据。'],
    'coupon-issue':['卡券发放','SIT 341 条任务。','建议未来作为主链路，仍待业务确认。'],
    'coupon-issue-record':['发放记录','SIT 13,302 条。','失败原因需可操作且导出要受权限控制。'],
    'coupon-rules':['卡券规则设置','SIT 225 条，实质为结算规则。','菜单名与实际能力范围不一致。'],
    'coupon-dealer-task':['经销商券任务记录','SIT 103 条任务。','批量禁用属于高风险动作。'],
    'coupon-batch':['批量操作优惠券','SIT 15 条历史任务。','未见批量领券记录变更能力。'],
    'coupon-redemption':['领券管理','SIT 日产 15 张券、总数据 4,492 条。','添加优惠券按钮禁用原因待确认。']
  };

  Object.keys(couponPages).forEach(function (key) {
    var item = couponPages[key];
    window.AnnotationData[key] = [
      sourceNote(item[0],item[1]),
      note(2,'[data-anno="coupon-table"]',item[0] + '列表',item[0],item[1],'2026-07-16 SIT 只读检查；历史 Axure 页面树。','查询、分页、查看、编辑、新建和导出均为静态原型交互。','字段结构需保持与 SIT 基线一致；后续变更必须有明确需求依据。',item[2]),
      enumNote()
    ];
  });
})();
