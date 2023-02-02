"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _antd = require("antd");
require("./detailsButton.css");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const handleClick = (dataHook, BillingComponent) => {
  const [, setState] = dataHook;
  setState(v => ({
    ...v,
    stepControllerFeedback: {
      ...v.stepControllerFeedback,
      modal: {
        display: true,
        message: BillingComponent
      }
    }
  }));
};
const DetailsButton = _ref => {
  let {
    BillingComponent,
    dataHook
  } = _ref;
  return /*#__PURE__*/_react.default.createElement(_antd.Button, {
    onClick: () => handleClick(dataHook, BillingComponent),
    className: "view-details--button"
  }, "VIEW DETAILS");
};
var _default = DetailsButton;
exports.default = _default;
module.exports = exports.default;