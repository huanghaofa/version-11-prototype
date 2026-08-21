(function () {
  'use strict';

  var page = 'activity-overview';
  var pageMap = {
    'activity-overview': {center:'活动中心', menu:'SA活动报表', title:'SA活动报表', desc:'查看SA动态二维码带来的活动参与与转化数据。'},
    'activity-qr': {center:'活动中心', menu:'SA活动报表', title:'二维码明细', desc:'查看二维码场景、活动范围快照及扫码转化。'},
    'activity-participation': {center:'活动中心', menu:'SA活动报表', title:'活动参与明细', desc:'查看每个活动参与主体最终确认的来源信息。'},
    'coupon-overview': {center:'卡券中心', menu:'SA卡券报表', title:'SA卡券报表', desc:'查看SA来源卡券的发放、激活、核销与跨店表现。'},
    'coupon-claim': {center:'卡券中心', menu:'SA卡券报表', title:'卡券领取明细', desc:'查看券实例的来源活动、来源SA和归属主体。'},
    'coupon-redeem': {center:'卡券中心', menu:'SA卡券报表', title:'卡券核销明细', desc:'查看来源门店、实际核销门店与跨店核销情况。'}
  };
  if (window.ActivityConfigPages) {
    Object.keys(window.ActivityConfigPages.pages).forEach(function (key) {
      pageMap[key] = window.ActivityConfigPages.pages[key];
    });
  }
  var filtersExpanded = false;
  var pendingOpen = null;
  var esc = window.SACommon.escapeHtml;
  var status = window.SACommon.status;
  var data = window.SAReportData;
  var reportActivityFilter = {
    selectedIds: [],
    draftIds: [],
    tab: 'available',
    queryId: '',
    queryName: '',
    queryType: '',
    queryStatus: '',
    page: 1,
    pageSize: 10,
    limit: 20
  };

  function centerTabs(current) {
    var activityTabs = ['组合活动列表','专属福利活动列表','保客活动创建','保客活动互斥关系','保客活动一店一码','SA活动配置','SA活动报表'];
    var couponTabs = ['优惠券发放','领券记录','卡券列表','卡券限额','售后业务报表','业务报表','核销列表','卡券发放','发放记录','SA卡券报表'];
    var tabs = current.center === '活动中心' ? activityTabs : couponTabs;
    var routes = {'保客活动创建':'activity-manage','保客活动互斥关系':'activity-mutex','SA活动配置':'sa-placement-manage','SA活动报表':'activity-overview','SA卡券报表':'coupon-overview'};
    return '<div class="center-tabs">' + tabs.map(function (item) {
      var tag = routes[item] ? 'a' : 'span';
      var href = routes[item] ? ' href="#' + routes[item] + '"' : '';
      return '<' + tag + href + ' class="center-tab ' + (item === current.menu ? 'active' : '') + '">' + item + '</' + tag + '>';
    }).join('') + '</div>';
  }

  function reportTabs(currentPage) {
    var activityPages = ['activity-overview','activity-qr','activity-participation'];
    var couponPages = ['coupon-overview','coupon-claim','coupon-redeem'];
    if (activityPages.indexOf(currentPage) === -1 && couponPages.indexOf(currentPage) === -1) return '';
    var activity = activityPages.indexOf(currentPage) > -1;
    var tabs = activity ? [
      ['activity-overview','数据总览'],['activity-qr','二维码明细'],['activity-participation','活动参与明细']
    ] : [
      ['coupon-overview','数据总览'],['coupon-claim','卡券领取明细'],['coupon-redeem','卡券核销明细']
    ];
    return '<div class="subtabs">' + tabs.map(function (tab) {
      return '<a class="subtab ' + (tab[0] === currentPage ? 'active' : '') + '" href="#' + tab[0] + '">' + tab[1] + '</a>';
    }).join('') + '</div>';
  }

  function renderPlaceholder(current) {
    return '<div class="panel"><div class="panel-head"><div class="panel-title">' + current.title + '</div></div>' +
      '<div class="empty-state">页面结构已就绪，业务模块将在下一实施步骤加载。</div></div>';
  }

  function optionList(items, placeholder) {
    return '<option value="">' + (placeholder || '请选择') + '</option>' + items.map(function (item) {
      return '<option value="' + esc(item) + '">' + esc(item) + '</option>';
    }).join('');
  }

  function renderFilters(fields) {
    var visible = fields.slice(0, 8);
    var hidden = fields.slice(8);
    var hasActivityMulti = fields.some(function (field) { return field.type === 'activity-multi'; });
    function renderField(field) {
      var control;
      if (field.type === 'activity-multi') control = renderActivityMultiControl();
      else if (field.type === 'select') control = '<select>' + optionList(field.options || [], field.placeholder) + '</select>';
      else control = '<input type="' + (field.type || 'text') + '" placeholder="' + esc(field.placeholder || '请输入') + '" value="' + esc(field.value || '') + '">';
      return '<div class="filter-field"><label>' + esc(field.label) + '：</label>' + control + '</div>';
    }
    return '<div class="filter-panel ' + (filtersExpanded ? 'expanded' : '') + '"><div class="filter-grid">' +
      visible.map(renderField).join('') +
      (hidden.length ? '<div class="filter-hidden">' + hidden.map(renderField).join('') + '</div>' : '') +
      '</div>' + (hasActivityMulti ? '<div class="filter-logic-note"><strong>多活动查询：</strong>活动之间按“或”匹配，与其他筛选条件按“且”匹配；未选择时查询全部有权限活动。</div>' : '') +
      '<div class="filter-actions"><button class="button" data-reset type="button">重置</button><button class="button primary" data-query type="button">查询</button>' +
      (hidden.length ? '<button class="expand-toggle" data-filter-toggle type="button">' + (filtersExpanded ? '收起' : '展开') + ' ' + (filtersExpanded ? '⌃' : '⌄') + '</button>' : '') +
      '</div></div>';
  }

  function reportActivityCatalog() {
    return data.reportActivityCatalog || [];
  }

  function reportActivityById(id) {
    return reportActivityCatalog().find(function (item) { return item.id === id; });
  }

  function reportActivityLabel() {
    if (!reportActivityFilter.selectedIds.length) return '全部活动';
    if (reportActivityFilter.selectedIds.length === 1) {
      var selected = reportActivityById(reportActivityFilter.selectedIds[0]);
      return selected ? selected.id + ' / ' + selected.name : '已选1个活动';
    }
    return '已选 ' + reportActivityFilter.selectedIds.length + ' 个活动';
  }

  function renderActivityMultiControl() {
    var selected = reportActivityFilter.selectedIds.length;
    return '<div class="activity-multi-control">' +
      '<button class="activity-multi-trigger" data-open-report-activity-selector type="button" title="' + esc(reportActivityLabel()) + '"><span>' + esc(reportActivityLabel()) + '</span><em>选择活动</em></button>' +
      '<button class="activity-multi-clear" data-clear-report-activity type="button"' + (selected ? '' : ' hidden') + '>清除</button></div>';
  }

  function selectorOptionList(items, selected, placeholder) {
    return '<option value="">' + esc(placeholder || '全部') + '</option>' + items.map(function (item) {
      return '<option value="' + esc(item) + '"' + (item === selected ? ' selected' : '') + '>' + esc(item) + '</option>';
    }).join('');
  }

  function filteredReportActivities() {
    var idKeyword = reportActivityFilter.queryId.trim().toLowerCase();
    var nameKeyword = reportActivityFilter.queryName.trim().toLowerCase();
    return reportActivityCatalog().filter(function (item) {
      return (!idKeyword || item.id.toLowerCase().indexOf(idKeyword) > -1) &&
        (!nameKeyword || item.name.toLowerCase().indexOf(nameKeyword) > -1) &&
        (!reportActivityFilter.queryType || item.type === reportActivityFilter.queryType) &&
        (!reportActivityFilter.queryStatus || item.status === reportActivityFilter.queryStatus);
    });
  }

  function reportSelectorPagination(total) {
    var pageCount = Math.max(1, Math.ceil(total / reportActivityFilter.pageSize));
    if (reportActivityFilter.page > pageCount) reportActivityFilter.page = pageCount;
    var buttons = '';
    var index;
    for (index = 1; index <= pageCount; index += 1) {
      buttons += '<button class="page-no' + (index === reportActivityFilter.page ? ' active' : '') + '" data-report-activity-page="' + index + '" type="button">' + index + '</button>';
    }
    return '<div class="pagination-row selector-pagination"><span>共 ' + total + ' 条</span>' +
      '<button class="page-no" data-report-activity-page="' + Math.max(1, reportActivityFilter.page - 1) + '" type="button"' + (reportActivityFilter.page === 1 ? ' disabled' : '') + '>‹</button>' +
      buttons +
      '<button class="page-no" data-report-activity-page="' + Math.min(pageCount, reportActivityFilter.page + 1) + '" type="button"' + (reportActivityFilter.page === pageCount ? ' disabled' : '') + '>›</button>' +
      '<span>' + reportActivityFilter.pageSize + ' 条/页</span></div>';
  }

  function renderReportActivitySelector() {
    var available = filteredReportActivities();
    var start = (reportActivityFilter.page - 1) * reportActivityFilter.pageSize;
    var pageRows = available.slice(start, start + reportActivityFilter.pageSize);
    var selectedRows = reportActivityFilter.draftIds.map(reportActivityById).filter(Boolean);
    var isFull = reportActivityFilter.draftIds.length >= reportActivityFilter.limit;
    var filter = '<div class="selector-filter report-activity-selector-filter">' +
      '<div><label>活动类型</label><select data-report-activity-query-type>' + selectorOptionList(['普通活动','组合活动'],reportActivityFilter.queryType,'全部类型') + '</select></div>' +
      '<div><label>活动状态</label><select data-report-activity-query-status>' + selectorOptionList(['已启用','草稿','未启用','已结束','已停用'],reportActivityFilter.queryStatus,'全部状态') + '</select></div>' +
      '<div><label>活动ID</label><input data-report-activity-query-id value="' + esc(reportActivityFilter.queryId) + '" placeholder="请输入活动ID"></div>' +
      '<div><label>活动名称</label><input data-report-activity-query-name value="' + esc(reportActivityFilter.queryName) + '" placeholder="请输入活动名称"></div>' +
      '<button class="button primary" data-report-activity-search type="button">查询</button></div>';
    var availableBody = pageRows.length ? pageRows.map(function (item) {
      var checked = reportActivityFilter.draftIds.indexOf(item.id) > -1;
      var disabled = isFull && !checked;
      return '<tr class="' + (checked ? 'selected-row' : '') + (disabled ? ' disabled-row' : '') + '"><td><input type="checkbox" data-report-activity-choice value="' + esc(item.id) + '"' + (checked ? ' checked' : '') + (disabled ? ' disabled' : '') + ' aria-label="选择' + esc(item.name) + '"></td><td>' + esc(item.id) + '</td><td class="wrap">' + esc(item.name) + '</td><td>' + status(item.type) + '</td><td>' + status(item.status) + '</td><td>' + status(item.level) + '</td><td>' + esc(item.time) + '</td></tr>';
    }).join('') : '<tr><td colspan="7"><div class="selector-empty"><strong>没有匹配的活动</strong><span>请调整活动ID、名称、类型或状态</span></div></td></tr>';
    var availableTable = filter +
      '<div class="selector-table-title"><strong>可选活动（' + available.length + '）</strong><span>跨查询、跨分页保留已选结果</span></div>' +
      (isFull ? '<div class="selector-limit-tip" role="status">已达到20个活动上限，请先移除已选活动后再继续选择。</div>' : '') +
      '<div class="table-shell selector-table-shell"><table class="data-table report-activity-selector-table"><thead><tr><th>选择</th><th>活动ID</th><th>活动名称</th><th>活动类型</th><th>活动状态</th><th>准入等级</th><th>活动时间</th></tr></thead><tbody>' + availableBody + '</tbody></table></div>' + reportSelectorPagination(available.length);
    var selectedTable = selectedRows.length ? '<div class="selector-table-title"><strong>已选活动（' + selectedRows.length + '/20）</strong><span>确认后回填报表查询条件</span></div><div class="table-shell selector-table-shell selected-activity-table"><table class="data-table"><thead><tr><th>活动ID</th><th>活动名称</th><th>类型</th><th>状态</th><th>准入等级</th><th>操作</th></tr></thead><tbody>' + selectedRows.map(function (item) {
      return '<tr><td>' + esc(item.id) + '</td><td class="wrap">' + esc(item.name) + '</td><td>' + status(item.type) + '</td><td>' + status(item.status) + '</td><td>' + status(item.level) + '</td><td><button class="link-button danger-link" data-remove-report-activity="' + esc(item.id) + '" type="button">移除</button></td></tr>';
    }).join('') + '</tbody></table></div>' : '<div class="selector-empty"><strong>暂无已选活动</strong><span>请切换到“可选活动”页签进行选择</span></div>';
    var body = '<div class="selector-tabs"><button class="' + (reportActivityFilter.tab === 'available' ? 'active' : '') + '" data-report-activity-tab="available" type="button">可选活动</button><button class="' + (reportActivityFilter.tab === 'selected' ? 'active' : '') + '" data-report-activity-tab="selected" type="button">已选活动（' + selectedRows.length + '/20）</button></div>' +
      '<div class="selector-tip"><strong>选择说明：</strong>一次最多选择20个活动；多个活动之间按“或”查询，未选择代表全部活动。</div>' +
      (reportActivityFilter.tab === 'available' ? availableTable : selectedTable);
    var foot = '<span class="selector-selection-count">已选 <strong>' + selectedRows.length + '</strong> / 20</span><div><button class="button" data-clear-report-activity-draft type="button"' + (selectedRows.length ? '' : ' disabled') + '>清空已选</button><button class="button" data-close-modal type="button">取消</button><button class="button primary" data-confirm-report-activity type="button">确认</button></div>';
    window.SACommon.openModal('选择查询活动', body, foot, 'wide-modal placement-selector-modal report-activity-selector-modal');
  }

  function openReportActivitySelector() {
    reportActivityFilter.draftIds = reportActivityFilter.selectedIds.slice();
    reportActivityFilter.tab = 'available';
    reportActivityFilter.queryId = '';
    reportActivityFilter.queryName = '';
    reportActivityFilter.queryType = '';
    reportActivityFilter.queryStatus = '';
    reportActivityFilter.page = 1;
    renderReportActivitySelector();
  }

  function renderKpis(items) {
    return '<div class="kpi-grid">' + items.map(function (item) {
      return '<div class="kpi-card" data-kpi-target="' + item.target + '"><span class="label">' + esc(item.label) + '</span><strong>' + esc(item.value) + '</strong><small>' + esc(item.note) + '</small></div>';
    }).join('') + '</div>';
  }

  function renderTrend(items) {
    var max = Math.max.apply(null, items.map(function (item) { return item.scan; }));
    return '<div class="panel"><div class="panel-head"><div class="panel-title">近7日转化趋势 <span class="panel-subtitle">扫码UV / 活动参与数</span></div><div class="legend"><span><i></i>扫码UV</span><span><i class="primary"></i>活动参与</span></div></div>' +
      '<div class="panel-body"><div class="trend-chart">' + items.map(function (item) {
        var scanHeight = Math.round(item.scan / max * 120);
        var parHeight = Math.round(item.participation / max * 120);
        return '<div class="trend-column" title="扫码UV ' + item.scan + '，参与 ' + item.participation + '"><div class="trend-bars"><div class="trend-bar" style="height:' + scanHeight + 'px"></div><div class="trend-bar primary" style="height:' + parHeight + 'px"></div></div><span>' + item.day + '</span></div>';
      }).join('') + '</div></div></div>';
  }

  function renderRanks(title, items) {
    var max = Math.max.apply(null, items.map(function (item) { return item.value; }));
    return '<div class="panel"><div class="panel-head"><div class="panel-title">' + esc(title) + '</div></div><div class="panel-body"><ol class="rank-list">' + items.map(function (item, index) {
      return '<li class="rank-item"><span class="rank-no">' + (index + 1) + '</span><span class="rank-name">' + esc(item.name) + '</span><span class="rank-track"><span class="rank-fill" style="display:block;width:' + Math.round(item.value / max * 100) + '%"></span></span><span class="rank-value">' + item.value + '</span></li>';
    }).join('') + '</ol></div></div>';
  }

  function resultStatus(value) {
    return status(value);
  }

  function reportActivityMatches(id) {
    return !reportActivityFilter.selectedIds.length || reportActivityFilter.selectedIds.indexOf(id) > -1;
  }

  function emptyReportRow(colspan) {
    return '<tr><td colspan="' + colspan + '"><div class="empty-state report-filter-empty">当前所选活动暂无演示记录，请调整活动范围后查询。</div></td></tr>';
  }

  function renderActivityOverview() {
    var fields = [
      {label:'统计时间',type:'text',value:'2026-07-11 至 2026-07-17'},
      {label:'品牌',type:'select',options:data.meta.brands},
      {label:'区域',type:'select',options:data.meta.regions},
      {label:'来源门店',type:'select',options:data.meta.stores},
      {label:'来源SA',type:'select',options:data.meta.sas},
      {label:'活动',type:'activity-multi'},
      {label:'参与级别',type:'select',options:['号码级','绑车级','认证级']},
      {label:'执行方式',type:'select',options:['直接领券','自动抽奖']}
    ];
    var rows = data.activityOverview.rows.filter(function (row) { return reportActivityMatches(row.activityId); });
    return renderFilters(fields) + renderKpis(data.activityOverview.kpis) +
      '<div class="overview-grid">' + renderTrend(data.activityOverview.trend) + renderRanks('来源SA活动参与排行', data.activityOverview.ranks) + '</div>' +
      '<div class="panel"><div class="panel-head"><div class="panel-title">来源SA活动汇总 <span class="panel-subtitle">当前显示 ' + rows.length + ' 条演示记录，按来源SA + 活动汇总</span></div><div class="toolbar"><button class="button" data-export type="button">导出</button></div></div>' +
      '<div class="table-shell"><table class="data-table"><thead><tr><th>来源SA</th><th>来源门店</th><th>活动ID / 活动名称</th><th>参与级别</th><th>执行方式</th><th>扫码UV</th><th>符合准入主体</th><th>活动参与数</th><th>发券数</th><th>转化率</th><th>最后参与时间</th><th>操作</th></tr></thead><tbody>' +
      (rows.length ? rows.map(function (row) { return '<tr data-report-activity-id="' + esc(row.activityId) + '"><td>' + esc(row.saName) + '<br><span class="panel-subtitle">' + esc(row.saId) + '</span></td><td>' + esc(row.store) + '</td><td class="wrap">' + esc(row.activityId) + '<br>' + esc(row.activity) + '</td><td>' + status(row.level) + '</td><td>' + esc(row.type) + '</td><td class="number">' + row.scanUv + '</td><td class="number">' + row.eligible + '</td><td class="number"><a class="link-action" href="#activity-participation">' + row.participation + '</a></td><td class="number">' + row.coupons + '</td><td>' + row.rate + '</td><td>' + row.last + '</td><td><a class="link-action" href="#activity-participation">查看明细</a></td></tr>'; }).join('') : emptyReportRow(12)) +
      '</tbody></table></div>' + window.SACommon.pagination(reportActivityFilter.selectedIds.length ? rows.length : 25) + '</div>';
  }

  function qrFields() {
    return [
      {label:'生成时间',type:'text',value:'2026-07-11 至 2026-07-17'},
      {label:'sceneId',placeholder:'请输入场景ID'},
      {label:'二维码状态',type:'select',options:['有效','已过期','重新生成失效']},
      {label:'来源SA',type:'select',options:data.meta.sas},
      {label:'来源门店',type:'select',options:data.meta.stores},
      {label:'活动范围',type:'select',options:['全部活动','部分活动']},
      {label:'活动ID',placeholder:'请输入活动ID'},
      {label:'品牌',type:'select',options:data.meta.brands}
    ];
  }

  function renderQrRows() {
    return data.qrRows.map(function (row) {
      return '<tr><td><a class="link-action" data-view-qr="' + esc(row.sceneId) + '">' + esc(row.sceneId) + '</a></td><td>' + esc(row.saName) + '<br><span class="panel-subtitle">' + esc(row.saId) + '</span></td><td>' + esc(row.store) + '</td><td>' + esc(row.scope) + '</td><td>' + row.count + ' / ' + esc(row.version) + '</td><td>' + row.generated + '</td><td>' + row.expires + '</td><td>' + status(row.status) + '</td><td>' + row.scanPv + ' / ' + row.scanUv + '</td><td>' + row.identified + '</td><td>' + row.participation + '</td><td>' + row.coupons + '</td><td><a class="link-action" data-view-qr="' + esc(row.sceneId) + '">查看</a></td></tr>';
    }).join('');
  }

  function renderQrPage() {
    return renderFilters(qrFields()) + '<div class="panel"><div class="panel-head"><div class="panel-title">二维码场景列表 <span class="panel-subtitle">活动范围在生成时冻结</span></div><div class="toolbar"><button class="button" data-export type="button">导出</button></div></div>' +
      '<div class="table-shell"><table class="data-table"><thead><tr><th>sceneId</th><th>来源SA</th><th>来源门店</th><th>活动范围</th><th>冻结活动数/版本</th><th>生成时间</th><th>失效时间</th><th>状态</th><th>扫码PV/UV</th><th>识别人数</th><th>参与数</th><th>发券数</th><th>操作</th></tr></thead><tbody>' + renderQrRows() + '</tbody></table></div>' + window.SACommon.pagination(128) + '</div>';
  }

  function participationFields() {
    return [
      {label:'参与时间',type:'text',value:'2026-07-11 至 2026-07-17'},
      {label:'活动',type:'activity-multi'},
      {label:'来源SA',type:'select',options:data.meta.sas},
      {label:'来源门店',type:'select',options:data.meta.stores},
      {label:'参与级别',type:'select',options:['号码级','绑车级','认证级']},
      {label:'执行方式',type:'select',options:['直接领券','自动抽奖']},
      {label:'手机号码',placeholder:'请输入脱敏手机号'},
      {label:'VIN',placeholder:'请输入VIN后四位'},
      {label:'sceneId',placeholder:'请输入场景ID'},
      {label:'参与结果',type:'select',options:['领取成功','中奖','未中奖']}
    ];
  }

  function renderParticipationRows() {
    var rows = data.participationRows.filter(function (row) { return reportActivityMatches(row.activityId); });
    if (!rows.length) return emptyReportRow(14);
    return rows.map(function (row) {
      return '<tr data-report-activity-id="' + esc(row.activityId) + '"><td><a class="link-action" data-view-participation="' + row.id + '">' + row.id + '</a></td><td class="wrap">' + row.activityId + '<br>' + esc(row.activity) + '</td><td>' + status(row.level) + '</td><td>' + esc(row.type) + '</td><td>' + row.mobile + '<br><span class="panel-subtitle">' + row.oneId + '</span></td><td>' + row.vin + '</td><td>' + esc(row.subject) + '</td><td>' + esc(row.sa) + '<br><span class="panel-subtitle">' + esc(row.store) + '</span></td><td>' + row.sceneId + '</td><td>' + row.participated + '</td><td>' + row.confirmed + '</td><td>' + resultStatus(row.result) + '</td><td>' + row.couponCount + '</td><td><a class="link-action" data-view-participation="' + row.id + '">查看</a></td></tr>';
    }).join('');
  }

  function renderParticipationPage() {
    var count = data.participationRows.filter(function (row) { return reportActivityMatches(row.activityId); }).length;
    return renderFilters(participationFields()) + '<div class="panel"><div class="panel-head"><div class="panel-title">活动参与记录 <span class="panel-subtitle">当前显示 ' + count + ' 条演示记录；一条记录对应一个活动参与主体</span></div><div class="toolbar"><button class="button" data-export type="button">导出</button></div></div>' +
      '<div class="table-shell"><table class="data-table"><thead><tr><th>参与流水</th><th>活动ID / 名称</th><th>级别</th><th>执行方式</th><th>手机号 / oneID</th><th>执行VIN</th><th>参与主体</th><th>来源SA / 门店</th><th>sceneId</th><th>参与时间</th><th>来源确认时间</th><th>结果</th><th>发券数</th><th>操作</th></tr></thead><tbody>' + renderParticipationRows() + '</tbody></table></div>' + window.SACommon.pagination(reportActivityFilter.selectedIds.length ? count : 1126) + '</div>';
  }

  function couponOverviewFields() {
    return [
      {label:'统计时间',type:'text',value:'2026-07-11 至 2026-07-17'},
      {label:'品牌',type:'select',options:data.meta.brands},
      {label:'区域',type:'select',options:data.meta.regions},
      {label:'来源门店',type:'select',options:data.meta.stores},
      {label:'来源SA',type:'select',options:data.meta.sas},
      {label:'活动',type:'select',options:data.meta.activities},
      {label:'卡券模板',type:'select',options:data.meta.coupons},
      {label:'发券方式',type:'select',options:['直接领券','抽奖中奖']}
    ];
  }

  function renderFunnel(items) {
    var max = Math.max.apply(null, items.map(function (item) { return item.value; }));
    return '<div class="panel"><div class="panel-head"><div class="panel-title">卡券转化漏斗 <span class="panel-subtitle">按SA来源券实例统计</span></div></div><div class="panel-body"><div class="funnel-list">' + items.map(function (item, index) {
      var percent = Math.round(item.value / max * 100);
      var previous = index ? items[index - 1].value : max;
      var stepRate = index ? (item.value / previous * 100).toFixed(1) + '%' : '100%';
      return '<div class="funnel-row"><span class="funnel-label">' + esc(item.label) + '</span><span class="funnel-track"><span class="funnel-fill" style="width:' + percent + '%"></span></span><strong>' + item.value.toLocaleString() + '</strong><small>' + stepRate + '</small></div>';
    }).join('') + '</div></div></div>';
  }

  function renderCouponOverviewRows() {
    return data.couponOverview.rows.map(function (row) {
      return '<tr><td>' + esc(row.sa) + '</td><td>' + esc(row.store) + '</td><td class="wrap">' + esc(row.couponId) + '<br>' + esc(row.coupon) + '</td><td>' + esc(row.activity) + '</td><td>' + esc(row.mode) + '</td><td class="number"><a class="link-action" href="#coupon-claim">' + row.issued + '</a></td><td class="number">' + row.active + '</td><td class="number"><a class="link-action" href="#coupon-redeem">' + row.redeemed + '</a></td><td class="number">' + row.expired + '</td><td>' + row.redemptionRate + '</td><td class="number">' + row.cross + '</td><td>' + row.last + '</td><td><a class="link-action" href="#coupon-claim">查看明细</a></td></tr>';
    }).join('');
  }

  function renderCouponOverview() {
    return renderFilters(couponOverviewFields()) + renderKpis(data.couponOverview.kpis) +
      '<div class="overview-grid">' + renderFunnel(data.couponOverview.funnel) + renderRanks('来源SA卡券核销排行', data.couponOverview.ranks) + '</div>' +
      '<div class="panel"><div class="panel-head"><div class="panel-title">来源SA卡券汇总 <span class="panel-subtitle">默认按来源SA + 卡券模板汇总</span></div><div class="toolbar"><button class="button" data-export type="button">导出</button></div></div>' +
      '<div class="table-shell"><table class="data-table"><thead><tr><th>来源SA</th><th>来源门店</th><th>卡券模板ID / 名称</th><th>来源活动</th><th>发券方式</th><th>发放数</th><th>激活数</th><th>核销数</th><th>过期数</th><th>核销率</th><th>跨店核销数</th><th>最后发放时间</th><th>操作</th></tr></thead><tbody>' + renderCouponOverviewRows() + '</tbody></table></div>' + window.SACommon.pagination(1986) + '</div>';
  }

  function claimFields() {
    return [
      {label:'领取时间',type:'text',value:'2026-07-11 至 2026-07-17'},
      {label:'券实例ID',placeholder:'请输入券实例ID'},
      {label:'卡券模板',type:'select',options:data.meta.coupons},
      {label:'来源活动',type:'select',options:data.meta.activities},
      {label:'来源SA',type:'select',options:data.meta.sas},
      {label:'来源门店',type:'select',options:data.meta.stores},
      {label:'券状态',type:'select',options:['未激活','已激活','已核销','已过期']},
      {label:'归属主体',type:'select',options:['oneID','VIN','认证关系']},
      {label:'手机号码',placeholder:'请输入脱敏手机号'},
      {label:'VIN',placeholder:'请输入VIN后四位'},
      {label:'sceneId',placeholder:'请输入场景ID'},
      {label:'参与流水',placeholder:'请输入参与流水'}
    ];
  }

  function renderClaimRows() {
    return data.claimRows.map(function (row) {
      return '<tr><td><a class="link-action" data-view-claim="' + row.id + '">' + row.id + '</a></td><td class="wrap">' + row.templateId + '<br>' + esc(row.coupon) + '</td><td class="wrap">' + row.activityId + '<br>' + esc(row.activity) + '</td><td>' + esc(row.mode) + '</td><td>' + row.mobile + '<br><span class="panel-subtitle">' + row.oneId + '</span></td><td>' + status(row.owner) + '</td><td>' + row.vin + '</td><td>' + row.boundCount + '</td><td>' + esc(row.sa) + '<br><span class="panel-subtitle">' + esc(row.store) + '</span></td><td>' + row.sceneId + '</td><td>' + row.claimed + '</td><td>' + row.confirmed + '</td><td>' + status(row.status) + '</td><td><a class="link-action" data-view-claim="' + row.id + '">查看</a></td></tr>';
    }).join('');
  }

  function renderClaimPage() {
    return renderFilters(claimFields()) + '<div class="panel"><div class="panel-head"><div class="panel-title">卡券领取记录 <span class="panel-subtitle">仅展示来源渠道为SA动态二维码的券实例</span></div><div class="toolbar"><button class="button" data-export type="button">导出</button></div></div>' +
      '<div class="table-shell"><table class="data-table"><thead><tr><th>券实例ID</th><th>模板ID / 卡券名称</th><th>活动ID / 活动名称</th><th>发券方式</th><th>手机号 / oneID</th><th>券归属主体</th><th>归属VIN</th><th>可绑定oneID数</th><th>来源SA / 门店</th><th>sceneId</th><th>领取时间</th><th>来源确认时间</th><th>券状态</th><th>操作</th></tr></thead><tbody>' + renderClaimRows() + '</tbody></table></div>' + window.SACommon.pagination(1986) + '</div>';
  }

  function redemptionFields() {
    return [
      {label:'核销时间',type:'text',value:'2026-07-11 至 2026-07-17'},
      {label:'核销流水',placeholder:'请输入核销流水'},
      {label:'券实例ID',placeholder:'请输入券实例ID'},
      {label:'卡券名称',type:'select',options:data.meta.coupons},
      {label:'来源SA',type:'select',options:data.meta.sas},
      {label:'来源门店',type:'select',options:data.meta.stores},
      {label:'核销门店',type:'select',options:data.meta.stores},
      {label:'是否跨店',type:'select',options:['是','否']},
      {label:'手机号码',placeholder:'请输入脱敏手机号'},
      {label:'核销状态',type:'select',options:['核销成功','已撤销']}
    ];
  }

  function renderRedemptionRows() {
    return data.redemptionRows.map(function (row) {
      return '<tr><td><a class="link-action" data-view-redemption="' + row.id + '">' + row.id + '</a></td><td>' + row.couponId + '<br><span class="panel-subtitle">' + esc(row.coupon) + '</span></td><td>' + esc(row.activity) + '</td><td>' + esc(row.sa) + '</td><td>' + esc(row.sourceStore) + '</td><td>' + esc(row.owner) + '<br><span class="panel-subtitle">' + row.actualUser + '</span></td><td>' + esc(row.redeemStore) + '</td><td>' + status(row.cross) + '</td><td>' + row.order + '</td><td>' + row.redeemed + '</td><td>' + row.amount + '</td><td>' + row.subsidy + '</td><td>' + status(row.status) + '</td><td><a class="link-action" data-view-redemption="' + row.id + '">查看</a></td></tr>';
    }).join('');
  }

  function renderRedemptionPage() {
    return renderFilters(redemptionFields()) + '<div class="panel"><div class="panel-head"><div class="panel-title">卡券核销记录 <span class="panel-subtitle">同时保留来源门店和实际核销门店</span></div><div class="toolbar"><button class="button" data-export type="button">导出</button></div></div>' +
      '<div class="table-shell"><table class="data-table"><thead><tr><th>核销流水</th><th>券实例ID / 名称</th><th>来源活动</th><th>来源SA</th><th>来源门店</th><th>归属主体 / 实际核销用户</th><th>实际核销门店</th><th>跨店核销</th><th>业务单号</th><th>核销时间</th><th>订单金额</th><th>补贴金额</th><th>状态</th><th>操作</th></tr></thead><tbody>' + renderRedemptionRows() + '</tbody></table></div>' + window.SACommon.pagination(682) + '</div>';
  }

  function renderContent(current) {
    if (window.ActivityConfigPages && window.ActivityConfigPages.isPage(page)) return window.ActivityConfigPages.render(page);
    if (page === 'activity-overview') return renderActivityOverview();
    if (page === 'activity-qr') return renderQrPage();
    if (page === 'activity-participation') return renderParticipationPage();
    if (page === 'coupon-overview') return renderCouponOverview();
    if (page === 'coupon-claim') return renderClaimPage();
    if (page === 'coupon-redeem') return renderRedemptionPage();
    return renderPlaceholder(current);
  }

  function render() {
    var app = document.getElementById('app');
    var current = pageMap[page] || pageMap['activity-overview'];
    if (!app) return;
    var originalActivityPage = window.ActivityConfigPages && window.ActivityConfigPages.isPage(page);
    var pageActions = originalActivityPage ? window.ActivityConfigPages.pageActions(page) : '<button class="button" data-export type="button">导出</button>';
    var infoStrip = originalActivityPage ? window.ActivityConfigPages.infoStrip(page) : '数据范围：总部 / 东风日产 / 全部授权区域 <span class="permission-note">演示数据均已脱敏</span>';
    app.innerHTML = '<div class="workspace">' +
      '<div class="crumb-bar"><span>工作台</span><span class="crumb-sep">›</span><span>' + current.center + '</span><span class="crumb-sep">›</span><span>' + current.menu + '</span></div>' +
      centerTabs(current) +
      '<div class="content-wrap">' +
        '<div class="page-heading"><div><h1>' + current.title + '</h1><p>' + current.desc + '</p></div><div class="page-actions">' + pageActions + '</div></div>' +
        '<div class="info-strip">' + infoStrip + '</div>' +
        reportTabs(page) + renderContent(current) +
      '</div></div>';
    document.dispatchEvent(new CustomEvent('sa-page-rendered', {detail:{page:page}}));
  }

  function navigate() {
    var next = location.hash.replace(/^#/, '') || 'activity-overview';
    if (!pageMap[next]) next = 'activity-overview';
    window.SACommon.closeModal();
    window.SACommon.closeDrawers();
    page = next;
    if (window.ActivityConfigPages) window.ActivityConfigPages.onNavigate(page);
    render();
    if (window.SANav) window.SANav.setActive(page);
    if (pendingOpen) {
      var request = pendingOpen;
      pendingOpen = null;
      setTimeout(function () {
        if (request.type === 'claim') openClaim(request.id);
        if (request.type === 'participation') openParticipation(request.id);
      }, 0);
    }
  }

  window.getCurrentPage = function () { return page; };
  window.SAApp = { navigate:navigate, render:render, pages:pageMap };

  document.addEventListener('click', function (event) {
    var reportTarget;
    if (window.ActivityConfigPages) window.ActivityConfigPages.handleClick(event);
    if (event.target.closest('#globalSpecButton')) location.href = 'docs/interaction.html';
    if (event.target.closest('[data-open-report-activity-selector]')) { openReportActivitySelector(); return; }
    if ((reportTarget = event.target.closest('[data-report-activity-tab]'))) {
      reportActivityFilter.tab = reportTarget.getAttribute('data-report-activity-tab');
      renderReportActivitySelector(); return;
    }
    if (event.target.closest('[data-report-activity-search]')) {
      reportActivityFilter.queryId = document.querySelector('[data-report-activity-query-id]').value;
      reportActivityFilter.queryName = document.querySelector('[data-report-activity-query-name]').value;
      reportActivityFilter.queryType = document.querySelector('[data-report-activity-query-type]').value;
      reportActivityFilter.queryStatus = document.querySelector('[data-report-activity-query-status]').value;
      reportActivityFilter.page = 1;
      renderReportActivitySelector(); return;
    }
    if ((reportTarget = event.target.closest('[data-report-activity-page]'))) {
      if (!reportTarget.disabled) reportActivityFilter.page = Number(reportTarget.getAttribute('data-report-activity-page'));
      renderReportActivitySelector(); return;
    }
    if ((reportTarget = event.target.closest('[data-remove-report-activity]'))) {
      reportActivityFilter.draftIds = reportActivityFilter.draftIds.filter(function (id) { return id !== reportTarget.getAttribute('data-remove-report-activity'); });
      renderReportActivitySelector(); return;
    }
    if (event.target.closest('[data-clear-report-activity-draft]')) {
      reportActivityFilter.draftIds = [];
      renderReportActivitySelector(); return;
    }
    if (event.target.closest('[data-confirm-report-activity]')) {
      reportActivityFilter.selectedIds = reportActivityFilter.draftIds.slice();
      window.SACommon.closeModal();
      render();
      window.SACommon.showToast(reportActivityFilter.selectedIds.length ? '已选择' + reportActivityFilter.selectedIds.length + '个活动，可继续组合其他条件查询' : '已恢复查询全部活动');
      return;
    }
    if (event.target.closest('[data-clear-report-activity]')) {
      reportActivityFilter.selectedIds = [];
      reportActivityFilter.draftIds = [];
      render();
      window.SACommon.showToast('已清除活动条件，当前查询全部活动');
      return;
    }
    var isActivityReport = page === 'activity-overview' || page === 'activity-participation';
    if (event.target.closest('[data-export]')) {
      window.SACommon.showToast(isActivityReport
        ? '原型演示：已按当前条件导出' + (reportActivityFilter.selectedIds.length ? reportActivityFilter.selectedIds.length + '个活动' : '全部活动') + '数据'
        : '原型演示：已按当前条件导出数据');
    }
    if (event.target.closest('[data-query]')) {
      window.SACommon.showToast(isActivityReport ? '查询完成，当前活动范围：' + reportActivityLabel() : '查询完成');
    }
    if (event.target.closest('[data-reset]')) {
      if (page === 'activity-overview' || page === 'activity-participation') {
        reportActivityFilter.selectedIds = [];
        reportActivityFilter.draftIds = [];
        render();
      }
      document.querySelectorAll('.filter-panel input').forEach(function (input) { input.value = input.type === 'text' && input.defaultValue ? input.defaultValue : ''; });
      document.querySelectorAll('.filter-panel select').forEach(function (select) { select.selectedIndex = 0; });
      window.SACommon.showToast('筛选条件已重置');
    }
    if (event.target.closest('[data-filter-toggle]')) { filtersExpanded = !filtersExpanded; render(); }
    var kpi = event.target.closest('[data-kpi-target]');
    if (kpi) location.hash = kpi.getAttribute('data-kpi-target');
    var qrLink = event.target.closest('[data-view-qr]');
    if (qrLink) openQr(qrLink.getAttribute('data-view-qr'));
    var participationLink = event.target.closest('[data-view-participation]');
    if (participationLink) openParticipation(participationLink.getAttribute('data-view-participation'));
    var claimLink = event.target.closest('[data-view-claim]');
    if (claimLink) openClaim(claimLink.getAttribute('data-view-claim'));
    var redemptionLink = event.target.closest('[data-view-redemption]');
    if (redemptionLink) openRedemption(redemptionLink.getAttribute('data-view-redemption'));
    var couponCross = event.target.closest('[data-cross-coupon]');
    if (couponCross) {
      window.SACommon.closeDrawers();
      pendingOpen = {type:'claim',id:couponCross.getAttribute('data-cross-coupon')};
      if (page === 'coupon-claim') navigate(); else location.hash = 'coupon-claim';
    }
    var participationCross = event.target.closest('[data-cross-participation]');
    if (participationCross) {
      window.SACommon.closeDrawers();
      pendingOpen = {type:'participation',id:participationCross.getAttribute('data-cross-participation')};
      if (page === 'activity-participation') navigate(); else location.hash = 'activity-participation';
    }
    if (event.target.closest('.page-no') && !event.target.closest('[data-report-activity-page]')) window.SACommon.showToast('已切换到对应演示分页');
  });

  document.addEventListener('change', function (event) {
    if (window.ActivityConfigPages) window.ActivityConfigPages.handleChange(event);
    if (event.target.matches('[data-report-activity-choice]')) {
      var choiceId = event.target.value;
      var choiceIndex = reportActivityFilter.draftIds.indexOf(choiceId);
      if (event.target.checked && choiceIndex === -1) {
        if (reportActivityFilter.draftIds.length >= reportActivityFilter.limit) {
          event.target.checked = false;
          window.SACommon.showToast('最多选择20个活动，请先移除已选活动');
          return;
        }
        reportActivityFilter.draftIds.push(choiceId);
      }
      if (!event.target.checked && choiceIndex > -1) reportActivityFilter.draftIds.splice(choiceIndex,1);
      renderReportActivitySelector();
    }
  });

  function openQr(sceneId) {
    var row = data.qrRows.find(function (item) { return item.sceneId === sceneId; });
    if (!row) return;
    var grid = window.SACommon.detailGrid([
      ['sceneId',row.sceneId],['二维码状态',status(row.status),true],['来源SA',row.saName + ' ' + row.saId],['来源门店',row.store],
      ['活动范围',row.scope],['活动快照',row.count + '个活动 / ' + row.version],['生成时间',row.generated],['失效时间',row.expires],
      ['前序sceneId',row.previous],['后继sceneId',row.next],['扫码PV / UV',row.scanPv + ' / ' + row.scanUv],['活动参与数',String(row.participation)]
    ]);
    var snapshot = '<div class="table-shell"><table class="data-table" style="min-width:680px"><thead><tr><th>活动ID</th><th>活动名称</th><th>级别</th><th>执行方式</th></tr></thead><tbody>' +
      data.activityOverview.rows.slice(0,row.count > 4 ? 4 : row.count).map(function (item) { return '<tr><td>' + item.activityId + '</td><td>' + esc(item.activity) + '</td><td>' + item.level + '</td><td>' + item.type + '</td></tr>'; }).join('') + '</tbody></table></div>';
    window.SACommon.openDrawer('二维码详情', window.SACommon.detailSection('基本信息',grid) + window.SACommon.detailSection('活动冻结快照',snapshot));
  }

  function openParticipation(id) {
    var row = data.participationRows.find(function (item) { return item.id === id; });
    if (!row) return;
    var basic = window.SACommon.detailGrid([
      ['参与流水',row.id],['活动',row.activityId + ' / ' + row.activity],['活动级别',status(row.level),true],['执行方式',row.type],
      ['手机号',row.mobile],['oneID',row.oneId],['执行VIN',row.vin],['参与主体',row.subject],['参与结果',status(row.result),true],['发券数',String(row.couponCount)]
    ]);
    var source = window.SACommon.detailGrid([
      ['来源SA',row.sa],['来源门店',row.store],['来源渠道','SA动态二维码'],['sceneId',row.sceneId],['scanId',row.scanId],['来源确认时间',row.confirmed]
    ]);
    var validation = '<div class="timeline">' + row.validation.map(function (item) { return '<div class="timeline-item"><strong>' + esc(item) + '</strong><span>' + row.participated + '</span></div>'; }).join('') + '</div>';
    var coupons = row.coupons.length ? row.coupons.map(function (coupon) { return '<a class="link-action" data-cross-coupon="' + coupon + '">' + coupon + '</a>'; }).join('<br>') : '<span class="panel-subtitle">未中奖，本活动已参与且来源已确认</span>';
    window.SACommon.openDrawer('活动参与详情', window.SACommon.detailSection('参与信息',basic) + window.SACommon.detailSection('来源信息',source) + window.SACommon.detailSection('准入校验节点',validation) + window.SACommon.detailSection('关联卡券',coupons));
  }

  function openClaim(id) {
    var row = data.claimRows.find(function (item) { return item.id === id; });
    if (!row) return;
    var coupon = window.SACommon.detailGrid([
      ['券实例ID',row.id],['券状态',status(row.status),true],['模板ID',row.templateId],['卡券名称',row.coupon],
      ['来源活动',row.activityId + ' / ' + row.activity],['发券方式',row.mode],['领取时间',row.claimed],['来源确认时间',row.confirmed]
    ]);
    var owner = window.SACommon.detailGrid([
      ['手机号',row.mobile],['oneID',row.oneId],['券归属主体',status(row.owner),true],['归属VIN',row.vin],['当前VIN可绑定oneID数',String(row.boundCount)]
    ]);
    var source = window.SACommon.detailGrid([
      ['来源渠道','SA动态二维码'],['来源SA',row.sa],['来源门店',row.store],['sceneId',row.sceneId],['scanId',row.scanId],['活动参与流水','<a class="link-action" data-cross-participation="' + row.participationId + '">' + row.participationId + '</a>',true]
    ]);
    window.SACommon.openDrawer('卡券领取详情', window.SACommon.detailSection('卡券信息',coupon) + window.SACommon.detailSection('归属信息',owner) + window.SACommon.detailSection('来源链路',source));
  }

  function openRedemption(id) {
    var row = data.redemptionRows.find(function (item) { return item.id === id; });
    if (!row) return;
    var basic = window.SACommon.detailGrid([
      ['核销流水',row.id],['核销状态',status(row.status),true],['券实例ID',row.couponId],['卡券名称',row.coupon],
      ['来源活动',row.activity],['归属主体',row.owner],['实际核销用户',row.actualUser],['业务单号',row.order]
    ]);
    var stores = window.SACommon.detailGrid([
      ['来源SA',row.sa],['来源门店',row.sourceStore],['实际核销门店',row.redeemStore],['跨店核销',status(row.cross),true]
    ]);
    var amount = window.SACommon.detailGrid([
      ['核销时间',row.redeemed],['订单金额',row.amount],['补贴金额',row.subsidy]
    ]);
    window.SACommon.openDrawer('卡券核销详情', window.SACommon.detailSection('核销信息',basic) + window.SACommon.detailSection('门店归属',stores) + window.SACommon.detailSection('金额信息',amount));
  }

  window.addEventListener('hashchange', navigate);
})();
