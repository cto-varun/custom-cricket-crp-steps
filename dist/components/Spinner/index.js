"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _antd = require("antd");
require("./styles.css");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const Spinner = _ref => {
  let {
    tip = '',
    className = ''
  } = _ref;
  return /*#__PURE__*/_react.default.createElement(_antd.Spin, {
    className: className,
    tip: tip
  });
};
var _default = Spinner;
exports.default = _default;
module.exports = exports.default;