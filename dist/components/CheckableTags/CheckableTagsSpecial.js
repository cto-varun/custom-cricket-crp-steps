"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _antd = require("antd");
var _Tooltip = _interopRequireDefault(require("../Tooltip"));
var _OTCTooltip = _interopRequireDefault(require("../Tooltip/OTCTooltip"));
var _InfoTooltip = _interopRequireDefault(require("../Tooltip/InfoTooltip"));
var _Info = _interopRequireDefault(require("../../Icons/Info"));
var _Undo = _interopRequireDefault(require("../../Icons/Undo"));
require("./styles.css");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const {
  CheckableTag: AntCheckableTag
} = _antd.Tag;
const getElementType = (type, option, tagText, key, dataHook, undoProps) => {
  const {
    label = '',
    meta = {},
    value = ''
  } = option;
  const {
    quantity = 0
  } = meta;
  switch (type) {
    case 'ebb':
      {
        return /*#__PURE__*/_react.default.createElement("span", {
          key: key,
          className: "checkable-tag__ebb"
        }, "EBB Eligible");
      }
    case 'text':
      {
        return /*#__PURE__*/_react.default.createElement("span", {
          key: key,
          className: "checkable-tag__text"
        }, tagText || label);
      }
    case 'changes-text':
      {
        const changesText = tagText || /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, "Set Amount of", ' ', /*#__PURE__*/_react.default.createElement("span", {
          className: "checkable-tag__text--600"
        }, label), " to", ' ', /*#__PURE__*/_react.default.createElement("span", {
          className: "checkable-tag__text--600"
        }, quantity));
        return /*#__PURE__*/_react.default.createElement("span", {
          key: key,
          className: "checkable-tag__text"
        }, changesText);
      }
    case 'quantity':
      return /*#__PURE__*/_react.default.createElement("span", {
        key: key,
        className: "checkable-tag__quantity-box"
      }, quantity);
    case 'info-icon':
      return /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
        key: key,
        title: /*#__PURE__*/_react.default.createElement(_InfoTooltip.default, {
          meta: meta,
          value: value
        }),
        overlayClassName: "checkable-tag__tooltip",
        destroyTooltipOnHide: {
          keepParent: false
        }
      }, /*#__PURE__*/_react.default.createElement("span", {
        className: "checkable-tag__label-section--icon"
      }, /*#__PURE__*/_react.default.createElement(_Info.default, null)));
    case 'undo-icon':
      {
        const [, setState] = dataHook;
        const onUndoClick = event => {
          event.stopPropagation();
          setState(s => ({
            ...s,
            stepControllerFeedback: {
              ...s.stepControllerFeedback,
              modal: {
                ...s.stepControllerFeedback.modal,
                display: true,
                lazyLoad: 'UndoSelectionModal',
                lazyProps: {
                  ...undoProps,
                  dataHook,
                  className: 'modal__undo-selection'
                },
                overrideProps: {
                  mask: false
                }
              }
            }
          }));
        };
        return /*#__PURE__*/_react.default.createElement("span", {
          key: key,
          className: "checkable-tag__label-section--icon",
          onClick: onUndoClick
        }, /*#__PURE__*/_react.default.createElement(_Undo.default, null));
      }
    default:
      return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, {
        key: key
      });
  }
};
const mapElements = (displayElements, option, tagText, dataHook, undoProps) => {
  return /*#__PURE__*/_react.default.createElement("span", {
    className: "checkable-tag__label-wrapper"
  }, displayElements.map((type, index) => getElementType(type, option, tagText, index, dataHook, undoProps)));
};
const applyClassName = (colors, auto, tagClassName) => {
  const withAuto = auto ? 'checkable-tag__wrapper checkable-tag__wrapper--auto ' : 'checkable-tag__wrapper';
  const withTagClassName = tagClassName ? `${withAuto}${tagClassName} ` : withAuto;
  const colorSet = [{
    color: 'gray',
    display: colors.gray
  }, {
    color: 'green',
    display: colors.green
  }, {
    color: 'lime-green',
    display: colors.limeGreen
  }, {
    color: 'red',
    display: colors.red
  }];
  const displayOther = colorSet.findIndex(item => item.display);
  if (displayOther === -1) {
    return `${withTagClassName}checkable-tag__wrapper--default`;
  }
  return `${withTagClassName}checkable-tag__wrapper--${colorSet[displayOther].color}`;
};
const CheckableTagSpecial = props => {
  const {
    option,
    onChange,
    displayElements,
    allowQuantityEdit = false,
    tagClassName,
    tagText = '',
    dataHook,
    otcProps = {},
    undoProps = {},
    gray = false,
    green = false,
    limeGreen = false,
    red = false
  } = props;
  const {
    value
  } = option;
  let Wrapper = _react.default.Fragment;
  let wrapperProps = {};
  const [visible, setVisible] = (0, _react.useState)(null);
  if (allowQuantityEdit) {
    Wrapper = _Tooltip.default;
    const title = /*#__PURE__*/_react.default.createElement(_OTCTooltip.default, _extends({
      setVisible: () => setVisible(false)
    }, otcProps));
    wrapperProps = {
      title,
      trigger: 'click',
      overlayClassName: 'checkable-tag__otc-tooltip',
      placement: 'top',
      onClick: () => setVisible(true),
      visible: visible,
      onVisibleChange: () => setVisible(!visible)
    };
  }
  const elements = mapElements(displayElements, option, tagText, dataHook, undoProps);
  const checkableClassName = applyClassName({
    gray,
    green,
    limeGreen,
    red
  }, displayElements.length > 0, tagClassName);
  return /*#__PURE__*/_react.default.createElement(Wrapper, wrapperProps, /*#__PURE__*/_react.default.createElement(AntCheckableTag, {
    key: value,
    className: checkableClassName,
    onChange: onChange
  }, elements));
};
var _default = CheckableTagSpecial;
exports.default = _default;
module.exports = exports.default;