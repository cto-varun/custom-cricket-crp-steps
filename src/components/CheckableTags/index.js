import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Tag, Checkbox, Modal, Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import TablePopUp from '@ivoyant/custom-cricket-pop-up';
import InfoIcon from '../../Icons/Info';
import Tooltip from '../Tooltip';
import InfoTooltip from '../Tooltip/InfoTooltip';
import checkTabletPlans from './utils/checkTabletPlans';
import './styles.css';
import tabletInformation from '../utils/tabletInformation';
import { globalConfig } from 'antd/lib/config-provider';

const { CheckableTag: AntCheckableTag } = Tag;

export const CheckableTag = ({
    option,
    isChecked = null,
    onChangeHandler,
    displayInfoTooltip = true,
    displayPrice = true,
    tagClassName = '',
    setState,
    tabType,
    addOnsToReview,
    compatibilityInfo = [],
    selectedTableRows = [],
    selectedTableRowsData = [],
    ebbQualifiedPlans = [],
    userMessages = [],
    profiles = [],
    isEbbActive,
    datasources,
    technicalSocUpdate,
    allowEditTechnicalSocs,
    setResetTableOnClickPlanTag,
    maxAddTableCount,
    setMaxAddTableCount,
    state,
    rowToDeselect,
    setRowToDeselect,
    setResetTableRowByTablet,
}) => {
    const { value, disabled: disabledOption, meta, label, isCurrent } = option;
    const { price } = meta;
    const [reviewChecked, setReviewChecked] = useState(false);
    const [showCheckbox, setShowCheckbox] = useState(false);
    const [showSlowDataMessage, setShowSlowDataMessage] = useState(false);
    const [showIncompatibleMessage, setShowIncompatibleMessage] = useState(
        false
    );
    const [ebbReviewChecked, setEbbReviewChecked] = useState(false);
    const [showEbbRemoveMessage, setShowEbbRemoveMessage] = useState(false);
    const [incompatibleChecked, setIncompatibleChecked] = useState(false);
    const [slowDataConfirmation, setSlowDataConfirmation] = useState(false);
    const [contentConfirmationModal, setContentConfirmationModal] = useState({
        title: '',
        content: '',
        clickFrom: '',
    });
    const plansToReview =
        userMessages.find((row) => row.name == 'changeRatePlanUnlimited')
            ?.plans || [];
    const reviewPlan = plansToReview?.includes(value);
    const reviewAddOn = addOnsToReview?.includes(value);
    const isAddLineFlow = selectedTableRowsData.every(
        (row) =>
            row?.activityType == 'ACTIVATION' || row?.activityType == 'ADDLINE'
    );

    const [confirmationTablePopUp, setConfirmationTablePopUp] = useState(false);
    const addLine = (tabletPrice) => {
        setContentConfirmationModal({
            title: 'You do not have a qualifying UNL line',
            content: `The $${tabletPrice} tablet rate plan is not available for accounts that do not have a qualifying UNL rate plan`,
            clickFrom: 'maxPlanTablet',
            okText: '',
            cancelText: '',
        });
        setConfirmationTablePopUp(true);
    };

    const isPromoRestricted = selectedTableRowsData.find(
        (row) => row?.telephoneData?.promoRestriction == true
    );
    const overridePromo =
        profiles
            .find(
                (a) =>
                    a.name ===
                    window[window.sessionStorage?.tabId].COM_IVOYANT_VARS
                        .profile
            )
            ?.categories?.find((a) => a.name === 'changePlan')
            ?.overridePromoRestriction || false;
    const [overridePromoReviewed, setOverridePromoReviewed] = useState(false);
    const [showOverridePromo, setShowOverridePromo] = useState(false);

    const isEbbPlan = (val) => {
        return (
            ebbQualifiedPlans?.length > 0 &&
            ebbQualifiedPlans?.some((item) => item.name === val)
        );
    };

    const selectedRowsHasEbbPlan = (
        selectedTableRows,
        selectedTableRowsData
    ) => {
        const selectedRowsEbbArray = selectedTableRows.map((row, index) => {
            const rowPlanData =
                selectedTableRowsData?.[index]?.plan?.currentPlan
                    ?.pricePlanSocCode;
            return isEbbPlan(rowPlanData);
        });
        return selectedRowsEbbArray.some((item) => item === true);
    };

    const onChange = (
        tabType,
        isEbbActive,
        selectedMeta,
        reviewed,
        incompatibleReviewed = false,
        incompatibleChecked = false,
        ebbReviewChecked = false,
        overridePromoReviewed = false,
        selectedRows = [],
        selectedRowsData = []
    ) => {
        let maxTableCount;
        const timeForTimeOutFn = 0;
        if (tabType === 'plans') {
            setResetTableOnClickPlanTag(true);
        }

        if (selectedMeta?.socCode === tabletInformation?.tabletPlanTag?.name) {
            const maxAddTableCount =
                state?.getplansandaddonsResponse?.compatibility
                    ?.maxAddTabletCount;
            const tableCount =
                maxAddTableCount === undefined || maxAddTableCount === null
                    ? 0
                    : maxAddTableCount;
            maxTableCount =
                tableCount > maxTableCount ||
                maxTableCount === undefined ||
                maxAddTabletCount === null
                    ? tableCount
                    : maxTableCount;
            maxTableCount =
                maxTableCount < 1 ? checkTabletPlans(state) : maxTableCount;

            if (maxTableCount < 1) {
                addLine(price);
                return;
            }
        }

        setTimeout(() => {
            setTimeout(() => {
                if (
                    maxTableCount < selectedRows.length &&
                    selectedMeta?.socCode ===
                        tabletInformation?.tabletPlanTag?.name
                ) {
                    const rowsData = [];
                    //const rowsSelectedData = []
                    for (let i = 0; i < maxTableCount; i++) {
                        rowsData.push(selectedRows[i]);
                        //rowsSelectedData.push(selectedRowsData[i])
                    }
                    const rowsForDeselect = [];
                    selectedRows.forEach((index) => {
                        if (!rowsData.includes(selectedRows[index])) {
                            rowsForDeselect.push(selectedRows[index]);
                        }
                    });
                    setRowToDeselect(rowsForDeselect);
                    selectedRows = rowsData;
                    //selectedRowsData=rowsSelectedData;
                    setState((stateData) => ({
                        ...stateData,
                        uiData: {
                            ...stateData.uiData,
                            selected: {
                                ...stateData.uiData.selected,
                                tableRows: rowsData,
                            },
                        },
                    }));
                    setResetTableRowByTablet(true);
                }
            }, 0);
            const selectedRowsCompatibility = selectedRows.map(
                (row) => compatibilityInfo[row]?.plans?.[selectedMeta.socCode]
            );
            const currentPlansHaveEbb = selectedRowsHasEbbPlan(
                selectedRows,
                selectedRowsData
            );
            if (tabType === 'technicalSocs') {
                if (selectedRows.length > 1 || !allowEditTechnicalSocs) {
                    // do nothing if more than 1 row is selected
                } else {
                    const technicalSocCode = selectedMeta?.socCode;
                    const technicalSocCtn =
                        selectedRowsData?.[0]?.telephoneData?.telephoneNumber;
                    setState((v) => ({
                        ...v,
                        uiData: {
                            ...v.uiData,
                            selected: {
                                ...v.uiData?.selected,
                                technicalSocCode,
                                technicalSocCtn,
                            },
                        },
                        stepControllerFeedback: {
                            ...v.stepControllerFeedback,
                            modal: {
                                display: true,
                                closable: false,
                                maskClosable: false,
                                centered: true,
                                lazyLoad: 'TechnicalSocModal',
                                lazyProps: {
                                    technicalSocCode,
                                    technicalSocCtn,
                                    tableRowIndex: selectedRows?.[0],
                                    addOrRemove: 'add',
                                    technicalSocUpdate,
                                    datasources,
                                    socMetadata: selectedMeta,
                                },
                            },
                        },
                    }));
                }
            } else if (
                !isAddLineFlow &&
                isPromoRestricted &&
                overridePromo &&
                !overridePromoReviewed &&
                tabType === 'plans'
            ) {
                setShowOverridePromo(true);
            } else if (reviewAddOn && !reviewChecked && !reviewed) {
                setShowCheckbox(true);
            } else if (reviewPlan && !showSlowDataMessage && !reviewed) {
                setShowSlowDataMessage(true);
            } else if (
                selectedRowsCompatibility.find((row) => row !== undefined) &&
                selectedRowsCompatibility.find((row) => row !== undefined)
                    ?.removeAddOns?.length > 0 &&
                !incompatibleChecked &&
                !incompatibleReviewed
            ) {
                setShowIncompatibleMessage(true);
            } else if (
                isEbbActive &&
                currentPlansHaveEbb &&
                tabType === 'plans' &&
                !isEbbPlan(selectedMeta.socCode) &&
                !ebbReviewChecked
            ) {
                // disable ebb message. uncomment below line to enable
                // setShowEbbRemoveMessage(true);
            } else {
                setIncompatibleChecked(false);
                setShowIncompatibleMessage(false);
                console.log(state?.tableData);
                setState((v) => ({
                    ...v,
                    uiData: {
                        ...v.uiData,
                        lastAction: 'checkableTagsChanged',
                        selected: {
                            ...v.uiData.selected,
                            [tabType]: [{ selectedMeta }],
                        },
                    },
                    tableData: {
                        ...v.tableData,
                        shouldUpdate: tabType,
                    },
                }));
            }
        }, timeForTimeOutFn);
    };

    const reviewPlanModalCheckboxClick = (e) => {
        e.target.checked
            ? setSlowDataConfirmation(true)
            : setSlowDataConfirmation(false);
    };

    const reviewOverridePromoCheckboxClick = (e) => {
        e.target.checked
            ? setOverridePromoReviewed(true)
            : setOverridePromoReviewed(false);
    };

    const reviewPlanModalButtonClick = () => {
        setReviewChecked(true);
        setShowSlowDataMessage(false);
        onChange(
            tabType,
            isEbbActive,
            meta,
            true,
            false,
            false,
            false,
            overridePromoReviewed,
            selectedTableRows,
            selectedTableRowsData
        );
    };

    const reviewOverrideModalButtonClick = () => {
        setOverridePromoReviewed(true);
        setShowOverridePromo(false);
        onChange(
            tabType,
            isEbbActive,
            meta,
            reviewChecked,
            false,
            incompatibleChecked,
            ebbReviewChecked,
            true,
            selectedTableRows,
            selectedTableRowsData
        );
    };

    const reviewIncompatibleModalButtonClick = () => {
        setIncompatibleChecked(true);
        setShowIncompatibleMessage(false);
        onChange(
            tabType,
            isEbbActive,
            meta,
            true,
            true,
            false,
            false,
            overridePromoReviewed,
            selectedTableRows,
            selectedTableRowsData
        );
    };

    const reviewEbbModalButtonClick = () => {
        setEbbReviewChecked(true);
        setShowEbbRemoveMessage(false);
        onChange(
            tabType,
            isEbbActive,
            meta,
            true,
            true,
            false,
            true,
            false,
            selectedTableRows,
            selectedTableRowsData
        );
    };

    const handleReviewPlanModalCancel = () => {
        setShowSlowDataMessage(false);
    };

    const handleOverridePromoCancel = () => {
        setShowOverridePromo(false);
    };

    const handleIncompatibleModalCancel = () => {
        setShowIncompatibleMessage(false);
    };

    const handleEbbModalCancel = () => {
        setShowEbbRemoveMessage(false);
        window[sessionStorage?.tabId].navigateRoute(
            '/dashboards/manage-account#devicesummary'
        );
    };

    const handleCheckChanged = (e) => {
        if (e.target.checked) {
            setReviewChecked(true);
            setShowCheckbox(false);
            onChange(
                tabType,
                isEbbActive,
                meta,
                true,
                false,
                false,
                false,
                false,
                selectedTableRows,
                selectedTableRowsData
            );
        }
    };
    // const checked = isChecked ? { checked: isChecked(value) } : {};
    const priceDisplay =
        price && displayPrice ? (
            <span className="checkable-tag__label-price">{`$${price}`}</span>
        ) : null;
    const disabled = !isCurrent || disabledOption;

    const tooltip = displayInfoTooltip ? (
        <Tooltip
            title={<InfoTooltip meta={meta} value={value} />}
            overlayClassName="checkable-tag__tooltip"
            destroyTooltipOnHide={{ keepParent: false }}
        >
            <span className="checkable-tag__label-section--icon">
                <InfoIcon />
            </span>
        </Tooltip>
    ) : null;

    const spacer = displayInfoTooltip ? (
        <span className="checkable-tag__label-section--spacer" />
    ) : null;

    const checkableClassName = `checkable-tag__wrapper${
        tagClassName ? ` ${tagClassName}` : ' checkable-tag__wrapper--default'
    } ${showCheckbox && 'checkable-tag-review'} ${
        (!allowEditTechnicalSocs || selectedTableRows.length > 1) &&
        tabType === 'technicalSocs'
            ? 'checkable-tag__wrapper--gray'
            : ''
    }`;

    const handleClose = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setShowCheckbox(false);
        setShowSlowDataMessage(false);
    };

    return (
        <>
            <TablePopUp
                confirmationESimPopUp={confirmationTablePopUp}
                setConfirmationESimPopUp={setConfirmationTablePopUp}
                contentConfirmationModal={contentConfirmationModal}
            />
            <AntCheckableTag
                // {...checked}
                key={value}
                className={checkableClassName}
                onChange={() =>
                    onChange(
                        tabType,
                        isEbbActive,
                        meta,
                        false,
                        false,
                        false,
                        false,
                        overridePromoReviewed,
                        selectedTableRows,
                        selectedTableRowsData
                    )
                }
                disabled={disabled}
            >
                {isEbbPlan(value) && (
                    <span key={value} className="checkable-tag__ebb">
                        EBB Eligible
                    </span>
                )}
                <span
                    className={`checkable-tag__label-wrapper ${
                        showCheckbox && 'tag-review'
                    }`}
                >
                    <span
                        className={
                            !showCheckbox && 'checkable-tag__label-section'
                        }
                    >
                        {spacer}
                        <span className="checkable-tag__label-section--label">
                            {label}
                        </span>
                        {tooltip}
                        {priceDisplay}
                    </span>
                    {showCheckbox && (
                        <CloseOutlined title="close" onClick={handleClose} />
                    )}
                </span>
                {showCheckbox && (
                    <>
                        <InfoTooltip
                            meta={meta}
                            value={value}
                            className="review-terms"
                        />
                        <div className="checkable-tag__check-box">
                            <Checkbox onChange={handleCheckChanged} />
                            <span>
                                {' '}
                                Reviewed the {''}
                                <a
                                    className="checkable-tag__link"
                                    href="https://www.cricketwireless.com/insight/plans-and-features/cricket-protect/protect-byod.html"
                                    target="_blank"
                                >
                                    Cricket Insight
                                </a>{' '}
                                checklist
                            </span>
                        </div>
                    </>
                )}
            </AntCheckableTag>
            {showSlowDataMessage && (
                <>
                    <Modal
                        open={showSlowDataMessage}
                        footer={null}
                        onCancel={handleReviewPlanModalCancel}
                    >
                        <div className="checkable-tag__check-box">
                            {userMessages.find(
                                (row) => row.name == 'changeRatePlanUnlimited'
                            )?.message ||
                                'For unlimited rate plan activations and changes only, I acknowledge that I have read the appropriate disclaimer to the customer: <br />* <b>$55 Unlimited Core</b> : Data speed limited to max of 8 Mbps. Cricket may temporarily slow data speeds if the network is busy.'}
                        </div>
                        <Checkbox onChange={reviewPlanModalCheckboxClick} />
                        &nbsp;
                        <Button
                            onClick={reviewPlanModalButtonClick}
                            disabled={!slowDataConfirmation}
                        >
                            Ok
                        </Button>
                    </Modal>
                </>
            )}
            {showOverridePromo && (
                <>
                    <Modal
                        open={showOverridePromo}
                        footer={null}
                        onCancel={handleOverridePromoCancel}
                    >
                        <div className="checkable-tag__check-box">
                            {userMessages.find(
                                (row) =>
                                    row.name ==
                                    'changeRatePlanPromoRestrictionOverride'
                            )?.message ||
                                'You are changing a rate plan that could be restricted, do you wish to override if necessary?'}
                        </div>
                        <Checkbox onChange={reviewOverridePromoCheckboxClick} />
                        &nbsp;
                        <Button
                            onClick={reviewOverrideModalButtonClick}
                            disabled={!overridePromoReviewed}
                        >
                            OVERRIDE
                        </Button>
                    </Modal>
                </>
            )}
            {showIncompatibleMessage && (
                <>
                    <Modal
                        open={showIncompatibleMessage}
                        footer={null}
                        onCancel={handleIncompatibleModalCancel}
                    >
                        <div
                            className="checkable-tag__check-box"
                            style={{ padding: '10px' }}
                        >
                            {userMessages.find(
                                (row) =>
                                    row.name ==
                                    'changeRatePlanIncompatibleAddons'
                            )?.message ||
                                'Note: If you proceed, incompatible services will be auto dropped for changed lines. Please confirm if you wish to proceed.'}
                        </div>
                        <Button onClick={reviewIncompatibleModalButtonClick}>
                            Ok
                        </Button>
                    </Modal>
                </>
            )}
            {showEbbRemoveMessage && (
                <>
                    <Modal
                        open={showEbbRemoveMessage}
                        footer={null}
                        onCancel={handleEbbModalCancel}
                    >
                        <div
                            className="checkable-tag__check-box"
                            style={{ padding: '10px' }}
                        >
                            {userMessages.find(
                                (row) => row.name == 'ebbIneligible'
                            )?.message ||
                                'ALERT! Customer is currently enrolled in an EBB rate plan. You are attempting to change to a rate plan that is NOT eligible for the discounts under this benefit program. Before proceeding, confirm this is what the customer wants to do, and they understand they will lose their benefit.'}
                        </div>
                        <Button
                            style={{ marginRight: '8px' }}
                            onClick={reviewEbbModalButtonClick}
                        >
                            Yes
                        </Button>
                        <Button onClick={handleEbbModalCancel}>Cancel</Button>
                    </Modal>
                </>
            )}
        </>
    );
};

