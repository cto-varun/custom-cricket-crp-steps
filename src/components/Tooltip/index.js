import React from 'react';
import { Tooltip as AntTooltip } from 'antd';

const Tooltip = (props) => {
    const { children, ...overrideTooltipProps } = props;
    return <AntTooltip {...overrideTooltipProps}>{children}</AntTooltip>;
};

export default Tooltip;
