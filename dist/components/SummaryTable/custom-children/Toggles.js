"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _antd = require("antd");
require("./toggles.css");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const handleToggle = (type, setState) => () => {
  const toggleOffer = `apply${type}`;
  setState(s => ({
    ...s,
    [toggleOffer]: !s[toggleOffer]
  }));
};
const displayAmount = amount => amount != null ? /*#__PURE__*/_react.default.createElement("span", {
  className: "toggle__switch-offer-amount"
}, "$", amount) : /*#__PURE__*/_react.default.createElement("span", null, '\u2014');
const Toggles = _ref => {
  let {
    dataHook: [state = {}, setState = () => {}],
    disableCoupons = false,
    disableCredit = false
  } = _ref;
  const handleCoupons = handleToggle('Coupons', setState);
  const handleCredit = handleToggle('Credit', setState);
  const couponAmount = displayAmount(state.couponAmount);
  const creditAmount = displayAmount(state.creditAmount);
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "toggles__switches"
  }, !disableCoupons ? /*#__PURE__*/_react.default.createElement("div", {
    className: "toggles__switch"
  }, /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_antd.Switch, {
    className: "toggles__switch-component",
    size: "small",
    checked: state.applyCoupons || false,
    onChange: handleCoupons
  }), /*#__PURE__*/_react.default.createElement("span", {
    className: "toggles__switch-offer-text"
  }, "Apply coupons")), couponAmount) : null, !disableCredit ? /*#__PURE__*/_react.default.createElement("div", {
    className: "toggles__switch"
  }, /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_antd.Switch, {
    className: "toggles__switch-component",
    size: "small",
    checked: state.applyCredit || false,
    onChange: handleCredit
  }), /*#__PURE__*/_react.default.createElement("span", {
    className: "toggles__switch-offer-text"
  }, "Apply credit")), creditAmount) : null);
};
var _default = Toggles;
exports.default = _default;
module.exports = exports.default;