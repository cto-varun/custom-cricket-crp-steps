"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _antd = require("antd");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/* eslint-disable prefer-promise-reject-errors */

const {
  Text
} = _antd.Typography;
const Tags = {
  CREATED: {
    color: 'blue',
    title: 'Created'
  },
  INPROGRESS: {
    color: 'orange',
    title: 'In Progress'
  },
  SUCCESS: {
    color: 'green',
    title: 'Success'
  },
  CANCELLED: {
    color: 'red',
    title: 'Canceled'
  },
  OKTOSUBMIT: {
    color: 'green',
    title: 'OK to Submit'
  },
  FAILURE: {
    color: 'red',
    title: 'Failure'
  }
};
const hasErrors = errorObj => {
  return errorObj.some(field => field.errors.length > 0);
};
function UpdateOrder(_ref) {
  let {
    order,
    onUpdateOrder,
    setEditOrder,
    loading
  } = _ref;
  const [form] = _antd.Form.useForm();
  const {
    billingAccountNumber,
    lines
  } = order;
  const [formValues, setFormValues] = (0, _react.useState)({});
  const onFinish = values => {
    let requestBody = {
      billingAccountNumber
    };
    if (Object.keys(formValues).length) {
      const portDetails = [];
      Object.entries(formValues).forEach(_ref2 => {
        let [key, value] = _ref2;
        if (value?.taxId === '') {
          delete value.taxId;
        }
        portDetails.push({
          ctn: key,
          portDetails: {
            ...value,
            taxId: value?.taxId ? value?.taxId : 9999
          }
        });
      });
      requestBody = {
        ...requestBody,
        portDetailsInfo: portDetails
      };
    }
    onUpdateOrder(requestBody);
  };
  const customValidator = (rule, value) => {
    if (rule.field?.includes('accNum')) {
      return !value || /^\d{1,20}$/.test(value) && value.length >= 9 ? Promise.resolve() : Promise.reject(!value ? 'Please enter the account number' : 'Please enter a valid 9 - 20 digit account number.');
    }
    if (rule.field?.includes('zipcode')) {
      return !value || /^\d{1,5}$/.test(value) && value.length === 5 ? Promise.resolve() : Promise.reject(!value ? 'Please enter the zip code' : 'Please enter a valid 5 digit zipcode.');
    }
    if (rule.field?.includes('passcode')) {
      return !value || /^\d{1,8}$/.test(value) && value.length >= 4 && value.length <= 8 ? Promise.resolve() : Promise.reject(!value ? 'Please enter the pass code' : 'Please enter a valid 4 - 8 digit passcode.');
    }
    if (rule.field?.includes('taxId')) {
      return !value || /^\d{1,4}$/.test(value) && value.length === 4 ? Promise.resolve() : Promise.reject('Please enter last 4 digit SSN/TaxId.');
    }
  };
  const handleField = (value, name, phoneNumber) => {
    setFormValues({
      ...formValues,
      [phoneNumber]: {
        ...formValues[phoneNumber],
        [name]: value
      }
    });
  };
  return /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("div", {
    style: {
      border: '1px solid rgba(0, 0, 0, 0.1)',
      padding: '26px 20px'
    }
  }, /*#__PURE__*/_react.default.createElement(_antd.Form, {
    form: form,
    layout: "vertical",
    name: "basic",
    onFinish: onFinish,
    className: "addALineForm"
  }, lines.map(_ref3 => {
    let {
      customerTelephoneNumber,
      lineStepStatus,
      lineStep
    } = _ref3;
    if (lineStepStatus === 'RESOLUTIONREQ' && lineStep === 'PORTIN') {
      return /*#__PURE__*/_react.default.createElement(_antd.Row, {
        gutter: 24
      }, /*#__PURE__*/_react.default.createElement(_antd.Col, {
        span: 8
      }, /*#__PURE__*/_react.default.createElement(_antd.Row, {
        style: {
          margin: '8px 0'
        },
        key: customerTelephoneNumber
      }, /*#__PURE__*/_react.default.createElement(_antd.Col, {
        span: 24
      }, /*#__PURE__*/_react.default.createElement(Text, {
        type: "secondary",
        style: {
          marginRight: 12,
          fontWeight: 600
        }
      }, "Phone Number:", ' ', customerTelephoneNumber)), /*#__PURE__*/_react.default.createElement(_antd.Col, {
        span: 24,
        style: {
          marginRight: 12,
          fontWeight: 600
        }
      }, /*#__PURE__*/_react.default.createElement(Text, {
        type: "secondary",
        style: {
          marginRight: 12
        }
      }, "lineStepStatus:", ' ', lineStepStatus)), /*#__PURE__*/_react.default.createElement(_antd.Col, {
        span: 24,
        style: {
          marginRight: 12,
          fontWeight: 600
        }
      }, /*#__PURE__*/_react.default.createElement(Text, {
        type: "secondary",
        style: {
          marginRight: 12
        }
      }, "lineStep: ", lineStep)))), /*#__PURE__*/_react.default.createElement(_antd.Col, {
        span: 14,
        offset: 2
      }, /*#__PURE__*/_react.default.createElement(_antd.Row, {
        gutter: 18
      }, /*#__PURE__*/_react.default.createElement(_antd.Col, {
        span: 9
      }, /*#__PURE__*/_react.default.createElement(_antd.Form.Item, {
        label: "Passcode",
        name: `passcode-${customerTelephoneNumber}`,
        validateTrigger: "onBlur",
        rules: [{
          required: true,
          validateTrigger: 'onBlur',
          validator: customValidator
        }],
        normalize: value => value.replace(/[^0-9]/gi, '')
      }, /*#__PURE__*/_react.default.createElement(_antd.Input, {
        maxLength: 8,
        minLength: 4,
        autoComplete: "off",
        onChange: e => handleField(e.target.value, 'otherAccountPin', customerTelephoneNumber)
      }))), /*#__PURE__*/_react.default.createElement(_antd.Col, {
        span: 9
      }, /*#__PURE__*/_react.default.createElement(_antd.Form.Item, {
        label: "Account Number",
        name: `accNum-${customerTelephoneNumber}`,
        rules: [{
          required: true,
          message: 'Please enter the Account Number'
        }],
        normalize: value => value.replace(/[^0-9]/gi, '')
      }, /*#__PURE__*/_react.default.createElement(_antd.Input, {
        autoComplete: "off",
        onChange: e => handleField(e.target.value, 'otherAccountNumber', customerTelephoneNumber)
      }))), /*#__PURE__*/_react.default.createElement(_antd.Col, {
        span: 9
      }, /*#__PURE__*/_react.default.createElement(_antd.Form.Item, {
        label: "Zip Code",
        normalize: value => value.replace(/[^0-9]/gi, ''),
        name: `zipcode-${customerTelephoneNumber}`,
        validateTrigger: "onBlur",
        rules: [{
          required: true,
          validateTrigger: 'onBlur',
          validator: customValidator
        }]
      }, /*#__PURE__*/_react.default.createElement(_antd.Input, {
        maxLength: 5,
        autoComplete: "off",
        onChange: e => handleField(e.target.value, 'zipcode', customerTelephoneNumber)
      }))), /*#__PURE__*/_react.default.createElement(_antd.Col, {
        span: 9
      }, /*#__PURE__*/_react.default.createElement(_antd.Form.Item, {
        label: "Last digit 4 SSN/TaxId",
        name: `taxId-${customerTelephoneNumber}`,
        validateTrigger: "onBlur",
        normalize: value => value.replace(/[^0-9]/gi, ''),
        rules: [{
          validateTrigger: 'onBlur',
          validator: customValidator
        }]
      }, /*#__PURE__*/_react.default.createElement(_antd.Input, {
        maxLength: 4,
        minLength: 4,
        autoComplete: "off",
        onChange: e => handleField(e.target.value, 'taxId', customerTelephoneNumber)
      }))))));
    }
  }), /*#__PURE__*/_react.default.createElement(_antd.Row, {
    gutter: 18
  }, /*#__PURE__*/_react.default.createElement(_antd.Col, {
    span: 24,
    style: {
      display: 'flex',
      justifyContent: 'flex-end'
    }
  }, /*#__PURE__*/_react.default.createElement(_antd.Button, {
    block: true,
    onClick: () => setEditOrder(false),
    style: {
      width: 100,
      marginRight: 12
    }
  }, "Close"), /*#__PURE__*/_react.default.createElement(_antd.Form.Item, {
    shouldUpdate: true
  }, () => /*#__PURE__*/_react.default.createElement(_antd.Button, {
    block: true,
    type: "primary",
    htmlType: "submit",
    loading: loading,
    disabled: hasErrors(form.getFieldsError()) || Object.keys(formValues).length !== lines.filter(_ref4 => {
      let {
        lineStepStatus,
        lineStep
      } = _ref4;
      return lineStepStatus === 'RESOLUTIONREQ' && lineStep === 'PORTIN';
    })?.length
  }, "Update Order")))))));
}
var _default = UpdateOrder;
exports.default = _default;
module.exports = exports.default;