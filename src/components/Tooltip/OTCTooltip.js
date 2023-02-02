import React from 'react';

const OTCTooltip = ({
    updateFunction = () => {},
    removeFunction = () => {},
    quantity = 0,
    price,
    rowIndex,
    id,
    hidePlus = false,
    hideMinus = false,
    maxOTC = 9,
    showMultiplied = true,
    setVisible,
    technicalSoc = false,
}) => {
    const LazyTrash = React.lazy(() => import('../../Icons/Trash'));
    const LazyPlus = React.lazy(() => import('../../Icons/Plus'));
    const trash = (
        <React.Suspense fallback="-">
            <LazyTrash />
        </React.Suspense>
    );
    const plus = (
        <React.Suspense fallback="+">
            <LazyPlus />
        </React.Suspense>
    );
    let fPrice = '';
    const fQuantity = quantity ? +quantity : 1;

    if (typeof price === 'number') {
        fPrice = price;
    } else if (typeof price === 'string') {
        const dollarIndex = price.indexOf('$');

        fPrice =
            dollarIndex > -1
                ? +`${price.slice(0, dollarIndex)}${price.slice(
                      dollarIndex + 1
                  )}`
                : +price;
    }

    const displayPrice = showMultiplied ? fPrice * fQuantity : fPrice;

    const header = price ? (
        <div className="otc-tooltip__header">${displayPrice}</div>
    ) : null;

    const onTrashClick = () => {
        removeFunction(rowIndex, id, quantity - 1);
        setVisible(false);
    };
    const onPlusClick =
        quantity < maxOTC
            ? () => updateFunction(rowIndex, id, quantity + 1)
            : () => {};

    return (
        <div className="otc-tooltip__wrapper">
            {header}
            <div className="otc-tooltip__update-actions">
                {!hideMinus ? (
                    <span
                        className="otc-tooltip__icon otc-tooltip__icon--trash"
                        onClick={onTrashClick}
                    >
                        {trash}
                    </span>
                ) : null}
                {technicalSoc ? null : (
                    <div className="otc-tooltip__quantity-box">{quantity}</div>
                )}
                {!hidePlus ? (
                    <span
                        className="otc-tooltip__icon otc-tooltip__icon--plus"
                        onClick={onPlusClick}
                    >
                        {plus}
                    </span>
                ) : null}
            </div>
        </div>
    );
};

export default OTCTooltip;
