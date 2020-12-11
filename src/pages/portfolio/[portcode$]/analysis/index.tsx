import React from 'react';
import { DatePicker, Tabs } from 'antd';
import BreadCrumb, { routes } from '@/common/breadcrumb';
import styles from './analysis.less';
import { AnalysisTabContext } from '@/common/localstorage';
import style from '@/pages/portfolio/[portcode$]/analysis/analysis.less';
import moment from 'moment';
import Performance from '@/pages/portfolio/[portcode$]/analysis/performance';
import Holding from '@/pages/portfolio/[portcode$]/analysis/holding';
import Attribute from '@/pages/portfolio/[portcode$]/analysis/attribute';


// 日期选择模块，利用context更新组件
class Operations extends React.Component {
  state = {
    selectedDate: moment(new Date())
  }

  onSelected = (e: moment.Moment) => {
    this.context.setDate(e)
    this.setState({
      selectedDate: e
    })
  }

  static contextType = AnalysisTabContext

  render() {
    return (
      <>
        <DatePicker
          className={style.datePicker}
          placeholder="设置截止日期"
          onSelect={this.onSelected}
        />
      </>
    )
  }
}

class AnalysisTabs extends React.Component<any, any> {

  // tab标签
  tabs = [
    {
      name: '业绩指标',
      comp: <Performance portCode={this.props.portCode} />
    },
    {
      name: '持仓分布',
      comp: <Holding portCode={this.props.portCode} />
    },
    {
      name: '业绩归因',
      comp: <Attribute portCode={this.props.portCode} />
    }
  ]

  setDate = (d: moment.Moment) => {
    this.setState({
      date: d
    })
  }

  state = {
    tabs: this.tabs,
    date: moment(new Date()),
    setDate: this.setDate
  }

  render() {
    return (
      <AnalysisTabContext.Provider value={this.state}>
      <Tabs defaultActiveKey="0" onChange={()=>{}} className={styles.analysisTab} tabBarExtraContent={<Operations />}>
        {this.state.tabs.map((tab: any, idx: number)=>{
          return (
            <Tabs.TabPane tab={tab.name} key={idx}>
              {tab.comp}
            </Tabs.TabPane>
          )
        })}
      </Tabs>
        </AnalysisTabContext.Provider>
    );
  }
}


export default class Overview extends React.Component<any, any> {
  routes: routes = [
    { name: '组合管理', route: '/portfolio' },
    { name: '投资分析', route: '/portfolio/:id/analysis' },
  ]

  render() {
    const {portcode} = this.props.match.params
    return (
      <>
          <div className={styles.breadcrumb}>
            <BreadCrumb routes={this.routes} />
          </div>
          <div className={styles.contentArea}>
            <AnalysisTabs portCode={portcode}/>
          </div>
      </>
    )
  }
}
