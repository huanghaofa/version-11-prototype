(function () {
  'use strict';

  function escapeHtml(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (char) {
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char];
    });
  }

  function showToast(message) {
    var toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(function () { toast.classList.remove('show'); }, 1800);
  }

  function openSheet(content, options) {
    var root = document.getElementById('sheetRoot');
    if (!root) return;
    var extraClass = options && options.className ? ' ' + options.className : '';
    root.innerHTML = '<div class="sheet-mask" data-close-sheet></div><section class="bottom-sheet' + extraClass + '" role="dialog" aria-modal="true">' + content + '</section>';
    requestAnimationFrame(function () { root.classList.add('open'); });
  }

  function closeSheet() {
    var root = document.getElementById('sheetRoot');
    if (!root) return;
    root.classList.remove('open');
    setTimeout(function () { root.innerHTML = ''; }, 180);
  }

  document.addEventListener('click', function (event) {
    if (event.target.closest('[data-close-sheet]')) closeSheet();
  });

  window.SAFrontCommon = {escapeHtml:escapeHtml, showToast:showToast, openSheet:openSheet, closeSheet:closeSheet};
})();
