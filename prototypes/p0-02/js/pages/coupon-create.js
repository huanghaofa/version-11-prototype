(function () {
  'use strict';

  var scopeTypes = ['备件', '工时', '精品', '套餐'];
  var couponTypes = ['代金券', '满减券', '折扣券', '组合折扣券', '权益券'];
  var targetScenes = ['BIMC（新）', '维修保养（新）'];
  var chineseNumbers = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];

  function row(label, control, required, help, extraClass) {
    return '<div class="sit-form-row' + (extraClass ? ' ' + extraClass : '') + '">' +
      '<span class="sit-label' + (required ? ' required' : '') + '">' + window.escapeHTML(label) + '：</span>' +
      '<div class="sit-control">' + control + (help ? '<small>' + help + '</small>' : '') + '</div></div>';
  }

  function option(value, selected) {
    return '<option' + (value === selected ? ' selected' : '') + '>' + window.escapeHTML(value) + '</option>';
  }

  function isCombinationCoupon(template) {
    return template.couponType === '组合折扣券';
  }

  function canConfigureCombinations(template) {
    return isCombinationCoupon(template) && targetScenes.indexOf(template.scene) >= 0 && template.applicableType === '备件';
  }

  function combinationMode(template) {
    return template.combinationMode === 'free' ? 'free' : 'grouped';
  }

  function isFreeMode(template) {
    return combinationMode(template) === 'free';
  }

  function itemFromCatalog(code, quantityKey, quantity) {
    var catalog = window.PrototypeData.itemCatalog.find(function (item) { return item.code === code; });
    if (!catalog) return null;
    var result = { code: catalog.code, name: catalog.name, spec: catalog.spec, unitPrice: catalog.unitPrice };
    result[quantityKey] = quantity;
    return result;
  }

  function formatDiscount(rate) {
    var value = Number(rate);
    if (!Number.isFinite(value)) value = 0;
    value = Math.round(value * 10) / 10;
    return value === 0 ? '0折（免费）' : value.toString() + '折';
  }

  function combinationDiscountDescription(mode, rate) {
    if (Number(rate) === 0) {
      return mode === 'free'
        ? '当前为 0 折：实际选中且不超过最大核销数量的商品全部免费。'
        : '当前为 0 折：各商品最低核销数量范围内全部免费，超出部分仍按原价结算。';
    }
    return mode === 'free'
      ? '自由组合内实际选中的商品共用此折扣，每项最多优惠至配置的最大核销数量。'
      : '所有分组共用此折扣；每个商品只优惠最低核销数量，超出的同商品数量按原价结算。';
  }

  function combinationName(sequence) {
    return '组合' + (chineseNumbers[sequence] || sequence);
  }

  function canonicalItemSet(items) {
    return items.map(function (item) { return item.code; }).sort().join('|');
  }

  function duplicateCombination(template, combinationId, items) {
    var candidate = canonicalItemSet(items);
    if (!candidate) return null;
    return template.combinations.find(function (combination) {
      return combination.combinationId !== combinationId && canonicalItemSet(combination.items) === candidate;
    });
  }

  function findCombination(template, combinationId) {
    return template.combinations.find(function (combination) { return combination.combinationId === combinationId; });
  }

  function renderScopeOptions(template) {
    return scopeTypes.map(function (type) {
      var selected = template.applicableType === type;
      var locked = template.applicableType && !selected;
      return '<div class="scope-option' + (selected ? ' is-selected' : '') + (locked ? ' is-locked' : '') + '">' +
        '<input class="scope-checkbox" type="checkbox" data-scope="' + type + '"' + (selected ? ' checked' : '') + (locked ? ' disabled' : '') + '>' +
        '<button class="scope-button" type="button" data-choose-scope="' + type + '"' + (locked ? ' disabled' : '') + '>选择' + type + '</button>' +
      '</div>';
    }).join('');
  }

  function combinationItemRows(template, combination) {
    if (!combination.items.length) {
      return '<tr><td colspan="7" class="empty-cell">当前组合暂无商品，请点击“选择商品”添加</td></tr>';
    }
    return combination.items.map(function (item) {
      return '<tr>' +
        '<td><div class="item-name"><strong>' + window.escapeHTML(item.name) + '</strong><span>' + window.escapeHTML(item.spec) + '</span></div></td>' +
        '<td><code>' + window.escapeHTML(item.code) + '</code></td>' +
        '<td>' + window.money(item.unitPrice) + '</td>' +
        '<td><div class="quantity-stepper"><button type="button" data-min-minus data-combination-id="' + window.escapeHTML(combination.combinationId) + '" data-item-code="' + window.escapeHTML(item.code) + '">−</button><span>' + item.minQty + '</span><button type="button" data-min-plus data-combination-id="' + window.escapeHTML(combination.combinationId) + '" data-item-code="' + window.escapeHTML(item.code) + '">＋</button></div></td>' +
        '<td><strong class="discount-scope">前 ' + item.minQty + ' 件享 ' + formatDiscount(template.discountRate) + '</strong><span class="cell-help">超出部分原价</span></td>' +
        '<td>' + window.UI.status('必须同时核销', 'warning') + '</td>' +
        '<td><button class="link-button danger" type="button" data-remove-combination-item data-combination-id="' + window.escapeHTML(combination.combinationId) + '" data-item-code="' + window.escapeHTML(item.code) + '">删除</button></td>' +
      '</tr>';
    }).join('');
  }

  function renderCombinationCard(template, combination, index) {
    return '<section class="combination-card" data-combination-card="' + window.escapeHTML(combination.combinationId) + '">' +
      '<div class="combination-card-header">' +
        '<div><strong>' + window.escapeHTML(combination.name) + '</strong><code>' + window.escapeHTML(combination.combinationId) + '</code><span>组内商品必须全部满足</span></div>' +
        '<div class="combination-card-actions"><span class="shared-discount-tag">共用 ' + formatDiscount(template.discountRate) + '</span><button class="link-button" type="button" data-select-combination-items="' + window.escapeHTML(combination.combinationId) + '">选择商品</button><button class="link-button danger" type="button" data-remove-combination="' + window.escapeHTML(combination.combinationId) + '"' + (template.combinations.length <= 1 ? ' disabled' : '') + '>删除组合</button></div>' +
      '</div>' +
      '<div class="table-wrapper combination-item-table"><table class="data-table"><thead><tr><th>商品名称</th><th>商品编码</th><th>参考单价</th><th>最低核销数量</th><th>优惠范围</th><th>组合要求</th><th>操作</th></tr></thead><tbody>' + combinationItemRows(template, combination) + '</tbody></table></div>' +
    '</section>';
  }

  function renderModeSelector(template) {
    var mode = combinationMode(template);
    return '<div class="combination-mode-selector">' +
      '<label class="combination-mode-option' + (mode === 'free' ? ' is-active' : '') + '"><input type="radio" name="combination-mode" value="free"' + (mode === 'free' ? ' checked' : '') + '><span><strong>自由组合</strong><small>商品池内任选一个或多个，每项不超过最大核销数量</small></span></label>' +
      '<label class="combination-mode-option' + (mode === 'grouped' ? ' is-active' : '') + '"><input type="radio" name="combination-mode" value="grouped"' + (mode === 'grouped' ? ' checked' : '') + '><span><strong>分组组合</strong><small>多个组合任选一，组内商品必须全部核销；只建一组即固定组合</small></span></label>' +
    '</div>';
  }

  function freeItemRows(template) {
    if (!template.freeItems.length) {
      return '<tr><td colspan="7" class="empty-cell">暂无自由组合商品，请点击“选择商品”或使用 Excel 上传</td></tr>';
    }
    return template.freeItems.map(function (item) {
      return '<tr>' +
        '<td><div class="item-name"><strong>' + window.escapeHTML(item.name) + '</strong><span>' + window.escapeHTML(item.spec) + '</span></div></td>' +
        '<td><code>' + window.escapeHTML(item.code) + '</code></td>' +
        '<td>' + window.money(item.unitPrice) + '</td>' +
        '<td><div class="quantity-stepper"><button type="button" data-free-minus data-item-code="' + window.escapeHTML(item.code) + '">−</button><span>' + item.maxQty + '</span><button type="button" data-free-plus data-item-code="' + window.escapeHTML(item.code) + '">＋</button></div></td>' +
        '<td><strong class="discount-scope">实际选中数量享 ' + formatDiscount(template.discountRate) + '</strong><span class="cell-help">最多 ' + item.maxQty + ' 件</span></td>' +
        '<td>' + window.UI.status('任选一项或多项', 'success') + '</td>' +
        '<td><button class="link-button danger" type="button" data-remove-free-item="' + window.escapeHTML(item.code) + '">删除</button></td>' +
      '</tr>';
    }).join('');
  }

  function renderFreeConfig(template) {
    return '<div class="free-combination-panel">' +
      '<div class="free-combination-heading"><div><strong>自由组合商品池</strong><span>已配置 ' + template.freeItems.length + ' 个商品；核销时可任选一个或多个</span></div><button class="link-button" id="selectFreeItems" type="button">选择商品</button></div>' +
      '<div class="table-wrapper combination-item-table"><table class="data-table"><thead><tr><th>商品名称</th><th>商品编码</th><th>参考单价</th><th>最大核销数量</th><th>优惠范围</th><th>核销要求</th><th>操作</th></tr></thead><tbody>' + freeItemRows(template) + '</tbody></table></div>' +
    '</div>';
  }

  function renderCombinationConfig(template) {
    if (!canConfigureCombinations(template)) return '';
    var mode = combinationMode(template);
    var itemCount = mode === 'free' ? template.freeItems.length : template.combinations.reduce(function (sum, combination) { return sum + combination.items.length; }, 0);
    var templateHref = mode === 'free' ? 'assets/templates/组合折扣券_自由组合商品导入模板.xlsx' : 'assets/templates/组合折扣券_分组组合商品导入模板.xlsx';
    var headingText = mode === 'free' ? '已配置 ' + itemCount + ' 个商品；可任选一项或多项' : '已配置 ' + template.combinations.length + ' 个组合、' + itemCount + ' 条商品规则；多组任选一';
    var body = mode === 'free' ? renderFreeConfig(template) : '<div class="combination-list">' + template.combinations.map(function (combination, index) { return renderCombinationCard(template, combination, index); }).join('') + '</div>';
    var groupedFixedNote = mode === 'grouped' && template.combinations.length === 1 ? '<div class="fixed-equivalent-note"><strong>当前仅配置 1 个分组：</strong>业务效果等同原“固定组合”，组内商品必须全部核销。</div>' : '';
    var ruleNote = mode === 'free' ? '<strong>自由组合规则：</strong>核销时可从商品池任选一个或多个商品，每项数量不得超过配置上限；卡券仍一次核销，未使用的商品或数量不保留。' : '<strong>分组组合规则：</strong>一次只能选择一个核销组合；实际商品编码集合必须与该组合一致，组内数量可以多但不能少，不得混入组合外商品。';
    return '<div class="combination-config">' +
      '<div class="combination-config-heading"><div><strong>商品组合配置</strong><span>' + headingText + '</span></div><div class="combination-heading-actions"><a class="btn btn-small" href="' + templateHref + '" download>⇩ 下载Excel模板</a><button class="btn btn-small" id="openExcelImport" type="button">⇧ Excel上传商品</button>' + (mode === 'grouped' ? '<button class="btn btn-primary btn-small" id="addCombination" type="button">＋ 新增核销组合</button>' : '') + '</div></div>' +
      renderModeSelector(template) +
      '<div class="combination-shared-rule"><div><span>券级共用折扣</span><strong>' + formatDiscount(template.discountRate) + '</strong></div><p class="combination-discount-description">' + combinationDiscountDescription(mode, template.discountRate) + '</p></div>' +
      groupedFixedNote + body +
      '<div class="batch-rule-note">' + ruleNote + '</div>' +
    '</div>';
  }

  function scopeStatusNote(template) {
    if (canConfigureCombinations(template)) return '';
    if (isCombinationCoupon(template)) {
      return '<div class="selected-empty scope-placeholder">组合折扣券仅在 BIMC（新）或维修保养（新）场景、且适用范围选择“备件”时支持自由组合、分组组合和 Excel 商品导入。</div>';
    }
    if (template.applicableType) {
      return '<div class="selected-empty scope-placeholder">当前券类型沿用原单对象规则，不支持配置多个备件；只有“组合折扣券”开放多备件组合方式。</div>';
    }
    return '';
  }

  function scopeRow(template) {
    return '<div class="sit-form-row scope-form-row"><span class="sit-label">选择适用范围：</span><div class="sit-control">' +
      '<div class="scope-choice-list">' + renderScopeOptions(template) + '</div>' +
      '<div class="scope-tools"><button class="btn" type="button" data-demo>查看关联详情</button></div>' +
      '<small>适用类型仍为单选。只有组合折扣券在目标场景选择备件后，才允许配置自由组合、分组组合及 Excel 商品导入。</small>' +
      renderCombinationConfig(template) + scopeStatusNote(template) +
    '</div></div>';
  }

  function discountField(template) {
    if (template.couponType === '折扣券' || isCombinationCoupon(template)) {
      var minRate = isCombinationCoupon(template) ? 0 : 0.1;
      var help = isCombinationCoupon(template) ? '支持 0-9.9 折；0 折表示配置优惠范围内免费，组合数量边界保持不变' : '按现有折扣券规则配置';
      return row('折扣比例', '<div class="input-suffix compact-control"><input id="discountRate" class="form-input" type="number" min="' + minRate + '" max="9.9" step="0.1" value="' + template.discountRate + '"><span>折</span></div>', true, help);
    }
    return row('卡券面值', '<div class="input-suffix compact-control"><input id="faceValue" class="form-input" type="number" min="1" value="' + template.faceValue + '"><span>元</span></div>', true, '整张券只有一个优惠总额');
  }

  function render() {
    var template = window.PrototypeState.template;
    var useFreeText = canConfigureCombinations(template) && isFreeMode(template);
    return '<section class="coupon-page">' +
      '<div class="page-heading"><strong>新建/编辑卡券</strong><button class="btn" type="button" data-page-jump="overview">返 回</button></div>' +
      '<div class="form-panel">' +
        '<section class="coupon-form-section"><h2>基本信息</h2>' +
          row('品牌', '<select class="form-select compact-control" disabled><option>日产</option></select>', true, '首次提交后不可再编辑') +
          row('创券来源', '<div class="readonly-field compact-control">卡券中心</div>', false) +
          row('业务场景', '<div class="cascade-control"><select class="form-select compact-control" disabled><option>售后营销</option></select><span>/</span><select id="sceneSelect" class="form-select compact-control">' + ['BIMC（新）', '维修保养（新）', '上门取送车', '续保（新）'].map(function (value) { return option(value, template.scene); }).join('') + '</select></div>', true, '组合折扣券只适用于 BIMC（新）、维修保养（新）') +
          row('卡券分类', '<select id="couponTypeSelect" class="form-select compact-control">' + couponTypes.map(function (value) { return option(value, template.couponType); }).join('') + '</select>', true, '新增“组合折扣券”；只有该类型允许配置多备件核销组合') +
          row('卡券名称', '<input id="couponName" class="form-input long-control" value="' + window.escapeHTML(template.name) + '" placeholder="请输入卡券标题">', true, '卡券主标题，最多 30 个字符') +
          row('卡券描述', '<input class="form-input long-control" value="' + (useFreeText ? '商品池内任选一项或多项，按商品最大数量核销' : '多个核销组合任选一，组合内备件必须同时满足') + '" placeholder="请输入卡券描述">', false, '用于补充说明卡券适用范围') +
          row('卡券图片', '<button class="btn" type="button" data-demo>上传图片</button><span class="inline-note">建议尺寸 750 × 360px</span>', true) +
          discountField(template) +
          row('发放数量', '<div class="input-suffix compact-control"><input class="form-input" value="9999"><span>张</span></div>', true, '数量范围 1-9999999，仅支持整数') +
          row('使用须知', '<textarea class="form-textarea long-control">' + (useFreeText ? '核销时可从商品池任选一个或多个商品；每项不得超过最大核销数量；一次核销后未使用额度作废。' : '一次只能选择一个核销组合；组合内商品必须全部满足最低核销数量；超出最低数量的部分不享受折扣。') + '</textarea>', true) +
          row('适用车系/车型', '<button class="btn" type="button" data-demo>选择车系/车型</button><span class="selection-state">已选择 0 个车系、0 个车型</span>', false, '指卡券支持在哪些车系/车型领取或核销') +
          row('适用专营店', '<button class="btn" type="button" data-demo>选择专营店</button><button class="btn" type="button" data-demo>上传文件</button><button class="btn" type="button" data-demo>下载模板</button><span class="selection-state">已选择 0 家专营店</span>', false, '指卡券支持哪些门店领取或核销') +
          scopeRow(template) +
          row('是否通用券', '<label class="sit-radio"><input type="radio" name="universal" checked>是</label><label class="sit-radio"><input type="radio" name="universal">否</label>', false) +
        '</section>' +
        '<section class="coupon-form-section"><h2>领取规则</h2>' +
          row('领取数量', '<div class="inline-picker"><span>每个用户最多可领</span><input class="form-input short-input" value="1"><span>张；每个VIN最多可领</span><input class="form-input short-input" value="1"><span>张</span></div>', true, '此处定义领券上限；首次提交后不可再编辑') +
          row('领券时间', '<div class="inline-picker"><input type="date" class="form-input compact-control" value="2026-07-24"><span>至</span><input type="date" class="form-input compact-control" value="2026-08-31"></div>', true, '卡券可以领取的时间') +
        '</section>' +
        '<section class="coupon-form-section"><h2>核销规则</h2>' +
          row('核销时间', '<div class="control-stack"><div><label class="sit-radio"><input type="radio" name="redeem-time" checked>固定日期</label><label class="sit-radio"><input type="radio" name="redeem-time">领取后生效，有效天数</label></div><div class="inline-picker"><input type="date" class="form-input compact-control" value="2026-07-24"><span>至</span><input type="date" class="form-input compact-control" value="2026-09-30"></div></div>', true, '卡券可以使用/核销的时间') +
          row('核销方式', '<label class="sit-radio"><input type="radio" name="redeem-method" checked>线上核销</label><label class="sit-radio"><input type="radio" name="redeem-method">线下核销</label><label class="sit-radio"><input type="radio" name="redeem-method">线下+线上核销</label>', true, useFreeText ? 'E3S 一次提交自由组合内实际选择的商品明细' : 'E3S 一次提交一个核销组合及全部商品明细') +
          row('核销门店与意向门店一致', '<label class="sit-radio"><input type="radio" name="same-store">是</label><label class="sit-radio"><input type="radio" name="same-store" checked>否</label>', false) +
          row('核销渠道', '<div class="check-line"><label><input type="checkbox" checked>日产APP</label><label><input type="checkbox">微信小程序</label><label><input type="checkbox">微信公众号</label><label><input type="checkbox">官网</label><label><input type="checkbox">车机</label></div>', true) +
          row('核销结束时间增加', '<div class="inline-picker"><input class="form-input short-input" value="0"><span>天内允许核销</span></div>', false, '核销时间已过期后，在配置天数内允许继续核销') +
        '</section>' +
        '<section class="coupon-form-section"><h2>关联设置</h2>' +
          row('结算规则', '<div class="control-stack"><div><label class="sit-radio"><input type="radio" name="settlement" checked>无结算规则快速创建</label><label class="sit-radio"><input type="radio" name="settlement">已存在结算规则</label></div><select class="form-select long-control" disabled><option>请选择结算规则</option></select></div>', false) +
          row('短信通知', '<div class="control-stack"><div><label class="sit-radio"><input type="radio" name="sms" checked>默认</label><label class="sit-radio"><input type="radio" name="sms">自定义</label><label class="sit-radio"><input type="radio" name="sms">无</label></div><textarea class="form-textarea long-control" disabled>【东风日产】恭喜您已成功领取卡券，请在有效期内核销使用。</textarea></div>', true) +
          row('领取/下发卡券提醒', '<label class="sit-radio"><input type="radio" name="push" checked>无</label><label class="sit-radio"><input type="radio" name="push">App Push 消息提醒</label>', false) +
          row('核销后提醒', '<div class="inline-picker"><span>站内信提醒</span><select class="form-select compact-control"><option>无</option><option>选择站内信模板</option></select></div>', false) +
          row('到期提醒', '<div class="inline-picker"><span>到期前</span><input class="form-input short-input" value="3"><span>天提醒</span><select class="form-select compact-control"><option>无</option><option>选择站内信模板</option></select></div>', false) +
        '</section>' +
      '</div>' +
      '<div class="sticky-actions"><button class="btn" id="resetTemplate" type="button">取 消</button><button class="btn btn-primary" id="saveDraft" type="button">提 交</button></div>' +
    '</section>';
  }

  function rerender() {
    document.getElementById('app').innerHTML = render();
    init();
  }

  function chooseScope(type) {
    var template = window.PrototypeState.template;
    template.applicableType = type;
    rerender();
    window.showToast('已选择“' + type + '”适用范围');
  }

  function usedInOtherCombinations(template, currentId, code) {
    return template.combinations.filter(function (combination) {
      return combination.combinationId !== currentId && combination.items.some(function (item) { return item.code === code; });
    }).map(function (combination) { return combination.name; });
  }

  function openItemPicker(combinationId) {
    var template = window.PrototypeState.template;
    var combination = findCombination(template, combinationId);
    if (!combination) return;
    var selectedCodes = combination.items.map(function (item) { return item.code; });
    var draftCodes = selectedCodes.slice();
    var rows = window.PrototypeData.itemCatalog.map(function (item) {
      var usedBy = usedInOtherCombinations(template, combinationId, item.code);
      return '<tr><td class="check-cell"><input type="checkbox" data-catalog-code="' + window.escapeHTML(item.code) + '"' + (selectedCodes.indexOf(item.code) >= 0 ? ' checked' : '') + '></td>' +
        '<td><code class="benefit-code">' + window.escapeHTML(item.code) + '</code></td><td><strong>' + window.escapeHTML(item.name) + '</strong></td><td>' + window.escapeHTML(item.spec) + '</td><td>' + window.money(item.unitPrice) + '</td><td>' + (usedBy.length ? '<span class="cross-combination-use">已用于' + window.escapeHTML(usedBy.join('、')) + '</span>' : '—') + '</td></tr>';
    }).join('');
    var overlay = window.openPrototypeModal({
      title: '为' + combination.name + '选择商品',
      wide: true,
      confirmText: '确认选择',
      body: '<div class="modal-tip">同一商品在当前组合内只能选择一次；允许在其他组合中重复使用。</div><div class="table-wrapper benefit-table-wrap"><table class="data-table"><thead><tr><th>选择</th><th>备件编码</th><th>备件名称</th><th>规格</th><th>参考单价</th><th>其他组合</th></tr></thead><tbody>' + rows + '</tbody></table></div><div class="table-meta"><span>共 ' + window.PrototypeData.itemCatalog.length + ' 条</span><strong id="part-selected-count">已勾选 ' + draftCodes.length + ' 项</strong></div>',
      onConfirm: function (modal) {
        var codes = Array.prototype.map.call(modal.querySelectorAll('[data-catalog-code]:checked'), function (checkbox) { return checkbox.getAttribute('data-catalog-code'); });
        if (!codes.length) return window.showToast('每个核销组合至少选择一个商品');
        var nextItems = codes.map(function (code) {
          var existing = combination.items.find(function (item) { return item.code === code; });
          if (existing) return existing;
          var catalog = window.PrototypeData.itemCatalog.find(function (item) { return item.code === code; });
          return { code: catalog.code, name: catalog.name, spec: catalog.spec, minQty: 1, unitPrice: catalog.unitPrice };
        });
        var duplicate = duplicateCombination(template, combinationId, nextItems);
        if (duplicate) return window.showToast('商品集合与“' + duplicate.name + '”完全相同，请调整后再保存');
        combination.items = nextItems;
        modal.remove();
        rerender();
        window.showToast(combination.name + '已选择 ' + combination.items.length + ' 个商品');
      }
    });
    Array.prototype.forEach.call(overlay.querySelectorAll('[data-catalog-code]'), function (checkbox) {
      checkbox.addEventListener('change', function () {
        draftCodes = Array.prototype.map.call(overlay.querySelectorAll('[data-catalog-code]:checked'), function (input) { return input.getAttribute('data-catalog-code'); });
        overlay.querySelector('#part-selected-count').textContent = '已勾选 ' + draftCodes.length + ' 项';
      });
    });
  }

  function openFreeItemPicker() {
    var template = window.PrototypeState.template;
    var selectedCodes = template.freeItems.map(function (item) { return item.code; });
    var rows = window.PrototypeData.itemCatalog.map(function (item) {
      return '<tr><td class="check-cell"><input type="checkbox" data-free-catalog-code="' + window.escapeHTML(item.code) + '"' + (selectedCodes.indexOf(item.code) >= 0 ? ' checked' : '') + '></td>' +
        '<td><code class="benefit-code">' + window.escapeHTML(item.code) + '</code></td><td><strong>' + window.escapeHTML(item.name) + '</strong></td><td>' + window.escapeHTML(item.spec) + '</td><td>' + window.money(item.unitPrice) + '</td></tr>';
    }).join('');
    var overlay = window.openPrototypeModal({
      title: '选择自由组合商品',
      wide: true,
      confirmText: '确认选择',
      body: '<div class="modal-tip">核销时可从商品池任选一个或多个商品；同一商品只能配置一次。</div><div class="table-wrapper benefit-table-wrap"><table class="data-table"><thead><tr><th>选择</th><th>备件编码</th><th>备件名称</th><th>规格</th><th>参考单价</th></tr></thead><tbody>' + rows + '</tbody></table></div><div class="table-meta"><span>共 ' + window.PrototypeData.itemCatalog.length + ' 条</span><strong id="free-selected-count">已勾选 ' + selectedCodes.length + ' 项</strong></div>',
      onConfirm: function (modal) {
        var codes = Array.prototype.map.call(modal.querySelectorAll('[data-free-catalog-code]:checked'), function (checkbox) { return checkbox.getAttribute('data-free-catalog-code'); });
        if (!codes.length) return window.showToast('自由组合至少选择一个商品');
        template.freeItems = codes.map(function (code) {
          var existing = template.freeItems.find(function (item) { return item.code === code; });
          return existing || itemFromCatalog(code, 'maxQty', 1);
        });
        modal.remove();
        rerender();
        window.showToast('自由组合已选择 ' + template.freeItems.length + ' 个商品');
      }
    });
    Array.prototype.forEach.call(overlay.querySelectorAll('[data-free-catalog-code]'), function (checkbox) {
      checkbox.addEventListener('change', function () {
        overlay.querySelector('#free-selected-count').textContent = '已勾选 ' + overlay.querySelectorAll('[data-free-catalog-code]:checked').length + ' 项';
      });
    });
  }

  function excelPreviewTable(mode, rows) {
    var validCount = rows.filter(function (row) { return row.valid; }).length;
    var cells = rows.map(function (row) {
      return '<tr class="' + (row.valid ? '' : 'excel-error-row') + '"><td>' + row.row + '</td>' +
        (mode === 'grouped' ? '<td>' + window.escapeHTML(row.groupName) + '</td>' : '') +
        '<td><code>' + window.escapeHTML(row.code) + '</code></td><td>' + row.qty + '</td><td>' + window.UI.status(row.valid ? '可导入' : '失败', row.valid ? 'success' : 'danger') + '</td><td>' + window.escapeHTML(row.reason) + '</td></tr>';
    }).join('');
    return '<div class="excel-validation-summary"><div><strong>' + rows.length + '</strong><span>数据行</span></div><div class="is-success"><strong>' + validCount + '</strong><span>可导入</span></div><div class="is-error"><strong>' + (rows.length - validCount) + '</strong><span>错误行</span></div></div>' +
      '<div class="table-wrapper excel-preview-table"><table class="data-table"><thead><tr><th>行号</th>' + (mode === 'grouped' ? '<th>组合名称</th>' : '') + '<th>商品编码</th><th>' + (mode === 'grouped' ? '最低核销数量' : '最大核销数量') + '</th><th>校验</th><th>说明</th></tr></thead><tbody>' + cells + '</tbody></table></div>' +
      '<div class="excel-import-options"><span>导入方式：</span><label><input type="radio" name="excel-import-mode" value="append" checked>追加到现有配置</label><label><input type="radio" name="excel-import-mode" value="replace">清空后覆盖</label><small>错误行不会导入；正式环境可下载错误明细，本原型仅展示校验结果。</small></div>';
  }

  function applyGroupedImport(template, rows, replace) {
    var groupedRows = {};
    rows.filter(function (row) { return row.valid; }).forEach(function (row) {
      if (!groupedRows[row.groupName]) groupedRows[row.groupName] = [];
      groupedRows[row.groupName].push(row);
    });
    if (replace) template.combinations = [];
    Object.keys(groupedRows).forEach(function (groupName) {
      var combination = !replace && template.combinations.find(function (item) { return item.name === groupName; });
      if (!combination) {
        var sequence = template.nextCombinationSeq || (template.combinations.length + 1);
        combination = { combinationId: 'COMB-' + String(sequence).padStart(2, '0'), name: groupName, items: [] };
        template.nextCombinationSeq = sequence + 1;
        template.combinations.push(combination);
      }
      groupedRows[groupName].forEach(function (row) {
        var existing = combination.items.find(function (item) { return item.code === row.code; });
        if (existing) existing.minQty = row.qty;
        else combination.items.push(itemFromCatalog(row.code, 'minQty', row.qty));
      });
    });
  }

  function applyFreeImport(template, rows, replace) {
    if (replace) template.freeItems = [];
    rows.filter(function (row) { return row.valid; }).forEach(function (row) {
      var existing = template.freeItems.find(function (item) { return item.code === row.code; });
      if (existing) existing.maxQty = row.qty;
      else template.freeItems.push(itemFromCatalog(row.code, 'maxQty', row.qty));
    });
  }

  function openExcelImportModal() {
    var template = window.PrototypeState.template;
    var mode = combinationMode(template);
    var modeLabel = mode === 'free' ? '自由组合' : '分组组合';
    var selectedFileName = '';
    var previewRows = window.PrototypeData.excelImportPreview[mode];
    var overlay = window.openPrototypeModal({
      title: 'Excel上传商品｜' + modeLabel,
      wide: true,
      confirmText: '导入校验通过数据',
      body: '<div class="excel-upload-tip"><strong>请使用当前“' + modeLabel + '”模板</strong><span>' + (mode === 'free' ? '必填列：商品编码、最大核销数量' : '必填列：组合名称、商品编码、最低核销数量；同一文件可包含多个组合') + '</span></div>' +
        '<label class="excel-upload-box" for="excelFileInput"><input id="excelFileInput" type="file" accept=".xlsx,.xls"><span class="excel-upload-icon">XLSX</span><strong id="excelFileName">点击选择 Excel 文件</strong><small>支持 .xlsx、.xls；原型选中文件后使用 Mock 数据演示解析和校验</small></label>' +
        '<div id="excelPreviewState" class="excel-preview-empty">选择文件后显示校验结果</div>',
      onConfirm: function (modal) {
        if (!selectedFileName) return window.showToast('请先选择 Excel 文件');
        var importModeInput = modal.querySelector('input[name="excel-import-mode"]:checked');
        var replace = importModeInput && importModeInput.value === 'replace';
        if (mode === 'free') applyFreeImport(template, previewRows, replace);
        else applyGroupedImport(template, previewRows, replace);
        var count = previewRows.filter(function (row) { return row.valid; }).length;
        modal.remove();
        rerender();
        window.showToast('Excel 导入完成：成功 ' + count + ' 条，失败 ' + (previewRows.length - count) + ' 条');
      }
    });
    overlay.querySelector('#excelFileInput').addEventListener('change', function () {
      selectedFileName = this.files && this.files[0] ? this.files[0].name : '';
      if (!selectedFileName) return;
      overlay.querySelector('#excelFileName').textContent = selectedFileName;
      overlay.querySelector('#excelPreviewState').className = '';
      overlay.querySelector('#excelPreviewState').innerHTML = excelPreviewTable(mode, previewRows);
    });
  }

  function validateCombinations(template) {
    if (isFreeMode(template)) {
      if (!template.freeItems.length) return '自由组合至少需要选择一个商品';
      return '';
    }
    if (!template.combinations.length) return '请至少配置一个核销组合';
    var empty = template.combinations.find(function (combination) { return !combination.items.length; });
    if (empty) return empty.name + '至少需要选择一个商品';
    var seen = {};
    for (var i = 0; i < template.combinations.length; i += 1) {
      var key = canonicalItemSet(template.combinations[i].items);
      if (seen[key]) return template.combinations[i].name + '与' + seen[key] + '的商品集合完全相同';
      seen[key] = template.combinations[i].name;
    }
    return '';
  }

  function init() {
    var template = window.PrototypeState.template;
    document.querySelector('[data-page-jump]').addEventListener('click', function () { window.navigateTo('overview'); });
    document.getElementById('sceneSelect').addEventListener('change', function () {
      template.scene = this.value;
      rerender();
    });
    document.getElementById('couponTypeSelect').addEventListener('change', function () {
      template.couponType = this.value;
      rerender();
    });
    document.getElementById('couponName').addEventListener('input', function () { template.name = this.value; });
    var discountRate = document.getElementById('discountRate');
    if (discountRate) {
      discountRate.addEventListener('input', function () {
        var minRate = isCombinationCoupon(template) ? 0 : 0.1;
        var rawRate = Number(this.value);
        if (!Number.isFinite(rawRate)) rawRate = minRate;
        var nextRate = Math.max(minRate, Math.min(9.9, Math.round(rawRate * 10) / 10));
        template.discountRate = nextRate;
        if (rawRate < minRate || rawRate > 9.9) this.value = nextRate;
        Array.prototype.forEach.call(document.querySelectorAll('.shared-discount-tag'), function (tag) { tag.textContent = '共用 ' + formatDiscount(nextRate); });
        Array.prototype.forEach.call(document.querySelectorAll('.combination-shared-rule strong'), function (value) { value.textContent = formatDiscount(nextRate); });
        Array.prototype.forEach.call(document.querySelectorAll('.combination-card'), function (card) {
          var combination = findCombination(template, card.getAttribute('data-combination-card'));
          Array.prototype.forEach.call(card.querySelectorAll('.discount-scope'), function (scope, index) {
            if (combination && combination.items[index]) scope.textContent = '前 ' + combination.items[index].minQty + ' 件享 ' + formatDiscount(nextRate);
          });
        });
        Array.prototype.forEach.call(document.querySelectorAll('.free-combination-panel .discount-scope'), function (scope) {
          scope.textContent = '实际选中数量享 ' + formatDiscount(nextRate);
        });
        var description = document.querySelector('.combination-discount-description');
        if (description) description.textContent = combinationDiscountDescription(combinationMode(template), nextRate);
      });
      discountRate.addEventListener('change', function () {
        this.value = template.discountRate;
      });
    }
    var faceValue = document.getElementById('faceValue');
    if (faceValue) faceValue.addEventListener('change', function () {
      template.faceValue = Math.max(1, Number(this.value || 1));
      rerender();
    });
    Array.prototype.forEach.call(document.querySelectorAll('.scope-checkbox'), function (checkbox) {
      checkbox.addEventListener('change', function () {
        if (checkbox.checked) chooseScope(checkbox.getAttribute('data-scope'));
        else {
          template.applicableType = '';
          rerender();
        }
      });
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-choose-scope]'), function (button) {
      button.addEventListener('click', function () { chooseScope(button.getAttribute('data-choose-scope')); });
    });
    Array.prototype.forEach.call(document.querySelectorAll('input[name="combination-mode"]'), function (radio) {
      radio.addEventListener('change', function () {
        template.combinationMode = this.value;
        rerender();
        window.showToast('已切换为' + (this.value === 'free' ? '自由组合' : '分组组合'));
      });
    });
    var addCombination = document.getElementById('addCombination');
    if (addCombination) addCombination.addEventListener('click', function () {
      var sequence = template.nextCombinationSeq || (template.combinations.length + 1);
      template.combinations.push({
        combinationId: 'COMB-' + String(sequence).padStart(2, '0'),
        name: combinationName(sequence),
        items: []
      });
      template.nextCombinationSeq = sequence + 1;
      rerender();
      window.showToast('已新增' + combinationName(sequence) + '，请继续选择商品');
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-remove-combination]'), function (button) {
      button.addEventListener('click', function () {
        if (template.combinations.length <= 1) return window.showToast('至少保留一个核销组合');
        template.combinations = template.combinations.filter(function (combination) { return combination.combinationId !== button.getAttribute('data-remove-combination'); });
        rerender();
      });
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-select-combination-items]'), function (button) {
      button.addEventListener('click', function () { openItemPicker(button.getAttribute('data-select-combination-items')); });
    });
    var selectFreeItems = document.getElementById('selectFreeItems');
    if (selectFreeItems) selectFreeItems.addEventListener('click', openFreeItemPicker);
    Array.prototype.forEach.call(document.querySelectorAll('[data-min-minus], [data-min-plus]'), function (button) {
      button.addEventListener('click', function () {
        var combination = findCombination(template, button.getAttribute('data-combination-id'));
        var item = combination && combination.items.find(function (row) { return row.code === button.getAttribute('data-item-code'); });
        if (item) item.minQty = button.hasAttribute('data-min-plus') ? item.minQty + 1 : Math.max(1, item.minQty - 1);
        rerender();
      });
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-remove-combination-item]'), function (button) {
      button.addEventListener('click', function () {
        var combination = findCombination(template, button.getAttribute('data-combination-id'));
        if (combination) combination.items = combination.items.filter(function (item) { return item.code !== button.getAttribute('data-item-code'); });
        rerender();
      });
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-free-minus], [data-free-plus]'), function (button) {
      button.addEventListener('click', function () {
        var item = template.freeItems.find(function (row) { return row.code === button.getAttribute('data-item-code'); });
        if (item) item.maxQty = button.hasAttribute('data-free-plus') ? item.maxQty + 1 : Math.max(1, item.maxQty - 1);
        rerender();
      });
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-remove-free-item]'), function (button) {
      button.addEventListener('click', function () {
        template.freeItems = template.freeItems.filter(function (item) { return item.code !== button.getAttribute('data-remove-free-item'); });
        rerender();
      });
    });
    var openExcelImport = document.getElementById('openExcelImport');
    if (openExcelImport) openExcelImport.addEventListener('click', openExcelImportModal);
    Array.prototype.forEach.call(document.querySelectorAll('[data-demo]'), function (button) {
      button.addEventListener('click', function () { window.showToast('原型演示：未提交真实后台操作'); });
    });
    document.getElementById('saveDraft').addEventListener('click', function () {
      if (isCombinationCoupon(template) && !canConfigureCombinations(template)) return window.showToast('组合折扣券仅支持 BIMC/维修保养场景下的备件适用范围');
      if (canConfigureCombinations(template)) {
        var error = validateCombinations(template);
        if (error) return window.showToast(error);
        if (isFreeMode(template)) return window.showToast('组合折扣券配置已提交：自由组合 ' + template.freeItems.length + ' 个商品，共用 ' + formatDiscount(template.discountRate));
        return window.showToast('组合折扣券配置已提交：分组组合 ' + template.combinations.length + ' 组，共用 ' + formatDiscount(template.discountRate));
      }
      window.showToast('原型演示：卡券配置已提交');
    });
    document.getElementById('resetTemplate').addEventListener('click', function () {
      window.PrototypeState.template = JSON.parse(JSON.stringify(window.PrototypeData.couponTemplate));
      rerender();
      window.showToast('已恢复演示数据');
    });
  }

  window.Pages['coupon-create'] = { render: render, init: init };
})();
