"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _antd = require("antd");
var _Modal = _interopRequireDefault(require("./components/Modal"));
var _Spinner = _interopRequireDefault(require("./components/Spinner"));
var _createWindowFns = _interopRequireWildcard(require("./helpers/createWindowFns"));
var _componentCache = require("@ivoyant/component-cache");
var _componentMessageBus = require("@ivoyant/component-message-bus");
var _initialState = _interopRequireDefault(require("./initialState"));
var _Close = _interopRequireDefault(require("./Icons/Close"));
require("./configurableSteps.css");
var _Step = _interopRequireDefault(require("./steps/Step1"));
var _Step2 = _interopRequireDefault(require("./steps/Step2"));
var _Step3 = _interopRequireDefault(require("./steps/Step3"));
var _Step4 = _interopRequireDefault(require("./steps/Step4"));
var _Step5 = _interopRequireDefault(require("./steps/Step5"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const CurrentStep = /*#__PURE__*/(0, _react.memo)(props => {
  const {
    current,
    dataHook
  } = props;
  const Step = step => {
    switch (step) {
      case 0:
        return /*#__PURE__*/_react.default.createElement(_Step.default, _extends({}, props, {
          dataHook: dataHook
        }));
      case 1:
        return /*#__PURE__*/_react.default.createElement(_Step2.default, _extends({}, props, {
          dataHook: dataHook
        }));
      case 2:
        return /*#__PURE__*/_react.default.createElement(_Step3.default, _extends({}, props, {
          dataHook: dataHook
        }));
      case 3:
        return /*#__PURE__*/_react.default.createElement(_Step4.default, _extends({}, props, {
          dataHook: dataHook
        }));
      case 4:
        return /*#__PURE__*/_react.default.createElement(_Step5.default, _extends({}, props, {
          dataHook: dataHook
        }));
      default:
        return /*#__PURE__*/_react.default.createElement(_Step.default, _extends({}, props, {
          dataHook: dataHook
        }));
    }
  };
  return /*#__PURE__*/_react.default.createElement(_react.Suspense, {
    fallback: /*#__PURE__*/_react.default.createElement(_Spinner.default, {
      tip: "Loading step...",
      className: "crp-step__spinner"
    })
  }, Step(current));
});
const ConfigurableSteps = props => {
  const {
    component: {
      id,
      params: {
        titles
      }
    },
    data,
    properties
  } = props;
  const {
    onCompleteEvent = 'CRP.COMPLETE'
  } = properties;
  const newAccountInfo = _componentCache.cache.get('newAccountInfo');
  const newState = {
    ..._initialState.default,
    ...data?.data
  };
  if (newAccountInfo && newAccountInfo.ban === window[window.sessionStorage?.tabId].NEW_BAN) {
    //accountId = newAccountInfo.ban;
    newState.accountDetails.banStatus = newAccountInfo.accountStatus;
    newState.accountDetails.accountType = newAccountInfo.accountType;
    newState.accountDetails.accountSubType = newAccountInfo.accountSubType;
    //adrZip = newAccountInfo.billingAddress.zip;
    //adrCity = newAccountInfo.billingAddress.city;
    //adrStateCode = newAccountInfo.billingAddress.state;
  }

  const [state, setState] = (0, _react.useState)(newState);
  const {
    current,
    apiErrors,
    displayCRPErrors = true
  } = state;
  (0, _react.useEffect)((0, _createWindowFns.default)(id, state, setState), []);
  (0, _react.useEffect)((0, _createWindowFns.stateDebugger)(id, state, setState));
  (0, _react.useEffect)(() => {
    if (apiErrors && apiErrors.code) {
      const errorMessage = `Error ${apiErrors.code}: ${apiErrors.message}`;
      const technicalDetails = apiErrors.causedBy || null;
      const modalProperties = displayCRPErrors ? {
        display: true,
        lazyLoad: 'ErrorModal',
        lazyProps: {
          errorMessage,
          technicalDetails
        }
      } : {};
      setState(s => ({
        ...s,
        apiErrors: undefined,
        displayCRPErrors: true,
        stepControllerFeedback: {
          ...s.stepControllerFeedback,
          modal: {
            ...s.stepControllerFeedback.modal,
            ...modalProperties
          }
        }
      }));
    }
  });
  const handleExit = () => {
    if (newAccountInfo) {
      _componentCache.cache.remove('newAccountInfo');
      window[window.sessionStorage?.tabId].unauthenticate();
      window[window.sessionStorage?.tabId].navigateRoute('/');
    } else {
      window[window.sessionStorage?.tabId].navigateRoute('/dashboards/manage-account');
    }
    _componentMessageBus.MessageBus.send(onCompleteEvent, {});
  };
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_Modal.default, {
    dataHook: [state, setState]
  }), /*#__PURE__*/_react.default.createElement("div", {
    className: "crp__content-steps"
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: "crp__content-steps-header"
  }, "Change Plans & Features"), /*#__PURE__*/_react.default.createElement(_antd.Steps, {
    className: "crp__content-steps-steps",
    current: current
  }, titles.map((title, index) => /*#__PURE__*/_react.default.createElement(_antd.Steps.Step, {
    key: index,
    title: title
  }))), /*#__PURE__*/_react.default.createElement("span", {
    className: "crp__content-steps-close"
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: "crp__content-steps-close-icon",
    onClick: handleExit
  }, /*#__PURE__*/_react.default.createElement(_Close.default, null)))), /*#__PURE__*/_react.default.createElement(CurrentStep, _extends({}, props, {
    current: current,
    dataHook: [state, setState]
  })));
};
var _default = ConfigurableSteps;
exports.default = _default;
module.exports = exports.default;