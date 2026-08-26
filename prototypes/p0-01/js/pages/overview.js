(function () {
  'use strict';
  function shell(title, crumb, body) {
    return '<div class="page-shell"><div class="topbar"><div class="breadcrumb">营销平台 / <b>'+crumb+'</b></div><div class="user"><span>原型演示环境</span><span class="avatar">产</span></div></div><div class="page-content"><div class="page-title-row"><div><div class="page-title">'+title+'</div><div class="page-subtitle">基于SIT结构、历史原型与2026-08-25线下确认结论</div></div></div>'+body+'</div></div>';
  }
  window.prototypeShell = shell;
  window.Pages.overview = {
    render: function () {
      var rules = [
        ['商品数据源','兑换券关联商品统一从产品中心查询，不以新商城已上架商品列表作为来源。'],
        ['一期范围','只允许GUI皮肤；会员、流量及其他商品类型不可配置。'],
        ['未上架可选','销售未上架不是禁选理由；产品中心标记可兑换的GUI皮肤仍可配置和兑换。'],
        ['组合与任选','继续支持固定组合及N选M；同一SKU可多件，不同SKU可组合。'],
        ['SKU/规格','商品层分页与筛选，最终选择、数量规则和回显均落到SKU/规格。'],
        ['单一履约','整券履约方式仍使用下拉；一期只有车联网履约一个枚举值。'],
        ['VIN绑定','兑换券发放到VIN；前台直接展示绑定车辆，不提供选车。'],
        ['同步最终结果','卡券中心调用车联网后，在同一次请求中取得最终履约成功或失败。'],
        ['成功才核销','同步成功后创建兑换单并核销；同步失败不形成成功兑换，卡券保持可使用。'],
        ['无中间态','一期GUI皮肤不设置已受理、回调等待或履约中状态。'],
        ['双端一致','日产App与微信小程序复用同一兑换流程。'],
        ['独立场景','直邮、新商城订单、到店核销和E3S不属于本次变更，不混入一期主入口。']
      ];
      return shell('通用兑换券原型说明','原型说明',
        '<div class="grid-3"><div class="metric"><div class="label">商品数据源</div><div class="num">产品中心</div><span class="tag green">已确认</span></div><div class="metric"><div class="label">一期商品</div><div class="num">GUI皮肤</div><span class="tag orange">仅此类型</span></div><div class="metric"><div class="label">车联网返回</div><div class="num">同步终态</div><span class="tag">成功 / 失败</span></div></div>'+ 
        '<div class="panel"><div class="panel-head">本次替换的旧口径</div><div class="panel-body"><div class="grid-3"><div class="evidence-note"><b>旧：新商城全部商品</b><br>新：产品中心GUI皮肤商品。</div><div class="evidence-note"><b>旧：未上架不可选</b><br>新：未上架但可兑换的GUI皮肤仍可选。</div><div class="evidence-note"><b>旧：先受理后回调</b><br>新：同一次请求同步返回最终成功或失败。</div></div></div></div>'+ 
        '<div class="panel"><div class="panel-head">已确认业务规则 <span class="tag green">'+rules.length+'/'+rules.length+' 已带入</span></div><div class="panel-body"><div class="rule-list">'+rules.map(function(r,i){return '<div class="rule-item"><span class="rule-no">'+(i+1)+'</span><p><strong>'+r[0]+'</strong>'+r[1]+'</p></div>';}).join('')+'</div></div></div>'+ 
        '<div class="panel"><div class="panel-head">本期验收入口</div><div class="panel-body"><div class="grid-3"><div class="metric"><div class="label">后台</div><b>新增兑换券 / 产品中心选品</b><p class="helper">GUI皮肤可选，流量/会员/其他禁选，未上架GUI可选。</p></div><div class="metric"><div class="label">前台</div><b>5选2 / 同步成功 / 同步失败</b><p class="helper">成功核销，失败保持可使用。</p></div><div class="metric"><div class="label">系统协作</div><b>卡券中心 / 产品中心 / 车联网</b><p class="helper">正式接口字段、超时、幂等和失败码仍待研发确认。</p></div></div></div></div>');
    }
  };
})();
