"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _antd = require("antd");
var _componentMessageBus = require("@ivoyant/component-message-bus");
var _lodash = _interopRequireDefault(require("lodash.clonedeep"));
var _helpers = require("../../helpers/helpers");
require("./TechnicalSocModal.css");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const TechnicalSocModal = _ref => {
  let {
    dataHook,
    technicalSocCode = '',
    technicalSocCtn = '',
    addOrRemove = '',
    technicalSocUpdate,
    datasources,
    tableRowIndex,
    socMetadata = {}
  } = _ref;
  const [state, setState] = dataHook;
  const {
    workflow,
    datasource,
    responseMapping,
    successStates,
    errorStates
  } = technicalSocUpdate;
  const resetModal = () => {
    setState(_s => ({
      ..._s,
      uiData: {
        ..._s.uiData,
        selected: {
          ..._s.uiData?.selected,
          technicalSocCode: '',
          technicalSocCtn: '',
          addOrRemove: ''
        }
      },
      stepControllerFeedback: {
        ..._s.stepControllerFeedback,
        modal: {
          display: false,
          message: '',
          footer: null,
          onOk: null,
          onCancel: null,
          maskClosable: true,
          lazyLoad: null,
          lazyProps: {},
          title: ''
        }
      }
    }));
  };
  const removeTechnicalSoc = (index, socCode) => {
    const updatedDataSource = (0, _lodash.default)(state?.tableData?.finalData);
    const technicalSocsRow = updatedDataSource[index].technicalSocs;
    const technicalSocIndex = (0, _helpers.getTechnicalSocIndexFromTable)(technicalSocsRow, socCode);
    if (technicalSocIndex !== -1) {
      technicalSocsRow.splice(technicalSocIndex, 1);
    }
    state.setFinalTableData(updatedDataSource);
    setState(v => ({
      ...v,
      tableData: {
        ...v.tableData,
        finalData: updatedDataSource
      }
    }));
  };
  const addTechnicalSoc = (index, socMeta) => {
    const updatedDataSource = (0, _lodash.default)(state?.tableData?.finalData);
    const technicalSocsRow = updatedDataSource[index].technicalSocs;
    const technicalSocRowIdx = technicalSocsRow.findIndex(rowItem => rowItem?.socCode === socMeta?.socCode);
    // If soc does not already exists on line
    if (technicalSocRowIdx === -1) {
      // custom logic for technical socs - we can only have quantity of 1 for these socs.
      technicalSocsRow.push({
        ...socMeta,
        quantity: 1,
        addOnType: socMeta?.addOnType
      });
      state.setFinalTableData(updatedDataSource);
      setState(v => ({
        ...v,
        tableData: {
          ...v.tableData,
          finalData: updatedDataSource
        }
      }));
    }
  };
  const technicalSocUpdateResponse = (socCode, addOrRemoveBoolean) => (subscriptionId, topic, eventData, closure) => {
    const status = eventData.value;
    const isSuccess = successStates.includes(status);
    const isFailure = errorStates.includes(status);
    if (isSuccess || isFailure) {
      if (isSuccess) {
        if (addOrRemoveBoolean.toUpperCase() === 'REMOVE') {
          removeTechnicalSoc(tableRowIndex, socCode);
          resetModal();
          _componentMessageBus.MessageBus.unsubscribe(subscriptionId);
        }
        if (addOrRemoveBoolean.toUpperCase() === 'ADD') {
          addTechnicalSoc(tableRowIndex, socMetadata);
          resetModal();
          _componentMessageBus.MessageBus.unsubscribe(subscriptionId);
        }
      }
      if (isFailure) {
        resetModal();
        _componentMessageBus.MessageBus.unsubscribe(subscriptionId);
      }
    }
  };
  const technicalSocUpdateCall = requestBody => {
    _componentMessageBus.MessageBus.subscribe(workflow, 'WF.'.concat(workflow).concat('.STATE.CHANGE'), technicalSocUpdateResponse(technicalSocCode, addOrRemove));
    _componentMessageBus.MessageBus.send('WF.'.concat(workflow).concat('.INIT'), {
      header: {
        registrationId: workflow,
        workflow,
        eventType: 'INIT'
      }
    });
    _componentMessageBus.MessageBus.send('WF.'.concat(workflow).concat('.SUBMIT'), {
      header: {
        registrationId: workflow,
        workflow,
        eventType: 'SUBMIT'
      },
      body: {
        datasource: datasources[datasource],
        request: {
          body: requestBody,
          params: {
            phonenumber: technicalSocCtn
          }
        },
        responseMapping
      }
    });
  };
  const createTechnicalSocUpdateRequestBody = (soc, action) => {
    return {
      services: [{
        soc,
        action: action.toUpperCase()
      }]
    };
  };
  const onYesClick = () => {
    const requestBody = createTechnicalSocUpdateRequestBody(technicalSocCode, addOrRemove);
    technicalSocUpdateCall(requestBody);
  };
  const onNoClick = () => {
    resetModal();
  };
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "technicalSocModalContainer"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "technicalSocModalHeader"
  }, addOrRemove.charAt(0).toUpperCase() + addOrRemove.slice(1), ' ', "Technical Socs"), /*#__PURE__*/_react.default.createElement("div", {
    className: "technicalSocModalBody"
  }, "Are you sure you would like to ", addOrRemove, ' ', /*#__PURE__*/_react.default.createElement("span", {
    className: "technicalSocName"
  }, technicalSocCode), "?"), /*#__PURE__*/_react.default.createElement("div", {
    className: "technicalSocButtonContainer"
  }, /*#__PURE__*/_react.default.createElement(_antd.Button, {
    className: "technicalSocButton yesBtn",
    onClick: onYesClick
  }, "Yes"), /*#__PURE__*/_react.default.createElement(_antd.Button, {
    className: "technicalSocButton noBtn",
    onClick: onNoClick
  }, "No")));
};
var _default = TechnicalSocModal;
exports.default = _default;
module.exports = exports.default;