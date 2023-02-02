"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const InfoTooltip = _ref => {
  let {
    meta: {
      price = '\u2014',
      longDescription = 'N/A',
      shortDescription = ''
    },
    value,
    className
  } = _ref;
  return /*#__PURE__*/_react.default.createElement("div", {
    className: className
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "tooltip-overlay__content-short"
  }, shortDescription || value, ":"), /*#__PURE__*/_react.default.createElement("div", {
    className: "tooltip-overlay__content-long"
  }, longDescription), /*#__PURE__*/_react.default.createElement("div", {
    className: "tooltip-overlay__content-price"
  }, "Price: $", price));
};
var _default = InfoTooltip;
exports.default = _default;
module.exports = exports.default;