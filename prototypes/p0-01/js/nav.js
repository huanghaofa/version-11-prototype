(function () {
  'use strict';

  var _config = null;
  var _currentPage = 'overview';

  /* ---- Load nav config from config/nav.json ---- */
  function loadConfig() {
    if (window.location.protocol === 'file:' && window.PrototypeNavConfig) {
      _config = window.PrototypeNavConfig;
      render();
      window.navigateTo(_currentPage);
      return;
    }
    return fetch('config/nav.json?v=coupon-20260728-1')
      .then(function (res) { return res.json(); })
      .then(function (cfg) {
        _config = cfg;
        render();
        window.navigateTo(_currentPage);
      })
      .catch(function (err) {
        console.warn('Failed to load config/nav.json, using embedded menu:', err);
        if (window.PrototypeNavConfig) {
          _config = window.PrototypeNavConfig;
          render();
          window.navigateTo(_currentPage);
          return;
        }
        var navEl = document.getElementById('main-nav');
        if (navEl) {
          navEl.innerHTML = '<p style="padding:16px;color:#ff4d4f;font-size:12px;line-height:1.6;">⚠️ 导航加载失败<br>请通过 HTTP 服务器打开页面：<br><code>python3 -m http.server 8080</code></p>';
        }
      });
  }

  /* ---- Render menu tree into #main-nav ---- */
  function render() {
    var navEl = document.getElementById('main-nav');
    if (!navEl || !_config || !_config.menu) return;
    var html = buildTree(_config.menu, 0);
    navEl.innerHTML = html;
    bindClicks(navEl);
    highlightCurrent();
  }

  function buildTree(items, depth) {
    if (!items || !items.length) return '';
    var cls = depth === 0 ? 'nav-list nav-list--root' : 'nav-list nav-list--sub';
    return '<ul class="' + cls + '">' + items.map(function (item) {
      var hasChildren = item.children && item.children.length;
      var linkCls = 'nav-link' + (hasChildren ? ' nav-link--group' : '');
      var icon = item.icon ? '<span class="nav-icon">' + item.icon + '</span>' : '';
      return '<li class="nav-item' + (hasChildren ? ' nav-item--group' : '') + '">' +
        '<a href="#" class="' + linkCls + '" data-page="' + (item.key || '') + '">' +
        icon + '<span class="nav-label">' + (item.label || '') + '</span></a>' +
        (hasChildren ? buildTree(item.children, depth + 1) : '') +
        '</li>';
    }).join('') + '</ul>';
  }

  function bindClicks(navEl) {
    var links = navEl.querySelectorAll('.nav-link[data-page]');
    Array.prototype.forEach.call(links, function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        var pageKey = this.getAttribute('data-page');
        if (pageKey) window.navigateTo(pageKey);
      });
    });
  }

  function highlightCurrent() {
    var navEl = document.getElementById('main-nav');
    if (!navEl) return;
    var prev = navEl.querySelector('.nav-link.active');
    if (prev) prev.classList.remove('active');
    var cur = navEl.querySelector('.nav-link[data-page="' + _currentPage + '"]');
    if (cur) cur.classList.add('active');
  }

  /* ---- Navigate to page ---- */
  window.navigateTo = function (pageKey) {
    _currentPage = pageKey;
    var page = window.Pages && window.Pages[pageKey];
    if (!page || typeof page.render !== 'function') return;
    document.getElementById('app').innerHTML = page.render();
    if (typeof page.init === 'function') page.init();
    highlightCurrent();
  };

  window.getCurrentPage = function () {
    return _currentPage;
  };

  window.getNavConfig = function () {
    return _config;
  };

  /* ---- Init ---- */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadConfig);
  } else {
    loadConfig();
  }
})();
