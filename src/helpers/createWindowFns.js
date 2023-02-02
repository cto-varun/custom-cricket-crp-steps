import {
    next,
    prev,
    reset,
    sendcrpPaymentFormValueCollector,
} from './stepController';

export const stateDebugger = (id, state, setState) => () => {
    window[window.sessionStorage?.tabId][`${id}--debug`] = (
        getProperty = '',
        showDebug = false,
        shouldClear = true
    ) => {
        if (shouldClear) {
            global.console.clear();
        }

        setState((v) => ({ ...v, showDebug, getProperty }));
    };

    return () => {
        delete window[window.sessionStorage?.tabId][`${id}--debug`];
    };
};

const updateOrderData = (name, setState) => ({ payload }) => {
    setState((s) => ({
        ...s,
        [name]: payload,
        lastAPICall: `pending/${name}`,
    }));
};

const updateErrors = (setState) => (name, { value }) => {
    if (typeof name === 'string') {
        setState((s) => ({
            ...s,
            apiErrors: value,
            lastAPICall: `error/${name}`,
        }));
    }

    if (typeof name === 'object') {
        setState((s) => ({
            ...s,
            displayCRPErrors: name.displayCRPErrors,
            apiErrors: value,
            lastAPICall: `error/${name.name}`,
        }));
    }
};

const createWindowFns = (id, state, setState) => () => {
    window[window.sessionStorage?.tabId][`${id}--next`] = next(setState);
    window[window.sessionStorage?.tabId][`${id}--prev`] = prev(setState);
    window[window.sessionStorage?.tabId][`${id}--reset`] = reset(setState);
    window[window.sessionStorage?.tabId][
        `${id}--updatePriceOrderDataState`
    ] = updateOrderData('priceOrderData', setState);
    window[window.sessionStorage?.tabId][
        `${id}--updateCreateOrderState`
    ] = updateOrderData('createOrderData', setState);
    window[window.sessionStorage?.tabId][
        `${id}--updateGetPlansAndAddOnsState`
    ] = updateOrderData('getplansandaddonsResponse', setState);

    window[window.sessionStorage?.tabId][
        `${id}--updateSubmitOrderState`
    ] = updateOrderData('submitOrderData', setState);
    window[window.sessionStorage?.tabId][
        `${id}--updateGetConsentState`
    ] = updateOrderData('getConsentData', setState);
    window[window.sessionStorage?.tabId][
        `${id}--updateCreateConsentState`
    ] = updateOrderData('createConsentData', setState);
    window[window.sessionStorage?.tabId][
        `${id}--updatePaymentState`
    ] = updateOrderData('paymentData', setState);
    window[window.sessionStorage?.tabId][
        `${id}--updateCancelOrderState`
    ] = updateOrderData('cancelOrderData', setState);
    window[window.sessionStorage?.tabId][`${id}--updateErrors`] = updateErrors(
        setState
    );
    window[
        window.sessionStorage?.tabId
    ].sendcrpPaymentFormValueCollector = sendcrpPaymentFormValueCollector(
        state
    );
    return () => {
        delete window[window.sessionStorage?.tabId][`${id}--next`];
        delete window[window.sessionStorage?.tabId][`${id}--prev`];
        delete window[window.sessionStorage?.tabId][`${id}--reset`];
        delete window[window.sessionStorage?.tabId][
            `${id}--updatePriceOrderDataState`
        ];
        delete window[window.sessionStorage?.tabId][
            `${id}--updateCreateOrderState`
        ];
        delete window[window.sessionStorage?.tabId][
            `${id}--updateGetPlansAndAddOnsState`
        ];
        delete window[window.sessionStorage?.tabId][
            `${id}--updateSubmitOrderState`
        ];
        delete window[window.sessionStorage?.tabId][
            `${id}--updateCreateConsentState`
        ];
        delete window[window.sessionStorage?.tabId][
            `${id}--updateGetConsentState`
        ];
        delete window[window.sessionStorage?.tabId][`${id}--updateErrors`];
        delete window[window.sessionStorage?.tabId][
            `${id}--updatePaymentState`
        ];
        delete window[window.sessionStorage?.tabId][
            `${id}--updateCancelOrderState`
        ];
        delete window[window.sessionStorage?.tabId]
            .sendcrpPaymentFormValueCollector;
    };
};

export default createWindowFns;
