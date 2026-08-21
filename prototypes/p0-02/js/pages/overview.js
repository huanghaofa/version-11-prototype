(function () {
  'use strict';

  function render() {
    var body =
      '<div class="grid-4">' +
        '<div class="metric-card"><strong>新增</strong><span>特殊券类型：组合折扣券</span></div>' +
        '<div class="metric-card"><strong>0折</strong><span>配置优惠范围内免费</span></div>' +
        '<div class="metric-card"><strong>2种</strong><span>自由组合、分组组合</span></div>' +
        '<div class="metric-card"><strong>Excel</strong><span>支持批量上传商品</span></div>' +
      '</div>' +
      window.UI.panel('组合折扣券模型', '<div class="grid-3">' +
        '<article class="summary-card"><span class="number">1</span><h3>自由组合保留</h3><p>商品池内可任选一个或多个商品，每项不超过独立配置的最大核销数量。</p></article>' +
        '<article class="summary-card"><span class="number">2</span><h3>分组覆盖固定组合</h3><p>多组任选一、组内全部满足；仅配置一个分组时即等同原固定组合。</p></article>' +
        '<article class="summary-card"><span class="number">3</span><h3>0 折免费</h3><p>券级折扣允许配置 0 折；分组最低数量或自由组合最大数量范围内的商品免费。</p></article>' +
      '</div>') +
      '<div class="grid-2">' +
        window.UI.panel('卡券中心配置', '<ul class="rule-list"><li>只有组合折扣券开放多备件</li><li>券级共用折扣支持 0 折免费</li><li>自由组合配置商品最大核销数量</li><li>分组组合配置商品最低核销数量</li><li>Excel 支持追加或清空后覆盖</li></ul>') +
        window.UI.panel('E3S 联动改造', '<ul class="rule-list"><li>自由组合：提交实际选择的商品</li><li>分组组合：提交命中的单个组合</li><li>卡券中心按组合方式校验编码和数量</li><li>同一请求整体成功或整体失败</li></ul>') +
      '</div>' +
      window.UI.panel('边界与待确认', '<div class="callout warning"><strong>历史券及原核销列表保持不变：</strong>其他券类型继续使用原单对象规则；正式组合标识字段和同商品多价格工单行的优惠匹配顺序仍待接口评审。</div>');

    return window.UI.pageShell(
      '组合折扣券与多核销组合改造总览',
      '覆盖组合折扣券的自由组合、分组组合、Excel 商品导入，以及 E3S 一次核销多个备件的联动改造。',
      body,
      '<button class="btn btn-primary" id="goCreate">进入建券配置</button>'
    );
  }

  function init() {
    document.getElementById('goCreate').addEventListener('click', function () {
      window.navigateTo('coupon-create');
    });
  }

  window.Pages.overview = { render: render, init: init };
})();
