(function () {
  'use strict';

  function productById(id){return window.ExchangeCouponMock.products.find(function(p){return p.id===id;});}
  function statusLabel(type,status){var list=window.ExchangeCouponMock.fulfillmentStatusEnums[type]||[];var hit=list.find(function(s){return s.value===status;});return hit?hit.label:status;}
  function statusTag(label,status){var cls=(status==='success'||status==='signed'||status==='verified')?'green':(status==='failed'?'red':(status==='fulfilling'||status==='shipped'?'orange':'gray'));return '<span class="tag '+cls+'">'+label+'</span>';}

  function filterOptions(){
    var statusValues=[];
    Object.keys(window.ExchangeCouponMock.fulfillmentStatusEnums).forEach(function(type){window.ExchangeCouponMock.fulfillmentStatusEnums[type].forEach(function(s){if(!statusValues.some(function(x){return x.value===s.value;}))statusValues.push(s);});});
    return {
      types:window.ExchangeCouponMock.fulfillmentTypes.map(function(t){return '<option value="'+t.value+'">'+t.label+'</option>';}).join(''),
      statuses:statusValues.map(function(s){return '<option value="'+s.value+'">'+s.label+'</option>';}).join(''),
      suppliers:window.ExchangeCouponMock.suppliers.map(function(s){return '<option value="'+s.name+'">'+s.name+'</option>';}).join('')
    };
  }

  function orderRows(orders){
    return orders.map(function(o){
      var itemNames=o.items.map(function(item){var p=productById(item.productId);return p.name+' × '+item.qty;}).join('<br>');
      return '<tr><td><b>'+o.orderNo+'</b><div class="helper">兑换单：'+o.exchangeOrderNo+'</div></td><td><b>'+o.couponName+'</b><div class="helper">'+itemNames+'</div></td><td>'+o.supplier+'</td><td>'+o.typeLabel+'</td><td>'+statusTag(o.statusLabel,o.status)+'</td><td>'+o.createdAt+'<div class="helper">更新：'+o.updatedAt+'</div></td><td><button class="btn btn-link" data-fulfillment-detail="'+o.orderNo+'">查看详情</button></td></tr>';
    }).join('') || '<tr><td colspan="7"><div class="empty-table">没有符合条件的履约单</div></td></tr>';
  }

  function logisticsHtml(order){
    if(!order.logistics)return '';
    return '<div class="detail-block"><h3>物流信息</h3><div class="record-lines"><p><span>承运商</span><b>'+order.logistics.carrier+'</b></p><p><span>物流单号</span><b>'+order.logistics.trackingNo+'</b></p><p><span>收货人</span><b>'+order.logistics.receiver+'</b></p><p><span>收货地址</span><b>'+order.logistics.address+'</b></p></div><div class="logistics-timeline">'+order.logistics.tracks.map(function(t){return '<div><i></i><b>'+t.time+'</b><p>'+t.text+'</p></div>';}).join('')+'</div></div>';
  }

  function storeHtml(order){
    if(!order.store)return '';
    return '<div class="detail-block"><h3>到店核销信息</h3><div class="record-lines"><p><span>适用门店</span><b>'+(order.store.scope||'—')+'</b></p><p><span>核销码</span><b>'+order.store.verifyCode+'</b></p>'+(order.store.verifiedStore?'<p><span>核销门店</span><b>'+order.store.verifiedStore+'</b></p><p><span>核销时间</span><b>'+order.store.verifiedAt+'</b></p>':'')+'</div></div>';
  }

  function openDetail(orderNo){
    var order=window.ExchangeCouponMock.fulfillmentOrders.find(function(o){return o.orderNo===orderNo;});
    var items=order.items.map(function(item){var p=productById(item.productId);return '<tr><td><b>'+p.name+'</b><div class="helper">'+p.id+' · '+p.category+'</div></td><td>'+item.qty+'</td><td>'+p.supplier+'</td><td>'+statusTag(statusLabel(order.type,item.status),item.status)+'</td><td>'+(item.failureReason||'—')+'</td></tr>';}).join('');
    openModal('<div class="modal-content fulfillment-modal"><div class="modal-header"><b>兑换券履约单详情</b><button class="btn btn-link" data-close-modal>×</button></div><div class="modal-body"><div class="order-summary-grid"><div><span>履约单号</span><b>'+order.orderNo+'</b></div><div><span>关联兑换单</span><b>'+order.exchangeOrderNo+'</b></div><div><span>履约方式</span><b>'+order.typeLabel+'</b></div><div><span>履约单状态</span>'+statusTag(order.statusLabel,order.status)+'</div><div><span>供应商</span><b>'+order.supplier+'</b></div><div><span>更新时间</span><b>'+order.updatedAt+'</b></div></div><div class="detail-block"><h3>履约商品明细</h3><div class="table-wrapper"><table><thead><tr><th>商品</th><th>数量</th><th>供应商</th><th>商品状态</th><th>异常说明</th></tr></thead><tbody>'+items+'</tbody></table></div></div>'+(order.vin?'<div class="detail-block"><h3>车联网履约对象</h3><div class="record-lines"><p><span>绑定 VIN</span><b>'+order.vin+'</b></p></div></div>':'')+logisticsHtml(order)+storeHtml(order)+'</div><div class="modal-footer"><button class="btn btn-primary" data-close-modal>关闭</button></div></div>');
  }

  function bindDetails(){document.querySelectorAll('[data-fulfillment-detail]').forEach(function(b){b.onclick=function(){openDetail(b.dataset.fulfillmentDetail);};});}

  function applyFilters(){
    var exchange=document.getElementById('filterExchange').value.trim().toLowerCase();
    var fulfillment=document.getElementById('filterFulfillment').value.trim().toLowerCase();
    var type=document.getElementById('filterType').value;
    var status=document.getElementById('filterStatus').value;
    var supplier=document.getElementById('filterSupplier').value;
    var result=window.ExchangeCouponMock.fulfillmentOrders.filter(function(o){return (!exchange||o.exchangeOrderNo.toLowerCase().indexOf(exchange)>-1)&&(!fulfillment||o.orderNo.toLowerCase().indexOf(fulfillment)>-1)&&(!type||o.type===type)&&(!status||o.status===status||o.items.some(function(i){return i.status===status;}))&&(!supplier||o.supplier===supplier);});
    document.getElementById('fulfillmentRows').innerHTML=orderRows(result);
    document.getElementById('resultCount').textContent='共 '+result.length+' 条履约单';
    bindDetails();
  }

  window.Pages['admin-fulfillment']={
    render:function(){var options=filterOptions();return window.prototypeShell('兑换券履约','卡券中心 / 兑换券履约',
      '<div class="panel"><div class="panel-head">履约单查询 <span class="tag orange">目标态</span></div><div class="panel-body"><div class="fulfillment-filter-grid"><div class="field"><label>兑换单号</label><input class="input" id="filterExchange" placeholder="请输入兑换单号"></div><div class="field"><label>履约单号</label><input class="input" id="filterFulfillment" placeholder="请输入履约单号"></div><div class="field"><label>履约方式</label><select class="select" id="filterType"><option value="">全部</option>'+options.types+'</select></div><div class="field"><label>履约状态</label><select class="select" id="filterStatus"><option value="">全部</option>'+options.statuses+'</select></div><div class="field"><label>供应商</label><select class="select" id="filterSupplier"><option value="">全部供应商</option>'+options.suppliers+'</select><div class="helper">数据来源：新商城</div></div><div class="filter-actions"><button class="btn btn-primary" id="queryFulfillment">查询</button><button class="btn" id="resetFulfillment">重置</button></div></div></div></div>'+ 
      '<div class="panel"><div class="panel-head"><span>履约单列表</span><span class="helper" id="resultCount">共 '+window.ExchangeCouponMock.fulfillmentOrders.length+' 条履约单</span></div><div class="panel-body"><div class="evidence-note" style="margin-bottom:14px">一笔兑换单可按履约方式拆成多个履约单。兑换券在兑换单创建成功时已核销，本页仅跟踪后续履约、发货或到店核销进度。</div><div class="table-wrapper"><table><thead><tr><th>履约单 / 兑换单</th><th>兑换券 / 商品</th><th>供应商</th><th>履约方式</th><th>状态</th><th>创建 / 更新</th><th>操作</th></tr></thead><tbody id="fulfillmentRows">'+orderRows(window.ExchangeCouponMock.fulfillmentOrders)+'</tbody></table></div></div></div>');},
    init:function(){
      document.getElementById('queryFulfillment').onclick=applyFilters;
      document.getElementById('resetFulfillment').onclick=function(){['filterExchange','filterFulfillment'].forEach(function(id){document.getElementById(id).value='';});['filterType','filterStatus','filterSupplier'].forEach(function(id){document.getElementById(id).value='';});applyFilters();};
      bindDetails();
    }
  };
})();
