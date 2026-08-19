(function () {
  'use strict';
  window.Pages['admin-list'] = {
    render: function () {
      var c = window.ExchangeCouponMock.coupon;
      return window.prototypeShell('卡券列表','卡券中心 / 卡券管理',
        '<div class="panel"><div class="panel-body"><div class="filter-grid"><div class="field"><label>卡券ID</label><input class="input" placeholder="请输入卡券ID"></div><div class="field"><label>卡券名称</label><input class="input" placeholder="请输入卡券名称"></div><div class="field"><label>归属网点</label><input class="input" placeholder="请选择归属网点"></div></div><div style="text-align:right;margin-top:16px"><button class="btn">重置</button><button class="btn btn-primary">查询</button></div></div></div>'+ 
        '<div class="panel"><div class="panel-head"><span>卡券列表</span><button class="btn btn-primary" id="newCoupon">＋ 新建</button></div><div class="panel-body"><div class="evidence-note" style="margin-bottom:14px">列结构沿用 SIT：卡券、适用范围、核销说明、统计、系统时间、状态与操作；此处新增一条“兑换券”目标态演示记录。</div><div class="table-wrapper"><table><thead><tr><th>序号</th><th>卡券</th><th>适用范围</th><th>核销说明</th><th>统计</th><th>系统时间</th><th>卡券状态</th><th>操作</th></tr></thead><tbody><tr><td>1</td><td class="coupon-cell"><strong>'+c.name+'</strong><span>ID：'+c.id+'</span><span>券类型：兑换券｜兑换规则：5选2</span><span>品牌：日产｜场景：'+c.scene+'</span></td><td class="coupon-cell"><strong>新商城全部商品</strong><span>'+c.scope+'</span><span>候选商品 5 个 / 每券兑换 2 件</span></td><td class="coupon-cell"><strong>线上兑换</strong><span>兑换单创建成功即核销</span><span>履约方式：车联网 / 直邮 / 到店核销</span></td><td class="stat-pair">发放：1,380<br>库存：8,620<br>已兑换：428</td><td class="coupon-cell"><span>创建：2026-07-20 10:18</span><span>更新：2026-07-22 10:15</span><span>来源：卡券中心</span></td><td><span class="tag green">'+c.status+'</span></td><td><button class="btn btn-link" data-view>查看</button><button class="btn btn-link" data-edit>编辑</button></td></tr></tbody></table></div><div class="pagination"><span>共 1 条</span><span class="page-chip active">1</span></div></div></div>');
    },
    init: function () {
      document.getElementById('newCoupon').onclick=function(){window.navigateTo('admin-create');};
      document.querySelector('[data-view]').onclick=function(){showToast('查看态复用同一表单结构，字段只读');window.navigateTo('admin-create');};
      document.querySelector('[data-edit]').onclick=function(){window.navigateTo('admin-create');};
    }
  };
})();
