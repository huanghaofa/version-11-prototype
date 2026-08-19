(function () {
  'use strict';

  function couponCard(coupon) {
    var vehicle = coupon.fulfillmentType === 'telematics' ? '<div class="wallet-expire">适用车辆：粤B·3X52M · 已绑定VIN</div>' : '';
    return '<div class="wallet-coupon" data-open-coupon="' + coupon.id + '"><div class="wallet-coupon-main"><div class="wallet-coupon-type">' + coupon.fulfillmentLabel + '兑换券</div><h3>' + coupon.name + '</h3><p>' + coupon.subtitle + ' · 单一履约</p>' + vehicle + '<div class="wallet-expire">有效期至 ' + coupon.expiresAt + '</div></div><div class="wallet-coupon-action"><span>可使用</span><button>去使用</button></div></div>';
  }

  function redeemedCard() {
    return '<div class="wallet-coupon redeemed" data-open-record><div class="wallet-coupon-main"><div class="wallet-coupon-type">车联网兑换券</div><h3>车联网固定组合兑换券</h3><p>卡券已核销 · 履约处理中</p><div class="wallet-expire">兑换时间 2026-07-21 10:36</div></div><div class="wallet-coupon-action"><span>已核销</span><button>查看内容</button></div></div>';
  }

  window.Pages['mobile-home'] = {
    render: function () {
      var cards = window.ExchangeCouponMock.couponExamples.map(couponCard).join('');
      return window.prototypeShell('前台卡券中心', '卡券中心 / App与微信小程序',
        '<div class="mobile-workspace"><div class="phone"><div class="phone-notch"></div><div class="mobile-nav">我的卡券</div><div class="mobile-body wallet-body">' +
        '<div class="wallet-summary"><div><span>可使用</span><b>3</b></div><div><span>已核销</span><b>6</b></div><div><span>已过期</span><b>1</b></div></div>' +
        '<div class="wallet-tabs"><span class="active">全部</span><span>可使用</span><span>已核销</span><span>已过期</span></div>' + cards + redeemedCard() +
        '<div class="mobile-tabbar"><span>首页</span><span>商城</span><span class="active">卡券</span><span>我的</span></div></div></div>' +
        '<div><div class="panel"><div class="panel-head">前台入口 <span class="tag orange">本轮目标态</span></div><div class="panel-body"><div class="evidence-note">三张卡片代表三张独立兑换券，每张券只配置一种履约方式。它们不是同一张券内的履约切换。</div><div style="margin-top:16px"><b>三条演示链路</b><p class="helper">车联网：选商品后直接确认；直邮：选商品后跳商城确认订单并选择地址；到店：先选省、市、门店，再选商品并展示核销码。</p></div></div></div>' +
        '<div class="panel"><div class="panel-head">共同规则</div><div class="panel-body"><p>• 兑换单创建成功即核销卡券。</p><p style="margin-top:8px">• 卡券状态与履约/发货/门店核销状态分开。</p><p style="margin-top:8px">• 商品库存为0时仍可查看详情，但不能选择。</p></div></div></div></div>');
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
