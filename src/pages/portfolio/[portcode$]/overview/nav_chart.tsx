import React from 'react';
import echarts from 'echarts';
import http from '@/common/http';
import styles from './overiew.less';


export default class NavChart extends React.Component<any, any> {

  ref: React.RefObject<any> = React.createRef()

  fetchData = ()=>{
    http.get('/overview/', {params:{portCode: this.props.portCode}}).then(r=>{
      this.showChart(r)
    })
  }

  showChart = (data: Array<navType>) => {
    const chart: echarts.ECharts = echarts.init(this.ref.current);
    let options: echarts.EChartOption = {
      tooltip: {
        trigger: 'item',
        position: function (pt) {
          return [pt[0], '10%'];
        }
      },
      grid: {
        left: 60,
        top: 40,
        bottom: 30,
        right: 20
      },
      legend : {
        show : true,
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
        data: data.map(x=>x.date),
      },
      yAxis: {
        type: 'value',
        splitLine: {
          show: false
        },
        nameLocation: 'end',
        scale: true,
        axisLabel: {
          formatter: (value: number)=>{
            return value.toFixed(4)
          }
        }
      },
      series: [
          {
            type: 'line',
            data: data.map(x=>x.p),
            name: '组合'
          },{
            type: 'line',
            name: '基准',
            data: data.map(x=>x.b)
          }
        ]
    }
    chart.setOption(options);
  }

  componentDidMount() {
    this.fetchData()
  }

  render() {
    return (
      <div className={styles.chartWrapper}>
        <div className={styles.chart} ref={this.ref} />
      </div>
    );
  }
}

