import React, { useEffect, useState } from 'react';
import useAsyncFunctions from '../hooks/useAsyncFunctions';
import FeaturesTab from '../components/FeaturesTab';
import CRPTable from '../components/MainTable/CRPTable';
import Summary from '../components/SummaryTable';
import Toggles from '../components/SummaryTable/custom-children/Toggles';
import DueForm from '../components/SummaryTable/custom-children/DueForm';
import Spinner from '../components/Spinner';
import stepController from '../helpers/stepController';
import processSummary from '../helpers/processSummary';
import { isMRC } from '../helpers/helpers';
import { useLocation } from 'react-router-dom';
import './step1.css';

const getCompatibilityProperty = (compatibilityInfo) => (
    imei = '',
    subscriberNumber = '',
    properties
) => {
    const compatibilityForCurrentImeiOrSubscriber =
        compatibilityInfo.find(
            (compat) =>
                compat.imei === imei ||
                compat.subscriberNumber === subscriberNumber
        ) || {};

    return properties.reduce((acc, property) => {
        acc[property] = compatibilityForCurrentImeiOrSubscriber[property];
        return acc;
    }, {});
};

const checkRadioSelectionEligibility = (
    tableData,
    compatibilityInfo,
    currentAddOnsWithInsurance,
    selectedRows,
    insuranceAddOnMessage,
    setInsuranceMessage
) => {
    const linesWithChanges = tableData.filter((line = {}) => {
        return Object.keys(line?.plan?.newPlan || {}).length;
    });

    const getPropertyFromCompatibility = getCompatibilityProperty(
        compatibilityInfo
    );

    const isNewLineAdded = tableData.some(
        (line) => line.activityType === 'ADDLINE'
    );

    const lineValues = linesWithChanges.map((line = {}) => ({
        activityType: line.activityType,
        ...getPropertyFromCompatibility(
            line?.telephoneData?.imei,
            line?.telephoneData?.subscriberNumber,
            ['allowCurrentDatedPlanChange', 'allowFutureDatedPlanChange']
        ),
    }));
    const enableCurrentRadio = lineValues.every(
        ({ allowCurrentDatedPlanChange = true }) => allowCurrentDatedPlanChange
    );
    const enableFutureRadio = lineValues.every(
        ({ allowFutureDatedPlanChange = true }) => allowFutureDatedPlanChange
    );

    // Check if any addOn has insurance true in the addOnResponse from API. Then disable future radio button.
    const anyInsuranceAddOnAdded = tableData.some((line = {}) => {
        // get addOn if newly added. Can be extracted from line.changes (array)
        let insuranceAddOnPresent = false;
        // check if there is any change and also check if that line is also selected by rep.
        if (
            line?.changes &&
            line?.changes?.length > 0 &&
            selectedRows?.includes(line?.key)
        ) {
            // if any socCode matches with currentAddOnsWithInsurance then set insuranceAddOnPresent as true and break the loop;
            line?.changes?.forEach((change) => {
                const socCode = Object.keys(change)[0];
                if (currentAddOnsWithInsurance?.includes(socCode)) {
                    insuranceAddOnPresent = true;
                    return true;
                }
            });
        }
        if (insuranceAddOnPresent) setInsuranceMessage(insuranceAddOnMessage);
        else setInsuranceMessage(null);
        return insuranceAddOnPresent;
    });

    return {
        enableCurrentRadio,
        enableFutureRadio:
            enableFutureRadio && !isNewLineAdded && !anyInsuranceAddOnAdded,
    };
};

