(function () {
  'use strict';

  window.Pages = window.Pages || {};

  var data = window.MockData;
  var scopeTypes = [
    { key: 'parts', label: '选择备件' },
    { key: 'labor', label: '选择工时' },
    { key: 'boutique', label: '选择精品' },
    { key: 'package', label: '选择套餐' },
    { key: 'benefit', label: '选择权益' }
  ];
  var state = { scopeType: '', benefitCodes: [], draftCodes: [], codeKeyword: '', nameKeyword: '' };

  function escapeText(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function row(label, control, required, help, extraClass) {
    return '<div class="sit-form-row' + (extraClass ? ' ' + extraClass : '') + '">' +
      '<span class="sit-label' + (required ? ' required' : '') + '">' + label + '：</span>' +
      '<div class="sit-control">' + control + (help ? '<small>' + help + '</small>' : '') + '</div></div>';
  }

  function selectedBenefits(codes) {
    return codes.map(function (code) {
      return data.benefits.find(function (item) { return item.code === code; });
    }).filter(Boolean);
  }

  function renderScopeOptions() {
    return scopeTypes.map(function (item) {
      var selected = state.scopeType === item.key;
      var locked = state.scopeType && !selected;
      return '<div class="scope-option' + (selected ? ' is-selected' : '') + (locked ? ' is-locked' : '') + '">' +
        '<input class="scope-checkbox" type="checkbox" aria-label="' + item.label + '范围" data-scope="' + item.key + '"' + (selected ? ' checked' : '') + (locked ? ' disabled' : '') + '>' +
        '<button class="scope-button" type="button" data-action="choose-scope" data-scope="' + item.key + '"' + (locked ? ' disabled' : '') + '>' + item.label + '</button>' +
        '</div>';
    }).join('');
  }

  function renderSelectedSummary() {
    var items = selectedBenefits(state.benefitCodes);
    if (!items.length) return '<div class="selected-empty">暂未选择权益产品</div>';
    return '<div class="selected-heading"><strong>已选择 ' + items.length + ' 项权益</strong><button class="link-button" id="edit-benefits" type="button">重新选择</button></div>' +
      '<div class="selected-tags">' + items.map(function (item) {
        return '<span><b>' + escapeText(item.name) + '</b><code>' + escapeText(item.code) + '</code></span>';
      }).join('') + '</div>';
  }

  function renderScopeArea() {
    var list = document.getElementById('scope-choice-list');
    var summary = document.getElementById('benefit-selection-summary');
    if (list) list.innerHTML = renderScopeOptions();
    if (summary) {
      summary.hidden = state.scopeType !== 'benefit' && !state.benefitCodes.length;
      summary.innerHTML = renderSelectedSummary();
    }
    bindScopeArea();
  }

  function chooseScope(scope) {
    state.scopeType = scope;
    renderScopeArea();
    if (scope === 'benefit') openBenefitModal();
    else window.showToast('已选择“' + scopeTypes.find(function (item) { return item.key === scope; }).label.replace('选择', '') + '”适用范围');
  }

  function bindScopeArea() {
    document.querySelectorAll('.scope-checkbox').forEach(function (input) {
      input.addEventListener('change', function () {
        if (input.checked) chooseScope(input.getAttribute('data-scope'));
        else {
          if (state.scopeType === 'benefit') state.benefitCodes = [];
          state.scopeType = '';
          renderScopeArea();
        }
      });
    });
    document.querySelectorAll('[data-action="choose-scope"]').forEach(function (button) {
      button.addEventListener('click', function () { chooseScope(button.getAttribute('data-scope')); });
    });
    var edit = document.getElementById('edit-benefits');
    if (edit) edit.addEventListener('click', openBenefitModal);
  }

  function filteredBenefits() {
    var code = state.codeKeyword.toLowerCase();
    var name = state.nameKeyword.toLowerCase();
    return data.benefits.filter(function (item) {
      return (!code || item.code.toLowerCase().indexOf(code) > -1) && (!name || item.name.toLowerCase().indexOf(name) > -1);
    });
  }

  function renderBenefitRows() {
    var items = filteredBenefits();
    if (!items.length) return '<tr><td colspan="4" class="empty-cell">没有匹配的权益产品</td></tr>';
    return items.map(function (item) {
      return '<tr>' +
        '<td class="check-cell"><input class="benefit-check" type="checkbox" value="' + escapeText(item.code) + '"' + (state.draftCodes.indexOf(item.code) > -1 ? ' checked' : '') + '></td>' +
        '<td><code class="benefit-code">' + escapeText(item.code) + '</code></td>' +
        '<td><strong>' + escapeText(item.name) + '</strong></td>' +
        '<td><details class="benefit-content"><summary>查看权益内容</summary><p>' + escapeText(item.content) + '</p></details></td>' +
        '</tr>';
    }).join('');
  }

  function renderModalTable() {
    var body = document.getElementById('benefit-table-body');
    if (body) body.innerHTML = renderBenefitRows();
    var result = document.getElementById('benefit-result-count');
    if (result) result.textContent = '共 ' + filteredBenefits().length + ' 条';
    var count = document.getElementById('benefit-selected-count');
    if (count) count.textContent = '已勾选 ' + state.draftCodes.length + ' 项';
    bindBenefitChecks();
  }

  function bindBenefitChecks() {
    document.querySelectorAll('.benefit-check').forEach(function (input) {
      input.addEventListener('change', function () {
        if (input.checked && state.draftCodes.indexOf(input.value) < 0) state.draftCodes.push(input.value);
        if (!input.checked) state.draftCodes = state.draftCodes.filter(function (code) { return code !== input.value; });
        var count = document.getElementById('benefit-selected-count');
        if (count) count.textContent = '已勾选 ' + state.draftCodes.length + ' 项';
      });
    });
  }

  function closeBenefitModal() {
    var root = document.getElementById('modal-root');
    if (root) root.innerHTML = '';
  }

  function openBenefitModal() {
    state.scopeType = 'benefit';
    state.draftCodes = state.benefitCodes.slice();
    state.codeKeyword = '';
    state.nameKeyword = '';
    renderScopeArea();
    document.getElementById('modal-root').innerHTML =
      '<div class="modal-overlay"><section class="modal-content benefit-modal" role="dialog" aria-modal="true" aria-labelledby="benefit-modal-title">' +
      '<header class="modal-header"><div><h2 id="benefit-modal-title">选择权益</h2><p>权益类产品数据来源：E3S</p></div><button class="modal-close" id="close-benefit-modal" type="button" aria-label="关闭">×</button></header>' +
      '<div class="modal-body"><div class="modal-tip">支持按权益编码、权益名称查询，可勾选多项；权益内容点击后展开查看。</div>' +
      '<div class="benefit-filters"><label>权益编码<input class="form-input" id="benefit-code-keyword" placeholder="请输入权益编码"></label><label>权益名称<input class="form-input" id="benefit-name-keyword" placeholder="请输入权益名称"></label><button class="btn" id="reset-benefit-filter" type="button">重 置</button><button class="btn btn-primary" id="query-benefits" type="button">查 询</button></div>' +
      '<div class="table-wrapper benefit-table-wrap"><table class="benefit-table"><thead><tr><th>选择</th><th>权益编码</th><th>权益名称</th><th>权益内容</th></tr></thead><tbody id="benefit-table-body">' + renderBenefitRows() + '</tbody></table></div>' +
      '<div class="table-meta"><span id="benefit-result-count">共 ' + data.benefits.length + ' 条</span><strong id="benefit-selected-count">已勾选 ' + state.draftCodes.length + ' 项</strong></div></div>' +
      '<footer class="modal-footer"><button class="btn" id="cancel-benefit-modal" type="button">取 消</button><button class="btn btn-primary" id="confirm-benefits" type="button">确认选择</button></footer></section></div>';
    bindBenefitChecks();
    document.getElementById('close-benefit-modal').addEventListener('click', closeBenefitModal);
    document.getElementById('cancel-benefit-modal').addEventListener('click', closeBenefitModal);
    document.getElementById('query-benefits').addEventListener('click', function () {
      state.codeKeyword = document.getElementById('benefit-code-keyword').value.trim();
      state.nameKeyword = document.getElementById('benefit-name-keyword').value.trim();
      renderModalTable();
    });
    document.getElementById('reset-benefit-filter').addEventListener('click', function () {
      state.codeKeyword = '';
      state.nameKeyword = '';
      document.getElementById('benefit-code-keyword').value = '';
      document.getElementById('benefit-name-keyword').value = '';
      renderModalTable();
    });
    document.getElementById('confirm-benefits').addEventListener('click', function () {
      state.benefitCodes = state.draftCodes.slice();
      closeBenefitModal();
      renderScopeArea();
      window.showToast('已关联 ' + state.benefitCodes.length + ' 项权益产品');
    });
  }

  function scopeRow() {
    return '<div class="sit-form-row scope-form-row" data-anno="benefit-scope-entry"><span class="sit-label">选择适用范围：</span><div class="sit-control">' +
      '<div class="scope-choice-list" id="scope-choice-list">' + renderScopeOptions() + '</div>' +
      '<div class="scope-tools"><button class="btn" data-demo="upload" type="button">⇧ 选择上传文件</button><button class="btn" data-demo="download" type="button">⇩ 下载模板</button><button class="btn" data-demo="detail" type="button">查看关联详情</button></div>' +
      '<small>仅支持单选，选一项后其余类型不可选；取消当前勾选后可重新选择。权益数据从 E3S 权益类产品中勾选。</small>' +
      '<div class="benefit-selection-summary" id="benefit-selection-summary" hidden></div></div></div>';
  }

  function renderPage() {
    return '<section class="coupon-page">' +
      '<div class="page-heading"><strong>新建/编辑满减券</strong><button class="btn" type="button" data-demo="back">返 回</button></div>' +
      '<div class="form-panel">' +
      '<section class="coupon-form-section"><h2>基本信息</h2>' +
      row('品牌', '<select class="form-select compact-control" disabled><option>日产</option></select>', true, '首次提交后不可再编辑') +
      row('创券来源', '<div class="readonly-field compact-control">卡券中心</div>', false) +
      row('业务场景', '<div class="cascade-control"><select class="form-select compact-control"><option>售后营销</option><option>售前营销</option><option>商城营销</option></select><span>/</span><select class="form-select compact-control"><option>维修保养（新）</option><option>上门取送车</option><option>续保（新）</option></select></div>', true, '两级级联：主场景 / 子场景；首次提交后不可再编辑') +
      row('卡券分类', '<select id="coupon-type-select" class="form-select compact-control"><option>满减券</option><option>代金券</option><option>折扣券</option><option>权益券</option></select>', true, '由业务场景动态加载；首次提交后不可再编辑') +
      row('卡券名称', '<input class="form-input long-control" value="夏季车主维保满减券" placeholder="请输入卡券标题">', true, '卡券主标题，最多 30 个字符') +
      row('卡券描述', '<input class="form-input long-control" value="指定维保项目满300元减40元" placeholder="请输入卡券描述">', false, '用于补充说明卡券适用范围') +
      row('卡券图片', '<button class="btn" data-demo="image" type="button">上传图片</button><span class="inline-note">建议尺寸 750 × 360px</span>', true) +
      row('卡券优惠', '<div class="inline-picker"><span>每满</span><input class="form-input short-input" value="300"><span>元，减</span><input class="form-input short-input" value="40"><span>元</span></div>', true, '单位：元；金额最小 0.01 元') +
      row('发放数量', '<div class="input-suffix compact-control"><input class="form-input" value="9999"><span>张</span></div>', true, '数量范围 1-9999999，仅支持整数') +
      row('使用须知', '<textarea class="form-textarea long-control">适用于指定维保项目；同一订单仅可使用一张；具体服务范围以门店实际核销为准。</textarea>', true) +
      row('适用车系/车型', '<button class="btn" data-demo="model" type="button">选择车系/车型</button><span class="selection-state">已选择 0 个车系、0 个车型</span>', false, '指卡券支持在哪些车系/车型领取或核销') +
      row('适用专营店', '<button class="btn" data-demo="dealer" type="button">选择专营店</button><button class="btn" data-demo="upload" type="button">上传文件</button><button class="btn" data-demo="download" type="button">下载模板</button><span class="selection-state">已选择 0 家专营店</span>', false, '指卡券支持哪些门店领取或核销') +
      scopeRow() +
      row('是否通用券', '<label class="sit-radio"><input type="radio" name="universal" checked>是</label><label class="sit-radio"><input type="radio" name="universal">否</label>', false) +
      '</section>' +
      '<section class="coupon-form-section"><h2>领取规则</h2>' +
      row('领取数量', '<div class="inline-picker"><span>每个用户最多可领</span><input class="form-input short-input" value="1"><span>张；每个VIN最多可领</span><input class="form-input short-input" value="1"><span>张</span></div>', true, '此处定义领券上限；首次提交后不可再编辑') +
      row('领券时间', '<div class="inline-picker"><input type="date" class="form-input compact-control" value="2026-07-22"><span>至</span><input type="date" class="form-input compact-control" value="2026-08-31"></div>', true, '卡券可以领取的时间') +
      '</section>' +
      '<section class="coupon-form-section"><h2>核销规则</h2>' +
      row('核销时间', '<div class="control-stack"><div><label class="sit-radio"><input type="radio" name="redeem-time" checked>固定日期</label><label class="sit-radio"><input type="radio" name="redeem-time">领取后生效，有效天数</label></div><div class="inline-picker"><input type="date" class="form-input compact-control" value="2026-07-22"><span>至</span><input type="date" class="form-input compact-control" value="2026-09-30"></div></div>', true, '卡券可以使用/核销的时间') +
      row('核销方式', '<label class="sit-radio"><input type="radio" name="redeem-method" checked>线上核销</label><label class="sit-radio"><input type="radio" name="redeem-method">线下核销</label><label class="sit-radio"><input type="radio" name="redeem-method">线下+线上核销</label>', true, '线上核销用于线上商城消费；线下核销用于线下 E3S 核销') +
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
      '<div class="sticky-actions"><button class="btn" data-demo="cancel" type="button">取 消</button><button class="btn btn-primary" id="save-demo" type="button">提 交</button></div>' +
      '</section>';
  }

  window.Pages.index = {
    render: renderPage,
    init: function () {
      bindScopeArea();
      document.querySelectorAll('[data-demo]').forEach(function (button) {
        button.addEventListener('click', function () { window.showToast('原型演示：未提交真实后台操作'); });
      });
      document.getElementById('save-demo').addEventListener('click', function () {
        if (state.scopeType === 'benefit' && !state.benefitCodes.length) return window.showToast('请先在弹窗中勾选至少一项权益');
        window.showToast('原型演示：卡券配置已提交');
      });
    }
  };

  function mount() {
    var app = document.getElementById('app');
    if (!app) return;
    app.innerHTML = window.Pages.index.render();
    window.Pages.index.init();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
