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
