(function () {
  'use strict';

  var renderCount = 0;
  var lanes = ['卡券中心后台', '用户', 'E3S'];
  var laneDescriptions = {
    '卡券中心后台': '建券、选择适用商品并保存商品 code',
    '用户': '领取代金券',
    'E3S': '查询老友卡券、判断适用关系并核销'
  };
  var steps = [
    '创建代金券',
    '选择适用老友卡商品（支持多选）',
    '保存配置（商品 code 集合）',
    '用户领券',
    'E3S 通过新增类型 ID 查询用户老友卡券',
    'E3S 判断适用商品与卡券是否一致',
    '执行核销'
  ];

  var flowSource = [
    'flowchart LR',
    '    subgraph BACKEND["卡券中心后台"]',
    '        direction TB',
    '        CREATE["创建代金券"] --> SELECT["选择适用老友卡商品<br/>支持多选"] --> SAVE["保存配置<br/>商品 code 集合"]',
    '    end',
    '',
    '    subgraph USER["用户"]',
    '        direction TB',
    '        CLAIM["用户领券"]',
    '    end',
    '',
    '    subgraph E3S_LANE["E3S"]',
    '        direction TB',
    '        QUERY["通过新增类型 ID<br/>查询用户老友卡券"] --> MATCH{"判断适用商品与卡券<br/>是否一致"}',
    '        MATCH -- "一致" --> REDEEM["执行核销"]',
    '        MATCH -- "不一致" --> STOP["不执行核销"]',
    '    end',
    '',
    '    SAVE --> CLAIM',
    '    CLAIM --> QUERY',
    '',
    '    classDef action fill:#eff6ff,stroke:#5b8def,color:#1f2d3d,stroke-width:1px;',
    '    classDef decision fill:#fff7e6,stroke:#fa8c16,color:#8a4b08,stroke-width:1.5px;',
    '    classDef success fill:#f6ffed,stroke:#52c41a,color:#237804,stroke-width:1.5px;',
    '    classDef stop fill:#fff1f0,stroke:#ff4d4f,color:#a8071a,stroke-width:1.5px;',
    '    class CREATE,SELECT,SAVE,CLAIM,QUERY action;',
    '    class MATCH decision;',
    '    class REDEEM success;',
    '    class STOP stop;',
    '    style BACKEND fill:#f8fbff,stroke:#b8c7d9,stroke-width:1px;',
    '    style USER fill:#fffdf5,stroke:#e4cf98,stroke-width:1px;',
    '    style E3S_LANE fill:#f8fbff,stroke:#b8c7d9,stroke-width:1px;'
  ].join('\n');

  function render() {
    return '<section class="sequence-page" data-page="sequence" data-testid="sequence-page">' +
      '<div class="breadcrumb"><span>工作台</span><b>&gt;</b><span>卡券中心</span><b>&gt;</b><strong>建券至核销流程</strong></div>' +
      '<main class="sequence-content">' +
        '<section class="sequence-page-head"><div><span class="sequence-eyebrow">业务流程</span><h1>老友卡适用范围与核销流程</h1><p>从创建代金券到执行核销，按卡券中心后台、用户和 E3S 三个泳道展示。</p></div></section>' +
        '<section class="sequence-lane-summary" data-testid="flow-lanes" aria-label="流程泳道">' + lanes.map(function (lane) {
          return '<div><strong>' + window.escapeHTML(lane) + '</strong><span>' + window.escapeHTML(laneDescriptions[lane]) + '</span></div>';
        }).join('') + '</section>' +
        '<section class="sequence-diagram-card" aria-labelledby="sequence-diagram-title">' +
          '<header><div><h2 id="sequence-diagram-title">建券至核销</h2><p>一张代金券可关联多项老友卡商品；保存所选商品 code 集合。</p></div></header>' +
          '<div class="sequence-scroll" data-testid="sequence-scroll" role="region" aria-label="建券至核销业务流程图，可左右滑动查看" tabindex="0"><div id="sequence-board" class="sequence-board" data-testid="sequence-board"><div class="sequence-loading"><span class="el-icon-loading" aria-hidden="true"></span><p>正在生成业务流程图…</p></div></div></div>' +
          '<p class="sequence-scroll-hint">窄屏可在图内左右滑动查看完整流程。</p>' +
        '</section>' +
      '</main>' +
    '</section>';
  }

  function renderDiagram() {
    var board = document.getElementById('sequence-board');
    if (!board) return;
    if (!window.mermaid || typeof window.mermaid.render !== 'function') {
      board.innerHTML = '<div class="sequence-render-error"><strong>业务流程图未能加载。</strong><p>请刷新页面后重试。</p></div>';
      return;
    }
    window.mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'strict',
      theme: 'base',
      themeVariables: {
        fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, PingFang SC, Microsoft YaHei, sans-serif',
        primaryColor: '#eff6ff',
        primaryTextColor: '#1f2d3d',
        primaryBorderColor: '#5b8def',
        lineColor: '#6b7f95',
        clusterBkg: '#f8fbff',
        clusterBorder: '#b8c7d9'
      },
      flowchart: {
        useMaxWidth: false,
        htmlLabels: true,
        curve: 'linear',
        nodeSpacing: 36,
        rankSpacing: 48
      }
    });
    renderCount += 1;
    window.mermaid.render('old-friend-redemption-flow-' + renderCount, flowSource).then(function (result) {
      board.innerHTML = result.svg;
      if (result.bindFunctions) result.bindFunctions(board);
      if (window.AnnotationRuntime && typeof window.AnnotationRuntime.refresh === 'function') window.AnnotationRuntime.refresh();
    }).catch(function () {
      board.innerHTML = '<div class="sequence-render-error"><strong>业务流程图未能生成。</strong><p>请刷新页面后重试。</p></div>';
    });
  }

  window.Pages.sequence = {
    title: '建券至核销流程',
    source: flowSource,
    lanes: lanes.slice(),
    steps: steps.slice(),
    render: render,
    init: renderDiagram
  };
})();
