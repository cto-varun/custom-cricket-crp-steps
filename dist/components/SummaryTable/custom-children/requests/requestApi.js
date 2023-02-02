"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _componentMessageBus = require("@ivoyant/component-message-bus");
var _ErrorModal = _interopRequireDefault(require("../../../Modal/ErrorModal"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const unlDowngradeTabletLinesResponses = (successStates, errorStates, setIsTabletPlanFailed, setContentConfirmationModal, setConfirmationTablePopUp) => (subscriptionId, topic, eventData, closure) => {
  const status = eventData.value;
  const isSuccess = successStates.includes(status);
  const isFailure = errorStates.includes(status);
  if (isSuccess || isFailure) {
    _componentMessageBus.MessageBus.unsubscribe(subscriptionId);
    setIsTabletPlanFailed(isFailure);
    if (isFailure) {
      const error = eventData?.event?.data['response'];
      const onError = eventData?.event?.data['response']?.data?.causedBy[0];
      setContentConfirmationModal({
        title: '',
        content: _ErrorModal.default,
        variables: {
          errorMessage: error?.statusText,
          technicalDetails: [{
            code: onError?.code,
            message: onError?.message
          }]
        },
        clickFrom: 'maxPlanTablet',
        okText: '',
        cancelText: ''
      });
      setConfirmationTablePopUp(true);
    }
  }
};
const callMessageBus = (payload, properties, datasources, setIsTabletPlanFailed, setContentConfirmationModal, setConfirmationTablePopUp) => {
  const {
    unlDowngradeTabletLines
  } = properties?.workflows;
  const {
    workflow,
    datasource,
    responseMapping,
    successStates,
    errorStates
  } = unlDowngradeTabletLines;
  _componentMessageBus.MessageBus.subscribe(workflow, 'WF.'.concat(workflow).concat('.STATE.CHANGE'), unlDowngradeTabletLinesResponses(successStates, errorStates, setIsTabletPlanFailed, setContentConfirmationModal, setConfirmationTablePopUp));
  _componentMessageBus.MessageBus.send('WF.'.concat(workflow).concat('.INIT'), {
    header: {
      registrationId: workflow,
      workflow,
      eventType: 'INIT'
    }
  });
  _componentMessageBus.MessageBus.send('WF.'.concat(workflow).concat('.SUBMIT'), {
    header: {
      registrationId: workflow,
      workflow,
      eventType: 'SUBMIT'
    },
    body: {
      datasource: datasources[datasource],
      request: {
        body: payload
      },
      responseMapping
    }
  });
};
var _default = callMessageBus;
exports.default = _default;
module.exports = exports.default;