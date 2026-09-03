(function () {
  'use strict';

  var labels = [
    ['functionName', '功能名称'],
    ['functionDesc', '功能说明'],
    ['permissionScope', '权限范围'],
    ['dataSource', '数据来源'],
    ['valueLogic', '取值逻辑'],
    ['fieldDesc', '字段说明'],
    ['interactionDesc', '交互说明'],
    ['judgeRule', '判断规则'],
    ['exceptionRule', '异常规则'],
    ['otherDesc', '其他说明']
  ];

  function escapeHTML(value) {
    return String(value || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function annotation(item) {
    item.desc = labels.map(function (field, index) {
      return (index + 1) + '. ' + field[1] + '：' + escapeHTML(item.sections[field[0]] || '待确认');
    }).join('<br>');
    return item;
  }

  window.AnnotationData = {
    'coupon-config': [
      annotation({
        id: '1', page: 'coupon-config', target: '[data-anno="coupon-product-type-old-friend"]',
        position: { placement: 'top-right', offsetX: -4, offsetY: 6 }, title: '老友卡适用范围类型',
        sections: {
          functionName: '老友卡适用范围类型',
          functionDesc: '在售后维保券的既有备件、工时、精品、套餐之外，增加老友卡商品关联入口。',
          permissionScope: '卡券中心建券运营角色；正式查询与配置权限待确认。',
          dataSource: '类型来自卡券中心适用范围配置；正式名称和枚举码待确认。',
          valueLogic: '点击后直接打开老友卡查询弹窗；确认后在当前区域显示已关联商品，既有四类保持原逻辑。',
          fieldDesc: '页面按钮显示“老友卡”；正式枚举码和跨系统定义仍待确认。',
          interactionDesc: '点击“老友卡”即进入查询多选弹窗；再次点击可重新查询和调整。切换既有类型进入相应业务选择入口。',
          judgeRule: '老友卡类型下需先取得并关联商品，才能完成本原型的模拟提交。',
          exceptionRule: '正式名称、业务定义和适用券型待确认；一券关联多项已由用户确认。',
          otherDesc: '本需求不修改备件、工时、精品、套餐。'
        }
      }),
      annotation({
        id: '2', page: 'coupon-config', target: '[data-anno="coupon-old-friend-query"]',
        position: { placement: 'top-left', offsetX: 4, offsetY: 0 }, title: '通过对方接口查询老友卡',
        sections: {
          functionName: '查询老友卡商品',
          functionDesc: '卡券中心必须先调用对方提供的查询能力，才能把老友卡商品关联为券的适用范围。',
          permissionScope: '卡券中心建券运营角色；接口调用权限、品牌和门店数据权限待确认。',
          dataSource: '接口文档 DNDC_NORMAL_S_SE_S070；当前页面只使用按文档字段映射的 Mock 数据。',
          valueLogic: '结果映射 carProductId、carProductCode、carProductName、serviceYear、usePrice、isEnable。',
          fieldDesc: '接口查询条件为产品编码、产品名称；pageIndex/pageSize 由分页行为承载。',
          interactionDesc: '点击“老友卡”类型本身直接打开查询弹窗，可复选多项，并演练加载、正常、空结果、失败、筛选和重置。',
          judgeRule: '筛选、重置、空结果和失败不清空已选草稿；加载中暂不允许确认。',
          exceptionRule: '示例报文冲突、完整地址、鉴权、分页响应、状态枚举、超时、重试和失败兜底待确认。',
          otherDesc: '接口文档已提供不等于接口已部署、已联调或已上线。'
        }
      }),
      annotation({
        id: '3', page: 'coupon-config', target: '[data-anno="coupon-old-friend-id-column"]',
        position: { placement: 'top-right', offsetX: -2, offsetY: 3 }, title: '产品 ID（carProductId）',
        sections: {
          functionName: '老友卡产品 ID',
          functionDesc: '接口文档返回 carProductId，可作为券适用范围的关系键候选。',
          permissionScope: '随查询结果向有权配置卡券的运营人员展示；正式可见性待确认。',
          dataSource: '用户提供的“老友卡基础数据”接口文档返回字段。',
          valueLogic: '原型使用带 MOCK 前缀的值，避免误认成真实主键。',
          fieldDesc: '字段名 carProductId、类型字符已可确认；稳定性、唯一性、必填性和对象粒度待确认。',
          interactionDesc: '随查询结果展示并在选中后回显。',
          judgeRule: '不应只用产品名称作为唯一关系键；最终保存 ID、编码或两者待确认。',
          exceptionRule: 'ID 变化、编码冲突、商品删除和版本变更的处理待确认。',
          otherDesc: '页面已显示正式物理字段名，但不把其稳定性升级为已确认规则。'
        }
      }),
      annotation({
        id: '4', page: 'coupon-config', target: '[data-anno="coupon-old-friend-confirm"]',
        position: { placement: 'top-left', offsetX: 0, offsetY: -2 }, title: '确认关联老友卡',
        sections: {
          functionName: '确认关联',
          functionDesc: '把当前选中的多项老友卡商品统一带回建券页，形成适用范围回显。',
          permissionScope: '卡券中心建券运营角色；正式权限待确认。',
          dataSource: '按 DNDC_NORMAL_S_SE_S070 返回字段映射的当前 Mock 查询结果。',
          valueLogic: '按产品 ID 去重维护弹窗草稿，确认时重新校验每项仍在接口返回集合，再统一提交。',
          fieldDesc: '逐项带回产品 ID、编码、名称、年期、用户价和启停状态；正式持久化字段及集合结构待确认。',
          interactionDesc: '复选可关联行后点击确认；已选数持续可见，未选择时提示至少选择一项。',
          judgeRule: '用户已确认支持多选，且只要是接口返回的商品均可选择；卡券中心不按 isEnable 拦截。',
          exceptionRule: '最大数量、全选/清空、跨页、排序和批量移除待确认；isEnable 枚举未知但不影响选择。',
          otherDesc: '对方系统的新增、编辑、删除和启停管理不属于本需求。'
        }
      }),
      annotation({
        id: '5', page: 'coupon-config', target: '[data-anno="coupon-selected-card-name"]',
        position: { placement: 'top-right', offsetX: 2, offsetY: -2 }, title: '已关联老友卡回显',
        sections: {
          functionName: '已关联商品回显',
          functionDesc: '在建券页逐行显示当前券关联的多项老友卡商品。',
          permissionScope: '卡券中心建券、编辑及查看角色；各角色可见与可改范围待确认。',
          dataSource: '运营从对方查询服务结果中选择的老友卡商品。',
          valueLogic: '显示关联数量，并逐项回显接口可返回的名称、编码、演示产品 ID、年期、用户价和状态。',
          fieldDesc: '产品 ID 是关系键候选；其稳定性、唯一性和正式保存方式待确认。',
          interactionDesc: '可逐项移除，也可重新查询继续选择；正式编辑生效规则待确认。',
          judgeRule: '老友卡类型下至少存在一项接口返回商品的关联后，原型才允许模拟提交。',
          exceptionRule: '商品改名、改价、删除、换版本时的展示和生效待确认；启停状态不影响卡券中心选择。',
          otherDesc: '本原型回显不代表真实数据库保存或接口回读。'
        }
      }),
      annotation({
        id: '6', page: 'coupon-config', target: '[data-anno="coupon-submit"]',
        position: { placement: 'bottom-left', offsetX: 0, offsetY: 4 }, title: '提交前关联校验',
        sections: {
          functionName: '提交卡券配置',
          functionDesc: '检查老友卡适用范围是否已关联，并提供可观察的提交反馈。',
          permissionScope: '卡券中心建券运营角色；正式提交权限和审批流程待确认。',
          dataSource: '当前页面填写内容和已关联老友卡信息。',
          valueLogic: '老友卡类型未选择任何商品时提示缺失；选择一项或多项后只完成浏览器内模拟保存。',
          fieldDesc: '本次只增加老友卡关联校验，不重写既有券字段。',
          interactionDesc: '点击提交后显示缺失提示或 Mock 保存结果。',
          judgeRule: '空关联不能通过本原型的老友卡提交路径。',
          exceptionRule: '接口失败能否保存、首次提交锁定、审批和回滚规则待确认。',
          otherDesc: '该反馈不证明卡券中心真实持久化成功。'
        }
      })
    ],
    wallet: [
      annotation({
        id: '1', page: 'wallet', target: '[data-anno="wallet-old-friend-coupon-title"]',
        position: { placement: 'top-right', offsetX: 2, offsetY: 0 }, title: '沿用既有维保券卡面',
        sections: {
          functionName: '维保券卡面展示',
          functionDesc: '卡包中的主体仍是售后维保券，并沿用知识库主分支的既有维保优惠券卡面；老友卡只作为券的适用商品。',
          permissionScope: '持有该券的 C 端用户；正式可见条件待确认。',
          dataSource: '卡券中心券实例及其老友卡适用范围关系；当前均为演示数据。',
          valueLogic: '卡面显示图片、主副标题、优惠值、使用时间、券种、渠道、状态及立即使用；均为评审 Mock。',
          fieldDesc: '正式图片、标题、副标题、优惠、状态及渠道文案仍由卡券实例配置决定。',
          interactionDesc: '点击主信息、优惠值或详细规则进入卡券详情；点击立即使用只打开评审说明。',
          judgeRule: '不能把老友卡商品本身误显示为一张券。',
          exceptionRule: '不可用、已过期、已使用和失效后的卡片状态待确认。',
          otherDesc: '同页保留既有券卡，证明本需求不扩散到其他券。'
        }
      }),
      annotation({
        id: '2', page: 'wallet', target: '[data-anno="wallet-old-friend-products"]',
        position: { placement: 'top-right', offsetX: 2, offsetY: 0 }, title: '详情中的适用商品',
        sections: {
          functionName: '适用商品回显',
          functionDesc: '在既有卡券详情的当前可见“适用商品”区域展示售后维保券关联的老友卡商品。',
          permissionScope: '持券用户；正式展示权限待确认。',
          dataSource: '券模板保存的老友卡适用范围关系。',
          valueLogic: '仅显示商品名称，多项用中文顿号连接并自动换行；没有关联内容时整字段隐藏。',
          fieldDesc: 'C 端不展示产品编码、产品 ID、年期、价格或启停状态；历史批注称“适用产品”，可见样例称“适用商品”，正式字段名待确认。',
          interactionDesc: '从卡面进入卡券详情后查看；本原型两项名称不触发超过三行的“查看更多”。',
          judgeRule: '展示关系应与建券保存的适用范围一致。',
          exceptionRule: '关联缺失、商品改名或删除时的 C 端提示待确认；卡券中心不按启停状态拦截。',
          otherDesc: '当前名称来自演示数据，不代表生产实例；展示方式依据产品知识库主分支卡券详情。'
        }
      }),
      annotation({
        id: '3', page: 'wallet', target: '[data-anno="wallet-detail-entry"]',
        position: { placement: 'top-left', offsetX: 0, offsetY: 0 }, title: '进入卡券详情',
        sections: {
          functionName: '查看卡券详情',
          functionDesc: '沿用既有卡包的“详细规则”入口，在同一 C 端业务路由内进入卡券详情页面态。',
          permissionScope: '持券用户。',
          dataSource: '券实例信息及卡券中心保存的适用范围关系。',
          valueLogic: '详情按既有字段结构展示，老友卡关系只落入当前可见“适用商品”区域。',
          fieldDesc: '未配置的适用车系、车型、专营店字段按知识库规则整项隐藏。',
          interactionDesc: '点击进入详情；点击详情页左上角返回卡包，不改变券或关系。',
          judgeRule: '卡面不新增老友卡专属关系模块，也不把关联商品数量误作核销码数量。',
          exceptionRule: '长商品名称超过三行时的查看更多、商品失效时的话术待正式规则确认。',
          otherDesc: '本原型没有新增第三个业务导航入口；“适用产品/适用商品”的正式字段名待确认。'
        }
      }),
      annotation({
        id: '4', page: 'wallet', target: '[data-anno="wallet-use-old-friend-coupon"]',
        position: { placement: 'top-left', offsetX: 0, offsetY: -2 }, title: '立即使用与核销边界',
        sections: {
          functionName: '立即使用',
          functionDesc: '沿用既有维保券操作文案进入后续使用链路；老友卡场景的正式去向与核销校验仍待确认。',
          permissionScope: '满足最终可用条件的持券用户；条件待确认。',
          dataSource: '券实例、券适用范围及本次老友卡商品标识。',
          valueLogic: '当前打开产品化的用券确认层，展示券名称、适用商品、优惠内容和有效期；不跳预约维保、商城、门店或对方系统，也不发起核销。',
          fieldDesc: 'C 端不展示接口物理字段；核销正式字段、必填规则和责任系统待确认。',
          interactionDesc: '点击打开用券确认层；关闭后返回当前卡包。',
          judgeRule: '业务目标是当前商品需命中券适用范围；最终校验责任系统待确认。',
          exceptionRule: '调用方向、时点、错误码、幂等、超时、补偿、退款和异常话术待确认。',
          otherDesc: '页面反馈不证明接口已联调或生产核销可用。'
        }
      })
    ],
    sequence: [
      annotation({
        id: '1', page: 'sequence', target: '[data-anno="sequence-object-boundary"]',
        position: { placement: 'top-right', offsetX: 2, offsetY: 0 }, title: '对象与系统边界',
        sections: {
          functionName: '建券至核销完整时序图',
          functionDesc: '在一个独立评审路由中连续展示售后维保券从配置到核销及后续处理的跨系统链路。',
          permissionScope: '产品、研发、测试及相关系统负责人评审；不是 SIT 正式业务菜单。',
          dataSource: '用户最新指令、老友卡接口文档、当前原型规则及既有时序图的有效部分。',
          valueLogic: '老友卡是外部商品，售后维保券是卡券中心券对象；六方按职责分列。',
          fieldDesc: '第三路由 key 为 sequence；不新增生产字段或接口。',
          interactionDesc: '可由左侧导航进入，主图保持完整，阶段按钮定位到对应说明。',
          judgeRule: '查询服务与 E3S/履约端必须分列，不能从 DNDC 标识推断系统归属。',
          exceptionRule: '正式系统归属、调用方向和责任人仍待确认。',
          otherDesc: '该页是评审表达，不证明任何接口已部署或真实核销可用。'
        }
      }),
      annotation({
        id: '2', page: 'sequence', target: '[data-anno="sequence-query-contract"]',
        position: { placement: 'top-right', offsetX: 0, offsetY: 0 }, title: '查询、多选与关联',
        sections: {
          functionName: '查询并保存适用范围',
          functionDesc: '卡券中心按接口稿查询商品，运营多选并建立一券多商品关系。',
          permissionScope: '卡券运营配置角色；正式接口权限待确认。',
          dataSource: 'DNDC_NORMAL_S_SE_S070 文档可见的 4 个请求字段和 6 个商品字段。',
          valueLogic: '候选项按产品 ID 去重；凡接口返回的商品均可选择，isEnable 仅展示。',
          fieldDesc: '关系键、编码备份、名称快照、版本和持久化表结构待确认。',
          interactionDesc: '点击老友卡直达弹窗，支持跨筛选多选、取消不提交、统一确认和逐项移除。',
          judgeRule: '无关联不得提交该类型，也不得默认适用全部老友卡；启停状态不参与选择。',
          exceptionRule: '查询空、失败或超时不生成虚假关系；最大数量和真实跨页规则待确认。',
          otherDesc: '接口示例与字段表仍有冲突，本图不展示伪造的正式 JSON。'
        }
      }),
      annotation({
        id: '3', page: 'sequence', target: '[data-anno="sequence-issue-bridge"]',
        position: { placement: 'top-left', offsetX: 0, offsetY: 0 }, title: '发券与领券仅作串联',
        sections: {
          functionName: '券模板形成券实例',
          functionDesc: '为保证端到端时序完整，连接券模板、发券/领券和卡包券实例。',
          permissionScope: '相关系统负责人评审；当前没有可验收的生产权限规则。',
          dataSource: '本专项没有发券/领券接口合同，本段仅来自完整链路所需的原型表达。',
          valueLogic: '仅表达模板进入既有渠道后形成券实例，不固定请求方向和字段。',
          fieldDesc: '触发方、资格、模板状态、实例 ID 和关系快照均待确认。',
          interactionDesc: '阶段按钮可定位；本页不会创建、发放或领取真实卡券。',
          judgeRule: '必须标记为“原型串联”，不可作为接口或研发实现结论。',
          exceptionRule: '发放失败、重复领取、部分成功和回滚待确认。',
          otherDesc: '该桥接不修改活动中心、发券渠道或卡券中心既有能力。'
        }
      }),
      annotation({
        id: '4', page: 'sequence', target: '[data-anno="sequence-precheck"]',
        position: { placement: 'top-right', offsetX: 0, offsetY: 0 }, title: '核销前范围命中',
        sections: {
          functionName: '核销前适用范围校验',
          functionDesc: '用当前老友卡商品标识判断是否命中券保存的一券多商品适用范围。',
          permissionScope: '核销链路相关系统；最终责任方待确认。',
          dataSource: '券实例、券模板适用范围和本次 carProductId 或 carProductCode 候选。',
          valueLogic: '先做券基础校验，再判断关联存在和当前商品是否命中；卡券中心不按 isEnable 拦截。',
          fieldDesc: '正式字段名、必填组合、冲突优先级和是否二次校验待确认。',
          interactionDesc: '本页只展示时序，不发起调用。',
          judgeRule: '无关联或不命中时不得返回核销成功；接口返回商品在建券时均可选。',
          exceptionRule: '调用方向、校验时点、错误码、锁券和其他履约有效性规则待确认。',
          otherDesc: '图中箭头表达信息需要到达校验点，不锁定网络拓扑。'
        }
      }),
      annotation({
        id: '5', page: 'sequence', target: '[data-anno="sequence-redemption-results"]',
        position: { placement: 'top-left', offsetX: 0, offsetY: 0 }, title: '核销结果与未知态',
        sections: {
          functionName: '核销结果处理',
          functionDesc: '分别表达核销明确成功、明确失败和超时/结果未知，以及后续逆向场景。',
          permissionScope: '卡券中心与履约链路相关系统；最终状态权威待确认。',
          dataSource: '当前需求的业务目标与集中待确认清单。',
          valueLogic: '只有明确成功后才更新成功态；明确失败不包装成功，结果未知不提前成功。',
          fieldDesc: '响应、错误码、幂等键、查单状态和状态机待确认。',
          interactionDesc: '阶段说明列出成功、失败和未知三个可观察分支。',
          judgeRule: '超时不等于失败也不等于成功，必须保留独立未知态。',
          exceptionRule: '重试、补偿、对账、取消、支付失败、退款、冲正、退券和解锁待确认。',
          otherDesc: '历史无商品标识券不得因此默认适用全部老友卡。'
        }
      })
    ]
  };
})();
