"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = require("react");
var _useAsyncFunctionHelpers = _interopRequireDefault(require("../helpers/useAsyncFunctionHelpers"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const loadData = (loadAsyncMachineFunctions, setProcessorState) => {
  loadAsyncMachineFunctions.forEach(_ref => {
    let {
      fn = '',
      name = ''
    } = _ref;
    window[window.sessionStorage?.tabId][fn] = data => {
      setProcessorState(s => ({
        ...s,
        loadedData: {
          ...s.loadedData,
          [name]: data.payload
        }
      }));
    };
  });
};
const requestPlansAndAddons = (lineDetails, accountDetails) => {
  const subscribers = lineDetails?.map(_ref2 => {
    let {
      subscriberNumber,
      ptnStatus: subscriberStatus
    } = _ref2;
    return {
      subscriberNumber,
      subscriberStatus
    };
  });
  lineDetails?.forEach((element, index) => {
    subscribers[index].socCode = element?.currentRatePlan === undefined ? '' : element?.currentRatePlan[0]?.soc;
    subscribers[index].imei = element?.imei === undefined ? '' : element?.imei;
  });
  const requestBody = {
    billingAccountNumber: window[window.sessionStorage?.tabId].NEW_BAN?.toString(),
    accountStatus: accountDetails?.banStatus,
    profile: window[window.sessionStorage?.tabId].COM_IVOYANT_VARS?.profile,
    includeExpired: true,
    subscribers,
    includeFeatures: true
  };
  const plansAddonsAsyncMachine = window[window.sessionStorage?.tabId].sendgetPlansAndAddonsAsyncMachine;
  if (plansAddonsAsyncMachine) {
    plansAddonsAsyncMachine('SET.REQUEST.DATA', {
      value: requestBody
    });
    plansAddonsAsyncMachine('FETCH');
  }
};
const cleanup = loadAsyncMachineFunctions => {
  loadAsyncMachineFunctions.forEach(_ref3 => {
    let {
      fn
    } = _ref3;
    delete window[window.sessionStorage?.tabId][fn];
  });
};
const useAsyncFunctions = (_ref4, otherParameters) => {
  let {
    loadAsyncMachineFunctions = []
  } = _ref4;
  const {
    dataHook: [{
      uiData: {
        lastAction
      },
      loadedData: loadedDataFromState,
      savedData: {
        step1: {
          table: tableFromState
        }
      }
    }]
  } = otherParameters;
  const {
    dataHook: [state, setState]
  } = otherParameters;
  const {
    lineDetails,
    accountDetails
  } = state;
  const processorHook = (0, _react.useState)({
    status: 'loading',
    // 'render' 'error'
    message: null,
    loadedData: null,
    processedData: {
      table: null
    }
  });
  const [processorState, setProcessorState] = processorHook;
  const {
    loadedData
  } = processorState;
  const processor = window[window.sessionStorage?.tabId].dp;
  if (processor == null || !loadAsyncMachineFunctions.length) {
    setProcessorState(s => ({
      ...s,
      status: 'error',
      message: 'Failed to load an internal module and/or API loading functions failed to obtain data.'
    }));
  }
  (0, _react.useEffect)(function fetchPlansAndAddons() {
    if (!loadedData && lastAction !== 'back/1') {
      loadData(loadAsyncMachineFunctions, setProcessorState);
      // check to see if subscriberNumber or telephoneNumber are not undefined
      if (lineDetails[0]?.subscriberNumber || lineDetails[0]?.telephoneNumber) {
        setTimeout(() => {
          requestPlansAndAddons(lineDetails, accountDetails);
        }, 500);
      } else {
        setProcessorState(s => ({
          ...s,
          status: 'render',
          message: ''
        }));
      }
    }
    return () => {
      cleanup(loadAsyncMachineFunctions);
    };
  }, []);
  (0, _react.useEffect)(function process() {
    if (lastAction === 'back/1') {
      setProcessorState(() => ({
        status: 'render',
        message: null,
        loadedData: loadedDataFromState,
        processedData: {
          table: tableFromState
        }
      }));
    } else if (loadedData && lastAction !== 'back/1') {
      const tab = (0, _useAsyncFunctionHelpers.default)(processor, 'tab', {
        processorHook
      });
      if (tab == null) {
        setProcessorState(s => ({
          ...s,
          status: 'error',
          message: 'Failed to process plans and add-ons request.'
        }));
      } else {
        const {
          dataHook,
          compatibilityHook,
          data
        } = otherParameters;
        const table = (0, _useAsyncFunctionHelpers.default)(processor, 'table', {
          tab,
          apiData: loadedData.apiData,
          dataHook,
          compatibilityHook,
          data
        });
        setProcessorState(s => ({
          ...s,
          status: 'render',
          message: '',
          processedData: {
            ...s.processedData,
            table
          }
        }));
      }
    }
  }, [loadedData]);
  return processorState;
};
var _default = useAsyncFunctions;
exports.default = _default;
module.exports = exports.default;