(function () {
  'use strict';

  var data = window.MockData;
  var state = window.AppState;
  var ui = { shareActivityId: '' };

  function currentSA() {
    return data.sas.find(function (sa) { return sa.id === state.selectedSAId; }) || data.sas[0];
  }

  function candidates() {
    return data.activities.filter(function (activity) {
      return activity.saPlacementEnabled && activity.status === '已启用';
    });
  }

  function permission(activity, sa) {
    var scope = activity.storeScope;
    if (scope.mode === 'ALL' || !scope.storeIds.length) {
      return { allowed: true, reason: '活动未指定门店，适用于全部门店' };
    }
    if (scope.storeIds.indexOf(sa.storeId) > -1) {
      return { allowed: true, reason: '当前 SA 所属门店命中活动适用门店' };
    }
    return { allowed: false, reason: '当前 SA 所属门店不在活动适用门店内' };
  }

  function scopeLabel(activity) {
    if (activity.storeScope.mode === 'ALL' || !activity.storeScope.storeIds.length) return '全部门店';
    return '指定 ' + activity.storeScope.storeIds.length + ' 家';
  }

  function scopeDetail(activity) {
    if (activity.storeScope.mode === 'ALL' || !activity.storeScope.storeIds.length) return '未配置指定门店';
    var stores = activity.storeScope.storeIds.map(window.getStoreById).filter(Boolean);
    return stores.map(function (store) { return store.name; }).join('、');
  }

  function pageShell(content) {
    return '<div class="workspace sa-workspace">' +
      '<header class="topbar"><div class="mobile-brand"><strong>NISSAN</strong><span>SA 动态二维码</span></div>' +
      '<div class="topbar-user"><span>消息</span><i></i><strong>活动运营员</strong></div></header>' +
      '<div class="breadcrumb">后台管理 <span>/</span> 活动中心 <span>/</span> SA 动态二维码</div>' +
      '<div class="module-tabs"><button>SA 活动配置</button><button class="is-active">SA 活动池校验</button><button>SA 活动报表</button></div>' + content + '</div>';
  }

  function renderSASelector(sa) {
    return '<section class="sa-selector"><div class="selector-heading"><div><h2>选择 SA 身份</h2><p>切换不同门店 SA，查看活动池过滤结果</p></div>' +
      '<span class="sa-rule-tag">归属门店实时校验</span></div><div class="sa-list">' +
      data.sas.map(function (item) {
        var store = window.getStoreById(item.storeId);
        return '<button class="sa-person ' + (item.id === sa.id ? 'is-active' : '') + '" data-sa-id="' + item.id + '">' +
          '<span class="sa-avatar">' + item.name.slice(-1) + '</span><span><strong>' + item.name + '</strong><small>' + item.employeeNo + ' · ' + item.title + '</small>' +
          '<em>' + window.escapeHtml(store.name) + '</em></span>' + (item.id === sa.id ? '<i>当前</i>' : '') + '</button>';
      }).join('') + '</div></section>';
  }

  function renderMetrics(sa, candidateList) {
    var visible = candidateList.filter(function (activity) { return permission(activity, sa).allowed; });
    return '<div class="permission-metrics">' +
      '<div><span>当前 SA 门店</span><strong>' + window.escapeHtml(window.getStoreById(sa.storeId).code) + '</strong><small>' + window.escapeHtml(window.getStoreById(sa.storeId).city) + '</small></div>' +
      '<div><span>SA 投放候选</span><strong>' + candidateList.length + '</strong><small>已启用且投放配置有效</small></div>' +
      '<div class="is-success"><span>当前可见</span><strong data-testid="visible-count">' + visible.length + '</strong><small>可生成并分享二维码</small></div>' +
      '<div class="is-filtered"><span>门店过滤</span><strong data-testid="filtered-count">' + (candidateList.length - visible.length) + '</strong><small>SA 正常视图不展示</small></div>' +
    '</div>';
  }

  function renderActivityCard(activity, sa) {
    var result = permission(activity, sa);
    return '<article class="sa-activity-card ' + (result.allowed ? 'is-allowed' : 'is-denied') + '" data-activity-id="' + activity.id + '" data-allowed="' + result.allowed + '">' +
      '<div class="activity-cover"><span>' + (activity.type === '续保活动' ? '续' : activity.type === '会员活动' ? '会' : '维') + '</span><small>' + window.escapeHtml(activity.type) + '</small></div>' +
      '<div class="activity-card-content"><div class="activity-card-top"><div><span class="activity-id">' + activity.id + '</span><h3>' + window.escapeHtml(activity.name) + '</h3></div>' +
      '<span class="permission-tag ' + (result.allowed ? 'permission-tag--allowed' : 'permission-tag--denied') + '">' + (result.allowed ? '当前 SA 可见' : '门店未命中') + '</span></div>' +
      '<div class="activity-meta"><span>活动时间：' + activity.validTime + '</span><span>活动奖品：' + window.escapeHtml(activity.reward) + '</span></div>' +
      '<div class="activity-scope-row"><div><span class="scope-pill ' + (activity.storeScope.mode === 'ALL' ? 'scope-pill--all' : 'scope-pill--specified') + '">' + scopeLabel(activity) + '</span>' +
      '<p title="' + window.escapeHtml(scopeDetail(activity)) + '">' + window.escapeHtml(scopeDetail(activity)) + '</p></div>' +
      '<div class="permission-reason"><i>' + (result.allowed ? '✓' : '×') + '</i><span>' + result.reason + '</span></div></div>' +
      '<div class="activity-card-actions"><button class="btn" data-view-scope="' + activity.id + '">查看范围</button>' +
      '<button class="btn btn-primary" data-share-activity="' + activity.id + '" ' + (result.allowed ? '' : 'disabled') + '>' + (result.allowed ? '生成并分享' : '不可分享') + '</button></div>' +
      '</div></article>';
  }

  function renderPhonePreview(sa, candidateList) {
    var visible = candidateList.filter(function (activity) { return permission(activity, sa).allowed; });
    var renderList = state.diagnosticMode ? candidateList : visible;
    return '<section class="pool-preview"><div class="preview-heading"><div><h2>SA 活动池</h2><p>模拟 SA 生成动态二维码前的活动选择页</p></div>' +
      '<div class="view-switch" role="group" aria-label="活动池视图"><button class="' + (!state.diagnosticMode ? 'is-active' : '') + '" data-pool-view="normal">SA 正常视图</button>' +
      '<button class="' + (state.diagnosticMode ? 'is-active' : '') + '" data-pool-view="diagnostic">规则校验视图</button></div></div>' +
      '<div class="filter-formula"><span>SA 投放配置有效</span><b>∩</b><span>活动已启用</span><b>∩</b><span>全部门店或所属门店命中</span><strong>= 可见 / 可分享</strong></div>' +
      '<div class="phone-shell"><div class="phone-status"><span>9:41</span><strong>SA 活动分享</strong><span>•••</span></div>' +
      '<div class="phone-profile"><div class="sa-avatar">' + sa.name.slice(-1) + '</div><div><strong>' + sa.name + '</strong><p>' + window.escapeHtml(window.getStoreById(sa.storeId).name) + '</p></div>' +
      '<span>' + visible.length + ' 个可选活动</span></div>' +
      '<div class="phone-list">' + (renderList.length ? renderList.map(function (activity) { return renderActivityCard(activity, sa); }).join('') :
      '<div class="pool-empty"><span>◇</span><strong>当前没有可分享活动</strong><p>请检查 SA 投放配置、活动状态和适用门店。</p></div>') + '</div></div>' +
      (state.diagnosticMode ? '<div class="diagnostic-note"><strong>规则校验视图</strong><span>被过滤活动仅供产品/研发评审，SA 正常端不展示该卡片，分享按钮也不可用。</span></div>' : '') +
      '</section>';
  }

  function renderShareDialog(activity, sa) {
    return '<div class="modal-overlay share-overlay"><section class="share-dialog" role="dialog" aria-modal="true" aria-labelledby="share-title">' +
      '<button class="icon-btn" data-close-share aria-label="关闭">×</button><span class="share-eyebrow">动态二维码分享预览</span><h2 id="share-title">' + window.escapeHtml(activity.name) + '</h2>' +
      '<div class="qr-placeholder"><div></div><strong>DEMO QR</strong></div><p>来源 SA：' + sa.name + '（' + sa.employeeNo + '）</p>' +
      '<p>来源门店：' + window.escapeHtml(window.getStoreById(sa.storeId).name) + '</p>' +
      '<div class="share-rule"><span>✓</span><p>当前 SA 门店命中活动适用门店，可生成并分享。本原型不产生真实二维码。</p></div>' +
      '<div><button class="btn" data-close-share>取消</button><button class="btn btn-primary" data-copy-share>复制分享链接</button></div>' +
      '</section></div>';
  }

  function renderScopeDialog(activity) {
    var stores = activity.storeScope.storeIds.map(window.getStoreById).filter(function (store) { return store && store.available; });
    return '<div class="modal-overlay share-overlay"><section class="scope-dialog" role="dialog" aria-modal="true" aria-labelledby="scope-title">' +
      '<button class="icon-btn" data-close-share aria-label="关闭">×</button><span class="share-eyebrow">活动适用门店</span><h2 id="scope-title">' + window.escapeHtml(activity.name) + '</h2>' +
      '<div class="scope-dialog-summary"><strong>' + scopeLabel(activity) + '</strong><p>' + window.escapeHtml(scopeDetail(activity)) + '</p></div>' +
      (stores.length ? '<ul>' + stores.map(function (store) { return '<li><span>' + store.code + '</span><strong>' + window.escapeHtml(store.name) + '</strong></li>'; }).join('') + '</ul>' :
      '<div class="all-store-illustration"><span>全</span><p>未配置指定门店，适用于所有门店。</p></div>') +
      '<div><button class="btn" data-close-share>关闭</button><button class="btn btn-primary" data-go-config>去配置适用门店</button></div>' +
      '</section></div>';
  }

  function renderPage() {
    var sa = currentSA();
    var candidateList = candidates();
    var overlay = '';
    if (ui.shareActivityId) {
      var activity = data.activities.find(function (item) { return item.id === ui.shareActivityId.replace('scope:', ''); });
      overlay = ui.shareActivityId.indexOf('scope:') === 0 ? renderScopeDialog(activity) : renderShareDialog(activity, sa);
    }
    return pageShell('<section class="page-title"><div><h1>SA 动态二维码 · 活动池校验</h1><p>验证活动适用门店如何控制 SA 的查看与分享权限。</p></div>' +
      '<div class="header-actions"><button class="btn" data-go-config>返回配置适用门店</button></div></section>' +
      '<div class="sa-content">' + renderSASelector(sa) + renderMetrics(sa, candidateList) + renderPhonePreview(sa, candidateList) +
      '<div class="sa-boundary"><strong>边界说明</strong><p>适用门店不是「允许 SA 分享」开关：活动仍需先进入独立 SA 投放配置；门店范围只在候选池内继续做权限过滤。</p><span>未进入 SA 投放配置的活动：' + data.activities.filter(function (a) { return !a.saPlacementEnabled; }).length + ' 个</span></div></div>' + overlay);
  }

  function rerender() {
    document.getElementById('app').innerHTML = renderPage();
    bindEvents();
  }

  function bindEvents() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-sa-id]'), function (button) {
      button.addEventListener('click', function () { state.selectedSAId = button.getAttribute('data-sa-id'); ui.shareActivityId = ''; rerender(); });
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-pool-view]'), function (button) {
      button.addEventListener('click', function () { state.diagnosticMode = button.getAttribute('data-pool-view') === 'diagnostic'; rerender(); });
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-share-activity]'), function (button) {
      button.addEventListener('click', function () { ui.shareActivityId = button.getAttribute('data-share-activity'); rerender(); });
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-view-scope]'), function (button) {
      button.addEventListener('click', function () { ui.shareActivityId = 'scope:' + button.getAttribute('data-view-scope'); rerender(); });
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-close-share]'), function (button) {
      button.addEventListener('click', function () { ui.shareActivityId = ''; rerender(); });
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-go-config]'), function (button) {
      button.addEventListener('click', function () { ui.shareActivityId = ''; window.navigateTo('activity-form'); });
    });
    var copy = document.querySelector('[data-copy-share]');
    if (copy) copy.addEventListener('click', function () { ui.shareActivityId = ''; window.showToast('分享链接已复制（原型演示）', 'success'); rerender(); });
  }

  window.Pages['sa-pool'] = { render: renderPage, init: bindEvents, rerender: rerender };
})();
