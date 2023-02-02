"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const getItemColor = value => {
  return value < 0 ? '#d35d43' : value >= 20 ? '#60a630' : '#404041';
};
const fp = price => {
  const parsedPrice = Number.parseFloat(price);
  const formattedPrice = `${parsedPrice}`.includes('.') ? parsedPrice.toFixed(2) : `${parsedPrice}`;
  return formattedPrice.startsWith('-') ? `-$${formattedPrice.slice(1)}` : `$${formattedPrice}`;
};
const PlanItem = _ref => {
  let {
    charges: {
      total,
      totalPlanCharges,
      totalFeatureCharges,
      totalFeeCharges,
      totalGovtCharges
    },
    striped = false
  } = _ref;
  const planItemClassName = `plan-list-item${striped ? ' striped' : ''}`;
  const items = [{
    title: 'Plan charges',
    value: totalPlanCharges
  }, {
    title: 'Feature charges',
    value: totalFeatureCharges
  }, {
    title: 'Fee charges',
    value: totalFeeCharges
  }, {
    title: 'Govt charges',
    value: totalGovtCharges
  }];
  return /*#__PURE__*/_react.default.createElement("div", {
    className: planItemClassName
  }, items.map((_ref2, index) => {
    let {
      title,
      value
    } = _ref2;
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "plan-list-item-charge",
      key: index
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "charge-title"
    }, title), /*#__PURE__*/_react.default.createElement("div", {
      className: "charge-value",
      style: {
        color: getItemColor(value)
      }
    }, fp(value)));
  }), /*#__PURE__*/_react.default.createElement("div", {
    className: "plan-list-item-charge",
    style: {
      border: 'none'
    }
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "charge-title"
  }, "Total"), /*#__PURE__*/_react.default.createElement("div", {
    className: "charge-title",
    style: {
      color: getItemColor(total),
      fontSize: '16px',
      color: '#010101'
    }
  }, fp(total))));
};
var _default = PlanItem;
exports.default = _default;
module.exports = exports.default;