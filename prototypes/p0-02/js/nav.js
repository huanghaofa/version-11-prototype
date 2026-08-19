(function () {
  'use strict';

  var currentPage = 'coupon-create';
  var titles = {
    overview: '组合折扣券说明',
    'coupon-create': '新建/编辑卡券'
  };

  function updateChrome() {
    document.querySelectorAll('[data-page]').forEach(function (node) {
      node.classList.toggle('active', node.getAttribute('data-page') === currentPage);
    });
    var cardListTab = document.querySelector('[data-module="card-list"]');
    if (cardListTab) cardListTab.classList.add('active');
    var crumb = document.getElementById('crumb-bar');
    if (crumb) crumb.innerHTML = '工作台&nbsp;&nbsp;&gt;&nbsp;&nbsp;卡券中心&nbsp;&nbsp;&gt;&nbsp;&nbsp;' + window.escapeHTML(titles[currentPage] || '');
  }

  window.navigateTo = function (pageKey) {
    var page = window.Pages && window.Pages[pageKey];
    if (!page || typeof page.render !== 'function') return;
    currentPage = pageKey;
    document.getElementById('app').innerHTML = page.render();
    if (typeof page.init === 'function') page.init();
    document.getElementById('app').scrollTop = 0;
    document.getElementById('app').focus();
    updateChrome();
  };

  window.getCurrentPage = function () {
    return currentPage;
  };

  function init() {
    document.querySelectorAll('[data-page]').forEach(function (node) {
      node.addEventListener('click', function () {
        window.navigateTo(node.getAttribute('data-page'));
      });
    });
    window.navigateTo(currentPage);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
