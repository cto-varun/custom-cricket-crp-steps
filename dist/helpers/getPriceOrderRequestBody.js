"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getPriceOrderRequest;
var _componentCache = require("@ivoyant/component-cache");
/* eslint-disable complexity */
const getAccountInfoObj = (applyCredit, accountDetails, customerInfo, accountInfo, accountBalances) => {
  let {
    ban = window[window.sessionStorage?.tabId].NEW_BAN,
    banStatus,
    accountType,
    billCycle,
    billCycleDate,
    statusActvRsnCode: accountStatusReasonCode
  } = accountDetails;
  let {
    autoPayIndicator,
    bridgePayIndicator
  } = accountInfo;
  let {
    accountSubType
  } = customerInfo;
  const {
    accountBalance = 0
  } = accountBalances;
  const newAccountInfo = _componentCache.cache.get('newAccountInfo');
  if (newAccountInfo && newAccountInfo.ban === window[window.sessionStorage?.tabId].NEW_BAN) {
    banStatus = newAccountInfo.accountStatus;
    accountType = newAccountInfo.accountType;
    accountSubType = newAccountInfo.accountSubType;
    billCycle = undefined;
    billCycleDate = undefined;
  }
  if (billCycle === 0) {
    billCycle = undefined;
    billCycleDate = undefined;
  }
  const priceOrderAccountInfo = {
    billingAccountNumber: ban,
    accountStatus: banStatus,
    accountType: accountType,
    autoPayIndicator: autoPayIndicator || false,
    bridgePayIndicator: bridgePayIndicator || '',
    accountSubType: accountSubType,
    billCycle: billCycle,
    billCycleDate: billCycleDate?.replaceAll('/', '')?.replaceAll('-', ''),
    accountStatusReasonCode
  };

  //  Add Account Balance only if apply credit is checked.
  if (applyCredit && accountBalance < 0) {
    priceOrderAccountInfo.accountBalance = accountBalance;
  }
  return priceOrderAccountInfo;
};
const getDealerAddressDetailsObj = customerInfo => {
  const obj = {
    zipCode: customerInfo?.adrZip,
    cityName: customerInfo?.adrCity,
    stateCode: customerInfo?.adrStateCode
  };
  return obj;
};
function getCompatibilityInfoByLine(plansAndAddons) {
  const compatibilityInfo = {};
  plansAndAddons.compatibility.compatibilityInfo?.forEach(line => {
    compatibilityInfo[line.subscriberNumber || line.imei] = line;
  });
  return compatibilityInfo;
}
function getUnchangedLines(tableInfo, plansAndAddons, ebbDetails) {
  const compatibilityInfo = getCompatibilityInfoByLine(plansAndAddons);
  const unchangedLines = [];
  const ebbEnrolled = ebbDetails && ebbDetails?.ebbEnrolledStatus === 'ENROLLED';
  tableInfo?.forEach(line => {
    if (line?.plan?.newPlan && line?.changes && Object.keys(line.plan.newPlan).length === 0 && line.changes.length === 0 && line.activityType !== 'ADDLINE') {
      const compatibilityInfoForLine = compatibilityInfo[line?.telephoneData?.subscriberNumber || line?.telephoneData?.imei || ''] || {};
      unchangedLines.push({
        rank: compatibilityInfoForLine?.rank,
        ctn: line.telephoneData.telephoneNumber,
        ebbEnrolledIndicator: ebbEnrolled && ebbDetails?.ebbEnrolledCtns?.find(_ref => {
          let {
            ctn
          } = _ref;
          return ctn === line?.telephoneData?.telephoneNumber;
        }) ? true : false,
        pricePlan: compatibilityInfoForLine?.subscriberInfo?.currentRatePlan.pricePlanSocCode,
        status: compatibilityInfoForLine?.ctnStatus,
        subscriberStatusReasonCode: line?.telephoneData?.statusReasonCode,
        subscriberStatusDate: compatibilityInfoForLine?.subscriberStatusDate,
        addOns: compatibilityInfoForLine?.subscriberInfo?.currentAddOns,
        latestCharge: compatibilityInfoForLine?.subscriberInfo?.latestCharge
      });
    }
  });
  return unchangedLines;
}
function getChangedLines(tableInfo, plansAndAddons, effectiveDate, ebbDetails) {
  const compatibilityInfo = getCompatibilityInfoByLine(plansAndAddons);
  const changedLines = [];
  const ebbEnrolled = ebbDetails && ebbDetails?.ebbEnrolledStatus === 'ENROLLED';
  tableInfo?.forEach(line => {
    if (Object.keys(line?.plan?.newPlan || {}).length > 0 || (line?.changes || []).length > 0 || line.activityType === 'ADDLINE') {
      const compatibilityInfoForLine = compatibilityInfo[line.telephoneData.subscriberNumber || line.telephoneData.imei];
      const hasValidCompatibilityInfo = (compatibilityInfoForLine || {}).subscriberInfo;
      let isHasValidCompatibilityInfo = hasValidCompatibilityInfo;
      let summaryCompabilityInfo = 0;
      const keysValidCompatibilityInfo = Object.keys(hasValidCompatibilityInfo);
      if (keysValidCompatibilityInfo.length > 0) {
        keysValidCompatibilityInfo.forEach(key => {
          const isArrayKey = Array.isArray(hasValidCompatibilityInfo[key]);
          summaryCompabilityInfo += isArrayKey ? hasValidCompatibilityInfo[key].length : Object.keys(hasValidCompatibilityInfo[key]).length;
        });
        isHasValidCompatibilityInfo = summaryCompabilityInfo > 0;
      }
      const pricePlanInfo = {};
      //  This is to take care of New Line
      if (Object.keys(line?.plan?.currentPlan || {}).length > 0) {
        pricePlanInfo.oldPricePlan = line.plan.currentPlan.pricePlanSocCode;
      }

      // populate only if pricePlan has changed
      if (Object.keys(line?.plan?.newPlan || {}).length > 0) {
        pricePlanInfo.newPricePlan = line.plan.newPlan.pricePlanSocCode;
      }
      const mapOfAddons = {};
      if (isHasValidCompatibilityInfo) {
        compatibilityInfoForLine.subscriberInfo.currentAddOns.forEach(addon => {
          mapOfAddons[addon.addOnCode] = addon;
        });
      }
      const noChangeAddOnsInfo = [];
      const newAddOnsInfo = [];
      const removeAddOnsInfo = [];
      const changedOrRemovedSoc = [];
      line.changes?.forEach(change => {
        const socCode = Object.keys(change)[0];
        const {
          addOnType = 'REGULAR'
        } = line.addOns.find(a => a.socCode === socCode) || line.technicalSocs.find(a => a.socCode === socCode) || {};
        changedOrRemovedSoc.push(socCode);
        const {
          changeType
        } = change[socCode];
        const currentQuantity = mapOfAddons[socCode]?.quantity ? mapOfAddons[socCode]?.quantity : 0;
        switch (changeType) {
          case 'removedAddOn':
            if (removeAddOnsInfo.findIndex(addOn => addOn.socCode === socCode) === -1) {
              removeAddOnsInfo.push({
                addOnCode: socCode,
                addOnType,
                quantity: currentQuantity
              });
            }
            break;
          case 'newAddOn':
            if (newAddOnsInfo.findIndex(addOn => addOn.socCode === socCode) === -1) {
              newAddOnsInfo.push({
                addOnCode: socCode,
                addOnType,
                // This mapping info should be added to changes, right now hardcoded
                quantity: change[socCode]?.quantity - currentQuantity // Subtract current quantity (if it exists) from total quantity
              });
            }

            break;
          case 'addOnQuantity':
            if (newAddOnsInfo.findIndex(addOn => addOn.socCode === socCode) === -1) {
              newAddOnsInfo.push({
                addOnCode: socCode,
                addOnType,
                quantity: change[socCode]?.quantity - currentQuantity // Subtract current quantity (if it exists) from total quantity
              });
            } else {
              addOnIdx = newAddOnsInfo.findIndex(addOn => addOn.socCode === socCode);
              newAddOnsInfo[addOnIdx].quantity = change[socCode]?.quantity - currentQuantity;
            }
            break;
          default:
            break;
        }
      });
      line.technicalSocs?.forEach(addOn => {
        const socCode = addOn?.socCode;
        const {
          addOnType = ''
        } = line.technicalSocs.find(a => a.socCode === socCode) || {};
        const changeType = Object.keys(addOn?.changes).length > 0 ? Object.keys(addOn?.changes)[0] : '';
        switch (changeType) {
          case 'removedAddOn':
            removeAddOnsInfo.push({
              addOnCode: socCode,
              addOnType,
              quantity: addOn?.quantity
            });
            break;
          case 'newAddOn':
            newAddOnsInfo.push({
              addOnCode: socCode,
              addOnType,
              // This mapping info should be added to changes, right now hardcoded
              quantity: addOn?.quantity
            });
            break;
          default:
            break;
        }
      });
      if (isHasValidCompatibilityInfo) {
        compatibilityInfoForLine.subscriberInfo.currentAddOns?.forEach(addon => {
          if (!(changedOrRemovedSoc.includes(addon.addOnCode) || removeAddOnsInfo.findIndex(removedAddOn => removedAddOn.addOnCode === addon.addOnCode) > -1)) {
            noChangeAddOnsInfo.push(addon);
          }
        });
      }

      // This needs to be modified for new line
      const changedLineInfo = {
        activityType: 'CHANGESERVICES',
        ctn: line.telephoneData.telephoneNumber,
        pricePlanInfo,
        ebbEnrolledIndicator: ebbEnrolled && ebbDetails?.ebbEnrolledCtns?.find(_ref2 => {
          let {
            ctn
          } = _ref2;
          return ctn === line?.telephoneData?.telephoneNumber;
        }) ? true : false,
        noChangeAddOnsInfo,
        newAddOnsInfo,
        removeAddOnsInfo,
        effectiveDate,
        recurringPromo: []
      };
      if (isHasValidCompatibilityInfo) {
        changedLineInfo.rank = compatibilityInfoForLine.rank;
        changedLineInfo.status = compatibilityInfoForLine.ctnStatus;
        changedLineInfo.subscriberStatusReasonCode = line?.telephoneData?.statusReasonCode;
        changedLineInfo.subscriberStatusDate = compatibilityInfoForLine.subscriberStatusDate;
        changedLineInfo.latestCharge = compatibilityInfoForLine.subscriberInfo.latestCharge;
        changedLineInfo.newDeviceInfo = line.telephoneData.newDeviceInfo;
      } else {
        changedLineInfo.activityType = 'ADDLINE';
        changedLineInfo.lineIdentifier = 'LINE_'.concat(line.key);
        changedLineInfo.status = 'RESERVED';
        changedLineInfo.newDeviceInfo = line.telephoneData.newDeviceInfo;
        changedLineInfo.newSimInfo = line.telephoneData.newSimInfo;
        delete changedLineInfo.ctn;
      }
      changedLines.push(changedLineInfo);
    }
  });
  return changedLines;
}
function getPriceOrderRequest(tableInfo, plansAndAddons, applyCredit, effectiveDateString, accountDetails, customerInfo, accountInfo, accountBalances) {
  let calculateTax = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : true;
  const priceOrderRequest = {
    calculateTaxInd: calculateTax,
    dealerAddressDetails: getDealerAddressDetailsObj(customerInfo),
    accountInfo: getAccountInfoObj(applyCredit, accountDetails, customerInfo, accountInfo, accountBalances),
    existingLinesInfo: getUnchangedLines(tableInfo, plansAndAddons, accountInfo?.ebbDetails),
    changeOrNewLinesInfo: getChangedLines(tableInfo, plansAndAddons, effectiveDateString, accountInfo?.ebbDetails)
  };

  // Modify activityType on new line when accounttype is T - this is to support create account followed by new line
  if (priceOrderRequest.accountInfo.accountStatus === 'T') {
    priceOrderRequest?.changeOrNewLinesInfo?.forEach(newLine => {
      newLine.activityType = 'ACTIVATION';
    });
  }
  return priceOrderRequest;
}
module.exports = exports.default;