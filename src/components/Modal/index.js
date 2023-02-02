import React from 'react';
import { Modal as AntModal } from 'antd';

export const defaultModalState = {
    display: false,
    message: '',
    footer: null,
    onOk: null,
    onCancel: null,
    maskClosable: true,
    lazyLoad: null,
    lazyProps: {},
    title: '',
    overrideProps: {},
    className: '',
};

const handleEvent = (setState) => () => {
    setState((v) => ({
        ...v,
        uiData: {
            ...v.uiData,
            lastAction: 'modal/close',
        },
        stepControllerFeedback: {
            ...v.stepControllerFeedback,
            modal: defaultModalState,
        },
    }));
};

const handleLazy = (load, lazyProps, state, setState) => {
    let LazyContent;
    switch (load) {
        case 'ErrorModal':
            LazyContent = React.lazy(() => import('./ErrorModal'));
            break;
        case 'UndoSelectionModal':
            LazyContent = React.lazy(() => import('./UndoSelectionModal'));
            break;
        case 'AddOnModal':
            LazyContent = React.lazy(() => import('./AddOnModal'));
            break;
        case 'TechnicalSocModal':
            LazyContent = React.lazy(() => import('./TechnicalSocModal'));
            break;
        default:
            LazyContent = null;
            break;
    }

    const lazyContentProps = {
        ...lazyProps,
        dataHook: [state, setState],
        defaultModalState,
    };

    return (
        <React.Suspense fallback={null}>
            <LazyContent {...lazyContentProps} />
        </React.Suspense>
    );
};

const Modal = ({ dataHook }) => {
    const [state, setState] = dataHook;
    const {
        stepControllerFeedback: {
            modal: {
                message,
                title,
                display,
                footer = null,
                onOk = null,
                onCancel = null,
                maskClosable = true,
                lazyLoad = null,
                lazyProps = {},
                overrideProps = {},
                className = '',
                closable = true,
            },
        },
    } = state;

    const handleClick = handleEvent(setState);
    const modalContent = lazyLoad
        ? handleLazy(lazyLoad, lazyProps, state, setState)
        : message;

    return (
        <AntModal
            wrapClassName={className || lazyProps?.className || ''}
            title={title}
            open={display}
            onOk={onOk ? onOk(state, setState, defaultModalState) : handleClick}
            onCancel={
                onCancel
                    ? onCancel(state, setState, defaultModalState)
                    : handleClick
            }
            footer={footer}
            maskClosable={maskClosable}
            closable={closable}
            destroyOnClose
            {...overrideProps}
        >
            {modalContent}
        </AntModal>
    );
};

export default Modal;
