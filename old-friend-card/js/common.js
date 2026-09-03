(function () {
  'use strict';

  window.escapeHTML = function (value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  };

  window.formatCurrency = function (value) {
    return '¥' + Number(value || 0).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  window.showToast = function (message) {
    var old = document.querySelector('.toast');
    if (old) old.remove();
    var toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    toast.textContent = message;
    document.body.appendChild(toast);
    window.setTimeout(function () { toast.remove(); }, 2200);
  };

  window.getOldFriendCardsByIds = function (ids) {
    var cards = window.MockData.oldFriendCards || [];
    var seen = Object.create(null);
    return (Array.isArray(ids) ? ids : []).reduce(function (matched, id) {
      if (seen[id]) return matched;
      var card = cards.find(function (item) { return item.carProductId === id; });
      if (card) {
        seen[id] = true;
        matched.push(card);
      }
      return matched;
    }, []);
  };
})();
