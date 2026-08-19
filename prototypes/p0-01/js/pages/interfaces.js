(function () {
  'use strict';
  window.Pages.interfaces={
    render:function(){return window.prototypeShell('系统接口与边界','通用兑换券 / 系统协作',
      '<div class="panel"><div class="panel-head">系统职责矩阵</div><div class="panel-body"><div class="ownership"><div class="head">能力</div><div class="head">卡券中心</div><div class="head">新商城 / 供应商</div><div class="head">车联网</div>'+ 
      '<div>建券与商品选择</div><div>保存整券唯一履约方式、固定组合或N/M，以及券-商品的maxRedeemQty</div><div>按整券履约方式提供兼容商品、分类、供应商、价格、库存及上下架字段</div><div>提供车联网商品识别与车联网履约能力</div>'+ 
      '<div>卡券详情与前台选品</div><div>查询持券、返回券实例VIN、展示候选池并校验用户所选M件</div><div>提供商品展示、详情、库存和供应商信息</div><div>按VIN返回只读车辆信息，兑换时不二次车型过滤</div>'+ 
      '<div>兑换与核销</div><div>校验单一履约与商品级上限；创建兑换单后立即核销券</div><div>直邮承接确认订单和地址；到店提供省市门店与核销能力</div><div>接收VIN与车联网商品明细，返回履约受理</div>'+ 
      '<div>履约单推进</div><div>保存各履约单和逐商品状态，供后台及前台查询</div><div>回传待发货/已发货/已签收或待核销/已核销；提供物流单</div><div>回传待履约/履约中/履约成功/失败</div>'+ 
      '<div>失败处理</div><div>卡券保持已核销，前台统一提示联系客服</div><div>提供异常原因和人工处理线索</div><div>提供失败原因和履约单定位信息</div></div></div></div>'+ 
      '<div class="panel"><div class="panel-head">兑换与履约主链路</div><div class="panel-body"><div class="sequence"><div class="seq"><b>1 查询持券</b><p>返回整券履约方式、N/M和券-商品上限</p></div><div class="seq"><b>2 准备兑换</b><p>到店先选门店；其余直接选品</p></div><div class="seq"><b>3 校验选品</b><p>校验库存、总件数和逐商品上限</p></div><div class="seq"><b>4 履约前置</b><p>直邮跳商城选地址并提交；到店保留门店</p></div><div class="seq"><b>5 创建兑换单</b><p>直邮须等商城提交成功回跳</p></div><div class="seq"><b>6 立即核销</b><p>兑换单创建成功即核销券</p></div><div class="seq"><b>7 状态查询</b><p>按唯一履约类型查询进度、物流或核销</p></div></div></div></div>'+ 
      '<div class="panel"><div class="panel-head">建议接口清单</div><div class="panel-body"><div class="table-wrapper"><table><thead><tr><th>提供方</th><th>接口用途</th><th>关键入参</th><th>关键出参 / 规则</th></tr></thead><tbody>'+ 
      '<tr><td>新商城</td><td>分页查询可选商品</td><td>整券履约方式、关键词、分类、供应商、上下架、页码</td><td>SKU、名称、价格、库存、图片、供应商、支持的履约方式</td></tr>'+ 
      '<tr><td>新商城</td><td>查询供应商</td><td>品牌、供应商状态</td><td>供应商ID、名称；用于后台下拉筛选</td></tr>'+ 
      '<tr><td>车联网</td><td>查询VIN车辆信息</td><td>券实例绑定VIN</td><td>车型、车牌等只读展示信息</td></tr>'+ 
      '<tr><td>新商城</td><td>直邮确认订单与成功回跳</td><td>couponId、productIds、收货地址、幂等键</td><td>商城订单号、提交结果；成功后卡券中心才创建兑换单</td></tr>'+
      '<tr><td>新商城 / 门店平台</td><td>查询省市门店</td><td>省、市、商品适用范围</td><td>门店ID、名称、地址、联系电话</td></tr>'+
      '<tr><td>卡券中心</td><td>提交兑换</td><td>券实例ID、所选SKU/数量、VIN或门店；直邮带商城订单号</td><td>兑换单号、卡券已核销、唯一履约单；请求需幂等</td></tr>'+ 
      '<tr><td>履约方</td><td>受理/更新履约单</td><td>履约单号、商品明细、VIN或收货/核销信息</td><td>逐商品状态、失败原因、更新时间</td></tr>'+ 
      '<tr><td>新商城 / 供应商</td><td>查询物流详情</td><td>直邮履约单号</td><td>承运商、物流单号、物流轨迹</td></tr>'+ 
      '<tr><td>卡券中心</td><td>查询兑换单履约</td><td>用户、兑换单号</td><td>卡券状态、履约单、逐商品状态、物流与核销信息</td></tr></tbody></table></div></div></div>'+ 
      '<div class="evidence-note warn"><b>仍需技术协议：</b>商城跳转签名与成功回跳、提交幂等、门店主数据、核销码格式/刷新/失效、状态回调和异常补偿需在研发前落定。本原型只固化已确认的页面顺序和状态边界。</div>');}
  };
})();
