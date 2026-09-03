(function () {
  'use strict';

  window.Pages = window.Pages || {};

  function placeholder(title, step) {
    return {
      render: function () {
        return '<section class="page-placeholder" aria-labelledby="placeholder-title">' +
          '<div class="placeholder-card">' +
            '<div class="placeholder-kicker">' + window.escapeHTML(step) + '</div>' +
            '<h1 id="placeholder-title">' + window.escapeHTML(title) + '</h1>' +
            '<p>静态路由骨架已建立，页面交互将在后续实施步骤中装配。</p>' +
          '</div>' +
        '</section>';
      },
      init: function () {}
    };
  }

  window.Pages['coupon-config'] = placeholder('新增售后维保券', '后台页面');
  window.Pages.sequence = placeholder('建券至核销流程', '业务流程');
})();
