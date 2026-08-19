(function () {
  'use strict';

  window.Pages = window.Pages || {};
  var esc = window.escapeHtml;
  var subsidyState = { expanded: false, page: 1, pageSize: 5, filters: {} };
  var ruleState = { filters: {}, rules: window.MockData.rules.map(function (item) { return Object.assign({}, item); }) };

  function statusTag(status) {
    var cls = status === '已结算' || status === '已完成' || status === '已完工' || status === '启用' ? 'tag-green' :
      status === '未结算' || status === '退款期内' || status === '部分退款' ? 'tag-orange' :
      status === '无需结算' || status === '已全额退款' || status === '停用' ? 'tag-gray' : 'tag-blue';
    return '<span class="tag ' + cls + '">' + esc(status) + '</span>';
  }

  function pageHeader(title, subtitle, action) {
    return '<div class="breadcrumb">卡券中心&nbsp; / &nbsp;' + esc(title) + '</div>' +
      '<div class="page-heading"><div><h1>' + esc(title) + '</h1><div class="page-subtitle">' + esc(subtitle) + '</div></div>' + (action || '') + '</div>';
  }

  function field(id, label, placeholder, type) {
    return '<div class="field"><label for="' + id + '">' + label + '</label><input id="' + id + '" type="' + (type || 'text') + '" placeholder="' + placeholder + '"></div>';
  }

  function selectField(id, label, options) {
    return '<div class="field"><label for="' + id + '">' + label + '</label><select id="' + id + '"><option value="">全部</option>' + options.map(function (item) { return '<option>' + item + '</option>'; }).join('') + '</select></div>';
  }

  function getSubsidies() {
    var f = subsidyState.filters;
    return window.MockData.subsidies.filter(function (row) {
      function includes(key, value) { return !value || String(key).toLowerCase().includes(String(value).toLowerCase()); }
      var codeOk = !f.code || includes(row.code, f.code) || includes(window.maskCouponCode(row.code), f.code);
      return includes(row.id, f.id) && codeOk &&
        includes(row.documentNo, f.documentNo) && includes(row.vin, f.vin) && includes(row.phone, f.phone) &&
        includes(row.oneId, f.oneId) && includes(row.ruleId, f.rule) && includes(row.ruleName, f.rule) &&
        (!f.channel || row.channel === f.channel) && (!f.settlementStatus || row.settlementStatus === f.settlementStatus) &&
        (!f.documentStatus || row.documentStatus === f.documentStatus) &&
        (!f.startDate || row.redeemedAt.slice(0, 10) >= f.startDate) && (!f.endDate || row.redeemedAt.slice(0, 10) <= f.endDate);
    });
  }

  function subsidyTable() {
    var rows = getSubsidies();
    var totalPages = Math.max(1, Math.ceil(rows.length / subsidyState.pageSize));
    if (subsidyState.page > totalPages) subsidyState.page = totalPages;
    var start = (subsidyState.page - 1) * subsidyState.pageSize;
    var pageRows = rows.slice(start, start + subsidyState.pageSize);
    var body = pageRows.length ? pageRows.map(function (row) {
      return '<tr><td>' + esc(row.id) + '</td><td>' + esc(window.maskCouponCode(row.code)) + '</td><td>' + esc(row.documentNo) + '</td>' +
        '<td>' + esc(row.vin) + '</td><td>' + esc(row.phone) + '</td><td>' + esc(row.oneId) + '</td>' +
        '<td>' + (row.channel === '线上' ? '<span class="tag tag-blue">线上</span>' : '<span class="tag tag-green">线下</span>') + '</td><td>' + esc(row.source) + '</td>' +
        '<td>' + esc(row.ruleId) + '</td><td>' + esc(row.ruleName) + '</td><td>' + statusTag(row.documentStatus) + '</td><td>' + statusTag(row.settlementStatus) + '</td>' +
        '<td>' + esc(row.redeemedAt) + '</td><td>' + esc(row.syncedAt) + '</td><td class="operation-cell"><button class="btn-link detail-btn" data-id="' + esc(row.id) + '">查看明细</button></td></tr>';
    }).join('') : '<tr><td colspan="15"><div class="empty"><span class="empty-icon">⌕</span>未查询到符合条件的卡券补贴数据</div></td></tr>';
    var pages = '';
    for (var i = 1; i <= totalPages; i += 1) pages += '<button class="page-button ' + (i === subsidyState.page ? 'active' : '') + '" data-page-num="' + i + '">' + i + '</button>';
    return '<div class="table-toolbar"><strong>补贴数据列表</strong><span class="table-meta">共 ' + rows.length + ' 条；一张卡券一行</span></div>' +
      '<div class="table-wrap"><table><thead><tr><th>卡券ID</th><th>核销码</th><th>订单号/工单号</th><th>VIN</th><th>手机号</th><th>oneID</th><th>核销渠道</th><th>数据来源</th><th>补贴规则ID</th><th>补贴规则名称</th><th>订单/工单状态</th><th>结算状态</th><th>核销时间</th><th>最后同步时间</th><th class="operation-cell">操作</th></tr></thead><tbody>' + body + '</tbody></table></div>' +
      '<div class="pagination"><span>第 ' + subsidyState.page + ' / ' + totalPages + ' 页</span>' + pages + '</div>';
  }

  function renderSubsidyPage() {
    return pageHeader('卡券补贴数据', 'T+1 接收新商城与 E3S 已计算的补贴结果，仅查询和展示当前快照') +
      '<section class="panel filter-panel"><div class="filter-grid">' +
      field('f-id', '卡券ID', '请输入卡券ID') + field('f-code', '核销码', '支持脱敏码查询') + field('f-doc', '订单号/工单号', '请输入单据编号') +
      selectField('f-channel', '核销渠道', ['线上', '线下']) + selectField('f-settlement', '结算状态', ['未结算', '已结算', '无需结算']) +
      field('f-start', '核销开始日期', '', 'date') + field('f-end', '核销结束日期', '', 'date') + '</div>' +
      '<div id="advanced-filters" class="filter-grid advanced" style="display:' + (subsidyState.expanded ? 'grid' : 'none') + '">' +
      field('f-vin', 'VIN', '请输入VIN') + field('f-phone', '手机号', '请输入手机号') + field('f-oneid', 'oneID', '请输入oneID') +
      field('f-rule', '补贴规则ID/名称', '请输入规则ID或名称') + selectField('f-doc-status', '订单/工单状态', ['退款期内', '部分退款', '已全额退款', '已完成', '已完工']) + '</div>' +
      '<div class="filter-actions"><button id="expand-filter" class="btn-link expand-btn">' + (subsidyState.expanded ? '收起条件⌃' : '展开更多⌄') + '</button><button id="reset-subsidy" class="btn">重置</button><button id="query-subsidy" class="btn btn-primary">查询</button></div></section>' +
      '<section class="panel table-panel"><div class="tipbar"><span>ⓘ</span><span>新商城数据展示为线上，E3S 数据展示为线下；预计与实际结算金额由来源系统直接传入，卡券中心不计算。</span></div><div id="subsidy-table">' + subsidyTable() + '</div></section>';
  }

  function fillFilterValues() {
    var map = {'f-id':'id','f-code':'code','f-doc':'documentNo','f-channel':'channel','f-settlement':'settlementStatus','f-start':'startDate','f-end':'endDate','f-vin':'vin','f-phone':'phone','f-oneid':'oneId','f-rule':'rule','f-doc-status':'documentStatus'};
    Object.keys(map).forEach(function (id) { var el = document.getElementById(id); if (el) el.value = subsidyState.filters[map[id]] || ''; });
  }

  function readFilters() {
    subsidyState.filters = {
      id: document.getElementById('f-id').value.trim(), code: document.getElementById('f-code').value.trim(), documentNo: document.getElementById('f-doc').value.trim(),
      channel: document.getElementById('f-channel').value, settlementStatus: document.getElementById('f-settlement').value,
      startDate: document.getElementById('f-start').value, endDate: document.getElementById('f-end').value,
      vin: document.getElementById('f-vin') ? document.getElementById('f-vin').value.trim() : '', phone: document.getElementById('f-phone') ? document.getElementById('f-phone').value.trim() : '',
      oneId: document.getElementById('f-oneid') ? document.getElementById('f-oneid').value.trim() : '', rule: document.getElementById('f-rule') ? document.getElementById('f-rule').value.trim() : '',
      documentStatus: document.getElementById('f-doc-status') ? document.getElementById('f-doc-status').value : ''
    };
  }

  function openDetail(id) {
    var row = window.MockData.subsidies.find(function (item) { return item.id === id; });
    if (!row) return;
    var itemRows = row.details.map(function (detail) {
      return '<tr><td>' + esc(detail.type) + '</td><td>' + esc(detail.itemId) + '</td><td>' + esc(detail.itemName) + '</td><td>' + detail.quantity + '</td><td class="money">' + window.formatMoney(detail.discount) + '</td><td class="money">' + window.formatMoney(detail.expected) + '</td><td class="money">' + window.formatMoney(detail.actual) + '</td></tr>';
    }).join('');
    var actualHint = row.details.some(function (item) { return item.actual == null; }) ? '实际结算金额尚未生成时显示“—”，不会用 0 代替。' : '实际结算金额已由来源系统生成；财务结算只改变结算状态。';
    var layer = document.createElement('div'); layer.className = 'drawer-mask';
    layer.innerHTML = '<aside class="drawer"><div class="drawer-header"><span>卡券补贴明细</span><button class="close-btn" aria-label="关闭">×</button></div><div class="drawer-body">' +
      '<h3 class="section-title">卡券及单据信息</h3><dl class="detail-grid">' +
      [['卡券ID',row.id],['核销码',window.maskCouponCode(row.code)],['订单号/工单号',row.documentNo],['VIN',row.vin],['手机号',row.phone],['oneID',row.oneId],['核销渠道',row.channel],['数据来源',row.source],['补贴规则',row.ruleId+' / '+row.ruleName],['订单/工单状态',row.documentStatus],['结算状态',row.settlementStatus],['最后同步时间',row.syncedAt]].map(function (pair) { return '<div class="detail-item"><dt>' + pair[0] + '</dt><dd>' + esc(pair[1]) + '</dd></div>'; }).join('') + '</dl>' +
      '<h3 class="section-title">当前适用' + (row.channel === '线上' ? '商品' : '备件') + '明细</h3><div class="table-wrap"><table style="min-width:760px"><thead><tr><th>类型</th><th>商品/备件ID</th><th>商品/备件名称</th><th>数量</th><th>优惠金额</th><th>预计结算金额</th><th>实际结算金额</th></tr></thead><tbody>' + itemRows + '</tbody></table></div><div class="notice" style="margin-top:16px">' + actualHint + ' 每次同步以来源系统传入的当前全部明细原子替换。</div></div></aside>';
    document.body.appendChild(layer);
    layer.querySelector('.close-btn').onclick = window.closeLayer;
    layer.addEventListener('click', function (event) { if (event.target === layer) window.closeLayer(); });
  }

  function initSubsidyPage() {
    fillFilterValues();
    document.getElementById('expand-filter').onclick = function () { subsidyState.expanded = !subsidyState.expanded; readFilters(); window.navigateTo('subsidy-data'); };
    document.getElementById('reset-subsidy').onclick = function () { subsidyState.filters = {}; subsidyState.page = 1; window.navigateTo('subsidy-data'); };
    document.getElementById('query-subsidy').onclick = function () { readFilters(); subsidyState.page = 1; document.getElementById('subsidy-table').innerHTML = subsidyTable(); bindSubsidyTable(); window.showToast('已按查询条件筛选'); };
    bindSubsidyTable();
  }

  function bindSubsidyTable() {
    document.querySelectorAll('.detail-btn').forEach(function (btn) { btn.onclick = function () { openDetail(btn.dataset.id); }; });
    document.querySelectorAll('[data-page-num]').forEach(function (btn) { btn.onclick = function () { subsidyState.page = Number(btn.dataset.pageNum); document.getElementById('subsidy-table').innerHTML = subsidyTable(); bindSubsidyTable(); }; });
  }

  function getRules() {
    return ruleState.rules.filter(function (rule) {
      var idOk = !ruleState.filters.id || rule.id.toLowerCase().includes(ruleState.filters.id.toLowerCase());
      var nameOk = !ruleState.filters.name || rule.name.toLowerCase().includes(ruleState.filters.name.toLowerCase());
      return idOk && nameOk;
    });
  }

  function ruleTable() {
    var rules = getRules();
    var body = rules.length ? rules.map(function (rule) {
      return '<tr><td>' + esc(rule.id) + '</td><td>' + esc(rule.name) + '</td><td class="rule-config">' + esc(rule.onlineType) + ' · ' + esc(rule.onlineValue) + (rule.onlineType === '比例结算' ? '%' : '元') + '<br><span class="table-meta">标准值：' + esc(rule.onlineBasis) + '</span></td>' +
        '<td class="rule-config">' + esc(rule.offlineType) + ' · ' + esc(rule.offlineValue) + (rule.offlineType === '比例结算' ? '%' : '元') + '<br><span class="table-meta">标准值：' + esc(rule.offlineBasis) + '</span></td>' +
        '<td>' + statusTag(rule.status) + '</td><td>' + rule.usageCount + '</td><td>' + esc(rule.updatedAt) + '</td><td class="operation-cell"><div class="rule-actions"><button class="btn-link view-rule" data-id="' + rule.id + '">查看</button><button class="btn-link edit-rule" data-id="' + rule.id + '">编辑</button><button class="btn-link btn-danger-link delete-rule" data-id="' + rule.id + '">删除</button></div></td></tr>';
    }).join('') : '<tr><td colspan="8"><div class="empty"><span class="empty-icon">⌕</span>未查询到补贴规则</div></td></tr>';
    return '<div class="table-toolbar"><strong>补贴规则列表</strong><span class="table-meta">共 ' + rules.length + ' 条</span></div><div class="table-wrap rule-table"><table><thead><tr><th>规则ID</th><th>规则名称</th><th>线上补贴规则</th><th>线下补贴规则</th><th>状态</th><th>已关联卡券数</th><th>更新时间</th><th class="operation-cell">操作</th></tr></thead><tbody>' + body + '</tbody></table></div>';
  }

  function renderRulePage() {
    return pageHeader('补贴规则设置', '沿用卡券中心原有规则页面；一条规则同时维护线上与线下配置，不单独选择结算渠道', '<button id="create-rule" class="btn btn-primary">＋ 新增规则</button>') +
      '<section class="panel filter-panel"><div class="filter-grid"><div class="field"><label>规则ID</label><input id="rule-filter-id" placeholder="请输入规则ID"></div><div class="field"><label>规则名称</label><input id="rule-filter-name" placeholder="请输入规则名称"></div></div><div class="filter-actions"><button id="reset-rule" class="btn">重置</button><button id="query-rule" class="btn btn-primary">查询</button></div></section>' +
      '<section class="panel table-panel"><div class="tipbar"><span>ⓘ</span><span>此处不配置结算渠道。来源系统按实际线上/线下核销场景使用同一规则中的对应配置；已被卡券引用的规则限制沿用现网逻辑。</span></div><div id="rule-table">' + ruleTable() + '</div></section>';
  }

  function ruleForm(rule, readonly) {
    var data = rule || { id: '', name: '', onlineType: '比例结算', onlineValue: '', onlineBasis: '实际优惠金额', offlineType: '比例结算', offlineValue: '', offlineBasis: '实际优惠金额', status: '启用' };
    function opts(values, current) { return values.map(function (value) { return '<option ' + (value === current ? 'selected' : '') + '>' + value + '</option>'; }).join(''); }
    var lock = readonly ? 'disabled' : '';
    return '<div class="form-grid"><div class="field"><label class="required">规则ID</label><input id="m-rule-id" value="' + esc(data.id) + '" placeholder="保存后自动生成" disabled></div><div class="field"><label class="required">规则名称</label><input id="m-rule-name" value="' + esc(data.name) + '" placeholder="请输入规则名称" ' + lock + '></div><div class="field"><label>规则状态</label><select id="m-rule-status" ' + lock + '>' + opts(['启用','停用'], data.status) + '</select></div></div>' +
      '<div class="form-section"><h3 class="section-title">线上补贴计算规则</h3><div class="inline-fields"><div class="field"><label class="required">结算方式</label><select id="m-online-type" ' + lock + '>' + opts(['固定金额','比例结算'], data.onlineType) + '</select></div><div class="field"><label class="required">结算值</label><input id="m-online-value" type="number" min="0" value="' + esc(data.onlineValue) + '" ' + lock + '></div><div class="field"><label class="required">结算价格标准值</label><select id="m-online-basis" ' + lock + '>' + opts(['商城商品单价','实际优惠金额','卡券面值','网点价'], data.onlineBasis) + '</select></div></div></div>' +
      '<div class="form-section"><h3 class="section-title">线下补贴计算规则</h3><div class="inline-fields"><div class="field"><label class="required">结算方式</label><select id="m-offline-type" ' + lock + '>' + opts(['固定金额','比例结算'], data.offlineType) + '</select></div><div class="field"><label class="required">结算值</label><input id="m-offline-value" type="number" min="0" value="' + esc(data.offlineValue) + '" ' + lock + '></div><div class="field"><label class="required">结算价格标准值</label><select id="m-offline-basis" ' + lock + '>' + opts(['用户价','实际优惠金额','卡券面值','网点价'], data.offlineBasis) + '</select></div></div></div>' +
      '<p class="status-hint">规则页面不设置“结算渠道”；线上、线下配置可同时维护。</p>';
  }

  function openRuleModal(mode, id) {
    var rule = id ? ruleState.rules.find(function (item) { return item.id === id; }) : null;
    var title = mode === 'create' ? '新增补贴规则' : mode === 'edit' ? '编辑补贴规则' : '查看补贴规则';
    var layer = document.createElement('div'); layer.className = 'modal-mask';
    layer.innerHTML = '<div class="modal"><div class="modal-header"><span>' + title + '</span><button class="close-btn">×</button></div><div class="modal-body">' + ruleForm(rule, mode === 'view') + '</div><div class="modal-footer"><button class="btn close-modal">' + (mode === 'view' ? '关闭' : '取消') + '</button>' + (mode === 'view' ? '' : '<button id="save-rule" class="btn btn-primary">保存</button>') + '</div></div>';
    document.body.appendChild(layer);
    layer.querySelector('.close-btn').onclick = window.closeLayer; layer.querySelector('.close-modal').onclick = window.closeLayer;
    layer.addEventListener('click', function (event) { if (event.target === layer) window.closeLayer(); });
    if (mode !== 'view') layer.querySelector('#save-rule').onclick = function () {
      var name = document.getElementById('m-rule-name').value.trim();
      var onlineValue = document.getElementById('m-online-value').value;
      var offlineValue = document.getElementById('m-offline-value').value;
      if (!name || onlineValue === '' || offlineValue === '') { window.showToast('请填写规则名称及线上、线下结算值'); return; }
      var next = {
        id: rule ? rule.id : 'RULE-NEW-' + String(ruleState.rules.length + 1).padStart(2, '0'), name: name,
        onlineType: document.getElementById('m-online-type').value, onlineValue: onlineValue, onlineBasis: document.getElementById('m-online-basis').value,
        offlineType: document.getElementById('m-offline-type').value, offlineValue: offlineValue, offlineBasis: document.getElementById('m-offline-basis').value,
        status: document.getElementById('m-rule-status').value, usageCount: rule ? rule.usageCount : 0, updatedAt: '2026-08-19 16:55:00'
      };
      if (rule) Object.assign(rule, next); else ruleState.rules.unshift(next);
      window.closeLayer(); document.getElementById('rule-table').innerHTML = ruleTable(); bindRuleTable(); window.showToast(mode === 'create' ? '规则已新增（原型数据）' : '规则已保存（原型数据）');
    };
  }

  function confirmDelete(id) {
    var rule = ruleState.rules.find(function (item) { return item.id === id; });
    if (!rule) return;
    if (rule.usageCount > 0) { window.showToast('该规则已关联卡券，按现网限制不可删除'); return; }
    var layer = document.createElement('div'); layer.className = 'modal-mask';
    layer.innerHTML = '<div class="modal modal-sm"><div class="modal-header"><span>删除补贴规则</span><button class="close-btn">×</button></div><div class="modal-body">确认删除“' + esc(rule.name) + '”吗？此操作仅影响当前原型演示数据。</div><div class="modal-footer"><button class="btn cancel-delete">取消</button><button class="btn btn-primary confirm-delete">确认删除</button></div></div>';
    document.body.appendChild(layer); layer.querySelector('.close-btn').onclick = window.closeLayer; layer.querySelector('.cancel-delete').onclick = window.closeLayer;
    layer.querySelector('.confirm-delete').onclick = function () { ruleState.rules = ruleState.rules.filter(function (item) { return item.id !== id; }); window.closeLayer(); document.getElementById('rule-table').innerHTML = ruleTable(); bindRuleTable(); window.showToast('规则已删除（原型数据）'); };
  }

  function bindRuleTable() {
    document.querySelectorAll('.view-rule').forEach(function (btn) { btn.onclick = function () { openRuleModal('view', btn.dataset.id); }; });
    document.querySelectorAll('.edit-rule').forEach(function (btn) { btn.onclick = function () { openRuleModal('edit', btn.dataset.id); }; });
    document.querySelectorAll('.delete-rule').forEach(function (btn) { btn.onclick = function () { confirmDelete(btn.dataset.id); }; });
  }

  function initRulePage() {
    document.getElementById('rule-filter-id').value = ruleState.filters.id || '';
    document.getElementById('rule-filter-name').value = ruleState.filters.name || '';
    document.getElementById('create-rule').onclick = function () { openRuleModal('create'); };
    document.getElementById('query-rule').onclick = function () { ruleState.filters = { id: document.getElementById('rule-filter-id').value.trim(), name: document.getElementById('rule-filter-name').value.trim() }; document.getElementById('rule-table').innerHTML = ruleTable(); bindRuleTable(); window.showToast('已按查询条件筛选'); };
    document.getElementById('reset-rule').onclick = function () { ruleState.filters = {}; window.navigateTo('rule-settings'); };
    bindRuleTable();
  }

  window.Pages['subsidy-data'] = { render: renderSubsidyPage, init: initSubsidyPage };
  window.Pages['rule-settings'] = { render: renderRulePage, init: initRulePage };
})();
