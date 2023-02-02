import React, { useState } from 'react';

import './AddOnModal.css';

const AddOnModal = ({ dataHook, selected }) => {
    const [state, setState] = dataHook;

    let defaultAddOnObject = {
        socCode: '',
        shortDescription: '',
        price: '',
        longDescription: '',
        addOnType: '',
        maxQuantity: 9,
        minQuantity: 1,
    };

    if (selected && selected.meta) {
        defaultAddOnObject = selected.meta;
    }

    const {
        socCode,
        shortDescription,
        price,
        longDescription,
        addOnType,
        maxQuantity = 9,
    } = defaultAddOnObject;

    const isOneTime = addOnType === 'ONETIME';

    const [quantity, setQuantity] = useState(1);

    const onPlusClick = () => {
        if (quantity < maxQuantity) {
            setQuantity(quantity + 1);
        }
    };

    const onMinusClick = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const handleAddClick = () => {
        const currentAddOns = state.uiData.selected.addOns;
        if (currentAddOns.length > 0) {
            currentAddOns.map((item) => {
                const currentItemQty =
                    item.socCode === socCode ? quantity : item?.quantity;

                return { ...item, quantity: currentItemQty || 1 };
            });
        }
        setState((v) => ({
            ...v,
            uiData: {
                ...v.uiData,
                selected: {
                    ...v.uiData.selected,
                    addOns: currentAddOns,
                },
                lastAction: 'closeModal',
            },
            tableData: {
                ...v.tableData,
                shouldUpdateAddOns: true,
            },
            stepControllerFeedback: {
                ...v.stepControllerFeedback,
                modal: {
                    display: false,
                    message: '',
                    footer: null,
                    onOk: null,
                    onCancel: null,
                    maskClosable: true,
                    lazyLoad: null,
                    lazyProps: {},
                    title: '',
                },
            },
        }));
    };

    return (
        <div className="addOnModalContainer">
            <div className="nameContainer">{shortDescription}</div>
            <div className="rateContainer">{`$${price}/mo`}</div>
            <div className="descContainer">{longDescription}</div>
            <div className="selectorContainer">
                <div className="selectorLabel">How often ?</div>
                <div className={`selectorValue${isOneTime ? ' selected' : ''}`}>
                    Once
                </div>
                <div
                    className={`selectorValue${!isOneTime ? ' selected' : ''}`}
                >
                    Monthly
                </div>
            </div>
            <div className="dashedBorder" />
            {isOneTime && (
                <div className="plusMinusContainer">
                    <div className="plusMinusRateContainer">{`$${
                        price * quantity
                    }`}</div>
                    <div className="plusMinusBtnsContainer">
                        <div
                            className="plusMinusBtn plusBtn"
                            onClick={onPlusClick}
                        >
                            +
                        </div>
                        <div
                            className="plusMinusBtn minusBtn"
                            onClick={onMinusClick}
                        >
                            -
                        </div>
                    </div>
                </div>
            )}
            {isOneTime && <div className="onceLabelContainer">Once</div>}
            <div className="amountContainer">
                <div className="labelText">Monthly</div>
                <div className="amountText">{`$${price}`}</div>
            </div>
            <div className="dashedBorder" />
            <div className="amountContainer">
                <div className="labelText totalText">Feature Total</div>
                <div className="amountText totalAmount">{`$${
                    price * quantity
                }`}</div>
            </div>
            <div className="dashedBorder" />
            <div className="addBtn" onClick={handleAddClick}>
                ADD
            </div>
        </div>
    );
};

export default AddOnModal;
