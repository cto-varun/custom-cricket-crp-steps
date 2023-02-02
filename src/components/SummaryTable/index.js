import React from 'react';
import './styles.css';

const mergeProps = (
    baseClassName,
    { className = null, style = null, ...restProps }
) => {
    return {
        className: `${baseClassName}${className ? ` ${className}` : ''}`,
        ...(style ? { style: { ...style } } : {}),
        ...restProps,
    };
};

const Tag = ({ tag = 'div', className, children, props }) => {
    const BaseTag = tag;
    const mergableProps = mergeProps(className, props);
    return <BaseTag {...mergableProps}>{children}</BaseTag>;
};

const Summary = ({ children, ...restProps }) => {
    return (
        <Tag className="summary__wrapper" props={restProps}>
            {children}
        </Tag>
    );
};

const Text = (baseClassName = '') => ({
    text,
    align = 'left',
    children,
    ...restProps
}) => {
    let spanText = text;
    let extranenousContent = children;
    if (typeof children === 'string' || typeof children === 'number') {
        spanText = text != null ? text : children;
        extranenousContent = null;
    }

    const props = {
        ...restProps,
        className: `summary__text--${align}`,
    };

    return (
        <>
            <Tag tag="span" className={baseClassName} props={props}>
                {spanText}
            </Tag>
            {extranenousContent}
        </>
    );
};

const Row = ({ children, ...restProps }) => {
    return (
        <Tag className="summary__row" props={restProps}>
            {children}
        </Tag>
    );
};

const formatValue = (price, placeholder) => {
    const parsedPrice = Number.parseFloat(price);
    if (Number.isNaN(parsedPrice)) {
        return placeholder;
    }
    const formattedPrice = `${parsedPrice}`.includes('.')
        ? parsedPrice.toFixed(2)
        : `${parsedPrice}`;
    return formattedPrice.startsWith('-')
        ? `-$${formattedPrice.slice(1)}`
        : `$${formattedPrice}`;
};

const parseColorMap = (value, colorMap) => {
    let color = null;
    Object.keys(colorMap).forEach((k) => {
        if (k === 'gt' || k === 'lt') {
            Object.keys(colorMap[k]).some((testValue) => {
                const test =
                    k === 'gt'
                        ? Number.parseFloat(value) > +testValue
                        : Number.parseFloat(value) < +testValue;
                if (test) {
                    color = colorMap[k][testValue];
                    return true;
                }
                return false;
            });
        }

        if (Number.parseFloat(value) === +k) {
            color = colorMap[k];
        }
    });

    return color;
};

const Value = ({
    value = null,
    align = 'right',
    children,
    valueColorMap = {
        0: '#d5dce5',
    },
    placeholder = '\u2014',
    displayPlaceholder = true,
    ...restProps
}) => {
    let spanValue = value;
    let extranenousContent = children;

    if (
        (typeof children === 'string' || typeof children === 'number') &&
        spanValue == null
    ) {
        spanValue = children;
        extranenousContent = null;
    }
    spanValue = spanValue != null ? spanValue : placeholder;
    let valueTag = null;
    if (spanValue != null) {
        const color = parseColorMap(spanValue, valueColorMap);
        spanValue = formatValue(
            spanValue,
            displayPlaceholder ? placeholder : spanValue
        );
        const props = {
            ...restProps,
            style: {
                color: spanValue === placeholder ? '#d5dce5' : color,
                ...restProps.style,
            },
            className: `summary__text--${align}`,
        };
        valueTag = (
            <Tag tag="span" className="summary__value" props={props}>
                {spanValue}
            </Tag>
        );
    }

    return (
        <>
            {valueTag}
            {extranenousContent}
        </>
    );
};

const Content = ({ children, ...restProps }) => {
    return (
        <Tag className="summary__content" props={restProps}>
            {children}
        </Tag>
    );
};

Summary.Title = Text('summary__title');
Summary.Subtitle = Text('summary__subtitle');
Summary.Row = Row;
Summary.Text = Text('summary__text');
Summary.Value = Value;
Summary.Content = Content;

export default Summary;
