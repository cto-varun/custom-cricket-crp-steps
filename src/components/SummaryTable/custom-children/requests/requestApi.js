import { MessageBus } from '@ivoyant/component-message-bus';
import ErrorModal from '../../../Modal/ErrorModal';

const unlDowngradeTabletLinesResponses = (
    successStates,
    errorStates,
    setIsTabletPlanFailed,
    setContentConfirmationModal,
    setConfirmationTablePopUp
) => (
    subscriptionId,
    topic,
    eventData,
    closure
) => {
    const status = eventData.value;
    const isSuccess = successStates.includes(status);
    const isFailure = errorStates.includes(status);
    if (isSuccess || isFailure) {
        MessageBus.unsubscribe(subscriptionId);
        setIsTabletPlanFailed(isFailure)
        if (isFailure) {
            const error = eventData?.event?.data['response'];
            const onError = eventData?.event?.data['response']?.data?.causedBy[0];
            setContentConfirmationModal({
                title: '',
                content: ErrorModal,
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
            })
            setConfirmationTablePopUp(true);
        }
    }
};

const callMessageBus = (
    payload,
    properties,
    datasources,
    setIsTabletPlanFailed,
    setContentConfirmationModal,
    setConfirmationTablePopUp
) => {
    const { unlDowngradeTabletLines } = properties?.workflows;
    const {
        workflow,
        datasource,
        responseMapping,
        successStates,
        errorStates,
    } = unlDowngradeTabletLines;

    MessageBus.subscribe(
        workflow,
        'WF.'.concat(workflow).concat('.STATE.CHANGE'),
        unlDowngradeTabletLinesResponses(successStates, errorStates, setIsTabletPlanFailed, setContentConfirmationModal, setConfirmationTablePopUp)
    );

    MessageBus.send(
        'WF.'.concat(workflow).concat('.INIT'),
        {
            header: {
                registrationId: workflow,
                workflow,
                eventType: 'INIT',
            },
        }
    );

    MessageBus.send(
        'WF.'.concat(workflow).concat('.SUBMIT'),
        {
            header: {
                registrationId: workflow,
                workflow,
                eventType: 'SUBMIT',
            },
            body: {
                datasource: datasources[datasource],
                request: {
                    body: payload,
                },
                responseMapping,
            },
        }
    );
}

export default callMessageBus;
