"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const defaultSummary = {
  addOnCharges: null,
  planCharges: null,
  totalDiscounts: null,
  nextMonth: null,
  dueNow: null
};
const processSummary = _ref => {
  let {
    priceOrderData = {}
  } = _ref;
  const dataProcessor = window[window.sessionStorage?.tabId].dp;
  if (!dataProcessor || Object.keys(priceOrderData) === 0) {
    return defaultSummary;
  }
  return dataProcessor.load(priceOrderData).extractData({
    extract: [{
      property: 'linePriceDetails',
      name: 'addOnCharges',
      transformations: [p => p.reduce((acc, _ref2) => {
        let {
          nextBillAddOnPricingInfo = []
        } = _ref2;
        let addonsDue = 0;
        nextBillAddOnPricingInfo.forEach(_ref3 => {
          let {
            dueAmount
          } = _ref3;
          addonsDue += dueAmount;
        });
        return acc + addonsDue;
      }, 0)]
    }, {
      property: 'linePriceDetails',
      name: 'planCharges',
      transformations: [p => p.reduce((acc, _ref4) => {
        let {
          nextBillPlanPricingInfo = {}
        } = _ref4;
        if (nextBillPlanPricingInfo.dueAmount) {
          return acc + nextBillPlanPricingInfo.dueAmount;
        }
        return acc;
      }, 0)]
    }, {
      property: 'priceSummary.totalDiscount',
      name: 'totalDiscounts'
    }, {
      property: 'priceSummary.dueAmountNextMonth',
      name: 'nextMonth'
    }, {
      property: 'priceSummary.dueAmount',
      name: 'dueNow'
    }]
  });
};
var _default = processSummary;
exports.default = _default;
module.exports = exports.default;