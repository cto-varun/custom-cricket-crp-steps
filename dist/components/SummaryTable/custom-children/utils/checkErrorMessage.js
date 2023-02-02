"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _tabletInformation = _interopRequireDefault(require("../../../utils/tabletInformation"));
var _ErrorModal = _interopRequireDefault(require("../../../Modal/ErrorModal"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const errorHandlerCode = validations => {
  const warningErrors = [];
  const codesNotAllowed = _tabletInformation.default?.warningsCodeNotAllow;
  const notNullWarnings = validations.filter(validation => validation?.warnings !== null);
  notNullWarnings.forEach(notNullWarning => {
    notNullWarning?.warnings.forEach(warn => {
      const warningCode = warn?.warningCode;
      if (codesNotAllowed.includes(parseInt(warningCode))) warningErrors.push(warn);
    });
  });
  const returningValue = warningErrors.length > 0;
  return [returningValue, warningErrors, _ErrorModal.default];
};
var _default = errorHandlerCode;
exports.default = _default;
module.exports = exports.default;