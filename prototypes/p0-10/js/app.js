(function () {
  'use strict';

  window.Pages = window.Pages || {};
  window.AppState = {
    thresholdAmount: 500,
    amountBasis: '订单实付金额',
    triggerPoint: '支付成功后',
    frequency: '每订单一次',
    eventConfigured: true,
    selectedEvent: true
  };
})();
