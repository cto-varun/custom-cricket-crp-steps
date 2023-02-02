import React from 'react';
import PlanItem from './PlanItem';

const PlanList = ({ summarizedCharges }) => {
    const summarized = ['current', 'proposed', 'nextMonth'].map((k) => ({
        key: k,
        charges: summarizedCharges[k],
    }));

    return (
        <div className="plan-list-container">
            <div className="plan-list-container-wrapper">
                {summarized.map(({ charges, key }, index) => (
                    <div className="plan-list-item-wrapper" key={key}>
                        <PlanItem charges={charges} striped={index % 2} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PlanList;
