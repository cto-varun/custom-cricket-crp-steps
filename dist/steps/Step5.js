"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Step5;
var _react = _interopRequireWildcard(require("react"));
var _antd = require("antd");
var _redirectOnModalClose = _interopRequireDefault(require("../helpers/redirectOnModalClose"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function Step5(_ref) {
  let {
    properties,
    dataHook: [, setState]
  } = _ref;
  const {
    onCompleteEvent = 'CRP.COMPLETE'
  } = properties;
  (0, _react.useEffect)(() => {
    setTimeout(() => {
      (0, _redirectOnModalClose.default)(setState, onCompleteEvent)('Order was successfully submitted.');
    }, 7000);
  }, []);
  return /*#__PURE__*/_react.default.createElement(_antd.Spin, {
    tip: "Loading...",
    size: "large"
  });
}
module.exports = exports.default;