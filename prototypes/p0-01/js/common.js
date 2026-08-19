(function () {
  'use strict';

  window.escapeHtml = function (value) {
    return String(value == null ? '' : value).replace(/[&<>'"]/g, function (c) {
      return ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'})[c];
    });
  };

  window.showToast = function (message) {
    var old = document.querySelector('.toast');
    if (old) old.remove();
    var el = document.createElement('div');
    el.className = 'toast';
    el.textContent = message;
    document.body.appendChild(el);
    setTimeout(function () { el.classList.add('show'); }, 10);
    setTimeout(function () { el.remove(); }, 2200);
  };

  window.openModal = function (html) {
    var host = document.createElement('div');
    host.className = 'modal-overlay';
    host.innerHTML = html;
    document.body.appendChild(host);
    host.addEventListener('click', function (e) {
      if (e.target === host || e.target.closest('[data-close-modal]')) host.remove();
    });
    return host;
  };
})();
