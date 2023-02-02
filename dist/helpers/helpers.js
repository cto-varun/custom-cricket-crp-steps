"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isMRC = exports.handleAddNewLineResponseErrors = exports.getTelephoneData = exports.getTechnicalSocIndexFromTable = exports.getTechnicalSocFromTable = exports.getRowIndexByCtn = exports.getRowByCtn = exports.getPlanFromApiData = exports.getCtnFromRow = exports.getCompatiblePlans = exports.getCompatibleAddOnsOfArray = exports.getCompatibleAddOns = exports.getAddOnIndexFromTable = exports.getAddOnIndexFromChanges = exports.getAddOnFromTable = exports.getAddOnFromApiData = exports.createConsentRequestBody = exports.checkPlanCompatibility = exports.checkAddOnCompatibility = exports.addRemoveCompatibleAddons = exports.addPlansAndAddonsToData = void 0;
var _lodash = _interopRequireDefault(require("lodash.clonedeep"));
var _lodash2 = require("lodash");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const getCtnFromRow = row => {
  return row?.telephoneData?.telephoneNumber;
};
exports.getCtnFromRow = getCtnFromRow;
const getRowByCtn = (tableRows, ctn) => {
  return tableRows.find(row => getCtnFromRow(row) === ctn);
};
exports.getRowByCtn = getRowByCtn;
const getRowIndexByCtn = (tableRows, ctn) => {
  return tableRows.findIndex(row => row?.telephoneData?.telephoneNumber === ctn);
};
exports.getRowIndexByCtn = getRowIndexByCtn;
const getTelephoneData = (addLineValidationRequest, addLineValidationResponse, addLineFormValues) => {
  const telephoneData = {
    telephoneNumber: addLineValidationResponse.portInEligibility?.ctn,
    imei: addLineValidationResponse.imeiValidationResult.serialNumber,
    phoneModel: addLineValidationResponse.imeiValidationResult.itemId,
    sim: addLineValidationResponse.iccidValidationResult.serialNumber,
    newDeviceInfo: {
      imei: addLineValidationResponse.imeiValidationResult.serialNumber,
      byodind: 'Y',
      //    For Now byod ind is set to Y
      itemid: addLineValidationResponse.imeiValidationResult.itemId,
      devicesaleprice: 0.0
    },
    newSimInfo: {
      sim: addLineValidationResponse.iccidValidationResult.serialNumber,
      imsi: addLineValidationResponse.iccidValidationResult.additionalSerialNumber
    },
    rateCenter: {
      ...addLineValidationResponse.rateCenter,
      zip: addLineValidationRequest.zipCode
    }
  };
  if (addLineValidationResponse.portInEligibility !== undefined) {
    telephoneData.portInInfo = {
      ctn: addLineValidationResponse.portInEligibility.ctn,
      lrn: addLineValidationResponse.portInEligibility.lrn,
      otherAccountNumber: addLineFormValues?.accNum,
      otherAccountPin: addLineFormValues?.passcode,
      otherNetworkServiceProviderId: addLineValidationResponse.portInEligibility.otherNetworkServiceProviderId,
      winBackIndicator: addLineValidationResponse.portInEligibility.winBackIndicator,
      zip: addLineFormValues?.zipCode?.toString(),
      taxId: addLineFormValues?.taxId ? Number(addLineFormValues?.taxId) : 9999
    };
  }
  return telephoneData;
};
exports.getTelephoneData = getTelephoneData;
const getAddOnFromTable = (addOnsArray, addOnCode) => {
  return addOnsArray.find(addOn => addOn.socCode === addOnCode);
};
exports.getAddOnFromTable = getAddOnFromTable;
const getAddOnIndexFromTable = (addOnsArray, addOnCode) => {
  return addOnsArray.findIndex(addOn => addOn.socCode === addOnCode);
};
exports.getAddOnIndexFromTable = getAddOnIndexFromTable;
const getTechnicalSocFromTable = (technicalSocsArray, technicalSocCode) => {
  return technicalSocsArray.find(technicalSoc => technicalSoc.socCode === technicalSocCode);
};
exports.getTechnicalSocFromTable = getTechnicalSocFromTable;
const getTechnicalSocIndexFromTable = (technicalSocsArray, technicalSocCode) => {
  return technicalSocsArray.findIndex(technicalSoc => technicalSoc.socCode === technicalSocCode);
};
exports.getTechnicalSocIndexFromTable = getTechnicalSocIndexFromTable;
const getAddOnIndexFromChanges = (changesArray, addOnCode) => {
  return changesArray.findIndex(addOn => addOn.hasOwnProperty(addOnCode));
};
exports.getAddOnIndexFromChanges = getAddOnIndexFromChanges;
const getAddonFromPlansAndAddons = (plansAndAddons, addOnCode) => {
  let addOn = plansAndAddons.addOns.currentAddOns.find(a => a.socCode === addOnCode);
  if (addOn === undefined) {
    addOn = plansAndAddons.addOns.expiredAddOns.find(a => a.socCode === addOnCode);
  }
  return addOn;
};

