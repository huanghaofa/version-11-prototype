(function () {
  'use strict';

  window.PrototypeData = {
    couponTemplate: {
      templateId: 'TPL-240724-001',
      name: 'BIMC 组合保养备件折扣券',
      scene: 'BIMC（新）',
      couponType: '组合折扣券',
      applicableType: '备件',
      faceValue: 100,
      discountRate: 8,
      discountMode: '组合商品共用折扣',
      redemptionMode: '一次性批量核销',
      status: '草稿',
      combinationMode: 'grouped',
      nextCombinationSeq: 3,
      combinations: [
        {
          combinationId: 'COMB-01',
          name: '组合一',
          items: [
            { code: 'BP-10021', name: '机油滤芯', spec: 'DFN 原厂标准型', minQty: 2, unitPrice: 200 },
            { code: 'BP-10035', name: '空气滤芯', spec: 'DFN 原厂标准型', minQty: 1, unitPrice: 150 }
          ]
        },
        {
          combinationId: 'COMB-02',
          name: '组合二',
          items: [
            { code: 'BP-10049', name: '空调滤芯', spec: '活性炭型', minQty: 1, unitPrice: 180 }
          ]
        }
      ],
      freeItems: [
        { code: 'BP-10021', name: '机油滤芯', spec: 'DFN 原厂标准型', maxQty: 2, unitPrice: 200 },
        { code: 'BP-10035', name: '空气滤芯', spec: 'DFN 原厂标准型', maxQty: 1, unitPrice: 150 },
        { code: 'BP-10049', name: '空调滤芯', spec: '活性炭型', maxQty: 1, unitPrice: 180 }
      ]
    },
    itemCatalog: [
      { code: 'BP-10021', name: '机油滤芯', spec: 'DFN 原厂标准型', unitPrice: 200 },
      { code: 'BP-10035', name: '空气滤芯', spec: 'DFN 原厂标准型', unitPrice: 150 },
      { code: 'BP-10049', name: '空调滤芯', spec: '活性炭型', unitPrice: 180 },
      { code: 'BP-10063', name: '发动机空气滤清器', spec: '2.0L 适用', unitPrice: 210 },
      { code: 'BP-10077', name: '雨刮片套装', spec: '前挡套装', unitPrice: 260 }
    ],
    excelImportPreview: {
      grouped: [
        { row: 2, groupName: '组合三', code: 'BP-10063', qty: 1, valid: true, reason: '校验通过' },
        { row: 3, groupName: '组合三', code: 'BP-10077', qty: 2, valid: true, reason: '校验通过' },
        { row: 4, groupName: '组合四', code: 'BP-10035', qty: 1, valid: true, reason: '校验通过' },
        { row: 5, groupName: '组合四', code: 'BP-99999', qty: 1, valid: false, reason: '商品编码不存在' }
      ],
      free: [
        { row: 2, code: 'BP-10021', qty: 2, valid: true, reason: '校验通过' },
        { row: 3, code: 'BP-10035', qty: 1, valid: true, reason: '校验通过' },
        { row: 4, code: 'BP-10077', qty: 1, valid: true, reason: '校验通过' },
        { row: 5, code: 'BP-99999', qty: 0, valid: false, reason: '商品编码不存在；数量必须大于 0' }
      ]
    }
  };
})();
