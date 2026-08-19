(function () {
  'use strict';

  window.escapeHTML = function (value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  window.showToast = function (message, type) {
    var root = document.getElementById('toast-root');
    if (!root) return;
    var toast = document.createElement('div');
    toast.className = 'toast toast-' + (type || 'success');
    toast.textContent = message;
    root.appendChild(toast);
    window.setTimeout(function () {
      toast.classList.add('toast-leave');
      window.setTimeout(function () { toast.remove(); }, 220);
    }, 2600);
  };

  window.closeModal = function () {
    var overlay = document.querySelector('.modal-overlay[data-prototype-modal]');
    if (overlay) overlay.remove();
  };
})();
