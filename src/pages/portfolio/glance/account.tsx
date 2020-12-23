import React from 'react';
import { Row, Col, Card } from 'antd';
import styles from './list.less';
import http from '@/common/http';
import echarts from 'echarts';

export default class AccountAnalysis extends React.Component<any, any> {
  ref1: React.RefObject<any> = React.createRef();
  ref2: React.RefObject<any> = React.createRef();

  fetchData = () => {
    http.get('/basic/quarter/').then(r => {
      this.drawAccount(r.data);
    });
    http.get('/basic/profit/').then(r => {
      this.drawProfit(r);
    });
  };

  drawAccount = (data: Array<accountChangeType>) => {
    const chart: echarts.ECharts = echarts.init(this.ref1.current);
    let option: echarts.EChartOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
        show: false,
      },
      legend: {
        top: '3%',
        show: true,
      },
      xAxis: [
        {
          type: 'category',
          data: data.map(e => e.date),
          axisTick: {
            alignWithLabel: true,
          },
          splitLine: {
            show: false,
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          splitLine: {
            show: false,
          },
        },
        {
          type: 'value',
          splitLine: {
            show: false,
          },
          minInterval: 1,
        },
      ],
      series: [
        {
          name: '账户资产',
          type: 'bar',
          barWidth: '20%',
          data: data.map(e => e.s),
        },
        {
          name: '账户个数',
          type: 'line',
          yAxisIndex: 1,
          data: data.map(e => e.c),
        },
      ],
    };
    chart.setOption(option);
  };

  drawProfit = (data: profitType) => {
    const chart: echarts.ECharts = echarts.init(this.ref2.current);
    let option: echarts.EChartOption = {
      tooltip: {},
      legend: {
        top: '3%',
        show: true,
      },
      series: [
        {
          name: '账户数量',
          type: 'pie',
          radius: ['25%', '45%'],
          label: {
            position: 'inner',
          },
          data: [
            { value: data.count.up, name: '浮盈' },
            { value: data.count.down, name: '浮亏' },
          ],
        },
        {
          name: '账户金额',
          type: 'pie',
          radius: ['46%', '65%'],
          data: [
            { value: data.profit.up, name: '浮盈' },
            { value: data.profit.down, name: '浮亏' },
          ],
        },
      ],
    };
    chart.setOption(option);
  };

  componentDidMount() {
    this.fetchData();
  }

  render() {
    return (
      <Row className={styles.accountContent}>
        <Col span={12}>
          <Card
            title={'账户分析'}
            className={styles.card}
            headStyle={{
              fontSize: '14px',
              padding: '0 20px',
              backgroundColor: '#fafafa',
            }}
            bodyStyle={{ padding: '0 10px', height: '300px' }}
            size="small"
          >
            <div ref={this.ref1} className={styles.chart} />
          </Card>
        </Col>
        <Col span={12}>
          <Card
            title={'盈亏分析'}
            className={styles.card}
            headStyle={{
              fontSize: '14px',
              padding: '0 20px',
              backgroundColor: '#fafafa',
            }}
            bodyStyle={{ padding: '0 10px', height: '300px' }}
            size="small"
          >
            <div ref={this.ref2} className={styles.chart} />
          </Card>
        </Col>
      </Row>
    );
  }
}
