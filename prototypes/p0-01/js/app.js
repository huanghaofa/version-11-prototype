(function () {
  'use strict';

  window.Pages = window.Pages || {};
  window.PrototypeState = {
    selectedProductIds: ['SKU-GUI-10001','SKU-GUI-10002','SKU-GUI-10003','SKU-GUI-10004','SKU-GUI-10005'],
    couponProductRules: {'SKU-GUI-10001':2,'SKU-GUI-10002':1,'SKU-GUI-10003':1,'SKU-GUI-10004':1,'SKU-GUI-10005':1},
    ruleMode: 'choice',
    couponFulfillmentType: 'telematics',
    activeCouponId: 'EX202607200001',
    redeemQuantities: {},
    exchangeStep: 'detail',
    selectedProvince: '',
    selectedCity: '',
    selectedStoreId: '',
    selectedAddressId: 'ADDR-001',
    currentRedemption: null,
    mallOrderInfo: null,
    fulfillmentSource: 'record'
  };
})();
