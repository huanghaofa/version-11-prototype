(function () {
  'use strict';

  window.showToast = function (message, tone) {
    var old = document.getElementById('prototypeToast');
    if (old) old.remove();
    var toast = document.createElement('div');
    toast.id = 'prototypeToast';
    toast.className = 'toast ' + (tone || 'success');
    toast.setAttribute('role', 'status');
    toast.textContent = message;
    document.body.appendChild(toast);
    window.setTimeout(function () { toast.classList.add('show'); }, 20);
    window.setTimeout(function () {
      toast.classList.remove('show');
      window.setTimeout(function () { toast.remove(); }, 220);
    }, 2200);
  };
})();
