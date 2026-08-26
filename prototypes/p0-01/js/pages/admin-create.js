(function () {
  'use strict';

  var pageSize = 5;

  function typeLabel(value) {
    var item = window.ExchangeCouponMock.fulfillmentTypes.find(function (type) { return type.value === value; });
    return item ? item.label : value;
  }

  function supports(product, type) {
    return (product.allowedFulfillmentValues || []).indexOf(type) > -1;
  }

  function phaseEligible(product) {
    return product.sourceSystem === '产品中心' && product.productType === 'GUI_SKIN' && product.configEligible !== false && product.redeemable !== false && supports(product, window.PrototypeState.couponFulfillmentType);
  }

  function selectedProducts() {
    return window.ExchangeCouponMock.products.filter(function (product) {
      return window.PrototypeState.selectedProductIds.indexOf(product.id) > -1;
    });
  }

  function productMax(productId) {
    return Number(window.PrototypeState.couponProductRules[productId] || 1);
  }

  function selectedRows() {
    var mode = window.PrototypeState.ruleMode;
    var rows = selectedProducts().map(function (product) {
      var ruleCell = mode === 'choice'
        ? '<div class="inline sku-max-inline"><input class="input sku-max-input" type="number" min="1" data-max-product="' + product.id + '" value="' + productMax(product.id) + '"><span>件</span></div>'
        : '<div class="qty-control"><button data-admin-minus="' + product.id + '">−</button><span>' + productMax(product.id) + '</span><button data-admin-plus="' + product.id + '">＋</button></div>';
      return '<div class="selected-row selected-row-single-fulfillment">' +
        '<div><b>' + (product.spuName || product.name) + '</b><div class="sku-spec-line"><span class="tag blue">规格：' + (product.specName || '默认规格') + '</span><code>' + product.id + '</code></div><div class="helper">产品中心 · ' + product.productTypeLabel + ' · ' + product.saleStatusLabel + (product.saleStatus === 'not_listed' ? '（不影响兑换）' : '') + '</div></div>' +
        '<div>' + ruleCell + '</div><div><span class="tag blue">' + typeLabel(window.PrototypeState.couponFulfillmentType) + '</span></div>' +
        '<button class="btn btn-link remove-product" data-id="' + product.id + '">移除</button></div>';
    }).join('');
    return rows || '<div class="helper">尚未选择兑换 SKU/规格，请从与整券履约方式兼容的商品中下钻选择。</div>';
  }

  function selectedTotal() {
    return selectedProducts().reduce(function (sum, product) { return sum + productMax(product.id); }, 0);
  }

  function compatibleProducts() {
    return window.ExchangeCouponMock.products.filter(function (product) {
      return supports(product, window.PrototypeState.couponFulfillmentType);
    });
  }

  function eligibleProducts() {
    return compatibleProducts().filter(phaseEligible);
  }

  function switchFulfillment(nextValue, selectEl) {
    var previous = window.PrototypeState.couponFulfillmentType;
    if (previous === nextValue) return;
    var incompatible = selectedProducts().filter(function (product) { return !supports(product, nextValue); });
    if (!incompatible.length) {
      window.PrototypeState.couponFulfillmentType = nextValue;
      window.navigateTo('admin-create');
      return;
    }
    selectEl.value = previous;
    var names = incompatible.map(function (product) { return product.name; }).join('、');
    var host = window.openModal('<div class="modal-content confirm-switch-modal"><div class="modal-header"><b>切换整券履约方式</b><button class="btn btn-link" data-close-modal>×</button></div>' +
      '<div class="modal-body"><div class="evidence-note warn">切换为“' + typeLabel(nextValue) + '”后，下列不兼容商品将从候选池移除：<b>' + names + '</b>。</div><p class="helper" style="margin-top:12px">一张兑换券只能配置一种履约方式，不能保留跨履约商品。</p></div>' +
      '<div class="modal-footer"><button class="btn" data-close-modal>取消切换</button><button class="btn btn-primary" id="confirmFulfillmentSwitch">确认切换</button></div></div>');
    host.querySelector('#confirmFulfillmentSwitch').onclick = function () {
      var removedIds = incompatible.map(function (product) { return product.id; });
      window.PrototypeState.selectedProductIds = window.PrototypeState.selectedProductIds.filter(function (id) { return removedIds.indexOf(id) === -1; });
      removedIds.forEach(function (id) { delete window.PrototypeState.couponProductRules[id]; });
      window.PrototypeState.couponFulfillmentType = nextValue;
      host.remove();
      window.navigateTo('admin-create');
      window.showToast('履约方式已切换，不兼容商品已移除');
    };
  }

  function importFields() {
    var quantityField = window.PrototypeState.ruleMode === 'choice'
      ? {name:'单商品最多可兑换数量',required:'是',example:'2',rule:'正整数；用户选择该SKU时不可超过此数量'}
      : {name:'固定兑换数量',required:'是',example:'1',rule:'正整数；固定组合中该SKU的兑换件数'};
    return [
      {name:'产品中心SKU编码',required:'是',example:'SKU-GUI-10002',rule:'产品中心唯一SKU编码，用于匹配具体GUI皮肤规格'},
      {name:'商品名称',required:'否',example:'深海流光皮肤·深海蓝',rule:'仅供运营核对，不作为商品匹配依据'},
      {name:'商品类型',required:'是',example:'GUI_SKIN',rule:'一期只允许GUI_SKIN；流量、会员及其他类型校验失败'},
      quantityField,
      {name:'销售上架状态',required:'否',example:'NOT_LISTED',rule:'仅展示；未上架但产品中心可兑换的GUI皮肤仍可导入'}
    ];
  }

  function importFieldTable(withExampleRow) {
    var fields = importFields();
    var header = '<div class="table-wrapper import-field-table"><table><thead><tr><th>字段</th><th>是否必填</th><th>示例</th><th>校验规则</th></tr></thead><tbody>';
    var rows = fields.map(function (field) {
      return '<tr><td><b>' + field.name + '</b></td><td><span class="tag ' + (field.required === '是' ? 'orange' : 'gray') + '">' + field.required + '</span></td><td><code>' + field.example + '</code></td><td>' + field.rule + '</td></tr>';
    }).join('');
    var example = withExampleRow
      ? '</tbody></table></div><div class="template-example"><b>Excel 示例行</b><div><code>SKU-GUI-10002</code><span>深海流光皮肤·深海蓝</span><code>GUI_SKIN</code><code>' + (window.PrototypeState.ruleMode === 'choice' ? '2' : '1') + '</code><code>NOT_LISTED</code></div></div>'
      : '</tbody></table></div>';
    return header + rows + example;
  }

  function uploadProductsModal() {
    var selectedFile = '';
    var validated = false;
    var modeLabel = window.PrototypeState.ruleMode === 'choice' ? 'N选M' : '固定商品组合';
    var host = window.openModal('<div class="modal-content product-import-modal"><div class="modal-header"><b>批量导入适用商品</b><button class="btn btn-link" data-close-modal>×</button></div>' +
      '<div class="modal-body"><div class="import-context-grid"><div><span>商品数据源</span><b>产品中心</b></div><div><span>一期商品范围</span><b>仅 GUI 皮肤</b></div><div><span>当前已选 SKU/规格</span><b>' + selectedProducts().length + ' 个</b></div></div>' +
      '<div class="import-section"><h3>1. 选择导入方式</h3><div class="radio-row"><label><input type="radio" name="importMode" value="append" checked> 追加商品</label><label><input type="radio" name="importMode" value="replace"> 覆盖当前商品</label></div><p class="helper">追加时保留当前商品；覆盖时以文件中的有效数据替换当前候选池。</p></div>' +
      '<div class="import-section"><h3>2. 上传文件</h3><div class="file-picker-row"><button class="btn" id="pickProductFile">选择 Excel 文件</button><span id="productFileName">未选择文件</span></div><p class="helper">仅支持 .xlsx，文件不超过 5MB，读取第一个工作表，最多 5,000 行。</p></div>' +
      '<div class="import-section"><h3>3. 文件字段</h3>' + importFieldTable(false) + '<div class="evidence-note" style="margin-top:12px">按产品中心商品类型与可兑换标识校验：GUI皮肤可通过；销售未上架不拦截；会员、流量及其他类型失败。</div></div>' +
      '<div id="importPreview" class="import-preview" hidden></div></div>' +
      '<div class="modal-footer"><button class="btn" data-close-modal>取消</button><button class="btn btn-primary" id="validateProductFile">开始校验</button></div></div>');
    host.querySelector('#pickProductFile').onclick = function () {
      selectedFile = '兑换券商品导入示例.xlsx';
      host.querySelector('#productFileName').innerHTML = '<span class="tag green">已选择</span> ' + selectedFile;
      host.querySelector('#importPreview').hidden = true;
      host.querySelector('#validateProductFile').textContent = '开始校验';
      validated = false;
    };
    host.querySelector('#validateProductFile').onclick = function () {
      if (!selectedFile) { window.showToast('请先选择 Excel 文件'); return; }
      if (!validated) {
        validated = true;
        host.querySelector('#importPreview').hidden = false;
        host.querySelector('#importPreview').innerHTML = '<div class="import-result-head"><b>模拟校验结果</b><span>共4行：<em>2行通过</em>，<strong>2行失败</strong></span></div><div class="import-result-row"><code>第2行 · SKU-GUI-10001</code><span class="tag green">通过</span><span>GUI皮肤，已上架且可兑换</span></div><div class="import-result-row"><code>第3行 · SKU-GUI-10002</code><span class="tag green">通过</span><span>GUI皮肤，销售未上架但产品中心可兑换</span></div><div class="import-result-row error"><code>第4行 · SKU-TRAFFIC-20001</code><span class="tag red">失败</span><span>流量类不在一期范围</span></div><div class="import-result-row error"><code>第5行 · SKU-MEMBER-30001</code><span class="tag red">失败</span><span>会员类不在一期范围</span></div><p class="helper">确认导入时仅导入校验通过的数据；其他商品类型需移除后重新上传。</p>';
        host.querySelector('#validateProductFile').textContent = '确认导入通过数据';
        return;
      }
      host.remove();
      window.showToast('原型演示：2条产品中心GUI皮肤已完成模拟导入');
    };
  }

  function downloadTemplateModal() {
    var modeLabel = window.PrototypeState.ruleMode === 'choice' ? 'N选M' : '固定商品组合';
    var host = window.openModal('<div class="modal-content product-import-modal"><div class="modal-header"><b>下载商品导入模板</b><button class="btn btn-link" data-close-modal>×</button></div>' +
      '<div class="modal-body"><div class="import-context-grid"><div><span>模板版本</span><b>V2026.08</b></div><div><span>商品数据源</span><b>产品中心</b></div><div><span>一期范围</span><b>仅 GUI 皮肤</b></div></div>' +
      '<div class="import-section"><h3>模板字段说明</h3>' + importFieldTable(true) + '</div>' +
      '<div class="evidence-note warn" style="margin-top:14px"><b>下载口径：</b>模板根据当前兑换方式生成数量字段；商品类型必须为GUI_SKIN。销售上架状态只作展示，未上架但产品中心可兑换的GUI皮肤可以导入。</div></div>' +
      '<div class="modal-footer"><button class="btn" data-close-modal>取消</button><button class="btn btn-primary" id="confirmDownloadTemplate">下载 Excel 模板</button></div></div>');
    host.querySelector('#confirmDownloadTemplate').onclick = function () {
      host.remove();
      window.showToast('原型演示：已生成“兑换券商品导入模板_' + modeLabel + '.xlsx”');
    };
  }

  function productModal() {
    var mode = window.PrototypeState.ruleMode;
    var currentPage = 1;
    var currentPageGroups = [];
    var draftSelectedIds = window.PrototypeState.selectedProductIds.slice();
    var draftRules = Object.assign({}, window.PrototypeState.couponProductRules);
    var supplierOptions = window.ExchangeCouponMock.suppliers.map(function (supplier) {
      return '<option value="' + supplier.id + '">' + supplier.name + '</option>';
    }).join('');
    var host = window.openModal('<div class="modal-content product-modal"><div class="modal-header"><b>选择适用商品</b><button class="btn btn-link" data-close-modal>×</button></div><div class="modal-body">' +
      '<div class="modal-toolbar"><input class="input" id="productKeyword" placeholder="请输入商品名称、产品中心SKU或规格"><select class="select" id="categoryFilter" style="max-width:180px"><option value="">全部商品类型</option><option value="GUI_SKIN">GUI皮肤</option><option value="TRAFFIC">流量（一期不支持）</option><option value="MEMBERSHIP">会员（一期不支持）</option><option value="OTHER">其他（一期不支持）</option></select><select class="select" id="supplierFilter" style="max-width:210px"><option value="">全部供应商</option>' + supplierOptions + '</select><button class="btn btn-primary" id="queryProducts">查询</button><button class="btn" id="resetProducts">重置</button></div>' +
      '<div class="helper supplier-source">商品名称、类型、SKU/规格、供应商、销售上架状态和可兑换标识均来源于产品中心。</div>' +
      '<div class="evidence-note" style="margin:10px 0 12px"><b>一期仅允许 GUI 皮肤。</b>销售未上架不作为禁选理由；只要产品中心标记可兑换，仍可加入候选池。会员、流量及其他类型显示但不可选择。</div>' +
      '<div class="table-wrapper"><table><thead><tr><th><label class="product-select-all"><input type="checkbox" id="selectAllProducts"> <span>全选本页可用规格</span></label></th><th>商品</th><th>产品类型</th><th>销售上架状态</th><th>规格数</th><th>一期范围</th><th>操作</th></tr></thead><tbody id="productRows"></tbody></table></div>' +
      '<div class="product-selection-footer"><div class="product-selection-count" id="productSelectionSummary"></div><div class="pagination product-pagination" id="productPagination"></div></div></div>' +
      '<div class="modal-footer"><button class="btn" data-close-modal>取消</button><button class="btn btn-primary" id="confirmProducts">提交</button></div></div>');

    function productGroups() {
      var groups = {};
      compatibleProducts().forEach(function (sku) {
        var spuId = sku.spuId || ('SPU-' + sku.id);
        if (!groups[spuId]) {
          groups[spuId] = {
            id: spuId,
            name: sku.spuName || sku.name,
            category: sku.category,
            subCategory: sku.subCategory,
            supplierId: sku.supplierId,
            supplier: sku.supplier,
            productType: sku.productType,
            productTypeLabel: sku.productTypeLabel,
            saleStatus: sku.saleStatus,
            saleStatusLabel: sku.saleStatusLabel,
            configEligible: sku.configEligible,
            exclusionReason: sku.exclusionReason,
            skus: []
          };
        }
        groups[spuId].skus.push(sku);
      });
      return Object.keys(groups).map(function (id) { return groups[id]; });
    }

    function filteredProducts() {
      var keyword = host.querySelector('#productKeyword').value.trim().toLowerCase();
      var category = host.querySelector('#categoryFilter').value;
      var supplier = host.querySelector('#supplierFilter').value;
      return productGroups().filter(function (group) {
        var skuKeywords = group.skus.map(function (sku) { return sku.id + ' ' + (sku.specName || '') + ' ' + sku.name; }).join(' ');
        return (!keyword || (group.name + ' ' + skuKeywords).toLowerCase().indexOf(keyword) > -1) &&
          (!category || group.productType === category) &&
          (!supplier || group.supplierId === supplier);
      });
    }

    function selectedSkuCount(group) {
      return group.skus.filter(function (sku) { return draftSelectedIds.indexOf(sku.id) > -1; }).length;
    }

    function rowHtml(group) {
      var selectedCount = selectedSkuCount(group);
      var allSelected = selectedCount === group.skus.length;
      var eligible = group.skus.some(phaseEligible);
      var saleLabel = group.skus.some(function (sku) { return sku.saleStatus === 'not_listed'; }) ? '含销售未上架规格' : '已上架';
      return '<tr data-product-row="' + group.id + '" class="' + (eligible ? '' : 'row-disabled') + '"><td><input type="checkbox" class="product-group-check" data-id="' + group.id + '" ' + (allSelected ? 'checked' : '') + ' ' + (eligible ? '' : 'disabled') + ' aria-label="选择 ' + group.name + ' 的可用规格"></td>' +
        '<td><b>' + group.name + '</b><div class="helper">' + group.id + ' · 产品中心</div></td><td><span class="tag ' + (eligible ? 'blue' : 'gray') + '">' + group.productTypeLabel + '</span></td><td>' + saleLabel + '<div class="helper">未上架不影响可兑换判断</div></td><td><b>' + group.skus.length + '</b> 个规格<div class="helper">已选 ' + selectedCount + ' 个</div></td><td>' + (eligible ? '<span class="tag green">一期可选</span>' : '<span class="tag red">一期不支持</span><div class="helper">' + (group.exclusionReason || '仅支持GUI皮肤') + '</div>') + '</td><td><button class="btn btn-link product-drill-action" data-choose-skus="' + group.id + '" ' + (eligible ? '' : 'disabled') + '>' + (eligible ? (selectedCount ? '修改规格' : '选择规格') : '不可选择') + '</button></td></tr>';
    }

  function setDraftSelected(id, selected) {
      var product = window.ExchangeCouponMock.products.find(function (item) { return item.id === id; });
      if (selected && !phaseEligible(product)) return;
      var index = draftSelectedIds.indexOf(id);
      if (selected && index === -1) draftSelectedIds.push(id);
      if (!selected && index > -1) draftSelectedIds.splice(index, 1);
      if (!draftRules[id]) draftRules[id] = 1;
    }

    function updateSelectionState() {
      var currentPageSkus = [];
      currentPageGroups.forEach(function (group) { currentPageSkus = currentPageSkus.concat(group.skus.filter(phaseEligible)); });
      var selectedOnPage = currentPageSkus.filter(function (sku) { return draftSelectedIds.indexOf(sku.id) > -1; }).length;
      var selectAll = host.querySelector('#selectAllProducts');
      selectAll.checked = currentPageSkus.length > 0 && selectedOnPage === currentPageSkus.length;
      selectAll.indeterminate = selectedOnPage > 0 && selectedOnPage < currentPageSkus.length;
      var selectedSpuIds = {};
      eligibleProducts().forEach(function (sku) { if (draftSelectedIds.indexOf(sku.id) > -1) selectedSpuIds[sku.spuId || sku.id] = true; });
      host.querySelector('#productSelectionSummary').innerHTML = '已选 <strong>' + draftSelectedIds.length + '</strong> 个 SKU/规格<span>· 覆盖 ' + Object.keys(selectedSpuIds).length + ' 个商品，翻页和筛选后仍保留</span>';
    }

    function openSkuModal(group) {
      var eligibleSkus = group.skus.filter(phaseEligible);
      var tempSelectedIds = eligibleSkus.filter(function (sku) { return draftSelectedIds.indexOf(sku.id) > -1; }).map(function (sku) { return sku.id; });
      var tempRules = Object.assign({}, draftRules);
      var specHost = window.openModal('<div class="modal-content sku-modal"><div class="modal-header"><div><b>选择规格 / SKU</b><div class="helper">' + group.name + ' · ' + group.id + '</div></div><button class="btn btn-link" data-close-modal>×</button></div><div class="modal-body">' +
        '<div class="evidence-note" style="margin-bottom:12px">请勾选需要加入兑换券候选池的具体规格。' + (mode === 'choice' ? '“最多可兑换数量”按每个 SKU 独立保存。' : '“固定兑换数量”按每个 SKU 独立保存。') + '</div>' +
        '<div class="sku-selection-note"><label class="product-select-all"><input type="checkbox" id="selectAllSkus"> 全选本商品规格</label><span id="skuSelectionCount"></span></div>' +
        '<div class="table-wrapper sku-modal-table"><table><thead><tr><th>选择</th><th>规格</th><th>产品中心SKU</th><th>销售上架状态</th><th>可兑换标识</th><th>' + (mode === 'choice' ? '单SKU最多可兑' : '固定兑换数量') + '</th></tr></thead><tbody id="skuRows"></tbody></table></div></div>' +
        '<div class="modal-footer"><button class="btn" data-close-modal>取消</button><button class="btn btn-primary" id="confirmSkuSelection">确认规格</button></div></div>');

      function renderSkuRows() {
        specHost.querySelector('#skuRows').innerHTML = group.skus.map(function (sku) {
          var checked = tempSelectedIds.indexOf(sku.id) > -1;
          var eligible = phaseEligible(sku);
          return '<tr data-sku-row="' + sku.id + '" class="' + (eligible ? '' : 'row-disabled') + '"><td><input type="checkbox" class="sku-check" data-id="' + sku.id + '" ' + (checked ? 'checked' : '') + ' ' + (eligible ? '' : 'disabled') + ' aria-label="选择规格 ' + (sku.specName || '默认规格') + '"></td><td><b>' + (sku.specName || '默认规格') + '</b><div class="helper">' + sku.name + '</div></td><td><code>' + sku.id + '</code></td><td>' + sku.saleStatusLabel + (sku.saleStatus === 'not_listed' ? '<div class="helper">不影响兑换</div>' : '') + '</td><td>' + (eligible ? '<span class="tag green">可兑换</span>' : '<span class="tag red">一期不可选</span>') + '</td><td><div class="inline sku-max-inline"><input class="input sku-max-input" type="number" min="1" data-sku-rule="' + sku.id + '" value="' + Number(tempRules[sku.id] || 1) + '" ' + (checked && eligible ? '' : 'disabled') + '><span>件</span></div></td></tr>';
        }).join('');
        var selectAllSkus = specHost.querySelector('#selectAllSkus');
        selectAllSkus.checked = eligibleSkus.length > 0 && tempSelectedIds.length === eligibleSkus.length;
        selectAllSkus.indeterminate = tempSelectedIds.length > 0 && tempSelectedIds.length < eligibleSkus.length;
        specHost.querySelector('#skuSelectionCount').innerHTML = '已选 <b>' + tempSelectedIds.length + '</b> / ' + eligibleSkus.length + ' 个一期可用规格';
        specHost.querySelectorAll('.sku-check').forEach(function (check) {
          check.onchange = function () {
            var index = tempSelectedIds.indexOf(check.dataset.id);
            if (check.checked && index === -1) tempSelectedIds.push(check.dataset.id);
            if (!check.checked && index > -1) tempSelectedIds.splice(index, 1);
            if (!tempRules[check.dataset.id]) tempRules[check.dataset.id] = 1;
            renderSkuRows();
          };
        });
        specHost.querySelectorAll('[data-sku-rule]').forEach(function (input) {
          input.onchange = function () { tempRules[input.dataset.skuRule] = Math.max(1, Number(input.value) || 1); input.value = tempRules[input.dataset.skuRule]; };
        });
      }

      specHost.querySelector('#selectAllSkus').onchange = function () {
        tempSelectedIds = this.checked ? eligibleSkus.map(function (sku) { return sku.id; }) : [];
        tempSelectedIds.forEach(function (id) { if (!tempRules[id]) tempRules[id] = 1; });
        renderSkuRows();
      };
      specHost.querySelector('#confirmSkuSelection').onclick = function () {
        group.skus.forEach(function (sku) {
          setDraftSelected(sku.id, tempSelectedIds.indexOf(sku.id) > -1);
          if (tempSelectedIds.indexOf(sku.id) > -1) draftRules[sku.id] = Math.max(1, Number(tempRules[sku.id] || 1));
        });
        specHost.remove();
        renderTable();
      };
      renderSkuRows();
    }

    function bindRows() {
      host.querySelectorAll('.product-group-check').forEach(function (check) {
        var currentGroup = productGroups().find(function (item) { return item.id === check.dataset.id; });
        var currentSelectedCount = selectedSkuCount(currentGroup);
        check.indeterminate = currentSelectedCount > 0 && currentSelectedCount < currentGroup.skus.length;
        check.onchange = function () {
          var group = productGroups().find(function (item) { return item.id === check.dataset.id; });
          group.skus.filter(phaseEligible).forEach(function (sku) { setDraftSelected(sku.id, check.checked); });
          renderTable();
        };
      });
      host.querySelectorAll('[data-choose-skus]').forEach(function (button) {
        button.onclick = function () {
          var group = productGroups().find(function (item) { return item.id === button.dataset.chooseSkus; });
          openSkuModal(group);
        };
      });
    }

    function renderPagination(total, totalPages) {
      var pages = '';
      for (var page = 1; page <= totalPages; page++) pages += '<button class="page-chip ' + (page === currentPage ? 'active' : '') + '" data-page="' + page + '">' + page + '</button>';
      host.querySelector('#productPagination').innerHTML = '<span>共 ' + total + ' 个商品</span><span>每页 ' + pageSize + ' 个商品</span><button class="btn pagination-btn" data-page-action="prev" ' + (currentPage === 1 ? 'disabled' : '') + '>上一页</button>' + pages + '<button class="btn pagination-btn" data-page-action="next" ' + (currentPage === totalPages ? 'disabled' : '') + '>下一页</button><span>第 ' + currentPage + ' / ' + totalPages + ' 页</span>';
      host.querySelectorAll('[data-page]').forEach(function (button) { button.onclick = function () { currentPage = Number(button.dataset.page); renderTable(); }; });
      host.querySelector('[data-page-action="prev"]').onclick = function () { if (currentPage > 1) { currentPage--; renderTable(); } };
      host.querySelector('[data-page-action="next"]').onclick = function () { if (currentPage < totalPages) { currentPage++; renderTable(); } };
    }

    function renderTable() {
      var results = filteredProducts();
      var totalPages = Math.max(1, Math.ceil(results.length / pageSize));
      if (currentPage > totalPages) currentPage = totalPages;
      currentPageGroups = results.slice((currentPage - 1) * pageSize, currentPage * pageSize);
      host.querySelector('#productRows').innerHTML = currentPageGroups.length ? currentPageGroups.map(rowHtml).join('') : '<tr><td colspan="7"><div class="product-empty">当前履约方式下暂无符合条件的商品</div></td></tr>';
      bindRows();
      renderPagination(results.length, totalPages);
      updateSelectionState();
    }

    host.querySelector('#selectAllProducts').onchange = function () {
      var checked = this.checked;
      currentPageGroups.forEach(function (group) { group.skus.filter(phaseEligible).forEach(function (sku) { setDraftSelected(sku.id, checked); }); });
      renderTable();
    };
    host.querySelector('#queryProducts').onclick = function () { currentPage = 1; renderTable(); };
    host.querySelector('#resetProducts').onclick = function () {
      host.querySelector('#productKeyword').value = '';
      host.querySelector('#categoryFilter').value = '';
      host.querySelector('#supplierFilter').value = '';
      currentPage = 1;
      renderTable();
    };
    host.querySelector('#confirmProducts').onclick = function () {
      var redeemLimit = 2;
      var ids = eligibleProducts().filter(function (product) { return draftSelectedIds.indexOf(product.id) > -1; }).map(function (product) { return product.id; });
      if (mode === 'choice' && ids.length < redeemLimit) { window.showToast('候选商品数不能少于每券可兑换件数2'); return; }
      if (mode === 'choice') {
        var capacity = ids.reduce(function (sum, id) { return sum + Number(draftRules[id] || 1); }, 0);
        if (capacity < redeemLimit) { window.showToast('单商品上限合计不能少于每券可兑换件数2'); return; }
      }
      window.PrototypeState.selectedProductIds = ids;
      var nextRules = {};
      ids.forEach(function (id) { nextRules[id] = Math.max(1, Number(draftRules[id] || 1)); });
      window.PrototypeState.couponProductRules = nextRules;
      host.remove();
      renderSelected();
      window.showToast('已更新兑换商品 SKU/规格配置');
    };
    renderTable();
  }

  function renderSelected() {
    var box = document.getElementById('selectedProducts');
    if (box) box.innerHTML = selectedRows();
    var pool = document.getElementById('poolSize');
    if (pool) pool.value = selectedProducts().length;
    bindSelected();
  }

  function bindSelected() {
    document.querySelectorAll('.remove-product').forEach(function (button) {
      button.onclick = function () {
        window.PrototypeState.selectedProductIds = window.PrototypeState.selectedProductIds.filter(function (id) { return id !== button.dataset.id; });
        delete window.PrototypeState.couponProductRules[button.dataset.id];
        renderSelected();
      };
    });
    document.querySelectorAll('[data-max-product]').forEach(function (input) {
      input.onchange = function () { window.PrototypeState.couponProductRules[input.dataset.maxProduct] = Math.max(1, Number(input.value) || 1); input.value = window.PrototypeState.couponProductRules[input.dataset.maxProduct]; };
    });
    document.querySelectorAll('[data-admin-plus]').forEach(function (button) {
      button.onclick = function () { var id = button.dataset.adminPlus; window.PrototypeState.couponProductRules[id] = productMax(id) + 1; renderSelected(); };
    });
    document.querySelectorAll('[data-admin-minus]').forEach(function (button) {
      button.onclick = function () { var id = button.dataset.adminMinus; window.PrototypeState.couponProductRules[id] = Math.max(1, productMax(id) - 1); renderSelected(); };
    });
  }

  function ruleFields() {
    if (window.PrototypeState.ruleMode === 'choice') {
      return '<div class="field"><label class="required">候选 SKU/规格数 N</label><input class="input" id="poolSize" value="' + selectedProducts().length + '" disabled><div class="helper">由已选 SKU/规格自动统计</div></div>' +
        '<div class="field"><label class="required">每张券可兑件数 M</label><div class="inline"><input class="input" id="redeemLimit" value="2"><span>件</span></div><div class="helper">当前规则展示为 ' + selectedProducts().length + '选2</div></div>' +
        '<div class="field"><label class="required">同一SKU可重复选择</label><div class="radio-row"><label><input type="radio" checked> 允许</label><label><input type="radio"> 不允许</label></div><div class="helper">具体上限在下方每个候选 SKU/规格上单独配置</div></div>';
    }
    return '<div class="field"><label>总兑换件数</label><input class="input" id="totalQty" value="' + selectedTotal() + '" disabled><div class="helper">由各SKU固定数量自动汇总</div></div>';
  }

  window.Pages['admin-create'] = {
    render: function () {
      var fulfillmentOptions = window.ExchangeCouponMock.phaseOneFulfillmentTypes.map(function (type) {
        return '<option value="' + type.value + '" ' + (type.value === window.PrototypeState.couponFulfillmentType ? 'selected' : '') + '>' + type.label + '</option>';
      }).join('');
      return window.prototypeShell('新增卡券', '卡券中心 / 卡券管理 / 新增卡券',
        '<div class="evidence-note warn" style="margin-bottom:16px"><b>2026-08-25确认口径：</b>商品统一来自产品中心；一期仅配置GUI皮肤；销售未上架但产品中心可兑换的皮肤仍可选择；车联网同步返回最终结果。</div>' +
        '<div class="panel"><div class="panel-body">' +
        '<div class="form-section"><div class="section-title">基本信息</div><div class="form-grid">' +
        '<div class="field"><label class="required">品牌</label><select class="select"><option>日产</option></select></div>' +
        '<div class="field"><label class="required">业务场景</label><select class="select"><option>车联网兑换场景（目标态）</option></select></div>' +
        '<div class="field"><label class="required">卡券分类</label><select class="select"><option>兑换券</option></select></div>' +
        '<div class="field"><label class="required">卡券名称</label><input class="input" value="GUI皮肤5选2兑换券"></div>' +
        '<div class="field full"><label>卡券描述</label><textarea class="textarea">从产品中心5款GUI皮肤中任选2件；车联网同步返回履约成功后创建兑换单并核销卡券。</textarea></div>' +
        '<div class="field"><label class="required">发放数量</label><div class="inline"><input class="input" value="10000"><span>张</span></div></div>' +
        '<div class="field"><label>适用车系/车型</label><button class="btn">选择车系/车型</button><div class="helper">建券和发券时由运营控制，兑换时不二次过滤</div></div>' +
        '<div class="field full"><label class="required">使用须知</label><textarea class="textarea">1. 一期仅支持GUI皮肤；2. 销售未上架不影响可兑换皮肤；3. 车联网同步返回成功后卡券核销；4. 同步失败卡券保持可使用。</textarea></div>' +
        '</div></div>' +
        '<div class="form-section"><div class="section-title">兑换规则 <span class="tag orange">兑换券专属</span></div><div class="form-grid">' +
        '<div class="field"><label class="required">整券履约方式</label><select class="select" id="couponFulfillmentType">' + fulfillmentOptions + '</select><div class="helper">一期仅有车联网履约一个枚举值，仍保留下拉控件</div></div>' +
        '<div class="field"><label class="required">兑换方式</label><div class="radio-row"><label><input type="radio" name="ruleMode" value="fixed" ' + (window.PrototypeState.ruleMode === 'fixed' ? 'checked' : '') + '> 固定商品组合</label><label><input type="radio" name="ruleMode" value="choice" ' + (window.PrototypeState.ruleMode === 'choice' ? 'checked' : '') + '> N选M</label></div></div>' +
        ruleFields() +
        '<div class="field full"><label class="required">产品中心 GUI 皮肤 SKU/规格</label><div style="margin-bottom:10px"><button class="btn btn-primary" id="chooseProducts">选择商品及规格</button><button class="btn" id="uploadProducts">上传文件</button><button class="btn" id="downloadProductTemplate">下载模板</button></div><div class="selected-box" id="selectedProducts">' + selectedRows() + '</div><div class="helper">商品源为产品中心；只允许GUI皮肤。下钻到SKU/规格后配置数量，未上架但可兑换的GUI皮肤正常回显。</div></div>' +
        '</div></div>' +
        '<div class="form-section"><div class="section-title">履约与核销规则</div><div class="form-grid"><div class="field"><label>车联网返回方式</label><input class="input" value="同步实时返回最终成功/失败" disabled><div class="helper">不使用已受理、异步回调或履约中状态</div></div><div class="field"><label>核销时点</label><input class="input" value="同步履约成功后创建兑换单并核销" disabled></div></div></div>' +
        '</div></div><div class="sticky-actions"><button class="btn" id="resetForm">重置</button><button class="btn btn-primary" id="submitForm">提交</button></div>');
    },
    init: function () {
      document.getElementById('chooseProducts').onclick = productModal;
      document.getElementById('uploadProducts').onclick = uploadProductsModal;
      document.getElementById('downloadProductTemplate').onclick = downloadTemplateModal;
      document.getElementById('couponFulfillmentType').onchange = function () { switchFulfillment(this.value, this); };
      document.querySelectorAll('[name="ruleMode"]').forEach(function (radio) {
        radio.onchange = function () { window.PrototypeState.ruleMode = radio.value; window.navigateTo('admin-create'); };
      });
      document.getElementById('submitForm').onclick = function () {
        if (!window.PrototypeState.selectedProductIds.length) { window.showToast('请先选择适用商品 SKU/规格'); return; }
        var incompatible = selectedProducts().some(function (product) { return !phaseEligible(product); });
        if (incompatible) { window.showToast('存在非GUI皮肤或产品中心不可兑换商品'); return; }
        window.showToast('原型演示：产品中心GUI皮肤、单一履约与SKU级规则校验通过');
      };
      document.getElementById('resetForm').onclick = function () {
        window.PrototypeState.ruleMode = 'choice';
        window.PrototypeState.couponFulfillmentType = 'telematics';
        window.PrototypeState.selectedProductIds = ['SKU-GUI-10001','SKU-GUI-10002','SKU-GUI-10003','SKU-GUI-10004','SKU-GUI-10005'];
        window.PrototypeState.couponProductRules = {'SKU-GUI-10001':2,'SKU-GUI-10002':1,'SKU-GUI-10003':1,'SKU-GUI-10004':1,'SKU-GUI-10005':1};
        window.navigateTo('admin-create');
        window.showToast('已恢复车联网5选2演示规则');
      };
      bindSelected();
    }
  };
})();
