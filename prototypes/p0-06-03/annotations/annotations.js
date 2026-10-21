(function () {
  'use strict';

  window.P0PosterRuleAnnotations = {
    title: '分享海报默认规则配置',
    sections: {
      functionName: '后台海报规则配置',
      functionDesc: '维护员工端生成分享海报时读取的默认背景、标题、副标题和二维码引导语。',
      permissionScope: '本次不迁移权限体系；正式权限点待确认。',
      dataSource: '活动中心分享海报规则配置 Mock。',
      valueLogic: '原型只演示一套当前已生效配置；员工端读取后仍复用既有流程。',
      fieldDesc: '背景模式、背景名称、建议比例、默认三段文案、配置状态。',
      interactionDesc: '支持系统模板、上传背景图、刷新预览、恢复当前配置和保存反馈。',
      judgeRule: '本次不改活动角色、员工分享权限、门店过滤、员工端页面或报表角色维度。',
      exceptionRule: '格式、像素尺寸、大小、配置粒度、模板数量与发布机制待确认。',
      otherDesc: '员工端只读取当前生效配置并复用既有编辑、预览、分享和保存流程。'
    }
  };
})();
