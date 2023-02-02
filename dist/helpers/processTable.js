"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _lodash = _interopRequireDefault(require("lodash.clonedeep"));
var _helpers = require("./helpers");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* eslint-disable complexity */

const createRuleset = (processor, compatibilityInfo) => processor.load(compatibilityInfo).extractData({
  extract: [{
    name: 'data',
    property: 'compatibilityInfo',
    transformations: [d => {
      return d.map(line => {
        const obj = {};
        obj[line.subscriberNumber] = line.plans;
        return obj;
      });
    }, d => {
      return d.reduce((acc, line) => {
        return {
          ...acc,
          ...line
        };
      }, {});
    }]
  }]
}).data;
const createCurrentAddonsPerLine = (processor, compatibilityInfo) => processor.load(compatibilityInfo).extractData({
  extract: [{
    name: 'currentAddons',
    property: 'compatibilityInfo',
    transformations: [d => {
      return d.map(line => {
        const obj = {};
        obj[line.subscriberNumber] = line.subscriberInfo.currentAddOns.map(ca => ca.addOnCode);
        return obj;
      });
    }, d => {
      return d.reduce((acc, line) => {
        return {
          ...acc,
          ...line
        };
      }, {});
    }]
  }]
}).currentAddons;
const filterTabData = _ref => {
  let {
    tabData,
    selectedRows,
    state,
    initialTableData,
    ruleset,
    currentAddonList
  } = _ref;
  const selectedTableRows = selectedRows.map(index => {
    const finalData = state.tableData.finalData.length > 0 ? state.tableData.finalData : initialTableData;
    return finalData[index];
  });
  const filteredAccordionData = (0, _lodash.default)(tabData);
  const plansObjectBefore = tabData.plans;
  const currentPlansBefore = plansObjectBefore.current;
  const expiredPlansBefore = plansObjectBefore.expired;
  const addOnsObjectBefore = tabData.addOns;
  const currentAddOnsBefore = addOnsObjectBefore.current;
  const expiredAddOnsBefore = addOnsObjectBefore.expired;
  return filteredAccordionData;
};
const getRowData = (tableData, rowIndex) => {
  let data;
  if (tableData[rowIndex]) {
    data = (0, _lodash.default)(tableData[rowIndex]);
  }
  return data;
};
const planMetadata = {
  plans: {},
  addons: {},
  deals: {}
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
  });
  currentAddOns.forEach(addon => {
    planMetadata.addons[addon.socCode] = addon;
  });
  expiredAddOns.forEach(addon => {
    planMetadata.addons[addon.socCode] = addon;
  });
  dealSummary.forEach(deal => {
    planMetadata.deals[deal.dealCode] = deal;
  });
};
const transform2TableData = (plansAndAddons, subscriberInfo) => {
  const tabInfo = [];
  const lineIndex = {};
  subscriberInfo.filter(s => s.ptnStatus === 'A' || s.ptnStatus === 'S').forEach((s, i) => {
    lineIndex[s.subscriberNumber] = i;
    tabInfo[i] = {
      key: i,
      rank: 0,
      activityType: 'CHANGESERVICES',
      telephoneData: {
        telephoneNumber: s.telephoneNumber,
        subscriberNumber: s.subscriberNumber,
        activationDate: s.initActivationDate,
        imei: s.currentDevice.imei,
        phoneModel: s.currentDevice.model,
        sim: s.currentDevice.sim,
        ptnStatus: s.ptnStatus,
        ppChangeCount: s.ppChangeCount
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
    }
    const currentRatePlan = currentSubscriberInfo.currentRatePlan || {};
    const currentPricePlanSoc = currentRatePlan.pricePlanSocCode || '';
    let mandatoryAddons = [];
    if (s.plans[currentPricePlanSoc]) {
      mandatoryAddons = s.plans[currentPricePlanSoc]?.mandatoryAddOns || [];
    }
    (currentSubscriberInfo.currentAddOns || []).forEach((currentAddon, i) => {
      const addonSocMeta = planMetadata.addons[currentAddon.addOnCode] || {};
      if (!addonSocMeta.technical) {
        ((tabInfoForSub || {}).addOns || [])[i] = {
          socCode: currentAddon?.addOnCode,
          longDescription: addonSocMeta?.longDescription || '',
          shortDescription: addonSocMeta?.shortDescription || '',
          price: addonSocMeta?.price || 0,
          addOnType: currentAddon?.addOnType,
          quantity: currentAddon?.quantity,
          mandatory: mandatoryAddons.includes(currentAddon?.addOnCode),
          changes: {}
        };
      } else {
        ((tabInfoForSub || {}).technicalSocs || [])[i] = {
          socCode: currentAddon?.addOnCode,
          longDescription: addonSocMeta?.longDescription || '',
          shortDescription: addonSocMeta?.shortDescription || '',
          price: addonSocMeta?.price || 0,
          addOnType: currentAddon?.addOnType,
          quantity: currentAddon?.quantity,
          mandatory: mandatoryAddons.includes(currentAddon?.addOnCode),
          changes: {}
        };
      }
    });
  });
  return tabInfo;
};
const processTable = (processor, _ref2, _ref3, _ref4, queriesData) => {
  let [apiData, tab] = _ref2;
  let [state, setState] = _ref3;
  let [compatibilityMessage, setCompatibilityMessage] = _ref4;
  const {
    addOns: allAddOnsObject = {},
    plans: allPlansObject = {},
    compatibility: compatibilityResponseObject = {}
  } = apiData;
  const {
    lineDetails
  } = state;
  const ruleset = createRuleset(processor, compatibilityResponseObject);
  const currentAddonList = createCurrentAddonsPerLine(processor, compatibilityResponseObject);
  let initialSubscriberData = [];
  if (lineDetails) {
    const initialTelephoneData = (0, _lodash.default)(lineDetails);
    initialSubscriberData = initialTelephoneData.map((item, index) => {
      return {
        key: index,
        rank: index + 1,
        activityType: 'CHANGESERVICES',
        telephoneData: {
          telephoneNumber: item?.telephoneNumber,
          subscriberNumber: item?.subscriberNumber,
          activationDate: item?.currentDevice?.activationDate,
          imei: item?.currentDevice?.imei,
          phoneModel: item?.currentDevice?.model,
          sim: item?.currentDevice?.sim
        },
        currentPlan: [],
        newPlan: {},
        addOns: [],
        technicalSocs: [],
        newAddOns: [],
        discounts: 0,
        subTotal: 0
      };
    });
  }
  let initialTableData = [];
  if (compatibilityResponseObject && compatibilityResponseObject.compatibilityInfo) {
    transformToPlanMeta(apiData);
    initialTableData = transform2TableData(apiData, lineDetails);
  }
  const getCompatibilityObjectForLine = subscriberNumber => {
    let compatibilityLineObject = {};
    if (Object.keys(compatibilityResponseObject).length > 0) {
      const compatibilityLinesArray = compatibilityResponseObject.compatibilityInfo;
      compatibilityLinesArray.map(line => {
        if (line.subscriberNumber.toString() === subscriberNumber.toString()) {
          compatibilityLineObject = line;
        }
        return line;
      });
    }
    return compatibilityLineObject;
  };
  const {
    compatibility: {
      allowAddLine = true
    }
  } = tab;
  return {
    tabs: filterTabData({
      tabData: tab,
      selectedRows: state.uiData.selected.tableRows,
      state,
      initialTableData,
      ruleset,
      currentAddonList
    }),
    initialTableData,
    allowAddLine,
    compatibilityResponseObject
  };
};
var _default = processTable;
exports.default = _default;
module.exports = exports.default;