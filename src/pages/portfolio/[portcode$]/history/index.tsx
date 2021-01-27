import React from 'react'
import moment from 'moment';
import 'moment/locale/zh-cn';
import BreadCrumb, { routes } from '@/common/breadcrumb';
import styles from './history.less';
import { Row, Col, Card, Statistic, Table } from 'antd';
import CustomDropdown, { dropdownType } from '@/common/dropdown';
import api from '@/common/http';
import HistoryTable from '@/pages/portfolio/[portcode$]/history/table';


const items: Array<dropdownType> = [
  // comp需要在子组件定制并引入到此处
  { id: 0, name: '交易明细', comp: <HistoryTable /> },
  // { id: 1, name: '调仓贡献', comp: <div>调仓贡献</div> },
]


export default class Overview extends React.Component<any, any> {
  routes: routes = [
    { name: '组合管理', route: '/portfolio' },
    { name: '投资历史', route: '/portfolio/:id/history' },
  ]

  render() {
    const {portcode} = this.props.match.params
    return (
      <>
        <div className={styles.breadcrumb}>
          <BreadCrumb routes={this.routes} />
        </div>
        <div className={styles.contentArea}>
          <HistoryLayout portCode={portcode} />
        </div>
      </>
    )
  }
}


class HistoryLayout extends React.Component<any, any>{
  state = {
    statistic: {
      total: {fee: 0, ratio: 0},
      last: {fee: 0, ratio: 0},
      date: ''
    }
  }

  fetchData = ()=>{
    const portCode = this.props.portCode
    api.get('/history/summary/', {params: {portCode: portCode, date: null}}).then(r=>{
      this.setState({statistic: r})
    })
  }

  componentDidMount() {
    this.fetchData()
  }

  render() {
    return (
      <>
        <Row>
          <Col offset={1}>
            <Card className={styles.statisticCard}>
              <Statistic title="最新调仓日期" value={moment(this.state.statistic.date).format('M月D日')} suffix={moment(this.state.statistic.date).year()} />
            </Card>
          </Col>
          <Col offset={1}>
            <Card className={styles.statisticCard}>
              <Statistic title="历史调仓总费用" value={this.state.statistic.total.fee} precision={2} />
            </Card>
          </Col>
          <Col>
            <Card className={styles.statisticCard}>
              <Statistic title="占基金资产比例" value={this.state.statistic.total.ratio * 100} suffix={'%'} precision={2} />
            </Card>
          </Col>
          <Col offset={1}>
            <Card className={styles.statisticCard}>
              <Statistic title="最近一次调仓费用" value={this.state.statistic.last.fee} precision={2} />
            </Card>
          </Col>
          <Col>
            <Card className={styles.statisticCard}>
              <Statistic title="占基金资产比例" value={this.state.statistic.last.ratio * 10000} suffix={'‱'} precision={2} />
            </Card>
          </Col>
        </Row>
        <CustomDropdown items={items} />
      </>
    );
  }
}
