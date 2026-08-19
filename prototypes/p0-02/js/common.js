(function () {
  'use strict';

  function escapeHTML(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function money(value) {
    return '¥' + Number(value || 0).toFixed(2);
  }

  window.showToast = function (message) {
    var toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(window.__prototypeToastTimer);
    window.__prototypeToastTimer = window.setTimeout(function () {
      toast.classList.remove('show');
    }, 2200);
  };

  window.escapeHTML = escapeHTML;
  window.money = money;

  window.openPrototypeModal = function (options) {
    var existing = document.querySelector('.modal-overlay');
    if (existing) existing.remove();
    var overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML =
      '<section class="modal-content ' + (options.wide ? 'modal-wide' : '') + '" role="dialog" aria-modal="true">' +
        '<header class="modal-header"><strong>' + escapeHTML(options.title || '') + '</strong><button class="icon-button" data-close-modal aria-label="关闭">×</button></header>' +
        '<div class="modal-body">' + (options.body || '') + '</div>' +
        '<footer class="modal-footer">' +
          '<button class="btn" data-close-modal>关闭</button>' +
          (options.confirmText ? '<button class="btn btn-primary" data-confirm-modal>' + escapeHTML(options.confirmText) + '</button>' : '') +
        '</footer>' +
      '</section>';
    document.body.appendChild(overlay);
    overlay.addEventListener('click', function (event) {
      if (event.target === overlay || event.target.closest('[data-close-modal]')) overlay.remove();
      if (event.target.closest('[data-confirm-modal]') && options.onConfirm) options.onConfirm(overlay);
    });
    return overlay;
  };
})();
