"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _componentMessageBus = require("@ivoyant/component-message-bus");
var _componentCache = require("@ivoyant/component-cache");
var _antd = require("antd");
var _stepController = _interopRequireWildcard(require("../helpers/stepController"));
var _reactRouterDom = require("react-router-dom");
require("./step3.css");
var _UpdateOrder = _interopRequireDefault(require("../components/Order/UpdateOrder"));
var _OrderList = _interopRequireDefault(require("../components/Order/OrderList"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/* eslint-disable complexity */

const Step3 = _ref => {
  let {
    children = false,
    dataHook,
    component,
    properties,
    datasources,
    ...restProps
  } = _ref;
  const [orderDetails, setOrderDetails] = (0, _react.useState)(false);
  const [state, setState] = dataHook;
  const {
    priceOrderData,
    createOrderData,
    submitOrderData,
    uiData: {
      effective
    }
  } = state;
  const {
    workflows
  } = properties;
  const [loading, setLoading] = (0, _react.useState)(false);
  const [editOrder, setEditOrder] = (0, _react.useState)(false);
  const [orderError, setOrderError] = (0, _react.useState)(null);
  const [updateOrderLoading, setUpdateOrderLoading] = (0, _react.useState)(false);
  const [cancelOrderLoading, setCancelOrderLoading] = (0, _react.useState)(false);
  const [showCancelOrder, setShowCancelOrder] = (0, _react.useState)(false);
  const [cancelOrderDetails, setCancelOrderDetails] = (0, _react.useState)({});
  const [disable, setDisable] = (0, _react.useState)(false);
  const [success, setSuccess] = (0, _react.useState)('');
  const history = (0, _reactRouterDom.useHistory)();
  const {
    dueAmount
  } = priceOrderData?.priceSummary;
  const [submitButtonData, setSubmitButtonData] = (0, _react.useState)({
    label: 'Submit order',
    isLoading: false
  });
  const isSubmitOrderPopulated = Object.keys(submitOrderData || {}).length > 0 && Object.prototype.hasOwnProperty.call(submitOrderData, 'responseStatus') && submitOrderData.responseStatus === 200;
  const handleCheckOrderStatus = () => {
    const {
      workflow,
      datasource,
      successStates,
      errorStates,
      responseMapping
    } = workflows?.searchOrders;
    setLoading(true);
    setOrderError('');
    _componentMessageBus.MessageBus.send('WF.'.concat(workflow).concat('.INIT'), {
      header: {
        registrationId: workflow,
        workflow,
        eventType: 'INIT'
      }
    });
    _componentMessageBus.MessageBus.subscribe(workflow, 'WF.'.concat(workflow).concat('.STATE.CHANGE'), handleSearchOrderResponse(successStates, errorStates), {});
    _componentMessageBus.MessageBus.send('WF.'.concat(workflow).concat('.').concat('SUBMIT'), {
      header: {
        registrationId: workflow,
        workflow,
        eventType: 'SUBMIT'
      },
      body: {
        datasource: datasources[datasource],
        request: {
          body: {
            uuid: createOrderData?.uuid
          }
        },
        responseMapping
      }
    });
  };
  const handleSearchOrderResponse = (successStates, errorStates) => (subscriptionId, topic, eventData, closure) => {
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
          key: rest.orderId
        });
        setState(v => ({
          ...v,
          orderDetails: {
            ...rest,
            ...orderAccountInfo,
            key: rest.orderId
          }
        }));
      }

      // On Error display the pop up with error
      if (isFailure) {
        setOrderError(`Order details not available. Please click on Check Order Status after few seconds to try again!`);
      }
      _componentMessageBus.MessageBus.unsubscribe(subscriptionId);
      setLoading(false);
    }
  };
  (0, _react.useEffect)(() => {
    setDisable(orderDetails ? orderDetails?.orderStepStatus === 'OKTOSUBMIT' ? false : true : true);
  }, [orderDetails]);
  const handleUpdateOrder = body => {
    setUpdateOrderLoading(true);
    setOrderError('');
    const {
      workflow,
      datasource,
      successStates,
      errorStates,
      responseMapping
    } = workflows?.updateOrder;
    _componentMessageBus.MessageBus.send('WF.'.concat(workflow).concat('.INIT'), {
      header: {
        registrationId: workflow,
        workflow,
        eventType: 'INIT'
      }
    });
    _componentMessageBus.MessageBus.subscribe(workflow, 'WF.'.concat(workflow).concat('.STATE.CHANGE'), handleUpdateOrderResponse(successStates, errorStates), {});
    _componentMessageBus.MessageBus.send('WF.'.concat(workflow).concat('.').concat('SUBMIT'), {
      header: {
        registrationId: workflow,
        workflow,
        eventType: 'SUBMIT'
      },
      body: {
        datasource: datasources[datasource],
        request: {
          body: body,
          params: {
            uuid: createOrderData?.uuid
          }
        },
        responseMapping
      }
    });
  };
  const handleUpdateOrderResponse = (successStates, errorStates) => (subscriptionId, topic, eventData, closure) => {
    const state = eventData.value;
    const isSuccess = successStates.includes(state);
    const isFailure = errorStates.includes(state);
    if (isSuccess || isFailure) {
      if (isSuccess) {
        const responsePayload = eventData?.event.data?.data;
        if (responsePayload?.linesPortInFaultInfo?.length > 0 && responsePayload?.linesPortInFaultInfo[0]?.faultInfo) {
          let portErrorMessage = responsePayload?.linesPortInFaultInfo?.map(_ref2 => {
            let {
              ctn,
              faultInfo
            } = _ref2;
            return `${ctn} : ${faultInfo?.message}`;
          })?.join('. ');
          setOrderError(portErrorMessage || 'Error updating the details!');
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
      _componentMessageBus.MessageBus.unsubscribe(subscriptionId);
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
      responseMapping
    } = workflows?.cancelOrder;
    _componentMessageBus.MessageBus.send('WF.'.concat(workflow).concat('.INIT'), {
      header: {
        registrationId: workflow,
        workflow,
        eventType: 'INIT'
      }
    });
    _componentMessageBus.MessageBus.subscribe(workflow, 'WF.'.concat(workflow).concat('.STATE.CHANGE'), handleCancelOrderResponse(successStates, errorStates), {});
    _componentMessageBus.MessageBus.send('WF.'.concat(workflow).concat('.').concat('SUBMIT'), {
      header: {
        registrationId: workflow,
        workflow,
        eventType: 'SUBMIT'
      },
      body: {
        datasource: datasources[datasource],
        request: {
          params: {
            uuid: createOrderData?.uuid
          }
        },
        responseMapping
      }
    });
  };
  const handleCancelOrderResponse = (successStates, errorStates) => (subscriptionId, topic, eventData, closure) => {
    const state = eventData.value;
    const isSuccess = successStates.includes(state);
    const isFailure = errorStates.includes(state);
    if (isSuccess || isFailure) {
      if (isSuccess) {
        setCancelOrderLoading(false);
        setCancelOrderDetails({
          status: 'success',
          title: 'Successfully cancelled the order!!'
        });
        setTimeout(() => {
          history.push('/dashboards/manage-account');
        }, 2000);
      }
      if (isFailure) {
        setCancelOrderLoading(false);
        setCancelOrderDetails({
          status: 'error',
          title: 'Error cancelling the order!!'
        });
      }
      _componentMessageBus.MessageBus.unsubscribe(subscriptionId);
    }
  };
  (0, _react.useEffect)(() => {
    if (isSubmitOrderPopulated) {
      if (!submitOrderData.errorCode) {
        setState(s => ({
          ...s,
          current: s.current + 2
        }));
      } else {
        setSubmitButtonData(() => ({
          isLoading: false,
          label: 'Failed to Submit Order',
          disabled: false
        }));
        setState(s => ({
          ...s,
          apiErrors: {
            code: submitOrderData.errorCode,
            message: submitOrderData.errorMessage
          }
        }));
      }
    }
  }, [isSubmitOrderPopulated]);
  const onNextClick = () => {
    if (dueAmount > 0 && effective === 'today') {
      setState(v => ({
        ...v,
        current: v.current + 1
      }));
    } else if (!isSubmitOrderPopulated) {
      setSubmitButtonData(() => ({
        isLoading: true,
        label: 'Submitting Order...',
        disabled: true
      }));
      setTimeout(() => {
        (0, _stepController.sendSubmitOrderRequest)(state);
      }, 500);
    }
  };
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "step-3-wrapper--parent"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "step-3-wrapper--payment-form-summary"
  }, "Order Details"), /*#__PURE__*/_react.default.createElement("div", null, showCancelOrder && /*#__PURE__*/_react.default.createElement("div", {
    className: "view-container d-flex justify-content-center align-items-center"
  }, cancelOrderLoading ? /*#__PURE__*/_react.default.createElement("div", {
    className: "content"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "element"
  }, /*#__PURE__*/_react.default.createElement(_antd.Spin, {
    size: "large"
  })), /*#__PURE__*/_react.default.createElement("div", {
    className: "element text-center"
  }, /*#__PURE__*/_react.default.createElement(_antd.Typography.Title, {
    level: 3
  }, "Cancelling order..."))) : /*#__PURE__*/_react.default.createElement(_antd.Result, {
    status: cancelOrderDetails?.status,
    title: cancelOrderDetails?.title,
    extra: [/*#__PURE__*/_react.default.createElement(_antd.Button, {
      onClick: () => setShowCancelOrder(false)
    }, "Close")]
  })), orderDetails && /*#__PURE__*/_react.default.createElement(_OrderList.default, {
    isLoading: loading,
    data: [orderDetails],
    onEditOrder: () => setEditOrder(true),
    onCancelOrder: () => handleCancelOrder()
  }), orderError && /*#__PURE__*/_react.default.createElement(_antd.Alert, {
    message: orderError,
    style: {
      marginTop: 12
    },
    type: "error",
    showIcon: true
  }), success && /*#__PURE__*/_react.default.createElement(_antd.Alert, {
    message: success,
    style: {
      marginTop: 12
    },
    type: "success",
    showIcon: true
  }), editOrder && /*#__PURE__*/_react.default.createElement(_UpdateOrder.default, {
    order: orderDetails,
    onUpdateOrder: body => handleUpdateOrder(body),
    setEditOrder: () => setEditOrder(false),
    loading: updateOrderLoading
  })), /*#__PURE__*/_react.default.createElement("div", {
    className: "step-3-wrapper__buttons"
  }, /*#__PURE__*/_react.default.createElement("div", null), /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_antd.Button, {
    className: "step-3-wrapper__submission-button",
    loading: submitButtonData?.isLoading,
    onClick: () => {
      if (disable) {
        handleCheckOrderStatus();
      } else {
        onNextClick();
      }
    },
    type: "primary"
  }, disable ? 'Check Order Status' : dueAmount > 0 && effective === 'today' ? 'Continue to payment' : submitButtonData?.label))));
};
var _default = Step3;
exports.default = _default;
module.exports = exports.default;