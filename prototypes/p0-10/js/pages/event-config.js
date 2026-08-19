(function () {
  'use strict';

  window.Pages = window.Pages || {};

  function eventRows() {
    return window.MockData.behaviorEvents.map(function (event) {
      var isNew = event.status === 'new';
      return [
        '<tr class="' + (isNew ? 'new-event-row' : '') + '">',
        '<td><input class="event-check" type="checkbox" data-event="' + window.escapeHtml(event.name) + '"' +
          (isNew && window.AppState.selectedEvent ? ' checked' : '') + '></td>',
        '<td><span class="code-pill ' + (isNew ? 'code-pending' : '') + '">' + window.escapeHtml(event.code) + '</span></td>',
        '<td>' + window.escapeHtml(event.category) + '</td>',
        '<td><strong>' + window.escapeHtml(event.name) + '</strong>' +
          (isNew ? '<span class="new-badge">本期新增</span>' : '') + '</td>',
        '<td>' + window.escapeHtml(event.reverse) + '</td>',
        '<td><button class="link-button" data-detail="' + window.escapeHtml(event.name) + '">查看规则</button></td>',
        '</tr>'
      ].join('');
    }).join('');
  }

  function configPanel() {
    if (!window.AppState.selectedEvent) {
      return [
        '<div class="empty-panel">',
        '<div class="empty-icon">＋</div>',
        '<strong>请选择新增行为事件</strong>',
        '<p>勾选“用户订单消费金额达N元”后配置金额门槛。</p>',
        '</div>'
      ].join('');
    }

    return [
      '<div class="config-panel" id="amount-rule-panel">',
      '<div class="config-panel-head">',
      '<div><span class="eyebrow">新增事件配置</span><h3>用户订单消费金额达N元</h3></div>',
      '<span class="tag tag-warning">行为编码待分配</span>',
      '</div>',
      '<div class="form-grid">',
      '<label class="field"><span>金额门槛 N <b>*</b></span><div class="money-input"><i>¥</i><input id="threshold-input" type="number" min="0.01" step="0.01" value="' + window.AppState.thresholdAmount + '"><em>元</em></div><small id="threshold-error">请输入大于0的金额</small></label>',
      '<label class="field"><span>金额口径 <b>*</b></span><select id="amount-basis"><option>订单实付金额</option><option>订单应付金额</option><option>商品金额</option></select><small class="helper">默认按优惠后实际支付金额判断</small></label>',
      '<label class="field"><span>触发时点 <b>*</b></span><select id="trigger-point"><option>支付成功后</option><option>订单提交成功后</option></select><small class="helper">当前原型按支付成功后上报</small></label>',
      '<label class="field"><span>触发频次 <b>*</b></span><select id="frequency"><option>每订单一次</option><option>每用户每天一次</option><option>活动期每用户一次</option></select><small class="helper">建议以订单号作为幂等业务键</small></label>',
      '</div>',
      '<div class="rule-preview">',
      '<div><span>规则表达</span><strong id="rule-expression">当订单实付金额 ≥ ¥' + Number(window.AppState.thresholdAmount).toFixed(2) + '，生成1次抽奖机会</strong></div>',
      '<div class="flow-mini"><span>支付成功</span><i>→</i><span>商城上报事件</span><i>→</i><span>活动中心匹配规则</span><i>→</i><span>发放1次抽奖机会</span></div>',
      '</div>',
      '<div class="config-actions">',
      '<button class="btn" id="reset-rule">恢复默认</button>',
      '<button class="btn btn-primary" id="save-rule">保存配置</button>',
      '</div>',
      '</div>'
    ].join('');
  }

  window.Pages['event-config'] = {
    render: function () {
      return [
        '<div class="page-head">',
        '<div><div class="breadcrumb">保客营销 Portal / 活动配置 / 行为触发</div><h1>选择行为触发场景</h1><p>在现有“商城订单”一级分类下增加金额达标事件，并配置金额门槛 N。</p></div>',
        '<div class="page-head-actions"><span class="source-chip">参考：图19－选择行为触发场景</span></div>',
        '</div>',
        '<div class="notice notice-info"><strong>本期改造</strong><span>新增“用户订单消费金额达N元”。正式行为编码、退款后奖品处理仍待确认。</span></div>',
        '<div class="card event-card">',
        '<div class="section-title"><div><h2>行为事件字典</h2><p>一级场景：商城订单</p></div><div class="filter-pills"><span class="active">商城订单</span><span>预约保养单</span><span>套餐销售单</span></div></div>',
        '<div class="table-wrapper"><table class="event-table"><thead><tr><th>复选</th><th>行为编码</th><th>一级场景（分类）</th><th>二级场景</th><th>默认卡券失效场景</th><th>操作</th></tr></thead><tbody>',
        eventRows(),
        '</tbody></table></div>',
        '</div>',
        configPanel(),
        '<div class="decision-strip"><strong>系统边界</strong><span>本原型仅覆盖活动中心后台配置。新商城负责在支付成功后计算并上报金额事件；活动中心按 N 判断并生成一次抽奖机会；后续抽奖、发奖与核销页面不在本原型范围。</span></div>'
      ].join('');
    },
    init: function () {
      var checks = document.querySelectorAll('.event-check');
      Array.prototype.forEach.call(checks, function (check) {
        check.addEventListener('change', function () {
          if (this.getAttribute('data-event') === '用户订单消费金额达N元') {
            window.AppState.selectedEvent = this.checked;
            window.navigateTo('event-config');
          } else {
            this.checked = false;
            window.showToast('本原型仅演示新增金额达标事件', 'info');
          }
        });
      });

      var detailButtons = document.querySelectorAll('[data-detail]');
      Array.prototype.forEach.call(detailButtons, function (button) {
        button.addEventListener('click', function () {
          window.showToast(this.getAttribute('data-detail') + '：规则说明已在表格中展示', 'info');
        });
      });

      var input = document.getElementById('threshold-input');
      if (!input) return;
      var error = document.getElementById('threshold-error');
      var expression = document.getElementById('rule-expression');
      input.addEventListener('input', function () {
        var value = Number(this.value);
        var valid = value > 0;
        this.classList.toggle('input-error', !valid);
        error.classList.toggle('show', !valid);
        if (valid) {
          expression.textContent = '当订单实付金额 ≥ ¥' + value.toFixed(2) + '，生成1次抽奖机会';
        }
      });

      document.getElementById('save-rule').addEventListener('click', function () {
        var value = Number(input.value);
        if (!(value > 0)) {
          input.classList.add('input-error');
          error.classList.add('show');
          window.showToast('请输入正确的金额门槛', 'error');
          return;
        }
        window.AppState.thresholdAmount = value;
        window.AppState.amountBasis = document.getElementById('amount-basis').value;
        window.AppState.triggerPoint = document.getElementById('trigger-point').value;
        window.AppState.frequency = document.getElementById('frequency').value;
        window.AppState.eventConfigured = true;
        window.showToast('金额达标事件已保存');
      });

      document.getElementById('reset-rule').addEventListener('click', function () {
        window.AppState.thresholdAmount = 500;
        window.AppState.amountBasis = '订单实付金额';
        window.AppState.triggerPoint = '支付成功后';
        window.AppState.frequency = '每订单一次';
        window.navigateTo('event-config');
      });

    }
  };
})();
