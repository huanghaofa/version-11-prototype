(function () {
  'use strict';

  window.escapeHtml = function (value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  window.showToast = function (message, type) {
    var root = document.getElementById('toast-root');
    if (!root) return;
    var item = document.createElement('div');
    item.className = 'toast toast--' + (type || 'info');
    item.textContent = message;
    root.appendChild(item);
    window.setTimeout(function () {
      item.classList.add('is-leaving');
      window.setTimeout(function () { item.remove(); }, 220);
    }, 2100);
  };

  window.getStoreById = function (id) {
    return window.MockData.stores.find(function (store) { return store.id === id; });
  };

  window.cloneScope = function (scope) {
    return { mode: scope.mode, storeIds: scope.storeIds.slice() };
  };
})();
