(function () {
  'use strict';

  var data = window.CouponWalletData;
  var app = document.getElementById('app');
  var modalRoot = document.getElementById('modal-root');
  var toastRoot = document.getElementById('toast-root');
  var state = {
    category: 'all',
    status: 'AVAILABLE',
    selectedCouponId: null,
    exchangeStep: 'detail',
    exchangeQuantities: {}
  };
  var toastTimer = null;

  var icons = {
    account: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 12.5a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" stroke="currentColor" stroke-width="1.8"/><path d="M4.8 20c.7-3.2 3.3-5.2 7.2-5.2s6.5 2 7.2 5.2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    car: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m5.1 10 1.5-4h10.8l1.5 4M4 11.5h16v6H4v-6Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M7 17.5V20m10-2.5V20M7.5 14.5h.01m8.99 0h.01" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    shared: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 12.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Zm8-1.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM2.8 19c.5-3 2.4-4.6 5.2-4.6s4.7 1.6 5.2 4.6m.3-5.3c.7-.4 1.5-.6 2.5-.6 2.8 0 4.5 1.7 4.8 4.4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="8.5" stroke="currentColor" stroke-width="1.8"/><path d="M12 10.5V16m0-8.2v.1" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>'
  };

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function getCategoryLabel(categoryId) {
    var item = data.categories.find(function (category) {
      return category.id === categoryId;
    });
    return item ? item.label : '其他';
  }

  function getStatusLabel(status) {
    var labels = {
      AVAILABLE: '可使用',
      PENDING_ACTIVATION: '待激活',
      USED: '已使用',
      EXPIRED: '已过期'
    };
    return labels[status] || '未知状态';
  }

  function getStatusFilterLabel(status) {
    var item = data.statuses.find(function (entry) {
      return entry.id === status;
    });
    return item ? item.label : '全部状态';
  }

  function getVehicle(vehicleId) {
    return data.vehicles.find(function (vehicle) {
      return vehicle.id === vehicleId;
    });
  }

  function getCoupon(couponId) {
    return data.coupons.find(function (coupon) {
      return coupon.id === couponId;
    });
  }

  function couponsForCurrentView() {
    var statusOrder = {
      PENDING_ACTIVATION: 0,
      AVAILABLE: 1,
      USED: 2,
      EXPIRED: 3
    };
    return data.coupons
      .filter(function (coupon) {
        return state.status === 'all' || coupon.status === state.status;
      })
      .filter(function (coupon) {
        return state.category === 'all' || coupon.category === state.category;
      })
      .sort(function (a, b) {
        if (statusOrder[a.status] !== statusOrder[b.status]) {
          return statusOrder[a.status] - statusOrder[b.status];
        }
        if (a.tag === '即将过期' && b.tag !== '即将过期') return -1;
        if (b.tag === '即将过期' && a.tag !== '即将过期') return 1;
        return String(a.expiresAt).localeCompare(String(b.expiresAt));
      });
  }

  function renderHeader() {
    return [
      '<header class="wallet-header">',
        '<div class="topbar">',
          '<h1 class="topbar-title">我的卡券</h1>',
          '<button class="history-button" type="button" data-action="status-help" data-testid="status-help">',
            icons.info, '<span>状态说明</span>',
          '</button>',
        '</div>',
      '</header>'
    ].join('');
  }

  function renderFilters(viewCoupons) {
    var currentLabel = state.category === 'all' ? '全部业务分类' : getCategoryLabel(state.category);
    return [
      '<section class="category-panel" aria-label="卡券筛选">',
        '<div class="category-tabs" role="tablist" aria-label="业务分类" data-testid="category-tabs">',
          data.categories.map(function (category) {
            var active = category.id === state.category;
            return [
              '<button type="button" role="tab" class="category-tab', active ? ' active' : '', '"',
                ' aria-selected="', active ? 'true' : 'false', '"',
                ' data-category="', escapeHtml(category.id), '"',
                ' data-testid="category-', escapeHtml(category.id), '">',
                escapeHtml(category.label),
              '</button>'
            ].join('');
          }).join(''),
        '</div>',
        '<div class="status-tabs" role="tablist" aria-label="卡券状态" data-testid="status-tabs">',
          data.statuses.map(function (status) {
            var active = status.id === state.status;
            var count = data.coupons.filter(function (coupon) {
              var categoryMatched = state.category === 'all' || coupon.category === state.category;
              return categoryMatched && (status.id === 'all' || coupon.status === status.id);
            }).length;
            return [
              '<button type="button" role="tab" class="status-tab', active ? ' active' : '', '"',
                ' aria-selected="', active ? 'true' : 'false', '"',
                ' data-status="', escapeHtml(status.id), '" data-testid="status-', escapeHtml(status.id), '">',
                '<span>', escapeHtml(status.label), '</span><em>', count, '</em>',
              '</button>'
            ].join('');
          }).join(''),
        '</div>',
        '<div class="category-meta">',
          '<strong>', escapeHtml(currentLabel), ' · ', escapeHtml(getStatusFilterLabel(state.status)), '</strong>',
          '<span>筛选后 ', viewCoupons.length, ' 张</span>',
        '</div>',
      '</section>'
    ].join('');
  }

  function renderStatusMark(coupon) {
    if (coupon.status === 'AVAILABLE') return '';
    var label = coupon.statusReason || getStatusLabel(coupon.status);
    return '<span class="status-mark status-' + escapeHtml(coupon.status.toLowerCase()) + '">' + escapeHtml(label) + '</span>';
  }

  function renderCouponCard(coupon) {
    var actionable = coupon.status === 'AVAILABLE' || coupon.status === 'PENDING_ACTIVATION';
    var primary = actionable && coupon.actionType !== 'DETAIL';
    var historyClass = coupon.status === 'USED' || coupon.status === 'EXPIRED' ? ' is-history' : '';
    return [
      '<article class="coupon-card theme-', escapeHtml(coupon.theme), historyClass, '"',
        ' data-coupon-id="', escapeHtml(coupon.id), '" data-category="', escapeHtml(coupon.category), '"',
        ' data-status="', escapeHtml(coupon.status), '" data-owner-type="', escapeHtml(coupon.ownerType), '">',
        renderStatusMark(coupon),
        '<div class="coupon-value">',
          '<div class="value-line"><span class="value-main">', escapeHtml(coupon.value), '</span>',
            '<span class="value-unit">', escapeHtml(coupon.unit), '</span></div>',
          '<p class="value-caption">', escapeHtml(coupon.valueCaption), '</p>',
        '</div>',
        '<div class="coupon-main">',
          '<div class="coupon-topline">',
            '<span class="coupon-type">', escapeHtml(coupon.couponType), '</span>',
            coupon.tag ? '<span class="coupon-tag">' + escapeHtml(coupon.tag) + '</span>' : '',
          '</div>',
          '<h3 class="coupon-title">', escapeHtml(coupon.title), '</h3>',
          '<p class="coupon-subtitle">', escapeHtml(coupon.eyebrow), ' · ', escapeHtml(getCategoryLabel(coupon.category)), '</p>',
          '<p class="coupon-expiry">', escapeHtml(coupon.expiryText), '</p>',
          '<div class="coupon-footer">',
            '<button class="detail-link" type="button" data-action="detail" data-coupon="', escapeHtml(coupon.id), '">查看详情</button>',
            actionable
              ? '<button class="coupon-action' + (primary ? ' primary' : '') + '" type="button" data-action="coupon-action" data-coupon="' + escapeHtml(coupon.id) + '">' + escapeHtml(coupon.action) + '</button>'
              : '<span class="coupon-status-text">' + escapeHtml(coupon.statusReason || getStatusLabel(coupon.status)) + '</span>',
          '</div>',
        '</div>',
      '</article>'
    ].join('');
  }

  function renderAccountGroup(coupons) {
    if (!coupons.length) return '';
    return [
      '<section class="coupon-group" data-group="account" data-testid="group-account">',
        '<div class="group-header">',
          '<span class="group-icon account">', icons.account, '</span>',
          '<div class="group-heading"><h2>个人卡券</h2><p>', escapeHtml(data.profile.phoneMasked), '</p></div>',
          '<span class="group-count">', coupons.length, ' 张</span>',
        '</div>',
        '<div class="coupon-list">', coupons.map(renderCouponCard).join(''), '</div>',
      '</section>'
    ].join('');
  }

  function renderVehicleGroup(vehicle, coupons) {
    if (!coupons.length) return '';
    var hasUsable = coupons.some(function (coupon) {
      return coupon.status === 'AVAILABLE' || coupon.status === 'PENDING_ACTIVATION';
    });
    return [
      '<section class="coupon-group" data-group="', escapeHtml(vehicle.id), '" data-testid="group-', escapeHtml(vehicle.id), '">',
        '<div class="group-header">',
          '<span class="group-icon">', icons.car, '</span>',
          '<div class="group-heading">',
            '<h2>', escapeHtml(vehicle.model),
              vehicle.badge ? '<span class="vehicle-badge">' + escapeHtml(vehicle.badge) + '</span>' : '',
            '</h2>',
            '<p>', escapeHtml(vehicle.vinMasked), '</p>',
          '</div>',
          '<span class="group-count">', coupons.length, ' 张</span>',
        '</div>',
        hasUsable
          ? '<p class="share-note">' + icons.shared + '<span>车辆有效关联人均可使用</span></p>'
          : '',
        '<div class="coupon-list">', coupons.map(renderCouponCard).join(''), '</div>',
      '</section>'
    ].join('');
  }

  function renderEmpty() {
    var categoryLabel = state.category === 'all' ? '' : getCategoryLabel(state.category);
    return [
      '<section class="empty-state" data-testid="empty-state">',
        '<div class="empty-illustration"><div class="empty-ticket"></div></div>',
        '<h2>暂无', escapeHtml(categoryLabel), escapeHtml(getStatusFilterLabel(state.status)), '卡券</h2>',
        '<p>当前筛选下没有符合条件的卡券<br>可以切换其他分类或状态继续查看</p>',
        '<button type="button" class="empty-reset" data-action="reset-filter">查看全部</button>',
      '</section>'
    ].join('');
  }

  function renderContent(viewCoupons) {
    if (!viewCoupons.length) return '<div class="wallet-content">' + renderEmpty() + '</div>';
    var accountCoupons = viewCoupons.filter(function (coupon) {
      return coupon.ownerType === 'ACCOUNT';
    });
    var groups = renderAccountGroup(accountCoupons);
    data.vehicles.forEach(function (vehicle) {
      var vehicleCoupons = viewCoupons.filter(function (coupon) {
        return coupon.ownerType === 'VIN' && coupon.vehicleId === vehicle.id;
      });
      groups += renderVehicleGroup(vehicle, vehicleCoupons);
    });
    return '<div class="wallet-content" data-testid="wallet-content">' + groups + '</div>';
  }

  function render() {
    var viewCoupons = couponsForCurrentView();
    app.innerHTML = renderHeader() + renderFilters(viewCoupons) + renderContent(viewCoupons);
    bindEvents();
  }

  function bindEvents() {
    app.querySelectorAll('[data-category]').forEach(function (button) {
      button.addEventListener('click', function () {
        state.category = button.getAttribute('data-category');
        render();
      });
    });

    app.querySelectorAll('[data-status]').forEach(function (button) {
      button.addEventListener('click', function () {
        state.status = button.getAttribute('data-status');
        render();
      });
    });

    app.querySelectorAll('[data-action]').forEach(function (button) {
      var action = button.getAttribute('data-action');
      if (action === 'detail') {
        button.addEventListener('click', function () {
          openDetail(button.getAttribute('data-coupon'));
        });
      }
      if (action === 'coupon-action') {
        button.addEventListener('click', function () {
          handleCouponAction(button.getAttribute('data-coupon'));
        });
      }
      if (action === 'reset-filter') {
        button.addEventListener('click', function () {
          state.category = 'all';
          state.status = 'AVAILABLE';
          render();
        });
      }
      if (action === 'status-help') {
        button.addEventListener('click', openStatusHelp);
      }
    });
  }

  function ownerText(coupon) {
    if (coupon.ownerType === 'ACCOUNT') {
      return '个人卡券 · ' + data.profile.phoneMasked;
    }
    var vehicle = getVehicle(coupon.vehicleId);
    return vehicle.model + ' · ' + vehicle.vinMasked + ' · 关联人共用';
  }

  function buildConditionalDetails(coupon) {
    var items = [];
    if (coupon.applicableProduct) items.push(['适用商品', coupon.applicableProduct]);
    if (coupon.redeemMethod) items.push(['兑换/核销方式', coupon.redeemMethod]);
    if (coupon.cardNo) items.push(['电子卡号', coupon.cardNo]);
    if (coupon.usedAt) items.push(['使用时间', coupon.usedAt]);
    if (coupon.usedStore) items.push(['使用门店', coupon.usedStore]);
    return items.map(function (item) {
      return '<div class="detail-cell detail-cell-wide"><span>' + escapeHtml(item[0]) + '</span><strong>' + escapeHtml(item[1]) + '</strong></div>';
    }).join('');
  }

  function detailPrimaryLabel(coupon) {
    if (coupon.status === 'USED' || coupon.status === 'EXPIRED' || coupon.actionType === 'DETAIL') return '关闭';
    return coupon.action;
  }

  function openDetail(couponId) {
    var coupon = getCoupon(couponId);
    if (!coupon) return;
    state.selectedCouponId = coupon.id;
    modalRoot.innerHTML = [
      '<div class="sheet-overlay" data-action="overlay-close">',
        '<section class="bottom-sheet" role="dialog" aria-modal="true" aria-labelledby="detail-title" data-testid="detail-sheet">',
          '<div class="sheet-handle"></div>',
          '<div class="sheet-header">',
            '<h2 id="detail-title">卡券详情</h2>',
            '<button class="sheet-close" type="button" aria-label="关闭" data-action="close-modal">×</button>',
          '</div>',
          '<div class="sheet-body">',
            '<div class="detail-hero">',
              '<div class="detail-hero-top"><span class="detail-type">', escapeHtml(coupon.couponType), '</span><span class="detail-status">', escapeHtml(coupon.statusReason || getStatusLabel(coupon.status)), '</span></div>',
              '<p class="detail-category">', escapeHtml(getCategoryLabel(coupon.category)), ' · ', escapeHtml(coupon.eyebrow), '</p>',
              '<h3>', escapeHtml(coupon.title), '</h3>',
              '<p class="detail-owner">', coupon.ownerType === 'VIN' ? icons.car : icons.account,
                '<span>', escapeHtml(ownerText(coupon)), '</span></p>',
            '</div>',
            '<div class="detail-grid">',
              '<div class="detail-cell"><span>有效期</span><strong>', escapeHtml(coupon.expiryText), '</strong></div>',
              '<div class="detail-cell"><span>使用渠道</span><strong>', escapeHtml(coupon.channel), '</strong></div>',
              '<div class="detail-cell"><span>券来源</span><strong>', escapeHtml(coupon.source), '</strong></div>',
              '<div class="detail-cell"><span>当前状态</span><strong>', escapeHtml(coupon.statusReason || getStatusLabel(coupon.status)), '</strong></div>',
              buildConditionalDetails(coupon),
            '</div>',
            '<div class="rule-block"><h4>使用规则</h4><ul class="rule-list">',
              coupon.rules.map(function (rule) { return '<li>' + escapeHtml(rule) + '</li>'; }).join(''),
            '</ul></div>',
            '<button class="sheet-primary', coupon.status === 'USED' || coupon.status === 'EXPIRED' ? ' neutral' : '', '" type="button" data-action="detail-primary" data-coupon="', escapeHtml(coupon.id), '">',
              escapeHtml(detailPrimaryLabel(coupon)),
            '</button>',
          '</div>',
        '</section>',
      '</div>'
    ].join('');
    bindModalEvents();
    focusModal();
  }

  function openCode(couponId, codeKind) {
    var coupon = getCoupon(couponId);
    if (!coupon) return;
    var vehicle = coupon.vehicleId ? getVehicle(coupon.vehicleId) : null;
    var isExchange = codeKind === 'exchange' || coupon.actionType === 'EXCHANGE_CODE';
    state.selectedCouponId = coupon.id;
    if (!isExchange) {
      modalRoot.innerHTML = [
        '<div class="mobile-page-overlay">',
          '<section class="mobile-subpage verify-code-page" role="dialog" aria-modal="true" aria-labelledby="code-title" data-testid="code-sheet" data-code-kind="redemption">',
            '<header class="mobile-page-nav">',
              '<button class="mobile-back" type="button" aria-label="返回卡包" data-action="close-modal">‹</button>',
              '<h2 id="code-title">核销码</h2>',
              '<span class="nav-placeholder"></span>',
            '</header>',
            '<div class="mobile-page-body">',
              '<article class="code-coupon-summary">',
                '<div class="code-summary-value"><strong>', escapeHtml(coupon.value), '</strong><span>', escapeHtml(coupon.unit), '</span><small>', escapeHtml(coupon.valueCaption), '</small></div>',
                '<div class="code-summary-main">',
                  '<div><span class="code-summary-type">', escapeHtml(coupon.couponType), '</span>', coupon.tag ? '<span class="code-summary-tag">' + escapeHtml(coupon.tag) + '</span>' : '', '</div>',
                  '<h3>', escapeHtml(coupon.title), '</h3>',
                  '<p>', escapeHtml(coupon.expiryText), '</p>',
                  '<p>', escapeHtml(vehicle ? vehicle.model + ' · ' + vehicle.vinMasked : data.profile.phoneMasked), '</p>',
                '</div>',
              '</article>',
              '<section class="verify-panel">',
                '<p class="verify-kicker">请向商家出示以下核销码</p>',
                '<div class="barcode" aria-label="条形核销码"></div>',
                '<p class="code-value">', escapeHtml(coupon.redeemCode || 'DEMO-2026'), '</p>',
                '<div class="verify-divider"><span>或使用二维码核销</span></div>',
                '<div class="qr-code" aria-label="二维码核销码"><i></i><b></b><em></em></div>',
                '<p class="code-vin">核销车辆：', escapeHtml(vehicle.model), ' · ', escapeHtml(vehicle.vinMasked), '</p>',
              '</section>',
              '<div class="verify-notice">',
                '<strong>使用说明</strong>',
                '<p>本页面对应同一个 VIN 券实例，车辆有效关联人均可出示；核销成功后其他关联人同步看到已使用状态。</p>',
                '<p>多人同时操作时，仅首个有效核销请求成功。</p>',
              '</div>',
            '</div>',
          '</section>',
        '</div>'
      ].join('');
      bindModalEvents();
      focusModal();
      return;
    }
    modalRoot.innerHTML = [
      '<div class="sheet-overlay" data-action="overlay-close">',
        '<section class="bottom-sheet code-sheet" role="dialog" aria-modal="true" aria-labelledby="code-title" data-testid="code-sheet" data-code-kind="exchange">',
          '<div class="sheet-handle"></div>',
          '<div class="sheet-header">',
            '<h2 id="code-title">查看兑换码</h2>',
            '<button class="sheet-close" type="button" aria-label="关闭" data-action="close-modal">×</button>',
          '</div>',
          '<div class="sheet-body">',
            '<p class="code-kicker">请复制后前往合作平台兑换</p>',
            '<h3 class="code-title">', escapeHtml(coupon.title), '</h3>',
            '<div class="barcode" aria-hidden="true"></div>',
            '<p class="code-value">', escapeHtml(coupon.redeemCode || 'DEMO-2026'), '</p>',
            coupon.cardNo ? '<p class="code-cardno">' + escapeHtml(coupon.cardNo) + '</p>' : '',
            vehicle
              ? '<p class="code-vin">核销车辆：' + escapeHtml(vehicle.model) + ' · ' + escapeHtml(vehicle.vinMasked) + '</p>'
              : '<p class="code-vin">归属账号：' + escapeHtml(data.profile.phoneMasked) + '</p>',
            '<p class="code-tip">',
              '兑换结果以合作平台为准，兑换成功后卡券状态将同步更新。',
            '</p>',
            '<button class="code-copy" type="button" data-action="copy-code" data-code="', escapeHtml(coupon.redeemCode || ''), '">复制兑换码</button>',
          '</div>',
        '</section>',
      '</div>'
    ].join('');
    bindModalEvents();
    focusModal();
  }

  function exchangeQuantity(productId) {
    return state.exchangeQuantities[productId] || 0;
  }

  function exchangeTotal() {
    return Object.keys(state.exchangeQuantities).reduce(function (sum, productId) {
      return sum + exchangeQuantity(productId);
    }, 0);
  }

  function selectedExchangeProducts() {
    return data.exchangeProducts.filter(function (product) {
      return exchangeQuantity(product.id) > 0;
    });
  }

  function renderExchangeProduct(product, selectable) {
    var quantity = exchangeQuantity(product.id);
    return [
      '<article class="exchange-product">',
        '<span class="exchange-product-icon">', escapeHtml(product.icon), '</span>',
        '<div class="exchange-product-info">',
          '<h4>', escapeHtml(product.name), quantity && !selectable ? ' × ' + quantity : '', '</h4>',
          '<p>', escapeHtml(product.category), ' · ', escapeHtml(product.fulfillment), '</p>',
          selectable ? '<small>库存 ' + escapeHtml(product.stock) + '</small>' : '',
        '</div>',
        selectable
          ? '<div class="exchange-qty"><button type="button" data-exchange-dec="' + escapeHtml(product.id) + '"' + (quantity === 0 ? ' disabled' : '') + '>−</button><span>' + quantity + '</span><button type="button" data-exchange-inc="' + escapeHtml(product.id) + '"' + (exchangeTotal() >= 2 ? ' disabled' : '') + '>＋</button></div>'
          : '',
      '</article>'
    ].join('');
  }

  function exchangeDetailHtml(coupon) {
    var vehicle = getVehicle(coupon.vehicleId);
    return [
      '<div class="exchange-hero">',
        '<span>通用兑换券 · 新商城</span>',
        '<h3>', escapeHtml(coupon.title), '</h3>',
        '<p>', escapeHtml(coupon.expiryText), '</p>',
      '</div>',
      '<section class="exchange-card choice-rule-card">',
        '<div class="choice-rule"><strong>5选2</strong><span>5种候选商品中任选2件</span></div>',
        '<p>支持选择不同商品，也可将同一商品数量选为2。</p>',
      '</section>',
      '<section class="exchange-card">',
        '<h3>绑定车辆</h3>',
        '<strong>', escapeHtml(vehicle.model), '</strong>',
        '<p>', escapeHtml(vehicle.vinMasked), '</p>',
        '<small>券实例已绑定该 VIN，兑换时无需选车。</small>',
      '</section>',
      '<section class="exchange-card">',
        '<h3>候选商品（5种）</h3>',
        data.exchangeProducts.slice(0, 3).map(function (product) {
          return renderExchangeProduct(product, false);
        }).join(''),
        '<p class="exchange-more">还有2种商品，进入选品页查看</p>',
      '</section>',
      '<section class="exchange-card">',
        '<h3>使用说明</h3>',
        '<p>确认兑换后卡券立即核销；履约、发货或到店核销进度在兑换单中独立更新。</p>',
      '</section>',
      '<button class="exchange-primary" type="button" data-exchange-next="select">去选商品</button>'
    ].join('');
  }

  function exchangeSelectHtml() {
    return [
      '<div class="exchange-selection-tip"><strong>5选2</strong><span>已选 <b>', exchangeTotal(), '</b> / 2 件</span></div>',
      '<p class="exchange-helper">可跨履约方式选择2件商品，也可将同一商品数量选为2。</p>',
      '<div class="exchange-product-list">',
        data.exchangeProducts.map(function (product) {
          return renderExchangeProduct(product, true);
        }).join(''),
      '</div>',
      '<button class="exchange-primary" type="button" data-exchange-next="confirm"', exchangeTotal() === 2 ? '' : ' disabled', '>选好了，确认兑换</button>'
    ].join('');
  }

  function exchangeFulfillmentHtml(coupon) {
    var selected = selectedExchangeProducts();
    var vehicle = getVehicle(coupon.vehicleId);
    var types = selected.map(function (product) { return product.fulfillmentType; });
    var html = '';
    if (types.indexOf('telematics') > -1) {
      html += '<section class="exchange-card"><h3>车联网履约车辆</h3><strong>' + escapeHtml(vehicle.model) + '</strong><p>' + escapeHtml(vehicle.vinMasked) + '</p><small>车辆由券实例自动带入，不可修改。</small></section>';
    }
    if (types.indexOf('direct_ship') > -1) {
      html += '<section class="exchange-card"><h3>直邮收货信息</h3><strong>陈先生 · 138****6218</strong><p>广东省深圳市南山区深南大道 1001 号</p><small>默认地址只读展示。</small></section>';
    }
    if (types.indexOf('store_verify') > -1) {
      html += '<section class="exchange-card"><h3>到店核销说明</h3><strong>适用专营店到店核销</strong><p>兑换后生成待核销权益，可在兑换单中查看。</p></section>';
    }
    return html;
  }

  function exchangeConfirmHtml(coupon) {
    return [
      '<section class="exchange-card">',
        '<h3>兑换内容（共2件）</h3>',
        selectedExchangeProducts().map(function (product) {
          return renderExchangeProduct(product, false);
        }).join(''),
      '</section>',
      exchangeFulfillmentHtml(coupon),
      '<section class="exchange-card exchange-total-card">',
        '<p><span>使用兑换券</span><strong>1张</strong></p>',
        '<p><span>应付金额</span><strong class="zero-price">¥0.00</strong></p>',
      '</section>',
      '<div class="exchange-warning"><strong>确认兑换后卡券立即核销</strong><p>履约、发货或到店核销状态不影响券状态；本原型不演示撤销、退款或恢复。</p></div>',
      '<button class="exchange-primary" type="button" data-exchange-next="success">确认兑换</button>'
    ].join('');
  }

  function exchangeSuccessHtml() {
    return [
      '<div class="exchange-success-icon">✓</div>',
      '<h3 class="exchange-success-title">兑换成功</h3>',
      '<p class="exchange-success-subtitle">兑换单已创建，本张兑换券已核销</p>',
      '<section class="exchange-card exchange-result-card">',
        '<p><span>兑换单号</span><strong>RD202607241436</strong></p>',
        '<p><span>兑换商品</span><strong>', selectedExchangeProducts().length, '种 / ', exchangeTotal(), '件</strong></p>',
        '<p><span>履约 / 发货</span><em>处理中</em></p>',
        '<p><span>卡券状态</span><i>已核销</i></p>',
      '</section>',
      '<div class="exchange-notice">后续状态按商品履约方式分别更新，可随时查询本兑换单。</div>',
      '<button class="exchange-primary" type="button" data-exchange-fulfillment>查看履约 / 发货进度</button>',
      '<button class="exchange-secondary" type="button" data-exchange-finish>完成</button>'
    ].join('');
  }

  function renderExchangeFlow() {
    var coupon = getCoupon(state.selectedCouponId);
    if (!coupon) return;
    var titles = {
      detail: '兑换券详情',
      select: '选择兑换商品',
      confirm: '确认兑换',
      success: '兑换结果'
    };
    var content = state.exchangeStep === 'detail'
      ? exchangeDetailHtml(coupon)
      : state.exchangeStep === 'select'
        ? exchangeSelectHtml()
        : state.exchangeStep === 'confirm'
          ? exchangeConfirmHtml(coupon)
          : exchangeSuccessHtml();
    modalRoot.innerHTML = [
      '<div class="mobile-page-overlay">',
        '<section class="mobile-subpage exchange-page" role="dialog" aria-modal="true" aria-labelledby="exchange-title" data-testid="exchange-flow" data-exchange-step="', escapeHtml(state.exchangeStep), '">',
          '<header class="mobile-page-nav">',
            '<button class="mobile-back" type="button" aria-label="返回" data-exchange-back>‹</button>',
            '<h2 id="exchange-title">', escapeHtml(titles[state.exchangeStep]), '</h2>',
            '<button class="mobile-page-close" type="button" aria-label="关闭兑换流程" data-action="close-modal">×</button>',
          '</header>',
          '<div class="exchange-steps">',
            ['detail', 'select', 'confirm', 'success'].map(function (step, index) {
              return '<span class="' + (step === state.exchangeStep ? 'active' : '') + '">' + (index + 1) + '</span>';
            }).join(''),
          '</div>',
          '<div class="mobile-page-body exchange-body">', content, '</div>',
        '</section>',
      '</div>'
    ].join('');
    bindModalEvents();
    bindExchangeEvents();
    focusModal();
  }

  function openExchangeFlow(couponId) {
    var coupon = getCoupon(couponId);
    if (!coupon) return;
    state.selectedCouponId = coupon.id;
    state.exchangeStep = 'detail';
    state.exchangeQuantities = {};
    renderExchangeFlow();
  }

  function bindExchangeEvents() {
    modalRoot.querySelectorAll('[data-exchange-inc]').forEach(function (button) {
      button.addEventListener('click', function () {
        if (exchangeTotal() >= 2) return;
        var productId = button.getAttribute('data-exchange-inc');
        state.exchangeQuantities[productId] = exchangeQuantity(productId) + 1;
        renderExchangeFlow();
      });
    });
    modalRoot.querySelectorAll('[data-exchange-dec]').forEach(function (button) {
      button.addEventListener('click', function () {
        var productId = button.getAttribute('data-exchange-dec');
        state.exchangeQuantities[productId] = Math.max(0, exchangeQuantity(productId) - 1);
        renderExchangeFlow();
      });
    });
    var next = modalRoot.querySelector('[data-exchange-next]');
    if (next) {
      next.addEventListener('click', function () {
        var target = next.getAttribute('data-exchange-next');
        if ((target === 'confirm' || target === 'success') && exchangeTotal() !== 2) {
          showToast('请先选择2件商品');
          return;
        }
        state.exchangeStep = target;
        renderExchangeFlow();
      });
    }
    var back = modalRoot.querySelector('[data-exchange-back]');
    if (back) {
      back.addEventListener('click', function () {
        var previous = { select: 'detail', confirm: 'select', success: 'confirm' };
        if (state.exchangeStep === 'detail') {
          closeModal();
          return;
        }
        state.exchangeStep = previous[state.exchangeStep] || 'detail';
        renderExchangeFlow();
      });
    }
    var fulfillment = modalRoot.querySelector('[data-exchange-fulfillment]');
    if (fulfillment) {
      fulfillment.addEventListener('click', function () {
        showToast('履约/发货进度：处理中（原型演示）');
      });
    }
    var finish = modalRoot.querySelector('[data-exchange-finish]');
    if (finish) {
      finish.addEventListener('click', function () {
        var coupon = getCoupon(state.selectedCouponId);
        coupon.status = 'USED';
        coupon.statusReason = '已核销';
        coupon.expiryText = '兑换时间 2026.07.24 14:36';
        coupon.valueCaption = '卡券已核销';
        coupon.action = '查看详情';
        coupon.actionType = 'DETAIL';
        closeModal();
        render();
        showToast('兑换完成，可在已使用中查看');
      });
    }
  }

  function openStatusHelp() {
    modalRoot.innerHTML = [
      '<div class="sheet-overlay">',
        '<section class="bottom-sheet" role="dialog" aria-modal="true" aria-labelledby="status-help-title" data-testid="status-help-sheet">',
          '<div class="sheet-handle"></div>',
          '<div class="sheet-header"><h2 id="status-help-title">卡券状态说明</h2><button class="sheet-close" type="button" aria-label="关闭" data-action="close-modal">×</button></div>',
          '<div class="sheet-body"><div class="status-help-list">',
            '<div><strong>可使用</strong><p>已领取且在有效期内，可直接使用、预约或出示核销/兑换码。</p></div>',
            '<div><strong>待激活</strong><p>后台“未领取”映射到前台的状态，用户激活后才可使用。</p></div>',
            '<div><strong>已使用</strong><p>已完成核销或兑换，仅保留详情和使用记录。</p></div>',
            '<div><strong>已过期</strong><p>包括正常过期和激活超时，均不可继续使用。</p></div>',
          '</div><button class="sheet-primary neutral" type="button" data-action="close-modal">知道了</button></div>',
        '</section>',
      '</div>'
    ].join('');
    bindModalEvents();
    focusModal();
  }

  function bindModalEvents() {
    var overlay = modalRoot.querySelector('.sheet-overlay');
    if (overlay) {
      overlay.addEventListener('click', function (event) {
        if (event.target === overlay) closeModal();
      });
    }
    modalRoot.querySelectorAll('[data-action="close-modal"]').forEach(function (close) {
      close.addEventListener('click', closeModal);
    });
    var primary = modalRoot.querySelector('[data-action="detail-primary"]');
    if (primary) {
      primary.addEventListener('click', function () {
        var coupon = getCoupon(primary.getAttribute('data-coupon'));
        if (!coupon || coupon.status === 'USED' || coupon.status === 'EXPIRED' || coupon.actionType === 'DETAIL') {
          closeModal();
          return;
        }
        closeModal();
        handleCouponAction(coupon.id);
      });
    }
    var copy = modalRoot.querySelector('[data-action="copy-code"]');
    if (copy) {
      copy.addEventListener('click', function () {
        var code = copy.getAttribute('data-code');
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(code).catch(function () {});
        }
        showToast('兑换码已复制');
      });
    }
  }

  function focusModal() {
    var close = modalRoot.querySelector('.sheet-close, .mobile-back, .mobile-page-close');
    if (close) close.focus();
  }

  function closeModal() {
    modalRoot.innerHTML = '';
    state.selectedCouponId = null;
  }

  function activateCoupon(coupon) {
    coupon.status = 'AVAILABLE';
    coupon.tag = '已激活';
    coupon.action = coupon.afterActivateAction || '去使用';
    coupon.actionType = coupon.afterActivateActionType || 'USE';
    coupon.expiryText = '有效期至 ' + String(coupon.expiresAt).replace(/-/g, '.');
    showToast('激活成功，现在可以使用该券');
    render();
  }

  function handleCouponAction(couponId) {
    var coupon = getCoupon(couponId);
    if (!coupon) return;
    if (coupon.status === 'PENDING_ACTIVATION' && coupon.actionType === 'ACTIVATE') {
      activateCoupon(coupon);
      return;
    }
    if (coupon.status !== 'AVAILABLE') {
      openDetail(coupon.id);
      return;
    }
    if (coupon.actionType === 'CODE') {
      openCode(coupon.id, 'redemption');
      return;
    }
    if (coupon.actionType === 'EXCHANGE_CODE') {
      openCode(coupon.id, 'exchange');
      return;
    }
    if (coupon.actionType === 'EXCHANGE_FLOW') {
      openExchangeFlow(coupon.id);
      return;
    }
    if (coupon.actionType === 'DETAIL') {
      openDetail(coupon.id);
      return;
    }
    showToast('将前往「' + coupon.channel + '」使用该券（原型演示）');
  }

  function showToast(message) {
    if (toastTimer) window.clearTimeout(toastTimer);
    toastRoot.innerHTML = '<div class="toast">' + escapeHtml(message) + '</div>';
    toastTimer = window.setTimeout(function () {
      toastRoot.innerHTML = '';
    }, 2200);
  }

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && modalRoot.innerHTML) closeModal();
  });

  window.CouponWalletPrototype = {
    getState: function () {
      return {
        category: state.category,
        status: state.status,
        selectedCouponId: state.selectedCouponId,
        exchangeStep: state.exchangeStep,
        exchangeTotal: exchangeTotal(),
        visibleCouponIds: couponsForCurrentView().map(function (coupon) { return coupon.id; })
      };
    },
    setCategory: function (categoryId) {
      if (!data.categories.some(function (category) { return category.id === categoryId; })) return;
      state.category = categoryId;
      render();
    },
    setStatus: function (statusId) {
      if (!data.statuses.some(function (status) { return status.id === statusId; })) return;
      state.status = statusId;
      render();
    }
  };

  render();
})();
