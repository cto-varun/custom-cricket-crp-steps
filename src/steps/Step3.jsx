/* eslint-disable complexity */
import React, { useState, useEffect } from 'react';
import { MessageBus } from '@ivoyant/component-message-bus';
import { cache } from '@ivoyant/component-cache';
import { Button, Alert, Result, Spin, Typography, Tooltip } from 'antd';
import stepController from '../helpers/stepController';
import { useHistory } from 'react-router-dom';
import { sendSubmitOrderRequest } from '../helpers/stepController';
import './step3.css';
import UpdateOrder from '../components/Order/UpdateOrder';
import OrderList from '../components/Order/OrderList';

const Step3 = ({
    children = false,
    dataHook,
    component,
    properties,
    datasources,
    ...restProps
}) => {
    const [orderDetails, setOrderDetails] = useState(false);
    const [state, setState] = dataHook;
    const {
        priceOrderData,
        createOrderData,
        submitOrderData,
        uiData: { effective },
    } = state;
    const { workflows } = properties;
    const [loading, setLoading] = useState(false);
    const [editOrder, setEditOrder] = useState(false);
    const [orderError, setOrderError] = useState(null);
    const [updateOrderLoading, setUpdateOrderLoading] = useState(false);
    const [cancelOrderLoading, setCancelOrderLoading] = useState(false);
    const [showCancelOrder, setShowCancelOrder] = useState(false);
    const [cancelOrderDetails, setCancelOrderDetails] = useState({});
    const [disable, setDisable] = useState(false);
    const [success, setSuccess] = useState('');
    const history = useHistory();
    const { dueAmount } = priceOrderData?.priceSummary;
    const [submitButtonData, setSubmitButtonData] = useState({
        label: 'Submit order',
        isLoading: false,
    });

    const isSubmitOrderPopulated =
        Object.keys(submitOrderData || {}).length > 0 &&
        Object.prototype.hasOwnProperty.call(
            submitOrderData,
            'responseStatus'
        ) &&
        submitOrderData.responseStatus === 200;

    const handleCheckOrderStatus = () => {
        const {
            workflow,
            datasource,
            successStates,
            errorStates,
            responseMapping,
        } = workflows?.searchOrders;
        setLoading(true);
        setOrderError('');
        MessageBus.send('WF.'.concat(workflow).concat('.INIT'), {
            header: {
                registrationId: workflow,
                workflow,
                eventType: 'INIT',
            },
        });

        MessageBus.subscribe(
            workflow,
            'WF.'.concat(workflow).concat('.STATE.CHANGE'),
            handleSearchOrderResponse(successStates, errorStates),
            {}
        );
        MessageBus.send('WF.'.concat(workflow).concat('.').concat('SUBMIT'), {
            header: {
                registrationId: workflow,
                workflow,
                eventType: 'SUBMIT',
            },
            body: {
                datasource: datasources[datasource],
                request: { body: { uuid: createOrderData?.uuid } },
                responseMapping,
            },
        });
    };

    const handleSearchOrderResponse = (successStates, errorStates) => (
        subscriptionId,
        topic,
        eventData,
        closure
    ) => {
        const state = eventData.value;
        const isSuccess = successStates.includes(state);
        const isFailure = errorStates.includes(state);
        // On success pushing the current to step 4
        if (isSuccess || isFailure) {
            if (isSuccess) {
                const responsePayload = eventData?.event.data?.data;
                const {
                    orderAccountInfo,
                    ...rest
                } = responsePayload?.orders[0];
                setOrderDetails({
                    ...rest,
                    ...orderAccountInfo,
                    key: rest.orderId,
                });
                setState((v) => ({
                    ...v,
                    orderDetails: {
                        ...rest,
                        ...orderAccountInfo,
                        key: rest.orderId,
                    },
                }));
            }

            // On Error display the pop up with error
            if (isFailure) {
                setOrderError(
                    `Order details not available. Please click on Check Order Status after few seconds to try again!`
                );
            }
            MessageBus.unsubscribe(subscriptionId);
            setLoading(false);
        }
    };

    useEffect(() => {
        setDisable(
            orderDetails
                ? orderDetails?.orderStepStatus === 'OKTOSUBMIT'
                    ? false
                    : true
                : true
        );
    }, [orderDetails]);

    const handleUpdateOrder = (body) => {
        setUpdateOrderLoading(true);
        setOrderError('');
        const {
            workflow,
            datasource,
            successStates,
            errorStates,
            responseMapping,
        } = workflows?.updateOrder;
        MessageBus.send('WF.'.concat(workflow).concat('.INIT'), {
            header: {
                registrationId: workflow,
                workflow,
                eventType: 'INIT',
            },
        });

        MessageBus.subscribe(
            workflow,
            'WF.'.concat(workflow).concat('.STATE.CHANGE'),
            handleUpdateOrderResponse(successStates, errorStates),
            {}
        );
        MessageBus.send('WF.'.concat(workflow).concat('.').concat('SUBMIT'), {
            header: {
                registrationId: workflow,
                workflow,
                eventType: 'SUBMIT',
            },
            body: {
                datasource: datasources[datasource],
                request: {
                    body: body,
                    params: { uuid: createOrderData?.uuid },
                },
                responseMapping,
            },
        });
    };

    const handleUpdateOrderResponse = (successStates, errorStates) => (
        subscriptionId,
        topic,
        eventData,
        closure
    ) => {
        const state = eventData.value;
        const isSuccess = successStates.includes(state);
        const isFailure = errorStates.includes(state);
        if (isSuccess || isFailure) {
            if (isSuccess) {
                const responsePayload = eventData?.event.data?.data;
                if (
                    responsePayload?.linesPortInFaultInfo?.length > 0 &&
                    responsePayload?.linesPortInFaultInfo[0]?.faultInfo
                ) {
                    let portErrorMessage = responsePayload?.linesPortInFaultInfo
                        ?.map(
                            ({ ctn, faultInfo }) =>
                                `${ctn} : ${faultInfo?.message}`
                        )
                        ?.join('. ');
                    setOrderError(
                        portErrorMessage || 'Error updating the details!'
                    );
                } else {
                    setOrderError('');
                    setSuccess('Successfully updated the order!');
                    setEditOrder(false);
                    handleCheckOrderStatus();
                }
            }

            // On Error display the pop up with error
            if (isFailure) {
                setOrderError('Error updating the details!');
            }
            setUpdateOrderLoading(false);
            MessageBus.unsubscribe(subscriptionId);
        }
    };

    const handleCancelOrder = () => {
        setShowCancelOrder(true);
        setCancelOrderLoading(true);
        const {
            workflow,
            datasource,
            successStates,
            errorStates,
            responseMapping,
        } = workflows?.cancelOrder;

        MessageBus.send('WF.'.concat(workflow).concat('.INIT'), {
            header: {
                registrationId: workflow,
                workflow,
                eventType: 'INIT',
            },
        });

        MessageBus.subscribe(
            workflow,
            'WF.'.concat(workflow).concat('.STATE.CHANGE'),
            handleCancelOrderResponse(successStates, errorStates),
            {}
        );

        MessageBus.send('WF.'.concat(workflow).concat('.').concat('SUBMIT'), {
            header: {
                registrationId: workflow,
                workflow,
                eventType: 'SUBMIT',
            },
            body: {
                datasource: datasources[datasource],
                request: {
                    params: { uuid: createOrderData?.uuid },
                },
                responseMapping,
            },
        });
    };

    const handleCancelOrderResponse = (successStates, errorStates) => (
        subscriptionId,
        topic,
        eventData,
        closure
    ) => {
        const state = eventData.value;
        const isSuccess = successStates.includes(state);
        const isFailure = errorStates.includes(state);
        if (isSuccess || isFailure) {
            if (isSuccess) {
                setCancelOrderLoading(false);
                setCancelOrderDetails({
                    status: 'success',
                    title: 'Successfully cancelled the order!!',
                });
                setTimeout(() => {
                    history.push('/dashboards/manage-account');
                }, 2000);
            }

            if (isFailure) {
                setCancelOrderLoading(false);
                setCancelOrderDetails({
                    status: 'error',
                    title: 'Error cancelling the order!!',
                });
            }

            MessageBus.unsubscribe(subscriptionId);
        }
    };

    useEffect(() => {
        if (isSubmitOrderPopulated) {
            if (!submitOrderData.errorCode) {
                setState((s) => ({
                    ...s,
                    current: s.current + 2,
                }));
            } else {
                setSubmitButtonData(() => ({
                    isLoading: false,
                    label: 'Failed to Submit Order',
                    disabled: false,
                }));
                setState((s) => ({
                    ...s,
                    apiErrors: {
                        code: submitOrderData.errorCode,
                        message: submitOrderData.errorMessage,
                    },
                }));
            }
        }
    }, [isSubmitOrderPopulated]);

    const onNextClick = () => {
        if (dueAmount > 0 && effective === 'today') {
            setState((v) => ({
                ...v,
                current: v.current + 1,
            }));
        } else if (!isSubmitOrderPopulated) {
            setSubmitButtonData(() => ({
                isLoading: true,
                label: 'Submitting Order...',
                disabled: true,
            }));
            setTimeout(() => {
                sendSubmitOrderRequest(state);
            }, 500);
        }
    };

    return (
        <div className="step-3-wrapper--parent">
            <div className="step-3-wrapper--payment-form-summary">
                Order Details
            </div>
            <div>
                {showCancelOrder && (
                    <div className="view-container d-flex justify-content-center align-items-center">
                        {cancelOrderLoading ? (
                            <div className="content">
                                <div className="element">
                                    <Spin size="large" />
                                </div>
                                <div className="element text-center">
                                    <Typography.Title level={3}>
                                        Cancelling order...
                                    </Typography.Title>
                                </div>
                            </div>
                        ) : (
                            <Result
                                status={cancelOrderDetails?.status}
                                title={cancelOrderDetails?.title}
                                extra={[
                                    <Button
                                        onClick={() =>
                                            setShowCancelOrder(false)
                                        }
                                    >
                                        Close
                                    </Button>,
                                ]}
                            />
                        )}
                    </div>
                )}
                {orderDetails && (
                    <OrderList
                        isLoading={loading}
                        data={[orderDetails]}
                        onEditOrder={() => setEditOrder(true)}
                        onCancelOrder={() => handleCancelOrder()}
                    />
                )}
                {orderError && (
                    <Alert
                        message={orderError}
                        style={{ marginTop: 12 }}
                        type="error"
                        showIcon
                    />
                )}
                {success && (
                    <Alert
                        message={success}
                        style={{ marginTop: 12 }}
                        type="success"
                        showIcon
                    />
                )}
                {editOrder && (
                    <UpdateOrder
                        order={orderDetails}
                        onUpdateOrder={(body) => handleUpdateOrder(body)}
                        setEditOrder={() => setEditOrder(false)}
                        loading={updateOrderLoading}
                    />
                )}
            </div>
            <div className="step-3-wrapper__buttons">
                <div></div>
                <div>
                    <Button
                        className="step-3-wrapper__submission-button"
                        loading={submitButtonData?.isLoading}
                        onClick={() => {
                            if (disable) {
                                handleCheckOrderStatus();
                            } else {
                                onNextClick();
                            }
                        }}
                        type="primary"
                    >
                        {disable
                            ? 'Check Order Status'
                            : dueAmount > 0 && effective === 'today'
                            ? 'Continue to payment'
                            : submitButtonData?.label}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Step3;
