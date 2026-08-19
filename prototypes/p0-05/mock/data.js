(function () {
  'use strict';

  window.MockData = {
    summary: {
      activeConfigs: 3,
      referencedActivities: 10,
      issuedPoints: 1286500,
      exceptionRecords: 7
    },
    configStats: [
      { label: '预算使用率', value: '76.8%', tone: 'warning' },
      { label: '今日成功积分', value: '36,800', tone: 'success' },
      { label: '待人工处理', value: '3', tone: 'danger' }
    ],
    pointConfigs: [
      { id: 'PC-2026-001', name: '保客活动认证积分100', version: 'V3', points: 100, mainScenario: '售后营销', subScenario: '维保活动', budgetNo: 'YS-SH-2026-001', sceneCode: 'ACT_OWNER_REWARD', costCenter: 'CC-SH-1001', totalBudget: 2000000, usedBudget: 1536200, warning: 90, start: '2026-07-01', end: '2026-12-31', status: '已启用', owner: '售后运营中心', referenced: 4 },
      { id: 'PC-2026-002', name: '认证抽奖一等奖1000', version: 'V1', points: 1000, mainScenario: '售前营销', subScenario: '节点营销', budgetNo: 'YS-MKT-2026-016', sceneCode: 'ACT_LOTTERY_HIGH', costCenter: 'CC-MKT-2001', totalBudget: 500000, usedBudget: 352000, warning: 90, start: '2026-07-15', end: '2026-10-31', status: '已启用', owner: '市场营销部', referenced: 2 },
      { id: 'PC-2026-003', name: '认证抽奖二等奖500', version: 'V2', points: 500, mainScenario: '售前营销', subScenario: '区域活动', budgetNo: 'YS-MKT-2026-016', sceneCode: 'ACT_LOTTERY_MID', costCenter: 'CC-MKT-2001', totalBudget: 600000, usedBudget: 546000, warning: 90, start: '2026-07-15', end: '2026-10-31', status: '已启用', owner: '市场营销部', referenced: 3 },
      { id: 'PC-2026-004', name: '预约维保认证积分200', version: 'V1', points: 200, mainScenario: '售后营销', subScenario: '维保活动', budgetNo: 'YS-AS-2026-033', sceneCode: 'ACT_BOOKING_MAINTAIN', costCenter: 'CC-AS-3102', totalBudget: 800000, usedBudget: 800000, warning: 90, start: '2026-06-01', end: '2026-09-30', status: '已停用', owner: '售后服务部', referenced: 1 },
      { id: 'PC-2026-005', name: '外品牌获客积分300', version: 'V1', points: 300, mainScenario: '售前营销', subScenario: '试驾', budgetNo: 'YS-GROWTH-2026-008', sceneCode: 'ACT_CONQUEST', costCenter: 'CC-GR-4008', totalBudget: 300000, usedBudget: 0, warning: 70, start: '2026-08-01', end: '2026-11-30', status: '待审核', owner: '用户增长部', referenced: 0 },
      { id: 'PC-2026-006', name: '会员日认证积分50', version: 'V1', points: 50, mainScenario: '商城营销', subScenario: '会员商城(新)', budgetNo: 'YS-MEMBER-2026-012', sceneCode: 'ACT_MEMBER_DAY', costCenter: 'CC-MB-1201', totalBudget: 150000, usedBudget: 0, warning: 90, start: '2026-08-01', end: '2026-12-31', status: '草稿', owner: '会员运营部', referenced: 0 }
    ],
    configVersions: [
      { version: 'V3', points: 100, budgetNo: 'YS-SH-2026-001', changed: '业务场景按卡券中心枚举调整为售后营销 / 维保活动', operator: '张运营', time: '2026-07-18 10:20', status: '当前版本' },
      { version: 'V2', points: 100, budgetNo: 'YS-SH-2026-001', changed: '积分数量调整为100', operator: '李审核', time: '2026-07-01 09:30', status: '历史版本' },
      { version: 'V1', points: 100, budgetNo: 'YS-SH-2026-001', changed: '首次启用', operator: '张运营', time: '2026-06-25 16:40', status: '历史版本' }
    ],
    activities: [
      { id: 'ACT-2026-0718', name: '夏日车主关怀抽奖', level: '认证级', play: '抽奖', status: '进行中', configId: 'PC-2026-002', configVersion: 'V1' },
      { id: 'ACT-2026-0701', name: '保客回厂积分礼遇', level: '认证级', play: '行为触发', status: '进行中', configId: 'PC-2026-001', configVersion: 'V3' },
      { id: 'ACT-2026-0620', name: '预约维保积分回馈', level: '认证级', play: '直接奖励', status: '已暂停', configId: 'PC-2026-004', configVersion: 'V1' }
    ],
    rewardRecords: [
      { id: 'RW-20260722-0001', activity: '保客回厂积分礼遇', oneId: 'ONE-683921', mobile: '138****2198', vin: 'LGBM4AE48MS000128', config: '保客活动认证积分100', version: 'V3', points: 100, mainScenario: '售后营销', subScenario: '维保活动', budgetNo: 'YS-SH-2026-001', sceneCode: 'ACT_OWNER_REWARD', costCenter: 'CC-SH-1001', requestId: 'REQ-ACT0701-683921-01', transactionId: 'PTS-260722-890012', status: '成功', created: '2026-07-22 09:31:20', reason: '-', retries: 0 },
      { id: 'RW-20260722-0002', activity: '夏日车主关怀抽奖', oneId: 'ONE-119230', mobile: '186****5033', vin: 'LGBH52E04NS001736', config: '认证抽奖一等奖1000', version: 'V1', points: 1000, mainScenario: '售前营销', subScenario: '节点营销', budgetNo: 'YS-MKT-2026-016', sceneCode: 'ACT_LOTTERY_HIGH', costCenter: 'CC-MKT-2001', requestId: 'REQ-ACT0718-119230-01', transactionId: 'PTS-260722-890021', status: '成功', created: '2026-07-22 10:04:51', reason: '-', retries: 0 },
      { id: 'RW-20260722-0003', activity: '保客回厂积分礼遇', oneId: 'ONE-872311', mobile: '139****6671', vin: 'LGBM2DE43PS003908', config: '保客活动认证积分100', version: 'V3', points: 100, mainScenario: '售后营销', subScenario: '维保活动', budgetNo: 'YS-SH-2026-001', sceneCode: 'ACT_OWNER_REWARD', costCenter: 'CC-SH-1001', requestId: 'REQ-ACT0701-872311-01', transactionId: '-', status: '发放中', created: '2026-07-22 10:12:03', reason: '积分系统处理中', retries: 0 },
      { id: 'RW-20260722-0004', activity: '夏日车主关怀抽奖', oneId: 'ONE-220431', mobile: '137****8820', vin: 'LGBH52E02NS005611', config: '认证抽奖二等奖500', version: 'V2', points: 500, mainScenario: '售前营销', subScenario: '区域活动', budgetNo: 'YS-MKT-2026-016', sceneCode: 'ACT_LOTTERY_MID', costCenter: 'CC-MKT-2001', requestId: 'REQ-ACT0718-220431-01', transactionId: '-', status: '失败', created: '2026-07-22 10:18:44', reason: 'P102：积分系统拒绝发放', retries: 2 },
      { id: 'RW-20260722-0005', activity: '保客回厂积分礼遇', oneId: 'ONE-500177', mobile: '188****1066', vin: 'LGBM4AE46MS009812', config: '保客活动认证积分100', version: 'V3', points: 100, mainScenario: '售后营销', subScenario: '维保活动', budgetNo: 'YS-SH-2026-001', sceneCode: 'ACT_OWNER_REWARD', costCenter: 'CC-SH-1001', requestId: 'REQ-ACT0701-500177-01', transactionId: '-', status: '待人工处理', created: '2026-07-22 10:25:07', reason: 'P500：积分系统返回未知状态，已转人工', retries: 1 },
      { id: 'RW-20260721-0091', activity: '预约维保积分回馈', oneId: 'ONE-391022', mobile: '136****9031', vin: 'LGBM4AE40MS008144', config: '预约维保认证积分200', version: 'V1', points: 200, mainScenario: '售后营销', subScenario: '维保活动', budgetNo: 'YS-AS-2026-033', sceneCode: 'ACT_BOOKING_MAINTAIN', costCenter: 'CC-AS-3102', requestId: 'REQ-ACT0620-391022-02', transactionId: 'PTS-260721-889210', status: '已冲正', created: '2026-07-21 16:42:11', reason: '预留状态演示，未启用自动冲正', retries: 0 }
    ],
    reconciliationTasks: [
      { id: 'RC-20260722-01', date: '2026-07-21', mainScenario: '售后营销', subScenario: '维保活动', budgetNo: 'YS-SH-2026-001', sceneCode: 'ACT_OWNER_REWARD', costCenter: 'CC-SH-1001', localCount: 3256, remoteCount: 3256, localPoints: 325600, remotePoints: 325600, diff: 0, status: '无差异' },
      { id: 'RC-20260722-02', date: '2026-07-21', mainScenario: '售前营销', subScenario: '区域活动', budgetNo: 'YS-MKT-2026-016', sceneCode: 'ACT_LOTTERY_MID', costCenter: 'CC-MKT-2001', localCount: 1104, remoteCount: 1103, localPoints: 552000, remotePoints: 551500, diff: 500, status: '有差异' },
      { id: 'RC-20260722-03', date: '2026-07-21', mainScenario: '售后营销', subScenario: '维保活动', budgetNo: 'YS-AS-2026-033', sceneCode: 'ACT_BOOKING_MAINTAIN', costCenter: 'CC-AS-3102', localCount: 820, remoteCount: 820, localPoints: 164000, remotePoints: 164000, diff: 0, status: '已处理' }
    ]
  };
})();
