"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = CollapsePanels;
var _react = _interopRequireDefault(require("react"));
var _antd = require("antd");
require("./styles.css");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const PanelHeader = _ref => {
  let {
    checked,
    isCurrent,
    label,
    price,
    onChange
  } = _ref;
  const priceDisplay = price ? /*#__PURE__*/_react.default.createElement("div", {
    className: "collapse-panel__header-price"
  }, `$${price} per month`) : null;
  const wrapperClassName = `collapse-panel__header-wrapper${isCurrent ? '' : ' collapse-panel__header-wrapper--expired'}`;
  const stopPropagation = event => {
    event.stopPropagation();
  };
  return /*#__PURE__*/_react.default.createElement("div", {
    className: wrapperClassName
  }, /*#__PURE__*/_react.default.createElement(_antd.Checkbox, {
    className: "collapse-panel__header-checkbox",
    checked: checked,
    onChange: onChange,
    onClick: stopPropagation
  }, label), priceDisplay);
};
function CollapsePanels(_ref2) {
  let {
    isChecked,
    onChangeHandler,
    options = [],
    wrapperClassName = 'collapse-panel__parent-wrapper',
    setState,
    tabType
  } = _ref2;
  return /*#__PURE__*/_react.default.createElement("div", {
    className: wrapperClassName
  }, /*#__PURE__*/_react.default.createElement(_antd.Collapse, {
    expandIconPosition: "right"
  }, options.map((option, index) => {
    const {
      isCurrent,
      label,
      meta,
      value
    } = option;
    const {
      longDescription,
      price
    } = meta;
    const onChange = selectedMeta => {
      setState(v => ({
        ...v,
        uiData: {
          ...v.uiData,
          lastAction: 'checkableTagsChanged',
          selected: {
            ...v.uiData.selected,
            [tabType]: [{
              selectedMeta
            }]
          }
        },
        tableData: {
          ...v.tableData,
          shouldUpdate: tabType
        }
      }));
    };
    const checked = isChecked(value);
    const key = index;
    const currentClassName = checked ? ' collapse-panel__panel-wrapper--checked' : '';
    return /*#__PURE__*/_react.default.createElement(_antd.Collapse.Panel, {
      key: key,
      className: currentClassName,
      header: /*#__PURE__*/_react.default.createElement(PanelHeader, {
        label: label,
        price: price,
        onChange: () => onChange(meta),
        isCurrent: isCurrent
      })
    }, /*#__PURE__*/_react.default.createElement("p", null, longDescription));
  })));
}
module.exports = exports.default;