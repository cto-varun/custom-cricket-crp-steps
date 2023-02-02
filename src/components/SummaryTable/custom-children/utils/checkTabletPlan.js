import tabletInformation from '../../../utils/tabletInformation';

const checkTabletPlanToCancel = (
  tableData,
  validations,
  selectedRows,
  showPopup,
  lineDetails
  ) => {
  let changeShowPopup = showPopup;
  const SOC_CODE = tabletInformation?.tabletPlanTag?.name;
  const codesAllow = tabletInformation?.warningsCodeAllow;
  const validatingLines = [];
  const selectedCtnRows = [];
  tableData.forEach((element, index) => {
    const includedOnRow = selectedRows.includes(index);
    if (includedOnRow) selectedCtnRows.push(element?.telephoneData?.telephoneNumber);
  })
  validations.forEach(element => {
    const warn = element.warnings
    if (warn !== null) {
      warn.forEach(description => {
        let warningCode = description?.warningCode;
        warningCode = parseInt(warningCode);
        const includes = codesAllow.includes(warningCode);
        if (includes) validatingLines.push(element);
      })
    }
  });

  const linesWithFutureDateActivity = lineDetails
    .filter(element => element?.futureActivityIndicator !== true && element?.currentRatePlan?.[0]?.soc === SOC_CODE)
    .map(element => element?.telephoneNumber);

  const tabletPlans = tableData.filter(element => element?.plan?.currentPlan?.pricePlanSocCode === SOC_CODE && linesWithFutureDateActivity.indexOf(element?.telephoneData?.telephoneNumber) !== -1);

  const ctnRelated = [];
  if (validatingLines.length > 0) {
    tabletPlans.forEach(element => {
      const tabletCtn = element?.telephoneData?.telephoneNumber;
      ctnRelated.push(tabletCtn);
    })
  }

  changeShowPopup = ctnRelated.length === validatingLines.length && changeShowPopup ? !changeShowPopup : changeShowPopup;

  return [
    ctnRelated,
    validatingLines,
    selectedCtnRows,
    changeShowPopup
  ]
}

export default checkTabletPlanToCancel;
