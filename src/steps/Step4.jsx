/* eslint-disable complexity */
import React, { useEffect, useState, useCallback } from 'react';
import { MessageBus } from '@ivoyant/component-message-bus';
import { cache } from '@ivoyant/component-cache';
import { Button } from 'antd';
import PlanItem from '../components/PlanList/PlanItem';
import stepController from '../helpers/stepController';

import './step4.css';

const OFFER_ADJUSTMENT_SUCCESS_MESSAGE_TEXT_CPR =
    'Successfully created adjustment';

const Step4 = ({
    children = false,
    dataHook,
    component,
    properties,
    ...restProps
}) => {
    const [submissionButtonData, setSubmissionButtonData] = useState({
        label: 'Make Payment',
        isLoading: false,
        disabled: false,
    });

    const { params } = component;
    const { groupB = false } = params;

    const [activeKey, setActiveKey] = useState('1');

    useEffect(() => {
        if (groupB) {
            setActiveKey('4');
        }
    }, []);

    const [state, setState] = dataHook;
    const {
        uiData: { summarizedCharges },
        submitOrderData,
        cancelOrderData,
        paymentData,
        lastAPICall,
    } = state;
    const { paymentWorkflows } = properties;

    const isOnlyActivation = dataHook[0]?.tableData?.finalData?.every(
        (row) => row.activityType === 'ACTIVATION'
    );

    const isOnlyAddLine = dataHook[0]?.tableData?.finalData?.every(
        (row) => row.activityType === 'ADDLINE'
    );

    const isPaymentDataPopulated =
        Object.keys(paymentData || {}).length > 0 &&
        (paymentData?.creditCardPaymentDetails?.confirmationCode ||
            paymentData?.pinCardPaymentDetails?.confirmationNumber ||
            paymentData?.message?.includes(
                OFFER_ADJUSTMENT_SUCCESS_MESSAGE_TEXT_CPR
            ));

    const isSubmitOrderPopulated =
        Object.keys(submitOrderData || {}).length > 0 &&
        Object.prototype.hasOwnProperty.call(
            submitOrderData,
            'responseStatus'
        ) &&
        submitOrderData.responseStatus === 200;

    const isCancelOrderPopulated =
        Object.keys(cancelOrderData || {}).length > 0 &&
        Object.prototype.hasOwnProperty.call(
            cancelOrderData,
            'responseStatus'
        ) &&
        [200, 204].includes(cancelOrderData.responseStatus);

    useEffect(() => {
        window[window.sessionStorage?.tabId].setActiveKey = (key) => {
            setActiveKey(key);
        };

        return () => {
            delete window[window.sessionStorage?.tabId].setActiveKey;
        };
    }, []);

    useEffect(() => {
        if (isCancelOrderPopulated) {
            if (
                cancelOrderData.responseStatus === 204 ||
                cancelOrderData.status === 'SUCCESS'
            ) {
                setState((v) => ({
                    ...v,
                    createOrderData: undefined,
                    cancelOrderData: undefined,
                    submitOrderData: undefined,
                    uiData: {
                        ...v.uiData,
                        lastAction: `back/1`,
                    },
                    current: 0,
                }));
            }
        }
    }, [isCancelOrderPopulated]);

    const [createConsentData, setCreateConsentData] = useState(undefined);

    useEffect(() => {
        window[window.sessionStorage?.tabId][
            `setCreateConsentData`
        ] = setCreateConsentData;

        return () => {
            delete window[window.sessionStorage?.tabId][`setCreateConsentData`];
        };
    });

    useEffect(() => {
        if (isSubmitOrderPopulated) {
            if (!submitOrderData.errorCode) {
                if (!createConsentData && !isOnlyActivation && !isOnlyAddLine) {
                    window[sessionStorage.tabId][
                        'sendcrp-create-consent-data-async-machine'
                    ]('FETCH');
                } else {
                    setState((s) => ({
                        ...s,
                        current: s.current + 1,
                    }));
                }
            } else {
                setSubmissionButtonData(() => ({
                    disabled: false,
                    isLoading: false,
                    label: 'Failed to Submit Order',
                }));
                setState((s) => ({
                    ...s,
                    submitOrderData: undefined,
                    lastAPICall: undefined,
                    apiErrors: {
                        code: submitOrderData.errorCode,
                        message: submitOrderData.message,
                    },
                }));
            }
        } else if (lastAPICall === 'error/submitOrder') {
            setState((s) => ({
                ...s,
                lastAPICall: undefined,
            }));
            setSubmissionButtonData({
                isLoading: false,
                disabled: false,
                label: 'Failed to Submit Order',
            });
        }
    }, [isSubmitOrderPopulated, lastAPICall, createConsentData]);

    useEffect(() => {
        if (!paymentData) {
            setSubmissionButtonData((s) => ({
                ...s,
                label: activeKey !== '4' ? 'Make Payment' : 'Send Text',
            }));
        } else if (paymentData) {
            if (
                paymentData?.creditCardPaymentDetails?.confirmationCode ||
                paymentData?.pinCardPaymentDetails?.confirmationNumber ||
                paymentData?.message?.includes(
                    OFFER_ADJUSTMENT_SUCCESS_MESSAGE_TEXT_CPR
                )
            ) {
                setSubmissionButtonData(() => ({
                    disabled: false,
                    isLoading: false,
                    label: 'Submit Order',
                }));
            } else {
                setSubmissionButtonData(() => ({
                    disabled: true,
                    isLoading: false,
                    label: 'Failed to Make Payment',
                }));
            }
        }
    }, [activeKey, isPaymentDataPopulated]);

    const data = {
        dueAmount: dataHook[0].priceOrderData.priceSummary.dueAmount,
        billingAccountNumber:
            dataHook[0].priceOrderRequest.accountInfo.billingAccountNumber,
        lines: dataHook[0].createOrderData?.lines?.map(
            (l) => l.customerTelephoneNumber
        ),
    };
    cache.put('crpPayment', data);

    const PaymentForms = React.useMemo(
        () =>
            React.Children.map(children, (child) => {
                if (child.key === 'crp-billing-history') {
                    return false;
                }

                return React.cloneElement(child, {
                    parentProps: restProps,
                });
            }).filter((c) => c !== false),
        []
    );

    // handle payment states
    const handlePaymentStates = (successStates, errorStates) => (
        subscriptionId,
        topic,
        eventData,
        closure
    ) => {
        const isSuccess = successStates.includes(eventData.value);
        const isError = errorStates.includes(eventData.value);
        const successText = eventData?.event?.data?.data?.successData;
        const successPayload = successText ? JSON.parse(successText) : {};
        // On success pushing the current to step 4
        if (isSuccess || isError) {
            if (isSuccess && successText) {
                setState((s) => ({
                    ...s,
                    paymentData: successPayload,
                    lastAPICall: `pending/paymentData`,
                }));
            }
        }
    };

    // Listening to message bus state changes
    useEffect(() => {
        if (paymentWorkflows) {
            paymentWorkflows.forEach(
                ({ workflow, successStates, errorStates }) => {
                    MessageBus.subscribe(
                        `${workflow}.crp`,
                        'WF.'.concat(workflow).concat('.STATE.CHANGE'),
                        handlePaymentStates(successStates, errorStates),
                        {}
                    );
                }
            );
        }

        return () => {
            paymentWorkflows?.forEach(({ workflow }) => {
                MessageBus.unsubscribe(`${workflow}.crp`);
            });
            cache.remove('crpPayment'); // remove it on unmount
        };
    }, []);

    const onNextClick = () => {
        stepController('next', 4, dataHook, {
            activeKey,
            paymentData,
            setSubmissionButtonData,
        });
    };

    return (
        <div className="step-3-wrapper--parent">
            <div className="step-3-wrapper--payment-form-summary">
                <div className="step-3-wrapper__payment-form">
                    {PaymentForms}
                </div>
                <div className="step-3-wrapper__summary-table">
                    <span className="step-3__summary-table-title">Summary</span>
                    <PlanItem charges={summarizedCharges?.proposed} />
                </div>
            </div>
            <div className="step-3-wrapper__buttons">
                <div></div>
                {/* Show the SUBMIT ORDER button only if payment is successful */}
                {/* 
                    for offer adjustment as payment -> we need to check
                    paymentData?.message?.includes('Successfully created adjustment')
                    This is a no-op but for now refactoring to handle this case with minimal change to the CRP flow
                    // TODO: Refactor needed - API can return a flag when adjustment is done
                    // !INFO: Search for 'pinCardPaymentDetails' or 'creditCardPaymentDetails'
                */}
                {(paymentData?.creditCardPaymentDetails?.confirmationCode ||
                    paymentData?.pinCardPaymentDetails?.confirmationNumber ||
                    paymentData?.message?.includes(
                        OFFER_ADJUSTMENT_SUCCESS_MESSAGE_TEXT_CPR
                    )) && (
                    <Button
                        className="step-3-wrapper__submission-button"
                        loading={submissionButtonData.isLoading}
                        onClick={onNextClick}
                        type="primary"
                        disabled={submissionButtonData.disabled}
                    >
                        {submissionButtonData.label}
                    </Button>
                )}
            </div>
        </div>
    );
};

export default Step4;
