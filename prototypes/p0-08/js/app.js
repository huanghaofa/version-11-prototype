(function () {
  'use strict';

  window.Pages = window.Pages || {};

  var data = window.ExchangeActivityMock;
  var confirmedIds = new Set(data.initialSelectedIds);
  var draftIds = new Set(data.initialSelectedIds);
  var currentType = '全部';
  var keyword = '';
  var rewardMode = data.activity.rewardMode;
  var selectedPointId = null;

  function couponById(id) {
    return data.coupons.find(function (item) { return item.id === id; });
  }

  function statusChip(item) {
    var cls = item.status === '已发布' ? 'status-published' : 'status-draft';
    return '<span class="status-chip ' + cls + '">' + item.status + '</span>';
  }

  function typeChip(item) {
    return '<span class="type-chip ' + (item.type === '兑换券' ? 'exchange' : '') + '">' + item.type + '</span>';
  }

  function pageTemplate() {
    return '' +
      '<header class="topbar">' +
        '<div class="topbar-left"><button class="icon-btn" aria-label="折叠菜单">☰</button><span>菜单模式切换</span></div>' +
        '<div class="topbar-right"><span class="search-hint">⌕ 菜单查询</span><span>消息</span><strong>超级管理员</strong></div>' +
      '</header>' +
      '<div class="breadcrumb">工作台 <span>›</span> 活动中心 <span>›</span> 保客活动 <span>›</span> 活动创建</div>' +
      '<div class="module-tabs"><span>组合活动列表</span><span>专属福利活动列表</span><span class="active">保客活动创建</span><span>保客活动互斥关系</span></div>' +
      '<section class="page-head">' +
        '<div><h1>活动详情页</h1><p>创建活动并配置基础信息、奖励、活动对象与分享信息</p></div>' +
        '<div class="head-actions"><button class="btn" data-save>保存草稿</button><button class="btn btn-primary" data-submit>确定</button><button class="btn">返回</button></div>' +
      '</section>' +
      '<main class="page-content">' +
        '<div class="scope-note"><strong>SIT 取证 + 目标态：</strong>保留测试环境现有的领取方式、门店取值、车型取值和“选择卡劵”入口；新增兑换券筛选，并把 step2 扩展为可同时配置卡券与积分奖励。</div>' +
        '<div class="primary-tabs"><span class="active">基础配置</span><span>页面配置</span></div>' +
        '<div class="steps">' +
          '<div class="step done"><i>1</i><span>step1：基本信息</span></div>' +
          '<div class="step active"><i>2</i><span>step2：奖励配置 <b class="target-tag">目标态</b></span></div>' +
          '<div class="step"><i>3</i><span>step3：活动对象</span></div>' +
          '<div class="step"><i>4</i><span>step4：分享与SEO</span></div>' +
        '</div>' +
        '<section class="reward-context-card">' +
          '<div class="context-title"><div><h2>step1 配置快照</h2><p>测试环境“活动奖品”为单选；目标态增加积分及组合选项。</p></div><span class="sit-chip">SIT 字段延展</span></div>' +
          '<div class="context-grid">' +
            '<div><label>活动奖品</label><div class="segmented-control" id="rewardModeControl">' +
              '<button data-reward-mode="coupon">卡券中心-卡券</button>' +
              '<button data-reward-mode="points">积分</button>' +
              '<button data-reward-mode="combo" class="active">卡券 + 积分</button>' +
            '</div></div>' +
          '</div>' +
        '</section>' +
        '<div id="couponRewardBlock">' +
        '<section class="form-card">' +
          '<div class="reward-block-title"><span class="reward-index">1</span><div><h2>卡券奖励配置</h2><p>以下字段来自 SIT 当前 step2；普通券和兑换券共用同一选择入口。</p></div></div>' +
          '<div class="field-row"><label><em>*</em> 活动卡券的领取方式</label><div class="radio-group"><label><input type="radio" checked> 自动领取</label><label><input type="radio"> 手动领取</label></div></div>' +
          '<div class="field-row"><label>活动门店取值</label><div class="radio-group muted-options"><label><input type="radio"> 以卡券中心配置的为准</label><label><input type="radio" checked> 以活动为准，每张卡券单独设置门店</label><label><input type="radio"> 以活动为准，多张卡券统一设置门店</label></div></div>' +
          '<div class="field-row"><label>活动车型取值</label><div class="radio-group muted-options"><label><input type="radio"> 以卡券中心配置的为准</label><label><input type="radio" checked> 以活动为准，每张卡券单独设置车型</label><label><input type="radio"> 以活动为准，多张卡券统一设置车型</label></div></div>' +
        '</section>' +
        '<section class="coupon-section" id="couponSection">' +
          '<div class="section-head">' +
            '<div><h2>已关联卡券 <span class="count-badge" id="confirmedCount">' + confirmedIds.size + '</span></h2><p>普通券与兑换券可同时关联；兑换券商品与履约规则由卡券中心维护。</p></div>' +
            '<button class="btn btn-primary" id="openCouponSelector">＋ 选择卡券</button>' +
          '</div>' +
          '<div id="confirmedCouponList">' + confirmedTable() + '</div>' +
        '</section>' +
        '<button class="add-coupon-bar" id="openCouponSelectorBottom">＋ 添加卡券配置</button>' +
        '</div>' +
        '<div id="pointRewardBlock">' + pointSectionTemplate() + '</div>' +
        '<div class="page-actions"><button class="btn" data-save>保存草稿</button><button class="btn btn-primary" id="nextStep">下一步</button><button class="btn">取消</button></div>' +
      '</main>' +
      '<footer class="prototype-legend"><span><b class="dot current"></b>现有页面结构</span><span><b class="dot target"></b>本期新增目标态</span><a href="docs/interaction.html" target="_blank">查看功能说明</a></footer>';
  }

  function confirmedTable() {
    var items = Array.from(confirmedIds).map(couponById).filter(Boolean);
    if (!items.length) {
      return '<div class="empty-state"><div>暂无关联卡券</div><p>点击“选择卡券”，可关联普通券或兑换券。</p></div>';
    }
    return '<div class="table-wrapper"><table class="coupon-table"><thead><tr><th>卡券名称 / ID</th><th>卡券类型</th><th>规则摘要</th><th>履约 / 核销</th><th>绑定对象</th><th>状态</th><th>操作</th></tr></thead><tbody>' +
      items.map(function (item) {
        return '<tr data-confirmed-id="' + item.id + '">' +
          '<td><strong>' + item.name + '</strong><small>' + item.id + ' · ' + item.scene + '</small></td>' +
          '<td>' + typeChip(item) + '</td>' +
          '<td><span class="summary-text">' + item.summary + '</span>' + (item.type === '兑换券' ? '<small>' + item.mode + ' · 规则只读</small>' : '') + '</td>' +
          '<td>' + item.fulfillment + '</td>' +
          '<td>' + item.bindTarget + '</td>' +
          '<td>' + statusChip(item) + '</td>' +
          '<td class="action-cell"><button class="link-btn" data-detail="' + item.id + '">查看</button><button class="link-btn danger" data-remove="' + item.id + '">移除</button></td>' +
        '</tr>';
      }).join('') +
    '</tbody></table></div>';
  }

  function pointById(id) {
    return data.pointConfigs.find(function (item) { return item.id === id; });
  }

  function pointSectionTemplate() {
    var config = selectedPointId ? pointById(selectedPointId) : null;
    var content = config
      ? '<div class="point-config-card">' +
          '<div class="point-amount"><strong>' + config.points + '</strong><span>积分</span></div>' +
          '<div class="point-meta"><h3>' + config.name + '</h3><p>' + config.id + ' · ' + config.version + ' · ' + config.mainScenario + ' / ' + config.subScenario + '</p><div><span>有效期：' + config.validity + '</span><span>发放到：' + config.issueTarget + '</span></div></div>' +
          '<div class="point-actions"><span class="status-chip status-published">' + config.status + '</span><button class="link-btn" id="changePointConfig">更换</button><button class="link-btn danger" id="removePointConfig">移除</button></div>' +
        '</div>'
      : '<div class="point-empty"><div><strong>尚未选择积分配置</strong><p>活动只引用已启用配置，积分数量和场景不能在活动内修改。</p></div><button class="btn btn-primary" id="openPointSelector">＋ 选择积分配置</button></div>';
    return '<section class="point-section">' +
      '<div class="section-head point-head"><div class="reward-block-title"><span class="reward-index points">2</span><div><h2>积分奖励配置</h2><p>目标态：引用已启用积分配置；发放时锁定用户默认卡 VIN。</p></div></div></div>' +
      '<div class="point-section-body">' + content + '</div>' +
    '</section>';
  }

  function pointRows() {
    return data.pointConfigs.map(function (item) {
      var disabled = !item.valid;
      return '<tr class="' + (disabled ? 'row-disabled' : '') + '">' +
        '<td><input type="radio" name="pointConfig" value="' + item.id + '" ' + (selectedPointId === item.id ? 'checked' : '') + ' ' + (disabled ? 'disabled' : '') + ' aria-label="选择' + item.name + '"></td>' +
        '<td><strong>' + item.name + '</strong><small>' + item.id + ' · ' + item.version + '</small></td>' +
        '<td><strong class="points-number">' + item.points + '</strong></td>' +
        '<td>' + item.mainScenario + '<small>' + item.subScenario + '</small></td>' +
        '<td>' + item.validity + '</td>' +
        '<td><span class="status-chip ' + (item.valid ? 'status-published' : 'status-draft') + '">' + item.status + '</span>' + (disabled ? '<small class="disabled-reason">' + item.disabledReason + '</small>' : '') + '</td>' +
      '</tr>';
    }).join('');
  }

  function openPointSelector() {
    document.body.insertAdjacentHTML('beforeend',
      '<div class="modal-overlay detail-overlay" id="pointSelector" role="dialog" aria-modal="true">' +
        '<div class="modal-content point-selector-modal"><div class="modal-header"><div><h2>选择积分配置</h2><p>仅展示配置摘要；积分数量与场景由积分配置统一维护</p></div><button class="close-btn" data-close-point>×</button></div>' +
        '<div class="boundary-banner point-boundary"><span class="boundary-icon">i</span><div><strong>积分发放规则</strong><p>积分发放使用用户默认卡对应 VIN；活动发布时锁定配置 ID 和版本。</p></div></div>' +
        '<div class="modal-body point-table-wrap"><table class="selector-table"><thead><tr><th>选择</th><th>配置名称 / 编码</th><th>积分</th><th>业务场景</th><th>有效期</th><th>状态</th></tr></thead><tbody>' + pointRows() + '</tbody></table></div>' +
        '<div class="modal-footer"><button class="btn" data-close-point>取消</button><button class="btn btn-primary" id="confirmPointConfig">确认选择</button></div></div>' +
      '</div>');
    document.querySelectorAll('[data-close-point]').forEach(function (btn) {
      btn.addEventListener('click', closePointSelector);
    });
    document.getElementById('confirmPointConfig').addEventListener('click', function () {
      var chosen = document.querySelector('input[name="pointConfig"]:checked');
      if (!chosen) {
        window.showToast('请选择一项已启用积分配置', 'error');
        return;
      }
      selectedPointId = chosen.value;
      closePointSelector();
      updatePointSection();
      window.showToast('积分配置已添加');
    });
  }

  function closePointSelector() {
    var modal = document.getElementById('pointSelector');
    if (modal) modal.remove();
  }

  function updatePointSection() {
    var block = document.getElementById('pointRewardBlock');
    if (block) block.innerHTML = pointSectionTemplate();
    bindPointActions();
  }

  function bindPointActions() {
    var open = document.getElementById('openPointSelector');
    if (open) open.addEventListener('click', openPointSelector);
    var change = document.getElementById('changePointConfig');
    if (change) change.addEventListener('click', openPointSelector);
    var remove = document.getElementById('removePointConfig');
    if (remove) remove.addEventListener('click', function () {
      selectedPointId = null;
      updatePointSection();
      window.showToast('已移除积分奖励', 'neutral');
    });
  }

  function updateRewardVisibility() {
    var couponBlock = document.getElementById('couponRewardBlock');
    var pointBlock = document.getElementById('pointRewardBlock');
    if (couponBlock) couponBlock.hidden = rewardMode === 'points';
    if (pointBlock) pointBlock.hidden = rewardMode === 'coupon';
    document.querySelectorAll('[data-reward-mode]').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-reward-mode') === rewardMode);
    });
    updatePointSection();
  }

  function filteredCoupons() {
    return data.coupons.filter(function (item) {
      var typeMatch = currentType === '全部' || item.type === currentType;
      var term = keyword.trim().toLowerCase();
      var keywordMatch = !term || (item.name + item.id + item.scene).toLowerCase().indexOf(term) > -1;
      return typeMatch && keywordMatch;
    });
  }

  function selectorRows() {
    var items = filteredCoupons();
    if (!items.length) {
      return '<tr><td colspan="7"><div class="empty-state compact">没有符合条件的卡券</div></td></tr>';
    }
    return items.map(function (item) {
      var checked = draftIds.has(item.id);
      var disabled = !item.valid;
      var rule = item.type === '兑换券'
        ? '<strong>' + item.summary + '</strong><small>' + item.mode + ' · ' + item.fulfillment + ' · 绑定' + item.bindTarget + '</small>'
        : '<strong>' + item.summary + '</strong><small>' + item.fulfillment + ' · 绑定' + item.bindTarget + '</small>';
      return '<tr class="' + (disabled ? 'row-disabled' : '') + '" data-selector-row="' + item.id + '">' +
        '<td><input class="coupon-checkbox" type="checkbox" data-select-id="' + item.id + '" ' + (checked ? 'checked' : '') + ' ' + (disabled ? 'disabled' : '') + ' aria-label="选择' + item.name + '"></td>' +
        '<td><strong>' + item.name + '</strong><small>' + item.id + '</small></td>' +
        '<td>' + typeChip(item) + '</td>' +
        '<td>' + item.scene + '</td>' +
        '<td class="rule-cell">' + rule + '</td>' +
        '<td>' + statusChip(item) + (disabled ? '<small class="disabled-reason">' + item.disabledReason + '</small>' : '') + '</td>' +
        '<td><button class="link-btn" data-detail="' + item.id + '">详情</button></td>' +
      '</tr>';
    }).join('');
  }

  function selectorTemplate() {
    var typeCounts = {
      '全部': data.coupons.length,
      '立减券': data.coupons.filter(function (x) { return x.type === '立减券'; }).length,
      '折扣券': data.coupons.filter(function (x) { return x.type === '折扣券'; }).length,
      '兑换券': data.coupons.filter(function (x) { return x.type === '兑换券'; }).length
    };
    return '<div class="modal-overlay" id="couponSelector" role="dialog" aria-modal="true" aria-labelledby="selectorTitle">' +
      '<div class="modal-content selector-modal">' +
        '<div class="modal-header"><div><h2 id="selectorTitle">选择卡券</h2><p>数据来源：卡券中心 · 仅已发布且有效的券可关联</p></div><button class="close-btn" data-close-selector aria-label="关闭">×</button></div>' +
        '<div class="boundary-banner"><span class="boundary-icon">i</span><div><strong>兑换券规则由卡券中心维护</strong><p>活动中心仅选择券模板并配置发放，不在这里修改商品、N选M、履约方式。</p></div></div>' +
        '<div class="type-tabs" id="couponTypeTabs">' +
          ['全部', '立减券', '折扣券', '兑换券'].map(function (type) {
            return '<button class="' + (currentType === type ? 'active' : '') + '" data-filter-type="' + type + '">' + type + '<span>' + typeCounts[type] + '</span></button>';
          }).join('') +
        '</div>' +
        '<div class="selector-search">' +
          '<div class="search-field"><label>卡券名称 / ID</label><input id="couponKeyword" value="' + keyword + '" placeholder="请输入名称或卡券 ID"></div>' +
          '<div class="search-field"><label>卡券状态</label><select disabled><option>全部状态（不可选券会禁用）</option></select></div>' +
          '<button class="btn btn-primary" id="searchCoupon">查询</button><button class="btn" id="resetCoupon">重置</button>' +
        '</div>' +
        '<div class="selector-table-wrap"><table class="selector-table"><thead><tr><th>选择</th><th>卡券名称 / ID</th><th>类型</th><th>业务场景</th><th>规则摘要</th><th>状态</th><th>操作</th></tr></thead><tbody id="selectorRows">' + selectorRows() + '</tbody></table></div>' +
        '<div class="selection-summary"><div><strong>已选 <span id="draftCount">' + draftIds.size + '</span> 张</strong><span id="selectedNames">' + selectedNames() + '</span></div><button class="link-btn" id="clearSelection">清空选择</button></div>' +
        '<div class="modal-footer"><button class="btn" data-close-selector>取消</button><button class="btn btn-primary" id="confirmCoupons">确认关联（' + draftIds.size + '）</button></div>' +
      '</div>' +
    '</div>';
  }

  function selectedNames() {
    var names = Array.from(draftIds).map(couponById).filter(Boolean).map(function (x) { return x.name; });
    return names.length ? names.join('、') : '尚未选择卡券';
  }

  function openSelector() {
    draftIds = new Set(confirmedIds);
    currentType = '全部';
    keyword = '';
    document.body.insertAdjacentHTML('beforeend', selectorTemplate());
    bindSelector();
  }

  function rerenderSelector() {
    var body = document.getElementById('selectorRows');
    if (body) body.innerHTML = selectorRows();
    var count = document.getElementById('draftCount');
    if (count) count.textContent = draftIds.size;
    var names = document.getElementById('selectedNames');
    if (names) names.textContent = selectedNames();
    var confirm = document.getElementById('confirmCoupons');
    if (confirm) confirm.textContent = '确认关联（' + draftIds.size + '）';
    document.querySelectorAll('[data-filter-type]').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-filter-type') === currentType);
    });
    bindSelectorRows();
  }

  function bindSelectorRows() {
    document.querySelectorAll('[data-select-id]').forEach(function (checkbox) {
      checkbox.addEventListener('change', function () {
        var id = this.getAttribute('data-select-id');
        if (this.checked) draftIds.add(id); else draftIds.delete(id);
        rerenderSelector();
      });
    });
    document.querySelectorAll('#couponSelector [data-detail]').forEach(function (btn) {
      btn.addEventListener('click', function () { openDetail(this.getAttribute('data-detail')); });
    });
  }

  function bindSelector() {
    document.querySelectorAll('[data-close-selector]').forEach(function (btn) {
      btn.addEventListener('click', closeSelector);
    });
    document.querySelectorAll('[data-filter-type]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        currentType = this.getAttribute('data-filter-type');
        rerenderSelector();
      });
    });
    document.getElementById('searchCoupon').addEventListener('click', function () {
      keyword = document.getElementById('couponKeyword').value;
      rerenderSelector();
    });
    document.getElementById('couponKeyword').addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        keyword = this.value;
        rerenderSelector();
      }
    });
    document.getElementById('resetCoupon').addEventListener('click', function () {
      keyword = '';
      currentType = '全部';
      document.getElementById('couponKeyword').value = '';
      rerenderSelector();
    });
    document.getElementById('clearSelection').addEventListener('click', function () {
      draftIds.clear();
      rerenderSelector();
    });
    document.getElementById('confirmCoupons').addEventListener('click', function () {
      confirmedIds = new Set(draftIds);
      closeSelector();
      updateConfirmed();
      window.showToast('已关联 ' + confirmedIds.size + ' 张卡券');
    });
    bindSelectorRows();
  }

  function closeSelector() {
    var modal = document.getElementById('couponSelector');
    if (modal) modal.remove();
  }

  function openDetail(id) {
    var item = couponById(id);
    if (!item) return;
    var exchangeContent = item.type === '兑换券'
      ? '<div class="detail-grid">' +
          detailItem('兑换模式', item.mode) +
          detailItem('候选商品 / 可兑数量', item.candidateCount + ' 个候选 / 可兑 ' + item.redeemQuantity + ' 件') +
          detailItem('同 SKU 多件', item.allowSameSku ? '允许（受单商品上限约束）' : '不允许') +
          detailItem('履约方式', item.fulfillment) +
          detailItem('绑定对象', item.bindTarget + '（发放时绑定）') +
          detailItem('有效期', item.validity) +
        '</div>' +
        '<div class="product-summary"><h3>候选商品摘要</h3><div>' + item.products.map(function (p) { return '<span>' + p + '</span>'; }).join('') + '</div></div>' +
        '<div class="readonly-note">本页仅展示卡券中心返回的规则摘要。若需修改商品或兑换规则，请前往卡券中心编辑。</div>'
      : '<div class="detail-grid">' + detailItem('优惠规则', item.summary) + detailItem('核销方式', item.fulfillment) + detailItem('绑定对象', item.bindTarget) + detailItem('有效期', item.validity) + '</div>';
    document.body.insertAdjacentHTML('beforeend',
      '<div class="modal-overlay detail-overlay" id="couponDetail" role="dialog" aria-modal="true">' +
        '<div class="modal-content detail-modal"><div class="modal-header"><div><h2>' + item.name + '</h2><p>' + item.id + ' · ' + item.scene + '</p></div><button class="close-btn" data-close-detail>×</button></div>' +
        '<div class="modal-body"><div class="detail-title-row">' + typeChip(item) + statusChip(item) + '<span>来源：' + item.source + '</span></div>' + exchangeContent + '</div>' +
        '<div class="modal-footer"><button class="btn btn-primary" data-close-detail>我知道了</button></div></div>' +
      '</div>');
    document.querySelectorAll('[data-close-detail]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var detail = document.getElementById('couponDetail');
        if (detail) detail.remove();
      });
    });
  }

  function detailItem(label, value) {
    return '<div><span>' + label + '</span><strong>' + value + '</strong></div>';
  }

  function updateConfirmed() {
    var list = document.getElementById('confirmedCouponList');
    if (list) list.innerHTML = confirmedTable();
    var count = document.getElementById('confirmedCount');
    if (count) count.textContent = confirmedIds.size;
    bindConfirmedActions();
  }

  function bindConfirmedActions() {
    document.querySelectorAll('#confirmedCouponList [data-detail]').forEach(function (btn) {
      btn.addEventListener('click', function () { openDetail(this.getAttribute('data-detail')); });
    });
    document.querySelectorAll('[data-remove]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var item = couponById(this.getAttribute('data-remove'));
        confirmedIds.delete(item.id);
        updateConfirmed();
        window.showToast('已移除“' + item.name + '”', 'neutral');
      });
    });
  }

  function initPage() {
    [document.getElementById('openCouponSelector'), document.getElementById('openCouponSelectorBottom')].forEach(function (btn) {
      if (btn) btn.addEventListener('click', openSelector);
    });
    document.querySelectorAll('[data-reward-mode]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        rewardMode = this.getAttribute('data-reward-mode');
        updateRewardVisibility();
      });
    });
    document.querySelectorAll('[data-save]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        window.showToast('草稿已保存，奖励配置已保留');
      });
    });
    var submit = document.querySelector('[data-submit]');
    if (submit) submit.addEventListener('click', function () {
      if ((rewardMode === 'points' || rewardMode === 'combo') && !selectedPointId) {
        window.showToast('请先选择积分配置，再提交审核', 'error');
        return;
      }
      window.showToast('活动配置校验通过，可提交审核');
    });
    var next = document.getElementById('nextStep');
    if (next) next.addEventListener('click', function () {
      var needsCoupon = rewardMode === 'coupon' || rewardMode === 'combo';
      var needsPoints = rewardMode === 'points' || rewardMode === 'combo';
      if (needsCoupon && !confirmedIds.size) return window.showToast('请至少关联一张卡券', 'error');
      if (needsPoints && !selectedPointId) return window.showToast('请选择一项积分配置', 'error');
      window.showToast('校验通过：进入 step3 活动对象');
    });
    bindConfirmedActions();
    bindPointActions();
    updateRewardVisibility();
  }

  var page = { render: pageTemplate, init: initPage };
  window.Pages.index = page;
  window.Pages['activity-create'] = page;
  window.Pages['activity-list'] = page;
  window.Pages['activity-relation'] = page;
  window.Pages.workbench = page;
  window.Pages['coupon-center'] = page;

  function boot() {
    var app = document.getElementById('app');
    if (!app) return;
    app.innerHTML = page.render();
    page.init();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
