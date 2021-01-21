import React from 'react';
import { Table } from 'antd';
import './list.less';
import { history } from 'umi';
import { PortfolioContext } from '@/common/localstorage';
import api from '@/common/http';
import { numeralNum } from '@/common/util';

interface record {
  key: string;
  port_code: string;
  port_type: string;
  launch_date: string;
  last: string;
  net_asset: number;
  init_money: number;
  add: number;
  profit: number;
  nav: number;
  nav_acc: number;
  cash: number;
  value: number;
  fa: string;
}

export default class PortfolioTable extends React.Component {
  state = {
    filteredInfo: {},
    sortedInfo: {
      columnKey: undefined,
      order: false,
    },
    data: [],
  };

  fetchData() {
    api.get('/basic/all/').then(r => {
      this.setState({ data: r.data });
    });
  }

  static contextType = PortfolioContext;

  // 按类型筛选
  filterType = (value: string, record: record) => {
    return record.port_type === value;
  };

  handleClick = (portcode: string) => {
    this.context.setPortCode(portcode);
    localStorage.setItem('portCode', portcode);
    history.push(portcode + '/overview');
  };

  componentDidMount() {
    this.fetchData();
  }

  render() {
    let { sortedInfo, filteredInfo } = this.state;
    let columns: Array<Object> | [] = [
      {
        title: '产品代码',
        dataIndex: 'port_code',
        key: 'port_code',
        align: 'center',
      },
      {
        title: '产品类型',
        dataIndex: 'port_type',
        key: 'port_type',
        align: 'center',
        filters: [
          { text: '现金型', value: '现金型' },
          { text: '平衡型', value: '平衡型' },
        ],
        onFilter: this.filterType,
      },
      {
        title: '运作起始日',
        dataIndex: 'launch_date',
        key: 'launch_date',
        align: 'center',
        sorter: (a: record, b: record) => {
          if (a.launch_date > b.launch_date) return 1;
          else return -1;
        },
      },
      {
        title: '最新净值日',
        dataIndex: 'last',
        key: 'last',
        align: 'center',
      },
      {
        title: '净资产',
        dataIndex: 'net_asset',
        key: 'net_asset',
        align: 'right',
        render: (text: any, record: record) => numeralNum(record.net_asset),
      },
      {
        title: '初始资产',
        dataIndex: 'init_money',
        key: 'init_money',
        align: 'right',
        render: (text: any, record: record) => numeralNum(record.init_money),
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
        title: 'FA',
        dataIndex: 'fa',
        key: 'fa',
        align: 'right',
        render: (text: any, record: record) => record.fa,
      },
    ];
    return (
      <Table
        dataSource={this.state.data}
        columns={columns}
        bordered
        pagination={false}
        size="small"
        className="table"
        onRow={(record: record) => {
          return {
            onClick: () => this.handleClick(record.port_code),
          };
        }}
      />
    );
  }
}
