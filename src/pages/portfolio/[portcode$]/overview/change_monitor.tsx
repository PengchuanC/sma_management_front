import React from 'react';
import { Spin } from 'antd';
import echarts from 'echarts';
import { basicSocket } from '@/common/http';
import styles from './overiew.less';


export default class ChangeMonitorChart extends React.Component<any, any> {

  ref: React.RefObject<any> = React.createRef()

  state: {data: Array<changeType>, ws: WebSocket} ={
    data: [],
    ws: new WebSocket(basicSocket+'/prevaluation/')
  }

  socketClient = () =>{
    let ws = this.state.ws
    ws.onopen = () => ws.send(this.props.portCode)
    ws.onmessage = e => {
      let data = this.state.data
      let r = JSON.parse(e.data)
      if (!!r) {
        data.push(...r)
        this.setState({data: data})
        this.showChart(data)
      }
    }
  }

  showChart = (data: Array<changeType>) => {
    showChangeChart(data, this.ref.current)
  }

  componentDidMount() {
    this.socketClient()
  }

  componentWillUnmount() {
    this.state.ws.close()
  }

  render() {
    return (
      <div className={styles.chartWrapper}>
        {this.state.data.length > 0?
          <div className={styles.chart} ref={this.ref} />:
          <Spin className={styles.chart} style={{paddingTop: '120px'}}/>
        }
      </div>
    );
  }
}

export function showChangeChart(data: Array<changeType>, ref: any) {
  const chart: echarts.ECharts = echarts.init(ref);
  let options: echarts.EChartOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        animation: false
      },
      formatter: (params: any, ticket: string, callback: any) => {
        let obj = params[0]
        return `${obj.data[0]}: ${(obj.data[1] * 100).toFixed(2)}%`
      }
    },
    grid: {
      left: 60,
      top: 40,
      bottom: 30,
      right: 20
    },
    legend: {
      show: true,
      icon: 'line',
      top: 10
    },
    textStyle: {
      fontSize: 12
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      splitLine: {
        show: false
      },
    },
    yAxis: {
      type: 'value',
      splitLine: {
        show: false
      },
      nameLocation: 'end',
      scale: true,
      axisLabel: {
        formatter: (value: number) => {
          return (value * 100 ).toFixed(2) + '%'
        }
      }
    },
    series: [
      {
        type: 'line',
        data: data.map(e=>[e.name, e.value]),
        name: '涨跌幅'
      }
    ]
  }
  chart.setOption(options);
}

