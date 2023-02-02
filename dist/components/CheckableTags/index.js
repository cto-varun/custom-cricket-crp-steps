"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.CheckableTag = void 0;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _antd = require("antd");
var _icons = require("@ant-design/icons");
var _customCricketPopUp = _interopRequireDefault(require("@ivoyant/custom-cricket-pop-up"));
var _Info = _interopRequireDefault(require("../../Icons/Info"));
var _Tooltip = _interopRequireDefault(require("../Tooltip"));
var _InfoTooltip = _interopRequireDefault(require("../Tooltip/InfoTooltip"));
var _checkTabletPlans = _interopRequireDefault(require("./utils/checkTabletPlans"));
require("./styles.css");
var _tabletInformation = _interopRequireDefault(require("../utils/tabletInformation"));
var _configProvider = require("antd/lib/config-provider");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const {
  CheckableTag: AntCheckableTag
} = _antd.Tag;
const CheckableTag = _ref => {
  let {
    option,
    isChecked = null,
    onChangeHandler,
    displayInfoTooltip = true,
    displayPrice = true,
    tagClassName = '',
    setState,
    tabType,
    addOnsToReview,
    compatibilityInfo = [],
    selectedTableRows = [],
    selectedTableRowsData = [],
    ebbQualifiedPlans = [],
    userMessages = [],
    profiles = [],
    isEbbActive,
    datasources,
    technicalSocUpdate,
    allowEditTechnicalSocs,
    setResetTableOnClickPlanTag,
    maxAddTableCount,
    setMaxAddTableCount,
    state,
    rowToDeselect,
    setRowToDeselect,
    setResetTableRowByTablet
  } = _ref;
  const {
    value,
    disabled: disabledOption,
    meta,
    label,
    isCurrent
  } = option;
  const {
    price
  } = meta;
  const [reviewChecked, setReviewChecked] = (0, _react.useState)(false);
  const [showCheckbox, setShowCheckbox] = (0, _react.useState)(false);
  const [showSlowDataMessage, setShowSlowDataMessage] = (0, _react.useState)(false);
  const [showIncompatibleMessage, setShowIncompatibleMessage] = (0, _react.useState)(false);
  const [ebbReviewChecked, setEbbReviewChecked] = (0, _react.useState)(false);
  const [showEbbRemoveMessage, setShowEbbRemoveMessage] = (0, _react.useState)(false);
  const [incompatibleChecked, setIncompatibleChecked] = (0, _react.useState)(false);
  const [slowDataConfirmation, setSlowDataConfirmation] = (0, _react.useState)(false);
  const [contentConfirmationModal, setContentConfirmationModal] = (0, _react.useState)({
    title: '',
    content: '',
    clickFrom: ''
  });
  const plansToReview = userMessages.find(row => row.name == 'changeRatePlanUnlimited')?.plans || [];
  const reviewPlan = plansToReview?.includes(value);
  const reviewAddOn = addOnsToReview?.includes(value);
  const isAddLineFlow = selectedTableRowsData.every(row => row?.activityType == 'ACTIVATION' || row?.activityType == 'ADDLINE');
  const [confirmationTablePopUp, setConfirmationTablePopUp] = (0, _react.useState)(false);
  const addLine = tabletPrice => {
    setContentConfirmationModal({
      title: 'You do not have a qualifying UNL line',
      content: `The $${tabletPrice} tablet rate plan is not available for accounts that do not have a qualifying UNL rate plan`,
      clickFrom: 'maxPlanTablet',
      okText: '',
      cancelText: ''
    });
    setConfirmationTablePopUp(true);
  };
  const isPromoRestricted = selectedTableRowsData.find(row => row?.telephoneData?.promoRestriction == true);
  const overridePromo = profiles.find(a => a.name === window[window.sessionStorage?.tabId].COM_IVOYANT_VARS.profile)?.categories?.find(a => a.name === 'changePlan')?.overridePromoRestriction || false;
  const [overridePromoReviewed, setOverridePromoReviewed] = (0, _react.useState)(false);
  const [showOverridePromo, setShowOverridePromo] = (0, _react.useState)(false);
  const isEbbPlan = val => {
    return ebbQualifiedPlans?.length > 0 && ebbQualifiedPlans?.some(item => item.name === val);
  };
  const selectedRowsHasEbbPlan = (selectedTableRows, selectedTableRowsData) => {
    const selectedRowsEbbArray = selectedTableRows.map((row, index) => {
      const rowPlanData = selectedTableRowsData?.[index]?.plan?.currentPlan?.pricePlanSocCode;
      return isEbbPlan(rowPlanData);
    });
    return selectedRowsEbbArray.some(item => item === true);
  };
  const onChange = function (tabType, isEbbActive, selectedMeta, reviewed) {
    let incompatibleReviewed = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
    let incompatibleChecked = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;
    let ebbReviewChecked = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : false;
    let overridePromoReviewed = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : false;
    let selectedRows = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : [];
    let selectedRowsData = arguments.length > 9 && arguments[9] !== undefined ? arguments[9] : [];
    let maxTableCount;
    const timeForTimeOutFn = 0;
    if (tabType === 'plans') {
      setResetTableOnClickPlanTag(true);
    }
    if (selectedMeta?.socCode === _tabletInformation.default?.tabletPlanTag?.name) {
      const maxAddTableCount = state?.getplansandaddonsResponse?.compatibility?.maxAddTabletCount;
      const tableCount = maxAddTableCount === undefined || maxAddTableCount === null ? 0 : maxAddTableCount;
      maxTableCount = tableCount > maxTableCount || maxTableCount === undefined || maxAddTabletCount === null ? tableCount : maxTableCount;
      maxTableCount = maxTableCount < 1 ? (0, _checkTabletPlans.default)(state) : maxTableCount;
      if (maxTableCount < 1) {
        addLine(price);
        return;
      }
    }
    setTimeout(() => {
      setTimeout(() => {
        if (maxTableCount < selectedRows.length && selectedMeta?.socCode === _tabletInformation.default?.tabletPlanTag?.name) {
          const rowsData = [];
          //const rowsSelectedData = []
          for (let i = 0; i < maxTableCount; i++) {
            rowsData.push(selectedRows[i]);
            //rowsSelectedData.push(selectedRowsData[i])
          }

          const rowsForDeselect = [];
          selectedRows.forEach(index => {
            if (!rowsData.includes(selectedRows[index])) {
              rowsForDeselect.push(selectedRows[index]);
            }
          });
          setRowToDeselect(rowsForDeselect);
          selectedRows = rowsData;
          //selectedRowsData=rowsSelectedData;
          setState(stateData => ({
            ...stateData,
            uiData: {
              ...stateData.uiData,
              selected: {
                ...stateData.uiData.selected,
                tableRows: rowsData
              }
            }
          }));
          setResetTableRowByTablet(true);
        }
      }, 0);
      const selectedRowsCompatibility = selectedRows.map(row => compatibilityInfo[row]?.plans?.[selectedMeta.socCode]);
      const currentPlansHaveEbb = selectedRowsHasEbbPlan(selectedRows, selectedRowsData);
      if (tabType === 'technicalSocs') {
        if (selectedRows.length > 1 || !allowEditTechnicalSocs) {
          // do nothing if more than 1 row is selected
        } else {
          const technicalSocCode = selectedMeta?.socCode;
          const technicalSocCtn = selectedRowsData?.[0]?.telephoneData?.telephoneNumber;
          setState(v => ({
            ...v,
            uiData: {
              ...v.uiData,
              selected: {
                ...v.uiData?.selected,
                technicalSocCode,
                technicalSocCtn
              }
            },
            stepControllerFeedback: {
              ...v.stepControllerFeedback,
              modal: {
                display: true,
                closable: false,
                maskClosable: false,
                centered: true,
                lazyLoad: 'TechnicalSocModal',
                lazyProps: {
                  technicalSocCode,
                  technicalSocCtn,
                  tableRowIndex: selectedRows?.[0],
                  addOrRemove: 'add',
                  technicalSocUpdate,
                  datasources,
                  socMetadata: selectedMeta
                }
              }
            }
          }));
        }
      } else if (!isAddLineFlow && isPromoRestricted && overridePromo && !overridePromoReviewed && tabType === 'plans') {
        setShowOverridePromo(true);
      } else if (reviewAddOn && !reviewChecked && !reviewed) {
        setShowCheckbox(true);
      } else if (reviewPlan && !showSlowDataMessage && !reviewed) {
        setShowSlowDataMessage(true);
      } else if (selectedRowsCompatibility.find(row => row !== undefined) && selectedRowsCompatibility.find(row => row !== undefined)?.removeAddOns?.length > 0 && !incompatibleChecked && !incompatibleReviewed) {
        setShowIncompatibleMessage(true);
      } else if (isEbbActive && currentPlansHaveEbb && tabType === 'plans' && !isEbbPlan(selectedMeta.socCode) && !ebbReviewChecked) {
        // disable ebb message. uncomment below line to enable
        // setShowEbbRemoveMessage(true);
      } else {
        setIncompatibleChecked(false);
        setShowIncompatibleMessage(false);
        console.log(state?.tableData);
        setState(v => ({
          ...v,
          uiData: {
            ...v.uiData,
            lastAction: 'checkableTagsChanged',
            selected: {
              ...v.uiData.selected,
              [tabType]: [{
                selectedMeta
              }]
            }
          },
          tableData: {
            ...v.tableData,
            shouldUpdate: tabType
          }
        }));
      }
    }, timeForTimeOutFn);
  };
  const reviewPlanModalCheckboxClick = e => {
    e.target.checked ? setSlowDataConfirmation(true) : setSlowDataConfirmation(false);
  };
  const reviewOverridePromoCheckboxClick = e => {
    e.target.checked ? setOverridePromoReviewed(true) : setOverridePromoReviewed(false);
  };
  const reviewPlanModalButtonClick = () => {
    setReviewChecked(true);
    setShowSlowDataMessage(false);
    onChange(tabType, isEbbActive, meta, true, false, false, false, overridePromoReviewed, selectedTableRows, selectedTableRowsData);
  };
  const reviewOverrideModalButtonClick = () => {
    setOverridePromoReviewed(true);
    setShowOverridePromo(false);
    onChange(tabType, isEbbActive, meta, reviewChecked, false, incompatibleChecked, ebbReviewChecked, true, selectedTableRows, selectedTableRowsData);
  };
  const reviewIncompatibleModalButtonClick = () => {
    setIncompatibleChecked(true);
    setShowIncompatibleMessage(false);
    onChange(tabType, isEbbActive, meta, true, true, false, false, overridePromoReviewed, selectedTableRows, selectedTableRowsData);
  };
  const reviewEbbModalButtonClick = () => {
    setEbbReviewChecked(true);
    setShowEbbRemoveMessage(false);
    onChange(tabType, isEbbActive, meta, true, true, false, true, false, selectedTableRows, selectedTableRowsData);
  };
  const handleReviewPlanModalCancel = () => {
    setShowSlowDataMessage(false);
  };
  const handleOverridePromoCancel = () => {
    setShowOverridePromo(false);
  };
  const handleIncompatibleModalCancel = () => {
    setShowIncompatibleMessage(false);
  };
  const handleEbbModalCancel = () => {
    setShowEbbRemoveMessage(false);
    window[sessionStorage?.tabId].navigateRoute('/dashboards/manage-account#devicesummary');
  };
  const handleCheckChanged = e => {
    if (e.target.checked) {
      setReviewChecked(true);
      setShowCheckbox(false);
      onChange(tabType, isEbbActive, meta, true, false, false, false, false, selectedTableRows, selectedTableRowsData);
    }
  };
  // const checked = isChecked ? { checked: isChecked(value) } : {};
  const priceDisplay = price && displayPrice ? /*#__PURE__*/_react.default.createElement("span", {
    className: "checkable-tag__label-price"
  }, `$${price}`) : null;
  const disabled = !isCurrent || disabledOption;
  const tooltip = displayInfoTooltip ? /*#__PURE__*/_react.default.createElement(_Tooltip.default, {
    title: /*#__PURE__*/_react.default.createElement(_InfoTooltip.default, {
      meta: meta,
      value: value
    }),
    overlayClassName: "checkable-tag__tooltip",
    destroyTooltipOnHide: {
      keepParent: false
    }
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: "checkable-tag__label-section--icon"
  }, /*#__PURE__*/_react.default.createElement(_Info.default, null))) : null;
  const spacer = displayInfoTooltip ? /*#__PURE__*/_react.default.createElement("span", {
    className: "checkable-tag__label-section--spacer"
  }) : null;
  const checkableClassName = `checkable-tag__wrapper${tagClassName ? ` ${tagClassName}` : ' checkable-tag__wrapper--default'} ${showCheckbox && 'checkable-tag-review'} ${(!allowEditTechnicalSocs || selectedTableRows.length > 1) && tabType === 'technicalSocs' ? 'checkable-tag__wrapper--gray' : ''}`;
  const handleClose = e => {
    e.preventDefault();
    e.stopPropagation();
    setShowCheckbox(false);
    setShowSlowDataMessage(false);
  };
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_customCricketPopUp.default, {
    confirmationESimPopUp: confirmationTablePopUp,
    setConfirmationESimPopUp: setConfirmationTablePopUp,
    contentConfirmationModal: contentConfirmationModal
  }), /*#__PURE__*/_react.default.createElement(AntCheckableTag
  // {...checked}
  , {
    key: value,
    className: checkableClassName,
    onChange: () => onChange(tabType, isEbbActive, meta, false, false, false, false, overridePromoReviewed, selectedTableRows, selectedTableRowsData),
    disabled: disabled
  }, isEbbPlan(value) && /*#__PURE__*/_react.default.createElement("span", {
    key: value,
    className: "checkable-tag__ebb"
  }, "EBB Eligible"), /*#__PURE__*/_react.default.createElement("span", {
    className: `checkable-tag__label-wrapper ${showCheckbox && 'tag-review'}`
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: !showCheckbox && 'checkable-tag__label-section'
  }, spacer, /*#__PURE__*/_react.default.createElement("span", {
    className: "checkable-tag__label-section--label"
  }, label), tooltip, priceDisplay), showCheckbox && /*#__PURE__*/_react.default.createElement(_icons.CloseOutlined, {
    title: "close",
    onClick: handleClose
  })), showCheckbox && /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_InfoTooltip.default, {
    meta: meta,
    value: value,
    className: "review-terms"
  }), /*#__PURE__*/_react.default.createElement("div", {
    className: "checkable-tag__check-box"
  }, /*#__PURE__*/_react.default.createElement(_antd.Checkbox, {
    onChange: handleCheckChanged
  }), /*#__PURE__*/_react.default.createElement("span", null, ' ', "Reviewed the ", '', /*#__PURE__*/_react.default.createElement("a", {
    className: "checkable-tag__link",
    href: "https://www.cricketwireless.com/insight/plans-and-features/cricket-protect/protect-byod.html",
    target: "_blank"
  }, "Cricket Insight"), ' ', "checklist")))), showSlowDataMessage && /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_antd.Modal, {
    open: showSlowDataMessage,
    footer: null,
    onCancel: handleReviewPlanModalCancel
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "checkable-tag__check-box"
  }, userMessages.find(row => row.name == 'changeRatePlanUnlimited')?.message || 'For unlimited rate plan activations and changes only, I acknowledge that I have read the appropriate disclaimer to the customer: <br />* <b>$55 Unlimited Core</b> : Data speed limited to max of 8 Mbps. Cricket may temporarily slow data speeds if the network is busy.'), /*#__PURE__*/_react.default.createElement(_antd.Checkbox, {
    onChange: reviewPlanModalCheckboxClick
  }), "\xA0", /*#__PURE__*/_react.default.createElement(_antd.Button, {
    onClick: reviewPlanModalButtonClick,
    disabled: !slowDataConfirmation
  }, "Ok"))), showOverridePromo && /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_antd.Modal, {
    open: showOverridePromo,
    footer: null,
    onCancel: handleOverridePromoCancel
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "checkable-tag__check-box"
  }, userMessages.find(row => row.name == 'changeRatePlanPromoRestrictionOverride')?.message || 'You are changing a rate plan that could be restricted, do you wish to override if necessary?'), /*#__PURE__*/_react.default.createElement(_antd.Checkbox, {
    onChange: reviewOverridePromoCheckboxClick
  }), "\xA0", /*#__PURE__*/_react.default.createElement(_antd.Button, {
    onClick: reviewOverrideModalButtonClick,
    disabled: !overridePromoReviewed
  }, "OVERRIDE"))), showIncompatibleMessage && /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_antd.Modal, {
    open: showIncompatibleMessage,
    footer: null,
    onCancel: handleIncompatibleModalCancel
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "checkable-tag__check-box",
    style: {
      padding: '10px'
    }
  }, userMessages.find(row => row.name == 'changeRatePlanIncompatibleAddons')?.message || 'Note: If you proceed, incompatible services will be auto dropped for changed lines. Please confirm if you wish to proceed.'), /*#__PURE__*/_react.default.createElement(_antd.Button, {
    onClick: reviewIncompatibleModalButtonClick
  }, "Ok"))), showEbbRemoveMessage && /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_antd.Modal, {
    open: showEbbRemoveMessage,
    footer: null,
    onCancel: handleEbbModalCancel
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "checkable-tag__check-box",
    style: {
      padding: '10px'
    }
  }, userMessages.find(row => row.name == 'ebbIneligible')?.message || 'ALERT! Customer is currently enrolled in an EBB rate plan. You are attempting to change to a rate plan that is NOT eligible for the discounts under this benefit program. Before proceeding, confirm this is what the customer wants to do, and they understand they will lose their benefit.'), /*#__PURE__*/_react.default.createElement(_antd.Button, {
    style: {
      marginRight: '8px'
    },
    onClick: reviewEbbModalButtonClick
  }, "Yes"), /*#__PURE__*/_react.default.createElement(_antd.Button, {
    onClick: handleEbbModalCancel
  }, "Cancel"))));
};
exports.CheckableTag = CheckableTag;
const CheckableTags = _ref2 => {
  let {
    isChecked,
    onChangeHandler,
    options = [],
    wrapperClassName = 'checkable-tag__parent-wrapper',
    tagClassName = '',
    setState,
    tabType,
    addOnsToReview,
    compatibilityInfo = [],
    selectedTableRows = [],
    selectedTableRowsData = [],
    ebbQualifiedPlans = [],
    userMessages = [],
    profiles = [],
    isEbbActive,
    datasources,
    technicalSocUpdate,
    allowEditTechnicalSocs,
    changePlanHeaderMessage,
    acpCohorts,
    technicalSocsMetadata,
    setResetTableOnClickPlanTag,
    maxAddTableCount,
    state,
    setMaxAddTableCount,
    rowToDeselect,
    setRowToDeselect,
    setResetTableRowByTablet
  } = _ref2;
  const tags = options.map(option => {
    let allowEdit = allowEditTechnicalSocs;
    const technicalSocMetadata = technicalSocsMetadata.find(soc => soc?.name === option?.meta?.socCode);
    if (technicalSocMetadata !== undefined) {
      if (technicalSocMetadata?.view === 'false' || technicalSocMetadata?.view === false) {
        return null;
      }
      if (technicalSocMetadata?.edit === 'false' || technicalSocMetadata?.edit === false) {
        allowEdit = false;
      }
    }
    return /*#__PURE__*/_react.default.createElement(CheckableTag, {
      tagClassName: tagClassName,
      key: option.label,
      isChecked: isChecked,
      onChangeHandler: onChangeHandler,
      option: option,
      setState: setState,
      tabType: tabType,
      addOnsToReview: addOnsToReview,
      compatibilityInfo: compatibilityInfo,
      selectedTableRows: selectedTableRows,
      selectedTableRowsData: selectedTableRowsData,
      ebbQualifiedPlans: ebbQualifiedPlans,
      userMessages: userMessages,
      profiles: profiles,
      isEbbActive: isEbbActive,
      datasources: datasources,
      technicalSocUpdate: technicalSocUpdate,
      allowEditTechnicalSocs: allowEdit,
      technicalSocsMetadata: technicalSocsMetadata,
      setResetTableOnClickPlanTag: setResetTableOnClickPlanTag,
      maxAddTableCount: maxAddTableCount,
      state: state,
      setMaxAddTableCount: setMaxAddTableCount,
      rowToDeselect: rowToDeselect,
      setRowToDeselect: setRowToDeselect,
      setResetTableRowByTablet: setResetTableRowByTablet
    });
  });
  const plansOrDealsType = tabType == 'plans' || tabType == 'deals';
  const disablePane = plansOrDealsType && selectedTableRowsData.find(a => a?.telephoneData?.promoRestriction == true) && !profiles.find(a => a.name === window[window.sessionStorage?.tabId].COM_IVOYANT_VARS.profile)?.categories?.find(a => a.name === 'changePlan')?.overridePromoRestriction;
  return disablePane ? /*#__PURE__*/_react.default.createElement("div", {
    className: wrapperClassName
  }, "Unable to change ", tabType, ".", /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      color: 'red'
    }
  }, userMessages.find(row => row.name == 'changeRatePlanPromoRestriction')?.message || 'This subscriber is in a restricted promo period.')) : /*#__PURE__*/_react.default.createElement("div", {
    className: wrapperClassName
  }, tags, tabType === 'plans' && changePlanHeaderMessage?.enable === 'true' && !acpCohorts?.cohorts?.includes('ACP') ? /*#__PURE__*/_react.default.createElement("div", {
    className: "change-plan-header-message"
  }, changePlanHeaderMessage?.message) : '');
};
CheckableTags.propTypes = {
  properties: _propTypes.default.shape({
    options: _propTypes.default.arrayOf(_propTypes.default.shape({
      label: _propTypes.default.string,
      value: _propTypes.default.string,
      disabled: _propTypes.default.bool
    })),
    values: _propTypes.default.arrayOf(_propTypes.default.string),
    multiSelect: _propTypes.default.bool,
    wrapperClassName: _propTypes.default.string
  })
};
CheckableTags.defaultProps = {
  properties: {
    options: [],
    values: [],
    multiSelect: true,
    wrapperClassName: ''
  }
};
var _default = CheckableTags;
exports.default = _default;