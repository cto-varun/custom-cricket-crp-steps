import { cache } from '@ivoyant/component-cache';
import { MessageBus } from '@ivoyant/component-message-bus';

const redirectOnModalClose = (setState, onCompleteEvent) => (
    message,
    route = '/dashboards/manage-account#devicesummary',
    delay = 500
) => {
    setState((s) => ({
        ...s,
        stepControllerFeedback: {
            ...s.stepControllerFeedback,
            modal: {
                ...s.stepControllerFeedback.modal,
                display: true,
                className: 'step-4__modal--success',
                message,
                onCancel: (_state, _setState, defaultModalState) => () => {
                    _setState((_s) => ({
                        ..._s,
                        stepControllerFeedback: {
                            ..._s.stepControllerFeedback,
                            modal: {
                                ..._s.stepControllerFeedback.modal,
                                display: false,
                            },
                        },
                    }));

                    setTimeout(() => {
                        setState((_s) => ({
                            ..._s,
                            stepControllerFeedback: {
                                ..._s.stepControllerFeedback,
                                modal: defaultModalState,
                            },
                        }));
                        const newAccountInfo = cache.get('newAccountInfo');
                        if (newAccountInfo) {
                            cache.remove('newAccountInfo');
                            window[
                                window.sessionStorage?.tabId
                            ].unauthenticate();
                            window[window.sessionStorage?.tabId].navigateRoute(
                                route
                            );
                        } else {
                            window[window.sessionStorage?.tabId].navigateRoute(
                                route
                            );
                        }
                        window[sessionStorage?.tabId].dispatchRedux(
                            'DATA_REQUEST',
                            {
                                loadLatest: true,
                                datasources: [
                                    '360-feature-flagging',
                                    '360-customer-view',
                                    '360-account-balances',
                                    '360-customer-additional-info'
                                ],
                            }
                        );
                        MessageBus.send(onCompleteEvent, {});
                    }, delay);
                },
            },
        },
    }));
};

export default redirectOnModalClose;
