(function () {
  'use strict';

  function escapeHtml(value) {
    return String(value == null ? '' : value).replace(/[&<>'"]/g, function (char) {
      return {'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char];
    });
  }

  function showToast(message) {
    var toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(function () { toast.classList.remove('show'); }, 1800);
  }

  function statusClass(value) {
    if (/不允许|已关闭/.test(value)) return 'danger';
    if (/成功|有效|已核销|已激活|中奖|允许|已启用|已生效/.test(value)) return 'success';
    if (/过期|未中奖|待/.test(value)) return 'warning';
    if (/失效|撤销|失败/.test(value)) return 'danger';
    if (/未激活|未启用|全部|部分/.test(value)) return 'info';
    return 'neutral';
  }

  function status(value) {
    return '<span class="status ' + statusClass(String(value)) + '">' + escapeHtml(value) + '</span>';
  }

  function openDrawer(title, body, foot) {
    var drawer = document.getElementById('detailDrawer');
    var mask = document.getElementById('drawerMask');
    if (!drawer || !mask) return;
    drawer.innerHTML = '<div class="drawer-head"><h2>' + escapeHtml(title) + '</h2><button class="drawer-close" data-close-drawer type="button">×</button></div>' +
      '<div class="drawer-body">' + body + '</div>' +
      '<div class="drawer-foot">' + (foot || '<button class="button" data-close-drawer type="button">关闭</button>') + '</div>';
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    mask.hidden = false;
  }

  function closeDrawers() {
    ['detailDrawer','specDrawer'].forEach(function (id) {
      var node = document.getElementById(id);
      if (node) { node.classList.remove('open'); node.setAttribute('aria-hidden','true'); }
    });
    var mask = document.getElementById('drawerMask');
    if (mask) mask.hidden = true;
  }

  function openModal(title, body, foot, className) {
    var modal = document.getElementById('businessModal');
    var mask = document.getElementById('businessModalMask');
    if (!modal || !mask) return;
    modal.className = 'business-modal open' + (className ? ' ' + className : '');
    modal.innerHTML = '<div class="business-modal-head"><h2>' + escapeHtml(title) + '</h2><button class="drawer-close" data-close-modal type="button">×</button></div>' +
      '<div class="business-modal-body">' + body + '</div>' +
      '<div class="business-modal-foot">' + (foot || '<button class="button" data-close-modal type="button">取消</button>') + '</div>';
    modal.setAttribute('aria-hidden', 'false');
    mask.hidden = false;
  }

  function closeModal() {
    var modal = document.getElementById('businessModal');
    var mask = document.getElementById('businessModalMask');
    if (modal) { modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); }
    if (mask) mask.hidden = true;
  }

  function detailGrid(items) {
    return '<div class="detail-grid">' + items.map(function (item) {
      return '<div class="detail-item"><label>' + escapeHtml(item[0]) + '</label><div>' + (item[2] ? item[1] : escapeHtml(item[1])) + '</div></div>';
    }).join('') + '</div>';
  }

  function detailSection(title, content) {
    return '<section class="detail-section"><h3>' + escapeHtml(title) + '</h3>' + content + '</section>';
  }

  function pagination(total) {
    return '<div class="pagination-row"><span>共 ' + total + ' 条</span><button class="page-no">‹</button><button class="page-no active">1</button><button class="page-no">2</button><button class="page-no">›</button><span>20 条/页</span></div>';
  }

  window.SACommon = {
    escapeHtml: escapeHtml,
    showToast: showToast,
    status: status,
    openDrawer: openDrawer,
    closeDrawers: closeDrawers,
    openModal: openModal,
    closeModal: closeModal,
    detailGrid: detailGrid,
    detailSection: detailSection,
    pagination: pagination
  };

  document.addEventListener('click', function (event) {
    if (event.target.closest('[data-close-drawer]') || event.target.id === 'drawerMask') closeDrawers();
    if (event.target.closest('[data-close-modal]') || event.target.id === 'businessModalMask') closeModal();
  });
})();
