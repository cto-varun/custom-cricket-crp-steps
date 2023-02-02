"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Accordion;
var _react = _interopRequireWildcard(require("react"));
var _Tab = _interopRequireDefault(require("./Tab"));
var _CheckableTags = _interopRequireDefault(require("../CheckableTags"));
var _CollapsePanels = _interopRequireDefault(require("./CollapsePanels"));
var _onChangeHandler = _interopRequireDefault(require("./onChangeHandler"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const featureTypeMapper = (features, setState) => type => {
  if (features === undefined) {
    features = {
      current: [],
      expired: []
    };
    setState(v => ({
      ...v,
      uiData: {
        ...v.uiData,
        selected: {
          ...v.uiData.selected,
          tableRows: []
        }
      }
    }));
  }
  return features[type] && features[type].map(feature => ({
    ...feature,
    isCurrent: type === 'current'
  })) || [];
};
const currentExpiredVisibility = (features, isCurrent, addOnsToReview, setState) => {
  const featureType = featureTypeMapper(features, setState);
  const currentFeatures = featureType('current');
  return isCurrent ? currentFeatures : [...currentFeatures, ...featureType('expired')];
};
const mapFeatures = _ref => {
  let {
    checkTabSelectionCompatibility,
    dataHook: [state, setState],
    features,
    FeaturesComponent,
    selectedType,
    useTag,
    addOnsToReview,
    ebbQualifiedPlans,
    userMessages,
    profiles,
    ebbBenefit,
    datasources,
    technicalSocUpdate,
    allowEditTechnicalSocs,
    changePlanHeaderMessage,
    acpCohorts,
    technicalSocsMetadata,
    setResetTableOnClickPlanTag,
    maxAddTableCount,
    setMaxAddTableCount,
    rowToDeselect,
    setRowToDeselect,
    setResetTableRowByTablet
  } = _ref;
  return features.map(_ref2 => {
    let {
      id,
      feature,
      multiSelect
    } = _ref2;
    const options = currentExpiredVisibility(feature, selectedType === 'current', addOnsToReview, setState);
    const isChecked = val => state.uiData.selected[id].findIndex(_ref3 => {
      let {
        value
      } = _ref3;
      return value === val;
    }) > -1;
    const onChange = (0, _onChangeHandler.default)({
      id,
      multiSelect,
      checkAccordionSelectionCompatibility: checkTabSelectionCompatibility,
      useTag,
      state,
      setState
    });
    const compatibilityInfo = state.getplansandaddonsResponse?.compatibility?.compatibilityInfo;
    const selectedTableRows = state.uiData?.selected?.tableRows;
    const selectedTableRowsData = selectedTableRows.map(rowIndex => state.tableData?.finalData?.[rowIndex]);
    const ebbStatus = ebbBenefit?.status?.length ? ebbBenefit?.status[0]?.value : '';
    const isEbbActive = ebbStatus === 'Active';
    return /*#__PURE__*/_react.default.createElement(FeaturesComponent, {
      key: id,
      isChecked: isChecked,
      onChangeHandler: onChange,
      options: options,
      setState: setState,
      addOnsToReview: addOnsToReview,
      compatibilityInfo: compatibilityInfo,
      selectedTableRows: selectedTableRows,
      selectedTableRowsData: selectedTableRowsData,
      ebbQualifiedPlans: ebbQualifiedPlans,
      userMessages: userMessages,
      isEbbActive: isEbbActive,
      profiles: profiles,
      datasources: datasources,
      technicalSocUpdate: technicalSocUpdate,
      allowEditTechnicalSocs: allowEditTechnicalSocs,
      technicalSocsMetadata: technicalSocsMetadata,
      changePlanHeaderMessage: changePlanHeaderMessage,
      acpCohorts: acpCohorts,
      setResetTableOnClickPlanTag: setResetTableOnClickPlanTag,
      maxAddTableCount: maxAddTableCount,
      state: state,
      setMaxAddTableCount: setMaxAddTableCount,
      rowToDeselect: rowToDeselect,
      setRowToDeselect: setRowToDeselect,
      setResetTableRowByTablet: setResetTableRowByTablet
    });
  });
};
const handleOnExpireToggle = setSelectedType => checked => {
  setSelectedType(checked ? 'expired' : 'current');
};
const handleOnExpandClick = setExpandView => () => {
  setExpandView(expandView => !expandView);
};
function Accordion(_ref4) {
  let {
    tabs,
    dataHook,
    checkTabSelectionCompatibility,
    defaultActiveKey = 'plans',
    className,
    properties,
    ebbQualifiedPlans,
    userMessages,
    profiles,
    ebbBenefit,
    datasources,
    allowEditTechnicalSocs,
    changePlanHeaderMessage,
    acpCohorts,
    technicalSocsMetadata,
    setResetTableOnClickPlanTag,
    rowToDeselect,
    setRowToDeselect,
    setResetTableRowByTablet
  } = _ref4;
  if (!tabs) {
    console.log('adding empty tabs');
    tabs = {
      panelTitles: ['Plans', 'Add-Ons', 'Technical Socs', 'Deals'],
      plans: {
        current: [],
        expired: []
      },
      addOns: {
        current: [],
        expired: []
      },
      technicalSocs: {
        current: [],
        expired: []
      },
      deals: {
        current: [],
        expired: []
      }
    };
  }
  const {
    panelTitles,
    plans,
    addOns,
    deals,
    technicalSocs
  } = tabs;
  const [selectedType, setSelectedType] = (0, _react.useState)('current');
  const [expandView, setExpandView] = (0, _react.useState)(false);
  const useTag = (0, _react.useState)({
    selectedValues: [],
    selectedValuesMeta: []
  });
  const {
    technicalSocUpdate
  } = properties?.workflows;
  const features = [{
    id: 'plans',
    feature: plans,
    multiSelect: false
  }, {
    id: 'addOns',
    feature: addOns,
    multiSelect: true
  }, {
    id: 'technicalSocs',
    feature: technicalSocs,
    multiSelect: false
  }, {
    id: 'deals',
    feature: deals,
    multiSelect: false
  }];
  const tabProperties = {
    keys: features.map(_ref5 => {
      let {
        id
      } = _ref5;
      return id;
    }),
    defaultActiveKey,
    expandView,
    panelTitles,
    onExpandClick: handleOnExpandClick(setExpandView),
    onExpireToggle: handleOnExpireToggle(setSelectedType)
  };
  const FeaturesComponent = expandView ? _CollapsePanels.default : _CheckableTags.default;
  const childComponents = mapFeatures({
    checkTabSelectionCompatibility,
    dataHook,
    features,
    FeaturesComponent,
    selectedType,
    useTag,
    addOnsToReview: properties?.addOnsToReview,
    ebbQualifiedPlans,
    userMessages,
    profiles,
    ebbBenefit,
    datasources,
    technicalSocUpdate,
    allowEditTechnicalSocs,
    changePlanHeaderMessage,
    acpCohorts,
    technicalSocsMetadata,
    setResetTableOnClickPlanTag,
    rowToDeselect,
    setRowToDeselect,
    setResetTableRowByTablet
  });
  const tabClassName = className ? `plan-selection-wrapper ${className}` : 'plan-selection-wrapper';
  return /*#__PURE__*/_react.default.createElement(_Tab.default, {
    className: tabClassName,
    properties: tabProperties
  }, childComponents);
}
module.exports = exports.default;