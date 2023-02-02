import React from 'react';
import { Button } from 'antd';

const handleChange = (isChecked, state, setState) => {
    setState((v) => ({
        ...v,
        uiData: {
            ...v.uiData,
            disclaimerRead: !isChecked,
        },
    }));
};

const Disclaimer = ({ dataHook }) => {
    const [state, setState] = dataHook;

    const [isChecked, setIsChecked] = React.useState(false);

    return (
        <div>
            <div>
                Please read the appropriate disclaimer for the rate plan(s) they
                have chosen
            </div>
            <div>$55 Unlimited More</div>
            <form>
                <label htmlFor="confirmDisclaimer">
                    <input
                        type="checkbox"
                        name="confirmDisclaimer"
                        value="confirmed"
                        checked={isChecked}
                        onChange={() => {
                            setIsChecked(!isChecked);
                        }}
                    />
                    <span>I have read the appropriate disclaimer</span>
                </label>
            </form>
            <div>
                <Button
                    disabled={!isChecked}
                    onClick={() => {
                        if (isChecked) {
                            setState((v) => ({
                                ...v,
                                uiData: {
                                    ...v.uiData,
                                    disclaimerRead: true,
                                },
                                stepControllerFeedback: {
                                    ...v.stepControllerFeedback,
                                    modal: {
                                        display: false,
                                        message: '',
                                    },
                                },
                            }));
                        }
                    }}
                >
                    CONTINUE
                </Button>
            </div>
        </div>
    );
};

export default Disclaimer;
