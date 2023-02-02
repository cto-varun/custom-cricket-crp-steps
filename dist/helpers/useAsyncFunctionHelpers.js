"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _processTable = _interopRequireDefault(require("./processTable"));
var _processSummary = _interopRequireDefault(require("./processSummary"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const getData = (obj, current, expired, field) => {
  const ret = {};
  const curr = current === 'currentDeals' ? obj[current] : obj[current];
  const exp = expired === 'expiredDeals' ? obj[expired] : obj[expired];
  ret.current = curr.map(currentPlan => ({
    value: currentPlan[field],
    label: currentPlan[field],
    meta: currentPlan
  }));
  ret.expired = exp.map(currentPlan => ({
    value: currentPlan[field],
    label: currentPlan[field],
    meta: currentPlan
  }));
  return ret;
};
const getDealData = obj => {
  const ret = {};
  ret.current = obj.dealSummary.map(deal => ({
    value: deal.dealCode,
    label: deal.dealCode,
    meta: deal
  }));
  ret.metaData = obj;
  return ret;
};
const processTab = (processor, _ref) => {
  let [processorState] = _ref;
  if (processorState.processedData.tab) {
    return processorState.processedData.tab;
  }
  const tabResult = processor.load(processorState.loadedData.apiData || {}).extractData({
    extract: [{
      property: 'plans',
      name: 'plans',
      transformations: [p => getData(p, 'currentPlans', 'expiredPlans', 'socCode')]
    }, {
      property: 'addOns',
      name: 'addOns',
      transformations: [p => getData(p, 'currentAddOns', 'expiredAddOns', 'socCode')]
    }, {
      property: 'deals',
      name: 'deals',
      transformations: [p => getDealData(p)]
    }, {
      property: 'compatibility',
      name: 'compatibility'
    }],
    returnShape: {
      panelTitles: ['Plans', 'Add-Ons', 'Deals']
    }
  });
  if (tabResult == null || !Object.keys(tabResult).length) {
    return null;
  }
  return tabResult;
};
const processData = (processor, type, otherParameters) => {
  const {
    processorHook = []
  } = otherParameters;
  if (type === 'tab') {
    return processTab(processor, processorHook);
  }
  if (type === 'summary') {
    return (0, _processSummary.default)(processor, processorHook);
  }
  if (type === 'table') {
    const {
      tab,
      apiData,
      dataHook,
      compatibilityHook,
      data
    } = otherParameters;
    return (0, _processTable.default)(processor, [apiData, tab], dataHook, compatibilityHook, data);
  }
  return null;
};
var _default = processData;
exports.default = _default;
module.exports = exports.default;