(function () {
  'use strict';

  function ensureContext() {
    if (window.ExchangeFlow.activeCoupon().fulfillmentType !== 'store_verify' || !window.PrototypeState.currentRedemption) {
      window.ExchangeFlow.startCoupon('EX202607200003');
      window.PrototypeState.selectedProvince = '广东省';
      window.PrototypeState.selectedCity = '深圳市';
      window.PrototypeState.selectedStoreId = 'STORE-SZ-001';
      window.PrototypeState.redeemQuantities = {'SKU-30001':1};
      var store = window.ExchangeCouponMock.stores.find(function (item) { return item.id === 'STORE-SZ-001'; });
      window.ExchangeFlow.createRedemption({store:store,verifyCode:'8265 2074 9931'});
    }
  }

  function phone() {
    var record = window.PrototypeState.currentRedemption;
    var items = record.items.map(function (item) {
      var product = window.ExchangeFlow.product(item.productId);
      return '<div class="product-mini"><div class="product-pic">' + product.icon + '</div><div class="product-mini-info"><strong>' + product.name + ' × ' + item.qty + '</strong><p>' + product.id + ' · 到店核销</p></div></div>';
    }).join('');
    return '<div class="phone"><div class="phone-notch"></div><div class="mobile-nav"><span class="back" data-back>‹</span>到店核销码</div><div class="mobile-body">' +
      '<div class="store-code-status"><span class="record-check">✓</span><div><b>兑换成功，卡券已核销</b><p>门店服务状态：待核销</p></div></div>' +
      '<div class="mobile-card verify-code-card"><span>到店出示核销码</span><div class="barcode"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><strong>' + record.verifyCode + '</strong><p>核销码有效期至 2026-08-31 23:59</p></div>' +
      '<div class="mobile-card"><h3>核销门店</h3><b>' + record.store.name + '</b><p class="helper">' + record.store.address + '</p><p class="helper">' + record.store.phone + '</p></div>' +
      '<div class="mobile-card"><h3>兑换内容</h3>' + items + '</div><div class="exchange-warning"><b>请勿提前向他人展示核销码</b><p>门店核销成功后，履约状态从“待核销”更新为“已核销”；卡券状态始终为“已核销”。</p></div>' +
      '<button class="mobile-cta" data-record>查看兑换详情</button><button class="mobile-secondary-cta" data-home>返回卡券中心</button></div></div>';
  }

  function renderPage() {
    ensureContext();
    return window.prototypeShell('到店核销码', '卡券中心 / 到店兑换券 / 核销码',
      '<div class="flow-steps four"><div class="flow-step">1 券详情</div><div class="flow-step">2 选门店</div><div class="flow-step">3 选商品</div><div class="flow-step active">4 核销码</div></div>' +
      '<div class="mobile-workspace">' + phone() + '<div><div class="panel"><div class="panel-head">状态拆分</div><div class="panel-body"><div class="state-split-grid"><div><span>卡券状态</span><b>已核销</b><p>兑换单创建成功即更新</p></div><div><span>门店履约状态</span><b>待核销</b><p>门店真正核销后再更新</p></div></div></div></div><div class="panel"><div class="panel-head">展示前置条件</div><div class="panel-body"><p>1. 已选择省、市、门店。</p><p>2. 已按券规则选择商品。</p><p>3. 兑换单创建成功且卡券核销成功。</p><div class="evidence-note warn" style="margin-top:14px">任一条件不满足时均不得展示核销码。</div></div></div></div></div>');
  }

  function bind() {
    document.querySelector('[data-back]').onclick = function () { window.PrototypeState.exchangeStep = 'select'; window.navigateTo('mobile-flow'); };
    document.querySelector('[data-record]').onclick = function () { window.navigateTo('mobile-current-record'); };
    document.querySelector('[data-home]').onclick = function () { window.navigateTo('mobile-home'); };
  }

  window.Pages['mobile-store-code'] = {render: renderPage, init: bind};
})();
