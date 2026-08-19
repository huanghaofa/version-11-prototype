(function () {
  'use strict';

  window.SAReportData = {
    meta: {
      brands: ['东风日产', '启辰'],
      regions: ['华南一区', '华南二区', '华东一区'],
      stores: ['广州花都专营店', '佛山南海专营店', '东莞寮步专营店', '深圳龙岗专营店'],
      sas: ['陈晓明 SA10086', '李佳 SA10023', '周凯 SA10045', '王敏 SA10061'],
      activities: ['夏季养护礼遇', '认证车主焕新礼', '到店保养抽奖季', '老友焕新券包'],
      coupons: ['基础保养抵扣券', '到店检测券', '精品代金券', '保养工时折扣券']
    },
    stores: [
      {id:'S001',code:'GZ-HD-001',name:'广州花都专营店',available:true},
      {id:'S002',code:'FS-NH-002',name:'佛山南海专营店',available:true},
      {id:'S003',code:'DG-LB-003',name:'东莞寮步专营店',available:true},
      {id:'S004',code:'SZ-LG-004',name:'深圳龙岗专营店',available:true}
    ],
    activityConfigs: [
      {id:'ACT-SA-20260701',name:'夏季养护礼遇',brand:'东风日产',business:'维保活动',activityType:'领券',trigger:'C端主动领取',claimMode:'一键领取',level:'绑车级',accessEnabled:'启用',checkpoints:['进入活动','领券前'],status:'已启用',time:'2026-07-01 至 2026-08-31',storeScope:'华南一区授权专营店',couponIds:['TPL-CP-10021','TPL-CP-10025'],coupons:['基础保养抵扣券','到店检测券'],rights:['免费车辆检测'],mutexIds:['ACT-SA-20260704'],mutexSubject:'VIN'},
      {id:'ACT-SA-20260702',name:'认证车主焕新礼',brand:'东风日产',business:'会员权益',activityType:'领券',trigger:'C端主动参与',claimMode:'一键领取',level:'认证级',accessEnabled:'启用',checkpoints:['进入活动','领券前'],status:'已启用',time:'2026-07-05 至 2026-08-20',storeScope:'华南一区授权专营店',couponIds:['TPL-CP-10018'],coupons:['精品代金券'],rights:['认证车主专属工时权益'],mutexIds:[],mutexSubject:'认证关系'},
      {id:'ACT-SA-20260703',name:'到店保养抽奖季',brand:'东风日产',business:'维保活动',activityType:'抽奖',trigger:'C端主动参与',claimMode:'自动抽奖',level:'号码级',accessEnabled:'启用',checkpoints:['进入活动','抽奖前'],status:'已启用',time:'2026-07-10 至 2026-07-31',storeScope:'华南全区授权专营店',couponIds:['TPL-CP-10025'],coupons:['到店检测券'],rights:['抽奖资格'],mutexIds:['ACT-SA-20260706'],mutexSubject:'oneID'},
      {id:'ACT-SA-20260704',name:'老友焕新券包',brand:'东风日产',business:'维保活动',activityType:'领券',trigger:'C端主动领取',claimMode:'一键领取',level:'绑车级',accessEnabled:'启用',checkpoints:['进入活动','领券前'],status:'草稿',time:'2026-08-01 至 2026-09-30',storeScope:'华南一区授权专营店',couponIds:['TPL-CP-10029'],coupons:['保养工时折扣券'],rights:['免费车辆检测'],mutexIds:['ACT-SA-20260701'],mutexSubject:'VIN'},
      {id:'ACT-OPS-20260705',name:'夏季关怀统一发券',brand:'东风日产',business:'维保活动',activityType:'领券',trigger:'后台统一推送',claimMode:'自动领取',level:'号码级',accessEnabled:'启用',checkpoints:['触发发券前'],status:'已启用',time:'2026-07-01 至 2026-07-31',storeScope:'全国授权专营店',couponIds:['TPL-CP-10021'],coupons:['基础保养抵扣券'],rights:[],mutexIds:[],mutexSubject:'oneID'},
      {id:'ACT-SA-20260706',name:'夏日会员抽奖礼',brand:'东风日产',business:'会员权益',activityType:'抽奖',trigger:'C端主动参与',claimMode:'自动抽奖',level:'号码级',accessEnabled:'启用',checkpoints:['进入活动','抽奖前'],status:'未启用',time:'2026-08-01 至 2026-08-31',storeScope:'华南全区授权专营店',couponIds:['TPL-CP-10018'],coupons:['精品代金券'],rights:['抽奖资格'],mutexIds:['ACT-SA-20260703'],mutexSubject:'oneID'}
    ],
    saPlacements: [
      {id:'SA-PUT-20260701',name:'夏季车主关怀投放',objectType:'普通活动',objectId:'ACT-SA-20260701',objectName:'夏季养护礼遇',brand:'东风日产',activityCount:1,levelSummary:'绑车级',status:'已生效',time:'2026-07-01 至 2026-08-31',updated:'2026-07-17 11:26:08',operator:'王运营'},
      {id:'SA-PUT-20260702',name:'夏季专属成长礼投放',objectType:'组合活动',objectId:'COMB-SA-20260701',objectName:'夏季专属成长礼',objectOriginalName:'2026夏季车主组合活动',brand:'东风日产',activityCount:3,levelSummary:'绑车级',status:'已生效',time:'2026-07-05 至 2026-09-15',updated:'2026-08-10 15:20:00',operator:'李运营'},
      {id:'SA-PUT-20260703',name:'到店保养抽奖投放',objectType:'普通活动',objectId:'ACT-SA-20260703',objectName:'到店保养抽奖季',brand:'东风日产',activityCount:1,levelSummary:'号码级',status:'已生效',time:'2026-07-10 至 2026-07-31',updated:'2026-07-17 10:31:17',operator:'周运营'},
      {id:'SA-PUT-20260704',name:'认证焕新礼投放',objectType:'普通活动',objectId:'ACT-SA-20260702',objectName:'认证车主焕新礼',brand:'东风日产',activityCount:1,levelSummary:'认证级',status:'草稿',time:'2026-07-05 至 2026-08-20',updated:'2026-07-17 09:44:02',operator:'王运营'}
    ],
    comboActivities: [
      {id:'COMB-SA-20260701',name:'2026夏季车主组合活动',displayName:'夏季专属成长礼',brand:'东风日产',time:'2026-07-05 至 2026-09-15',level:'绑车级',active:true,storeScope:{mode:'SPECIFIED',storeIds:['S001','S002']},children:[
        {id:'ACT-COMB-RET-001',segment:'留存人群包',coupon:'专属保养抵扣券 100元',benefit:'免费车辆检测'},
        {id:'ACT-COMB-LOSS-002',segment:'流失人群包',coupon:'专属回店抵扣券 150元',benefit:'空调系统检测'},
        {id:'ACT-COMB-REP-003',segment:'复购人群包',coupon:'精品代金券 80元',benefit:'保养工时权益'}
      ]},
      {id:'COMB-SA-20260702',name:'启辰秋季车主组合活动',displayName:'',brand:'启辰',time:'2026-09-01 至 2026-10-31',level:'号码级',active:true,storeScope:{mode:'ALL',storeIds:[]},children:[
        {id:'ACT-COMB-VEN-001',segment:'启辰活跃车主人群包',coupon:'启辰秋季检测券',benefit:'秋季车辆检测'}
      ]}
    ],
    saQrSettings: {
      minMinutes: 5,
      maxMinutes: 1440,
      durationOptions: [5,30,60,360,720,1440,-1],
      defaultMinutes: 30,
      allowActivityEnd: true,
      version: 'QR-TTL-V6',
      updated: '2026-08-14 10:20:00',
      operator: '王运营'
    },
    mutexRelations: [
      {id:'MUTEX-ACT-001',activityA:'ACT-SA-20260701',nameA:'夏季养护礼遇',levelA:'绑车级',activityB:'ACT-SA-20260704',nameB:'老友焕新券包',levelB:'绑车级',subject:'VIN',source:'活动编辑-选择互斥活动',status:'已生效',updated:'2026-07-17 10:12:36'},
      {id:'MUTEX-ACT-002',activityA:'ACT-SA-20260703',nameA:'到店保养抽奖季',levelA:'号码级',activityB:'ACT-SA-20260706',nameB:'夏日会员抽奖礼',levelB:'号码级',subject:'oneID',source:'活动编辑-选择互斥活动',status:'待生效',updated:'2026-07-17 10:28:09'}
    ],
    activityOverview: {
      kpis: [
        {key:'qr', label:'生成二维码数', value:'128', note:'较上期 +12.3%', target:'activity-qr'},
        {key:'scan', label:'扫码UV', value:'3,240', note:'识别成功 3,118', target:'activity-qr'},
        {key:'participation', label:'活动参与数', value:'1,126', note:'较上期 +8.6%', target:'activity-participation'},
        {key:'coupon', label:'发放卡券数', value:'1,986', note:'含VIN共享券 316', target:'coupon-claim'},
        {key:'rate', label:'SA活动转化率', value:'34.8%', note:'参与数 / 识别用户数', target:'activity-participation'}
      ],
      trend: [
        {day:'07-11', scan:310, participation:102}, {day:'07-12', scan:365, participation:126},
        {day:'07-13', scan:402, participation:138}, {day:'07-14', scan:438, participation:155},
        {day:'07-15', scan:501, participation:176}, {day:'07-16', scan:552, participation:205},
        {day:'07-17', scan:672, participation:224}
      ],
      ranks: [
        {name:'陈晓明', value:286}, {name:'李佳', value:241}, {name:'周凯', value:198}, {name:'王敏', value:176}, {name:'赵晨', value:142}
      ],
      rows: [
        {saId:'SA10086',saName:'陈晓明',store:'广州花都专营店',activityId:'ACT-SA-20260701',activity:'夏季养护礼遇',level:'绑车级',type:'直接领券',scanUv:748,eligible:426,participation:286,coupons:532,rate:'38.2%',last:'2026-07-17 09:42:18'},
        {saId:'SA10023',saName:'李佳',store:'佛山南海专营店',activityId:'ACT-SA-20260702',activity:'认证车主焕新礼',level:'认证级',type:'直接领券',scanUv:621,eligible:355,participation:241,coupons:418,rate:'38.8%',last:'2026-07-17 09:31:04'},
        {saId:'SA10045',saName:'周凯',store:'东莞寮步专营店',activityId:'ACT-SA-20260703',activity:'到店保养抽奖季',level:'号码级',type:'自动抽奖',scanUv:566,eligible:498,participation:198,coupons:136,rate:'35.0%',last:'2026-07-17 09:08:27'},
        {saId:'SA10061',saName:'王敏',store:'深圳龙岗专营店',activityId:'ACT-SA-20260704',activity:'老友焕新券包',level:'绑车级',type:'直接领券',scanUv:493,eligible:301,participation:176,coupons:352,rate:'35.7%',last:'2026-07-17 08:51:32'},
        {saId:'SA10072',saName:'赵晨',store:'广州番禺专营店',activityId:'ACT-SA-20260703',activity:'到店保养抽奖季',level:'号码级',type:'自动抽奖',scanUv:416,eligible:362,participation:142,coupons:98,rate:'34.1%',last:'2026-07-17 08:36:10'}
      ]
    },
    qrRows: [
      {sceneId:'SCN-20260717-10086-0088',saId:'SA10086',saName:'陈晓明',store:'广州花都专营店',scope:'部分活动',count:4,version:'V3',generated:'2026-07-17 09:20:00',expires:'2026-07-17 09:50:00',status:'有效',scanPv:86,scanUv:72,identified:69,participation:31,coupons:58,previous:'SCN-20260717-10086-0087',next:'-'},
      {sceneId:'SCN-20260717-10023-0061',saId:'SA10023',saName:'李佳',store:'佛山南海专营店',scope:'全部活动',count:7,version:'V5',generated:'2026-07-17 08:40:00',expires:'2026-07-17 09:10:00',status:'已过期',scanPv:114,scanUv:98,identified:95,participation:43,coupons:72,previous:'-',next:'-'},
      {sceneId:'SCN-20260717-10045-0042',saId:'SA10045',saName:'周凯',store:'东莞寮步专营店',scope:'部分活动',count:3,version:'V2',generated:'2026-07-17 08:20:00',expires:'2026-07-17 08:50:00',status:'重新生成失效',scanPv:47,scanUv:39,identified:38,participation:16,coupons:11,previous:'-',next:'SCN-20260717-10045-0043'},
      {sceneId:'SCN-20260717-10061-0037',saId:'SA10061',saName:'王敏',store:'深圳龙岗专营店',scope:'部分活动',count:5,version:'V4',generated:'2026-07-17 07:55:00',expires:'2026-07-17 08:25:00',status:'已过期',scanPv:92,scanUv:81,identified:77,participation:29,coupons:56,previous:'-',next:'-'},
      {sceneId:'SCN-20260716-10086-0087',saId:'SA10086',saName:'陈晓明',store:'广州花都专营店',scope:'部分活动',count:4,version:'V3',generated:'2026-07-16 16:20:00',expires:'2026-07-16 16:50:00',status:'重新生成失效',scanPv:133,scanUv:109,identified:105,participation:48,coupons:86,previous:'-',next:'SCN-20260717-10086-0088'},
      {sceneId:'SCN-20260716-10072-0026',saId:'SA10072',saName:'赵晨',store:'广州番禺专营店',scope:'全部活动',count:6,version:'V3',generated:'2026-07-16 15:45:00',expires:'2026-07-16 16:15:00',status:'已过期',scanPv:76,scanUv:65,identified:62,participation:24,coupons:19,previous:'-',next:'-'}
    ],
    participationRows: [
      {id:'PAR-20260717-009812',activityId:'ACT-SA-20260701',activity:'夏季养护礼遇',level:'绑车级',type:'直接领券',oneId:'OID****8862',mobile:'138****5678',vin:'LVH******1234',subject:'VIN尾号1234',sa:'陈晓明 SA10086',store:'广州花都专营店',sceneId:'SCN-20260717-10086-0088',scanId:'SCAN-240717-658812',participated:'2026-07-17 09:42:18',confirmed:'2026-07-17 09:42:18',result:'领取成功',couponCount:2,coupons:['CPN-66002818','CPN-66002819'],validation:['oneID识别：通过','当前VIN绑定关系：通过','绑车级参与唯一性：通过']},
      {id:'PAR-20260717-009811',activityId:'ACT-SA-20260703',activity:'到店保养抽奖季',level:'号码级',type:'自动抽奖',oneId:'OID****1087',mobile:'186****2190',vin:'-',subject:'oneID尾号1087',sa:'周凯 SA10045',store:'东莞寮步专营店',sceneId:'SCN-20260717-10045-0043',scanId:'SCAN-240717-658807',participated:'2026-07-17 09:39:06',confirmed:'2026-07-17 09:39:06',result:'未中奖',couponCount:0,coupons:[],validation:['oneID识别：通过','号码级参与唯一性：通过','抽奖资格：通过']},
      {id:'PAR-20260717-009808',activityId:'ACT-SA-20260702',activity:'认证车主焕新礼',level:'认证级',type:'直接领券',oneId:'OID****3521',mobile:'139****6308',vin:'LGB******7789',subject:'认证人车尾号3521/7789',sa:'李佳 SA10023',store:'佛山南海专营店',sceneId:'SCN-20260717-10023-0061',scanId:'SCAN-240717-658796',participated:'2026-07-17 09:31:04',confirmed:'2026-07-17 09:31:04',result:'领取成功',couponCount:1,coupons:['CPN-66002794'],validation:['oneID识别：通过','认证关系1:1：通过','认证级参与唯一性：通过']},
      {id:'PAR-20260717-009802',activityId:'ACT-SA-20260703',activity:'到店保养抽奖季',level:'号码级',type:'自动抽奖',oneId:'OID****7750',mobile:'135****0241',vin:'-',subject:'oneID尾号7750',sa:'王敏 SA10061',store:'深圳龙岗专营店',sceneId:'SCN-20260717-10061-0037',scanId:'SCAN-240717-658752',participated:'2026-07-17 09:16:43',confirmed:'2026-07-17 09:16:43',result:'中奖',couponCount:1,coupons:['CPN-66002768'],validation:['oneID识别：通过','号码级参与唯一性：通过','抽奖资格：通过']},
      {id:'PAR-20260717-009795',activityId:'ACT-SA-20260704',activity:'老友焕新券包',level:'绑车级',type:'直接领券',oneId:'OID****4276',mobile:'188****4472',vin:'LGB******9066',subject:'VIN尾号9066',sa:'王敏 SA10061',store:'深圳龙岗专营店',sceneId:'SCN-20260717-10061-0037',scanId:'SCAN-240717-658716',participated:'2026-07-17 09:02:12',confirmed:'2026-07-17 09:02:12',result:'领取成功',couponCount:2,coupons:['CPN-66002721','CPN-66002722'],validation:['oneID识别：通过','当前VIN绑定关系：通过','绑车级参与唯一性：通过']},
      {id:'PAR-20260717-009786',activityId:'ACT-SA-20260701',activity:'夏季养护礼遇',level:'绑车级',type:'直接领券',oneId:'OID****5098',mobile:'137****8106',vin:'LVH******6620',subject:'VIN尾号6620',sa:'陈晓明 SA10086',store:'广州花都专营店',sceneId:'SCN-20260717-10086-0088',scanId:'SCAN-240717-658674',participated:'2026-07-17 08:48:55',confirmed:'2026-07-17 08:48:55',result:'领取成功',couponCount:2,coupons:['CPN-66002686','CPN-66002687'],validation:['oneID识别：通过','当前VIN绑定关系：通过','绑车级参与唯一性：通过']}
    ],
    couponOverview: {
      kpis: [
        {key:'issued',label:'发放卡券数',value:'1,986',note:'VIN共享券 316',target:'coupon-claim'},
        {key:'active',label:'已激活数',value:'1,430',note:'激活率 72.0%',target:'coupon-claim'},
        {key:'redeemed',label:'已核销数',value:'682',note:'较上期 +9.2%',target:'coupon-redeem'},
        {key:'redemptionRate',label:'卡券核销率',value:'34.3%',note:'核销数 / 发放数',target:'coupon-redeem'},
        {key:'cross',label:'跨店核销数',value:'96',note:'占核销数 14.1%',target:'coupon-redeem'}
      ],
      funnel:[{label:'发放',value:1986},{label:'激活',value:1430},{label:'核销',value:682}],
      ranks:[{name:'陈晓明',value:188},{name:'李佳',value:152},{name:'周凯',value:126},{name:'王敏',value:109},{name:'赵晨',value:88}],
      rows:[
        {sa:'陈晓明 SA10086',store:'广州花都专营店',couponId:'TPL-CP-10021',coupon:'基础保养抵扣券',activity:'夏季养护礼遇',mode:'直接领券',issued:532,active:421,redeemed:188,expired:21,redemptionRate:'35.3%',cross:26,last:'2026-07-17 09:41:06'},
        {sa:'李佳 SA10023',store:'佛山南海专营店',couponId:'TPL-CP-10018',coupon:'精品代金券',activity:'认证车主焕新礼',mode:'直接领券',issued:418,active:326,redeemed:152,expired:18,redemptionRate:'36.4%',cross:19,last:'2026-07-17 09:28:42'},
        {sa:'周凯 SA10045',store:'东莞寮步专营店',couponId:'TPL-CP-10025',coupon:'到店检测券',activity:'到店保养抽奖季',mode:'抽奖中奖',issued:136,active:131,redeemed:126,expired:3,redemptionRate:'92.6%',cross:22,last:'2026-07-17 09:15:37'},
        {sa:'王敏 SA10061',store:'深圳龙岗专营店',couponId:'TPL-CP-10029',coupon:'保养工时折扣券',activity:'老友焕新券包',mode:'直接领券',issued:352,active:281,redeemed:109,expired:14,redemptionRate:'31.0%',cross:17,last:'2026-07-17 08:58:26'},
        {sa:'赵晨 SA10072',store:'广州番禺专营店',couponId:'TPL-CP-10025',coupon:'到店检测券',activity:'到店保养抽奖季',mode:'抽奖中奖',issued:98,active:93,redeemed:88,expired:2,redemptionRate:'89.8%',cross:12,last:'2026-07-17 08:34:11'}
      ]
    },
    claimRows: [
      {id:'CPN-66002818',templateId:'TPL-CP-10021',coupon:'基础保养抵扣券',activityId:'ACT-SA-20260701',activity:'夏季养护礼遇',mode:'直接领券',oneId:'OID****8862',mobile:'138****5678',owner:'VIN',vin:'LVH******1234',boundCount:2,sa:'陈晓明 SA10086',store:'广州花都专营店',sceneId:'SCN-20260717-10086-0088',scanId:'SCAN-240717-658812',claimed:'2026-07-17 09:42:18',confirmed:'2026-07-17 09:42:18',status:'未激活',participationId:'PAR-20260717-009812'},
      {id:'CPN-66002819',templateId:'TPL-CP-10025',coupon:'到店检测券',activityId:'ACT-SA-20260701',activity:'夏季养护礼遇',mode:'直接领券',oneId:'OID****8862',mobile:'138****5678',owner:'VIN',vin:'LVH******1234',boundCount:2,sa:'陈晓明 SA10086',store:'广州花都专营店',sceneId:'SCN-20260717-10086-0088',scanId:'SCAN-240717-658812',claimed:'2026-07-17 09:42:18',confirmed:'2026-07-17 09:42:18',status:'已激活',participationId:'PAR-20260717-009812'},
      {id:'CPN-66002794',templateId:'TPL-CP-10018',coupon:'精品代金券',activityId:'ACT-SA-20260702',activity:'认证车主焕新礼',mode:'直接领券',oneId:'OID****3521',mobile:'139****6308',owner:'认证关系',vin:'LGB******7789',boundCount:1,sa:'李佳 SA10023',store:'佛山南海专营店',sceneId:'SCN-20260717-10023-0061',scanId:'SCAN-240717-658796',claimed:'2026-07-17 09:31:04',confirmed:'2026-07-17 09:31:04',status:'未激活',participationId:'PAR-20260717-009808'},
      {id:'CPN-66002768',templateId:'TPL-CP-10025',coupon:'到店检测券',activityId:'ACT-SA-20260703',activity:'到店保养抽奖季',mode:'抽奖中奖',oneId:'OID****7750',mobile:'135****0241',owner:'oneID',vin:'-',boundCount:0,sa:'王敏 SA10061',store:'深圳龙岗专营店',sceneId:'SCN-20260717-10061-0037',scanId:'SCAN-240717-658752',claimed:'2026-07-17 09:16:43',confirmed:'2026-07-17 09:16:43',status:'已核销',participationId:'PAR-20260717-009802'},
      {id:'CPN-66002721',templateId:'TPL-CP-10029',coupon:'保养工时折扣券',activityId:'ACT-SA-20260704',activity:'老友焕新券包',mode:'直接领券',oneId:'OID****4276',mobile:'188****4472',owner:'VIN',vin:'LGB******9066',boundCount:3,sa:'王敏 SA10061',store:'深圳龙岗专营店',sceneId:'SCN-20260717-10061-0037',scanId:'SCAN-240717-658716',claimed:'2026-07-17 09:02:12',confirmed:'2026-07-17 09:02:12',status:'已激活',participationId:'PAR-20260717-009795'},
      {id:'CPN-66002686',templateId:'TPL-CP-10021',coupon:'基础保养抵扣券',activityId:'ACT-SA-20260701',activity:'夏季养护礼遇',mode:'直接领券',oneId:'OID****5098',mobile:'137****8106',owner:'VIN',vin:'LVH******6620',boundCount:2,sa:'陈晓明 SA10086',store:'广州花都专营店',sceneId:'SCN-20260717-10086-0088',scanId:'SCAN-240717-658674',claimed:'2026-07-17 08:48:55',confirmed:'2026-07-17 08:48:55',status:'已核销',participationId:'PAR-20260717-009786'}
    ],
    redemptionRows: [
      {id:'RED-20260717-001986',couponId:'CPN-66002768',coupon:'到店检测券',activity:'到店保养抽奖季',sa:'王敏 SA10061',sourceStore:'深圳龙岗专营店',owner:'oneID尾号7750',actualUser:'135****0241',redeemStore:'深圳龙岗专营店',cross:'否',order:'SO-20260717-883621',redeemed:'2026-07-17 09:24:10',amount:'¥200.00',subsidy:'¥80.00',status:'核销成功'},
      {id:'RED-20260717-001978',couponId:'CPN-66002686',coupon:'基础保养抵扣券',activity:'夏季养护礼遇',sa:'陈晓明 SA10086',sourceStore:'广州花都专营店',owner:'VIN尾号6620',actualUser:'137****8106',redeemStore:'佛山南海专营店',cross:'是',order:'SO-20260717-883540',redeemed:'2026-07-17 09:06:31',amount:'¥500.00',subsidy:'¥150.00',status:'核销成功'},
      {id:'RED-20260717-001965',couponId:'CPN-66002652',coupon:'精品代金券',activity:'认证车主焕新礼',sa:'李佳 SA10023',sourceStore:'佛山南海专营店',owner:'认证VIN尾号7789',actualUser:'139****6308',redeemStore:'佛山南海专营店',cross:'否',order:'SO-20260717-883426',redeemed:'2026-07-17 08:45:18',amount:'¥800.00',subsidy:'¥200.00',status:'核销成功'},
      {id:'RED-20260717-001952',couponId:'CPN-66002611',coupon:'保养工时折扣券',activity:'老友焕新券包',sa:'王敏 SA10061',sourceStore:'深圳龙岗专营店',owner:'VIN尾号9066',actualUser:'188****4472',redeemStore:'东莞寮步专营店',cross:'是',order:'SO-20260717-883305',redeemed:'2026-07-17 08:28:09',amount:'¥360.00',subsidy:'¥90.00',status:'核销成功'},
      {id:'RED-20260716-001911',couponId:'CPN-66002498',coupon:'到店检测券',activity:'到店保养抽奖季',sa:'周凯 SA10045',sourceStore:'东莞寮步专营店',owner:'oneID尾号1087',actualUser:'186****2190',redeemStore:'东莞寮步专营店',cross:'否',order:'SO-20260716-881928',redeemed:'2026-07-16 17:32:44',amount:'¥180.00',subsidy:'¥60.00',status:'已撤销'},
      {id:'RED-20260716-001884',couponId:'CPN-66002447',coupon:'基础保养抵扣券',activity:'夏季养护礼遇',sa:'陈晓明 SA10086',sourceStore:'广州花都专营店',owner:'VIN尾号1234',actualUser:'138****5678',redeemStore:'广州花都专营店',cross:'否',order:'SO-20260716-881604',redeemed:'2026-07-16 16:58:20',amount:'¥520.00',subsidy:'¥150.00',status:'核销成功'}
    ]
  };
})();
