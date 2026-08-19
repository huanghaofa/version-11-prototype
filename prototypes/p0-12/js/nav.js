(function () {
  'use strict';

  var config = null;
  var currentPage = '';

  function buildTree(items) {
    return '<div class="sidebar-brand"><strong>NISSAN</strong><span>新零售营销系统</span></div>' +
      '<div class="sidebar-section">活动中心</div>' +
      '<ul class="nav-list">' + items.map(function (item) {
        return '<li><a href="#' + item.key + '" class="nav-link" data-page="' + item.key + '">' +
          '<span class="nav-icon">' + (item.icon || '•') + '</span>' +
          '<span class="nav-label">' + item.label + '</span></a></li>';
      }).join('') + '</ul>' +
      '<a class="sidebar-doc" href="docs/interaction.html">功能说明</a>';
  }

  function renderNav() {
    var nav = document.getElementById('main-nav');
    if (!nav || !config) return;
    nav.innerHTML = buildTree(config.menu || []);
    Array.prototype.forEach.call(nav.querySelectorAll('[data-page]'), function (link) {
      link.addEventListener('click', function (event) {
        event.preventDefault();
        window.navigateTo(link.getAttribute('data-page'));
      });
    });
    highlight();
  }

  function highlight() {
    Array.prototype.forEach.call(document.querySelectorAll('.nav-link'), function (link) {
      link.classList.toggle('active', link.getAttribute('data-page') === currentPage);
    });
  }

  window.navigateTo = function (pageKey, replaceHash) {
    var page = window.Pages[pageKey];
    if (!page || typeof page.render !== 'function') {
      document.getElementById('app').innerHTML = '<div class="empty-page">无法加载该页面，请从已配置菜单重新进入。</div>';
      return;
    }
    currentPage = pageKey;
    if (!replaceHash && window.location.hash !== '#' + pageKey) window.location.hash = pageKey;
    document.getElementById('app').innerHTML = page.render();
    if (typeof page.init === 'function') page.init();
    highlight();
  };

  window.getCurrentPage = function () { return currentPage; };

  function start(cfg) {
    config = cfg;
    renderNav();
    var hashPage = window.location.hash.replace('#', '');
    var firstPage = (config && config.defaultPage) || (config.menu[0] && config.menu[0].key);
    window.navigateTo(window.Pages[hashPage] ? hashPage : firstPage, true);
  }

  function loadConfig() {
    if (window.location.protocol === 'file:') {
      start(window.InlineNavConfig);
      return;
    }
    fetch('config/nav.json')
      .then(function (response) {
        if (!response.ok) throw new Error('nav ' + response.status);
        return response.json();
      })
      .then(start)
      .catch(function () { start(window.InlineNavConfig); });
  }

  window.addEventListener('hashchange', function () {
    var pageKey = window.location.hash.replace('#', '');
    if (pageKey && pageKey !== currentPage && window.Pages[pageKey]) window.navigateTo(pageKey, true);
  });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', loadConfig);
  else loadConfig();
})();
