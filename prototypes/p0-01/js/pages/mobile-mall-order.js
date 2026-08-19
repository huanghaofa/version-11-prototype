(function () {
  'use strict';

  function ensureContext() {
    if (window.ExchangeFlow.activeCoupon().fulfillmentType !== 'direct_ship') {
      window.ExchangeFlow.startCoupon('EX202607200002');
      window.PrototypeState.redeemQuantities = {'SKU-20001':1};
    }
    if (window.ExchangeFlow.total() !== window.ExchangeFlow.activeCoupon().redeemQuantity) {
      window.PrototypeState.redeemQuantities = {'SKU-20001':1};
    }
  }

  function selectedAddress() {
    return window.ExchangeCouponMock.addresses.find(function (address) { return address.id === window.PrototypeState.selectedAddressId; });
  }

  function openAddAddress() {
    var host = window.openModal('<div class="modal-content address-modal"><div class="modal-header"><b>新增收货地址</b><button class="btn btn-link" data-close-modal>×</button></div><div class="modal-body"><div class="address-form"><label>收货人<input class="input" id="newAddressName" value="黄先生"></label><label>手机号<input class="input" id="newAddressPhone" value="139****2607"></label><label>省 / 市 / 区<input class="input" id="newAddressArea" value="广东省 / 深圳市 / 宝安区"></label><label>详细地址<textarea class="textarea" id="newAddressDetail">新安街道示例路 66 号</textarea></label></div></div><div class="modal-footer"><button class="btn" data-close-modal>取消</button><button class="btn btn-primary" id="saveAddress">保存并使用</button></div></div>');
    host.querySelector('#saveAddress').onclick = function () {
      var id = 'ADDR-' + String(window.ExchangeCouponMock.addresses.length + 1).padStart(3, '0');
      window.ExchangeCouponMock.addresses.push({id:id,name:host.querySelector('#newAddressName').value,phone:host.querySelector('#newAddressPhone').value,province:'广东省',city:'深圳市',district:'宝安区',detail:host.querySelector('#newAddressDetail').value,isDefault:false});
      window.PrototypeState.selectedAddressId = id;
      host.remove();
      window.navigateTo('mobile-mall-order');
      window.showToast('已新增并选择收货地址');
    };
  }

  function phone() {
    var coupon = window.ExchangeFlow.activeCoupon();
    var address = selectedAddress();
    var productIds = window.ExchangeFlow.chosen().map(function (product) { return product.id; }).join(',');
    var addressCards = window.ExchangeCouponMock.addresses.map(function (item) {
      return '<label class="address-choice ' + (item.id === window.PrototypeState.selectedAddressId ? 'active' : '') + '"><input type="radio" name="address" value="' + item.id + '" ' + (item.id === window.PrototypeState.selectedAddressId ? 'checked' : '') + '><span><b>' + item.name + ' · ' + item.phone + '</b><small>' + item.province + item.city + item.district + item.detail + '</small></span></label>';
    }).join('');
    var products = window.ExchangeFlow.chosen().map(function (product) {
      return '<div class="mall-order-product"><div class="product-pic">' + product.icon + '</div><div><b>' + product.name + '</b><p>' + product.id + ' · 数量 ' + window.ExchangeFlow.quantity(product.id) + '</p></div><strong>¥0.00</strong></div>';
    }).join('');
    return '<div class="phone mall-phone"><div class="phone-notch"></div><div class="mobile-nav mall-nav"><span class="back" data-back>‹</span>新商城 · 确认订单</div><div class="mobile-body">' +
      '<div class="mall-jump-banner">已从卡券中心跳转至新商城</div><div class="mobile-card"><h3>收货地址</h3>' + addressCards + '<button class="mobile-text-btn add-address" data-add-address>＋ 新增收货地址</button></div>' +
      '<div class="mobile-card"><h3>订单商品</h3>' + products + '</div><div class="mobile-card"><div class="record-lines"><p><span>卡券抵扣</span><b>-' + coupon.name + '</b></p><p><span>运费</span><b>¥0.00</b></p><p><span>实付</span><b class="direct-pay">¥0.00</b></p></div></div>' +
      '<div class="mall-callback-box"><b>模拟跳转参数</b><code>couponId=' + coupon.id + '&amp;productIds=' + productIds + '</code><p>商城提交订单成功后回跳卡券中心；失败不创建兑换单、不核销券。</p></div>' +
      '<button class="mobile-cta" data-submit-order ' + (address ? '' : 'disabled') + '>提交订单</button><button class="mobile-secondary-cta" data-fail-order>模拟提交失败</button></div></div>';
  }

  function renderPage() {
    ensureContext();
    return window.prototypeShell('商城确认订单（模拟）', '新商城 / 确认订单',
      '<div class="flow-steps four"><div class="flow-step">1 券详情</div><div class="flow-step">2 选商品</div><div class="flow-step active">3 商城下单</div><div class="flow-step">4 兑换详情</div></div>' +
      '<div class="mobile-workspace">' + phone() + '<div><div class="panel"><div class="panel-head">跨系统跳转 <span class="tag orange">模拟</span></div><div class="panel-body"><div class="sequence"><div class="seq"><b>卡券中心</b><p>携带 couponId、productIds 跳转</p></div><div class="seq"><b>新商城</b><p>选择/新增收货地址并提交订单</p></div><div class="seq"><b>提交成功</b><p>回跳并创建兑换单，卡券核销</p></div></div><div class="evidence-note warn" style="margin-top:16px">原型只模拟页面与成功顺序；真实参数签名、幂等键、失败回跳和订单查询接口仍需技术联调确认。</div></div></div><div class="panel"><div class="panel-head">当前卡券状态</div><div class="panel-body"><p><span class="tag green">可使用</span></p><p class="helper">在新商城提交订单成功前，卡券尚未核销。</p></div></div></div></div>');
  }

  function bind() {
    document.querySelectorAll('[name="address"]').forEach(function (radio) {
      radio.onchange = function () { window.PrototypeState.selectedAddressId = radio.value; window.navigateTo('mobile-mall-order'); };
    });
    document.querySelector('[data-add-address]').onclick = openAddAddress;
    document.querySelector('[data-back]').onclick = function () { window.PrototypeState.exchangeStep = 'select'; window.navigateTo('mobile-flow'); };
    document.querySelector('[data-fail-order]').onclick = function () { window.showToast('提交失败：未创建兑换单，卡券仍可使用'); };
    document.querySelector('[data-submit-order]').onclick = function () {
      var address = selectedAddress();
      if (!address) { window.showToast('请先选择收货地址'); return; }
      window.PrototypeState.mallOrderInfo = {orderNo:'SC202607280018',status:'待发货',address:address};
      window.ExchangeFlow.createRedemption({mallOrder:window.PrototypeState.mallOrderInfo,address:address});
      window.navigateTo('mobile-current-record');
      window.showToast('商城订单提交成功，已回跳兑换详情');
    };
  }

  window.Pages['mobile-mall-order'] = {render: renderPage, init: bind};
})();
