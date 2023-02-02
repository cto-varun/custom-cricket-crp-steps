import React from 'react';
import { Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

const ChangesTemplate = (props) => {
    const {
        data = {},
        resetNewAddOn,
        resetAddOnQuantity,
        resetRemovedAddOn,
        rowIndex,
    } = props;
    if (Object.keys(data).length === 0) {
        return null;
    }
    const socCode = Object.keys(data)[0];
    const { changeType } = data[socCode];
    switch (changeType) {
        case 'addOnQuantity':
            return (
                <div className="changeAddOnQuantity">
                    Set Amount of Add-On {socCode} to {data[socCode]?.quantity}
                    <ReloadOutlined
                        onClick={() => resetAddOnQuantity(rowIndex, socCode)}
                    />
                </div>
            );
        case 'newAddOn':
            return (
                <div className="changeNewAddOn">
                    Added {data[socCode]?.quantity} of Add-On {socCode}
                    <ReloadOutlined
                        onClick={() => resetNewAddOn(rowIndex, socCode)}
                    />
                </div>
            );
        case 'removedAddOn':
            return (
                <div className="changeRemovedAddOn">
                    Removed Add-On {socCode}
                    <ReloadOutlined
                        onClick={() => resetRemovedAddOn(rowIndex, socCode)}
                    />
                </div>
            );
        default:
            return <div>Invalid change type specified.</div>;
    }
};

export default ChangesTemplate;
