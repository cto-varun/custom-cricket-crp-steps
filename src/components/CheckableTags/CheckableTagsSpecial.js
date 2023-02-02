import React, { useState } from 'react';
import { Tag } from 'antd';
import Tooltip from '../Tooltip';
import OTCTooltip from '../Tooltip/OTCTooltip';
import InfoTooltip from '../Tooltip/InfoTooltip';
import InfoIcon from '../../Icons/Info';
import UndoIcon from '../../Icons/Undo';
import './styles.css';

const { CheckableTag: AntCheckableTag } = Tag;

const getElementType = (type, option, tagText, key, dataHook, undoProps) => {
    const { label = '', meta = {}, value = '' } = option;
    const { quantity = 0 } = meta;
    switch (type) {
        case 'ebb': {
            return (
                <span key={key} className="checkable-tag__ebb">
                    EBB Eligible
                </span>
            );
        }
        case 'text': {
            return (
                <span key={key} className="checkable-tag__text">
                    {tagText || label}
                </span>
            );
        }
        case 'changes-text': {
            const changesText = tagText || (
                <>
                    Set Amount of{' '}
                    <span className="checkable-tag__text--600">{label}</span> to{' '}
                    <span className="checkable-tag__text--600">{quantity}</span>
                </>
            );
            return (
                <span key={key} className="checkable-tag__text">
                    {changesText}
                </span>
            );
        }
        case 'quantity':
            return (
                <span key={key} className="checkable-tag__quantity-box">
                    {quantity}
                </span>
            );
        case 'info-icon':
            return (
                <Tooltip
                    key={key}
                    title={<InfoTooltip meta={meta} value={value} />}
                    overlayClassName="checkable-tag__tooltip"
                    destroyTooltipOnHide={{ keepParent: false }}
                >
                    <span className="checkable-tag__label-section--icon">
                        <InfoIcon />
                    </span>
                </Tooltip>
            );
        case 'undo-icon': {
            const [, setState] = dataHook;
            const onUndoClick = (event) => {
                event.stopPropagation();
                setState((s) => ({
                    ...s,
                    stepControllerFeedback: {
                        ...s.stepControllerFeedback,
                        modal: {
                            ...s.stepControllerFeedback.modal,
                            display: true,
                            lazyLoad: 'UndoSelectionModal',
                            lazyProps: {
                                ...undoProps,
                                dataHook,
                                className: 'modal__undo-selection'
                            },
                            overrideProps: {
                                mask: false
                            }
                        }
                    }
                }));
            };

            return (
                <span
                    key={key}
                    className="checkable-tag__label-section--icon"
                    onClick={onUndoClick}
                >
                    <UndoIcon />
                </span>
            );
        }
        default:
            return <React.Fragment key={key} />;
    }
};

const mapElements = (displayElements, option, tagText, dataHook, undoProps) => {
    return (
        <span className="checkable-tag__label-wrapper">
            {displayElements.map((type, index) =>
                getElementType(
                    type,
                    option,
                    tagText,
                    index,
                    dataHook,
                    undoProps
                )
            )}
        </span>
    );
};

const applyClassName = (colors, auto, tagClassName) => {
    const withAuto = auto
        ? 'checkable-tag__wrapper checkable-tag__wrapper--auto '
        : 'checkable-tag__wrapper';
    const withTagClassName = tagClassName
        ? `${withAuto}${tagClassName} `
        : withAuto;

    const colorSet = [
        {
            color: 'gray',
            display: colors.gray
        },
        {
            color: 'green',
            display: colors.green
        },
        {
            color: 'lime-green',
            display: colors.limeGreen
        },
        {
            color: 'red',
            display: colors.red
        }
    ];

    const displayOther = colorSet.findIndex((item) => item.display);

    if (displayOther === -1) {
        return `${withTagClassName}checkable-tag__wrapper--default`;
    }
    return `${withTagClassName}checkable-tag__wrapper--${colorSet[displayOther].color}`;
};

const CheckableTagSpecial = (props) => {
    const {
        option,
        onChange,
        displayElements,
        allowQuantityEdit = false,
        tagClassName,
        tagText = '',
        dataHook,
        otcProps = {},
        undoProps = {},
        gray = false,
        green = false,
        limeGreen = false,
        red = false
    } = props;
    const { value } = option;
    let Wrapper = React.Fragment;
    let wrapperProps = {};
    const [visible, setVisible] = useState(null);

    if (allowQuantityEdit) {
        Wrapper = Tooltip;

        const title = (
            <OTCTooltip setVisible={() => setVisible(false)} {...otcProps} />
        );

        wrapperProps = {
            title,
            trigger: 'click',
            overlayClassName: 'checkable-tag__otc-tooltip',
            placement: 'top',
            onClick: () => setVisible(true),
            visible: visible,
            onVisibleChange: () => setVisible(!visible)
        };
    }

    const elements = mapElements(
        displayElements,
        option,
        tagText,
        dataHook,
        undoProps
    );

    const checkableClassName = applyClassName(
        { gray, green, limeGreen, red },
        displayElements.length > 0,
        tagClassName
    );

    return (
        <Wrapper {...wrapperProps}>
            <AntCheckableTag
                key={value}
                className={checkableClassName}
                onChange={onChange}
            >
                {elements}
            </AntCheckableTag>
        </Wrapper>
    );
};

export default CheckableTagSpecial;
