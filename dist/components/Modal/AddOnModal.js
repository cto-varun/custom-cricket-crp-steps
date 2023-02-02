"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
require("./AddOnModal.css");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const AddOnModal = _ref => {
  let {
    dataHook,
    selected
  } = _ref;
  const [state, setState] = dataHook;
  let defaultAddOnObject = {
    socCode: '',
    shortDescription: '',
    price: '',
    longDescription: '',
    addOnType: '',
    maxQuantity: 9,
    minQuantity: 1
  };
  if (selected && selected.meta) {
    defaultAddOnObject = selected.meta;
  }
  const {
    socCode,
    shortDescription,
    price,
    longDescription,
    addOnType,
    maxQuantity = 9
  } = defaultAddOnObject;
  const isOneTime = addOnType === 'ONETIME';
  const [quantity, setQuantity] = (0, _react.useState)(1);
  const onPlusClick = () => {
    if (quantity < maxQuantity) {
      setQuantity(quantity + 1);
    }
  };
  const onMinusClick = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  const handleAddClick = () => {
    const currentAddOns = state.uiData.selected.addOns;
    if (currentAddOns.length > 0) {
      currentAddOns.map(item => {
        const currentItemQty = item.socCode === socCode ? quantity : item?.quantity;
        return {
          ...item,
          quantity: currentItemQty || 1
        };
      });
    }
    setState(v => ({
      ...v,
      uiData: {
        ...v.uiData,
        selected: {
          ...v.uiData.selected,
          addOns: currentAddOns
        },
        lastAction: 'closeModal'
      },
      tableData: {
        ...v.tableData,
        shouldUpdateAddOns: true
      },
      stepControllerFeedback: {
        ...v.stepControllerFeedback,
        modal: {
          display: false,
          message: '',
          footer: null,
          onOk: null,
          onCancel: null,
          maskClosable: true,
          lazyLoad: null,
          lazyProps: {},
          title: ''
        }
      }
    }));
  };
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "addOnModalContainer"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "nameContainer"
  }, shortDescription), /*#__PURE__*/_react.default.createElement("div", {
    className: "rateContainer"
  }, `$${price}/mo`), /*#__PURE__*/_react.default.createElement("div", {
    className: "descContainer"
  }, longDescription), /*#__PURE__*/_react.default.createElement("div", {
    className: "selectorContainer"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "selectorLabel"
  }, "How often ?"), /*#__PURE__*/_react.default.createElement("div", {
    className: `selectorValue${isOneTime ? ' selected' : ''}`
  }, "Once"), /*#__PURE__*/_react.default.createElement("div", {
    className: `selectorValue${!isOneTime ? ' selected' : ''}`
  }, "Monthly")), /*#__PURE__*/_react.default.createElement("div", {
    className: "dashedBorder"
  }), isOneTime && /*#__PURE__*/_react.default.createElement("div", {
    className: "plusMinusContainer"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "plusMinusRateContainer"
  }, `$${price * quantity}`), /*#__PURE__*/_react.default.createElement("div", {
    className: "plusMinusBtnsContainer"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "plusMinusBtn plusBtn",
    onClick: onPlusClick
  }, "+"), /*#__PURE__*/_react.default.createElement("div", {
    className: "plusMinusBtn minusBtn",
    onClick: onMinusClick
  }, "-"))), isOneTime && /*#__PURE__*/_react.default.createElement("div", {
    className: "onceLabelContainer"
  }, "Once"), /*#__PURE__*/_react.default.createElement("div", {
    className: "amountContainer"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "labelText"
  }, "Monthly"), /*#__PURE__*/_react.default.createElement("div", {
    className: "amountText"
  }, `$${price}`)), /*#__PURE__*/_react.default.createElement("div", {
    className: "dashedBorder"
  }), /*#__PURE__*/_react.default.createElement("div", {
    className: "amountContainer"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "labelText totalText"
  }, "Feature Total"), /*#__PURE__*/_react.default.createElement("div", {
    className: "amountText totalAmount"
  }, `$${price * quantity}`)), /*#__PURE__*/_react.default.createElement("div", {
    className: "dashedBorder"
  }), /*#__PURE__*/_react.default.createElement("div", {
    className: "addBtn",
    onClick: handleAddClick
  }, "ADD"));
};
var _default = AddOnModal;
exports.default = _default;
module.exports = exports.default;