const CheckableTags = ({
    isChecked,
    onChangeHandler,
    options = [],
    wrapperClassName = 'checkable-tag__parent-wrapper',
    tagClassName = '',
    setState,
    tabType,
    addOnsToReview,
    compatibilityInfo = [],
    selectedTableRows = [],
    selectedTableRowsData = [],
    ebbQualifiedPlans = [],
    userMessages = [],
    profiles = [],
    isEbbActive,
    datasources,
    technicalSocUpdate,
    allowEditTechnicalSocs,
    changePlanHeaderMessage,
    acpCohorts,
    technicalSocsMetadata,
    setResetTableOnClickPlanTag,
    maxAddTableCount,
    state,
    setMaxAddTableCount,
    rowToDeselect,
    setRowToDeselect,
    setResetTableRowByTablet,
}) => {
    const tags = options.map((option) => {
        let allowEdit = allowEditTechnicalSocs;
        const technicalSocMetadata = technicalSocsMetadata.find(
            (soc) => soc?.name === option?.meta?.socCode
        );
        if (technicalSocMetadata !== undefined) {
            if (
                technicalSocMetadata?.view === 'false' ||
                technicalSocMetadata?.view === false
            ) {
                return null;
            }
            if (
                technicalSocMetadata?.edit === 'false' ||
                technicalSocMetadata?.edit === false
            ) {
                allowEdit = false;
            }
        }
        return (
            <CheckableTag
                tagClassName={tagClassName}
                key={option.label}
                isChecked={isChecked}
                onChangeHandler={onChangeHandler}
                option={option}
                setState={setState}
                tabType={tabType}
                addOnsToReview={addOnsToReview}
                compatibilityInfo={compatibilityInfo}
                selectedTableRows={selectedTableRows}
                selectedTableRowsData={selectedTableRowsData}
                ebbQualifiedPlans={ebbQualifiedPlans}
                userMessages={userMessages}
                profiles={profiles}
                isEbbActive={isEbbActive}
                datasources={datasources}
                technicalSocUpdate={technicalSocUpdate}
                allowEditTechnicalSocs={allowEdit}
                technicalSocsMetadata={technicalSocsMetadata}
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
    const plansOrDealsType = tabType == 'plans' || tabType == 'deals';

    const disablePane =
        plansOrDealsType &&
        selectedTableRowsData.find(
            (a) => a?.telephoneData?.promoRestriction == true
        ) &&
        !profiles
            .find(
                (a) =>
                    a.name ===
                    window[window.sessionStorage?.tabId].COM_IVOYANT_VARS
                        .profile
            )
            ?.categories?.find((a) => a.name === 'changePlan')
            ?.overridePromoRestriction;

    return disablePane ? (
        <div className={wrapperClassName}>
            Unable to change {tabType}.
            <br />
            <div style={{ color: 'red' }}>
                {userMessages.find(
                    (row) => row.name == 'changeRatePlanPromoRestriction'
                )?.message ||
                    'This subscriber is in a restricted promo period.'}
            </div>
        </div>
    ) : (
        <div className={wrapperClassName}>
            {tags}
            {tabType === 'plans' &&
            changePlanHeaderMessage?.enable === 'true' &&
            !acpCohorts?.cohorts?.includes('ACP') ? (
                <div className="change-plan-header-message">
                    {changePlanHeaderMessage?.message}
                </div>
            ) : (
                ''
            )}
        </div>
    );
};

CheckableTags.propTypes = {
    properties: PropTypes.shape({
        options: PropTypes.arrayOf(
            PropTypes.shape({
                label: PropTypes.string,
                value: PropTypes.string,
                disabled: PropTypes.bool,
            })
        ),
        values: PropTypes.arrayOf(PropTypes.string),
        multiSelect: PropTypes.bool,
        wrapperClassName: PropTypes.string,
    }),
};

CheckableTags.defaultProps = {
    properties: {
        options: [],
        values: [],
        multiSelect: true,
        wrapperClassName: '',
    },
};

export default CheckableTags;
