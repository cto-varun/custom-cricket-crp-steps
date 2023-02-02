"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _antd = require("antd");
var _icons = require("@ant-design/icons");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const Tags = {
  CREATED: {
    color: 'blue',
    title: 'Created'
  },
  INPROGRESS: {
    color: 'orange',
    title: 'In Progress'
  },
  SUCCESS: {
    color: 'green',
    title: 'Success'
  },
  CANCELLED: {
    color: 'red',
    title: 'Canceled'
  },
  OKTOSUBMIT: {
    color: 'green',
    title: 'OK to Submit'
  },
  FAILURE: {
    color: 'red',
    title: 'Failure'
  }
};
const {
  Text
} = _antd.Typography;
const OrderList = _ref => {
  let {
    data,
    isLoading,
    onEditOrder,
    onCancelOrder
  } = _ref;
  const columns = [{
    dataIndex: 'orderId',
    title: 'Order ID',
    align: 'left',
    render: (text, record, index) => {
      return /*#__PURE__*/_react.default.createElement(Text, {
        strong: true
      }, text);
    }
  }, {
    dataIndex: 'billingAccountNumber',
    title: 'Account Number',
    align: 'left'
  }, {
    dataIndex: 'firstName',
    title: 'First Name',
    align: 'left'
  }, {
    dataIndex: 'lastName',
    title: 'Last Name',
    align: 'left'
  }, {
    dataIndex: 'orderStepStatus',
    title: 'Status',
    align: 'left',
    render: (text, record) => {
      return /*#__PURE__*/_react.default.createElement(_antd.Tag, {
        color: Tags[text].color
      }, Tags[text].title);
    }
  }, {
    render: (_, record) => {
      const enableUpdate = record.orderStepStatus === 'INPROGRESS' && record?.lines?.find(_ref2 => {
        let {
          lineStep,
          lineStepStatus
        } = _ref2;
        return lineStep === 'PORTIN' && lineStepStatus === 'RESOLUTIONREQ';
      });
      return /*#__PURE__*/_react.default.createElement(_antd.Space, {
        size: "middle"
      }, /*#__PURE__*/_react.default.createElement(_antd.Button, {
        type: "link",
        shape: "circle",
        disabled: !enableUpdate,
        onClick: () => onEditOrder(record),
        icon: /*#__PURE__*/_react.default.createElement(_icons.EditOutlined, null)
      }), /*#__PURE__*/_react.default.createElement(_antd.Button, {
        type: "link",
        shape: "circle",
        onClick: () => onCancelOrder(),
        icon: /*#__PURE__*/_react.default.createElement(_icons.StopOutlined, null)
      }));
    }
  }];
  const expandedRowRender = () => {
    const columns = [{
      title: 'Phone Number',
      dataIndex: 'customerTelephoneNumber',
      key: 'customerTelephoneNumber'
    }, {
      title: 'Line Step',
      dataIndex: 'lineStep',
      key: 'lineStep'
    }, {
      title: 'Line Step Status',
      dataIndex: 'lineStepStatus',
      key: 'lineStepStatus',
      render: (text, record) => {
        return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, text);
      }
    }, {
      title: 'Line Step Details',
      dataIndex: 'lineStepDetails',
      key: 'lineStepDetails',
      render: data => {
        return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, " ", data?.length > 0 && data[0]?.message);
      }
    }, {
      title: 'Port In Status Text',
      dataIndex: 'portInDetails',
      key: 'portInDetails',
      render: data => {
        return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, data?.portInRequestStatus?.portInRequestStatusText);
      }
    }];
    return /*#__PURE__*/_react.default.createElement(_antd.Table, {
      columns: columns,
      dataSource: data[0].lines,
      pagination: false
    });
  };
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "order-list"
  }, /*#__PURE__*/_react.default.createElement(_antd.Table, {
    className: "order-list-table",
    loading: isLoading,
    columns: columns,
    dataSource: data,
    pagination: false,
    expandable: {
      defaultExpandAllRows: true,
      expandedRowRender
    }
  }));
};
var _default = OrderList;
exports.default = _default;
module.exports = exports.default;