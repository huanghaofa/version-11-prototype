(function () {
  'use strict';
  window.Pages.interfaces={
    render:function(){return window.prototypeShell('系统接口与边界','通用兑换券 / 系统协作',
      '<div class="panel"><div class="panel-head">一期系统职责矩阵</div><div class="panel-body"><div class="ownership"><div class="head">能力</div><div class="head">卡券中心</div><div class="head">产品中心</div><div class="head">车联网</div>'+ 
      '<div>商品配置</div><div>保存固定组合或N选M、SKU/规格和maxRedeemQty</div><div>提供GUI皮肤SPU/SKU、类型、销售上架状态与可兑换标识</div><div>不作为商品主数据源</div>'+ 
      '<div>一期范围</div><div>只允许产品类型为GUI皮肤且可兑换的SKU进入候选池</div><div>会员、流量及其他类型仍可返回，但卡券中心禁选</div><div>仅承接GUI皮肤履约</div>'+ 
      '<div>用户兑换</div><div>校验券实例、绑定VIN、N/M、SKU数量和产品中心可兑换标识</div><div>销售未上架不拦截；不可兑换标识才拦截</div><div>接收VIN与所选GUI皮肤SKU/数量</div>'+ 
      '<div>履约结果</div><div>同步成功后创建兑换单并核销；失败保持卡券可使用</div><div>不参与车联网履约结果判定</div><div>同一次请求直接返回最终成功或失败</div>'+ 
      '<div>结果查询</div><div>保存并展示商品快照、VIN、最终结果和失败原因</div><div>提供必要商品展示信息</div><div>不再追加中间状态回调</div></div></div></div>'+ 
      '<div class="panel"><div class="panel-head">一期同步主链路</div><div class="panel-body"><div class="sequence"><div class="seq"><b>1 产品中心选品</b><p>分页查询并下钻GUI皮肤SKU/规格</p></div><div class="seq"><b>2 保存券规则</b><p>固定组合或N选M、逐SKU数量上限</p></div><div class="seq"><b>3 用户选品</b><p>按券规则选择GUI皮肤，未上架仍可选</p></div><div class="seq"><b>4 同步请求</b><p>卡券中心提交券实例、VIN、SKU及数量</p></div><div class="seq"><b>5 最终返回</b><p>车联网在当前请求内返回成功或失败</p></div><div class="seq"><b>6 结果落账</b><p>成功创建兑换单并核销；失败不核销</p></div><div class="seq"><b>7 结果展示</b><p>前后台直接查询最终结果</p></div></div></div></div>'+ 
      '<div class="panel"><div class="panel-head">建议接口清单</div><div class="panel-body"><div class="table-wrapper"><table><thead><tr><th>提供方</th><th>接口用途</th><th>关键入参</th><th>关键出参 / 规则</th></tr></thead><tbody>'+ 
      '<tr><td>产品中心</td><td>分页查询兑换商品</td><td>关键词、商品类型、供应商、销售上架状态、可兑换标识、页码</td><td>SPU、SKU、规格、产品类型、展示信息、销售上架状态、可兑换标识</td></tr>'+ 
      '<tr><td>产品中心</td><td>查询商品详情</td><td>产品中心SKU编码</td><td>GUI皮肤详情；销售未上架不等于不可兑换</td></tr>'+ 
      '<tr><td>车联网</td><td>查询VIN车辆信息</td><td>券实例绑定VIN</td><td>车型、车牌等只读展示信息</td></tr>'+ 
      '<tr><td>卡券中心</td><td>校验并准备兑换</td><td>券实例ID、所选GUI皮肤SKU/数量、VIN</td><td>固定组合/N选M与逐SKU数量校验通过后发起车联网调用</td></tr>'+ 
      '<tr><td>车联网</td><td>同步履约GUI皮肤</td><td>券实例引用、VIN、GUI皮肤SKU/规格和数量</td><td>在同一次请求中返回最终成功或失败及原因</td></tr>'+ 
      '<tr><td>卡券中心</td><td>查询兑换结果</td><td>用户、券实例或兑换单号</td><td>成功时返回兑换单、已核销与履约成功；失败尝试不生成成功兑换单</td></tr></tbody></table></div></div></div>'+ 
      '<div class="evidence-note warn"><b>研发待确认：</b>产品中心GUI皮肤类型编码、可兑换字段、商品快照；车联网正式请求/响应字段、超时、幂等、失败码、重试与人工补偿。直邮、新商城订单和E3S到店核销是独立场景，本次未改。</div>');}
  };
})();
