"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _antd = require("antd");
var _Question = _interopRequireDefault(require("../../Icons/Question"));
require("./UndoSelectionModal.css");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const delayedClose = (setState, dms) => {
  setState(s => ({
    ...s,
    stepControllerFeedback: {
      ...s.stepControllerFeedback,
      modal: {
        ...s.stepControllerFeedback.modal,
        display: false
      }
    }
  }));
  setTimeout(() => {
    setState(s => ({
      ...s,
      stepControllerFeedback: {
        ...s.stepControllerFeedback,
        modal: dms
      }
    }));
  }, 500);
};
const UndoSelectionModal = _ref => {
  let {
    dataHook,
    removeFunction,
    defaultModalState
  } = _ref;
  const [, setState] = dataHook;
  const close = () => delayedClose(setState, defaultModalState);
  const onYesClick = () => {
    removeFunction();
    close();
  };
  const onNoClick = () => close();
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "undo-selection__wrapper"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "undo-selection__icon-wrapper"
  }, /*#__PURE__*/_react.default.createElement(_Question.default, null)), /*#__PURE__*/_react.default.createElement("div", {
    className: "undo-selection__dialog-buttons"
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: "undo-selection__dialog-text"
  }, "Do you want to unselect current selection?"), /*#__PURE__*/_react.default.createElement("div", {
    className: "undo-selection__buttons"
  }, /*#__PURE__*/_react.default.createElement(_antd.Button, {
    className: "undo-selection__buttons--yes",
    onClick: onYesClick
  }, "Yes"), /*#__PURE__*/_react.default.createElement(_antd.Button, {
    className: "undo-selection__buttons--no",
    onClick: onNoClick
  }, "No"))));
};
var _default = UndoSelectionModal;
exports.default = _default;
module.exports = exports.default;