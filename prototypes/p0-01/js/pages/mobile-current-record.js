(function () {
  'use strict';

  function ensureContext() {
    if (!window.PrototypeState.currentRedemption) {
      window.ExchangeFlow.startCoupon('EX202607200001');
      window.PrototypeState.redeemQuantities = {'SKU-10001':1,'SKU-10002':1};
      window.ExchangeFlow.createRedemption({vehicle:window.ExchangeCouponMock.coupon.boundVehicle});
    }
  }

  function extra(record) {
    if (record.fulfillmentType === 'telematics') {
      return '<div class="mobile-card"><h3>绑定车辆</h3><b>' + record.vehicle.car + '</b><p class="helper">' + record.vehicle.plate + ' · ' + record.vehicle.vin + '</p></div>';
    }
    if (record.fulfillmentType === 'direct_ship') {
      return '<div class="mobile-card"><h3>商城订单</h3><div class="record-lines"><p><span>商城订单号</span><b>' + record.mallOrder.orderNo + '</b></p><p><span>收货人</span><b>' + record.address.name + ' · ' + record.address.phone + '</b></p><p><span>收货地址</span><b>' + record.address.province + record.address.city + record.address.district + record.address.detail + '</b></p></div></div>';
    }
    return '<div class="mobile-card"><h3>核销门店</h3><b>' + record.store.name + '</b><p class="helper">' + record.store.address + '</p><button class="mobile-text-btn" data-code>查看核销码</button></div>';
  }

  function phone() {
    var record = window.PrototypeState.currentRedemption;
    var items = record.items.map(function (item) {
      var product = window.ExchangeFlow.product(item.productId);
      return '<div class="product-mini"><div class="product-pic">' + product.icon + '</div><div class="product-mini-info"><strong>' + product.name + ' × ' + item.qty + '</strong><p>' + product.id + ' · ' + record.fulfillmentLabel + '</p></div></div>';
    }).join('');
    return '<div class="phone"><div class="phone-notch"></div><div class="mobile-nav"><span class="back" data-home>‹</span>兑换详情</div><div class="mobile-body">' +
      '<div class="record-status-card redeemed-status"><div class="record-check">✓</div><div><b>卡券已核销</b><p>' + record.fulfillmentLabel + '：' + record.fulfillmentStatus + '</p></div></div>' +
      '<div class="mobile-card record-coupon-title"><span class="tag gray">' + record.fulfillmentLabel + '</span><h3>' + record.couponName + '</h3><p>卡券ID：' + record.couponId + '</p></div>' +
      '<div class="mobile-card"><h3>兑换内容</h3>' + items + '</div>' + extra(record) +
      '<div class="mobile-card"><div class="record-lines"><p><span>兑换单号</span><b>' + record.orderNo + '</b></p><p><span>兑换时间</span><b>' + record.exchangeTime + '</b></p><p><span>卡券状态</span><b>已核销</b></p><p><span>' + (record.fulfillmentType === 'direct_ship' ? '发货状态' : '履约状态') + '</span><b>' + record.fulfillmentStatus + '</b></p></div></div>' +
      '<button class="mobile-secondary-cta" data-home>返回卡券中心</button></div></div>';
  }

  function renderPage() {
    ensureContext();
    var record = window.PrototypeState.currentRedemption;
    return window.prototypeShell('当前兑换详情', '卡券中心 / 已核销卡券 / 兑换详情',
      '<div class="mobile-workspace">' + phone() + '<div><div class="panel"><div class="panel-head">兑换结果</div><div class="panel-body"><div class="state-split-grid"><div><span>卡券</span><b>已核销</b><p>兑换单创建成功时确定</p></div><div><span>' + record.fulfillmentLabel + '</span><b>' + record.fulfillmentStatus + '</b><p>由对应履约单后续更新</p></div></div><div class="evidence-note" style="margin-top:16px">兑换详情同时保存商品快照、履约方式和必要的门店/地址/车辆信息，便于用户在“我的卡券”中回看。</div></div></div></div></div>');
  }

  function bind() {
    document.querySelectorAll('[data-home]').forEach(function (button) { button.onclick = function () { window.navigateTo('mobile-home'); }; });
    var code = document.querySelector('[data-code]');
    if (code) code.onclick = function () { window.navigateTo('mobile-store-code'); };
  }

  window.Pages['mobile-current-record'] = {render: renderPage, init: bind};
})();
