(function () {
  'use strict';

  var config = null;
  var logo = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAfCAYAAAH1pC8nAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAIqADAAQAAAABAAAAHwAAAABby91jAAAE7ElEQVRYCa2Xa2iWVRzA9+o23bxkmpHaHBYakxKki1ELlYjI1CAqkAqLLiTd/KYSlFaUFhH6IcgotkQKqQ95SUo/pGQXUssuWpLNnM6WmhqlZq71+z17zrP3eS9738EO/PY//8v5n/Oc83/O866iIm6dnZ1DQr+gzBCxHc9UuB4a435FBY5BKMqMMmoo/aB/UK6O7UatNddWDO/DVbA7OCOJ8+LEgPJhotBBbw+6afppy2TsdvVjpyvpDIGO+jRRsjrYF8DlWaZoio8xjoFlMC7lDAqOGogePNgiidHFPBWM9K+EgUF3LQsTJe5gG5WyYfDJDI5kcJr6IZQtcAPshwYYEfOOI1x1ahTOqGF/K3SOx7ZE4NyUKHYw7IRpMAlOpJy5CgET4TDsh42wCzpgXm5snh4PmJLnyDIQMwBOQFdRBR+GaHnI6mArJYndBtOh1jL9lgGe0AaoRx8EW6EZhsAWaIKZ4BEcAHfY0hwOz7hZ59GJJP1oicgREtuHZ/WHxrbB2KLSQEY27SZZAumyjDz5f4hzX47ke7oSOcMxGFwoAHs1bIC7CvnzbAT6/PdBC6yEkXlBsaH7MsiJYFAVpgGx+V/kWV/hnLDiKgleg3PwBWyGo2C1dm9iseEEXQbuScGlY/8AFhQb7+lcAD9BwbcsDMS/CB4JekricMlhD1K+XIW4L6GmsaOMhIfh8cRYokPsMPgMxkehdJITCn2kr0P0WNn97NxZ/oyBOzBUwRX030Pej3wDVtC/CPk2NIH7difMAx+7BWlRzjfJA7AOrAHfnbXwHVxHXfyG3A7ERyt+nv5ccNyLsB46rMpKgq0JHV7M56AW/oazcD50wGni/kGa0U31+3Em6vNnDnj+fpfKasT6An4Fi1MDMLSCqynZiFsI7mG6Ybwb5qet+RoxfrB25ntiC87XwVnS92e3vwHfoaIJgoOgmXASHoMJUAez4UdoCnFlSQZcCpvA92lqT4OSau0pKNtHQgvwWrgNJoNlYY1ZU5thI+zi+C2PvmlMai162S8GX3K35WmYAtFHIsyEbuxYmAWr4Th8A25xWZdDyJWSDPZcvBx/gJtSzjIVxlnXz4If3eeg7O+rb1Z/eAHa4Ub1MuctGkaOgbAc2uCangLdVm+yalgFX0P6F1bR0eU5yFcJd8AfMAN84ORlj4oVw2zSTQIL0TtnObRScBZhnzXmqSTZLTADTsLvsJ559roTXit/wQH4Dy6Bw3G/DrkPqmA8mMjFe3nuAS/MevDyDK2NxO0q5HZcA/yM7RS6Y91p4/eCecYoTex34XOYAEvgSVgKZ+AluAfmwq2wG6yZY9AC/s5aBTvARelbA9bXhXF/NXIZ+hNIH/ZecC53fyX4C/OoZ+QTvwmzQKMBp8Ej+gXcpYOxPhZZBxNhGPhD+FcYDdrdzXFM6gI93pfB/CtgEbh7bfARWA7O0QhtbpVb6KXk7nSo006xlS6gzxtz+QqLzfmdK8wbLaaWoEY4CK+AH8g+a+SzHuthH7wLfjt8+MItDtiDbIahhaN6ZyWPV4P/lbXCqxCdRMksBPqOL4Uj8CB4dL1ujHMXRsMaOATTep3EAQysAa9ovzPrYDr434sXn4sNNeaEPrWXlrfoKHgUPIbv4eZSCyhvi7oW5UfudpgDk8GC+xOsfF9ba8qffr4Vn0AzRbgNWVb7HzpXHMs2Ms1JAAAAAElFTkSuQmCC';

  function render() {
    var nav = document.getElementById('main-nav');
    if (!nav || !config) return;
    nav.innerHTML = '<div class="brand-row"><img src="' + logo + '" alt="NISSAN"><strong>新零售营销系统</strong></div>' +
      '<div class="nav-section-label">功能导航</div>' + config.menu.map(function (item) {
        if (item.passive) return '<div class="nav-link"><span class="nav-dot"></span>' + item.label + '</div>';
        return '<div class="nav-group"><button class="nav-group-title" type="button">' + item.label + '</button><div class="nav-sub">' +
          (item.children || []).map(function (child) { return '<a class="nav-link" data-route="' + child.route + '" href="#' + child.route + '"><span class="nav-dot"></span>' + child.label + '</a>'; }).join('') +
          '</div></div>';
      }).join('');
  }

  function setActive(route) {
    var mapped = route;
    if (['activity-create','activity-detail','activity-manage'].indexOf(route) > -1) mapped = 'activity-manage';
    if (['sa-placement-manage','sa-placement-edit','sa-placement-detail','sa-qr-settings'].indexOf(route) > -1) mapped = 'sa-placement-manage';
    if (['activity-overview','activity-qr','activity-participation'].indexOf(route) > -1) mapped = 'activity-overview';
    if (['coupon-overview','coupon-claim','coupon-redeem'].indexOf(route) > -1) mapped = 'coupon-overview';
    document.querySelectorAll('[data-route]').forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('data-route') === mapped);
    });
  }

  window.SANav = { setActive:setActive };

  function start(result) {
    config = result;
    render();
    if (!location.hash) location.hash = config.defaultPage;
    window.SAApp.navigate();
  }

  function startInline() {
    if (!window.SAInlineNavConfig) return false;
    start(window.SAInlineNavConfig);
    return true;
  }

  if (location.protocol === 'file:' && startInline()) return;

  fetch('config/nav.json').then(function (response) {
    if (!response.ok) throw new Error('nav config load failed');
    return response.json();
  }).then(start).catch(function () {
    if (startInline()) return;
    document.getElementById('app').innerHTML = '<div class="loading-card">导航配置加载失败，请检查静态资源是否完整。</div>';
  });
})();
