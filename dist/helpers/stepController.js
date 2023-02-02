"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendcrpPaymentFormValueCollector = exports.sendSubmitOrderRequest = exports.sendCreateOrderRequest = exports.reset = exports.prev = exports.next = exports.default = void 0;
var _lodash = _interopRequireDefault(require("lodash.clonedeep"));
var _componentCache = require("@ivoyant/component-cache");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const sendSubmitOrderRequest = function (state) {
  let requestBody = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
  if (typeof window[window.sessionStorage?.tabId].sendsubmitOrderAsyncMachine === 'function') {
    if (state.createOrderData) {
      const createOrderData = (0, _lodash.default)(state.createOrderData);
      if (requestBody) {
        window[window.sessionStorage?.tabId].sendsubmitOrderAsyncMachine('SET.REQUEST.DATA', {
          value: requestBody
        });
      }
      window[window.sessionStorage?.tabId].sendsubmitOrderAsyncMachine('APPEND.URL', {
        value: `/${createOrderData.uuid}`
      });
      setTimeout(() => window[window.sessionStorage?.tabId].sendsubmitOrderAsyncMachine('FETCH'), 500);
    }
  }
};
exports.sendSubmitOrderRequest = sendSubmitOrderRequest;
const sendCreateOrderRequest = _ref => {
  let {
    priceOrderData,
    applyCredit,
    tableData,
    priceOrderRequest: statePriceOrderRequest,
    accountDetails,
    accountBalances,
    customerInfo,
    mappingTabletLines
  } = _ref;
  if (typeof window[window.sessionStorage?.tabId].sendcreateOrderAsyncMachine === 'function') {
    if (priceOrderData) {
      const priceOrderRequest = (0, _lodash.default)(statePriceOrderRequest);
      let {
        banStatus,
        accountType,
        statusActvRsnCode = 'CMP'
      } = accountDetails;
      let {
        adrZip,
        adrCity,
        adrStateCode,
        accountSubType
      } = customerInfo;
      const {
        accountBalance = 0
      } = accountBalances;
      let accountId = window[window.sessionStorage?.tabId].NEW_BAN;
      const newAccountInfo = _componentCache.cache.get('newAccountInfo');
      if (newAccountInfo && newAccountInfo.ban === window[window.sessionStorage?.tabId].NEW_BAN) {
        accountId = newAccountInfo.ban;
        banStatus = newAccountInfo.accountStatus;
        accountType = newAccountInfo.accountType;
        accountSubType = newAccountInfo.accountSubType;
        adrZip = newAccountInfo?.billingAddress?.zip;
        adrCity = newAccountInfo?.billingAddress?.city;
        adrStateCode = newAccountInfo?.billingAddress?.state;
      }
      const accountInfo = {
        billingAccountNumber: accountId,
        accountStatus: banStatus,
        accountType,
        accountSubType,
        accountStatusReasonCode: statusActvRsnCode,
        accountAddressDetails: {
          zipCode: adrZip,
          cityName: adrCity,
          stateCode: adrStateCode
        }
      };
      if (applyCredit && accountBalance < 0) {
        accountInfo.accountBalance = accountBalance;
      }
      const {
        existingLinesInfo,
        changeOrNewLinesInfo
      } = priceOrderRequest;
      const {
        linePriceDetails
      } = priceOrderData;
      const finalexistingLinesInfo = existingLinesInfo.map(existingLine => {
        if (linePriceDetails.find(line => existingLine.ctn === line.ctn) !== undefined) {
          const matchingLinePriceDetails = linePriceDetails.find(line => existingLine.ctn === line.ctn);
          const existingLineInfo = {
            ...existingLine,
            ...(matchingLinePriceDetails.hasOwnProperty('currentPlanPricingInfo') && {
              currentPlanPricingInfo: {
                ...matchingLinePriceDetails.currentPlanPricingInfo,
                quantity: 0
              }
            }),
            ...(matchingLinePriceDetails.hasOwnProperty('currentAddOnPricingInfo') && {
              currentAddOnPricingInfo: matchingLinePriceDetails.currentAddOnPricingInfo
            }),
            ...(matchingLinePriceDetails.hasOwnProperty('nextBillPlanPricingInfo') && {
              nextBillPlanPricingInfo: {
                ...matchingLinePriceDetails.nextBillPlanPricingInfo,
                quantity: 0
              }
            }),
            ...(matchingLinePriceDetails.hasOwnProperty('nextBillAddOnPricingInfo') && {
              nextBillAddOnPricingInfo: matchingLinePriceDetails.nextBillAddOnPricingInfo
            })
          };
          delete existingLineInfo.latestCharge;
          delete existingLineInfo.rank;
          delete existingLineInfo.subscriberStatusDate;
          if (existingLineInfo?.currentPlanPricingInfo) {
            transformEffectiveDates(existingLineInfo.currentPlanPricingInfo?.adjustmentEffectiveDate);
            transformEffectiveDates(existingLineInfo.currentPlanPricingInfo?.dueAmountEffectiveDate);
          }
          if (existingLineInfo?.nextBillPlanPricingInfo) {
            transformEffectiveDates(existingLineInfo.nextBillPlanPricingInfo?.dueAmountEffectiveDate);
          }
          if (existingLineInfo?.nextBillAddOnPricingInfo) {
            existingLineInfo.nextBillAddOnPricingInfo.forEach(addOnPricingInfo => {
              transformEffectiveDates(addOnPricingInfo?.dueAmountEffectiveDate);
            });
          }
          return existingLineInfo;
        }
        delete existingLine.latestCharge;
        delete existingLine.rank;
        delete existingLine.subscriberStatusDate;
        return existingLine;
      });
      const finalchangeOrNewLinesInfo = changeOrNewLinesInfo.map(changeOrNewLine => {
        const matchingLinePriceDetails = linePriceDetails.find(line => changeOrNewLine.status === 'RESERVED' ? changeOrNewLine.lineIdentifier === line.lineIdentifier : changeOrNewLine.ctn === line.ctn);
        const matchingTableData = tableData?.finalData?.find(t => changeOrNewLine.status === 'RESERVED' ? t.telephoneData.imei === changeOrNewLine.newDeviceInfo.imei : changeOrNewLine.ctn === t?.telephoneData?.telephoneNumber);
        if (matchingLinePriceDetails !== undefined) {
          const changedLineInfo = {
            ...changeOrNewLine,
            ...(matchingLinePriceDetails.hasOwnProperty('currentPlanPricingInfo') && {
              currentPlanPricingInfo: {
                ...matchingLinePriceDetails.currentPlanPricingInfo,
                quantity: 0
              }
            }),
            ...(matchingLinePriceDetails.hasOwnProperty('currentAddOnPricingInfo') && {
              currentAddOnPricingInfo: matchingLinePriceDetails.currentAddOnPricingInfo
            }),
            ...(matchingLinePriceDetails.hasOwnProperty('nextBillPlanPricingInfo') && {
              nextBillPlanPricingInfo: {
                ...matchingLinePriceDetails.nextBillPlanPricingInfo,
                quantity: 0
              }
            }),
            ...(matchingLinePriceDetails.hasOwnProperty('nextBillAddOnPricingInfo') && {
              nextBillAddOnPricingInfo: matchingLinePriceDetails.nextBillAddOnPricingInfo
            })
          };

          // add additionalInfo from form if it exists
          if (matchingTableData) {
            changedLineInfo.additionalInfo = matchingTableData?.additionalInfo;
          }

          //  add Port information - This is new Line
          if (changeOrNewLine.status === 'RESERVED') {
            //  find matching tableInfo
            const tabInfo = tableData.finalData.find(t => t.telephoneData.imei === changeOrNewLine.newDeviceInfo.imei);
            if (tabInfo.telephoneData.portInInfo !== undefined) {
              changedLineInfo.portInInfo = tabInfo.telephoneData.portInInfo;
            } else {
              changedLineInfo.rateCenter = tabInfo.telephoneData.rateCenter;
            }
          }
          if (changedLineInfo?.currentPlanPricingInfo) {
            transformEffectiveDates(changedLineInfo.currentPlanPricingInfo?.adjustmentEffectiveDate);
            transformEffectiveDates(changedLineInfo.currentPlanPricingInfo?.dueAmountEffectiveDate);
          }
          if (changedLineInfo?.currentAddOnPricingInfo) {
            changedLineInfo.currentAddOnPricingInfo.forEach(addOnPricingInfo => {
              transformEffectiveDates(addOnPricingInfo?.adjustmentEffectiveDate);
              transformEffectiveDates(addOnPricingInfo?.dueAmountEffectiveDate);
            });
          }
          if (changedLineInfo?.nextBillPlanPricingInfo) {
            transformEffectiveDates(changedLineInfo.nextBillPlanPricingInfo?.adjustmentEffectiveDate);
            transformEffectiveDates(changedLineInfo.nextBillPlanPricingInfo?.dueAmountEffectiveDate);
          }
          if (changedLineInfo?.nextBillAddOnPricingInfo) {
            changedLineInfo.nextBillAddOnPricingInfo.forEach(addOnPricingInfo => {
              transformEffectiveDates(addOnPricingInfo?.adjustmentEffectiveDate);
              transformEffectiveDates(addOnPricingInfo?.dueAmountEffectiveDate);
            });
          }

          // handle add a line (if formValues are present on the line, it means they have filled out the form)
          if (changedLineInfo?.formValues) {
            const additionalInfo = {
              marketingOptInIndicator: changedLineInfo?.formValues?.marketingOptInIndicator,
              thirdPartyOptInIndicator: changedLineInfo?.formValues?.thirdPartyOptInIndicator
            };
            changedLineInfo.additionalInfo = additionalInfo;
          }

          // handle new accounts
          if (newAccountInfo?.additionalInfo && newAccountInfo?.imei && changedLineInfo?.newDeviceInfo?.imei?.toString() === newAccountInfo?.imei?.toString()) {
            changedLineInfo.additionalInfo = newAccountInfo?.additionalInfo;
          }
          delete changedLineInfo.latestCharge;
          delete changedLineInfo.rank;
          delete changedLineInfo.subscriberStatusDate;
          delete changedLineInfo.recurringPromo;
          return changedLineInfo;
        }
        delete changeOrNewLine.latestCharge;
        delete changeOrNewLine.rank;
        delete changeOrNewLine.subscriberStatusDate;
        delete changeOrNewLine.recurringPromo;
        return changeOrNewLine;
      });
      const createOrderRequest = {
        lineOfBusiness: 'CRM',
        accountInfo,
        existingLinesInfo: finalexistingLinesInfo,
        changeOrNewLinesInfo: finalchangeOrNewLinesInfo,
        updateTabletInfo: mappingTabletLines
      };
      window[window.sessionStorage?.tabId].sendcreateOrderAsyncMachine('RESET');
      window[window.sessionStorage?.tabId].sendcreateOrderAsyncMachine('SET.REQUEST.DATA', {
        value: createOrderRequest
      });
      setTimeout(() => window[window.sessionStorage?.tabId].sendcreateOrderAsyncMachine('REFETCH'), 500);
    }
  }
};
exports.sendCreateOrderRequest = sendCreateOrderRequest;
const transformEffectiveDates = effectiveDates => {
  if (effectiveDates) {
    if (effectiveDates.startDate) {
      effectiveDates.startDate = effectiveDates.startDate.replaceAll('-', '');
    }
    if (effectiveDates.endDate) {
      effectiveDates.endDate = effectiveDates.endDate.replaceAll('-', '');
    }
  }
};
const handleFirstStep = (state, setState, _ref2) => {
  let {
    stateFunction
  } = _ref2;
  if (state.priceOrderData !== undefined) {
    if (state.priceOrderData?.linePriceDetails === undefined && state.priceOrderData?.priceSummary === undefined) {
      setState(v => ({
        ...v,
        uiData: {
          ...v.uiData,
          lastAction: 'modal/price-order-failure'
        },
        stepControllerFeedback: {
          ...v.stepControllerFeedback,
          modal: {
            display: true,
            message: 'Could not retrieve price order information.'
          }
        }
      }));
      return;
    }
    setState(stateFunction);
  } else {
    setState(v => ({
      ...v,
      uiData: {
        ...v.uiData,
        lastAction: 'modal/price-order-bad-request'
      },
      stepControllerFeedback: {
        ...v.stepControllerFeedback,
        modal: {
          display: true,
          message: 'Please select at least one line and one update.'
        }
      }
    }));
  }
};
const handleSecondStep = (state, setState, _ref3) => {
  let {
    setSubmitButtonData
  } = _ref3;
  if (state.lastAPICall === 'error/submitOrder') {
    setSubmitButtonData(() => ({
      isLoading: true,
      label: 'Submitting Order...',
      disabled: true
    }));
    setState(s => ({
      ...s,
      lastAPICall: 'pending/submitOrder'
    }));
    setTimeout(() => {
      sendSubmitOrderRequest(state);
    }, 500);
    return;
  }
  setSubmitButtonData(() => ({
    isLoading: true,
    label: 'Creating Order...',
    disabled: true
  }));
  setState(s => ({
    ...s,
    lastAPICall: 'pending/createOrder'
  }));
  'pending/createOrderData';
  setTimeout(() => {
    sendCreateOrderRequest(state);
  }, 500);
};
const handleThirdStep = (state, setState, _ref4) => {
  let {
    activeKey,
    paymentData,
    setSubmissionButtonData
  } = _ref4;
  if (paymentData) {
    if (paymentData.creditCardPaymentDetails?.confirmationCode || paymentData.creditCardPaymentDetails?.transactionReferenceNumber || paymentData.pinCardPaymentDetails?.confirmationNumber || paymentData?.message?.includes('Successfully created adjustment')) {
      setSubmissionButtonData({
        isLoading: true,
        disabled: true,
        label: 'Submitting Order...'
      });
      setTimeout(() => {
        sendSubmitOrderRequest(state);
      }, 500);
    } else {
      setState(s => ({
        ...s,
        apiErrors: {
          code: paymentData.errorCode || paymentData.responseCode,
          message: paymentData.errorMessage || paymentData.responseDescription
        }
      }));
    }
  }
};
const processNext = (current, state, setState, options) => {
  if (current === 0) {
    handleFirstStep(state, setState, options);
  } else if (current === 1) {
    handleSecondStep(state, setState, options);
  } else if (current === 3) {
    setState(v => ({
      ...v,
      current: v.current + 1
    }));
  } else if (current === 4) {
    handleThirdStep(state, setState, options);
  }
};
const sendcrpPaymentFormValueCollector = state => input => {
  if (input !== undefined && input.hasOwnProperty('payload')) {
    const requestBody = input.payload;
    const currentState = state;
    sendSubmitOrderRequest(currentState, requestBody);
  }
};
exports.sendcrpPaymentFormValueCollector = sendcrpPaymentFormValueCollector;
const reset = setState => () => {
  setState(v => ({
    ...v,
    current: 0
  }));
};
exports.reset = reset;
const next = setState => () => {
  setState(v => ({
    ...v,
    current: v.current + 1
  }));
};
exports.next = next;
const prev = setState => () => {
  setState(v => ({
    ...v,
    current: v.current > 0 ? v.current - 1 : 0
  }));
};
exports.prev = prev;
const processBackStep3 = state => {
  window[window.sessionStorage?.tabId].sendcreateOrderAsyncMachine('RESET');
  window[window.sessionStorage?.tabId].sendcancelCRPOrder('RESET');
  const {
    createOrderData: {
      uuid
    }
  } = state;
  window[window.sessionStorage?.tabId].sendcancelCRPOrder('APPEND.URL', {
    value: `/${uuid}`
  });
  setTimeout(() => window[window.sessionStorage?.tabId].sendcancelCRPOrder('REFETCH'), 500);
};
const stepController = (direction, current, _ref5, options) => {
  let [state, setState] = _ref5;
  if (direction === 'next') {
    processNext(current, state, setState, options);
  } else if (current > 0) {
    if (current === 2) {
      processBackStep3(state);
      return;
    }
    setState(v => ({
      ...v,
      uiData: {
        ...v.uiData,
        lastAction: `back/${current}`
      },
      current: current - 1
    }));
  }
};
var _default = stepController;
exports.default = _default;