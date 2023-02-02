/* eslint-disable complexity */
import React from 'react';
import { MobileOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';

const fp = (price) => {
    if (!price) return '$0';
    const parsedPrice = Number.parseFloat(price);
    const formattedPrice = `${parsedPrice}`.includes('.')
        ? parsedPrice.toFixed(2)
        : `${parsedPrice}`;
    return formattedPrice.startsWith('-')
        ? `-$${formattedPrice.slice(1)}`
        : `$${formattedPrice}`;
};

const featuresMapping = (
    featureCharges,
    type,
    featureTitle,
    dueDate,
    featureClassName,
) => {
    const emptyPlaceholders =
        featureCharges.length === 0 ? (
            <>
                <div className="text-right">{'\u2014'}</div>
                <div className="text-right">{'\u2014'}</div>
            </>
        ) : null;
    return (
        <div className="plan-list-item-charge">
            <div className="charge-row">
                <div className="charge-title">{featureTitle}</div>
                {emptyPlaceholders}
            </div>
            {featureCharges.map((feature, index) => (
                <div className="charge-row" key={index}>
                    {type === 'addons' ? (
                        <div className="addon-type">
                            {feature.meta?.socCode || feature.meta?.addOnCode}
                            {(!feature.meta?.socCode?.startsWith('CRK') ||
                                !feature.meta?.addOnCode?.startsWith(
                                    'CRK'
                                )) && (
                                <div className="addon-type-badge">
                                    {feature?.meta?.quantity}
                                </div>
                            )}                            
                        </div>
                    ) : (
                        <div className={featureClassName}>
                            {feature.meta?.title}
                        </div>
                    )}
                    <div className="text-right">
                        {fp(feature.discount || 0)}                        
                    </div>
                    <div className="text-right">{fp(feature.total || 0)}
                    {feature?.showProration && feature.total != 0 ? (
                                <Tooltip title={`This charge is prorated for the remainder of the billcycle, from today until ${dueDate}`}>
                                <InfoCircleOutlined
                                    style={{
                                        marginLeft: 6,
                                    }}
                                />
                            </Tooltip>
                            ) : (
                                <></>
                            )}
                    </div>
                </div>
            ))}
        </div>
    );
};

const formatTelephone = (digits = '') => {
    const output =
        digits === ''
            ? 'No Data'
            : `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(
                  6
              )}`;
    return output;
};

const DataRow = (props) => {
    const {
        data: {
            telephoneData: { telephoneNumber, phoneModel, imei, sim },
        },
        detailedCharges,
        dueDate
    } = props;

    const planListItemClassName = (index) =>
        `plan-list-item${index % 2 ? ' striped' : ''}`;

    const details = ['current', 'proposed', 'nextMonth'].map(
        (k) => detailedCharges[k]
    );

    return (
        <div className="plan-detail-list-item">
            <div className="item-header">
                <div className="mobile-icon-wrapper text-green-1">
                    <MobileOutlined />
                </div>
                <div className="telephone-number">
                    {formatTelephone(telephoneNumber)}
                </div>
                <div className="subtitle">Model</div>
                <div className="phone-model">{phoneModel || 'No Data'}</div>
                <div className="subtitle">IMEI</div>
                <div className="meta-info">{imei || 'No Data'}</div>
                <div className="subtitle">SIM</div>
                <div className="meta-info">{sim || 'No Data'}</div>
            </div>
            <div
                className="item-content"
                style={{ gridTemplateColumns: details.length || 1 }}
            >
                {details.map((detail = {}, index) => {
                    const {
                        planCharges = {},
                        featureCharges = [],
                        feeCharges = [],
                        govtCharges = [],
                        lineTotal = '',
                    } = detail;
                    const key = index;
                    return (
                        <div className="plan-list-item-wrapper" key={key}>
                            <div className={planListItemClassName(key)}>
                                <div className="plan-list-item-charge">
                                    <div className="charge-row">
                                        <div className="charge-title">
                                            Plan charges
                                        </div>
                                        <div className="text-right">
                                            Discount
                                        </div>
                                        <div className="text-right">Total</div>
                                    </div>
                                    <div className="plan-charge-item charge-row">
                                        <div className="text-green-1">
                                            {planCharges.meta?.socCode ||
                                                planCharges.meta
                                                    ?.pricePlanSocCode ||
                                                '\u2014'}                                            
                                        </div>
                                        <div className="text-right">
                                            {fp(planCharges.discount || 0)}
                                        </div>
                                        <div className="text-right">
                                            {fp(
                                                planCharges.total ||
                                                    planCharges.price
                                            )}
                                            {planCharges?.showProration &&  planCharges.total != 0 ? (
                                                <Tooltip title={`This charge is prorated for the remainder of the billcycle, from today until ${dueDate}`}>
                                                    <InfoCircleOutlined
                                                        style={{
                                                            marginLeft: 6,
                                                        }}
                                                    />
                                                </Tooltip>
                                            ) : (
                                                <></>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {featuresMapping(
                                    featureCharges,
                                    'addons',
                                    'Feature charges',
                                    dueDate
                                )}

                                {featuresMapping(
                                    feeCharges,
                                    'fees',
                                    'Fee charges',
                                    'fee-type'
                                )}

                                {featuresMapping(
                                    govtCharges,
                                    'govt',
                                    'Govt charges',
                                    'govt-type'
                                )}

                                <div
                                    className="plan-list-item-charge"
                                    style={{
                                        border: 'none',
                                        alignItems: 'flex-end',
                                        fontSize: '16px',
                                        color: '#010101',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    <div className="charge-row">
                                        <div className="charge-title">
                                            Line Total
                                        </div>
                                        <div className="text-right">&nbsp;</div>
                                        <div className="text-right">
                                            {fp(lineTotal)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default DataRow;
