import React from 'react';
import DataRow from './DataRow';

const PlanListDetail = ({ data = [], dueDate, detailedCharges }) => {
    const mapDetails = data
        ?.map((item, index) => {
            const chargesIndex = detailedCharges.findIndex(
                (detailedCharge) =>
                    detailedCharge?.ctn ===
                        item.telephoneData.telephoneNumber ||
                    detailedCharge?.imei === item.telephoneData.imei ||
                    (detailedCharge?.lineIdentifier?.slice(5) ===
                        `${item.key}` &&
                        item.activityType === 'ADDLINE')
            );

            if (chargesIndex === -1) return false;

            return (
                <div className="plan-detail-list-item-wrapper" key={index}>
                    <DataRow
                        data={item}
                        dueDate={dueDate}
                        detailedCharges={detailedCharges[chargesIndex]}
                    />
                </div>
            );
        })
        .filter((detail) => detail);

    return (
        <>
            {mapDetails.length ? (
                <div className="plan-detail-list-container">{mapDetails}</div>
            ) : (
                <div className="plan-list-detail__null-view">
                    <div className="plan-list-detail__null-view--container">
                        <span className="plan-list-detail__null-view--error">
                            Error
                        </span>
                        <span>
                            We&apos;re having trouble displaying this
                            information.
                        </span>
                    </div>
                </div>
            )}
        </>
    );
};

export default PlanListDetail;
