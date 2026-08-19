(function () {
  'use strict';
  window.escapeHtml = function (value) {
    return String(value == null ? '' : value).replace(/[&<>\"']/g, function (char) {
      return {'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[char];
    });
  };
  window.maskCouponCode = function (code) {
    var value = String(code || '');
    if (value.length < 8) return value;
    var start = Math.floor((value.length - 4) / 2);
    return value.slice(0, start) + '****' + value.slice(start + 4);
  };
  window.formatMoney = function (value) {
    return value == null ? '—' : '¥' + Number(value).toFixed(2);
  };
  window.showToast = function (message) {
    var wrap = document.querySelector('.toast-wrap');
    if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; document.body.appendChild(wrap); }
    var item = document.createElement('div'); item.className = 'toast'; item.textContent = message; wrap.appendChild(item);
    window.setTimeout(function () { item.remove(); }, 2200);
  };
  window.closeLayer = function () {
    var layer = document.querySelector('.modal-mask,.drawer-mask');
    if (layer) layer.remove();
  };
})();
