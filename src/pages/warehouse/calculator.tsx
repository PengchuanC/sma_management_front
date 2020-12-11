import React from 'react';
import {
  Row,
  Col,
  Card,
  Statistic,
  Select,
  Spin,
  Tag,
  Input,
  Table,
} from 'antd';
import debounce from 'lodash/debounce';
import moment from 'moment';
import numeral from 'numeral';
import http from '@/common/http';

import styles from '@/pages/warehouse/warehouse.less';

export default class Calculator extends React.Component<any, any> {
  fetchRansom = (ransom: number) => {
    http
      .get('/warehouse/ransom/', {
        params: {
          portCode: this.state.portfolio,
          secucode: this.state.fundInfo.fund,
          shares: ransom,
        },
      })
      .then(r => {
        this.setState({ ransom: r.fee });
      });
  };

  fetchPurchase = (purchase: number) => {
    http
      .get('/warehouse/purchase/', {
        params: { secucode: this.state.fundInfo.fund, money: purchase },
      })
      .then(r => {
        this.setState({ purchase: r.fee, ratio: r.ratio });
      });
  };

  state = {
    fundInfo: { fund: '', nav: 0, date: '', available: 0 },
    nav: 0,
    portfolio: '',
    ports: [],
    portfolioInfo: { cash: 0, shares: 0, date: '' },
    date: moment().format('ll'),
    purchase: null,
    ransom: null,
    ratio: null,
    fetchRansom: debounce(this.fetchRansom, 800),
    fetchPurchase: debounce(this.fetchPurchase, 800),
  };

  getFund = (fundInfo: {
    fund: string;
    nav: number;
    date: string;
    available: number;
  }) => {
    this.setState({ fundInfo: fundInfo });
  };

  // 获取全部组合
  fetchPortfolio = () => {
    http.get('/warehouse/portfolio/').then(r => {
      const data = r.data;
      this.setState({ ports: data });
    });
  };

  // 输入框是否可输入
  inputAvailable = () => {
    return !!this.state.portfolio && !!this.state.fundInfo.fund;
  };

  // 赎回
  onChange = (value: any) => {
    this.state.fetchRansom(value.target.value);
  };

  // 申购
  onChange2 = (value: any) => {
    this.state.fetchPurchase(value.target.value);
  };

  // 获取组合id
  onChange3 = (value: any) => {
    http
      .get('/warehouse/portfolio/cash/', { params: { portCode: value } })
      .then(r => {
        this.setState({ portfolio: value, portfolioInfo: r });
      });
  };

  componentDidMount() {
    this.fetchPortfolio();
  }

  render() {
    return (
      <>
        <Select
          placeholder="请选择组合"
          style={{ width: '200px' }}
          onChange={this.onChange3}
        >
          {this.state.ports.map(
            (e: { id: number; port_code: string; port_name: string }) => {
              return (
                <Option key={e.id} value={e.port_code}>
                  {e.port_name}
                </Option>
              );
            },
          )}
        </Select>
        <Row>
          <Col span={12}>
            <div className={styles.statisticWrapper}>
              <Card className={styles.statisticCard}>
                <Statistic
                  title="最新估值日期"
                  value={moment(this.state.portfolioInfo.date).format(
                    'MM月DD日',
                  )}
                />
              </Card>
              <Card className={styles.statisticCard}>
                <Statistic
                  title="当前可用现金"
                  value={this.state.portfolioInfo.cash}
                  precision={2}
                />
              </Card>
              <Card className={styles.statisticCard}>
                <Statistic
                  title="当前可用货基份额合计"
                  value={this.state.portfolioInfo.shares}
                  precision={2}
                />
              </Card>
            </div>
            <Card className={styles.calculator}>
              <UserRemoteSelect parent={this} />
              <div className={styles.itemWrapper}>
                <Tag color="#f50" className={styles.itemTitle}>
                  赎回计算器
                </Tag>
              </div>
              <div className={styles.itemWrapper}>
                <Tag className={styles.item}>拟赎回份额</Tag>
                <Input
                  size="small"
                  placeholder="0"
                  onChange={this.onChange}
                  className={styles.item}
                  disabled={!this.inputAvailable()}
                />
                <Input
                  disabled
                  defaultValue="0份可用"
                  value={`${numeral(this.state.fundInfo?.available).format(
                    '0,0.00',
                  )}份可用`}
                  size="small"
                  className={styles.itemWidder}
                />
              </div>
              <div className={styles.itemWrapper}>
                <Tag className={styles.item}>最新净值</Tag>
                <div className={styles.item}>
                  {numeral(this.state.fundInfo.nav).format('0.0000')}
                </div>
                <div className={styles.itemWidder}>
                  {moment(this.state.fundInfo.date).format('ll')}
                </div>
              </div>
              <div className={styles.itemWrapper}>
                <Tag className={styles.item}>费率预估</Tag>
                <div className={styles.result}>
                  {numeral(this.state.ransom).format('0,0.00元')}
                </div>
              </div>

              <div className={styles.itemWrapper}>
                <Tag color="#f50" className={styles.itemTitle}>
                  申购计算器
                </Tag>
              </div>
              <div className={styles.itemWrapper}>
                <Tag className={styles.item}>拟申购金额</Tag>
                <Input
                  size="small"
                  placeholder="0"
                  onChange={this.onChange2}
                  className={styles.item}
                  disabled={!this.inputAvailable()}
                />
              </div>
              <div className={styles.itemWrapper}>
                <Tag className={styles.item}>费率档位</Tag>
                <div className={styles.result}>
                  {formatFee(this.state.ratio || 0)}
                </div>
              </div>
              <div className={styles.itemWrapper}>
                <Tag className={styles.item}>费率预估</Tag>
                <div className={styles.result}>
                  {numeral(this.state.purchase).format('0,0.00元')}
                </div>
              </div>
            </Card>
          </Col>
          <Col span={12}>
            <TradingTable
              portCode={this.state.portfolio}
              secucode={this.state.fundInfo.fund}
            />
          </Col>
        </Row>
      </>
    );
  }
}

