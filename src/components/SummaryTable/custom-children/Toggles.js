import React from 'react';
import { Switch } from 'antd';
import './toggles.css';

const handleToggle = (type, setState) => () => {
    const toggleOffer = `apply${type}`;
    setState((s) => ({
        ...s,
        [toggleOffer]: !s[toggleOffer],
    }));
};

const displayAmount = (amount) =>
    amount != null ? (
        <span className="toggle__switch-offer-amount">${amount}</span>
    ) : (
        <span>{'\u2014'}</span>
    );

const Toggles = ({
    dataHook: [state = {}, setState = () => {}],
    disableCoupons = false,
    disableCredit = false,
}) => {
    const handleCoupons = handleToggle('Coupons', setState);
    const handleCredit = handleToggle('Credit', setState);
    const couponAmount = displayAmount(state.couponAmount);
    const creditAmount = displayAmount(state.creditAmount);

    return (
        <div className="toggles__switches">
            {!disableCoupons ? (
                <div className="toggles__switch">
                    <div>
                        <Switch
                            className="toggles__switch-component"
                            size="small"
                            checked={state.applyCoupons || false}
                            onChange={handleCoupons}
                        />
                        <span className="toggles__switch-offer-text">
                            Apply coupons
                        </span>
                    </div>
                    {couponAmount}
                </div>
            ) : null}
            {!disableCredit ? (
                <div className="toggles__switch">
                    <div>
                        <Switch
                            className="toggles__switch-component"
                            size="small"
                            checked={state.applyCredit || false}
                            onChange={handleCredit}
                        />
                        <span className="toggles__switch-offer-text">
                            Apply credit
                        </span>
                    </div>
                    {creditAmount}
                </div>
            ) : null}            
        </div>
    );
};

export default Toggles;
