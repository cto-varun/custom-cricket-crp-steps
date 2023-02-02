import React, { useEffect } from 'react';
import { Spin } from 'antd';
import redirectOnModalClose from '../helpers/redirectOnModalClose';

export default function Step5({ properties, dataHook: [, setState] }) {
    const { onCompleteEvent = 'CRP.COMPLETE' } = properties;

    useEffect(() => {
        setTimeout(() => {
            redirectOnModalClose(
                setState,
                onCompleteEvent
            )('Order was successfully submitted.');
        }, 7000);
    }, []);
    return <Spin tip="Loading..." size="large"></Spin>;
}
