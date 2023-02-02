import React from 'react';
import { Button } from 'antd';
import QuestionIcon from '../../Icons/Question';
import './UndoSelectionModal.css';

const delayedClose = (setState, dms) => {
    setState((s) => ({
        ...s,
        stepControllerFeedback: {
            ...s.stepControllerFeedback,
            modal: {
                ...s.stepControllerFeedback.modal,
                display: false,
            },
        },
    }));

    setTimeout(() => {
        setState((s) => ({
            ...s,
            stepControllerFeedback: {
                ...s.stepControllerFeedback,
                modal: dms,
            },
        }));
    }, 500);
};

const UndoSelectionModal = ({
    dataHook,
    removeFunction,
    defaultModalState,
}) => {
    const [, setState] = dataHook;
    const close = () => delayedClose(setState, defaultModalState);

    const onYesClick = () => {
        removeFunction();
        close();
    };
    const onNoClick = () => close();

    return (
        <div className="undo-selection__wrapper">
            <div className="undo-selection__icon-wrapper">
                <QuestionIcon />
            </div>
            <div className="undo-selection__dialog-buttons">
                <span className="undo-selection__dialog-text">
                    Do you want to unselect current selection?
                </span>
                <div className="undo-selection__buttons">
                    <Button
                        className="undo-selection__buttons--yes"
                        onClick={onYesClick}
                    >
                        Yes
                    </Button>
                    <Button
                        className="undo-selection__buttons--no"
                        onClick={onNoClick}
                    >
                        No
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default UndoSelectionModal;
