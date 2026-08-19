(function () {
  'use strict';

  window.MockData = {
    activity: {
      id: 'ACT-202607-0186',
      name: '东风日产夏季安心养护活动',
      status: '草稿',
      triggerType: 'C端主动参与',
      claimMode: '逐张领取',
      validPeriod: '2026-08-01 至 2026-09-30',
      mutexActivityCount: 1
    },
    primaryCoupons: [
      {
        id: 'CPN-A1021',
        name: '夏季基础保养满减券',
        type: '促销券',
        scene: '维修保养',
        faceValue: '满 600 减 100'
      },
      {
        id: 'CPN-A1022',
        name: '空调深度养护抵扣券',
        type: '促销券',
        scene: '空调养护',
        faceValue: '满 300 减 50'
      }
    ],
    candidateCoupons: [
      {
        id: 'CPN-B2001',
        name: '会员日工时叠加券',
        type: '促销券',
        scene: '维修保养',
        sourceActivity: '会员日常规活动',
        status: '已发布',
        validPeriod: '2026-07-01 至 2026-12-31'
      },
      {
        id: 'CPN-B2002',
        name: '日产会员积分权益券',
        type: '权益券',
        scene: '会员权益',
        sourceActivity: '会员权益常驻活动',
        status: '已发布',
        validPeriod: '2026-01-01 至 2026-12-31'
      },
      {
        id: 'CPN-B2003',
        name: '轮胎焕新专项券',
        type: '促销券',
        scene: '轮胎服务',
        sourceActivity: '轮胎焕新季',
        status: '已发布',
        validPeriod: '2026-08-01 至 2026-10-31'
      },
      {
        id: 'CPN-B2004',
        name: '刹车系统养护券',
        type: '促销券',
        scene: '刹车养护',
        sourceActivity: '安全出行季',
        status: '已发布',
        validPeriod: '2026-07-15 至 2026-09-30'
      },
      {
        id: 'CPN-B2005',
        name: '空调滤芯更换券',
        type: '促销券',
        scene: '空调养护',
        sourceActivity: '清凉一夏',
        status: '已发布',
        validPeriod: '2026-06-01 至 2026-09-30'
      },
      {
        id: 'CPN-B2006',
        name: '保险续保到店礼券',
        type: '权益券',
        scene: '续保',
        sourceActivity: '续保客户关怀',
        status: '已发布',
        validPeriod: '2026-01-01 至 2026-12-31'
      },
      {
        id: 'CPN-B2007',
        name: '春季检测活动券',
        type: '促销券',
        scene: '车辆检测',
        sourceActivity: '春季检测活动',
        status: '已失效',
        validPeriod: '2026-03-01 至 2026-05-31'
      }
    ],
    initialRule: {
      mode: 'partialBoth',
      stackScope: 'specified',
      mutexScope: 'specified',
      stackCouponIds: ['CPN-B2001', 'CPN-B2002'],
      mutexCouponIds: ['CPN-B2003', 'CPN-B2004', 'CPN-B2005']
    },
    batchImport: {
      maxRows: 1000,
      maxFileSizeMB: 5,
      acceptedExtensions: '.xlsx, .xls, .csv',
      sampleFileName: '卡券关系导入示例.xlsx',
      sampleIds: {
        stack: ['CPN-B2006', 'CPN-B2003', 'CPN-B2007', 'CPN-B9999', 'CPN-B2006', 'CPN-B2001'],
        mutex: ['CPN-B2006', 'CPN-B2001', 'CPN-B2007', 'CPN-B9999', 'CPN-B2006', 'CPN-B2003']
      }
    }
  };
})();
