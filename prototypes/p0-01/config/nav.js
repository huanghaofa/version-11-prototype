window.PrototypeNavConfig = {
  menu: [
    {key:'overview',label:'原型说明',icon:'◈'},
    {key:'admin',label:'卡券中心后台',icon:'▦',children:[
      {key:'admin-list',label:'卡券列表'},
      {key:'admin-create',label:'新建兑换券'},
      {key:'admin-fulfillment',label:'兑换券履约'}
    ]},
    {key:'mobile',label:'前台原型（App / 小程序）',icon:'▣',children:[
      {key:'mobile-home',label:'卡券中心'},
      {key:'mobile-flow',label:'单一履约兑换流程'},
      {key:'mobile-mall-order',label:'商城确认订单（模拟）'},
      {key:'mobile-store-code',label:'到店核销码'},
      {key:'mobile-current-record',label:'当前兑换详情'},
      {key:'mobile-record',label:'已核销卡券详情'},
      {key:'mobile-fulfillment',label:'履约 / 发货状态'}
    ]},
    {key:'interfaces',label:'系统接口与边界',icon:'⇄'}
  ]
};
