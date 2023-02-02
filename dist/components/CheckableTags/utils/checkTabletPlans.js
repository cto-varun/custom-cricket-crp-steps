"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _tabletInformation = _interopRequireDefault(require("../../utils/tabletInformation"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const checkTabletPlans = state => {
  const plansElegible = _tabletInformation.default?.plansWithTabletPlan;
  const tabletPlanTag = _tabletInformation.default?.tabletPlanTag?.name;
  const tabletPlansAllow = 4;
  let tabletPlansSelected = 0;
  let unlPlansSelected = 0;
  // const rowSelected = state?.uiData?.selected?.tableRows;
  const tableData = state?.tableData?.finalData;
  tableData.forEach(element => {
    const isActiveLine = element?.telephoneData?.ptnStatus === 'A' || element?.activityType === 'ADDLINE' || element?.activityType === 'ACTIVATION';
    if (isActiveLine) {
      let plan = element?.plan?.newPlan?.pricePlanSocCode;
      if (!plan) plan = element?.plan?.currentPlan?.pricePlanSocCode;
      const includedOnPlans = plansElegible.includes(plan);
      if (includedOnPlans) {
        unlPlansSelected = unlPlansSelected + 1;
      } else if (plan === tabletPlanTag) {
        tabletPlansSelected = tabletPlansSelected + 1;
      }
    }
  });
  const tabletRemaining = unlPlansSelected - tabletPlansSelected;
  if (tabletRemaining > tabletPlansAllow) return tabletPlansAllow;
  return tabletRemaining;
};
var _default = checkTabletPlans;
exports.default = _default;
module.exports = exports.default;