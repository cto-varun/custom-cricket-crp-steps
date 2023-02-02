import React, { useState } from 'react';
import { Button } from 'antd';
import { MessageBus } from '@ivoyant/component-message-bus';
import cloneDeep from 'lodash.clonedeep';
import { getTechnicalSocIndexFromTable } from '../../helpers/helpers';

import './TechnicalSocModal.css';

const TechnicalSocModal = ({
    dataHook,
    technicalSocCode = '',
    technicalSocCtn = '',
    addOrRemove = '',
    technicalSocUpdate,
    datasources,
    tableRowIndex,
    socMetadata = {},
}) => {
    const [state, setState] = dataHook;
    const {
        workflow,
        datasource,
        responseMapping,
        successStates,
        errorStates,
    } = technicalSocUpdate;

    const resetModal = () => {
        setState((_s) => ({
            ..._s,
            uiData: {
                ..._s.uiData,
                selected: {
                    ..._s.uiData?.selected,
                    technicalSocCode: '',
                    technicalSocCtn: '',
                    addOrRemove: '',
                },
            },
            stepControllerFeedback: {
                ..._s.stepControllerFeedback,
                modal: {
                    display: false,
                    message: '',
                    footer: null,
                    onOk: null,
                    onCancel: null,
                    maskClosable: true,
                    lazyLoad: null,
                    lazyProps: {},
                    title: '',
                },
            },
        }));
    };

    const removeTechnicalSoc = (index, socCode) => {
        const updatedDataSource = cloneDeep(state?.tableData?.finalData);
        const technicalSocsRow = updatedDataSource[index].technicalSocs;
        const technicalSocIndex = getTechnicalSocIndexFromTable(
            technicalSocsRow,
            socCode
        );

        if (technicalSocIndex !== -1) {
            technicalSocsRow.splice(technicalSocIndex, 1);
        }

        state.setFinalTableData(updatedDataSource);
        setState((v) => ({
            ...v,
            tableData: {
                ...v.tableData,
                finalData: updatedDataSource,
            },
        }));
    };

    const addTechnicalSoc = (index, socMeta) => {
        const updatedDataSource = cloneDeep(state?.tableData?.finalData);
        const technicalSocsRow = updatedDataSource[index].technicalSocs;

        const technicalSocRowIdx = technicalSocsRow.findIndex(
            (rowItem) => rowItem?.socCode === socMeta?.socCode
        );
        // If soc does not already exists on line
        if (technicalSocRowIdx === -1) {
            // custom logic for technical socs - we can only have quantity of 1 for these socs.
            technicalSocsRow.push({
                ...socMeta,
                quantity: 1,
                addOnType: socMeta?.addOnType,
            });

            state.setFinalTableData(updatedDataSource);
            setState((v) => ({
                ...v,
                tableData: {
                    ...v.tableData,
                    finalData: updatedDataSource,
                },
            }));
        }
    };

    const technicalSocUpdateResponse = (socCode, addOrRemoveBoolean) => (
        subscriptionId,
        topic,
        eventData,
        closure
    ) => {
        const status = eventData.value;
        const isSuccess = successStates.includes(status);
        const isFailure = errorStates.includes(status);
        if (isSuccess || isFailure) {
            if (isSuccess) {
                if (addOrRemoveBoolean.toUpperCase() === 'REMOVE') {
                    removeTechnicalSoc(tableRowIndex, socCode);
                    resetModal();
                    MessageBus.unsubscribe(subscriptionId);
                }
                if (addOrRemoveBoolean.toUpperCase() === 'ADD') {
                    addTechnicalSoc(tableRowIndex, socMetadata);
                    resetModal();
                    MessageBus.unsubscribe(subscriptionId);
                }
            }

            if (isFailure) {
                resetModal();
                MessageBus.unsubscribe(subscriptionId);
            }
        }
    };

    const technicalSocUpdateCall = (requestBody) => {
        MessageBus.subscribe(
            workflow,
            'WF.'.concat(workflow).concat('.STATE.CHANGE'),
            technicalSocUpdateResponse(technicalSocCode, addOrRemove)
        );

        MessageBus.send('WF.'.concat(workflow).concat('.INIT'), {
            header: {
                registrationId: workflow,
                workflow,
                eventType: 'INIT',
            },
        });
        MessageBus.send('WF.'.concat(workflow).concat('.SUBMIT'), {
            header: {
                registrationId: workflow,
                workflow,
                eventType: 'SUBMIT',
            },
            body: {
                datasource: datasources[datasource],
                request: {
                    body: requestBody,
                    params: { phonenumber: technicalSocCtn },
                },
                responseMapping,
            },
        });
    };

    const createTechnicalSocUpdateRequestBody = (soc, action) => {
        return {
            services: [
                {
                    soc,
                    action: action.toUpperCase(),
                },
            ],
        };
    };

    const onYesClick = () => {
        const requestBody = createTechnicalSocUpdateRequestBody(
            technicalSocCode,
            addOrRemove
        );

        technicalSocUpdateCall(requestBody);
    };

    const onNoClick = () => {
        resetModal();
    };
    return (
        <div className="technicalSocModalContainer">
            <div className="technicalSocModalHeader">
                {addOrRemove.charAt(0).toUpperCase() + addOrRemove.slice(1)}{' '}
                Technical Socs
            </div>
            <div className="technicalSocModalBody">
                Are you sure you would like to {addOrRemove}{' '}
                <span className="technicalSocName">{technicalSocCode}</span>?
            </div>
            <div className="technicalSocButtonContainer">
                <Button
                    className="technicalSocButton yesBtn"
                    onClick={onYesClick}
                >
                    Yes
                </Button>
                <Button
                    className="technicalSocButton noBtn"
                    onClick={onNoClick}
                >
                    No
                </Button>
            </div>
        </div>
    );
};

export default TechnicalSocModal;
