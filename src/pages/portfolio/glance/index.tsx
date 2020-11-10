/**
 * title: 组合概览
 */

import React from 'react';
import styles from './list.less';
import BreadCrumb, { routes } from '@/common/breadcrumb';
import { Statistic, Row, Col, Card, Dropdown, Menu, Button } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import PortfolioTable from './table';
import api from '@/common/http';

export class CustomDropdown extends React.Component<any, any> {
  state = {
    active: 0,
  };

  // 下拉菜单
  items = [
    { id: 0, name: '组合信息', comp: <PortfolioTable /> },
    { id: 1, name: '资金分析', comp: <div>资金分析</div> },
    { id: 2, name: '账户分析', comp: <div>账户分析</div> },
  ];

  onClick = (obj: any) => {
    const { key } = obj;
    this.setState({ active: key });
  };

  render() {
    const menu = (
      <Menu onClick={this.onClick}>
        {this.items.map(x => {
          return <Menu.Item key={x.id}>{x.name}</Menu.Item>;
        })}
      </Menu>
    );
    return (
      <>
        <Dropdown
          overlay={menu}
          placement="bottomLeft"
          arrow
          className={styles.dropdown}
        >
          <Button>
            {this.items[this.state.active].name}
            <DownOutlined />
          </Button>
        </Dropdown>
        {this.items[this.state.active].comp}
      </>
    );
  }
}

export default class Glance extends React.Component<any, any> {
  routes: routes = [
    { name: '组合管理', route: '/portfolio' },
    { name: '首页概览', route: '/portfolio/glance' },
  ];

  state = {
    num: 0,
    total: 0,
    avg: 0,
  };

  fetchData() {
    api.get('/basic/all/').then(r => {
      this.setState({ num: r.num, total: r.total, avg: r.avg });
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
          </Row>
          <CustomDropdown />
        </div>
      </div>
    );
  }
}
