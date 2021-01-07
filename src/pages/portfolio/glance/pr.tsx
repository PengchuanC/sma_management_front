/*
 * title: 客户申赎记录
 * */

import React from 'react';
import { Button, Table, Divider, message } from 'antd';
import styles from './list.less';
import http from '@/common/http';
import { CheckCircleOutlined } from '@ant-design/icons';

// Table row dataType
interface rowType {
  id?: number;
  purchase_amount?: number;
  ransom_share?: number;
  p_open_date?: string;
  r_open_date?: string;
  p_confirm?: string;
  r_confirm?: string;
  should_pay?: number;
  finish?: boolean;
}

// Table column
let columns: any = [
  {
    title: '序号',
    align: 'center',
    render: (text: string, record: rowType, index: number) => `${index + 1}`,
  },
  {
    title: '组合代码',
    key: 'port_code',
    dataIndex: 'port_code',
    align: 'left',
  },
  {
    title: '申购金额',
    key: 'purchase',
    dataIndex: 'purchase_amount',
    align: 'right',
  },
  {
    title: '赎回份额',
    key: 'ransom',
    dataIndex: 'ransom_share',
    align: 'right',
  },
  {
    title: '申购开放日',
    key: 'p_open_date',
    dataIndex: 'p_open_date',
    align: 'center',
  },
  {
    title: '赎回开放日',
    key: 'r_open_date',
    dataIndex: 'r_open_date',
    align: 'center',
  },
  {
    title: '申购确认日',
    key: 'p_confirm',
    dataIndex: 'p_confirm',
    align: 'center',
    render: (text: any, row: rowType) =>
      row.p_confirm ? `T+${row.p_confirm}` : null,
  },
  {
    title: '赎回确认日',
    key: 'r_confirm',
    dataIndex: 'r_confirm',
    align: 'center',
    render: (text: any, row: rowType) =>
      row.r_confirm ? `T+${row.r_confirm}` : null,
  },
  {
    title: '应付赎回款(预估)',
    key: 'should_pay',
    dataIndex: 'should_pay',
    align: 'right',
  },
];

export default class PurchaseAndRansom extends React.Component<any, any> {
  state = {
    uncompleted: [],
    completed: [],
  };

  fetchUncompleted = () => {
    http.get('/basic/pr/').then(r => {
      this.setState({ uncompleted: r.uncompleted, completed: r.completed });
    });
  };

  updateUncompleted = (idx: number) => {
    http.put('/basic/pr/', { params: { id: idx } }).catch(err => {
      message.error('当前申赎记录无法标记为已完成');
      return;
    });
  };

  markFinish = (idx: number) => {
    let uncompleted: any = [...this.state.uncompleted];
    let completed: any = [...this.state.completed];
    let del = uncompleted.splice(idx, 1);
    let id = del[0].id;
    this.updateUncompleted(id);
    completed = completed.concat(del);
    this.setState({ uncompleted: uncompleted, completed: completed });
  };

  componentDidMount() {
    this.fetchUncompleted();
  }

  render() {
    let action: any = [
      {
        title: '操作',
        key: 'mark',
        align: 'center',
        render: (text: any, row: rowType, idx: number) => (
          <Button
            size="small"
            type="text"
            shape="circle"
            icon={<CheckCircleOutlined />}
            onClick={() => this.markFinish(idx)}
          />
        ),
      },
    ];
    return (
      <div className={styles.pr}>
        <Button className={styles.button}>进行中</Button>
        <Table
          bordered
          size="small"
          columns={columns.concat(action)}
          dataSource={this.state.uncompleted}
        />
        <Divider />
        <Button className={styles.button}>已完成</Button>
        <Table
          bordered
          size="small"
          columns={columns}
          dataSource={this.state.completed}
        />
      </div>
    );
  }
}
