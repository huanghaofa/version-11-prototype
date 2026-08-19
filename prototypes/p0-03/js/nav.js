(function () {
  'use strict';
  var config = null;
  var currentPage = 'subsidy-data';
  var fallbackConfig = { menu: [
    { key: 'subsidy-data', label: '卡券补贴数据', icon: '▣' },
    { key: 'rule-settings', label: '补贴规则设置', icon: '⚙' }
  ] };

  function loadConfig() {
    return fetch('config/nav.json').then(function (res) { return res.json(); }).then(function (cfg) {
      config = cfg;
      renderNav();
      var fromHash = window.location.hash.replace('#', '');
      window.navigateTo(window.Pages[fromHash] ? fromHash : currentPage);
    }).catch(function (err) {
      config = fallbackConfig;
      renderNav();
      var fromHash = window.location.hash.replace('#', '');
      window.navigateTo(window.Pages[fromHash] ? fromHash : currentPage);
      console.info('已使用内置导航配置；通过 HTTP 打开时将读取 config/nav.json。');
    });
  }
  function renderNav() {
    var html = '<ul class="nav-list">' + config.menu.map(function (item) {
      return '<li><a href="#' + item.key + '" class="nav-link" data-page="' + item.key + '"><span class="nav-icon">' + item.icon + '</span><span>' + item.label + '</span></a></li>';
    }).join('') + '</ul>';
    document.getElementById('main-nav').innerHTML = html;
    document.getElementById('main-nav').addEventListener('click', function (event) {
      var link = event.target.closest('[data-page]');
      if (!link) return;
      event.preventDefault();
      window.navigateTo(link.dataset.page);
    });
  }
  function highlight() {
    document.querySelectorAll('.nav-link').forEach(function (link) { link.classList.toggle('active', link.dataset.page === currentPage); });
  }
  window.navigateTo = function (pageKey) {
    if (!window.Pages[pageKey]) return;
    currentPage = pageKey;
    window.location.hash = pageKey;
    document.getElementById('app').innerHTML = window.Pages[pageKey].render();
    window.Pages[pageKey].init();
    highlight();
  };
  window.getCurrentPage = function () { return currentPage; };
  document.addEventListener('DOMContentLoaded', loadConfig);
})();
