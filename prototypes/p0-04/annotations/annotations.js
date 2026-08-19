window.AnnotationData = {
  index: [
    { id: 1, title: '新增权益适用范围', target: '[data-anno="benefit-scope-entry"]', sections: { functionName: '卡券适用范围类型', functionDesc: '在完整卡券表单的备件、工时、精品、套餐之后增加权益类型。', dataSource: 'E3S权益类产品', interactionDesc: '勾选权益或点击选择权益后打开弹窗；其他适用范围类型不可同时选择。' } },
    { id: 2, title: '权益弹窗选择', target: '#modal-root', sections: { functionName: '关联权益编码', functionDesc: '按编码、名称查询并多选权益。', interactionDesc: '权益内容默认收起，点击后展开；确认后回显已选名称和编码。', permissionScope: '卡券中心只关联E3S权益编码。' } }
  ]
};
