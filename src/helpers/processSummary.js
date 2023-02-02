const defaultSummary = {
    addOnCharges: null,
    planCharges: null,
    totalDiscounts: null,
    nextMonth: null,
    dueNow: null,
};

const processSummary = ({ priceOrderData = {} }) => {
    const dataProcessor = window[window.sessionStorage?.tabId].dp;
    if (!dataProcessor || Object.keys(priceOrderData) === 0) {
        return defaultSummary;
    }

    return dataProcessor.load(priceOrderData).extractData({
        extract: [
            {
                property: 'linePriceDetails',
                name: 'addOnCharges',
                transformations: [
                    (p) =>
                        p.reduce((acc, { nextBillAddOnPricingInfo = [] }) => {
                            let addonsDue = 0;
                            nextBillAddOnPricingInfo.forEach(
                                ({ dueAmount }) => {
                                    addonsDue += dueAmount;
                                }
                            );
                            return acc + addonsDue;
                        }, 0),
                ],
            },
            {
                property: 'linePriceDetails',
                name: 'planCharges',
                transformations: [
                    (p) =>
                        p.reduce((acc, { nextBillPlanPricingInfo = {} }) => {
                            if (nextBillPlanPricingInfo.dueAmount) {
                                return acc + nextBillPlanPricingInfo.dueAmount;
                            }

                            return acc;
                        }, 0),
                ],
            },
            {
                property: 'priceSummary.totalDiscount',
                name: 'totalDiscounts',
            },
            {
                property: 'priceSummary.dueAmountNextMonth',
                name: 'nextMonth',
            },
            {
                property: 'priceSummary.dueAmount',
                name: 'dueNow',
            },
        ],
    });
};
export default processSummary;
