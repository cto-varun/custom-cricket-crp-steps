"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _icons = require("@ant-design/icons");
var _antd = require("antd");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* eslint-disable complexity */

const fp = price => {
  if (!price) return '$0';
  const parsedPrice = Number.parseFloat(price);
  const formattedPrice = `${parsedPrice}`.includes('.') ? parsedPrice.toFixed(2) : `${parsedPrice}`;
  return formattedPrice.startsWith('-') ? `-$${formattedPrice.slice(1)}` : `$${formattedPrice}`;
};
const featuresMapping = (featureCharges, type, featureTitle, dueDate, featureClassName) => {
  const emptyPlaceholders = featureCharges.length === 0 ? /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("div", {
    className: "text-right"
  }, '\u2014'), /*#__PURE__*/_react.default.createElement("div", {
    className: "text-right"
  }, '\u2014')) : null;
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "plan-list-item-charge"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "charge-row"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "charge-title"
  }, featureTitle), emptyPlaceholders), featureCharges.map((feature, index) => /*#__PURE__*/_react.default.createElement("div", {
    className: "charge-row",
    key: index
  }, type === 'addons' ? /*#__PURE__*/_react.default.createElement("div", {
    className: "addon-type"
  }, feature.meta?.socCode || feature.meta?.addOnCode, (!feature.meta?.socCode?.startsWith('CRK') || !feature.meta?.addOnCode?.startsWith('CRK')) && /*#__PURE__*/_react.default.createElement("div", {
    className: "addon-type-badge"
  }, feature?.meta?.quantity)) : /*#__PURE__*/_react.default.createElement("div", {
    className: featureClassName
  }, feature.meta?.title), /*#__PURE__*/_react.default.createElement("div", {
    className: "text-right"
  }, fp(feature.discount || 0)), /*#__PURE__*/_react.default.createElement("div", {
    className: "text-right"
  }, fp(feature.total || 0), feature?.showProration && feature.total != 0 ? /*#__PURE__*/_react.default.createElement(_antd.Tooltip, {
    title: `This charge is prorated for the remainder of the billcycle, from today until ${dueDate}`
  }, /*#__PURE__*/_react.default.createElement(_icons.InfoCircleOutlined, {
    style: {
      marginLeft: 6
    }
  })) : /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null)))));
};
const formatTelephone = function () {
  let digits = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  const output = digits === '' ? 'No Data' : `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  return output;
};
const DataRow = props => {
  const {
    data: {
      telephoneData: {
        telephoneNumber,
        phoneModel,
        imei,
        sim
      }
    },
    detailedCharges,
    dueDate
  } = props;
  const planListItemClassName = index => `plan-list-item${index % 2 ? ' striped' : ''}`;
  const details = ['current', 'proposed', 'nextMonth'].map(k => detailedCharges[k]);
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "plan-detail-list-item"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "item-header"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "mobile-icon-wrapper text-green-1"
  }, /*#__PURE__*/_react.default.createElement(_icons.MobileOutlined, null)), /*#__PURE__*/_react.default.createElement("div", {
    className: "telephone-number"
  }, formatTelephone(telephoneNumber)), /*#__PURE__*/_react.default.createElement("div", {
    className: "subtitle"
  }, "Model"), /*#__PURE__*/_react.default.createElement("div", {
    className: "phone-model"
  }, phoneModel || 'No Data'), /*#__PURE__*/_react.default.createElement("div", {
    className: "subtitle"
  }, "IMEI"), /*#__PURE__*/_react.default.createElement("div", {
    className: "meta-info"
  }, imei || 'No Data'), /*#__PURE__*/_react.default.createElement("div", {
    className: "subtitle"
  }, "SIM"), /*#__PURE__*/_react.default.createElement("div", {
    className: "meta-info"
  }, sim || 'No Data')), /*#__PURE__*/_react.default.createElement("div", {
    className: "item-content",
    style: {
      gridTemplateColumns: details.length || 1
    }
  }, details.map(function () {
    let detail = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    let index = arguments.length > 1 ? arguments[1] : undefined;
    const {
      planCharges = {},
      featureCharges = [],
      feeCharges = [],
      govtCharges = [],
      lineTotal = ''
    } = detail;
    const key = index;
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "plan-list-item-wrapper",
      key: key
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: planListItemClassName(key)
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "plan-list-item-charge"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "charge-row"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "charge-title"
    }, "Plan charges"), /*#__PURE__*/_react.default.createElement("div", {
      className: "text-right"
    }, "Discount"), /*#__PURE__*/_react.default.createElement("div", {
      className: "text-right"
    }, "Total")), /*#__PURE__*/_react.default.createElement("div", {
      className: "plan-charge-item charge-row"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "text-green-1"
    }, planCharges.meta?.socCode || planCharges.meta?.pricePlanSocCode || '\u2014'), /*#__PURE__*/_react.default.createElement("div", {
      className: "text-right"
    }, fp(planCharges.discount || 0)), /*#__PURE__*/_react.default.createElement("div", {
      className: "text-right"
    }, fp(planCharges.total || planCharges.price), planCharges?.showProration && planCharges.total != 0 ? /*#__PURE__*/_react.default.createElement(_antd.Tooltip, {
      title: `This charge is prorated for the remainder of the billcycle, from today until ${dueDate}`
    }, /*#__PURE__*/_react.default.createElement(_icons.InfoCircleOutlined, {
      style: {
        marginLeft: 6
      }
    })) : /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null)))), featuresMapping(featureCharges, 'addons', 'Feature charges', dueDate), featuresMapping(feeCharges, 'fees', 'Fee charges', 'fee-type'), featuresMapping(govtCharges, 'govt', 'Govt charges', 'govt-type'), /*#__PURE__*/_react.default.createElement("div", {
      className: "plan-list-item-charge",
      style: {
        border: 'none',
        alignItems: 'flex-end',
        fontSize: '16px',
        color: '#010101',
        fontWeight: 'bold'
      }
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "charge-row"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "charge-title"
    }, "Line Total"), /*#__PURE__*/_react.default.createElement("div", {
      className: "text-right"
    }, "\xA0"), /*#__PURE__*/_react.default.createElement("div", {
      className: "text-right"
    }, fp(lineTotal))))));
  })));
};
var _default = DataRow;
exports.default = _default;
module.exports = exports.default;