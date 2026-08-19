(function () {
  'use strict';

  var common = window.SACommon;
  var data = window.SAReportData;
  var esc = common.escapeHtml;
  var status = common.status;
  var checkpointOptions = ['进入活动','领券前','抽奖前','触发发券前'];
  var state = {
    mode: 'create',
    step: 1,
    selectedId: 'ACT-SA-20260701',
    placementId: 'SA-PUT-20260702',
    placementMode: 'create',
    placementForm: null,
    placementCandidateId: null,
    placementSelectorTab: 'available',
    form: null,
    pendingId: null,
    accessDraft: null
  };

  var pages = {
    'activity-manage': {center:'活动中心', menu:'保客活动创建', title:'保客活动创建', desc:'创建和维护原有保客活动；SA投放资格在独立菜单配置。'},
    'activity-create': {center:'活动中心', menu:'保客活动创建', title:'保客活动新增 / 编辑', desc:'沿用原有四步配置流程，不在活动主数据内配置SA投放。'},
    'activity-detail': {center:'活动中心', menu:'保客活动创建', title:'保客活动详情', desc:'查看活动配置、准入配置、奖品和互斥关系快照。'},
    'activity-mutex': {center:'活动中心', menu:'保客活动互斥关系', title:'保客活动互斥关系', desc:'复用原活动互斥能力，查看参与主体口径及生效状态。'},
    'sa-placement-manage': {center:'活动中心', menu:'SA活动配置', title:'SA活动配置', desc:'独立维护普通活动和组合活动是否进入SA可选池。'},
    'sa-placement-edit': {center:'活动中心', menu:'SA活动配置', title:'新增 / 编辑SA活动配置', desc:'选择普通活动或组合活动；门店与SA范围读取投放对象配置。'},
    'sa-placement-detail': {center:'活动中心', menu:'SA活动配置', title:'SA活动配置详情', desc:'查看投放对象、来源配置和原活动快照。'},
    'sa-qr-settings': {center:'活动中心', menu:'SA活动配置', title:'二维码参数配置', desc:'配置SA生成二维码时可选择的有效时长及默认值。'}
  };

  function findActivity(id) {
    return data.activityConfigs.find(function (item) { return item.id === id; });
  }

  function accessSubject(level) {
    return level === '认证级' ? '认证关系' : level === '绑车级' ? 'VIN' : 'oneID';
  }

  function defaultCheckpoints(activityType) {
    return activityType === '抽奖' ? ['进入活动','抽奖前'] : ['进入活动','领券前'];
  }

  function freshForm() {
    return {
      id: '系统生成', name: '', brand: '东风日产', business: '维保活动', activityType: '领券',
      trigger: 'C端主动领取', claimMode: '一键领取', level: '绑车级', status: '草稿',
      time: '2026-08-01 至 2026-09-30', storeScope: '华南一区授权专营店',
      couponIds: ['TPL-CP-10021'], coupons: ['基础保养抵扣券'], rights: ['免费车辆检测'],
      mutexIds: [], mutexSubject: 'VIN', accessEnabled: '启用', checkpoints: defaultCheckpoints('领券'), shareTitle: ''
    };
  }

  function copyForm(source, mode) {
    var form = JSON.parse(JSON.stringify(source || freshForm()));
    form.accessEnabled = form.accessEnabled || '启用';
    form.checkpoints = form.checkpoints || defaultCheckpoints(form.activityType);
    form.mutexSubject = accessSubject(form.level);
    if (mode === 'copy') {
      form.id = '系统生成';
      form.name = source.name + '-副本';
      form.status = '草稿';
    }
    return form;
  }

  function prepare(mode, id) {
    state.mode = mode;
    state.step = 1;
    state.selectedId = id || state.selectedId;
    if (mode === 'create') state.form = freshForm();
    else state.form = copyForm(findActivity(id), mode);
  }

  function options(items, current) {
    return items.map(function (item) {
      return '<option value="' + esc(item) + '"' + (item === current ? ' selected' : '') + '>' + esc(item) + '</option>';
    }).join('');
  }

  function activityFilters() {
    return '<div class="filter-panel"><div class="filter-grid">' +
      '<div class="filter-field"><label>活动ID：</label><input placeholder="请输入活动ID"></div>' +
      '<div class="filter-field"><label>活动名称：</label><input placeholder="请输入活动名称"></div>' +
      '<div class="filter-field"><label>活动状态：</label><select><option>全部</option><option>草稿</option><option>未启用</option><option>已启用</option><option>已关闭</option></select></div>' +
      '<div class="filter-field"><label>触发方式：</label><select><option>全部</option><option>C端主动参与</option><option>C端主动领取</option><option>后台统一推送</option></select></div>' +
      '<div class="filter-field"><label>准入级别：</label><select><option>全部</option><option>号码级</option><option>绑车级</option><option>认证级</option></select></div>' +
      '<div class="filter-field"><label>品牌：</label><select><option>东风日产</option><option>启辰</option></select></div>' +
      '<div class="filter-field"><label>活动时间：</label><input value="2026-07-01 至 2026-09-30"></div>' +
      '</div><div class="filter-actions"><button class="button" data-reset type="button">重置</button><button class="button primary" data-query type="button">查询</button></div></div>';
  }

  function operationLinks(row) {
    var action = row.status === '已启用'
      ? '<a class="link-action danger-link" data-activity-action="close" data-id="' + row.id + '">关闭</a>'
      : (row.status === '已关闭' ? '' : '<a class="link-action" data-activity-action="enable" data-id="' + row.id + '">启用</a>');
    return '<a class="link-action" data-activity-action="view" data-id="' + row.id + '">查看</a>' +
      '<a class="link-action" data-activity-action="edit" data-id="' + row.id + '">编辑</a>' +
      '<a class="link-action" data-activity-action="copy" data-id="' + row.id + '">复制</a>' + action;
  }

  function renderManage() {
    return '<div class="rule-alert neutral"><strong>职责边界：</strong>原活动页不再维护SA投放资格；如需进入服务助手可选池，请前往“SA活动配置”。</div>' + activityFilters() + '<div class="panel"><div class="panel-head"><div class="panel-title">保客活动列表 <span class="panel-subtitle">仅维护活动主数据</span></div>' +
      '<div class="toolbar"><button class="button primary" data-activity-new type="button">新增活动</button></div></div>' +
      '<div class="table-shell"><table class="data-table activity-config-table"><thead><tr><th>活动ID / 名称</th><th>业务子版块</th><th>活动类型</th><th>触发方式</th><th>领券方式</th><th>准入等级</th><th>活动时间</th><th>活动状态</th><th>操作</th></tr></thead><tbody>' +
      data.activityConfigs.map(function (row) {
        return '<tr><td class="wrap"><a class="link-action" data-activity-action="view" data-id="' + row.id + '">' + esc(row.id) + '</a><br>' + esc(row.name) + '</td><td>' + esc(row.business) + '</td><td>' + esc(row.activityType) + '</td><td>' + esc(row.trigger) + '</td><td>' + esc(row.claimMode) + '</td><td>' + status(row.level) + '</td><td>' + esc(row.time) + '</td><td>' + status(row.status) + '</td><td class="operation-cell">' + operationLinks(row) + '</td></tr>';
      }).join('') + '</tbody></table></div>' + common.pagination(data.activityConfigs.length) + '</div>';
  }

  function stepper() {
    var steps = [['1','基本信息'],['2','关联卡券'],['3','活动对象'],['4','分享与SEO']];
    return '<div class="activity-stepper">' + steps.map(function (item) {
      var no = Number(item[0]);
      return '<button class="activity-step ' + (state.step === no ? 'active' : '') + ' ' + (state.step > no ? 'done' : '') + '" data-form-step="' + no + '" type="button"><i>' + item[0] + '</i><span>' + item[1] + '</span></button>';
    }).join('') + '</div>';
  }

  function formItem(label, control, full, note) {
    return '<div class="activity-form-item ' + (full ? 'full' : '') + '"><label>' + label + '</label><div class="activity-control">' + control + (note ? '<small>' + note + '</small>' : '') + '</div></div>';
  }

  function renderStep1(form) {
    var locked = form.status === '已启用';
    return '<section class="activity-form-section"><div class="form-section-head"><div><h2>Step1 基本信息</h2><p>维护活动主数据；SA投放由独立“SA活动配置”承接。</p></div>' + (locked ? '<span class="lock-badge">活动已启用 · 锁定关键字段</span>' : '') + '</div>' +
      (state.mode === 'copy' ? '<div class="rule-alert neutral"><strong>复制规则：</strong>仅复制活动本身；不会自动创建或复制SA活动配置。</div>' : '') +
      '<div class="activity-form-grid">' +
      formItem('<em>*</em>活动ID','<input value="' + esc(form.id) + '" disabled>') +
      formItem('<em>*</em>活动名称','<input data-activity-field="name" value="' + esc(form.name) + '" placeholder="请输入活动名称">') +
      formItem('<em>*</em>品牌','<select data-activity-field="brand">' + options(['东风日产','启辰'],form.brand) + '</select>') +
      formItem('<em>*</em>业务子版块','<select data-activity-field="business">' + options(['会员权益','维保活动','续保活动','取送车活动'],form.business) + '</select>') +
      formItem('<em>*</em>活动时间','<input data-activity-field="time" value="' + esc(form.time) + '">') +
      formItem('<em>*</em>活动类型','<select data-activity-field="activityType">' + options(['领券','抽奖'],form.activityType) + '</select>') +
      formItem('<em>*</em>触发方式','<select data-activity-field="trigger"' + (locked ? ' disabled' : '') + '>' + options(['C端主动参与','C端主动领取','后台统一推送','用户行为触发'],form.trigger) + '</select>',false,locked ? '活动开启后触发方式不可修改。' : '触发方式决定活动执行链路和后续字段。') +
      formItem('<em>*</em>启用状态','<select><option>' + esc(form.status) + '</option></select>') +
      '</div></section>';
  }

  function renderStep2(form) {
    return '<section class="activity-form-section"><div class="form-section-head"><div><h2>Step2 关联卡券</h2><p>领券方式、门店来源和适用门店均为原活动页面已有字段，本次SA改造不新增、不重复配置。</p></div><button class="button" type="button" data-demo-action="add-coupon">选择卡券</button></div>' +
      '<div class="activity-form-grid">' +
      formItem('<em>*</em>领券方式','<select data-activity-field="claimMode">' + options(['一键领取','手动领取','自动抽奖','自动领取'],form.claimMode) + '</select>',false,'SA二维码只承接用户可主动执行的领券或抽奖活动。') +
      formItem('门店来源','<select><option>活动统一配置</option><option>沿用卡券中心</option></select>') +
      formItem('适用门店','<input value="' + esc(form.storeScope) + '" disabled>',true) +
      '</div><div class="table-shell inline-table"><table class="data-table"><thead><tr><th>卡券模板ID</th><th>卡券名称</th><th>状态</th><th>适用范围</th><th>操作</th></tr></thead><tbody>' +
      form.coupons.map(function (coupon,index) { return '<tr><td>' + esc(form.couponIds[index] || '-') + '</td><td>' + esc(coupon) + '</td><td>' + status('已生效') + '</td><td>' + esc(form.storeScope) + '</td><td><a class="link-action">查看</a></td></tr>'; }).join('') +
      '</tbody></table></div></section>';
  }

  function checkpointTags(form) {
    if (form.accessEnabled !== '启用') return '<span class="empty-inline">未启用准入，不执行节点校验</span>';
    if (!form.checkpoints.length) return '<span class="empty-inline">暂未选择校验节点</span>';
    return form.checkpoints.map(function (item) { return '<span class="access-summary-tag">' + esc(item) + '</span>'; }).join('');
  }

  function selectedMutex(form) {
    if (!form.mutexIds.length) return '<span class="empty-inline">暂未配置互斥活动</span>';
    return form.mutexIds.map(function (id) {
      var item = findActivity(id);
      return '<span class="selected-chip">' + esc(item ? item.name : id) + '<small>' + esc(id) + '</small></span>';
    }).join('');
  }

  function renderStep3(form) {
    var accessLevel = form.accessEnabled === '启用' ? form.level : '-';
    var mutexDisabled = form.accessEnabled !== '启用';
    return '<section class="activity-form-section" data-anno="access-config-source"><div class="form-section-head"><div><h2>Step3 活动对象</h2><p>复用活动原有准入配置；SA选择页和用户聚合页只读取结果，不增加第二套“SA活动级别”。</p></div></div>' +
      '<div class="rule-alert"><strong>本次改造边界：</strong>准入开关、准入等级和校验节点均沿用活动中心原有能力；本次仅让SA链路读取该配置。</div>' +
      '<div class="configuration-split"><div class="config-card access-config-card" data-anno="access-config-panel"><div class="config-card-head"><div><h3>准入配置</h3><p>原活动页面已有配置</p></div><button class="button primary" data-configure-access type="button">配置准入</button></div>' +
      '<div class="access-summary-grid"><div><span>是否启用准入</span>' + status(form.accessEnabled === '启用' ? '已启用' : '未启用') + '</div><div><span>准入等级</span><strong>' + esc(accessLevel) + '</strong></div><div class="full"><span>校验节点</span><div class="access-summary-tags">' + checkpointTags(form) + '</div></div></div></div>' +
      '<div class="config-card" data-anno="mutex-reuse"><div class="config-card-head"><div><h3>互斥活动</h3><p>复用原“选择互斥活动”能力</p></div><button class="button" data-select-mutex type="button"' + (mutexDisabled ? ' disabled' : '') + '>选择互斥活动</button></div><div class="selected-chip-list">' + selectedMutex(form) + '</div><div class="subject-summary"><span>互斥主体口径</span><strong>' + (mutexDisabled ? '-' : esc(form.mutexSubject)) + '</strong><small>' + (mutexDisabled ? '请先启用准入并配置等级' : '由准入等级自动确定，不单独配置') + '</small></div></div></div></section>';
  }

  function renderStep4(form) {
    return '<section class="activity-form-section"><div class="form-section-head"><div><h2>Step4 分享与SEO</h2><p>本步骤仍用于C端页面分享素材，不承担SA投放资格配置。</p></div></div>' +
      '<div class="rule-alert neutral"><strong>注意：</strong>这里的“分享”仅指活动自身的页面标题、描述和图片素材，与SA活动配置无关。</div>' +
      '<div class="activity-form-grid">' +
      formItem('分享标题','<input data-activity-field="shareTitle" value="' + esc(form.shareTitle || form.name) + '" placeholder="请输入分享标题">',true) +
      formItem('分享描述','<textarea rows="3">活动详情及参与说明，以活动规则为准。</textarea>',true) +
      formItem('WAP/APP分享图标','<button class="upload-box" type="button">＋ 上传图片</button>') +
      formItem('小程序分享图标','<button class="upload-box" type="button">＋ 上传图片</button>') +
      formItem('SEO标题','<input value="' + esc(form.name) + '">') +
      formItem('SEO关键词','<input value="保客活动,车主权益">') +
      '</div></section>';
  }

  function formFooter(form) {
    return '<div class="activity-form-footer"><button class="button" data-back-list type="button">返回列表</button><div>' +
      (state.step > 1 ? '<button class="button" data-form-prev type="button">上一步</button>' : '') +
      '<button class="button" data-save-draft type="button">保存草稿</button>' +
      (state.step < 4 ? '<button class="button primary" data-form-next type="button">下一步</button>' : '<button class="button primary" data-submit-activity type="button">' + (form.status === '已启用' ? '保存修改' : '提交并启用') + '</button>') +
      '</div></div>';
  }

  function renderCreate() {
    var form = state.form || freshForm();
    var body = state.step === 1 ? renderStep1(form) : state.step === 2 ? renderStep2(form) : state.step === 3 ? renderStep3(form) : renderStep4(form);
    return '<div class="activity-mode-bar"><span>' + (state.mode === 'create' ? '新增活动' : state.mode === 'copy' ? '复制活动' : '编辑活动') + '</span><strong>' + esc(form.name || '未命名活动') + '</strong><em>' + esc(form.id) + '</em></div>' + stepper() + body + formFooter(form);
  }

  function detailBlock(title, rows) {
    return '<section class="detail-block"><h2>' + esc(title) + '</h2><div class="detail-block-grid">' + rows.map(function (row) {
      return '<div><label>' + esc(row[0]) + '</label><strong>' + (row[2] ? row[1] : esc(row[1])) + '</strong></div>';
    }).join('') + '</div></section>';
  }

  function renderDetail() {
    var row = findActivity(state.selectedId) || data.activityConfigs[0];
    var mutexNames = row.mutexIds.map(function (id) { var item = findActivity(id); return item ? item.name + '（' + id + '）' : id; }).join('、') || '未配置';
    var rowCheckpoints = row.checkpoints || defaultCheckpoints(row.activityType);
    var accessEnabled = row.accessEnabled || '启用';
    return '<div class="rule-alert neutral"><strong>SA投放：</strong>该资格不在活动详情内维护，可在“SA活动配置”查询关联关系。</div><div class="detail-summary"><div><span>活动状态</span>' + status(row.status) + '</div><div><span>触发方式</span><strong>' + esc(row.trigger) + '</strong></div><div><span>准入等级</span>' + status(accessEnabled === '启用' ? row.level : '未启用') + '</div><div><span>活动类型</span><strong>' + esc(row.activityType) + '</strong></div></div>' +
      detailBlock('基本信息', [['活动ID',row.id],['活动名称',row.name],['品牌',row.brand],['业务子版块',row.business],['活动时间',row.time],['触发方式',row.trigger],['领券方式',row.claimMode]]) +
      detailBlock('准入配置', [['是否启用准入',status(accessEnabled === '启用' ? '已启用' : '未启用'),true],['准入等级',accessEnabled === '启用' ? status(row.level) : '-',true],['校验节点',accessEnabled === '启用' ? rowCheckpoints.join('、') : '-'],['参与主体口径',accessEnabled === '启用' ? row.mutexSubject : '-']]) +
      detailBlock('活动奖品', [['关联卡券',row.coupons.join('、')],['关联权益',row.rights.join('、') || '无'],['适用门店',row.storeScope]]) +
      detailBlock('活动互斥', [['互斥活动',mutexNames],['互斥主体口径',row.mutexSubject],['配置来源','原活动中心“选择互斥活动”']]) +
      '<div class="detail-page-footer"><button class="button" data-back-list type="button">返回列表</button><button class="button primary" data-detail-edit="' + row.id + '" type="button">编辑活动</button></div>';
  }

  function mutexFilters() {
    return '<div class="filter-panel"><div class="filter-grid compact">' +
      '<div class="filter-field"><label>活动ID：</label><input placeholder="请输入活动ID"></div>' +
      '<div class="filter-field"><label>活动名称：</label><input placeholder="请输入活动名称"></div>' +
      '<div class="filter-field"><label>主体口径：</label><select><option>全部</option><option>oneID</option><option>VIN</option><option>认证关系</option></select></div>' +
      '<div class="filter-field"><label>生效状态：</label><select><option>全部</option><option>已生效</option><option>待生效</option></select></div>' +
      '</div><div class="filter-actions"><button class="button" data-reset type="button">重置</button><button class="button primary" data-query type="button">查询</button></div></div>';
  }

  function renderMutex() {
    return '<div class="rule-alert"><strong>配置入口：</strong>互斥关系仍在活动新增/编辑页通过“选择互斥活动”维护，本页仅用于查询和追溯，不新增SA互斥菜单。</div>' + mutexFilters() +
      '<div class="panel" data-anno="mutex-list"><div class="panel-head"><div class="panel-title">活动互斥关系 <span class="panel-subtitle">参与阶段按活动准入等级对应主体校验</span></div></div>' +
      '<div class="table-shell"><table class="data-table"><thead><tr><th>关系ID</th><th>活动A</th><th>准入级别</th><th>活动B</th><th>准入级别</th><th>互斥主体口径</th><th>配置来源</th><th>状态</th><th>更新时间</th><th>操作</th></tr></thead><tbody>' +
      data.mutexRelations.map(function (row) {
        return '<tr><td>' + row.id + '</td><td class="wrap">' + row.activityA + '<br>' + esc(row.nameA) + '</td><td>' + status(row.levelA) + '</td><td class="wrap">' + row.activityB + '<br>' + esc(row.nameB) + '</td><td>' + status(row.levelB) + '</td><td>' + status(row.subject) + '</td><td>' + esc(row.source) + '</td><td>' + status(row.status) + '</td><td>' + row.updated + '</td><td><a class="link-action" data-view-mutex="' + row.id + '">查看关系</a></td></tr>';
      }).join('') + '</tbody></table></div>' + common.pagination(data.mutexRelations.length) + '</div>';
  }

  function findPlacement(id) {
    return data.saPlacements.find(function (item) { return item.id === id; });
  }

  function findCombo(id) {
    return data.comboActivities.find(function (item) { return item.id === id; });
  }

  function placementSource(row) {
    return row.objectType === '组合活动' ? findCombo(row.objectId) : findActivity(row.objectId);
  }

  function comboDisplayName(combo) {
    if (!combo) return '-';
    return String(combo.displayName || '').trim() || combo.name;
  }

  function comboScopeStores(combo) {
    if (!combo || !combo.storeScope || combo.storeScope.mode !== 'SPECIFIED') return [];
    return (combo.storeScope.storeIds || []).map(function (id) {
      return (data.stores || []).find(function (store) { return store.id === id && store.available; });
    }).filter(Boolean);
  }

  function comboScopeSummary(combo) {
    var stores = comboScopeStores(combo);
    if (!stores.length) return '全部门店';
    return '指定' + stores.length + '家：' + stores.map(function (store) { return store.name; }).join('、');
  }

  function placementDisplayName(row) {
    var source = placementSource(row);
    return row.objectType === '组合活动' ? comboDisplayName(source) : (source ? source.name : row.objectName);
  }

  function inheritedScope(row) {
    var source = placementSource(row);
    if (!source) return '-';
    return row.objectType === '组合活动' ? comboScopeSummary(source) : (source.storeScope || '-');
  }

  function scopeSourceLabel(row) {
    return row.objectType === '组合活动' ? '组合活动配置' : '活动配置';
  }

  function placementTabs(active) {
    return '<div class="subtabs placement-subtabs"><a class="subtab ' + (active === 'placement' ? 'active' : '') + '" href="#sa-placement-manage">投放配置</a><a class="subtab ' + (active === 'qr' ? 'active' : '') + '" href="#sa-qr-settings">二维码参数</a></div>';
  }

  function renderPlacementManage() {
    var filters = '<div class="filter-panel"><div class="filter-grid">' +
      '<div class="filter-field"><label>配置ID：</label><input placeholder="请输入配置ID"></div>' +
      '<div class="filter-field"><label>配置名称：</label><input placeholder="请输入配置名称"></div>' +
      '<div class="filter-field"><label>投放对象：</label><select><option>全部</option><option>普通活动</option><option>组合活动</option></select></div>' +
      '<div class="filter-field"><label>状态：</label><select><option>全部</option><option>草稿</option><option>已生效</option><option>已停用</option></select></div>' +
      '<div class="filter-field"><label>品牌：</label><select><option>东风日产</option><option>启辰</option></select></div>' +
      '<div class="filter-field"><label>活动时间：</label><input value="2026-07-01 至 2026-09-30"></div></div>' +
      '<div class="filter-actions"><button class="button" data-reset type="button">重置</button><button class="button primary" data-query type="button">查询</button></div></div>';
    return placementTabs('placement') + '<div class="rule-alert"><strong>独立配置：</strong>本页只维护普通活动和组合活动是否进入SA可选池；门店/SA范围、准入、卡券和互斥关系均读取投放对象配置。</div>' + filters +
      '<div class="panel" data-anno="sa-placement-list"><div class="panel-head"><div class="panel-title">SA投放配置列表 <span class="panel-subtitle">一个配置对应一个普通活动或一个组合活动</span></div><div class="toolbar"><button class="button primary" data-placement-new type="button">新增配置</button></div></div>' +
      '<div class="table-shell"><table class="data-table"><thead><tr><th>配置ID / 名称</th><th>投放对象</th><th>对象ID / 名称</th><th>活动数</th><th>准入等级</th><th>范围来源</th><th>活动时间</th><th>状态</th><th>更新时间 / 操作人</th><th>操作</th></tr></thead><tbody>' + data.saPlacements.map(function (row) {
        var originalName = row.objectType === '组合活动' && placementSource(row) ? '<br><span class="panel-subtitle">原名：' + esc(placementSource(row).name) + '</span>' : '';
        return '<tr><td class="wrap"><a class="link-action" data-placement-view="' + row.id + '">' + esc(row.id) + '</a><br>' + esc(row.name) + '</td><td>' + status(row.objectType) + '</td><td class="wrap">' + esc(row.objectId) + '<br>' + esc(placementDisplayName(row)) + originalName + '</td><td>' + row.activityCount + '</td><td>' + status(row.levelSummary) + '</td><td class="wrap">' + esc(scopeSourceLabel(row)) + '<br><span class="panel-subtitle">' + esc(inheritedScope(row)) + '（只读）</span></td><td>' + esc(row.time) + '</td><td>' + status(row.status) + '</td><td>' + row.updated + '<br><span class="panel-subtitle">' + esc(row.operator) + '</span></td><td class="operation-cell"><a class="link-action" data-placement-view="' + row.id + '">查看</a><a class="link-action" data-placement-edit="' + row.id + '">编辑</a>' + (row.status === '已生效' ? '<a class="link-action danger-link" data-placement-toggle="' + row.id + '">停用</a>' : '<a class="link-action" data-placement-toggle="' + row.id + '">启用</a>') + '</td></tr>';
      }).join('') + '</tbody></table></div>' + common.pagination(data.saPlacements.length) + '</div>';
  }

  function freshPlacement() {
    return {id:'系统生成',name:'',objectType:'普通活动',objectId:'ACT-SA-20260701',objectName:'夏季养护礼遇',brand:'东风日产',activityCount:1,levelSummary:'绑车级',status:'草稿',time:'2026-07-01 至 2026-08-31',updated:'-',operator:'当前用户'};
  }

  function preparePlacement(mode, id) {
    state.placementMode = mode;
    state.placementId = id || state.placementId;
    state.placementForm = mode === 'create' ? freshPlacement() : JSON.parse(JSON.stringify(findPlacement(id) || freshPlacement()));
  }

  function syncPlacementObject(form) {
    if (form.objectType === '组合活动') {
      var combo = findCombo(form.objectId) || data.comboActivities[0];
      form.objectId = combo.id;
      form.objectName = comboDisplayName(combo);
      form.objectOriginalName = combo.name;
      form.activityCount = combo.children.length;
      form.levelSummary = combo.level;
      form.time = combo.time;
      form.brand = combo.brand;
      return;
    }
    var activity = findActivity(form.objectId) || data.activityConfigs.filter(function (item) { return item.status === '已启用' && item.trigger !== '后台统一推送' && item.trigger !== '用户行为触发'; })[0];
    form.objectId = activity.id;
    form.objectName = activity.name;
    form.activityCount = 1;
    form.levelSummary = activity.level;
    form.time = activity.time;
    form.brand = activity.brand;
  }

  function placementObjectOptions(form) {
    var rows = form.objectType === '组合活动' ? data.comboActivities.map(function (item) {
      return {id:item.id,name:comboDisplayName(item)};
    }) : data.activityConfigs.filter(function (item) {
      return item.status === '已启用' && item.trigger !== '后台统一推送' && item.trigger !== '用户行为触发';
    }).map(function (item) { return {id:item.id,name:item.name}; });
    return rows.map(function (item) { return '<option value="' + item.id + '"' + (item.id === form.objectId ? ' selected' : '') + '>' + esc(item.id + ' / ' + item.name) + '</option>'; }).join('');
  }

  function placementCandidates(form) {
    if (form.objectType === '组合活动') return data.comboActivities.map(function (item) {
      return {id:item.id,name:comboDisplayName(item),originalName:item.name,type:'组合活动',status:item.active ? '已发布' : '已停用',level:item.level,time:item.time,scope:comboScopeSummary(item),count:item.children.length};
    });
    return data.activityConfigs.filter(function (item) {
      return item.status === '已启用' && item.trigger !== '后台统一推送' && item.trigger !== '用户行为触发';
    }).map(function (item) {
      return {id:item.id,name:item.name,type:'普通活动',status:item.status,level:item.level,time:item.time,scope:item.storeScope,count:1};
    });
  }

  function renderPlacementSelectorModal() {
    var form = state.placementForm;
    var rows = placementCandidates(form);
    var selected = rows.find(function (item) { return item.id === state.placementCandidateId; });
    var availableTable = '<div class="selector-filter"><div><label>对象类型</label><input value="' + esc(form.objectType) + '" disabled></div><div><label>活动ID</label><input placeholder="请输入活动ID"></div><div><label>活动名称</label><input placeholder="请输入活动名称"></div><button class="button primary" data-query type="button">查询</button></div>' +
      '<div class="selector-table-title"><strong>可选投放对象（' + rows.length + '）</strong><span>单个配置仅可选择1个对象</span></div><div class="table-shell selector-table-shell"><table class="data-table"><thead><tr><th>选择</th><th>对象ID</th><th>对象名称</th><th>类型</th><th>活动状态</th><th>准入等级</th><th>活动数</th><th>门店/SA范围（只读）</th><th>活动时间</th></tr></thead><tbody>' + rows.map(function (item) {
        return '<tr class="' + (item.id === state.placementCandidateId ? 'selected-row' : '') + '"><td><input type="radio" name="placementCandidate" data-placement-candidate value="' + item.id + '"' + (item.id === state.placementCandidateId ? ' checked' : '') + '></td><td>' + esc(item.id) + '</td><td>' + esc(item.name) + (item.originalName && item.originalName !== item.name ? '<br><span class="panel-subtitle">原名：' + esc(item.originalName) + '</span>' : '') + '</td><td>' + status(item.type) + '</td><td>' + status(item.status) + '</td><td>' + status(item.level) + '</td><td>' + item.count + '</td><td class="wrap">' + esc(item.scope) + '</td><td>' + esc(item.time) + '</td></tr>';
      }).join('') + '</tbody></table></div>' + common.pagination(rows.length);
    var selectedTable = selected ? '<div class="selector-table-title"><strong>已选投放对象（1）</strong><span>确认后回填配置页</span></div><div class="table-shell"><table class="data-table"><thead><tr><th>对象ID</th><th>对象名称</th><th>类型</th><th>准入等级</th><th>活动数</th><th>操作</th></tr></thead><tbody><tr><td>' + esc(selected.id) + '</td><td>' + esc(selected.name) + (selected.originalName && selected.originalName !== selected.name ? '<br><span class="panel-subtitle">原名：' + esc(selected.originalName) + '</span>' : '') + '</td><td>' + status(selected.type) + '</td><td>' + status(selected.level) + '</td><td>' + selected.count + '</td><td><a class="link-action danger-link" data-remove-placement-candidate>移除</a></td></tr></tbody></table></div>' : '<div class="selector-empty"><strong>暂无已选投放对象</strong><span>请切换到“可选”页签选择一个活动</span></div>';
    var body = '<div class="selector-tabs"><button class="' + (state.placementSelectorTab === 'available' ? 'active' : '') + '" data-placement-selector-tab="available" type="button">可选</button><button class="' + (state.placementSelectorTab === 'selected' ? 'active' : '') + '" data-placement-selector-tab="selected" type="button">已选' + (selected ? '（1）' : '') + '</button></div><div class="selector-tip"><strong>选择说明：</strong>普通活动与组合活动分开选择；门店/SA范围、卡券、权益、准入和互斥关系均读取投放对象配置。</div>' + (state.placementSelectorTab === 'available' ? availableTable : selectedTable);
    common.openModal('选择SA投放活动', body, '<button class="button" data-close-modal type="button">取消</button><button class="button primary" data-confirm-placement-object type="button"' + (selected ? '' : ' disabled') + '>确认</button>', 'wide-modal placement-selector-modal');
  }

  function openPlacementSelector() {
    state.placementCandidateId = state.placementForm.objectId;
    state.placementSelectorTab = 'available';
    renderPlacementSelectorModal();
  }

  function placementSnapshot(form) {
    if (form.objectType === '组合活动') {
      var combo = findCombo(form.objectId) || data.comboActivities[0];
      return '<div class="placement-snapshot"><div class="detail-block-grid placement-grid"><div><label>SA展示名称</label><strong>' + esc(comboDisplayName(combo)) + '</strong><small>' + (String(combo.displayName || '').trim() ? '读取组合活动展示名称' : '未配置展示名称，已回退原组合活动名称') + '</small></div><div><label>原组合活动名称</label><strong>' + esc(combo.name) + '</strong><small>保留后台识别与追溯</small></div><div><label>门店/SA范围</label><strong>' + esc(comboScopeSummary(combo)) + '</strong><small>读取组合活动配置</small></div><div><label>活动时间</label><strong>' + esc(combo.time) + '</strong></div></div><div class="rule-alert neutral"><strong>SA可见与分享规则：</strong>独立SA投放有效 ∩ 组合活动启用 ∩ 当前SA所属门店命中组合活动适用门店。未配置门店时按全部门店生效。</div><div class="rule-alert neutral"><strong>组合活动展示规则：</strong>用户端只展示一张大活动卡片；绑车并匹配VIN后，在原卡片内汇总展示所有命中子活动的卡券和权益。参与唯一键为“组合活动ID + VIN”。</div><div class="table-shell"><table class="data-table"><thead><tr><th>子活动ID</th><th>人群包</th><th>关联卡券</th><th>关联权益</th></tr></thead><tbody>' + combo.children.map(function (child) {
        return '<tr><td>' + esc(child.id) + '</td><td>' + esc(child.segment) + '</td><td>' + esc(child.coupon) + '</td><td>' + esc(child.benefit) + '</td></tr>';
      }).join('') + '</tbody></table></div><p class="placement-match-rule"><strong>多子活动命中规则：</strong>同一VIN满足多个子活动时，命中的卡券与权益全部发放；不阻断、不记为异常，不设优先级和执行顺序。组合活动只生成一条参与主记录，发放明细按命中子活动记录。</p></div>';
    }
    var activity = findActivity(form.objectId) || data.activityConfigs[0];
    return '<div class="placement-snapshot"><div class="detail-block-grid placement-grid"><div><label>活动状态</label><strong>' + status(activity.status) + '</strong></div><div><label>准入配置</label><strong>' + esc(activity.level) + ' · ' + esc(activity.checkpoints.join('、')) + '</strong></div><div><label>门店/SA范围</label><strong>' + esc(activity.storeScope) + '</strong><small>读取活动配置</small></div><div><label>领券方式</label><strong>' + esc(activity.claimMode) + '</strong></div><div><label>关联卡券/权益</label><strong>' + esc(activity.coupons.join('、') + (activity.rights.length ? '；' + activity.rights.join('、') : '')) + '</strong></div></div></div>';
  }

  function renderPlacementEdit() {
    var form = state.placementForm || freshPlacement();
    return placementTabs('placement') + '<section class="activity-form-section"><div class="form-section-head"><div><h2>' + (state.placementMode === 'create' ? '新增SA活动配置' : '编辑SA活动配置') + '</h2><p>仅配置投放关系；门店/SA范围由活动或组合活动维护。</p></div><span class="lock-badge">配置对象发布后不可切换类型</span></div>' +
      '<div class="activity-form-grid">' +
      formItem('<em>*</em>配置ID','<input value="' + esc(form.id) + '" disabled>') +
      formItem('<em>*</em>配置名称','<input data-placement-field="name" value="' + esc(form.name) + '" placeholder="请输入配置名称">') +
      formItem('<em>*</em>投放对象','<div class="radio-card-group placement-type">' + ['普通活动','组合活动'].map(function (item) { return '<label class="radio-card ' + (form.objectType === item ? 'checked' : '') + '"><input type="radio" name="placementType" data-placement-type value="' + item + '"' + (form.objectType === item ? ' checked' : '') + '><strong>' + item + '</strong><span>' + (item === '普通活动' ? '选择单个已启用活动' : '选择一个组合活动作为整体') + '</span></label>'; }).join('') + '</div>',true) +
      formItem('<em>*</em>选择活动','<div class="selected-object-row"><span><strong>' + esc(form.objectName) + '</strong><small>' + esc(form.objectId) + ' · ' + esc(form.objectType) + ' · ' + esc(form.levelSummary) + '</small></span><button class="button primary" data-open-placement-selector type="button">选择投放对象</button></div>',true,'沿用现有“可选/已选 + 查询 + 表格选择”交互；后台统一推券和用户行为触发活动不进入候选池。') +
      formItem('<em>*</em>配置状态','<select data-placement-field="status">' + options(['草稿','已生效','已停用'],form.status) + '</select>') +
      '</div><div class="rule-alert neutral"><strong>范围配置位置：</strong>门店/SA范围请在所选普通活动或组合活动中维护，本配置不保存范围副本。</div></section><section class="activity-form-section"><div class="form-section-head"><div><h2>投放对象快照</h2><p>以下信息只读，变化时实时读取活动或组合活动配置。</p></div></div>' + placementSnapshot(form) + '</section>' +
      '<div class="activity-form-footer"><button class="button" data-placement-back type="button">返回列表</button><div><button class="button" data-placement-save="draft" type="button">保存草稿</button><button class="button primary" data-placement-save="active" type="button">保存并生效</button></div></div>';
  }

  function renderPlacementDetail() {
    var row = findPlacement(state.placementId) || data.saPlacements[0];
    return placementTabs('placement') + '<div class="detail-summary"><div><span>配置状态</span>' + status(row.status) + '</div><div><span>投放对象</span>' + status(row.objectType) + '</div><div><span>活动数量</span><strong>' + row.activityCount + '</strong></div><div><span>准入等级</span>' + status(row.levelSummary) + '</div></div>' +
      detailBlock('配置关系', [['配置ID',row.id],['配置名称',row.name],['对象ID',row.objectId],['对象名称',row.objectName],['范围来源',scopeSourceLabel(row)],['当前继承范围',inheritedScope(row)],['活动时间',row.time],['更新时间',row.updated],['操作人',row.operator]]) +
      '<section class="detail-block"><h2>投放对象快照</h2>' + placementSnapshot(row) + '</section>' +
      '<div class="detail-page-footer"><button class="button" data-placement-back type="button">返回列表</button><button class="button primary" data-placement-edit="' + row.id + '" type="button">编辑配置</button></div>';
  }

  function durationLabel(minutes) {
    if (minutes === -1) return '长期有效';
    if (minutes === 1440) return '1天';
    if (minutes >= 60) return (minutes / 60) + '小时';
    return minutes + '分钟';
  }

  function renderQrSettings() {
    var settings = data.saQrSettings;
    return placementTabs('qr') + '<div class="rule-alert"><strong>生效范围：</strong>配置只影响之后新生成的二维码；既有二维码保留生成时的有效期和配置版本。</div>' +
      '<section class="activity-form-section" data-anno="qr-duration-settings"><div class="form-section-head"><div><h2>二维码有效时长</h2><p>SA生成前只能从已启用选项中选择，默认勾选默认值。</p></div><span class="lock-badge">固定5分钟—1天 / 长期有效</span></div>' +
      '<div class="qr-setting-layout"><div class="qr-setting-block"><h3>可选时长</h3><p>固定时长限制为5分钟至1天；长期有效截止到本次二维码冻结活动中最晚结束时间。</p><div class="duration-option-grid">' + settings.durationOptions.map(function (minutes) {
        var note = minutes === -1 ? '至活动有效期' : minutes + '分钟';
        return '<label class="duration-setting-card' + (minutes === -1 ? ' activity-end' : '') + '"><input type="checkbox" data-ttl-option value="' + minutes + '" checked><span><strong>' + durationLabel(minutes) + '</strong><small>' + note + '</small></span></label>';
      }).join('') + '</div></div><div class="qr-setting-block default-setting"><h3>默认值</h3><p>服务助手打开有效期抽屉时默认选中。</p><select data-ttl-default>' + settings.durationOptions.map(function (minutes) { return '<option value="' + minutes + '"' + (minutes === settings.defaultMinutes ? ' selected' : '') + '>' + durationLabel(minutes) + '</option>'; }).join('') + '</select><div class="setting-meta"><span>当前版本</span><strong>' + esc(settings.version) + '</strong><span>最后更新</span><strong>' + settings.updated + ' · ' + esc(settings.operator) + '</strong></div></div></div>' +
      '<div class="activity-form-footer qr-setting-footer"><span>固定时长保存durationMinutes；长期有效保存ACTIVITY_END模式并按活动截止时间计算expiresAt</span><div><button class="button" data-ttl-reset type="button">恢复当前配置</button><button class="button primary" data-ttl-save type="button">保存配置</button></div></div></section>';
  }

  function render(route) {
    if (route === 'activity-manage') return renderManage();
    if (route === 'activity-create') return renderCreate();
    if (route === 'activity-detail') return renderDetail();
    if (route === 'activity-mutex') return renderMutex();
    if (route === 'sa-placement-manage') return renderPlacementManage();
    if (route === 'sa-placement-edit') return renderPlacementEdit();
    if (route === 'sa-placement-detail') return renderPlacementDetail();
    if (route === 'sa-qr-settings') return renderQrSettings();
    return '';
  }

  function pageActions(route) {
    if (route === 'activity-manage') return '<button class="button primary" data-activity-new type="button">新增活动</button>';
    if (route === 'activity-detail' || route === 'activity-create') return '<button class="button" data-back-list type="button">返回列表</button>';
    if (route === 'sa-placement-manage') return '<button class="button primary" data-placement-new type="button">新增配置</button>';
    if (route === 'sa-placement-edit' || route === 'sa-placement-detail') return '<button class="button" data-placement-back type="button">返回列表</button>';
    return '';
  }

  function infoStrip() {
    return '活动配置主责：活动中心 <span class="permission-note">SA报表仍保持独立菜单</span>';
  }

  function enableBody(row) {
    return '<div class="modal-rule-card"><strong>发布前确认</strong><p>启用后，触发方式将锁定；是否进入SA可选池由独立配置决定。</p></div>' + common.detailGrid([
      ['活动',row.id + ' / ' + row.name],['触发方式',row.trigger],['领券方式',row.claimMode],['准入等级',row.level],['互斥主体',row.mutexSubject]
    ]) + '<div class="rule-alert neutral"><strong>说明：</strong>启用活动不会自动创建SA投放关系。</div>';
  }

  function openEnable(row) {
    state.pendingId = row.id;
    common.openModal('确认启用活动', enableBody(row), '<button class="button" data-close-modal type="button">取消</button><button class="button primary" data-confirm-enable type="button">确认启用</button>');
  }

  function openClose(row) {
    state.pendingId = row.id;
    common.openModal('确认关闭活动', '<div class="modal-warning-icon">!</div><h3 class="modal-center-title">关闭“' + esc(row.name) + '”吗？</h3><p class="modal-center-copy">关闭后，已生成SA二维码中的该活动将在提交时显示“活动已下线”，不可继续参与；二维码内其他有效活动继续执行。</p>', '<button class="button" data-close-modal type="button">取消</button><button class="button danger-button" data-confirm-close type="button">确认关闭</button>', 'compact-modal');
  }

  function openCopy(row) {
    state.pendingId = row.id;
    common.openModal('复制活动', '<div class="rule-alert warning"><strong>复制规则：</strong>活动基础信息、卡券、准入配置和互斥关系将被复制；SA活动配置不会复制。</div>' + common.detailGrid([
      ['原活动',row.id + ' / ' + row.name],['复制后状态','草稿'],['SA投放关系','不创建']
    ]), '<button class="button" data-close-modal type="button">取消</button><button class="button primary" data-confirm-copy type="button">继续复制</button>');
  }

  function accessConfigBody() {
    var draft = state.accessDraft;
    var disabled = draft.enabled !== '启用';
    return '<div class="access-config-intro"><strong>配置活动准入条件</strong><span>SA选择页和用户活动聚合页将直接读取这里的配置结果。</span></div><div class="access-config-form">' +
      '<div class="access-config-field"><div class="access-config-label"><label>是否启用准入</label><small>关闭后不执行准入校验</small></div><div class="access-segment-group two">' + ['启用','不启用'].map(function (item) {
        return '<button class="access-segment ' + (draft.enabled === item ? 'active' : '') + '" data-access-enabled="' + item + '" type="button" aria-pressed="' + (draft.enabled === item ? 'true' : 'false') + '">' + item + '</button>';
      }).join('') + '</div></div>' +
      '<div class="access-config-field ' + (disabled ? 'disabled' : '') + '"><div class="access-config-label"><label>准入等级</label><small>按活动参与主体选择</small></div><div class="access-segment-group three">' + ['号码级','绑车级','认证级'].map(function (item) {
        return '<button class="access-segment ' + (draft.level === item ? 'active' : '') + '" data-access-level="' + item + '" type="button" aria-pressed="' + (draft.level === item ? 'true' : 'false') + '"' + (disabled ? ' disabled' : '') + '>' + item + '</button>';
      }).join('') + '</div></div>' +
      '<div class="access-config-field ' + (disabled ? 'disabled' : '') + '"><div class="access-config-label"><label>校验节点</label><small>支持多选</small></div><div class="checkpoint-grid">' + checkpointOptions.map(function (item) {
        var checked = draft.checkpoints.indexOf(item) > -1;
        return '<label class="checkpoint-option ' + (checked ? 'checked' : '') + '"><input type="checkbox" data-access-checkpoint value="' + item + '"' + (checked ? ' checked' : '') + (disabled ? ' disabled' : '') + '><span>' + item + '</span></label>';
      }).join('') + '</div></div>' +
      '</div>';
  }

  function renderAccessConfigModal() {
    common.openModal('准入配置', accessConfigBody(), '<button class="button" data-close-modal type="button">取消</button><button class="button primary" data-confirm-access type="button">确认</button>', 'access-config-modal');
  }

  function openAccessConfig() {
    state.accessDraft = {
      enabled: state.form.accessEnabled || '启用',
      level: state.form.level || '绑车级',
      checkpoints: (state.form.checkpoints || defaultCheckpoints(state.form.activityType)).slice()
    };
    renderAccessConfigModal();
  }

  function openMutexSelector() {
    var form = state.form;
    var candidates = data.activityConfigs.filter(function (item) { return item.id !== form.id; });
    var body = '<div class="rule-alert neutral"><strong>规则：</strong>复用原“选择互斥活动”能力。准入级别不同的活动不可选择，互斥主体由当前准入等级自动确定。</div><div class="mutex-selector-list">' + candidates.map(function (item) {
      var compatible = item.level === form.level && item.trigger !== '后台统一推送';
      var selected = form.mutexIds.indexOf(item.id) > -1;
      return '<label class="mutex-selector-row ' + (!compatible ? 'disabled' : '') + '"><input type="checkbox" data-mutex-choice value="' + item.id + '" ' + (selected ? 'checked' : '') + (!compatible ? ' disabled' : '') + '><div><strong>' + esc(item.name) + '</strong><span>' + esc(item.id) + ' · ' + esc(item.trigger) + '</span></div>' + status(item.level) + '<em>' + (compatible ? '互斥主体：' + esc(form.mutexSubject) : '准入级别不一致') + '</em></label>';
    }).join('') + '</div>';
    common.openModal('选择互斥活动', body, '<button class="button" data-close-modal type="button">取消</button><button class="button primary" data-confirm-mutex type="button">确认选择</button>', 'wide-modal');
  }

  function updateField(target) {
    if (!state.form) return;
    var field = target.getAttribute('data-activity-field');
    if (!field) return;
    state.form[field] = target.value;
    if (field === 'activityType') {
      state.form.claimMode = target.value === '抽奖' ? '自动抽奖' : '一键领取';
      state.form.checkpoints = defaultCheckpoints(target.value);
    }
    if (window.SAApp) window.SAApp.render();
  }

  function persistForm(targetStatus) {
    var form = state.form;
    var existing = findActivity(form.id);
    if (!existing) {
      form.id = 'ACT-SA-DEMO-' + String(data.activityConfigs.length + 1).padStart(3,'0');
      data.activityConfigs.unshift(copyForm(form,'edit'));
      existing = data.activityConfigs[0];
    }
    Object.keys(form).forEach(function (key) { existing[key] = JSON.parse(JSON.stringify(form[key])); });
    existing.status = targetStatus || form.status;
    state.form.status = existing.status;
    state.selectedId = existing.id;
    return existing;
  }

  function handleClick(event) {
    var target;
    if (event.target.closest('[data-placement-new]')) {
      preparePlacement('create'); location.hash = 'sa-placement-edit'; return true;
    }
    if (event.target.closest('[data-open-placement-selector]')) { openPlacementSelector(); return true; }
    if ((target = event.target.closest('[data-placement-selector-tab]'))) {
      state.placementSelectorTab = target.getAttribute('data-placement-selector-tab');
      renderPlacementSelectorModal(); return true;
    }
    if (event.target.closest('[data-remove-placement-candidate]')) {
      state.placementCandidateId = null;
      renderPlacementSelectorModal(); return true;
    }
    if (event.target.closest('[data-confirm-placement-object]')) {
      if (!state.placementCandidateId) { common.showToast('请先选择一个投放对象'); return true; }
      state.placementForm.objectId = state.placementCandidateId;
      syncPlacementObject(state.placementForm);
      common.closeModal();
      window.SAApp.render();
      common.showToast('投放对象已回填'); return true;
    }
    if ((target = event.target.closest('[data-placement-view]'))) {
      state.placementId = target.getAttribute('data-placement-view'); location.hash = 'sa-placement-detail'; return true;
    }
    if ((target = event.target.closest('[data-placement-edit]'))) {
      preparePlacement('edit',target.getAttribute('data-placement-edit')); location.hash = 'sa-placement-edit'; return true;
    }
    if (event.target.closest('[data-placement-back]')) { location.hash = 'sa-placement-manage'; return true; }
    if ((target = event.target.closest('[data-placement-toggle]'))) {
      var placement = findPlacement(target.getAttribute('data-placement-toggle'));
      if (placement) placement.status = placement.status === '已生效' ? '已停用' : '已生效';
      common.showToast(placement && placement.status === '已生效' ? 'SA活动配置已生效' : 'SA活动配置已停用');
      window.SAApp.render(); return true;
    }
    if ((target = event.target.closest('[data-placement-save]'))) {
      var placementForm = state.placementForm || freshPlacement();
      syncPlacementObject(placementForm);
      placementForm.status = target.getAttribute('data-placement-save') === 'active' ? '已生效' : '草稿';
      placementForm.updated = '2026-07-17 12:08:36';
      placementForm.operator = '当前用户';
      var currentPlacement = findPlacement(placementForm.id);
      if (!currentPlacement) {
        placementForm.id = 'SA-PUT-DEMO-' + String(data.saPlacements.length + 1).padStart(3,'0');
        data.saPlacements.unshift(JSON.parse(JSON.stringify(placementForm)));
      } else Object.keys(placementForm).forEach(function (key) { currentPlacement[key] = JSON.parse(JSON.stringify(placementForm[key])); });
      state.placementId = placementForm.id;
      common.showToast(placementForm.status === '已生效' ? 'SA活动配置已保存并生效' : 'SA活动配置草稿已保存');
      location.hash = 'sa-placement-detail'; return true;
    }
    if (event.target.closest('[data-ttl-reset]')) { window.SAApp.render(); common.showToast('已恢复当前已保存配置'); return true; }
    if (event.target.closest('[data-ttl-save]')) {
      var enabledDurations = Array.prototype.slice.call(document.querySelectorAll('[data-ttl-option]:checked')).map(function (node) { return Number(node.value); });
      var defaultDuration = Number(document.querySelector('[data-ttl-default]').value);
      if (!enabledDurations.length) { common.showToast('请至少保留一个可选时长'); return true; }
      if (enabledDurations.indexOf(defaultDuration) === -1) { common.showToast('默认值必须属于已启用时长'); return true; }
      if (enabledDurations.some(function (minutes) { return minutes !== -1 && (minutes < 5 || minutes > 1440); })) { common.showToast('固定有效时长必须在5分钟至1天之间'); return true; }
      data.saQrSettings.durationOptions = enabledDurations;
      data.saQrSettings.defaultMinutes = defaultDuration;
      data.saQrSettings.allowActivityEnd = enabledDurations.indexOf(-1) >= 0;
      data.saQrSettings.version = 'QR-TTL-V6';
      data.saQrSettings.updated = '2026-07-17 12:08:36';
      data.saQrSettings.operator = '当前用户';
      window.SAApp.render(); common.showToast('二维码参数已保存，仅影响新生成二维码'); return true;
    }
    if ((target = event.target.closest('[data-activity-new]'))) {
      prepare('create'); location.hash = 'activity-create'; return true;
    }
    if ((target = event.target.closest('[data-activity-action]'))) {
      var action = target.getAttribute('data-activity-action');
      var id = target.getAttribute('data-id');
      var row = findActivity(id);
      if (action === 'view') { state.selectedId = id; location.hash = 'activity-detail'; }
      if (action === 'edit') { prepare('edit',id); location.hash = 'activity-create'; }
      if (action === 'copy') openCopy(row);
      if (action === 'enable') openEnable(row);
      if (action === 'close') openClose(row);
      return true;
    }
    if ((target = event.target.closest('[data-detail-edit]'))) {
      prepare('edit',target.getAttribute('data-detail-edit')); location.hash = 'activity-create'; return true;
    }
    if (event.target.closest('[data-back-list]')) { location.hash = 'activity-manage'; return true; }
    if ((target = event.target.closest('[data-form-step]'))) { state.step = Number(target.getAttribute('data-form-step')); window.SAApp.render(); return true; }
    if (event.target.closest('[data-form-next]')) { state.step = Math.min(4,state.step + 1); window.SAApp.render(); return true; }
    if (event.target.closest('[data-form-prev]')) { state.step = Math.max(1,state.step - 1); window.SAApp.render(); return true; }
    if (event.target.closest('[data-save-draft]')) { persistForm('草稿'); common.showToast('原型演示：草稿已保存'); return true; }
    if (event.target.closest('[data-submit-activity]')) {
      if (state.form.status === '已启用') { persistForm('已启用'); common.showToast('原型演示：可编辑配置已保存，锁定字段未变更'); }
      else openEnable(state.form);
      return true;
    }
    if (event.target.closest('[data-configure-access]')) { openAccessConfig(); return true; }
    if ((target = event.target.closest('[data-access-enabled]'))) {
      state.accessDraft.enabled = target.getAttribute('data-access-enabled');
      renderAccessConfigModal();
      return true;
    }
    if ((target = event.target.closest('[data-access-level]'))) {
      state.accessDraft.level = target.getAttribute('data-access-level');
      renderAccessConfigModal();
      return true;
    }
    if (event.target.closest('[data-confirm-access]')) {
      var previousLevel = state.form.level;
      state.accessDraft.checkpoints = Array.prototype.slice.call(document.querySelectorAll('[data-access-checkpoint]:checked')).map(function (node) { return node.value; });
      state.form.accessEnabled = state.accessDraft.enabled;
      state.form.level = state.accessDraft.level;
      state.form.checkpoints = state.accessDraft.checkpoints.slice();
      state.form.mutexSubject = accessSubject(state.form.level);
      if (previousLevel !== state.form.level || state.form.accessEnabled !== '启用') state.form.mutexIds = [];
      common.closeModal();
      common.showToast('准入配置已更新，SA链路将直接读取该结果');
      window.SAApp.render();
      return true;
    }
    if (event.target.closest('[data-select-mutex]')) { openMutexSelector(); return true; }
    if (event.target.closest('[data-confirm-copy]')) {
      var copySource = findActivity(state.pendingId); common.closeModal(); prepare('copy',copySource.id); location.hash = 'activity-create'; return true;
    }
    if (event.target.closest('[data-confirm-enable]')) {
      var enableRow = findActivity(state.pendingId);
      if (enableRow) enableRow.status = '已启用';
      else enableRow = persistForm('已启用');
      if (state.form && state.form.id === enableRow.id) state.form.status = '已启用';
      common.closeModal(); common.showToast('活动已启用，关键字段已锁定');
      if (location.hash === '#activity-create') { state.selectedId = enableRow.id; location.hash = 'activity-detail'; } else window.SAApp.render();
      return true;
    }
    if (event.target.closest('[data-confirm-close]')) {
      var closeRow = findActivity(state.pendingId); if (closeRow) closeRow.status = '已关闭';
      common.closeModal(); common.showToast('活动已关闭；二维码内其他有效活动不受影响'); window.SAApp.render(); return true;
    }
    if (event.target.closest('[data-confirm-mutex]')) {
      state.form.mutexIds = Array.prototype.slice.call(document.querySelectorAll('[data-mutex-choice]:checked')).map(function (node) { return node.value; });
      common.closeModal(); common.showToast('已更新互斥活动，互斥主体口径保持为' + state.form.mutexSubject); window.SAApp.render(); return true;
    }
    if ((target = event.target.closest('[data-view-mutex]'))) {
      var relation = data.mutexRelations.find(function (item) { return item.id === target.getAttribute('data-view-mutex'); });
      if (relation) common.openDrawer('活动互斥关系详情', common.detailSection('关系信息',common.detailGrid([
        ['关系ID',relation.id],['生效状态',status(relation.status),true],['活动A',relation.activityA + ' / ' + relation.nameA],['活动A准入',relation.levelA],['活动B',relation.activityB + ' / ' + relation.nameB],['活动B准入',relation.levelB],['互斥主体口径',relation.subject],['配置来源',relation.source],['更新时间',relation.updated]
      ])) + common.detailSection('执行说明','<div class="rule-alert neutral">聚合页加载、用户切换选择及一键参与提交前均按该主体口径校验；命中已参与关系时，另一活动置灰。</div>'));
      return true;
    }
    if (event.target.closest('[data-demo-action]')) { common.showToast('原型演示：已打开原有选择卡券能力'); return true; }
    return false;
  }

  function handleChange(event) {
    if (event.target.matches('[data-placement-candidate]')) {
      state.placementCandidateId = event.target.value;
      renderPlacementSelectorModal(); return;
    }
    if (event.target.matches('[data-placement-type]') && state.placementForm) {
      state.placementForm.objectType = event.target.value;
      state.placementForm.objectId = event.target.value === '组合活动' ? data.comboActivities[0].id : data.activityConfigs.filter(function (item) { return item.status === '已启用' && item.trigger !== '后台统一推送' && item.trigger !== '用户行为触发'; })[0].id;
      syncPlacementObject(state.placementForm);
      window.SAApp.render(); return;
    }
    if (event.target.matches('[data-placement-object]') && state.placementForm) {
      state.placementForm.objectId = event.target.value;
      syncPlacementObject(state.placementForm);
      window.SAApp.render(); return;
    }
    if (event.target.matches('[data-placement-field]') && state.placementForm) {
      state.placementForm[event.target.getAttribute('data-placement-field')] = event.target.value;
      return;
    }
    if (event.target.matches('[data-access-checkpoint]') && state.accessDraft) {
      state.accessDraft.checkpoints = Array.prototype.slice.call(document.querySelectorAll('[data-access-checkpoint]:checked')).map(function (node) { return node.value; });
      event.target.closest('.checkpoint-option').classList.toggle('checked',event.target.checked);
      return;
    }
    if (event.target.matches('[data-activity-field]')) updateField(event.target);
  }

  function onNavigate(route) {
    if (route === 'activity-create' && !state.form) prepare('create');
    if (route === 'sa-placement-edit' && !state.placementForm) preparePlacement('create');
  }

  window.ActivityConfigPages = {
    pages: pages,
    isPage: function (route) { return !!pages[route]; },
    render: render,
    pageActions: pageActions,
    infoStrip: infoStrip,
    handleClick: handleClick,
    handleChange: handleChange,
    onNavigate: onNavigate
  };
})();
