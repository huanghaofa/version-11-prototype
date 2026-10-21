(function () {
  'use strict';

  var sourceData = window.P0PosterRuleData;
  var annotation = window.P0PosterRuleAnnotations;
  var systemBackgroundName = '东风日产车主礼遇蓝色模板';
  var saved = clone(sourceData.saPosterSettings);
  var draft = clone(saved);
  var toastTimer = 0;

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function byId(id) {
    return document.getElementById(id);
  }

  function showToast(message) {
    var toast = byId('toast');
    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add('show');
    toastTimer = window.setTimeout(function () { toast.classList.remove('show'); }, 2600);
  }

  function syncDraftFromFields() {
    Array.prototype.slice.call(document.querySelectorAll('[data-poster-rule-field]')).forEach(function (node) {
      draft[node.getAttribute('data-poster-rule-field')] = node.value;
    });
  }

  function setFieldValues() {
    byId('defaultTitle').value = draft.defaultTitle;
    byId('defaultSubtitle').value = draft.defaultSubtitle;
    byId('defaultGuide').value = draft.defaultGuide;
  }

  function renderBackground() {
    var preview = byId('posterPreview');
    if (draft.previewUrl) {
      preview.style.backgroundImage = 'url("' + draft.previewUrl.replace(/"/g, '') + '")';
    } else {
      preview.style.backgroundImage = 'linear-gradient(155deg,#0b4578 0%,#2188c7 54%,#78c7e8 100%)';
    }
    byId('currentBackgroundName').textContent = draft.uploadName || draft.backgroundName;
    byId('backgroundRatio').textContent = draft.backgroundRatio;
    byId('backgroundModeBadge').textContent = draft.previewUrl ? '自定义背景' : '系统模板';
  }

  function renderPreview() {
    byId('previewTitle').textContent = draft.defaultTitle || '请输入默认标题';
    byId('previewSubtitle').textContent = draft.defaultSubtitle || '请输入默认副标题';
    byId('previewGuide').textContent = draft.defaultGuide || '请输入二维码引导语';
    byId('previewIdentity').textContent = draft.sampleStoreName + ' · ' + draft.sampleEmployeeName;
    renderBackground();
  }

  function renderMeta() {
    byId('configBadge').textContent = draft.configStatus + ' · ' + draft.configId;
    byId('currentConfig').textContent = draft.configId + ' · ' + draft.configStatus;
    byId('lastUpdated').textContent = draft.updated + ' · ' + draft.operator;
  }

  function renderAll() {
    setFieldValues();
    renderPreview();
    renderMeta();
  }

  function useSystemTemplate() {
    draft.previewUrl = '';
    draft.uploadName = '';
    draft.backgroundMode = 'SYSTEM';
    draft.backgroundName = systemBackgroundName;
    renderBackground();
    showToast('已切换为系统默认模板');
  }

  function uploadBackground(event) {
    var file = event.target.files && event.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.addEventListener('load', function () {
      draft.previewUrl = reader.result;
      draft.uploadName = file.name;
      draft.backgroundMode = 'CUSTOM';
      draft.backgroundName = file.name;
      renderBackground();
      showToast('背景图已载入预览；正式格式、尺寸和大小限制待确认');
    });
    reader.addEventListener('error', function () {
      showToast('背景图读取失败，请重新选择本地图片');
    });
    reader.readAsDataURL(file);
  }

  function refreshPreview() {
    syncDraftFromFields();
    renderPreview();
    showToast('海报预览已按当前默认规则刷新');
  }

  function resetPosterRule() {
    draft = clone(saved);
    renderAll();
    showToast('已恢复当前已生效海报规则');
  }

  function savePosterRule() {
    syncDraftFromFields();
    if (!draft.defaultTitle.trim() || !draft.defaultSubtitle.trim() || !draft.defaultGuide.trim()) {
      showToast('默认标题、副标题和二维码引导语均不能为空');
      return;
    }
    ['backgroundMode', 'backgroundName', 'backgroundRatio', 'previewUrl', 'uploadName', 'defaultTitle', 'defaultSubtitle', 'defaultGuide'].forEach(function (key) {
      saved[key] = draft[key];
    });
    saved.updated = '2026-08-27 11:08:00';
    saved.operator = '当前用户';
    draft.updated = saved.updated;
    draft.operator = saved.operator;
    renderPreview();
    renderMeta();
    showToast('海报规则已保存（原型演示），正式发布与生效机制待确认');
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (char) {
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char];
    });
  }

  function openSpecDrawer() {
    var labels = {
      functionName: '功能名称', functionDesc: '功能描述', permissionScope: '权限范围', dataSource: '数据来源',
      valueLogic: '取值逻辑', fieldDesc: '字段说明', interactionDesc: '交互说明', judgeRule: '判断规则',
      exceptionRule: '异常与待确认', otherDesc: '范围边界'
    };
    byId('specDrawerBody').innerHTML = Object.keys(annotation.sections).map(function (key) {
      return '<section><strong>' + escapeHtml(labels[key] || key) + '</strong><p>' + escapeHtml(annotation.sections[key]) + '</p></section>';
    }).join('');
    byId('specDrawer').setAttribute('aria-hidden', 'false');
    byId('specDrawer').classList.add('open');
    byId('drawerMask').hidden = false;
  }

  function closeSpecDrawer() {
    byId('specDrawer').setAttribute('aria-hidden', 'true');
    byId('specDrawer').classList.remove('open');
    byId('drawerMask').hidden = true;
  }

  function resolveExistingP0Links() {
    var packaged = /\/prototypes\/p0-06-03\//.test(window.location.pathname);
    var base = packaged ? '../p0-06-01/index.html' : '../SA动态二维码与来源报表后台原型_20260717/index.html';
    Array.prototype.slice.call(document.querySelectorAll('[data-existing-route]')).forEach(function (link) {
      link.href = base + '#' + link.getAttribute('data-existing-route');
    });
  }

  function bindEvents() {
    byId('useSystemTemplate').addEventListener('click', useSystemTemplate);
    byId('backgroundUpload').addEventListener('change', uploadBackground);
    byId('refreshPreview').addEventListener('click', refreshPreview);
    byId('resetPosterRule').addEventListener('click', resetPosterRule);
    byId('savePosterRule').addEventListener('click', savePosterRule);
    byId('globalSpecButton').addEventListener('click', openSpecDrawer);
    byId('closeSpecDrawer').addEventListener('click', closeSpecDrawer);
    byId('drawerMask').addEventListener('click', closeSpecDrawer);
    byId('menuModeToggle').addEventListener('click', function () {
      var narrow = window.matchMedia('(max-width: 760px)').matches;
      document.body.classList.toggle(narrow ? 'nav-open' : 'sidebar-collapsed');
      this.setAttribute('aria-expanded', document.body.classList.contains('nav-open') ? 'true' : 'false');
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeSpecDrawer();
    });
  }

  if (!window.location.hash) window.history.replaceState(null, '', '#sa-poster-settings');
  resolveExistingP0Links();
  renderAll();
  bindEvents();
})();
