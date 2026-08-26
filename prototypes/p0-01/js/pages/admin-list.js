(function () {
  'use strict';
  window.Pages['admin-list'] = {
    render: function () {
      var c = window.ExchangeCouponMock.coupon;
      return window.prototypeShell('卡券列表','卡券中心 / 卡券管理',
        '<div class="panel"><div class="panel-body"><div class="filter-grid"><div class="field"><label>卡券ID</label><input class="input" placeholder="请输入卡券ID"></div><div class="field"><label>卡券名称</label><input class="input" placeholder="请输入卡券名称"></div><div class="field"><label>归属网点</label><input class="input" placeholder="请选择归属网点"></div></div><div style="text-align:right;margin-top:16px"><button class="btn">重置</button><button class="btn btn-primary">查询</button></div></div></div>'+ 
        '<div class="panel"><div class="panel-head"><span>卡券列表</span><button class="btn btn-primary" id="newCoupon">＋ 新建</button></div><div class="panel-body"><div class="evidence-note" style="margin-bottom:14px">一期兑换券商品来自产品中心，仅允许GUI皮肤；销售未上架但可兑换的皮肤仍可配置。</div><div class="table-wrapper"><table><thead><tr><th>序号</th><th>卡券</th><th>适用范围</th><th>核销说明</th><th>统计</th><th>系统时间</th><th>卡券状态</th><th>操作</th></tr></thead><tbody><tr><td>1</td><td class="coupon-cell"><strong>'+c.name+'</strong><span>ID：'+c.id+'</span><span>券类型：兑换券｜兑换规则：5选2</span><span>品牌：日产｜场景：'+c.scene+'</span></td><td class="coupon-cell"><strong>产品中心 GUI 皮肤</strong><span>含销售未上架但可兑换商品</span><span>候选SKU 5 个 / 每券兑换 2 件</span></td><td class="coupon-cell"><strong>车联网同步履约</strong><span>同一次请求返回最终成功/失败</span><span>成功创建兑换单并核销；失败不核销</span></td><td class="stat-pair">发放：1,380<br>库存：8,620<br>已兑换：428</td><td class="coupon-cell"><span>创建：2026-07-20 10:18</span><span>更新：2026-08-25 11:30</span><span>商品源：产品中心</span></td><td><span class="tag green">'+c.status+'</span></td><td><button class="btn btn-link" data-view>查看</button><button class="btn btn-link" data-edit>编辑</button></td></tr></tbody></table></div><div class="pagination"><span>共 1 条</span><span class="page-chip active">1</span></div></div></div>');
    },
    init: function () {
      document.getElementById('newCoupon').onclick=function(){window.navigateTo('admin-create');};
      document.querySelector('[data-view]').onclick=function(){showToast('查看态复用同一表单结构，字段只读');window.navigateTo('admin-create');};
      document.querySelector('[data-edit]').onclick=function(){window.navigateTo('admin-create');};
    }
  };
})();
