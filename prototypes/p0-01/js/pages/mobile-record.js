(function () {
  'use strict';
  function recordItems(){
    var record=window.ExchangeCouponMock.redemptionRecord;
    return record.items.map(function(item){
      var p=window.ExchangeCouponMock.products.find(function(x){return x.id===item.productId;});
      return '<div class="product-mini"><div class="product-pic">'+p.icon+'</div><div class="product-mini-info"><strong>'+p.name+' × '+item.qty+'</strong><p>'+p.category+' · '+p.fulfillment+'</p></div></div>';
    }).join('');
  }
  window.Pages['mobile-record']={
    render:function(){
      var r=window.ExchangeCouponMock.redemptionRecord;
      return window.prototypeShell('已核销卡券兑换详情','卡券中心 / 我的卡券 / 兑换详情',
        '<div class="mobile-workspace"><div class="phone"><div class="phone-notch"></div><div class="mobile-nav"><span class="back" data-record-back>‹</span>兑换详情</div><div class="mobile-body"><div class="record-status-card redeemed-status"><div class="record-check">✓</div><div><b>兑换成功 · 卡券已核销</b><p>履约 / 发货状态：'+r.orderStatus+'</p></div></div><div class="mobile-card"><div class="record-coupon-title"><span class="tag orange">通用兑换券</span><h3>'+r.couponName+'</h3><p>本次兑换内容以兑换单快照为准</p></div></div><div class="mobile-card"><h3>兑换内容（'+r.items.length+'件）</h3>'+recordItems()+'</div><div class="mobile-card"><h3>绑定车辆</h3><div class="record-lines"><p><span>车辆</span><b>'+r.vehicle.car+'</b></p><p><span>车牌 / VIN</span><b>'+r.vehicle.plate+'<br>'+r.vehicle.vin+'</b></p></div></div><div class="mobile-card"><h3>兑换信息</h3><div class="record-lines"><p><span>兑换单号</span><b>'+r.orderNo+'</b></p><p><span>兑换时间</span><b>'+r.exchangeTime+'</b></p><p><span>使用卡券</span><b>1张</b></p><p><span>卡券状态</span><b>'+r.couponStatus+'</b></p></div></div><button class="mobile-cta" data-record-fulfillment>查看履约 / 发货状态</button><button class="mobile-secondary-cta" data-record-home>返回我的卡券</button></div></div><div><div class="panel"><div class="panel-head">兑换与履约解耦 <span class="tag orange">目标态</span></div><div class="panel-body"><div class="evidence-note">兑换成功即表示兑换单已创建且卡券已核销，不表示所有商品都已履约完成。点击“查看履约 / 发货状态”查询同一兑换单下各履约单。</div></div></div><div class="panel"><div class="panel-head">只读边界</div><div class="panel-body"><p>• 不允许修改兑换商品或车辆。</p><p style="margin-top:8px">• 不提供再次兑换、撤销、退款或恢复卡券。</p><p style="margin-top:8px">• 失败商品在履约页提示联系客服，不改变卡券已核销状态。</p></div></div></div></div>');
    },
    init:function(){
      document.querySelector('[data-record-back]').onclick=function(){window.navigateTo('mobile-home');};
      document.querySelector('[data-record-home]').onclick=function(){window.navigateTo('mobile-home');};
      document.querySelector('[data-record-fulfillment]').onclick=function(){window.PrototypeState.fulfillmentSource='record';window.navigateTo('mobile-fulfillment');};
    }
  };
})();
