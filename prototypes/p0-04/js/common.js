(function () {
  'use strict';

  window.showToast = function (message) {
    var root = document.getElementById('toast-root');
    if (!root) return;
    var toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    root.appendChild(toast);
    window.setTimeout(function () { toast.remove(); }, 2200);
  };
})();
