"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const ExpandedRow = _ref => {
  let {
    telephoneData,
    activityType,
    lineDetailMemos,
    userMessages
  } = _ref;
  const showChangeCount = activityType === 'CHANGESERVICES';
  const suspendedAccount = telephoneData?.ptnStatus === 'S';
  const hotlineSuspended = telephoneData?.statusActvCode === 'SUS' && telephoneData?.statusActvRsnCode === 'CO';
  const isNotLostStolen = telephoneData?.ptnStatus === 'S' && telephoneData?.statusReasonCode !== 'TO' && telephoneData?.statusReasonCode !== 'ST' && telephoneData?.statusReasonCode !== 'CO';
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, showChangeCount && /*#__PURE__*/_react.default.createElement("div", {
    className: "crpLineLevelNote"
  }, /*#__PURE__*/_react.default.createElement("span", {
    style: {
      fontSize: '12px'
    }
  }, "Note: Change Plan activity allowed 5 time(s) per bill cycle. User allowed ", 5 - telephoneData?.ppChangeCount, ' ', "more time(s) this bill cycle.")), telephoneData.promoRestriction && /*#__PURE__*/_react.default.createElement("div", {
    className: "crpLineLevelNote"
  }, /*#__PURE__*/_react.default.createElement("span", {
    style: {
      fontSize: '12px',
      color: 'red'
    }
  }, userMessages.find(row => row.name == 'changeRatePlanPromoRestriction')?.message || "This subscriber is in a restricted promo period.")), suspendedAccount && /*#__PURE__*/_react.default.createElement("div", {
    className: "crpLineLevelNote"
  }, /*#__PURE__*/_react.default.createElement("span", {
    style: {
      fontSize: '12px'
    }
  }, lineDetailMemos.suspendedAccount)), isNotLostStolen && /*#__PURE__*/_react.default.createElement("div", {
    className: "crpLineLevelNote"
  }, /*#__PURE__*/_react.default.createElement("span", {
    style: {
      fontSize: '12px'
    }
  }, lineDetailMemos.isNotLostStolen)), hotlineSuspended && /*#__PURE__*/_react.default.createElement("div", {
    className: "crpLineLevelNote"
  }, /*#__PURE__*/_react.default.createElement("span", {
    style: {
      fontSize: '12px'
    }
  }, lineDetailMemos.hotlineSuspended)));
};
var _default = ExpandedRow;
exports.default = _default;
module.exports = exports.default;