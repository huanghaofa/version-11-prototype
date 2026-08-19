window.AnnotationData = {
  'sa-select': [{
    id: 1,
    target: '[data-generate-qr]',
    title: '生成前选择有效期',
    position: {placement:'top-right',offsetX:-10,offsetY:8},
    sections: {
      functionName: '二维码有效期抽屉',
      functionDesc: '生成前从后台候选项选择固定时长或长期有效，默认值预选。',
      permissionScope: '当前登录SA。',
      dataSource: '后台SA二维码参数配置。',
      valueLogic: '固定时长仅允许5分钟至1天；长期有效截止到冻结活动中最晚结束时间。',
      fieldDesc: '有效期模式、时长、预计失效时间。',
      interactionDesc: '确认后生成；取消不生成。',
      judgeRule: '不可自由输入。',
      exceptionRule: '重新生成时再次选择。',
      otherDesc: '参数变更只影响新码；各活动仍按自身状态实时过滤。'
    }
  }, {
    id: 2,
    target: '.sa-rule-note',
    title: '组合活动门店过滤',
    position: {placement:'bottom-right',offsetX:-8,offsetY:8},
    sections: {
      functionName: 'SA活动池权限过滤',
      functionDesc: '在生成二维码前过滤当前SA不可查看、不可分享的组合活动。',
      permissionScope: '当前登录SA。',
      dataSource: '独立SA投放、组合活动状态、组合活动适用门店、SA所属门店。',
      valueLogic: '三项取交集；门店未配置时按全部门店。',
      fieldDesc: 'saPlacementEnabled、activityState、storeScope、source.storeId。',
      interactionDesc: '被过滤对象不展示，不进入全选和二维码冻结范围。',
      judgeRule: '指定门店必须包含当前SA门店ID。',
      exceptionRule: '门店未命中时无禁用卡片，直接不展示。',
      otherDesc: '门店范围不修改子活动或卡券核销门店。'
    }
  }],
  'sa-qr': [{
    id: 1,
    target: '.poster-entry',
    title: '制作SA活动分享海报',
    position: {placement:'top-right',offsetX:-10,offsetY:8},
    sections: {
      functionName: '分享海报入口',
      functionDesc: '基于当前已生成二维码制作可分享海报。',
      permissionScope: '当前登录SA。',
      dataSource: '当前sceneId、二维码图片、来源SA和门店快照。',
      valueLogic: '海报与当前sceneId绑定。',
      fieldDesc: '二维码、SA姓名/工号、门店、有效期。',
      interactionDesc: '进入编辑页修改文案并生成海报。',
      judgeRule: '必须先生成二维码。',
      exceptionRule: '重新生成二维码后旧海报内二维码同步失效。',
      otherDesc: '不改变二维码活动范围和来源规则。'
    }
  }],
  'sa-poster-editor': [{
    id: 1,
    target: '.poster-form-card',
    title: '仅编辑海报营销文案',
    position: {placement:'top-right',offsetX:-10,offsetY:8},
    sections: {
      functionName: '海报文案编辑',
      functionDesc: '编辑标题、副标题和扫码引导语并实时预览。',
      permissionScope: '当前登录SA。',
      dataSource: '海报默认文案与SA本次输入。',
      valueLogic: '标题20字、副标题36字、引导语24字。',
      fieldDesc: 'title、subtitle、guide。',
      interactionDesc: '输入即预览，可恢复默认并生成最终海报。',
      judgeRule: '二维码、sceneId、SA和门店不可编辑。',
      exceptionRule: '空文案在预览中显示输入提示。',
      otherDesc: '编辑文案不重新生成二维码。'
    }
  }, {
    id: 2,
    target: '.poster-source-card',
    title: '系统模板或SA自定义上传',
    position: {placement:'bottom-right',offsetX:-10,offsetY:8},
    sections: {
      functionName: '海报来源选择',
      functionDesc: '使用系统模板或上传SA自定义海报底图。',
      permissionScope: '当前登录SA。',
      dataSource: '系统模板或本地选择的图片文件。',
      valueLogic: '仅支持JPG/PNG，单张不超过10MB，建议3:4。',
      fieldDesc: 'posterMode、posterUploadName、posterUploadUrl。',
      interactionDesc: '上传后即时切换底图并刷新预览。',
      judgeRule: '两种模式都由系统叠加二维码、SA/门店和有效期。',
      exceptionRule: '格式或大小不合法时不替换当前海报。',
      otherDesc: '上传底图不改变二维码范围或来源快照。'
    }
  }],
  'sa-poster-preview': [{
    id: 1,
    target: '[data-poster-card]',
    title: '最终活动分享海报',
    position: {placement:'top-right',offsetX:-10,offsetY:8},
    sections: {
      functionName: '海报生成与分享',
      functionDesc: '展示已合成二维码、来源SA信息和自定义文案的最终海报。',
      permissionScope: '当前登录SA。',
      dataSource: '当前二维码快照与海报文案。',
      valueLogic: '二维码来源仍在最终成功执行时锁定。',
      fieldDesc: '海报图片内容、有效期、来源信息。',
      interactionDesc: '可继续编辑、保存到相册或调起系统分享。',
      judgeRule: '保存/分享不修改业务数据。',
      exceptionRule: '旧sceneId失效时旧海报二维码不可继续新扫码。',
      otherDesc: '原型仅模拟保存和分享反馈。'
    }
  }],
  'activity-aggregation-unbound': [{
    id: 1,
    target: '.combo-activity-card',
    title: '组合活动未绑车状态',
    position: {placement:'top-right',offsetX:-10,offsetY:8},
    sections: {
      functionName: '组合活动单卡片',
      functionDesc: '绑车前只展示大活动基本信息，卡券区域整体不渲染。',
      permissionScope: '扫码用户。',
      dataSource: 'SA冻结范围与组合活动基本信息，名称取展示名称优先。',
      valueLogic: '展示名称为空时回退原名称；没有当前VIN时无法匹配子活动。',
      fieldDesc: '活动名、期限和去绑车入口；无卡券占位区。',
      interactionDesc: '不可勾选，可去绑车。',
      judgeRule: '不展示人群包、具体券或“卡券内容待解锁”占位文案。',
      exceptionRule: '绑车完成后不回跳，需重新扫码。',
      otherDesc: '仍只展示一张卡片。'
    }
  }, {
    id: 2,
    target: '.customer-activity-list',
    title: '客户侧隐藏活动等级',
    position: {placement:'top-left',offsetX:8,offsetY:8},
    sections: {
      functionName: '活动连续列表',
      functionDesc: '扫码用户只查看活动和参与状态，不展示三级活动分区或等级标签。',
      permissionScope: '扫码用户。',
      dataSource: '二维码冻结活动与活动准入表达。',
      valueLogic: '显示层隐藏等级，资格仍按号码级、绑车级、认证级分别计算。',
      fieldDesc: '活动名称、状态、奖励、有效期与升级入口。',
      interactionDesc: '可参与项默认勾选；等级不足项置灰。',
      judgeRule: '隐藏展示不改变oneID、VIN或认证关系校验。',
      exceptionRule: 'SA选择页仍保留三级分区，便于SA识别活动配置。',
      otherDesc: '仅调整客户可见信息层级。'
    }
  }],
  'activity-aggregation': [{
    id: 1,
    target: '.combo-activity-card',
    title: '组合活动VIN匹配结果',
    position: {placement:'top-right',offsetX:-10,offsetY:8},
    sections: {
      functionName: '组合活动动态卡券',
      functionDesc: '绑车后在原卡片内汇总展示当前VIN命中的全部卡券。',
      permissionScope: '扫码用户。',
      dataSource: '组合活动、当前VIN和人群包匹配结果；对外名称优先读取展示名称。',
      valueLogic: '展示名称为空回退原名；唯一键为组合活动ID + VIN。',
      fieldDesc: '命中子活动数、全部专属卡券和权益。',
      interactionDesc: '切换VIN后刷新原卡片。',
      judgeRule: '同一VIN满足多个子活动时全部执行，不设优先级或顺序。',
      exceptionRule: '多重命中属于正常匹配结果，不阻断且不记为异常。',
      otherDesc: '只记录一条组合活动参与主记录，不向用户展示人群标签。'
    }
  }, {
    id: 2,
    target: '.customer-activity-list',
    title: '客户侧隐藏活动等级',
    position: {placement:'top-left',offsetX:8,offsetY:8},
    sections: {
      functionName: '活动连续列表',
      functionDesc: '扫码用户只查看活动和参与状态，不展示三级活动分区或等级标签。',
      permissionScope: '扫码用户。',
      dataSource: '二维码冻结活动与活动准入表达。',
      valueLogic: '显示层隐藏等级，资格仍按号码级、绑车级、认证级分别计算。',
      fieldDesc: '活动名称、状态、奖励、有效期与升级入口。',
      interactionDesc: '切换VIN后重新计算内部资格并刷新卡片。',
      judgeRule: '隐藏展示不改变oneID、VIN或认证关系校验。',
      exceptionRule: 'SA选择页仍保留三级分区，便于SA识别活动配置。',
      otherDesc: '仅调整客户可见信息层级。'
    }
  }]
};
