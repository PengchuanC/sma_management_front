/**
 * title: 组合概览
 */

import React from 'react';
import styles from './list.less';
import BreadCrumb, { routes } from '@/common/breadcrumb';
import { Statistic, Row, Col, Card } from 'antd';
import PortfolioTable from './table';
import api from '@/common/http';
import CustomDropdown, { dropdownType } from '@/common/dropdown';
import CapitalAnalyze from '@/pages/portfolio/glance/capital';
import Announcement from '@/pages/portfolio/glance/announcement';
import AccountAnalysis from '@/pages/portfolio/glance/account';
import PurchaseAndRansom from '@/pages/portfolio/glance/pr';

function PortfolioInfo() {
  return (
    <Row>
      <Col span={18}>
        <div>
          <PortfolioTable />
        </div>
      </Col>
      <Col span={6}>
        <Announcement />
      </Col>
    </Row>
  );
}

const items: Array<dropdownType> = [
  { id: 0, name: '组合信息', comp: <PortfolioInfo /> },
  { id: 1, name: '资金分析', comp: <CapitalAnalyze /> },
  { id: 2, name: '账户分析', comp: <AccountAnalysis /> },
  { id: 3, name: '申赎分析', comp: <PurchaseAndRansom /> },
];

export default class Glance extends React.Component<any, any> {
  routes: routes = [
    { name: '组合管理', route: '/portfolio' },
    { name: '首页概览', route: '/portfolio/glance' },
  ];

  state = {
    num: 0,
    total: 0,
    avg: 0,
    last: '',
  };

  fetchData() {
    api.get('/basic/all/').then(r => {
      this.setState({ num: r.num, total: r.total, avg: r.avg, last: r.last });
    });
  }

  componentDidMount() {
    this.fetchData();
  }

  render() {
    return (
      <div className={styles.layoutContent}>
        <div className={styles.breadcrumb}>
          <BreadCrumb routes={this.routes} />
        </div>
        <div className={styles.contentArea}>
          <Row>
            <Col offset={1} span={4}>
              <Card className={styles.statisticCard}>
                <Statistic title="账户总数" value={this.state.num} />
              </Card>
            </Col>
            <Col span={4}>
              <Card className={styles.statisticCard}>
                <Statistic
                  title="管理资产"
                  value={this.state.total}
                  precision={2}
                />
              </Card>
            </Col>
            <Col span={4}>
              <Card className={styles.statisticCard}>
                <Statistic
                  title="户均资产"
                  value={this.state.avg}
                  precision={2}
                />
              </Card>
            </Col>
            <Col span={4}>
              <Card className={styles.statisticCard}>
                <Statistic title="最新日期" value={this.state.last} />
              </Card>
            </Col>
          </Row>
          <CustomDropdown items={items} />
        </div>
      </div>
    );
  }
}
