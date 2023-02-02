"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Expand;
var _react = _interopRequireDefault(require("react"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function Expand(_ref) {
  let {
    invert = false
  } = _ref;
  return invert ? /*#__PURE__*/_react.default.createElement("svg", {
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/_react.default.createElement("path", {
    d: "M18.2828 4.30326L14.4526 8.13336L13.4632 7.14393C12.9233 6.60397 12 6.9864 12 7.75004V11.1431C12 11.6165 12.3838 12.0002 12.8571 12.0002H16.2502C17.0138 12.0002 17.3963 11.077 16.8563 10.537L15.8669 9.54754L19.697 5.71744C19.8643 5.55008 19.8643 5.27872 19.697 5.11133L18.8889 4.30322C18.7215 4.1359 18.4501 4.1359 18.2828 4.30326Z"
  }), /*#__PURE__*/_react.default.createElement("path", {
    d: "M12.0002 12.8571V16.2502C12.0002 17.0138 11.077 17.3963 10.537 16.8563L9.54754 15.8669L5.71747 19.697C5.55011 19.8643 5.27875 19.8643 5.11136 19.697L4.30325 18.8889C4.1359 18.7215 4.1359 18.4501 4.30325 18.2828L8.13336 14.4526L7.14393 13.4632C6.60397 12.9233 6.9864 12 7.75004 12H11.1431C11.6165 12 12.0002 12.3838 12.0002 12.8571Z"
  })) : /*#__PURE__*/_react.default.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 16 16",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/_react.default.createElement("path", {
    d: "M16 0.857143V4.25018C16 5.01382 15.0768 5.39625 14.5368 4.85629L13.5473 3.86686L9.71725 7.69696C9.54989 7.86432 9.27854 7.86432 9.11114 7.69696L8.30304 6.88886C8.13568 6.7215 8.13568 6.45014 8.30304 6.28275L12.1331 2.45264L11.1437 1.46321C10.6038 0.92325 10.9862 0 11.7498 0H15.1429C15.6163 0 16 0.38375 16 0.857143ZM6.28275 8.30304L2.45264 12.1331L1.46321 11.1437C0.92325 10.6038 0 10.9862 0 11.7498V15.1429C0 15.6163 0.38375 16 0.857143 16H4.25018C5.01382 16 5.39625 15.0768 4.85629 14.5368L3.86686 13.5473L7.69696 9.71721C7.86432 9.54986 7.86432 9.2785 7.69696 9.11111L6.88886 8.303C6.72146 8.13568 6.45011 8.13568 6.28275 8.30304Z"
  }));
}
module.exports = exports.default;