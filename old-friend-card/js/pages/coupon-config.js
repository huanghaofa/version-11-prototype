(function () {
  'use strict';

  var state = {
    selectedType: 'old-friend-card',
    selectedCardIds: [],
    formError: '',
    savedAt: '',
    savedCodes: []
  };

  function fieldRow(label, control, options) {
    var settings = options || {};
    return '<div class="sit-form-row' + (settings.className ? ' ' + settings.className : '') + '">' +
      '<div class="sit-form-label' + (settings.required ? ' required' : '') + '">' + window.escapeHTML(label) + '</div>' +
      '<div class="sit-form-control">' + control + (settings.help ? '<p class="field-help">' + settings.help + '</p>' : '') + '</div>' +
    '</div>';
  }

  function sectionTitle(title) {
    return '<h2 class="sit-section-title">' + window.escapeHTML(title) + '</h2>';
  }

  function cardStatusLabel(card) {
    if (!card || !card.isEnable) return '—';
    if (card.isEnable === 'MOCK_ENABLED') return '已启用';
    if (card.isEnable === 'MOCK_DISABLED') return '已停用';
    return String(card.isEnable);
  }

  function displayProductId(card) {
    return String(card && card.carProductId ? card.carProductId : '').replace(/^MOCK-/, '');
  }

  function typeChoices() {
    var items = window.MockData.existingProductTypes.concat([window.MockData.newProductType]);
    return items.map(function (item) {
      var active = state.selectedType === item.key;
      var isNew = item.scope === 'new';
      return '<label class="type-card' + (active ? ' active' : '') + '"' + (isNew ? ' data-testid="old-friend-type-entry"' : '') + '>' +
        '<input type="radio" name="scope-type" value="' + window.escapeHTML(item.key) + '" data-type="' + window.escapeHTML(item.key) + '"' + (isNew ? ' data-anno="coupon-old-friend-query"' : '') + ' ' + (active ? 'checked ' : '') + '>' +
        '<span' + (isNew ? ' data-anno="coupon-product-type-old-friend"' : '') + '>' + window.escapeHTML(item.label) + '</span>' +
      '</label>';
    }).join('');
  }

  function selectedSummary() {
    var cards = window.getOldFriendCardsByIds(state.selectedCardIds);
    if (!cards.length) {
      return '<div class="selection-empty" id="selected-card-summary"><span class="el-icon-info" aria-hidden="true"></span><span>尚未关联老友卡商品，点击“老友卡”选择适用商品。</span></div>';
    }
    return '<div class="selected-card" id="selected-card-summary">' +
      '<div class="selected-card-head"><strong data-anno="coupon-selected-card-name">已关联 ' + cards.length + ' 项老友卡商品</strong><span>可逐项移除，也可重新查询继续选择</span></div>' +
      '<div class="table-scroll"><table class="selection-table"><thead><tr><th>产品名称</th><th>产品编码</th><th>产品 ID</th><th>产品年期</th><th>用户价</th><th>启停状态</th><th>操作</th></tr></thead><tbody>' +
      cards.map(function (card) {
        return '<tr><td><strong>' + window.escapeHTML(card.carProductName) + '</strong></td>' +
          '<td>' + window.escapeHTML(card.carProductCode) + '</td>' +
          '<td><code>' + window.escapeHTML(displayProductId(card)) + '</code></td>' +
          '<td>' + window.escapeHTML(card.serviceYear) + '</td>' +
          '<td>' + window.formatCurrency(card.usePrice) + '</td>' +
          '<td><span class="tag">' + window.escapeHTML(cardStatusLabel(card)) + '</span></td>' +
          '<td><button class="text-action danger" type="button" data-remove-card-id="' + window.escapeHTML(card.carProductId) + '" data-testid="remove-card-' + window.escapeHTML(card.carProductId) + '">移除</button></td></tr>';
      }).join('') + '</tbody></table></div>' +
    '</div>';
  }

  function typeContent() {
    if (state.selectedType !== 'old-friend-card') {
      var type = window.MockData.existingProductTypes.find(function (item) { return item.key === state.selectedType; });
      return '<div class="existing-scope-note" id="existing-type-panel"><span class="el-icon-circle-check" aria-hidden="true"></span><span>请选择适用的' + window.escapeHTML(type ? type.label : '') + '</span></div>';
    }
    return '<section class="old-friend-panel' + (state.formError ? ' has-error' : '') + '" id="old-friend-panel" aria-labelledby="old-friend-title">' +
      '<div class="old-friend-toolbar"><div><strong id="old-friend-title">已关联老友卡</strong></div></div>' +
      selectedSummary() +
      (state.formError ? '<p class="field-error" role="alert">' + window.escapeHTML(state.formError) + '</p>' : '') +
    '</section>';
  }

  function scopeField() {
    return '<div class="scope-field"><div class="type-grid" id="product-type-group" role="radiogroup" aria-label="适用商品类型">' + typeChoices() + '</div>' + typeContent() + '</div>';
  }

  function richEditor() {
    return '<div class="rich-editor" aria-label="使用须知编辑器">' +
      '<div class="rich-toolbar"><button type="button">字号</button><button type="button">行高</button><button type="button">字间距</button><button type="button"><strong>B</strong></button><button type="button"><em>I</em></button><button type="button"><u>U</u></button><button type="button">对齐</button><button type="button">列表</button></div>' +
      '<div class="rich-content" contenteditable="true" role="textbox" aria-multiline="true">请在有效期内到店使用，具体以活动说明为准。</div>' +
    '</div>';
  }

  function render() {
    var tabs = ['优惠券发放', '领券记录', '卡券列表', '卡券限额', '售后业务报表', '业务报表', '核销列表', '卡券发放', '发放记录', '卡券规则设置', '经销商券任务记录', '批量操作优惠券', '领券管理（领券中心）'];
    return '<section class="backend-page" data-page="coupon-config">' +
      '<div class="breadcrumb"><span>工作台</span><b>&gt;</b><span>卡券中心</span><b>&gt;</b></div>' +
      '<div class="business-tabs" data-testid="business-tabs">' + tabs.map(function (tab) { return '<button class="' + (tab === '卡券列表' ? 'active' : '') + '" type="button">' + tab + '</button>'; }).join('') + '</div>' +
      '<div class="page-sheet">' +
        '<div class="page-titlebar"><h1>新增卡券</h1><button class="btn btn-primary" type="button" id="back-button">返回</button></div>' +
        '<div class="sit-form">' +
          sectionTitle('基本信息') +
          fieldRow('品牌', '<select class="form-control" aria-label="品牌"><option>日产</option></select>', { required: true, help: '首次提交后不可再编辑' }) +
          fieldRow('创券来源', '<select class="form-control" aria-label="创券来源"><option>卡券中心</option></select>', { required: true }) +
          fieldRow('业务场景', '<select class="form-control" aria-label="业务场景"><option>售后营销 / 维修保养（新）</option></select>', { required: true, help: '首次提交后不可再编辑' }) +
          fieldRow('卡券分类', '<select class="form-control" aria-label="卡券分类"><option>请选择卡券分类</option><option>售后维保券</option></select>', { required: true, help: '首次提交后不可再编辑' }) +
          fieldRow('卡券名称', '<input class="form-control" value="老友卡售后维保券" aria-label="卡券名称">', { required: true, help: '卡券的主标题。' }) +
          fieldRow('卡券图片', '<button class="upload-card" type="button" aria-label="上传卡券图片"><span class="el-icon-upload2" aria-hidden="true"></span></button>') +
          fieldRow('卡券描述', '<input class="form-control" value="老友卡用户专享维保优惠" aria-label="卡券描述">', { help: '卡券的副标题，用于补充卡券的适用范围。' }) +
          fieldRow('发放数量', '<div class="quantity-control"><input class="form-control" value="10000" inputmode="numeric" aria-label="发放数量"><span>张</span></div>', { required: true, help: '数量范围 1-99999999，仅支持整数。' }) +
          fieldRow('适用车系/车型', '<button class="btn btn-primary" type="button">选择车系/车型</button><span class="inline-note">未选择</span>', { required: true }) +
          fieldRow('适用专营店', '<button class="btn btn-primary" type="button">选择专营店</button><span class="inline-note">未选择</span>', { required: true }) +
          fieldRow('是否通用券', '<div class="inline-radios"><label><input type="radio" checked name="universal"> 否</label><label><input type="radio" name="universal"> 是</label></div>', { required: true }) +
          fieldRow('选择适用范围', scopeField(), { required: true, className: 'scope-row' }) +
          fieldRow('使用须知', richEditor(), { required: true }) +
          sectionTitle('领取规则') +
          fieldRow('领取数量', '<div class="rule-stack"><label><input type="radio" checked name="claim-limit"> 每个用户最多可领 <input class="mini-control" inputmode="numeric" aria-label="每个用户最多可领数量"> 张</label><label><input type="radio" name="claim-limit"> 每个 VIN 最多可领 <input class="mini-control" inputmode="numeric" aria-label="每个VIN最多可领数量"> 张</label></div>', { required: true }) +
          fieldRow('领券时间', '<div class="date-range"><input class="form-control" placeholder="开始日期" aria-label="领券开始时间"><span>至</span><input class="form-control" placeholder="结束日期" aria-label="领券结束时间"></div>', { required: true, help: '卡券可以领取的时间。' }) +
          sectionTitle('核销规则') +
          fieldRow('核销时间', '<div class="rule-stack"><label><input type="radio" name="verify-time"> 固定日期 <input class="inline-date-control" placeholder="开始日期" aria-label="核销开始日期"> 至 <input class="inline-date-control" placeholder="结束日期" aria-label="核销结束日期"></label><label><input type="radio" name="verify-time"> 领取后 <input class="mini-control" inputmode="numeric" aria-label="领取后生效天数"> 天生效，有效天数 <input class="mini-control" inputmode="numeric" aria-label="核销有效天数"></label></div>', { required: true }) +
          fieldRow('核销方式', '<div class="inline-radios"><label><input type="radio" name="verify-channel"> 线上核销</label><label><input type="radio" name="verify-channel"> 线下核销</label><label><input type="radio" name="verify-channel"> 线上线下</label></div>', { required: true }) +
          fieldRow('核销门店与意向门店一致', '<div class="inline-radios"><label><input type="radio" name="dealer-match"> 是</label><label><input type="radio" name="dealer-match"> 否</label></div>', { required: true }) +
          fieldRow('核销结束时间增加', '<div class="control-with-suffix"><input class="form-control" placeholder="请输入" inputmode="numeric" aria-label="核销结束时间增加天数"><span>天内允许核销</span></div>', { required: true }) +
          sectionTitle('关联设置') +
          fieldRow('结算规则', '<select class="form-control" aria-label="结算规则"><option>请选择结算规则</option></select>') +
          fieldRow('短信通知', '<div class="rule-stack"><label><input type="radio" checked name="sms-notice"> 默认</label><label><input type="radio" name="sms-notice"> 自定义 <input class="inline-date-control" placeholder="请填写短信模板编码" aria-label="短信模板编码"></label><label><input type="radio" name="sms-notice"> 无</label></div>', { required: true, help: '用于配置卡券相关短信通知。' }) +
          sectionTitle('核销后提醒') +
          fieldRow('站内信提醒', '<div class="rule-stack"><label><input type="radio" checked name="used-reminder"> 无</label><label><input type="radio" name="used-reminder"> <input class="inline-date-control" placeholder="请填写小程序短信模板" aria-label="核销后小程序站内信模板"> <input class="inline-date-control" placeholder="请填写app短信模板" aria-label="核销后App站内信模板"></label></div>', { required: true }) +
          sectionTitle('到期提醒') +
          fieldRow('站内信提醒', '<div class="rule-stack"><label><input type="radio" checked name="expiry-reminder"> 无</label><label><input type="radio" name="expiry-reminder"> <input class="mini-control" placeholder="天数" inputmode="numeric" aria-label="到期前提醒天数"> 天前提醒 <input class="inline-date-control" placeholder="请输入小程序站内信模板" aria-label="到期小程序站内信模板"> <input class="inline-date-control" placeholder="请输入app站内信模板" aria-label="到期App站内信模板"></label></div>', { required: true, help: '仅展示一次；提醒精确至分。' }) +
          '<div class="form-actions"><span class="save-state" aria-live="polite">' + (state.savedAt ? '保存成功 · ' + state.savedCodes.length + ' 个商品编码 · ' + window.escapeHTML(state.savedAt) : '') + '</span><button class="btn btn-primary" type="button" id="save-coupon" data-testid="save-coupon" data-anno="coupon-submit">提交</button><button class="btn" type="button" id="reset-coupon">重置</button></div>' +
        '</div>' +
      '</div>' +
      '<div class="workbench-tabs" aria-label="已打开页面"><button class="active" type="button">新增卡券 <span class="el-icon-close" aria-hidden="true"></span></button></div>' +
    '</section>';
  }

  function rerender() {
    var root = document.getElementById('page-content');
    if (!root) return;
    root.innerHTML = render();
    init();
    if (window.AnnotationRuntime) window.AnnotationRuntime.refresh();
  }

  function filterCards(filters) {
    return window.MockData.oldFriendCards.filter(function (card) {
      return (!filters.code || card.carProductCode.toLowerCase().indexOf(filters.code.toLowerCase()) >= 0) &&
        (!filters.name || card.carProductName.indexOf(filters.name) >= 0);
    });
  }

  function resultsHTML(mode, cards, modalSelectedIds) {
    if (mode === 'loading') return '<div class="result-state is-loading"><span class="state-symbol el-icon-loading" aria-hidden="true"></span><strong>正在查询老友卡商品…</strong><p>请稍候</p></div>';
    if (mode === 'error') return '<div class="result-state is-error"><span class="state-symbol el-icon-warning-outline" aria-hidden="true"></span><strong>查询失败</strong><p>请稍后重试</p><button class="btn" type="button" data-action="retry">重新查询</button></div>';
    if (!cards.length) return '<div class="result-state"><span class="state-symbol el-icon-search" aria-hidden="true"></span><strong>未查询到老友卡商品</strong><p>请调整产品编码或产品名称；空结果不生成关联。</p></div>';
    return '<div class="table-scroll"><table class="card-result-table"><thead><tr><th>选择</th><th data-anno="coupon-old-friend-id-column">产品 ID</th><th>产品编码</th><th>产品名称</th><th>产品年期</th><th>用户价</th><th>启停状态</th></tr></thead><tbody>' +
      cards.map(function (card) {
        return '<tr><td><input type="checkbox" name="old-friend-choices" value="' + window.escapeHTML(card.carProductId) + '" ' + (modalSelectedIds.indexOf(card.carProductId) >= 0 ? 'checked ' : '') + 'aria-label="选择' + window.escapeHTML(card.carProductName) + '"></td><td><code>' + window.escapeHTML(displayProductId(card)) + '</code></td><td>' + window.escapeHTML(card.carProductCode) + '</td><td><strong>' + window.escapeHTML(card.carProductName) + '</strong></td><td>' + window.escapeHTML(card.serviceYear) + '</td><td>' + window.formatCurrency(card.usePrice) + '</td><td><span class="tag">' + window.escapeHTML(cardStatusLabel(card)) + '</span></td></tr>';
      }).join('') + '</tbody></table></div><div class="result-foot"><span>第 1 页 · 每页 10 条</span><span>共 ' + cards.length + ' 条</span></div>';
  }

  function openSelector() {
    var dialogState = { mode: 'normal', cards: window.MockData.oldFriendCards.slice(), selectedIds: state.selectedCardIds.slice() };
    var body = '<div class="selector-filters"><label><span class="field-label">产品编码</span><input id="filter-code" class="form-control" placeholder="请输入产品编码"></label><label><span class="field-label">产品名称</span><input id="filter-name" class="form-control" placeholder="请输入产品名称"></label><div class="filter-actions"><button class="btn" type="button" data-action="reset">重置</button><button class="btn btn-primary" type="button" data-action="query" data-testid="query-cards">查询</button></div></div>' +
      '<div class="selector-selection-summary"><strong>已选 <b id="selector-selected-count">0</b> 项</strong><span>当前结果已选 <b id="selector-visible-selected-count">0</b> 项</span></div>' +
      '<div id="selector-results" class="selector-results" aria-live="polite"></div>';
    var root = window.PrototypeDialog.open({
      id: 'old-friend-dialog',
      className: 'old-friend-dialog',
      title: '选择老友卡商品',
      body: body,
      footer: '<button class="btn" type="button" data-dialog-close>取消</button><button class="btn btn-primary" type="button" data-action="confirm" data-testid="confirm-cards" data-anno="coupon-old-friend-confirm">确认（0）</button>'
    });

    function filters() {
      return {
        code: root.querySelector('#filter-code').value.trim(),
        name: root.querySelector('#filter-name').value.trim()
      };
    }
    function uniqueReturnedCards(ids) {
      var seen = Object.create(null);
      return (Array.isArray(ids) ? ids : []).reduce(function (cards, id) {
        if (seen[id]) return cards;
        var card = window.MockData.oldFriendCards.find(function (item) {
          return item.carProductId === id;
        });
        if (card) {
          seen[id] = true;
          cards.push(card);
        }
        return cards;
      }, []);
    }
    function updateSelectionSummary() {
      var visibleIds = dialogState.mode === 'normal' ? dialogState.cards.map(function (card) { return card.carProductId; }) : [];
      var visibleSelectedCount = dialogState.selectedIds.filter(function (id) { return visibleIds.indexOf(id) >= 0; }).length;
      root.querySelector('#selector-selected-count').textContent = dialogState.selectedIds.length;
      root.querySelector('#selector-visible-selected-count').textContent = visibleSelectedCount;
      var confirmButton = root.querySelector('[data-action="confirm"]');
      confirmButton.textContent = '确认（' + dialogState.selectedIds.length + '）';
      confirmButton.disabled = dialogState.mode === 'loading';
    }
    function draw() {
      var box = root.querySelector('#selector-results');
      box.innerHTML = resultsHTML(dialogState.mode, dialogState.cards, dialogState.selectedIds);
      root.querySelectorAll('[data-mode]').forEach(function (button) { button.classList.toggle('active', button.getAttribute('data-mode') === dialogState.mode); });
      updateSelectionSummary();
    }
    function runQuery() {
      dialogState.mode = 'loading';
      draw();
      window.setTimeout(function () {
        if (!root.isConnected) return;
        dialogState.mode = 'normal';
        dialogState.cards = filterCards(filters());
        draw();
      }, 420);
    }
    root.addEventListener('change', function (event) {
      if (event.target.name !== 'old-friend-choices') return;
      var card = window.MockData.oldFriendCards.find(function (item) { return item.carProductId === event.target.value; });
      if (!card) {
        event.target.checked = false;
        window.showToast('该商品已不在当前查询结果中');
        return;
      }
      var position = dialogState.selectedIds.indexOf(card.carProductId);
      if (event.target.checked && position < 0) dialogState.selectedIds.push(card.carProductId);
      if (!event.target.checked && position >= 0) dialogState.selectedIds.splice(position, 1);
      updateSelectionSummary();
    });
    root.addEventListener('click', function (event) {
      var actionButton = event.target.closest('[data-action]');
      var modeButton = event.target.closest('[data-mode]');
      if (modeButton) {
        dialogState.mode = modeButton.getAttribute('data-mode');
        dialogState.cards = dialogState.mode === 'normal' ? window.MockData.oldFriendCards.slice() : [];
        draw();
        return;
      }
      if (!actionButton) return;
      var action = actionButton.getAttribute('data-action');
      if (action === 'query' || action === 'retry') runQuery();
      if (action === 'reset') {
        root.querySelector('#filter-code').value = '';
        root.querySelector('#filter-name').value = '';
        dialogState.mode = 'normal';
        dialogState.cards = window.MockData.oldFriendCards.slice();
        draw();
      }
      if (action === 'confirm') {
        if (dialogState.mode === 'loading') { window.showToast('查询完成后再确认'); return; }
        var selectedCards = uniqueReturnedCards(dialogState.selectedIds);
        if (!selectedCards.length) { window.showToast('请至少选择一项老友卡商品'); return; }
        if (selectedCards.length !== dialogState.selectedIds.length) { window.showToast('部分已选商品已不在查询结果中，请重新选择'); return; }
        state.selectedCardIds = selectedCards.map(function (card) { return card.carProductId; });
        state.formError = '';
        window.PrototypeDialog.close('confirm');
        rerender();
        window.showToast('已选择 ' + selectedCards.length + ' 项老友卡商品');
      }
    });
    draw();
  }

  function save() {
    if (state.selectedType !== 'old-friend-card') {
      var existingType = window.MockData.existingProductTypes.find(function (item) { return item.key === state.selectedType; });
      window.showToast('请选择适用的' + (existingType ? existingType.label : '商品') + '后再提交');
      return;
    }
    if (!state.selectedCardIds.length) {
      state.formError = '请至少选择一项老友卡商品后再提交。';
      rerender();
      document.getElementById('old-friend-panel').scrollIntoView({ behavior: 'smooth', block: 'center' });
      window.showToast('缺少老友卡适用范围');
      return;
    }
    state.formError = '';
    state.savedCodes = window.getOldFriendCardsByIds(state.selectedCardIds).map(function (card) { return card.carProductCode; });
    state.savedAt = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    window.__lastSavedCouponPayload = { applicableOldFriendCardCodes: state.savedCodes.slice() };
    rerender();
    window.showToast('已保存 ' + state.savedCodes.length + ' 个商品编码');
  }

  function init() {
    document.querySelectorAll('[data-type]').forEach(function (input) {
      input.addEventListener('click', function () {
        var nextType = input.getAttribute('data-type');
        var shouldOpenSelector = nextType === 'old-friend-card';
        state.selectedType = nextType;
        state.formError = '';
        rerender();
        if (shouldOpenSelector) openSelector();
      });
    });
    document.querySelectorAll('[data-remove-card-id]').forEach(function (removeButton) {
      removeButton.addEventListener('click', function () {
        var cardId = removeButton.getAttribute('data-remove-card-id');
        state.selectedCardIds = state.selectedCardIds.filter(function (id) { return id !== cardId; });
        state.formError = '';
        rerender();
        window.showToast('已移除 1 项关联');
      });
    });
    var saveButton = document.getElementById('save-coupon');
    if (saveButton) saveButton.addEventListener('click', save);
    var backButton = document.getElementById('back-button');
    if (backButton) backButton.addEventListener('click', function () { window.showToast('已返回卡券列表'); });
    var resetButton = document.getElementById('reset-coupon');
    if (resetButton) resetButton.addEventListener('click', function () { state.selectedType = 'old-friend-card'; state.selectedCardIds = []; state.formError = ''; state.savedAt = ''; state.savedCodes = []; window.__lastSavedCouponPayload = null; rerender(); window.showToast('已重置'); });
  }

  window.Pages['coupon-config'] = { render: render, init: init };
})();
