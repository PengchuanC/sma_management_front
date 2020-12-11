import React from 'react';
import { Table, Switch, Button } from 'antd';
import styles from './allocate.less';
import { formatPercent } from '@/common/util';
import http, { basicUrl } from '@/common/http';

const windowHeight = window.innerHeight - 64 - 30 - 46 - 40 - 50 + 'px';

export default class Weight extends React.Component<any, any> {
  state: { smooth: boolean; data: Array<weightType> } = {
    smooth: true,
    data: [],
  };

  fetchData = (smooth: boolean) => {
    http
      .get('/backtest/weight/', {
        params: { smooth: smooth ? 1 : null },
      })
      .then(r => {
        this.setState({ data: r });
      });
  };

  change = (e: boolean) => {
    this.setState({ smooth: e });
    this.fetchData(e);
  };

  componentDidMount() {
    this.fetchData(true);
  }

  render() {
    const columns: Array<Object> | [] = [
      {
        title: '序号',
        dataIndex: 'key',
        key: 'key',
        align: 'center',
      },
      {
        title: '日期',
        dataIndex: 'date',
        key: 'date',
        align: 'center',
        sorter: (a: weightType, b: weightType) => {
          if (a.date > b.date) return 1;
          else return -1;
        },
      },
      {
        title: '目标风险',
        dataIndex: 'target_risk',
        key: 'target_risk',
        align: 'center',
        filters: [
          { text: '0.02', value: 0.02 },
          { text: '0.05', value: 0.05 },
          { text: '0.10', value: 0.1 },
          { text: '0.15', value: 0.15 },
          { text: '0.18', value: 0.18 },
        ],
        onFilter: (value: number, record: weightType) =>
          value === record.target_risk,
      },
      {
        title: '股指限制',
        dataIndex: 'equity_bound_limit',
        key: 'equity_bound_limit',
        align: 'center',
      },
      {
        title: '沪深300',
        dataIndex: 'hs300',
        key: 'hs300',
        align: 'center',
        render: (text: any, r: weightType) => formatPercent(r.hs300),
      },
      {
        title: '总财富',
        dataIndex: 'zcf',
        key: 'zcf',
        align: 'center',
        render: (text: any, r: weightType) => formatPercent(r.zcf),
      },
      {
        title: '企业债',
        dataIndex: 'qyz',
        key: 'qyz',
        align: 'center',
        render: (text: any, r: weightType) => formatPercent(r.qyz),
      },
      {
        title: '货币基金',
        dataIndex: 'hb',
        key: 'hb',
        align: 'center',
        render: (text: any, r: weightType) => formatPercent(r.hb),
      },
      {
        title: '中证500',
        dataIndex: 'zz500',
        key: 'zz500',
        align: 'center',
        render: (text: any, r: weightType) => formatPercent(r.zz500),
      },
      {
        title: '上海金现',
        dataIndex: 'hj',
        key: 'hj',
        align: 'center',
        render: (text: any, r: weightType) => formatPercent(r.hj),
      },
      {
        title: '中证转债',
        dataIndex: 'zz',
        key: 'zz',
        align: 'center',
        render: (text: any, r: weightType) => formatPercent(r.zz),
      },
      {
        title: '恒生指数',
        dataIndex: 'hs',
        key: 'hs',
        align: 'center',
        render: (text: any, r: weightType) => formatPercent(r.hs),
      },
      {
        title: '权益',
        dataIndex: 'equity',
        key: 'equity',
        align: 'center',
        render: (text: any, r: weightType) => formatPercent(r.equity),
      },
      {
        title: '固收',
        dataIndex: 'bond',
        key: 'bond',
        align: 'center',
        render: (text: any, r: weightType) => formatPercent(r.bond),
      },
      {
        title: '另类',
        dataIndex: 'alter',
        key: 'alter',
        align: 'center',
        render: (text: any, r: weightType) => formatPercent(r.alter),
      },
      {
        title: '货币',
        dataIndex: 'cash',
        key: 'cash',
        align: 'center',
        render: (text: any, r: weightType) => formatPercent(r.cash),
      },
    ];
    return (
      <div className={styles.weight}>
        <div className={styles.toolbar}>
          <Switch
            className={styles.toolItem}
            checkedChildren="3年平滑"
            unCheckedChildren="非平滑"
            defaultChecked
            onChange={this.change}
          />
        </div>
        <Table
          className={styles.weightTable}
          style={{ maxHeight: windowHeight }}
          size="small"
          bordered
          columns={columns}
          dataSource={this.state.data}
          pagination={{
            defaultPageSize: 15,
            pageSizeOptions: ['10', '25', '50', '100', '200'],
          }}
        />
      </div>
    );
  }
}
