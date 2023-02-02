import React, { useState } from 'react';

const ErrorModal = ({ errorMessage, technicalDetails, variables }) => {
    if (technicalDetails === undefined) technicalDetails = variables?.technicalDetails;
    if (errorMessage === undefined) errorMessage = variables?.errorMessage;
    const [showDetails, setShowDetails] = useState(true);
    let details = null;
    if (technicalDetails) {
        details = technicalDetails.map(({ code, message }, index) => (
            <div
                className="payment-error-msg bottom-spacing side-spacing"
                key={index}
            >
                <span>
                    {code}: {message}
                </span>
            </div>
        ));
    }
    return (
        <div className="customer-360-payment-error" style={{ height: '100%' }}>
            <div className="svg-container side-spacing">
                <div
                    className="denger-symbol"
                    onClick={() => setShowDetails(!showDetails)}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        x="10px"
                        y="10px"
                        fill="#fff"
                        viewBox="-35 -20 220 220"
                    >
                        <g>
                            <path d="M149.308,120.469L88.83,15.716c-2.744-4.752-7.659-7.589-13.146-7.589s-10.402,2.837-13.146,7.589L2.058,120.469c-2.744,4.753-2.744,10.428,0,15.18s7.658,7.59,13.146,7.59h120.957c5.488,0,10.402-2.837,13.146-7.59S152.052,125.222,149.308,120.469zM140.648,130.649c-0.45,0.779-1.787,2.59-4.486,2.59H15.205c-2.699,0-4.036-1.811-4.486-2.59c-0.449-0.779-1.35-2.842,0-5.18L71.197,20.717c1.35-2.338,3.587-2.59,4.486-2.59s3.137,0.252,4.486,2.589l60.479,104.752C141.998,127.807,141.097,129.87,140.648,130.649z" />{' '}
                            <path d="M79.168,95.966l3.068-20.805c0.708-4.644,1.365-9.401,1.365-12.742c0-7.5-2.694-11.302-8.006-11.302c-5.254,0-7.917,3.802-7.917,11.302c0,3.341,0.656,8.098,1.363,12.73l3.074,20.839c1.142-0.334,2.337-0.525,3.569-0.525 C76.885,95.463,78.051,95.647,79.168,95.966z" />{' '}
                            <path d="M83.37,105.812c-0.06-0.15-0.124-0.298-0.192-0.444c-0.304-0.656-0.684-1.272-1.139-1.827 c-0.34-0.415-0.719-0.797-1.129-1.141s-0.853-0.65-1.321-0.911c-1.171-0.653-2.505-1.027-3.906-1.027c-4.406,0-8.273,3.908-8.273,8.362c0,1.109,0.237,2.176,0.662,3.151c0.319,0.731,0.744,1.412,1.254,2.021c0.681,0.812,1.514,1.498,2.45,2.009c0.469,0.255,0.963,0.467,1.477,0.629c0.771,0.243,1.588,0.375,2.429,0.375c2.281,0,4.349-0.918,5.847-2.4c0.375-0.37,0.713-0.776,1.011-1.212c0.447-0.653,0.8-1.373,1.042-2.142c0.242-0.768,0.373-1.585,0.373-2.431C83.956,107.768,83.743,106.753,83.37,105.812z" />{' '}
                        </g>
                    </svg>
                </div>
            </div>
            <div className="sorry-text side-spacing">Unable to Submit</div>
            <div className="payment-error-msg bottom-spacing side-spacing">
                {errorMessage}
            </div>
            {showDetails ? details : null}
            <div className="payment-error-msg bottom-spacing side-spacing">
                Please try again later.
            </div>
        </div>
    );
};

export default ErrorModal;
