(function () {
  'use strict';

  window.SAInlineNavConfig = {
    defaultPage: 'activity-overview',
    menu: [
      {id:'workspace',label:'工作台',passive:true},
      {id:'activity-center',label:'活动中心',children:[
        {id:'activity-manage',label:'保客活动创建',route:'activity-manage'},
        {id:'activity-mutex',label:'保客活动互斥关系',route:'activity-mutex'},
        {id:'sa-placement-manage',label:'SA活动配置',route:'sa-placement-manage'},
        {id:'activity-overview',label:'SA活动报表',route:'activity-overview'}
      ]},
      {id:'coupon-center',label:'卡券中心',children:[
        {id:'coupon-overview',label:'SA卡券报表',route:'coupon-overview'}
      ]}
    ]
  };
})();