// 下拉框选择计算费率的基金
const { Option } = Select;

class UserRemoteSelect extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.fetchFund = debounce(this.fetchFund, 800);
  }

  state = {
    data: [],
    value: [],
    fetching: false,
    portCode: this.props.parent.state.portfolio,
  };

  fetchFund = (value: any) => {
    this.setState({ data: [], fetching: true });
    http
      .get('/warehouse/fundlist/', {
        params: { keyword: value, portCode: this.props.parent.state.portfolio },
      })
      .then(r => {
        let data = r.data.map((e: any) => {
          return {
            text: `${e.secucode}  ${e.secuname}`,
            value: e.secucode,
          };
        });
        this.setState({
          data,
          fetching: false,
          portCode: this.props.parent.state.portfolio,
        });
      });
  };

  handleChange = (value: any) => {
    http
      .get('/warehouse/fundnav/', {
        params: {
          secucode: value.value,
          portCode: this.props.parent.state.portfolio,
        },
      })
      .then(r => {
        this.setState({
          value,
          fetching: false,
        });
        this.props.parent.getFund(r);
      });
  };

  componentDidMount() {
    this.fetchFund(null);
  }
  componentDidUpdate(
    prevProps: Readonly<any>,
    prevState: Readonly<any>,
    snapshot?: any,
  ) {
    if (this.state.portCode != this.props.parent.state.portfolio) {
      this.fetchFund(null);
    }
  }

  render() {
    const { fetching, data, value } = this.state;
    return (
      <Select
        showSearch
        showArrow={false}
        labelInValue
        value={value}
        placeholder="请输入需要计算费率的基金"
        notFoundContent={fetching ? <Spin size="small" /> : null}
        filterOption={false}
        onSearch={this.fetchFund}
        onChange={this.handleChange}
        style={{ width: '50%' }}
      >
        {data.map((d: { value: number; text: string }, idx: number) => (
          <Option key={idx} value={d.value}>
            {d.text}
          </Option>
        ))}
      </Select>
    );
  }
}

function formatFee(value: number) {
  if (value > 1) {
    return numeral(value).format('0,00元');
  }
  return numeral(value).format('0.00%');
}

// 基金交易记录表格
class TradingTable extends React.Component<any, any> {
  state = {
    portCode: this.props.portCode,
    secucode: this.props.secucode,
    data: [],
  };

  fetchData = () => {
    if (!this.props.secucode || !this.props.portCode) {
      return;
    }
    http
      .get('/warehouse/history/', {
        params: {
          portCode: this.props.portCode,
          secucode: this.props.secucode,
        },
      })
      .then(r => {
        this.setState({
          data: r.data,
          portCode: this.props.portCode,
          secucode: this.props.secucode,
        });
      });
  };

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(
    prevProps: Readonly<any>,
    prevState: Readonly<any>,
    snapshot?: any,
  ) {
    if (
      this.state.portCode == this.props.portCode &&
      this.state.secucode == this.props.secucode
    ) {
      return;
    }
    this.fetchData();
  }

  render() {
    const columns: Array<Object> | undefined = [
      {
        title: '交易日期',
        dataIndex: 'date',
        key: 'date',
        align: 'center',
      },
      {
        title: '新增份额',
        dataIndex: 'buy_amount',
        key: 'buy_amount',
        align: 'center',
      },
      {
        title: '累计份额',
        dataIndex: 'amount',
        key: 'amount',
        align: 'center',
      },
      {
        title: '费率适用份额',
        dataIndex: 'available',
        key: 'available',
        align: 'center',
      },
      {
        title: '适用费率',
        dataIndex: 'fee',
        key: 'fee',
        align: 'center',
        render: (text: string, record: { fee: number }) =>
          formatFee(record.fee),
      },
    ];

    return (
      <Table
        size="small"
        sticky
        bordered
        columns={columns}
        pagination={{
          defaultPageSize: 15,
          pageSizeOptions: ['20', '25', '50', '100', '200'],
        }}
        dataSource={this.state.data}
      />
    );
  }
}
