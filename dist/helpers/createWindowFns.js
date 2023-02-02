"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stateDebugger = exports.default = void 0;
var _stepController = require("./stepController");
const stateDebugger = (id, state, setState) => () => {
  window[window.sessionStorage?.tabId][`${id}--debug`] = function () {
    let getProperty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    let showDebug = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    let shouldClear = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    if (shouldClear) {
      global.console.clear();
    }
    setState(v => ({
      ...v,
      showDebug,
      getProperty
    }));
  };
  return () => {
    delete window[window.sessionStorage?.tabId][`${id}--debug`];
  };
};
exports.stateDebugger = stateDebugger;
const updateOrderData = (name, setState) => _ref => {
  let {
    payload
  } = _ref;
  setState(s => ({
    ...s,
    [name]: payload,
    lastAPICall: `pending/${name}`
  }));
};
const updateErrors = setState => (name, _ref2) => {
  let {
    value
  } = _ref2;
  if (typeof name === 'string') {
    setState(s => ({
      ...s,
      apiErrors: value,
      lastAPICall: `error/${name}`
    }));
  }
  if (typeof name === 'object') {
    setState(s => ({
      ...s,
      displayCRPErrors: name.displayCRPErrors,
      apiErrors: value,
      lastAPICall: `error/${name.name}`
    }));
  }
};
const createWindowFns = (id, state, setState) => () => {
  window[window.sessionStorage?.tabId][`${id}--next`] = (0, _stepController.next)(setState);
  window[window.sessionStorage?.tabId][`${id}--prev`] = (0, _stepController.prev)(setState);
  window[window.sessionStorage?.tabId][`${id}--reset`] = (0, _stepController.reset)(setState);
  window[window.sessionStorage?.tabId][`${id}--updatePriceOrderDataState`] = updateOrderData('priceOrderData', setState);
  window[window.sessionStorage?.tabId][`${id}--updateCreateOrderState`] = updateOrderData('createOrderData', setState);
  window[window.sessionStorage?.tabId][`${id}--updateGetPlansAndAddOnsState`] = updateOrderData('getplansandaddonsResponse', setState);
  window[window.sessionStorage?.tabId][`${id}--updateSubmitOrderState`] = updateOrderData('submitOrderData', setState);
  window[window.sessionStorage?.tabId][`${id}--updateGetConsentState`] = updateOrderData('getConsentData', setState);
  window[window.sessionStorage?.tabId][`${id}--updateCreateConsentState`] = updateOrderData('createConsentData', setState);
  window[window.sessionStorage?.tabId][`${id}--updatePaymentState`] = updateOrderData('paymentData', setState);
  window[window.sessionStorage?.tabId][`${id}--updateCancelOrderState`] = updateOrderData('cancelOrderData', setState);
  window[window.sessionStorage?.tabId][`${id}--updateErrors`] = updateErrors(setState);
  window[window.sessionStorage?.tabId].sendcrpPaymentFormValueCollector = (0, _stepController.sendcrpPaymentFormValueCollector)(state);
  return () => {
    delete window[window.sessionStorage?.tabId][`${id}--next`];
    delete window[window.sessionStorage?.tabId][`${id}--prev`];
    delete window[window.sessionStorage?.tabId][`${id}--reset`];
    delete window[window.sessionStorage?.tabId][`${id}--updatePriceOrderDataState`];
    delete window[window.sessionStorage?.tabId][`${id}--updateCreateOrderState`];
    delete window[window.sessionStorage?.tabId][`${id}--updateGetPlansAndAddOnsState`];
    delete window[window.sessionStorage?.tabId][`${id}--updateSubmitOrderState`];
    delete window[window.sessionStorage?.tabId][`${id}--updateCreateConsentState`];
    delete window[window.sessionStorage?.tabId][`${id}--updateGetConsentState`];
    delete window[window.sessionStorage?.tabId][`${id}--updateErrors`];
    delete window[window.sessionStorage?.tabId][`${id}--updatePaymentState`];
    delete window[window.sessionStorage?.tabId][`${id}--updateCancelOrderState`];
    delete window[window.sessionStorage?.tabId].sendcrpPaymentFormValueCollector;
  };
};
var _default = createWindowFns;
exports.default = _default;