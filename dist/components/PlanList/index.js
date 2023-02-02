"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _antd = require("antd");
var _PlanList = _interopRequireDefault(require("./PlanList"));
var _PlanListDetail = _interopRequireDefault(require("./PlanListDetail"));
var _stepController = _interopRequireDefault(require("../../helpers/stepController"));
var _helpers = require("../../helpers/helpers");
require("./styles.css");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const {
  Paragraph
} = _antd.Typography;
const PlanListWrapper = _ref => {
  let {
    dataHook,
    dueDate,
    tableData,
    planDetailsData: {
      summarizedCharges,
      detailedCharges
    },
    submitButtonData,
    setSubmitButtonData,
    priceOrderRequest,
    userMessages
  } = _ref;
  const [isDetailed, setDetailed] = (0, _react.useState)(false);
  const [termsConditionsModal, setTermsConditionsModal] = (0, _react.useState)(false);
  const isAddLine = dataHook[0]?.tableData?.finalData?.find(row => row.activityType !== 'CHANGESERVICES');
  const titleClassName = `plan-list-header-item ${isDetailed ? 'plan-detail-item' : 'plan-item'}`;
  const [getConsentData, setGetConsentData] = (0, _react.useState)(undefined);
  const [createConsentData, setCreateConsentData] = (0, _react.useState)(undefined);
  (0, _react.useEffect)(() => {
    window[window.sessionStorage?.tabId][`setGetConsentData`] = setGetConsentData;
    window[window.sessionStorage?.tabId][`setCreateConsentData`] = setCreateConsentData;
    window[window.sessionStorage?.tabId][`createConsentRequestBody`] = _helpers.createConsentRequestBody;
    return () => {
      delete window[window.sessionStorage?.tabId][`setGetConsentData`];
      delete window[window.sessionStorage?.tabId][`setCreateConsentData`];
      delete window[window.sessionStorage?.tabId][`createConsentRequestBody`];
    };
  });
  const onBackClick = () => (0, _stepController.default)('back', 1, dataHook);
  const onNextClick = termsConditionsAgreed => {
    if (termsConditionsAgreed) {
      (0, _helpers.createConsentRequestBody)(priceOrderRequest);
      setTermsConditionsModal(false);
      moveToNext();
    } else {
      setTermsConditionsModal(true);
    }
  };
  const moveToNext = () => (0, _stepController.default)('next', 1, dataHook, {
    setSubmitButtonData
  });
  const plans = [{
    key: 0,
    title: 'Current Charges'
  }, {
    key: 1,
    title: 'Proposed Changes'
  }, {
    key: 2,
    title: 'Next Month'
  }];
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "plan-list-wrapper"
  }, /*#__PURE__*/_react.default.createElement(_antd.Modal, {
    open: termsConditionsModal,
    destroyOnClose: true,
    closable: false,
    title: "Terms and Conditions",
    onOk: () => onNextClick(true),
    okText: "Yes",
    cancelText: "No",
    onCancel: () => onBackClick()
  }, isAddLine ? /*#__PURE__*/_react.default.createElement(Paragraph, null, /*#__PURE__*/_react.default.createElement("div", {
    style: {
      padding: '10px'
    }
  }, userMessages.find(row => row.name == 'addLineTC')?.message || "By activating Cricket service, you are agreeing to the\r\nCricket Wireless Terms and Conditions of Service,\r\navailable at cricketwireless.com/terms, which includes\r\ndispute resolution by arbitration. Account payments are\r\nnontransferable and nonrefundable. For information on\r\nCricket's network management practices visit\r\nCricketwireless.com/mobilebroadband. Geographic, usage,\r\nand other restrictions apply.\r\n\r\nDo you agree?")) : /*#__PURE__*/_react.default.createElement(Paragraph, null, /*#__PURE__*/_react.default.createElement("div", {
    style: {
      padding: '10px'
    }
  }, userMessages.find(row => row.name == 'changeRatePlanTC')?.message || 'Your continued use of Cricket service constitutes\r\nacceptance of the Cricket Wireless Terms and Conditions\r\nof Service, which includes dispute resolution by\r\narbitration. Full terms are available at\r\ncricketwireless.com/terms. For information on Cricket’s\r\nnetwork management practices, see\r\nCricketwireless.com/mobilebroadband.\r\n\r\nDo you wish to proceed?'))), /*#__PURE__*/_react.default.createElement("div", {
    className: "plan-list-header"
  }, isDetailed ? /*#__PURE__*/_react.default.createElement("div", {
    className: "plan-list-header-item phone-line"
  }, "Phone Line") : null, plans.map(_ref2 => {
    let {
      title,
      key
    } = _ref2;
    return /*#__PURE__*/_react.default.createElement("div", {
      key: key,
      className: titleClassName
    }, title);
  }), /*#__PURE__*/_react.default.createElement("div", {
    className: "detail-toggle"
  }, /*#__PURE__*/_react.default.createElement(_antd.Switch, {
    onChange: checked => setDetailed(checked)
  }), "\xA0 Detailed View")), /*#__PURE__*/_react.default.createElement("div", {
    className: "plan-list-content"
  }, isDetailed ? /*#__PURE__*/_react.default.createElement(_PlanListDetail.default, {
    data: tableData,
    dueDate: dueDate,
    detailedCharges: detailedCharges
  }) : /*#__PURE__*/_react.default.createElement(_PlanList.default, {
    summarizedCharges: summarizedCharges
  })), /*#__PURE__*/_react.default.createElement("div", {
    className: "plan-list-actions"
  }, /*#__PURE__*/_react.default.createElement(_antd.Button, {
    onClick: onBackClick
  }, "Back"), /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_antd.Button, {
    type: "primary",
    onClick: () => onNextClick(false),
    disabled: submitButtonData.disabled,
    loading: submitButtonData.isLoading
  }, submitButtonData.label))));
};
var _default = PlanListWrapper;
exports.default = _default;
module.exports = exports.default;