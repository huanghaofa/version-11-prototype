(function () {
  'use strict';

  window.MockData = {
    meta: {
      environment: 'prototype-only',
      source: '用户老友卡设置截图 + 用户提供的老友卡基础数据接口文档截图',
      warning: '仅用于静态评审，不发出真实请求；接口示例与字段表存在冲突，仍不能作为可联调合同',
      interfaceCode: 'DNDC_NORMAL_S_SE_S070',
      interfaceMethod: 'POST',
      interfacePath: 'ly/busiplat/xapi/se/normal/rest/DNDC/DNDC_NORMAL_S_SE_S070'
    },
    existingProductTypes: [
      { key: 'part', label: '备件', scope: 'existing' },
      { key: 'labor', label: '工时', scope: 'existing' },
      { key: 'boutique', label: '精品', scope: 'existing' },
      { key: 'package', label: '套餐', scope: 'existing' }
    ],
    newProductType: { key: 'old-friend-card', label: '老友卡', scope: 'new', formalName: '待确认' },
    oldFriendCards: [
      { carProductId: 'MOCK-LYC-001', carProductCode: 'LYC-GOLD-01', carProductName: '老友卡金卡', serviceYear: '1年', usePrice: '1099.00', isEnable: 'MOCK_ENABLED' },
      { carProductId: 'MOCK-LYC-002', carProductCode: 'LYC-SILVER-01', carProductName: '老友卡银卡', serviceYear: '1年', usePrice: '799.00', isEnable: 'MOCK_ENABLED' },
      { carProductId: 'MOCK-LYC-003', carProductCode: 'LYC-VENUCIA-V1', carProductName: '老友卡尊享卡', serviceYear: '3年', usePrice: '1899.00', isEnable: 'MOCK_DISABLED' },
      { carProductId: 'MOCK-LYC-004', carProductCode: 'LYC-FREE-03', carProductName: '老友卡畅行卡', serviceYear: '1年', usePrice: '499.00', isEnable: 'MOCK_ENABLED' },
      { carProductId: 'MOCK-LYC-005', carProductCode: 'LYC-GOLD-02', carProductName: '老友卡金卡', serviceYear: '2年', usePrice: '1199.00', isEnable: 'MOCK_DISABLED' }
    ],
    couponDraft: {
      id: 'MOCK-COUPON-DRAFT-001',
      name: '老友卡售后维保券（评审示例）',
      couponType: '售后维保券',
      validity: '领取后 30 天内有效（Mock）',
      selectedType: 'old-friend-card',
      selectedCardIds: ['MOCK-LYC-001', 'MOCK-LYC-002']
    }
  };
})();
