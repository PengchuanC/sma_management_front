/*
* title: 业绩归因
* desc: 包含风格分析、风格暴露和Brinson归因
* */

import React from 'react';
import { Card, Row, Col } from 'antd';
import styles from './analysis.less';
import { AnalysisTabContext } from '@/common/localstorage';
import echarts from 'echarts';
import http from '@/common/http';
import moment from 'moment';
import numeral from 'numeral';


const windowHeight = window.innerHeight - 64 - 30 - 46 - 40  + 'px'

export default class Attribute extends React.Component<any, any> {

  static contextType = AnalysisTabContext

  state = {
    portCode: this.props.portCode,
    date: this.context.date
  }

  componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any) {
    if (this.state.date !== this.context.date){
      this.setState({date: this.context.date})
    }
  }

  render() {
    return (
      <>
      <div className={styles.attribute} style={{height: windowHeight}}>
        <Row>
          <Col span={12}>
            <BrinsonCard portCode={this.state.portCode} date={this.state.date} />
          </Col>
          <Col span={12}>
            <StyleCard portCode={this.state.portCode} date={this.state.date} />
            <ExposureCard portCode={this.state.portCode} date={this.state.date} />
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <MovingVolatility portCode={this.state.portCode} date={this.state.date} />
          </Col>
        </Row>
      </div>
      </>
    );
  }
}


class StyleCard extends React.Component<any, any> {

  ref: React.RefObject<any> = React.createRef()

  showChart = (data: Array<styleType>) => {
    const chart: any = echarts.init(this.ref.current);
    let option = {
      grid: {
        show: false,
        top: 40,
        left: "10%",
        right: "5%",
        bottom: '10%'
      },
      tooltip : {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      legend: {
        data:['小盘价值','小盘成长','中盘价值','中盘成长','大盘价值','大盘成长','中证全债']
      },
      xAxis : [
        {
          type : 'category',
          boundaryGap : false,
          data : data.map(x=>x.date)
        }
      ],
      yAxis : [
        {
          type : 'value',
          max: 1,
          axisLabel: {
            formatter: (value: number) => {return numeral(value).format('0.%')}
          }
        }
      ],
      series : [
        {
          name:'小盘价值',
          type:'line',
          stack: '占比',
          areaStyle: {},
          data: data.map(x=>x.small_value),
          symbol: "circle"
        },
        {
          name:'小盘成长',
          type:'line',
          stack: '占比',
          areaStyle: {},
          data: data.map(x=>x.small_growth),
          symbol: "circle"
        },
        {
          name:'中盘价值',
          type:'line',
          stack: '占比',
          areaStyle: {},
          data: data.map(x=>x.mid_value),
          symbol: "circle"
        },
        {
          name:'中盘成长',
          type:'line',
          stack: '占比',
          areaStyle: {},
          data: data.map(x=>x.mid_growth),
          symbol: "circle"
        },
        {
          name:'大盘价值',
          type:'line',
          stack: '占比',
          areaStyle: {},
          data: data.map(x=>x.large_value),
          symbol: "circle"
        },
        {
          name:'大盘成长',
          type:'line',
          stack: '占比',
          areaStyle: {},
          data: data.map(x=>x.large_growth),
          symbol: "circle"
        },
        {
          name:'中证全债',
          type:'line',
          stack: '占比',
          areaStyle: {},
          data: data.map(x=>x.bond),
          symbol: "circle"
        },
      ]
    };
    chart.setOption(option);
  }

  componentDidMount() {
    http.get('/analysis/style/', {params:{portCode: this.props.portCode,date:  moment(this.props.date).format('YYYY-MM-DD')}}).then(r=>{
      this.showChart(r)
    })
  }

  render() {
    return (
      <Card
        title='风格分析'
        size={'small'}
        className={styles.card}
      >
        <div ref={this.ref} className={styles.chart} />
      </Card>
    );
  }
}


class ExposureCard extends React.Component<any, any> {

  ref: React.RefObject<any> = React.createRef()

  showChart = (data: {name: Array<string>, value: Array<number>}) => {
    const chart: any = echarts.init(this.ref.current);
    let option = {
      grid: {
        show: false,
        left: 0,
        right: 0,
        top: '5%',
        bottom: '5%',
        containLabel: true
      },
      tooltip : {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
          label: {
            backgroundColor: '#6a7985'
          },
        },
        formatter: function (params: any){
          let tar = params[0];
          return tar.name + '<br/>' + numeral(tar.value).format('0.00');
        }
      },
      xAxis: {
        type: 'category',
        axisTick: {
          alignWithLabel: true
        },
        data: data.name
      },
      yAxis: {
        splitLine: {
          show: false
        },
        type: 'value',
        axisLabel: {
          formatter: (v: number) => numeral(v).format('0.00')
        }
      },
      series: [{
        data: data.value,
        type: 'bar',
        label: {
          show: true,
          position: 'top',
          formatter: (v: any) => numeral(v.data).format('0.00'),
          color: 'black'
        },
        barWidth: '60%'
      }]
    };
    chart.setOption(option);
  }

  componentDidMount() {
    http.get('/analysis/expose/', {params:{portCode: this.props.portCode, date: moment(this.props.date).format('YYYY-MM-DD')}}).then(r=>{
      this.showChart(r)
    })
  }

