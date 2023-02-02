"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _antd = require("antd");
var _lodash = _interopRequireDefault(require("lodash.clonedeep"));
var _customCricketPopUp = _interopRequireDefault(require("@ivoyant/custom-cricket-pop-up"));
var _content2Lines = _interopRequireDefault(require("./content2Lines/content2Lines"));
var _getPriceOrderRequestBody = _interopRequireDefault(require("../../../helpers/getPriceOrderRequestBody"));
var _requestApi = _interopRequireDefault(require("./requests/requestApi"));
var _componentCache = require("@ivoyant/component-cache");
var _checkTabletPlan = _interopRequireDefault(require("./utils/checkTabletPlan"));
var _checkErrorMessage = _interopRequireDefault(require("./utils/checkErrorMessage"));
var _moment = _interopRequireDefault(require("moment"));
require("./dueForm.css");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const RADIO_VALUES = {
  TODAY: 'today',
  NEXT_BILL: 'nextBill'
};
const TARGET_ACTIVITY_NEXT_BILL_CYCLE_TOOLTIP = 'Next Bill Cycle not allowed for activities containing a tablet plan or paired unlimited plan.';
const currentDateYYYYMMDD = () => {
  const d = new Date();
  const month = `${d.getMonth() + 1}`;
  const day = `${d.getDate()}`;
  const year = d.getFullYear();
  const fmtMonth = month.length < 2 ? `0${month}` : month;
  const fmtDay = day.length < 2 ? `0${day}` : day;
  return `${year}${fmtMonth}${fmtDay}`;
};
const handleOnChange = (setState, dueDate) => _ref => {
  let {
    target: {
      value: effective
    }
  } = _ref;
  const logicalDate = _componentCache.cache.get('logicalDate');
  const effectiveDateString = effective === RADIO_VALUES.TODAY ? logicalDate ? logicalDate : currentDateYYYYMMDD() : dueDate && dueDate?.replaceAll('/', '')?.replaceAll('-', '');
  setState(v => ({
    ...v,
    uiData: {
      ...v.uiData,
      effective,
      effectiveDateString
    }
  }));
};
const handleOnPriceClick = (state, setState, shouldSendPriceOrderRequest, setPriceOrderButtonData, plansAndAddonsData) => () => {
  if (window[window.sessionStorage?.tabId].sendgetPriceOrderAsyncMachine) {
    const {
      uiData: {
        selected: {
          tableRows
        }
      }
    } = state;
    const {
      apiData
    } = plansAndAddonsData || {
      apiData: {}
    };
    const {
      status,
      responseStatus,
      ...plansAndAddons
    } = apiData;
    if (plansAndAddons == null || Object.keys(plansAndAddons).length === 0) {
      setState(v => ({
        ...v,
        uiData: {
          ...v.uiData,
          lastAction: 'modal/technical-error'
        },
        stepControllerFeedback: {
          ...v.stepControllerFeedback,
          modal: {
            display: true,
            message: 'Plans and Add-ons data is missing'
          }
        }
      }));
      return;
    }
    if (shouldSendPriceOrderRequest) {
      const value = (0, _getPriceOrderRequestBody.default)(state.tableData.finalData, plansAndAddons, state.applyCredit, state.uiData.effectiveDateString, state.accountDetails, state.customerInfo, state.accountInfo, state.accountBalances);
      window[window.sessionStorage?.tabId].sendgetPriceOrderAsyncMachine('RESET');
      window[window.sessionStorage?.tabId].sendgetPriceOrderAsyncMachine('SET.REQUEST.DATA', {
        value
      });
      setState(v => ({
        ...v,
        priceOrderRequest: value,
        priceOrderData: undefined,
        lastAPICall: undefined,
        uiData: {
          ...v.uiData,
          lastAction: 'click/price-order',
          applyCreditToggled: v.applyCredit
        }
      }));
      setPriceOrderButtonData(content => ({
        ...content,
        disabled: true,
        loading: true,
        label: 'Pricing Order...'
      }));
      setTimeout(() => {
        window[window.sessionStorage?.tabId].sendgetPriceOrderAsyncMachine('REFETCH');
      }, 500);
      return;
    }
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
          message: tableRows.length === 0 ? 'Select at least one line.' : 'Perform at least one plan/feature change to line(s).'
        }
      }
    }));
  }
};
const showPriceOrderMsg = () => {
  _antd.message.warning({
    content: 'Please Price the Order for changes to take effect',
    style: {
      position: 'absolute',
      top: 150,
      right: 20
    }
  });
};
const DueForm = _ref2 => {
  let {
    dataHook: [state = {}, setState = () => {}],
    className = '',
    shouldSendPriceOrderRequest,
    disableToday = false,
    disableNextBill = false,
    onNextClick,
    plansAndAddonsData,
    setIsTabletPlanFailed,
    insuranceMessage,
    tableRows
  } = _ref2;
  const {
    uiData: {
      effective,
      lastAction,
      applyCreditToggled = false
    },
    tableData: {
      finalData
    },
    priceOrderData = undefined,
    lastAPICall,
    dueDate = null,
    accountDetails,
    accountBalances,
    customerInfo,
    applyCredit = false
  } = state;
  const [cancelLines, setCancelLines] = (0, _react.useState)(false);
  const [linesSelected, setLinesSelected] = (0, _react.useState)([]);
  const [buttonDisabled, setButtonDisabled] = (0, _react.useState)(false);
  const [priceOrderButtonData, setPriceOrderButtonData] = (0, _react.useState)({
    loading: false,
    label: 'Price Order',
    disabled: true,
    next: false
  });
  const [linesChange, setLinesChange] = (0, _react.useState)(false);
  const [confirmationTablePopUp, setConfirmationTablePopUp] = (0, _react.useState)(false);
  const [contentConfirmationModal, setContentConfirmationModal] = (0, _react.useState)({
    title: '',
    content: '',
    clickFrom: ''
  });
  const [responseData, setResponseData] = (0, _react.useState)([]);
  const [ctnNumber, setCtnNumber] = (0, _react.useState)([]);
  const handleError = validations => {
    const [returningValue, warningErrors, ErrorModal] = (0, _checkErrorMessage.default)(validations);
    if (returningValue) {
      setIsTabletPlanFailed(returningValue);
      setContentConfirmationModal({
        title: '',
        content: ErrorModal,
        variables: {
          errorMessage: warningErrors[0]?.warningDescription,
          technicalDetails: [{
            code: warningErrors[0]?.warningCode,
            message: warningErrors[0]?.warningDescription
          }]
        },
        clickFrom: 'maxPlanTablet',
        okText: '',
        cancelText: ''
      });
      setConfirmationTablePopUp(returningValue);
    }
    return returningValue;
  };
  (0, _react.useEffect)(() => {
    console.log('content', contentConfirmationModal);
  }, [contentConfirmationModal]);
  const changeOneInMultiLineContent = () => {
    setContentConfirmationModal({
      title: 'Select Tablets for Cancellation',
      content: _content2Lines.default,
      variables: {
        title: `Which ${ctnNumber.tabletPlansToCancel.length} tablet lines would you like cancel?`,
        numberOfLines: ctnNumber.tabletPlansToCancel.length,
        ctn: ctnNumber.ctnRelated,
        responseData,
        state,
        setState,
        linesSelected,
        setLinesSelected,
        setContentConfirmationModal,
        setCancelLines,
        cancelLines,
        setLinesChange
      },
      clickFrom: 'tableMultiLineCancellation',
      okText: 'Cancel Tablet',
      cancelText: 'Exit'
    });
    setConfirmationTablePopUp(true);
  };
  (0, _react.useEffect)(() => {
    if (linesChange) {
      const validateLines = ctnNumber.tabletPlansToCancel.length > ctnNumber.validationsCtns ? ctnNumber.validationsCtns : ctnNumber.tabletPlansToCancel.length;
      setButtonDisabled(!(linesSelected.length === validateLines));
    }
    setLinesChange(false);
  }, [linesChange]);
  const changeOneInMultiLine = (tabletLines, selectedLines, tabletCompatibleLines, showPopup) => {
    const effectiveDay = state?.uiData?.effective === 'today' ? 'immediately' : state?.accountDetails?.billCycleDate;
    let content;
    let title = '';
    let clickFromLabel;
    let tabletCompatibleLine;
    const totalTabletLines = selectedLines.length > tabletLines.length ? tabletLines.length : selectedLines.length;
    if (!showPopup) {
      content = `Continuing with this activity will leave no qualifying UNL plan to support the Tablet line. As a result, your tablet line will be cancelled. If you want to keep the tablet line, please exit this activity and change the tablet line to a Simply Data line and start this activity again.
          `;
      clickFromLabel = 'cancelling all tablets';
    } else {
      if (tabletCompatibleLines.length > 1) {
        tabletCompatibleLine = tabletCompatibleLines.join(' & ');
        content = `If you proceed with changing the rate plan for CTN: ${tabletCompatibleLine}, you will need to cancel ${totalTabletLines} tablet line(s). Do you want to proceed with the change?`;
      } else {
        content = `If you proceed with changing the rate plan for CTN: ${tabletCompatibleLines[0]} there will be no remaining qualifying UNL line to quality for the tablet rate plan. The tablet line will be cancelled ${effectiveDay}. Do you wish to proceed?`;
      }
      clickFromLabel = 'tabletMultiLine';
      title = 'Would you like to proceed?';
    }
    setContentConfirmationModal({
      title,
      content,
      clickFrom: clickFromLabel,
      variables: {
        selectedLines,
        tabletLines,
        showPopup
      },
      nextPlan: 'changeOne2MultiLineCancellation',
      okText: 'Yes',
      cancelText: 'No'
    });
    setConfirmationTablePopUp(true);
  };
  const isPriceOrderPopulated = Object.keys(priceOrderData || {}).length > 0;
  (0, _react.useEffect)(() => {
    if (isPriceOrderPopulated && lastAPICall === 'pending/priceOrderData' && !String(lastAction).startsWith('reset')) {
      setPriceOrderButtonData(buttonData => ({
        ...buttonData,
        disabled: applyCreditToggled == applyCredit,
        loading: false,
        label: 'Price Order'
      }));
      if (applyCreditToggled != applyCredit) {
        showPriceOrderMsg();
      }
    } else if (isPriceOrderPopulated && lastAPICall !== 'error/priceOrder' || String(lastAction).startsWith('reset')) {
      setPriceOrderButtonData(buttonData => ({
        ...buttonData,
        loading: false,
        label: 'Price Order'
      }));
    } else if (lastAPICall === 'error/priceOrder') {
      setPriceOrderButtonData(content => ({
        ...content,
        disabled: false,
        loading: false,
        label: 'Pricing Failed - Retry'
      }));
      setTimeout(() => {
        setState(v => ({
          ...v,
          uiData: {
            ...v.uiData,
            lastAction: 'reset/priceOrder'
          },
          lastAPICall: undefined,
          priceOrderData: undefined
        }));
      }, 3000);
    }
  }, [isPriceOrderPopulated, lastAPICall, lastAction, applyCredit]);
  (0, _react.useEffect)(() => {
    if (!dueDate) {
      setState(v => ({
        ...v,
        dueDate: accountDetails.billCycleDate
      }));
    }
  }, [dueDate]);
  (0, _react.useEffect)(() => {
    const isThereNewLine = finalData.some(line => line.activityType === 'ADDLINE');
    if (!effective || effective === '') {
      setPriceOrderButtonData(s => ({
        ...s,
        disabled: true && !isThereNewLine
      }));
    } else {
      let missingPlan = true;
      finalData.forEach(function () {
        let row = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        if (row?.plan?.newPlan !== undefined && Object.keys(row.plan.newPlan).length > 0 || row.changes.length > 0) {
          missingPlan = false;
        }
      });
      if (tableRows?.length === 0) {
        setPriceOrderButtonData(s => ({
          ...s,
          disabled: true
        }));
      } else {
        setPriceOrderButtonData(s => ({
          ...s,
          disabled: missingPlan
        }));
      }
      if (!missingPlan) {
        showPriceOrderMsg();
      }
    }
  }, [effective, finalData]);
  (0, _react.useEffect)(() => {
    if (cancelLines) {
      const selectedRows = state?.uiData?.selected?.tableRows;
      const selectedCtn = [];
      const selectedTablets = [];
      selectedRows.map(element => {
        const accountSelected = state?.tableData?.finalData[element];
        selectedCtn.push({
          ctn: `${accountSelected?.telephoneData?.telephoneNumber}`
        });
      });
      linesSelected.map(element => selectedTablets.push({
        ctn: `${element}`
      }));
      const dataPayload = {
        accountInfo: {
          billinAccountNumber: `${state?.accountDetails?.ban}`,
          banStatus: `${state?.accountDetails?.banStatus}`,
          accountType: `${state?.accountDetails?.accountType}`
        },
        selectedCtn,
        selectedTablets
      };
      setState(data => ({
        ...data,
        mappingTabletLines: dataPayload
      }));
      setPriceOrderButtonData(content => ({
        ...content,
        next: true
      }));
      //callMessageBus(dataPayload, setPriceOrderButtonData, properties, datasources, setIsTabletPlanFailed, setContentConfirmationModal,  setConfirmationTablePopUp);
      setCancelLines(false);
    }
  }, [cancelLines]);
  const onChange = handleOnChange(setState, dueDate);
  const onClick = handleOnPriceClick(state, setState, shouldSendPriceOrderRequest, setPriceOrderButtonData, plansAndAddonsData);
  const selectedPlan = {
    changeOne2MultiLine: (ctn, selectedRows, ctnPlans, showPopup) => changeOneInMultiLine(ctn, selectedRows, ctnPlans, showPopup),
    changeOne2MultiLineCancellation: () => changeOneInMultiLineContent()
  };
  (0, _react.useEffect)(() => {
    const actionPriceOrder = 'click/price-order';
    const stateClickPriceOrder = state?.uiData?.lastAction;
    const responseDataInfo = window[window.sessionStorage?.tabId]?.getPriceOrderAsyncMachine?.event?.data;
    setResponseData(responseDataInfo);
    if (responseDataInfo && stateClickPriceOrder === actionPriceOrder) {
      const objectsResponseData = Object.keys(responseDataInfo);
      if (objectsResponseData.includes('validations')) {
        let validations = responseDataInfo?.validations;
        if (!validations) validations = [];
        const errorCodeNotAllow = handleError(validations);
        if (errorCodeNotAllow) return;
        let tabletPlansToCancel = state?.uiData?.selected?.tableRows;
        const tableInformation = state?.tableData?.finalData;
        const lineDetails = state?.lineDetails;
        let showPopup = responseDataInfo?.showTabletSelection;
        const [ctnRelated, validatingLines, selectedRows, changeShowPopup] = (0, _checkTabletPlan.default)(tableInformation, validations, tabletPlansToCancel, showPopup, lineDetails);
        showPopup = changeShowPopup;
        tabletPlansToCancel = tabletPlansToCancel.length > validatingLines.length ? validatingLines : tabletPlansToCancel;
        if (ctnRelated.length !== 0) {
          setCtnNumber({
            ctnRelated,
            tabletPlansToCancel,
            validationsCtns: validations.length
          });
          let plan = '';
          setLinesSelected([]);
          setCancelLines(false);
          plan = 'changeOne2MultiLine';
          selectedPlan[plan](ctnRelated, tabletPlansToCancel, selectedRows, showPopup);
          //}
        } else {
          setPriceOrderButtonData(content => ({
            ...content,
            next: true
          }));
        }
      } else {
        setPriceOrderButtonData(content => ({
          ...content,
          next: true
        }));
      }
    }
  }, [!priceOrderButtonData.loading]);
  const formClassName = `summary__radio-buttons-wrapper${className ? ` ${className}` : ''}`;
  const disabledNext = lastAction !== 'click/price-order';
  (0, _react.useEffect)(() => {
    if (effective === 'nextBill' && insuranceMessage) setState(oldState => {
      return {
        ...oldState,
        uiData: {
          ...oldState?.uiData,
          effective: null
        }
      };
    });
  }, [insuranceMessage, effective]);
  (0, _react.useEffect)(() => {
    if (tableRows?.length === 0) {
      setPriceOrderButtonData({
        ...priceOrderButtonData,
        disabled: true
      });
    } else if (effective && effective !== '' && priceOrderButtonData?.disabled) {
      setPriceOrderButtonData({
        ...priceOrderButtonData,
        disabled: false
      });
    }
  }, [tableRows]);
  (0, _react.useEffect)(() => {
    if (state?.uiData?.disabledNextBillCycleTablet && effective === RADIO_VALUES.NEXT_BILL) {
      // if next billCycle is disabled due to tablet but checked -> reset that value
      setState(oldState => {
        return {
          ...oldState,
          uiData: {
            ...oldState?.uiData,
            effective: null
          }
        };
      });
    }
  }, [state]);
  return /*#__PURE__*/_react.default.createElement("div", {
    className: formClassName
  }, /*#__PURE__*/_react.default.createElement(_antd.Radio.Group, {
    onChange: onChange,
    value: effective
  }, /*#__PURE__*/_react.default.createElement(_antd.Radio, {
    value: RADIO_VALUES.TODAY,
    disabled: disableToday
  }, "Effective Today"), /*#__PURE__*/_react.default.createElement(_antd.Radio, {
    value: RADIO_VALUES.NEXT_BILL,
    className: "summary__radio--nextBill",
    disabled: disableNextBill || state?.uiData?.disabledNextBillCycleTablet
  }, insuranceMessage || state?.uiData?.disabledNextBillCycleTablet ? /*#__PURE__*/_react.default.createElement(_antd.Tooltip, {
    title: state?.uiData?.disabledNextBillCycleTablet ? TARGET_ACTIVITY_NEXT_BILL_CYCLE_TOOLTIP : insuranceMessage
  }, /*#__PURE__*/_react.default.createElement("span", null, "Next Bill Cycle\xA0"), /*#__PURE__*/_react.default.createElement("span", null, "(", dueDate && dueDate, ")")) : /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("span", null, "Next Bill Cycle\xA0"), /*#__PURE__*/_react.default.createElement("span", null, "(", dueDate && dueDate, ")")))), /*#__PURE__*/_react.default.createElement("div", {
    className: "summary__buttons"
  }, /*#__PURE__*/_react.default.createElement(_antd.Button, {
    className: "summary__button summary__button--price-order",
    type: "text",
    onClick: onClick,
    disabled: priceOrderButtonData.disabled,
    loading: priceOrderButtonData.loading
  }, priceOrderButtonData.label), /*#__PURE__*/_react.default.createElement(_antd.Button, {
    className: "summary__button summary__button--next",
    type: "text",
    onClick: onNextClick,
    disabled: disabledNext || !priceOrderButtonData.disabled || priceOrderButtonData.loading || !priceOrderButtonData.next
  }, "Next")), /*#__PURE__*/_react.default.createElement(_customCricketPopUp.default, {
    confirmationESimPopUp: confirmationTablePopUp,
    setConfirmationESimPopUp: setConfirmationTablePopUp,
    contentConfirmationModal: contentConfirmationModal,
    statusData: setPriceOrderButtonData,
    selectedPlan: selectedPlan,
    setContentConfirmationModal: setContentConfirmationModal,
    buttonDisabled: buttonDisabled,
    setButtonDisabled: setButtonDisabled
  }));
};
var _default = DueForm;
exports.default = _default;
module.exports = exports.default;