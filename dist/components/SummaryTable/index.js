"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
require("./styles.css");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const mergeProps = (baseClassName, _ref) => {
  let {
    className = null,
    style = null,
    ...restProps
  } = _ref;
  return {
    className: `${baseClassName}${className ? ` ${className}` : ''}`,
    ...(style ? {
      style: {
        ...style
      }
    } : {}),
    ...restProps
  };
};
const Tag = _ref2 => {
  let {
    tag = 'div',
    className,
    children,
    props
  } = _ref2;
  const BaseTag = tag;
  const mergableProps = mergeProps(className, props);
  return /*#__PURE__*/_react.default.createElement(BaseTag, mergableProps, children);
};
const Summary = _ref3 => {
  let {
    children,
    ...restProps
  } = _ref3;
  return /*#__PURE__*/_react.default.createElement(Tag, {
    className: "summary__wrapper",
    props: restProps
  }, children);
};
const Text = function () {
  let baseClassName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  return _ref4 => {
    let {
      text,
      align = 'left',
      children,
      ...restProps
    } = _ref4;
    let spanText = text;
    let extranenousContent = children;
    if (typeof children === 'string' || typeof children === 'number') {
      spanText = text != null ? text : children;
      extranenousContent = null;
    }
    const props = {
      ...restProps,
      className: `summary__text--${align}`
    };
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(Tag, {
      tag: "span",
      className: baseClassName,
      props: props
    }, spanText), extranenousContent);
  };
};
const Row = _ref5 => {
  let {
    children,
    ...restProps
  } = _ref5;
  return /*#__PURE__*/_react.default.createElement(Tag, {
    className: "summary__row",
    props: restProps
  }, children);
};
const formatValue = (price, placeholder) => {
  const parsedPrice = Number.parseFloat(price);
  if (Number.isNaN(parsedPrice)) {
    return placeholder;
  }
  const formattedPrice = `${parsedPrice}`.includes('.') ? parsedPrice.toFixed(2) : `${parsedPrice}`;
  return formattedPrice.startsWith('-') ? `-$${formattedPrice.slice(1)}` : `$${formattedPrice}`;
};
const parseColorMap = (value, colorMap) => {
  let color = null;
  Object.keys(colorMap).forEach(k => {
    if (k === 'gt' || k === 'lt') {
      Object.keys(colorMap[k]).some(testValue => {
        const test = k === 'gt' ? Number.parseFloat(value) > +testValue : Number.parseFloat(value) < +testValue;
        if (test) {
          color = colorMap[k][testValue];
          return true;
        }
        return false;
      });
    }
    if (Number.parseFloat(value) === +k) {
      color = colorMap[k];
    }
  });
  return color;
};
const Value = _ref6 => {
  let {
    value = null,
    align = 'right',
    children,
    valueColorMap = {
      0: '#d5dce5'
    },
    placeholder = '\u2014',
    displayPlaceholder = true,
    ...restProps
  } = _ref6;
  let spanValue = value;
  let extranenousContent = children;
  if ((typeof children === 'string' || typeof children === 'number') && spanValue == null) {
    spanValue = children;
    extranenousContent = null;
  }
  spanValue = spanValue != null ? spanValue : placeholder;
  let valueTag = null;
  if (spanValue != null) {
    const color = parseColorMap(spanValue, valueColorMap);
    spanValue = formatValue(spanValue, displayPlaceholder ? placeholder : spanValue);
    const props = {
      ...restProps,
      style: {
        color: spanValue === placeholder ? '#d5dce5' : color,
        ...restProps.style
      },
      className: `summary__text--${align}`
    };
    valueTag = /*#__PURE__*/_react.default.createElement(Tag, {
      tag: "span",
      className: "summary__value",
      props: props
    }, spanValue);
  }
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, valueTag, extranenousContent);
};
const Content = _ref7 => {
  let {
    children,
    ...restProps
  } = _ref7;
  return /*#__PURE__*/_react.default.createElement(Tag, {
    className: "summary__content",
    props: restProps
  }, children);
};
Summary.Title = Text('summary__title');
Summary.Subtitle = Text('summary__subtitle');
Summary.Row = Row;
Summary.Text = Text('summary__text');
Summary.Value = Value;
Summary.Content = Content;
var _default = Summary;
exports.default = _default;
module.exports = exports.default;