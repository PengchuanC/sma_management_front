import React from 'react';
import moment from 'moment';
import { Row, Col, Statistic, Card, DatePicker, Table } from 'antd';
import styles from '@/pages/portfolio/glance/list.less';
import http from '@/common/http';

export default class CapitalAnalyze extends React.Component<any, any> {
  state: {
    total: { purchase?: number; ransom?: number };
    date: moment.Moment;
    detail: Array<any>;
  } = {
    total: {},
    date: moment(new Date()),
    detail: [],
  };

  fetchData = (date: moment.Moment | null) => {
    http
      .get('/basic/capital/', {
        params: { date: date?.format('YYYY-MM-DD') },
      })
      .then(r => {
        this.setState({
          total: r.total,
          date: moment(r.date),
          detail: r.detail,
        });
      });
  };

  onChange = (date: moment.Moment | null, dateString: string) => {
    this.fetchData(date);
  };

  componentDidMount() {
    this.fetchData(this.state.date);
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
        title: '组合代码',
        dataIndex: 'port_code',
        key: 'port_code',
        align: 'center',
      },
      {
        title: '组合名称',
        dataIndex: 'port_name',
        key: 'port_name',
        align: 'left',
      },
      {
        title: '交易类型',
        dataIndex: 'operation',
        key: 'operation',
        align: 'right',
      },
      {
        title: '交易数量(元/份)',
        dataIndex: 'operation_amount',
        key: 'operation_amount',
        align: 'right',
      },
    ];
    return (
      <>
        <DatePicker
          placeholder="修改日期"
          value={this.state.date}
          onChange={this.onChange}
        />
        <Row>
          <Col offset={1} span={4}>
            <Card className={styles.statisticCard}>
              <Statistic
                title="本日入金"
                value={this.state.total?.purchase || 0}
                precision={2}
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card className={styles.statisticCard}>
              <Statistic
                title="本日出金"
                value={this.state.total?.ransom || 0}
                precision={2}
              />
            </Card>
          </Col>
        </Row>
        <Row>
          <Col span={22} offset={1}>
            <Table
              className={styles.capitalTable}
              size="small"
              bordered
              columns={columns}
              dataSource={this.state.detail}
              pagination={false}
            />
          </Col>
        </Row>
      </>
    );
  }
}
