"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultModalState = exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _antd = require("antd");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const defaultModalState = {
  display: false,
  message: '',
  footer: null,
  onOk: null,
  onCancel: null,
  maskClosable: true,
  lazyLoad: null,
  lazyProps: {},
  title: '',
  overrideProps: {},
  className: ''
};
exports.defaultModalState = defaultModalState;
const handleEvent = setState => () => {
  setState(v => ({
    ...v,
    uiData: {
      ...v.uiData,
      lastAction: 'modal/close'
    },
    stepControllerFeedback: {
      ...v.stepControllerFeedback,
      modal: defaultModalState
    }
  }));
};
const handleLazy = (load, lazyProps, state, setState) => {
  let LazyContent;
  switch (load) {
    case 'ErrorModal':
      LazyContent = /*#__PURE__*/_react.default.lazy(() => Promise.resolve().then(() => _interopRequireWildcard(require('./ErrorModal'))));
      break;
    case 'UndoSelectionModal':
      LazyContent = /*#__PURE__*/_react.default.lazy(() => Promise.resolve().then(() => _interopRequireWildcard(require('./UndoSelectionModal'))));
      break;
    case 'AddOnModal':
      LazyContent = /*#__PURE__*/_react.default.lazy(() => Promise.resolve().then(() => _interopRequireWildcard(require('./AddOnModal'))));
      break;
    case 'TechnicalSocModal':
      LazyContent = /*#__PURE__*/_react.default.lazy(() => Promise.resolve().then(() => _interopRequireWildcard(require('./TechnicalSocModal'))));
      break;
    default:
      LazyContent = null;
      break;
  }
  const lazyContentProps = {
    ...lazyProps,
    dataHook: [state, setState],
    defaultModalState
  };
  return /*#__PURE__*/_react.default.createElement(_react.default.Suspense, {
    fallback: null
  }, /*#__PURE__*/_react.default.createElement(LazyContent, lazyContentProps));
};
const Modal = _ref => {
  let {
    dataHook
  } = _ref;
  const [state, setState] = dataHook;
  const {
    stepControllerFeedback: {
      modal: {
        message,
        title,
        display,
        footer = null,
        onOk = null,
        onCancel = null,
        maskClosable = true,
        lazyLoad = null,
        lazyProps = {},
        overrideProps = {},
        className = '',
        closable = true
      }
    }
  } = state;
  const handleClick = handleEvent(setState);
  const modalContent = lazyLoad ? handleLazy(lazyLoad, lazyProps, state, setState) : message;
  return /*#__PURE__*/_react.default.createElement(_antd.Modal, _extends({
    wrapClassName: className || lazyProps?.className || '',
    title: title,
    open: display,
    onOk: onOk ? onOk(state, setState, defaultModalState) : handleClick,
    onCancel: onCancel ? onCancel(state, setState, defaultModalState) : handleClick,
    footer: footer,
    maskClosable: maskClosable,
    closable: closable,
    destroyOnClose: true
  }, overrideProps), modalContent);
};
var _default = Modal;
exports.default = _default;