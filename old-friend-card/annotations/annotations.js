(function () {
  'use strict';

  var labels = [
    ['functionName', '功能名称'],
    ['functionDesc', '功能说明'],
    ['permissionScope', '权限范围'],
    ['dataSource', '数据来源'],
    ['valueLogic', '取值逻辑'],
    ['fieldDesc', '字段说明'],
    ['interactionDesc', '交互说明'],
    ['judgeRule', '判断规则'],
    ['exceptionRule', '异常规则'],
    ['otherDesc', '其他说明']
  ];

  function escapeHTML(value) {
    return String(value || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function annotation(item) {
    item.desc = labels.map(function (field, index) {
      return (index + 1) + '. ' + field[1] + '：' + escapeHTML(item.sections[field[0]] || '待确认');
    }).join('<br>');
    return item;
  }

  window.AnnotationData = {
    'coupon-config': [
      annotation({
        id: '1', page: 'coupon-config', target: '[data-anno="coupon-product-type-old-friend"]',
        position: { placement: 'top-right', offsetX: -4, offsetY: 6 }, title: '老友卡适用范围类型',
        sections: {
          functionName: '老友卡适用范围类型',
          functionDesc: '在售后维保券既有适用范围中增加老友卡商品关联入口。',
          permissionScope: '卡券中心建券运营角色；正式权限待确认。',
          dataSource: '卡券中心适用范围配置与老友卡商品查询接口。',
          valueLogic: '点击老友卡后直接打开查询弹窗，确认后显示已关联商品。',
          fieldDesc: '页面显示老友卡；正式枚举码待确认。',
          interactionDesc: '点击老友卡即进入查询多选弹窗，再次点击可调整。',
          judgeRule: '至少关联一项接口返回商品后，才可提交老友卡类型。',
          exceptionRule: '最大数量、跨页保留与正式保存结构待确认。',
          otherDesc: '备件、工时、精品、套餐保持既有逻辑。'
        }
      }),
      annotation({
        id: '2', page: 'coupon-config', target: '[data-anno="coupon-old-friend-query"]',
        position: { placement: 'top-left', offsetX: 4, offsetY: 0 }, title: '查询并多选老友卡商品',
        sections: {
          functionName: '查询老友卡商品',
          functionDesc: '通过对方查询能力取得老友卡商品，并支持选择多项作为券适用范围。',
          permissionScope: '卡券中心建券运营角色；接口调用权限待确认。',
          dataSource: '接口文档 DNDC_NORMAL_S_SE_S070；页面为字段映射演示数据。',
          valueLogic: '按 carProductCode 形成保存集合，isEnable 仅展示。',
          fieldDesc: '查询条件为产品编码、产品名称，并包含分页参数。',
          interactionDesc: '支持查询、重置、复选多项、取消和统一确认。',
          judgeRule: '凡接口返回的商品均可选择，不因启停状态禁选。',
          exceptionRule: '接口地址、鉴权、分页响应和错误码待联调确认。',
          otherDesc: '接口文档不等于接口已经部署或联调完成。'
        }
      }),
      annotation({
        id: '3', page: 'coupon-config', target: '[data-anno="coupon-submit"]',
        position: { placement: 'bottom-left', offsetX: 0, offsetY: 4 }, title: '保存商品 code 集合',
        sections: {
          functionName: '保存卡券配置',
          functionDesc: '保存售后维保券与多项老友卡商品的适用范围关系。',
          permissionScope: '卡券中心建券运营角色；正式审批流程待确认。',
          dataSource: '当前页面配置和已关联老友卡商品。',
          valueLogic: '老友卡类型未选商品时阻止提交，已选时保存商品 code 集合。',
          fieldDesc: '演示保存 carProductCode 数组；正式报文结构待确认。',
          interactionDesc: '点击提交后显示校验结果或浏览器内保存反馈。',
          judgeRule: '空关联不能通过老友卡类型的提交路径。',
          exceptionRule: '接口失败能否保存、审批、回滚和版本处理待确认。',
          otherDesc: '页面反馈不代表真实数据库持久化成功。'
        }
      })
    ]
  };
})();
