(function () {
  'use strict';

  var data = window.MockData;
  var state = window.AppState;
  var ui = {
    modalOpen: false,
    modalTab: 'all',
    keyword: '',
    draftSelection: new Set(),
    clearConfirmOpen: false,
    importOpen: false,
    importState: { status: 'idle', fileName: '', message: '', totalRows: 0, validCount: 0, errorCount: 0, validStoreIds: [], rows: [] }
  };

  function emptyImportState() {
    return { status: 'idle', fileName: '', message: '', totalRows: 0, validCount: 0, errorCount: 0, validStoreIds: [], rows: [] };
  }

  function storeNames(ids, limit) {
    var names = ids.map(window.getStoreById).filter(function (store) { return store && store.available; }).map(function (store) { return store.name; });
    if (!names.length) return '未指定门店，适用于全部门店';
    var visible = names.slice(0, limit || 3);
    return visible.join('、') + (names.length > visible.length ? ' 等 ' + names.length + ' 家' : '');
  }

  function pageShell(content) {
    return '<div class="workspace">' +
      '<header class="topbar"><div class="mobile-brand"><strong>NISSAN</strong><span>活动中心</span></div>' +
      '<div class="topbar-user"><span>消息</span><i></i><strong>活动运营员</strong></div></header>' +
      '<div class="breadcrumb">后台管理 <span>/</span> 活动中心 <span>/</span> 保客活动创建</div>' +
      '<div class="module-tabs"><button>保客活动一店一码</button><button>保客活动互斥关系</button><button class="is-active">保客活动创建</button><button>组合活动列表</button></div>' +
      content + '</div>';
  }

  function renderSteps() {
    return '<div class="steps">' +
      '<div class="step is-active"><span class="step-dot">1</span><span>基本信息</span></div>' +
      '<div class="step"><span class="step-dot">2</span><span>关联卡券</span></div>' +
      '<div class="step"><span class="step-dot">3</span><span>活动对象</span></div>' +
      '<div class="step"><span class="step-dot">4</span><span>分享及页面配置</span></div>' +
      '</div>';
  }

  function renderModeSwitch() {
    var createActive = state.formMode === 'create';
    return '<div class="mode-switch" role="group" aria-label="页面状态">' +
      '<button class="' + (createActive ? 'is-active' : '') + '" data-form-mode="create">创建活动</button>' +
      '<button class="' + (!createActive ? 'is-active' : '') + '" data-form-mode="edit">编辑活动</button>' +
      '</div>';
  }

  function renderTypeOptions(value) {
    return data.activityTypes.map(function (type) {
      return '<option value="' + window.escapeHtml(type) + '" ' + (type === value ? 'selected' : '') + '>' + window.escapeHtml(type) + '</option>';
    }).join('');
  }

  function renderScopeField(draft) {
    var specified = draft.storeScope.mode === 'SPECIFIED' && draft.storeScope.storeIds.length > 0;
    return '<div class="store-scope-field" data-testid="store-scope-field">' +
      '<div class="field-label"><span>适用门店</span><em>选填</em></div>' +
      '<div class="field-content">' +
        '<div class="scope-summary ' + (specified ? 'is-specified' : 'is-all') + '">' +
          '<div class="scope-icon">' + (specified ? '店' : '全') + '</div>' +
          '<div class="scope-copy"><div><strong>' + (specified ? '指定 ' + draft.storeScope.storeIds.length + ' 家门店' : '全部门店') + '</strong>' +
          '<span class="scope-pill ' + (specified ? 'scope-pill--specified' : 'scope-pill--all') + '">' + (specified ? '已配置' : '默认') + '</span></div>' +
          '<p>' + window.escapeHtml(storeNames(draft.storeScope.storeIds, 3)) + '</p></div>' +
          '<div class="scope-actions"><button class="btn btn-primary" data-open-store-modal>' + (specified ? '重新配置' : '配置适用门店') + '</button>' +
          (specified ? '<button class="btn btn-text-danger" data-clear-scope>清空</button>' : '') + '</div>' +
        '</div>' +
        '<div class="field-help"><span>i</span><p><strong>不配置即适用于所有门店。</strong> 该范围将用于 SA 动态二维码活动池过滤：仅适用门店的 SA 可查看并分享。</p></div>' +
      '</div>' +
    '</div>';
  }

  function renderForm() {
    var draft = state.getDraft();
    var editing = state.formMode === 'edit';
    return pageShell(
      '<section class="page-title"><div><h1>' + (editing ? '编辑活动' : '创建活动') + '</h1>' +
      '<p>活动的配置，可创建、编辑并查看活动范围与基础信息。</p></div>' +
      '<div class="header-actions"><button class="btn" data-save-draft>保存草稿</button><button class="btn btn-primary" data-save>确定</button></div></section>' +
      '<div class="content-card">' +
        '<div class="content-tabs"><button class="is-active">基础配置</button><button>页面配置</button><button>投放记录</button></div>' +
        '<div class="review-strip"><div><strong>本原型验证：</strong>续保专属门店字段升级为所有活动通用字段</div>' + renderModeSwitch() + '</div>' +
        renderSteps() +
        (editing ? '<div class="risk-banner"><span>!</span><div><strong>已启用活动编辑提醒</strong><p>适用门店变更的生效时点及对已生成二维码的影响待确认，本原型仅演示回显与编辑。</p></div></div>' : '') +
        '<section class="form-section"><div class="section-heading"><div><h2>step1：基本信息</h2><p>所有活动类型共用的活动级配置</p></div><span class="evidence-tag">目标态：全活动通用</span></div>' +
          '<div class="form-grid">' +
            '<label><span><b>*</b> 活动名称</span><input class="form-input" data-field="name" maxlength="50" value="' + window.escapeHtml(draft.name) + '"></label>' +
            '<label><span><b>*</b> 活动类型</span><select class="form-select" data-field="type">' + renderTypeOptions(draft.type) + '</select></label>' +
            '<label><span>活动状态</span><input class="form-input" value="' + window.escapeHtml(draft.status) + '" disabled></label>' +
            '<label><span><b>*</b> 活动时间</span><input class="form-input" value="2026-08-10 00:00 至 2026-09-30 23:59" readonly></label>' +
          '</div>' +
          renderScopeField(draft) +
          '<div class="boundary-note"><strong>规则边界</strong><span>活动适用门店用于活动范围及 SA 查看/分享权限；不自动改写卡券自身的适用或核销门店。</span></div>' +
        '</section>' +
        '<div class="page-actions"><button class="btn" data-cancel>取消</button><button class="btn btn-primary" data-next>下一步：关联卡券</button></div>' +
      '</div>' +
      (ui.modalOpen ? renderStoreModal() : '') +
      (ui.clearConfirmOpen ? renderClearConfirm() : '') +
      (ui.importOpen ? renderExcelImportDialog() : '')
    );
  }

  function filterStores() {
    var keyword = ui.keyword.trim().toLowerCase();
    return data.stores.filter(function (store) {
      if (!store.available) return false;
      if (ui.modalTab === 'selected' && !ui.draftSelection.has(store.id)) return false;
      if (!keyword) return true;
      return store.name.toLowerCase().indexOf(keyword) > -1 || store.code.toLowerCase().indexOf(keyword) > -1 ||
        store.province.toLowerCase().indexOf(keyword) > -1 || store.city.toLowerCase().indexOf(keyword) > -1;
    });
  }

  function uniqueValues(list, key) {
    return list.map(function (item) { return item[key]; }).filter(function (value, index, arr) { return arr.indexOf(value) === index; });
  }

  function groupCheck(ids, groupKey, label, level) {
    var selectable = ids.slice();
    var selectedCount = selectable.filter(function (id) { return ui.draftSelection.has(id); }).length;
    var checked = selectable.length > 0 && selectedCount === selectable.length;
    var partial = selectedCount > 0 && selectedCount < selectable.length;
    return '<div class="tree-row tree-row--group level-' + level + '">' +
      '<span class="tree-arrow">⌄</span><label><input type="checkbox" data-group="' + window.escapeHtml(groupKey) + '" data-ids="' + ids.join(',') + '" ' +
      (checked ? 'checked' : '') + ' ' + (partial ? 'data-partial="true"' : '') + '><span>' + window.escapeHtml(label) + '</span></label>' +
      '<small>' + selectedCount + '/' + selectable.length + '</small></div>';
  }

  function storeRow(store) {
    return '<div class="tree-row tree-row--store level-4">' +
      '<span></span><label><input type="checkbox" data-store-id="' + store.id + '" ' + (ui.draftSelection.has(store.id) ? 'checked' : '') +
      '><span><strong>' + window.escapeHtml(store.name) + '</strong><small>门店编码：' + store.code + '</small></span></label></div>';
  }

  function renderStoreTree() {
    var stores = filterStores();
    if (!stores.length) {
      return '<div class="tree-empty"><span>⌕</span><strong>没有匹配的门店</strong><p>可调整搜索词，或切回「全部门店」。</p></div>';
    }
    var html = '';
    uniqueValues(stores, 'brand').forEach(function (brand) {
      var brandStores = stores.filter(function (store) { return store.brand === brand; });
      html += groupCheck(brandStores.map(function (store) { return store.id; }), 'brand-' + brand, brand, 1);
      uniqueValues(brandStores, 'province').forEach(function (province) {
        var provinceStores = brandStores.filter(function (store) { return store.province === province; });
        html += groupCheck(provinceStores.map(function (store) { return store.id; }), 'province-' + brand + '-' + province, province, 2);
        uniqueValues(provinceStores, 'city').forEach(function (city) {
          var cityStores = provinceStores.filter(function (store) { return store.city === city; });
          html += groupCheck(cityStores.map(function (store) { return store.id; }), 'city-' + brand + '-' + city, city, 3);
          cityStores.forEach(function (store) { html += storeRow(store); });
        });
      });
    });
    return html;
  }

  function renderStoreModal() {
    return '<div class="modal-overlay store-modal-overlay" role="presentation">' +
      '<section class="store-modal" role="dialog" aria-modal="true" aria-labelledby="store-modal-title">' +
        '<header class="store-modal-header"><div><span>活动级通用配置</span><h2 id="store-modal-title">选择适用门店</h2></div><button class="icon-btn" data-close-modal aria-label="关闭">×</button></header>' +
        '<div class="store-modal-body">' +
          '<div class="modal-info"><span>i</span><p>列表仅展示可用门店。选择指定门店后，仅这些门店的 SA 可查看并分享活动；不选择任何门店则适用于所有门店。</p></div>' +
          '<div class="tree-search"><input class="form-input" data-store-search placeholder="输入门店名称或编码" value="' + window.escapeHtml(ui.keyword) + '"><button class="btn btn-primary" data-search-store>搜索</button><button class="btn" data-reset-search>重置</button></div>' +
          '<div class="store-tree-toolbar"><div class="store-tree-tabs"><button class="' + (ui.modalTab === 'all' ? 'is-active' : '') + '" data-modal-tab="all">全部门店</button>' +
          '<button class="' + (ui.modalTab === 'selected' ? 'is-active' : '') + '" data-modal-tab="selected">已选门店 <span>' + ui.draftSelection.size + '</span></button></div>' +
          '<div class="store-tree-actions"><a class="text-btn" href="assets/templates/活动适用门店导入模板.xlsx" download>下载导入模板</a>' +
          '<button class="import-btn" data-open-store-import>Excel 覆盖导入</button><button class="text-btn" data-clear-draft>清空已选</button></div></div>' +
          '<div class="store-tree" data-testid="store-tree">' + renderStoreTree() + '</div>' +
        '</div>' +
        '<footer class="store-modal-footer"><div><span>当前已选</span><strong>' + ui.draftSelection.size + '</strong><span>家门店</span>' +
        '<small>' + (ui.draftSelection.size ? '确认后按指定门店生效' : '零家将按全部门店生效') + '</small></div>' +
        '<div><button class="btn" data-close-modal>取消</button><button class="btn btn-primary" data-confirm-stores>确定</button></div></footer>' +
      '</section></div>';
  }

  function renderImportRows(importState) {
    if (importState.status === 'idle') {
      return '<div class="excel-preview-empty"><span>表</span><strong>选择文件后显示校验结果</strong><p>原型读取第一张工作表，并按“门店编码”匹配当前可用门店。</p></div>';
    }
    if (importState.status === 'loading') {
      return '<div class="excel-preview-empty is-loading"><span>···</span><strong>正在解析并校验文件</strong><p>请稍候，不会立即修改当前已选门店。</p></div>';
    }
    if (importState.status === 'error') {
      return '<div class="excel-import-error"><strong>文件校验失败</strong><p>' + window.escapeHtml(importState.message) + '</p></div>';
    }

    var visibleRows = importState.rows.slice(0, 50);
    return '<div class="excel-import-summary"><div><span>数据行</span><strong>' + importState.totalRows + '</strong></div>' +
      '<div class="is-valid"><span>可覆盖门店</span><strong>' + importState.validCount + '</strong></div>' +
      '<div class="is-error"><span>异常行</span><strong>' + importState.errorCount + '</strong></div></div>' +
      '<div class="excel-preview-table-wrap"><table class="excel-preview-table"><thead><tr><th>Excel 行</th><th>门店编码</th><th>匹配结果</th><th>校验说明</th></tr></thead><tbody>' +
      visibleRows.map(function (row) {
        return '<tr class="' + (row.valid ? 'is-valid' : 'is-error') + '"><td>' + row.rowNumber + '</td><td>' + window.escapeHtml(row.code) + '</td>' +
          '<td>' + (row.valid ? window.escapeHtml(row.storeName) : '—') + '</td><td><span>' + (row.valid ? '通过' : '异常') + '</span>' + window.escapeHtml(row.reason) + '</td></tr>';
      }).join('') + '</tbody></table></div>' +
      (importState.rows.length > visibleRows.length ? '<p class="excel-preview-more">仅展示前 50 行，全部行仍参与校验。</p>' : '');
  }

  function renderExcelImportDialog() {
    var importState = ui.importState;
    var ready = importState.status === 'ready';
    var canConfirm = ready && importState.validCount > 0;
    return '<div class="modal-overlay excel-import-overlay"><section class="excel-import-dialog" role="dialog" aria-modal="true" aria-labelledby="excel-import-title">' +
      '<header><div><span>活动适用门店</span><h2 id="excel-import-title">Excel 覆盖导入</h2></div><button class="icon-btn" data-close-import aria-label="关闭">×</button></header>' +
      '<div class="excel-import-body"><div class="excel-cover-warning"><span>!</span><p><strong>本次为覆盖导入。</strong>确认后，Excel 中校验通过的门店将替换当前已选的 ' + ui.draftSelection.size + ' 家门店，不会追加；仍需返回选择器点击“确定”后才保存活动范围。</p></div>' +
      '<div class="excel-import-guide"><div><strong>模板字段：门店编码</strong><p>仅支持 .xlsx；不存在、不可用、空编码及重复行不会进入覆盖结果。</p></div><a class="btn" href="assets/templates/活动适用门店导入模板.xlsx" download>下载模板</a></div>' +
      '<label class="excel-upload-box"><input type="file" accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" data-store-import-file>' +
      '<span>XLSX</span><div><strong>' + (importState.fileName ? window.escapeHtml(importState.fileName) : '点击选择 Excel 文件') + '</strong><p>' + (importState.fileName ? '可重新选择文件并覆盖本次校验结果' : '读取第一张工作表，文件不会上传到真实服务器') + '</p></div><em>选择文件</em></label>' +
      '<div class="excel-preview" data-testid="excel-import-preview">' + renderImportRows(importState) + '</div></div>' +
      '<footer><p>' + (ready ? '将用 <strong>' + importState.validCount + '</strong> 家有效门店覆盖当前选择' + (importState.errorCount ? '，' + importState.errorCount + ' 行异常不导入' : '') : '完成文件校验后才能确认覆盖') + '</p>' +
      '<div><button class="btn" data-close-import>取消</button><button class="btn btn-primary" data-confirm-import ' + (canConfirm ? '' : 'disabled') + '>确认覆盖</button></div></footer>' +
      '</section></div>';
  }

  function renderClearConfirm() {
    return '<div class="modal-overlay confirm-overlay"><section class="confirm-dialog" role="dialog" aria-modal="true">' +
      '<div class="confirm-icon">!</div><h3>清空已配置门店？</h3><p>清空后，活动将恢复为适用于<strong>全部门店</strong>，所有已进入 SA 投放池的门店 SA 均可查看并分享。</p>' +
      '<div><button class="btn" data-cancel-clear>取消</button><button class="btn btn-primary" data-confirm-clear>确认清空</button></div>' +
      '</section></div>';
  }

  function rerender() {
    document.getElementById('app').innerHTML = renderForm();
    bindEvents();
  }

  function openModal() {
    var draft = state.getDraft();
    ui.draftSelection = new Set(draft.storeScope.mode === 'SPECIFIED' ? draft.storeScope.storeIds.filter(function (id) {
      var store = window.getStoreById(id);
      return store && store.available;
    }) : []);
    ui.modalOpen = true;
    ui.importOpen = false;
    ui.modalTab = 'all';
    ui.keyword = '';
    rerender();
  }

  function bindPartialChecks() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-partial="true"]'), function (input) { input.indeterminate = true; });
  }

  function bindEvents() {
    bindPartialChecks();

    Array.prototype.forEach.call(document.querySelectorAll('[data-form-mode]'), function (button) {
      button.addEventListener('click', function () {
        state.formMode = button.getAttribute('data-form-mode');
        ui.modalOpen = false;
        ui.importOpen = false;
        ui.clearConfirmOpen = false;
        rerender();
      });
    });

    var nameInput = document.querySelector('[data-field="name"]');
    if (nameInput) nameInput.addEventListener('input', function () { state.getDraft().name = nameInput.value; });
    var typeSelect = document.querySelector('[data-field="type"]');
    if (typeSelect) typeSelect.addEventListener('change', function () {
      state.getDraft().type = typeSelect.value;
      window.showToast('活动类型已切换，「适用门店」保持通用展示', 'info');
    });

    var openButton = document.querySelector('[data-open-store-modal]');
    if (openButton) openButton.addEventListener('click', openModal);
    var clearScope = document.querySelector('[data-clear-scope]');
    if (clearScope) clearScope.addEventListener('click', function () { ui.clearConfirmOpen = true; rerender(); });

    Array.prototype.forEach.call(document.querySelectorAll('[data-close-modal]'), function (button) {
      button.addEventListener('click', function () { ui.modalOpen = false; ui.importOpen = false; rerender(); });
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-modal-tab]'), function (button) {
      button.addEventListener('click', function () { ui.modalTab = button.getAttribute('data-modal-tab'); rerender(); });
    });

    var search = document.querySelector('[data-store-search]');
    var runSearch = function () { ui.keyword = search ? search.value : ''; rerender(); };
    var searchButton = document.querySelector('[data-search-store]');
    if (searchButton) searchButton.addEventListener('click', runSearch);
    if (search) search.addEventListener('keydown', function (event) { if (event.key === 'Enter') runSearch(); });
    var resetSearch = document.querySelector('[data-reset-search]');
    if (resetSearch) resetSearch.addEventListener('click', function () { ui.keyword = ''; rerender(); });
    var clearDraft = document.querySelector('[data-clear-draft]');
    if (clearDraft) clearDraft.addEventListener('click', function () { ui.draftSelection.clear(); rerender(); });

    var openImport = document.querySelector('[data-open-store-import]');
    if (openImport) openImport.addEventListener('click', function () {
      ui.importState = emptyImportState();
      ui.importOpen = true;
      rerender();
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-close-import]'), function (button) {
      button.addEventListener('click', function () { ui.importOpen = false; rerender(); });
    });
    var importFileInput = document.querySelector('[data-store-import-file]');
    if (importFileInput) importFileInput.addEventListener('change', function () {
      var file = importFileInput.files && importFileInput.files[0];
      if (!file) return;
      ui.importState = emptyImportState();
      ui.importState.status = 'loading';
      ui.importState.fileName = file.name;
      rerender();
      window.ExcelStoreImporter.parse(file, data.stores).then(function (result) {
        ui.importState = result;
        ui.importState.status = 'ready';
        rerender();
      }).catch(function (error) {
        ui.importState = emptyImportState();
        ui.importState.status = 'error';
        ui.importState.fileName = file.name;
        ui.importState.message = error && error.message ? error.message : '文件解析失败，请使用页面提供的模板';
        rerender();
      });
    });
    var confirmImport = document.querySelector('[data-confirm-import]');
    if (confirmImport) confirmImport.addEventListener('click', function () {
      if (ui.importState.status !== 'ready' || !ui.importState.validStoreIds.length) return;
      ui.draftSelection = new Set(ui.importState.validStoreIds);
      var successCount = ui.importState.validCount;
      var errorCount = ui.importState.errorCount;
      ui.importOpen = false;
      ui.modalTab = 'selected';
      ui.keyword = '';
      window.showToast('Excel 覆盖完成：已替换为 ' + successCount + ' 家门店' + (errorCount ? '，' + errorCount + ' 行未导入' : '') + '；请点击“确定”保存', errorCount ? 'warning' : 'success');
      rerender();
    });

    Array.prototype.forEach.call(document.querySelectorAll('[data-store-id]'), function (input) {
      input.addEventListener('change', function () {
        if (input.checked) ui.draftSelection.add(input.getAttribute('data-store-id'));
        else ui.draftSelection.delete(input.getAttribute('data-store-id'));
        rerender();
      });
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-group]'), function (input) {
      input.addEventListener('change', function () {
        var ids = input.getAttribute('data-ids').split(',').filter(Boolean);
        ids.forEach(function (id) {
          if (input.checked) ui.draftSelection.add(id);
          else ui.draftSelection.delete(id);
        });
        rerender();
      });
    });

    var confirmStores = document.querySelector('[data-confirm-stores]');
    if (confirmStores) confirmStores.addEventListener('click', function () {
      var ids = Array.from(ui.draftSelection);
      state.getDraft().storeScope = ids.length ? { mode: 'SPECIFIED', storeIds: ids } : { mode: 'ALL', storeIds: [] };
      ui.modalOpen = false;
      window.showToast(ids.length ? '已配置 ' + ids.length + ' 家适用门店' : '未选择门店，已按全部门店处理', 'success');
      rerender();
    });

    var cancelClear = document.querySelector('[data-cancel-clear]');
    if (cancelClear) cancelClear.addEventListener('click', function () { ui.clearConfirmOpen = false; rerender(); });
    var confirmClear = document.querySelector('[data-confirm-clear]');
    if (confirmClear) confirmClear.addEventListener('click', function () {
      state.getDraft().storeScope = { mode: 'ALL', storeIds: [] };
      ui.clearConfirmOpen = false;
      state.publishDraftToPreview();
      window.showToast('已清空，活动恢复为适用于全部门店', 'success');
      rerender();
    });

    var save = document.querySelector('[data-save]');
    if (save) save.addEventListener('click', function () {
      state.publishDraftToPreview();
      window.showToast('活动适用门店已保存，并同步至 SA 活动池预览', 'success');
    });
    var saveDraft = document.querySelector('[data-save-draft]');
    if (saveDraft) saveDraft.addEventListener('click', function () { window.showToast('草稿已保存（原型演示）', 'success'); });
    var next = document.querySelector('[data-next]');
    if (next) next.addEventListener('click', function () {
      state.publishDraftToPreview();
      window.showToast('适用门店为选填项，校验通过并进入 step2', 'success');
    });
    var cancel = document.querySelector('[data-cancel]');
    if (cancel) cancel.addEventListener('click', function () { window.showToast('已取消本次编辑（原型演示）', 'info'); });
  }

  window.Pages['activity-form'] = { render: renderForm, init: bindEvents, rerender: rerender };
})();
