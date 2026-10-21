window.ExchangeCouponMock = {
  coupon: {
    id: 'EX202607200001', name: 'GUI皮肤5选2兑换券', scene: '车联网兑换场景（目标态）',
    type: '兑换券', issueCount: 10000, stock: 8620, status: '发放中',
    claimTime: '2026-07-20 00:00 ～ 2026-08-31 23:59',
    redeemTime: '领取后立即生效，有效期30天',
    scope: '产品中心 GUI 皮肤 / 日产全车系', owner: '卡券中心',
    ruleMode: 'choice', poolSize: 5, redeemQuantity: 2, allowSameSku: true,
    fulfillmentType: 'telematics', productSource: '产品中心', phaseScope: '一期仅 GUI 皮肤',
    boundVehicle: {vin:'LGBH52E02RS019375',car:'日产轩逸 2024款',plate:'粤B·3X52M'},
    receiver: {name:'黄先生',phone:'138****5208',address:'广东省深圳市南山区深南大道 1001 号'}
  },
  telematicsFailureReason: '当前车辆暂不支持所选座舱皮肤',
  fulfillmentTypes: [
    {value:'telematics',label:'车联网履约'},
    {value:'direct_ship',label:'直邮'},
    {value:'store_verify',label:'到店核销'}
  ],
  phaseOneFulfillmentTypes: [{value:'telematics',label:'车联网履约'}],
  fulfillmentStatusEnums: {
    telematics:[{value:'success',label:'履约成功'},{value:'failed',label:'履约失败'}],
    direct_ship:[{value:'pending_ship',label:'待发货'},{value:'shipped',label:'已发货'},{value:'signed',label:'已签收'},{value:'failed',label:'失败'}],
    store_verify:[{value:'pending_verify',label:'待核销'},{value:'verified',label:'已核销'}]
  },
  suppliers: [
    {id:'PC-IOV',name:'车联网内容中心'},
    {id:'PC-LIFE',name:'日产精品内容中心'},
    {id:'PC-DEALER',name:'专营店服务产品中心'}
  ],
  productTypes: [
    {value:'GUI_SKIN',label:'GUI皮肤',phaseEligible:true},
    {value:'TRAFFIC',label:'流量',phaseEligible:false},
    {value:'MEMBERSHIP',label:'会员',phaseEligible:false},
    {value:'OTHER',label:'其他',phaseEligible:false}
  ],
  couponExamples: [
    {id:'EX202607200001',name:'GUI皮肤5选2兑换券',fulfillmentType:'telematics',fulfillmentLabel:'车联网履约',candidateProductIds:['SKU-GUI-10001','SKU-GUI-10002','SKU-GUI-10003','SKU-GUI-10004','SKU-GUI-10005'],redeemQuantity:2,expiresAt:'2026-08-31 23:59',subtitle:'5款GUI皮肤任选2件',phaseOne:true},
    {id:'EX202607200002',name:'精品实物2选1直邮券',fulfillmentType:'direct_ship',fulfillmentLabel:'直邮',candidateProductIds:['SKU-20001','SKU-20002'],redeemQuantity:1,expiresAt:'2026-08-31 23:59',subtitle:'独立直邮场景，本次不调整',phaseOne:false},
    {id:'EX202607200003',name:'门店养护2选1兑换券',fulfillmentType:'store_verify',fulfillmentLabel:'到店核销',candidateProductIds:['SKU-30001','SKU-30002'],redeemQuantity:1,expiresAt:'2026-08-31 23:59',subtitle:'独立线下场景，本次不调整',phaseOne:false}
  ],
  couponProductRules: [
    {couponId:'EX202607200001',productId:'SKU-GUI-10001',maxRedeemQty:2},
    {couponId:'EX202607200001',productId:'SKU-GUI-10002',maxRedeemQty:1},
    {couponId:'EX202607200001',productId:'SKU-GUI-10003',maxRedeemQty:1},
    {couponId:'EX202607200001',productId:'SKU-GUI-10004',maxRedeemQty:1},
    {couponId:'EX202607200001',productId:'SKU-GUI-10005',maxRedeemQty:1},
    {couponId:'EX202607200002',productId:'SKU-20001',maxRedeemQty:1},
    {couponId:'EX202607200002',productId:'SKU-20002',maxRedeemQty:1},
    {couponId:'EX202607200003',productId:'SKU-30001',maxRedeemQty:1},
    {couponId:'EX202607200003',productId:'SKU-30002',maxRedeemQty:1}
  ],
  stores: [
    {id:'STORE-SZ-001',province:'广东省',city:'深圳市',name:'深圳东风南方华侨城店',address:'深圳市南山区侨香路 1010 号',phone:'0755-****6688'},
    {id:'STORE-SZ-002',province:'广东省',city:'深圳市',name:'深圳东风南方深南店',address:'深圳市福田区深南大道 6068 号',phone:'0755-****8200'},
    {id:'STORE-GZ-001',province:'广东省',city:'广州市',name:'广州东风南方黄埔店',address:'广州市黄埔区开创大道 1888 号',phone:'020-****8899'},
    {id:'STORE-HZ-001',province:'浙江省',city:'杭州市',name:'杭州东风南方城西店',address:'杭州市西湖区古墩路 888 号',phone:'0571-****6611'}
  ],
  addresses: [
    {id:'ADDR-001',name:'黄先生',phone:'138****5208',province:'广东省',city:'深圳市',district:'南山区',detail:'深南大道 1001 号',isDefault:true},
    {id:'ADDR-002',name:'黄先生',phone:'138****5208',province:'广东省',city:'深圳市',district:'福田区',detail:'香蜜湖路 88 号',isDefault:false}
  ],
  products: [
    {id:'SKU-GUI-10001',spuId:'SPU-GUI-1001',spuName:'星空座舱皮肤',specName:'星河蓝',name:'星空座舱皮肤·星河蓝',category:'GUI皮肤',subCategory:'座舱主题',productType:'GUI_SKIN',productTypeLabel:'GUI皮肤',sourceSystem:'产品中心',saleStatus:'listed',saleStatusLabel:'已上架',redeemable:true,configEligible:true,supplierId:'PC-IOV',supplier:'车联网内容中心',price:18,stock:99999,stockLabel:'兑换额度充足',fulfillment:'车联网履约',fulfillmentValue:'telematics',allowedFulfillmentValues:['telematics'],selected:true,qty:1,icon:'星',defaultStatus:'success',description:'同步履约成功后加入本券绑定车辆的座舱皮肤库。'},
    {id:'SKU-GUI-10006',spuId:'SPU-GUI-1001',spuName:'星空座舱皮肤',specName:'夜幕黑',name:'星空座舱皮肤·夜幕黑',category:'GUI皮肤',subCategory:'座舱主题',productType:'GUI_SKIN',productTypeLabel:'GUI皮肤',sourceSystem:'产品中心',saleStatus:'listed',saleStatusLabel:'已上架',redeemable:true,configEligible:true,supplierId:'PC-IOV',supplier:'车联网内容中心',price:18,stock:99999,stockLabel:'兑换额度充足',fulfillment:'车联网履约',fulfillmentValue:'telematics',allowedFulfillmentValues:['telematics'],selected:false,qty:1,icon:'幕',defaultStatus:'success',description:'同步履约成功后加入本券绑定车辆的座舱皮肤库。'},
    {id:'SKU-GUI-10002',spuId:'SPU-GUI-1002',spuName:'深海流光皮肤',specName:'深海蓝',name:'深海流光皮肤·深海蓝',category:'GUI皮肤',subCategory:'座舱主题',productType:'GUI_SKIN',productTypeLabel:'GUI皮肤',sourceSystem:'产品中心',saleStatus:'not_listed',saleStatusLabel:'销售未上架',redeemable:true,configEligible:true,supplierId:'PC-IOV',supplier:'车联网内容中心',price:18,stock:99999,stockLabel:'兑换额度充足',fulfillment:'车联网履约',fulfillmentValue:'telematics',allowedFulfillmentValues:['telematics'],selected:true,qty:1,icon:'海',defaultStatus:'success',description:'该规格尚未在商城上架，但产品中心标记为可兑换，可正常同步到绑定车辆。'},
    {id:'SKU-GUI-10003',spuId:'SPU-GUI-1003',spuName:'极光天际皮肤',specName:'极光紫',name:'极光天际皮肤·极光紫',category:'GUI皮肤',subCategory:'座舱主题',productType:'GUI_SKIN',productTypeLabel:'GUI皮肤',sourceSystem:'产品中心',saleStatus:'listed',saleStatusLabel:'已上架',redeemable:true,configEligible:true,supplierId:'PC-IOV',supplier:'车联网内容中心',price:20,stock:99999,stockLabel:'兑换额度充足',fulfillment:'车联网履约',fulfillmentValue:'telematics',allowedFulfillmentValues:['telematics'],selected:true,qty:1,icon:'极',defaultStatus:'success',description:'同步履约成功后加入本券绑定车辆的座舱皮肤库。'},
    {id:'SKU-GUI-10004',spuId:'SPU-GUI-1004',spuName:'赛道脉冲皮肤',specName:'竞速红',name:'赛道脉冲皮肤·竞速红',category:'GUI皮肤',subCategory:'座舱主题',productType:'GUI_SKIN',productTypeLabel:'GUI皮肤',sourceSystem:'产品中心',saleStatus:'not_listed',saleStatusLabel:'销售未上架',redeemable:true,configEligible:true,supplierId:'PC-IOV',supplier:'车联网内容中心',price:20,stock:99999,stockLabel:'兑换额度充足',fulfillment:'车联网履约',fulfillmentValue:'telematics',allowedFulfillmentValues:['telematics'],selected:true,qty:1,icon:'赛',defaultStatus:'success',description:'产品中心已开放兑换，销售未上架不影响通过兑换券获取。'},
    {id:'SKU-GUI-10005',spuId:'SPU-GUI-1005',spuName:'国风山水皮肤',specName:'千里江山',name:'国风山水皮肤·千里江山',category:'GUI皮肤',subCategory:'座舱主题',productType:'GUI_SKIN',productTypeLabel:'GUI皮肤',sourceSystem:'产品中心',saleStatus:'listed',saleStatusLabel:'已上架',redeemable:true,configEligible:true,supplierId:'PC-IOV',supplier:'车联网内容中心',price:22,stock:99999,stockLabel:'兑换额度充足',fulfillment:'车联网履约',fulfillmentValue:'telematics',allowedFulfillmentValues:['telematics'],selected:true,qty:1,icon:'山',defaultStatus:'success',description:'同步履约成功后加入本券绑定车辆的座舱皮肤库。'},
    {id:'SKU-TRAFFIC-20001',spuId:'SPU-TRAFFIC-2001',spuName:'车机流量包',specName:'10GB / 90天',name:'车机流量包 10GB',category:'流量',subCategory:'车机流量',productType:'TRAFFIC',productTypeLabel:'流量',sourceSystem:'产品中心',saleStatus:'listed',saleStatusLabel:'已上架',redeemable:true,configEligible:false,exclusionReason:'一期仅支持GUI皮肤，流量类不可配置',supplierId:'PC-IOV',supplier:'车联网内容中心',price:29,stock:99999,stockLabel:'充足',fulfillment:'车联网履约',fulfillmentValue:'telematics',allowedFulfillmentValues:['telematics'],selected:false,qty:1,icon:'流',defaultStatus:'success',description:'流量类商品本期排除。'},
    {id:'SKU-MEMBER-30001',spuId:'SPU-MEMBER-3001',spuName:'在线音乐会员',specName:'月卡 / 30天',name:'在线音乐会员月卡',category:'会员',subCategory:'数字会员',productType:'MEMBERSHIP',productTypeLabel:'会员',sourceSystem:'产品中心',saleStatus:'listed',saleStatusLabel:'已上架',redeemable:true,configEligible:false,exclusionReason:'一期仅支持GUI皮肤，会员类不可配置',supplierId:'PC-IOV',supplier:'车联网内容中心',price:15,stock:99999,stockLabel:'充足',fulfillment:'车联网履约',fulfillmentValue:'telematics',allowedFulfillmentValues:['telematics'],selected:false,qty:1,icon:'会',defaultStatus:'success',description:'会员类商品本期排除。'},
    {id:'SKU-OTHER-40001',spuId:'SPU-OTHER-4001',spuName:'导航语音包',specName:'温暖女声',name:'导航语音包·温暖女声',category:'其他',subCategory:'导航语音',productType:'OTHER',productTypeLabel:'其他',sourceSystem:'产品中心',saleStatus:'not_listed',saleStatusLabel:'销售未上架',redeemable:true,configEligible:false,exclusionReason:'一期仅支持GUI皮肤，其他类型不可配置',supplierId:'PC-IOV',supplier:'车联网内容中心',price:9.9,stock:99999,stockLabel:'充足',fulfillment:'车联网履约',fulfillmentValue:'telematics',allowedFulfillmentValues:['telematics'],selected:false,qty:1,icon:'声',defaultStatus:'success',description:'其他类型商品本期排除，禁选原因不是销售未上架。'},
    {id:'SKU-20001',spuId:'SPU-2001',spuName:'日产舒适头枕',specName:'深灰色 / 单只',name:'日产舒适头枕',category:'其他',subCategory:'车载用品',productType:'OTHER',productTypeLabel:'其他',sourceSystem:'产品中心',saleStatus:'listed',saleStatusLabel:'已上架',redeemable:true,configEligible:false,exclusionReason:'非一期GUI皮肤范围',supplierId:'PC-LIFE',supplier:'日产精品内容中心',price:89,stock:156,stockLabel:'156',fulfillment:'直邮',fulfillmentValue:'direct_ship',allowedFulfillmentValues:['direct_ship'],selected:false,qty:1,icon:'枕',defaultStatus:'shipped',description:'独立直邮场景，本次不调整。'},
    {id:'SKU-20002',spuId:'SPU-2002',spuName:'车载香氛礼盒',specName:'海盐香型 / 3支装',name:'车载香氛礼盒',category:'其他',subCategory:'精品周边',productType:'OTHER',productTypeLabel:'其他',sourceSystem:'产品中心',saleStatus:'listed',saleStatusLabel:'已上架',redeemable:true,configEligible:false,exclusionReason:'非一期GUI皮肤范围',supplierId:'PC-LIFE',supplier:'日产精品内容中心',price:69,stock:82,stockLabel:'82',fulfillment:'直邮',fulfillmentValue:'direct_ship',allowedFulfillmentValues:['direct_ship'],selected:false,qty:1,icon:'香',defaultStatus:'signed',description:'独立直邮场景，本次不调整。'},
    {id:'SKU-30001',spuId:'SPU-3001',spuName:'基础洗车服务',specName:'1次',name:'基础洗车服务 1 次',category:'其他',subCategory:'养护服务',productType:'OTHER',productTypeLabel:'其他',sourceSystem:'产品中心',saleStatus:'listed',saleStatusLabel:'已上架',redeemable:true,configEligible:false,exclusionReason:'非一期GUI皮肤范围',supplierId:'PC-DEALER',supplier:'专营店服务产品中心',price:45,stock:9999,stockLabel:'充足',fulfillment:'到店核销',fulfillmentValue:'store_verify',allowedFulfillmentValues:['store_verify'],selected:false,qty:1,icon:'洗',defaultStatus:'pending_verify',description:'独立到店核销场景，本次不调整。'},
    {id:'SKU-30002',spuId:'SPU-3002',spuName:'空调系统养护服务',specName:'标准套餐',name:'空调系统养护服务',category:'其他',subCategory:'养护服务',productType:'OTHER',productTypeLabel:'其他',sourceSystem:'产品中心',saleStatus:'listed',saleStatusLabel:'已上架',redeemable:true,configEligible:false,exclusionReason:'非一期GUI皮肤范围',supplierId:'PC-DEALER',supplier:'专营店服务产品中心',price:198,stock:235,stockLabel:'235',fulfillment:'到店核销',fulfillmentValue:'store_verify',allowedFulfillmentValues:['store_verify'],selected:false,qty:1,icon:'养',defaultStatus:'verified',description:'独立到店核销场景，本次不调整。'}
  ],
  redemptionRecord: {
    orderNo:'RD202608250826', exchangeTime:'2026-08-25 10:36:18', couponStatus:'已核销',
    orderStatus:'履约成功', couponName:'GUI皮肤固定组合兑换券',
    vehicle:{vin:'LGBH52E02RS019375',car:'日产轩逸 2024款',plate:'粤B·3X52M'},
    items:[
      {productId:'SKU-GUI-10001',qty:1,status:'success',fulfillmentOrderNo:'FL-TEL-20260825001'},
      {productId:'SKU-GUI-10002',qty:1,status:'success',fulfillmentOrderNo:'FL-TEL-20260825001'}
    ]
  },
  fulfillmentOrders: [
    {orderNo:'FL-TEL-20260825001',exchangeOrderNo:'RD202608250826',couponName:'GUI皮肤固定组合兑换券',type:'telematics',typeLabel:'车联网履约',status:'success',statusLabel:'履约成功',supplier:'车联网内容中心',createdAt:'2026-08-25 10:36:18',updatedAt:'2026-08-25 10:36:19',vin:'LGBH52E02RS019375',responseMode:'同步实时返回',items:[{productId:'SKU-GUI-10001',qty:1,status:'success'},{productId:'SKU-GUI-10002',qty:1,status:'success'}]},
    {orderNo:'ATTEMPT-TEL-20260825002',exchangeOrderNo:'—',couponName:'GUI皮肤5选2兑换券',type:'telematics',typeLabel:'车联网履约',status:'failed',statusLabel:'履约失败',supplier:'车联网内容中心',createdAt:'2026-08-25 11:08:26',updatedAt:'2026-08-25 11:08:27',vin:'LGBH52E02RS019375',responseMode:'同步实时返回',couponStatus:'可使用',items:[{productId:'SKU-GUI-10003',qty:1,status:'failed',failureReason:'车联网同步返回：目标车辆暂不支持该皮肤版本'},{productId:'SKU-GUI-10004',qty:1,status:'failed',failureReason:'同一请求整体失败'}]},
    {orderNo:'FL-DIR-20260721002',exchangeOrderNo:'RD202607210827',couponName:'精品实物2选1直邮券',type:'direct_ship',typeLabel:'直邮',status:'shipped',statusLabel:'已发货',supplier:'日产精品内容中心',createdAt:'2026-07-21 10:36:19',updatedAt:'2026-07-21 16:22:38',items:[{productId:'SKU-20001',qty:1,status:'shipped'}],logistics:{carrier:'顺丰速运',trackingNo:'SF14202607215208',receiver:'黄先生 138****5208',address:'广东省深圳市南山区深南大道 1001 号',tracks:[{time:'2026-07-22 09:18',text:'快件已到达【深圳南山营业点】'},{time:'2026-07-21 21:06',text:'快件运输中，已离开【广州集散中心】'},{time:'2026-07-21 16:22',text:'商家已发货，顺丰已揽收'}]}},
    {orderNo:'FL-STORE-20260721003',exchangeOrderNo:'RD202607210828',couponName:'门店养护2选1兑换券',type:'store_verify',typeLabel:'到店核销',status:'pending_verify',statusLabel:'待核销',supplier:'专营店服务产品中心',createdAt:'2026-07-21 10:36:19',updatedAt:'2026-07-21 10:36:19',items:[{productId:'SKU-30001',qty:1,status:'pending_verify'}],store:{scope:'深圳东风南方华侨城店',verifyCode:'DHQ-8286-5208'}}
  ]
};
