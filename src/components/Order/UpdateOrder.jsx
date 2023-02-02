/* eslint-disable prefer-promise-reject-errors */
import React, { useState, useEffect } from 'react';
import { Row, Col, Typography, Tag, Form, Input, Button, Alert } from 'antd';

const { Text } = Typography;

const Tags = {
    CREATED: { color: 'blue', title: 'Created' },
    INPROGRESS: { color: 'orange', title: 'In Progress' },
    SUCCESS: { color: 'green', title: 'Success' },
    CANCELLED: { color: 'red', title: 'Canceled' },
    OKTOSUBMIT: { color: 'green', title: 'OK to Submit' },
    FAILURE: { color: 'red', title: 'Failure' },
};

const hasErrors = (errorObj) => {
    return errorObj.some((field) => field.errors.length > 0);
};

function UpdateOrder({ order, onUpdateOrder, setEditOrder, loading }) {
    const [form] = Form.useForm();
    const { billingAccountNumber, lines } = order;
    const [formValues, setFormValues] = useState({});

    const onFinish = (values) => {
        let requestBody = {
            billingAccountNumber,
        };

        if (Object.keys(formValues).length) {
            const portDetails = [];
            Object.entries(formValues).forEach(([key, value]) => {
                if (value?.taxId === '') {
                    delete value.taxId;
                }
                portDetails.push({
                    ctn: key,
                    portDetails: {
                        ...value,
                        taxId: value?.taxId ? value?.taxId : 9999,
                    },
                });
            });
            requestBody = {
                ...requestBody,
                portDetailsInfo: portDetails,
            };
        }
        onUpdateOrder(requestBody);
    };

    const customValidator = (rule, value) => {
        if (rule.field?.includes('accNum')) {
            return !value || (/^\d{1,20}$/.test(value) && value.length >= 9)
                ? Promise.resolve()
                : Promise.reject(
                      !value
                          ? 'Please enter the account number'
                          : 'Please enter a valid 9 - 20 digit account number.'
                  );
        }

        if (rule.field?.includes('zipcode')) {
            return !value || (/^\d{1,5}$/.test(value) && value.length === 5)
                ? Promise.resolve()
                : Promise.reject(
                      !value
                          ? 'Please enter the zip code'
                          : 'Please enter a valid 5 digit zipcode.'
                  );
        }

        if (rule.field?.includes('passcode')) {
            return !value ||
                (/^\d{1,8}$/.test(value) &&
                    value.length >= 4 &&
                    value.length <= 8)
                ? Promise.resolve()
                : Promise.reject(
                      !value
                          ? 'Please enter the pass code'
                          : 'Please enter a valid 4 - 8 digit passcode.'
                  );
        }

        if (rule.field?.includes('taxId')) {
            return !value || (/^\d{1,4}$/.test(value) && value.length === 4)
                ? Promise.resolve()
                : Promise.reject('Please enter last 4 digit SSN/TaxId.');
        }
    };

    const handleField = (value, name, phoneNumber) => {
        setFormValues({
            ...formValues,
            [phoneNumber]: { ...formValues[phoneNumber], [name]: value },
        });
    };

    return (
        <div>
            <div
                style={{
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    padding: '26px 20px',
                }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    name="basic"
                    onFinish={onFinish}
                    className="addALineForm"
                >
                    {lines.map(
                        ({
                            customerTelephoneNumber,
                            lineStepStatus,
                            lineStep,
                        }) => {
                            if (
                                lineStepStatus === 'RESOLUTIONREQ' &&
                                lineStep === 'PORTIN'
                            ) {
                                return (
                                    <Row gutter={24}>
                                        <Col span={8}>
                                            <Row
                                                style={{
                                                    margin: '8px 0',
                                                }}
                                                key={customerTelephoneNumber}
                                            >
                                                <Col span={24}>
                                                    <Text
                                                        type="secondary"
                                                        style={{
                                                            marginRight: 12,
                                                            fontWeight: 600,
                                                        }}
                                                    >
                                                        Phone Number:{' '}
                                                        {
                                                            customerTelephoneNumber
                                                        }
                                                    </Text>
                                                </Col>
                                                <Col
                                                    span={24}
                                                    style={{
                                                        marginRight: 12,
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    <Text
                                                        type="secondary"
                                                        style={{
                                                            marginRight: 12,
                                                        }}
                                                    >
                                                        lineStepStatus:{' '}
                                                        {lineStepStatus}
                                                    </Text>
                                                </Col>
                                                <Col
                                                    span={24}
                                                    style={{
                                                        marginRight: 12,
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    <Text
                                                        type="secondary"
                                                        style={{
                                                            marginRight: 12,
                                                        }}
                                                    >
                                                        lineStep: {lineStep}
                                                    </Text>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col span={14} offset={2}>
                                            <Row gutter={18}>
                                                <Col span={9}>
                                                    <Form.Item
                                                        label="Passcode"
                                                        name={`passcode-${customerTelephoneNumber}`}
                                                        validateTrigger="onBlur"
                                                        rules={[
                                                            {
                                                                required: true,
                                                                validateTrigger:
                                                                    'onBlur',
                                                                validator: customValidator,
                                                            },
                                                        ]}
                                                        normalize={(value) =>
                                                            value.replace(
                                                                /[^0-9]/gi,
                                                                ''
                                                            )
                                                        }
                                                    >
                                                        <Input
                                                            maxLength={8}
                                                            minLength={4}
                                                            autoComplete="off"
                                                            onChange={(e) =>
                                                                handleField(
                                                                    e.target
                                                                        .value,
                                                                    'otherAccountPin',
                                                                    customerTelephoneNumber
                                                                )
                                                            }
                                                        />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={9}>
                                                    <Form.Item
                                                        label="Account Number"
                                                        name={`accNum-${customerTelephoneNumber}`}
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message:
                                                                    'Please enter the Account Number',
                                                            },
                                                        ]}
                                                        normalize={(value) =>
                                                            value.replace(
                                                                /[^0-9]/gi,
                                                                ''
                                                            )
                                                        }
                                                    >
                                                        <Input
                                                            autoComplete="off"
                                                            onChange={(e) =>
                                                                handleField(
                                                                    e.target
                                                                        .value,
                                                                    'otherAccountNumber',
                                                                    customerTelephoneNumber
                                                                )
                                                            }
                                                        />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={9}>
                                                    <Form.Item
                                                        label="Zip Code"
                                                        normalize={(value) =>
                                                            value.replace(
                                                                /[^0-9]/gi,
                                                                ''
                                                            )
                                                        }
                                                        name={`zipcode-${customerTelephoneNumber}`}
                                                        validateTrigger="onBlur"
                                                        rules={[
                                                            {
                                                                required: true,
                                                                validateTrigger:
                                                                    'onBlur',
                                                                validator: customValidator,
                                                            },
                                                        ]}
                                                    >
                                                        <Input
                                                            maxLength={5}
                                                            autoComplete="off"
                                                            onChange={(e) =>
                                                                handleField(
                                                                    e.target
                                                                        .value,
                                                                    'zipcode',
                                                                    customerTelephoneNumber
                                                                )
                                                            }
                                                        />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={9}>
                                                    <Form.Item
                                                        label="Last digit 4 SSN/TaxId"
                                                        name={`taxId-${customerTelephoneNumber}`}
                                                        validateTrigger="onBlur"
                                                        normalize={(value) =>
                                                            value.replace(
                                                                /[^0-9]/gi,
                                                                ''
                                                            )
                                                        }
                                                        rules={[
                                                            {
                                                                validateTrigger:
                                                                    'onBlur',
                                                                validator: customValidator,
                                                            },
                                                        ]}
                                                    >
                                                        <Input
                                                            maxLength={4}
                                                            minLength={4}
                                                            autoComplete="off"
                                                            onChange={(e) =>
                                                                handleField(
                                                                    e.target
                                                                        .value,
                                                                    'taxId',
                                                                    customerTelephoneNumber
                                                                )
                                                            }
                                                        />
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                );
                            }
                        }
                    )}
                    <Row gutter={18}>
                        <Col
                            span={24}
                            style={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                            }}
                        >
                            <Button
                                block
                                onClick={() => setEditOrder(false)}
                                style={{ width: 100, marginRight: 12 }}
                            >
                                Close
                            </Button>
                            <Form.Item shouldUpdate>
                                {() => (
                                    <Button
                                        block
                                        type="primary"
                                        htmlType="submit"
                                        loading={loading}
                                        disabled={
                                            hasErrors(form.getFieldsError()) ||
                                            Object.keys(formValues).length !==
                                                lines.filter(
                                                    ({
                                                        lineStepStatus,
                                                        lineStep,
                                                    }) =>
                                                        lineStepStatus ===
                                                            'RESOLUTIONREQ' &&
                                                        lineStep === 'PORTIN'
                                                )?.length
                                        }
                                    >
                                        Update Order
                                    </Button>
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </div>
        </div>
    );
}

export default UpdateOrder;
