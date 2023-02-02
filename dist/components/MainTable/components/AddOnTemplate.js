"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _icons = require("@ant-design/icons");
var _MainTablePopover = _interopRequireDefault(require("./MainTablePopover"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const AddOnTemplate = props => {
  const {
    data = {
      changes: {}
    },
    updateQuantityFunction,
    rowIndex
  } = props;
  const {
    changes
  } = data;
  const isChanged = Object.keys(changes).length > 0;
  let {
    quantity
  } = data;
  if (isChanged && changes.hasOwnProperty('quantity')) {
    quantity = changes?.quantity;
  }
  if (Object.keys(data).length === 0) {
    return null;
  }
  if (isChanged && changes.hasOwnProperty('removedAddOn')) {
    return null;
  }
  return /*#__PURE__*/_react.default.createElement(_MainTablePopover.default, {
    popoverContent: /*#__PURE__*/_react.default.createElement("div", {
      className: "changeAddOnPopover"
    }, /*#__PURE__*/_react.default.createElement("span", {
      onClick: () => {
        updateQuantityFunction(rowIndex, data.socCode, quantity - 1);
      }
    }, /*#__PURE__*/_react.default.createElement(_icons.DeleteOutlined, null)), /*#__PURE__*/_react.default.createElement("span", {
      className: "changeAddOnQuantityContainer"
    }, quantity), /*#__PURE__*/_react.default.createElement("span", {
      onClick: () => {
        updateQuantityFunction(rowIndex, data.socCode, quantity + 1);
      }
    }, /*#__PURE__*/_react.default.createElement(_icons.PlusOutlined, {
      className: "changeAddOn"
    }))),
    popoverTitle: /*#__PURE__*/_react.default.createElement("div", {
      className: "changeAddOnPopoverTitle"
    }, "$", data.price),
    popoverTrigger: "click"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: isChanged ? 'changedAddOn' : 'originalAddOn'
  }, "$", data.price, " ", data.socCode, ' ', /*#__PURE__*/_react.default.createElement("span", {
    className: "addOnQuantityContainer"
  }, quantity), /*#__PURE__*/_react.default.createElement(_MainTablePopover.default, {
    popoverContent: /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("div", null, data.shortDescription), /*#__PURE__*/_react.default.createElement("div", null, data.longDescription), /*#__PURE__*/_react.default.createElement("div", null, data.price))
  }, /*#__PURE__*/_react.default.createElement(_icons.InfoCircleOutlined, null))));
};
var _default = AddOnTemplate;
exports.default = _default;
module.exports = exports.default;