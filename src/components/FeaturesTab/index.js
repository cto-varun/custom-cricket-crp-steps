import React, { useState } from 'react';
import Tab from './Tab';
import CheckableTags from '../CheckableTags';
import CollapsePanels from './CollapsePanels';
import onChangeHandler from './onChangeHandler';

const featureTypeMapper = (features, setState) => (type) => {
    if (features === undefined) {
        features = {
            current: [],
            expired: [],
        };
        setState((v) => ({
            ...v,
            uiData: {
                ...v.uiData,
                selected: {
                    ...v.uiData.selected,
                    tableRows: [],
                },
            },
        }));
    }

    return (
        (features[type] &&
            features[type].map((feature) => ({
                ...feature,
                isCurrent: type === 'current',
            }))) ||
        []
    );
};

const currentExpiredVisibility = (
    features,
    isCurrent,
    addOnsToReview,
    setState
) => {
    const featureType = featureTypeMapper(features, setState);
    const currentFeatures = featureType('current');
    return isCurrent
        ? currentFeatures
        : [...currentFeatures, ...featureType('expired')];
};

const mapFeatures = ({
    checkTabSelectionCompatibility,
    dataHook: [state, setState],
    features,
    FeaturesComponent,
    selectedType,
    useTag,
    addOnsToReview,
    ebbQualifiedPlans,
    userMessages,
    profiles,
    ebbBenefit,
    datasources,
    technicalSocUpdate,
    allowEditTechnicalSocs,
    changePlanHeaderMessage,
    acpCohorts,
    technicalSocsMetadata,
    setResetTableOnClickPlanTag,
    maxAddTableCount,
    setMaxAddTableCount,
    rowToDeselect,
    setRowToDeselect,
    setResetTableRowByTablet,
}) =>
    features.map(({ id, feature, multiSelect }) => {
        const options = currentExpiredVisibility(
            feature,
            selectedType === 'current',
            addOnsToReview,
            setState
        );
        const isChecked = (val) =>
            state.uiData.selected[id].findIndex(({ value }) => value === val) >
            -1;

        const onChange = onChangeHandler({
            id,
            multiSelect,
            checkAccordionSelectionCompatibility: checkTabSelectionCompatibility,
            useTag,
            state,
            setState,
        });

        const compatibilityInfo =
            state.getplansandaddonsResponse?.compatibility?.compatibilityInfo;
        const selectedTableRows = state.uiData?.selected?.tableRows;

        const selectedTableRowsData = selectedTableRows.map(
            (rowIndex) => state.tableData?.finalData?.[rowIndex]
        );

        const ebbStatus = ebbBenefit?.status?.length
            ? ebbBenefit?.status[0]?.value
            : '';

        const isEbbActive = ebbStatus === 'Active';

        return (
            <FeaturesComponent
                key={id}
                isChecked={isChecked}
                onChangeHandler={onChange}
                options={options}
                setState={setState}
                addOnsToReview={addOnsToReview}
                compatibilityInfo={compatibilityInfo}
                selectedTableRows={selectedTableRows}
                selectedTableRowsData={selectedTableRowsData}
                ebbQualifiedPlans={ebbQualifiedPlans}
                userMessages={userMessages}
                isEbbActive={isEbbActive}
                profiles={profiles}
                datasources={datasources}
                technicalSocUpdate={technicalSocUpdate}
                allowEditTechnicalSocs={allowEditTechnicalSocs}
                technicalSocsMetadata={technicalSocsMetadata}
                changePlanHeaderMessage={changePlanHeaderMessage}
                acpCohorts={acpCohorts}
                setResetTableOnClickPlanTag={setResetTableOnClickPlanTag}
                maxAddTableCount={maxAddTableCount}
                state={state}
                setMaxAddTableCount={setMaxAddTableCount}
                rowToDeselect={rowToDeselect}
                setRowToDeselect={setRowToDeselect}
                setResetTableRowByTablet={setResetTableRowByTablet}
            />
        );
    });

const handleOnExpireToggle = (setSelectedType) => (checked) => {
    setSelectedType(checked ? 'expired' : 'current');
};

const handleOnExpandClick = (setExpandView) => () => {
    setExpandView((expandView) => !expandView);
};

export default function Accordion({
    tabs,
    dataHook,
    checkTabSelectionCompatibility,
    defaultActiveKey = 'plans',
    className,
    properties,
    ebbQualifiedPlans,
    userMessages,
    profiles,
    ebbBenefit,
    datasources,
    allowEditTechnicalSocs,
    changePlanHeaderMessage,
    acpCohorts,
    technicalSocsMetadata,
    setResetTableOnClickPlanTag,
    rowToDeselect,
    setRowToDeselect,
    setResetTableRowByTablet,
}) {
    if (!tabs) {
        console.log('adding empty tabs');
        tabs = {
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
    }
    const { panelTitles, plans, addOns, deals, technicalSocs } = tabs;

    const [selectedType, setSelectedType] = useState('current');
    const [expandView, setExpandView] = useState(false);
    const useTag = useState({
        selectedValues: [],
        selectedValuesMeta: [],
    });
    const { technicalSocUpdate } = properties?.workflows;

    const features = [
        { id: 'plans', feature: plans, multiSelect: false },
        { id: 'addOns', feature: addOns, multiSelect: true },
        { id: 'technicalSocs', feature: technicalSocs, multiSelect: false },
        { id: 'deals', feature: deals, multiSelect: false },
    ];

    const tabProperties = {
        keys: features.map(({ id }) => id),
        defaultActiveKey,
        expandView,
        panelTitles,
        onExpandClick: handleOnExpandClick(setExpandView),
        onExpireToggle: handleOnExpireToggle(setSelectedType),
    };

    const FeaturesComponent = expandView ? CollapsePanels : CheckableTags;

    const childComponents = mapFeatures({
        checkTabSelectionCompatibility,
        dataHook,
        features,
        FeaturesComponent,
        selectedType,
        useTag,
        addOnsToReview: properties?.addOnsToReview,
        ebbQualifiedPlans,
        userMessages,
        profiles,
        ebbBenefit,
        datasources,
        technicalSocUpdate,
        allowEditTechnicalSocs,
        changePlanHeaderMessage,
        acpCohorts,
        technicalSocsMetadata,
        setResetTableOnClickPlanTag,
        rowToDeselect,
        setRowToDeselect,
        setResetTableRowByTablet,
    });

    const tabClassName = className
        ? `plan-selection-wrapper ${className}`
        : 'plan-selection-wrapper';

    return (
        <Tab className={tabClassName} properties={tabProperties}>
            {childComponents}
        </Tab>
    );
}