  render() {
    return (
      <Card
        title='因子暴露'
        size={'small'}
        className={styles.card}
      >
        <div ref={this.ref} className={styles.chart} />
      </Card>
    );
  }
}


class BrinsonCard extends React.Component<any, any> {

  ref: React.RefObject<any> = React.createRef()

  showChart = (data: any) => {
    if (!!data) {
      return
    }
    let x1 = data.map((x: any)=>{return x.raa? x.raa.toFixed(4): 0});
    let max1 = Math.ceil(Math.max(...x1.map((x: any)=> {return Math.abs(x)}))*20)/20;
    let x2 = data.map((x: any)=>{return x.rss? x.rss.toFixed(4): 0});
    let max2 = Math.ceil(Math.max(...x2.map((x: any)=> {return Math.abs(x)}))*20)/20;
    let x3 = data.map((x: any)=>{return x.rin? x.rin.toFixed(4): 0});
    let max3 = Math.ceil(Math.max(...x3.map((x: any)=> {return Math.abs(x)}))*20)/20;
    let x4 = data.map((x: any)=>{return x.rtt? x.rtt.toFixed(4): 0});
    let max4 = Math.ceil(Math.max(...x4.map((x: any)=> {return Math.abs(x)}))*20)/20;
    let y = data.map((x: any)=>{return x.industry}).reverse();
    let myChart: any = echarts.init(this.ref.current);
    let option = {
      textStyle: {
        fontFamily: ['kaiti', 'Arial']
      },
      tooltip : {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      grid: [
        {x: '10%', y: '15%', width: '20%', height: '70%', show: false,},
        {x: '30%', y: '15%', width: '18%', height: '70%', show: false,},
        {x: '53%', y: '15%', width: '18%', height: '70%', show: false,},
        {x: '76%', y: '15%', width: '18%', height: '70%', show: false,}
      ],
      xAxis: [
        {gridIndex: 0, min: -max1, max: max1, splitLine:{show:false}},
        {gridIndex: 1, min: -max2, max: max2, splitLine:{show:false}},
        {gridIndex: 2, min: -max3, max: max3, splitLine:{show:false}},
        {gridIndex: 3, min: -max4, max: max4, splitLine:{show:false}}
      ],
      yAxis: [
        {
          gridIndex: 0,
          name: "资产配置(%)",
          type: "category",
          textStyle: {
            fontFamily: ['KaiTi', 'Arial']
          },
          data: y
        },
        {
          gridIndex: 1,
          name: "个股选择(%)",
          type: "category",
          axisLabel: {show: false},
          textStyle: {
            fontFamily: ['KaiTi', 'Arial']
          },
          data: y
        },
        {
          gridIndex: 2,
          name: "交互收益(%)",
          type: "category",
          axisLabel: {show: false},
          textStyle: {
            fontFamily: ['KaiTi', 'Arial']
          },
          data: y
        },
        {
          gridIndex: 3,
          name: "超额收益(%)",
          type: "category",
          axisLabel: {show: false},
          textStyle: {
            fontFamily: ['KaiTi', 'Arial']
          },
          data: y
        },
      ],
      series: [
        {
          type: 'bar',
          xAxisIndex: 0,
          yAxisIndex: 0,
          data: x1.reverse()
        },
        {
          type: 'bar',
          xAxisIndex: 1,
          yAxisIndex: 1,
          data: x2.reverse()
        },
        {
          type: 'bar',
          xAxisIndex: 2,
          yAxisIndex: 2,
          data: x3.reverse()
        },
        {
          type: 'bar',
          xAxisIndex: 3,
          yAxisIndex: 3,
          data: x4.reverse()
        },
      ]
    };
    myChart.setOption(option);
  }

  componentDidMount() {
    http.get('/analysis/brinson/', {params:{portCode: this.props.portCode,date:  moment(this.props.date).format('YYYY-MM-DD')}}).then(r=>{
      this.showChart(r)
    })
  }

  render() {
    return (
      <Card
      title='归因分析'
      size={'small'}
      className={styles.card2xHeight}
    >
      <div ref={this.ref} className={styles.chart2xHeight} />
    </Card>
  );
  }
}


class MovingVolatility extends React.Component<any, any> {
  ref: React.RefObject<any> = React.createRef()

  componentDidMount() {
    http.get(
      '/analysis/std/',
      {
        params:{portCode: this.props.portCode,
          date: moment(this.props.date).format('YYYY-MM-DD')
        }
      }).then(r=>{
        this.showChart(r)
    }).catch(e=>{
      console.log(e)
    })
  }

  showChart = (data: Array<{date: string, vol: number, downside_vol: number}>)=>{
    const chart: any = echarts.init(this.ref.current);
    let option = {
      tooltip: {
        trigger: 'item',
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
            return value.toFixed(1) + '%'
          }
        }
      },
      series: [
        {
          type: 'line',
          data: data.map(x=>x.vol),
          name: '波动率'
        },{
          type: 'line',
          data: data.map(x=>x.downside_vol),
          name: '下行波动率'
        }]
    }
    chart.setOption(option);
  }

  render() {
    return (
      <Card
        title='30日滚动年化波动率'
        size={'small'}
        className={styles.card}
      >
        <div ref={this.ref} className={styles.chart} />
      </Card>
    );
  }
}
