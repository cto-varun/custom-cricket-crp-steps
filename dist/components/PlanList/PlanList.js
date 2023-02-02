"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _PlanItem = _interopRequireDefault(require("./PlanItem"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const PlanList = _ref => {
  let {
    summarizedCharges
  } = _ref;
  const summarized = ['current', 'proposed', 'nextMonth'].map(k => ({
    key: k,
    charges: summarizedCharges[k]
  }));
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "plan-list-container"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "plan-list-container-wrapper"
  }, summarized.map((_ref2, index) => {
    let {
      charges,
      key
    } = _ref2;
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "plan-list-item-wrapper",
      key: key
    }, /*#__PURE__*/_react.default.createElement(_PlanItem.default, {
      charges: charges,
      striped: index % 2
    }));
  })));
};
var _default = PlanList;
exports.default = _default;
module.exports = exports.default;