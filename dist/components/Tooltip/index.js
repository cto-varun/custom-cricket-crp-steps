"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _antd = require("antd");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const Tooltip = props => {
  const {
    children,
    ...overrideTooltipProps
  } = props;
  return /*#__PURE__*/_react.default.createElement(_antd.Tooltip, overrideTooltipProps, children);
};
var _default = Tooltip;
exports.default = _default;
module.exports = exports.default;