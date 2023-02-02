import React from 'react';

const InfoTooltip = ({
    meta: { price = '\u2014', longDescription = 'N/A', shortDescription = '' },
    value,
    className,
}) => (
    <div className={className}>
        <div className="tooltip-overlay__content-short">
            {shortDescription || value}:
        </div>
        <div className="tooltip-overlay__content-long">{longDescription}</div>
        <div className="tooltip-overlay__content-price">Price: ${price}</div>
    </div>
);

export default InfoTooltip;
