(function () {
  'use strict';

  function couponCard(coupon) {
    var vehicle = coupon.fulfillmentType === 'telematics' ? '<div class="wallet-expire">适用车辆：粤B·3X52M · 已绑定VIN</div>' : '';
    return '<div class="wallet-coupon" data-open-coupon="' + coupon.id + '"><div class="wallet-coupon-main"><div class="wallet-coupon-type">' + coupon.fulfillmentLabel + '兑换券</div><h3>' + coupon.name + '</h3><p>' + coupon.subtitle + ' · 单一履约</p>' + vehicle + '<div class="wallet-expire">有效期至 ' + coupon.expiresAt + '</div></div><div class="wallet-coupon-action"><span>可使用</span><button>去使用</button></div></div>';
  }

  function redeemedCard() {
    return '<div class="wallet-coupon redeemed" data-open-record><div class="wallet-coupon-main"><div class="wallet-coupon-type">车联网兑换券</div><h3>GUI皮肤固定组合兑换券</h3><p>卡券已核销 · 履约成功</p><div class="wallet-expire">兑换时间 2026-08-25 10:36</div></div><div class="wallet-coupon-action"><span>已核销</span><button>查看内容</button></div></div>';
  }

  window.Pages['mobile-home'] = {
    render: function () {
      var cards = window.ExchangeCouponMock.couponExamples.filter(function (coupon) { return coupon.phaseOne; }).map(couponCard).join('');
      return window.prototypeShell('前台卡券中心', '卡券中心 / App与微信小程序',
        '<div class="mobile-workspace"><div class="phone"><div class="phone-notch"></div><div class="mobile-nav">我的卡券</div><div class="mobile-body wallet-body">' +
        '<div class="wallet-summary"><div><span>可使用</span><b>1</b></div><div><span>已核销</span><b>6</b></div><div><span>已过期</span><b>1</b></div></div>' +
        '<div class="wallet-tabs"><span class="active">全部</span><span>可使用</span><span>已核销</span><span>已过期</span></div>' + cards + redeemedCard() +
        '<div class="mobile-tabbar"><span>首页</span><span>商城</span><span class="active">卡券</span><span>我的</span></div></div></div>' +
        '<div><div class="panel"><div class="panel-head">一期前台入口 <span class="tag orange">已确认</span></div><div class="panel-body"><div class="evidence-note"><b>一期只展示产品中心GUI皮肤兑换券。</b>直邮与到店/E3S是独立场景，本次不修改也不混入一期主入口。</div><div style="margin-top:16px"><b>同步履约</b><p class="helper">用户选完GUI皮肤后确认兑换，卡券中心同步调用车联网并直接展示最终成功或失败。</p></div></div></div>' +
        '<div class="panel"><div class="panel-head">一期规则</div><div class="panel-body"><p>• 商品数据来自产品中心，不依赖商城销售上架。</p><p style="margin-top:8px">• 销售未上架但可兑换的GUI皮肤仍可选。</p><p style="margin-top:8px">• 同步成功才核销；同步失败卡券保持可使用。</p></div></div></div></div>');
    },
    init: function () {
      document.querySelectorAll('[data-open-coupon]').forEach(function (card) {
        card.onclick = function () {
          window.ExchangeFlow.startCoupon(card.dataset.openCoupon);
          window.navigateTo('mobile-flow');
        };
      });
      document.querySelector('[data-open-record]').onclick = function () { window.navigateTo('mobile-record'); };
    }
  };
})();
