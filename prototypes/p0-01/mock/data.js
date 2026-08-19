window.ExchangeCouponMock = {
  coupon: {
    id: 'EX202607200001', name: '夏日全场好礼5选2兑换券', scene: '商城营销 / 新商城',
    type: '兑换券', issueCount: 10000, stock: 8620, status: '发放中',
    claimTime: '2026-07-20 00:00 ～ 2026-08-31 23:59',
    redeemTime: '领取后立即生效，有效期30天',
    scope: '日产全车系 / 全部专营店', owner: '卡券中心',
    ruleMode: 'choice', poolSize: 5, redeemQuantity: 2, allowSameSku: true,
    fulfillmentType: 'telematics',
    boundVehicle: {vin:'LGBH52E02RS019375',car:'日产轩逸 2024款',plate:'粤B·3X52M'},
    receiver: {name:'黄先生',phone:'138****5208',address:'广东省深圳市南山区深南大道 1001 号'}
  },
  fulfillmentTypes: [
    {value:'telematics',label:'车联网履约'},
    {value:'direct_ship',label:'直邮'},
    {value:'store_verify',label:'到店核销'}
  ],
  fulfillmentStatusEnums: {
    telematics:[{value:'pending',label:'待履约'},{value:'fulfilling',label:'履约中'},{value:'success',label:'履约成功'},{value:'failed',label:'失败'}],
    direct_ship:[{value:'pending_ship',label:'待发货'},{value:'shipped',label:'已发货'},{value:'signed',label:'已签收'},{value:'failed',label:'失败'}],
    store_verify:[{value:'pending_verify',label:'待核销'},{value:'verified',label:'已核销'}]
  },
  suppliers: [
    {id:'SUP-IOV',name:'东风日产车联网'},
    {id:'SUP-LIFE',name:'日产精品生活馆'},
    {id:'SUP-DEALER',name:'东风日产专营店服务'}
  ],
  couponExamples: [
    {id:'EX202607200001',name:'车联网好礼5选2兑换券',fulfillmentType:'telematics',fulfillmentLabel:'车联网履约',candidateProductIds:['SKU-10001','SKU-10002','SKU-10003','SKU-10004','SKU-10005'],redeemQuantity:2,expiresAt:'2026-08-31 23:59',subtitle:'5种车联网商品任选2件'},
    {id:'EX202607200002',name:'精品实物2选1直邮券',fulfillmentType:'direct_ship',fulfillmentLabel:'直邮',candidateProductIds:['SKU-20001','SKU-20002'],redeemQuantity:1,expiresAt:'2026-08-31 23:59',subtitle:'2种精品实物任选1件'},
    {id:'EX202607200003',name:'门店养护2选1兑换券',fulfillmentType:'store_verify',fulfillmentLabel:'到店核销',candidateProductIds:['SKU-30001','SKU-30002'],redeemQuantity:1,expiresAt:'2026-08-31 23:59',subtitle:'先选门店，再从2种服务中任选1件'}
  ],
  couponProductRules: [
    {couponId:'EX202607200001',productId:'SKU-10001',maxRedeemQty:2},
    {couponId:'EX202607200001',productId:'SKU-10002',maxRedeemQty:1},
    {couponId:'EX202607200001',productId:'SKU-10003',maxRedeemQty:1},
    {couponId:'EX202607200001',productId:'SKU-10004',maxRedeemQty:1},
    {couponId:'EX202607200001',productId:'SKU-10005',maxRedeemQty:1},
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
    {id:'SKU-10001',spuId:'SPU-1001',spuName:'车机流量包',specName:'10GB / 90天',name:'车机流量包 10GB',category:'车联网商品',subCategory:'车机流量',supplierId:'SUP-IOV',supplier:'东风日产车联网',price:29,stock:99999,stockLabel:'充足',fulfillment:'车联网履约',fulfillmentValue:'telematics',allowedFulfillmentValues:['telematics'],selected:true,qty:1,icon:'流',defaultStatus:'pending',description:'兑换后10GB流量将发放至本券绑定车辆，有效期90天。'},
    {id:'SKU-10006',spuId:'SPU-1001',spuName:'车机流量包',specName:'20GB / 180天',name:'车机流量包 20GB',category:'车联网商品',subCategory:'车机流量',supplierId:'SUP-IOV',supplier:'东风日产车联网',price:49,stock:88888,stockLabel:'充足',fulfillment:'车联网履约',fulfillmentValue:'telematics',allowedFulfillmentValues:['telematics'],selected:false,qty:1,icon:'流',defaultStatus:'pending',description:'兑换后20GB流量将发放至本券绑定车辆，有效期180天。'},
    {id:'SKU-10002',spuId:'SPU-1002',spuName:'智能座舱主题皮肤',specName:'星河',name:'智能座舱主题皮肤·星河',category:'车联网商品',subCategory:'主题皮肤',supplierId:'SUP-IOV',supplier:'东风日产车联网',price:18,stock:99999,stockLabel:'充足',fulfillment:'车联网履约',fulfillmentValue:'telematics',allowedFulfillmentValues:['telematics'],selected:true,qty:1,icon:'肤',defaultStatus:'fulfilling',description:'兑换后主题皮肤将加入本券绑定车辆的座舱主题库。'},
    {id:'SKU-10007',spuId:'SPU-1002',spuName:'智能座舱主题皮肤',specName:'深海',name:'智能座舱主题皮肤·深海',category:'车联网商品',subCategory:'主题皮肤',supplierId:'SUP-IOV',supplier:'东风日产车联网',price:18,stock:99999,stockLabel:'充足',fulfillment:'车联网履约',fulfillmentValue:'telematics',allowedFulfillmentValues:['telematics'],selected:false,qty:1,icon:'肤',defaultStatus:'pending',description:'兑换后深海主题皮肤将加入本券绑定车辆的座舱主题库。'},
    {id:'SKU-10003',spuId:'SPU-1003',spuName:'氛围灯主题',specName:'霓虹律动',name:'氛围灯主题·霓虹律动',category:'车联网商品',subCategory:'灯光主题',supplierId:'SUP-IOV',supplier:'东风日产车联网',price:20,stock:99999,stockLabel:'充足',fulfillment:'车联网履约',fulfillmentValue:'telematics',allowedFulfillmentValues:['telematics'],selected:false,qty:1,icon:'灯',defaultStatus:'success',description:'兑换后氛围灯主题将下发至本券绑定车辆。'},
    {id:'SKU-10004',spuId:'SPU-1004',spuName:'导航语音包',specName:'温暖女声',name:'导航语音包·温暖女声',category:'车联网商品',subCategory:'导航语音',supplierId:'SUP-IOV',supplier:'东风日产车联网',price:9.9,stock:99999,stockLabel:'充足',fulfillment:'车联网履约',fulfillmentValue:'telematics',allowedFulfillmentValues:['telematics'],selected:false,qty:1,icon:'声',defaultStatus:'failed',description:'兑换后导航语音包将加入本券绑定车辆的可用语音列表。'},
    {id:'SKU-10005',spuId:'SPU-1005',spuName:'在线音乐会员',specName:'月卡 / 30天',name:'在线音乐会员月卡',category:'车联网商品',subCategory:'数字会员',supplierId:'SUP-IOV',supplier:'东风日产车联网',price:15,stock:0,stockLabel:'已售罄',fulfillment:'车联网履约',fulfillmentValue:'telematics',allowedFulfillmentValues:['telematics'],selected:true,qty:1,icon:'乐',defaultStatus:'pending',description:'兑换后为本券绑定车辆开通30天车机在线音乐会员。'},
    {id:'SKU-10008',spuId:'SPU-1006',spuName:'车机视频会员',specName:'季卡 / 90天',name:'车机视频会员季卡',category:'车联网商品',subCategory:'数字会员',supplierId:'SUP-IOV',supplier:'东风日产车联网',price:35,stock:7600,stockLabel:'7600',fulfillment:'车联网履约',fulfillmentValue:'telematics',allowedFulfillmentValues:['telematics'],selected:false,qty:1,icon:'视',defaultStatus:'pending',description:'兑换后为本券绑定车辆开通90天车机视频会员。'},
    {id:'SKU-10009',spuId:'SPU-1007',spuName:'远程控车服务包',specName:'基础版 / 1年',name:'远程控车服务包基础版',category:'车联网商品',subCategory:'远程服务',supplierId:'SUP-IOV',supplier:'东风日产车联网',price:99,stock:3200,stockLabel:'3200',fulfillment:'车联网履约',fulfillmentValue:'telematics',allowedFulfillmentValues:['telematics'],selected:false,qty:1,icon:'控',defaultStatus:'pending',description:'兑换后为本券绑定车辆开通一年远程控车基础服务。'},
    {id:'SKU-20001',spuId:'SPU-2001',spuName:'日产舒适头枕',specName:'深灰色 / 单只',name:'日产舒适头枕',category:'精品实物',subCategory:'车载用品',supplierId:'SUP-LIFE',supplier:'日产精品生活馆',price:89,stock:156,stockLabel:'156',fulfillment:'直邮',fulfillmentValue:'direct_ship',allowedFulfillmentValues:['direct_ship'],selected:true,qty:1,icon:'枕',defaultStatus:'shipped',description:'由新商城供应商发货，物流信息可在兑换单中查询。'},
    {id:'SKU-20002',spuId:'SPU-2002',spuName:'车载香氛礼盒',specName:'海盐香型 / 3支装',name:'车载香氛礼盒',category:'精品实物',subCategory:'精品周边',supplierId:'SUP-LIFE',supplier:'日产精品生活馆',price:69,stock:82,stockLabel:'82',fulfillment:'直邮',fulfillmentValue:'direct_ship',allowedFulfillmentValues:['direct_ship'],selected:false,qty:1,icon:'香',defaultStatus:'signed',description:'由新商城供应商直邮至兑换时确认的收货地址。'},
    {id:'SKU-30001',spuId:'SPU-3001',spuName:'基础洗车服务',specName:'1次',name:'基础洗车服务 1 次',category:'门店服务',subCategory:'养护服务',supplierId:'SUP-DEALER',supplier:'东风日产专营店服务',price:45,stock:9999,stockLabel:'充足',fulfillment:'到店核销',fulfillmentValue:'store_verify',allowedFulfillmentValues:['store_verify'],selected:true,qty:1,icon:'洗',defaultStatus:'pending_verify',description:'兑换后生成到店核销权益，可在用户选择的适用专营店使用。'},
    {id:'SKU-30002',spuId:'SPU-3002',spuName:'空调系统养护服务',specName:'标准套餐',name:'空调系统养护服务',category:'门店服务',subCategory:'养护服务',supplierId:'SUP-DEALER',supplier:'东风日产专营店服务',price:198,stock:235,stockLabel:'235',fulfillment:'到店核销',fulfillmentValue:'store_verify',allowedFulfillmentValues:['store_verify'],selected:false,qty:1,icon:'养',defaultStatus:'verified',description:'用户先选择门店和商品，兑换成功后出示核销码到店使用。'}
  ],
  redemptionRecord: {
    orderNo:'RD202607210826', exchangeTime:'2026-07-21 10:36:18', couponStatus:'已核销',
    orderStatus:'履约处理中', couponName:'车联网固定组合兑换券',
    vehicle:{vin:'LGBH52E02RS019375',car:'日产轩逸 2024款',plate:'粤B·3X52M'},
    items:[
      {productId:'SKU-10001',qty:1,status:'pending',fulfillmentOrderNo:'FL-TEL-20260721001'},
      {productId:'SKU-10002',qty:1,status:'fulfilling',fulfillmentOrderNo:'FL-TEL-20260721001'},
      {productId:'SKU-10003',qty:1,status:'success',fulfillmentOrderNo:'FL-TEL-20260721001',completedAt:'2026-07-21 10:42:09'},
      {productId:'SKU-10004',qty:1,status:'failed',fulfillmentOrderNo:'FL-TEL-20260721001',failureReason:'权益下发失败'}
    ]
  },
  fulfillmentOrders: [
    {orderNo:'FL-TEL-20260721001',exchangeOrderNo:'RD202607210826',couponName:'全场好礼固定组合兑换券',type:'telematics',typeLabel:'车联网履约',status:'failed',statusLabel:'部分失败',supplier:'东风日产车联网',createdAt:'2026-07-21 10:36:19',updatedAt:'2026-07-21 10:42:09',vin:'LGBH52E02RS019375',items:[{productId:'SKU-10001',qty:1,status:'pending'},{productId:'SKU-10002',qty:1,status:'fulfilling'},{productId:'SKU-10003',qty:1,status:'success'},{productId:'SKU-10004',qty:1,status:'failed',failureReason:'权益下发失败'}]},
    {orderNo:'FL-DIR-20260721002',exchangeOrderNo:'RD202607210827',couponName:'精品实物2选1直邮券',type:'direct_ship',typeLabel:'直邮',status:'shipped',statusLabel:'已发货',supplier:'日产精品生活馆',createdAt:'2026-07-21 10:36:19',updatedAt:'2026-07-21 16:22:38',items:[{productId:'SKU-20001',qty:1,status:'shipped'}],logistics:{carrier:'顺丰速运',trackingNo:'SF14202607215208',receiver:'黄先生 138****5208',address:'广东省深圳市南山区深南大道 1001 号',tracks:[{time:'2026-07-22 09:18',text:'快件已到达【深圳南山营业点】'},{time:'2026-07-21 21:06',text:'快件运输中，已离开【广州集散中心】'},{time:'2026-07-21 16:22',text:'商家已发货，顺丰已揽收'}]}},
    {orderNo:'FL-STORE-20260721003',exchangeOrderNo:'RD202607210828',couponName:'门店养护2选1兑换券',type:'store_verify',typeLabel:'到店核销',status:'pending_verify',statusLabel:'待核销',supplier:'东风日产专营店服务',createdAt:'2026-07-21 10:36:19',updatedAt:'2026-07-21 10:36:19',items:[{productId:'SKU-30001',qty:1,status:'pending_verify'}],store:{scope:'深圳东风南方华侨城店',verifyCode:'DHQ-8286-5208'}},
    {orderNo:'FL-DIR-20260721004',exchangeOrderNo:'RD202607210829',couponName:'精品实物2选1直邮券',type:'direct_ship',typeLabel:'直邮',status:'failed',statusLabel:'失败',supplier:'日产精品生活馆',createdAt:'2026-07-21 10:36:19',updatedAt:'2026-07-21 10:40:12',items:[{productId:'SKU-20002',qty:1,status:'failed',failureReason:'供应商接单失败'}]},
    {orderNo:'FL-DIR-20260718004',exchangeOrderNo:'RD202607180115',couponName:'精品实物2选1兑换券',type:'direct_ship',typeLabel:'直邮',status:'signed',statusLabel:'已签收',supplier:'日产精品生活馆',createdAt:'2026-07-18 09:12:05',updatedAt:'2026-07-20 14:32:11',items:[{productId:'SKU-20002',qty:1,status:'signed'}],logistics:{carrier:'京东物流',trackingNo:'JDVA202607180115',receiver:'黄先生 138****5208',address:'广东省深圳市南山区深南大道 1001 号',tracks:[{time:'2026-07-20 14:32',text:'已签收，签收人为本人'},{time:'2026-07-20 08:10',text:'快件正在派送'}]}},
    {orderNo:'FL-STORE-20260716005',exchangeOrderNo:'RD202607160921',couponName:'专营店养护兑换券',type:'store_verify',typeLabel:'到店核销',status:'verified',statusLabel:'已核销',supplier:'东风日产专营店服务',createdAt:'2026-07-16 11:20:00',updatedAt:'2026-07-19 13:08:45',items:[{productId:'SKU-30002',qty:1,status:'verified'}],store:{scope:'深圳东风南方华侨城店',verifiedStore:'深圳东风南方华侨城店',verifiedAt:'2026-07-19 13:08:45',verifyCode:'DHQ-9912-6710'}}
  ]
};
