(function () {
  'use strict';

  /*
   * 下拉枚举证据口径：
   * 1. SIT 截图/已记录页面值优先；
   * 2. Axure 仅补充分支和历史命名；
   * 3. 区域、门店等数据量很大的枚举仅放入可验证的演示子集，不冒充全量生产字典。
   */
  window.PrototypeEnums = {
    evidence: {
      capturedAt: '2026-07-16',
      primary: 'SIT 只读截图、SIT 列表可见值与本次页面分析记录',
      secondary: '卡券中心 Axure 导出中的业务场景切换、券型页面与状态流程',
      limitation: '当前浏览器安全策略未允许读取 SIT 下拉展开后的 DOM；大区、小区、专营店为可验证演示子集，不代表完整组织字典。'
    },

    labelMap: {
      '品牌': 'brand',
      '活动状态': 'activityStatus',
      '业务子版块': 'activitySubmodule',
      '触发方式': 'triggerMode',
      '启用状态': 'enabledStatus',
      '窗口状态': 'enabledStatus',
      '页面渠道': 'pageChannel',
      '业务场景': 'businessScenario',
      '主场景': 'mainScenario',
      '子场景': 'subScenario',
      '卡券分类': 'couponCategory',
      '核销方式': 'writeoffMethod',
      '创券来源': 'couponSource',
      '任务状态': 'taskStatus',
      '发放状态': 'issueStatus',
      '核销状态': 'writeoffStatus',
      '激活状态': 'activationStatus',
      '当前状态': 'genericStatus',
      '状态': 'genericStatus',
      '大区': 'region',
      '小区': 'subregion',
      '专营店': 'dealer',
      '省份/城市': 'city',
      '领券窗口': 'redemptionWindow',
      '卡券栏目': 'couponColumn',
      '结算规则': 'settlementRule'
    },

    options: {
      brand: ['东风日产', '启辰', '英菲尼迪'],
      activityStatus: ['草稿', '未开始', '进行中', '已结束', '已关闭'],
      activitySubmodule: ['会员权益', '维保活动', '续保活动', '取送车活动'],
      triggerMode: ['后台统一推送', '用户行为触发', 'C端主动参与', 'C端主动领取'],
      enabledStatus: ['启用', '停用'],
      pageChannel: ['APP', '微信小程序', '服务号'],
      businessScenario: ['售前营销', '售后营销', '售后营销-上门取送车', '商城营销'],
      mainScenario: ['售前营销', '售后营销', '售后营销-上门取送车', '商城营销'],
      couponCategory: ['代金券', '折扣券', '满减券', '礼品券', '权益券', '金融券', '虚拟卡券'],
      writeoffMethod: ['线上核销', '线下核销', '不需要核销'],
      couponSource: ['卡券中心', '活动中心'],
      taskStatus: ['待执行', '执行中', '执行完成', '部分失败'],
      issueStatus: ['待发放', '发放中', '发放成功', '发放失败'],
      writeoffStatus: ['未核销', '已核销', '已撤销'],
      activationStatus: ['待激活', '已激活', '已失效'],
      genericStatus: ['草稿', '待启用', '启用', '停用', '进行中', '已结束'],
      settlementRule: ['线上结算', '线下结算', '无需结算']
    },

    cascades: {
      subScenario: {
        parentKey: 'mainScenario',
        values: {
          '售前营销': ['在线购车', '节点营销', 'CAP活动', '直播活动', '区域活动', '试驾', '新车上市'],
          '售后营销': ['维保活动', '续保活动'],
          '售后营销-上门取送车': ['取送车活动'],
          '商城营销': ['会员商城(新)', '新商城']
        }
      },
      couponCategory: {
        parentKey: 'businessScenario',
        values: {
          '售前营销': ['代金券', '折扣券', '满减券', '权益券', '金融券'],
          '售后营销': ['代金券', '折扣券', '满减券', '礼品券', '权益券'],
          '售后营销-上门取送车': ['代金券', '权益券'],
          '商城营销': ['代金券', '折扣券', '满减券', '礼品券', '虚拟卡券']
        }
      },
      region: {
        parentKey: 'brand',
        values: {
          '东风日产': ['华南大区', '华中大区'],
          '启辰': ['华中大区']
        }
      },
      subregion: {
        parentKey: 'region',
        values: {
          '华南大区': ['广东小区'],
          '华中大区': ['湖北小区']
        }
      },
      dealer: {
        parentKey: 'subregion',
        values: {
          '广东小区': ['广州东风南方（演示）', '佛山东风南方（演示）'],
          '湖北小区': ['武汉东风南方（演示）']
        }
      },
      city: {
        parentKey: 'subregion',
        values: {
          '广东小区': ['广州', '佛山'],
          '湖北小区': ['武汉']
        }
      },
      redemptionWindow: {
        parentKey: 'brand',
        values: {
          '东风日产': ['东风日产领券中心'],
          '启辰': ['启辰领券中心']
        }
      },
      couponColumn: {
        parentKey: 'redemptionWindow',
        values: {
          '东风日产领券中心': ['购车优惠', '维保优惠', '车主专享'],
          '启辰领券中心': ['维保优惠', '车主专享']
        }
      }
    }
  };
})();
