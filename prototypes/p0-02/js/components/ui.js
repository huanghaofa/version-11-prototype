(function () {
  'use strict';

  function pageShell(title, subtitle, body, actions) {
    return '<section class="coupon-page">' +
      '<div class="page-heading"><div><strong>' + window.escapeHTML(title) + '</strong>' + (subtitle ? '<small>' + window.escapeHTML(subtitle) + '</small>' : '') + '</div>' +
      '<div class="page-actions">' + (actions || '') + '</div></div>' +
      '<div class="page-body">' + body + '</div></section>';
  }

  function panel(title, body, extraClass, action) {
    return '<section class="panel ' + (extraClass || '') + '">' +
      '<header class="panel-header"><div class="panel-title">' + title + '</div>' + (action || '') + '</header>' +
      '<div class="panel-body">' + body + '</div>' +
    '</section>';
  }

  function status(label, type) {
    return '<span class="status status-' + (type || 'neutral') + '">' + window.escapeHTML(label) + '</span>';
  }

  function field(label, control, required, help, className) {
    return '<div class="form-field ' + (className || '') + '"><label>' +
      (required ? '<em>*</em>' : '') + window.escapeHTML(label) + '</label>' +
      control + (help ? '<small>' + window.escapeHTML(help) + '</small>' : '') +
    '</div>';
  }

  window.UI = {
    pageShell: pageShell,
    panel: panel,
    status: status,
    field: field
  };
})();
