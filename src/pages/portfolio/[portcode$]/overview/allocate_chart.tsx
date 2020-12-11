import React from 'react';
import echarts from 'echarts';
import http from '@/common/http';
import numeral from 'numeral';
import styles from './overiew.less';


export default class AllocateChart extends React.Component<any, any> {

  protected ref: React.RefObject<any> = React.createRef()

  private showChart = (data: Array<assetType>) => {
    const chart: echarts.ECharts = echarts.init(this.ref.current);
    let options: any = {
      tooltip: {
        trigger: 'item',
      },
      color: ['#900000','#c00000', '#D18484', '#E0B5B5'],
      textStyle: {
        fontSize: 12
      },
      title: {
        text: '单位：%',
        textStyle: {
          fontSize: 12,
          fontWeight: 'normal'
        }
      },
      grid: {
      },
      legend: {
        show: true,
        orient: 'vertical',
        left: 'right',
        top: 'center',
        fontSize: 10,
        textStyle: {
          align: 'left',
          lineHeight: 12,
          justifyItems: 'center'
        },
        itemWidth: 16,
        itemHeight: 12,
      },
      series: {
        type: 'pie',
        radius: ['35%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: 'inner',
          formatter: (index: any)=> numeral(index.value).format('0.00%')
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '15',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        center: ['35%', '50%'],
        data: data
      }
    }
    chart.setOption(options);
  }

  fetchData = ()=>{
    http.get('/overview/allocate/', {params: {portCode: this.props.portCode}}).then(r=>{
      this.showChart(r.data)
    })
  }

  public componentDidMount() {
    this.fetchData()
  }

  public render() {
    return (
      <div className={styles.chartWrapper}>
        <div className={styles.pieChartWrapper}>
          <div className={styles.pieChartFix}>
            <div className={styles.pieChart} ref={this.ref} />
          </div>
          <div className={styles.pieChartNotify}>
            <p>当前资产配置符合契约限制</p>
          </div>
        </div>
      </div>
    );
  }
}
