(function () {
  'use strict';

  window.MockData = {
    activityTypes: ['维保活动', '续保活动', '取送车活动', '商城售后活动', '会员活动'],
    stores: [
      { id: 'S001', code: 'GZ001', name: '东风日产广州喜龙店', brand: '东风日产', province: '广东省', city: '广州市', available: true },
      { id: 'S002', code: 'SZ003', name: '东风日产深圳东风南方店', brand: '东风日产', province: '广东省', city: '深圳市', available: true },
      { id: 'S003', code: 'FS008', name: '东风日产佛山雄峰店', brand: '东风日产', province: '广东省', city: '佛山市', available: true },
      { id: 'S004', code: 'DG006', name: '东风日产东莞东神店', brand: '东风日产', province: '广东省', city: '东莞市', available: false },
      { id: 'S005', code: 'BJ002', name: '东风日产北京华盛昌店', brand: '东风日产', province: '北京市', city: '北京市', available: true },
      { id: 'S006', code: 'BJ015', name: '东风日产北京东风南方亮马店', brand: '东风日产', province: '北京市', city: '北京市', available: true },
      { id: 'S007', code: 'SH009', name: '东风日产上海冠松店', brand: '东风日产', province: '上海市', city: '上海市', available: true },
      { id: 'S008', code: 'NJ005', name: '东风日产南京文华店', brand: '东风日产', province: '江苏省', city: '南京市', available: true },
      { id: 'S009', code: 'GZ021', name: '启辰广州东圃店', brand: '启辰', province: '广东省', city: '广州市', available: true },
      { id: 'S010', code: 'SZ019', name: '启辰深圳龙华店', brand: '启辰', province: '广东省', city: '深圳市', available: true },
      { id: 'S011', code: 'FS017', name: '启辰佛山南海店', brand: '启辰', province: '广东省', city: '佛山市', available: false },
      { id: 'S012', code: 'BJ018', name: '启辰北京五方桥店', brand: '启辰', province: '北京市', city: '北京市', available: true }
    ],
    sas: [
      { id: 'SA001', name: '王璐', employeeNo: 'SA-10086', storeId: 'S001', title: '服务顾问' },
      { id: 'SA002', name: '陈宇', employeeNo: 'SA-10127', storeId: 'S002', title: '服务顾问' },
      { id: 'SA003', name: '李明', employeeNo: 'SA-10318', storeId: 'S005', title: '续保专员' }
    ],
    activities: [
      {
        id: 'ACT-202608-001',
        name: '夏日安心出行维保礼',
        type: '维保活动',
        status: '已启用',
        validTime: '2026-08-01 至 2026-09-30',
        reward: '基础保养抵扣券',
        saPlacementEnabled: true,
        storeScope: { mode: 'SPECIFIED', storeIds: ['S001', 'S002'] },
        isEditableDemo: true
      },
      {
        id: 'ACT-202608-002',
        name: '七夕会员到店关怀',
        type: '会员活动',
        status: '已启用',
        validTime: '2026-08-10 至 2026-08-31',
        reward: '到店礼遇券',
        saPlacementEnabled: true,
        storeScope: { mode: 'ALL', storeIds: [] }
      },
      {
        id: 'ACT-202608-003',
        name: '北京区域 OEM 续保礼',
        type: '续保活动',
        status: '已启用',
        validTime: '2026-08-01 至 2026-12-31',
        reward: '续保权益礼包',
        saPlacementEnabled: true,
        storeScope: { mode: 'SPECIFIED', storeIds: ['S005', 'S006'] }
      },
      {
        id: 'ACT-202608-004',
        name: '预约保养行为触发礼',
        type: '维保活动',
        status: '已启用',
        validTime: '2026-08-01 至 2026-10-31',
        reward: '工时抵扣券',
        saPlacementEnabled: false,
        storeScope: { mode: 'ALL', storeIds: [] }
      }
    ]
  };
})();
