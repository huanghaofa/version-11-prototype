window.AnnotationData = {
  'subsidy-data': [
    {
      id: 1, title: '补贴数据查询区', target: '.filter-panel', position: { placement: 'top-right', offsetX: -8, offsetY: 8 },
      sections: { functionName: '卡券补贴数据查询', functionDesc: '按卡券、单据、用户、渠道、规则、状态及核销时间查询。', permissionScope: '卡券中心运营及核对人员。', dataSource: '卡券中心保存的新商城/E3S T+1 当前快照。', valueLogic: '新商城=线上，E3S=线下。', fieldDesc: 'VIN、手机号、oneID 分列；无归属类型。', interactionDesc: '低频条件可展开；按钮顺序为重置、查询。', judgeRule: '多个条件同时填写时取交集。', exceptionRule: '无匹配数据时展示空结果。', otherDesc: '不展示同步日志。' }
    },
    {
      id: 2, title: '一券一行主列表', target: '#subsidy-table', position: { placement: 'top-right', offsetX: -8, offsetY: 8 },
      sections: { functionName: '卡券补贴数据列表', functionDesc: '每个卡券ID+核销码展示一条主记录。', permissionScope: '只读查询。', dataSource: '主表当前快照。', valueLogic: '订单/工单与卡券为1:1。', fieldDesc: '核销码中间四位脱敏。', interactionDesc: '横向滚动、分页、查看明细。', judgeRule: '结算状态仅未结算、已结算、无需结算。', exceptionRule: '实际金额未生成显示—。', otherDesc: '不提供金额汇总卡片。' }
    },
    {
      id: 3, title: '商品或备件明细', target: '#subsidy-table tbody tr:first-child .detail-btn', position: { placement: 'bottom-left', offsetX: -4, offsetY: 2 },
      sections: { functionName: '当前完整明细', functionDesc: '展示该卡券适用的商品或备件。', permissionScope: '只读查看。', dataSource: '来源系统每次重推的当前全部明细。', valueLogic: '卡券中心原子替换旧明细，不按明细ID增量合并。', fieldDesc: '数量、优惠金额、预计金额、实际金额。', interactionDesc: '点击查看明细打开右侧抽屉。', judgeRule: '部分退款只改变预计金额。', exceptionRule: '全额退款预计为0、实际为空。', otherDesc: '卡券中心不计算金额。' }
    }
  ],
  'rule-settings': [
    {
      id: 1, title: '原有补贴规则查询', target: '.filter-panel', position: { placement: 'top-right', offsetX: -8, offsetY: 8 },
      sections: { functionName: '补贴规则查询', functionDesc: '沿用卡券中心原有规则页面。', permissionScope: '具备规则管理权限的人员。', dataSource: '卡券中心原有补贴规则接口。', valueLogic: '按规则ID、名称查询。', fieldDesc: '不设置结算渠道字段。', interactionDesc: '重置或查询。', judgeRule: '同一规则同时维护线上、线下配置。', exceptionRule: '无匹配规则时展示空状态。', otherDesc: '接口已完成历史对接。' }
    },
    {
      id: 2, title: '规则增删改查', target: '#rule-table', position: { placement: 'top-right', offsetX: -8, offsetY: 8 },
      sections: { functionName: '补贴规则管理', functionDesc: '支持新增、查看、编辑、删除。', permissionScope: '具备规则管理权限的人员。', dataSource: '原有补贴规则。', valueLogic: '线上和线下分别配置方式、值及标准值。', fieldDesc: '固定金额或比例结算。', interactionDesc: '操作列进入查看、编辑或删除。', judgeRule: '已关联卡券数用于提示现网限制。', exceptionRule: '已关联规则不可删除。', otherDesc: '原型修改仅保存在当前页面内存。' }
    }
  ]
};
