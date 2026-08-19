(function () {
  'use strict';

  var data = window.SAFrontData;
  var common = window.SAFrontCommon;
  var esc = common.escapeHtml;
  var validRoutes = [
    'sa-select', 'sa-select-activity-detail', 'sa-empty', 'sa-qr', 'sa-poster-editor', 'sa-poster-preview', 'qr-invalid',
    'sa-data-overview', 'sa-activity-list', 'sa-activity-detail', 'sa-participation-detail',
    'sa-coupon-list', 'sa-coupon-detail',
    'activity-aggregation', 'activity-aggregation-unbound', 'activity-aggregation-offline'
  ];

  function activityDisplayName(activity) {
    if (!activity) return '';
    if (!activity.isCombo) return activity.name;
    return String(activity.displayName || '').trim() || activity.name;
  }

  function activityScopeText(activity) {
    if (!activity || !activity.storeScope || activity.storeScope.mode !== 'SPECIFIED') return activity.shareNote || '全部门店';
    return '指定' + (activity.storeScope.storeIds || []).length + '家门店';
  }

  function isActivityVisibleToSource(activity) {
    if (activity.saPlacementEnabled === false || activity.activityState === 'INACTIVE') return false;
    if (!activity.storeScope || activity.storeScope.mode !== 'SPECIFIED') return true;
    return (activity.storeScope.storeIds || []).indexOf(data.source.storeId) >= 0;
  }

  function saAvailableActivities() {
    return data.activities.filter(isActivityVisibleToSource);
  }

  var state = {
    vehicleId: data.user.defaultVehicleId,
    saSelected: {},
    generatedActivityIds: saAvailableActivities().map(function (activity) { return activity.id; }),
    selected: {},
    completed: {},
    reportRange: '30d',
    reportActivityId: data.saReport.activities[0].id,
    reportParticipationId: data.saReport.activities[0].records[0].id,
    reportCouponId: data.saReport.coupons[0].id,
    saDetailActivityId: data.activities[0].id,
    currentSceneId: data.qr.nextSceneId,
    previousSceneId: data.source.sceneId,
    qrVersion: Number(String(data.qr.snapshotVersion).replace(/\D/g, '')) || 3,
    qrGeneration: 0,
    invalidReason: 'replaced',
    selectedDurationMinutes: data.qr.defaultMinutes,
    pendingDurationMinutes: data.qr.defaultMinutes,
    durationAction: 'generate',
    posterTitle: data.poster.defaultTitle,
    posterSubtitle: data.poster.defaultSubtitle,
    posterGuide: data.poster.defaultGuide,
    posterMode: 'template',
    posterUploadName: '',
    posterUploadUrl: ''
  };

  data.activities.forEach(function (activity) { state.saSelected[activity.id] = isActivityVisibleToSource(activity); });

  function route() {
    var value = window.location.hash.replace(/^#/, '').split('?')[0];
    return validRoutes.indexOf(value) >= 0 ? value : 'sa-select';
  }

  function hashParam(name) {
    var query = window.location.hash.split('?')[1] || '';
    var params = new URLSearchParams(query);
    return params.get(name);
  }

  function go(page) {
    common.closeSheet();
    if (route() === page) render();
    else window.location.hash = page;
  }

  function currentVehicle() {
    return data.vehicles.find(function (vehicle) { return vehicle.id === state.vehicleId; }) || data.vehicles[0];
  }

  function hasVehicleContext() {
    return route() !== 'activity-aggregation-unbound';
  }

  function sharedActivities() {
    return data.activities.filter(function (activity) {
      return state.generatedActivityIds.indexOf(activity.id) >= 0 && isActivityVisibleToSource(activity);
    });
  }

  function saSelectedActivities() {
    return saAvailableActivities().filter(function (activity) { return !!state.saSelected[activity.id]; });
  }

  function completionKey(activity) {
    if (activity.level === 'number') return 'number:' + activity.id;
    if (activity.isCombo) return 'combo:' + activity.id + ':' + (hasVehicleContext() ? state.vehicleId : 'unbound');
    return state.vehicleId + ':' + activity.id;
  }

  function activityById(id) {
    return data.activities.find(function (activity) { return activity.id === id; }) || data.activities[0];
  }

  function baseActivityStatus(activity) {
    if (state.completed[completionKey(activity)]) return 'participated';
    if (!hasVehicleContext() && activity.level !== 'number') return 'need-bind';
    if (activity.level === 'certified' && !currentVehicle().certified) return 'need-certified';
    return activity.status.all || activity.status[state.vehicleId] || 'ineligible';
  }

  function matchedComboRewards(activity) {
    if (!activity.isCombo || !hasVehicleContext()) return [];
    var rewards = activity.matchedRewards[state.vehicleId] || [];
    return Array.isArray(rewards) ? rewards : [rewards];
  }

  function comboCoupons(activity) {
    return matchedComboRewards(activity).reduce(function (items, reward) {
      return items.concat(reward.coupons || []);
    }, []);
  }

  function comboBenefits(activity) {
    return matchedComboRewards(activity).reduce(function (items, reward) {
      return items.concat(reward.benefits || []);
    }, []);
  }

  function activityReward(activity) {
    var matched = matchedComboRewards(activity);
    return matched.length ? matched.map(function (item) { return item.reward; }).join(' + ') : activity.reward;
  }

  function mutexPeers(activity) {
    if (!activity.mutex) return [];
    return sharedActivities().filter(function (candidate) {
      return candidate.id !== activity.id && candidate.mutex && candidate.mutex.group === activity.mutex.group;
    });
  }

  function activityStatus(activity) {
    var ownStatus = baseActivityStatus(activity);
    if (ownStatus === 'participated') return ownStatus;
    if (activity.mutex && mutexPeers(activity).some(function (peer) { return baseActivityStatus(peer) === 'participated'; })) return 'mutex-participated';
    return ownStatus;
  }

  function resetDefaultSelection() {
    state.selected = {};
    var selectedMutexGroups = {};
    sharedActivities().forEach(function (activity) {
      if (activityStatus(activity) !== 'eligible') return;
      if (activity.mutex && selectedMutexGroups[activity.mutex.group]) return;
      state.selected[activity.id] = true;
      if (activity.mutex) selectedMutexGroups[activity.mutex.group] = activity.id;
    });
  }

  function selectedActivities() {
    return sharedActivities().filter(function (activity) {
      return state.selected[activity.id] && activityStatus(activity) === 'eligible';
    });
  }

  function typeLabel(type) {
    return type === 'lottery' ? '抽奖' : '领券';
  }

  function levelLabel(level) {
    var item = data.levels.find(function (candidate) { return candidate.key === level; });
    return item ? item.title.replace('活动', '') : '';
  }

  function statusMarkup(status) {
    if (status === 'participated') return '<span class="activity-state done">已参与</span>';
    if (status === 'mutex-participated') return '<span class="activity-state locked">互斥已参与</span>';
    if (status === 'need-certified') return '<span class="activity-state locked">需认证</span>';
    if (status === 'need-bind') return '<span class="activity-state locked">需绑车</span>';
    return '<span class="activity-state available">可参与</span>';
  }

  function usesSaBlueTheme() {
    var current = route();
    return current.indexOf('sa-') === 0 || current === 'qr-invalid';
  }

  function mobileShell(title, body, footer, headerAction) {
    var withAction = headerAction ? ' with-action' : '';
    var blueTheme = usesSaBlueTheme();
    document.body.classList.toggle('sa-blue-context', blueTheme);
    return '<div class="mobile-page' + (blueTheme ? ' sa-blue-theme' : '') + '">' +
      '<div class="mobile-status"><img src="assets/images/mobile-statusbar.png" alt="手机状态栏"></div>' +
      '<header class="mobile-header' + withAction + '"><button class="header-icon" data-back type="button" aria-label="返回"><img src="assets/images/back.png" alt=""></button><h1>' + esc(title) + '</h1>' + (headerAction || '<span class="header-placeholder"></span>') + '</header>' +
      body + (footer || '') + '</div>';
  }

  function saActivityCard(activity) {
    var checked = !!state.saSelected[activity.id];
    return '<article class="sa-activity-card ' + (checked ? 'selected' : '') + '">' +
      '<label class="sa-card-check"><input type="checkbox" data-sa-check="' + activity.id + '" ' + (checked ? 'checked' : '') + '><span></span></label>' +
      '<button class="sa-card-main sa-card-detail" data-open-sa-activity="' + activity.id + '" type="button"><div class="sa-card-title"><h3>' + esc(activityDisplayName(activity)) + '</h3><span class="level-tag">' + esc(levelLabel(activity.level)) + '</span>' + (activity.isCombo ? '<span class="combo-tag">组合活动</span>' : '') + (activity.mutex ? '<span class="mutex-tag">互斥</span>' : '') + '</div>' +
      '<p>' + esc(activity.description) + '</p><div class="sa-card-reward"><span class="type-tag ' + (activity.type === 'lottery' ? 'lottery' : '') + '">' + typeLabel(activity.type) + '</span><strong>' + esc(activity.reward) + '</strong></div>' +
      '<div class="sa-card-meta"><span>' + esc(activity.expiry) + '</span><span>' + esc(activityScopeText(activity)) + '</span></div><div class="sa-card-detail-link">查看活动详情 <span>›</span></div></button></article>';
  }

  function saActivitySection(level) {
    var activities = saAvailableActivities().filter(function (activity) { return activity.level === level.key; });
    return '<section class="activity-section sa-section"><div class="section-head"><div><h2>' + esc(level.title) + '</h2><p>' + esc(level.note) + '</p></div><span>' + activities.length + '项</span></div><div class="activity-list">' + activities.map(saActivityCard).join('') + '</div></section>';
  }

  function renderSaSelect() {
    var selectedCount = saSelectedActivities().length;
    var allSelected = selectedCount === saAvailableActivities().length;
    document.title = '选择活动';
    return mobileShell('选择活动', '<div class="page-scroll sa-select-scroll"><section class="sa-identity-card"><div class="sa-avatar">SA</div><div><small>当前服务助手</small><strong>' + esc(data.source.saName) + ' · ' + esc(data.source.saId) + '</strong><span>' + esc(data.source.store) + '</span></div><em>身份已绑定</em></section>' +
      '<section class="sa-rule-note"><strong>可分享活动</strong><span>已自动校验独立SA投放、组合活动状态与当前门店范围</span></section>' +
      '<label class="select-all-row"><span><strong>全部可投活动</strong><small>可选择全部或指定活动生成二维码</small></span><span class="select-count">已选' + selectedCount + '项</span><input type="checkbox" data-sa-select-all ' + (allSelected ? 'checked' : '') + '></label>' +
      data.levels.map(saActivitySection).join('') + '<div class="end-note">活动范围将在二维码生成时冻结</div></div>',
      '<footer class="bottom-action sa-generate-action"><p>每次生成唯一场景码，SA与门店不可修改</p><button class="primary-action" data-generate-qr type="button" ' + (selectedCount ? '' : 'disabled') + '>生成动态二维码' + (selectedCount ? '（' + selectedCount + '项）' : '') + '</button></footer>',
      '<button class="header-text-action" data-open-sa-data type="button">我的数据</button>');
  }

  function renderSaSelectActivityDetail() {
    var activity = activityById(state.saDetailActivityId);
    var rules = activity.rules.map(function (rule) { return '<li>' + esc(rule) + '</li>'; }).join('');
    var coupons = activity.isCombo ? '<div class="relation-card combo-relation"><span><strong>按用户当前VIN动态匹配</strong><small>用户可同时命中多个子活动，在同一张卡片内汇总展示全部卡券</small></span><em>' + activity.childCount + '套</em></div>' : activity.coupons.length ? activity.coupons.map(function (coupon) {
      return '<div class="relation-card"><span><strong>' + esc(coupon.name) + '</strong><small>有效期：' + esc(coupon.valid) + '</small></span><em>' + esc(coupon.quantity) + '</em></div>';
    }).join('') : '<div class="relation-empty">未关联卡券</div>';
    var benefits = activity.isCombo ? '<div class="relation-card combo-relation"><span><strong>权益随VIN全量匹配结果展示</strong><small>命中多个子活动时全部执行，不设优先级和顺序</small></span><em>动态</em></div>' : activity.benefits.length ? activity.benefits.map(function (benefit) {
      return '<div class="relation-card"><span><strong>' + esc(benefit.name) + '</strong><small>' + esc(benefit.note) + '</small></span><em>权益</em></div>';
    }).join('') : '<div class="relation-empty">未关联权益</div>';
    var mutex = activity.mutex ? '<section class="mobile-detail-section"><h2>互斥关系</h2><div class="mutex-detail-card"><span>' + esc(activity.mutex.scopeLabel) + '</span><strong>' + esc(activity.mutex.description) + '</strong><small>用户端同组仅可勾选1项，提交时再次校验。</small></div></section>' : '<section class="mobile-detail-section"><h2>互斥关系</h2><div class="relation-empty">无互斥活动</div></section>';
    document.title = '活动详情';
    return mobileShell('活动详情', '<div class="page-scroll detail-page-scroll select-activity-detail-scroll"><section class="detail-hero"><span>' + esc(levelLabel(activity.level)) + ' · ' + typeLabel(activity.type) + (activity.isCombo ? ' · 组合活动' : '') + (activity.mutex ? ' · 互斥活动' : '') + '</span><h2>' + esc(activityDisplayName(activity)) + '</h2><p>' + esc(activity.id) + ' · ' + esc(activity.expiry) + '</p></section><section class="mobile-detail-section"><h2>基本信息</h2>' + detailRow('活动时间', activity.period) + detailRow('适用品牌', activity.brand) + detailRow('适用范围', activityScopeText(activity)) + detailRow('领券方式', typeLabel(activity.type)) + '</section><section class="mobile-detail-section"><h2>活动规则</h2><ol class="activity-rule-list">' + rules + '</ol></section><section class="mobile-detail-section"><h2>关联卡券</h2><div class="relation-list">' + coupons + '</div></section><section class="mobile-detail-section"><h2>关联权益</h2><div class="relation-list">' + benefits + '</div></section>' + mutex + '<div class="privacy-note">查看详情不会改变当前活动勾选状态</div></div>');
  }

  function renderSaEmpty() {
    document.title = '选择活动';
    return mobileShell('选择活动', '<div class="page-scroll empty-page-scroll"><section class="sa-identity-card"><div class="sa-avatar">SA</div><div><small>当前服务助手</small><strong>' + esc(data.source.saName) + ' · ' + esc(data.source.saId) + '</strong><span>' + esc(data.source.store) + '</span></div><em>身份已绑定</em></section><section class="empty-business-card"><strong>当前暂无可投活动</strong><p>暂未找到同时满足已发布、允许SA分享及当前门店范围的活动。</p><span>后台统一推券活动不会出现在这里</span><button data-empty-refresh type="button">重新加载</button></section></div>', '', '<button class="header-text-action" data-open-sa-data type="button">我的数据</button>');
  }

  function snapshotRows() {
    return sharedActivities().map(function (activity) {
      return '<div class="snapshot-row"><span><strong>' + esc(activityDisplayName(activity)) + '</strong><small>' + esc(levelLabel(activity.level)) + ' · ' + (activity.isCombo ? '组合活动 · ' : '') + typeLabel(activity.type) + '</small></span><em>' + esc(activity.id) + '</em></div>';
    }).join('');
  }

  function durationLabel(minutes) {
    if (minutes === -1) return '长期有效';
    if (minutes === 1440) return '1天';
    if (minutes >= 60) return (minutes / 60) + '小时';
    return minutes + '分钟';
  }

  function durationScopeActivities() {
    var activities = route() === 'sa-select' ? saSelectedActivities() : sharedActivities();
    return activities.length ? activities : saAvailableActivities();
  }

  function latestActivityEndText() {
    var latest = durationScopeActivities().reduce(function (current, activity) {
      var endText = String(activity.period || '').split('至').pop().trim();
      var parts = endText.split('-').map(Number);
      if (parts.length !== 3 || parts.some(function (part) { return !part; })) return current;
      var end = new Date(parts[0], parts[1] - 1, parts[2], 23, 59, 59);
      return !current || end > current ? end : current;
    }, null);
    if (!latest) return '活动结束时';
    var pad = function (value) { return String(value).padStart(2,'0'); };
    return pad(latest.getMonth() + 1) + '-' + pad(latest.getDate()) + ' ' + pad(latest.getHours()) + ':' + pad(latest.getMinutes()) + ':' + pad(latest.getSeconds());
  }

  function qrExpiryText(minutes) {
    if (minutes === -1) return latestActivityEndText();
    var parts = data.qr.generatedAt.split(/[- :]/).map(Number);
    var date = new Date(parts[0],parts[1] - 1,parts[2],parts[3],parts[4],parts[5]);
    date.setMinutes(date.getMinutes() + minutes);
    var pad = function (value) { return String(value).padStart(2,'0'); };
    return pad(date.getMonth() + 1) + '-' + pad(date.getDate()) + ' ' + pad(date.getHours()) + ':' + pad(date.getMinutes()) + ':' + pad(date.getSeconds());
  }

  function durationDescription(minutes) {
    return minutes === -1 ? '长期有效 · 至所选活动最晚结束时间' : '有效时长 ' + durationLabel(minutes) + ' · 失效后请重新生成';
  }

  function posterMarkup() {
    var count = state.generatedActivityIds.length;
    var uploaded = state.posterMode === 'upload' && state.posterUploadUrl;
    var uploadBackground = uploaded ? '<img class="poster-upload-bg" src="' + esc(state.posterUploadUrl) + '" alt="SA上传的自定义海报底图">' : '';
    return '<section class="share-poster-card' + (uploaded ? ' uploaded' : '') + '" data-poster-card>' + uploadBackground + '<div class="poster-glow glow-one"></div><div class="poster-glow glow-two"></div><div class="poster-content"><div class="poster-brand-row"><span>东风日产 · 专属礼遇</span><em>SA推荐</em></div><h2 data-poster-preview-title>' + esc(state.posterTitle) + '</h2><p data-poster-preview-subtitle>' + esc(state.posterSubtitle) + '</p><div class="poster-activity-count"><strong>' + count + '项</strong><span>活动已为您精选</span></div><div class="poster-qr-panel"><img src="assets/images/sa-demo-qr.png" alt="活动分享二维码"><div><strong data-poster-preview-guide>' + esc(state.posterGuide) + '</strong></div></div><div class="poster-sa-row"><span class="poster-sa-avatar">SA</span><span><strong>' + esc(data.source.saName) + ' · ' + esc(data.source.saId) + '</strong><small>' + esc(data.source.store) + '</small></span></div><div class="poster-validity"><span>二维码有效期</span><strong>' + durationLabel(state.selectedDurationMinutes) + ' · 至 ' + qrExpiryText(state.selectedDurationMinutes) + '</strong></div></div></section>';
  }

  function renderQr() {
    var count = state.generatedActivityIds.length;
    document.title = '动态二维码';
    return mobileShell('动态二维码', '<div class="page-scroll qr-page-scroll"><section class="qr-result-card"><span class="qr-success">二维码已生成</span><h2>请用户使用微信扫码参与</h2><div class="qr-image-wrap"><img src="assets/images/sa-demo-qr.png" alt="SA动态活动二维码"></div><div class="qr-expiry"><strong>有效期至 ' + qrExpiryText(state.selectedDurationMinutes) + '</strong><span>' + durationDescription(state.selectedDurationMinutes) + '</span></div><button class="poster-entry" data-create-poster type="button"><span><strong>制作活动分享海报</strong><small>嵌入二维码与SA信息，可编辑分享文案</small></span><em>›</em></button></section>' +
      '<section class="qr-info-card"><div class="qr-info-head"><strong>活动冻结快照</strong><span>' + count + '项 · V' + state.qrVersion + '</span></div><div class="qr-data-grid"><div><small>场景ID</small><strong>' + esc(state.currentSceneId) + '</strong></div><div><small>生成时间</small><strong>07-17 14:32</strong></div><div><small>有效时长 / 版本</small><strong>' + durationLabel(state.selectedDurationMinutes) + ' · ' + esc(data.qr.configVersion) + '</strong></div><div><small>来源SA</small><strong>' + esc(data.source.saName) + ' · ' + esc(data.source.saId) + '</strong></div><div><small>来源门店</small><strong>' + esc(data.source.store) + '</strong></div></div><div class="snapshot-list">' + snapshotRows() + '</div><button class="text-row-action" data-edit-selection type="button">修改活动范围</button></section><div class="end-note">新活动和后台后续参数变更不会影响本二维码</div></div>',
      '<footer class="qr-bottom-action"><button class="secondary-action" data-regenerate type="button">重新生成</button><button class="primary-action" data-simulate-scan type="button">模拟用户扫码</button></footer>');
  }

  function posterField(label, key, value, maxLength, placeholder) {
    return '<label class="poster-edit-field"><span><strong>' + esc(label) + '</strong><small data-poster-count="' + key + '">' + String(value).length + '/' + maxLength + '</small></span><input data-poster-input="' + key + '" maxlength="' + maxLength + '" value="' + esc(value) + '" placeholder="' + esc(placeholder) + '"></label>';
  }

  function renderPosterEditor() {
    document.title = '编辑分享海报';
    var uploadNote = state.posterUploadName ? '已上传：' + state.posterUploadName : 'JPG/PNG，10MB以内，建议3:4';
    return mobileShell('编辑分享海报', '<div class="page-scroll poster-editor-scroll"><section class="poster-editor-note"><span><strong>编辑海报文案</strong><small>二维码、来源SA和门店信息不可修改</small></span><button data-reset-poster type="button">恢复默认</button></section><section class="poster-source-card"><div><strong>海报来源</strong><small>上传自定义底图后，系统仍统一叠加二维码与SA信息</small></div><div class="poster-source-options"><button class="' + (state.posterMode === 'template' ? 'active' : '') + '" data-poster-mode="template" type="button"><strong>系统模板</strong><small>使用品牌蓝色模板</small></button><label class="' + (state.posterMode === 'upload' ? 'active' : '') + '"><input data-poster-upload type="file" accept="image/jpeg,image/png"><strong>上传自定义海报</strong><small>' + esc(uploadNote) + '</small></label></div></section><div class="poster-preview-stage">' + posterMarkup() + '</div><section class="poster-form-card">' + posterField('海报标题','title',state.posterTitle,data.poster.titleMaxLength,'请输入海报标题') + posterField('副标题','subtitle',state.posterSubtitle,data.poster.subtitleMaxLength,'请输入活动说明') + posterField('扫码引导语','guide',state.posterGuide,data.poster.guideMaxLength,'请输入扫码引导语') + '</section><div class="end-note">生成后仍可返回继续编辑；重新生成二维码后旧海报内二维码同步失效</div></div>', '<footer class="poster-bottom-action"><button class="primary-action" data-generate-poster type="button">生成分享海报</button></footer>');
  }

  function renderPosterPreview() {
    document.title = '分享海报';
    return mobileShell('分享海报', '<div class="page-scroll poster-result-scroll"><section class="poster-result-head"><span>海报已生成</span><strong>可保存或直接分享给客户</strong><small>海报已嵌入当前二维码及来源SA信息</small></section><div class="poster-preview-stage final">' + posterMarkup() + '</div><button class="text-row-action poster-edit-again" data-edit-poster type="button">继续编辑文案</button><div class="end-note">二维码来源仍以用户最终成功执行触点为准</div></div>', '<footer class="qr-bottom-action poster-share-actions"><button class="secondary-action" data-save-poster type="button">保存到相册</button><button class="primary-action" data-share-poster type="button">分享给客户</button></footer>');
  }

  function renderQrInvalid() {
    var reason = hashParam('reason') || state.invalidReason;
    var expired = reason === 'expired';
    var title = expired ? '二维码已过期' : '二维码已失效';
    var copy = expired ? '该二维码已超过有效期，请联系服务顾问重新获取。' : '服务顾问已重新生成二维码，当前旧码不再接受新的扫码。';
    document.title = title;
    return mobileShell('二维码状态', '<div class="page-scroll invalid-page-scroll"><section class="invalid-card"><img src="assets/images/close.png" alt=""><h2>' + title + '</h2><p>' + copy + '</p><div><span>场景ID</span><strong>' + esc(state.previousSceneId) + '</strong></div><button data-invalid-done type="button">我知道了</button></section><p class="invalid-note">已建立的历史扫码会话将在提交时重新校验活动状态</p></div>');
  }

  function reportTabs(active) {
    var tabs = [
      {key:'overview', route:'sa-data-overview', label:'概览'},
      {key:'activity', route:'sa-activity-list', label:'活动'},
      {key:'coupon', route:'sa-coupon-list', label:'卡券'}
    ];
    return '<nav class="report-tabs">' + tabs.map(function (tab) {
      return '<button class="' + (active === tab.key ? 'active' : '') + '" data-report-route="' + tab.route + '" type="button">' + tab.label + '</button>';
    }).join('') + '</nav>';
  }

  function reportOwner() {
    return '<section class="report-owner"><span>仅统计本人数据</span><strong>' + esc(data.source.saName) + ' · ' + esc(data.source.saId) + '</strong><small>' + esc(data.source.store) + '</small></section>';
  }

  function reportShell(active, content) {
    return mobileShell('我的SA数据', reportTabs(active) + '<div class="page-scroll report-page-scroll"><div class="sa-watermark">' + esc(data.source.saName) + ' ' + esc(data.source.saId) + '</div>' + content + '</div>', '', '<button class="header-text-action" data-back-to-generate type="button">生成码</button>');
  }

  function renderReportOverview() {
    var summarySource = state.reportRange === '7d' ? data.saReport.summary7d : data.saReport.summary;
    var ratioSource = state.reportRange === '7d' ? data.saReport.ratios7d : data.saReport.ratios;
    var summary = summarySource.map(function (item) {
      return '<div class="report-kpi"><span>' + esc(item.label) + '</span><strong>' + esc(item.value) + '</strong><small>' + esc(item.note) + '</small></div>';
    }).join('');
    var ratios = ratioSource.map(function (item) {
      return '<div class="ratio-row"><span><strong>' + esc(item.label) + '</strong><small>' + esc(item.note) + '</small></span><em>' + esc(item.value) + '</em></div>';
    }).join('');
    var maxScan = Math.max.apply(null, data.saReport.trend.map(function (item) { return item.scan; }));
    var trend = data.saReport.trend.map(function (item) {
      var scanHeight = Math.round(item.scan / maxScan * 72);
      var partHeight = Math.round(item.participation / maxScan * 72);
      return '<div class="mobile-trend-col"><div class="mobile-trend-bars"><i style="height:' + scanHeight + 'px"></i><i class="primary" style="height:' + partHeight + 'px"></i></div><span>' + esc(item.day.slice(3)) + '</span></div>';
    }).join('');
    document.title = '我的SA数据';
    return reportShell('overview', reportOwner() + '<div class="report-toolbar"><div><strong>数据概览</strong><span>统计口径与后台SA报表一致</span></div><div class="range-switch"><button data-report-range="7d" class="' + (state.reportRange === '7d' ? 'active' : '') + '" type="button">近7日</button><button data-report-range="30d" class="' + (state.reportRange === '30d' ? 'active' : '') + '" type="button">近30日</button></div></div><section class="report-kpi-grid">' + summary + '</section><section class="report-panel"><div class="report-panel-head"><strong>转化与核销</strong><span>' + (state.reportRange === '7d' ? '近7日' : '近30日') + '</span></div>' + ratios + '</section><section class="report-panel"><div class="report-panel-head"><strong>近7日趋势</strong><span><i></i>扫码 <i class="primary"></i>参与</span></div><div class="mobile-trend">' + trend + '</div></section><section class="report-shortcuts"><button data-report-route="sa-activity-list" type="button"><strong>查看活动数据</strong><span>3个活动及参与记录</span></button><button data-report-route="sa-coupon-list" type="button"><strong>查看卡券数据</strong><span>3个券模板生命周期</span></button></section><div class="privacy-note">手机号和VIN已脱敏，用户统一标识不展示</div>');
  }

  function reportActivityById(id) {
    return data.saReport.activities.find(function (item) { return item.id === id; }) || data.saReport.activities[0];
  }

  function reportCouponById(id) {
    return data.saReport.coupons.find(function (item) { return item.id === id; }) || data.saReport.coupons[0];
  }

  function renderReportActivityList() {
    var cards = data.saReport.activities.map(function (item) {
      return '<button class="report-list-card" data-open-report-activity="' + item.id + '" type="button"><div class="report-list-title"><span><strong>' + esc(item.name) + '</strong><small>' + esc(item.id) + '</small></span><em>' + esc(item.status) + '</em></div><div class="report-list-tags"><span>' + esc(levelLabel(item.level)) + '</span><span>' + typeLabel(item.type) + '</span></div><div class="report-list-metrics"><span><small>参与</small><strong>' + item.participation + '</strong></span><span><small>发券</small><strong>' + item.coupons + '</strong></span><span><small>转化率</small><strong>' + esc(item.conversion) + '</strong></span></div><p>最近参与 ' + esc(item.last) + '</p></button>';
    }).join('');
    document.title = '我的SA数据-活动';
    return reportShell('activity', reportOwner() + '<div class="report-list-summary"><span>活动数据</span><strong>' + data.saReport.activities.length + '个活动</strong></div><div class="report-list">' + cards + '</div><div class="privacy-note">仅展示最终来源SA为本人的参与数据</div>');
  }

  function renderReportActivityDetail() {
    var item = reportActivityById(state.reportActivityId);
    var records = item.records.map(function (record) {
      return '<button class="record-row" data-open-participation="' + record.id + '" type="button"><span><strong>' + esc(record.mobile) + '</strong><small>' + esc(record.time) + ' · ' + esc(record.level) + '</small></span><span><em>' + esc(record.result) + '</em><small>' + record.couponCount + '张券</small></span></button>';
    }).join('');
    document.title = '活动详情';
    return mobileShell('活动详情', '<div class="page-scroll detail-page-scroll"><section class="detail-hero"><span>' + esc(levelLabel(item.level)) + ' · ' + typeLabel(item.type) + '</span><h2>' + esc(item.name) + '</h2><p>' + esc(item.id) + ' · ' + esc(item.status) + '</p></section><section class="detail-metric-grid"><div><small>参与数</small><strong>' + item.participation + '</strong></div><div><small>发券数</small><strong>' + item.coupons + '</strong></div><div><small>转化率</small><strong>' + esc(item.conversion) + '</strong></div><div><small>最近参与</small><strong>' + esc(item.last.slice(6)) + '</strong></div></section><section class="report-panel"><div class="report-panel-head"><strong>参与记录</strong><span>共' + item.participation + '条</span></div><div class="record-list">' + records + '</div><button class="text-row-action" data-all-records type="button">查看全部记录</button></section><div class="privacy-note">手机号和VIN已脱敏，用户统一标识不展示</div></div>');
  }

  function currentParticipation() {
    var activity = reportActivityById(state.reportActivityId);
    var record = activity.records.find(function (item) { return item.id === state.reportParticipationId; });
    if (record) return {activity:activity, record:record};
    for (var i = 0; i < data.saReport.activities.length; i += 1) {
      record = data.saReport.activities[i].records.find(function (item) { return item.id === state.reportParticipationId; });
      if (record) return {activity:data.saReport.activities[i], record:record};
    }
    return {activity:activity, record:activity.records[0]};
  }

  function detailRow(label, value) {
    return '<div class="mobile-detail-row"><span>' + esc(label) + '</span><strong>' + esc(value) + '</strong></div>';
  }

  function renderParticipationDetail() {
    var current = currentParticipation();
    var record = current.record;
    document.title = '参与记录详情';
    return mobileShell('参与记录详情', '<div class="page-scroll detail-page-scroll"><section class="detail-status-card"><span>执行结果</span><strong>' + esc(record.result) + '</strong><small>' + esc(record.id) + '</small></section><section class="mobile-detail-section"><h2>活动信息</h2>' + detailRow('活动名称', current.activity.name) + detailRow('参与级别', record.level) + detailRow('执行方式', record.type) + detailRow('参与时间', record.time) + '</section><section class="mobile-detail-section"><h2>用户与车辆（已脱敏）</h2>' + detailRow('手机号码', record.mobile) + detailRow('执行VIN', record.vin) + '</section><section class="mobile-detail-section"><h2>执行与来源</h2>' + detailRow('来源SA', data.source.saName + ' · ' + data.source.saId) + detailRow('来源门店', record.store) + detailRow('准入校验', record.validation) + detailRow('关联卡券', record.coupons) + '</section><div class="privacy-note">不展示用户统一标识，仅限本人查看</div></div>');
  }

  function renderReportCouponList() {
    var cards = data.saReport.coupons.map(function (item) {
      return '<button class="report-list-card coupon-report-card" data-open-report-coupon="' + item.id + '" type="button"><div class="report-list-title"><span><strong>' + esc(item.name) + '</strong><small>' + esc(item.id) + '</small></span><em>' + esc(item.status) + '</em></div><p>来源活动：' + esc(item.activity) + '</p><div class="report-list-metrics"><span><small>发放</small><strong>' + item.issued + '</strong></span><span><small>已核销</small><strong>' + item.redeemed + '</strong></span><span><small>核销率</small><strong>' + esc(item.redemptionRate) + '</strong></span></div><p>最近发放 ' + esc(item.last) + ' · 跨店核销' + item.cross + '张</p></button>';
    }).join('');
    document.title = '我的SA数据-卡券';
    return reportShell('coupon', reportOwner() + '<div class="report-list-summary"><span>卡券数据</span><strong>' + data.saReport.coupons.length + '个券模板</strong></div><div class="report-list">' + cards + '</div><div class="privacy-note">仅统计本人活动产生的卡券实例</div>');
  }

  function renderReportCouponDetail() {
    var item = reportCouponById(state.reportCouponId);
    var timeline = item.timeline.map(function (row) { return '<li><span></span><strong>' + esc(row) + '</strong></li>'; }).join('');
    document.title = '卡券详情';
    return mobileShell('卡券详情', '<div class="page-scroll detail-page-scroll"><section class="detail-hero coupon-detail-hero"><span>' + esc(item.owner) + ' · ' + esc(item.status) + '</span><h2>' + esc(item.name) + '</h2><p>' + esc(item.id) + '</p></section><section class="detail-metric-grid"><div><small>发放数</small><strong>' + item.issued + '</strong></div><div><small>已核销</small><strong>' + item.redeemed + '</strong></div><div><small>已失效</small><strong>' + item.expired + '</strong></div><div><small>核销率</small><strong>' + esc(item.redemptionRate) + '</strong></div></section><section class="mobile-detail-section"><h2>卡券信息</h2>' + detailRow('来源活动', item.activity) + detailRow('有效期', item.valid) + detailRow('跨店核销', item.cross + '张') + detailRow('最近发放', item.last) + '</section><section class="mobile-detail-section"><h2>最近生命周期</h2><ol class="coupon-timeline">' + timeline + '</ol></section><div class="privacy-note">仅展示当前SA权限范围内的汇总数据</div></div>');
  }

  function mutexNotice(activity, status, checked) {
    if (!activity.mutex) return '';
    var peers = mutexPeers(activity);
    var peerNames = peers.map(function (peer) { return '“' + peer.name + '”'; }).join('、');
    if (status === 'mutex-participated') {
      var participatedPeer = peers.find(function (peer) { return baseActivityStatus(peer) === 'participated'; });
      return '<div class="mutex-notice locked">已参加“' + esc(participatedPeer ? participatedPeer.name : '同组活动') + '”，当前活动不可再参与</div>';
    }
    if (status !== 'eligible') return '';
    if (checked) return '<div class="mutex-notice selected">已选中；选择另一项互斥活动时将自动切换</div>';
    return '<div class="mutex-notice">与' + esc(peerNames) + '互斥，同组仅可选择1项</div>';
  }

  function activityCard(activity) {
    var status = activityStatus(activity);
    var selectable = status === 'eligible';
    var checked = selectable && !!state.selected[activity.id];
    var action = '';
    if (status === 'need-certified') action = '<button class="upgrade-link" data-upgrade="certified" type="button">去认证</button>';
    if (status === 'need-bind') action = '<button class="upgrade-link" data-upgrade="bind" type="button">去绑车</button>';
    var rewardContent = '<div class="reward-row"><span class="type-tag ' + (activity.type === 'lottery' ? 'lottery' : '') + '">' + typeLabel(activity.type) + '</span><strong>' + esc(activityReward(activity)) + '</strong></div>';
    if (activity.isCombo && !hasVehicleContext()) rewardContent = '';
    if (activity.isCombo && hasVehicleContext()) {
      var comboRewards = matchedComboRewards(activity);
      var matchedCoupons = comboCoupons(activity);
      var matchedBenefits = comboBenefits(activity);
      var couponRows = matchedCoupons.map(function (coupon) {
        return '<div class="combo-reward-item"><strong>' + esc(coupon.name) + '</strong><small>' + esc(coupon.quantity + ' · ' + coupon.valid) + '</small></div>';
      }).join('');
      rewardContent = comboRewards.length
        ? '<div class="combo-reward-visible"><span>当前VIN可领取 · 命中' + comboRewards.length + '个子活动</span><div class="combo-reward-list">' + couponRows + '</div><small>关联权益：' + esc(matchedBenefits.map(function (benefit) { return benefit.name; }).join('、') || '无') + '</small><em>已汇总全部匹配结果，一键参与时同时发放</em></div>'
        : '<div class="combo-reward-visible empty"><span>当前VIN匹配结果</span><strong>暂未匹配到专属权益</strong><small>系统按当前VIN实时匹配</small></div>';
    }
    return '<article class="activity-card ' + (selectable ? '' : 'disabled') + ' ' + (activity.isCombo ? 'combo-activity-card' : '') + '" data-activity-id="' + activity.id + '">' +
      '<label class="activity-select"><input type="checkbox" data-activity-check="' + activity.id + '" ' + (checked ? 'checked' : '') + ' ' + (selectable ? '' : 'disabled') + '><span class="check-copy"></span></label>' +
      '<div class="activity-content"><div class="activity-top"><div><h3>' + esc(activityDisplayName(activity)) + (activity.isCombo ? '<span class="combo-tag">组合活动</span>' : '') + (activity.mutex ? '<span class="mutex-tag">互斥</span>' : '') + '</h3><p>' + esc(activity.description) + '</p></div>' + statusMarkup(status) + '</div>' +
      rewardContent + mutexNotice(activity, status, checked) +
      '<div class="activity-meta"><span>' + esc(activity.expiry) + '</span><span>' + esc(activity.id) + '</span>' + action + '</div></div></article>';
  }

  function customerActivityList() {
    var activities = sharedActivities();
    if (!activities.length) return '';
    return '<section class="activity-section customer-activity-section"><div class="activity-list customer-activity-list">' + activities.map(activityCard).join('') + '</div></section>';
  }

  function renderAggregation() {
    var vehicle = currentVehicle();
    var bound = hasVehicleContext();
    var count = selectedActivities().length;
    var activityCount = sharedActivities().length;
    document.title = '专属活动';
    return mobileShell('专属活动', '<div class="page-scroll"><section class="source-card"><div><span>服务顾问推荐</span><strong>' + esc(data.source.saName) + '顾问为你精选了' + activityCount + '项活动</strong><small>' + esc(data.source.store) + '</small></div><span class="source-mark">SA</span></section>' +
      '<div class="prototype-scenario-switch"><span>组合活动演示</span><button class="' + (bound ? 'active' : '') + '" data-demo-bound type="button">已绑车</button><button class="' + (!bound ? 'active' : '') + '" data-demo-unbound type="button">未绑车</button></div>' +
      (bound ? '<button class="vehicle-switch" data-open-vehicle type="button"><span><small>当前执行车辆</small><strong>' + esc(vehicle.model) + ' · ' + esc(vehicle.plate) + '</strong><em>' + esc(vehicle.vin) + (vehicle.certified ? ' · 已认证' : ' · 未认证') + '</em></span><span class="switch-copy">切换</span></button>' : '<section class="vehicle-unbound-card"><span><small>当前车辆状态</small><strong>尚未绑定车辆</strong><em>绑车后才可按VIN匹配组合活动卡券</em></span><button data-upgrade="bind" type="button">去绑车</button></section>') +
      '<div class="list-summary"><span>以下为本次二维码包含的全部活动</span><strong>已选' + count + '项</strong></div>' +
      customerActivityList() + '<div class="end-note">活动资格与互斥关系以当前账号、所选车辆及提交时校验结果为准</div></div>',
      '<footer class="bottom-action"><p>将同时领券并完成所选抽奖活动</p><button class="primary-action" data-participate type="button" ' + (count ? '' : 'disabled') + '>一键参与' + (count ? '（' + count + '项）' : '') + '</button></footer>');
  }

  function render() {
    var app = document.getElementById('app');
    var current = route();
    if (!app) return;
    if (current === 'sa-qr') app.innerHTML = renderQr();
    else if (current === 'sa-poster-editor') app.innerHTML = renderPosterEditor();
    else if (current === 'sa-poster-preview') app.innerHTML = renderPosterPreview();
    else if (current === 'sa-select-activity-detail') app.innerHTML = renderSaSelectActivityDetail();
    else if (current === 'qr-invalid') app.innerHTML = renderQrInvalid();
    else if (current === 'sa-empty') app.innerHTML = renderSaEmpty();
    else if (current === 'sa-data-overview') app.innerHTML = renderReportOverview();
    else if (current === 'sa-activity-list') app.innerHTML = renderReportActivityList();
    else if (current === 'sa-activity-detail') app.innerHTML = renderReportActivityDetail();
    else if (current === 'sa-participation-detail') app.innerHTML = renderParticipationDetail();
    else if (current === 'sa-coupon-list') app.innerHTML = renderReportCouponList();
    else if (current === 'sa-coupon-detail') app.innerHTML = renderReportCouponDetail();
    else if (current === 'activity-aggregation' || current === 'activity-aggregation-unbound' || current === 'activity-aggregation-offline') app.innerHTML = renderAggregation();
    else app.innerHTML = renderSaSelect();
  }

  function renderPreservingScroll() {
    var scrollNode = document.querySelector('.page-scroll');
    var scrollTop = scrollNode ? scrollNode.scrollTop : 0;
    render();
    requestAnimationFrame(function () {
      var nextScroll = document.querySelector('.page-scroll');
      if (nextScroll) nextScroll.scrollTop = scrollTop;
    });
  }

  function openVehicleSheet() {
    var vehicle = currentVehicle();
    var rows = data.vehicles.map(function (item) {
      return '<button class="vehicle-option ' + (item.id === vehicle.id ? 'active' : '') + '" data-select-vehicle="' + item.id + '" type="button"><span><strong>' + esc(item.model) + ' · ' + esc(item.plate) + '</strong><small>' + esc(item.vin) + (item.isDefault ? ' · 默认车辆' : '') + '</small></span><input type="radio" ' + (item.id === vehicle.id ? 'checked' : '') + ' tabindex="-1"></button>';
    }).join('');
    common.openSheet('<div class="sheet-head"><h2>选择本次执行车辆</h2><button data-close-sheet type="button">关闭</button></div><div class="sheet-note">每次仅针对一辆VIN计算和执行活动</div><div class="vehicle-options">' + rows + '</div><button class="bind-other" data-upgrade="bind" type="button">绑定其他车辆</button>');
  }

  function selectedMutexConflict(activities) {
    var groups = {};
    for (var i = 0; i < activities.length; i += 1) {
      var activity = activities[i];
      if (!activity.mutex) continue;
      if (groups[activity.mutex.group]) return {first:groups[activity.mutex.group], second:activity};
      groups[activity.mutex.group] = activity;
    }
    return null;
  }

  function participate() {
    var activities = selectedActivities();
    var mutexConflict = selectedMutexConflict(activities);
    var offlineScenario = route() === 'activity-aggregation-offline';
    var offlineId = 'ACT-SA-20260701';
    var successCount = 0;
    var invalidCount = 0;
    if (!activities.length) {
      common.showToast('请先选择可参与活动');
      return;
    }
    if (mutexConflict) {
      common.showToast('“' + mutexConflict.first.name + '”与“' + mutexConflict.second.name + '”不可同时参与');
      resetDefaultSelection();
      renderPreservingScroll();
      return;
    }
    var resultRows = activities.map(function (activity) {
      if (offlineScenario && activity.id === offlineId) {
        invalidCount += 1;
        return '<div class="result-row invalid"><span class="result-dot invalid"></span><div><strong>' + esc(activityDisplayName(activity)) + '</strong><small>活动已下线，本次未执行</small></div><em>未处理</em></div>';
      }
      state.completed[completionKey(activity)] = true;
      successCount += 1;
      var result = activity.type === 'lottery' ? '抽奖成功' : '领取成功';
      var detail = activity.type === 'lottery' ? '恭喜中奖：200元保养券' : activityReward(activity) + '已发至卡包';
      if (activity.isCombo) {
        var comboMatches = matchedComboRewards(activity);
        var issuedCoupons = comboCoupons(activity);
        detail = '命中' + comboMatches.length + '个子活动，已全部发放：' + issuedCoupons.map(function (coupon) { return coupon.name; }).join('、');
      }
      return '<div class="result-row"><span class="result-dot"></span><div><strong>' + esc(activityDisplayName(activity)) + '</strong><small>' + esc(detail) + '</small></div><em>' + result + '</em></div>';
    }).join('');
    state.selected = {};
    render();
    var title = invalidCount ? successCount + '项成功，' + invalidCount + '项未处理' : activities.length + '项活动已处理';
    var desc = invalidCount ? '下线活动已拦截，其他有效活动继续执行' : '卡券已发放，抽奖活动已自动完成';
    common.openSheet('<div class="result-hero"><span>参与完成</span><h2>' + title + '</h2><p>' + desc + '</p></div><div class="result-list">' + resultRows + '</div><button class="sheet-primary" data-view-wallet type="button">查看我的卡券</button><button class="sheet-secondary" data-close-sheet type="button">完成</button>', {className:'result-sheet'});
  }

  function openUpgradeSheet(type) {
    var isBind = type === 'bind';
    var title = isBind ? '将前往绑定车辆' : '将前往车主认证';
    var description = isBind ? '绑定新车辆后，系统将重新判断可参与活动。' : '完成当前账号与车辆认证后，系统将重新判断可参与活动。';
    var action = isBind ? '继续去绑车' : '继续去认证';
    common.openSheet('<div class="upgrade-sheet"><span class="upgrade-label">参与资格提升</span><h2>' + title + '</h2><p>' + description + '</p><div class="leave-note"><strong>请注意</strong><span>完成后不会自动返回本活动页，请重新扫描SA二维码进入。</span></div><button class="sheet-primary" data-confirm-upgrade="' + type + '" type="button">' + action + '</button><button class="sheet-secondary" data-close-sheet type="button">暂不处理</button></div>');
  }

  function openDurationSheet(action) {
    state.durationAction = action || 'generate';
    state.pendingDurationMinutes = data.qr.defaultMinutes;
    var options = data.qr.durationOptions.map(function (item) {
      var checked = item.minutes === state.pendingDurationMinutes;
      var note = item.minutes === -1 ? item.note : item.minutes + '分钟';
      return '<label class="duration-choice ' + (checked ? 'active' : '') + '"><input type="radio" name="qrDuration" data-duration-choice value="' + item.minutes + '"' + (checked ? ' checked' : '') + '><span><strong>' + esc(item.label) + '</strong><small>' + esc(note) + '</small></span><i></i></label>';
    }).join('');
    var warning = state.durationAction === 'regenerate' ? '<div class="leave-note compact"><strong>重新生成规则</strong><span>新码生效后旧码不再接受新扫码；已建立会话提交时仍会重新校验。</span></div>' : '';
    common.openSheet('<div class="duration-drawer"><div class="sheet-head"><h2>选择二维码有效期</h2><button data-close-sheet type="button">关闭</button></div><p>可选5分钟至1天，或长期有效至所选活动结束</p><div class="duration-choice-grid">' + options + '</div><div class="duration-preview"><span>默认已选</span><strong data-duration-preview>' + durationLabel(state.pendingDurationMinutes) + '</strong><small data-duration-expiry>预计失效：' + qrExpiryText(state.pendingDurationMinutes) + '</small></div>' + warning + '<button class="sheet-primary" data-confirm-duration="' + state.durationAction + '" type="button">' + (state.durationAction === 'regenerate' ? '按此有效期重新生成' : '确认并生成二维码') + '</button><button class="sheet-secondary" data-close-sheet type="button">取消</button></div>', {className:'duration-sheet'});
  }

  function regenerateQr() {
    state.previousSceneId = state.currentSceneId;
    state.qrGeneration += 1;
    state.qrVersion += 1;
    var nextNumber = 89 + state.qrGeneration;
    state.currentSceneId = 'SCN-20260717-10086-' + String(nextNumber).padStart(4, '0');
    state.invalidReason = 'replaced';
    common.closeSheet();
    render();
    setTimeout(function () {
      common.openSheet('<div class="result-hero"><span>新二维码已生效</span><h2>原二维码已失效</h2><p>新sceneId：' + esc(state.currentSceneId) + '</p></div><div class="regenerate-summary"><span>旧sceneId</span><strong>' + esc(state.previousSceneId) + '</strong><small>不再接受新的扫码</small></div><button class="sheet-primary" data-close-sheet type="button">查看新二维码</button><button class="sheet-secondary" data-old-code type="button">模拟扫描旧码</button>');
    }, 220);
  }

  function handleBack() {
    var current = route();
    if (current === 'sa-qr' || current === 'sa-empty' || current === 'sa-data-overview' || current === 'sa-activity-list' || current === 'sa-coupon-list') go('sa-select');
    else if (current === 'sa-poster-editor') go('sa-qr');
    else if (current === 'sa-poster-preview') go('sa-poster-editor');
    else if (current === 'sa-select-activity-detail') go('sa-select');
    else if (current === 'sa-activity-detail') go('sa-activity-list');
    else if (current === 'sa-participation-detail') go('sa-activity-detail');
    else if (current === 'sa-coupon-detail') go('sa-coupon-list');
    else if (current === 'qr-invalid') go('sa-qr');
    else if (current === 'activity-aggregation' || current === 'activity-aggregation-unbound' || current === 'activity-aggregation-offline') common.showToast('原型演示：返回扫码前页面');
    else common.showToast('原型演示：返回服务助手首页');
  }

  document.addEventListener('click', function (event) {
    if (event.target.closest('[data-back]')) handleBack();
    if (event.target.closest('[data-open-sa-data]')) go('sa-data-overview');
    var saActivityDetail = event.target.closest('[data-open-sa-activity]');
    if (saActivityDetail) {
      state.saDetailActivityId = saActivityDetail.getAttribute('data-open-sa-activity');
      go('sa-select-activity-detail');
    }
    if (event.target.closest('[data-back-to-generate]')) go('sa-select');
    var reportRoute = event.target.closest('[data-report-route]');
    if (reportRoute) go(reportRoute.getAttribute('data-report-route'));
    var range = event.target.closest('[data-report-range]');
    if (range) {
      state.reportRange = range.getAttribute('data-report-range');
      renderPreservingScroll();
      common.showToast(state.reportRange === '7d' ? '已切换为近7日' : '已切换为近30日');
    }
    var activityLink = event.target.closest('[data-open-report-activity]');
    if (activityLink) {
      state.reportActivityId = activityLink.getAttribute('data-open-report-activity');
      go('sa-activity-detail');
    }
    var participationLink = event.target.closest('[data-open-participation]');
    if (participationLink) {
      state.reportParticipationId = participationLink.getAttribute('data-open-participation');
      go('sa-participation-detail');
    }
    var couponLink = event.target.closest('[data-open-report-coupon]');
    if (couponLink) {
      state.reportCouponId = couponLink.getAttribute('data-open-report-coupon');
      go('sa-coupon-detail');
    }
    if (event.target.closest('[data-all-records]')) common.showToast('已展示当前原型全部脱敏记录');
    if (event.target.closest('[data-generate-qr]')) {
      openDurationSheet('generate');
    }
    if (event.target.closest('[data-edit-selection]')) go('sa-select');
    if (event.target.closest('[data-create-poster]')) go('sa-poster-editor');
    if (event.target.closest('[data-generate-poster]')) go('sa-poster-preview');
    if (event.target.closest('[data-edit-poster]')) go('sa-poster-editor');
    if (event.target.closest('[data-reset-poster]')) {
      state.posterTitle = data.poster.defaultTitle;
      state.posterSubtitle = data.poster.defaultSubtitle;
      state.posterGuide = data.poster.defaultGuide;
      renderPreservingScroll();
      common.showToast('已恢复默认文案');
    }
    var posterMode = event.target.closest('[data-poster-mode]');
    if (posterMode) {
      state.posterMode = posterMode.getAttribute('data-poster-mode');
      renderPreservingScroll();
      common.showToast('已切换为系统模板');
    }
    if (event.target.closest('[data-save-poster]')) common.showToast('海报已保存到相册（原型演示）');
    if (event.target.closest('[data-share-poster]')) common.showToast('已调起系统分享面板（原型演示）');
    if (event.target.closest('[data-regenerate]')) openDurationSheet('regenerate');
    var durationConfirm = event.target.closest('[data-confirm-duration]');
    if (durationConfirm) {
      state.selectedDurationMinutes = state.pendingDurationMinutes;
      if (durationConfirm.getAttribute('data-confirm-duration') === 'regenerate') regenerateQr();
      else {
        state.generatedActivityIds = saSelectedActivities().map(function (activity) { return activity.id; });
        state.currentSceneId = data.qr.nextSceneId;
        state.qrVersion = Number(String(data.qr.snapshotVersion).replace(/\D/g, '')) || 3;
        go('sa-qr');
      }
    }
    if (event.target.closest('[data-old-code]')) go('qr-invalid');
    if (event.target.closest('[data-invalid-done]')) common.showToast('请联系服务顾问获取最新二维码');
    if (event.target.closest('[data-empty-refresh]')) {
      common.showToast('已重新加载可投活动');
      go('sa-select');
    }
    if (event.target.closest('[data-simulate-scan]')) {
      state.vehicleId = data.user.defaultVehicleId;
      resetDefaultSelection();
      go('activity-aggregation');
    }
    if (event.target.closest('[data-demo-unbound]')) {
      go('activity-aggregation-unbound');
      setTimeout(function () { resetDefaultSelection(); render(); },0);
    }
    if (event.target.closest('[data-demo-bound]')) {
      state.vehicleId = data.user.defaultVehicleId;
      go('activity-aggregation');
      setTimeout(function () { resetDefaultSelection(); render(); },0);
    }
    if (event.target.closest('[data-open-vehicle]')) openVehicleSheet();
    var vehicleButton = event.target.closest('[data-select-vehicle]');
    if (vehicleButton) {
      state.vehicleId = vehicleButton.getAttribute('data-select-vehicle');
      resetDefaultSelection();
      common.closeSheet();
      render();
      common.showToast('已切换车辆，活动资格已重新计算');
    }
    if (event.target.closest('[data-participate]')) participate();
    if (event.target.closest('[data-view-wallet]')) {
      common.closeSheet();
      common.showToast('原型演示：进入“我的卡券”');
    }
    var upgrade = event.target.closest('[data-upgrade]');
    if (upgrade) openUpgradeSheet(upgrade.getAttribute('data-upgrade'));
    var confirmUpgrade = event.target.closest('[data-confirm-upgrade]');
    if (confirmUpgrade) {
      var upgradeType = confirmUpgrade.getAttribute('data-confirm-upgrade');
      common.closeSheet();
      common.showToast(upgradeType === 'bind' ? '原型演示：已离开活动页，进入绑车流程' : '原型演示：已离开活动页，进入认证流程');
    }
  });

  document.addEventListener('input', function (event) {
    var input = event.target.closest('[data-poster-input]');
    if (!input) return;
    var key = input.getAttribute('data-poster-input');
    if (key === 'title') state.posterTitle = input.value;
    if (key === 'subtitle') state.posterSubtitle = input.value;
    if (key === 'guide') state.posterGuide = input.value;
    var preview = document.querySelector('[data-poster-preview-' + key + ']');
    var count = document.querySelector('[data-poster-count="' + key + '"]');
    if (preview) preview.textContent = input.value || (key === 'title' ? '请输入海报标题' : key === 'subtitle' ? '请输入活动说明' : '请输入扫码引导语');
    if (count) count.textContent = input.value.length + '/' + input.maxLength;
  });

  document.addEventListener('change', function (event) {
    var posterUpload = event.target.closest('[data-poster-upload]');
    if (posterUpload) {
      var file = posterUpload.files && posterUpload.files[0];
      if (!file) return;
      if (['image/jpeg','image/png'].indexOf(file.type) === -1) {
        common.showToast('仅支持JPG或PNG图片');
        posterUpload.value = '';
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        common.showToast('图片大小不能超过10MB');
        posterUpload.value = '';
        return;
      }
      if (state.posterUploadUrl) URL.revokeObjectURL(state.posterUploadUrl);
      state.posterUploadUrl = URL.createObjectURL(file);
      state.posterUploadName = file.name;
      state.posterMode = 'upload';
      renderPreservingScroll();
      common.showToast('自定义海报已上传，并叠加二维码与SA信息');
      return;
    }
    var durationChoice = event.target.closest('[data-duration-choice]');
    if (durationChoice) {
      state.pendingDurationMinutes = Number(durationChoice.value);
      document.querySelectorAll('.duration-choice').forEach(function (node) { node.classList.toggle('active',node.contains(durationChoice)); });
      var preview = document.querySelector('[data-duration-preview]');
      var expiry = document.querySelector('[data-duration-expiry]');
      if (preview) preview.textContent = durationLabel(state.pendingDurationMinutes);
      if (expiry) expiry.textContent = '预计失效：' + qrExpiryText(state.pendingDurationMinutes);
      return;
    }
    var saCheck = event.target.closest('[data-sa-check]');
    if (saCheck) {
      state.saSelected[saCheck.getAttribute('data-sa-check')] = saCheck.checked;
      renderPreservingScroll();
      return;
    }
    var selectAll = event.target.closest('[data-sa-select-all]');
    if (selectAll) {
      data.activities.forEach(function (activity) { state.saSelected[activity.id] = isActivityVisibleToSource(activity) ? selectAll.checked : false; });
      renderPreservingScroll();
      return;
    }
    var check = event.target.closest('[data-activity-check]');
    if (check && !check.disabled) {
      var checkedActivity = activityById(check.getAttribute('data-activity-check'));
      var cancelledPeers = [];
      if (check.checked && checkedActivity.mutex) {
        mutexPeers(checkedActivity).forEach(function (peer) {
          if (state.selected[peer.id]) cancelledPeers.push(peer.name);
          state.selected[peer.id] = false;
        });
      }
      state.selected[checkedActivity.id] = check.checked;
      renderPreservingScroll();
      if (cancelledPeers.length) common.showToast('已取消“' + cancelledPeers.join('、') + '”，互斥活动不可同时参与');
    }
  });

  window.addEventListener('hashchange', render);
  resetDefaultSelection();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render);
  else render();

  window.getCurrentPage = route;
  window.SAFrontApp = {
    render:render,
    state:state,
    activityStatus:activityStatus,
    selectedActivities:selectedActivities,
    sharedActivities:sharedActivities,
    saAvailableActivities:saAvailableActivities,
    activityDisplayName:activityDisplayName,
    isActivityVisibleToSource:isActivityVisibleToSource,
    route:route
  };
})();
