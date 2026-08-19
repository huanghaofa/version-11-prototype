(function () {
  'use strict';

  window.Pages = window.Pages || {};
  window.PrototypeState = {
    selectedProductIds: ['SKU-10001','SKU-10002','SKU-10003','SKU-10004','SKU-10005'],
    couponProductRules: {'SKU-10001':2,'SKU-10002':1,'SKU-10003':1,'SKU-10004':1,'SKU-10005':1},
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
