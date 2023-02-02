import React from 'react';
import { Tabs, Input, Switch } from 'antd';
import Expand from '../../../Icons/Expand';
import Robot from '../../../Icons/Robot';
import './styles.css';

const TabBarUI = ({ expandView, onExpireToggle, onExpandClick }) => (
    <>
        <div className="tab-bar-wrapper__search-wrapper">
            <span className="tab-bar-wrapper__robot-icon-wrapper">
                <Robot />
            </span>
            <Input
                className="tab-bar-wrapper__input-element"
                placeholder="Ask me what you are looking for"
                disabled
            />
        </div>
        <div className="tab-bar-wrapper__ui-elements">
            <div className="tab-bar-wrapper__ui-elements--expire">
                <Switch size="small" onChange={onExpireToggle} /> Expire
            </div>
            <div
                className="tab-bar-wrapper__ui-elements--expand"
                onClick={onExpandClick}
            >
                <Expand invert={expandView} />
            </div>
        </div>
    </>
);

const mapPanels = ({ children, panelTitles = [], keys }) =>
    children.map((childView, index) => {
        const tab = panelTitles?.length ? panelTitles[index] : null;
        const key = (keys && keys[index]) || index;
        const child = React.cloneElement(childView, { tabType: key });
        return {
            label: tab,
            key,
            children: child
        };
    });

const TabComponent = ({
    properties: {
        keys,
        defaultActiveKey,
        expandView,
        panelTitles,
        onExpandClick,
        onExpireToggle,
    },
    children,
    className,
}) => {
    const wrapperClassName = `crp-tabs-ui${` ${className}` || ''}`;
    const panelComponents = mapPanels({ children, panelTitles, keys });
    return (
        <Tabs
            className={wrapperClassName}
            defaultActiveKey={defaultActiveKey}
            tabBarExtraContent={
                <TabBarUI
                    expandView={expandView}
                    onExpireToggle={onExpireToggle}
                    onExpandClick={onExpandClick}
                />
            }
            items={panelComponents}
        >
        </Tabs>
    );
};

export default TabComponent;
