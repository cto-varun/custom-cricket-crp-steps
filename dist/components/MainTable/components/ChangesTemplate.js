"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _antd = require("antd");
var _icons = require("@ant-design/icons");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const ChangesTemplate = props => {
  const {
    data = {},
    resetNewAddOn,
    resetAddOnQuantity,
    resetRemovedAddOn,
    rowIndex
  } = props;
  if (Object.keys(data).length === 0) {
    return null;
  }
  const socCode = Object.keys(data)[0];
  const {
    changeType
  } = data[socCode];
  switch (changeType) {
    case 'addOnQuantity':
      return /*#__PURE__*/_react.default.createElement("div", {
        className: "changeAddOnQuantity"
      }, "Set Amount of Add-On ", socCode, " to ", data[socCode]?.quantity, /*#__PURE__*/_react.default.createElement(_icons.ReloadOutlined, {
        onClick: () => resetAddOnQuantity(rowIndex, socCode)
      }));
    case 'newAddOn':
      return /*#__PURE__*/_react.default.createElement("div", {
        className: "changeNewAddOn"
      }, "Added ", data[socCode]?.quantity, " of Add-On ", socCode, /*#__PURE__*/_react.default.createElement(_icons.ReloadOutlined, {
        onClick: () => resetNewAddOn(rowIndex, socCode)
      }));
    case 'removedAddOn':
      return /*#__PURE__*/_react.default.createElement("div", {
        className: "changeRemovedAddOn"
      }, "Removed Add-On ", socCode, /*#__PURE__*/_react.default.createElement(_icons.ReloadOutlined, {
        onClick: () => resetRemovedAddOn(rowIndex, socCode)
      }));
    default:
      return /*#__PURE__*/_react.default.createElement("div", null, "Invalid change type specified.");
  }
};
var _default = ChangesTemplate;
exports.default = _default;
module.exports = exports.default;