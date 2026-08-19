(function () {
  'use strict';

  var data = window.MockData;
  var editableActivity = data.activities.find(function (activity) { return activity.isEditableDemo; });

  window.Pages = window.Pages || {};
  window.AppState = {
    formMode: 'create',
    selectedSAId: data.sas[0].id,
    diagnosticMode: false,
    drafts: {
      create: {
        name: '夏日安心出行维保礼',
        type: '维保活动',
        status: '草稿',
        storeScope: { mode: 'ALL', storeIds: [] }
      },
      edit: {
        name: editableActivity.name,
        type: editableActivity.type,
        status: editableActivity.status,
        storeScope: window.cloneScope(editableActivity.storeScope)
      }
    },
    getDraft: function () {
      return this.drafts[this.formMode];
    },
    publishDraftToPreview: function () {
      var draft = this.getDraft();
      editableActivity.name = draft.name || editableActivity.name;
      editableActivity.type = draft.type;
      editableActivity.storeScope = window.cloneScope(draft.storeScope);
    }
  };
})();
