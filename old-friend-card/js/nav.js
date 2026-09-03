(function () {
  'use strict';

  var config = window.InlineNavConfig || { menu: [] };
  var validPages = config.menu.map(function (item) { return item.key; });
  var currentPage = 'coupon-config';
  var titleMap = {
    'coupon-config': '新增售后维保券',
    sequence: '建券至核销流程'
  };

  function navIcon(item) {
    if (item.key === 'coupon-config') return '<span class="nav-icon el-icon-s-ticket" aria-hidden="true"></span>';
    return '<span class="nav-icon nav-icon-text" aria-hidden="true">' + window.escapeHTML(item.icon || '流') + '</span>';
  }

  function normalizePage(value) {
    var key = String(value || '').replace(/^#\/?/, '').split('?')[0];
    return validPages.indexOf(key) >= 0 ? key : 'coupon-config';
  }

  function renderNav() {
    var nav = document.getElementById('main-nav');
    if (!nav) return;
    var links = config.menu.map(function (item) {
      return '<li><a class="nav-link" href="#' + window.escapeHTML(item.key) + '" data-page="' + window.escapeHTML(item.key) + '">' +
        navIcon(item) +
        '<span class="nav-label">' + window.escapeHTML(item.label) + '</span></a></li>';
    }).join('');
    nav.innerHTML = '<div class="app-brand" title="东风日产"><img class="brand-logo" src="assets/media/sit-logo.png" alt="东风日产"></div>' +
      '<ul class="nav-list">' + links + '</ul>' +
      '<div class="nav-bottom"><span class="nav-icon el-icon-setting" aria-hidden="true"></span><span class="nav-label">系统设置</span></div>';
    highlight();
  }

  function highlight() {
    document.querySelectorAll('.nav-link').forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('data-page') === currentPage);
      if (link.getAttribute('data-page') === currentPage) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  }

  function closeMobileNav() {
    var nav = document.getElementById('main-nav');
    var toggle = document.getElementById('menu-mode-toggle');
    if (nav) nav.classList.remove('is-open');
    document.body.classList.remove('mobile-nav-open');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
  }

  function bindMenuToggle() {
    var toggle = document.getElementById('menu-mode-toggle');
    var nav = document.getElementById('main-nav');
    if (!toggle || !nav) return;
    toggle.addEventListener('click', function () {
      if (!window.matchMedia('(max-width: 760px)').matches) return;
      var open = !nav.classList.contains('is-open');
      nav.classList.toggle('is-open', open);
      document.body.classList.toggle('mobile-nav-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.addEventListener('click', function (event) {
      if (event.target.closest('.nav-link')) closeMobileNav();
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeMobileNav();
    });
    window.addEventListener('resize', function () {
      if (!window.matchMedia('(max-width: 760px)').matches) closeMobileNav();
    });
  }

  function renderPage(pageKey, updateHash) {
    var page = normalizePage(pageKey);
    var module = window.Pages && window.Pages[page];
    if (!module || typeof module.render !== 'function') return;
    currentPage = page;
    var root = document.getElementById('page-content');
    root.innerHTML = module.render();
    if (typeof module.init === 'function') module.init();
    if (updateHash && window.location.hash !== '#' + page) window.location.hash = page;
    highlight();
    document.title = (titleMap[page] || '老友卡适用范围') + '｜老友卡适用范围';
    if (window.AnnotationRuntime && typeof window.AnnotationRuntime.refresh === 'function') window.AnnotationRuntime.refresh();
  }

  function maybeRefreshConfig() {
    if (window.location.protocol === 'file:') return Promise.resolve();
    return fetch('config/nav.json?v=20260903-2')
      .then(function (res) { if (!res.ok) throw new Error('HTTP ' + res.status); return res.json(); })
      .then(function (loaded) { config = loaded; validPages = config.menu.map(function (item) { return item.key; }); renderNav(); })
      .catch(function () { console.info('[Prototype] nav.json 不可用，继续使用内联导航。'); });
  }

  window.navigateTo = function (pageKey) { renderPage(pageKey, true); };
  window.getCurrentPage = function () { return currentPage; };
  window.getNavConfig = function () { return config; };

  function init() {
    renderNav();
    bindMenuToggle();
    maybeRefreshConfig().then(function () { renderPage(window.location.hash, false); });
    window.addEventListener('hashchange', function () { closeMobileNav(); renderPage(window.location.hash, false); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
