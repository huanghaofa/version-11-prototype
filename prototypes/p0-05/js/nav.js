(function () {
  'use strict';

  var config = null;
  var currentPage = 'overview';

  function loadConfig() {
    return fetch('config/nav.json')
      .then(function (res) {
        if (!res.ok) throw new Error('nav.json ' + res.status);
        return res.json();
      })
      .then(function (cfg) {
        config = cfg;
        render();
        var hashPage = location.hash.replace('#/', '');
        window.navigateTo(window.Pages[hashPage] ? hashPage : 'overview', false);
      })
      .catch(function (err) {
        console.warn('Failed to load config/nav.json:', err);
        document.getElementById('main-nav').innerHTML = '<p class="nav-error">导航加载失败，请通过 HTTP 服务打开。</p>';
      });
  }

  function render() {
    var nav = document.getElementById('main-nav');
    if (!nav || !config) return;
    nav.innerHTML = '<div class="nav-product"><span>活动中心</span><small>积分奖励专题</small></div>' + buildTree(config.menu, 0);
    Array.prototype.forEach.call(nav.querySelectorAll('.nav-link[data-page]'), function (link) {
      link.addEventListener('click', function (event) {
        event.preventDefault();
        var page = this.getAttribute('data-page');
        if (page) window.navigateTo(page);
      });
    });
  }

  function buildTree(items, depth) {
    return '<ul class="nav-list ' + (depth ? 'nav-list--sub' : 'nav-list--root') + '">' + items.map(function (item) {
      var hasChildren = item.children && item.children.length;
      var icon = item.icon ? '<span class="nav-icon">' + item.icon + '</span>' : '';
      return '<li class="nav-item ' + (hasChildren ? 'nav-item--group' : '') + '">' +
        '<a href="#" class="nav-link ' + (hasChildren ? 'nav-link--group' : '') + '" data-page="' + (item.key || '') + '">' + icon + '<span class="nav-label">' + item.label + '</span></a>' +
        (hasChildren ? buildTree(item.children, depth + 1) : '') + '</li>';
    }).join('') + '</ul>';
  }

  function highlightCurrent() {
    Array.prototype.forEach.call(document.querySelectorAll('.nav-link.active'), function (el) { el.classList.remove('active'); });
    var current = document.querySelector('.nav-link[data-page="' + currentPage + '"]');
    if (current) current.classList.add('active');
  }

  window.navigateTo = function (pageKey, updateHash) {
    var page = window.Pages && window.Pages[pageKey];
    if (!page || typeof page.render !== 'function') return;
    currentPage = pageKey;
    if (updateHash !== false) location.hash = '#/' + pageKey;
    document.getElementById('app').innerHTML = page.render();
    if (typeof page.init === 'function') page.init();
    highlightCurrent();
    document.getElementById('app').focus({ preventScroll: true });
  };

  window.getCurrentPage = function () { return currentPage; };
  window.getNavConfig = function () { return config; };

  window.addEventListener('hashchange', function () {
    var page = location.hash.replace('#/', '');
    if (window.Pages[page] && page !== currentPage) window.navigateTo(page, false);
  });

  document.addEventListener('DOMContentLoaded', function () {
    loadConfig();
    document.getElementById('menuModeToggle').addEventListener('click', function () { document.body.classList.toggle('sidebar-collapsed'); });
    document.getElementById('globalSpecButton').addEventListener('click', function () { window.open('docs/interaction.html', '_blank', 'noopener'); });
  });
})();
