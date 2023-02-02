"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const OTCTooltip = _ref => {
  let {
    updateFunction = () => {},
    removeFunction = () => {},
    quantity = 0,
    price,
    rowIndex,
    id,
    hidePlus = false,
    hideMinus = false,
    maxOTC = 9,
    showMultiplied = true,
    setVisible,
    technicalSoc = false
  } = _ref;
  const LazyTrash = /*#__PURE__*/_react.default.lazy(() => Promise.resolve().then(() => _interopRequireWildcard(require('../../Icons/Trash'))));
  const LazyPlus = /*#__PURE__*/_react.default.lazy(() => Promise.resolve().then(() => _interopRequireWildcard(require('../../Icons/Plus'))));
  const trash = /*#__PURE__*/_react.default.createElement(_react.default.Suspense, {
    fallback: "-"
  }, /*#__PURE__*/_react.default.createElement(LazyTrash, null));
  const plus = /*#__PURE__*/_react.default.createElement(_react.default.Suspense, {
    fallback: "+"
  }, /*#__PURE__*/_react.default.createElement(LazyPlus, null));
  let fPrice = '';
  const fQuantity = quantity ? +quantity : 1;
  if (typeof price === 'number') {
    fPrice = price;
  } else if (typeof price === 'string') {
    const dollarIndex = price.indexOf('$');
    fPrice = dollarIndex > -1 ? +`${price.slice(0, dollarIndex)}${price.slice(dollarIndex + 1)}` : +price;
  }
  const displayPrice = showMultiplied ? fPrice * fQuantity : fPrice;
  const header = price ? /*#__PURE__*/_react.default.createElement("div", {
    className: "otc-tooltip__header"
  }, "$", displayPrice) : null;
  const onTrashClick = () => {
    removeFunction(rowIndex, id, quantity - 1);
    setVisible(false);
  };
  const onPlusClick = quantity < maxOTC ? () => updateFunction(rowIndex, id, quantity + 1) : () => {};
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "otc-tooltip__wrapper"
  }, header, /*#__PURE__*/_react.default.createElement("div", {
    className: "otc-tooltip__update-actions"
  }, !hideMinus ? /*#__PURE__*/_react.default.createElement("span", {
    className: "otc-tooltip__icon otc-tooltip__icon--trash",
    onClick: onTrashClick
  }, trash) : null, technicalSoc ? null : /*#__PURE__*/_react.default.createElement("div", {
    className: "otc-tooltip__quantity-box"
  }, quantity), !hidePlus ? /*#__PURE__*/_react.default.createElement("span", {
    className: "otc-tooltip__icon otc-tooltip__icon--plus",
    onClick: onPlusClick
  }, plus) : null));
};
var _default = OTCTooltip;
exports.default = _default;
module.exports = exports.default;