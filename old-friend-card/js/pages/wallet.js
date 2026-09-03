(function () {
  'use strict';

  var state = { view: 'list', productsExpanded: false };

  function relatedProductNames(coupon) {
    return window.getOldFriendCardsByIds(coupon.relatedCarProductIds).map(function (card) {
      return card.carProductName;
    });
  }

  function detailActionAttributes(isOldFriend) {
    return isOldFriend ? ' data-open-coupon-detail' : ' data-existing-detail';
  }

  function maintenanceCouponHTML(coupon, isOldFriend) {
    var detailAttrs = detailActionAttributes(isOldFriend);
    var titleAnno = isOldFriend ? ' data-anno="wallet-old-friend-coupon-title"' : '';
    var detailAnno = isOldFriend ? ' data-anno="wallet-detail-entry"' : '';
    var useAttrs = isOldFriend
      ? ' id="use-old-friend-coupon" data-testid="use-old-friend-coupon" data-anno="wallet-use-old-friend-coupon"'
      : ' id="existing-use-entry"';
    return '<article class="maintenance-coupon" id="' + (isOldFriend ? 'old-friend-wallet-card' : 'existing-wallet-card') + '"' + (isOldFriend ? ' data-testid="old-friend-wallet-card"' : '') + '>' +
      '<div class="maintenance-coupon-body">' +
        '<button class="maintenance-artwork coupon-detail-trigger" type="button"' + detailAttrs + ' aria-label="查看' + window.escapeHTML(coupon.title) + '详情"><span>售后服务</span><strong>' + window.escapeHTML(coupon.artworkLabel) + '</strong></button>' +
        '<button class="maintenance-copy coupon-detail-trigger" type="button"' + detailAttrs + '><span class="maintenance-title"' + titleAnno + '>' + window.escapeHTML(coupon.title) + '</span><span class="maintenance-subtitle">' + window.escapeHTML(coupon.subtitle) + '</span><small>使用时间：' + window.escapeHTML(coupon.useTime) + '</small></button>' +
        '<div class="maintenance-offer"><button class="offer-detail-trigger" type="button"' + detailAttrs + ' aria-label="查看优惠详情"><strong><em>' + window.escapeHTML(coupon.amountPrefix) + '</em>' + window.escapeHTML(coupon.amount) + '</strong><span>' + window.escapeHTML(coupon.amountCaption) + '</span></button><button class="maintenance-use-button" type="button"' + useAttrs + '>立即使用</button></div>' +
      '</div>' +
      '<div class="maintenance-rule-row"><button class="maintenance-rule-link" type="button"' + detailAttrs + detailAnno + '>详细规则 <span aria-hidden="true">›</span></button><div class="maintenance-tags"><span>' + window.escapeHTML(coupon.couponType) + '</span><span>' + window.escapeHTML(coupon.channel) + '</span></div><em class="maintenance-status">' + window.escapeHTML(coupon.status) + '</em></div>' +
    '</article>';
  }

  function walletListHTML() {
    var coupons = window.MockData.walletCoupons;
    return '<div class="wallet-list-view">' +
      '<header class="mobile-header"><button type="button" data-shell-action aria-label="返回">‹</button><h1>我的卡券</h1><button type="button" data-shell-action aria-label="更多">•••</button></header>' +
      '<div class="wallet-tabs" role="tablist"><button type="button" role="tab">待激活</button><button class="active" type="button" role="tab" aria-selected="true">待使用</button><button type="button" role="tab">全部</button></div>' +
      '<div class="wallet-segment" role="tablist"><button class="active" type="button" role="tab" aria-selected="true">优惠券</button><button type="button" role="tab">奖品</button></div>' +
      '<div class="wallet-list-scroll"><main class="coupon-list">' + maintenanceCouponHTML(coupons[0], true) + maintenanceCouponHTML(coupons[1], false) + '</main>' +
      '<div class="wallet-entries"><button type="button" data-shell-action>进入领券中心 <span>›</span></button><button type="button" id="history-entry">查看历史优惠券 <span>›</span></button></div></div>' +
      '<nav class="mobile-bottom-nav" aria-label="应用底部导航"><span>首页</span><span>服务</span><span class="active">卡券</span><span>我的</span></nav>' +
    '</div>';
  }

  function couponDetailHTML(coupon) {
    var productNames = relatedProductNames(coupon);
    var applicableProducts = productNames.length
      ? '<div class="detail-rule-item" data-anno="wallet-old-friend-products"><dt>适用商品</dt><dd><span id="applicable-product-names" class="applicable-product-names' + (state.productsExpanded ? ' is-expanded' : '') + '">' + window.escapeHTML(productNames.join('、')) + '</span><button type="button" id="toggle-product-names" hidden>' + (state.productsExpanded ? '收起' : '查看更多') + '</button></dd></div>'
      : '';
    return '<div class="wallet-detail-view">' +
      '<header class="mobile-header detail-header"><button type="button" id="back-to-wallet" aria-label="返回卡包">‹</button><h1>卡券详情</h1><button type="button" data-shell-action aria-label="更多">•••</button></header>' +
      '<main class="wallet-detail-scroll">' +
        '<section class="detail-coupon-hero">' +
          '<div class="detail-artwork"><span>售后服务</span><strong>' + window.escapeHTML(coupon.artworkLabel) + '</strong></div>' +
          '<div class="detail-coupon-copy"><span class="detail-type">卡券中心：' + window.escapeHTML(coupon.couponType) + '</span><h2 data-anno="wallet-old-friend-coupon-title">' + window.escapeHTML(coupon.title) + '</h2><p>' + window.escapeHTML(coupon.subtitle) + '</p><small>使用时间：' + window.escapeHTML(coupon.useTime) + '</small></div>' +
          '<div class="detail-offer"><strong><em>' + window.escapeHTML(coupon.amountPrefix) + '</em>' + window.escapeHTML(coupon.amount) + '</strong><span>' + window.escapeHTML(coupon.amountCaption) + '</span></div>' +
        '</section>' +
        '<section class="verification-code-card"><div><span>核销码</span><strong id="mock-verification-code">' + window.escapeHTML(coupon.verificationCode) + '</strong></div><button type="button" id="copy-verification-code">点击复制</button></section>' +
        '<section class="detail-rule-card"><h3>详细规则</h3><dl>' +
          '<div class="detail-rule-item"><dt>卡券名称</dt><dd>' + window.escapeHTML(coupon.title) + '</dd></div>' +
          '<div class="detail-rule-item"><dt>卡券描述</dt><dd>' + window.escapeHTML(coupon.subtitle) + '</dd></div>' +
          '<div class="detail-rule-item"><dt>使用条件</dt><dd>' + window.escapeHTML(coupon.condition) + '</dd></div>' +
          applicableProducts +
          '<div class="detail-rule-item"><dt>卡券优惠</dt><dd>' + window.escapeHTML(coupon.amountPrefix + coupon.amount + ' · ' + coupon.amountCaption) + '</dd></div>' +
          '<div class="detail-rule-item"><dt>卡券领取时间</dt><dd>' + window.escapeHTML(coupon.claimedAt) + '</dd></div>' +
          '<div class="detail-rule-item"><dt>卡券有效期</dt><dd>' + window.escapeHTML(coupon.useTime) + '</dd></div>' +
          '<div class="detail-rule-item"><dt>使用须知</dt><dd>' + window.escapeHTML(coupon.notice) + '</dd></div>' +
        '</dl></section>' +
      '</main>' +
      '<div class="detail-action-bar"><button class="maintenance-use-button detail-use-button" type="button" id="detail-use-old-friend-coupon" data-anno="wallet-use-old-friend-coupon">立即使用</button></div>' +
    '</div>';
  }

  function phoneHTML() {
    var coupon = window.MockData.walletCoupons[0];
    return '<div class="phone-frame" aria-label="我的卡券"><div class="phone-status"><span>9:41</span><span>日产智联</span><span>● ◒</span></div>' + (state.view === 'detail' ? couponDetailHTML(coupon) : walletListHTML()) + '</div>';
  }

  function render() {
    return '<section class="wallet-page" data-page="wallet"><div class="wallet-review-layout">' + phoneHTML() + '</div></section>';
  }

  function rerender() {
    var root = document.getElementById('page-content');
    if (!root) return;
    root.innerHTML = render();
    init();
    if (window.AnnotationRuntime) window.AnnotationRuntime.refresh();
  }

  function openUseExplanation() {
    var coupon = window.MockData.walletCoupons[0];
    var productNames = relatedProductNames(coupon);
    window.PrototypeDialog.open({
      id: 'wallet-use-dialog',
      className: 'wallet-use-dialog',
      title: '使用卡券',
      subtitle: '请核对本次服务与卡券适用范围',
      body: '<div class="use-explanation"><div class="use-icon">券</div><h3>' + window.escapeHTML(coupon.title) + '</h3><p>' + window.escapeHTML(coupon.subtitle) + '</p><dl><div><dt>适用商品</dt><dd>' + window.escapeHTML(productNames.join('、')) + '</dd></div><div><dt>优惠内容</dt><dd>' + window.escapeHTML(coupon.amountPrefix + coupon.amount + ' · ' + coupon.amountCaption) + '</dd></div><div><dt>有效期</dt><dd>' + window.escapeHTML(coupon.useTime) + '</dd></div></dl></div>',
      footer: '<button class="btn btn-primary" type="button" data-dialog-close data-testid="close-use-dialog">关闭</button>'
    });
  }

  function openDetail() {
    state.view = 'detail';
    state.productsExpanded = false;
    rerender();
  }

  function init() {
    document.querySelectorAll('[data-open-coupon-detail]').forEach(function (entry) {
      entry.addEventListener('click', openDetail);
    });
    document.querySelectorAll('[data-existing-detail]').forEach(function (entry) {
      entry.addEventListener('click', function () { window.showToast('该卡券详情暂未开放'); });
    });
    var backButton = document.getElementById('back-to-wallet');
    if (backButton) backButton.addEventListener('click', function () { state.view = 'list'; state.productsExpanded = false; rerender(); });
    var listUseButton = document.getElementById('use-old-friend-coupon');
    if (listUseButton) listUseButton.addEventListener('click', openUseExplanation);
    var detailUseButton = document.getElementById('detail-use-old-friend-coupon');
    if (detailUseButton) detailUseButton.addEventListener('click', openUseExplanation);
    var existingUseButton = document.getElementById('existing-use-entry');
    if (existingUseButton) existingUseButton.addEventListener('click', function () { window.showToast('该卡券暂不可用'); });
    var copyButton = document.getElementById('copy-verification-code');
    if (copyButton) copyButton.addEventListener('click', function () {
      var value = document.getElementById('mock-verification-code').textContent;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value).then(function () { window.showToast('复制成功'); }).catch(function () { window.showToast('复制失败，请长按核销码复制'); });
      } else {
        window.showToast('请长按核销码复制');
      }
    });
    var productNames = document.getElementById('applicable-product-names');
    var productToggle = document.getElementById('toggle-product-names');
    if (productNames && productToggle) {
      window.requestAnimationFrame(function () {
        if (state.productsExpanded || productNames.scrollHeight > productNames.clientHeight + 1) productToggle.hidden = false;
      });
      productToggle.addEventListener('click', function () { state.productsExpanded = !state.productsExpanded; rerender(); });
    }
    var historyButton = document.getElementById('history-entry');
    if (historyButton) historyButton.addEventListener('click', function () { window.showToast('历史优惠券暂未开放'); });
    document.querySelectorAll('[data-shell-action]').forEach(function (button) {
      button.addEventListener('click', function () { window.showToast('该功能暂未开放'); });
    });
  }

  window.Pages.wallet = {
    render: render,
    renderDetail: function () { return couponDetailHTML(window.MockData.walletCoupons[0]); },
    init: init
  };
})();
