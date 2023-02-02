import React from 'react';
import { Table, Tag, Space, Button, Typography } from 'antd';
import { EditOutlined, StopOutlined } from '@ant-design/icons';

const Tags = {
    CREATED: { color: 'blue', title: 'Created' },
    INPROGRESS: { color: 'orange', title: 'In Progress' },
    SUCCESS: { color: 'green', title: 'Success' },
    CANCELLED: { color: 'red', title: 'Canceled' },
    OKTOSUBMIT: { color: 'green', title: 'OK to Submit' },
    FAILURE: { color: 'red', title: 'Failure' },
};

const { Text } = Typography;

const OrderList = ({ data, isLoading, onEditOrder, onCancelOrder }) => {
    const columns = [
        {
            dataIndex: 'orderId',
            title: 'Order ID',
            align: 'left',
            render: (text, record, index) => {
                return <Text strong>{text}</Text>;
            },
        },
        {
            dataIndex: 'billingAccountNumber',
            title: 'Account Number',
            align: 'left',
        },
        {
            dataIndex: 'firstName',
            title: 'First Name',
            align: 'left',
        },
        {
            dataIndex: 'lastName',
            title: 'Last Name',
            align: 'left',
        },
        {
            dataIndex: 'orderStepStatus',
            title: 'Status',
            align: 'left',
            render: (text, record) => {
                return <Tag color={Tags[text].color}>{Tags[text].title}</Tag>;
            },
        },
        {
            render: (_, record) => {
                const enableUpdate =
                    record.orderStepStatus === 'INPROGRESS' &&
                    record?.lines?.find(
                        ({ lineStep, lineStepStatus }) =>
                            lineStep === 'PORTIN' &&
                            lineStepStatus === 'RESOLUTIONREQ'
                    );

                return (
                    <Space size="middle">
                        <Button
                            type="link"
                            shape="circle"
                            disabled={!enableUpdate}
                            onClick={() => onEditOrder(record)}
                            icon={<EditOutlined />}
                        />
                        <Button
                            type="link"
                            shape="circle"
                            onClick={() => onCancelOrder()}
                            icon={<StopOutlined />}
                        />
                    </Space>
                );
            },
        },
    ];

    const expandedRowRender = () => {
        const columns = [
            {
                title: 'Phone Number',
                dataIndex: 'customerTelephoneNumber',
                key: 'customerTelephoneNumber',
            },
            {
                title: 'Line Step',
                dataIndex: 'lineStep',
                key: 'lineStep',
            },
            {
                title: 'Line Step Status',
                dataIndex: 'lineStepStatus',
                key: 'lineStepStatus',
                render: (text, record) => {
                    return <>{text}</>;
                },
            },
            {
                title: 'Line Step Details',
                dataIndex: 'lineStepDetails',
                key: 'lineStepDetails',
                render: (data) => {
                    return <> {data?.length > 0 && data[0]?.message}</>;
                },
            },
            {
                title: 'Port In Status Text',
                dataIndex: 'portInDetails',
                key: 'portInDetails',
                render: (data) => {
                    return (
                        <>
                            {data?.portInRequestStatus?.portInRequestStatusText}
                        </>
                    );
                },
            },
        ];

        return (
            <Table
                columns={columns}
                dataSource={data[0].lines}
                pagination={false}
            />
        );
    };

    return (
        <div className="order-list">
            <Table
                className="order-list-table"
                loading={isLoading}
                columns={columns}
                dataSource={data}
                pagination={false}
                expandable={{
                    defaultExpandAllRows: true,
                    expandedRowRender,
                }}
            />
        </div>
    );
};

export default OrderList;
