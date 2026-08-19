(function () {
  'use strict';

  window.SAFrontData = {
    source: {
      saName: '陈晓明',
      saId: 'SA10086',
      storeId: 'S001',
      store: '广州花都专营店',
      sceneId: 'SCN-20260717-10086-0088',
      activityCount: 6
    },
    stores: [
      {id:'S001',code:'GZ-HD-001',name:'广州花都专营店',available:true},
      {id:'S002',code:'FS-NH-002',name:'佛山南海专营店',available:true},
      {id:'S003',code:'DG-LB-003',name:'东莞寮步专营店',available:true},
      {id:'S004',code:'SZ-LG-004',name:'深圳龙岗专营店',available:true}
    ],
    qr: {
      nextSceneId: 'SCN-20260717-10086-0089',
      snapshotVersion: 'V3',
      generatedAt: '2026-07-17 14:32:00',
      expiresAt: '2026-07-17 15:02:00',
      configVersion: 'QR-TTL-V6',
      durationOptions: [
        {minutes:5,label:'5分钟'},
        {minutes:30,label:'30分钟'},
        {minutes:60,label:'1小时'},
        {minutes:360,label:'6小时'},
        {minutes:720,label:'12小时'},
        {minutes:1440,label:'1天'},
        {minutes:-1,label:'长期有效',note:'至活动有效期'}
      ],
      defaultMinutes: 30,
      minMinutes: 5,
      maxMinutes: 1440,
      allowActivityEnd: true
    },
    poster: {
      defaultTitle: '您的专属车主福利已送达',
      defaultSubtitle: '多项养护礼遇，扫码查看当前可参与活动',
      defaultGuide: '微信扫一扫，立即查看专属活动',
      titleMaxLength: 20,
      subtitleMaxLength: 36,
      guideMaxLength: 24
    },
    user: {
      oneId: 'OID****8862',
      mobile: '138****5678',
      defaultVehicleId: 'vehicle-1'
    },
    vehicles: [
      {id:'vehicle-1', model:'轩逸', plate:'粤A·8D23', vin:'LVH******1234', certified:false, isDefault:true},
      {id:'vehicle-2', model:'天籁', plate:'粤B·3K58', vin:'LGB******9066', certified:true, isDefault:false}
    ],
    levels: [
      {key:'number', title:'号码级活动', note:'按当前账号判断参与资格'},
      {key:'vehicle', title:'绑车级活动', note:'按当前所选VIN判断参与资格'},
      {key:'certified', title:'认证级活动', note:'按当前账号与VIN认证关系判断'}
    ],
    activities: [
      {
        id:'ACT-SA-20260705', level:'number', name:'夏日车主礼', description:'领取夏季出行卡券包', type:'coupon', reward:'30元保养抵扣券 + 到店检测券', status:{all:'eligible'}, expiry:'活动至 07月31日', shareNote:'本店适用',
        period:'2026-07-01 至 2026-07-31', brand:'东风日产、启辰', organizer:'东风日产售后运营',
        rules:['同一账号活动期内限参与1次','符合活动准入条件后即时发券','卡券到账后可在“我的卡券”查看'],
        coupons:[{name:'30元保养抵扣券',quantity:'1张',valid:'领取后30天'},{name:'到店检测券',quantity:'1张',valid:'领取后30天'}],
        benefits:[{name:'车辆健康检测',note:'到店可享1次'}],
        mutex:{group:'MX-SA-NUMBER-001',scope:'number',scopeLabel:'号码级（同一账号）',description:'与“到店保养抽奖季”互斥，同一账号只能参加其中一个活动。'}
      },
      {
        id:'ACT-SA-20260703', level:'number', name:'到店保养抽奖季', description:'抽奖自动执行，无需再次操作', type:'lottery', reward:'最高200元保养券', status:{all:'eligible'}, expiry:'活动至 07月25日', shareNote:'本店适用',
        period:'2026-07-05 至 2026-07-25', brand:'东风日产、启辰', organizer:'东风日产售后运营',
        rules:['同一账号活动期内限参与1次','点击一键参与后系统自动完成抽奖','中奖卡券即时发放，未中奖也视为活动已参与'],
        coupons:[{name:'200元保养券',quantity:'中奖后1张',valid:'领取后15天'}],
        benefits:[],
        mutex:{group:'MX-SA-NUMBER-001',scope:'number',scopeLabel:'号码级（同一账号）',description:'与“夏日车主礼”互斥，同一账号只能参加其中一个活动。'}
      },
      {
        id:'ACT-SA-20260701', level:'vehicle', name:'夏季养护礼遇', description:'当前车辆可领取2张养护券', type:'coupon', reward:'基础保养抵扣券 + 精品券', status:{'vehicle-1':'eligible','vehicle-2':'participated'}, expiry:'活动至 08月15日', shareNote:'华南区域适用',
        period:'2026-07-01 至 2026-08-15', brand:'东风日产', organizer:'华南区域售后运营',
        rules:['同一VIN活动期内限参与1次','需当前账号已绑定执行VIN','切换车辆后按新VIN重新校验资格'],
        coupons:[{name:'基础保养抵扣券',quantity:'1张',valid:'领取后45天'},{name:'精品券',quantity:'1张',valid:'领取后45天'}],
        benefits:[{name:'空调系统检测',note:'到店可享1次'}]
      },
      {
        id:'ACT-SA-20260704', level:'vehicle', name:'老友焕新券包', description:'每辆绑定车辆限参与一次', type:'coupon', reward:'保养工时折扣券包', status:{'vehicle-1':'participated','vehicle-2':'eligible'}, expiry:'活动至 08月31日', shareNote:'本店适用',
        period:'2026-07-10 至 2026-08-31', brand:'东风日产、启辰', organizer:'广州花都专营店',
        rules:['同一VIN活动期内限参与1次','仅限当前门店关联客户参与','券包领取成功后不可重复参加'],
        coupons:[{name:'保养工时折扣券',quantity:'2张',valid:'领取后30天'}],
        benefits:[{name:'续保咨询服务',note:'专属顾问1次'}]
      },
      {
        id:'COMB-SA-20260701', level:'vehicle', name:'2026夏季车主组合活动', displayName:'夏季专属成长礼', description:'一个大活动，绑定车辆后汇总当前VIN命中的全部权益', type:'coupon', isCombo:true, childCount:3, reward:'绑车后查看当前车辆专属卡券', status:{'vehicle-1':'eligible','vehicle-2':'eligible'}, expiry:'活动至 09月15日', shareNote:'指定2家门店', saPlacementEnabled:true, activityState:'ACTIVE', storeScope:{mode:'SPECIFIED',storeIds:['S001','S002']},
        period:'2026-07-05 至 2026-09-15', brand:'东风日产',
        rules:['SA链路优先展示组合活动展示名称，未配置时回退原组合活动名称','组合活动以一张活动卡片展示','需绑定车辆并选择当前执行VIN后匹配专属活动','同一VIN可同时命中多个子活动，对应卡券与权益全部发放','组合活动按VIN仅可参与1次，不设子活动优先级和顺序'],
        coupons:[],
        benefits:[],
        matchedRewards:{
          'vehicle-1':[
            {childId:'ACT-COMB-RET-001',reward:'专属保养抵扣券 100元',coupons:[{name:'专属保养抵扣券 100元',quantity:'1张',valid:'领取后30天'}],benefits:[{name:'免费车辆检测',note:'到店可享1次'}]},
            {childId:'ACT-COMB-LOSS-002',reward:'专属回店抵扣券 150元',coupons:[{name:'专属回店抵扣券 150元',quantity:'1张',valid:'领取后30天'}],benefits:[{name:'空调系统检测',note:'到店可享1次'}]}
          ],
          'vehicle-2':[
            {childId:'ACT-COMB-REP-003',reward:'专属精品代金券 80元',coupons:[{name:'专属精品代金券 80元',quantity:'1张',valid:'领取后45天'}],benefits:[{name:'保养工时权益',note:'当前车辆可享1次'}]}
          ]
        }
      },
      {
        id:'COMB-SA-20260702', level:'vehicle', name:'启辰秋季车主组合活动', displayName:'', description:'用于验证展示名称回退与门店过滤，不向当前SA展示', type:'coupon', isCombo:true, childCount:1, reward:'秋季车辆检测券', status:{'vehicle-1':'eligible','vehicle-2':'eligible'}, expiry:'活动至 10月31日', shareNote:'指定1家门店', saPlacementEnabled:true, activityState:'ACTIVE', storeScope:{mode:'SPECIFIED',storeIds:['S003']},
        period:'2026-09-01 至 2026-10-31', brand:'启辰',
        rules:['未配置展示名称，SA链路回退原组合活动名称','当前SA所属门店未命中适用门店时，不进入可查看、可分享列表'],
        coupons:[], benefits:[], matchedRewards:{'vehicle-1':[],'vehicle-2':[]}
      },
      {
        id:'ACT-SA-20260702', level:'certified', name:'认证车主专享礼', description:'完成车主认证后可领取', type:'coupon', reward:'认证车主精品代金券', status:{'vehicle-1':'need-certified','vehicle-2':'eligible'}, expiry:'活动至 09月15日', shareNote:'全国适用',
        period:'2026-07-01 至 2026-09-15', brand:'东风日产、启辰', organizer:'东风日产售后运营',
        rules:['当前账号与执行VIN需完成1:1车主认证','同一认证关系活动期内限参与1次','完成认证后需重新扫码进入活动页'],
        coupons:[{name:'认证车主精品代金券',quantity:'1张',valid:'领取后60天'}],
        benefits:[{name:'认证车主专属服务标识',note:'认证关系有效期内'}]
      }
    ],
    saReport: {
      range: '近30日',
      summary: [
        {key:'scan', label:'扫码人数', value:'328', note:'本人二维码扫码UV'},
        {key:'participation', label:'活动参与数', value:'186', note:'最终来源为本人'},
        {key:'coupon', label:'发放卡券数', value:'241', note:'本人活动产生券实例'},
        {key:'redeem', label:'已核销数', value:'96', note:'成功核销券实例'}
      ],
      summary7d: [
        {key:'scan', label:'扫码人数', value:'96', note:'本人二维码扫码UV'},
        {key:'participation', label:'活动参与数', value:'58', note:'最终来源为本人'},
        {key:'coupon', label:'发放卡券数', value:'75', note:'本人活动产生券实例'},
        {key:'redeem', label:'已核销数', value:'21', note:'成功核销券实例'}
      ],
      ratios: [
        {label:'活动参与转化率', value:'56.7%', note:'参与主体 ÷ 识别用户'},
        {label:'卡券核销率', value:'39.8%', note:'已核销 ÷ 已发放'},
        {label:'抽奖 / 中奖', value:'62 / 21', note:'中奖率33.9%'},
        {label:'跨店核销', value:'7', note:'来源门店与核销门店不同'}
      ],
      ratios7d: [
        {label:'活动参与转化率', value:'60.4%', note:'参与主体 ÷ 识别用户'},
        {label:'卡券核销率', value:'28.0%', note:'已核销 ÷ 已发放'},
        {label:'抽奖 / 中奖', value:'18 / 6', note:'中奖率33.3%'},
        {label:'跨店核销', value:'2', note:'来源门店与核销门店不同'}
      ],
      trend: [
        {day:'07/11', scan:9, participation:5},
        {day:'07/12', scan:11, participation:6},
        {day:'07/13', scan:12, participation:7},
        {day:'07/14', scan:14, participation:8},
        {day:'07/15', scan:15, participation:9},
        {day:'07/16', scan:16, participation:10},
        {day:'07/17', scan:19, participation:13}
      ],
      activities: [
        {
          id:'ACT-SA-20260705', name:'夏日车主礼', level:'number', type:'coupon', status:'进行中',
          participation:86, coupons:142, draws:'—', wins:'—', last:'07-17 14:26', conversion:'61.9%',
          records:[
            {id:'PAR-SA-0717-0086', time:'2026-07-17 14:26:18', mobile:'138****5678', vin:'—', level:'号码级', type:'领券', result:'领取成功', couponCount:2, store:'广州花都专营店', validation:'手机号识别 → 活动准入 → 互斥组校验 → 未参与校验', coupons:'30元保养抵扣券、到店检测券'},
            {id:'PAR-SA-0717-0081', time:'2026-07-17 13:48:05', mobile:'186****2309', vin:'—', level:'号码级', type:'领券', result:'领取成功', couponCount:2, store:'广州花都专营店', validation:'手机号识别 → 活动准入 → 互斥组校验 → 未参与校验', coupons:'30元保养抵扣券、到店检测券'}
          ]
        },
        {
          id:'ACT-SA-20260703', name:'到店保养抽奖季', level:'number', type:'lottery', status:'进行中',
          participation:62, coupons:21, draws:62, wins:21, last:'07-17 14:18', conversion:'49.6%',
          records:[
            {id:'PAR-SA-0717-0079', time:'2026-07-17 14:18:33', mobile:'139****1186', vin:'—', level:'号码级', type:'抽奖', result:'中奖', couponCount:1, store:'广州花都专营店', validation:'手机号识别 → 互斥组校验 → 抽奖次数 → 未参与校验', coupons:'200元保养券'},
            {id:'PAR-SA-0717-0067', time:'2026-07-17 11:32:09', mobile:'137****8092', vin:'—', level:'号码级', type:'抽奖', result:'未中奖', couponCount:0, store:'广州花都专营店', validation:'手机号识别 → 互斥组校验 → 抽奖次数 → 未参与校验', coupons:'—'}
          ]
        },
        {
          id:'ACT-SA-20260701', name:'夏季养护礼遇', level:'vehicle', type:'coupon', status:'进行中',
          participation:38, coupons:78, draws:'—', wins:'—', last:'07-17 13:57', conversion:'52.1%',
          records:[
            {id:'PAR-SA-0717-0072', time:'2026-07-17 13:57:42', mobile:'136****7721', vin:'LVH******4528', level:'绑车级', type:'领券', result:'领取成功', couponCount:2, store:'广州花都专营店', validation:'默认VIN → 绑定关系 → VIN未参与校验', coupons:'基础保养抵扣券、精品券'}
          ]
        }
      ],
      coupons: [
        {id:'TPL-SA-3001', name:'30元保养抵扣券', activity:'夏日车主礼', issued:96, redeemed:42, expired:6, redemptionRate:'43.8%', cross:3, status:'已生效', owner:'号码级', valid:'领取后30天', last:'07-17 14:26', timeline:['07-17 14:26 最近发放','07-17 13:12 本店核销','07-16 18:42 跨店核销']},
        {id:'TPL-SA-2009', name:'200元保养券', activity:'到店保养抽奖季', issued:21, redeemed:8, expired:1, redemptionRate:'38.1%', cross:1, status:'已生效', owner:'号码级', valid:'领取后15天', last:'07-17 14:18', timeline:['07-17 14:18 抽奖发放','07-17 10:36 本店核销','07-15 16:08 到期失效']},
        {id:'TPL-SA-4108', name:'基础保养抵扣券', activity:'夏季养护礼遇', issued:78, redeemed:31, expired:4, redemptionRate:'39.7%', cross:3, status:'已生效', owner:'绑车级', valid:'领取后45天', last:'07-17 13:57', timeline:['07-17 13:57 最近发放','07-17 09:44 本店核销','07-16 15:20 跨店核销']}
      ]
    }
  };
})();
