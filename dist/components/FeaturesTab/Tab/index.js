"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _antd = require("antd");
var _Expand = _interopRequireDefault(require("../../../Icons/Expand"));
var _Robot = _interopRequireDefault(require("../../../Icons/Robot"));
require("./styles.css");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const TabBarUI = _ref => {
  let {
    expandView,
    onExpireToggle,
    onExpandClick
  } = _ref;
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("div", {
    className: "tab-bar-wrapper__search-wrapper"
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: "tab-bar-wrapper__robot-icon-wrapper"
  }, /*#__PURE__*/_react.default.createElement(_Robot.default, null)), /*#__PURE__*/_react.default.createElement(_antd.Input, {
    className: "tab-bar-wrapper__input-element",
    placeholder: "Ask me what you are looking for",
    disabled: true
  })), /*#__PURE__*/_react.default.createElement("div", {
    className: "tab-bar-wrapper__ui-elements"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "tab-bar-wrapper__ui-elements--expire"
  }, /*#__PURE__*/_react.default.createElement(_antd.Switch, {
    size: "small",
    onChange: onExpireToggle
  }), " Expire"), /*#__PURE__*/_react.default.createElement("div", {
    className: "tab-bar-wrapper__ui-elements--expand",
    onClick: onExpandClick
  }, /*#__PURE__*/_react.default.createElement(_Expand.default, {
    invert: expandView
  }))));
};
const mapPanels = _ref2 => {
  let {
    children,
    panelTitles = [],
    keys
  } = _ref2;
  return children.map((childView, index) => {
    const tab = panelTitles?.length ? panelTitles[index] : null;
    const key = keys && keys[index] || index;
    const child = /*#__PURE__*/_react.default.cloneElement(childView, {
      tabType: key
    });
    return {
      label: tab,
      key,
      children: child
    };
  });
};
const TabComponent = _ref3 => {
  let {
    properties: {
      keys,
      defaultActiveKey,
      expandView,
      panelTitles,
      onExpandClick,
      onExpireToggle
    },
    children,
    className
  } = _ref3;
  const wrapperClassName = `crp-tabs-ui${` ${className}` || ''}`;
  const panelComponents = mapPanels({
    children,
    panelTitles,
    keys
  });
  return /*#__PURE__*/_react.default.createElement(_antd.Tabs, {
    className: wrapperClassName,
    defaultActiveKey: defaultActiveKey,
    tabBarExtraContent: /*#__PURE__*/_react.default.createElement(TabBarUI, {
      expandView: expandView,
      onExpireToggle: onExpireToggle,
      onExpandClick: onExpandClick
    }),
    items: panelComponents
  });
};
var _default = TabComponent;
exports.default = _default;
module.exports = exports.default;