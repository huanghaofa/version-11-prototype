window.AnnotationData = {
  "admin-create": [
    {"id":"a1","selector":"#chooseProducts","title":"商品下钻到SKU/规格","content":"第一层按商品（SPU）分页与筛选，点击选择规格进入SKU列表；勾选和数量上限均按SKU保存。"},
    {"id":"a15","selector":"#selectedProducts","title":"SKU/规格回显","content":"提交后逐行回显商品名、规格名、SKU编码、数量规则和整券履约方式。"},
    {"id":"a13","selector":"#uploadProducts","title":"批量导入商品","content":"上传弹窗展示追加/覆盖、Excel要求、字段规则和模拟校验；不兼容整券履约方式的SKU校验失败。"},
    {"id":"a14","selector":"#downloadProductTemplate","title":"下载导入模板","content":"模板按当前兑换方式生成数量字段，并展示必填规则与示例行；不包含商品级履约方式字段。"}
  ],
  "admin-fulfillment": [
    {"id":"a5","selector":".fulfillment-filter-grid","title":"兑换券履约表单","content":"统一查询不同履约方式生成的履约单，并可查看逐商品状态、物流或到店核销信息。"}
  ],
  "mobile-home": [
    {"id":"a3","selector":".wallet-coupon","title":"三张独立示例券","content":"App与微信小程序共用卡券中心入口；车联网、直邮和到店分别用独立卡片演示，不在同一张券内切换履约。"}
  ],
  "mobile-flow": [
    {"id":"a2","selector":".phone","title":"兑换即核销","content":"兑换单创建成功后立即核销券，不等待车联网履约、直邮发货或到店核销结果。"},
    {"id":"a10","selector":"[data-store-vin]","title":"选店页只读VIN","content":"到店券选择门店时展示券实例绑定车辆、车牌和VIN，不提供选车、换车或编辑入口；切换省市门店不会改变绑定车辆。"}
  ],
  "mobile-mall-order": [
    {"id":"a7","selector":".mall-callback-box","title":"商城成功回跳边界","content":"卡券中心携带商品ID与卡券ID跳转；商城订单提交成功回跳后才创建兑换单并核销券，失败保持可使用。"}
  ],
  "mobile-store-code": [
    {"id":"a8","selector":".verify-code-card","title":"核销码展示前置条件","content":"用户已选省市门店和商品、兑换单创建成功且卡券已核销后才展示；门店履约状态仍为待核销。"}
  ],
  "mobile-current-record": [
    {"id":"a9","selector":".state-split-grid","title":"卡券与履约状态拆分","content":"卡券统一显示已核销，对应履约仍可为待履约、待发货或待核销。"}
  ],
  "mobile-record": [
    {"id":"a4","selector":".record-status-card","title":"已核销卡券回看","content":"兑换详情保留商品快照，并提供同一兑换单的履约/发货状态入口。"}
  ],
  "mobile-fulfillment": [
    {"id":"a6","selector":".fulfillment-list","title":"逐商品履约状态","content":"车联网、直邮和到店核销分别使用自己的状态枚举；失败提示联系客服，直邮可查询物流。"}
  ]
};
