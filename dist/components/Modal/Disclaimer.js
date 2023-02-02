"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _antd = require("antd");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const handleChange = (isChecked, state, setState) => {
  setState(v => ({
    ...v,
    uiData: {
      ...v.uiData,
      disclaimerRead: !isChecked
    }
  }));
};
const Disclaimer = _ref => {
  let {
    dataHook
  } = _ref;
  const [state, setState] = dataHook;
  const [isChecked, setIsChecked] = _react.default.useState(false);
  return /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("div", null, "Please read the appropriate disclaimer for the rate plan(s) they have chosen"), /*#__PURE__*/_react.default.createElement("div", null, "$55 Unlimited More"), /*#__PURE__*/_react.default.createElement("form", null, /*#__PURE__*/_react.default.createElement("label", {
    htmlFor: "confirmDisclaimer"
  }, /*#__PURE__*/_react.default.createElement("input", {
    type: "checkbox",
    name: "confirmDisclaimer",
    value: "confirmed",
    checked: isChecked,
    onChange: () => {
      setIsChecked(!isChecked);
    }
  }), /*#__PURE__*/_react.default.createElement("span", null, "I have read the appropriate disclaimer"))), /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_antd.Button, {
    disabled: !isChecked,
    onClick: () => {
      if (isChecked) {
        setState(v => ({
          ...v,
          uiData: {
            ...v.uiData,
            disclaimerRead: true
          },
          stepControllerFeedback: {
            ...v.stepControllerFeedback,
            modal: {
              display: false,
              message: ''
            }
          }
        }));
      }
    }
  }, "CONTINUE")));
};
var _default = Disclaimer;
exports.default = _default;
module.exports = exports.default;