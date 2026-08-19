(function () {
  'use strict';

  window.escapeHtml = function (value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (char) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char];
    });
  };

  window.formatNumber = function (value) {
    return Number(value || 0).toLocaleString('zh-CN');
  };

  window.statusClass = function (status) {
    if (['已启用', '成功', '无差异', '已处理', '当前版本', '进行中'].indexOf(status) >= 0) return 'success';
    if (['待审核', '发放中', '重试中', '处理中'].indexOf(status) >= 0) return 'warning';
    if (['失败', '有差异', '待人工处理'].indexOf(status) >= 0) return 'danger';
    if (['已停用', '已过期', '已暂停', '已冲正'].indexOf(status) >= 0) return 'muted';
    return 'info';
  };

  window.showToast = function (message, tone) {
    var toast = document.getElementById('toast');
    if (!toast) return;
    toast.className = 'toast show ' + (tone || 'info');
    toast.textContent = message;
    clearTimeout(window.__toastTimer);
    window.__toastTimer = setTimeout(function () { toast.className = 'toast'; }, 2600);
  };

  window.openDrawer = function (title, content, width) {
    var drawer = document.getElementById('drawer');
    var mask = document.getElementById('drawerMask');
    if (!drawer || !mask) return;
    drawer.style.width = width || '620px';
    drawer.innerHTML = '<div class="drawer-header"><h2>' + escapeHtml(title) + '</h2><button class="icon-button" id="closeDrawer" type="button" aria-label="关闭">×</button></div><div class="drawer-body">' + content + '</div>';
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    mask.hidden = false;
    document.getElementById('closeDrawer').addEventListener('click', window.closeDrawer);
    mask.addEventListener('click', window.closeDrawer, { once: true });
  };

  window.closeDrawer = function () {
    var drawer = document.getElementById('drawer');
    var mask = document.getElementById('drawerMask');
    if (!drawer || !mask) return;
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    mask.hidden = true;
  };

  window.openModal = function (title, content, footer) {
    var root = document.getElementById('modalRoot');
    if (!root) return;
    root.innerHTML = '<div class="modal-overlay"><section class="modal-content" role="dialog" aria-modal="true" aria-label="' + escapeHtml(title) + '"><div class="modal-header"><h2>' + escapeHtml(title) + '</h2><button class="icon-button" id="closeModal" type="button">×</button></div><div class="modal-body">' + content + '</div><div class="modal-footer">' + (footer || '<button class="btn" id="cancelModal" type="button">取消</button>') + '</div></section></div>';
    document.getElementById('closeModal').addEventListener('click', window.closeModal);
    var cancel = document.getElementById('cancelModal');
    if (cancel) cancel.addEventListener('click', window.closeModal);
  };

  window.closeModal = function () {
    var root = document.getElementById('modalRoot');
    if (root) root.innerHTML = '';
  };
})();
