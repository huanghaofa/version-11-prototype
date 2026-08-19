(function () {
  'use strict';

  var selectorState = null;
  var importState = null;

  function couponTag(coupon, kind) {
    return '<span class="coupon-tag coupon-tag-' + kind + '">' +
      '<span>' + window.escapeHTML(coupon.name) + '</span>' +
      '<button type="button" aria-label="移除' + window.escapeHTML(coupon.name) + '" data-remove-coupon="' +
      window.escapeHTML(coupon.id) + '" data-kind="' + kind + '">×</button>' +
      '</span>';
  }

  function selectedCouponsHTML(kind) {
    var rule = window.PrototypeState.rule;
    var ids = kind === 'stack' ? rule.stackCouponIds : rule.mutexCouponIds;
    var coupons = window.getCouponsByIds(ids);
    if (!coupons.length) {
      return '<div class="empty-selection">尚未选择卡券</div>';
    }
    return '<div class="coupon-tags">' + coupons.map(function (coupon) {
      return couponTag(coupon, kind);
    }).join('') + '</div>';
  }

  var ruleModes = [
    { value: 'allStack', number: '1', label: '与全部券叠加', help: '沿用历史规则：可与全部券组合使用' },
    { value: 'allMutex', number: '2', label: '与全部券互斥', help: '沿用历史规则：与全部券均不可组合' },
    { value: 'partialStack', number: '3', label: '部分叠加', help: '对应原“与指定券叠加”' },
    { value: 'partialMutex', number: '4', label: '部分互斥', help: '对应原“与指定券互斥”' },
    { value: 'partialBoth', number: '5', label: '部分叠加互斥', help: '新增：同时维护两组部分券名单', isNew: true }
  ];

  function getModeLabel(mode) {
    var item = ruleModes.find(function (option) { return option.value === mode; });
    return item ? item.label : '不配置';
  }

  function relationshipConfigRows() {
    var rule = window.PrototypeState.rule;
    var relations = [];
    if (rule.stackScope === 'all') {
      relations.push({ kind: 'stack', id: 'ALL', name: '全部券', source: '-', removable: false });
    } else if (rule.stackScope === 'specified') {
      window.getCouponsByIds(rule.stackCouponIds).forEach(function (coupon) {
        relations.push({ kind: 'stack', id: coupon.id, name: coupon.name, source: coupon.sourceActivity, removable: true });
      });
    }
    if (rule.mutexScope === 'all') {
      relations.push({ kind: 'mutex', id: 'ALL', name: '全部券', source: '-', removable: false });
    } else if (rule.mutexScope === 'specified') {
      window.getCouponsByIds(rule.mutexCouponIds).forEach(function (coupon) {
        relations.push({ kind: 'mutex', id: coupon.id, name: coupon.name, source: coupon.sourceActivity, removable: true });
      });
    }
    if (!relations.length) return '<tr><td colspan="8"><div class="table-empty">当前方式暂无卡券关系</div></td></tr>';
    var primaryCoupons = window.MockData.primaryCoupons;
    var rows = [];
    var serial = 0;
    relations.forEach(function (relation) {
      primaryCoupons.forEach(function (primaryCoupon, primaryIndex) {
        serial += 1;
        var relationCells = '';
        if (primaryIndex === 0) {
          relationCells = '<td rowspan="' + primaryCoupons.length + '"><span class="relation-type relation-type-' + relation.kind + '">' +
            (relation.kind === 'stack' ? '叠加' : '互斥') + '</span></td><td rowspan="' + primaryCoupons.length + '"><strong>' + relation.id + '</strong></td>' +
            '<td rowspan="' + primaryCoupons.length + '">' + window.escapeHTML(relation.name) + '</td><td rowspan="' + primaryCoupons.length + '">' + window.escapeHTML(relation.source) + '</td><td rowspan="' + primaryCoupons.length + '">' +
            (relation.removable ? '<button type="button" class="text-button danger-link" data-remove-coupon="' + relation.id + '" data-kind="' + relation.kind + '">移除</button>' : '-') + '</td>';
        }
        rows.push('<tr><td>' + serial + '</td><td><strong>' + primaryCoupon.id + '</strong></td><td>' + window.escapeHTML(primaryCoupon.name) + '</td>' + relationCells + '</tr>');
      });
    });
    return rows.join('');
  }

  function relationshipActions(mode) {
    if (mode === 'partialStack') {
      return '<button class="btn" type="button" data-open-import="stack">批量导入</button><button class="btn btn-primary" type="button" data-open-selector="stack">选择叠加券</button>';
    }
    if (mode === 'partialMutex') {
      return '<button class="btn" type="button" data-open-import="mutex">批量导入</button><button class="btn btn-primary" type="button" data-open-selector="mutex">选择互斥券</button>';
    }
    if (mode === 'partialBoth') {
      return '<button class="btn" type="button" data-open-import="stack">导入叠加券</button><button class="btn" type="button" data-open-import="mutex">导入互斥券</button>' +
        '<button class="btn" type="button" data-open-selector="stack">选择叠加券</button><button class="btn btn-primary" type="button" data-open-selector="mutex">选择互斥券</button>';
    }
    return '';
  }

  function ruleModeSection() {
    var rule = window.PrototypeState.rule;
    var mode = rule.mode || 'none';
    var actions = relationshipActions(mode);
    var relationCount = (rule.stackScope === 'specified' ? rule.stackCouponIds.length : (rule.stackScope === 'all' ? 1 : 0)) +
      (rule.mutexScope === 'specified' ? rule.mutexCouponIds.length : (rule.mutexScope === 'all' ? 1 : 0));
    return '<div class="rule-mode-section"><div class="compact-mode-field"><strong>卡券叠加/互斥关系：</strong><div class="compact-mode-options">' + ruleModes.map(function (option) {
      return '<label class="compact-mode-option' + (mode === option.value ? ' selected' : '') + '">' +
        '<input type="radio" name="rule-mode" value="' + option.value + '"' + (mode === option.value ? ' checked' : '') + '>' +
        '<span class="scope-radio"></span><span>' + option.label + (option.isNew ? '<em>新增</em>' : '') + '</span></label>';
    }).join('') + '<label class="compact-mode-option' + (mode === 'none' ? ' selected' : '') + '"><input type="radio" name="rule-mode" value="none"' + (mode === 'none' ? ' checked' : '') + '><span class="scope-radio"></span><span>无</span></label></div></div>' +
      '<p class="compact-mode-help">方式 1–4 沿用历史规则；“部分叠加互斥”可在同一张关系表中同时维护两种关系。</p>' +
      '<div class="relation-config-list"><div class="relation-list-head"><div><strong>卡券关系列表</strong><span>共 ' + (relationCount * window.MockData.primaryCoupons.length) + ' 条主券关系</span></div><div class="relation-list-actions">' + actions + '</div></div>' +
      '<div class="field-error" data-rule-error="stack"></div><div class="field-error" data-rule-error="mutex"></div>' +
      '<div class="table-wrapper"><table><thead><tr><th>序号</th><th>主卡券ID</th><th>主卡券名称</th><th>关系类型</th><th>目标卡券ID</th><th>目标卡券名称</th><th>来源活动</th><th>操作</th></tr></thead><tbody>' +
      relationshipConfigRows() + '</tbody></table></div></div></div>';
  }

  function primaryCouponRows() {
    return window.MockData.primaryCoupons.map(function (coupon) {
      return '<tr>' +
        '<td><strong>' + window.escapeHTML(coupon.name) + '</strong><div class="cell-sub">' + coupon.id + '</div></td>' +
        '<td>' + coupon.type + '</td>' +
        '<td>' + coupon.scene + '</td>' +
        '<td>' + coupon.faceValue + '</td>' +
        '<td><span class="status-tag status-success">已关联</span></td>' +
        '</tr>';
    }).join('');
  }

  function summaryHTML() {
    var rule = window.PrototypeState.rule;
    var stackText = window.getRuleLabel(rule.stackScope, 'stack');
    var mutexText = window.getRuleLabel(rule.mutexScope, 'mutex');
    var detail = '';

    if (rule.stackScope === 'specified') {
      detail += '<span class="summary-chip summary-chip-blue">叠加 ' + rule.stackCouponIds.length + ' 张</span>';
    } else if (rule.stackScope === 'all') {
      detail += '<span class="summary-chip summary-chip-blue">全部券默认可叠加</span>';
    }
    if (rule.mutexScope === 'specified') {
      detail += '<span class="summary-chip summary-chip-orange">互斥 ' + rule.mutexCouponIds.length + ' 张</span>';
    } else if (rule.mutexScope === 'all') {
      detail += '<span class="summary-chip summary-chip-orange">全部券均互斥</span>';
    }
    if (!detail) detail = '<span class="summary-chip">尚未配置组合关系</span>';

    return '<div class="effect-summary">' +
      '<div class="effect-summary-title"><span class="pulse-dot"></span><strong>实时生效摘要 · ' + getModeLabel(rule.mode) + '</strong></div>' +
      '<div class="summary-flow">' +
      '<div><small>叠加规则</small><strong>' + stackText + '</strong></div>' +
      '<span class="summary-arrow">＋</span>' +
      '<div><small>互斥规则</small><strong>' + mutexText + '</strong></div>' +
      '<span class="summary-arrow">→</span>' +
      '<div class="summary-result"><small>最终判断</small><strong>互斥优先</strong></div>' +
      '</div>' +
      '<div class="summary-chips">' + detail + '</div>' +
      '<p>' + (rule.mode === 'partialBoth' ? '仅新增方式支持两组名单；同一目标券不可同时进入叠加与互斥名单。' : '当前方式沿用历史单一规则数据结构和生效含义。') + '</p>' +
      '</div>';
  }

  function render() {
    var activity = window.MockData.activity;
    return '<div class="page-head">' +
      '<div><div class="eyebrow">保客活动 · 编辑</div><h1>' + window.escapeHTML(activity.name) + '</h1>' +
      '<p>调整活动内卡券的组合使用关系。此次改造仅影响活动中心售后规则。</p></div>' +
      '<div class="page-head-actions"><span class="draft-tag">草稿</span><button class="btn" type="button" data-action="cancel">返回列表</button></div>' +
      '</div>' +
      '<div class="steps">' +
      '<div class="step done"><span>1</span><strong>基础信息</strong></div><i></i>' +
      '<div class="step active"><span>2</span><strong>奖品与卡券规则</strong></div><i></i>' +
      '<div class="step"><span>3</span><strong>参与对象</strong></div><i></i>' +
      '<div class="step"><span>4</span><strong>页面配置</strong></div>' +
      '</div>' +
      '<section class="card activity-overview">' +
      '<div class="section-title"><div><h2>活动信息</h2><p>当前活动上下文，仅用于确认规则归属</p></div><span class="id-chip">' + activity.id + '</span></div>' +
      '<div class="overview-grid">' +
      '<div><small>触发方式</small><strong>' + activity.triggerType + '</strong></div>' +
      '<div><small>领取方式</small><strong>' + activity.claimMode + '</strong></div>' +
      '<div><small>活动有效期</small><strong>' + activity.validPeriod + '</strong></div>' +
      '<div><small>已配置互斥活动</small><strong>' + activity.mutexActivityCount + ' 个 <em>（独立维度）</em></strong></div>' +
      '</div>' +
      '</section>' +
      '<section class="card primary-coupons">' +
      '<div class="section-title"><div><h2>活动已关联卡券</h2><p>以下主券共享本活动配置的组合使用规则</p></div><button class="btn" type="button" data-action="view-primary">查看卡券详情</button></div>' +
      '<div class="table-wrapper"><table><thead><tr><th>卡券名称 / ID</th><th>卡券属性</th><th>业务场景</th><th>面额规则</th><th>状态</th></tr></thead>' +
      '<tbody>' + primaryCouponRows() + '</tbody></table></div>' +
      '</section>' +
      '<section class="card rule-card">' +
      '<div class="section-title section-title-rules"><div><div class="title-with-badge"><h2>卡券组合使用规则</h2><span class="new-badge">本次改造</span></div>' +
      '<p>沿用活动中心现有配置方式，新增“部分叠加互斥”；两类关系统一在下方列表维护。</p></div></div>' +
      ruleModeSection() +
      '</section>' +
      '<div class="sticky-actions">' +
      '<div><span class="save-hint">所有变更仅保存至当前活动</span><span class="save-error" data-save-error></span></div>' +
      '<div><button class="btn" type="button" data-action="save">保存草稿</button>' +
      '<button class="btn btn-primary" type="button" data-action="save-preview">保存并查看关系</button></div>' +
      '</div>';
  }

  function handleModeChange(mode) {
    var rule = window.PrototypeState.rule;
    rule.mode = mode;
    rule.stackScope = mode === 'allStack' ? 'all' : ((mode === 'partialStack' || mode === 'partialBoth') ? 'specified' : 'none');
    rule.mutexScope = mode === 'allMutex' ? 'all' : ((mode === 'partialMutex' || mode === 'partialBoth') ? 'specified' : 'none');
    window.navigateTo('activity-edit');
  }

  function setRuleError(kind, message) {
    var node = document.querySelector('[data-rule-error="' + kind + '"]');
    if (node) node.textContent = message || '';
  }

  function validateRule() {
    var rule = window.PrototypeState.rule;
    setRuleError('stack', '');
    setRuleError('mutex', '');
    if (rule.stackScope === 'specified' && !rule.stackCouponIds.length) {
      setRuleError('stack', '请选择至少 1 张叠加券');
      return '叠加规则选择了“指定券”，但还没有选择卡券';
    }
    if (rule.mutexScope === 'specified' && !rule.mutexCouponIds.length) {
      setRuleError('mutex', '请选择至少 1 张互斥券');
      return '互斥规则选择了“指定券”，但还没有选择卡券';
    }
    if (rule.mode === 'partialBoth') {
      var duplicate = rule.stackCouponIds.find(function (id) {
        return rule.mutexCouponIds.indexOf(id) >= 0;
      });
      if (duplicate) return '同一张目标券不能同时配置为叠加和互斥';
    }
    return '';
  }

  function save(andPreview) {
    var error = validateRule();
    var errorNode = document.querySelector('[data-save-error]');
    if (error) {
      if (errorNode) errorNode.textContent = error;
      window.showToast(error, 'error');
      return;
    }
    if (errorNode) errorNode.textContent = '';
    window.PrototypeState.savedAt = new Date().toLocaleTimeString('zh-CN', { hour12: false });
    window.showToast('卡券组合使用规则已保存', 'success');
    if (andPreview) {
      window.setTimeout(function () { window.navigateTo('relation-preview'); }, 350);
    }
  }

  function removeCoupon(kind, couponId) {
    var rule = window.PrototypeState.rule;
    var key = kind === 'stack' ? 'stackCouponIds' : 'mutexCouponIds';
    rule[key] = rule[key].filter(function (id) { return id !== couponId; });
    window.navigateTo('activity-edit');
  }

  function renderMatrixModal() {
    var html = '<div class="modal-overlay" data-prototype-modal><div class="modal-content matrix-modal">' +
      '<div class="modal-header"><div><h2>规则方式说明</h2><p>新增方式不改变历史规则的解释</p></div><button class="modal-close" type="button" data-close-modal>×</button></div>' +
      '<div class="modal-body"><div class="matrix-grid">' +
      '<div class="matrix-item allowed"><span>历史</span><strong>方式 1–4</strong><p>继续按原有单一叠加或单一互斥规则保存和回显。</p></div>' +
      '<div class="matrix-item allowed"><span>新增</span><strong>部分叠加互斥</strong><p>分别维护两组部分券名单，两组卡券不能重复。</p></div>' +
      '<div class="matrix-item allowed"><span>兼容</span><strong>历史数据无需迁移</strong><p>旧枚举值保持原意，不自动转换为双规则配置。</p></div>' +
      '<div class="matrix-item blocked"><span>阻止</span><strong>同券同时叠加和互斥</strong><p>选择或导入阶段即阻止，并给出冲突原因。</p></div>' +
      '</div><div class="priority-callout"><strong>最终判断顺序</strong><span>活动互斥</span><i>›</i><span>卡券互斥</span><i>›</i><span>卡券叠加</span><i>›</i><span>默认不可组合</span></div></div>' +
      '<div class="modal-footer"><button class="btn btn-primary" type="button" data-close-modal>我知道了</button></div></div></div>';
    document.body.insertAdjacentHTML('beforeend', html);
  }

  function validateImportIds(ids, kind) {
    var rule = window.PrototypeState.rule;
    var targetIds = kind === 'stack' ? rule.stackCouponIds : rule.mutexCouponIds;
    var oppositeIds = rule.mode === 'partialBoth' ? (kind === 'stack' ? rule.mutexCouponIds : rule.stackCouponIds) : [];
    var oppositeLabel = kind === 'stack' ? '互斥' : '叠加';
    var seen = {};
    return ids.map(function (rawId, index) {
      var couponId = String(rawId || '').trim();
      var coupon = window.getCouponById(couponId);
      var result = {
        row: index + 2,
        couponId: couponId || '-',
        couponName: coupon ? coupon.name : '-',
        status: 'success',
        label: '可导入',
        reason: '校验通过'
      };
      if (!couponId) {
        result.status = 'fail';
        result.label = '不可导入';
        result.reason = '卡券 ID 为空';
      } else if (seen[couponId]) {
        result.status = 'fail';
        result.label = '不可导入';
        result.reason = '文件内卡券 ID 重复';
      } else if (!coupon) {
        result.status = 'fail';
        result.label = '不可导入';
        result.reason = '卡券 ID 不存在';
      } else if (coupon.status !== '已发布') {
        result.status = 'fail';
        result.label = '不可导入';
        result.reason = '卡券状态为“' + coupon.status + '”';
      } else if (oppositeIds.indexOf(couponId) >= 0) {
        result.status = 'fail';
        result.label = '不可导入';
        result.reason = '已在' + oppositeLabel + '关系中';
      } else if (targetIds.indexOf(couponId) >= 0) {
        result.status = 'skip';
        result.label = '已存在';
        result.reason = '当前名单已包含，无需重复导入';
      }
      if (couponId) seen[couponId] = true;
      return result;
    });
  }

  function importSummary() {
    var rows = importState ? importState.rows : [];
    return {
      success: rows.filter(function (row) { return row.status === 'success'; }).length,
      skip: rows.filter(function (row) { return row.status === 'skip'; }).length,
      fail: rows.filter(function (row) { return row.status === 'fail'; }).length
    };
  }

  function renderImportRows() {
    if (!importState) return '';
    var rows = importState.rows.filter(function (row) {
      return importState.filter === 'all' || row.status === importState.filter;
    });
    if (!rows.length) {
      return '<tr><td colspan="5"><div class="table-empty">当前分类没有数据</div></td></tr>';
    }
    return rows.map(function (row) {
      return '<tr><td>' + row.row + '</td><td><strong>' + window.escapeHTML(row.couponId) + '</strong></td>' +
        '<td>' + window.escapeHTML(row.couponName) + '</td>' +
        '<td><span class="import-status import-status-' + row.status + '">' + row.label + '</span></td>' +
        '<td>' + window.escapeHTML(row.reason) + '</td></tr>';
    }).join('');
  }

  function renderImportModal() {
    if (!importState) return;
    window.closeModal();
    var isStack = importState.kind === 'stack';
    var kindLabel = isStack ? '叠加券' : '互斥券';
    var config = window.MockData.batchImport;
    var hasResult = importState.rows.length > 0;
    var summary = importSummary();
    var body = '';
    if (!hasResult) {
      body = '<div class="import-stepbar"><div class="active"><span>1</span><strong>上传文件</strong></div><i></i><div><span>2</span><strong>预校验并确认</strong></div></div>' +
        '<div class="template-card"><div><strong>第一步：下载导入模板</strong><p>卡券 ID 必填，卡券名称可选；不要修改表头。</p></div>' +
        '<a class="btn" href="assets/templates/卡券叠加互斥关系批量导入模板.csv" download>下载模板</a></div>' +
        '<div class="import-upload"><input type="file" accept=".xlsx,.xls,.csv" data-import-file id="import-file-input">' +
        '<label for="import-file-input"><span class="upload-icon">↑</span><strong>第二步：上传已填写的文件</strong>' +
        '<p>点击选择或拖拽文件到此处</p><small>支持 ' + config.acceptedExtensions + '，最多 ' + config.maxRows + ' 行，不超过 ' + config.maxFileSizeMB + 'MB</small></label>' +
        '<button class="text-button sample-import-button" type="button" data-use-sample-import>加载示例文件演示</button></div>' +
        '<div class="import-rule-list"><strong>导入校验规则</strong><ul><li>卡券必须存在且状态为“已发布”</li>' +
        '<li>已配置为' + (isStack ? '互斥' : '叠加') + '的券不可导入当前关系</li><li>当前名单已有券自动跳过，文件内重复行不导入</li></ul></div>';
    } else {
      body = '<div class="import-stepbar"><div class="done"><span>✓</span><strong>文件已上传</strong></div><i></i><div class="active"><span>2</span><strong>预校验并确认</strong></div></div>' +
        '<div class="import-file-meta"><div><span class="file-icon">X</span><div><strong>' + window.escapeHTML(importState.fileName) + '</strong><p>共 ' + importState.rows.length + ' 行，已完成预校验</p></div></div>' +
        '<button class="text-button" type="button" data-import-reset>重新上传</button></div>' +
        '<div class="import-summary"><div class="success"><small>可导入</small><strong>' + summary.success + '</strong></div>' +
        '<div class="skip"><small>已存在</small><strong>' + summary.skip + '</strong></div><div class="fail"><small>不可导入</small><strong>' + summary.fail + '</strong></div></div>' +
        '<div class="import-result-tabs"><button type="button" data-import-filter="all" class="' + (importState.filter === 'all' ? 'active' : '') + '">全部 ' + importState.rows.length + '</button>' +
        '<button type="button" data-import-filter="success" class="' + (importState.filter === 'success' ? 'active' : '') + '">可导入 ' + summary.success + '</button>' +
        '<button type="button" data-import-filter="skip" class="' + (importState.filter === 'skip' ? 'active' : '') + '">已存在 ' + summary.skip + '</button>' +
        '<button type="button" data-import-filter="fail" class="' + (importState.filter === 'fail' ? 'active' : '') + '">不可导入 ' + summary.fail + '</button></div>' +
        '<div class="import-result-table table-wrapper"><table><thead><tr><th>行号</th><th>卡券 ID</th><th>卡券名称</th><th>校验结果</th><th>说明</th></tr></thead><tbody data-import-rows>' + renderImportRows() + '</tbody></table></div>' +
        '<div class="import-partial-note"><span>i</span><p>确认后仅导入通过的 ' + summary.success + ' 行；已存在和不可导入行不会写入。</p></div>';
    }
    var html = '<div class="modal-overlay" data-prototype-modal><div class="modal-content import-modal">' +
      '<div class="modal-header"><div><h2>批量导入' + kindLabel + '</h2><p>导入对象：当前活动的部分' + kindLabel + '名单</p></div><button class="modal-close" type="button" data-close-modal>×</button></div>' +
      '<div class="modal-body">' + body + '</div><div class="modal-footer"><button class="btn" type="button" data-close-modal>取消</button>' +
      (hasResult ? '<button class="btn btn-primary" type="button" data-import-confirm' + (summary.success ? '' : ' disabled') + '>确认导入 ' + summary.success + ' 张卡券</button>' : '') +
      '</div></div></div>';
    document.body.insertAdjacentHTML('beforeend', html);
  }

  function openImport(kind) {
    selectorState = null;
    importState = { kind: kind, fileName: '', rows: [], filter: 'all' };
    renderImportModal();
  }

  function loadImportIds(ids, fileName) {
    if (!importState) return;
    if (ids.length > window.MockData.batchImport.maxRows) {
      window.showToast('文件超过 ' + window.MockData.batchImport.maxRows + ' 行，请拆分后重新上传', 'error');
      return;
    }
    importState.fileName = fileName;
    importState.rows = validateImportIds(ids, importState.kind);
    importState.filter = 'all';
    renderImportModal();
  }

  function readImportFile(file) {
    if (!importState || !file) return;
    var config = window.MockData.batchImport;
    var extension = file.name.split('.').pop().toLowerCase();
    if (['xlsx', 'xls', 'csv'].indexOf(extension) < 0) {
      window.showToast('文件格式不正确，请上传 Excel 或 CSV 文件', 'error');
      return;
    }
    if (file.size > config.maxFileSizeMB * 1024 * 1024) {
      window.showToast('文件超过 ' + config.maxFileSizeMB + 'MB，请拆分后上传', 'error');
      return;
    }
    if (extension !== 'csv') {
      loadImportIds(config.sampleIds[importState.kind], file.name);
      return;
    }
    var reader = new FileReader();
    reader.onload = function () {
      var lines = String(reader.result || '').split(/\r?\n/).filter(function (line) { return line.trim(); });
      var ids = lines.slice(1).map(function (line) { return line.split(',')[0].replace(/^\uFEFF/, '').trim(); });
      loadImportIds(ids, file.name);
    };
    reader.readAsText(file);
  }

  function confirmImport() {
    if (!importState) return;
    var successIds = importState.rows.filter(function (row) { return row.status === 'success'; }).map(function (row) { return row.couponId; });
    var kind = importState.kind;
    var key = kind === 'stack' ? 'stackCouponIds' : 'mutexCouponIds';
    successIds.forEach(function (couponId) {
      if (window.PrototypeState.rule[key].indexOf(couponId) < 0) window.PrototypeState.rule[key].push(couponId);
    });
    window.closeModal();
    importState = null;
    window.navigateTo('activity-edit');
    window.showToast('已导入 ' + successIds.length + ' 张' + (kind === 'stack' ? '叠加券' : '互斥券') + '，失败行未写入', 'success');
  }

  function renderSelectorTable() {
    if (!selectorState) return;
    var body = document.querySelector('[data-selector-body]');
    var count = document.querySelector('[data-temp-count]');
    if (!body) return;
    var kind = selectorState.kind;
    var oppositeIds = window.PrototypeState.rule.mode === 'partialBoth' ?
      (kind === 'stack' ? window.PrototypeState.rule.mutexCouponIds : window.PrototypeState.rule.stackCouponIds) : [];
    var keyword = selectorState.keyword.toLowerCase();
    var items = window.MockData.candidateCoupons.filter(function (coupon) {
      var keywordMatch = !keyword || coupon.name.toLowerCase().indexOf(keyword) >= 0 || coupon.id.toLowerCase().indexOf(keyword) >= 0;
      var typeMatch = selectorState.type === 'all' || coupon.type === selectorState.type;
      var selectedMatch = selectorState.tab !== 'selected' || selectorState.tempIds.indexOf(coupon.id) >= 0;
      return keywordMatch && typeMatch && selectedMatch;
    });
    if (!items.length) {
      body.innerHTML = '<tr><td colspan="6"><div class="table-empty">没有符合条件的卡券</div></td></tr>';
    } else {
      body.innerHTML = items.map(function (coupon) {
        var inOpposite = oppositeIds.indexOf(coupon.id) >= 0;
        var unavailable = coupon.status !== '已发布';
        var disabled = inOpposite || unavailable;
        var selected = selectorState.tempIds.indexOf(coupon.id) >= 0;
        var reason = inOpposite ? '已在' + (kind === 'stack' ? '互斥' : '叠加') + '列表中' : (unavailable ? '当前状态不可选' : '');
        return '<tr class="' + (disabled ? 'row-disabled' : '') + '">' +
          '<td><label class="table-check"><input type="checkbox" data-selector-check value="' + coupon.id + '"' +
          (selected ? ' checked' : '') + (disabled ? ' disabled' : '') + '><span></span></label></td>' +
          '<td><strong>' + window.escapeHTML(coupon.name) + '</strong><div class="cell-sub">' + coupon.id + '</div>' +
          (reason ? '<div class="disabled-reason">' + reason + '</div>' : '') + '</td>' +
          '<td><span class="type-pill">' + coupon.type + '</span></td>' +
          '<td>' + coupon.scene + '</td>' +
          '<td>' + window.escapeHTML(coupon.sourceActivity) + '</td>' +
          '<td><span class="status-tag ' + (coupon.status === '已发布' ? 'status-success' : 'status-muted') + '">' + coupon.status + '</span></td>' +
          '</tr>';
      }).join('');
    }
    if (count) count.textContent = selectorState.tempIds.length;
  }

  function openSelector(kind) {
    var rule = window.PrototypeState.rule;
    selectorState = {
      kind: kind,
      tempIds: (kind === 'stack' ? rule.stackCouponIds : rule.mutexCouponIds).slice(),
      keyword: '',
      type: 'all',
      tab: 'available'
    };
    var title = kind === 'stack' ? '选择叠加卡券' : '选择互斥卡券';
    var html = '<div class="modal-overlay" data-prototype-modal><div class="modal-content selector-modal">' +
      '<div class="modal-header"><div><h2>' + title + '</h2><p>已在另一规则中的卡券不可重复选择</p></div><button class="modal-close" type="button" data-close-modal>×</button></div>' +
      '<div class="selector-tabs"><button class="active" type="button" data-selector-tab="available">可选卡券</button>' +
      '<button type="button" data-selector-tab="selected">已选（<span data-temp-count>' + selectorState.tempIds.length + '</span>）</button></div>' +
      '<div class="selector-toolbar"><label class="search-box"><span>⌕</span><input type="search" placeholder="搜索卡券名称或 ID" data-selector-search></label>' +
      '<select class="form-select compact-select" data-selector-type><option value="all">全部卡券属性</option><option value="促销券">促销券</option><option value="权益券">权益券</option></select>' +
      '<button type="button" class="btn" data-open-import="' + kind + '">批量导入</button></div>' +
      '<div class="selector-table table-wrapper"><table><thead><tr><th></th><th>卡券名称 / ID</th><th>卡券属性</th><th>业务场景</th><th>来源活动</th><th>状态</th></tr></thead>' +
      '<tbody data-selector-body></tbody></table></div>' +
      '<div class="selector-footnote"><span>规则提示</span> 权益券是否参与商城计算沿用现有已确认口径；此处仍展示其选择状态供评审。</div>' +
      '<div class="modal-footer"><button class="btn" type="button" data-close-modal>取消</button><button class="btn btn-primary" type="button" data-selector-confirm>确认选择</button></div>' +
      '</div></div>';
    document.body.insertAdjacentHTML('beforeend', html);
    renderSelectorTable();
  }

  function bindDocumentClick(event) {
    var target = event.target;
    var close = target.closest('[data-close-modal]');
    if (close) {
      window.closeModal();
      selectorState = null;
      importState = null;
      return;
    }
    var openImportButton = target.closest('[data-open-import]');
    if (openImportButton) {
      openImport(openImportButton.getAttribute('data-open-import'));
      return;
    }
    if (target.closest('[data-use-sample-import]') && importState) {
      loadImportIds(window.MockData.batchImport.sampleIds[importState.kind], window.MockData.batchImport.sampleFileName);
      return;
    }
    if (target.closest('[data-import-reset]') && importState) {
      importState.fileName = '';
      importState.rows = [];
      importState.filter = 'all';
      renderImportModal();
      return;
    }
    var importFilter = target.closest('[data-import-filter]');
    if (importFilter && importState) {
      importState.filter = importFilter.getAttribute('data-import-filter');
      renderImportModal();
      return;
    }
    if (target.closest('[data-import-confirm]') && importState) {
      confirmImport();
      return;
    }
    var tab = target.closest('[data-selector-tab]');
    if (tab && selectorState) {
      selectorState.tab = tab.getAttribute('data-selector-tab');
      document.querySelectorAll('[data-selector-tab]').forEach(function (item) {
        item.classList.toggle('active', item === tab);
      });
      renderSelectorTable();
      return;
    }
    var confirm = target.closest('[data-selector-confirm]');
    if (confirm && selectorState) {
      var key = selectorState.kind === 'stack' ? 'stackCouponIds' : 'mutexCouponIds';
      window.PrototypeState.rule[key] = selectorState.tempIds.slice();
      window.closeModal();
      selectorState = null;
      window.navigateTo('activity-edit');
    }
  }

  function init() {
    document.querySelectorAll('input[name="rule-mode"]').forEach(function (input) {
      input.addEventListener('change', function () {
        handleModeChange(this.value);
      });
    });
    document.querySelectorAll('[data-open-selector]').forEach(function (button) {
      button.addEventListener('click', function () { openSelector(this.getAttribute('data-open-selector')); });
    });
    document.querySelectorAll('[data-remove-coupon]').forEach(function (button) {
      button.addEventListener('click', function () {
        removeCoupon(this.getAttribute('data-kind'), this.getAttribute('data-remove-coupon'));
      });
    });
    document.querySelector('[data-action="save"]').addEventListener('click', function () { save(false); });
    document.querySelector('[data-action="save-preview"]').addEventListener('click', function () { save(true); });
    document.querySelector('[data-action="cancel"]').addEventListener('click', function () {
      window.showToast('演示原型未接入真实活动列表', 'warning');
    });
    document.querySelector('[data-action="view-primary"]').addEventListener('click', function () {
      window.showToast('卡券详情沿用现有卡券选择与详情能力，本次不改', 'success');
    });
    if (!document.body.dataset.selectorBound) {
      document.body.dataset.selectorBound = 'true';
      document.addEventListener('click', bindDocumentClick);
      document.addEventListener('change', function (event) {
        if (event.target.matches('[data-import-file]') && importState) {
          readImportFile(event.target.files && event.target.files[0]);
          return;
        }
        if (event.target.matches('[data-selector-check]') && selectorState) {
          var id = event.target.value;
          if (event.target.checked) {
            if (selectorState.tempIds.indexOf(id) < 0) selectorState.tempIds.push(id);
          } else {
            selectorState.tempIds = selectorState.tempIds.filter(function (item) { return item !== id; });
          }
          renderSelectorTable();
        }
        if (event.target.matches('[data-selector-type]') && selectorState) {
          selectorState.type = event.target.value;
          renderSelectorTable();
        }
      });
      document.addEventListener('input', function (event) {
        if (event.target.matches('[data-selector-search]') && selectorState) {
          selectorState.keyword = event.target.value.trim();
          renderSelectorTable();
        }
      });
    }
  }

  window.Pages['activity-edit'] = {
    render: render,
    init: init
  };
})();
