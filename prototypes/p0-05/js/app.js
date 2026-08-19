(function () {
  'use strict';

  var data = window.MockData;
  var COUPON_SCENARIOS = {
    '售前营销': ['在线购车', '节点营销', 'CAP活动', '直播活动', '区域活动', '试驾', '新车上市'],
    '售后营销': ['维保活动', '续保活动'],
    '售后营销-上门取送车': ['取送车活动'],
    '商城营销': ['会员商城(新)', '新商城']
  };
  window.Pages = window.Pages || {};

  function pageHeader(title, description, actions) {
    return '<div class="page-header"><div><div class="breadcrumb">活动中心 / ' + escapeHtml(title) + '</div><h1>' + escapeHtml(title) + '</h1><p>' + escapeHtml(description || '') + '</p></div><div class="page-actions">' + (actions || '') + '</div></div>';
  }

  function metric(label, value, note, tone) {
    return '<article class="metric-card ' + (tone || '') + '"><span>' + escapeHtml(label) + '</span><strong>' + escapeHtml(value) + '</strong><small>' + escapeHtml(note || '') + '</small></article>';
  }

  window.Pages.overview = {
    render: function () {
      return pageHeader('积分奖励方案总览', '配置在前、活动引用、认证级准入、默认卡 VIN 发放。', '<button class="btn btn-primary" data-go="config-list">查看积分配置</button>') +
        '<section class="metrics-grid">' +
          metric('已启用积分配置', data.summary.activeConfigs + ' 项', '统一维护积分数量与卡券场景', 'primary') +
          metric('引用活动', data.summary.referencedActivities + ' 个', '均为认证级活动', 'success') +
          metric('累计发放积分', formatNumber(data.summary.issuedPoints), 'Mock 演示数据', 'warning') +
          metric('待处理异常', data.summary.exceptionRecords + ' 笔', '接口与对账异常', 'danger') +
        '</section>' +
        '<section class="content-grid two-columns">' +
          '<article class="panel"><div class="panel-title"><h2>已确认业务规则</h2><span class="badge success">评审口径</span></div><ul class="rule-list"><li><b>准入门槛：</b>只有认证级活动允许选择积分奖励。</li><li><b>配置边界：</b>积分数量、预算配置和业务场景统一在积分配置中维护。</li><li><b>预算规则：</b>预算号、预算额度和预警阈值独立配置，其余成本字段继续隐藏。</li><li><b>业务场景：</b>主场景与子场景严格复用卡券中心两级枚举及级联关系。</li><li><b>活动操作：</b>只选择一项已生效配置，不允许二次修改。</li><li><b>发放对象：</b>使用用户默认卡对应 VIN，并在首次请求时锁定。</li><li><b>失败原则：</b>中奖结果不变，超时先查询，失败进入补偿。</li></ul></article>' +
          '<article class="panel"><div class="panel-title"><h2>核心链路</h2><span class="badge info">静态演示</span></div><div class="flow-line"><div><b>1</b><span>积分配置</span></div><i>→</i><div><b>2</b><span>认证级活动选择</span></div><i>→</i><div><b>3</b><span>锁定版本</span></div><i>→</i><div><b>4</b><span>默认卡VIN发放</span></div><i>→</i><div><b>5</b><span>对账补偿</span></div></div></article>' +
        '</section>' +
        '<section class="panel"><div class="panel-title"><h2>页面范围</h2><span class="muted-text">8 个评审视图</span></div><div class="scope-cards">' +
          ['积分配置列表','新增/编辑配置','配置详情与版本','活动新增/编辑','活动详情快照','奖励发放记录','发放详情','积分对账与异常'].map(function (name, index) { return '<div><b>' + String(index + 1).padStart(2, '0') + '</b><span>' + name + '</span></div>'; }).join('') +
        '</div></section>';
    },
    init: function () {
      var go = document.querySelector('[data-go="config-list"]');
      if (go) go.addEventListener('click', function () { window.navigateTo('config-list'); });
    }
  };

  ['config-list','config-form','config-detail','activity-edit','activity-detail','reward-records','reconciliation'].forEach(function (key) {
    window.Pages[key] = {
      render: function () {
        return pageHeader('页面建设中', '该路由已纳入本次实施步骤。') + '<section class="panel empty-state"><div class="empty-icon">◇</div><h2>功能即将接入</h2><p>导航和页面容器已经准备完成。</p></section>';
      }
    };
  });

  window.AppState = window.AppState || { detailConfigId: 'PC-2026-001', editConfigId: null };

  function configById(id) {
    return data.pointConfigs.filter(function (item) { return item.id === id; })[0] || data.pointConfigs[0];
  }

  function tag(status) {
    return '<span class="badge ' + statusClass(status) + '">' + escapeHtml(status) + '</span>';
  }

  function budgetUsage(config) {
    if (!config.totalBudget) return 0;
    return Math.min(100, Math.round(config.usedBudget / config.totalBudget * 1000) / 10);
  }

  function budgetTone(config) {
    var usage = budgetUsage(config);
    if (usage >= 100) return 'danger';
    if (usage >= config.warning) return 'warning';
    return '';
  }

  function budgetProgress(config) {
    var usage = budgetUsage(config);
    return '<div class="budget-cell"><div class="progress-row"><b>' + usage + '%</b><small>' + formatNumber(config.usedBudget) + ' / ' + formatNumber(config.totalBudget) + '</small></div><div class="progress-track"><i class="' + budgetTone(config) + '" style="width:' + usage + '%"></i></div><small class="cell-sub">预警阈值 ' + config.warning + '%</small></div>';
  }

  function configRows(items) {
    if (!items.length) return '<tr><td colspan="10"><div class="table-empty">未找到符合条件的积分配置</div></td></tr>';
    return items.map(function (config) {
      var canEdit = config.status === '草稿' || config.status === '待审核';
      return '<tr><td><a href="#" class="table-link" data-detail="' + config.id + '">' + config.id + '</a><small class="cell-sub">' + config.version + '</small></td>' +
        '<td><b>' + escapeHtml(config.name) + '</b><small class="cell-sub">' + escapeHtml(config.owner) + '</small></td>' +
        '<td class="number-cell">' + formatNumber(config.points) + '</td><td>' + escapeHtml(config.mainScenario) + '</td><td>' + escapeHtml(config.subScenario) + '</td><td>' + escapeHtml(config.budgetNo) + '</td><td>' + budgetProgress(config) + '</td>' +
        '<td>' + escapeHtml(config.start) + '<small class="cell-sub">至 ' + escapeHtml(config.end) + '</small></td><td>' + tag(config.status) + '</td>' +
        '<td><div class="row-actions"><button type="button" class="link-button" data-detail="' + config.id + '">详情</button><button type="button" class="link-button" data-edit="' + config.id + '"' + (canEdit ? '' : ' disabled title="已被发布活动引用，需创建新版本"') + '>编辑</button><button type="button" class="link-button" data-toggle="' + config.id + '">' + (config.status === '已启用' ? '停用' : '启用') + '</button></div></td></tr>';
    }).join('');
  }

  function bindConfigRowActions() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-detail]'), function (button) {
      button.addEventListener('click', function (event) {
        event.preventDefault();
        window.AppState.detailConfigId = this.getAttribute('data-detail');
        window.navigateTo('config-detail');
      });
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-edit]'), function (button) {
      button.addEventListener('click', function () {
        window.AppState.editConfigId = this.getAttribute('data-edit');
        window.navigateTo('config-form');
      });
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-toggle]'), function (button) {
      button.addEventListener('click', function () {
        showToast('静态演示：配置状态校验已触发，真实启停需审核权限。', 'success');
      });
    });
  }

  window.Pages['config-list'] = {
    render: function () {
      return pageHeader('积分配置列表', '统一维护积分数量、预算配置、卡券同源业务场景及有效期。', '<button class="btn btn-primary" id="newConfig" type="button">＋ 新增积分配置</button>') +
        '<section class="panel filter-panel"><div class="filter-grid"><label>配置名称/编码<input class="form-input" id="configKeyword" placeholder="请输入配置名称或编码"></label><label>配置状态<select class="form-select" id="configStatus"><option value="">全部状态</option><option>草稿</option><option>待审核</option><option>已启用</option><option>已停用</option><option>已过期</option></select></label><div class="filter-actions"><button class="btn btn-primary" id="searchConfigs" type="button">查询</button><button class="btn" id="resetConfigs" type="button">重置</button></div></div></section>' +
        '<section class="panel"><div class="panel-title"><h2>积分配置</h2><span class="muted-text">共 <b id="configCount">' + data.pointConfigs.length + '</b> 条</span></div><div class="table-wrapper"><table class="data-table"><thead><tr><th>配置编码/版本</th><th>配置名称</th><th>积分数量</th><th>业务主场景</th><th>业务子场景</th><th>预算号</th><th>预算使用</th><th>有效期</th><th>状态</th><th>操作</th></tr></thead><tbody id="configTableBody">' + configRows(data.pointConfigs) + '</tbody></table></div><div class="table-footer"><span>展示 1-' + data.pointConfigs.length + ' 条</span><div class="pagination"><button class="btn btn-small active" type="button">1</button></div></div></section>' +
        '<section class="notice info"><b>规则说明</b><span>预算在积分配置中独立维护，活动只选择配置；其余成本字段继续隐藏。业务主场景与业务子场景严格复用卡券中心枚举。</span></section>';
    },
    init: function () {
      function filter() {
        var keyword = document.getElementById('configKeyword').value.trim().toLowerCase();
        var status = document.getElementById('configStatus').value;
        var items = data.pointConfigs.filter(function (config) {
          var text = [config.id, config.name, config.budgetNo].join(' ').toLowerCase();
          return (!keyword || text.indexOf(keyword) >= 0) && (!status || config.status === status);
        });
        document.getElementById('configTableBody').innerHTML = configRows(items);
        document.getElementById('configCount').textContent = items.length;
        bindConfigRowActions();
      }
      document.getElementById('searchConfigs').addEventListener('click', filter);
      document.getElementById('resetConfigs').addEventListener('click', function () {
        document.getElementById('configKeyword').value = '';
        document.getElementById('configStatus').value = '';
        filter();
      });
      document.getElementById('newConfig').addEventListener('click', function () { window.AppState.editConfigId = null; window.navigateTo('config-form'); });
      bindConfigRowActions();
    }
  };

  function formValue(config, field) {
    return config ? escapeHtml(config[field]) : '';
  }

  function scenarioOptions(items, selected) {
    return '<option value="">请选择</option>' + items.map(function (item) {
      return '<option value="' + escapeHtml(item) + '"' + (item === selected ? ' selected' : '') + '>' + escapeHtml(item) + '</option>';
    }).join('');
  }

  function plainOptions(items) {
    return items.map(function (item) {
      return '<option value="' + escapeHtml(item) + '">' + escapeHtml(item) + '</option>';
    }).join('');
  }

  window.Pages['config-form'] = {
    render: function () {
      var config = window.AppState.editConfigId ? configById(window.AppState.editConfigId) : null;
      var title = config ? '编辑积分配置' : '新增积分配置';
      return pageHeader(title, '积分参数只在此处维护；活动中只选择配置并查看只读摘要。', '<button class="btn" id="backConfigList" type="button">返回列表</button>') +
        '<section class="status-flow"><div class="active"><b>1</b><span>填写配置</span></div><i></i><div><b>2</b><span>提交审核</span></div><i></i><div><b>3</b><span>审核启用</span></div><i></i><div><b>4</b><span>活动引用</span></div></section>' +
        '<form id="configForm" novalidate><section class="panel form-section"><div class="panel-title"><h2>基础信息</h2><span class="badge info">统一配置</span></div><div class="form-grid two"><label><span class="required">配置名称</span><input class="form-input" name="name" value="' + formValue(config, 'name') + '" placeholder="如：认证抽奖一等奖1000"></label><label><span>配置编码</span><input class="form-input readonly" value="' + (config ? config.id : '保存后自动生成') + '" readonly></label><label><span class="required">固定积分数量</span><div class="input-suffix"><input class="form-input" name="points" type="number" min="1" step="1" value="' + formValue(config, 'points') + '" placeholder="请输入正整数"><em>积分</em></div><small>活动内不可修改此数量</small></label><label><span class="required">业务归属部门</span><input class="form-input" name="owner" value="' + formValue(config, 'owner') + '" placeholder="请输入业务归属部门"></label></div></section>' +
        '<section class="panel form-section"><div class="panel-title"><h2>预算配置</h2><span class="badge warning">活动只读引用</span></div><div class="form-grid two"><label><span class="required">预算号</span><input class="form-input" name="budgetNo" value="' + formValue(config, 'budgetNo') + '" placeholder="请输入预算号，如 YS-SH-2026-001"></label><label><span class="required">预算额度</span><div class="input-suffix"><input class="form-input" name="totalBudget" type="number" min="1" step="1" value="' + formValue(config, 'totalBudget') + '" placeholder="请输入正整数"><em>积分</em></div></label><label><span class="required">预警阈值</span><div class="input-suffix"><input class="form-input" name="warning" type="number" min="1" max="100" step="1" value="' + formValue(config, 'warning') + '" placeholder="1-100"><em>%</em></div><small>达到阈值后提示预警，达到100%停止新发放</small></label><label><span>已用 / 剩余预算</span><input class="form-input readonly" value="' + (config ? formatNumber(config.usedBudget) + ' / ' + formatNumber(Math.max(0, config.totalBudget - config.usedBudget)) : '保存后由积分系统返回') + '" readonly><small>预算余额以积分系统查询结果为准</small></label></div></section>' +
        '<section class="panel form-section"><div class="panel-title"><h2>业务场景</h2><span class="badge info">卡券同源枚举</span></div><div class="form-grid two"><label><span class="required">业务主场景</span><select class="form-select" name="mainScenario" id="mainScenario">' + scenarioOptions(Object.keys(COUPON_SCENARIOS), config ? config.mainScenario : '') + '</select><small>选项与卡券中心业务主场景保持一致</small></label><label><span class="required">业务子场景</span><select class="form-select" name="subScenario" id="subScenario"' + (config ? '' : ' disabled') + '>' + scenarioOptions(config ? COUPON_SCENARIOS[config.mainScenario] : [], config ? config.subScenario : '') + '</select><small>按业务主场景级联加载卡券中心对应子场景</small></label></div></section>' +
        '<section class="panel form-section"><div class="panel-title"><h2>生效与审核</h2></div><div class="form-grid two"><label><span class="required">生效日期</span><input class="form-input" name="start" type="date" value="' + formValue(config, 'start') + '"></label><label><span class="required">失效日期</span><input class="form-input" name="end" type="date" value="' + formValue(config, 'end') + '"></label><label class="full"><span>使用说明</span><textarea class="form-textarea" name="remark" placeholder="说明适用活动范围等">' + (config ? '仅供认证级活动选择，发放时按用户默认卡VIN入账。' : '') + '</textarea></label></div></section>' +
        '<div class="form-footer"><button class="btn" id="cancelConfig" type="button">取消</button><button class="btn" id="saveDraft" type="button">保存草稿</button><button class="btn btn-primary" id="submitReview" type="submit">提交审核</button></div></form>';
    },
    init: function () {
      function validate() {
        var form = document.getElementById('configForm');
        var fields = ['name','points','owner','budgetNo','totalBudget','warning','mainScenario','subScenario','start','end'];
        var missing = fields.filter(function (name) { return !form.elements[name].value.trim(); });
        if (missing.length) { showToast('请完整填写所有必填字段。', 'danger'); return false; }
        if (!/^\d+$/.test(form.elements.points.value) || Number(form.elements.points.value) <= 0) { showToast('积分数量必须为大于0的整数。', 'danger'); return false; }
        if (!/^\d+$/.test(form.elements.totalBudget.value) || Number(form.elements.totalBudget.value) <= 0) { showToast('预算额度必须为大于0的整数。', 'danger'); return false; }
        if (!/^\d+$/.test(form.elements.warning.value) || Number(form.elements.warning.value) < 1 || Number(form.elements.warning.value) > 100) { showToast('预警阈值必须为1-100的整数。', 'danger'); return false; }
        if (form.elements.end.value < form.elements.start.value) { showToast('失效日期不能早于生效日期。', 'danger'); return false; }
        return true;
      }
      document.getElementById('configForm').addEventListener('submit', function (event) { event.preventDefault(); if (validate()) showToast('静态演示：已提交审核，状态更新为“待审核”。', 'success'); });
      document.getElementById('mainScenario').addEventListener('change', function () {
        var subSelect = document.getElementById('subScenario');
        subSelect.innerHTML = scenarioOptions(COUPON_SCENARIOS[this.value] || [], '');
        subSelect.disabled = !this.value;
      });
      document.getElementById('saveDraft').addEventListener('click', function () { if (validate()) showToast('静态演示：草稿已保存。', 'success'); });
      document.getElementById('backConfigList').addEventListener('click', function () { window.navigateTo('config-list'); });
      document.getElementById('cancelConfig').addEventListener('click', function () { window.navigateTo('config-list'); });
    }
  };

  function detailItem(label, value) {
    return '<div><span>' + escapeHtml(label) + '</span><b>' + escapeHtml(value) + '</b></div>';
  }

  window.Pages['config-detail'] = {
    render: function () {
      var config = configById(window.AppState.detailConfigId);
      var refs = data.activities.filter(function (activity) { return activity.configId === config.id; });
      return pageHeader('积分配置详情', '查看不可变配置版本、卡券同源业务场景和活动引用。', '<button class="btn" id="backToConfigs" type="button">返回列表</button><button class="btn btn-primary" id="newVersion" type="button">创建新版本</button>') +
        '<section class="detail-hero"><div><div class="title-line"><h2>' + escapeHtml(config.name) + '</h2>' + tag(config.status) + '</div><p>' + config.id + ' · ' + config.version + ' · ' + escapeHtml(config.owner) + '</p></div><div class="hero-number"><span>固定积分</span><strong>' + formatNumber(config.points) + '</strong><small>积分/次</small></div></section>' +
        '<section class="content-grid two-columns"><article class="panel"><div class="panel-title"><h2>配置快照</h2><span class="badge info">发布活动锁定版本</span></div><div class="detail-grid">' + detailItem('配置编码', config.id) + detailItem('当前版本', config.version) + detailItem('业务主场景', config.mainScenario) + detailItem('业务子场景', config.subScenario) + detailItem('有效期', config.start + ' 至 ' + config.end) + detailItem('业务归属部门', config.owner) + '</div></article>' +
        '<article class="panel"><div class="panel-title"><h2>固定履约规则</h2><span class="badge success">统一执行</span></div><ul class="rule-list"><li><b>准入：</b>仅认证级活动允许引用。</li><li><b>车辆：</b>按用户默认卡对应 VIN 发放。</li><li><b>场景：</b>' + escapeHtml(config.mainScenario) + ' / ' + escapeHtml(config.subScenario) + '。</li><li><b>引用活动：</b>' + config.referenced + ' 个。</li></ul></article></section>' +
        '<section class="panel"><div class="panel-title"><h2>预算配置</h2><span class="badge ' + (budgetTone(config) || 'success') + '">' + (budgetUsage(config) >= 100 ? '预算已用尽' : budgetUsage(config) >= config.warning ? '预算预警' : '预算正常') + '</span></div><div class="detail-grid">' + detailItem('预算号', config.budgetNo) + detailItem('预算额度', formatNumber(config.totalBudget) + ' 积分') + detailItem('已用预算', formatNumber(config.usedBudget) + ' 积分') + detailItem('剩余预算', formatNumber(Math.max(0, config.totalBudget - config.usedBudget)) + ' 积分') + detailItem('预算使用率', budgetUsage(config) + '%') + detailItem('预警阈值', config.warning + '%') + '</div></section>' +
        '<section class="panel"><div class="panel-title"><h2>引用活动</h2><span class="muted-text">发布后引用关系不可静默变更</span></div><div class="table-wrapper"><table><thead><tr><th>活动ID</th><th>活动名称</th><th>准入表达</th><th>玩法</th><th>锁定版本</th><th>活动状态</th></tr></thead><tbody>' + (refs.length ? refs.map(function (activity) { return '<tr><td>' + activity.id + '</td><td>' + escapeHtml(activity.name) + '</td><td>' + tag(activity.level) + '</td><td>' + activity.play + '</td><td>' + activity.configVersion + '</td><td>' + tag(activity.status) + '</td></tr>'; }).join('') : '<tr><td colspan="6"><div class="table-empty">暂无活动引用此配置</div></td></tr>') + '</tbody></table></div></section>' +
        '<section class="panel"><div class="panel-title"><h2>版本记录</h2><span class="muted-text">核心字段变更必须生成新版本</span></div><div class="timeline">' + data.configVersions.map(function (version) { return '<div class="timeline-item"><i></i><div><div class="title-line"><b>' + version.version + '</b>' + tag(version.status) + '</div><p>' + escapeHtml(version.changed) + '</p><small>' + escapeHtml(version.operator) + ' · ' + version.time + '</small></div></div>'; }).join('') + '</div></section>';
    },
    init: function () {
      document.getElementById('backToConfigs').addEventListener('click', function () { window.navigateTo('config-list'); });
      document.getElementById('newVersion').addEventListener('click', function () { window.AppState.editConfigId = window.AppState.detailConfigId; showToast('静态演示：已基于当前配置生成新版本草稿。', 'success'); window.navigateTo('config-form'); });
    }
  };

  function enabledPointConfigs() {
    return data.pointConfigs.filter(function (config) { return config.status === '已启用'; });
  }

  function configOptions(selectedId) {
    return '<option value="">请选择已启用积分配置</option>' + enabledPointConfigs().map(function (config) {
      return '<option value="' + config.id + '"' + (selectedId === config.id ? ' selected' : '') + '>' + escapeHtml(config.name) + '（' + formatNumber(config.points) + '积分）</option>';
    }).join('');
  }

  function configSnapshot(configId) {
    if (!configId) return '<div class="selection-empty">选择积分配置后，在此展示只读快照</div>';
    var config = configById(configId);
    return '<div class="snapshot-card"><div class="snapshot-head"><div><b>' + escapeHtml(config.name) + '</b><span>' + config.id + ' · ' + config.version + '</span></div>' + tag(config.status) + '</div><div class="snapshot-grid">' + detailItem('固定积分', formatNumber(config.points) + ' 积分') + detailItem('业务主场景', config.mainScenario) + detailItem('业务子场景', config.subScenario) + detailItem('预算号', config.budgetNo) + detailItem('有效期', config.start + ' 至 ' + config.end) + '</div><div class="snapshot-lock">🔒 活动仅选择积分配置；积分、预算和业务场景均为只读快照</div></div>';
  }

  function rewardTypeOptions(selected, pointsDisabled) {
    return '<option value="coupon"' + (selected === 'coupon' ? ' selected' : '') + '>卡券</option><option value="points"' + (selected === 'points' ? ' selected' : '') + (pointsDisabled ? ' disabled' : '') + '>积分</option>';
  }

  function rewardEditorHtml() {
    var draft = window.AppState.activityDraft;
    var pointsDisabled = draft.level !== '认证级';
    var isLottery = draft.play === '抽奖';
    var notice = pointsDisabled ? '<div class="notice warning compact"><b>积分奖励不可选</b><span>仅当准入表达为“认证级”时，才允许选择积分奖励。</span></div>' : '<div class="notice success compact"><b>已满足积分准入条件</b><span>系统将在发放时读取用户默认卡 VIN，并在首次请求时锁定。</span></div>';
    return notice + '<div class="reward-toolbar"><div><b>' + (isLottery ? '奖项设置' : '奖励设置') + '</b><span>' + (isLottery ? '每个奖项可独立选择卡券或积分配置' : '直接奖励仅配置一项奖励') + '</span></div>' + (isLottery ? '<button class="btn btn-small" id="addPrize" type="button">＋ 新增奖项</button>' : '') + '</div><div id="prizeList">' + draft.prizes.map(function (prize, index) {
      var title = isLottery ? (prize.name || ('奖项' + (index + 1))) : '奖励内容';
      var valueEditor = prize.type === 'points' ? '<label><span class="required">积分配置</span><select class="form-select prize-config" data-index="' + index + '">' + configOptions(prize.configId) + '</select></label>' : '<label><span class="required">卡券</span><select class="form-select prize-coupon" data-index="' + index + '"><option>精洗服务券（30天）</option><option>商城满200减30券</option><option>空调清洁服务券</option></select></label>';
      return '<article class="prize-card"><div class="prize-card-head"><div><b>' + escapeHtml(title) + '</b><span>' + (isLottery ? '中奖概率与库存沿用原活动能力' : '完成活动后发放') + '</span></div>' + (isLottery && draft.prizes.length > 1 ? '<button class="link-button danger-text remove-prize" data-index="' + index + '" type="button">删除</button>' : '') + '</div><div class="prize-grid">' + (isLottery ? '<label><span>奖项名称</span><input class="form-input prize-name" data-index="' + index + '" value="' + escapeHtml(prize.name || '') + '"></label>' : '') + '<label><span class="required">奖励类型</span><select class="form-select prize-type" data-index="' + index + '">' + rewardTypeOptions(prize.type, pointsDisabled) + '</select></label>' + valueEditor + '</div>' + (prize.type === 'points' ? configSnapshot(prize.configId) : '<div class="coupon-summary"><b>卡券由卡券中心发放</b><span>活动发布时锁定所选券批次；券库存与有效期沿用现有校验。</span></div>') + '</article>';
    }).join('') + '</div>';
  }

  function bindRewardEditor() {
    var draft = window.AppState.activityDraft;
    Array.prototype.forEach.call(document.querySelectorAll('.prize-type'), function (select) {
      select.addEventListener('change', function () {
        var index = Number(this.getAttribute('data-index'));
        if (this.value === 'points' && draft.level !== '认证级') {
          this.value = 'coupon';
          showToast('只有认证级活动允许选择积分奖励。', 'danger');
          return;
        }
        draft.prizes[index].type = this.value;
        draft.prizes[index].configId = this.value === 'points' ? '' : null;
        renderRewardEditor();
      });
    });
    Array.prototype.forEach.call(document.querySelectorAll('.prize-config'), function (select) {
      select.addEventListener('change', function () {
        draft.prizes[Number(this.getAttribute('data-index'))].configId = this.value;
        renderRewardEditor();
      });
    });
    Array.prototype.forEach.call(document.querySelectorAll('.prize-name'), function (input) {
      input.addEventListener('input', function () { draft.prizes[Number(this.getAttribute('data-index'))].name = this.value; });
    });
    Array.prototype.forEach.call(document.querySelectorAll('.remove-prize'), function (button) {
      button.addEventListener('click', function () {
        draft.prizes.splice(Number(this.getAttribute('data-index')), 1);
        renderRewardEditor();
      });
    });
    var add = document.getElementById('addPrize');
    if (add) add.addEventListener('click', function () {
      draft.prizes.push({ name: '新增奖项', type: 'coupon', configId: null });
      renderRewardEditor();
    });
  }

  function renderRewardEditor() {
    var host = document.getElementById('rewardEditor');
    if (!host) return;
    host.innerHTML = rewardEditorHtml();
    bindRewardEditor();
  }

  window.Pages['activity-edit'] = {
    render: function () {
      window.AppState.activityDraft = { level: '认证级', play: '抽奖', prizes: [
        { name: '一等奖', type: 'points', configId: 'PC-2026-002' },
        { name: '二等奖', type: 'points', configId: 'PC-2026-003' },
        { name: '三等奖', type: 'coupon', configId: null }
      ] };
      return pageHeader('活动新增/编辑', '中奖可发卡券或积分；积分严格依赖认证级准入，并引用独立积分配置。', '<button class="btn" id="viewActivityDetail" type="button">查看发布快照</button>') +
        '<section class="panel form-section"><div class="panel-title"><h2>活动基础信息</h2><span class="badge warning">关键联动演示</span></div><div class="form-grid two"><label><span class="required">活动名称</span><input id="activityName" class="form-input" value="夏日车主关怀抽奖"></label><label><span>活动编码</span><input class="form-input readonly" value="ACT-2026-0718" readonly></label><label><span class="required">活动玩法</span><select class="form-select" id="activityPlay"><option>直接奖励</option><option selected>抽奖</option></select></label><label><span class="required">准入表达</span><select class="form-select" id="activityLevel"><option>号码级</option><option>绑车级</option><option selected>认证级</option></select><small>积分奖励的硬性前置条件</small></label><label><span>活动时间</span><div class="date-pair"><input class="form-input" type="date" value="2026-07-18"><em>至</em><input class="form-input" type="date" value="2026-08-31"></div></label><label><span>参与对象</span><input class="form-input readonly" value="认证车主（按 OneID 识别）" readonly></label></div></section>' +
        '<section class="panel form-section"><div class="panel-title"><h2>奖励配置</h2><span class="muted-text">积分参数不在活动内维护</span></div><div id="rewardEditor">' + rewardEditorHtml() + '</div></section>' +
        '<section class="panel"><div class="panel-title"><h2>发放规则</h2><span class="badge info">系统自动执行</span></div><div class="rule-tiles"><div><b>发放时点</b><span>活动最后环节确认中奖/达标后</span></div><div><b>发放 VIN</b><span>用户默认卡对应 VIN</span></div><div><b>请求锁定</b><span>首次请求固化 VIN、配置ID和版本</span></div><div><b>失败处理</b><span>不重抽；查询、重试、补偿均沿用原 VIN</span></div></div></section>' +
        '<div class="form-footer"><button class="btn" id="saveActivityDraft" type="button">保存草稿</button><button class="btn btn-primary" id="publishActivity" type="button">校验并发布</button></div>';
    },
    init: function () {
      renderRewardEditor();
      document.getElementById('activityLevel').addEventListener('change', function () {
        var draft = window.AppState.activityDraft;
        draft.level = this.value;
        if (draft.level !== '认证级') {
          var removed = draft.prizes.some(function (prize) { return prize.type === 'points'; });
          draft.prizes.forEach(function (prize) { if (prize.type === 'points') { prize.type = 'coupon'; prize.configId = null; } });
          if (removed) showToast('准入表达已降级，原积分奖项已清空并切换为卡券。', 'danger');
        }
        renderRewardEditor();
      });
      document.getElementById('activityPlay').addEventListener('change', function () {
        var draft = window.AppState.activityDraft;
        draft.play = this.value;
        if (draft.play === '直接奖励') draft.prizes = [draft.prizes[0] || { name: '奖励', type: 'coupon', configId: null }];
        renderRewardEditor();
      });
      document.getElementById('publishActivity').addEventListener('click', function () {
        var draft = window.AppState.activityDraft;
        var invalidPoints = draft.prizes.some(function (prize) { return prize.type === 'points' && (!prize.configId || draft.level !== '认证级'); });
        if (invalidPoints) { showToast('请为所有积分奖项选择有效配置，并确认准入表达为认证级。', 'danger'); return; }
        showToast('校验通过：发布后将锁定配置编码与版本。', 'success');
      });
      document.getElementById('saveActivityDraft').addEventListener('click', function () { showToast('静态演示：活动草稿已保存。', 'success'); });
      document.getElementById('viewActivityDetail').addEventListener('click', function () { window.navigateTo('activity-detail'); });
    }
  };

  window.Pages['activity-detail'] = {
    render: function () {
      var first = configById('PC-2026-002');
      var second = configById('PC-2026-003');
      return pageHeader('活动详情', '发布活动的奖励配置快照与发放规则。', '<button class="btn" id="backActivityEdit" type="button">返回活动编辑</button>') +
        '<section class="detail-hero activity-hero"><div><div class="title-line"><h2>夏日车主关怀抽奖</h2>' + tag('进行中') + '</div><p>ACT-2026-0718 · 抽奖 · 2026-07-18 至 2026-08-31</p></div><div class="eligibility-seal"><span>准入表达</span><strong>认证级</strong><small>允许积分奖励</small></div></section>' +
        '<section class="panel"><div class="panel-title"><h2>奖项及发布快照</h2><span class="badge warning">发布后锁定</span></div><div class="published-prizes"><article><div class="prize-rank">一等奖</div><div><b>积分 · ' + formatNumber(first.points) + '积分</b><span>' + first.name + '</span><small>' + first.id + ' · ' + first.version + '</small></div>' + tag(first.status) + '</article><article><div class="prize-rank">二等奖</div><div><b>积分 · ' + formatNumber(second.points) + '积分</b><span>' + second.name + '</span><small>' + second.id + ' · ' + second.version + '</small></div>' + tag(second.status) + '</article><article><div class="prize-rank">三等奖</div><div><b>卡券 · 精洗服务券</b><span>券批次 COUPON-BATCH-2607-18</span><small>由卡券中心发放</small></div>' + tag('已启用') + '</article></div></section>' +
        '<section class="content-grid two-columns"><article class="panel"><div class="panel-title"><h2>一等奖积分配置快照</h2></div><div class="detail-grid">' + detailItem('固定积分', formatNumber(first.points)) + detailItem('业务主场景', first.mainScenario) + detailItem('业务子场景', first.subScenario) + detailItem('预算号', first.budgetNo) + detailItem('配置编码', first.id) + detailItem('锁定版本', first.version) + '</div></article><article class="panel"><div class="panel-title"><h2>履约约束</h2></div><ul class="rule-list"><li><b>身份：</b>仅认证级用户进入积分奖池。</li><li><b>车辆：</b>使用该用户默认卡对应 VIN。</li><li><b>幂等：</b>中奖记录生成唯一请求号。</li><li><b>失败：</b>不改变中奖结果，不重新抽奖。</li><li><b>补偿：</b>继续使用首次锁定 VIN、配置版本与预算号。</li></ul></article></section>' +
        '<section class="notice info"><b>范围保留项</b><span>自动冲正暂不纳入本期；数据模型保留冲正状态与原交易号，待业务明确触发条件后再启用。</span></section>';
    },
    init: function () { document.getElementById('backActivityEdit').addEventListener('click', function () { window.navigateTo('activity-edit'); }); }
  };

  function rewardRows(items) {
    if (!items.length) return '<tr><td colspan="10"><div class="table-empty">未找到符合条件的发放记录</div></td></tr>';
    return items.map(function (record) {
      return '<tr><td><button class="link-button reward-detail" data-id="' + record.id + '" type="button">' + record.id + '</button></td><td><b>' + escapeHtml(record.activity) + '</b><small class="cell-sub">' + record.oneId + '</small></td><td>' + record.mobile + '</td><td class="vin-cell">' + record.vin + '<small class="cell-sub">首次请求已锁定</small></td><td>' + escapeHtml(record.config) + '<small class="cell-sub">' + record.version + '</small></td><td class="number-cell">' + formatNumber(record.points) + '</td><td>' + escapeHtml(record.budgetNo) + '</td><td>' + escapeHtml(record.mainScenario) + '<small class="cell-sub">' + escapeHtml(record.subScenario) + '</small></td><td>' + tag(record.status) + '<small class="cell-sub">' + escapeHtml(record.reason) + '</small></td><td>' + record.created + '</td></tr>';
    }).join('');
  }

  function recordById(id) {
    return data.rewardRecords.filter(function (record) { return record.id === id; })[0] || data.rewardRecords[0];
  }

  function recordDrawerContent(record) {
    var attempts = record.retries ? '<div class="timeline-item"><i></i><div><b>结果查询 / 重试 ' + record.retries + ' 次</b><p>始终使用原请求号与锁定 VIN，未重新读取默认卡。</p><small>' + record.created + '</small></div></div>' : '';
    return '<div class="drawer-status"><div><span>当前状态</span><div class="title-line"><strong>' + record.status + '</strong>' + tag(record.status) + '</div></div><div><span>积分数量</span><strong>' + formatNumber(record.points) + '</strong></div></div>' +
      '<section class="drawer-section"><h3>发放对象与幂等信息</h3><div class="detail-grid">' + detailItem('OneID', record.oneId) + detailItem('手机号', record.mobile) + detailItem('锁定 VIN', record.vin) + detailItem('请求号', record.requestId) + detailItem('积分交易号', record.transactionId) + detailItem('首次请求时间', record.created) + '</div><div class="notice info compact drawer-notice"><b>VIN 锁定规则</b><span>该 VIN 来自中奖/达标时的用户默认卡。结果查询、重试、人工补偿均沿用本记录 VIN，不再次查询默认卡。</span></div></section>' +
      '<section class="drawer-section"><h3>积分配置快照</h3><div class="detail-grid">' + detailItem('积分配置', record.config) + detailItem('配置版本', record.version) + detailItem('预算号', record.budgetNo) + detailItem('业务主场景', record.mainScenario) + detailItem('业务子场景', record.subScenario) + detailItem('发放积分', formatNumber(record.points)) + '</div></section>' +
      '<section class="drawer-section"><h3>处理轨迹</h3><div class="timeline"><div class="timeline-item"><i></i><div><b>中奖结果已固化</b><p>奖励类型、配置版本和默认卡 VIN 写入奖励记录。</p><small>' + record.created + '</small></div></div><div class="timeline-item"><i></i><div><b>调用积分发放接口</b><p>请求号：' + record.requestId + '</p><small>' + escapeHtml(record.reason) + '</small></div></div>' + attempts + '</div></section>' +
      '<div class="drawer-actions"><button class="btn" id="queryReward" type="button">查询积分结果</button><button class="btn btn-primary" id="retryReward" type="button">发起人工补偿</button></div>';
  }

  function bindRewardDetails() {
    Array.prototype.forEach.call(document.querySelectorAll('.reward-detail'), function (button) {
      button.addEventListener('click', function () {
        var record = recordById(this.getAttribute('data-id'));
        openDrawer('积分发放详情', recordDrawerContent(record), '720px');
        setTimeout(function () {
          var query = document.getElementById('queryReward');
          var retry = document.getElementById('retryReward');
          if (query) query.addEventListener('click', function () { showToast('静态演示：已按原请求号查询积分系统结果。', 'success'); });
          if (retry) retry.addEventListener('click', function () { showToast('静态演示：补偿仍使用锁定 VIN ' + record.vin + '。', 'success'); });
        }, 0);
      });
    });
  }

  window.Pages['reward-records'] = {
    render: function () {
      var success = data.rewardRecords.filter(function (item) { return item.status === '成功'; }).length;
      var exceptions = data.rewardRecords.filter(function (item) { return ['失败','待人工处理'].indexOf(item.status) >= 0; }).length;
      return pageHeader('奖励发放记录', '按中奖/达标记录追踪积分发放、结果查询与人工补偿。', '<button class="btn" id="exportRewards" type="button">导出记录</button>') +
        '<section class="metrics-grid compact-metrics">' + metric('今日发放记录', data.rewardRecords.length + ' 笔', '卡券记录沿用原页面', 'primary') + metric('发放成功', success + ' 笔', '积分系统已返回交易号', 'success') + metric('发放处理中', '1 笔', '将按请求号查询结果', 'warning') + metric('异常待处理', exceptions + ' 笔', '中奖结果保持不变', 'danger') + '</section>' +
        '<section class="panel filter-panel"><div class="filter-grid reward-filters"><label>记录/活动/请求号<input class="form-input" id="rewardKeyword" placeholder="请输入关键字"></label><label>发放状态<select class="form-select" id="rewardStatus"><option value="">全部状态</option><option>成功</option><option>发放中</option><option>失败</option><option>待人工处理</option><option>已冲正</option></select></label><label>VIN<input class="form-input" id="rewardVin" placeholder="请输入完整 VIN"></label><div class="filter-actions"><button class="btn btn-primary" id="searchRewards" type="button">查询</button><button class="btn" id="resetRewards" type="button">重置</button></div></div></section>' +
        '<section class="panel"><div class="panel-title"><h2>积分发放流水</h2><span class="muted-text">共 <b id="rewardCount">' + data.rewardRecords.length + '</b> 条</span></div><div class="table-wrapper"><table class="data-table reward-table"><thead><tr><th>奖励记录号</th><th>活动/OneID</th><th>手机号</th><th>锁定 VIN</th><th>积分配置/版本</th><th>积分</th><th>预算号</th><th>业务场景</th><th>状态/原因</th><th>创建时间</th></tr></thead><tbody id="rewardTableBody">' + rewardRows(data.rewardRecords) + '</tbody></table></div></section>' +
        '<section class="notice warning"><b>异常处理原则</b><span>积分失败不改变用户中奖结果；超时先查询，明确失败后才能重试。所有后续动作沿用首次锁定 VIN、积分配置版本和请求号。</span></section>';
    },
    init: function () {
      function filter() {
        var keyword = document.getElementById('rewardKeyword').value.trim().toLowerCase();
        var status = document.getElementById('rewardStatus').value;
        var vin = document.getElementById('rewardVin').value.trim().toLowerCase();
        var items = data.rewardRecords.filter(function (record) {
          var text = [record.id,record.activity,record.requestId,record.oneId,record.budgetNo].join(' ').toLowerCase();
          return (!keyword || text.indexOf(keyword) >= 0) && (!status || record.status === status) && (!vin || record.vin.toLowerCase().indexOf(vin) >= 0);
        });
        document.getElementById('rewardTableBody').innerHTML = rewardRows(items);
        document.getElementById('rewardCount').textContent = items.length;
        bindRewardDetails();
      }
      document.getElementById('searchRewards').addEventListener('click', filter);
      document.getElementById('resetRewards').addEventListener('click', function () { document.getElementById('rewardKeyword').value=''; document.getElementById('rewardStatus').value=''; document.getElementById('rewardVin').value=''; filter(); });
      document.getElementById('exportRewards').addEventListener('click', function () { showToast('静态演示：导出任务已创建。', 'success'); });
      bindRewardDetails();
    }
  };

  function reconciliationRows(items) {
    if (!items.length) return '<tr><td colspan="8"><div class="table-empty">未找到符合条件的对账任务</div></td></tr>';
    return items.map(function (task) {
      return '<tr><td><button class="link-button reconciliation-detail" data-id="' + task.id + '" type="button">' + task.id + '</button></td><td>' + task.date + '</td><td>' + escapeHtml(task.budgetNo) + '</td><td>' + escapeHtml(task.mainScenario) + '<small class="cell-sub">' + escapeHtml(task.subScenario) + '</small></td><td class="number-cell">' + formatNumber(task.localCount) + ' / ' + formatNumber(task.remoteCount) + '</td><td class="number-cell">' + formatNumber(task.localPoints) + ' / ' + formatNumber(task.remotePoints) + '</td><td class="number-cell ' + (task.diff ? 'danger-text' : '') + '">' + formatNumber(task.diff) + '</td><td>' + tag(task.status) + '</td></tr>';
    }).join('');
  }

  function bindReconciliationDetails() {
    Array.prototype.forEach.call(document.querySelectorAll('.reconciliation-detail'), function (button) {
      button.addEventListener('click', function () {
        var id = this.getAttribute('data-id');
        var task = data.reconciliationTasks.filter(function (item) { return item.id === id; })[0];
        openDrawer('对账任务详情', '<div class="drawer-status"><div><span>任务状态</span><div class="title-line"><strong>' + task.status + '</strong>' + tag(task.status) + '</div></div><div><span>积分差额</span><strong>' + formatNumber(task.diff) + '</strong></div></div><section class="drawer-section"><h3>核对维度</h3><div class="detail-grid">' + detailItem('预算号',task.budgetNo) + detailItem('业务主场景',task.mainScenario) + detailItem('业务子场景',task.subScenario) + detailItem('账期',task.date) + '</div></section><section class="drawer-section"><h3>差异明细</h3><div class="difference-card"><b>RW-20260721-0822</b><span>VIN：LGBH52E02NS005611</span><span>请求号：REQ-ACT0718-220431-01</span><span>活动中心：500积分 / 积分系统：0积分</span><em>建议：先查询原请求，确认无账后人工补偿</em></div></section><div class="drawer-actions"><button class="btn btn-primary" id="handleDiff" type="button">标记处理中</button></div>', '680px');
        setTimeout(function () { var action=document.getElementById('handleDiff'); if(action) action.addEventListener('click',function(){ showToast('静态演示：差异已进入人工处理。','success'); }); },0);
      });
    });
  }

  window.Pages.reconciliation = {
    render: function () {
      return pageHeader('积分对账与异常', '按卡券同源业务主/子场景、VIN 和请求号核对活动中心与积分系统流水。', '<button class="btn btn-primary" id="startReconcile" type="button">立即执行对账</button>') +
        '<section class="metrics-grid compact-metrics">' + metric('昨日积分流水', '5,180 笔', '活动中心已发放记录', 'primary') + metric('账实一致', '5,179 笔', '笔数与积分均一致', 'success') + metric('差异记录', '1 笔', '积分差额 500', 'danger') + metric('待处理任务', '1 个', '需核对原积分交易号', 'warning') + '</section>' +
        '<section class="panel filter-panel"><div class="filter-grid reconciliation-filters"><label>对账日期<input class="form-input" type="date" value="2026-07-21"></label><label>预算号<input class="form-input" id="reconBudget" placeholder="请输入预算号"></label><label>业务主场景<select class="form-select" id="reconMainScenario"><option value="">全部主场景</option>' + plainOptions(Object.keys(COUPON_SCENARIOS)) + '</select></label><label>业务子场景<select class="form-select" id="reconSubScenario" disabled><option value="">全部子场景</option></select></label><div class="filter-actions"><button class="btn btn-primary" id="reconSearch" type="button">查询</button><button class="btn" id="reconReset" type="button">重置</button></div></div></section>' +
        '<section class="panel"><div class="panel-title"><h2>对账任务</h2><span class="muted-text">金额单位：积分</span></div><div class="table-wrapper"><table><thead><tr><th>对账任务号</th><th>账期</th><th>预算号</th><th>业务场景</th><th>活动/积分系统笔数</th><th>活动/积分系统积分</th><th>差额</th><th>状态</th></tr></thead><tbody id="reconTableBody">' + reconciliationRows(data.reconciliationTasks) + '</tbody></table></div></section>' +
        '<section class="content-grid two-columns"><article class="panel"><div class="panel-title"><h2>差异处理原则</h2></div><ul class="rule-list"><li>以请求号、原积分交易号、锁定 VIN 为最小核对单元。</li><li>积分系统有账、活动中心状态未知：查询后回写成功。</li><li>活动中心成功、积分系统无账：核实明确失败后人工补偿。</li><li>冲正只保留状态与原交易号，本期不启用自动冲正。</li></ul></article><article class="panel"><div class="panel-title"><h2>卡券同源业务场景</h2><span class="badge info">两级级联</span></div><p class="muted-text">积分配置严格复用卡券中心的业务主场景、业务子场景及父子关系；发放和对账记录保留配置快照。</p></article></section>';
    },
    init: function () {
      document.getElementById('startReconcile').addEventListener('click', function () { showToast('静态演示：已创建当日对账任务。', 'success'); });
      document.getElementById('reconMainScenario').addEventListener('change', function () {
        var subSelect = document.getElementById('reconSubScenario');
        subSelect.innerHTML = '<option value="">全部子场景</option>' + plainOptions(COUPON_SCENARIOS[this.value] || []);
        subSelect.disabled = !this.value;
      });
      document.getElementById('reconSearch').addEventListener('click', function () {
        var budget = document.getElementById('reconBudget').value.trim().toLowerCase();
        var main = document.getElementById('reconMainScenario').value;
        var sub = document.getElementById('reconSubScenario').value;
        var items = data.reconciliationTasks.filter(function (task) {
          return (!budget || task.budgetNo.toLowerCase().indexOf(budget) >= 0) && (!main || task.mainScenario === main) && (!sub || task.subScenario === sub);
        });
        document.getElementById('reconTableBody').innerHTML = reconciliationRows(items);
        bindReconciliationDetails();
        showToast('已按预算号和卡券同源业务场景刷新对账任务。', 'success');
      });
      document.getElementById('reconReset').addEventListener('click', function () {
        var mainSelect = document.getElementById('reconMainScenario');
        var subSelect = document.getElementById('reconSubScenario');
        document.getElementById('reconBudget').value = '';
        mainSelect.value = '';
        subSelect.innerHTML = '<option value="">全部子场景</option>';
        subSelect.disabled = true;
        document.getElementById('reconTableBody').innerHTML = reconciliationRows(data.reconciliationTasks);
        bindReconciliationDetails();
      });
      bindReconciliationDetails();
    }
  };

})();
