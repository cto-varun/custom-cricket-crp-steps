import tabletInformation from '../../utils/tabletInformation';

const checkTabletPlans = (state) => {
  const plansElegible = tabletInformation?.plansWithTabletPlan;
  const tabletPlanTag = tabletInformation?.tabletPlanTag?.name;
  const tabletPlansAllow = 4;
  let tabletPlansSelected = 0
  let unlPlansSelected = 0
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
}

export default checkTabletPlans;
