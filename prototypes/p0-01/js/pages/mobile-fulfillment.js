(function () {
  'use strict';

  function productById(id){return window.ExchangeCouponMock.products.find(function(p){return p.id===id;});}
  function statusLabel(type,status){var list=window.ExchangeCouponMock.fulfillmentStatusEnums[type]||[];var hit=list.find(function(s){return s.value===status;});return hit?hit.label:status;}
  function tagClass(status){if(status==='success'||status==='signed'||status==='verified')return 'green';if(status==='failed')return 'red';if(status==='fulfilling'||status==='shipped')return 'orange';return 'gray';}

  function currentItems(){
    return Object.keys(window.PrototypeState.redeemQuantities).filter(function(id){return window.PrototypeState.redeemQuantities[id]>0;}).map(function(id){var p=productById(id);return {productId:id,qty:window.PrototypeState.redeemQuantities[id],status:p.defaultStatus};});
  }

  function pageData(){
    if(window.PrototypeState.fulfillmentSource==='current'&&currentItems().length){return {orderNo:'RD202608251015',exchangeTime:'2026-08-25 10:15:38',couponStatus:'已核销',orderStatus:'履约成功',responseMode:'同步实时返回',items:currentItems()};}
    return window.ExchangeCouponMock.redemptionRecord;
  }

  function orderForItem(item,p){
    if(item.fulfillmentOrderNo)return window.ExchangeCouponMock.fulfillmentOrders.find(function(o){return o.orderNo===item.fulfillmentOrderNo;});
    return window.ExchangeCouponMock.fulfillmentOrders.find(function(o){return o.type===p.fulfillmentValue;});
  }

  function itemCard(item){
    var p=productById(item.productId);var label=statusLabel(p.fulfillmentValue,item.status);var order=orderForItem(item,p);var action='';
    if(item.status==='failed')action='<button class="fulfillment-action danger" data-contact data-product="'+p.name+'">查看处理方式</button>';
    else if(p.fulfillmentValue==='direct_ship'&&(item.status==='shipped'||item.status==='signed'))action='<button class="fulfillment-action" data-logistics="'+(order?order.orderNo:'')+'">查看物流</button>';
    var extra='';
    if(p.fulfillmentValue==='telematics')extra='<p>履约车辆：'+window.ExchangeCouponMock.coupon.boundVehicle.plate+' · '+window.ExchangeCouponMock.coupon.boundVehicle.vin+'</p><p>返回方式：同步实时返回</p>';
    if(p.fulfillmentValue==='direct_ship')extra='<p>收货人：'+window.ExchangeCouponMock.coupon.receiver.name+' '+window.ExchangeCouponMock.coupon.receiver.phone+'</p>';
    if(p.fulfillmentValue==='store_verify')extra='<p>适用范围：全部适用专营店</p>';
    return '<div class="fulfillment-item '+(item.status==='failed'?'has-error':'')+'"><div class="fulfillment-item-top"><div class="product-pic">'+p.icon+'</div><div><b>'+p.name+' × '+item.qty+'</b><p>'+p.fulfillment+' · '+p.supplier+'</p></div><span class="tag '+tagClass(item.status)+'">'+label+'</span></div><div class="fulfillment-item-extra"><p>履约单：'+(order?order.orderNo:'系统生成中')+'</p>'+extra+(item.failureReason?'<p class="failure-text">失败原因：'+item.failureReason+'</p>':'')+'</div>'+action+'</div>';
  }

  function openContact(productName){
    openModal('<div class="modal-content contact-modal"><div class="modal-header"><b>履约异常</b><button class="btn btn-link" data-close-modal>×</button></div><div class="modal-body"><div class="contact-icon">!</div><h2>该商品履约失败</h2><p>“'+productName+'”暂未完成履约，兑换券仍保持已核销状态。</p><div class="evidence-note warn" style="margin-top:14px">请联系客服核查履约单并处理。在线客服：日产App「我的-在线客服」；客服电话：95027。</div></div><div class="modal-footer"><button class="btn" data-close-modal>我知道了</button><button class="btn btn-primary" data-close-modal>联系客服</button></div></div>');
  }

  function openLogistics(orderNo){
    var order=window.ExchangeCouponMock.fulfillmentOrders.find(function(o){return o.orderNo===orderNo;}) || window.ExchangeCouponMock.fulfillmentOrders.find(function(o){return o.type==='direct_ship'&&o.logistics;});
    if(!order||!order.logistics){showToast('物流单生成后可查询');return;}
    var l=order.logistics;
    openModal('<div class="modal-content logistics-modal"><div class="modal-header"><b>物流详情</b><button class="btn btn-link" data-close-modal>×</button></div><div class="modal-body"><div class="logistics-summary"><span>'+l.carrier+'</span><b>'+l.trackingNo+'</b><p>'+l.receiver+'</p><p>'+l.address+'</p></div><div class="logistics-timeline">'+l.tracks.map(function(t){return '<div><i></i><b>'+t.time+'</b><p>'+t.text+'</p></div>';}).join('')+'</div></div><div class="modal-footer"><button class="btn btn-primary" data-close-modal>关闭</button></div></div>');
  }

  function render(){
    var data=pageData();var hasFailure=data.items.some(function(i){return i.status==='failed';});
    return window.prototypeShell('兑换单履约 / 发货状态','卡券中心 / 兑换单 / 履约与发货',
      '<div class="mobile-workspace"><div class="phone"><div class="phone-notch"></div><div class="mobile-nav"><span class="back" data-fulfillment-back>‹</span>履约结果</div><div class="mobile-body"><div class="fulfillment-order-head"><div><span>兑换单号</span><b>'+data.orderNo+'</b></div><span class="tag '+tagClass(data.orderStatus==='履约成功'?'success':'failed')+'">'+data.orderStatus+'</span><p>卡券状态：'+data.couponStatus+' · 兑换时间：'+data.exchangeTime+'</p></div>'+(hasFailure?'<div class="failure-banner"><b>车联网同步返回履约失败</b><p>该次兑换未成功，失败原因可用于重试或联系客服。</p></div>':'')+'<div class="fulfillment-list">'+data.items.map(itemCard).join('')+'</div><div class="mobile-card"><h3>状态说明</h3><p class="helper">一期GUI皮肤在同一次请求内返回最终成功或失败，不经过已受理、异步回调或履约中。</p></div><button class="mobile-secondary-cta" data-fulfillment-back>返回兑换详情</button></div></div><div><div class="panel"><div class="panel-head">一期车联网状态 <span class="tag orange">已确认</span></div><div class="panel-body"><div class="status-enum-block"><b>同步最终结果</b><p><span>履约成功</span><span class="danger-text">履约失败</span></p></div><div class="evidence-note">直邮和到店核销属于独立场景，本次不修改其状态枚举。</div></div></div><div class="panel"><div class="panel-head">页面行为</div><div class="panel-body"><p>• 成功：生成兑换单、卡券已核销。</p><p style="margin-top:8px">• 失败：不形成成功兑换、卡券保持可使用。</p><p style="margin-top:8px">• 结果为同步终态，不再等待后续回调。</p></div></div></div></div>');
  }

  function init(){
    document.querySelectorAll('[data-fulfillment-back]').forEach(function(b){b.onclick=function(){window.navigateTo(window.PrototypeState.fulfillmentSource==='current'?'mobile-flow':'mobile-record');};});
    document.querySelectorAll('[data-contact]').forEach(function(b){b.onclick=function(){openContact(b.dataset.product);};});
    document.querySelectorAll('[data-logistics]').forEach(function(b){b.onclick=function(){openLogistics(b.dataset.logistics);};});
  }

  window.Pages['mobile-fulfillment']={render:render,init:init};
})();
