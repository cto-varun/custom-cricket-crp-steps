"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _DataRow = _interopRequireDefault(require("./DataRow"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const PlanListDetail = _ref => {
  let {
    data = [],
    dueDate,
    detailedCharges
  } = _ref;
  const mapDetails = data?.map((item, index) => {
    const chargesIndex = detailedCharges.findIndex(detailedCharge => detailedCharge?.ctn === item.telephoneData.telephoneNumber || detailedCharge?.imei === item.telephoneData.imei || detailedCharge?.lineIdentifier?.slice(5) === `${item.key}` && item.activityType === 'ADDLINE');
    if (chargesIndex === -1) return false;
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "plan-detail-list-item-wrapper",
      key: index
    }, /*#__PURE__*/_react.default.createElement(_DataRow.default, {
      data: item,
      dueDate: dueDate,
      detailedCharges: detailedCharges[chargesIndex]
    }));
  }).filter(detail => detail);
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, mapDetails.length ? /*#__PURE__*/_react.default.createElement("div", {
    className: "plan-detail-list-container"
  }, mapDetails) : /*#__PURE__*/_react.default.createElement("div", {
    className: "plan-list-detail__null-view"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "plan-list-detail__null-view--container"
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: "plan-list-detail__null-view--error"
  }, "Error"), /*#__PURE__*/_react.default.createElement("span", null, "We're having trouble displaying this information."))));
};
var _default = PlanListDetail;
exports.default = _default;
module.exports = exports.default;