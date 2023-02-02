import React, { useMemo, useState } from 'react';
import WalletIcon from '../../Icons/Wallet';
import CloseIcon from '../../Icons/Close';
import Tooltip from '../Tooltip';
import Toggles from '../SummaryTable/custom-children/Toggles';
import './styles.css';

const handleDollarSign = (str) =>
    str.startsWith('-') ? `-$${str.slice(1)}` : `$${str}`;

const mapCharges = (charges) => {
    const chargesItems = [
        {
            id: 0,
            text: 'Due Now',
            key: 'dueNow',
        },
        {
            id: 1,
            text: 'Current Bill',
            key: 'currentBill',
        },
        {
            id: 2,
            text: 'Next Bill',
            key: 'nextBill',
        },
        {
            id: 3,
            text: 'Discount',
            key: 'discount',
        },
        {
            id: 4,
            text: 'Credit',
            key: 'credit',
        },
    ];

    return chargesItems.map(({ text, key, id }) => {
        let displayedValue = '';
        let displayClassName = 'charges-card__item-value';

        const chargeItem = charges[key];
        if (chargeItem != null) {
            if (typeof chargeItem === 'object') {
                displayedValue = chargeItem.amount
                    ? `${chargeItem.amount}`
                    : displayedValue;
                displayClassName = chargeItem.color
                    ? `${displayClassName} charges-card__item-value--${chargeItem.color}`
                    : displayClassName;
            } else {
                displayedValue = `${chargeItem}`;
            }

            if (displayedValue !== '') {
                displayedValue = displayedValue.includes('$')
                    ? displayedValue
                    : handleDollarSign(displayedValue);
            }
        }

        if (displayedValue === '') {
            displayedValue = '\u2014';
        }

        return (
            <div key={id} className="charges-card__item-display">
                <span className="charges-card__item-text">{text}</span>
                <span className={displayClassName}>{displayedValue}</span>
            </div>
        );
    });
};

const WalletTooltip = ({
    dataHook,
    handleClose,
    disableCoupons = false,
    disableCredit = false,
}) => {
    const onClick = () => handleClose(false);

    const displayPlaceholder = disableCoupons && disableCredit;

    return (
        <div className="wallet-tooltip__wrapper">
            <div className="wallet-tooltip__title">
                <span className="wallet-tooltip__title-text">Wallet</span>
                <span className="wallet-tooltip__close-icon" onClick={onClick}>
                    <CloseIcon />
                </span>
            </div>
            <div className="wallet-tooltip__toggles-wrapper">
                {!displayPlaceholder ? (
                    <Toggles
                        dataHook={dataHook}
                        disableCoupons={disableCoupons}
                        disableCredit={disableCredit}
                    />
                ) : (
                    <span>No Data</span>
                )}
            </div>
        </div>
    );
};

const ChargesCard = ({ className = '', charges, credit, dataHook }) => {
    const cardClassName = `charges-card__wrapper${
        className ? ` ${className}` : ''
    }`;

    const [showTooltip, setShowTooltip] = useState(false);

    const chargesDisplay = useMemo(() => mapCharges({ ...charges, credit }), [
        credit,
    ]);

    const handleTooltipVisiblity = (visible) => setShowTooltip(visible);

    return (
        <div className={cardClassName}>
            <div className="charges-card__charges-display">
                {chargesDisplay}
            </div>
            <div className="charges-card__wallet">
                <Tooltip
                    trigger="click"
                    title={
                        <WalletTooltip
                            dataHook={dataHook}
                            handleClose={handleTooltipVisiblity}
                            disableCoupons
                        />
                    }
                    overlayClassName="charges-card__wallet-tooltip"
                    placement="left"
                    open={showTooltip}
                    onVisibleChange={handleTooltipVisiblity}
                >
                    <div className="charges-card__wallet-wrapper">
                        <div className="charges-card__wallet-icon-wrapper">
                            <WalletIcon />
                        </div>
                        <div className="charges-card__wallet-text">
                            Click to apply coupons & credit
                        </div>
                    </div>
                </Tooltip>
            </div>
        </div>
    );
};

export default ChargesCard;
