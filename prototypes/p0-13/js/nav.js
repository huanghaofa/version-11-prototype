(function () {
  'use strict';

  var config = null;
  var currentPage = 'overview';
  var sitLogoSrc = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAfCAYAAAH1pC8nAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAIqADAAQAAAABAAAAHwAAAABby91jAAAE7ElEQVRYCa2Xa2iWVRzA9+o23bxkmpHaHBYakxKki1ELlYjI1CAqkAqLLiTd/KYSlFaUFhH6IcgotkQKqQ95SUo/pGQXUssuWpLNnM6WmhqlZq71+z17zrP3eS9738EO/PY//8v5n/Oc83/O866iIm6dnZ1DQr+gzBCxHc9UuB4a435FBY5BKMqMMmoo/aB/UK6O7UatNddWDO/DVbA7OCOJ8+LEgPJhotBBbw+6afppy2TsdvVjpyvpDIGO+jRRsjrYF8DlWaZoio8xjoFlMC7lDAqOGogePNgiidHFPBWM9K+EgUF3LQsTJe5gG5WyYfDJDI5kcJr6IZQtcAPshwYYEfOOI1x1ahTOqGF/K3SOx7ZE4NyUKHYw7IRpMAlOpJy5CgET4TDsh42wCzpgXm5snh4PmJLnyDIQMwBOQFdRBR+GaHnI6mArJYndBtOh1jL9lgGe0AaoRx8EW6EZhsAWaIKZ4BEcAHfY0hwOz7hZ59GJJP1oicgREtuHZ/WHxrbB2KLSQEY27SZZAumyjDz5f4hzX47ke7oSOcMxGFwoAHs1bIC7CvnzbAT6/PdBC6yEkXlBsaH7MsiJYFAVpgGx+V/kWV/hnLDiKgleg3PwBWyGo2C1dm9iseEEXQbuScGlY/8AFhQb7+lcAD9BwbcsDMS/CB4JekricMlhD1K+XIW4L6EmsaOMhIfh8cRYokPsMPgMxkehdJITCn2kr0P0WNn97NxZ/oyBOzBUwRX030Pej3wDVtC/CPk2NIH7difMAx+7BWlRzjfJA7AOrAHfnbXwHVxHXfyG3A7ERyt+nv5ccNyLsB46rMpKgq0JHV7M56AW/oazcD50wGni/kGa0U31+3Em6vNnDnj+fpfKasT6An4Fi1MDMLSCqynZiFsI7mG6Ybwb5qet+RoxfrB25ntiC87XwVnS92e3vwHfoaIJgoOgmXASHoMJUAez4UdoCnFlSQZcCpvA92lqT4OSau0pKNtHQgvwWrgNJoNlYY1ZU5thI+zi+C2PvmlMai162S8GX3K35WmYAtFHIsyEbuxYmAWr4Th8A25xWZdDyJWSDPZcvBx/gJtSzjIVxlnXz4If3eeg7O+rb1Z/eAHa4Ub1MuctGkaOgbAc2uCangLdVm+yalgFX0P6F1bR0eU5yFcJd8AfMAN84ORlj4oVw2zSTQIL0TtnObRScBZhnzXmqSTZLTADTsLvsJ559roTXit/wQH4Dy6Bw3G/DrkPqmA8mMjFe3nuAS/MevDyDK2NxO0q5HZcA/yM7RS6Y91p4/eCecYoTex34XOYAEvgSVgKZ+AluAfmwq2wG6yZY9AC/s5aBTvARelbA9bXhXF/NXIZ+hNIH/ZecC53fyX4C/OoZ+QTvwmzQKMBp8Ej+gXcpYOxPhZZBxNhGPhD+FcYDdrdzXFM6gI93pfB/CtgEbh7bfARWA7O0QhtbpVb6KXk7nSo006xlS6gzxtz+QqLzfmdK8wbLaaWoEY4CK+AH8g+a+SzHuthH7wLfjt8+MItDtiDbIahhaN6ZyWPV4P/lbXCqxCdRMksBPqOL4Uj8CB4dL1ujHMXRsMaOATTep3EAQysAa9ovzPrYDr434sXn4sNNeaEPrWXlrfoKHgUPIbv4eZSCyhvi7oW5UfudpgDk8GC+xOsfF9ba8qffr4Vn0AzRbgNWVb7HzpXHMs2Ms1JAAAAAElFTkSuQmCC';
  var navIconMap = {
    overview: 'icon-home-fill',
    'activity-group': 'icon-xiangmuguanli',
    'coupon-group': 'icon-capital'
  };
  var passiveRailIcons = ['icon-gerendaiban','icon-qiche','icon-gongdan','icon-hetongguanli','icon-stock','icon-people','icon-synchronization','icon-systemManagement','icon-help'];

  function activateConfig(cfg) {
    config = cfg;
    render();
    var hashKey = window.location.hash.replace(/^#\/?/, '');
    window.navigateTo(window.Pages && window.Pages[hashKey] ? hashKey : 'overview', false);
  }

  function loadConfig() {
    if (window.location.protocol === 'file:' && window.InlineNavConfig) {
      activateConfig(window.InlineNavConfig);
      return Promise.resolve();
    }
    return fetch('config/nav.json').then(function (res) {
      if (!res.ok) throw new Error('导航配置加载失败');
      return res.json();
    }).then(function (cfg) {
      activateConfig(cfg);
    }).catch(function () {
      if (window.InlineNavConfig) {
        activateConfig(window.InlineNavConfig);
        return;
      }
      var nav = document.getElementById('main-nav');
      if (nav) nav.innerHTML = '<p style="padding:18px;color:#ffcfcc;font-size:12px">导航加载失败，请通过本地 HTTP 服务打开。</p>';
    });
  }

  function render() {
    var nav = document.getElementById('main-nav');
    if (!nav || !config) return;
    nav.innerHTML = '<div class="rail-brand"><img src="' + sitLogoSrc + '" alt="NISSAN"><strong>新零售营销系统</strong></div>' +
      '<div class="rail-menu-title">功能导航</div>' + buildTree(config.menu || [], 0) +
      '<div class="rail-passive-icons" aria-hidden="true">' + passiveRailIcons.map(function (iconClass) { return '<span><i class="iconfont ' + iconClass + '"></i></span>'; }).join('') + '</div>' +
      '<button class="rail-help" data-open-global-spec type="button"><i class="iconfont icon-help" aria-hidden="true"></i><span>标注与功能说明</span></button>';
    Array.prototype.forEach.call(nav.querySelectorAll('[data-page]'), function (link) {
      link.addEventListener('click', function (event) {
        event.preventDefault();
        var key = this.getAttribute('data-page');
        if (key && window.Pages && window.Pages[key]) window.navigateTo(key, true);
      });
    });
    var railHelp = nav.querySelector('[data-open-global-spec]');
    if (railHelp) railHelp.addEventListener('click', function () { window.openPageSpec(); });
  }

  function buildTree(items, depth) {
    var cls = depth ? 'nav-list nav-list--sub' : 'nav-list nav-list--root';
    return '<ul class="' + cls + '">' + items.map(function (item) {
      var hasChildren = item.children && item.children.length;
      var iconClass = navIconMap[item.key];
      var icon = iconClass ? '<span class="nav-icon"><i class="iconfont ' + iconClass + '" aria-hidden="true"></i></span>' : '';
      var pageAttr = hasChildren ? '' : ' data-page="' + item.key + '"';
      return '<li class="nav-item ' + (hasChildren ? 'nav-item--group' : '') + '">' +
        '<a href="#/' + item.key + '" class="nav-link ' + (hasChildren ? 'nav-link--group' : '') + '"' + pageAttr + '>' + icon + '<span class="nav-label">' + item.label + '</span></a>' +
        (hasChildren ? buildTree(item.children, depth + 1) : '') + '</li>';
    }).join('') + '</ul>';
  }

  function highlight() {
    var nav = document.getElementById('main-nav');
    if (!nav) return;
    Array.prototype.forEach.call(nav.querySelectorAll('.nav-link'), function (link) { link.classList.remove('active'); });
    var active = nav.querySelector('[data-page="' + currentPage + '"]');
    if (active) active.classList.add('active');
  }

  window.navigateTo = function (key, updateHash) {
    var page = window.Pages && window.Pages[key];
    if (!page) return;
    var staleAnnotationPopup = document.querySelector('.anno-popup');
    if (staleAnnotationPopup) staleAnnotationPopup.remove();
    var stalePrototypeModal = document.getElementById('prototypeModal');
    if (stalePrototypeModal) stalePrototypeModal.remove();
    currentPage = key;
    var app = document.getElementById('app');
    app.innerHTML = page.render();
    if (typeof page.init === 'function') page.init(app);
    highlight();
    window.closePageSpec();
    if (updateHash !== false && window.location.hash !== '#/' + key) window.history.replaceState(null, '', '#/' + key);
    app.focus({preventScroll:true});
  };

  window.getCurrentPage = function () { return currentPage; };
  window.getNavConfig = function () { return config; };

  window.addEventListener('hashchange', function () {
    var key = window.location.hash.replace(/^#\/?/, '');
    if (key && window.Pages && window.Pages[key] && key !== currentPage) window.navigateTo(key, false);
  });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', loadConfig);
  else loadConfig();
})();
