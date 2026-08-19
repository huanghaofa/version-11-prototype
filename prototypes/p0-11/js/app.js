(function () {
  'use strict';

  window.Pages = window.Pages || {};

  var initial = window.MockData && window.MockData.initialRule;
  window.PrototypeState = {
    rule: {
      mode: initial ? (initial.mode || 'partialBoth') : 'none',
      stackScope: initial ? initial.stackScope : 'none',
      mutexScope: initial ? initial.mutexScope : 'none',
      stackCouponIds: initial ? initial.stackCouponIds.slice() : [],
      mutexCouponIds: initial ? initial.mutexCouponIds.slice() : []
    },
    savedAt: ''
  };

  window.getCouponById = function (couponId) {
    var items = (window.MockData && window.MockData.candidateCoupons) || [];
    return items.find(function (item) { return item.id === couponId; });
  };

  window.getCouponsByIds = function (couponIds) {
    return (couponIds || []).map(window.getCouponById).filter(Boolean);
  };

  window.getRuleLabel = function (scope, kind) {
    if (scope === 'all') return kind === 'stack' ? '与全部券叠加' : '与全部券互斥';
    if (scope === 'specified') return kind === 'stack' ? '部分叠加' : '部分互斥';
    return '未配置';
  };

  window.getRuleModeLabel = function (mode) {
    return {
      allStack: '与全部券叠加',
      allMutex: '与全部券互斥',
      partialStack: '部分叠加',
      partialMutex: '部分互斥',
      partialBoth: '部分叠加互斥',
      none: '不配置'
    }[mode] || '不配置';
  };
})();
