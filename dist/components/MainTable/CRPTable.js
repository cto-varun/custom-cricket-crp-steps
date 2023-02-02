"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _lodash = _interopRequireDefault(require("lodash.clonedeep"));
var _tabletInformation = _interopRequireDefault(require("../utils/tabletInformation"));
var _antd = require("antd");
var _icons = require("@ant-design/icons");
var _helpers = require("../../helpers/helpers");
var _componentCache = require("@ivoyant/component-cache");
var _CheckableTagsSpecial = _interopRequireDefault(require("../CheckableTags/CheckableTagsSpecial"));
var _componentMessageBus = require("@ivoyant/component-message-bus");
var _AddALineForm = _interopRequireDefault(require("./components/AddALineForm"));
var _ExpandedRow = _interopRequireDefault(require("./components/ExpandedRow"));
require("antd/dist/reset.css");
require("./styles.css");
var _checkAddonQty = _interopRequireDefault(require("../utils/checkAddonQty"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
let addOnsQty;
const adjustAddOnQuantity = (addOn, desiredQuantity) => {
  if (!addOnsQty[addOn] || desiredQuantity < 0) return;
  const currentQuantity = addOnsQty[addOn].getQty();
  const difference = desiredQuantity - currentQuantity;
  if (difference === 0) return;
  difference > 0 ? addOnsQty[addOn].incrementQty() : addOnsQty[addOn].decrementQty();
};
const concatenateWords = (wordOne, wordTwo) => {
  return `${wordOne}-0${wordTwo}`;
};
const addingNewAddOn = (addOnName, initialQty) => {
  if (!addOnsQty) addOnsQty = {};
  addOnsQty[addOnName] = addOnsQty[addOnName] || new _checkAddonQty.default(initialQty);
};
const formatTelephone = digits => {
  const output = digits === undefined ? undefined : `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  return output;
};
const displayErrors = err => {
  if (err.length > 0) {
    if (err.length === 1) {
      return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("span", null, "There was an error with your submission:"), /*#__PURE__*/_react.default.createElement("div", null, err[0]));
    }
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("span", null, "There were errors with your submission:"), err.map((e, i) => /*#__PURE__*/_react.default.createElement("div", {
      key: i
    }, e)));
  }
  return /*#__PURE__*/_react.default.createElement("span", null, "Something went wrong. Please ensure form details are correct.");
};
const displayFeatures = features => {
  if (features?.length > 0) {
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("div", {
      className: "features-heading"
    }, "Features"), /*#__PURE__*/_react.default.createElement("div", {
      className: "features-main-container"
    }, /*#__PURE__*/_react.default.createElement("ul", null, features.map((f, i) => {
      return /*#__PURE__*/_react.default.createElement("li", {
        key: i
      }, f?.description);
    }))));
  }
  return /*#__PURE__*/_react.default.createElement("span", null, "Something went wrong. Please ensure form details are correct.");
};
const columns = (finalData, dataHook, resetEntireTable, resetEntireRow, deleteNewLine, addNewLine, editLine, removeNewPlan, changeAddOnQuantity, resetNewAddOn, resetAddOnQuantity, resetRemovedAddOn, handleToggle, addLineFormVisible, editRowKey, filterText, setFilterText, properties, datasources, allowAddLine, ebbQualifiedPlans, MRCsocs, allowEditTechnicalSocs, removeTechnicalSoc, technicalSocsMetadata, customerInfo, setState, state) => [{
  className: 'crp-table__column--telephone-data',
  title: /*#__PURE__*/_react.default.createElement("div", {
    style: {
      display: 'flex',
      paddingLeft: 16,
      paddingRight: 16
    }
  }, /*#__PURE__*/_react.default.createElement(_antd.Input, {
    placeholder: "Find by phone number",
    value: filterText,
    onChange: e => setFilterText(e.target.value),
    suffix: /*#__PURE__*/_react.default.createElement(_icons.SearchOutlined, {
      style: {
        color: '#d5dce5'
      }
    })
  })),
  dataIndex: 'telephoneData',
  render: (data, row, index) => {
    if (index === 0 && addLineFormVisible) {
      const lineData = finalData.find(line => line.activityType === 'ADDLINE' && line.key === editRowKey);
      return {
        children: /*#__PURE__*/_react.default.createElement(_AddALineForm.default, {
          dataHook: dataHook,
          addNewLine: addNewLine,
          lineData: lineData,
          customerInfo: customerInfo,
          editKey: editRowKey,
          handleToggle: handleToggle,
          properties: properties,
          datasources: datasources
        }),
        props: {
          colSpan: 9
        }
      };
    }
    return {
      children: /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("div", {
        style: {
          display: 'grid',
          gridTemplateColumns: '60px auto'
        }
      }, /*#__PURE__*/_react.default.createElement("div", {
        style: {
          textAlign: 'right',
          padding: 0,
          paddingRight: 10,
          color: '#60a630'
        }
      }, /*#__PURE__*/_react.default.createElement(_icons.MobileOutlined, {
        style: {
          fontSize: '24px'
        }
      })), /*#__PURE__*/_react.default.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'center'
        }
      }, /*#__PURE__*/_react.default.createElement("span", {
        style: {
          fontWeight: 600
        }
      }, formatTelephone(data.telephoneNumber))), /*#__PURE__*/_react.default.createElement("div", {
        style: {
          textAlign: 'right',
          color: '#d5dce5',
          padding: 0,
          paddingRight: 10
        }
      }, "Model"), /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("span", {
        style: {
          fontWeight: 600
        }
      }, data.phoneModel)), /*#__PURE__*/_react.default.createElement("div", {
        style: {
          textAlign: 'right',
          color: '#d5dce5',
          padding: 0,
          paddingRight: 10
        }
      }, "IMEI"), /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("span", {
        style: {
          fontSize: '12px'
        }
      }, data.imei)), /*#__PURE__*/_react.default.createElement("div", {
        style: {
          textAlign: 'right',
          color: '#d5dce5',
          padding: 0,
          paddingRight: 10
        }
      }, "SIM"), /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("span", {
        style: {
          fontSize: '12px'
        }
      }, data.sim))), row?.telephoneData?.ptnStatus !== 'C' && data?.features && /*#__PURE__*/_react.default.createElement("div", {
        className: "rate-plan-details-container",
        onClick: () => setState({
          ...state,
          stepControllerFeedback: {
            ...state.stepControllerFeedback,
            modal: {
              ...state.stepControllerFeedback.modal,
              display: true,
              message: displayFeatures(data?.features),
              title: /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("div", {
                className: "rate-plan-header"
              }, /*#__PURE__*/_react.default.createElement("div", null, "Rate Plan Details"), data?.telephoneNumber && /*#__PURE__*/_react.default.createElement("div", null, "CTN", ' ' + formatTelephone(data.telephoneNumber)))),
              overrideProps: {
                width: 1000
              }
            }
          }
        })
      }, /*#__PURE__*/_react.default.createElement("div", {
        className: "view-rate-plan-text"
      }, "View Rate Plan Details"), /*#__PURE__*/_react.default.createElement(_icons.ArrowRightOutlined, {
        size: 10,
        style: {
          marginLeft: '5px'
        }
      })))
    };
  }
}, {
  className: 'crp-table__column--plan-data',
  title: 'Plan',
  dataIndex: 'plan',
  render: (data, row, index) => {
    const obj = {
      children: null,
      props: {}
    };
    if (row?.telephoneData?.ptnStatus === 'C') {
      return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null);
    }
    if (index === 0 && addLineFormVisible) {
      obj.props.colSpan = 0;
    } else {
      const {
        currentPlan = {},
        newPlan = {}
      } = data;
      const isNullPlan = plan => Object.keys(plan).length === 0;
      const isNullCurrentPlan = isNullPlan(currentPlan);
      const isNullNewPlan = isNullPlan(newPlan);
      const mapOption = function () {
        let planType = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        return {
          value: planType.pricePlanSocCode,
          label: planType.pricePlanSocCode,
          meta: {
            quantity: 1,
            price: planType.price,
            longDescription: planType.longDescription,
            shortDescription: planType.shortDescription
          }
        };
      };
      const isEbbPlan = planType => {
        return ebbQualifiedPlans?.length > 0 && ebbQualifiedPlans?.find(item => item.name === planType.pricePlanSocCode);
      };
      const getDisplayElements = plan => {
        const displayElements = ['text', 'info-icon'];
        if (isEbbPlan(plan)) {
          displayElements.unshift('ebb');
        }
        return displayElements;
      };
      const currentPlanTag = !isNullCurrentPlan ? /*#__PURE__*/_react.default.createElement(_CheckableTagsSpecial.default, {
        displayElements: getDisplayElements(currentPlan),
        option: mapOption(currentPlan),
        tagClassName: "crp-table-tag",
        gray: isNullNewPlan,
        red: !isNullNewPlan
      }) : /*#__PURE__*/_react.default.createElement("div", null, " no current plan");
      const newPlanTag = !isNullNewPlan ? /*#__PURE__*/_react.default.createElement(_CheckableTagsSpecial.default, {
        allowQuantityEdit: true,
        displayElements: getDisplayElements(newPlan),
        otcProps: {
          hidePlus: true,
          removeFunction: removeNewPlan,
          rowIndex: index,
          quantity: 1,
          price: newPlan.price
        },
        option: mapOption(newPlan),
        tagClassName: "crp-table-tag",
        green: true
      }) : null;
      obj.children = /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, currentPlanTag, newPlanTag);
      return obj;
    }
  }
}, {
  className: 'crp-table__column--addons-data',
  title: 'Add-Ons',
  dataIndex: 'addOns',
  render: (data, row, index) => {
    const obj = {
      props: {}
    };
    if (row?.telephoneData?.ptnStatus === 'C') {
      return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null);
    }
    if (index === 0 && addLineFormVisible) {
      obj.props.colSpan = 0;
      obj.children = null;
    } else {
      const mapAddOn = addOn => ({
        value: addOn?.socCode,
        label: addOn?.socCode,
        meta: {
          price: addOn?.price,
          longDescription: addOn?.longDescription,
          shortDescription: addOn?.shortDescription
        }
      });
      const tdWidth = '275px';
      obj.children = /*#__PURE__*/_react.default.createElement("div", {
        style: {
          maxWidth: tdWidth,
          minWidth: tdWidth
        }
      }, data && data.filter(a => !a?.changes?.removedAddOn).filter(b => b !== undefined).map(item => {
        const isChanged = Object.keys(item?.changes || {}).length > 0;
        const addOnQty = isChanged && item?.changes?.quantity || item?.quantity;
        const mappedTag = mapAddOn(item);
        const tag = {
          ...mappedTag,
          meta: {
            ...mappedTag.meta,
            quantity: addOnQty
          }
        };
        return /*#__PURE__*/_react.default.createElement(_CheckableTagsSpecial.default, {
          allowQuantityEdit: !item?.socCode.startsWith('CRK') && item?.socCode !== 'INHOTSPOT' && item?.socCode !== 'IZHOTSPOT',
          displayElements: ['text', 'quantity', 'info-icon'],
          otcProps: {
            id: item?.socCode,
            removeFunction: changeAddOnQuantity,
            updateFunction: changeAddOnQuantity,
            rowIndex: index,
            quantity: addOnQty,
            price: item?.price,
            hidePlus: item?.addOnType === 'REGULAR' || (0, _helpers.isMRC)(item?.socCode, MRCsocs) && addOnQty === 1,
            hideMinus: item?.addOnType === 'ONETIME' && !isChanged || item?.mandatory === true || item?.inclusion === true
          },
          option: tag,
          tagClassName: "crp-table-tag",
          gray: !isChanged,
          green: isChanged
        });
      }));
    }
    return obj;
  }
}, {
  className: 'crp-table__column--technical-socs-data',
  title: 'Technical Socs',
  dataIndex: 'technicalSocs',
  render: (data, row, index) => {
    const obj = {
      props: {}
    };
    if (row?.telephoneData?.ptnStatus === 'C') {
      return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null);
    }
    if (index === 0 && addLineFormVisible) {
      obj.props.colSpan = 0;
      obj.children = null;
    } else {
      const mapAddOn = addOn => ({
        value: addOn?.socCode,
        label: addOn?.socCode,
        meta: {
          price: addOn?.price,
          longDescription: addOn?.longDescription,
          shortDescription: addOn?.shortDescription
        }
      });
      const tdWidth = '275px';
      obj.children = /*#__PURE__*/_react.default.createElement("div", {
        style: {
          maxWidth: tdWidth,
          minWidth: tdWidth
        }
      }, data && data.filter(a => !a?.changes?.removedAddOn).filter(b => b !== undefined).map(item => {
        const mappedTag = mapAddOn(item);
        const qty = item?.quantity;
        const tag = {
          ...mappedTag,
          meta: {
            ...mappedTag.meta,
            quantity: qty
          }
        };
        const technicalSocMetadata = technicalSocsMetadata.find(soc => soc?.name === item?.socCode);
        let allowEdit = allowEditTechnicalSocs;
        if (technicalSocMetadata?.edit === 'false' || technicalSocMetadata?.edit === false) {
          allowEdit = false;
        }
        if (technicalSocMetadata?.view === 'false' || technicalSocMetadata?.view === false) {
          return null;
        }
        return /*#__PURE__*/_react.default.createElement(_CheckableTagsSpecial.default, {
          allowQuantityEdit: allowEdit
          // allow only for specific profiles from metadata flag
          ,

          displayElements: ['text', 'quantity', 'info-icon'],
          otcProps: {
            id: item?.socCode,
            removeFunction: removeTechnicalSoc,
            updateFunction: removeTechnicalSoc,
            rowIndex: index,
            technicalSoc: true,
            price: item?.price,
            hidePlus: true,
            hideMinus: !allowEdit,
            quantity: qty
          },
          option: tag,
          tagClassName: "crp-table-tag",
          gray: !allowEdit,
          green: allowEdit
        });
      }));
    }
    return obj;
  }
}, {
  className: 'crp-table__column--changes-data',
  title: 'Changes',
  dataIndex: 'changes',
  render: function () {
    let data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    let row = arguments.length > 1 ? arguments[1] : undefined;
    let index = arguments.length > 2 ? arguments[2] : undefined;
    const obj = {
      children: null,
      props: {}
    };
    if (row?.telephoneData?.ptnStatus === 'C') {
      return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null);
    }
    if (index === 0 && addLineFormVisible) {
      obj.props.colSpan = 0;
    } else {
      obj.children = data.length ? /*#__PURE__*/_react.default.createElement("div", {
        className: "crp-table__changes-tags"
      }, data.map(function () {
        let item = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        const [socCode = null] = Object.keys(item);
        if (!socCode) {
          return null;
        }
        let tagText = '';
        let removeFunction = () => {};
        const {
          changeType
        } = item[socCode];
        let swatch = '';
        const palette = {
          gray: {
            gray: true
          },
          green: {
            green: true
          },
          red: {
            red: true
          }
        };
        switch (changeType) {
          case 'addOnQuantity':
            {
              tagText = `Set Amount of Add-On ${socCode} to ${item[socCode]?.quantity}`;
              removeFunction = () => resetAddOnQuantity(index, socCode);
              swatch = 'gray';
              break;
            }
          case 'newAddOn':
            {
              tagText = `Added ${item[socCode]?.quantity} of Add-On ${socCode}`;
              removeFunction = () => resetNewAddOn(index, socCode);
              swatch = 'green';
              break;
            }
          case 'removedAddOn':
            {
              tagText = `Removed Add-On ${socCode}`;
              removeFunction = () => resetRemovedAddOn(index, socCode);
              swatch = 'red';
              break;
            }
          default:
            return /*#__PURE__*/_react.default.createElement("div", null, "Invalid change type specified.");
        }
        const displayElements = ['text'];
        if (!(item[socCode].changeType === 'newAddOn' && (item[socCode].mandatory || item[socCode].inclusion) || item[socCode].changeType === 'removedAddOn' && item[socCode].compatible === false)) {
          displayElements.push('undo-icon');
        }
        return /*#__PURE__*/_react.default.createElement(_CheckableTagsSpecial.default, _extends({}, palette[swatch], {
          displayElements: displayElements,
          undoProps: {
            removeFunction
          },
          option: {
            value: socCode
          },
          tagText: tagText,
          tagClassName: "crp-table-tag",
          dataHook: dataHook
        }));
      })) : /*#__PURE__*/_react.default.createElement("div", null, "No changes");
    }
    return obj;
  }
}, {
  className: 'crp-table__column--discount-data',
  title: 'Discount',
  dataIndex: 'discount',
  render: (data, row, index) => {
    const obj = {
      children: null,
      props: {}
    };
    if (row?.telephoneData?.ptnStatus === 'C') {
      return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null);
    }
    if (index === 0 && addLineFormVisible) {
      obj.props.colSpan = 0;
    } else {
      obj.children = /*#__PURE__*/_react.default.createElement("div", null, "$0");
    }
    return obj;
  }
}, {
  className: 'crp-table__column--subtotal-data',
  title: 'Sub-Total',
  dataIndex: 'subTotal',
  render: (data, row, index) => {
    const obj = {
      children: null,
      props: {}
    };
    if (index === 0 && addLineFormVisible) {
      obj.props.colSpan = 0;
    } else {
      obj.children = /*#__PURE__*/_react.default.createElement("span", {
        style: {
          fontSize: '14px',
          color: data ? '#404041' : '#d5dce5'
        }
      }, "$", data);
    }
    return obj;
  }
}, {
  className: 'crp-table__column--icons-data',
  title: /*#__PURE__*/_react.default.createElement("div", {
    style: {
      display: 'flex',
      color: '#60a630'
    }
  }, allowAddLine ? /*#__PURE__*/_react.default.createElement(_icons.PlusCircleOutlined, {
    className: `${addLineFormVisible && 'add-a-line-buttons-disable'}`,
    style: {
      fontSize: '20px'
    },
    onClick: () => {
      if (!addLineFormVisible) {
        handleToggle();
      }
    }
  }) : /*#__PURE__*/_react.default.createElement(_antd.Tooltip, {
    title: 'Add a line is disabled'
  }, /*#__PURE__*/_react.default.createElement(_icons.PlusCircleOutlined, {
    className: `${'add-a-line-buttons-disable'}`,
    style: {
      fontSize: '20px'
    }
  })), /*#__PURE__*/_react.default.createElement(_icons.PoweroffOutlined, {
    className: `${addLineFormVisible && 'add-a-line-buttons-disable'}`,
    style: {
      fontSize: '20px',
      marginLeft: 16
    },
    onClick: () => {
      if (!addLineFormVisible) {
        resetEntireTable();
      }
    }
  })),
  dataIndex: 'operations',
  render: (data, row, index) => {
    const obj = {
      children: null,
      props: {}
    };
    if (index === 0 && addLineFormVisible) {
      obj.props.colSpan = 0;
    } else {
      obj.children = /*#__PURE__*/_react.default.createElement("div", {
        style: {
          display: 'flex',
          color: '#60a630',
          alignItems: 'flex-end'
        }
      }, data.showIcons && data.newLine ? /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_icons.EditOutlined, {
        style: {
          fontSize: '20px'
        },
        onClick: () => editLine(index)
      }), /*#__PURE__*/_react.default.createElement(_icons.DeleteOutlined, {
        style: {
          fontSize: '20px',
          marginLeft: 16
        },
        onClick: () => deleteNewLine(index)
      })) : /*#__PURE__*/_react.default.createElement(_icons.PoweroffOutlined, {
        style: {
          fontSize: '20px',
          marginLeft: 16
        },
        onClick: () => resetEntireRow(index)
      }));
    }
    return obj;
  }
}];
const CRPTable = _ref => {
  let {
    dataHook,
    className,
    compatibilityInfo,
    initialTableData = [],
    properties,
    datasources,
    lineDetailMemos,
    ebbQualifiedPlans,
    MRCsocs,
    customerInfo,
    allowEditTechnicalSocs,
    userMessages,
    technicalSocsMetadata,
    resetTableOnClickPlanTag,
    setResetTableOnClickPlanTag,
    setMaxAddTableCount,
    isTabletPlanFailed,
    setIsTabletPlanFailed,
    checkRadioSelectionEligibility,
    setEnableEffectiveRadio,
    currentAddOnsWithInsurance,
    insuranceAddOnMessage,
    setInsuranceMessage,
    rowToDeselect,
    setRowToDeselect,
    resetTableRowByTablet,
    setResetTableRowByTablet
  } = _ref;
  const [state, setState] = dataHook;
  const {
    technicalSocUpdate
  } = properties?.workflows;
  const {
    getplansandaddonsResponse,
    uiData: {
      lastAction,
      selected: {
        tableRows = []
      }
    },
    tableData: {
      finalData: storedFinalData
    }
  } = state;
  const newAccountInfo = _componentCache.cache.get('newAccountInfo');
  let allowAddLine = false;
  if (getplansandaddonsResponse) {
    allowAddLine = getplansandaddonsResponse?.compatibility?.allowAddLine;
  } else if (newAccountInfo && newAccountInfo.ban === window[window.sessionStorage?.tabId].NEW_BAN) {
    allowAddLine = true;
  }
  const [dataLoaded, setDataLoaded] = (0, _react.useState)(lastAction === 'back/1');
  const [resetTabletAfterRemoveNewPlan, setResetTabletAfterRemoveNewPlan] = (0, _react.useState)(false);
  const [finalData, setFinalTableData] = (0, _react.useState)(lastAction === 'back/1' ? storedFinalData : initialTableData);
  const [filterText, setFilterText] = (0, _react.useState)('');
  const [addLineFormVisible, setAddLineFormVisible] = (0, _react.useState)(false);
  const [editRowKey, setEditRowKey] = (0, _react.useState)(undefined);
  const [selectedRowKeys, setSelectedRowKeys] = (0, _react.useState)(tableRows);
  const [defaultExpandedRowKeys, setDefaultExpandedRowKeys] = (0, _react.useState)([...Array(initialTableData.length).keys()]);
  const expandAllNotes = tableData => {
    setDefaultExpandedRowKeys([...Array(tableData.length).keys()]);
  };
  const [pendingTechnicalSocInclusions, setPendingTechnicalSocInclusions] = (0, _react.useState)([]);
  const [processTechnicalSocInclusions, setProcessTechnicalSocInclusions] = (0, _react.useState)(false);

  // const [newTableData, setNewTableData] = useState([]);

  // get mapped tablet lines response
  const handleGetMappedTabletPlanResponse = (successStates, errorStates) => (subscriptionId, topic, eventData, closure) => {
    const callState = eventData.value;
    const isSuccess = successStates.includes(callState);
    const isFailure = errorStates.includes(callState);
    if (isSuccess || isFailure) {
      if (isSuccess) {
        const getMappedTabletPlanDetails = eventData?.event?.data?.data?.getMappedTabletPlanDetails;
        if (getMappedTabletPlanDetails?.length > 0) {
          let processedResponse = {};
          getMappedTabletPlanDetails.forEach(line => {
            processedResponse[line.ctn] = line;
          });
          setState(prevState => {
            return {
              ...prevState,
              getmappedtabletplanResponse: processedResponse
            };
          });
        }
      }

      // unsubscribe from message bus
      _componentMessageBus.MessageBus.unsubscribe(subscriptionId);
    }
  };

  // get mapped tablet lines API
  const getMappedTabletLines = () => {
    const workflow = 'GETMAPPEDTABLETPLAN';
    const registrationId = workflow;
    const datasource = '360-get-mapped-tablet-plan';
    const successStates = ['success'];
    const errorStates = ['error'];
    const responseMapping = {
      error: {
        messageExpr: "(error.response.data ? error.response.data.causedBy[0].message : error.response.statusText ? ' : ' & error.response.statusText : '')"
      }
    };
    _componentMessageBus.MessageBus.send('WF.'.concat(workflow).concat('.INIT'), {
      header: {
        registrationId: registrationId,
        workflow,
        eventType: 'INIT'
      }
    });

    // subscribe to workflow
    _componentMessageBus.MessageBus.subscribe(registrationId, 'WF.'.concat(workflow).concat('.STATE.CHANGE'), handleGetMappedTabletPlanResponse(successStates, errorStates));

    // replace accountId with BAN in URL config
    const baseUri = datasources[datasource].baseUri.replace('{ban}', state?.accountDetails?.ban.toString());
    const url = datasources[datasource].url.replace('{ban}', state?.accountDetails?.ban.toString());

    // submit call
    _componentMessageBus.MessageBus.send('WF.'.concat(workflow).concat('.SUBMIT'), {
      header: {
        registrationId: registrationId,
        workflow,
        eventType: 'SUBMIT'
      },
      body: {
        datasource: {
          ...datasources[datasource],
          baseUri,
          url
        },
        request: {},
        responseMapping
      }
    });
  };
  (0, _react.useEffect)(() => {
    // can try making API call here to get tablet mapped plans
    if (initialTableData && initialTableData.length > 0 && !dataLoaded) {
      if (!dataLoaded) {
        setFinalTableData((0, _lodash.default)(initialTableData));
        // get mapped tablet lines from API
        getMappedTabletLines();
        setState(v => ({
          ...v,
          tableData: {
            ...v.tableData,
            finalData: initialTableData,
            initialTableData,
            compatibilityInfo
          },
          setFinalTableData
        }));
      }
      setDataLoaded(true);
      addOnsQty = {};
    }
  }, []);
  let filteredData = filterText !== '' ? finalData.filter(_ref2 => {
    let {
      telephoneData
    } = _ref2;
    return telephoneData?.telephoneNumber.includes(filterText);
  }) : finalData;
  const resetEntireTable = function () {
    let initialData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialTableData;
    let lastActionLabel = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'reset/table';
    addOnsQty = {};
    setFinalTableData(initialData);
    setState(v => ({
      ...v,
      uiData: {
        ...v.uiData,
        lastAction: lastActionLabel
      },
      tableData: {
        ...v.tableData,
        finalData: initialData
      }
    }));
    expandAllNotes(initialData);
  };
  const getAddOnMeta = socCode => {
    let addOnMeta = state.getplansandaddonsResponse.addOns.currentAddOns.find(ca => ca.socCode === socCode);
    if (addOnMeta === undefined) {
      addOnMeta = state.getplansandaddonsResponse.addOns.expiredAddOns.find(ca => ca.socCode === socCode);
    }
    return addOnMeta;
  };
  const updateShouldShowIcons = tableRow => {
    const currentRowCTN = (0, _helpers.getCtnFromRow)(tableRow);
    // Get the original version of this row from table data if it exists
    const originalRow = (0, _helpers.getRowByCtn)(initialTableData, currentRowCTN);
    const updatedRow = (0, _lodash.default)(tableRow);

    // If this row was present in original table data, we need to run some checks
    if (typeof originalRow !== 'undefined') {
      let shouldShowIcons = false;
      // If a new plan was updated, update the row.
      if (Object.keys(updatedRow?.plan?.newPlan || {}).length > 0) {
        shouldShowIcons = true;
      }
      if (updatedRow.changes.length > 0) {
        shouldShowIcons = true;
      }
      updatedRow.operations = {
        ...updatedRow.operations,
        showIcons: shouldShowIcons
      };
    }
    return updatedRow;
  };
  const resetEntireRow = function (tableRowIndex) {
    let lastActionLabel = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'reset/row';
    const updatedDataSource = (0, _lodash.default)(finalData);
    updatedDataSource[tableRowIndex]?.addOns?.map(dataSource => {
      delete addOnsQty[concatenateWords(dataSource.socCode, tableRowIndex)];
    });
    const currentRowCTN = (0, _helpers.getCtnFromRow)(finalData[tableRowIndex]);
    const originalRow = (0, _helpers.getRowByCtn)(initialTableData, currentRowCTN);
    updatedDataSource[tableRowIndex] = originalRow;
    updatedDataSource[tableRowIndex] = updateShouldShowIcons(updatedDataSource[tableRowIndex]);
    setFinalTableData(updatedDataSource);
    setState(v => ({
      ...v,
      uiData: {
        ...v.uiData,
        lastAction: lastActionLabel
      },
      tableData: {
        ...v.tableData,
        finalData: updatedDataSource
      }
    }));
    expandAllNotes(updatedDataSource);
  };
  (0, _react.useEffect)(() => {
    const maxAddTabletCount = state?.getplansandaddonsResponse?.compatibility?.maxAddTabletCount;
    const tableCount = maxAddTabletCount === undefined || maxAddTabletCount === null ? 0 : maxAddTabletCount;
    setMaxAddTableCount(tableCount);
    const resetOneRowTagLabel = 'reset/rowOnTagClick';
    const resetMultiRowTagLabel = 'reset/multiRowsOnTagClick';
    const tagActivityLabelAllow = 'CHANGESERVICES';
    const lastActionFromState = state?.uiData?.lastAction;
    const selectedRows = state?.uiData?.selected?.tableRows;
    const labelAction = selectedRows.length === 1 ? resetOneRowTagLabel : resetMultiRowTagLabel;
    const initialDataCheck = state?.tableData?.initialTableData;
    const currentData = (0, _lodash.default)(finalData);
    const resetTableRow = resetTableOnClickPlanTag && selectedRows.length > 0 && lastActionFromState && initialDataCheck.length > 0;
    if (resetTableRow || isTabletPlanFailed) {
      selectedRows.forEach(index => {
        const checkTagActivity = currentData[index]?.activityType;
        if (checkTagActivity === tagActivityLabelAllow) {
          const currentRowCTN = (0, _helpers.getCtnFromRow)(finalData[index]);
          const originalRow = (0, _helpers.getRowByCtn)(initialTableData, currentRowCTN);
          currentData[index] = originalRow;
          currentData[index] = updateShouldShowIcons(currentData[index]);
        }
      });
      const currentDataString = JSON.stringify(currentData);
      const finalDataString = JSON.stringify(finalData);
      if (currentDataString !== finalDataString) resetEntireTable(currentData, labelAction);
    }
    setResetTableOnClickPlanTag(false);
    setIsTabletPlanFailed(false);
  }, [resetTableOnClickPlanTag, isTabletPlanFailed]);
  const deleteNewLine = tableRowIndex => {
    const clonedDataSource = (0, _lodash.default)(finalData);
    clonedDataSource.splice(tableRowIndex, 1);
    const updatedDataSource = clonedDataSource.map((line, index) => ({
      ...line,
      key: index
    }));
    setFinalTableData(updatedDataSource);
    setState(v => ({
      ...v,
      tableData: {
        ...v.tableData,
        finalData: updatedDataSource
      }
    }));
    expandAllNotes(updatedDataSource);
  };
  const getPlanApiData = socCode => {
    const allPlans = [...state.getplansandaddonsResponse.plans.currentPlans, ...state.getplansandaddonsResponse.plans.expiredPlans];
    return allPlans.find(plan => plan.socCode === socCode);
  };
  const addNewLine = (addLineValidationRequest, addLineValidationResponse, formValues, isActiveEdit, editKey) => {
    const {
      isError,
      errors
    } = (0, _helpers.handleAddNewLineResponseErrors)(addLineValidationResponse);
    if (isError) {
      setState(s => ({
        ...s,
        stepControllerFeedback: {
          ...s.stepControllerFeedback,
          modal: {
            ...s.stepControllerFeedback.modal,
            display: false,
            message: displayErrors(errors),
            title: 'Failed to add a line'
          }
        }
      }));
      return;
    }
    // remove the null data at start to allow render of form
    const updatedDataSource = finalData.slice(1);
    const telephoneData = (0, _helpers.getTelephoneData)(addLineValidationRequest, addLineValidationResponse, formValues);
    const isNewLine = !isActiveEdit || editKey === undefined;
    let newLine = {};
    if (isNewLine) {
      newLine = {
        key: updatedDataSource.length,
        rank: 0,
        activityType: 'ADDLINE',
        formValues,
        additionalInfo: {
          marketingOptInIndicator: formValues?.marketingOptInIndicator,
          thirdPartyOptInIndicator: formValues?.thirdPartyOptInIndicator
        },
        telephoneData,
        plan: {
          currentPlan: {},
          newPlan: {}
        },
        technicalSocs: [],
        addOns: [],
        changes: [],
        discounts: 0,
        subTotal: 0,
        operations: {
          newLine: true,
          showIcons: true,
          disableSelection: false
        }
      };
    }
    const updatedFinalData = isNewLine ? [newLine, ...updatedDataSource].map((line, index) => ({
      ...line,
      key: index
    })) : [...updatedDataSource.slice(0, editKey), {
      ...updatedDataSource[editKey],
      telephoneData,
      formValues
    }, ...updatedDataSource.slice(editKey + 1)];
    setFinalTableData(updatedFinalData);
    const updateKeys = isNewLine ? selectedRowKeys.map(k => k + 1).sort() : selectedRowKeys.sort();
    setSelectedRowKeys(updateKeys);
    setState(v => ({
      ...v,
      tableData: {
        ...v.tableData,
        finalData: updatedFinalData
      },
      uiData: {
        ...v.uiData,
        lastAction: 'update/add-line',
        selected: {
          ...v.uiData.selected,
          tableRows: updateKeys
        }
      }
    }));
    setAddLineFormVisible(false);
    expandAllNotes(updatedFinalData);
  };
  const removeNewPlan = tableRowIndex => {
    if (tableRowIndex === null || tableRowIndex === undefined) return;
    const updatedDataSource = (0, _lodash.default)(finalData);
    if (_tabletInformation.default?.plansWithTabletPlan?.includes(updatedDataSource[tableRowIndex]?.plan?.newPlan?.socCode)) setResetTabletAfterRemoveNewPlan(true);
    updatedDataSource[tableRowIndex].plan.newPlan = {};
    (0, _helpers.addRemoveCompatibleAddons)(updatedDataSource[tableRowIndex], updatedDataSource[tableRowIndex].plan.currentPlan.pricePlanSocCode, state.getplansandaddonsResponse, technicalSocsMetadata, tableRowIndex);
    updatedDataSource[tableRowIndex] = updateShouldShowIcons(updatedDataSource[tableRowIndex]);
    setFinalTableData(updatedDataSource);
    setState(v => ({
      ...v,
      tableData: {
        ...v.tableData,
        finalData: updatedDataSource
      }
    }));
  };
  (0, _react.useEffect)(() => {
    if (resetTabletAfterRemoveNewPlan) {
      console.log('deletion', state);
      const tableData = state?.tableData?.finalData;
      const tabletRowInformation = [];
      tableData.forEach((data, index) => {
        if (data?.plan?.newPlan?.socCode === _tabletInformation.default?.tabletPlanTag?.name) {
          tabletRowInformation.push(index);
        }
      });
      if (tabletRowInformation.length > 0) setRowToDeselect([tabletRowInformation[0]]);
      setResetTableRowByTablet(true);
    }
    setResetTabletAfterRemoveNewPlan(false);
  }, [resetTabletAfterRemoveNewPlan]);
  (0, _react.useEffect)(() => {
    const selectedRows = rowToDeselect;
    if (resetTableRowByTablet) {
      selectedRows.forEach(index => {
        removeNewPlan(index);
      });
    }
    setResetTableRowByTablet(false);
  }, [resetTableRowByTablet]);
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
  const technicalSocUpdateResponse = (socCode, rowIndex) => (subscriptionId, topic, eventData, closure) => {
    const {
      successStates,
      errorStates
    } = technicalSocUpdate;
    const status = eventData.value;
    const isSuccess = successStates.includes(status);
    const isFailure = errorStates.includes(status);
    if (isSuccess || isFailure) {
      if (isSuccess) {
        addTechnicalSoc(rowIndex, getAddOnMeta(socCode));
        _componentMessageBus.MessageBus.unsubscribe(subscriptionId);
      }
      if (isFailure) {
        _componentMessageBus.MessageBus.unsubscribe(subscriptionId);
      }
      const newPendingTechnicalSocInclusions = (0, _lodash.default)(pendingTechnicalSocInclusions);

      // remove first item in array - network request has already been made
      newPendingTechnicalSocInclusions.shift();
      if (newPendingTechnicalSocInclusions.length > 0) {
        // this should update state and call useeffect again (useEffect fires network request for first element in array)
        setPendingTechnicalSocInclusions(newPendingTechnicalSocInclusions);
        setProcessTechnicalSocInclusions(true);
      } else {
        setPendingTechnicalSocInclusions([]);
        setProcessTechnicalSocInclusions(false);
      }
    }
  };
  const technicalSocUpdateCall = (requestBody, inclusionSoc, rowIndex) => {
    const {
      datasource,
      responseMapping
    } = technicalSocUpdate;
    let {
      workflow
    } = technicalSocUpdate;
    workflow += 'TABLE'; // since we already have a similar workflow in Technical socs Modal component

    _componentMessageBus.MessageBus.subscribe(workflow, 'WF.'.concat(workflow).concat('.STATE.CHANGE'), technicalSocUpdateResponse(inclusionSoc, rowIndex));
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
            phonenumber: filteredData[rowIndex]?.telephoneData?.telephoneNumber
          }
        },
        responseMapping
      }
    });
  };
  const addAddOnInclusion = (selectedAddonMeta, tabInfo, plansAndAddons, rowIndex) => {
    const {
      addOns,
      changes,
      technicalSocs
    } = tabInfo;
    let inclusionPresent = false;
    let inclusionsLength = selectedAddonMeta.inclusions.length;
    let technicalSocInclusionExists = false;
    const newPendingTechnicalSocInclusions = JSON.parse(JSON.stringify(pendingTechnicalSocInclusions));
    // eslint-disable-next-line no-plusplus
    while (--inclusionsLength >= 0 && !inclusionPresent) {
      const inclusion = addOns?.find(
      // eslint-disable-next-line no-loop-func
      currentAddOn => currentAddOn.socCode === selectedAddonMeta.inclusions[inclusionsLength] && currentAddOn?.changes?.removedAddOn !== true) || technicalSocs?.find(
      // eslint-disable-next-line no-loop-func
      soc => soc.socCode === selectedAddonMeta.inclusions[inclusionsLength] && soc?.changes?.removedAddOn !== true);
      inclusionPresent = inclusion !== undefined;
    }
    if (!inclusionPresent) {
      //  add inclusion
      //  get Compatibility info
      const compatibilityInfoForLine = plansAndAddons.compatibility.compatibilityInfo.find(c => (c.subscriberNumber || c.imei) === (tabInfo.telephoneData.subscriberNumber || tabInfo.telephoneData.imei));
      if (compatibilityInfoForLine !== undefined) {
        const selectedPlan = compatibilityInfoForLine.plans[Object.keys(tabInfo.plan.newPlan).length === 0 ? tabInfo.plan.currentPlan.pricePlanSocCode : tabInfo.plan.newPlan.pricePlanSocCode];
        if (selectedPlan !== undefined) {
          inclusionsLength = selectedAddonMeta.inclusions.length;
          let inclusionAdded = false;
          // eslint-disable-next-line no-plusplus
          while (--inclusionsLength >= 0 && !inclusionAdded) {
            inclusionAdded = selectedPlan.addOns.includes(selectedAddonMeta.inclusions[inclusionsLength]);
            const inclusionAddOn = getAddOnMeta(selectedAddonMeta.inclusions[inclusionsLength]);
            if (inclusionAdded && inclusionAddOn) {
              if (!inclusionAddOn?.technical) {
                addOns.push({
                  socCode: inclusionAddOn.socCode,
                  longDescription: inclusionAddOn?.longDescription || '',
                  shortDescription: inclusionAddOn?.shortDescription || '',
                  quantity: 1,
                  addOnType: inclusionAddOn.addOnType,
                  price: inclusionAddOn.price,
                  inclusion: true,
                  changes: {
                    newAddOn: true,
                    reason: selectedAddonMeta.socCode
                  }
                });
                changes.push({
                  [inclusionAddOn.socCode]: {
                    changeType: 'newAddOn',
                    price: inclusionAddOn.price,
                    quantity: 1,
                    inclusion: true,
                    reason: selectedAddonMeta.socCode
                  }
                });
              } else {
                technicalSocs.push({
                  socCode: inclusionAddOn.socCode,
                  longDescription: inclusionAddOn?.longDescription || '',
                  shortDescription: inclusionAddOn?.shortDescription || '',
                  addOnType: inclusionAddOn.addOnType,
                  price: inclusionAddOn.price,
                  quantity: 1,
                  inclusion: true,
                  changes: {
                    newAddOn: true,
                    reason: selectedAddonMeta.socCode
                  },
                  technical: true
                });
              }
            }
          }
        }
      }
    }
    if (technicalSocInclusionExists && newPendingTechnicalSocInclusions.length > 0) {
      setPendingTechnicalSocInclusions(newPendingTechnicalSocInclusions);
      setProcessTechnicalSocInclusions(true);
    }
  };

  /**
   * Checks the new plans provided in argument and returns true if new plans include a tablet plan
   * @param {Object[]} newFinalData
   * @returns {boolean}
   */
  const checkIfNewPlansAreTabletPlan = newFinalData => {
    // We need to disable next bill cycle if the new plan is a tablet plan
    // check if the next bill cycle button is already disabled
    if (!state?.uiData?.disabledNextBillCycleTablet) {
      // if next bill cycle button is not already disabled - check if plan is tablet plan
      return newFinalData.some(line => {
        // ignore checking for lines that do not have a new plan
        if (line?.plan?.newPlan && Object.keys(line?.plan?.newPlan).length === 0) return false;
        return line?.plan?.newPlan?.tablet;
      });
    } else {
      return state?.uiData?.disabledNextBillCycleTablet;
    }
  };
  const addFromAccordion = (functionType, dataToAdd, rowKeys) => {
    const finalDataCopy = (0, _lodash.default)(finalData);
    const hackishAddALine = finalDataCopy.filter(item => item.key === -1);
    const updatedDataSource = finalData.filter(item => item.key >= 0);
    const addNewPlan = function (plan) {
      let selectedRowIndexes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      selectedRowIndexes.forEach(rowIndex => {
        if (updatedDataSource[rowIndex] && updatedDataSource[rowIndex].plan) {
          updatedDataSource[rowIndex].plan.newPlan = {};
        }
        if (updatedDataSource[rowIndex].plan && updatedDataSource[rowIndex].plan?.currentPlan?.pricePlanSocCode !== plan?.pricePlanSocCode) {
          updatedDataSource[rowIndex].plan.newPlan = plan;
        }
        // if there is current plan
        if (updatedDataSource[rowIndex]?.plan?.currentPlan?.pricePlanSocCode !== undefined) {
          (0, _helpers.addRemoveCompatibleAddons)(updatedDataSource[rowIndex], plan.pricePlanSocCode, state.getplansandaddonsResponse, technicalSocsMetadata, rowIndex);
        }
        updatedDataSource[rowIndex] = updateShouldShowIcons(updatedDataSource[rowIndex]);
      });
    };
    const addNewAddOn = (addOn, addOnMeta, selectedRowIndexes) => {
      let addOnsRow;
      let technicalSocsRow;
      let changesRow;

      // check to see if there is a technical soc in inclusions
      let inclusionsHasTechnical = false;
      const technicalInclusions = [];
      if (addOnMeta?.inclusions?.length > 0) {
        for (let i = 0; i < addOnMeta?.inclusions?.length; i++) {
          const inclusionAddOn = getAddOnMeta(addOnMeta.inclusions[i]);
          if (inclusionAddOn?.technical) {
            const technicalSocMetadata = technicalSocsMetadata.find(soc => soc?.name === inclusionAddOn?.socCode);
            if (technicalSocMetadata !== undefined) {
              if (technicalSocMetadata?.edit !== 'false' && technicalSocMetadata?.edit !== false) {
                const requestBody = {
                  services: [{
                    soc: inclusionAddOn?.socCode,
                    action: 'ADD'
                  }]
                };
                selectedRowIndexes.forEach(index => {
                  const inclusionToAdd = {
                    requestBody,
                    socCode: inclusionAddOn?.socCode,
                    index
                  };
                  technicalInclusions.push(inclusionToAdd);
                });
                inclusionsHasTechnical = true;
              }
            }
          }
        }
      }
      selectedRowIndexes.forEach(rowIndex => {
        addOnsRow = updatedDataSource[rowIndex].addOns;
        technicalSocsRow = updatedDataSource[rowIndex]?.technicalSocs;
        changesRow = updatedDataSource[rowIndex].changes;
        const keyWord = concatenateWords(addOn.socCode, rowIndex);
        addingNewAddOn(keyWord, 0);

        /*
            Check if any of the current Addons have to be excluded when new addon is added.
            Removal rules -
                if Addon is added during this session , repalce
                if Addon is an existing addon , remove and add to change list
            The reverse of this should happen, when we revert a selection (from changes)
         */
        if (addOnMeta !== undefined && addOnMeta?.exclusions?.length > 0) {
          let totalAddons = addOnsRow.length;
          while (--totalAddons >= 0) {
            const currentAddon = addOnsRow[totalAddons];
            if (addOnMeta.exclusions.indexOf(currentAddon.socCode) >= 0) {
              const changesAddOnIndex = (0, _helpers.getAddOnIndexFromChanges)(changesRow, currentAddon.socCode);
              //  changes has newAddOn true -> remove it
              if (currentAddon.changes.newAddOn) {
                addOnsRow.splice(totalAddons, 1);
                changesRow.splice(changesAddOnIndex, 1);
              } else if (Object.keys(currentAddon.changes).length === 0) {
                //    This AddOn is not in removed state
                //  Add removedAddOn
                currentAddon.changes = {
                  removedAddOn: true
                };
                currentAddon.excluded = true;
                currentAddon.exclusionReason = addOn.socCode;
                changesRow.push({
                  [currentAddon.socCode]: {
                    changeType: 'removedAddOn',
                    price: currentAddon.price,
                    excluded: true,
                    exclusionReason: addOn.socCode
                  }
                });
              }
            }
          }
          let totalTechnicalSocs = technicalSocsRow?.length;
          while (--totalTechnicalSocs >= 0) {
            const currentAddon = technicalSocsRow[totalTechnicalSocs];
            if (addOnMeta.exclusions.indexOf(currentAddon.socCode) >= 0) {
              const changesAddOnIndex = (0, _helpers.getAddOnIndexFromChanges)(changesRow, currentAddon.socCode);
              //  changes has newAddOn true -> remove it
              if (currentAddon.changes.newAddOn) {
                addOnsRow.splice(totalAddons, 1);
                changesRow.splice(changesAddOnIndex, 1);
              } else if (Object.keys(currentAddon.changes).length === 0) {
                //    This AddOn is not in removed state
                //  Add removedAddOn
                currentAddon.changes = {
                  removedAddOn: true
                };
                currentAddon.excluded = true;
                currentAddon.exclusionReason = addOn.socCode;
                changesRow.push({
                  [currentAddon.socCode]: {
                    changeType: 'removedAddOn',
                    price: currentAddon.price,
                    excluded: true,
                    exclusionReason: addOn.socCode
                  }
                });
              }
            }
          }
        }

        /** See if any of the inclusions will have to be added */
        if (addOnMeta !== undefined && addOnMeta?.inclusions?.length > 0) {
          addAddOnInclusion(addOnMeta, updatedDataSource[rowIndex], state.getplansandaddonsResponse, rowIndex);
        }

        // updates the addOns object being passed into the table

        const addOnRowIdx = addOnsRow.findIndex(rowItem => rowItem.socCode === addOn.socCode);
        const technicalSocRowIdx = technicalSocsRow.findIndex(rowItem => rowItem.socCode === addOn.socCode);

        // If addOn already exists on line
        addOnsQty[keyWord]?.incrementQty();
        if (addOnRowIdx >= 0 || technicalSocRowIdx >= 0) {
          if (addOnsRow[addOnRowIdx]?.quantity === 1 && (0, _helpers.isMRC)(addOnsRow[addOnRowIdx]?.socCode, MRCsocs)) {
            // custom logic for MRC addons - we can only have quantity of 1 for these add-ons. Break function with 'return'
            return;
          }
          addOnsRow[addOnRowIdx].changes = {
            quantity: addOnsQty[keyWord]?.getQty() || 0
          };
          // Format of changesRow:
          //
          // changes: [{addOn.socCode:
          //              {"changeType": "newAddOn", "price": 15, "quantity": 1}
          //          }]
          //
          const changesRowIdx = changesRow.findIndex(rowItem =>
          // use Object.keys because of the format of changesRow above
          Object.keys(rowItem).includes(addOn.socCode));
          // if add on is not inside changes array, add it
          if (changesRowIdx === -1) {
            changesRow.push({
              [addOn.socCode]: {
                changeType: 'addOnQuantity',
                price: addOn.price,
                quantity: addOnsQty[keyWord]?.getQty() || 0
              }
            });
          } else {
            changesRow[changesRowIdx][addOn.socCode].quantity = addOnsQty[keyWord]?.getQty() || 0;
          }
          addOnsRow[addOnRowIdx].quantity = addOnsQty[keyWord]?.getQty() || 0;
        } else {
          addOnsRow.push({
            ...addOn,
            quantity: addOnsQty[keyWord]?.getQty() || 0,
            addOnType: addOn?.addOnType,
            changes: {
              newAddOn: true
            }
          });
          changesRow.push({
            [addOn.socCode]: {
              changeType: 'newAddOn',
              price: addOn?.price,
              quantity: addOnsQty[keyWord]?.getQty() || 0
            }
          });
        }
        updatedDataSource[rowIndex] = updateShouldShowIcons(updatedDataSource[rowIndex]);
      });
      if (inclusionsHasTechnical) {
        setPendingTechnicalSocInclusions(technicalInclusions);
        setProcessTechnicalSocInclusions(true);
      }
    };
    const addDeal = (deal, selectedRowIndexes) => {
      deal.dealDetails.forEach((dealDetail, i) => {
        const planApiData = getPlanApiData(dealDetail.newPlanCode);
        const planToAdd = {
          socCode: dealDetail.newPlanCode,
          longDescription: planApiData.longDescription,
          shortDescription: planApiData.shortDescription,
          price: dealDetail.originalPrice,
          pricePlanSocCode: dealDetail.newPlanCode,
          pricePlanSocCodeDescription: planApiData.longDescription,
          actualPrice: dealDetail.dealPrice,
          discountAmount: dealDetail.lineSavings
        };
        addNewPlan(planToAdd, [selectedRowIndexes[i]]);
      });
    };
    switch (functionType) {
      case 'addNewPlan':
        {
          addNewPlan(dataToAdd, rowKeys);
          break;
        }
      case 'addNewAddOn':
        {
          addNewAddOn(dataToAdd, getAddOnMeta(dataToAdd.socCode), rowKeys);
          break;
        }
      case 'addDeal':
        {
          addDeal(dataToAdd, rowKeys);
          break;
        }
      default:
        break;
    }
    const newFinalData = [...hackishAddALine, ...updatedDataSource];
    console.log('newFinalData', newFinalData);
    setState(v => ({
      ...v,
      uiData: {
        ...v.uiData,
        disabledNextBillCycleTablet: checkIfNewPlansAreTabletPlan(newFinalData),
        selected: {
          ...v.uiData.selected,
          plans: [],
          addOns: [],
          deals: []
        }
      },
      tableData: {
        ...v.tableData,
        finalData: newFinalData
      }
    }));
    setFinalTableData(newFinalData);
    setSelectedRowKeys(rowKeys);
  };
  const changeAddOnQuantity = (tableRowIndex, addOnCode, newQuantity) => {
    const updatedDataSource = (0, _lodash.default)(finalData);
    let addOnsRow = updatedDataSource[tableRowIndex].addOns;
    let changesRow = updatedDataSource[tableRowIndex].changes;
    const addOnIndex = (0, _helpers.getAddOnIndexFromTable)(addOnsRow, addOnCode);
    const updatedAddOn = (0, _helpers.getAddOnFromTable)(addOnsRow, addOnCode);
    const keyWord = concatenateWords(addOnCode, tableRowIndex);
    addingNewAddOn(keyWord, newQuantity);
    adjustAddOnQuantity(keyWord, newQuantity);
    if (newQuantity !== 0) {
      updatedAddOn.changes = {
        ...updatedAddOn.changes,
        quantity: addOnsQty[keyWord]?.getQty() || 0
      };
      // updates the addOns object being passed into the table
      addOnsRow[addOnIndex] = updatedAddOn;

      // look for add on inside changes array
      const changesAddOnIndex = (0, _helpers.getAddOnIndexFromChanges)(changesRow, addOnCode);

      // if add on found inside changes array, update that add on
      if (changesAddOnIndex !== -1) {
        // if we are setting quantity back to the original quantity
        if (!updatedAddOn?.changes?.newAddOn && updatedAddOn?.quantity === addOnsQty[keyWord]?.getQty() || 0) {
          // remove the quantity change
          delete updatedAddOn.changes.quantity;
          // remove the changes entry
          changesRow = changesRow.splice(changesAddOnIndex, 1);
        }
        // otherwise update the changes and row
        else {
          changesRow[changesAddOnIndex] = {
            [addOnCode]: {
              changeType: changesRow[changesAddOnIndex][addOnCode].changeType,
              price: updatedAddOn.price,
              quantity: addOnsQty[keyWord]?.getQty() || 0
            }
          };
        }

        // if add on is not found, add it to the changes array
      } else {
        changesRow.push({
          [addOnCode]: {
            changeType: 'addOnQuantity',
            price: updatedAddOn.price,
            quantity: addOnsQty[keyWord]?.getQty() || 0
          }
        });
      }
    }
    if (newQuantity === 0) {
      if (addOnsRow[addOnIndex].changes?.newAddOn) {
        // This is same as reset
        resetNewAddOn(tableRowIndex, addOnCode);
        return;
      }
      const changesAddOnIndex = (0, _helpers.getAddOnIndexFromChanges)(changesRow, addOnCode);
      addOnsRow[addOnIndex].changes = {
        removedAddOn: true
      };
      if (changesAddOnIndex !== -1) {
        if (changesRow[changesAddOnIndex][addOnCode].changeType === 'newAddOn') {
          // if this was a new addon and the quantity is set to 0, remove this addon from changes array
          changesRow = changesRow.splice(changesAddOnIndex, 1);
          // remove from addons array
          addOnsRow = addOnsRow.splice(addOnIndex, 1);
        }
        changesRow[changesAddOnIndex] = {
          [addOnCode]: {
            changeType: 'removedAddOn',
            price: updatedAddOn.price
          }
        };
      } else {
        changesRow.push({
          [addOnCode]: {
            changeType: 'removedAddOn',
            price: updatedAddOn.price
          }
        });
      }
    }
    updatedDataSource[tableRowIndex] = updateShouldShowIcons(updatedDataSource[tableRowIndex]);
    setFinalTableData(updatedDataSource);
    setState(v => ({
      ...v,
      tableData: {
        ...v.tableData,
        finalData: updatedDataSource
      }
    }));
  };
  const removeTechnicalSoc = (tableRowIndex, technicalSocCode) => {
    const technicalSocCtn = finalData?.[tableRowIndex]?.telephoneData?.telephoneNumber;
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
            tableRowIndex,
            addOrRemove: 'remove',
            technicalSocUpdate,
            datasources
          }
        }
      }
    }));
  };
  const resetNewAddOn = (tableRowIndex, addOnCode) => {
    const updatedDataSource = (0, _lodash.default)(finalData);
    const addOnsRow = updatedDataSource[tableRowIndex].addOns;
    const changesRow = updatedDataSource[tableRowIndex].changes;
    const addOnIndex = (0, _helpers.getAddOnIndexFromTable)(addOnsRow, addOnCode);
    const changesAddOnIndex = (0, _helpers.getAddOnIndexFromChanges)(changesRow, addOnCode);
    if (addOnIndex !== -1) {
      addOnsRow.splice(addOnIndex, 1);
    }
    if (changesAddOnIndex !== -1) {
      changesRow.splice(changesAddOnIndex, 1);
    }

    // Check if this AddonCode was the reason a SOC was included, remove the inclusion as well
    const includedAddonIdx = addOnsRow.findIndex(ia => ia.inclusion && ia?.changes?.reason === addOnCode);
    if (includedAddonIdx >= 0) {
      const includedSocCode = addOnsRow[includedAddonIdx].socCode;
      const includedAddOnChangeIdx = (0, _helpers.getAddOnIndexFromChanges)(changesRow, includedSocCode);
      addOnsRow.splice(includedAddonIdx, 1);
      if (includedAddOnChangeIdx !== -1) {
        changesRow.splice(includedAddOnChangeIdx, 1);
      }
    }

    //  See if the reset would cause any exclusions to be added back
    addOnsRow.forEach(addOn => {
      if (addOn.exclusionReason === addOnCode) {
        addOn.changes = {};
        delete addOn.excluded;
        delete addOn.exclusionReason;
        let numChanges = changesRow.length;
        while (--numChanges >= 0) {
          if (changesRow[numChanges][addOn.socCode] !== undefined) {
            changesRow.splice(numChanges, 1);
            break;
          }
        }
      }
    });
    updatedDataSource[tableRowIndex] = updateShouldShowIcons(updatedDataSource[tableRowIndex]);
    setFinalTableData(updatedDataSource);
    setState(v => ({
      ...v,
      tableData: {
        ...v.tableData,
        finalData: updatedDataSource
      }
    }));
  };
  const resetAddOnQuantity = (tableRowIndex, addOnCode) => {
    const updatedDataSource = (0, _lodash.default)(finalData);
    const addOnsRow = updatedDataSource[tableRowIndex].addOns;
    const changesRow = updatedDataSource[tableRowIndex].changes;
    const addOnIndex = (0, _helpers.getAddOnIndexFromTable)(addOnsRow, addOnCode);
    const changesAddOnIndex = (0, _helpers.getAddOnIndexFromChanges)(changesRow, addOnCode);
    if (addOnIndex !== -1) {
      addOnsRow[addOnIndex].changes = {};
    }
    if (changesAddOnIndex !== -1) {
      changesRow.splice(changesAddOnIndex, 1);
    }
    updatedDataSource[tableRowIndex] = updateShouldShowIcons(updatedDataSource[tableRowIndex]);
    setFinalTableData(updatedDataSource);
    setState(v => ({
      ...v,
      tableData: {
        ...v.tableData,
        finalData: updatedDataSource
      }
    }));
  };
  const resetRemovedAddOn = (tableRowIndex, addOnCode) => {
    const updatedDataSource = (0, _lodash.default)(finalData);
    const addOnsRow = updatedDataSource[tableRowIndex].addOns;
    const changesRow = updatedDataSource[tableRowIndex].changes;
    const addOnIndex = (0, _helpers.getAddOnIndexFromTable)(addOnsRow, addOnCode);
    const changesAddOnIndex = (0, _helpers.getAddOnIndexFromChanges)(changesRow, addOnCode);
    if (changesAddOnIndex !== -1) {
      changesRow.splice(changesAddOnIndex, 1);
    }
    if (addOnIndex !== -1) {
      addOnsRow[addOnIndex].changes = {};
      if (addOnsRow[addOnIndex].excluded) {
        //  delete other Addon
        const exclusionChangeIndex = (0, _helpers.getAddOnIndexFromChanges)(changesRow, addOnsRow[addOnIndex].exclusionReason);
        changesRow.splice(exclusionChangeIndex, 1);
        let exclusionReasonIndex = -1;
        addOnsRow.forEach((addOn, index) => {
          if (addOn.socCode === addOnsRow[addOnIndex].exclusionReason) {
            exclusionReasonIndex = index;
          }
        });
        addOnsRow.splice(exclusionReasonIndex, 1);
        delete addOnsRow[addOnIndex].excluded;
        delete addOnsRow[addOnIndex].exclusionReason;
      }
    }
    updatedDataSource[tableRowIndex] = updateShouldShowIcons(updatedDataSource[tableRowIndex]);
    setFinalTableData(updatedDataSource);
    setState(v => ({
      ...v,
      tableData: {
        ...v.tableData,
        finalData: updatedDataSource
      }
    }));
  };
  const handleToggle = function () {
    let tableRowIndex = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
    if (!allowAddLine) return;
    const newData = {
      key: -1,
      rank: -1,
      activityType: null,
      telephoneData: null,
      currentPlan: null,
      formValues: null,
      technicalSocs: [],
      addOns: [],
      changes: [],
      discounts: 0,
      subTotal: 0,
      operations: {
        newLine: false,
        showIcons: false
      }
    };
    let finalDataCopy = finalData.map(x => x);
    if (!addLineFormVisible) {
      finalDataCopy = [newData, ...finalDataCopy];
      setFinalTableData(finalDataCopy);
      setAddLineFormVisible(true);
      setEditRowKey(tableRowIndex);
      expandAllNotes(finalDataCopy);
    }
    if (addLineFormVisible) {
      finalDataCopy.shift();
      setFinalTableData(finalDataCopy);
      setAddLineFormVisible(false);
      setEditRowKey(undefined);
      expandAllNotes(finalDataCopy);
    }
    setState(v => ({
      ...v,
      tableData: {
        ...v.tableData,
        finalData: finalDataCopy
      }
    }));
  };
  const editLine = tableRowIndex => {
    handleToggle(tableRowIndex);
  };
  const rowSelection = {
    selectedRowKeys: state.uiData.selected.tableRows.sort(),
    onChange: (selectedKeys, selectedRows) => {
      // checking if lines selected in CRP have a tablet plan as current plan
      if (selectedRows?.some(line => state?.getmappedtabletplanResponse[line?.telephoneData?.telephoneNumber]?.tabletPlanMapped || line?.plan?.currentPlan?.pricePlanSocCode?.includes(_tabletInformation.default?.tabletPlanTag?.name))) {
        // we do not allow any future dated activity on any line with an unlimited tablet plan
        // disable next bill cycle radio button
        setState(prevState => ({
          ...prevState,
          uiData: {
            ...prevState.uiData,
            disabledNextBillCycleTablet: true
          }
        }));
      } else {
        if (selectedRows.length === 0) {
          setState(prevState => ({
            ...prevState,
            uiData: {
              ...prevState.uiData,
              disabledNextBillCycleTablet: false
            }
          }));
        } else {
          // enable the next bill cycle radio button - if new plan is not tablet plan
          // disable the next bill cycle radio button - if new plan is tablet plan
          setState(prevState => ({
            ...prevState,
            uiData: {
              ...prevState.uiData,
              disabledNextBillCycleTablet: checkIfNewPlansAreTabletPlan(selectedRows)
            }
          }));
        }
      }
      setEnableEffectiveRadio(checkRadioSelectionEligibility(finalData, state?.getplansandaddonsResponse?.compatibility?.compatibilityInfo || [], currentAddOnsWithInsurance, selectedKeys, insuranceAddOnMessage, setInsuranceMessage));
      setSelectedRowKeys(selectedKeys.sort());
      setState(v => ({
        ...v,
        uiData: {
          ...v.uiData,
          selected: {
            ...v.uiData.selected,
            tableRows: selectedKeys.sort()
          }
        }
      }));
    },
    getCheckboxProps: record => ({
      disabled: record.operations?.disableSelection || addLineFormVisible || record?.telephoneData?.ptnStatus === 'C',
      name: record.name
    }),
    renderCell: (checked, record, index, originNode) => {
      if (record.key === -1) return null;
      let bgColor = '#d5dce5';
      if (record?.activityType === 'ADDLINE') {
        bgColor = '#eaff8f';
      } else {
        const ptnStatus = record?.telephoneData?.ptnStatus;
        if (ptnStatus) {
          if (ptnStatus === 'A') {
            bgColor = '#60a630';
          } else if (ptnStatus === 'S') {
            bgColor = '#ffa940';
          } else if (ptnStatus === 'C') {
            bgColor = '#d35d43';
          }
        }
      }
      return /*#__PURE__*/_react.default.createElement("div", {
        className: "crp-table__checkbox-cell"
      }, originNode, /*#__PURE__*/_react.default.createElement("div", {
        className: "crp-table__checkbox-color-indicator",
        style: {
          backgroundColor: bgColor
        }
      }));
    }
  };
  (0, _react.useEffect)(() => {
    if (selectedRowKeys.length > 0) {
      // check plans
      if (state.uiData.selected.plans.length > 0) {
        const originalPlan = state.uiData.selected.plans[0].selectedMeta;
        const finalPlan = {
          ...originalPlan,
          pricePlanSocCode: originalPlan.socCode,
          pricePlanSocCodeDescription: originalPlan.longDescription,
          actualPrice: originalPlan.price,
          discountAmount: 0
        };
        addFromAccordion('addNewPlan', finalPlan, selectedRowKeys);
      }

      // check addOns
      if (state.uiData.selected.addOns.length > 0) {
        const addOn = state.uiData.selected.addOns[0].selectedMeta;
        addFromAccordion('addNewAddOn', addOn, selectedRowKeys);
      }

      // check deals
      if (state.uiData.selected.deals.length > 0) {
        const deal = state.uiData.selected.deals[0].selectedMeta;
        addFromAccordion('addDeal', deal, selectedRowKeys);
      }
    }
  });
  (0, _react.useEffect)(() => {
    if (pendingTechnicalSocInclusions.length > 0 && processTechnicalSocInclusions) {
      // call the first item in the array
      technicalSocUpdateCall(pendingTechnicalSocInclusions?.[0]?.requestBody, pendingTechnicalSocInclusions?.[0]?.socCode, pendingTechnicalSocInclusions?.[0]?.index);
    } else if (pendingTechnicalSocInclusions.length < 1 && processTechnicalSocInclusions) {
      setProcessTechnicalSocInclusions(false);
      setPendingTechnicalSocInclusions([]);
    }
  }, [processTechnicalSocInclusions, pendingTechnicalSocInclusions]);

  /*
  -This will take filtered table data and filter out all the canceled lines
  -Then this data will be provoided to Table so that it only prints the Active and Suspended lines
  */
  // useEffect(() => {
  //     let tempTableData = filteredData.filter((item) => {
  //         return item?.telephoneData?.ptnStatus !== 'C';
  //     });
  //     setNewTableData(tempTableData);
  // }, [filteredData]);

  const tableClassName = `change_rate_plan_table${className ? ` ${className}` : ''}`;
  const shouldRenderExpandedRow = recordData => {
    const showChangeCount = recordData?.activityType === 'CHANGESERVICES';
    const suspendedAccount = recordData?.telephoneData?.ptnStatus === 'S';
    const hotlineSuspended = recordData?.telephoneData?.statusActvCode === 'SUS' && recordData?.telephoneData?.statusActvRsnCode === 'CO';
    const showExpandedRow = showChangeCount || suspendedAccount || hotlineSuspended;
    return showExpandedRow;
  };
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_antd.Table, {
    className: tableClassName,
    rowSelection: {
      type: 'checkbox',
      ...rowSelection
    },
    bordered: true,
    dataSource: filteredData,
    columns: columns(filteredData, dataHook, resetEntireTable, resetEntireRow, deleteNewLine, addNewLine, editLine, removeNewPlan, changeAddOnQuantity, resetNewAddOn, resetAddOnQuantity, resetRemovedAddOn, handleToggle, addLineFormVisible, editRowKey, filterText, setFilterText, properties, datasources, allowAddLine, ebbQualifiedPlans, MRCsocs, allowEditTechnicalSocs, removeTechnicalSoc, technicalSocsMetadata, customerInfo, setState, state),
    expandable: {
      expandedRowKeys: defaultExpandedRowKeys,
      expandIconColumnIndex: -1,
      expandedRowRender: record => {
        return /*#__PURE__*/_react.default.createElement(_ExpandedRow.default, _extends({}, record, {
          datasources: datasources,
          lineDetailMemos: lineDetailMemos,
          userMessages: userMessages
        }));
      },
      expandedRowClassName: record => {
        const shouldRender = shouldRenderExpandedRow(record);
        return shouldRender ? '' : 'hideExpandedRow';
      }
    }
  }));
};
var _default = CRPTable;
exports.default = _default;
module.exports = exports.default;