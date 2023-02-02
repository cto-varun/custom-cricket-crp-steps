"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _antd = require("antd");
require("./content2Lines.css");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
class Lines {
  constructor(data) {
    this.ctn = data.ctn;
    this.value = data.value;
    this.model = data.model;
    this.imei = data.imei;
  }
}
const ContentTwoLines = _ref => {
  let {
    variables
  } = _ref;
  const {
    title,
    ctn,
    state,
    linesSelected,
    setLinesSelected,
    setLinesChange
  } = variables;
  const [valueDatas, setValueDatas] = (0, _react.useState)([]);
  const [linesData, setLinesData] = (0, _react.useState)({});
  const datas = {};
  const onChange = e => {
    const selection = linesSelected;
    const ctnAccount = e.target.value;
    if (selection.includes(ctnAccount)) {
      const index = selection.indexOf(ctnAccount);
      if (index > -1) {
        selection.splice(index, 1);
      }
    } else {
      selection.push(ctnAccount);
    }
    setLinesSelected(selection);
    setLinesChange(true);
  };
  (0, _react.useEffect)(() => {
    const lineDetails = state?.lineDetails;
    lineDetails.forEach(element => {
      const included = ctn.includes(element.telephoneNumber);
      if (!datas[element.telephoneNumber] && included) {
        const data = {
          ctn: element?.telephoneNumber,
          value: false,
          imei: element?.imei,
          model: element?.currentDevice?.model
        };
        datas[element.telephoneNumber] = new Lines(data);
      }
    });
    setValueDatas(Object.keys(datas));
    setLinesData(datas);
  }, []);
  const lines = valueDatas.map(element => /*#__PURE__*/_react.default.createElement(_antd.Checkbox, {
    value: element,
    className: "checkboxes",
    disabled: linesData[element]?.value,
    onChange: onChange
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "checkbox-lines"
  }, /*#__PURE__*/_react.default.createElement("div", null, linesData[element].ctn), /*#__PURE__*/_react.default.createElement("div", null, linesData[element].model))));
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("section", null, /*#__PURE__*/_react.default.createElement("p", null, title)), /*#__PURE__*/_react.default.createElement("section", null, /*#__PURE__*/_react.default.createElement("div", {
    className: "lines-popup"
  }, lines)));
};
var _default = ContentTwoLines;
exports.default = _default;
module.exports = exports.default;