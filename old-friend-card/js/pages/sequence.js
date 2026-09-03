(function () {
  'use strict';

  var renderCount = 0;
  var stages = [
    { key: 'build', number: '01', title: '建券与查询', evidence: '已确认 + 接口稿', desc: '运营点击“老友卡”即打开多选弹窗；卡券中心按接口稿查询基础数据。' },
    { key: 'relation', number: '02', title: '多选并保存关系', evidence: '已确认 + 待确认', desc: '接口返回的商品均可选，isEnable 只展示不拦截；关系键、快照、版本和持久化结构待确认。' },
    { key: 'issue', number: '03', title: '发券 / 领券', evidence: '原型串联', desc: '用最小桥接说明券模板形成券实例并进入卡包；触发、资格和接口方向尚无合同。' },
    { key: 'wallet', number: '04', title: '卡包与详情', evidence: '已确认 + 历史证据', desc: '沿用既有维保券卡面；详情“适用商品”只展示名称，立即使用的正式去向待确认。' },
    { key: 'precheck', number: '05', title: '核销前校验', evidence: '业务已确认 / 技术待确认', desc: '卡券中心只判断当前商品是否命中券的适用范围，不用 isEnable 拦截；调用方向和比对责任不锁定。' },
    { key: 'redemption', number: '06', title: '核销结果', evidence: '业务目标 + 待确认', desc: '区分成功、明确失败和超时/结果未知，并保留退款、冲正、退券和历史券分支。' }
  ];

  var participants = [
    ['卡券运营人员', '创建与配置券'],
    ['卡券中心', '券与适用范围'],
    ['老友卡基础数据服务', '归属待确认'],
    ['发券渠道 / 活动中心', '触发链路待确认'],
    ['用户端卡包', '维保券展示'],
    ['E3S / 履约端', '使用与履约场景']
  ];

  var sequenceSource = [
    'sequenceDiagram',
    '    autonumber',
    '    participant OP as 卡券运营人员',
    '    participant CC as 卡券中心',
    '    participant DS as 老友卡基础数据服务',
    '    participant AC as 发券渠道 / 活动中心',
    '    participant WALLET as 用户端卡包',
    '    participant E3S as E3S / 履约端',
    '',
    '    rect rgb(238, 247, 255)',
    '        Note over OP,E3S: A. 建券与查询',
    '        OP->>CC: [已确认] 新建或编辑售后维保券',
    '        OP->>CC: [已确认] 点击“老友卡”',
    '        CC-->>OP: [已确认] 直接打开查询多选弹窗',
    '        CC->>DS: [接口稿 DNDC_NORMAL_S_SE_S070] POST 查询 carProductCode / carProductName / pageIndex / pageSize',
    '        alt 查询成功且 data 有结果',
    '            DS-->>CC: [接口稿] result / msg / data：carProductId / carProductCode / carProductName / serviceYear / usePrice / isEnable',
    '            CC-->>OP: 展示候选商品、加载状态和当前已选数',
    '        else 查询成功但结果为空',
    '            DS-->>CC: 空集合（分页包装与空值语义待确认）',
    '            CC-->>OP: 展示空结果，不生成虚假关联',
    '        else 明确失败或超时',
    '            DS-->>CC: 失败或结果未知（错误码与超时阈值待确认）',
    '            CC-->>OP: 保留已选草稿并提示重试，不默认全部适用',
    '        end',
    '    end',
    '',
    '    rect rgb(244, 250, 255)',
    '        Note over OP,E3S: B. 多选并保存关系',
    '        OP->>CC: [已确认] 复选多项老友卡商品并统一确认',
    '        CC->>CC: 按候选关系键去重并确认仍属于接口返回集合',
    '        alt 至少存在一项有效关联',
    '            CC->>CC: [待确认] 保存一券多商品关系、快照与版本',
    '            OP->>CC: 提交券模板配置',
    '            CC-->>OP: 返回保存结果（原型仅 Mock 反馈）',
    '        else 未选择或关联范围不可用',
    '            CC-->>OP: 阻止老友卡类型提交；不得默认适用全部商品',
    '        end',
    '        Note over OP,DS: [已确认] 接口返回的商品均可选；isEnable 只展示，不参与卡券中心选择判断',
    '    end',
    '',
    '    rect rgb(255, 250, 235)',
    '        Note over OP,E3S: C. 发券 / 领券（原型串联）',
    '        OP->>CC: [待确认] 券模板发布、启用或进入可发放状态',
    '        CC-->>AC: [原型串联] 提供可发放券模板',
    '        AC->>CC: [原型串联] 发券或领券请求',
    '        CC->>CC: [原型串联] 创建券实例并关联模板范围',
    '        CC-->>WALLET: [原型串联] 券实例进入用户卡包',
    '        Note over OP,WALLET: 触发方、领取资格、请求方向、失败处理及实例使用当前关系或发放快照均待确认',
    '    end',
    '',
    '    rect rgb(246, 249, 252)',
    '        Note over OP,E3S: D. 卡包与卡券详情',
    '        WALLET->>CC: 查询用户持有的售后维保券实例',
    '        CC-->>WALLET: 返回券实例与展示所需信息',
    '        WALLET->>WALLET: [已确认] 沿用既有维保券卡面',
    '        WALLET->>WALLET: [已确认] 详情“适用商品”只展示多项名称',
    '        WALLET->>WALLET: 用户点击“立即使用”',
    '        Note over WALLET,E3S: 正式跳转、深链、核销码及如何进入履约场景待确认',
    '    end',
    '',
    '    rect rgb(255, 248, 230)',
    '        Note over OP,E3S: E. 发起使用与核销前校验',
    '        WALLET-->>E3S: [待确认] 进入老友卡购买或履约场景',
    '        E3S->>E3S: 取得本次老友卡商品与订单 / 服务上下文',
    '        Note over CC,E3S: 下述箭头只表达商品标识需到达校验点，不锁定真实调用方向和责任方',
    '        E3S-->>CC: [待确认] 核销链路携带 carProductId 或 carProductCode',
    '        CC->>CC: 校验券实例、有效期、状态及使用条件',
    '        alt 券基础校验失败或结果未知',
    '            CC-->>E3S: 阻止继续；错误码、锁券与状态处理待确认',
    '        else 券基础校验通过',
    '            CC->>CC: 读取该券的一券多商品适用范围',
    '            alt 关联缺失或不可用',
    '                CC-->>E3S: 不得默认全部适用，停止核销',
    '            else 当前商品不命中关联集合',
    '                CC-->>E3S: [已确认] 不应返回核销成功',
    '            else 当前商品命中关联集合',
    '                CC->>CC: 形成适用范围命中结果',
    '            end',
    '        end',
    '        CC-->>E3S: 返回适用范围命中结果',
    '        Note over CC,DS: 卡券中心不使用 isEnable 拦截选择或范围命中',
    '        opt 履约侧另有商品有效性规则（待确认）',
    '            E3S->>E3S: 由对应责任系统按其规则处理，不回推为卡券中心规则',
    '        end',
    '        Note over CC,E3S: 任一失败分支均应终止后续成功链路；是否二次校验待确认',
    '    end',
    '',
    '    rect rgb(240, 249, 244)',
    '        Note over OP,E3S: F. 核销结果与后续处理',
    '        Note over CC,E3S: 正式核销请求方向、事务边界和最终责任系统待确认',
    '        E3S->>CC: [待确认] 进入既有核销触发点',
    '        alt 核销明确成功',
    '            CC->>CC: 仅在确认成功后更新券实例状态',
    '            CC-->>E3S: 返回核销成功',
    '            E3S-->>WALLET: 刷新或通知券状态（方式待确认）',
    '        else 核销明确失败',
    '            CC-->>E3S: 返回失败，不得包装为成功',
    '            E3S-->>WALLET: 失败提示与可重试性待确认',
    '        else 核销超时或结果未知',
    '            CC-->>E3S: 返回结果未知，不提前宣告成功',
    '            Note over CC,E3S: 幂等、查单、重试、补偿、对账和人工处理待确认',
    '        end',
    '        opt 取消、支付失败、退款、冲正、退券或解锁',
    '            E3S-->>CC: [待确认] 发送后续状态变化',
    '            CC->>CC: [待确认] 恢复、冲正或标记券状态',
    '            CC-->>WALLET: 券状态更新方式待确认',
    '        end',
    '        opt 历史券没有老友卡商品标识',
    '            CC->>CC: [待确认] 拒绝、沿用旧逻辑或灰度兼容',
    '            Note over CC,E3S: 无论采用哪种兼容方式，都不能默认适用全部老友卡',
    '        end',
    '    end'
  ].join('\n');

  function stageNavHTML() {
    return '<nav class="sequence-stage-nav" data-testid="sequence-stage-nav" aria-label="时序阶段快速定位">' + stages.map(function (stage, index) {
      return '<button class="sequence-stage-chip' + (index === 0 ? ' active' : '') + '" type="button" data-sequence-target="sequence-stage-' + stage.key + '"' + (index === 0 ? ' aria-current="step"' : '') + '><b>' + stage.number + '</b><span>' + window.escapeHTML(stage.title) + '</span></button>';
    }).join('') + '</nav>';
  }

  function participantsHTML() {
    return '<div class="sequence-participant-grid" data-testid="sequence-participants">' + participants.map(function (participant) {
      return '<div><strong>' + window.escapeHTML(participant[0]) + '</strong><span>' + window.escapeHTML(participant[1]) + '</span></div>';
    }).join('') + '</div>';
  }

  function stageCardsHTML() {
    return '<section class="sequence-stage-cards" aria-labelledby="sequence-stage-heading"><div class="sequence-section-head"><div><span class="sequence-eyebrow">逐段评审</span><h2 id="sequence-stage-heading">六阶段口径与异常分支</h2></div><p>点击上方阶段可定位到对应说明；主图始终展示完整链路。</p></div><div class="sequence-stage-grid">' + stages.map(function (stage) {
      var anno = stage.key === 'relation' ? ' data-anno="sequence-query-contract"' : stage.key === 'issue' ? ' data-anno="sequence-issue-bridge"' : stage.key === 'precheck' ? ' data-anno="sequence-precheck"' : stage.key === 'redemption' ? ' data-anno="sequence-redemption-results"' : '';
      var branches = '';
      if (stage.key === 'relation') branches = '<ul><li>正常：复选多项、统一确认、去重校验。</li><li data-testid="sequence-no-scope-branch">无范围：阻止提交且不得默认全量适用。</li><li>商品变更：改名、停用、删除、换版本规则待确认。</li></ul>';
      if (stage.key === 'precheck') branches = '<ul><li>券实例 / 有效期 / 状态 / 使用条件基础校验。</li><li data-testid="sequence-mismatch-branch">当前商品不命中关联集合：不得核销成功。</li><li>卡券中心不按 isEnable 拦截；其他履约有效性规则及责任方待确认。</li></ul>';
      if (stage.key === 'redemption') branches = '<ul><li data-testid="sequence-success-branch">明确成功：确认成功后才更新券实例。</li><li data-testid="sequence-failure-branch">明确失败：返回失败，不包装为成功。</li><li data-testid="sequence-unknown-branch">超时 / 未知：不提前成功，查单与补偿待确认。</li></ul>';
      return '<article id="sequence-stage-' + stage.key + '" class="sequence-stage-card" data-testid="sequence-stage-' + stage.key + '"' + anno + '><header><span>' + stage.number + '</span><div><h3>' + window.escapeHTML(stage.title) + '</h3><small>' + window.escapeHTML(stage.evidence) + '</small></div></header><p>' + window.escapeHTML(stage.desc) + '</p>' + branches + '</article>';
    }).join('') + '</div></section>';
  }

  function render() {
    return '<section class="sequence-page" data-page="sequence" data-testid="sequence-page">' +
      '<div class="breadcrumb"><span>工作台</span><b>&gt;</b><span>卡券中心</span><b>&gt;</b><strong>完整时序图</strong></div>' +
      '<main class="sequence-content">' +
        '<section class="sequence-page-head"><div><span class="sequence-eyebrow">跨系统评审 · DFN-20260903-001</span><h1 data-anno="sequence-object-boundary">售后维保券 × 老友卡｜从建券到核销</h1><p>老友卡是外部商品，售后维保券是卡券中心券对象。主图完整串联配置、发放、卡包、校验和核销，并把未确认合同留在图内。</p></div><div class="sequence-status"><strong>方案评审</strong><span>业务语义已分层</span><small>接口合同与运行链路待确认</small></div></section>' +
        '<section class="sequence-boundary" aria-label="图示口径"><strong>本图口径</strong><span>✓ 先查询再关联</span><span>✓ 一券可关联多项商品</span><span>✓ 当前商品命中后才可核销成功</span><span>! 不锁定正式调用方向</span></section>' +
        '<section class="sequence-participants" aria-labelledby="sequence-participant-title"><div class="sequence-section-head compact"><div><span class="sequence-eyebrow">参与方</span><h2 id="sequence-participant-title">六方职责边界</h2></div><p>“老友卡基础数据服务”与 E3S / 履约端分列，服务归属不做推断。</p></div>' + participantsHTML() + '</section>' +
        stageNavHTML() +
        '<section class="sequence-diagram-card" aria-labelledby="sequence-diagram-title"><header><div><h2 id="sequence-diagram-title">完整跨系统时序</h2><p>实线表示请求或业务动作，虚线表示返回；自回路表示系统内部处理。</p></div><div class="sequence-actions"><button class="btn" id="toggle-sequence-source" type="button">查看源码</button><button class="btn btn-primary" id="copy-sequence-source" type="button">复制 Mermaid 源码</button></div></header>' +
          '<div class="sequence-evidence-legend" aria-label="证据等级图例"><span class="confirmed">已确认</span><span class="contract">接口稿</span><span class="bridge">原型串联</span><span class="pending">待确认</span></div>' +
          '<div class="sequence-scroll" data-testid="sequence-scroll" role="region" aria-label="从建券到核销的完整时序图，左右滑动查看全部参与方" tabindex="0"><div id="sequence-board" class="sequence-board" data-testid="sequence-board"><div class="sequence-loading"><span class="el-icon-loading" aria-hidden="true"></span><p>正在生成完整时序图…</p></div></div></div>' +
          '<p class="sequence-scroll-hint">图较宽：可在图内横向滚动查看 6 个参与方；页面本身不会横向溢出。</p>' +
        '</section>' +
        '<details class="sequence-source-panel" id="sequence-source-panel"><summary>Mermaid 源码（本地可读备份）</summary><pre><code id="sequence-source-view">' + window.escapeHTML(sequenceSource) + '</code></pre></details>' +
        stageCardsHTML() +
        '<section class="sequence-open-items"><div><span class="sequence-eyebrow">评审边界</span><h2>这张图没有替大家做决定</h2></div><ul><li>查询服务的正式归属，以及 DNDC 与 E3S 的关系。</li><li>券模板发布、发券/领券触发、资格判断和关系快照。</li><li>核销请求方向、校验责任、时点、字段、错误码与幂等。</li><li>超时查单、重试、补偿、对账、退款冲正和历史券兼容。</li></ul></section>' +
      '</main>' +
    '</section>';
  }

  function setActiveStage(button) {
    document.querySelectorAll('[data-sequence-target]').forEach(function (item) {
      item.classList.toggle('active', item === button);
      if (item === button) item.setAttribute('aria-current', 'step');
      else item.removeAttribute('aria-current');
    });
  }

  function bindStageNavigation() {
    document.querySelectorAll('[data-sequence-target]').forEach(function (button) {
      button.addEventListener('click', function () {
        var target = document.getElementById(button.getAttribute('data-sequence-target'));
        setActiveStage(button);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  function fallbackCopy(text) {
    var area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    var copied = false;
    try { copied = document.execCommand('copy'); } catch (error) { copied = false; }
    area.remove();
    return copied;
  }

  function bindSourceActions() {
    var panel = document.getElementById('sequence-source-panel');
    var toggle = document.getElementById('toggle-sequence-source');
    var copy = document.getElementById('copy-sequence-source');
    if (toggle && panel) {
      toggle.addEventListener('click', function () {
        panel.open = !panel.open;
        toggle.textContent = panel.open ? '收起源码' : '查看源码';
        if (panel.open) panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
    if (copy) {
      copy.addEventListener('click', function () {
        var done = function (ok) {
          copy.textContent = ok ? '已复制' : '请在源码区手动复制';
          window.setTimeout(function () { copy.textContent = '复制 Mermaid 源码'; }, 1800);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(sequenceSource).then(function () { done(true); }).catch(function () { done(fallbackCopy(sequenceSource)); });
        } else {
          done(fallbackCopy(sequenceSource));
        }
      });
    }
  }

  function renderDiagram() {
    var board = document.getElementById('sequence-board');
    if (!board) return;
    if (!window.mermaid || typeof window.mermaid.render !== 'function') {
      board.innerHTML = '<div class="sequence-render-error"><strong>时序图运行库未加载。</strong><p>请展开下方 Mermaid 源码查看完整内容。</p></div>';
      return;
    }
    window.mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'strict',
      theme: 'base',
      themeVariables: {
        fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, PingFang SC, Microsoft YaHei, sans-serif',
        primaryColor: '#edf6ff',
        primaryTextColor: '#203247',
        primaryBorderColor: '#78a8d8',
        lineColor: '#5d7085',
        secondaryColor: '#f7fafc',
        tertiaryColor: '#fff9e8',
        actorBkg: '#1f4e73',
        actorBorder: '#1f4e73',
        actorTextColor: '#ffffff',
        signalColor: '#536b7d',
        signalTextColor: '#314153',
        noteBkgColor: '#fffdf4',
        noteBorderColor: '#d6c57e'
      },
      sequence: { useMaxWidth: false, wrap: true, diagramMarginX: 34, diagramMarginY: 18, actorMargin: 42, width: 174, height: 62, boxMargin: 10, messageMargin: 32, noteMargin: 12 }
    });
    renderCount += 1;
    window.mermaid.render('old-friend-full-sequence-' + renderCount, sequenceSource).then(function (result) {
      board.innerHTML = result.svg;
      if (result.bindFunctions) result.bindFunctions(board);
      if (window.AnnotationRuntime && typeof window.AnnotationRuntime.refresh === 'function') window.AnnotationRuntime.refresh();
    }).catch(function (error) {
      board.innerHTML = '<div class="sequence-render-error"><strong>完整时序图生成失败。</strong><p>请展开下方 Mermaid 源码查看内容；错误：' + window.escapeHTML(error && error.message ? error.message : error) + '</p></div>';
      var panel = document.getElementById('sequence-source-panel');
      if (panel) panel.open = true;
    });
  }

  function init() {
    bindStageNavigation();
    bindSourceActions();
    renderDiagram();
  }

  window.Pages.sequence = {
    title: '建券至核销完整时序图',
    source: sequenceSource,
    stages: stages.slice(),
    render: render,
    init: init
  };
})();
