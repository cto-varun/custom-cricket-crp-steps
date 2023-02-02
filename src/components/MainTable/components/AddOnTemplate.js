import React from 'react';
import {
    InfoCircleOutlined,
    DeleteOutlined,
    PlusOutlined,
} from '@ant-design/icons';
import MainTablePopover from './MainTablePopover';

const AddOnTemplate = (props) => {
    const { data = { changes: {} }, updateQuantityFunction, rowIndex } = props;
    const { changes } = data;
    const isChanged = Object.keys(changes).length > 0;
    let { quantity } = data;
    if (isChanged && changes.hasOwnProperty('quantity')) {
        quantity = changes?.quantity;
    }
    if (Object.keys(data).length === 0) {
        return null;
    }
    if (isChanged && changes.hasOwnProperty('removedAddOn')) {
        return null;
    }
    return (
        <MainTablePopover
            popoverContent={
                <div className="changeAddOnPopover">
                    <span
                        onClick={() => {
                            updateQuantityFunction(
                                rowIndex,
                                data.socCode,
                                quantity - 1
                            );
                        }}
                    >
                        <DeleteOutlined />
                    </span>
                    <span className="changeAddOnQuantityContainer">
                        {quantity}
                    </span>
                    <span
                        onClick={() => {
                            updateQuantityFunction(
                                rowIndex,
                                data.socCode,
                                quantity + 1
                            );
                        }}
                    >
                        <PlusOutlined className="changeAddOn" />
                    </span>
                </div>
            }
            popoverTitle={
                <div className="changeAddOnPopoverTitle">${data.price}</div>
            }
            popoverTrigger="click"
        >
            <div className={isChanged ? 'changedAddOn' : 'originalAddOn'}>
                ${data.price} {data.socCode}{' '}
                <span className="addOnQuantityContainer">{quantity}</span>
                <MainTablePopover
                    popoverContent={
                        <div>
                            <div>{data.shortDescription}</div>
                            <div>{data.longDescription}</div>
                            <div>{data.price}</div>
                        </div>
                    }
                >
                    <InfoCircleOutlined />
                </MainTablePopover>
            </div>
        </MainTablePopover>
    );
};

export default AddOnTemplate;