// eslint-disable-next-line complexity
// exception for OTC (addOnType === 'ONETIME'). Do not remove them even if they are not compatible
const addRemoveCompatibleAddons = (lineInfo, planCode, plansAndAddons, technicalSocsMetadata, rowIndex) => {
  const technicalInclusions = [];
  if (planCode !== undefined) {
    const compatibilityInfoForLine = plansAndAddons.compatibility.compatibilityInfo.find(s => (s.subscriberNumber || s.imei) === (lineInfo.telephoneData.subscriberNumber || lineInfo.telephoneData.imei));
    if (compatibilityInfoForLine !== undefined) {
      const compatibleAddons = compatibilityInfoForLine.plans[planCode].addOns;
      const mandatoryAddons = compatibilityInfoForLine.plans[planCode].mandatoryAddOns;
      const removeAddons = compatibilityInfoForLine.plans[planCode].removeAddOns;

      // replace any included addons if not compatible
      const includedAddons = lineInfo.addOns.filter(a => a?.changes?.newAddOn && a.inclusion);
      if (includedAddons && includedAddons.length > 0) {
        //  Check if included Addon is compatible
        includedAddons.forEach(ia => {
          if (!(compatibleAddons.includes(ia.socCode) || mandatoryAddons.includes(ia.socCode))) {
            const inclusionReason = ia.changes.reason;
            const addOn = getAddonFromPlansAndAddons(plansAndAddons, inclusionReason);
            const newInclusion = addOn.inclusions.find(inclusionSocCode => compatibleAddons.includes(inclusionSocCode) || mandatoryAddons.includes(inclusionSocCode));
            if (newInclusion) {
              // replace addOn
              const inclusionAddOn = getAddonFromPlansAndAddons(plansAndAddons, newInclusion);
              const changeIndex = lineInfo.changes.findIndex(c => Object.keys(c).includes(ia.socCode));
              const change = lineInfo.changes[changeIndex][ia.socCode];
              change.price = inclusionAddOn?.price;
              lineInfo.changes.splice(changeIndex, 1);
              lineInfo.changes.push({
                [inclusionAddOn.socCode]: {
                  ...change
                }
              });
              ia.socCode = inclusionAddOn.socCode;
              ia.longDescription = inclusionAddOn?.longDescription || '';
              ia.shortDescription = inclusionAddOn?.shortDescription || '';
              ia.addOnType = inclusionAddOn.addOnType;
              ia.price = inclusionAddOn.price;
            } else {
              // delete inclusion as well as reason
              let changeIndex = lineInfo.changes.findIndex(c => Object.keys(c).includes(ia.socCode));
              lineInfo.changes.splice(changeIndex, 1);
              let addOnIndex = lineInfo.addOns.findIndex(a => a.socCode === ia.socCode);
              lineInfo.addOns.splice(addOnIndex, 1);
              changeIndex = lineInfo.changes.findIndex(c => Object.keys(c).includes(inclusionReason));
              lineInfo.changes.splice(changeIndex, 1);
              addOnIndex = lineInfo.addOns.findIndex(a => a.socCode === inclusionReason);
              lineInfo.addOns.splice(addOnIndex, 1);
            }
          }
        });
      }
      let numberOfAddons = lineInfo.addOns.length;
      const currentAddOns = [];

      // eslint-disable-next-line no-plusplus
      while (--numberOfAddons >= 0) {
        const addOn = lineInfo.addOns[numberOfAddons];
        if (removeAddons.includes(addOn.socCode)) {
          lineInfo.changes.push({
            [lineInfo.addOns[numberOfAddons].socCode]: {
              changeType: 'removedAddOn',
              price: lineInfo.addOns[numberOfAddons].price,
              compatible: false
            }
          });
          addOn.changes = {
            removedAddOn: true
          };
          addOn.compatible = false;
        }
      }
      if (mandatoryAddons.length > 0) {
        let mandatoryAddonsHasTechnical = false;
        mandatoryAddons.filter(a => currentAddOns.indexOf(a) === -1).filter(a => lineInfo.technicalSocs.findIndex(soc => soc?.socCode === a) === -1).forEach(addOnSocCode => {
          const addOn = getAddonFromPlansAndAddons(plansAndAddons, addOnSocCode);
          if (addOn !== undefined) {
            const addOnRowIdx = lineInfo.addOns.findIndex(rowItem => rowItem.socCode === addOn.socCode);
            const technicalSocRowIdx = lineInfo.technicalSocs.findIndex(rowItem => rowItem.socCode === addOn.socCode);
            if (addOnRowIdx === -1 && technicalSocRowIdx === -1) {
              if (!addOn.technical) {
                lineInfo.addOns.push({
                  ...addOn,
                  quantity: 1,
                  addOnType: addOn.addOnType,
                  changes: {
                    newAddOn: true
                  },
                  mandatory: true
                });

                // if add on found inside changes array, update that add on
                lineInfo.changes.push({
                  [addOn.socCode]: {
                    changeType: 'newAddOn',
                    price: addOn.price,
                    quantity: 1,
                    mandatory: true
                  }
                });
              } else {
                // add technical AddOn
                lineInfo.technicalSocs.push({
                  ...addOn,
                  quantity: 1,
                  addOnType: addOn.addOnType,
                  changes: {
                    newAddOn: true
                  },
                  mandatory: true
                });

                // if add on found inside changes array, update that add on
                lineInfo.changes.push({
                  [addOn.socCode]: {
                    changeType: 'newAddOn',
                    price: addOn.price,
                    quantity: 1,
                    mandatory: true
                  }
                });
              }
            }
          }
        });
      }
      if (removeAddons.length > 0) {
        removeAddons.filter(a => currentAddOns.indexOf(a) > -1 || lineInfo.technicalSocs.findIndex(soc => soc?.socCode === a) > -1).forEach(addOnSocCode => {
          const addOn = getAddonFromPlansAndAddons(plansAndAddons, addOnSocCode);
          if (addOn !== undefined) {
            if (!addOn.technical) {
              const indexOfChange = lineInfo.changes.findIndex(c => Object.keys(c)[0] === addOnSocCode);
              const addOnIndex = lineInfo.addOns.findIndex(a => a?.socCode === addOnSocCode);
              if (addOnIndex > -1) {
                if (indexOfChange >= 0) {
                  const existingChange = lineInfo.changes[indexOfChange][addOnSocCode];
                  if (existingChange.changeType === 'newAddOn') {
                    // remove this addon as it is not compatible
                    lineInfo.changes.splice(indexOfChange, 1);
                    lineInfo.addOns.splice(addOnIndex, 1);
                  } else {
                    existingChange.changeType = 'removedAddOn';
                    existingChange.compatible = false;
                  }
                }
              }
            } else {
              // remove technical socs
              const technicalSocIndex = lineInfo.technicalSocs.findIndex(a => a?.socCode === addOnSocCode);
              if (technicalSocIndex > -1) {
                lineInfo.technicalSocs[technicalSocIndex].changes = {
                  removedAddOn: true
                };
                lineInfo.technicalSocs[technicalSocIndex].compatible = false;
              }
            }
          }
        });
      }
      const removedAddons = lineInfo.addOns.filter(a => a.changes?.removedAddOn).map(a => a.socCode);
      const retainedAddons = lineInfo.addOns.filter(a => !removedAddons.includes(a.socCode)).map(a => a.socCode);
      lineInfo.addOns.forEach(addOn => {
        if (!removedAddons.includes(addOn.socCode)) {
          const addOnMeta = getAddonFromPlansAndAddons(plansAndAddons, addOn.socCode);
          if (
          // AddOn has inclusion and this inclusion is not present in retained Addons
          addOnMeta !== undefined && addOnMeta?.inclusions?.length > 0 && addOnMeta.inclusions.filter(i => retainedAddons.includes(i)).length === 0) {
            addOn.changes = {
              removedAddOn: true
            };
            addOn.compatible = false;
            lineInfo.changes.push({
              [addOn.socCode]: {
                changeType: 'removedAddOn',
                price: addOn.price,
                quantity: 1,
                compatible: false
              }
            });
          }
        }
      });
    }
  }
};
exports.addRemoveCompatibleAddons = addRemoveCompatibleAddons;
const getPlanFromApiData = (planToFind, planToFindKey, plansObject, plansObjectComparisonKey) => {
  let result = {};
  Object.keys(plansObject).map(planType => {
    if (typeof plansObject[planType].find(plan => {
      return planToFind[planToFindKey] === plan[plansObjectComparisonKey];
    }) !== 'undefined') {
      result = plansObject[planType].find(plan => planToFind[planToFindKey] === plan[plansObjectComparisonKey]);
    }
    return planType;
  });
  return result;
};
exports.getPlanFromApiData = getPlanFromApiData;
const getAddOnFromApiData = (addOnToFind, addOnToFindKey, addOnsObject, addOnsObjectComparisonKey) => {
  let result = {};
  Object.keys(addOnsObject).map(addOnType => {
    if (typeof addOnsObject[addOnType].find(addOn => {
      return addOnToFind[addOnToFindKey] === addOn[addOnsObjectComparisonKey];
    }) !== 'undefined') {
      result = addOnsObject[addOnType].find(addOn => addOnToFind[addOnToFindKey] === addOn[addOnsObjectComparisonKey]);
    }
    return addOnType;
  });
  return result;
};
exports.getAddOnFromApiData = getAddOnFromApiData;
const addPlansAndAddonsToData = (data, compatibilityInfo, allPlansObject, allAddOnsObject) => {
  const compatibilityMap = {};
  compatibilityInfo.forEach(_ref => {
    let {
      subscriberNumber,
      subscriberInfo
    } = _ref;
    compatibilityMap[subscriberNumber] = subscriberInfo;
  });
  const dataCopy = (0, _lodash.default)(data);
  const initialDataArray = dataCopy.map(item => {
    const {
      telephoneData
    } = item;
    const {
      subscriberNumber: initialDataSubscriberNumber
    } = telephoneData;
    if (compatibilityMap[initialDataSubscriberNumber]) {
      const {
        currentRatePlan,
        currentAddOns
      } = compatibilityMap[initialDataSubscriberNumber];
      const additionalRatePlanData = getPlanFromApiData(currentRatePlan, 'pricePlanSocCode', allPlansObject, 'socCode');
      const combinedRatePlanData = {
        ...currentRatePlan,
        ...additionalRatePlanData
      };
      return {
        ...item,
        telephoneData,
        currentPlan: combinedRatePlanData,
        addOns: currentAddOns
      };
    }
    return item;
  });
  return initialDataArray;
};
exports.addPlansAndAddonsToData = addPlansAndAddonsToData;
const checkAddOnCompatibility = (addOnSocCode, workingPlan, subscriberCompatibilityInfo) => {
  let compatible = false;
  if (subscriberCompatibilityInfo.plans[workingPlan.socCode] !== undefined) {
    if (subscriberCompatibilityInfo.plans[workingPlan.socCode].addOns.find(item => item === addOnSocCode) !== undefined) {
      compatible = true;
    }
    if (subscriberCompatibilityInfo.plans[workingPlan.socCode].removeAddOns.length > 0 && subscriberCompatibilityInfo.plans[workingPlan.socCode].removeAddOns.find(item => item === addOnSocCode) !== undefined) {
      compatible = false;
    }
  }
  return compatible;
};
exports.checkAddOnCompatibility = checkAddOnCompatibility;
const checkPlanCompatibility = (workingPlan, subscriberCompatibilityInfo) => {
  let compatible = false;
  if (subscriberCompatibilityInfo.plans[workingPlan.socCode] !== undefined) {
    compatible = true;
  }
  return compatible;
};
exports.checkPlanCompatibility = checkPlanCompatibility;
const getCompatiblePlans = (rules, lines) => {
  const lineSubscriberNumbers = lines.map(_ref2 => {
    let {
      telephoneData: {
        subscriberNumber
      }
    } = _ref2;
    return subscriberNumber;
  });
  const compatible = {};
  const numberOfLines = lines.length;
  lineSubscriberNumbers.forEach(subscriber => {
    const plans = rules[subscriber];
    if (plans) {
      const plansToArray = Object.keys(plans);
      plansToArray.forEach(plan => {
        compatible[plan] = plan in compatible ? compatible[plan] + 1 : 1;
      });
    }
  });
  return Object.keys(compatible).filter(p => compatible[p] === numberOfLines);
};

