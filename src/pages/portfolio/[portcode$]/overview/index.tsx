import React from 'react';
import { Row, Col, Card } from 'antd';
import BreadCrumb, { routes } from '@/common/breadcrumb';
import styles from './overiew.less';
import { PortfolioContext } from '@/common/localstorage';
import NavChart from './nav_chart';
import AllocateChart, { AvgAllocate } from '@/pages/portfolio/[portcode$]/overview/allocate_chart';
import ChangeMonitorChart from '@/pages/portfolio/[portcode$]/overview/change_monitor';
import http from '@/common/http'


export default class Overview extends React.Component<any, any> {
  routes: routes = [
    { name: '组合管理', route: '/portfolio' },
    { name: '账户总览', route: '/portfolio/:id/overview' },
  ]

  state: {question: questionType} = {
    question: {}
  }

  static contextType = PortfolioContext

  componentDidMount() {
    let portCode = this.props.match.params.portcode
    http.get('/overview/questionnairy/', {
      params:{portCode: this.props.match.params.portcode}
    }).then(r=>{
      this.setState({question: r.data})
    })
  }

  render() {
    let { portcode } = this.props.match.params
    const q = this.state.question
    return (
      <>
        <div className={styles.breadcrumb}>
          <BreadCrumb routes={this.routes} />
        </div>
        <div className={styles.contentArea}>
          <Row>
            <Col span={14}>
              <div className={styles.rowArea}>
                <Card className={styles.titleCardWrapper} bordered={false}>
                  <div className={styles.titleCard}>穿透资产配置</div>
                </Card>
                <AllocateChart portCode={portcode}/>
              </div>
              <div className={styles.rowArea}>
                <Card className={styles.titleCardWrapper} bordered={false}>
                  <div className={styles.titleCard}>区间平均配置</div>
                </Card>
                <AvgAllocate portCode={portcode}/>
              </div>
              <div className={styles.rowArea}>
                <Card className={styles.titleCardWrapper} bordered={false}>
                  <div className={styles.titleCard}>盘中监控</div>
                </Card>
                <ChangeMonitorChart portCode={portcode} />
              </div>
              <div className={styles.rowArea}>
                <Card className={styles.titleCardWrapper} bordered={false}>
                  <div className={styles.titleCard}>历史净值</div>
                </Card>
                <NavChart portCode={portcode} />
              </div>
            </Col>
            <Col span={10} className={styles.rightArea}>
              <div className={styles.tableTitle}>客户测评主要信息</div>
              <p className={styles.tdHeader}>风险等级</p>
              <p className={styles.tdContent}>{q?.risk}</p>
              <p className={styles.tdHeader}>投资期限</p>
              <p className={styles.tdContent}>{q?.maturity}</p>
              <p className={styles.tdHeader}>目标收益</p>
              <p className={styles.tdContent}>{q?.arr}</p>
              <p className={styles.tdHeader}>目标风险</p>
              <p className={styles.tdContent}>{q?.volatility}</p>
              <p className={styles.tdHeader}>流动性要求</p>
              <p className={styles.tdContent}>{q?.fluidity}</p>
              <p className={styles.tdHeader}>年龄</p>
              <p className={styles.tdContent}>{q?.age}</p>
              <p className={styles.tdHeader}>投资经验</p>
              <p className={styles.tdContent}>{q?.experience}</p>
              <div className={styles.tableTitle}>特殊需求</div>
              <p className={styles.tdHeader}>近期大额资金支出计划</p>
              <p className={styles.tdContent}>{q?.plan}</p>
              <p className={styles.tdHeader}>回撤容忍度</p>
              <p className={styles.tdContent}>{q?.tolerance}</p>
              <p className={styles.tdHeader}>另类资产限制</p>
              <p className={styles.tdContent}>{q?.alter_limit}</p>
              <p className={styles.tdHeader}>跨境投资限制</p>
              <p className={styles.tdContent}>{q?.cross_border_limit}</p>
            </Col>
          </Row>
        </div>
      </>
    )
  }
}
