import React, { useState, useEffect } from 'react';
import { Switch, Button, Modal, Typography } from 'antd';
import PlanList from './PlanList';
import PlanListDetail from './PlanListDetail';
import stepController from '../../helpers/stepController';
import { createConsentRequestBody } from '../../helpers/helpers';
const { Paragraph } = Typography;

import './styles.css';

const PlanListWrapper = ({
    dataHook,
    dueDate,
    tableData,
    planDetailsData: { summarizedCharges, detailedCharges },
    submitButtonData,
    setSubmitButtonData,
    priceOrderRequest,
    userMessages,
}) => {
    const [isDetailed, setDetailed] = useState(false);
    const [termsConditionsModal, setTermsConditionsModal] = useState(false);

    const isAddLine = dataHook[0]?.tableData?.finalData?.find(
        (row) => row.activityType !== 'CHANGESERVICES'
    );

    const titleClassName = `plan-list-header-item ${
        isDetailed ? 'plan-detail-item' : 'plan-item'
    }`;

    const [getConsentData, setGetConsentData] = useState(undefined);
    const [createConsentData, setCreateConsentData] = useState(undefined);

    useEffect(() => {
        window[window.sessionStorage?.tabId][
            `setGetConsentData`
        ] = setGetConsentData;
        window[window.sessionStorage?.tabId][
            `setCreateConsentData`
        ] = setCreateConsentData;
        window[window.sessionStorage?.tabId][
            `createConsentRequestBody`
        ] = createConsentRequestBody;

        return () => {
            delete window[window.sessionStorage?.tabId][`setGetConsentData`];
            delete window[window.sessionStorage?.tabId][`setCreateConsentData`];
            delete window[window.sessionStorage?.tabId][
                `createConsentRequestBody`
            ];
        };
    });

    const onBackClick = () => stepController('back', 1, dataHook);
    const onNextClick = (termsConditionsAgreed) => {
        if (termsConditionsAgreed) {
            createConsentRequestBody(priceOrderRequest);
            setTermsConditionsModal(false);
            moveToNext();
        } else {
            setTermsConditionsModal(true);
        }
    };
    const moveToNext = () =>
        stepController('next', 1, dataHook, {
            setSubmitButtonData,
        });
    const plans = [
        { key: 0, title: 'Current Charges' },
        { key: 1, title: 'Proposed Changes' },
        { key: 2, title: 'Next Month' },
    ];

    return (
        <div className="plan-list-wrapper">
            <Modal
                open={termsConditionsModal}
                destroyOnClose
                closable={false}
                title="Terms and Conditions"
                onOk={() => onNextClick(true)}
                okText="Yes"
                cancelText="No"
                onCancel={() => onBackClick()}
            >
                {isAddLine ? (
                    <Paragraph>
                        <div style={{ padding: '10px' }}>
                            {userMessages.find((row) => row.name == 'addLineTC')
                                ?.message ||
                                "By activating Cricket service, you are agreeing to the\r\nCricket Wireless Terms and Conditions of Service,\r\navailable at cricketwireless.com/terms, which includes\r\ndispute resolution by arbitration. Account payments are\r\nnontransferable and nonrefundable. For information on\r\nCricket's network management practices visit\r\nCricketwireless.com/mobilebroadband. Geographic, usage,\r\nand other restrictions apply.\r\n\r\nDo you agree?"}
                        </div>
                    </Paragraph>
                ) : (
                    <Paragraph>
                        <div style={{ padding: '10px' }}>
                            {userMessages.find(
                                (row) => row.name == 'changeRatePlanTC'
                            )?.message ||
                                'Your continued use of Cricket service constitutes\r\nacceptance of the Cricket Wireless Terms and Conditions\r\nof Service, which includes dispute resolution by\r\narbitration. Full terms are available at\r\ncricketwireless.com/terms. For information on Cricket’s\r\nnetwork management practices, see\r\nCricketwireless.com/mobilebroadband.\r\n\r\nDo you wish to proceed?'}
                        </div>
                    </Paragraph>
                )}
            </Modal>
            <div className="plan-list-header">
                {isDetailed ? (
                    <div className="plan-list-header-item phone-line">
                        Phone Line
                    </div>
                ) : null}
                {plans.map(({ title, key }) => (
                    <div key={key} className={titleClassName}>
                        {title}
                    </div>
                ))}
                <div className="detail-toggle">
                    <Switch onChange={(checked) => setDetailed(checked)} />
                    &nbsp; Detailed View
                </div>
            </div>
            <div className="plan-list-content">
                {isDetailed ? (
                    <PlanListDetail
                        data={tableData}
                        dueDate={dueDate}
                        detailedCharges={detailedCharges}
                    />
                ) : (
                    <PlanList summarizedCharges={summarizedCharges} />
                )}
            </div>
            <div className="plan-list-actions">
                <Button onClick={onBackClick}>Back</Button>
                <div>
                    <Button
                        type="primary"
                        onClick={() => onNextClick(false)}
                        disabled={submitButtonData.disabled}
                        loading={submitButtonData.isLoading}
                    >
                        {submitButtonData.label}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default PlanListWrapper;