const Step1 = (props) => {
    const { dataHook, data, properties, datasources } = props;
    const { lineDetailMemos, insuranceAddOnMessage } = properties;
    const [state, setState] = dataHook;
    const { accountBalances } = state;
    const location = useLocation();
    const { accountBalance = 0 } = accountBalances;
    const compatibilityHook = useState('');
    const [
        addLineTentativeBanTableData,
        setAddLineTentativeBanTableData,
    ] = useState([]);
    const {
        status,
        message,
        processedData: { table },
        loadedData,
    } = useAsyncFunctions(properties, {
        dataHook,
        compatibilityHook,
        data,
    });
    const { accountDetails = {}, ebbBenefit, customerInfo = {} } = data?.data;
    const { ebbQualifiedPlans = [] } = data?.data?.ebbQualifiedPlans;
    const { technicalSocs = [] } = data?.data?.technicalSocs;
    const { MRCsocs = [] } = data?.data?.MRCsocs;
    const { userMessages = [] } = data?.data?.userMessages;
    const { subscribers = [] } = data?.data?.subscribers;
    const { profiles = [] } = data?.data?.profiles;
    const [rowToDeselect, setRowToDeselect] = useState([]);

    const [resetTableRowByTablet, setResetTableRowByTablet] = useState(false);
    const { statusActvRsnCode = '', statusActvCode = '' } = accountDetails;
    const [insuranceMessage, setInsuranceMessage] = useState(null);

    const [resetTableOnClickPlanTag, setResetTableOnClickPlanTag] = useState(
        false
    );

    const [maxAddTableCount, setMaxAddTableCount] = useState(0);

    const [isTabletPlanFailed, setIsTabletPlanFailed] = useState(false);

    let { profile } = window[window.sessionStorage?.tabId].COM_IVOYANT_VARS;

    const allowEditTechnicalSocs = profiles
        ?.find(({ name }) => name === profile)
        ?.categories?.find(({ name }) => name === 'addRemoveTechnicalSocs')
        ?.enable;

    const summary = processSummary(state);

    const {
        current,
        uiData: {
            selected: { tableRows },
        },
        tableData: { finalData },
    } = state;

    const [enableEffectiveRadio, setEnableEffectiveRadio] = useState({
        enableCurrentRadio: true,
        enableFutureRadio: true,
    });
    const { enableCurrentRadio, enableFutureRadio } = enableEffectiveRadio;

    const selectedRows = tableRows;
    const displayFeaturesTab = tableRows.length > 0;

    useEffect(() => {
        setState((s) => ({
            ...s,
            creditAmount: accountBalance < 0 ? -1 * accountBalance : 0,
        }));
    }, []);

    const currentAddOnsWithInsurance =
        state?.getplansandaddonsResponse?.addOns?.currentAddOns // extracting addOns from the api result which has insurance true
            ?.filter((addOn = {}) => addOn?.insurance)
            ?.map((addOn) => addOn?.socCode) || []; // setting it to empty array in case of undefined

    useEffect(() => {
        setEnableEffectiveRadio(
            checkRadioSelectionEligibility(
                finalData,
                state?.getplansandaddonsResponse?.compatibility
                    ?.compatibilityInfo || [],
                currentAddOnsWithInsurance,
                selectedRows,
                insuranceAddOnMessage,
                setInsuranceMessage
            )
        );
    }, [finalData]);

    useEffect(() => {
        if (location?.state?.addLineTentativeBan) {
            const plansAddonsAsyncMachine =
                window[window.sessionStorage?.tabId]
                    .sendgetPlansAndAddonsAsyncMachine;
            if (plansAddonsAsyncMachine) {
                plansAddonsAsyncMachine('RESET');
                plansAddonsAsyncMachine('SET.REQUEST.DATA', {
                    value: location?.state?.requestBody,
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

    const onNextClick = () =>
        stepController('next', current, [state, setState], {
            stateFunction: (s) => {
                return {
                    ...s,
                    current: s.current + 1,
                    loadedData,
                    savedData: {
                        ...s.savedData,
                        step1: {
                            table,
                        },
                    },
                };
            },
        });

    if (status === 'loading') {
        return (
            <Spinner
                className="step-1__wrapper--loading"
                tip="Loading step..."
            />
        );
    }

    if (status === 'error') {
        global.console.error({ crpError: message });
        return null;
    }

    if (status === 'render') {
        const tabs = table?.tabs;
        const checkTabSelectionCompatibility =
            table?.checkTabSelectionCompatibility;

        const planMetadata = {
            plans: {},
            addons: {},
            deals: {},
            expiredSocs: [],
        };

        const transformToPlanMeta = (plansAndAddons) => {
            const { currentPlans, expiredPlans } = plansAndAddons.plans;
            const { currentAddOns, expiredAddOns } = plansAndAddons.addOns;
            const { dealSummary = [] } = plansAndAddons.deals;

            currentPlans.forEach((cp) => {
                planMetadata.plans[cp.socCode] = cp;
            });
            expiredPlans.forEach((cp) => {
                planMetadata.plans[cp.socCode] = cp;
                planMetadata.expiredSocs.push(cp.socCode);
            });
            currentAddOns.forEach((addon) => {
                planMetadata.addons[addon.socCode] = addon;
            });
            expiredAddOns.forEach((addon) => {
                planMetadata.addons[addon.socCode] = addon;
                planMetadata.expiredSocs.push(addon.socCode);
            });
            dealSummary.forEach((deal) => {
                planMetadata.deals[deal.dealCode] = deal;
            });
        };

        const transform2TableData = (plansAndAddons, subscriberInfo) => {
            const tabInfo = [];
            const lineIndex = {};
            // the canceled line is include here to handle duplicate ranking issue by providing it to the priceOrder and createOrder payload
            subscriberInfo
                .filter(
                    (s) =>
                        s.ptnStatus === 'A' ||
                        s.ptnStatus === 'S' ||
                        s.ptnStatus === 'C'
                )
                .forEach((s, i) => {
                    const subscriber = subscribers.find(
                        (item) =>
                            item?.subscriberDetails?.phoneNumber ===
                            s.telephoneNumber
                    );
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
                            statusReasonCode:
                                subscriber?.subscriberDetails?.statusReasonCode,
                            statusActvCode,
                            statusActvRsnCode,
                        },
                        plan: {},
                        addOns: [],
                        technicalSocs: [],
                        changes: [],
                        discounts: 0,
                        subTotal: 0,
                        operations: {
                            newLine: false,
                            showIcons: false,
                        },
                    };
                });

            plansAndAddons.compatibility.compatibilityInfo.forEach((s) => {
                const tabInfoForSub = tabInfo[lineIndex[s.subscriberNumber]];
                const currentSubscriberInfo = s.subscriberInfo || {};
                if (tabInfoForSub !== undefined) {
                    const currentRatePlan =
                        currentSubscriberInfo.currentRatePlan || {};
                    const currentPricePlanSoc =
                        currentRatePlan.pricePlanSocCode || '';
                    let planSocMeta = {};

                    if (planMetadata.plans[currentPricePlanSoc]) {
                        planSocMeta = planMetadata.plans[currentPricePlanSoc];
                    }

                    tabInfoForSub.rank = s.rank;
                    tabInfoForSub.telephoneData.ppChangeCount = s.ppChangeCount
                        ? s.ppChangeCount
                        : 0;
                    tabInfoForSub.telephoneData.promoRestriction =
                        s.promoRestriction;
                    tabInfoForSub.plan = {
                        currentPlan: currentRatePlan,
                        newPlan: {},
                    };

                    const currentRatePlanFeatures =
                        plansAndAddons?.plans?.currentPlans
                            ?.find(
                                (plan) => plan?.socCode === currentPricePlanSoc
                            )
                            ?.features?.map((feature) =>
                                plansAndAddons?.features?.find(
                                    (feat) => feat?.featureCode === feature
                                )
                            ) || [];

                    tabInfoForSub.telephoneData.features = currentRatePlanFeatures;

                    tabInfoForSub.plan.currentPlan = {
                        ...tabInfoForSub.plan.currentPlan,
                        longDescription: '',
                        shortDescription: '',
                    };

                    tabInfoForSub.plan.currentPlan.longDescription = (
                        planSocMeta || {}
                    ).longDescription;
                    tabInfoForSub.plan.currentPlan.shortDescription = (
                        planSocMeta || {}
                    ).shortDescription;
                    tabInfoForSub.discounts = currentRatePlan.discountAmount;

                    tabInfoForSub.operations.disableSelection =
                        !s.allowPricePlanChange || false;
                    tabInfoForSub.addOns = tabInfoForSub?.addOns?.filter(
                        (a) => a !== undefined
                    );
                    tabInfoForSub.technicalSocs = tabInfoForSub?.technicalSocs?.filter(
                        (a) => a !== undefined
                    );
                }

                // map Addons
                (currentSubscriberInfo.currentAddOns || []).forEach(
                    (currentAddon, i) => {
                        const addonSocMeta =
                            planMetadata.addons[currentAddon?.addOnCode] || {};
                        if (!addonSocMeta.technical) {
                            ((tabInfoForSub || {}).addOns || [])[i] = {
                                socCode: currentAddon?.addOnCode,
                                longDescription:
                                    addonSocMeta?.longDescription || '',
                                shortDescription:
                                    addonSocMeta?.shortDescription || '',
                                price:
                                    addonSocMeta?.price ||
                                    currentAddon?.price ||
                                    0,
                                addOnType: currentAddon?.addOnType,
                                quantity: currentAddon?.quantity,
                                changes: {},
                            };
                        } else {
                            const technicalSocMetadata = technicalSocs.find(
                                (soc) => soc?.name === currentAddon?.addOnCode
                            );
                            if (
                                technicalSocMetadata !== undefined ||
                                !technicalSocMetadata?.view
                            ) {
                                ((tabInfoForSub || {}).technicalSocs || [])[
                                    i
                                ] = {
                                    socCode: currentAddon?.addOnCode,
                                    longDescription:
                                        addonSocMeta?.longDescription || '',
                                    shortDescription:
                                        addonSocMeta?.shortDescription || '',
                                    price:
                                        addonSocMeta?.price ||
                                        currentAddon?.price ||
                                        0,
                                    addOnType: currentAddon?.addOnType,
                                    quantity: currentAddon?.quantity,
                                    changes: {},
                                };
                            }
                        }
                    }
                );
                if (tabInfoForSub) {
                    tabInfoForSub.addOns = tabInfoForSub?.addOns?.filter(
                        (a) => a !== undefined
                    );
                    tabInfoForSub.technicalSocs = tabInfoForSub?.technicalSocs?.filter(
                        (a) => a?.socCode
                    );
                }
            });
            const filteredTabInfo = tabInfo
                .filter((tabInfoObj) => {
                    return plansAndAddons?.compatibility?.compatibilityInfo.find(
                        (ci) =>
                            ci.ctn === tabInfoObj.telephoneData.telephoneNumber
                    );
                })
                .map((obj, i) => {
                    return {
                        ...obj,
                        key: i,
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
                    expired: [],
                },
                addOns: {
                    current: [],
                    expired: [],
                },
                technicalSocs: {
                    current: [],
                    expired: [],
                },
                deals: {
                    current: [],
                    expired: [],
                },
            };
            tabInfo.forEach((tabInfoForSub) => {
                if (selectedIdx.includes(tabInfoForSub.key)) {
                    selectedSubs[
                        tabInfoForSub.telephoneData.subscriberNumber ||
                            tabInfoForSub.telephoneData.imei
                    ] = tabInfoForSub;
                }
            });

            let lineNumber = 0;
            let hasSuspendedLines = false;
            let hasNewLineWithNoPlan = false;

            plansAndAddons.compatibility.compatibilityInfo.forEach((sub) => {
                const subNumber = sub.subscriberNumber || sub.imei;

                if (selectedSubs[subNumber] !== undefined) {
                    lineNumber += 1;
                    const selectedSubscriber = selectedSubs[subNumber];

                    const selectedPlan =
                        selectedSubscriber?.plan?.newPlan?.pricePlanSocCode ||
                        selectedSubscriber?.plan?.currentPlan?.pricePlanSocCode;

                    if (
                        selectedSubs[subNumber].activityType === 'ADDLINE' &&
                        selectedPlan === undefined
                    ) {
                        hasNewLineWithNoPlan = true;
                    }

                    const nextLinePlans = [];
                    let plans = Object.keys(sub.plans);

                    //  For Suspended accounts - show only lower value plans.
                    if (
                        selectedSubs[subNumber].telephoneData.ptnStatus === 'S'
                    ) {
                        hasSuspendedLines = true;
                        plans = plans.filter(
                            (planCode) =>
                                planMetadata.plans[planCode].price <=
                                selectedSubs[subNumber].plan.currentPlan.price
                        );
                    }

                    plans.forEach((planCode) => {
                        if (lineNumber === 1) {
                            plansAvailable.push(planCode);
                        } else {
                            nextLinePlans.push(planCode);
                        }
                        if (
                            (selectedPlan === undefined &&
                                selectedSubs[subNumber].activityType ===
                                    'ADDLINE') ||
                            selectedPlan === planCode
                        ) {
                            if (addonsAvailable.length === 0) {
                                addonsAvailable = addonsAvailable.concat(
                                    sub.plans[planCode].addOns
                                );
                            } else {
                                const newAddonsIntersection = addonsAvailable.filter(
                                    (a) =>
                                        sub.plans[planCode].addOns.includes(a)
                                );
                                addonsAvailable = newAddonsIntersection;
                            }
                        }
                    });

                    if (lineNumber > 1) {
                        const newPlanIntersection = plansAvailable.filter((p) =>
                            nextLinePlans.includes(p)
                        );
                        plansAvailable = newPlanIntersection;
                    }

                    const idxOfPlan = plansAvailable.indexOf(selectedPlan);
                    if (idxOfPlan >= 0) {
                        plansAvailable.splice(idxOfPlan, 1);
                    }
                }
            });

            plansAvailable.forEach((planCode) => {
                const socMetaData = planMetadata.plans[planCode];
                if (socMetaData !== undefined) {
                    (planMetadata.expiredSocs.includes(planCode)
                        ? panelInfo.plans.expired
                        : panelInfo.plans.current
                    ).push({
                        value: socMetaData.socCode,
                        label: socMetaData.socCode,
                        meta: {
                            socCode: socMetaData.socCode,
                            longDescription: socMetaData.longDescription,
                            shortDescription: socMetaData.shortDescription,
                            price: socMetaData.price,
                            tablet: socMetaData.tablet ?? false,
                        },
                    });
                }
            });

            //  Addons will be sent only if suspended line is not present
            if (!hasSuspendedLines && !hasNewLineWithNoPlan) {
                // Addon logic for multiline
                let selectedLinesAddOns = [];
                let selectedSubKeys = Object.keys(selectedSubs);
                selectedSubKeys.forEach((key) => {
                    selectedLinesAddOns = selectedLinesAddOns.concat(
                        selectedSubs[key].addOns.map((addOn) => addOn?.socCode)
                    );
                });
                // de-dupe
                // selectedLinesAddOns = [...new Set(selectedLinesAddOns)];
                let multiLine = selectedSubKeys.length > 1;

                addonsAvailable.forEach((addonCode) => {
                    const socMetaData = planMetadata.addons[addonCode];

                    // do not show MRC socs (example: PROTECTON, PROTECTPL, if they already exist. Only 1 per line allowed
                    let hasMRCsoc = false;
                    selectedSubKeys.forEach((key) => {
                        if (
                            selectedSubs[key].addOns.find(
                                (addOn) =>
                                    addOn?.socCode === socMetaData?.socCode &&
                                    isMRC(socMetaData?.socCode, MRCsocs)
                            )
                        ) {
                            hasMRCsoc = true;
                        }
                    });

                    let showAddOnForMultiLine = true;

                    if (multiLine) {
                        let allLinesHaveAddOn = true;
                        selectedSubKeys.forEach((key) => {
                            if (
                                !selectedSubs[key].addOns.find(
                                    (addOn) =>
                                        addOn?.socCode === socMetaData?.socCode
                                )
                            ) {
                                allLinesHaveAddOn = false;
                            }
                        });
                        if (allLinesHaveAddOn) {
                            showAddOnForMultiLine = false;
                        }
                    }

                    if (
                        socMetaData !== undefined &&
                        showAddOnForMultiLine &&
                        !hasMRCsoc
                    ) {
                        // Technical SOCs have the property "technical == true", - do not show them in regular add-ons list
                        if (!socMetaData.technical) {
                            (planMetadata.expiredSocs.includes(addonCode)
                                ? panelInfo.addOns.expired
                                : panelInfo.addOns.current
                            ).push({
                                value: socMetaData.socCode,
                                label: socMetaData.socCode,
                                meta: {
                                    socCode: socMetaData.socCode,
                                    longDescription:
                                        socMetaData.longDescription,
                                    shortDescription:
                                        socMetaData.shortDescription,
                                    price: socMetaData.price,
                                    addOnType: socMetaData.addOnType,
                                },
                            });
                        } else {
                            const technicalSocMetadata = technicalSocs.find(
                                (soc) => soc?.name === addonCode
                            );
                            if (
                                technicalSocMetadata !== undefined ||
                                !technicalSocMetadata?.view
                            ) {
                                (planMetadata.expiredSocs.includes(addonCode)
                                    ? panelInfo.technicalSocs.expired
                                    : panelInfo.technicalSocs.current
                                ).push({
                                    value: socMetaData.socCode,
                                    label: socMetaData.socCode,
                                    meta: {
                                        socCode: socMetaData.socCode,
                                        longDescription:
                                            socMetaData.longDescription,
                                        shortDescription:
                                            socMetaData.shortDescription,
                                        price: socMetaData.price,
                                        addOnType: socMetaData.addOnType,
                                    },
                                    technical: socMetaData.technical,
                                });
                            }
                        }
                    }
                });
            }

            if (plansAndAddons.deals.dealSummary !== undefined) {
                plansAndAddons.deals.dealSummary.forEach((deal) => {
                    if (deal.dealDetails.length === selectedIdx.length) {
                        //  number of lines selected should be the number of lines in the deal
                        //  Get all the plan codes - usually it is uniform plan across all lines
                        const uniquePricePlansForDeal = deal.dealDetails
                            .map((dealDetail) => dealDetail.newPlanCode)
                            .filter(
                                (value, index, self) =>
                                    self.indexOf(value) === index
                            );
                        let foundUnmatchedDeal = false;

                        plansAndAddons.compatibility.compatibilityInfo.forEach(
                            (sub) => {
                                const subNumber =
                                    sub.subscriberNumber || sub.imei;
                                if (selectedSubs[subNumber] !== undefined) {
                                    const unmatchedDealPricePlan = uniquePricePlansForDeal.find(
                                        (dealPricePlan) =>
                                            sub.plans[dealPricePlan] ===
                                            undefined
                                    );
                                    if (unmatchedDealPricePlan !== undefined) {
                                        foundUnmatchedDeal = true;
                                    }
                                }
                            }
                        );

                        if (!foundUnmatchedDeal) {
                            panelInfo.deals.current.push({
                                value: deal.dealCode,
                                label: deal.dealCode,
                                meta: deal,
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
            initialTableData = transform2TableData(
                state.getplansandaddonsResponse,
                state.lineDetails
            );
        }

        let finalTabs = tabs;
        if (
            selectedRows.length > 0 &&
            state.tableData.finalData.length > 0 &&
            state.getplansandaddonsResponse
        ) {
            finalTabs = getCompatibility(
                state.getplansandaddonsResponse,
                state.tableData.finalData,
                selectedRows
            );
        }

        const hasAtLeastOneFeatureChange = state.tableData.finalData.some(
            (line) => line.changes.length > 0
        );
        const hasAtLeastOnePlanChange = state.tableData.finalData.some(
            (line) => Object.keys(line.plan?.newPlan || {}).length > 0
        );

        if (state.uiData.lastAction === 'back/1') {
            initialTableData = state.tableData.initialTableData;
        }

        if (
            initialTableData.length === 0 &&
            addLineTentativeBanTableData.length > 0
        ) {
            initialTableData = addLineTentativeBanTableData;
        }

        return (
            <div className="step-1__wrapper">
                <div className="step-1__wrapper--tab-table">
                    {displayFeaturesTab ? (
                        <FeaturesTab
                            {...props}
                            className="step-1__wrapper--tab"
                            tabs={finalTabs}
                            dataHook={dataHook}
                            checkTabSelectionCompatibility={
                                checkTabSelectionCompatibility
                            }
                            ebbQualifiedPlans={ebbQualifiedPlans}
                            userMessages={userMessages}
                            profiles={profiles}
                            ebbBenefit={ebbBenefit}
                            properties={properties}
                            datasources={datasources}
                            allowEditTechnicalSocs={allowEditTechnicalSocs}
                            changePlanHeaderMessage={
                                data?.data?.changePlanHeaderMessage
                            }
                            acpCohorts={data?.data?.acpCohorts}
                            technicalSocsMetadata={technicalSocs}
                            setResetTableOnClickPlanTag={
                                setResetTableOnClickPlanTag
                            }
                            maxAddTableCount={maxAddTableCount}
                            setMaxAddTableCount={setMaxAddTableCount}
                            rowToDeselect={rowToDeselect}
                            setRowToDeselect={setRowToDeselect}
                            setResetTableRowByTablet={setResetTableRowByTablet}
                        />
                    ) : null}
                    <CRPTable
                        {...props}
                        properties={properties}
                        datasources={datasources}
                        className="step-1__wrapper--table"
                        dataHook={dataHook}
                        initialTableData={initialTableData}
                        lineDetailMemos={lineDetailMemos}
                        ebbQualifiedPlans={ebbQualifiedPlans}
                        MRCsocs={MRCsocs}
                        customerInfo={customerInfo}
                        allowEditTechnicalSocs={allowEditTechnicalSocs}
                        userMessages={userMessages}
                        technicalSocsMetadata={technicalSocs}
                        resetTableOnClickPlanTag={resetTableOnClickPlanTag}
                        setResetTableOnClickPlanTag={
                            setResetTableOnClickPlanTag
                        }
                        setMaxAddTableCount={setMaxAddTableCount}
                        isTabletPlanFailed={isTabletPlanFailed}
                        setIsTabletPlanFailed={setIsTabletPlanFailed}
                        checkRadioSelectionEligibility={
                            checkRadioSelectionEligibility
                        }
                        setEnableEffectiveRadio={setEnableEffectiveRadio}
                        currentAddOnsWithInsurance={currentAddOnsWithInsurance}
                        insuranceAddOnMessage={insuranceAddOnMessage}
                        setInsuranceMessage={setInsuranceMessage}
                        rowToDeselect={rowToDeselect}
                        setRowToDeselect={setRowToDeselect}
                        resetTableRowByTablet={resetTableRowByTablet}
                        setResetTableRowByTablet={setResetTableRowByTablet}
                    />
                </div>
                <Summary className="step-1__summary">
                    <Summary.Title text="Summary" />
                    <Summary.Subtitle
                        text="Current Total"
                        style={{ marginTop: '8px' }}
                    />
                    <Summary.Row>
                        <Summary.Text text="Plan Charges" />
                        <Summary.Value value={summary.planCharges} />
                    </Summary.Row>
                    <Summary.Row>
                        <Summary.Text text="Additional Services" />
                        <Summary.Value value={summary.addOnCharges} />
                    </Summary.Row>
                    <Summary.Row>
                        <Summary.Text text="Grand Total" />
                        <Summary.Value value={summary.nextMonth} />
                    </Summary.Row>
                    <Summary.Row style={{ marginTop: '40px' }}>
                        <Summary.Text text="Due Now" />
                        <Summary.Value value={summary.dueNow} />
                    </Summary.Row>
                    <Summary.Row>
                        <Summary.Text text="1st Bill" />
                        <Summary.Value value={summary.nextMonth} />
                    </Summary.Row>
                    <Summary.Content>
                        <Toggles dataHook={dataHook} disableCoupons />
                    </Summary.Content>
                    <Summary.Row style={{ marginTop: '8px' }}>
                        <Summary.Value
                            value={summary.dueNow}
                            style={{ fontSize: '24px' }}
                        />
                    </Summary.Row>
                    <Summary.Content className="summary__due-form">
                        <DueForm
                            dataHook={dataHook}
                            shouldSendPriceOrderRequest={
                                hasAtLeastOneFeatureChange ||
                                hasAtLeastOnePlanChange ||
                                finalData.some(
                                    (line) => line.activityType === 'ADDLINE'
                                )
                            }
                            disableToday={!enableCurrentRadio}
                            disableNextBill={!enableFutureRadio}
                            insuranceAddOnMessage={insuranceAddOnMessage}
                            insuranceMessage={insuranceMessage}
                            onNextClick={onNextClick}
                            plansAndAddonsData={loadedData}
                            setIsTabletPlanFailed={setIsTabletPlanFailed}
                            tableRows={tableRows}
                        />
                    </Summary.Content>
                </Summary>
            </div>
        );
    }

    return null;
};

export default Step1;
