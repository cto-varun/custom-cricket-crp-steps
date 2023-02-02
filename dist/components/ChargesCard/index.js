"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _Wallet = _interopRequireDefault(require("../../Icons/Wallet"));
var _Close = _interopRequireDefault(require("../../Icons/Close"));
var _Tooltip = _interopRequireDefault(require("../Tooltip"));
var _Toggles = _interopRequireDefault(require("../SummaryTable/custom-children/Toggles"));
require("./styles.css");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const handleDollarSign = str => str.startsWith('-') ? `-$${str.slice(1)}` : `$${str}`;
const mapCharges = charges => {
  const chargesItems = [{
    id: 0,
    text: 'Due Now',
    key: 'dueNow'
  }, {
    id: 1,
    text: 'Current Bill',
    key: 'currentBill'
  }, {
    id: 2,
    text: 'Next Bill',
    key: 'nextBill'
  }, {
    id: 3,
    text: 'Discount',
    key: 'discount'
  }, {
    id: 4,
    text: 'Credit',
    key: 'credit'
  }];
  return chargesItems.map(_ref => {
    let {
      text,
      key,
      id
    } = _ref;
    let displayedValue = '';
    let displayClassName = 'charges-card__item-value';
    const chargeItem = charges[key];
    if (chargeItem != null) {
      if (typeof chargeItem === 'object') {
        displayedValue = chargeItem.amount ? `${chargeItem.amount}` : displayedValue;
        displayClassName = chargeItem.color ? `${displayClassName} charges-card__item-value--${chargeItem.color}` : displayClassName;
      } else {
        displayedValue = `${chargeItem}`;
      }
      if (displayedValue !== '') {
        displayedValue = displayedValue.includes('$') ? displayedValue : handleDollarSign(displayedValue);
      }
    }
    if (displayedValue === '') {
      displayedValue = '\u2014';
    }
    return /*#__PURE__*/_react.default.createElement("div", {
      key: id,
      className: "charges-card__item-display"
    }, /*#__PURE__*/_react.default.createElement("span", {
      className: "charges-card__item-text"
    }, text), /*#__PURE__*/_react.default.createElement("span", {
      className: displayClassName
    }, displayedValue));
  });
};
const WalletTooltip = _ref2 => {
  let {
    dataHook,
    handleClose,
    disableCoupons = false,
    disableCredit = false
  } = _ref2;
  const onClick = () => handleClose(false);
  const displayPlaceholder = disableCoupons && disableCredit;
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "wallet-tooltip__wrapper"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "wallet-tooltip__title"
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: "wallet-tooltip__title-text"
  }, "Wallet"), /*#__PURE__*/_react.default.createElement("span", {
    className: "wallet-tooltip__close-icon",
    onClick: onClick
  }, /*#__PURE__*/_react.default.createElement(_Close.default, null))), /*#__PURE__*/_react.default.createElement("div", {
    className: "wallet-tooltip__toggles-wrapper"
  }, !displayPlaceholder ? /*#__PURE__*/_react.default.createElement(_Toggles.default, {
    dataHook: dataHook,
    disableCoupons: disableCoupons,
    disableCredit: disableCredit
  }) : /*#__PURE__*/_react.default.createElement("span", null, "No Data")));
};
const ChargesCard = _ref3 => {
  let {
    className = '',
    charges,
    credit,
    dataHook
  } = _ref3;
  const cardClassName = `charges-card__wrapper${className ? ` ${className}` : ''}`;
  const [showTooltip, setShowTooltip] = (0, _react.useState)(false);
  const chargesDisplay = (0, _react.useMemo)(() => mapCharges({
    ...charges,
    credit
  }), [credit]);
  const handleTooltipVisiblity = visible => setShowTooltip(visible);
  return /*#__PURE__*/_react.default.createElement("div", {
    className: cardClassName
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "charges-card__charges-display"
  }, chargesDisplay), /*#__PURE__*/_react.default.createElement("div", {
    className: "charges-card__wallet"
  }, /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
    trigger: "click",
    title: /*#__PURE__*/_react.default.createElement(WalletTooltip, {
      dataHook: dataHook,
      handleClose: handleTooltipVisiblity,
      disableCoupons: true
    }),
    overlayClassName: "charges-card__wallet-tooltip",
    placement: "left",
    open: showTooltip,
    onVisibleChange: handleTooltipVisiblity
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "charges-card__wallet-wrapper"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "charges-card__wallet-icon-wrapper"
  }, /*#__PURE__*/_react.default.createElement(_Wallet.default, null)), /*#__PURE__*/_react.default.createElement("div", {
    className: "charges-card__wallet-text"
  }, "Click to apply coupons & credit")))));
};
var _default = ChargesCard;
exports.default = _default;
module.exports = exports.default;