import React from 'react';

const ExpandedRow = ({ telephoneData, activityType, lineDetailMemos, userMessages }) => {
    const showChangeCount = activityType === 'CHANGESERVICES';
    const suspendedAccount = telephoneData?.ptnStatus === 'S';
    const hotlineSuspended =
        telephoneData?.statusActvCode === 'SUS' &&
        telephoneData?.statusActvRsnCode === 'CO';
    const isNotLostStolen =
        telephoneData?.ptnStatus === 'S' &&
        telephoneData?.statusReasonCode !== 'TO' &&
        telephoneData?.statusReasonCode !== 'ST' &&
        telephoneData?.statusReasonCode !== 'CO';
    return (
        <>
            {showChangeCount && (
                <div className="crpLineLevelNote">
                    <span style={{ fontSize: '12px' }}>
                        Note: Change Plan activity allowed 5 time(s) per bill
                        cycle. User allowed {5 - telephoneData?.ppChangeCount}{' '}
                        more time(s) this bill cycle.
                    </span>
                </div>
            )}
            {telephoneData.promoRestriction && (
                <div className="crpLineLevelNote">
                    <span style={{ fontSize: '12px', color: 'red' }}>
                    {userMessages.find((row) => row.name == 'changeRatePlanPromoRestriction')
                                ?.message ||
                                "This subscriber is in a restricted promo period."}
                    </span>
                </div>
            )}
            {suspendedAccount && (
                <div className="crpLineLevelNote">
                    <span style={{ fontSize: '12px' }}>
                        {lineDetailMemos.suspendedAccount}
                    </span>
                </div>
            )}
            {isNotLostStolen && (
                <div className="crpLineLevelNote">
                    <span style={{ fontSize: '12px' }}>
                        {lineDetailMemos.isNotLostStolen}
                    </span>
                </div>
            )}
            {hotlineSuspended && (
                <div className="crpLineLevelNote">
                    <span style={{ fontSize: '12px' }}>
                        {lineDetailMemos.hotlineSuspended}
                    </span>
                </div>
            )}
        </>
    );
};

export default ExpandedRow;
