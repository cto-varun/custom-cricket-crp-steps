import { useEffect, useState } from 'react';
import processData from '../helpers/useAsyncFunctionHelpers';

const loadData = (loadAsyncMachineFunctions, setProcessorState) => {
    loadAsyncMachineFunctions.forEach(({ fn = '', name = '' }) => {
        window[window.sessionStorage?.tabId][fn] = (data) => {
            setProcessorState((s) => ({
                ...s,
                loadedData: { ...s.loadedData, [name]: data.payload },
            }));
        };
    });
};

const requestPlansAndAddons = (lineDetails, accountDetails) => {
    const subscribers = lineDetails?.map(
        ({ subscriberNumber, ptnStatus: subscriberStatus }) => ({
            subscriberNumber,
            subscriberStatus,
        })
    );
    lineDetails?.forEach((element, index) => {
        subscribers[index].socCode = element?.currentRatePlan === undefined ? '' : element?.currentRatePlan[0]?.soc;
        subscribers[index].imei = element?.imei === undefined ? '' : element?.imei;
    })
    const requestBody = {
        billingAccountNumber: window[
            window.sessionStorage?.tabId
        ].NEW_BAN?.toString(),
        accountStatus: accountDetails?.banStatus,
        profile: window[window.sessionStorage?.tabId].COM_IVOYANT_VARS?.profile,
        includeExpired: true,
        subscribers,
        includeFeatures: true,
    };

    const plansAddonsAsyncMachine =
        window[window.sessionStorage?.tabId].sendgetPlansAndAddonsAsyncMachine;
    if (plansAddonsAsyncMachine) {
        plansAddonsAsyncMachine('SET.REQUEST.DATA', {
            value: requestBody,
        });

        plansAddonsAsyncMachine('FETCH');
    }
};

const cleanup = (loadAsyncMachineFunctions) => {
    loadAsyncMachineFunctions.forEach(({ fn }) => {
        delete window[window.sessionStorage?.tabId][fn];
    });
};

const useAsyncFunctions = (
    { loadAsyncMachineFunctions = [] },
    otherParameters
) => {
    const {
        dataHook: [
            {
                uiData: { lastAction },
                loadedData: loadedDataFromState,
                savedData: {
                    step1: { table: tableFromState },
                },
            },
        ],
    } = otherParameters;
    const {
        dataHook: [state, setState],
    } = otherParameters;
    const { lineDetails, accountDetails } = state;

    const processorHook = useState({
        status: 'loading', // 'render' 'error'
        message: null,
        loadedData: null,
        processedData: {
            table: null,
        },
    });

    const [processorState, setProcessorState] = processorHook;
    const { loadedData } = processorState;
    const processor = window[window.sessionStorage?.tabId].dp;

    if (processor == null || !loadAsyncMachineFunctions.length) {
        setProcessorState((s) => ({
            ...s,
            status: 'error',
            message:
                'Failed to load an internal module and/or API loading functions failed to obtain data.',
        }));
    }

    useEffect(function fetchPlansAndAddons() {
        if (!loadedData && lastAction !== 'back/1') {
            loadData(loadAsyncMachineFunctions, setProcessorState);
            // check to see if subscriberNumber or telephoneNumber are not undefined
            if (
                lineDetails[0]?.subscriberNumber ||
                lineDetails[0]?.telephoneNumber
            ) {
                setTimeout(() => {
                    requestPlansAndAddons(lineDetails, accountDetails);
                }, 500);
            } else {
                setProcessorState((s) => ({
                    ...s,
                    status: 'render',
                    message: '',
                }));
            }
        }

        return () => {
            cleanup(loadAsyncMachineFunctions);
        };
    }, []);

    useEffect(
        function process() {
            if (lastAction === 'back/1') {
                setProcessorState(() => ({
                    status: 'render',
                    message: null,
                    loadedData: loadedDataFromState,
                    processedData: {
                        table: tableFromState,
                    },
                }));
            } else if (loadedData && lastAction !== 'back/1') {
                const tab = processData(processor, 'tab', { processorHook });

                if (tab == null) {
                    setProcessorState((s) => ({
                        ...s,
                        status: 'error',
                        message: 'Failed to process plans and add-ons request.',
                    }));
                } else {
                    const {
                        dataHook,
                        compatibilityHook,
                        data,
                    } = otherParameters;
                    const table = processData(processor, 'table', {
                        tab,
                        apiData: loadedData.apiData,
                        dataHook,
                        compatibilityHook,
                        data,
                    });
                    setProcessorState((s) => ({
                        ...s,
                        status: 'render',
                        message: '',
                        processedData: {
                            ...s.processedData,
                            table,
                        },
                    }));
                }
            }
        },
        [loadedData]
    );

    return processorState;
};

export default useAsyncFunctions;
