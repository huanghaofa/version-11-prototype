(function () {
  'use strict';

  function parseXml(text, label) {
    var xml = new window.DOMParser().parseFromString(text, 'application/xml');
    if (xml.getElementsByTagName('parsererror').length) throw new Error(label + '内容无法解析');
    return xml;
  }

  function nodesByLocalName(root, name) {
    return Array.prototype.filter.call(root.getElementsByTagName('*'), function (node) {
      return node.localName === name;
    });
  }

  function nodeText(root, name) {
    var nodes = nodesByLocalName(root, name);
    return nodes.map(function (node) { return node.textContent || ''; }).join('');
  }

  function normalizeZipPath(base, target) {
    if (target.charAt(0) === '/') return target.replace(/^\//, '');
    var parts = (base + '/' + target).split('/');
    var normalized = [];
    parts.forEach(function (part) {
      if (!part || part === '.') return;
      if (part === '..') normalized.pop();
      else normalized.push(part);
    });
    return normalized.join('/');
  }

  function columnIndex(reference) {
    var letters = String(reference || '').replace(/[^A-Za-z].*$/, '').toUpperCase();
    var value = 0;
    for (var i = 0; i < letters.length; i += 1) value = value * 26 + letters.charCodeAt(i) - 64;
    return Math.max(0, value - 1);
  }

  function sharedStringValues(xml) {
    if (!xml) return [];
    return nodesByLocalName(xml, 'si').map(function (item) { return nodeText(item, 't'); });
  }

  function cellValue(cell, sharedStrings) {
    var type = cell.getAttribute('t') || '';
    if (type === 'inlineStr') return nodeText(cell, 't');
    var rawNodes = nodesByLocalName(cell, 'v');
    var raw = rawNodes.length ? rawNodes[0].textContent || '' : '';
    if (type === 's') return sharedStrings[Number(raw)] || '';
    if (type === 'b') return raw === '1' ? 'TRUE' : 'FALSE';
    return raw;
  }

  function sheetRows(sheetXml, sharedStrings) {
    return nodesByLocalName(sheetXml, 'row').map(function (rowNode, rowIndex) {
      var cells = [];
      nodesByLocalName(rowNode, 'c').forEach(function (cell) {
        cells[columnIndex(cell.getAttribute('r'))] = cellValue(cell, sharedStrings);
      });
      return {
        rowNumber: Number(rowNode.getAttribute('r')) || rowIndex + 1,
        cells: cells.map(function (value) { return value == null ? '' : String(value).trim(); })
      };
    });
  }

  async function workbookRows(arrayBuffer) {
    if (!window.JSZip) throw new Error('Excel 解析组件未加载，请刷新页面后重试');
    var zip;
    try {
      zip = await window.JSZip.loadAsync(arrayBuffer);
    } catch (error) {
      throw new Error('文件不是可识别的 .xlsx 工作簿');
    }

    var workbookFile = zip.file('xl/workbook.xml');
    var relsFile = zip.file('xl/_rels/workbook.xml.rels');
    if (!workbookFile || !relsFile) throw new Error('工作簿结构不完整，请使用页面提供的模板');

    var workbookXml = parseXml(await workbookFile.async('string'), '工作簿');
    var relsXml = parseXml(await relsFile.async('string'), '工作簿关系');
    var sheets = nodesByLocalName(workbookXml, 'sheet');
    if (!sheets.length) throw new Error('工作簿中没有可读取的工作表');

    var relationshipId = sheets[0].getAttribute('r:id') || sheets[0].getAttributeNS('http://schemas.openxmlformats.org/officeDocument/2006/relationships', 'id');
    var relationship = nodesByLocalName(relsXml, 'Relationship').find(function (item) {
      return item.getAttribute('Id') === relationshipId;
    });
    if (!relationship) throw new Error('无法定位第一张工作表');

    var sheetPath = normalizeZipPath('xl', relationship.getAttribute('Target') || '');
    var sheetFile = zip.file(sheetPath);
    if (!sheetFile) throw new Error('第一张工作表内容缺失');

    var sharedXml = null;
    var sharedFile = zip.file('xl/sharedStrings.xml');
    if (sharedFile) sharedXml = parseXml(await sharedFile.async('string'), '共享文本');
    var sheetXml = parseXml(await sheetFile.async('string'), '第一张工作表');
    return sheetRows(sheetXml, sharedStringValues(sharedXml));
  }

  function normalizeHeader(value) {
    return String(value || '').replace(/[\s（）()_-]/g, '').toLowerCase();
  }

  function findCodeColumn(rows) {
    var aliases = ['门店编码', '门店code', 'storecode'];
    for (var rowIndex = 0; rowIndex < Math.min(rows.length, 20); rowIndex += 1) {
      for (var colIndex = 0; colIndex < rows[rowIndex].cells.length; colIndex += 1) {
        if (aliases.indexOf(normalizeHeader(rows[rowIndex].cells[colIndex])) > -1) {
          return { rowIndex: rowIndex, colIndex: colIndex };
        }
      }
    }
    throw new Error('第一张工作表缺少“门店编码”列，请使用页面提供的模板');
  }

  function validateRows(rows, stores) {
    var header = findCodeColumn(rows);
    var storeByCode = {};
    stores.forEach(function (store) { storeByCode[String(store.code).trim().toUpperCase()] = store; });
    var seen = {};
    var results = [];

    rows.slice(header.rowIndex + 1).forEach(function (row) {
      var hasContent = row.cells.some(function (value) { return String(value || '').trim(); });
      if (!hasContent) return;
      var code = String(row.cells[header.colIndex] || '').trim().toUpperCase();
      var result = { rowNumber: row.rowNumber, code: code || '—', valid: false, storeId: '', storeName: '', reason: '' };
      if (!code) result.reason = '门店编码为空';
      else if (seen[code]) result.reason = '门店编码重复，已按首次出现去重';
      else {
        seen[code] = true;
        var store = storeByCode[code];
        if (!store) result.reason = '门店编码不存在';
        else if (!store.available) result.reason = '门店当前不可用';
        else {
          result.valid = true;
          result.storeId = store.id;
          result.storeName = store.name;
          result.reason = '校验通过';
        }
      }
      results.push(result);
    });

    if (!results.length) throw new Error('未读取到门店数据，请在“门店编码”列下填写门店编码');
    var validRows = results.filter(function (row) { return row.valid; });
    return {
      totalRows: results.length,
      validCount: validRows.length,
      errorCount: results.length - validRows.length,
      validStoreIds: validRows.map(function (row) { return row.storeId; }),
      rows: results
    };
  }

  async function parse(file, stores) {
    if (!file || !/\.xlsx$/i.test(file.name || '')) throw new Error('请选择 .xlsx 格式的 Excel 文件');
    var rows = await workbookRows(await file.arrayBuffer());
    var result = validateRows(rows, stores || []);
    result.fileName = file.name;
    return result;
  }

  window.ExcelStoreImporter = { parse: parse };
})();
