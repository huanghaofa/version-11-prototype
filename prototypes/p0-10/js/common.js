(function () {
  'use strict';

  window.escapeHtml = function (value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  window.formatMoney = function (value) {
    return '¥' + Number(value || 0).toFixed(2);
  };

  window.showToast = function (message, tone) {
    var previous = document.querySelector('.toast');
    if (previous) previous.remove();
    var toast = document.createElement('div');
    toast.className = 'toast toast-' + (tone || 'success');
    toast.textContent = message;
    document.body.appendChild(toast);
    window.setTimeout(function () {
      toast.classList.add('toast-out');
      window.setTimeout(function () { toast.remove(); }, 220);
    }, 2100);
  };
})();
