import React from 'react';
import { Spin } from 'antd';
import './styles.css';

const Spinner = ({ tip = '', className = '' }) => {
    return <Spin className={className} tip={tip} />;
};

export default Spinner;
