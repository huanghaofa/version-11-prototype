(function () {
  'use strict';

  window.MockData = {
    subsidies: [
      {
        id: 'DEMO-CPN-001', code: 'DEMO-REDEEM-0001', documentNo: 'DEMO-ORDER-001',
        vin: 'DEMO-VIN-001', phone: '—', oneId: '—', channel: '线上', source: '新商城',
        ruleId: 'RULE-ONLINE-01', ruleName: '商城精品券补贴规则', documentStatus: '部分退款',
        settlementStatus: '未结算', redeemedAt: '2026-08-18 10:26:32', syncedAt: '2026-08-19 02:05:18',
        details: [
          { type: '商品', itemId: 'SKU-ACC-10086', itemName: '原厂行车记录仪', quantity: 1, discount: 200, expected: 120, actual: null },
          { type: '商品', itemId: 'SKU-ACC-10092', itemName: '原厂后备箱垫', quantity: 1, discount: 80, expected: 0, actual: null }
        ]
      },
      {
        id: 'DEMO-CPN-002', code: 'DEMO-REDEEM-0002', documentNo: 'DEMO-ORDER-002',
        vin: '—', phone: 'DEMO-MOBILE-002', oneId: 'DEMO-ONEID-002', channel: '线上', source: '新商城',
        ruleId: 'RULE-COMMON-02', ruleName: '用户关怀通用补贴规则', documentStatus: '已完成',
        settlementStatus: '已结算', redeemedAt: '2026-08-12 15:08:44', syncedAt: '2026-08-19 02:06:02',
        details: [
          { type: '商品', itemId: 'SKU-LIFE-20201', itemName: '品牌联名保温杯', quantity: 2, discount: 100, expected: 60, actual: 60 },
          { type: '商品', itemId: 'SKU-LIFE-20209', itemName: '车载香氛补充装', quantity: 1, discount: 50, expected: 30, actual: 28 }
        ]
      },
      {
        id: 'DEMO-CPN-003', code: 'DEMO-REDEEM-0003', documentNo: 'DEMO-ORDER-003',
        vin: 'DEMO-VIN-003', phone: '—', oneId: '—', channel: '线上', source: '新商城',
        ruleId: 'RULE-ONLINE-01', ruleName: '商城精品券补贴规则', documentStatus: '已全额退款',
        settlementStatus: '无需结算', redeemedAt: '2026-08-17 09:42:10', syncedAt: '2026-08-19 02:08:45',
        details: [
          { type: '商品', itemId: 'SKU-ACC-30110', itemName: '原厂车载吸尘器', quantity: 1, discount: 0, expected: 0, actual: null }
        ]
      },
      {
        id: 'DEMO-CPN-004', code: 'DEMO-REDEEM-0004', documentNo: 'DEMO-WORKORDER-004',
        vin: 'DEMO-VIN-004', phone: '—', oneId: '—', channel: '线下', source: 'E3S',
        ruleId: 'RULE-OFFLINE-03', ruleName: '售后备件补贴规则', documentStatus: '已完工',
        settlementStatus: '已结算', redeemedAt: '2026-08-10 13:15:29', syncedAt: '2026-08-19 03:01:12',
        details: [
          { type: '备件', itemId: 'PART-OIL-5W30', itemName: '全合成发动机机油', quantity: 1, discount: 120, expected: 72, actual: 72 },
          { type: '备件', itemId: 'PART-FILTER-08', itemName: '机油滤清器', quantity: 1, discount: 30, expected: 18, actual: 18 }
        ]
      },
      {
        id: 'DEMO-CPN-005', code: 'DEMO-REDEEM-0005', documentNo: 'DEMO-WORKORDER-005',
        vin: '—', phone: 'DEMO-MOBILE-005', oneId: 'DEMO-ONEID-005', channel: '线下', source: 'E3S',
        ruleId: 'RULE-COMMON-02', ruleName: '用户关怀通用补贴规则', documentStatus: '已完工',
        settlementStatus: '未结算', redeemedAt: '2026-08-18 17:36:51', syncedAt: '2026-08-19 03:04:33',
        details: [
          { type: '备件', itemId: 'PART-WIPER-21', itemName: '前雨刮片套装', quantity: 1, discount: 80, expected: 48, actual: 48 }
        ]
      },
      {
        id: 'DEMO-CPN-006', code: 'DEMO-REDEEM-0006', documentNo: 'DEMO-ORDER-006',
        vin: 'DEMO-VIN-006', phone: '—', oneId: '—', channel: '线上', source: '新商城',
        ruleId: 'RULE-COMMON-02', ruleName: '用户关怀通用补贴规则', documentStatus: '退款期内',
        settlementStatus: '未结算', redeemedAt: '2026-08-18 20:05:16', syncedAt: '2026-08-19 02:10:11',
        details: [
          { type: '商品', itemId: 'SKU-ACC-40216', itemName: '原厂遮阳挡', quantity: 1, discount: 60, expected: 36, actual: null }
        ]
      }
    ],
    rules: [
      { id: 'RULE-ONLINE-01', name: '商城精品券补贴规则', onlineType: '比例结算', onlineValue: '60', onlineBasis: '实际优惠金额', offlineType: '固定金额', offlineValue: '0', offlineBasis: '卡券面值', status: '启用', usageCount: 2, updatedAt: '2026-08-15 16:20:08' },
      { id: 'RULE-COMMON-02', name: '用户关怀通用补贴规则', onlineType: '比例结算', onlineValue: '60', onlineBasis: '实际优惠金额', offlineType: '比例结算', offlineValue: '60', offlineBasis: '实际优惠金额', status: '启用', usageCount: 3, updatedAt: '2026-08-16 10:12:30' },
      { id: 'RULE-OFFLINE-03', name: '售后备件补贴规则', onlineType: '固定金额', onlineValue: '0', onlineBasis: '网点价', offlineType: '比例结算', offlineValue: '60', offlineBasis: '实际优惠金额', status: '启用', usageCount: 1, updatedAt: '2026-08-18 09:05:44' },
      { id: 'RULE-DRAFT-04', name: '待启用活动补贴规则', onlineType: '固定金额', onlineValue: '50', onlineBasis: '卡券面值', offlineType: '固定金额', offlineValue: '30', offlineBasis: '卡券面值', status: '停用', usageCount: 0, updatedAt: '2026-08-18 18:22:01' }
    ]
  };
})();
