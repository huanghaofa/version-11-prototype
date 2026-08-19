(function () {
  'use strict';

  function relationshipTableRows(primary, rule, stackCoupons, mutexCoupons) {
    var relations = [];
    if (rule.stackScope === 'all') {
      relations.push({ target: '全部券', id: 'ALL', relation: '与全部券叠加', activityId: '-' });
    } else if (rule.stackScope === 'specified') {
      stackCoupons.forEach(function (coupon) {
        relations.push({ target: coupon.name, id: coupon.id, relation: '与指定券叠加', activityId: 'ACT-SRC-' + coupon.id.slice(-4) });
      });
    }
    if (rule.mutexScope === 'all') {
      relations.push({ target: '全部券', id: 'ALL', relation: '与全部券互斥', activityId: '-' });
    } else if (rule.mutexScope === 'specified') {
      mutexCoupons.forEach(function (coupon) {
        relations.push({ target: coupon.name, id: coupon.id, relation: '与指定券互斥', activityId: 'ACT-SRC-' + coupon.id.slice(-4) });
      });
    }
    if (!relations.length) {
      return '<tr><td colspan="7"><div class="table-empty">暂无卡券关系</div></td></tr>';
    }
    var rows = [];
    primary.forEach(function (mainCoupon) {
      relations.forEach(function (relation) {
        rows.push('<tr><td>' + (rows.length + 1) + '</td><td><strong>' + mainCoupon.id + '</strong></td>' +
          '<td>' + window.escapeHTML(mainCoupon.name) + '</td><td><strong>' + relation.id + '</strong></td>' +
          '<td>' + window.escapeHTML(relation.target) + '</td><td><span class="relation-text">' + relation.relation + '</span></td>' +
          '<td>' + relation.activityId + '</td></tr>');
      });
    });
    return rows.join('');
  }

  function render() {
    var activity = window.MockData.activity;
    var primary = window.MockData.primaryCoupons;
    var rule = window.PrototypeState.rule;
    var stackCoupons = rule.stackScope === 'specified' ? window.getCouponsByIds(rule.stackCouponIds) : [];
    var mutexCoupons = rule.mutexScope === 'specified' ? window.getCouponsByIds(rule.mutexCouponIds) : [];
    var relationTargetCount = stackCoupons.length + mutexCoupons.length + (rule.stackScope === 'all' ? 1 : 0) + (rule.mutexScope === 'all' ? 1 : 0);
    return '<section class="card legacy-relation-list">' +
      '<div class="legacy-list-title"><div><h1>互斥关系列表</h1><p>功能说明：此处可以查看在活动中心中已配置的活动互斥、卡券互斥关系；卡券页同时展示叠加关系。</p></div>' +
      '<button class="btn" type="button" data-back-edit>返回活动配置</button></div>' +
      '<div class="legacy-tabs"><button type="button">活动互斥</button><button type="button" class="active">卡券互斥</button></div>' +
      '<div class="legacy-query"><label><span>主卡券ID：</span><input class="form-input" type="text" placeholder="请输入"></label>' +
      '<label><span>主卡券名称：</span><input class="form-input" type="text" placeholder="请输入"></label>' +
      '<div><button class="btn" type="button" data-query-reset>重置</button><button class="btn btn-primary" type="button" data-query>查询</button></div></div>' +
      '<div class="legacy-table-head"><div><i></i><strong>卡券关系列表</strong><span>当前方式：' + window.getRuleModeLabel(rule.mode) + '</span></div><span>共 ' + (primary.length * relationTargetCount) + ' 条</span></div>' +
      '<div class="table-wrapper"><table class="relationship-table"><thead><tr><th>序号</th><th>主卡券ID</th><th>主卡券名称</th><th>叠加/互斥卡券ID</th><th>叠加/互斥卡券名称</th><th>叠加/互斥关系</th><th>来源活动ID</th></tr></thead><tbody>' +
      relationshipTableRows(primary, rule, stackCoupons, mutexCoupons) + '</tbody></table></div></section>';
  }

  function init() {
    document.querySelector('[data-back-edit]').addEventListener('click', function () {
      window.navigateTo('activity-edit');
    });
    document.querySelector('[data-query]').addEventListener('click', function () {
      window.showToast('已按当前条件查询', 'success');
    });
    document.querySelector('[data-query-reset]').addEventListener('click', function () {
      document.querySelectorAll('.legacy-query input').forEach(function (input) { input.value = ''; });
      window.showToast('查询条件已重置', 'success');
    });
  }

  window.Pages['relation-preview'] = {
    render: render,
    init: init
  };
})();