/**
 *
 * @param {string[]} addons
 * @param {number} index
 * @param {string[]} queue
 */
exports.getCompatiblePlans = getCompatiblePlans;
const populateAddons = function (addons, index) {
  let queue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  let action = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
  // add all of the current addons in the first selected lines to a queue
  if (index === 0 && action !== 'remove') {
    addons.forEach(ca => {
      queue.push(ca);
    });
  } else {
    // if any of the addons in the queue are not in current line addons, remove those addons that aren't in the current line from queue
    // for the remaining lines, if the addon is in the queue, do nothing

    if (action === 'remove' && addons.length === 0) return;
    queue.forEach((qa, qaIndex) => {
      if (action === 'remove') {
        if (addons.indexOf(qa) >= 0) {
          queue.splice(qaIndex, 1);
        }
      } else if (addons.indexOf(qa) === -1) {
        queue.splice(qaIndex, 1);
      }
    });

    // if the new line contains an addon that isn't in the queue, do not add to addon,
  }
};

const getCompatibleAddOns = (rules, lines, selectedPlans, currentAddOns) => {
  const lineAddons = lines.map(_ref3 => {
    let {
      newAddOns = [],
      telephoneData: {
        subscriberNumber
      },
      currentPlan: {
        socCode: oldPlanName
      },
      newPlan: {
        socCode: newPlanName = ''
      }
    } = _ref3;
    return {
      newAddOns,
      subscriberNumber,
      oldPlanName,
      newPlanName
    };
  });

  /**
   * runs if lines are selected but no plans or addons have been clicked on in UI
   */

  if (selectedPlans.length === 0) {
    const queue = [];
    lineAddons.forEach((line, index) => {
      const addonsForLine = currentAddOns[line.subscriberNumber];
      if (addonsForLine) {
        populateAddons(addonsForLine, index, queue);
      }
    });

    /**
     * returns only that addons that are in each of the selected lines
     */
    return queue;
  }
  const addOnsQueue = [];
  lineAddons.forEach((_ref4, index) => {
    let {
      subscriberNumber,
      newPlanName
    } = _ref4;
    const plans = rules[subscriberNumber];
    const newPlanAddons = plans[newPlanName] || {};
    (newPlanAddons.mandatoryAddOns || []).forEach(ma => {
      if (newPlanAddons.addOns && newPlanAddons.addOns.indexOf(ma) === -1) {
        newPlanAddons.addOns.push(ma);
      }
    });
    [{
      addonsArray: newPlanAddons.addOns || [],
      action: 'add'
    }, {
      addonsArray: newPlanAddons.removeAddOns || [],
      action: 'remove'
    }].forEach(_ref5 => {
      let {
        addonsArray,
        action
      } = _ref5;
      populateAddons(addonsArray, index, addOnsQueue, action);
    });
  });
  return addOnsQueue;
};
exports.getCompatibleAddOns = getCompatibleAddOns;
const getCompatibleAddOnsOfArray = function (rules, lines) {
  let addOnArray = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  const lineAddons = lines.map(_ref6 => {
    let {
      telephoneData: {
        subscriberNumber
      },
      currentPlan: {
        socCode: oldPlanName
      },
      newPlan: {
        socCode: newPlanName = ''
      }
    } = _ref6;
    return {
      addOnArray,
      subscriberNumber,
      oldPlanName,
      newPlanName
    };
  });
  const compatObject = {};
  const numberOfLines = lines.length;
  lineAddons.forEach(_ref7 => {
    let {
      subscriberNumber,
      oldPlanName,
      newPlanName
    } = _ref7;
    const plans = rules[subscriberNumber];
    const newPlanAddons = plans[newPlanName] || {};
    const oldPlanAddons = plans[oldPlanName];
    [{
      addOnSet: newPlanAddons
    }, {
      addOnSet: oldPlanAddons
    }].forEach(_ref8 => {
      let {
        addOnSet
      } = _ref8;
      ['addOns', 'removeAddOns'].forEach(addOnType => {
        if (addOnType in addOnSet) {
          addOnSet[addOnType].forEach(addOn => {
            if (addOnType === 'addOns') {
              if (addOnSet.mandatoryAddOns.findIndex(a => a === addOn) > -1 && !(addOn in compatObject)) {
                compatObject[addOn] = 1;
              } else {
                compatObject[addOn] = addOn in compatObject ? compatObject[addOn] + 1 : 1;
              }
            }
            if (addOnType === 'removeAddOns' && addOn in compatObject) {
              delete compatObject[addOn];
            }
          });
        }
      });
    });
  });
  return Object.keys(compatObject).filter(addOn => compatObject[addOn] === numberOfLines);
};
exports.getCompatibleAddOnsOfArray = getCompatibleAddOnsOfArray;
const formatErrors = function (code, message) {
  let defaultErrorMessage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  const errorMessage = `${code ? `Code ${code}` : ''}${code && message ? ': ' : ''}${message || ''}`;
  return errorMessage.length ? errorMessage : defaultErrorMessage;
};
const handleAddNewLineResponseErrors = function () {
  let response = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  const {
    iccidValidationResult = {},
    imeiValidationResult = {},
    portInEligibility = {}
  } = response;
  const {
    faultInfo: iccidFaultInfo = {},
    isValidForActivation: isValidICCID = 'Y'
  } = iccidValidationResult;
  const {
    faultInfo: imeiFaultInfo = {},
    isValidForActivation: isValidIMEI = 'Y'
  } = imeiValidationResult;
  const {
    eligibilityCode = '',
    eligibilityResults = true,
    eligibilityText = ''
  } = portInEligibility;
  const {
    code: iccidCode = '',
    message: iccidMessage = ''
  } = iccidFaultInfo;
  const {
    code: imeiCode = '',
    message: imeiMessage = ''
  } = imeiFaultInfo;
  let isError = false;
  let errors = null;
  if (isValidICCID === 'N' || isValidIMEI === 'N' || !eligibilityResults) {
    isError = true;
    errors = [formatErrors(iccidCode, iccidMessage, isValidICCID === 'N' ? 'ICCID is invalid for activation' : ''), formatErrors(imeiCode, imeiMessage, isValidIMEI === 'N' ? 'IMEI is invalid for activation' : ''), formatErrors(eligibilityCode, eligibilityText, !eligibilityResults ? 'Port-In is invalid for activation' : '')].filter(c => c !== '');
  }
  return {
    isError,
    errors
  };
};
exports.handleAddNewLineResponseErrors = handleAddNewLineResponseErrors;
const createConsentRequestBody = function () {
  let priceOrderRequest = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  let consentIdentifier = 'TC_CHANGE_SERVICES_V1';
  let addLineConsentIdentifier = 'TC_ACTIVATION_V1';
  let consentRequestBody = priceOrderRequest?.changeOrNewLinesInfo?.length > 0 ? {
    createConsentRequestInfo: priceOrderRequest.changeOrNewLinesInfo.map((line, index) => {
      return {
        uniqueIdentifier: `UNIQ_${index}`,
        consentType: 'TC',
        consentIdentifier: line?.activityType === 'ADDLINE' || line?.activityType === 'ACTIVATION' ? addLineConsentIdentifier : consentIdentifier,
        status: 'ACCEPT',
        consentPartyIdentity: {
          firstName: window[sessionStorage?.tabId]?.alasql?.tables?.datasource_360_customer_view?.data?.[0]?.account?.name?.firstName ? window[sessionStorage?.tabId]?.alasql?.tables?.datasource_360_customer_view?.data?.[0]?.account?.name?.firstName : '',
          lastName: window[sessionStorage?.tabId]?.alasql?.tables?.datasource_360_customer_view?.data?.[0]?.account?.name?.lastName ? window[sessionStorage?.tabId]?.alasql?.tables?.datasource_360_customer_view?.data?.[0]?.account?.name?.lastName : '',
          type: 'CTN',
          value: line.ctn ? line.ctn : window[sessionStorage?.tabId]?.NEW_CTN
        },
        communicationAttributes: {
          ctn: line.ctn ? line.ctn : window[sessionStorage?.tabId]?.NEW_CTN
        }
      };
    })
  } : {
    createConsentRequestInfo: [{
      uniqueIdentifier: 'UNIQ_1',
      consentType: 'TC',
      consentIdentifier,
      status: 'ACCEPT',
      consentPartyIdentity: {
        firstName: window[sessionStorage?.tabId]?.alasql?.tables?.datasource_360_customer_view?.data?.[0]?.account?.name?.firstName ? window[sessionStorage?.tabId]?.alasql?.tables?.datasource_360_customer_view?.data?.[0]?.account?.name?.firstName : '',
        lastName: window[sessionStorage?.tabId]?.alasql?.tables?.datasource_360_customer_view?.data?.[0]?.account?.name?.lastName ? window[sessionStorage?.tabId]?.alasql?.tables?.datasource_360_customer_view?.data?.[0]?.account?.name?.lastName : '',
        type: 'CTN',
        value: window[sessionStorage?.tabId]?.NEW_CTN
      },
      communicationAttributes: {
        ctn: window[sessionStorage?.tabId]?.NEW_CTN
      }
    }]
  };
  window[sessionStorage.tabId]['sendcrp-create-consent-data-async-machine']('SET.REQUEST.DATA', {
    value: consentRequestBody
  });
};
exports.createConsentRequestBody = createConsentRequestBody;
const isMRC = (soc, MRCsocs) => {
  return soc?.substr(soc?.length - 3) === 'MRC' || MRCsocs.findIndex(item => item.name === soc) > -1;
};
exports.isMRC = isMRC;