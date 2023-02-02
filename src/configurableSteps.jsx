import React, {
    lazy,
    memo,
    Suspense,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { Steps } from 'antd';
import Modal from './components/Modal';
import Spinner from './components/Spinner';
import createWindowFns, { stateDebugger } from './helpers/createWindowFns';
import { cache } from '@ivoyant/component-cache';
import { MessageBus } from '@ivoyant/component-message-bus';

import initialState from './initialState';
import Close from './Icons/Close';
import './configurableSteps.css';
import Step1 from './steps/Step1';
import Step2 from './steps/Step2';
import Step3 from './steps/Step3';
import Step4 from './steps/Step4';
import Step5 from './steps/Step5';

const CurrentStep = memo((props) => {
    const { current, dataHook } = props;
    const Step = (step) => {
        switch (step) {
            case 0:
                return <Step1 {...props} dataHook={dataHook} />;
            case 1:
                return <Step2 {...props} dataHook={dataHook} />;
            case 2:
                return <Step3 {...props} dataHook={dataHook} />;
            case 3:
                return <Step4 {...props} dataHook={dataHook} />;
            case 4:
                return <Step5 {...props} dataHook={dataHook} />;
            default:
                return <Step1 {...props} dataHook={dataHook} />;
        }
    };

    return (
        <Suspense
            fallback={
                <Spinner tip="Loading step..." className="crp-step__spinner" />
            }
        >
            {Step(current)}
            {/* <LazyStep {...props} dataHook={dataHook} /> */}
        </Suspense>
    );
});

const ConfigurableSteps = (props) => {
    const {
        component: {
            id,
            params: { titles },
        },
        data,
        properties,
    } = props;

    const { onCompleteEvent = 'CRP.COMPLETE' } = properties;

    const newAccountInfo = cache.get('newAccountInfo');
    const newState = { ...initialState, ...data?.data };

    if (
        newAccountInfo &&
        newAccountInfo.ban === window[window.sessionStorage?.tabId].NEW_BAN
    ) {
        //accountId = newAccountInfo.ban;
        newState.accountDetails.banStatus = newAccountInfo.accountStatus;
        newState.accountDetails.accountType = newAccountInfo.accountType;
        newState.accountDetails.accountSubType = newAccountInfo.accountSubType;
        //adrZip = newAccountInfo.billingAddress.zip;
        //adrCity = newAccountInfo.billingAddress.city;
        //adrStateCode = newAccountInfo.billingAddress.state;
    }

    const [state, setState] = useState(newState);
    const { current, apiErrors, displayCRPErrors = true } = state;
    useEffect(createWindowFns(id, state, setState), []);
    useEffect(stateDebugger(id, state, setState));
    useEffect(() => {
        if (apiErrors && apiErrors.code) {
            const errorMessage = `Error ${apiErrors.code}: ${apiErrors.message}`;
            const technicalDetails = apiErrors.causedBy || null;
            const modalProperties = displayCRPErrors
                ? {
                      display: true,
                      lazyLoad: 'ErrorModal',
                      lazyProps: {
                          errorMessage,
                          technicalDetails,
                      },
                  }
                : {};
            setState((s) => ({
                ...s,
                apiErrors: undefined,
                displayCRPErrors: true,
                stepControllerFeedback: {
                    ...s.stepControllerFeedback,
                    modal: {
                        ...s.stepControllerFeedback.modal,
                        ...modalProperties,
                    },
                },
            }));
        }
    });

    const handleExit = () => {
        if (newAccountInfo) {
            cache.remove('newAccountInfo');
            window[window.sessionStorage?.tabId].unauthenticate();
            window[window.sessionStorage?.tabId].navigateRoute('/');
        } else {
            window[window.sessionStorage?.tabId].navigateRoute(
                '/dashboards/manage-account'
            );
        }
        MessageBus.send(onCompleteEvent, {});
    };

    return (
        <>
            <Modal dataHook={[state, setState]} />
            <div className="crp__content-steps">
                <span className="crp__content-steps-header">
                    Change Plans & Features
                </span>
                <Steps className="crp__content-steps-steps" current={current}>
                    {titles.map((title, index) => (
                        <Steps.Step key={index} title={title} />
                    ))}
                </Steps>
                <span className="crp__content-steps-close">
                    <span
                        className="crp__content-steps-close-icon"
                        onClick={handleExit}
                    >
                        <Close />
                    </span>
                </span>
            </div>
            <CurrentStep
                {...props}
                current={current}
                dataHook={[state, setState]}
            />
        </>
    );
};

export default ConfigurableSteps;
