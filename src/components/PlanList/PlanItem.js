import React from 'react';

const getItemColor = (value) => {
    return value < 0 ? '#d35d43' : value >= 20 ? '#60a630' : '#404041';
};

const fp = (price) => {
    const parsedPrice = Number.parseFloat(price);
    const formattedPrice = `${parsedPrice}`.includes('.')
        ? parsedPrice.toFixed(2)
        : `${parsedPrice}`;
    return formattedPrice.startsWith('-')
        ? `-$${formattedPrice.slice(1)}`
        : `$${formattedPrice}`;
};

const PlanItem = ({
    charges: {
        total,
        totalPlanCharges,
        totalFeatureCharges,
        totalFeeCharges,
        totalGovtCharges,
    },
    striped = false,
}) => {
    const planItemClassName = `plan-list-item${striped ? ' striped' : ''}`;
    const items = [
        {
            title: 'Plan charges',
            value: totalPlanCharges,
        },
        {
            title: 'Feature charges',
            value: totalFeatureCharges,
        },
        {
            title: 'Fee charges',
            value: totalFeeCharges,
        },
        {
            title: 'Govt charges',
            value: totalGovtCharges,
        },
    ];

    return (
        <div className={planItemClassName}>
            {items.map(({ title, value }, index) => (
                <div className="plan-list-item-charge" key={index}>
                    <div className="charge-title">{title}</div>
                    <div
                        className="charge-value"
                        style={{ color: getItemColor(value) }}
                    >
                        {fp(value)}
                    </div>
                </div>
            ))}
            <div className="plan-list-item-charge" style={{ border: 'none' }}>
                <div className="charge-title">Total</div>
                <div
                    className="charge-title"
                    style={{
                        color: getItemColor(total),
                        fontSize: '16px',
                        color: '#010101',
                    }}
                >
                    {fp(total)}
                </div>
            </div>
        </div>
    );
};

export default PlanItem;
