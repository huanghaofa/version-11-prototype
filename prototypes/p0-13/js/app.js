(function () {
  'use strict';

  window.Pages = window.Pages || {};

  function data() { return window.PrototypeData || {}; }
  function enumData() { return window.PrototypeEnums || {labelMap:{},options:{},cascades:{}}; }
  function esc(value) { return window.escapeHTML ? window.escapeHTML(value) : String(value == null ? '' : value); }
  function spec(key) { return (data().pageSpecs || {})[key] || {}; }

  var activityTabs = [
    ['activity-combo','组合活动列表'],['activity-benefit','专属福利活动列表'],['activity-list','保客活动创建'],
    ['activity-exclusive','保客活动互斥关系'],['activity-qr','保客活动一店一码_HD']
  ];
  var activityReportTabs = [['activity-report','保客活动汇总表'],['activity-trigger-report','保客活动行为触发汇总表']];
  var couponTabs = [
    ['coupon-legacy-issue','优惠券发放'],['coupon-receive-record','领券记录'],['coupon-list','卡券列表'],['coupon-limit','卡券限额'],
    ['coupon-after-report','售后业务报表'],['coupon-business-report','业务报表'],['coupon-writeoff','核销列表'],['coupon-issue','卡券发放'],
    ['coupon-issue-record','发放记录'],['coupon-rules','卡券规则设置'],['coupon-dealer-task','经销商券任务记录'],
    ['coupon-batch','批量操作优惠券'],['coupon-redemption','领券管理(领券中心)']
  ];

  function pageTabs(key) {
    if (key.indexOf('coupon-') === 0) return couponTabs;
    if (key === 'activity-report' || key === 'activity-trigger-report') return activityReportTabs;
    if (key.indexOf('activity-') === 0) return activityTabs;
    return [];
  }

  function frame(key, body, actions) {
    var s = spec(key);
    var tabs = pageTabs(key);
    var bottomTabs = tabs.length ? tabs.slice(0, 8) : [['overview','现状总览']];
    return '<div class="workspace" data-page-key="' + esc(key) + '">' +
      '<div class="crumb-bar"><i class="iconfont icon-home-fill" aria-hidden="true"></i><span>工作台</span><span>&gt;</span><span>' + esc(s.group || '现状总览') + '</span><span>&gt;</span><strong>' + esc(s.title || '') + '</strong></div>' +
      (tabs.length ? '<div class="page-tabs">' + tabs.map(function (item) {
        return '<button class="page-tab ' + (item[0] === key || (key === 'activity-editor' && item[0] === 'activity-list') ? 'active' : '') + '" data-nav="' + item[0] + '" type="button">' + esc(item[1]) + '</button>';
      }).join('') + '</div>' : '') +
      '<div class="content-wrap"><div class="page-heading"><div><h1>' + esc(s.title || '') + '</h1></div>' +
      '<div class="page-actions">' + (actions || '') + '<button class="button ghost-blue" data-action="open-spec" type="button">标注与功能说明</button></div></div>' +
      sourceStrip(key) + body + '</div><div class="bottom-work-tabs">' + bottomTabs.map(function (item) {
        return '<button class="bottom-work-tab ' + (item[0] === key || (key === 'activity-editor' && item[0] === 'activity-list') ? 'active' : '') + '" data-nav="' + item[0] + '" type="button">' + esc(item[1]) + '<span>×</span></button>';
      }).join('') + '<button class="bottom-grid" type="button" title="全部窗口"><i class="iconfont icon-more" aria-hidden="true"></i></button></div></div>';
  }

  function sourceStrip(key) {
    var s = spec(key);
    return '<div class="source-strip" data-anno="source-strip"><span><strong>功能说明：</strong>' + esc(s.function || '按当前 SIT 可见能力还原') + '</span>' +
      '<span class="source-meta">SIT 现状为准 · Axure 说明辅助 · 数据为演示 Mock</span></div>';
  }

  function panel(title, note, body, anno) {
    return '<section class="panel"' + (anno ? ' data-anno="' + anno + '"' : '') + '><div class="panel-head"><div class="panel-title">' + esc(title) +
      (note ? '<span class="panel-note">' + esc(note) + '</span>' : '') + '</div></div><div class="panel-body">' + body + '</div></section>';
  }

  function enumKeyFor(label, config) {
    return (config && config.enumKey) || (enumData().labelMap || {})[label] || '';
  }

  function optionHTML(value, selected) {
    return '<option value="' + esc(value) + '"' + (value === selected ? ' selected' : '') + '>' + esc(value) + '</option>';
  }

  function field(label, placeholder, type, required, config) {
    config = config || {};
    var key = enumKeyFor(label, config);
    var cascade = key && (enumData().cascades || {})[key];
    var selected = config.defaultValue || '';
    var options = key ? ((enumData().options || {})[key] || []) : [];
    if (!selected && placeholder && placeholder !== '请选择' && options.indexOf(placeholder) >= 0) selected = placeholder;
    var attrs = key ? ' data-enum-key="' + esc(key) + '"' : '';
    if (cascade) attrs += ' data-cascade-parent="' + esc(cascade.parentKey) + '"';
    var control;
    if (type === 'select') {
      var selectOptions = '<option value="">请选择</option>';
      if (!cascade) selectOptions += options.map(function (value) { return optionHTML(value, selected); }).join('');
      control = '<select aria-label="' + esc(label) + '"' + attrs + (cascade ? ' disabled' : '') + '>' + selectOptions + '</select>';
    } else {
      control = '<input type="text" placeholder="' + esc(placeholder || '请输入') + '"' + attrs + '>';
    }
    var wrapperAttrs = key ? ' data-field-key="' + esc(key) + '"' : '';
    if (config.visibleFor) wrapperAttrs += ' data-conditional-parent="' + esc(config.conditionalParent || 'businessScenario') + '" data-visible-for="' + esc(config.visibleFor) + '" hidden';
    return '<div class="field' + (config.className ? ' ' + esc(config.className) : '') + '"' + wrapperAttrs + '><label class="' + (required ? 'required' : '') + '">' + esc(label) + '</label>' + control + (config.help ? '<div class="field-help">' + esc(config.help) + '</div>' : '') + '</div>';
  }

  function searchPanel(fields, anno) {
    return panel('查询条件', '支持折叠/展开；本原型展示常用条件', '<div class="search-grid" data-filter-form data-anno="enum-cascade">' + fields.map(function (item) {
      return field(item[0], item[1], item[2], item[3], item[4]);
    }).join('') + '<div class="search-actions"><button class="button" data-action="reset" type="button">重置</button><button class="button primary" data-action="search" type="button">查询</button></div></div>', anno || 'search-area');
  }

  function cascadeContext(select, root) {
    return select.closest('[data-filter-form], .editor-grid, .modal-body, .panel-body') || root;
  }

  function setCascadeOptions(select, parentValue) {
    var key = select.getAttribute('data-enum-key');
    var cascade = (enumData().cascades || {})[key];
    if (!cascade) return;
    var values = parentValue ? (cascade.values[parentValue] || []) : [];
    var previous = select.value;
    select.innerHTML = '<option value="">' + (parentValue ? (values.length ? '请选择' : '暂无已确认枚举') : '请先选择上级条件') + '</option>' + values.map(function (value) { return optionHTML(value, previous); }).join('');
    select.disabled = !parentValue || !values.length;
    if (values.indexOf(previous) < 0) select.value = '';
  }

  function updateConditionalFields(context, parentKey, value) {
    Array.prototype.forEach.call(context.querySelectorAll('[data-conditional-parent="' + parentKey + '"]'), function (wrapper) {
      var allowed = (wrapper.getAttribute('data-visible-for') || '').split(',');
      wrapper.hidden = !value || allowed.indexOf(value) < 0;
      Array.prototype.forEach.call(wrapper.querySelectorAll('input,select,textarea'), function (control) { control.disabled = wrapper.hidden; });
    });
    var scenarioNote = context.querySelector('[data-scenario-note]');
    if (scenarioNote && parentKey === 'businessScenario') {
      var notes = {
        '售前营销':'展示车型、专营店及售前活动字段；日产售前分支还包含 CAP/直播/区域/试驾/新车上市。',
        '售后营销':'展示车型、专营店及售后核销范围。',
        '售后营销-上门取送车':'展示取送车适用车型与服务门店。',
        '商城营销':'展示适用商城商品，不展示门店与车型选择。'
      };
      scenarioNote.textContent = notes[value] || '请先选择业务场景，系统将联动卡券分类和适用范围。';
    }
  }

  function refreshCascadeTree(parentSelect, root) {
    var parentKey = parentSelect.getAttribute('data-enum-key');
    var context = cascadeContext(parentSelect, root);
    updateConditionalFields(context, parentKey, parentSelect.value);
    Array.prototype.forEach.call(context.querySelectorAll('select[data-cascade-parent="' + parentKey + '"]'), function (child) {
      setCascadeOptions(child, parentSelect.value);
      refreshCascadeTree(child, root);
    });
  }

  function initializeEnums(root) {
    if (!root) return;
    Array.prototype.forEach.call(root.querySelectorAll('select[data-cascade-parent]'), function (select) {
      var context = cascadeContext(select, root);
      var parentKey = select.getAttribute('data-cascade-parent');
      var parent = context.querySelector('select[data-enum-key="' + parentKey + '"]');
      setCascadeOptions(select, parent ? parent.value : '');
    });
    Array.prototype.forEach.call(root.querySelectorAll('select[data-enum-key]'), function (select) {
      updateConditionalFields(cascadeContext(select, root), select.getAttribute('data-enum-key'), select.value);
    });
  }

  function bindEnumInteractions(root) {
    if (!root) return;
    initializeEnums(root);
    if (root.getAttribute('data-enums-bound') === 'true') return;
    root.setAttribute('data-enums-bound', 'true');
    root.addEventListener('change', function (event) {
      var select = event.target.closest('select[data-enum-key]');
      if (select && root.contains(select)) refreshCascadeTree(select, root);
    });
  }

  function renderCell(value) {
    var statusValues = ['进行中','未开始','已关闭','草稿','启用','停用','已启用','已停用','执行完成','执行中','待执行','部分失败','已核销','已撤销','已生成'];
    if (statusValues.indexOf(String(value)) >= 0) {
      var cls = /完成|进行|启用|已核销|已生成/.test(value) ? 'on' : (/待|草稿|未开始|执行中/.test(value) ? 'pending' : 'off');
      return '<span class="status ' + cls + '">' + esc(value) + '</span>';
    }
    return esc(value);
  }

  function table(columns, rows, options) {
    options = options || {};
    var actions = options.actions === false ? false : true;
    var head = columns.map(function (col) { return '<th>' + esc(col) + '</th>'; }).join('') + (actions ? '<th>操作</th>' : '');
    var body;
    if (!rows || !rows.length) {
      body = '<tr><td colspan="' + (columns.length + (actions ? 1 : 0)) + '"><div class="empty-state"><i class="iconfont icon-wendangfujian empty-document-icon" aria-hidden="true"></i><strong>暂无数据</strong><div style="margin-top:4px">与 SIT 本次打开时的空态一致</div></div></td></tr>';
    } else {
      body = rows.map(function (row, rowIndex) {
        var viewAction = options.viewAction || 'view-row';
        var editAction = options.editAction || 'edit-row';
        return '<tr>' + columns.map(function (_, index) { return '<td>' + renderCell(row[index]) + '</td>'; }).join('') +
          (actions ? '<td><button class="link-action" data-action="' + esc(viewAction) + '" data-row-index="' + rowIndex + '" type="button">查看</button><button class="link-action" data-action="' + esc(editAction) + '" data-row-index="' + rowIndex + '" type="button">编辑</button></td>' : '') + '</tr>';
      }).join('');
    }
    return '<div class="table-shell"><table class="data-table"><thead><tr>' + head + '</tr></thead><tbody>' + body + '</tbody></table></div>' +
      '<div class="pagination-row"><span>共 ' + esc(options.total == null ? (rows || []).length : options.total) + ' 条</span><button class="page-no active" type="button">1</button><button class="page-no" type="button">2</button><button class="page-no" type="button">3</button></div>';
  }

  function listPanel(title, columns, rows, options, anno) {
    options = options || {};
    var tools = '<div><button class="button small" data-action="refresh" type="button">刷新</button> <button class="button small" data-action="columns" type="button">字段说明</button></div>';
    return '<section class="panel" data-anno="' + (anno || 'result-table') + '"><div class="panel-head"><div class="panel-title">' + esc(title) + '</div>' + tools + '</div><div class="panel-body">' + table(columns, rows, options) + '</div></section>';
  }

  function bindCommon(root) {
    bindEnumInteractions(root);
    Array.prototype.forEach.call(root.querySelectorAll('[data-nav]'), function (el) {
      el.addEventListener('click', function () { window.navigateTo(this.getAttribute('data-nav'), true); });
    });
    root.addEventListener('click', function (event) {
      var target = event.target.closest('[data-action]');
      if (!target) return;
      var action = target.getAttribute('data-action');
      if (action === 'open-spec') window.openPageSpec();
      if (action === 'reset') {
        Array.prototype.forEach.call(root.querySelectorAll('[data-filter-form] input'), function (input) { input.value = ''; });
        Array.prototype.forEach.call(root.querySelectorAll('[data-filter-form] select'), function (select) { select.selectedIndex = 0; });
        initializeEnums(root);
        window.showToast('查询条件已重置');
      }
      if (action === 'search') window.showToast('已按当前条件刷新演示列表');
      if (action === 'refresh') window.showToast('列表已刷新');
      if (action === 'columns') openColumnGuide();
      if (action === 'view-row') openRecordModal('查看详情', false);
      if (action === 'edit-row') openRecordModal('编辑记录', true);
      if (action === 'new-generic') openGenericCreate(target.getAttribute('data-modal-title') || '新建');
      if (action === 'export') window.showToast('原型仅模拟导出，不会下载或发送真实数据');
    });
  }

  function openColumnGuide() {
    window.openPrototypeModal({title:'字段说明',confirmText:false,body:'<div class="info-callout">字段名称与页面结构来自 SIT 只读检查；表格记录为演示 Mock。正式迭代时，请先更新 <code>mock/data.js</code>，再同步页面标注。</div>' +
      '<div class="annotation-summary" style="margin-top:14px"><div class="annotation-card"><div class="number">1</div><h4>查询字段</h4><p>控制列表过滤，不改变业务数据。</p></div><div class="annotation-card"><div class="number">2</div><h4>列表字段</h4><p>用于现状追踪、导出与操作入口。</p></div><div class="annotation-card"><div class="number">3</div><h4>状态字段</h4><p>状态口径需结合后端接口和枚举表确认。</p></div></div>'});
  }

  function openRecordModal(title, editable) {
    window.openPrototypeModal({title:title,confirmText:editable ? '保存演示' : false,body:'<div class="editor-grid" style="padding:0">' +
      field('记录ID','系统自动生成','input') + field('记录名称','演示记录','input') + field('当前状态','请选择','select') +
      '<div class="field span-3"><label>说明</label><textarea placeholder="查看或补充说明"></textarea></div></div>'});
    bindEnumInteractions(document.getElementById('prototypeModal'));
  }

  function openGenericCreate(title) {
    window.openPrototypeModal({title:title,wide:true,confirmText:'保存草稿',body:'<div class="info-callout">此弹窗用于验证后续修改入口，保存动作不会写入 SIT。</div><div class="editor-grid" style="padding:16px 0 0">' +
      field('名称','请输入名称','input',true) + field('品牌','请选择','select',true) + field('业务场景','请选择','select',true) +
      field('开始时间','请选择','input',true) + field('结束时间','请选择','input',true) + field('启用状态','请选择','select') +
      '<div class="field span-3"><label>备注</label><textarea placeholder="请输入功能说明或修改备注"></textarea></div></div>'});
    bindEnumInteractions(document.getElementById('prototypeModal'));
  }

  function overview() {
    var p = data().project || {};
    var kpis = '<div class="kpi-grid" data-anno="scope-kpis">' +
      '<div class="kpi-card"><strong>' + p.activityMenuCount + '</strong><span>活动中心 SIT 可见菜单</span></div>' +
      '<div class="kpi-card"><strong>' + p.activityCoreCount + '</strong><span>本原型活动中心核心页</span></div>' +
      '<div class="kpi-card"><strong>' + p.couponPageCount + '</strong><span>卡券中心一级功能页</span></div>' +
      '<div class="kpi-card"><strong>' + (p.axureActivityPages + p.axureCouponPages) + '</strong><span>两套 Axure 辅助页面总数</span></div></div>';
    function links(items) { return '<div class="module-links">' + items.map(function (item) { return '<button class="module-link" data-nav="' + item[0] + '" type="button">' + esc(item[1]) + '</button>'; }).join('') + '</div>'; }
    var modules = '<div class="module-grid" data-anno="module-map"><article class="module-card"><h3>活动中心 · 售后保客活动</h3><p>重点保留活动创建四步、组合活动、专属福利、互斥关系、一店一码和两类报表。</p>' + links(data().moduleLinks.activity) + '</article>' +
      '<article class="module-card"><h3>卡券中心 · 13 个现状页面</h3><p>覆盖建券、发券、领券、核销、限额、结算、报表、批量任务和领券中心配置。</p>' + links(data().moduleLinks.coupon) + '</article></div>';
    var flow = '<div class="flow-line"><div class="flow-node"><strong>活动配置</strong><span>活动中心内部操作</span></div><div class="flow-node"><strong>关联卡券</strong><span>活动中心 → 卡券中心</span></div><div class="flow-node"><strong>人群与车辆</strong><span>CDP / oneID → 活动中心</span></div><div class="flow-node"><strong>发券与领券</strong><span>活动中心 → 卡券中心</span></div><div class="flow-node"><strong>核销与统计</strong><span>店端 / 商城 → 卡券中心</span></div></div>';
    var notes = '<div class="annotation-summary"><div class="annotation-card"><div class="number">1</div><h4>证据优先级</h4><p>SIT 可见页面、字段、页签和状态优先于 Axure。</p></div><div class="annotation-card"><div class="number">2</div><h4>Axure 用途</h4><p>补充条件分支、字段联动、历史规则和跨系统流程。</p></div><div class="annotation-card"><div class="number">3</div><h4>后续修改</h4><p>从左侧进入具体页面；表格数据统一维护在 mock/data.js。</p></div></div>';
    return frame('overview', kpis + panel('模块地图','点击功能项进入可继续修改的页面原型',modules,'module-map-panel') + panel('核心业务链路','每个步骤都标识执行系统或系统交互',flow,'system-flow') + panel('原型标注约定','顶部“标注与说明”打开当前页说明；蓝色圆点为可编辑结构化标注',notes,'annotation-guide'));
  }

  window.Pages.overview = { render: overview, init: bindCommon };

  function activityList() {
    var actions = '<button class="button primary" data-action="new-activity" type="button">新增活动</button><button class="button" data-action="export" type="button">导出</button>';
    var body = searchPanel([['活动ID','请输入活动ID'],['活动名称','请输入活动名称'],['品牌','请选择','select'],['活动状态','请选择','select'],['业务子版块','请选择','select'],['触发方式','请选择','select']]) +
      listPanel('保客活动列表',['活动ID','活动名称','品牌','业务子版块','触发方式','活动状态','活动时间'],data().activityRows,{total:3},'activity-table');
    return frame('activity-list',body,actions);
  }

  function bindActivityList(root) {
    bindCommon(root);
    var btn = root.querySelector('[data-action="new-activity"]');
    if (btn) btn.addEventListener('click', function () { window.navigateTo('activity-editor', true); });
  }
  window.Pages['activity-list'] = {render:activityList,init:bindActivityList};

  function editorStepOne() {
    return '<div class="editor-grid" data-anno="activity-base-fields">' +
      '<div class="field"><label class="required">是否旧E3S活动</label><div class="radio-line"><label><input type="radio" name="e3s"> 是</label><label><input type="radio" name="e3s" checked> 否</label></div></div>' +
      '<div class="field"><label class="required">品牌<span class="lock-note">首次提交后锁定</span></label><div class="radio-line"><label><input type="radio" name="brand"> 东风日产</label><label><input type="radio" name="brand"> 启辰</label><label><input type="radio" name="brand" disabled> 英菲尼迪</label></div></div>' +
      field('活动名称','请输入活动名称，不超过30个字符','input',true) +
      '<div class="field"><label class="required">业务板块</label><div class="fake-input disabled">保客营销</div></div>' +
      '<div class="field span-2"><label class="required">业务子版块<span class="lock-note">首次提交后锁定</span></label><div class="radio-line"><label><input type="radio" name="sub"> 会员权益</label><label><input type="radio" name="sub"> 维保活动</label><label><input type="radio" name="sub"> 续保活动</label><label><input type="radio" name="sub"> 取送车活动</label></div></div>' +
      '<div class="field span-2"><label class="required">活动奖品<span class="lock-note">首次提交后锁定</span></label><div class="radio-line"><label><input type="radio" name="gift"> 卡券中心-卡券</label><label><input type="radio" name="gift"> 续保权益</label><label><input type="radio" name="gift"> 续保权益&售后卡券</label></div></div>' +
      field('活动时间','开始日期 → 结束日期','input',true) + field('活动类型','请选择','select',true) + field('活动主体','请选择','select',true) +
      '<div class="field span-3"><label class="required">触发方式</label><div class="radio-line"><label><input type="radio" name="trigger"> 后台统一推送</label><label><input type="radio" name="trigger"> 用户行为触发</label><label><input type="radio" name="trigger"> C端主动参与</label><label><input type="radio" name="trigger"> C端主动领取</label></div><div class="field-help">主开关：会控制关联卡券、活动对象、页面配置和分享字段的显隐。</div></div>' +
      field('客户政策','请输入客户政策') + field('专营店补贴','请输入补贴说明') + field('启用状态','启用','select',true) + '</div>';
  }

  function editorStepTwo() {
    return '<div class="editor-grid" data-anno="activity-coupon-fields">' +
      '<div class="field"><label class="required">卡券领取方式</label><div class="radio-line"><label><input type="radio" name="receive"> 自动领取</label><label><input type="radio" name="receive"> 手动领取</label></div></div>' +
      field('关联卡券','请选择卡券','input',true) + '<div class="field"><label>&nbsp;</label><button class="button" data-action="select-coupon" type="button">选择卡券</button></div>' +
      '<div class="field span-3"><label class="required">门店来源</label><div class="radio-line"><label><input type="radio" name="store"> 沿用卡券中心</label><label><input type="radio" name="store"> 单张卡券在活动中增减</label><label><input type="radio" name="store"> 活动统一配置</label></div></div>' +
      '<div class="field span-3"><label class="required">车型来源</label><div class="radio-line"><label><input type="radio" name="model"> 沿用卡券中心</label><label><input type="radio" name="model"> 单张卡券原范围内缩减</label><label><input type="radio" name="model"> 多卡券交集后统一缩减</label></div></div>' +
      '<div class="rule-card span-3"><h4>售后活动卡券叠加 / 互斥</h4><p>无、与全部券叠加、与指定券叠加、与全部券互斥、与指定券互斥。仅“指定”关系展开卡券搜索与选择。</p><div class="radio-line" style="margin-top:10px"><label><input type="radio" name="relation"> 无</label><label><input type="radio" name="relation"> 全部叠加</label><label><input type="radio" name="relation"> 指定叠加</label><label><input type="radio" name="relation"> 全部互斥</label><label><input type="radio" name="relation"> 指定互斥</label></div></div></div>';
  }

  function editorStepThree() {
    return '<div class="empty-state" data-anno="activity-object-empty"><i class="iconfont icon-wendangfujian empty-document-icon" aria-hidden="true"></i><strong>请先完成 step1 与 step2 的关键配置</strong><div style="margin-top:7px">当前 SIT 直接进入此步骤时可能为空；满足前置条件后，按场景展示 CDP 人群、用户/车辆、门店、车型/VIN、行为触发、卡券激活、续保权益等字段。</div><button class="button ghost-blue" data-step-target="1" type="button" style="margin-top:15px">返回基本信息</button></div>';
  }

  function editorStepFour() {
    return '<div class="editor-grid" data-anno="activity-share-fields">' + field('分享标题','请输入分享标题','input',true) + field('分享描述','请输入分享描述') + field('WAP/APP分享图标','上传图片') + field('小程序分享图标','上传图片') + field('SEO标题','请输入SEO标题') + field('SEO关键词','多个关键词用逗号分隔') + '<div class="field span-3"><label>SEO描述</label><textarea placeholder="请输入页面描述"></textarea></div></div>';
  }

  function pageConfigBody() {
    return '<div class="subtabs" data-page-config-tabs><button class="subtab active" data-config-tab="pre" type="button">未开始拦截页</button><button class="subtab" data-config-tab="topic" type="button">专题页</button><button class="subtab" data-config-tab="success" type="button">领券成功页</button><button class="subtab" data-config-tab="end" type="button">结束拦截页</button></div>' +
      '<div class="editor-grid" id="pageConfigFields"><div class="field"><label class="required">是否启用未开始拦截</label><div class="radio-line"><label><input type="radio" name="pre"> 是</label><label><input type="radio" name="pre"> 否</label></div></div><div class="field span-2"><label>提示文案</label><input type="text" placeholder="活动尚未开始，敬请期待"></div></div>';
  }

  function activityEditor() {
    var actions = '<button class="button primary" data-action="save-draft" type="button">保存草稿</button><button class="button primary" data-action="save-activity" type="button">确定</button><button class="button primary" data-nav="activity-list" type="button">返回</button>';
    var body = '<section class="panel" data-anno="activity-editor"><div class="subtabs" data-editor-top><button class="subtab active" data-editor-tab="base" type="button">基础配置</button><button class="subtab" data-editor-tab="page" type="button">页面配置</button></div>' +
      '<div id="activityEditorBody"><div class="steps" data-steps><button class="step active" data-index="1" data-step="1" type="button">step1：基本信息</button><button class="step" data-index="2" data-step="2" type="button">step2：关联卡券</button><button class="step" data-index="3" data-step="3" type="button">step3：活动对象</button><button class="step" data-index="4" data-step="4" type="button">step4：分享与SEO</button></div><div id="stepContent">' + editorStepOne() + '</div></div></section>' +
      '<div class="info-callout">标注：页面保持 SIT 的四步表单结构；Axure 用于补齐条件分支。当前原型不会提交到测试环境。</div>';
    return frame('activity-editor',body,actions);
  }

  function bindActivityEditor(root) {
    bindCommon(root);
    var stepContent = root.querySelector('#stepContent');
    var stepBodies = {1:editorStepOne,2:editorStepTwo,3:editorStepThree,4:editorStepFour};
    function activateStep(no) {
      stepContent.innerHTML = stepBodies[no]();
      Array.prototype.forEach.call(root.querySelectorAll('[data-step]'), function (el) { el.classList.toggle('active', el.getAttribute('data-step') === String(no)); });
      var back = stepContent.querySelector('[data-step-target]');
      if (back) back.addEventListener('click', function () { activateStep(this.getAttribute('data-step-target')); });
      bindStepActions();
    }
    function bindStepActions() {
      var selectCoupon = stepContent.querySelector('[data-action="select-coupon"]');
      if (selectCoupon) selectCoupon.addEventListener('click', function () {
        window.openPrototypeModal({title:'选择卡券',wide:true,body:'<div class="search-grid">' + field('卡券ID','请输入') + field('卡券名称','请输入') + field('业务场景','请选择','select') + '<div class="search-actions"><button class="button primary">查询</button></div></div><div style="margin-top:14px">' + table(['卡券ID','卡券名称','适用门店','适用车型','状态'],[['1424950','维保抵用券（演示）','126家','28个','启用']],{actions:false}) + '</div>'});
      });
    }
    Array.prototype.forEach.call(root.querySelectorAll('[data-step]'), function (el) { el.addEventListener('click', function () { activateStep(this.getAttribute('data-step')); }); });
    Array.prototype.forEach.call(root.querySelectorAll('[data-editor-tab]'), function (el) {
      el.addEventListener('click', function () {
        var tab = this.getAttribute('data-editor-tab');
        Array.prototype.forEach.call(root.querySelectorAll('[data-editor-tab]'), function (node) { node.classList.toggle('active', node === el); });
        root.querySelector('#activityEditorBody').innerHTML = tab === 'base' ? '<div class="steps" data-steps><button class="step active" data-index="1" data-step="1" type="button">step1：基本信息</button><button class="step" data-index="2" data-step="2" type="button">step2：关联卡券</button><button class="step" data-index="3" data-step="3" type="button">step3：活动对象</button><button class="step" data-index="4" data-step="4" type="button">step4：分享与SEO</button></div><div id="stepContent">' + editorStepOne() + '</div>' : pageConfigBody();
        if (tab === 'base') window.navigateTo('activity-editor', false);
        else bindPageConfig(root);
      });
    });
    var saveDraft = root.querySelector('[data-action="save-draft"]');
    var save = root.querySelector('[data-action="save-activity"]');
    if (saveDraft) saveDraft.addEventListener('click', function () { window.showToast('草稿保存为原型模拟，未写入 SIT'); });
    if (save) save.addEventListener('click', function () { window.showToast('确定操作已拦截：原型不会提交真实活动'); });
  }

  function bindPageConfig(root) {
    var fields = root.querySelector('#pageConfigFields');
    var renderers = {
      pre:function(){return '<div class="field"><label class="required">是否启用未开始拦截</label><div class="radio-line"><label><input type="radio"> 是</label><label><input type="radio"> 否</label></div></div><div class="field span-2"><label>提示文案</label><input placeholder="活动尚未开始，敬请期待"></div>';},
      topic:function(){return field('页面渠道','APP / 微信小程序 / 服务号','select',true)+field('背景图片','上传图片','input',true)+field('跳转链接','请输入链接','input')+'<div class="field span-3"><label>热点与卡券映射</label><textarea placeholder="配置图片热点、活动卡券ID与卡券状态"></textarea></div>';},
      success:function(){return field('领取成功提示','领取成功','input',true)+field('16:9底图','上传图片','input')+field('核销码查询路径','我的-我的卡券','input');},
      end:function(){return '<div class="field"><label class="required">是否启用结束拦截</label><div class="radio-line"><label><input type="radio"> 是</label><label><input type="radio"> 否</label></div></div><div class="field span-2"><label>提示文案</label><input placeholder="活动已结束"></div>';}
    };
    Array.prototype.forEach.call(root.querySelectorAll('[data-config-tab]'), function (el) {
      el.addEventListener('click', function () {
        Array.prototype.forEach.call(root.querySelectorAll('[data-config-tab]'), function (node) { node.classList.toggle('active', node === el); });
        fields.innerHTML = renderers[this.getAttribute('data-config-tab')]();
      });
    });
  }
  window.Pages['activity-editor'] = {render:activityEditor,init:bindActivityEditor};

  function simpleActivityPage(key, filters, columns, rows, total, createText) {
    var actions = (createText ? '<button class="button primary" data-action="new-generic" data-modal-title="' + esc(createText) + '" type="button">' + esc(createText) + '</button>' : '') + '<button class="button" data-action="export" type="button">导出</button>';
    return frame(key, searchPanel(filters) + listPanel(spec(key).title,columns,rows,{total:total},'result-table'),actions);
  }

  var comboDraft = null;
  var comboEditorMode = 'create';
  var comboStoreImportDemoIds = ['S002','S005','S007'];

  function createComboStoreUI() {
    return {tab:'all',keyword:'',selection:new Set(),importOpen:false,importFileName:''};
  }
  var comboStoreUI = createComboStoreUI();

  function cloneCombo(value) { return JSON.parse(JSON.stringify(value)); }
  function comboStoreById(id) {
    return (data().stores || []).find(function (store) { return store.id === id; });
  }
  function availableComboStores() {
    return (data().stores || []).filter(function (store) { return store.available; });
  }
  function comboStoreNames(ids) {
    return (ids || []).map(comboStoreById).filter(function (store) { return store && store.available; }).map(function (store) { return store.name; });
  }
  function comboScopeSummary(scope) {
    var ids = scope && scope.mode === 'SPECIFIED' ? (scope.storeIds || []) : [];
    var names = comboStoreNames(ids);
    if (!names.length) return '<strong>全部门店</strong><span class="combo-scope-pill all">默认</span><p>未配置指定门店，适用于全部可用门店。</p>';
    return '<strong>指定 ' + names.length + ' 家门店</strong><span class="combo-scope-pill specified">已配置</span><p>' + esc(names.slice(0,3).join('、') + (names.length > 3 ? ' 等 ' + names.length + ' 家' : '')) + '</p>';
  }
  function comboField(label, value, attrs, help, required) {
    return '<div class="field"><label class="' + (required ? 'required' : '') + '">' + esc(label) + '</label><input value="' + esc(value || '') + '" ' + (attrs || '') + '>' + (help ? '<div class="field-help">' + esc(help) + '</div>' : '') + '</div>';
  }
  function comboEditorBody(readonly) {
    var disabled = readonly ? 'readonly' : '';
    var brandOptions = ['东风日产','启辰','英菲尼迪'].map(function (brand) {
      return '<option value="' + esc(brand) + '"' + (brand === comboDraft.brand ? ' selected' : '') + '>' + esc(brand) + '</option>';
    }).join('');
    var childRows = (comboDraft.childActivities || []).map(function (id, index) {
      return '<tr><td>' + (index + 1) + '</td><td>' + esc(id) + '</td><td>读取原活动配置</td><td>子活动名称不受展示名称影响</td></tr>';
    }).join('') || '<tr><td colspan="4"><div class="empty-state" style="padding:22px">创建后可继续关联子活动</div></td></tr>';
    return '<div class="info-callout combo-rule-callout"><strong>展示优先级：</strong>SA 动态二维码链路优先展示“组合活动展示名称”；未配置时回退原组合活动名称。</div>' +
      '<div class="editor-grid combo-editor-grid" data-anno="combo-editor-fields">' +
      comboField('组合活动ID',comboDraft.id,'readonly','系统生成，不作为对外展示名称') +
      '<div class="field"><label class="required">品牌</label><select data-combo-field="brand" ' + (readonly ? 'disabled' : '') + '>' + brandOptions + '</select></div>' +
      comboField('组合活动名称',comboDraft.name,'data-combo-field="name" maxlength="30" ' + disabled,'后台主体名称，必填',true) +
      comboField('组合活动展示名称',comboDraft.displayName,'data-combo-field="displayName" maxlength="30" ' + disabled,'选填；为空时自动回退组合活动名称') +
      comboField('组合活动时间',comboDraft.period,'data-combo-field="period" ' + disabled,'开始时间默认 00:00:00，结束时间默认 23:59:59',true) +
      comboField('推广渠道',comboDraft.channel,'data-combo-field="channel" ' + disabled,'渠道与品牌对应',true) +
      comboField('活动链接',comboDraft.activityLink,'data-combo-field="activityLink" ' + (comboEditorMode === 'create' && !readonly ? '' : 'readonly'),'创建后不可修改',true) +
      comboField('启用状态',comboDraft.status,'readonly','本原型不提交真实状态') +
      '<div class="field span-3 combo-scope-field" data-anno="combo-store-scope"><label>适用门店 <span class="optional-note">选填</span></label><div class="combo-scope-card"><div class="combo-scope-icon">' + (comboDraft.storeScope.mode === 'SPECIFIED' ? '店' : '全') + '</div><div class="combo-scope-copy">' + comboScopeSummary(comboDraft.storeScope) + '</div>' +
      (!readonly ? '<div class="combo-scope-actions"><button class="button primary" data-combo-configure-stores type="button">' + (comboDraft.storeScope.mode === 'SPECIFIED' ? '重新配置' : '配置适用门店') + '</button>' + (comboDraft.storeScope.mode === 'SPECIFIED' ? '<button class="button danger" data-combo-clear-stores type="button">清空</button>' : '') + '</div>' : '') + '</div>' +
      '<div class="combo-scope-help"><strong>不配置即适用于所有门店。</strong> SA 动态二维码仅允许归属门店命中本范围的 SA 查看并分享；此范围不修改子活动或卡券核销门店。</div></div>' +
      '<div class="field span-3"><label>已关联子活动</label><div class="table-shell combo-child-table"><table class="data-table"><thead><tr><th>序号</th><th>子活动ID</th><th>配置来源</th><th>名称规则</th></tr></thead><tbody>' + childRows + '</tbody></table></div></div></div>';
  }

  function syncComboDraftFromEditor() {
    var modal = document.getElementById('prototypeModal');
    if (!modal || !comboDraft) return;
    Array.prototype.forEach.call(modal.querySelectorAll('[data-combo-field]'), function (input) {
      comboDraft[input.getAttribute('data-combo-field')] = input.value;
    });
  }

  function bindComboEditorInteractions() {
    var modal = document.getElementById('prototypeModal');
    if (!modal) return;
    var configure = modal.querySelector('[data-combo-configure-stores]');
    if (configure) configure.addEventListener('click', function () {
      syncComboDraftFromEditor();
      comboStoreUI = createComboStoreUI();
      if (comboDraft.storeScope && comboDraft.storeScope.mode === 'SPECIFIED') {
        (comboDraft.storeScope.storeIds || []).forEach(function (id) {
          var store = comboStoreById(id);
          if (store && store.available) comboStoreUI.selection.add(id);
        });
      }
      openComboStoreSelector();
    });
    var clear = modal.querySelector('[data-combo-clear-stores]');
    if (clear) clear.addEventListener('click', function () {
      syncComboDraftFromEditor();
      window.openPrototypeModal({title:'清空适用门店',confirmText:'确认清空',body:'<div class="info-callout">清空后将恢复为“全部门店”，所有满足其他投放条件的 SA 均可查看并分享此组合活动。</div>',onCancel:function(){openComboEditor(comboEditorMode);},onConfirm:function(){comboDraft.storeScope={mode:'ALL',storeIds:[]};openComboEditor(comboEditorMode);window.showToast('已恢复为全部门店');}});
    });
  }

  function openComboEditor(mode, record, readonly) {
    comboEditorMode = mode || comboEditorMode;
    if (record) comboDraft = cloneCombo(record);
    if (!comboDraft) {
      comboDraft = {id:'保存后生成',name:'',displayName:'',brand:'东风日产',period:'',channel:'',status:'草稿',activityLink:'',storeScope:{mode:'ALL',storeIds:[]},childActivities:[]};
    }
    window.openPrototypeModal({
      title: readonly ? '查看组合活动' : (comboEditorMode === 'create' ? '新增组合活动' : '编辑组合活动'),
      wide:true,
      confirmText:readonly ? false : '保存草稿',
      body:comboEditorBody(Boolean(readonly)),
      onConfirm:function(){
        syncComboDraftFromEditor();
        if (!String(comboDraft.name || '').trim()) { window.showToast('请填写组合活动名称'); return; }
        comboDraft.displayName = String(comboDraft.displayName || '').trim();
        window.closePrototypeModal();
        window.showToast('组合活动草稿已保存为原型模拟；实际展示名：' + (comboDraft.displayName || comboDraft.name));
      }
    });
    bindComboEditorInteractions();
  }

  function comboUniqueValues(items, key) {
    return items.map(function (item) { return item[key]; }).filter(function (value, index, values) { return values.indexOf(value) === index; });
  }
  function filteredComboStores() {
    var keyword = comboStoreUI.keyword.trim().toLowerCase();
    return availableComboStores().filter(function (store) {
      if (comboStoreUI.tab === 'selected' && !comboStoreUI.selection.has(store.id)) return false;
      if (!keyword) return true;
      return [store.name,store.code,store.brand,store.province,store.city].some(function (value) { return String(value).toLowerCase().indexOf(keyword) > -1; });
    });
  }
  function comboGroupRow(label, stores, level) {
    var ids = stores.map(function (store) { return store.id; });
    var selected = ids.filter(function (id) { return comboStoreUI.selection.has(id); }).length;
    var checked = ids.length > 0 && selected === ids.length;
    var partial = selected > 0 && selected < ids.length;
    return '<div class="combo-store-row group level-' + level + '"><label><input type="checkbox" data-combo-store-group="' + ids.join(',') + '"' + (checked ? ' checked' : '') + (partial ? ' data-partial="true"' : '') + '><span>' + esc(label) + '</span></label><small>' + selected + '/' + ids.length + '</small></div>';
  }
  function renderComboStoreTree() {
    var stores = filteredComboStores();
    if (!stores.length) return '<div class="empty-state combo-store-empty"><strong>没有匹配的可用门店</strong><div>调整搜索条件或切换“全部门店”页签。</div></div>';
    var html = '';
    comboUniqueValues(stores,'brand').forEach(function (brand) {
      var brandStores = stores.filter(function (store) { return store.brand === brand; });
      html += comboGroupRow(brand,brandStores,1);
      comboUniqueValues(brandStores,'province').forEach(function (province) {
        var provinceStores = brandStores.filter(function (store) { return store.province === province; });
        html += comboGroupRow(province,provinceStores,2);
        comboUniqueValues(provinceStores,'city').forEach(function (city) {
          var cityStores = provinceStores.filter(function (store) { return store.city === city; });
          html += comboGroupRow(city,cityStores,3);
          cityStores.forEach(function (store) {
            html += '<div class="combo-store-row store level-4"><label><input type="checkbox" data-combo-store-id="' + esc(store.id) + '"' + (comboStoreUI.selection.has(store.id) ? ' checked' : '') + '><span><strong>' + esc(store.name) + '</strong><small>门店编码：' + esc(store.code) + '</small></span></label></div>';
          });
        });
      });
    });
    return html;
  }
  function comboStoreImportPreview() {
    return comboStoreImportDemoIds.map(comboStoreById).filter(function (store) { return store && store.available; });
  }
  function renderComboStoreImportPanel() {
    var fileName = comboStoreUI.importFileName;
    var previewStores = comboStoreImportPreview();
    var previewRows = previewStores.map(function (store, index) {
      return '<tr><td>' + (index + 1) + '</td><td>' + esc(store.code) + '</td><td>' + esc(store.name) + '</td><td><span class="combo-import-status">可导入</span></td></tr>';
    }).join('');
    var preview = fileName ? '<div class="combo-store-import-file"><span>已选择文件</span><strong>' + esc(fileName) + '</strong></div>' +
      '<div class="combo-store-import-summary"><div><strong>' + previewStores.length + '</strong><span>演示数据行</span></div><div><strong>' + previewStores.length + '</strong><span>可用门店</span></div><div><strong>0</strong><span>演示失败行</span></div></div>' +
      '<div class="table-shell combo-store-import-preview"><table class="data-table"><thead><tr><th>序号</th><th>门店编码</th><th>门店名称</th><th>演示校验</th></tr></thead><tbody>' + previewRows + '</tbody></table></div>' :
      '<div class="combo-store-import-empty"><strong>选择文件后显示演示校验结果</strong><span>本静态原型不解析真实 Excel，也不会上传任何门店数据。</span></div>';
    return '<section class="combo-store-import-panel" data-anno="combo-store-import"><div class="combo-store-import-title"><div><strong>覆盖导入门店</strong><span>确认后将清空当前已选门店，并以导入结果作为新的适用门店范围。</span></div><span class="combo-import-badge">仅覆盖</span></div>' +
      '<div class="combo-store-import-warning"><strong>原型边界：</strong>正式模板字段、文件限制、重复或无效门店处理及错误明细均待确认；当前仅用固定 Mock 结果演示覆盖语义。</div>' +
      '<label class="combo-store-upload-box"><input data-combo-store-import-file type="file" accept=".xlsx,.xls"><span class="combo-store-upload-icon">XLSX</span><span><strong>' + (fileName ? '重新选择文件' : '选择门店导入文件') + '</strong><small>原型入口暂接受 .xlsx / .xls；正式格式待确认</small></span></label>' +
      preview + '<div class="combo-store-import-actions"><button class="button" data-combo-store-import-cancel type="button">返回手工选择</button><button class="button primary" data-combo-store-import-confirm type="button"' + (fileName ? '' : ' disabled') + '>确认覆盖导入</button></div></section>';
  }
  function bindComboStoreSelector() {
    var modal = document.getElementById('prototypeModal');
    if (!modal) return;
    Array.prototype.forEach.call(modal.querySelectorAll('[data-partial="true"]'), function (input) { input.indeterminate = true; });
    Array.prototype.forEach.call(modal.querySelectorAll('[data-combo-store-id]'), function (input) {
      input.addEventListener('change', function () { if (input.checked) comboStoreUI.selection.add(input.getAttribute('data-combo-store-id')); else comboStoreUI.selection.delete(input.getAttribute('data-combo-store-id')); openComboStoreSelector(); });
    });
    Array.prototype.forEach.call(modal.querySelectorAll('[data-combo-store-group]'), function (input) {
      input.addEventListener('change', function () { input.getAttribute('data-combo-store-group').split(',').filter(Boolean).forEach(function (id) { if (input.checked) comboStoreUI.selection.add(id); else comboStoreUI.selection.delete(id); }); openComboStoreSelector(); });
    });
    Array.prototype.forEach.call(modal.querySelectorAll('[data-combo-store-tab]'), function (button) {
      button.addEventListener('click', function () { comboStoreUI.tab = button.getAttribute('data-combo-store-tab'); comboStoreUI.importOpen=false;comboStoreUI.importFileName='';openComboStoreSelector(); });
    });
    var search = modal.querySelector('[data-combo-store-search]');
    var runSearch = function () { comboStoreUI.keyword = search ? search.value : ''; openComboStoreSelector(); };
    var searchButton = modal.querySelector('[data-combo-store-search-button]');
    if (searchButton) searchButton.addEventListener('click', runSearch);
    if (search) search.addEventListener('keydown', function (event) { if (event.key === 'Enter') runSearch(); });
    var reset = modal.querySelector('[data-combo-store-reset]');
    if (reset) reset.addEventListener('click', function () { comboStoreUI.keyword='';openComboStoreSelector(); });
    var clear = modal.querySelector('[data-combo-store-clear]');
    if (clear) clear.addEventListener('click', function () { comboStoreUI.selection.clear();openComboStoreSelector(); });
    var openImport = modal.querySelector('[data-combo-store-import-open]');
    if (openImport) openImport.addEventListener('click', function () { comboStoreUI.importOpen=true;comboStoreUI.importFileName='';openComboStoreSelector(); });
    var importFile = modal.querySelector('[data-combo-store-import-file]');
    if (importFile) importFile.addEventListener('change', function () {
      var file = importFile.files && importFile.files[0];
      if (!file) return;
      if (!/\.xlsx?$/i.test(file.name)) { window.showToast('请选择 .xlsx 或 .xls 文件（原型演示）'); return; }
      comboStoreUI.importFileName=file.name;
      openComboStoreSelector();
    });
    var cancelImport = modal.querySelector('[data-combo-store-import-cancel]');
    if (cancelImport) cancelImport.addEventListener('click', function () { comboStoreUI.importOpen=false;comboStoreUI.importFileName='';openComboStoreSelector(); });
    var confirmImport = modal.querySelector('[data-combo-store-import-confirm]');
    if (confirmImport) confirmImport.addEventListener('click', function () {
      if (!comboStoreUI.importFileName) { window.showToast('请先选择门店导入文件'); return; }
      var previousCount = comboStoreUI.selection.size;
      var importedIds = comboStoreImportPreview().map(function (store) { return store.id; });
      comboStoreUI.selection = new Set(importedIds);
      comboStoreUI.tab='selected';
      comboStoreUI.keyword='';
      comboStoreUI.importOpen=false;
      comboStoreUI.importFileName='';
      openComboStoreSelector();
      window.showToast('覆盖导入完成：原已选 ' + previousCount + ' 家，现为 ' + importedIds.length + ' 家（Mock）');
    });
  }
  function openComboStoreSelector() {
    var body = '<div class="combo-store-info"><strong>适用范围：</strong>列表仅展示可用门店；不选择任何门店时按全部门店生效。</div>' +
      (comboStoreUI.importOpen ? '' : '<div class="combo-store-search"><input data-combo-store-search placeholder="输入门店名称、编码、省或城市" value="' + esc(comboStoreUI.keyword) + '"><button class="button primary" data-combo-store-search-button type="button">搜索</button><button class="button" data-combo-store-reset type="button">重置</button></div>') +
      '<div class="combo-store-tabs"><div class="combo-store-tab-list"><button class="' + (comboStoreUI.tab === 'all' && !comboStoreUI.importOpen ? 'active' : '') + '" data-combo-store-tab="all" type="button">全部门店</button><button class="' + (comboStoreUI.tab === 'selected' && !comboStoreUI.importOpen ? 'active' : '') + '" data-combo-store-tab="selected" type="button">已选门店（' + comboStoreUI.selection.size + '）</button></div><div class="combo-store-tab-actions"><button class="button' + (comboStoreUI.importOpen ? ' primary' : '') + '" data-combo-store-import-open type="button">导入门店</button><button class="link-action" data-combo-store-clear type="button">清空已选</button></div></div>' +
      (comboStoreUI.importOpen ? renderComboStoreImportPanel() : '<div class="combo-store-tree" data-anno="combo-store-selector">' + renderComboStoreTree() + '</div><div class="combo-store-footer-note">当前已选 <strong>' + comboStoreUI.selection.size + '</strong> 家；零家确认后按“全部门店”生效。</div>');
    window.openPrototypeModal({title:'选择适用门店',wide:true,confirmText:comboStoreUI.importOpen ? false : '确定',body:body,onCancel:function(){openComboEditor(comboEditorMode);},onConfirm:function(){var ids=Array.from(comboStoreUI.selection);comboDraft.storeScope=ids.length?{mode:'SPECIFIED',storeIds:ids}:{mode:'ALL',storeIds:[]};openComboEditor(comboEditorMode);}});
    bindComboStoreSelector();
  }

  function comboActivityPage() {
    var actions = '<button class="button primary" data-action="combo-new" type="button">新增组合活动</button><button class="button" data-action="export" type="button">导出</button>';
    var body = searchPanel([['组合活动ID','请输入'],['组合活动名称','请输入'],['状态','请选择','select']]) +
      listPanel('组合活动列表',['组合活动ID','组合活动名称','组合活动展示名称','渠道','活动数','卡券数','状态','创建时间'],data().comboRows,{total:2,viewAction:'combo-view',editAction:'combo-edit'},'result-table');
    return frame('activity-combo',body,actions);
  }
  function bindComboActivity(root) {
    bindCommon(root);
    root.addEventListener('click',function(event){
      var target=event.target.closest('[data-action]');
      if(!target)return;
      var action=target.getAttribute('data-action');
      if(action==='combo-new'){comboDraft=null;comboStoreUI=createComboStoreUI();openComboEditor('create');}
      if(action==='combo-view'){var viewRecord=(data().comboActivities||[])[Number(target.getAttribute('data-row-index'))];comboDraft=null;openComboEditor('edit',viewRecord,true);}
      if(action==='combo-edit'){var editRecord=(data().comboActivities||[])[Number(target.getAttribute('data-row-index'))];comboDraft=null;comboStoreUI=createComboStoreUI();openComboEditor('edit',editRecord,false);}
    });
  }
  window.Pages['activity-combo'] = {render:comboActivityPage,init:bindComboActivity};
  window.Pages['activity-benefit'] = {render:function(){return simpleActivityPage('activity-benefit',[['活动ID','请输入'],['活动名称','请输入'],['状态','请选择','select']],['活动ID','活动名称','露出开始时间','露出结束时间','适用人群','状态'],data().benefitRows,2,'新增专属福利活动');},init:bindCommon};

  function activityExclusive() {
    var body = '<section class="panel" data-anno="exclusive-tabs"><div class="subtabs"><button class="subtab active" data-exclusive-tab="activity" type="button">活动互斥</button><button class="subtab" data-exclusive-tab="coupon" type="button">卡券互斥</button></div><div class="panel-body">' +
      '<div id="exclusiveSearch">' + searchPanel([['主活动ID','请输入'],['主活动名称','请输入']]) + '</div><div id="exclusiveTable">' +
      listPanel('活动互斥列表',['主活动ID','主活动名称','互斥活动ID','互斥活动名称','关系','来源'],data().exclusiveRows.activity,{total:2},'exclusive-table') + '</div></div></section>' +
      '<div class="info-callout">业务边界：本页是售后活动中心的活动互斥/活动内卡券叠加互斥；卡券中心独立“叠加规则”服务售前场景，两者不重复、不冲突，也不存在优先级覆盖。</div>';
    return frame('activity-exclusive',body);
  }
  function bindExclusive(root) {
    bindCommon(root);
    Array.prototype.forEach.call(root.querySelectorAll('[data-exclusive-tab]'), function (el) {
      el.addEventListener('click', function () {
        var key = this.getAttribute('data-exclusive-tab');
        Array.prototype.forEach.call(root.querySelectorAll('[data-exclusive-tab]'), function (node) { node.classList.toggle('active', node === el); });
        root.querySelector('#exclusiveTable').innerHTML = key === 'activity' ? listPanel('活动互斥列表',['主活动ID','主活动名称','互斥活动ID','互斥活动名称','关系','来源'],data().exclusiveRows.activity,{total:2},'exclusive-table') : listPanel('卡券互斥列表',['主卡券ID','主卡券名称','叠加/互斥卡券ID','叠加/互斥卡券名称','叠加/互斥关系','来源活动ID'],data().exclusiveRows.coupon,{total:7},'exclusive-table');
      });
    });
  }
  window.Pages['activity-exclusive'] = {render:activityExclusive,init:bindExclusive};
  window.Pages['activity-qr'] = {render:function(){return simpleActivityPage('activity-qr',[['活动ID','请输入'],['活动名称','请输入'],['门店编码','请输入']],['活动ID','活动名称','门店编码','门店名称','二维码状态','二维码'],data().qrRows,2,null);},init:bindCommon};
  window.Pages['activity-report'] = {render:function(){return simpleActivityPage('activity-report',[['活动ID','请输入'],['活动名称','请输入'],['统计时间','不超过3个月']],['活动ID','活动名称','触发类型','PV','UV','参与人数','转化率'],data().activityReportRows,2,null);},init:bindCommon};
  window.Pages['activity-trigger-report'] = {render:function(){return simpleActivityPage('activity-trigger-report',[['活动ID','请输入'],['活动名称','请输入'],['场景标识','请输入']],['活动ID','活动名称','场景','场景标识','上报数','成功数','失败数','最近上报时间'],data().triggerReportRows,2,null);},init:bindCommon};

  var couponConfigs = {
    'coupon-legacy-issue': {filters:[['模板ID','请输入'],['模板名称','请输入'],['发放人','请输入'],['发放时间','请选择']],columns:['模板ID','模板名称','发放人','发放ID','发放数量','状态'],total:414,create:'发放优惠券'},
    'coupon-receive-record': {filters:[['主场景','请选择','select'],['子场景','请选择','select'],['卡券ID','请输入']],columns:['卡券ID','领券ID','核销码','卡券名称','核销方式','主场景','子场景','关联活动ID','卡券类型','创建角色','领券时间','激活状态','核销状态','卡券状态','客户姓名','领券手机','ONEID','VIN','意向品牌','意向车系','意向车型','门店大区','门店小区','意向门店','活动名称','领券渠道'],total:0,empty:true},
    'coupon-list': {filters:[['卡券ID','请输入'],['卡券名称','请输入'],['归属网点','请选择','select']],columns:['卡券ID','卡券名称','业务场景','卡券分类','面值','适用范围','核销方式','发放数量','领取数量','状态'],total:0,empty:true,create:'新建卡券'},
    'coupon-limit': {filters:[['品牌','请选择','select'],['业务场景','请选择','select'],['任务状态','请选择','select']],columns:['任务ID','品牌','业务板块','业务场景','门店数','车型数','任务状态'],total:28,create:'新建任务'},
    'coupon-after-report': {filters:[['品牌','请选择','select'],['大区','请选择','select'],['小区','请选择','select'],['专营店','请选择','select']],columns:['大区','小区','专营店','推送数','激活数','使用数','使用率','预计补贴'],total:2},
    'coupon-business-report': {filters:[['品牌','请选择','select'],['大区','请选择','select'],['小区','请选择','select'],['省份/城市','请选择','select']],columns:['品牌','大区','小区','城市','发券数','核销数','最大优惠','平均优惠'],total:2},
    'coupon-writeoff': {filters:[['主场景','请选择','select'],['子场景','请选择','select'],['卡券ID','请输入']],columns:['卡券ID','核销ID','卡券名称','场景','核销门店','理论补贴','实际补贴','核销状态'],total:2},
    'coupon-issue': {filters:[['发放ID','请输入'],['卡券ID','请输入'],['卡券名称','请输入'],['任务状态','请选择','select']],columns:['发放ID','任务名称','卡券模板ID','发放数量','成功数量','失败数量','发放方式','状态'],total:341,create:'新建发放任务'},
    'coupon-issue-record': {filters:[['VIN','请输入'],['手机号','请输入'],['发放状态','请选择','select']],columns:['VIN','手机号','ONEID','到账状态','领取状态','发放状态','失败原因'],total:13302},
    'coupon-rules': {filters:[['模板ID','请输入'],['模板名称','请输入']],columns:['规则ID','模板ID','模板名称','结算场景','结算口径','状态'],total:225,create:'新建结算规则'},
    'coupon-dealer-task': {filters:[['创建时间','请选择'],['发放人','请输入'],['任务状态','请选择','select']],columns:['任务ID','发放人','品牌','创建时间','执行方式','数量','状态'],total:103,create:'新建任务'},
    'coupon-batch': {filters:[['创建时间','请选择'],['发放人','请输入'],['任务状态','请选择','select']],columns:['任务ID','发放人','任务类型','创建时间','卡券数量','状态'],total:15,create:'新建批量任务'},
    'coupon-redemption': {filters:[['品牌','请选择','select'],['领券窗口','请选择','select'],['卡券栏目','请选择','select']],columns:['领券窗口','品牌栏目','卡券栏目','已选卡券','状态','总数据'],total:4492,create:'领券窗口设置'}
  };

  function couponStack(lines) {
    return '<div class="coupon-detail-stack">' + lines.map(function (line) { return '<div>' + esc(line) + '</div>'; }).join('') + '</div>';
  }

  function currentCouponList() {
    var currentRows = [
      {
        no:'1', card:['卡券ID：1425024','卡券类型：代金券','卡券面值：100元','卡券名称：商城领券测试716-01','卡券归属：厂家'],
        range:['适用品牌：东风日产-日产','适用场景：会员商城(新)','适用门店：-','适用车系：-'],
        verify:['核销方式：线上核销','核销条件：否','核销渠道：-','核销时间：-','领券时间：2026-07-16 至 2026-08-31'],
        total:['发放数量：10000','库存数量：10000'],
        time:['创建时间：2026-07-16 10:48:07','创建者：xtadmin','更新时间：2026-07-16 10:48:19','更新者：-','创券来源：卡券中心']
      },
      {
        no:'2', card:['卡券ID：1424950','卡券类型：折扣券','卡券面值：8.0折','卡券名称：旧商城折扣8折，门槛10元','卡券归属：厂家'],
        range:['适用品牌：东风日产-日产','适用场景：会员商城(新)','适用门店：查看','适用车系：-'],
        verify:['核销方式：线上核销','核销条件：否','核销渠道：-','核销时间：-','领券时间：2026-07-08 至 2026-07-31'],
        total:['发放数量：500','库存数量：500'],
        time:['创建时间：2026-07-09 11:37:15','创建者：xtadmin','更新时间：2026-07-16 09:05:52','更新者：-','创券来源：卡券中心']
      },
      {
        no:'3', card:['卡券ID：1425022','卡券类型：代金券','卡券面值：2元','卡券名称：代金券2-wwk','卡券归属：厂家'],
        range:['适用品牌：东风日产-日产','适用场景：新商城','适用门店：-','适用车系：-'],
        verify:['核销方式：线上核销','核销条件：否','核销渠道：-','核销时间：-','领券时间：2026-07-15 至 2026-09-30'],
        total:['发放数量：999','库存数量：999'],
        time:['创建时间：2026-07-15 17:36:16','创建者：hanzy','更新时间：2026-07-15 17:37:36','更新者：-','创券来源：卡券中心']
      },
      {
        no:'4', card:['卡券ID：1425023','卡券类型：折扣券','卡券面值：9.0折','卡券名称：9折券-wwk','卡券归属：厂家'],
        range:['适用品牌：东风日产-日产','适用场景：新商城','适用门店：-','适用车系：-'],
        verify:['核销方式：线上核销','核销条件：否','核销渠道：-','核销时间：-','领券时间：2026-07-15 至 2026-09-30'],
        total:['发放数量：99','库存数量：99'],
        time:['创建时间：2026-07-15 17:37:25','创建者：hanzy','更新时间：2026-07-15 17:37:32','更新者：-','创券来源：卡券中心']
      },
      {
        no:'5', card:['卡券ID：1425017','卡券类型：折扣券','卡券面值：4.0折','卡券名称：4折券-wwk','卡券归属：厂家'],
        range:['适用品牌：东风日产-日产','适用场景：新商城','适用门店：-','适用车系：-'],
        verify:['核销方式：线上核销','核销条件：否','核销渠道：-','核销时间：-','领券时间：2026-07-15 至 2026-09-30'],
        total:['发放数量：99','库存数量：99'],
        time:['创建时间：2026-07-15 16:48:39','创建者：hanzy','更新时间：2026-07-15 17:21:57','更新者：-','创券来源：卡券中心']
      }
    ];
    var rows = currentRows.map(function (row) {
      return '<tr><td class="coupon-seq">' + row.no + '</td><td>' + couponStack(row.card) + '</td><td>' + couponStack(row.range) + '</td><td>' + couponStack(row.verify) + '</td><td>' + couponStack(row.total) + '</td><td>' + couponStack(row.time) + '</td><td><span class="coupon-live-status">已投放</span></td><td><div class="coupon-row-actions"><button class="button coupon-view" data-action="view-row" type="button">查看</button><button class="button coupon-disable" type="button">禁用</button><button class="button" type="button">复制</button></div></td></tr>';
    }).join('');
    var filters = '<section class="coupon-search-panel" data-anno="search-area"><div class="search-grid" data-filter-form>' +
      field('卡券ID','请输入') + field('卡券名称','请输入') + field('归属网点','请输入') +
      '<div class="search-actions"><button class="button" data-action="reset" type="button">重置</button><button class="button primary" data-action="search" type="button">查询</button><button class="button expand-button" type="button">展开</button></div></div></section>';
    var tools = '<div class="coupon-toolbar"><button class="button primary" data-action="export" type="button">查看导出记录</button><button class="button primary" data-action="export" type="button">售前卡券导出</button><button class="button primary" data-action="export" type="button">导出</button><button class="button primary" data-action="new-coupon" type="button">＋ 新建</button><button class="header-icon" data-action="refresh" type="button" title="刷新"><i class="iconfont icon-shuaxin" aria-hidden="true"></i></button><button class="header-icon" data-action="columns" type="button" title="字段说明"><i class="iconfont icon-icon_shezhi" aria-hidden="true"></i></button></div>';
    var list = '<section class="panel coupon-list-panel" data-anno="coupon-table"><div class="panel-head"><div class="panel-title">卡券列表</div>' + tools + '</div><div class="panel-body"><div class="table-shell"><table class="data-table coupon-current-table"><thead><tr><th>序号</th><th>卡券</th><th>适用范围</th><th>核销说明</th><th>统计</th><th>系统时间</th><th>卡券状态</th><th>操作</th></tr></thead><tbody>' + rows + '</tbody></table></div></div></section>';
    return frame('coupon-list', filters + list);
  }

  function couponPage(key) {
    if (key === 'coupon-list') return currentCouponList();
    var cfg = couponConfigs[key];
    var rows = cfg.empty ? [] : (data().couponRows[key] || []);
    var actions = (cfg.create ? '<button class="button primary" data-action="new-coupon" data-modal-title="' + esc(cfg.create) + '" type="button">' + esc(cfg.create) + '</button>' : '') +
      '<button class="button" data-action="export" type="button">导出</button>';
    var body = searchPanel(cfg.filters) + listPanel(spec(key).title,cfg.columns,rows,{total:cfg.total},'coupon-table');
    if (key === 'coupon-rules') body += '<div class="info-callout">SIT 当前“卡券规则设置”实际只展示结算规则；历史 Axure 中的叠加、分类、到期提醒、图片配置和售前结算未在这 13 页中看到。</div>';
    if (key === 'coupon-legacy-issue') body += '<div class="info-callout">现状存在“优惠券发放”和“卡券发放”两套链路。当前只做基线保留，未来主从关系仍需确认。</div>';
    return frame(key,body,actions);
  }

  function bindCouponPage(root) {
    bindCommon(root);
    var create = root.querySelector('[data-action="new-coupon"]');
    if (create) create.addEventListener('click', function () {
      var key = window.getCurrentPage();
      if (key === 'coupon-list') openCouponCreate();
      else if (key === 'coupon-redemption') openRedemptionConfig();
      else openGenericCreate(this.getAttribute('data-modal-title'));
    });
  }

  function openCouponCreate() {
    window.openPrototypeModal({title:'新建卡券',wide:true,confirmText:'保存草稿',body:'<div class="info-callout" data-anno="enum-cascade">下拉值以 SIT 可见值为准、Axure 分支为辅；业务场景会联动卡券分类和适用范围。组织级联仅放入已验证的演示子集，不代表全量字典。</div><div class="editor-grid" style="padding:16px 0 0">' +
      field('品牌','请选择','select',true)+field('创券来源','请选择','select',true)+field('业务场景','请选择','select',true)+
      field('卡券分类','请选择','select',true)+field('卡券名称','请输入','input',true)+field('卡券图片','上传图片','input',true)+
      field('面值','请输入','input',true)+field('发放数量','请输入','input',true)+field('核销方式','线上 / 线下','select',true)+
      '<div class="field span-3"><label>场景联动说明</label><div class="fake-input enum-scenario-note" data-scenario-note>请先选择业务场景，系统将联动卡券分类和适用范围。</div></div>' +
      field('适用车系/车型','选择车型','input',false,{visibleFor:'售前营销,售后营销,售后营销-上门取送车'})+
      field('适用专营店','选择门店','input',false,{visibleFor:'售前营销,售后营销,售后营销-上门取送车'})+
      field('适用商城商品','选择商品','input',false,{visibleFor:'商城营销'})+
      field('领券时间','开始 → 结束')+field('核销时间','开始 → 结束')+field('结算规则','请选择','select')+
      '<div class="field span-3"><label>使用须知</label><textarea placeholder="请输入使用限制、适用范围和核销说明"></textarea></div></div>'});
    bindEnumInteractions(document.getElementById('prototypeModal'));
  }

  function openRedemptionConfig() {
    window.openPrototypeModal({title:'领券窗口设置',wide:true,confirmText:'保存配置',body:'<div class="editor-grid" style="padding:0">' +
      field('品牌','东风日产','select',true)+field('领券窗口','请选择','select',true)+field('窗口状态','启用','select',true)+
      field('卡券栏目','请选择','select',true)+field('卡券排序','拖拽排序','input')+'<div class="field"><label>添加优惠券</label><button class="button" disabled>添加优惠券（SIT本次为禁用）</button><div class="field-help">禁用原因待确认：容量、窗口状态或权限。</div></div></div>'});
    bindEnumInteractions(document.getElementById('prototypeModal'));
  }

  Object.keys(couponConfigs).forEach(function (key) {
    window.Pages[key] = {render:function () { return couponPage(key); }, init:bindCouponPage};
  });
})();
