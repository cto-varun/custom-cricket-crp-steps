import React, { useEffect, useState } from 'react';
import { Button, Radio, message, Tooltip } from 'antd';
import cloneDeep from 'lodash.clonedeep';
import TablePopUp from '@ivoyant/custom-cricket-pop-up';
import ContentTwoLines from './content2Lines/content2Lines';
import getPriceOrderRequestBody from '../../../helpers/getPriceOrderRequestBody';
import callMessageBus from './requests/requestApi';
import { cache } from '@ivoyant/component-cache';
import checkTabletPlanToCancel from './utils/checkTabletPlan';
import errorHandlerCode from './utils/checkErrorMessage';
import moment from 'moment';
import './dueForm.css';
const RADIO_VALUES = {
    TODAY: 'today',
    NEXT_BILL: 'nextBill',
};
const TARGET_ACTIVITY_NEXT_BILL_CYCLE_TOOLTIP =
    'Next Bill Cycle not allowed for activities containing a tablet plan or paired unlimited plan.';
const currentDateYYYYMMDD = () => {
    const d = new Date();
    const month = `${d.getMonth() + 1}`;
    const day = `${d.getDate()}`;
    const year = d.getFullYear();
    const fmtMonth = month.length < 2 ? `0${month}` : month;
    const fmtDay = day.length < 2 ? `0${day}` : day;
    return `${year}${fmtMonth}${fmtDay}`;
};
const handleOnChange = (setState, dueDate) => ({
    target: { value: effective },
}) => {
    const logicalDate = cache.get('logicalDate');
    const effectiveDateString =
        effective === RADIO_VALUES.TODAY
            ? logicalDate
                ? logicalDate
                : currentDateYYYYMMDD()
            : dueDate && dueDate?.replaceAll('/', '')?.replaceAll('-', '');
    setState((v) => ({
        ...v,
        uiData: {
            ...v.uiData,
            effective,
            effectiveDateString,
        },
    }));
};
const handleOnPriceClick = (
    state,
    setState,
    shouldSendPriceOrderRequest,
    setPriceOrderButtonData,
    plansAndAddonsData
) => () => {
    if (window[window.sessionStorage?.tabId].sendgetPriceOrderAsyncMachine) {
        const {
            uiData: {
                selected: { tableRows },
            },
        } = state;
        const { apiData } = plansAndAddonsData || { apiData: {} };
        const { status, responseStatus, ...plansAndAddons } = apiData;

        if (
            plansAndAddons == null ||
            Object.keys(plansAndAddons).length === 0
        ) {
            setState((v) => ({
                ...v,
                uiData: {
                    ...v.uiData,
                    lastAction: 'modal/technical-error',
                },
                stepControllerFeedback: {
                    ...v.stepControllerFeedback,
                    modal: {
                        display: true,
                        message: 'Plans and Add-ons data is missing',
                    },
                },
            }));
            return;
        }
        if (shouldSendPriceOrderRequest) {
            const value = getPriceOrderRequestBody(
                state.tableData.finalData,
                plansAndAddons,
                state.applyCredit,
                state.uiData.effectiveDateString,
                state.accountDetails,
                state.customerInfo,
                state.accountInfo,
                state.accountBalances
            );
            window[window.sessionStorage?.tabId].sendgetPriceOrderAsyncMachine(
                'RESET'
            );
            window[window.sessionStorage?.tabId].sendgetPriceOrderAsyncMachine(
                'SET.REQUEST.DATA',
                {
                    value,
                }
            );
            setState((v) => ({
                ...v,
                priceOrderRequest: value,
                priceOrderData: undefined,
                lastAPICall: undefined,
                uiData: {
                    ...v.uiData,
                    lastAction: 'click/price-order',
                    applyCreditToggled: v.applyCredit,
                },
            }));
            setPriceOrderButtonData((content) => ({
                ...content,
                disabled: true,
                loading: true,
                label: 'Pricing Order...',
            }));
            setTimeout(() => {
                window[
                    window.sessionStorage?.tabId
                ].sendgetPriceOrderAsyncMachine('REFETCH');
            }, 500);
            return;
        }
        setState((v) => ({
            ...v,
            uiData: {
                ...v.uiData,
                lastAction: 'modal/price-order-bad-request',
            },
            stepControllerFeedback: {
                ...v.stepControllerFeedback,
                modal: {
                    display: true,
                    message:
                        tableRows.length === 0
                            ? 'Select at least one line.'
                            : 'Perform at least one plan/feature change to line(s).',
                },
            },
        }));
    }
};
const showPriceOrderMsg = () => {
    message.warning({
        content: 'Please Price the Order for changes to take effect',
        style: { position: 'absolute', top: 150, right: 20 },
    });
};
const DueForm = ({
    dataHook: [state = {}, setState = () => {}],
    className = '',
    shouldSendPriceOrderRequest,
    disableToday = false,
    disableNextBill = false,
    onNextClick,
    plansAndAddonsData,
    setIsTabletPlanFailed,
    insuranceMessage,
    tableRows,
}) => {
    const {
        uiData: { effective, lastAction, applyCreditToggled = false },
        tableData: { finalData },
        priceOrderData = undefined,
        lastAPICall,
        dueDate = null,
        accountDetails,
        accountBalances,
        customerInfo,
        applyCredit = false,
    } = state;
    const [cancelLines, setCancelLines] = useState(false);
    const [linesSelected, setLinesSelected] = useState([]);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [priceOrderButtonData, setPriceOrderButtonData] = useState({
        loading: false,
        label: 'Price Order',
        disabled: true,
        next: false,
    });
    const [linesChange, setLinesChange] = useState(false);
    const [confirmationTablePopUp, setConfirmationTablePopUp] = useState(false);
    const [contentConfirmationModal, setContentConfirmationModal] = useState({
        title: '',
        content: '',
        clickFrom: '',
    });
    const [responseData, setResponseData] = useState([]);
    const [ctnNumber, setCtnNumber] = useState([]);

    const handleError = (validations) => {
        const [returningValue, warningErrors, ErrorModal] = errorHandlerCode(
            validations
        );
        if (returningValue) {
            setIsTabletPlanFailed(returningValue);
            setContentConfirmationModal({
                title: '',
                content: ErrorModal,
                variables: {
                    errorMessage: warningErrors[0]?.warningDescription,
                    technicalDetails: [
                        {
                            code: warningErrors[0]?.warningCode,
                            message: warningErrors[0]?.warningDescription,
                        },
                    ],
                },
                clickFrom: 'maxPlanTablet',
                okText: '',
                cancelText: '',
            });
            setConfirmationTablePopUp(returningValue);
        }
        return returningValue;
    };

    useEffect(() => {
        console.log('content', contentConfirmationModal);
    }, [contentConfirmationModal]);

    const changeOneInMultiLineContent = () => {
        setContentConfirmationModal({
            title: 'Select Tablets for Cancellation',
            content: ContentTwoLines,
            variables: {
                title: `Which ${ctnNumber.tabletPlansToCancel.length} tablet lines would you like cancel?`,
                numberOfLines: ctnNumber.tabletPlansToCancel.length,
                ctn: ctnNumber.ctnRelated,
                responseData,
                state,
                setState,
                linesSelected,
                setLinesSelected,
                setContentConfirmationModal,
                setCancelLines,
                cancelLines,
                setLinesChange,
            },
            clickFrom: 'tableMultiLineCancellation',
            okText: 'Cancel Tablet',
            cancelText: 'Exit',
        });
        setConfirmationTablePopUp(true);
    };
    useEffect(() => {
        if (linesChange) {
            const validateLines =
                ctnNumber.tabletPlansToCancel.length > ctnNumber.validationsCtns
                    ? ctnNumber.validationsCtns
                    : ctnNumber.tabletPlansToCancel.length;
            setButtonDisabled(!(linesSelected.length === validateLines));
        }
        setLinesChange(false);
    }, [linesChange]);
    const changeOneInMultiLine = (
        tabletLines,
        selectedLines,
        tabletCompatibleLines,
        showPopup
    ) => {
        const effectiveDay =
            state?.uiData?.effective === 'today'
                ? 'immediately'
                : state?.accountDetails?.billCycleDate;
        let content;
        let title = '';
        let clickFromLabel;
        let tabletCompatibleLine;
        const totalTabletLines =
            selectedLines.length > tabletLines.length
                ? tabletLines.length
                : selectedLines.length;
        if (!showPopup) {
            content = `Continuing with this activity will leave no qualifying UNL plan to support the Tablet line. As a result, your tablet line will be cancelled. If you want to keep the tablet line, please exit this activity and change the tablet line to a Simply Data line and start this activity again.
          `;
            clickFromLabel = 'cancelling all tablets';
        } else {
            if (tabletCompatibleLines.length > 1) {
                tabletCompatibleLine = tabletCompatibleLines.join(' & ');
                content = `If you proceed with changing the rate plan for CTN: ${tabletCompatibleLine}, you will need to cancel ${totalTabletLines} tablet line(s). Do you want to proceed with the change?`;
            } else {
                content = `If you proceed with changing the rate plan for CTN: ${tabletCompatibleLines[0]} there will be no remaining qualifying UNL line to quality for the tablet rate plan. The tablet line will be cancelled ${effectiveDay}. Do you wish to proceed?`;
            }
            clickFromLabel = 'tabletMultiLine';
            title = 'Would you like to proceed?';
        }
        setContentConfirmationModal({
            title,
            content,
            clickFrom: clickFromLabel,
            variables: {
                selectedLines,
                tabletLines,
                showPopup,
            },
            nextPlan: 'changeOne2MultiLineCancellation',
            okText: 'Yes',
            cancelText: 'No',
        });
        setConfirmationTablePopUp(true);
    };
    const isPriceOrderPopulated = Object.keys(priceOrderData || {}).length > 0;
    useEffect(() => {
        if (
            isPriceOrderPopulated &&
            lastAPICall === 'pending/priceOrderData' &&
            !String(lastAction).startsWith('reset')
        ) {
            setPriceOrderButtonData((buttonData) => ({
                ...buttonData,
                disabled: applyCreditToggled == applyCredit,
                loading: false,
                label: 'Price Order',
            }));
            if (applyCreditToggled != applyCredit) {
                showPriceOrderMsg();
            }
        } else if (
            (isPriceOrderPopulated && lastAPICall !== 'error/priceOrder') ||
            String(lastAction).startsWith('reset')
        ) {
            setPriceOrderButtonData((buttonData) => ({
                ...buttonData,
                loading: false,
                label: 'Price Order',
            }));
        } else if (lastAPICall === 'error/priceOrder') {
            setPriceOrderButtonData((content) => ({
                ...content,
                disabled: false,
                loading: false,
                label: 'Pricing Failed - Retry',
            }));
            setTimeout(() => {
                setState((v) => ({
                    ...v,
                    uiData: {
                        ...v.uiData,
                        lastAction: 'reset/priceOrder',
                    },
                    lastAPICall: undefined,
                    priceOrderData: undefined,
                }));
            }, 3000);
        }
    }, [isPriceOrderPopulated, lastAPICall, lastAction, applyCredit]);
    useEffect(() => {
        if (!dueDate) {
            setState((v) => ({
                ...v,
                dueDate: accountDetails.billCycleDate,
            }));
        }
    }, [dueDate]);
    useEffect(() => {
        const isThereNewLine = finalData.some(
            (line) => line.activityType === 'ADDLINE'
        );
        if (!effective || effective === '') {
            setPriceOrderButtonData((s) => ({
                ...s,
                disabled: true && !isThereNewLine,
            }));
        } else {
            let missingPlan = true;
            finalData.forEach((row = {}) => {
                if (
                    (row?.plan?.newPlan !== undefined &&
                        Object.keys(row.plan.newPlan).length > 0) ||
                    row.changes.length > 0
                ) {
                    missingPlan = false;
                }
            });
            if (tableRows?.length === 0) {
                setPriceOrderButtonData((s) => ({
                    ...s,
                    disabled: true,
                }));
            } else {
                setPriceOrderButtonData((s) => ({
                    ...s,
                    disabled: missingPlan,
                }));
            }
            if (!missingPlan) {
                showPriceOrderMsg();
            }
        }
    }, [effective, finalData]);
    useEffect(() => {
        if (cancelLines) {
            const selectedRows = state?.uiData?.selected?.tableRows;
            const selectedCtn = [];
            const selectedTablets = [];
            selectedRows.map((element) => {
                const accountSelected = state?.tableData?.finalData[element];
                selectedCtn.push({
                    ctn: `${accountSelected?.telephoneData?.telephoneNumber}`,
                });
            });
            linesSelected.map((element) =>
                selectedTablets.push({ ctn: `${element}` })
            );
            const dataPayload = {
                accountInfo: {
                    billinAccountNumber: `${state?.accountDetails?.ban}`,
                    banStatus: `${state?.accountDetails?.banStatus}`,
                    accountType: `${state?.accountDetails?.accountType}`,
                },
                selectedCtn,
                selectedTablets,
            };
            setState((data) => ({
                ...data,
                mappingTabletLines: dataPayload,
            }));
            setPriceOrderButtonData((content) => ({
                ...content,
                next: true,
            }));
            //callMessageBus(dataPayload, setPriceOrderButtonData, properties, datasources, setIsTabletPlanFailed, setContentConfirmationModal,  setConfirmationTablePopUp);
            setCancelLines(false);
        }
    }, [cancelLines]);
    const onChange = handleOnChange(setState, dueDate);
    const onClick = handleOnPriceClick(
        state,
        setState,
        shouldSendPriceOrderRequest,
        setPriceOrderButtonData,
        plansAndAddonsData
    );

    const selectedPlan = {
        changeOne2MultiLine: (ctn, selectedRows, ctnPlans, showPopup) =>
            changeOneInMultiLine(ctn, selectedRows, ctnPlans, showPopup),
        changeOne2MultiLineCancellation: () => changeOneInMultiLineContent(),
    };

    useEffect(() => {
        const actionPriceOrder = 'click/price-order';
        const stateClickPriceOrder = state?.uiData?.lastAction;
        const responseDataInfo =
            window[window.sessionStorage?.tabId]?.getPriceOrderAsyncMachine
                ?.event?.data;
        setResponseData(responseDataInfo);
        if (responseDataInfo && stateClickPriceOrder === actionPriceOrder) {
            const objectsResponseData = Object.keys(responseDataInfo);
            if (objectsResponseData.includes('validations')) {
                let validations = responseDataInfo?.validations;
                if (!validations) validations = [];
                const errorCodeNotAllow = handleError(validations);
                if (errorCodeNotAllow) return;
                let tabletPlansToCancel = state?.uiData?.selected?.tableRows;
                const tableInformation = state?.tableData?.finalData;
                const lineDetails = state?.lineDetails;
                let showPopup = responseDataInfo?.showTabletSelection;
                const [
                    ctnRelated,
                    validatingLines,
                    selectedRows,
                    changeShowPopup,
                ] = checkTabletPlanToCancel(
                    tableInformation,
                    validations,
                    tabletPlansToCancel,
                    showPopup,
                    lineDetails
                );
                showPopup = changeShowPopup;
                tabletPlansToCancel =
                    tabletPlansToCancel.length > validatingLines.length
                        ? validatingLines
                        : tabletPlansToCancel;
                if (ctnRelated.length !== 0) {
                    setCtnNumber({
                        ctnRelated,
                        tabletPlansToCancel,
                        validationsCtns: validations.length,
                    });
                    let plan = '';
                    setLinesSelected([]);
                    setCancelLines(false);
                    plan = 'changeOne2MultiLine';
                    selectedPlan[plan](
                        ctnRelated,
                        tabletPlansToCancel,
                        selectedRows,
                        showPopup
                    );
                    //}
                } else {
                    setPriceOrderButtonData((content) => ({
                        ...content,
                        next: true,
                    }));
                }
            } else {
                setPriceOrderButtonData((content) => ({
                    ...content,
                    next: true,
                }));
            }
        }
    }, [!priceOrderButtonData.loading]);
    const formClassName = `summary__radio-buttons-wrapper${
        className ? ` ${className}` : ''
    }`;
    const disabledNext = lastAction !== 'click/price-order';

    useEffect(() => {
        if (effective === 'nextBill' && insuranceMessage)
            setState((oldState) => {
                return {
                    ...oldState,
                    uiData: {
                        ...oldState?.uiData,
                        effective: null,
                    },
                };
            });
    }, [insuranceMessage, effective]);

    useEffect(() => {
        if (tableRows?.length === 0) {
            setPriceOrderButtonData({
                ...priceOrderButtonData,
                disabled: true,
            });
        } else if (
            effective &&
            effective !== '' &&
            priceOrderButtonData?.disabled
        ) {
            setPriceOrderButtonData({
                ...priceOrderButtonData,
                disabled: false,
            });
        }
    }, [tableRows]);

    useEffect(() => {
        if (
            state?.uiData?.disabledNextBillCycleTablet &&
            effective === RADIO_VALUES.NEXT_BILL
        ) {
            // if next billCycle is disabled due to tablet but checked -> reset that value
            setState((oldState) => {
                return {
                    ...oldState,
                    uiData: {
                        ...oldState?.uiData,
                        effective: null,
                    },
                };
            });
        }
    }, [state]);

    return (
        <div className={formClassName}>
            <Radio.Group onChange={onChange} value={effective}>
                <Radio value={RADIO_VALUES.TODAY} disabled={disableToday}>
                    Effective Today
                </Radio>
                <Radio
                    value={RADIO_VALUES.NEXT_BILL}
                    className="summary__radio--nextBill"
                    disabled={
                        disableNextBill ||
                        state?.uiData?.disabledNextBillCycleTablet
                    }
                >
                    {insuranceMessage ||
                    state?.uiData?.disabledNextBillCycleTablet ? (
                        <Tooltip
                            title={
                                state?.uiData?.disabledNextBillCycleTablet
                                    ? TARGET_ACTIVITY_NEXT_BILL_CYCLE_TOOLTIP
                                    : insuranceMessage
                            }
                        >
                            <span>Next Bill Cycle&nbsp;</span>
                            <span>({dueDate && dueDate})</span>
                        </Tooltip>
                    ) : (
                        <>
                            <span>Next Bill Cycle&nbsp;</span>
                            <span>({dueDate && dueDate})</span>
                        </>
                    )}
                </Radio>
            </Radio.Group>
            <div className="summary__buttons">
                <Button
                    className="summary__button summary__button--price-order"
                    type="text"
                    onClick={onClick}
                    disabled={priceOrderButtonData.disabled}
                    loading={priceOrderButtonData.loading}
                >
                    {priceOrderButtonData.label}
                </Button>
                <Button
                    className="summary__button summary__button--next"
                    type="text"
                    onClick={onNextClick}
                    disabled={
                        disabledNext ||
                        !priceOrderButtonData.disabled ||
                        priceOrderButtonData.loading ||
                        !priceOrderButtonData.next
                    }
                >
                    Next
                </Button>
            </div>
            <TablePopUp
                confirmationESimPopUp={confirmationTablePopUp}
                setConfirmationESimPopUp={setConfirmationTablePopUp}
                contentConfirmationModal={contentConfirmationModal}
                statusData={setPriceOrderButtonData}
                selectedPlan={selectedPlan}
                setContentConfirmationModal={setContentConfirmationModal}
                buttonDisabled={buttonDisabled}
                setButtonDisabled={setButtonDisabled}
            />
        </div>
    );
};
export default DueForm;
