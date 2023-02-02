"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Step2;
var _react = _interopRequireWildcard(require("react"));
var _moment = _interopRequireDefault(require("moment"));
var _ChargesCard = _interopRequireDefault(require("../components/ChargesCard"));
var _PlanList = _interopRequireDefault(require("../components/PlanList"));
var _stepController = require("../helpers/stepController");
require("./step2.css");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function mapSourcesToStepComponents() {
  const datasources = [];
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }
  if (args.length === 0) {
    return null;
  }
  const argumentDatasources = args.slice(0, args.length - 1);
  const extractConfig = args[args.length - 1] || {};
  argumentDatasources.forEach(arg => {
    if (typeof datasources === 'object') {
      datasources.push(arg);
    }
  });
  const source = datasources.reduce((acc, datasource) => {
    return {
      ...acc,
      ...datasource
    };
  }, {});
  const extractConfigKeys = Object.keys(extractConfig);
  return extractConfigKeys.reduce((acc, k) => {
    return {
      ...acc,
      [k]: {
        ...window[window.sessionStorage?.tabId].dp.load(source).extractData({
          extract: extractConfig[k]
        })
      }
    };
  }, {});
}
const fp = price => {
  const parsedPrice = Number.parseFloat(price);
  return `${parsedPrice}`.includes('.') ? parsedPrice.toFixed(2) : parsedPrice;
};
const chargesTransform = [v => {
  if (v != null) {
    const amount = fp(v);
    if (v === 0) return amount;
    return {
      amount,
      color: v > 0 ? 'green' : 'red'
    };
  }
  return null;
}];
const mappingConfig = {
  charges: [{
    property: 'dueNow',
    transformations: chargesTransform
  }, {
    property: 'priceSummary.dueAmount',
    name: 'currentBill',
    transformations: chargesTransform
  }, {
    property: 'priceSummary.dueAmountNextMonth',
    name: 'nextBill',
    transformations: chargesTransform
  }, {
    property: 'priceSummary.totalDiscountNextMonth',
    name: 'discount',
    transformations: chargesTransform
  }],
  planDetails: [{
    properties: [{
      property: 'priceSummary'
    }, {
      property: 'linePriceDetails'
    }],
    name: 'summarizedCharges',
    transformations: [(priceSummary, linePriceDetails) => {
      const summaries = {
        linePrice: [],
        current: {
          plan: [],
          addOn: []
        },
        proposed: {
          plan: [],
          addOn: []
        },
        nextMonth: {
          plan: [],
          addOn: []
        },
        fees: [],
        govt: []
      };
      summaries.linePrice.push(priceSummary);
      linePriceDetails.forEach(lpd => {
        const {
          fees = [],
          govt = []
        } = (lpd?.taxComponents?.serviceTaxInfo || []).reduce((acc, _ref) => {
          let {
            serviceTaxList = []
          } = _ref;
          serviceTaxList.forEach(taxItem => {
            if (taxItem.taxCategory.toLowerCase().includes('fee')) {
              acc.fees.push(taxItem);
            } else {
              acc.govt.push(taxItem);
            }
          });
          return acc;
        }, {
          fees: [],
          govt: []
        });
        const hotlineSuspended = lpd?.telephoneData?.statusActvCode === 'SUS' && lpd?.telephoneData?.statusActvRsnCode === 'CO';
        summaries.fees.push(fees);
        summaries.govt.push(govt);
        summaries.current.plan.push(lpd?.currentCharges?.currentRatePlan || {});
        summaries.current.addOn.push(lpd?.currentCharges?.currentAddOns || []);
        summaries.proposed.plan.push(hotlineSuspended ? {} : lpd.currentPlanPricingInfo || {});
        summaries.proposed.addOn.push(hotlineSuspended ? [] : lpd.currentAddOnPricingInfo || []);
        summaries.nextMonth.plan.push(lpd.nextBillPlanPricingInfo || []);
        summaries.nextMonth.addOn.push(lpd.nextBillAddOnPricingInfo || []);
      });
      return summaries;
    }, linePriceSummaries => {
      const res = {
        current: {
          total: 0,
          totalPlanCharges: 0,
          totalFeatureCharges: 0,
          totalFeeCharges: 0,
          totalGovtCharges: 0
        },
        proposed: {
          total: 0,
          totalPlanCharges: 0,
          totalFeatureCharges: 0,
          totalFeeCharges: 0,
          totalGovtCharges: 0
        },
        nextMonth: {
          total: 0,
          totalPlanCharges: 0,
          totalFeatureCharges: 0,
          totalFeeCharges: 0,
          totalGovtCharges: 0
        }
      };
      const {
        linePrice,
        current,
        nextMonth,
        proposed,
        fees,
        govt
      } = linePriceSummaries;
      current.plan.forEach(cp => {
        res.current.totalPlanCharges += cp.actualPrice || 0;
      });
      current.addOn.forEach(ca => {
        ca.forEach(addon => {
          res.current.totalFeatureCharges += addon.price || 0;
        });
      });
      fees.forEach(feeArray => {
        feeArray.forEach(fee => {
          res.current.totalFeeCharges += fee.taxAmount;
          res.proposed.totalFeeCharges += fee.taxAmount;
          res.nextMonth.totalFeeCharges += fee.taxAmount;
        });
      });
      govt.forEach(govtArray => {
        govtArray.forEach(gov => {
          res.current.totalGovtCharges += gov.taxAmount;
          res.proposed.totalGovtCharges += gov.taxAmount;
          res.nextMonth.totalGovtCharges += gov.taxAmount;
        });
      });
      proposed.plan.forEach(cp => {
        res.proposed.totalPlanCharges += (cp.dueAmount || 0) - (cp?.adjustmentAmount || 0);
      });
      proposed.addOn.forEach(ca => {
        ca.forEach(addon => {
          res.proposed.totalFeatureCharges += addon.dueAmount || 0 - addon?.adjustmentAmount || 0;
        });
      });
      nextMonth.plan.forEach(cp => {
        res.nextMonth.totalPlanCharges += cp.dueAmount || 0;
      });
      nextMonth.addOn.forEach(ca => {
        ca.forEach(addon => {
          res.nextMonth.totalFeatureCharges += addon.dueAmount || 0;
        });
      });
      linePrice.forEach(lps => {
        res.proposed.total += (lps.dueAmount || 0) - (lps?.adjustmentAmount || 0);
        res.nextMonth.total += lps.dueAmountNextMonth;
      });
      res.current.total = res.current.totalFeatureCharges + res.current.totalPlanCharges;
      return res;
    }]
  }, {
    property: 'linePriceDetails',
    name: 'detailedCharges',
    transformations: [linePriceDetails => {
      const result = linePriceDetails.map(_ref2 => {
        let {
          ctn = '',
          telephoneData = '',
          imei = '',
          lineIdentifier = '',
          ctnStatus,
          linePriceSummary,
          currentPlanPricingInfo = {},
          currentCharges = {},
          currentAddOnPricingInfo = [],
          nextBillPlanPricingInfo = {},
          nextBillAddOnPricingInfo = [],
          taxComponents = {}
        } = _ref2;
        const {
          serviceTaxInfo = []
        } = taxComponents;
        const {
          fees = [],
          govt = []
        } = serviceTaxInfo.reduce((acc, _ref3) => {
          let {
            serviceTaxList = []
          } = _ref3;
          serviceTaxList.forEach(taxItem => {
            if (taxItem.taxCategory.toLowerCase().includes('fee')) {
              acc.fees.push(taxItem);
            } else {
              acc.govt.push(taxItem);
            }
          });
          return acc;
        }, {
          fees: [],
          govt: []
        });
        return {
          ctn,
          imei,
          lineIdentifier,
          telephoneData,
          linePrice: linePriceSummary,
          current: {
            plan: currentCharges?.currentRatePlan,
            addOn: currentCharges?.currentAddOns,
            latestCharge: currentCharges?.latestCharge
          },
          now: {
            plan: currentPlanPricingInfo,
            addOn: currentAddOnPricingInfo,
            ctnStatus
          },
          next: {
            plan: nextBillPlanPricingInfo,
            addOn: nextBillAddOnPricingInfo
          },
          fees,
          govt
        };
      });
      return result;
    }, priceDetailsByCTN => {
      const value = [];
      priceDetailsByCTN.forEach(_ref4 => {
        let {
          ctn,
          telephoneData,
          imei,
          linePrice,
          lineIdentifier,
          current,
          next,
          now,
          fees,
          govt
        } = _ref4;
        const processedTax = arr => arr.map(_ref5 => {
          let {
            taxAmount = 0,
            taxDisplayLabel = ''
          } = _ref5;
          return {
            total: taxAmount,
            meta: {
              title: taxDisplayLabel
            }
          };
        });
        const lineTotalPrice = current?.latestCharge?.reduce(function (tot, arr) {
          return tot + arr.charge;
        }, 0);
        const hotlineSuspended = telephoneData && telephoneData?.statusActvCode === 'SUS' && telephoneData?.statusActvRsnCode === 'CO';
        const feeCharges = processedTax(fees);
        const govtCharges = processedTax(govt);
        const mappedCharges = {
          ctn,
          telephoneData,
          imei,
          lineIdentifier,
          current: {
            planCharges: {
              discount: current?.plan?.discountAmount || 0,
              total: current?.plan?.actualPrice || 0,
              meta: current?.plan || {}
            },
            featureCharges: [],
            feeCharges,
            govtCharges,
            lineTotal: lineTotalPrice || 0
          },
          proposed: {
            planCharges: {
              discount: linePrice?.totalDiscount || 0,
              total: hotlineSuspended ? 0 : now?.plan?.dueAmount - now?.plan?.adjustmentAmount || 0,
              meta: Object.keys(now?.plan).length === 0 ? next?.plan : now?.plan,
              showProration: now?.ctnStatus !== undefined && !hotlineSuspended
            },
            featureCharges: now?.addOn?.map(a => {
              return {
                discount: 0,
                total: hotlineSuspended ? 0 : a?.dueAmount - a?.adjustmentAmount || 0,
                meta: a,
                showProration: now?.ctnStatus !== undefined && !hotlineSuspended
              };
            }),
            feeCharges,
            govtCharges,
            lineTotal: linePrice?.dueAmount || 0
          },
          nextMonth: {
            planCharges: {
              discount: linePrice?.totalDiscountNextMonth || 0,
              total: next?.plan?.dueAmount - next?.plan?.adjustmentAmount || 0,
              meta: next?.plan || {}
            },
            featureCharges: next?.addOn?.map(a => {
              return {
                discount: 0,
                total: a?.dueAmount - a?.adjustmentAmount || 0,
                meta: a
              };
            }),
            feeCharges,
            govtCharges,
            lineTotal: linePrice?.dueAmountNextMonth || 0
          }
        };
        [{
          bill: current,
          name: 'current'
        }].forEach(_ref6 => {
          let {
            bill,
            name
          } = _ref6;
          (bill.addOn || []).forEach(ca => {
            mappedCharges[name].featureCharges.push({
              discount: ca?.dueAmount || 0,
              total: ca?.dueAmount || ca?.price || 0,
              meta: ca
            });
          });
        });
        value.push(mappedCharges);
      });
      return value;
    }]
  }]
};
function Step2(props) {
  const {
    dataHook: [state, setState],
    data
  } = props;
  const {
    applyCredit,
    creditAmount,
    tableData: {
      finalData
    },
    createOrderData,
    submitOrderData,
    uiData: {
      effective
    },
    lastAPICall,
    dueDate,
    priceOrderRequest
  } = state;
  let {
    getplansandaddonsResponse,
    priceOrderData
  } = state;
  const {
    userMessages = []
  } = data?.data?.userMessages;
  const isOnlyActivation = finalData?.every(row => row.activityType === 'ACTIVATION');
  const isOnlyAddLine = finalData?.every(row => row.activityType === 'ADDLINE');

  // Mapped the plans and addons with ctn and subscriber number
  let mappedPlansAndAddOnsData = [];
  getplansandaddonsResponse?.compatibility?.compatibilityInfo?.map(info => {
    let newValue = finalData?.find(_ref7 => {
      let {
        telephoneData
      } = _ref7;
      return telephoneData && telephoneData?.subscriberNumber === info?.subscriberNumber;
    });
    mappedPlansAndAddOnsData.push({
      ...info,
      telephoneData: newValue?.telephoneData,
      ctn: newValue?.telephoneData?.telephoneNumber
    });
  });

  // Price order with compatability info
  let newLinePriceDetails = [];
  priceOrderData?.linePriceDetails?.map(details => {
    let compatibility = mappedPlansAndAddOnsData?.find(_ref8 => {
      let {
        ctn
      } = _ref8;
      return details?.ctn === ctn;
    });
    newLinePriceDetails.push({
      ...details,
      telephoneData: compatibility?.telephoneData,
      currentCharges: compatibility?.subscriberInfo,
      ctnStatus: compatibility?.ctnStatus
    });
  });

  // Final price order data
  priceOrderData = {
    ...priceOrderData,
    linePriceDetails: newLinePriceDetails
  };
  const [submitButtonData, setSubmitButtonData] = (0, _react.useState)({
    loading: false,
    label: 'Next',
    disabled: false
  });
  const isCreateOrderPopulated = Object.keys(createOrderData || {}).length > 0 && Object.prototype.hasOwnProperty.call(createOrderData, 'uuid');
  const isSubmitOrderPopulated = Object.keys(submitOrderData || {}).length > 0 && Object.prototype.hasOwnProperty.call(submitOrderData, 'responseStatus') && submitOrderData.responseStatus === 200;
  const {
    charges,
    planDetails
  } = (0, _react.useMemo)(() => mapSourcesToStepComponents(priceOrderData, {
    dueNow: priceOrderData.priceSummary.dueAmount
  }, {
    currentAddons: finalData.map(fd => {
      return {};
    })
  }, {
    dueDate
  }, mappingConfig), []);
  (0, _react.useEffect)(() => {
    if (isCreateOrderPopulated) {
      if (createOrderData.orderStepStatus === 'FAILURE') {
        const codes = [];
        const messages = [];
        createOrderData?.orderStepDetails?.forEach(_ref9 => {
          let {
            code,
            message
          } = _ref9;
          codes.push(code);
          messages.push(message);
        });
        createOrderData?.lines?.forEach(lsd => lsd?.lineStepDetails?.forEach(_ref10 => {
          let {
            code,
            message
          } = _ref10;
          codes.push(code);
          messages.push(message);
        }));
        const errorCode = codes.length > 1 ? `[${codes.join(',')}]` : codes[0];
        const errorMessage = messages.length > 1 ? `[${messages.join(',')}]` : messages[0];
        setState(s => ({
          ...s,
          apiErrors: {
            code: errorCode,
            message: errorMessage
          }
        }));
        setSubmitButtonData(() => ({
          isLoading: false,
          label: 'Failed to Create Order',
          disabled: false
        }));
      } else if (createOrderData.orderStepStatus === 'OKTOSUBMIT' || createOrderData.orderStepStatus === 'INPROGRESS') {
        if (!(priceOrderData && priceOrderData.priceSummary)) return;
        const {
          dueAmount
        } = priceOrderData.priceSummary;
        const hasPortIn = createOrderData?.lines?.find(_ref11 => {
          let {
            lineStep
          } = _ref11;
          return lineStep === 'PORTIN';
        });
        const currentStep = dueAmount > 0 ? 1 : 2;
        const hasDueAmount = dueAmount > 0;
        if (hasDueAmount && effective === 'today') {
          setState(v => ({
            ...v,
            current: v.current + currentStep,
            uiData: {
              ...v.uiData,
              hasDueAmount,
              summarizedCharges: hasDueAmount ? planDetails.summarizedCharges : null
            }
          }));
        } else if (hasPortIn) {
          setState(v => ({
            ...v,
            current: v.current + 1,
            uiData: {
              ...v.uiData,
              hasDueAmount,
              summarizedCharges: hasDueAmount ? planDetails.summarizedCharges : null
            }
          }));
        } else if (!isSubmitOrderPopulated) {
          setSubmitButtonData(() => ({
            isLoading: true,
            label: 'Submitting Order...',
            disabled: true
          }));
          setTimeout(() => {
            (0, _stepController.sendSubmitOrderRequest)(state);
          }, 500);
        }
      }
    }
  }, [isCreateOrderPopulated]);
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
            current: s.current + 3
          }));
        }
      } else {
        setSubmitButtonData(() => ({
          isLoading: false,
          label: 'Failed to Submit Order',
          disabled: false
        }));
        setState(s => ({
          ...s,
          apiErrors: {
            code: submitOrderData.errorCode,
            message: submitOrderData.errorMessage
          }
        }));
      }
    }
  }, [isSubmitOrderPopulated, createConsentData]);
  (0, _react.useEffect)(() => {
    if (lastAPICall === 'error/createOrder' || lastAPICall === 'error/submitOrder') {
      setSubmitButtonData(() => ({
        isLoading: false,
        label: lastAPICall === 'error/createOrder' ? 'Failed to Create Order' : 'Failed to Submit Order',
        disabled: false
      }));
    }
  }, [lastAPICall, isCreateOrderPopulated]);
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "step-2-wrapper--parent"
  }, /*#__PURE__*/_react.default.createElement(_ChargesCard.default, _extends({}, props, {
    charges: charges,
    credit: chargesTransform[0](applyCredit ? creditAmount : 0)
  })), /*#__PURE__*/_react.default.createElement(_PlanList.default, _extends({}, props, {
    dueDate: (0, _moment.default)(dueDate, 'YYYY-MM-DD').format('MM-DD-YYYY'),
    tableData: finalData,
    planDetailsData: planDetails,
    submitButtonData: submitButtonData,
    setSubmitButtonData: setSubmitButtonData,
    priceOrderRequest: priceOrderRequest,
    userMessages: userMessages
  })));
}
module.exports = exports.default;