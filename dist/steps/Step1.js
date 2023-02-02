"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _useAsyncFunctions = _interopRequireDefault(require("../hooks/useAsyncFunctions"));
var _FeaturesTab = _interopRequireDefault(require("../components/FeaturesTab"));
var _CRPTable = _interopRequireDefault(require("../components/MainTable/CRPTable"));
var _SummaryTable = _interopRequireDefault(require("../components/SummaryTable"));
var _Toggles = _interopRequireDefault(require("../components/SummaryTable/custom-children/Toggles"));
var _DueForm = _interopRequireDefault(require("../components/SummaryTable/custom-children/DueForm"));
var _Spinner = _interopRequireDefault(require("../components/Spinner"));
var _stepController = _interopRequireDefault(require("../helpers/stepController"));
var _processSummary = _interopRequireDefault(require("../helpers/processSummary"));
var _helpers = require("../helpers/helpers");
var _reactRouterDom = require("react-router-dom");
require("./step1.css");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const getCompatibilityProperty = compatibilityInfo => function () {
  let imei = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  let subscriberNumber = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  let properties = arguments.length > 2 ? arguments[2] : undefined;
  const compatibilityForCurrentImeiOrSubscriber = compatibilityInfo.find(compat => compat.imei === imei || compat.subscriberNumber === subscriberNumber) || {};
  return properties.reduce((acc, property) => {
    acc[property] = compatibilityForCurrentImeiOrSubscriber[property];
    return acc;
  }, {});
};
const checkRadioSelectionEligibility = (tableData, compatibilityInfo, currentAddOnsWithInsurance, selectedRows, insuranceAddOnMessage, setInsuranceMessage) => {
  const linesWithChanges = tableData.filter(function () {
    let line = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return Object.keys(line?.plan?.newPlan || {}).length;
  });
  const getPropertyFromCompatibility = getCompatibilityProperty(compatibilityInfo);
  const isNewLineAdded = tableData.some(line => line.activityType === 'ADDLINE');
  const lineValues = linesWithChanges.map(function () {
    let line = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return {
      activityType: line.activityType,
      ...getPropertyFromCompatibility(line?.telephoneData?.imei, line?.telephoneData?.subscriberNumber, ['allowCurrentDatedPlanChange', 'allowFutureDatedPlanChange'])
    };
  });
  const enableCurrentRadio = lineValues.every(_ref => {
    let {
      allowCurrentDatedPlanChange = true
    } = _ref;
    return allowCurrentDatedPlanChange;
  });
  const enableFutureRadio = lineValues.every(_ref2 => {
    let {
      allowFutureDatedPlanChange = true
    } = _ref2;
    return allowFutureDatedPlanChange;
  });

  // Check if any addOn has insurance true in the addOnResponse from API. Then disable future radio button.
  const anyInsuranceAddOnAdded = tableData.some(function () {
    let line = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    // get addOn if newly added. Can be extracted from line.changes (array)
    let insuranceAddOnPresent = false;
    // check if there is any change and also check if that line is also selected by rep.
    if (line?.changes && line?.changes?.length > 0 && selectedRows?.includes(line?.key)) {
      // if any socCode matches with currentAddOnsWithInsurance then set insuranceAddOnPresent as true and break the loop;
      line?.changes?.forEach(change => {
        const socCode = Object.keys(change)[0];
        if (currentAddOnsWithInsurance?.includes(socCode)) {
          insuranceAddOnPresent = true;
          return true;
        }
      });
    }
    if (insuranceAddOnPresent) setInsuranceMessage(insuranceAddOnMessage);else setInsuranceMessage(null);
    return insuranceAddOnPresent;
  });
  return {
    enableCurrentRadio,
    enableFutureRadio: enableFutureRadio && !isNewLineAdded && !anyInsuranceAddOnAdded
  };
};
const Step1 = props => {
  const {
    dataHook,
    data,
    properties,
    datasources
  } = props;
  const {
    lineDetailMemos,
    insuranceAddOnMessage
  } = properties;
  const [state, setState] = dataHook;
  const {
    accountBalances
  } = state;
  const location = (0, _reactRouterDom.useLocation)();
  const {
    accountBalance = 0
  } = accountBalances;
  const compatibilityHook = (0, _react.useState)('');
  const [addLineTentativeBanTableData, setAddLineTentativeBanTableData] = (0, _react.useState)([]);
  const {
    status,
    message,
    processedData: {
      table
    },
    loadedData
  } = (0, _useAsyncFunctions.default)(properties, {
    dataHook,
    compatibilityHook,
    data
  });
  const {
    accountDetails = {},
    ebbBenefit,
    customerInfo = {}
  } = data?.data;
  const {
    ebbQualifiedPlans = []
  } = data?.data?.ebbQualifiedPlans;
  const {
    technicalSocs = []
  } = data?.data?.technicalSocs;
  const {
    MRCsocs = []
  } = data?.data?.MRCsocs;
  const {
    userMessages = []
  } = data?.data?.userMessages;
  const {
    subscribers = []
  } = data?.data?.subscribers;
  const {
    profiles = []
  } = data?.data?.profiles;
  const [rowToDeselect, setRowToDeselect] = (0, _react.useState)([]);
  const [resetTableRowByTablet, setResetTableRowByTablet] = (0, _react.useState)(false);
  const {
    statusActvRsnCode = '',
    statusActvCode = ''
  } = accountDetails;
  const [insuranceMessage, setInsuranceMessage] = (0, _react.useState)(null);
  const [resetTableOnClickPlanTag, setResetTableOnClickPlanTag] = (0, _react.useState)(false);
  const [maxAddTableCount, setMaxAddTableCount] = (0, _react.useState)(0);
  const [isTabletPlanFailed, setIsTabletPlanFailed] = (0, _react.useState)(false);
  let {
    profile
  } = window[window.sessionStorage?.tabId].COM_IVOYANT_VARS;
  const allowEditTechnicalSocs = profiles?.find(_ref3 => {
    let {
      name
    } = _ref3;
    return name === profile;
  })?.categories?.find(_ref4 => {
    let {
      name
    } = _ref4;
    return name === 'addRemoveTechnicalSocs';
  })?.enable;
  const summary = (0, _processSummary.default)(state);
  const {
    current,
    uiData: {
      selected: {
        tableRows
      }
    },
    tableData: {
      finalData
    }
  } = state;
  const [enableEffectiveRadio, setEnableEffectiveRadio] = (0, _react.useState)({
    enableCurrentRadio: true,
    enableFutureRadio: true
  });
  const {
    enableCurrentRadio,
    enableFutureRadio
  } = enableEffectiveRadio;
  const selectedRows = tableRows;
  const displayFeaturesTab = tableRows.length > 0;
  (0, _react.useEffect)(() => {
    setState(s => ({
      ...s,
      creditAmount: accountBalance < 0 ? -1 * accountBalance : 0
    }));
  }, []);
  const currentAddOnsWithInsurance = state?.getplansandaddonsResponse?.addOns?.currentAddOns // extracting addOns from the api result which has insurance true
  ?.filter(function () {
    let addOn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return addOn?.insurance;
  })?.map(addOn => addOn?.socCode) || []; // setting it to empty array in case of undefined

  (0, _react.useEffect)(() => {
    setEnableEffectiveRadio(checkRadioSelectionEligibility(finalData, state?.getplansandaddonsResponse?.compatibility?.compatibilityInfo || [], currentAddOnsWithInsurance, selectedRows, insuranceAddOnMessage, setInsuranceMessage));
  }, [finalData]);
  (0, _react.useEffect)(() => {
    if (location?.state?.addLineTentativeBan) {
      const plansAddonsAsyncMachine = window[window.sessionStorage?.tabId].sendgetPlansAndAddonsAsyncMachine;
      if (plansAddonsAsyncMachine) {
        plansAddonsAsyncMachine('RESET');
        plansAddonsAsyncMachine('SET.REQUEST.DATA', {
          value: location?.state?.requestBody
        });
        plansAddonsAsyncMachine('REFETCH');
      }
      if (addLineTentativeBanTableData.length === 0) {
        const tentativeBanTableData = [];
        tentativeBanTableData.push(location?.state?.newLine);
        setAddLineTentativeBanTableData(tentativeBanTableData);
      }
    }
  }, []);
  const onNextClick = () => (0, _stepController.default)('next', current, [state, setState], {
    stateFunction: s => {
      return {
        ...s,
        current: s.current + 1,
        loadedData,
        savedData: {
          ...s.savedData,
          step1: {
            table
          }
        }
      };
    }
  });
  if (status === 'loading') {
    return /*#__PURE__*/_react.default.createElement(_Spinner.default, {
      className: "step-1__wrapper--loading",
      tip: "Loading step..."
    });
  }
  if (status === 'error') {
    global.console.error({
      crpError: message
    });
    return null;
  }
  if (status === 'render') {
    const tabs = table?.tabs;
    const checkTabSelectionCompatibility = table?.checkTabSelectionCompatibility;
    const planMetadata = {
      plans: {},
      addons: {},
      deals: {},
      expiredSocs: []
    };
    const transformToPlanMeta = plansAndAddons => {
      const {
        currentPlans,
        expiredPlans
      } = plansAndAddons.plans;
      const {
        currentAddOns,
        expiredAddOns
      } = plansAndAddons.addOns;
      const {
        dealSummary = []
      } = plansAndAddons.deals;
      currentPlans.forEach(cp => {
        planMetadata.plans[cp.socCode] = cp;
      });
      expiredPlans.forEach(cp => {
        planMetadata.plans[cp.socCode] = cp;
        planMetadata.expiredSocs.push(cp.socCode);
      });
      currentAddOns.forEach(addon => {
        planMetadata.addons[addon.socCode] = addon;
      });
      expiredAddOns.forEach(addon => {
        planMetadata.addons[addon.socCode] = addon;
        planMetadata.expiredSocs.push(addon.socCode);
      });
      dealSummary.forEach(deal => {
        planMetadata.deals[deal.dealCode] = deal;
      });
    };
    const transform2TableData = (plansAndAddons, subscriberInfo) => {
      const tabInfo = [];
      const lineIndex = {};
      // the canceled line is include here to handle duplicate ranking issue by providing it to the priceOrder and createOrder payload
      subscriberInfo.filter(s => s.ptnStatus === 'A' || s.ptnStatus === 'S' || s.ptnStatus === 'C').forEach((s, i) => {
        const subscriber = subscribers.find(item => item?.subscriberDetails?.phoneNumber === s.telephoneNumber);
        lineIndex[s.subscriberNumber] = i;
        tabInfo[i] = {
          key: i,
          rank: 0,
          activityType: 'CHANGESERVICES',
          telephoneData: {
            telephoneNumber: s?.telephoneNumber,
            subscriberNumber: s?.subscriberNumber,
            activationDate: s?.initActivationDate,
            imei: s?.currentDevice?.imei,
            phoneModel: s?.currentDevice?.model,
            sim: s?.currentDevice?.sim,
            ptnStatus: s.ptnStatus,
            accountType: s?.currentDevice?.accountType,
            accountSubType: s?.currentDevice?.accountSubType,
            statusReasonCode: subscriber?.subscriberDetails?.statusReasonCode,
            statusActvCode,
            statusActvRsnCode
          },
          plan: {},
          addOns: [],
          technicalSocs: [],
          changes: [],
          discounts: 0,
          subTotal: 0,
          operations: {
            newLine: false,
            showIcons: false
          }
        };
      });
      plansAndAddons.compatibility.compatibilityInfo.forEach(s => {
        const tabInfoForSub = tabInfo[lineIndex[s.subscriberNumber]];
        const currentSubscriberInfo = s.subscriberInfo || {};
        if (tabInfoForSub !== undefined) {
          const currentRatePlan = currentSubscriberInfo.currentRatePlan || {};
          const currentPricePlanSoc = currentRatePlan.pricePlanSocCode || '';
          let planSocMeta = {};
          if (planMetadata.plans[currentPricePlanSoc]) {
            planSocMeta = planMetadata.plans[currentPricePlanSoc];
          }
          tabInfoForSub.rank = s.rank;
          tabInfoForSub.telephoneData.ppChangeCount = s.ppChangeCount ? s.ppChangeCount : 0;
          tabInfoForSub.telephoneData.promoRestriction = s.promoRestriction;
          tabInfoForSub.plan = {
            currentPlan: currentRatePlan,
            newPlan: {}
          };
          const currentRatePlanFeatures = plansAndAddons?.plans?.currentPlans?.find(plan => plan?.socCode === currentPricePlanSoc)?.features?.map(feature => plansAndAddons?.features?.find(feat => feat?.featureCode === feature)) || [];
          tabInfoForSub.telephoneData.features = currentRatePlanFeatures;
          tabInfoForSub.plan.currentPlan = {
            ...tabInfoForSub.plan.currentPlan,
            longDescription: '',
            shortDescription: ''
          };
          tabInfoForSub.plan.currentPlan.longDescription = (planSocMeta || {}).longDescription;
          tabInfoForSub.plan.currentPlan.shortDescription = (planSocMeta || {}).shortDescription;
          tabInfoForSub.discounts = currentRatePlan.discountAmount;
          tabInfoForSub.operations.disableSelection = !s.allowPricePlanChange || false;
          tabInfoForSub.addOns = tabInfoForSub?.addOns?.filter(a => a !== undefined);
          tabInfoForSub.technicalSocs = tabInfoForSub?.technicalSocs?.filter(a => a !== undefined);
        }

        // map Addons
        (currentSubscriberInfo.currentAddOns || []).forEach((currentAddon, i) => {
          const addonSocMeta = planMetadata.addons[currentAddon?.addOnCode] || {};
          if (!addonSocMeta.technical) {
            ((tabInfoForSub || {}).addOns || [])[i] = {
              socCode: currentAddon?.addOnCode,
              longDescription: addonSocMeta?.longDescription || '',
              shortDescription: addonSocMeta?.shortDescription || '',
              price: addonSocMeta?.price || currentAddon?.price || 0,
              addOnType: currentAddon?.addOnType,
              quantity: currentAddon?.quantity,
              changes: {}
            };
          } else {
            const technicalSocMetadata = technicalSocs.find(soc => soc?.name === currentAddon?.addOnCode);
            if (technicalSocMetadata !== undefined || !technicalSocMetadata?.view) {
              ((tabInfoForSub || {}).technicalSocs || [])[i] = {
                socCode: currentAddon?.addOnCode,
                longDescription: addonSocMeta?.longDescription || '',
                shortDescription: addonSocMeta?.shortDescription || '',
                price: addonSocMeta?.price || currentAddon?.price || 0,
                addOnType: currentAddon?.addOnType,
                quantity: currentAddon?.quantity,
                changes: {}
              };
            }
          }
        });
        if (tabInfoForSub) {
          tabInfoForSub.addOns = tabInfoForSub?.addOns?.filter(a => a !== undefined);
          tabInfoForSub.technicalSocs = tabInfoForSub?.technicalSocs?.filter(a => a?.socCode);
        }
      });
      const filteredTabInfo = tabInfo.filter(tabInfoObj => {
        return plansAndAddons?.compatibility?.compatibilityInfo.find(ci => ci.ctn === tabInfoObj.telephoneData.telephoneNumber);
      }).map((obj, i) => {
        return {
          ...obj,
          key: i
        };
      });
      return filteredTabInfo;
    };
    const getCompatibility = (plansAndAddons, tabInfo, selectedIdx) => {
      const selectedSubs = {};
      let plansAvailable = [];
      let addonsAvailable = [];
      const panelInfo = {
        panelTitles: ['Plans', 'Add-Ons', 'Technical Socs', 'Deals'],
        plans: {
          current: [],
          expired: []
        },
        addOns: {
          current: [],
          expired: []
        },
        technicalSocs: {
          current: [],
          expired: []
        },
        deals: {
          current: [],
          expired: []
        }
      };
      tabInfo.forEach(tabInfoForSub => {
        if (selectedIdx.includes(tabInfoForSub.key)) {
          selectedSubs[tabInfoForSub.telephoneData.subscriberNumber || tabInfoForSub.telephoneData.imei] = tabInfoForSub;
        }
      });
      let lineNumber = 0;
      let hasSuspendedLines = false;
      let hasNewLineWithNoPlan = false;
      plansAndAddons.compatibility.compatibilityInfo.forEach(sub => {
        const subNumber = sub.subscriberNumber || sub.imei;
        if (selectedSubs[subNumber] !== undefined) {
          lineNumber += 1;
          const selectedSubscriber = selectedSubs[subNumber];
          const selectedPlan = selectedSubscriber?.plan?.newPlan?.pricePlanSocCode || selectedSubscriber?.plan?.currentPlan?.pricePlanSocCode;
          if (selectedSubs[subNumber].activityType === 'ADDLINE' && selectedPlan === undefined) {
            hasNewLineWithNoPlan = true;
          }
          const nextLinePlans = [];
          let plans = Object.keys(sub.plans);

          //  For Suspended accounts - show only lower value plans.
          if (selectedSubs[subNumber].telephoneData.ptnStatus === 'S') {
            hasSuspendedLines = true;
            plans = plans.filter(planCode => planMetadata.plans[planCode].price <= selectedSubs[subNumber].plan.currentPlan.price);
          }
          plans.forEach(planCode => {
            if (lineNumber === 1) {
              plansAvailable.push(planCode);
            } else {
              nextLinePlans.push(planCode);
            }
            if (selectedPlan === undefined && selectedSubs[subNumber].activityType === 'ADDLINE' || selectedPlan === planCode) {
              if (addonsAvailable.length === 0) {
                addonsAvailable = addonsAvailable.concat(sub.plans[planCode].addOns);
              } else {
                const newAddonsIntersection = addonsAvailable.filter(a => sub.plans[planCode].addOns.includes(a));
                addonsAvailable = newAddonsIntersection;
              }
            }
          });
          if (lineNumber > 1) {
            const newPlanIntersection = plansAvailable.filter(p => nextLinePlans.includes(p));
            plansAvailable = newPlanIntersection;
          }
          const idxOfPlan = plansAvailable.indexOf(selectedPlan);
          if (idxOfPlan >= 0) {
            plansAvailable.splice(idxOfPlan, 1);
          }
        }
      });
      plansAvailable.forEach(planCode => {
        const socMetaData = planMetadata.plans[planCode];
        if (socMetaData !== undefined) {
          (planMetadata.expiredSocs.includes(planCode) ? panelInfo.plans.expired : panelInfo.plans.current).push({
            value: socMetaData.socCode,
            label: socMetaData.socCode,
            meta: {
              socCode: socMetaData.socCode,
              longDescription: socMetaData.longDescription,
              shortDescription: socMetaData.shortDescription,
              price: socMetaData.price,
              tablet: socMetaData.tablet ?? false
            }
          });
        }
      });

      //  Addons will be sent only if suspended line is not present
      if (!hasSuspendedLines && !hasNewLineWithNoPlan) {
        // Addon logic for multiline
        let selectedLinesAddOns = [];
        let selectedSubKeys = Object.keys(selectedSubs);
        selectedSubKeys.forEach(key => {
          selectedLinesAddOns = selectedLinesAddOns.concat(selectedSubs[key].addOns.map(addOn => addOn?.socCode));
        });
        // de-dupe
        // selectedLinesAddOns = [...new Set(selectedLinesAddOns)];
        let multiLine = selectedSubKeys.length > 1;
        addonsAvailable.forEach(addonCode => {
          const socMetaData = planMetadata.addons[addonCode];

          // do not show MRC socs (example: PROTECTON, PROTECTPL, if they already exist. Only 1 per line allowed
          let hasMRCsoc = false;
          selectedSubKeys.forEach(key => {
            if (selectedSubs[key].addOns.find(addOn => addOn?.socCode === socMetaData?.socCode && (0, _helpers.isMRC)(socMetaData?.socCode, MRCsocs))) {
              hasMRCsoc = true;
            }
          });
          let showAddOnForMultiLine = true;
          if (multiLine) {
            let allLinesHaveAddOn = true;
            selectedSubKeys.forEach(key => {
              if (!selectedSubs[key].addOns.find(addOn => addOn?.socCode === socMetaData?.socCode)) {
                allLinesHaveAddOn = false;
              }
            });
            if (allLinesHaveAddOn) {
              showAddOnForMultiLine = false;
            }
          }
          if (socMetaData !== undefined && showAddOnForMultiLine && !hasMRCsoc) {
            // Technical SOCs have the property "technical == true", - do not show them in regular add-ons list
            if (!socMetaData.technical) {
              (planMetadata.expiredSocs.includes(addonCode) ? panelInfo.addOns.expired : panelInfo.addOns.current).push({
                value: socMetaData.socCode,
                label: socMetaData.socCode,
                meta: {
                  socCode: socMetaData.socCode,
                  longDescription: socMetaData.longDescription,
                  shortDescription: socMetaData.shortDescription,
                  price: socMetaData.price,
                  addOnType: socMetaData.addOnType
                }
              });
            } else {
              const technicalSocMetadata = technicalSocs.find(soc => soc?.name === addonCode);
              if (technicalSocMetadata !== undefined || !technicalSocMetadata?.view) {
                (planMetadata.expiredSocs.includes(addonCode) ? panelInfo.technicalSocs.expired : panelInfo.technicalSocs.current).push({
                  value: socMetaData.socCode,
                  label: socMetaData.socCode,
                  meta: {
                    socCode: socMetaData.socCode,
                    longDescription: socMetaData.longDescription,
                    shortDescription: socMetaData.shortDescription,
                    price: socMetaData.price,
                    addOnType: socMetaData.addOnType
                  },
                  technical: socMetaData.technical
                });
              }
            }
          }
        });
      }
      if (plansAndAddons.deals.dealSummary !== undefined) {
        plansAndAddons.deals.dealSummary.forEach(deal => {
          if (deal.dealDetails.length === selectedIdx.length) {
            //  number of lines selected should be the number of lines in the deal
            //  Get all the plan codes - usually it is uniform plan across all lines
            const uniquePricePlansForDeal = deal.dealDetails.map(dealDetail => dealDetail.newPlanCode).filter((value, index, self) => self.indexOf(value) === index);
            let foundUnmatchedDeal = false;
            plansAndAddons.compatibility.compatibilityInfo.forEach(sub => {
              const subNumber = sub.subscriberNumber || sub.imei;
              if (selectedSubs[subNumber] !== undefined) {
                const unmatchedDealPricePlan = uniquePricePlansForDeal.find(dealPricePlan => sub.plans[dealPricePlan] === undefined);
                if (unmatchedDealPricePlan !== undefined) {
                  foundUnmatchedDeal = true;
                }
              }
            });
            if (!foundUnmatchedDeal) {
              panelInfo.deals.current.push({
                value: deal.dealCode,
                label: deal.dealCode,
                meta: deal
              });
            }
          }
        });
      }
      return panelInfo;
    };
    let initialTableData = [];
    if (state.getplansandaddonsResponse) {
      transformToPlanMeta(state.getplansandaddonsResponse);
      initialTableData = transform2TableData(state.getplansandaddonsResponse, state.lineDetails);
    }
    let finalTabs = tabs;
    if (selectedRows.length > 0 && state.tableData.finalData.length > 0 && state.getplansandaddonsResponse) {
      finalTabs = getCompatibility(state.getplansandaddonsResponse, state.tableData.finalData, selectedRows);
    }
    const hasAtLeastOneFeatureChange = state.tableData.finalData.some(line => line.changes.length > 0);
    const hasAtLeastOnePlanChange = state.tableData.finalData.some(line => Object.keys(line.plan?.newPlan || {}).length > 0);
    if (state.uiData.lastAction === 'back/1') {
      initialTableData = state.tableData.initialTableData;
    }
    if (initialTableData.length === 0 && addLineTentativeBanTableData.length > 0) {
      initialTableData = addLineTentativeBanTableData;
    }
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "step-1__wrapper"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "step-1__wrapper--tab-table"
    }, displayFeaturesTab ? /*#__PURE__*/_react.default.createElement(_FeaturesTab.default, _extends({}, props, {
      className: "step-1__wrapper--tab",
      tabs: finalTabs,
      dataHook: dataHook,
      checkTabSelectionCompatibility: checkTabSelectionCompatibility,
      ebbQualifiedPlans: ebbQualifiedPlans,
      userMessages: userMessages,
      profiles: profiles,
      ebbBenefit: ebbBenefit,
      properties: properties,
      datasources: datasources,
      allowEditTechnicalSocs: allowEditTechnicalSocs,
      changePlanHeaderMessage: data?.data?.changePlanHeaderMessage,
      acpCohorts: data?.data?.acpCohorts,
      technicalSocsMetadata: technicalSocs,
      setResetTableOnClickPlanTag: setResetTableOnClickPlanTag,
      maxAddTableCount: maxAddTableCount,
      setMaxAddTableCount: setMaxAddTableCount,
      rowToDeselect: rowToDeselect,
      setRowToDeselect: setRowToDeselect,
      setResetTableRowByTablet: setResetTableRowByTablet
    })) : null, /*#__PURE__*/_react.default.createElement(_CRPTable.default, _extends({}, props, {
      properties: properties,
      datasources: datasources,
      className: "step-1__wrapper--table",
      dataHook: dataHook,
      initialTableData: initialTableData,
      lineDetailMemos: lineDetailMemos,
      ebbQualifiedPlans: ebbQualifiedPlans,
      MRCsocs: MRCsocs,
      customerInfo: customerInfo,
      allowEditTechnicalSocs: allowEditTechnicalSocs,
      userMessages: userMessages,
      technicalSocsMetadata: technicalSocs,
      resetTableOnClickPlanTag: resetTableOnClickPlanTag,
      setResetTableOnClickPlanTag: setResetTableOnClickPlanTag,
      setMaxAddTableCount: setMaxAddTableCount,
      isTabletPlanFailed: isTabletPlanFailed,
      setIsTabletPlanFailed: setIsTabletPlanFailed,
      checkRadioSelectionEligibility: checkRadioSelectionEligibility,
      setEnableEffectiveRadio: setEnableEffectiveRadio,
      currentAddOnsWithInsurance: currentAddOnsWithInsurance,
      insuranceAddOnMessage: insuranceAddOnMessage,
      setInsuranceMessage: setInsuranceMessage,
      rowToDeselect: rowToDeselect,
      setRowToDeselect: setRowToDeselect,
      resetTableRowByTablet: resetTableRowByTablet,
      setResetTableRowByTablet: setResetTableRowByTablet
    }))), /*#__PURE__*/_react.default.createElement(_SummaryTable.default, {
      className: "step-1__summary"
    }, /*#__PURE__*/_react.default.createElement(_SummaryTable.default.Title, {
      text: "Summary"
    }), /*#__PURE__*/_react.default.createElement(_SummaryTable.default.Subtitle, {
      text: "Current Total",
      style: {
        marginTop: '8px'
      }
    }), /*#__PURE__*/_react.default.createElement(_SummaryTable.default.Row, null, /*#__PURE__*/_react.default.createElement(_SummaryTable.default.Text, {
      text: "Plan Charges"
    }), /*#__PURE__*/_react.default.createElement(_SummaryTable.default.Value, {
      value: summary.planCharges
    })), /*#__PURE__*/_react.default.createElement(_SummaryTable.default.Row, null, /*#__PURE__*/_react.default.createElement(_SummaryTable.default.Text, {
      text: "Additional Services"
    }), /*#__PURE__*/_react.default.createElement(_SummaryTable.default.Value, {
      value: summary.addOnCharges
    })), /*#__PURE__*/_react.default.createElement(_SummaryTable.default.Row, null, /*#__PURE__*/_react.default.createElement(_SummaryTable.default.Text, {
      text: "Grand Total"
    }), /*#__PURE__*/_react.default.createElement(_SummaryTable.default.Value, {
      value: summary.nextMonth
    })), /*#__PURE__*/_react.default.createElement(_SummaryTable.default.Row, {
      style: {
        marginTop: '40px'
      }
    }, /*#__PURE__*/_react.default.createElement(_SummaryTable.default.Text, {
      text: "Due Now"
    }), /*#__PURE__*/_react.default.createElement(_SummaryTable.default.Value, {
      value: summary.dueNow
    })), /*#__PURE__*/_react.default.createElement(_SummaryTable.default.Row, null, /*#__PURE__*/_react.default.createElement(_SummaryTable.default.Text, {
      text: "1st Bill"
    }), /*#__PURE__*/_react.default.createElement(_SummaryTable.default.Value, {
      value: summary.nextMonth
    })), /*#__PURE__*/_react.default.createElement(_SummaryTable.default.Content, null, /*#__PURE__*/_react.default.createElement(_Toggles.default, {
      dataHook: dataHook,
      disableCoupons: true
    })), /*#__PURE__*/_react.default.createElement(_SummaryTable.default.Row, {
      style: {
        marginTop: '8px'
      }
    }, /*#__PURE__*/_react.default.createElement(_SummaryTable.default.Value, {
      value: summary.dueNow,
      style: {
        fontSize: '24px'
      }
    })), /*#__PURE__*/_react.default.createElement(_SummaryTable.default.Content, {
      className: "summary__due-form"
    }, /*#__PURE__*/_react.default.createElement(_DueForm.default, {
      dataHook: dataHook,
      shouldSendPriceOrderRequest: hasAtLeastOneFeatureChange || hasAtLeastOnePlanChange || finalData.some(line => line.activityType === 'ADDLINE'),
      disableToday: !enableCurrentRadio,
      disableNextBill: !enableFutureRadio,
      insuranceAddOnMessage: insuranceAddOnMessage,
      insuranceMessage: insuranceMessage,
      onNextClick: onNextClick,
      plansAndAddonsData: loadedData,
      setIsTabletPlanFailed: setIsTabletPlanFailed,
      tableRows: tableRows
    }))));
  }
  return null;
};
var _default = Step1;
exports.default = _default;
module.exports = exports.default;