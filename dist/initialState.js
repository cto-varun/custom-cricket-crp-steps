"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  current: 0,
  uiData: {
    selected: {
      tableRows: [],
      plans: [],
      addOns: [],
      deals: [],
      technicalSocCode: '',
      technicalSocCtn: ''
    },
    otcCount: [],
    effective: '',
    effectiveDateString: '',
    lastAction: '',
    activityConfirmation: false,
    disclaimerRead: false,
    hasDueAmount: false,
    applyPreviousPayment: {
      shouldApply: false,
      paymentAmount: 0
    },
    disabledNextBillCycleTablet: false
  },
  savedData: {
    step1: {
      table: null
    }
  },
  tableData: {
    shouldUpdatePlans: false,
    shouldUpdateAddOns: false,
    shouldUpdateDeals: false,
    finalData: [],
    initialTableData: [],
    compatibilityInfo: []
  },
  addLineData: {},
  loadedData: undefined,
  stepControllerFeedback: {
    modal: {
      display: false,
      message: '',
      footer: null,
      onOk: null,
      onCancel: null,
      maskClosable: true,
      lazyLoad: null,
      lazyProps: {},
      title: ''
    },
    addOnModal: {
      display: false,
      selected: {}
    }
  },
  detailInfo: {
    displayComponent: false,
    reactComponent: undefined
  },
  creditAmount: undefined,
  priceOrderRequest: {},
  priceOrderData: undefined,
  createOrderRequest: {},
  getplansandaddonsResponse: undefined,
  getmappedtabletplanResponse: {},
  createOrderData: undefined,
  showDebug: false,
  getProperty: undefined,
  apiErrors: undefined,
  setFinalTableData: () => {}
};
exports.default = _default;
module.exports = exports.default;