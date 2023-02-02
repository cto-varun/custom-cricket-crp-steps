"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _componentMessageBus = require("@ivoyant/component-message-bus");
var _componentCache = require("@ivoyant/component-cache");
var _antd = require("antd");
var _PlanItem = _interopRequireDefault(require("../components/PlanList/PlanItem"));
var _stepController = _interopRequireDefault(require("../helpers/stepController"));
require("./step4.css");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/* eslint-disable complexity */

const OFFER_ADJUSTMENT_SUCCESS_MESSAGE_TEXT_CPR = 'Successfully created adjustment';
const Step4 = _ref => {
  let {
    children = false,
    dataHook,
    component,
    properties,
    ...restProps
  } = _ref;
  const [submissionButtonData, setSubmissionButtonData] = (0, _react.useState)({
    label: 'Make Payment',
    isLoading: false,
    disabled: false
  });
  const {
    params
  } = component;
  const {
    groupB = false
  } = params;
  const [activeKey, setActiveKey] = (0, _react.useState)('1');
  (0, _react.useEffect)(() => {
    if (groupB) {
      setActiveKey('4');
    }
  }, []);
  const [state, setState] = dataHook;
  const {
    uiData: {
      summarizedCharges
    },
    submitOrderData,
    cancelOrderData,
    paymentData,
    lastAPICall
  } = state;
  const {
    paymentWorkflows
  } = properties;
  const isOnlyActivation = dataHook[0]?.tableData?.finalData?.every(row => row.activityType === 'ACTIVATION');
  const isOnlyAddLine = dataHook[0]?.tableData?.finalData?.every(row => row.activityType === 'ADDLINE');
  const isPaymentDataPopulated = Object.keys(paymentData || {}).length > 0 && (paymentData?.creditCardPaymentDetails?.confirmationCode || paymentData?.pinCardPaymentDetails?.confirmationNumber || paymentData?.message?.includes(OFFER_ADJUSTMENT_SUCCESS_MESSAGE_TEXT_CPR));
  const isSubmitOrderPopulated = Object.keys(submitOrderData || {}).length > 0 && Object.prototype.hasOwnProperty.call(submitOrderData, 'responseStatus') && submitOrderData.responseStatus === 200;
  const isCancelOrderPopulated = Object.keys(cancelOrderData || {}).length > 0 && Object.prototype.hasOwnProperty.call(cancelOrderData, 'responseStatus') && [200, 204].includes(cancelOrderData.responseStatus);
  (0, _react.useEffect)(() => {
    window[window.sessionStorage?.tabId].setActiveKey = key => {
      setActiveKey(key);
    };
    return () => {
      delete window[window.sessionStorage?.tabId].setActiveKey;
    };
  }, []);
  (0, _react.useEffect)(() => {
    if (isCancelOrderPopulated) {
      if (cancelOrderData.responseStatus === 204 || cancelOrderData.status === 'SUCCESS') {
        setState(v => ({
          ...v,
          createOrderData: undefined,
          cancelOrderData: undefined,
          submitOrderData: undefined,
          uiData: {
            ...v.uiData,
            lastAction: `back/1`
          },
          current: 0
        }));
      }
    }
  }, [isCancelOrderPopulated]);
  const [createConsentData, setCreateConsentData] = (0, _react.useState)(undefined);
  (0, _react.useEffect)(() => {
    window[window.sessionStorage?.tabId][`setCreateConsentData`] = setCreateConsentData;
    return () => {
      delete window[window.sessionStorage?.tabId][`setCreateConsentData`];
    };
  });
  (0, _react.useEffect)(() => {
    if (isSubmitOrderPopulated) {
      if (!submitOrderData.errorCode) {
        if (!createConsentData && !isOnlyActivation && !isOnlyAddLine) {
          window[sessionStorage.tabId]['sendcrp-create-consent-data-async-machine']('FETCH');
        } else {
          setState(s => ({
            ...s,
            current: s.current + 1
          }));
        }
      } else {
        setSubmissionButtonData(() => ({
          disabled: false,
          isLoading: false,
          label: 'Failed to Submit Order'
        }));
        setState(s => ({
          ...s,
          submitOrderData: undefined,
          lastAPICall: undefined,
          apiErrors: {
            code: submitOrderData.errorCode,
            message: submitOrderData.message
          }
        }));
      }
    } else if (lastAPICall === 'error/submitOrder') {
      setState(s => ({
        ...s,
        lastAPICall: undefined
      }));
      setSubmissionButtonData({
        isLoading: false,
        disabled: false,
        label: 'Failed to Submit Order'
      });
    }
  }, [isSubmitOrderPopulated, lastAPICall, createConsentData]);
  (0, _react.useEffect)(() => {
    if (!paymentData) {
      setSubmissionButtonData(s => ({
        ...s,
        label: activeKey !== '4' ? 'Make Payment' : 'Send Text'
      }));
    } else if (paymentData) {
      if (paymentData?.creditCardPaymentDetails?.confirmationCode || paymentData?.pinCardPaymentDetails?.confirmationNumber || paymentData?.message?.includes(OFFER_ADJUSTMENT_SUCCESS_MESSAGE_TEXT_CPR)) {
        setSubmissionButtonData(() => ({
          disabled: false,
          isLoading: false,
          label: 'Submit Order'
        }));
      } else {
        setSubmissionButtonData(() => ({
          disabled: true,
          isLoading: false,
          label: 'Failed to Make Payment'
        }));
      }
    }
  }, [activeKey, isPaymentDataPopulated]);
  const data = {
    dueAmount: dataHook[0].priceOrderData.priceSummary.dueAmount,
    billingAccountNumber: dataHook[0].priceOrderRequest.accountInfo.billingAccountNumber,
    lines: dataHook[0].createOrderData?.lines?.map(l => l.customerTelephoneNumber)
  };
  _componentCache.cache.put('crpPayment', data);
  const PaymentForms = _react.default.useMemo(() => _react.default.Children.map(children, child => {
    if (child.key === 'crp-billing-history') {
      return false;
    }
    return /*#__PURE__*/_react.default.cloneElement(child, {
      parentProps: restProps
    });
  }).filter(c => c !== false), []);

  // handle payment states
  const handlePaymentStates = (successStates, errorStates) => (subscriptionId, topic, eventData, closure) => {
    const isSuccess = successStates.includes(eventData.value);
    const isError = errorStates.includes(eventData.value);
    const successText = eventData?.event?.data?.data?.successData;
    const successPayload = successText ? JSON.parse(successText) : {};
    // On success pushing the current to step 4
    if (isSuccess || isError) {
      if (isSuccess && successText) {
        setState(s => ({
          ...s,
          paymentData: successPayload,
          lastAPICall: `pending/paymentData`
        }));
      }
    }
  };

  // Listening to message bus state changes
  (0, _react.useEffect)(() => {
    if (paymentWorkflows) {
      paymentWorkflows.forEach(_ref2 => {
        let {
          workflow,
          successStates,
          errorStates
        } = _ref2;
        _componentMessageBus.MessageBus.subscribe(`${workflow}.crp`, 'WF.'.concat(workflow).concat('.STATE.CHANGE'), handlePaymentStates(successStates, errorStates), {});
      });
    }
    return () => {
      paymentWorkflows?.forEach(_ref3 => {
        let {
          workflow
        } = _ref3;
        _componentMessageBus.MessageBus.unsubscribe(`${workflow}.crp`);
      });
      _componentCache.cache.remove('crpPayment'); // remove it on unmount
    };
  }, []);
  const onNextClick = () => {
    (0, _stepController.default)('next', 4, dataHook, {
      activeKey,
      paymentData,
      setSubmissionButtonData
    });
  };
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "step-3-wrapper--parent"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "step-3-wrapper--payment-form-summary"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "step-3-wrapper__payment-form"
  }, PaymentForms), /*#__PURE__*/_react.default.createElement("div", {
    className: "step-3-wrapper__summary-table"
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: "step-3__summary-table-title"
  }, "Summary"), /*#__PURE__*/_react.default.createElement(_PlanItem.default, {
    charges: summarizedCharges?.proposed
  }))), /*#__PURE__*/_react.default.createElement("div", {
    className: "step-3-wrapper__buttons"
  }, /*#__PURE__*/_react.default.createElement("div", null), (paymentData?.creditCardPaymentDetails?.confirmationCode || paymentData?.pinCardPaymentDetails?.confirmationNumber || paymentData?.message?.includes(OFFER_ADJUSTMENT_SUCCESS_MESSAGE_TEXT_CPR)) && /*#__PURE__*/_react.default.createElement(_antd.Button, {
    className: "step-3-wrapper__submission-button",
    loading: submissionButtonData.isLoading,
    onClick: onNextClick,
    type: "primary",
    disabled: submissionButtonData.disabled
  }, submissionButtonData.label)));
};
var _default = Step4;
exports.default = _default;
module.exports = exports.default;