(function () {
  'use strict';

  var active = null;
  var previousFocus = null;

  function close(reason) {
    if (!active) return;
    var onClose = active._onClose;
    active.remove();
    active = null;
    document.body.classList.remove('dialog-open');
    if (previousFocus && typeof previousFocus.focus === 'function') previousFocus.focus();
    previousFocus = null;
    if (typeof onClose === 'function') onClose(reason || 'close');
  }

  function open(options) {
    close('replace');
    var settings = options || {};
    previousFocus = document.activeElement;
    var overlay = document.createElement('div');
    overlay.className = 'dialog-overlay';
    overlay.setAttribute('role', 'presentation');
    overlay.innerHTML = '<section class="dialog-shell ' + window.escapeHTML(settings.className || '') + '" id="' + window.escapeHTML(settings.id || 'prototype-dialog') + '" role="dialog" aria-modal="true" aria-labelledby="prototype-dialog-title">' +
      '<header class="dialog-header"><div><h2 id="prototype-dialog-title">' + window.escapeHTML(settings.title || '') + '</h2>' + (settings.subtitle ? '<p>' + window.escapeHTML(settings.subtitle) + '</p>' : '') + '</div><button class="dialog-close el-icon-close" type="button" aria-label="关闭弹窗"></button></header>' +
      '<div class="dialog-body">' + (settings.body || '') + '</div>' +
      '<footer class="dialog-footer">' + (settings.footer || '<button class="btn" type="button" data-dialog-close>关闭</button>') + '</footer>' +
    '</section>';
    overlay._onClose = settings.onClose;
    overlay.addEventListener('click', function (event) {
      if (event.target === overlay || event.target.closest('[data-dialog-close]') || event.target.closest('.dialog-close')) close('dismiss');
    });
    document.body.appendChild(overlay);
    document.body.classList.add('dialog-open');
    active = overlay;
    var focusTarget = overlay.querySelector('input, select, button');
    if (focusTarget) focusTarget.focus();
    return overlay;
  }

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && active) close('escape');
  });

  window.PrototypeDialog = { open: open, close: close, getActive: function () { return active; } };
})();
