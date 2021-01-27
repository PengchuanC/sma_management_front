import React from 'react';
import { Button } from 'antd';
import BreadCrumb from '@/common/breadcrumb';
import { routes } from '@/common/breadcrumb';
import styles from './tools.less';
import moment from 'moment';

const breads: routes = [
  {
    name: '其他',
    route: '/tools',
  },
  {
    name: '数据同步',
    route: '/tools',
  },
];

export default class Tools extends React.Component<any, any> {
  state = {
    mock: [
      {
        title: '全部数据',
        last: '2020-01-21 19:53:26',
        description: '同步全部数据，包含组合、基金、指数和股票数据',
        suggestion: '建议次日开盘前手动同步',
        loading: false,
      },
      {
        title: '股票数据',
        last: '2020-01-21 19:53:26',
        description: '同步股票数据，包含涨跌幅、行业分类',
        suggestion: '建议次日开盘前手动同步',
        loading: false,
      },
      {
        title: '行业资金流向数据',
        last: '2021-01-20 19:53:26',
        description: '同步行业资金流向数据，包含个股资金流向，行业涨跌幅',
        suggestion: '建议当日17:00后同步',
        loading: false,
      },
    ],
  };

  render() {
    return (
      <>
        <BreadCrumb routes={breads} />
        <div className={styles.contentArea}>
          <div className={styles.tools}>
            {this.state.mock.map((x: any, idx) => {
              return (
                <ToolCard
                  key={idx}
                  title={x.title}
                  last={x.last}
                  description={x.description}
                  suggestion={x.suggestion}
                  loading={x.loading}
                />
              );
            })}
          </div>
        </div>
      </>
    );
  }
}

class ToolCard extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  state = {
    loading: false,
    last: '',
  };

  onClick = () => {
    this.setState({ loading: !this.state.loading, last: Date().toString() });
  };

  render() {
    return (
      <div className={styles.cardWrapper}>
        <div className={styles.cardTitle}>
          <h3>{this.props.title}</h3>
        </div>
        <div className={styles.cardBody}>
          <p>
            上次同步时间：{moment(this.state.last || this.props.last).fromNow()}
          </p>
          <p>功能描述：{this.props.description}</p>
          <p>建议：{this.props.suggestion}</p>
          <Button
            type="primary"
            danger
            block
            loading={this.state.loading}
            onClick={this.onClick}
          >
            同步
          </Button>
        </div>
      </div>
    );
  }
}
