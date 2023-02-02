import React from 'react';
import { Button } from 'antd';
import './detailsButton.css';

const handleClick = (dataHook, BillingComponent) => {
    const [, setState] = dataHook;

    setState((v) => ({
        ...v,
        stepControllerFeedback: {
            ...v.stepControllerFeedback,
            modal: {
                display: true,
                message: BillingComponent,
            },
        },
    }));
};

const DetailsButton = ({ BillingComponent, dataHook }) => {
    return (
        <Button
            onClick={() => handleClick(dataHook, BillingComponent)}
            className="view-details--button"
        >
            VIEW DETAILS
        </Button>
    );
};

export default DetailsButton;
