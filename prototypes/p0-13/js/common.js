(function () {
  'use strict';

  var toastTimer = null;

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (ch) {
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch];
    });
  }

  window.escapeHTML = esc;

  window.showToast = function (message) {
    var toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 2200);
  };

  window.openPageSpec = function () {
    var key = window.getCurrentPage ? window.getCurrentPage() : 'overview';
    var spec = ((window.PrototypeData || {}).pageSpecs || {})[key] || {};
    var enumEvidence = (window.PrototypeEnums || {}).evidence || {};
    var drawer = document.getElementById('specDrawer');
    var mask = document.getElementById('drawerMask');
    if (!drawer || !mask) return;
    drawer.innerHTML = '<div class="spec-head"><div><strong>页面标注与功能说明</strong><div style="font-size:11px;color:#bcd1e5;margin-top:2px">' + esc(spec.title || key) + '</div></div>' +
      '<button class="spec-close" type="button" aria-label="关闭">×</button></div>' +
      '<div class="spec-body">' +
      '<section class="spec-section"><h3>功能说明</h3><p>' + esc(spec.function || '待补充') + '</p></section>' +
      '<section class="spec-section"><h3>当前证据</h3><p class="spec-evidence">' + esc(spec.evidence || '待补充') + '</p></section>' +
      '<section class="spec-section"><h3>下拉枚举与级联口径</h3><p>' + esc((enumEvidence.primary || 'SIT 可见值') + '；' + (enumEvidence.secondary || 'Axure 仅辅助补充分支。')) + '</p><p>' + esc(enumEvidence.limitation || '') + '</p></section>' +
      '<section class="spec-section"><h3>Axure 辅助说明</h3><p>' + esc(spec.axure || '无') + '</p></section>' +
      '<section class="spec-section"><h3>规则 / 风险 / 待确认</h3><ul>' + (spec.risks || []).map(function (item) { return '<li>' + esc(item) + '</li>'; }).join('') + '</ul></section>' +
      '<section class="spec-section"><h3>口径</h3><p>SIT 可见页面、字段、页签和交互优先；未安全触发的条件分支才引用 Axure。原型中的记录值为演示 Mock，不代表测试环境真实业务数据。</p></section>' +
      '<section class="spec-section"><h3>配套文档</h3><p><a href="docs/interaction.html" target="_blank" rel="noopener">打开完整交互与功能说明</a></p></section>' +
      '</div>';
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    mask.hidden = false;
    drawer.querySelector('.spec-close').addEventListener('click', window.closePageSpec);
  };

  window.closePageSpec = function () {
    var drawer = document.getElementById('specDrawer');
    var mask = document.getElementById('drawerMask');
    if (drawer) { drawer.classList.remove('open'); drawer.setAttribute('aria-hidden', 'true'); }
    if (mask) mask.hidden = true;
  };

  window.openPrototypeModal = function (options) {
    options = options || {};
    window.closePrototypeModal();
    var overlay = document.createElement('div');
    overlay.className = 'prototype-modal';
    overlay.id = 'prototypeModal';
    overlay.innerHTML = '<div class="modal-card ' + (options.wide ? 'wide' : '') + '" role="dialog" aria-modal="true">' +
      '<div class="modal-head"><strong>' + esc(options.title || '功能预览') + '</strong><button class="spec-close modal-x" type="button" aria-label="关闭">×</button></div>' +
      '<div class="modal-body">' + (options.body || '') + '</div>' +
      '<div class="modal-foot"><button class="button modal-cancel" type="button">取消</button>' +
      (options.confirmText === false ? '' : '<button class="button primary modal-confirm" type="button">' + esc(options.confirmText || '确定') + '</button>') + '</div></div>';
    document.body.appendChild(overlay);
    function cancelModal() {
      window.closePrototypeModal();
      if (typeof options.onCancel === 'function') options.onCancel();
    }
    overlay.querySelector('.modal-x').addEventListener('click', cancelModal);
    overlay.querySelector('.modal-cancel').addEventListener('click', cancelModal);
    var confirm = overlay.querySelector('.modal-confirm');
    if (confirm) confirm.addEventListener('click', function () {
      if (typeof options.onConfirm === 'function') options.onConfirm();
      else { window.showToast('原型仅模拟操作，未写入任何数据'); window.closePrototypeModal(); }
    });
  };

  window.closePrototypeModal = function () {
    var modal = document.getElementById('prototypeModal');
    if (modal) modal.remove();
  };

  document.addEventListener('DOMContentLoaded', function () {
    var specButton = document.getElementById('globalSpecButton');
    var mask = document.getElementById('drawerMask');
    if (specButton) specButton.addEventListener('click', window.openPageSpec);
    if (mask) mask.addEventListener('click', window.closePageSpec);
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') { window.closePageSpec(); window.closePrototypeModal(); }
    });
  });
})();
