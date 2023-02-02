import React from 'react';
import { InfoCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import MainTablePopover from './MainTablePopover';

const PlanTemplate = (props) => {
    const {
        data: { currentPlan = {}, newPlan = {} },
        removeNewPlan,
        rowIndex,
    } = props;
    if (Object.keys(currentPlan).length === 0) {
        return <div>Error: no current plan</div>;
    }
    if (Object.keys(newPlan).length === 0) {
        return (
            <div className="defaultPlanButton">
                <span>${currentPlan.pricePlanSocCode}&nbsp;</span>
                <span>
                    <MainTablePopover
                        popoverContent={
                            <div>
                                <div>{currentPlan.shortDescription}</div>
                                <div>{currentPlan.longDescription}</div>
                                <div>{currentPlan.price}</div>
                            </div>
                        }
                    >
                        <div>
                            <InfoCircleOutlined />
                        </div>
                    </MainTablePopover>
                </span>
            </div>
        );
    }
    return (
        <>
            <div className="currentPlanButton">
                ${currentPlan.pricePlanSocCode}{' '}
                <MainTablePopover
                    popoverContent={
                        <div>
                            <div>{currentPlan.shortDescription}</div>
                            <div>{currentPlan.longDescription}</div>
                            <div>{currentPlan.price}</div>
                        </div>
                    }
                >
                    <InfoCircleOutlined />
                </MainTablePopover>
            </div>
            <MainTablePopover
                popoverContent={
                    <div onClick={() => removeNewPlan(rowIndex)}>
                        <DeleteOutlined style={{ fontSize: '24px' }} />
                    </div>
                }
                popoverTitle={<div>{newPlan.pricePlanSocCode}</div>}
                popoverTrigger="click"
            >
                <div className="newPlanButton">
                    ${newPlan.pricePlanSocCode}{' '}
                    <MainTablePopover
                        popoverContent={
                            <div>
                                <div>{newPlan.shortDescription}</div>
                                <div>{newPlan.longDescription}</div>
                                <div>{newPlan.price}</div>
                            </div>
                        }
                    >
                        <span>
                            <InfoCircleOutlined />
                        </span>
                    </MainTablePopover>
                </div>
            </MainTablePopover>
        </>
    );
};

export default PlanTemplate;
