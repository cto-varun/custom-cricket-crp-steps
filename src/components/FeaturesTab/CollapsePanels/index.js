import React from 'react';
import { Checkbox, Collapse } from 'antd';
import './styles.css';

const PanelHeader = ({ checked, isCurrent, label, price, onChange }) => {
    const priceDisplay = price ? (
        <div className="collapse-panel__header-price">{`$${price} per month`}</div>
    ) : null;

    const wrapperClassName = `collapse-panel__header-wrapper${
        isCurrent ? '' : ' collapse-panel__header-wrapper--expired'
    }`;

    const stopPropagation = (event) => {
        event.stopPropagation();
    };

    return (
        <div className={wrapperClassName}>
            <Checkbox
                className="collapse-panel__header-checkbox"
                checked={checked}
                onChange={onChange}
                onClick={stopPropagation}
            >
                {label}
            </Checkbox>
            {priceDisplay}
        </div>
    );
};

export default function CollapsePanels({
    isChecked,
    onChangeHandler,
    options = [],
    wrapperClassName = 'collapse-panel__parent-wrapper',
    setState,
    tabType,
}) {
    return (
        <div className={wrapperClassName}>
            <Collapse expandIconPosition="right">
                {options.map((option, index) => {
                    const { isCurrent, label, meta, value } = option;
                    const { longDescription, price } = meta;
                    const onChange = (selectedMeta) => {
                        setState((v) => ({
                            ...v,
                            uiData: {
                                ...v.uiData,
                                lastAction: 'checkableTagsChanged',
                                selected: {
                                    ...v.uiData.selected,
                                    [tabType]: [{ selectedMeta }],
                                },
                            },
                            tableData: {
                                ...v.tableData,
                                shouldUpdate: tabType,
                            },
                        }));
                    };
                    const checked = isChecked(value);
                    const key = index;
                    const currentClassName = checked
                        ? ' collapse-panel__panel-wrapper--checked'
                        : '';

                    return (
                        <Collapse.Panel
                            key={key}
                            className={currentClassName}
                            header={
                                <PanelHeader
                                    label={label}
                                    price={price}
                                    onChange={() => onChange(meta)}
                                    isCurrent={isCurrent}
                                />
                            }
                        >
                            <p>{longDescription}</p>
                        </Collapse.Panel>
                    );
                })}
            </Collapse>
        </div>
    );
}
