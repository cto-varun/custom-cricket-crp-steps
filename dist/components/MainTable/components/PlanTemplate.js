"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _icons = require("@ant-design/icons");
var _MainTablePopover = _interopRequireDefault(require("./MainTablePopover"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const PlanTemplate = props => {
  const {
    data: {
      currentPlan = {},
      newPlan = {}
    },
    removeNewPlan,
    rowIndex
  } = props;
  if (Object.keys(currentPlan).length === 0) {
    return /*#__PURE__*/_react.default.createElement("div", null, "Error: no current plan");
  }
  if (Object.keys(newPlan).length === 0) {
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "defaultPlanButton"
    }, /*#__PURE__*/_react.default.createElement("span", null, "$", currentPlan.pricePlanSocCode, "\xA0"), /*#__PURE__*/_react.default.createElement("span", null, /*#__PURE__*/_react.default.createElement(_MainTablePopover.default, {
      popoverContent: /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("div", null, currentPlan.shortDescription), /*#__PURE__*/_react.default.createElement("div", null, currentPlan.longDescription), /*#__PURE__*/_react.default.createElement("div", null, currentPlan.price))
    }, /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_icons.InfoCircleOutlined, null)))));
  }
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("div", {
    className: "currentPlanButton"
  }, "$", currentPlan.pricePlanSocCode, ' ', /*#__PURE__*/_react.default.createElement(_MainTablePopover.default, {
    popoverContent: /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("div", null, currentPlan.shortDescription), /*#__PURE__*/_react.default.createElement("div", null, currentPlan.longDescription), /*#__PURE__*/_react.default.createElement("div", null, currentPlan.price))
  }, /*#__PURE__*/_react.default.createElement(_icons.InfoCircleOutlined, null))), /*#__PURE__*/_react.default.createElement(_MainTablePopover.default, {
    popoverContent: /*#__PURE__*/_react.default.createElement("div", {
      onClick: () => removeNewPlan(rowIndex)
    }, /*#__PURE__*/_react.default.createElement(_icons.DeleteOutlined, {
      style: {
        fontSize: '24px'
      }
    })),
    popoverTitle: /*#__PURE__*/_react.default.createElement("div", null, newPlan.pricePlanSocCode),
    popoverTrigger: "click"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "newPlanButton"
  }, "$", newPlan.pricePlanSocCode, ' ', /*#__PURE__*/_react.default.createElement(_MainTablePopover.default, {
    popoverContent: /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("div", null, newPlan.shortDescription), /*#__PURE__*/_react.default.createElement("div", null, newPlan.longDescription), /*#__PURE__*/_react.default.createElement("div", null, newPlan.price))
  }, /*#__PURE__*/_react.default.createElement("span", null, /*#__PURE__*/_react.default.createElement(_icons.InfoCircleOutlined, null))))));
};
var _default = PlanTemplate;
exports.default = _default;
module.exports = exports.default;