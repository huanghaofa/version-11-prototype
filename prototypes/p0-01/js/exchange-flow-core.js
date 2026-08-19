(function () {
  'use strict';

  function product(id) {
    return window.ExchangeCouponMock.products.find(function (item) { return item.id === id; });
  }

  function example(id) {
    return window.ExchangeCouponMock.couponExamples.find(function (item) { return item.id === id; }) || window.ExchangeCouponMock.couponExamples[0];
  }

  function activeCoupon() {
    return example(window.PrototypeState.activeCouponId);
  }

  function rule(productId, couponId) {
    var matched = window.ExchangeCouponMock.couponProductRules.find(function (item) {
      return item.couponId === (couponId || activeCoupon().id) && item.productId === productId;
    });
    return matched || {maxRedeemQty: 1};
  }

  function candidates() {
    return activeCoupon().candidateProductIds.map(product).filter(Boolean);
  }

  function quantity(productId) {
    var item = product(productId);
    if (!item || Number(item.stock) <= 0) return 0;
    return Number(window.PrototypeState.redeemQuantities[productId] || 0);
  }

  function total() {
    return Object.keys(window.PrototypeState.redeemQuantities).reduce(function (sum, id) {
      return sum + quantity(id);
    }, 0);
  }

  function chosen() {
    return candidates().filter(function (item) { return quantity(item.id) > 0; });
  }

  function fulfillmentLabel(type) {
    var matched = window.ExchangeCouponMock.fulfillmentTypes.find(function (item) { return item.value === type; });
    return matched ? matched.label : type;
  }

  function startCoupon(couponId) {
    var coupon = example(couponId);
    window.PrototypeState.activeCouponId = coupon.id;
    window.PrototypeState.redeemQuantities = {};
    window.PrototypeState.exchangeStep = 'detail';
    window.PrototypeState.selectedProvince = '';
    window.PrototypeState.selectedCity = '';
    window.PrototypeState.selectedStoreId = '';
    window.PrototypeState.selectedAddressId = 'ADDR-001';
    window.PrototypeState.currentRedemption = null;
    window.PrototypeState.mallOrderInfo = null;
  }

  function createRedemption(extra) {
    var coupon = activeCoupon();
    var type = coupon.fulfillmentType;
    var orderNo = 'RD20260728' + String(Date.now()).slice(-4);
    var record = {
      orderNo: orderNo,
      couponId: coupon.id,
      couponName: coupon.name,
      couponStatus: '已核销',
      fulfillmentType: type,
      fulfillmentLabel: fulfillmentLabel(type),
      fulfillmentStatus: type === 'telematics' ? '待履约' : (type === 'direct_ship' ? '待发货' : '待核销'),
      exchangeTime: '2026-07-28 14:30:00',
      items: chosen().map(function (item) {
        return {productId: item.id, qty: quantity(item.id)};
      })
    };
    Object.keys(extra || {}).forEach(function (key) { record[key] = extra[key]; });
    window.PrototypeState.currentRedemption = record;
    return record;
  }

  window.ExchangeFlow = {
    product: product,
    activeCoupon: activeCoupon,
    rule: rule,
    candidates: candidates,
    quantity: quantity,
    total: total,
    chosen: chosen,
    fulfillmentLabel: fulfillmentLabel,
    startCoupon: startCoupon,
    createRedemption: createRedemption
  };
})();
