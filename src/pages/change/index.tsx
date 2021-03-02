/**基金盘中估值*/

import React from 'react';
import BreadCrumb, { routes } from '@/common/breadcrumb';
import styles from './change.less';
import { Col, Row, Button, Table, Spin } from 'antd';
import { showChangeChart } from '@/pages/portfolio/[portcode$]/overview/change_monitor';
import { basicSocket } from '@/common/http';
import { formatPercent } from '@/common/util';

const breads: routes = [
  {
    name: '盘中估值',
    route: '/change',
  },
];

const windowHeight = window.innerHeight - 230;

export default class RealTimeChange extends React.Component<any, any> {
  ref: React.RefObject<any> = React.createRef();
  bulkWs = new WebSocket(basicSocket + '/funds/');
  singleWs = new WebSocket(basicSocket + '/fund/');

  state = {
    data: [],
    single: [],
    selected: '基金走势',
  };

  // 获取全部基金估值
  socketClient = () => {
    let ws = this.bulkWs;
    ws.onopen = () => ws.send(this.props.portCode);
    ws.onmessage = e => {
      let r = JSON.parse(e.data);
      if (!!r) {
        this.setState({ data: r });
      }
    };
  };

  // 选择基金后开始获取单只基金数据
  onClick = (record: rowType) => {
    this.singleWs.close();
    this.singleWs = new WebSocket(basicSocket + '/fund/');
    this.setState({ single: [] });
    let ws = this.singleWs;
    ws.onopen = () => ws.send(record.secucode);
    ws.onmessage = e => {
      let data: any = this.state.single;
      let r = JSON.parse(e.data);
      if (!!r) {
        data.push(...r);
        this.setState({ single: data, selected: record.secuname });
        this.showChart(data);
      }
    };
  };

  showChart = (data: Array<changeType>) => {
    showChangeChart(data, this.ref.current);
  };

  componentDidMount() {
    this.socketClient();
  }

  componentWillUnmount() {
    this.bulkWs.close();
  }

  render() {
    let columns: Array<Object> | [] = [
      {
        title: '序号',
        dataIndex: 'key',
        key: 'key',
        align: 'center',
        width: 80,
      },
      {
        title: '基金代码',
        dataIndex: 'secucode',
        key: 'secucode',
        align: 'center',
      },
      {
        title: '基金名称',
        dataIndex: 'secuname',
        key: 'secuname',
        align: 'left',
      },
      {
        title: '是否持有',
        dataIndex: 'hold',
        key: 'hold',
        align: 'center',
        sorter: (a: rowType, b: rowType) => (a.hold >= b.hold ? 1 : -1),
        filters: [
          { text: '持有', value: '是' },
          { text: '未持有', value: '否' },
        ],
        onFilter: (value: string, record: rowType) => {
          return record.hold === value;
        },
      },
      {
        title: '实时估值',
        dataIndex: 'value',
        key: 'value',
        align: 'right',
        sorter: (a: rowType, b: rowType) => {
          return a.value - b.value;
        },
        render: (text: any, record: rowType) => (
          <>
            {record.value > 0 ? (
              <p className={styles.changeUp}>{formatPercent(record.value)}</p>
            ) : (
              <p className={styles.changeDown}>{formatPercent(record.value)}</p>
            )}
          </>
        ),
      },
    ];
    return (
      <>
        <BreadCrumb routes={breads} />
        <div className={styles.contentArea}>
          <Row>
            <Col span={10}>
              <Button>盘中估值</Button>
              <Table
                columns={columns}
                dataSource={this.state.data}
                bordered
                sticky
                scroll={{ scrollToFirstRowOnChange: true, y: windowHeight }}
                size="small"
                pagination={{
                  defaultPageSize: 20,
                  pageSizeOptions: ['15', '30', '50', '100', '200'],
                }}
                onRow={(record: rowType) => {
                  return {
                    onClick: () => this.onClick(record),
                  };
                }}
              />
            </Col>
            <Col span={14}>
              <Button>{this.state.selected}</Button>
              <div className={styles.chartWrapper}>
                {this.state.single.length > 0 ? (
                  <div className={styles.chart} ref={this.ref} />
                ) : (
                  <Spin
                    className={styles.chart}
                    style={{ paddingTop: '140px' }}
                  />
                )}
              </div>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}
