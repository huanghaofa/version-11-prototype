(function () {
  'use strict';

  var flow = window.ExchangeFlow;

  function isAvailable(product) {
    return Number(product.stock) > 0;
  }

  function selectedStore() {
    return window.ExchangeCouponMock.stores.find(function (store) { return store.id === window.PrototypeState.selectedStoreId; });
  }

  function productMini(product, withQty) {
    return '<div class="product-mini ' + (isAvailable(product) ? '' : 'unavailable') + '"><div class="product-pic">' + product.icon + '</div><div class="product-mini-info"><strong>' + product.name + (withQty ? ' × ' + flow.quantity(product.id) : '') + (isAvailable(product) ? '' : ' <span class="stock-sold-out">已售罄</span>') + '</strong><p>' + product.category + ' · ' + flow.activeCoupon().fulfillmentLabel + '</p>' + (withQty ? '' : '<button class="mobile-text-btn" data-product-detail="' + product.id + '">查看详情</button>') + '</div></div>';
  }

  function openProductDetail(productId) {
    var product = flow.product(productId);
    var max = flow.rule(product.id).maxRedeemQty;
    window.openModal('<div class="modal-content mobile-product-detail"><div class="modal-header"><b>商品详情</b><button class="btn btn-link" data-close-modal>×</button></div><div class="modal-body"><div class="product-detail-hero">' + product.icon + '</div><h2>' + product.name + (isAvailable(product) ? '' : ' <span class="stock-sold-out">已售罄</span>') + '</h2><p class="helper">商品编号：' + product.id + ' · ' + product.category + ' / ' + product.subCategory + '</p><div class="detail-price">商城价 ¥' + product.price + '</div><div class="detail-lines"><p><span>供应商</span><b>' + product.supplier + '</b></p><p><span>商品库存</span><b>' + (product.stockLabel || product.stock) + '</b></p><p><span>整券履约方式</span><b>' + flow.activeCoupon().fulfillmentLabel + '</b></p><p><span>本商品最多可兑</span><b>' + max + '件</b></p><p><span>履约说明</span><b>' + product.description + '</b></p></div>' + (isAvailable(product) ? '' : '<div class="evidence-note warn" style="margin-top:12px">当前库存为0，仅可查看商品详情，不能加入本次兑换。</div>') + '</div><div class="modal-footer"><button class="btn btn-primary" data-close-modal>返回选品</button></div></div>');
  }

  function detailPage(coupon) {
    var vehicle = coupon.fulfillmentType === 'telematics'
      ? '<div class="mobile-card"><h3>绑定车辆</h3><b>' + window.ExchangeCouponMock.coupon.boundVehicle.car + '</b><p class="helper">' + window.ExchangeCouponMock.coupon.boundVehicle.plate + ' · ' + window.ExchangeCouponMock.coupon.boundVehicle.vin + '</p><p class="helper">本券已发放至该 VIN，兑换时无需选车。</p></div>'
      : '';
    return '<div class="mobile-hero"><div class="type">通用兑换券 · ' + coupon.fulfillmentLabel + '</div><h2>' + coupon.name + '</h2><div>有效期至 ' + coupon.expiresAt + '</div></div>' +
      '<div class="mobile-card"><div class="choice-rule"><b>' + coupon.candidateProductIds.length + '选' + coupon.redeemQuantity + '</b><span>' + coupon.subtitle + '</span></div><p class="helper">本券所有商品均使用“' + coupon.fulfillmentLabel + '”，不支持跨履约类型组合。</p></div>' + vehicle +
      '<div class="mobile-card"><h3>候选商品（' + coupon.candidateProductIds.length + '种）</h3>' + flow.candidates().slice(0, 3).map(function (product) { return productMini(product, false); }).join('') + (coupon.candidateProductIds.length > 3 ? '<div class="more-products">还有' + (coupon.candidateProductIds.length - 3) + '种商品，进入下一步查看</div>' : '') + '</div>' +
      '<div class="mobile-card"><h3>使用说明</h3><p class="helper">' + (coupon.fulfillmentType === 'store_verify' ? '需先选择省、市和门店，再选择商品；完成后展示核销码。' : (coupon.fulfillmentType === 'direct_ship' ? '选品后将携带商品ID与卡券ID跳转新商城确认订单页。' : '确认兑换后卡券立即核销，车联网履约进度在兑换详情查询。')) + '</p></div>' +
      '<button class="mobile-cta" data-next="' + (coupon.fulfillmentType === 'store_verify' ? 'store' : 'select') + '">' + (coupon.fulfillmentType === 'store_verify' ? '先选门店' : '去选商品') + '</button>';
  }

  function storePage() {
    var vehicle = window.ExchangeCouponMock.coupon.boundVehicle;
    var provinces = Array.from(new Set(window.ExchangeCouponMock.stores.map(function (store) { return store.province; })));
    var cities = Array.from(new Set(window.ExchangeCouponMock.stores.filter(function (store) { return !window.PrototypeState.selectedProvince || store.province === window.PrototypeState.selectedProvince; }).map(function (store) { return store.city; })));
    var stores = window.ExchangeCouponMock.stores.filter(function (store) {
      return (!window.PrototypeState.selectedProvince || store.province === window.PrototypeState.selectedProvince) && (!window.PrototypeState.selectedCity || store.city === window.PrototypeState.selectedCity);
    });
    var provinceOptions = '<option value="">请选择省</option>' + provinces.map(function (province) { return '<option ' + (province === window.PrototypeState.selectedProvince ? 'selected' : '') + '>' + province + '</option>'; }).join('');
    var cityOptions = '<option value="">请选择市</option>' + cities.map(function (city) { return '<option ' + (city === window.PrototypeState.selectedCity ? 'selected' : '') + '>' + city + '</option>'; }).join('');
    var storeOptions = '<option value="">请选择门店</option>' + stores.map(function (store) { return '<option value="' + store.id + '" ' + (store.id === window.PrototypeState.selectedStoreId ? 'selected' : '') + '>' + store.name + '</option>'; }).join('');
    var store = selectedStore();
    return '<div class="mobile-card readonly-vin-card" data-store-vin><div class="readonly-card-title"><h3>卡券绑定车辆</h3><span class="tag gray">不可更改</span></div><b>' + vehicle.car + '</b><p>' + vehicle.plate + '</p><p class="vin-value">VIN：' + vehicle.vin + '</p><div class="readonly-lock">🔒 本券已发放至该 VIN，选择门店不会改变绑定车辆</div></div>' +
      '<div class="mobile-card store-select-card"><h3>选择核销门店</h3><label>省</label><select class="select" id="storeProvince">' + provinceOptions + '</select><label>市</label><select class="select" id="storeCity" ' + (window.PrototypeState.selectedProvince ? '' : 'disabled') + '>' + cityOptions + '</select><label>门店</label><select class="select" id="storeName" ' + (window.PrototypeState.selectedCity ? '' : 'disabled') + '>' + storeOptions + '</select></div>' +
      (store ? '<div class="mobile-card selected-store-card"><span class="tag green">已选择</span><h3>' + store.name + '</h3><p>' + store.address + '</p><p>' + store.phone + '</p></div>' : '<div class="evidence-note warn" style="margin-top:12px">按“省 → 市 → 门店”顺序完成选择后，才可进入商品选择。</div>') +
      '<button class="mobile-cta" ' + (store ? 'data-next="select"' : 'disabled style="opacity:.45"') + '>下一步，选择商品</button>';
  }

  function selectorPage(coupon) {
    var store = selectedStore();
    var header = coupon.fulfillmentType === 'store_verify' && store
      ? '<div class="selected-store-strip"><span>核销门店</span><b>' + store.name + '</b><button data-change-store>更换</button></div>'
      : '';
    var products = flow.candidates().map(function (product) {
      var qty = flow.quantity(product.id);
      var max = Number(flow.rule(product.id).maxRedeemQty || 1);
      var disabledPlus = !isAvailable(product) || qty >= max || flow.total() >= coupon.redeemQuantity;
      return '<div class="mobile-select-product ' + (isAvailable(product) ? '' : 'unavailable') + '"><div class="product-pic">' + product.icon + '</div><div class="mobile-select-info"><strong>' + product.name + (isAvailable(product) ? '' : ' <span class="stock-sold-out">已售罄</span>') + '</strong><p>' + product.category + ' · 最多可兑' + max + '件 · 库存 ' + (product.stockLabel || product.stock) + '</p><button class="mobile-text-btn" data-product-detail="' + product.id + '">商品详情</button></div><div class="mobile-qty"><button data-dec="' + product.id + '" ' + (qty === 0 ? 'disabled' : '') + '>−</button><span>' + qty + '</span><button data-inc="' + product.id + '" ' + (disabledPlus ? 'disabled' : '') + '>＋</button></div></div>';
    }).join('');
    var nextLabel = coupon.fulfillmentType === 'direct_ship' ? '去商城确认订单' : (coupon.fulfillmentType === 'store_verify' ? '确认并生成核销码' : '选好了，确认兑换');
    return header + '<div class="selection-tip"><b>' + coupon.candidateProductIds.length + '选' + coupon.redeemQuantity + '</b><span>已选 <strong>' + flow.total() + '</strong> / ' + coupon.redeemQuantity + ' 件</span></div>' +
      '<p class="helper" style="margin:8px 2px">数量上限按商品分别配置；库存为0不可选择。</p>' + products +
      '<button class="mobile-cta" ' + (flow.total() === coupon.redeemQuantity ? 'data-submit-selection' : 'disabled style="opacity:.45"') + '>' + nextLabel + '</button>';
  }

  function confirmPage() {
    var vehicle = window.ExchangeCouponMock.coupon.boundVehicle;
    return '<div class="mobile-card"><h3>兑换内容（共' + flow.total() + '件）</h3>' + flow.chosen().map(function (product) { return productMini(product, true); }).join('') + '</div>' +
      '<div class="mobile-card"><h3>车联网履约车辆</h3><b>' + vehicle.car + '</b><p class="helper">' + vehicle.plate + ' · ' + vehicle.vin + '</p><p class="helper">车辆由券实例自动带入，不可修改。</p></div>' +
      '<div class="mobile-card"><div class="inline" style="justify-content:space-between"><span>使用兑换券</span><b>1张</b></div><div class="inline" style="justify-content:space-between;margin-top:8px"><span>应付金额</span><b style="color:#ff5a36">¥0.00</b></div></div>' +
      '<div class="exchange-warning"><b>确认兑换后卡券立即核销</b><p>车联网履约状态不影响券状态；本期不支持撤销、退款或恢复。</p></div><button class="mobile-cta" data-next="success">确认兑换</button>';
  }

  function successPage() {
    var record = window.PrototypeState.currentRedemption;
    return '<div class="success-icon">✓</div><h2 style="text-align:center">兑换成功</h2><p class="helper" style="text-align:center;margin:8px 0 22px">兑换单已创建，本张兑换券已核销</p>' +
      '<div class="mobile-card"><div class="inline" style="justify-content:space-between"><span>兑换单号</span><b>' + record.orderNo + '</b></div><div class="inline" style="justify-content:space-between;margin-top:10px"><span>车联网履约</span><span class="tag orange">待履约</span></div><div class="inline" style="justify-content:space-between;margin-top:10px"><span>卡券状态</span><span class="tag gray">已核销</span></div></div>' +
      '<button class="mobile-cta" data-current-record>查看兑换详情</button><button class="mobile-secondary-cta" data-home>返回卡券中心</button>';
  }

  function phone(step) {
    var coupon = flow.activeCoupon();
    var titles = {detail:'兑换券详情',store:'选择门店',select:'选择兑换商品',confirm:'确认兑换',success:'兑换结果'};
    var content = step === 'detail' ? detailPage(coupon) : (step === 'store' ? storePage() : (step === 'select' ? selectorPage(coupon) : (step === 'confirm' ? confirmPage() : successPage())));
    return '<div class="phone"><div class="phone-notch"></div><div class="mobile-nav"><span class="back" data-back>‹</span>' + titles[step] + '</div><div class="mobile-body">' + content + '</div></div>';
  }

  function stepList(coupon, current) {
    var steps = coupon.fulfillmentType === 'store_verify'
      ? [{key:'detail',label:'1 券详情'},{key:'store',label:'2 选门店'},{key:'select',label:'3 选商品'},{key:'code',label:'4 核销码'}]
      : (coupon.fulfillmentType === 'direct_ship'
        ? [{key:'detail',label:'1 券详情'},{key:'select',label:'2 选商品'},{key:'mall',label:'3 商城下单'},{key:'record',label:'4 兑换详情'}]
        : [{key:'detail',label:'1 券详情'},{key:'select',label:'2 选商品'},{key:'confirm',label:'3 确认'},{key:'success',label:'4 成功'}]);
    return '<div class="flow-steps four">' + steps.map(function (step) {
      return '<div class="flow-step ' + (step.key === current ? 'active' : '') + '">' + step.label + '</div>';
    }).join('') + '</div>';
  }

  function renderPage() {
    var coupon = flow.activeCoupon();
    var step = window.PrototypeState.exchangeStep;
    var note = coupon.fulfillmentType === 'store_verify'
      ? '顺序强制为“选门店 → 选商品 → 生成兑换单并核销券 → 展示核销码”。'
      : (coupon.fulfillmentType === 'direct_ship' ? '选品后跳转新商城确认订单；只有商城提交订单成功回跳后才创建兑换单并核销券。' : '券实例已绑定 VIN，用户无需选车；兑换单创建成功后立即核销券。');
    return window.prototypeShell('前台兑换流程', '卡券中心 / App与微信小程序',
      stepList(coupon, step) + '<div class="mobile-workspace"><div id="phoneHost">' + phone(step) + '</div><div>' +
      '<div class="panel"><div class="panel-head">当前示例券 <span class="tag orange">' + coupon.fulfillmentLabel + '</span></div><div class="panel-body"><b>' + coupon.name + '</b><p class="helper">' + coupon.subtitle + '</p><div class="evidence-note" style="margin-top:14px">' + note + '</div></div></div>' +
      '<div class="panel"><div class="panel-head">单一履约约束</div><div class="panel-body"><p>整券履约方式：<b>' + coupon.fulfillmentLabel + '</b></p><p class="helper">当前候选池中每个商品都支持相同履约方式，前台没有履约方式切换入口。</p><button class="btn" data-home>返回卡券中心切换另一张示例券</button></div></div></div></div>');
  }

  function gotoStep(step) {
    var coupon = flow.activeCoupon();
    if (step === 'select' && coupon.fulfillmentType === 'store_verify' && !selectedStore()) {
      window.PrototypeState.exchangeStep = 'store';
      window.showToast('请先选择核销门店');
    } else if ((step === 'confirm' || step === 'success') && flow.total() !== coupon.redeemQuantity) {
      window.PrototypeState.exchangeStep = 'select';
      window.showToast('请先按规则选择商品');
    } else {
      if (step === 'success' && !window.PrototypeState.currentRedemption) window.ExchangeFlow.createRedemption({vehicle:window.ExchangeCouponMock.coupon.boundVehicle});
      window.PrototypeState.exchangeStep = step;
    }
    window.navigateTo('mobile-flow');
  }

  function bind() {
    var coupon = flow.activeCoupon();
    document.querySelectorAll('[data-next]').forEach(function (button) { button.onclick = function () { gotoStep(button.dataset.next); }; });
    document.querySelectorAll('[data-inc]').forEach(function (button) {
      button.onclick = function () {
        var id = button.dataset.inc;
        var product = flow.product(id);
        var max = Number(flow.rule(id).maxRedeemQty || 1);
        if (!isAvailable(product)) { window.showToast('该商品库存为0，暂不可选择'); return; }
        if (flow.quantity(id) >= max) { window.showToast('该商品最多可兑换' + max + '件'); return; }
        if (flow.total() >= coupon.redeemQuantity) { window.showToast('本券最多选择' + coupon.redeemQuantity + '件'); return; }
        window.PrototypeState.redeemQuantities[id] = flow.quantity(id) + 1;
        window.navigateTo('mobile-flow');
      };
    });
    document.querySelectorAll('[data-dec]').forEach(function (button) {
      button.onclick = function () { window.PrototypeState.redeemQuantities[button.dataset.dec] = Math.max(0, flow.quantity(button.dataset.dec) - 1); window.navigateTo('mobile-flow'); };
    });
    document.querySelectorAll('[data-product-detail]').forEach(function (button) { button.onclick = function () { openProductDetail(button.dataset.productDetail); }; });
    var province = document.getElementById('storeProvince');
    if (province) province.onchange = function () { window.PrototypeState.selectedProvince = this.value; window.PrototypeState.selectedCity = ''; window.PrototypeState.selectedStoreId = ''; window.navigateTo('mobile-flow'); };
    var city = document.getElementById('storeCity');
    if (city) city.onchange = function () { window.PrototypeState.selectedCity = this.value; window.PrototypeState.selectedStoreId = ''; window.navigateTo('mobile-flow'); };
    var store = document.getElementById('storeName');
    if (store) store.onchange = function () { window.PrototypeState.selectedStoreId = this.value; window.navigateTo('mobile-flow'); };
    var changeStore = document.querySelector('[data-change-store]');
    if (changeStore) changeStore.onclick = function () { window.PrototypeState.exchangeStep = 'store'; window.navigateTo('mobile-flow'); };
    var submit = document.querySelector('[data-submit-selection]');
    if (submit) submit.onclick = function () {
      if (flow.total() !== coupon.redeemQuantity) { window.showToast('请先按规则选择商品'); return; }
      if (coupon.fulfillmentType === 'direct_ship') {
        window.navigateTo('mobile-mall-order');
      } else if (coupon.fulfillmentType === 'store_verify') {
        if (!selectedStore()) { window.showToast('请先选择核销门店'); gotoStep('store'); return; }
        window.ExchangeFlow.createRedemption({store:selectedStore(),verifyCode:'8265 2074 9931'});
        window.navigateTo('mobile-store-code');
      } else {
        gotoStep('confirm');
      }
    };
    var back = document.querySelector('[data-back]');
    if (back) back.onclick = function () {
      var previous = {store:'detail',select:coupon.fulfillmentType === 'store_verify' ? 'store' : 'detail',confirm:'select',success:'confirm'};
      gotoStep(previous[window.PrototypeState.exchangeStep] || 'detail');
    };
    document.querySelectorAll('[data-home]').forEach(function (button) { button.onclick = function () { window.navigateTo('mobile-home'); }; });
    var currentRecord = document.querySelector('[data-current-record]');
    if (currentRecord) currentRecord.onclick = function () { window.navigateTo('mobile-current-record'); };
  }

  window.Pages['mobile-flow'] = {render: renderPage, init: bind};
})();
