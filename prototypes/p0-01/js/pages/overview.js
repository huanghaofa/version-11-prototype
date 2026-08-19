(function () {
  'use strict';
  function shell(title, crumb, body) {
    return '<div class="page-shell"><div class="topbar"><div class="breadcrumb">营销平台 / <b>'+crumb+'</b></div><div class="user"><span>原型演示环境</span><span class="avatar">产</span></div></div><div class="page-content"><div class="page-title-row"><div><div class="page-title">'+title+'</div><div class="page-subtitle">基于卡券中心 SIT 现状、Axure 历史原型及本期已确认规则</div></div></div>'+body+'</div></div>';
  }
  window.prototypeShell = shell;
  window.Pages.overview = {
    render: function () {
      var rules = [
        ['通用范围','按通用兑换券建设，商品池面向新商城全部商品。'],
        ['无迁移','车联网没有存量礼品券，本期不做迁移。'],
        ['组合与任选','支持固定商品组合及N选M；5选2可选不同SKU，也可同一SKU选择2件。'],
        ['单一履约','整张券只选择车联网履约、直邮或到店核销中的一种，并按该值过滤商品。'],
        ['库存为0','前台保留商品展示与详情，但置灰且不可选择；后续运营处置仍待确认。'],
        ['车型控制','车型适配在建券与发券时由运营控制，兑换时不二次过滤。'],
        ['VIN 绑定','兑换券发放到 VIN；前台直接使用券实例绑定车辆，不提供选车。'],
        ['兑换即核销','兑换单创建成功后立即核销卡券，不等待后续履约、发货或到店核销状态。'],
        ['不可逆','本期不支持撤销、退款和恢复券。'],
        ['双端同时上线','日产 App 与微信小程序采用同一兑换流程。'],
        ['页面归属','卡券详情、选品和兑换结果由卡券中心承接；直邮确认订单与地址选择由新商城承接。'],
        ['不做预占','本期不设计商品库存或券的预占机制。'],
        ['履约单查询','后台新增“兑换券履约”，前台可按兑换单查询逐商品状态。'],
        ['商品级上限','N选M的最多兑换数量按每个候选商品分别配置。'],
        ['到店顺序','用户先选省、市、门店，再选商品；兑换成功后才展示核销码。'],
        ['直邮下单','选品后跳新商城选地址；商城提交成功回跳后才创建兑换单并核销券。'],
        ['异常处理','车联网或直邮履约失败时提示联系客服，不恢复已核销卡券。']
      ];
      return shell('通用兑换券原型说明','原型说明',
        '<div class="grid-3"><div class="metric"><div class="label">SIT 实证场景</div><div class="num">新商城</div><span class="tag green">商城营销</span></div><div class="metric"><div class="label">新增卡券类型</div><div class="num">兑换券</div><span class="tag orange">目标态</span></div><div class="metric"><div class="label">本期端</div><div class="num">2</div><span class="tag">App + 小程序</span></div></div>'+ 
        '<div class="panel"><div class="panel-head">证据口径</div><div class="panel-body"><div class="grid-3"><div class="evidence-note"><b>SIT 为现状主基线</b><br>沿用真实后台的卡券列表、新建表单分组、业务场景两级联动，以及“适用商城商品”入口。</div><div class="evidence-note"><b>Axure 为历史补充</b><br>参考历史礼品券、关联商品、卡包和卡券详情结构；旧“9 位兑换码”页面不作为本需求兑换流程。</div><div class="evidence-note warn"><b>目标态必须显式标记</b><br>兑换券类型、兑换商品组合、券实例绑定 VIN、兑换即核销及履约单查询均为本期目标设计，不声称 SIT 已存在。</div></div></div></div>'+ 
        '<div class="panel"><div class="panel-head">已确认业务规则 <span class="tag green">'+rules.length+'/'+rules.length+' 已带入</span></div><div class="panel-body"><div class="rule-list">'+rules.map(function(r,i){return '<div class="rule-item"><span class="rule-no">'+(i+1)+'</span><p><strong>'+r[0]+'</strong>'+r[1]+'</p></div>';}).join('')+'</div></div></div>'+ 
        '<div class="panel"><div class="panel-head">原型页面</div><div class="panel-body"><div class="grid-3"><div class="metric"><div class="label">后台</div><b>卡券列表 / 新建兑换券 / 兑换券履约</b><p class="helper">支持整券单一履约、供应商筛选、商品级数量上限和履约单查询。</p></div><div class="metric"><div class="label">前台用户端</div><b>三类独立券 / 选店 / 商城确认订单 / 核销码</b><p class="helper">兑换单创建成功即核销；后续查询对应履约状态。</p></div><div class="metric"><div class="label">协作</div><b>商品、门店、地址、VIN车辆、履约接口</b><p class="helper">兑换单主状态与履约执行状态分开管理。</p></div></div></div></div>');
    }
  };
})();
