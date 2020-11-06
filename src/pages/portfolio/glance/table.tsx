import React from 'react';
import { Table } from 'antd';
import numeral from 'numeral';
import './list.less';
import { history } from 'umi';
import { PortfolioContext } from '@/common/localstorage';

numeral.nullFormat('-');

interface record {
  key: string;
  portcode: string;
  porttype: string;
  launchdate: string;
  netasset: number;
  init: number;
  add: number;
  profit: number;
  nav: number;
  nav_acc: number;
  cash: number;
  value: number;
  fa: '彭传超';
}

function numeralNum(num: number) {
  if (Math.abs(num) <= 2) {
    return numeral(num).format('0.0000');
  }
  return numeral(num).format('0,0.00');
}

const dataSource: Array<record> = [
  {
    key: '1',
    portcode: 'SA5001',
    porttype: '现金型',
    launchdate: '2020-10-14',
    netasset: 10000000,
    init: 10000000,
    add: 0,
    profit: 0,
    nav: 1.0,
    nav_acc: 1.0,
    cash: 100000000,
    value: 0,
    fa: '彭传超',
  },
  {
    key: '2',
    portcode: 'SA5003',
    porttype: '平衡型',
    launchdate: '2020-10-15',
    netasset: 10000000,
    init: 10000000,
    add: 0,
    profit: 0,
    nav: 1.0,
    nav_acc: 1.0,
    cash: 1000000000,
    value: 0,
    fa: '彭传超',
  },
];

export default class PortfolioTable extends React.Component {
  state = {
    filteredInfo: {},
    sortedInfo: {
      columnKey: undefined,
      order: false,
    },
  };

  static contextType = PortfolioContext;

  // 按类型筛选
  filterType = (value: string, record: record) => {
    return record.porttype === value;
  };

  handleClick = (portcode: string) => {
    this.context.setPortCode(portcode);
    history.push(portcode + '/overview');
  };

  render() {
    let { sortedInfo, filteredInfo } = this.state;
    let columns: Array<Object> | [] = [
      {
        title: '产品代码',
        dataIndex: 'portcode',
        key: 'portcode',
        align: 'center',
      },
      {
        title: '产品类型',
        dataIndex: 'porttype',
        key: 'porttype',
        align: 'center',
        filters: [
          { text: '现金型', value: '现金型' },
          { text: '平衡型', value: '平衡型' },
        ],
        onFilter: this.filterType,
      },
      {
        title: '运作起始日',
        dataIndex: 'launchdate',
        key: 'launchdate',
        align: 'center',
        sorter: (a: record, b: record) => a.launchdate > b.launchdate,
      },
      {
        title: '净资产',
        dataIndex: 'netasset',
        key: 'netasset',
        align: 'right',
        render: (text: any, record: record) => numeralNum(record.netasset),
      },
      {
        title: '初始资产',
        dataIndex: 'init',
        key: 'init',
        align: 'right',
        render: (text: any, record: record) => numeralNum(record.init),
      },
      {
        title: '期间追加',
        dataIndex: 'add',
        key: 'add',
        align: 'right',
        render: (text: any, record: record) => numeralNum(record.add),
      },
      {
        title: '累计收益',
        dataIndex: 'profit',
        key: 'profit',
        align: 'right',
        render: (text: any, record: record) => numeralNum(record.profit),
      },
      {
        title: '单位净值',
        dataIndex: 'nav',
        key: 'nav',
        align: 'center',
        render: (text: string, record: record) => numeralNum(record.nav),
      },
      {
        title: '累计净值',
        dataIndex: 'nav_acc',
        key: 'nav_acc',
        align: 'center',
        render: (text: string, record: record) => numeralNum(record.nav_acc),
      },
      {
        title: '可用现金',
        dataIndex: 'cash',
        key: 'cash',
        align: 'right',
        render: (text: any, record: record) => numeralNum(record.cash),
      },
      {
        title: '盘中估值',
        dataIndex: 'value',
        key: 'value',
        align: 'right',
      },
      {
        title: 'FA',
        dataIndex: 'fa',
        key: 'fa',
        align: 'right',
      },
    ];
    return (
      <Table
        dataSource={dataSource}
        columns={columns}
        bordered
        pagination={false}
        size="small"
        className="table"
        onRow={(record: record) => {
          return {
            onClick: () => this.handleClick(record.portcode),
          };
        }}
      />
    );
  }
}
