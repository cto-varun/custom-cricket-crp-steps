"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _componentCache = require("@ivoyant/component-cache");
var _componentMessageBus = require("@ivoyant/component-message-bus");
const redirectOnModalClose = (setState, onCompleteEvent) => function (message) {
  let route = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '/dashboards/manage-account#devicesummary';
  let delay = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 500;
  setState(s => ({
    ...s,
    stepControllerFeedback: {
      ...s.stepControllerFeedback,
      modal: {
        ...s.stepControllerFeedback.modal,
        display: true,
        className: 'step-4__modal--success',
        message,
        onCancel: (_state, _setState, defaultModalState) => () => {
          _setState(_s => ({
            ..._s,
            stepControllerFeedback: {
              ..._s.stepControllerFeedback,
              modal: {
                ..._s.stepControllerFeedback.modal,
                display: false
              }
            }
          }));
          setTimeout(() => {
            setState(_s => ({
              ..._s,
              stepControllerFeedback: {
                ..._s.stepControllerFeedback,
                modal: defaultModalState
              }
            }));
            const newAccountInfo = _componentCache.cache.get('newAccountInfo');
            if (newAccountInfo) {
              _componentCache.cache.remove('newAccountInfo');
              window[window.sessionStorage?.tabId].unauthenticate();
              window[window.sessionStorage?.tabId].navigateRoute(route);
            } else {
              window[window.sessionStorage?.tabId].navigateRoute(route);
            }
            window[sessionStorage?.tabId].dispatchRedux('DATA_REQUEST', {
              loadLatest: true,
              datasources: ['360-feature-flagging', '360-customer-view', '360-account-balances', '360-customer-additional-info']
            });
            _componentMessageBus.MessageBus.send(onCompleteEvent, {});
          }, delay);
        }
      }
    }
  }));
};
var _default = redirectOnModalClose;
exports.default = _default;
module.exports = exports.default;