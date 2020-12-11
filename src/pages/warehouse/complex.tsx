import React from 'react';
import {
  message,
  Input,
  Button,
  Select,
  Row,
  Col,
  Tag,
  Table,
  Space,
} from 'antd';
import http, { basicUrl } from '@/common/http';
import moment from 'moment';
import debounce from 'lodash/debounce';
import styles from './warehouse.less';
import { formatPercent, numeralNum } from '@/common/util';

const { Option } = Select;

export default class Complex extends React.Component<any, any> {
  ref = React.createRef();

  state = {
    portfolio: '',
    ports: [],
    date: moment().format('ll'),
    holding: [],
    sell: [],
    sell2: [],
    buy: { secuname: '', secucode: '', ratio: 0 },
    buy2: [],
    rise: 0,
    loading: false,
    showTable: false,
    result: [],
  };

  // 获取全部组合
  fetchPortfolio = () => {
    http.get('/warehouse/portfolio/').then(r => {
      const data = r.data;
      this.setState({ ports: data });
    });
  };

  // 选择组合
  selectPortfolio = (e: any) => {
    http
      .get('/warehouse/complex/holding/', { params: { portCode: e } })
      .then(r => {
        this.setState({ portfolio: e, holding: r.data });
      });
  };

  // 选择基金
  onSelectFund = (i: any) => {
    let sell: any = this.state.sell;
    let holding = this.state.holding;
    let t: any = holding[i];
    holding.splice(i, 1);
    let toAdd: any = {
      secucode: t.secucode,
      secuname: t.secuname,
      ratio: t.ratio,
      target: 0,
    };
    sell.push(toAdd);
    this.setState({ sell: sell, holding: holding });
  };

  // 第二种调仓方式选择转入的基金
  onSelectFund2 = (i: any) => {
    let buy: any = this.state.buy2;
    let holding = this.state.holding;
    let t: any = holding[i];
    holding.splice(i, 1);
    let toAdd: any = {
      secucode: t.secucode,
      secuname: t.secuname,
      ratio: t.ratio,
      target: 0,
    };
    buy.push(toAdd);
    this.setState({ buy2: buy, holding: holding });
  };

  // 第二种调仓方式选择转出的基金
  onSelectFundSell = (i: any) => {
    let sell: any = this.state.sell2;
    let holding = this.state.holding;
    let t: any = holding[i];
    holding.splice(i, 1);
    let toAdd: any = {
      secucode: t.secucode,
      secuname: t.secuname,
      ratio: t.ratio,
      target: 0,
    };
    sell.push(toAdd);
    this.setState({ sell2: sell, holding: holding });
  };

  // 检查输入转换比例是否超限
  check = (e: any, i: any) => {
    let sell: any = this.state.sell;
    let target = e.target.value;
    let ratio = sell[i].ratio;
    if (target > ratio * 100) {
      message.error('调整后的仓位超过了当前持仓，请重新设置');
      target = 0;
    }
    sell[i].target = target;
    this.setState({ sell: sell });
  };

  // 检查输入转换比例是否超限
  check2 = (e: any) => {
    let target = Number(e.target.value);
    this.setState({ rise: target });
  };

  onFinish = () => {
    if (this.state.sell.length == 0 || !this.state.buy.secucode) {
      message.error('转入转出基金设置不完整');
      return;
    }
    this.setState({ loading: true });
    http
      .post('/warehouse/complex/', {
        data: {
          portCode: this.state.portfolio,
          src: this.state.sell,
          dst: this.state.buy.secucode,
        },
      })
      .then(r => {
        this.setState({ loading: false, result: r, showTable: true });
      })
      .catch(() => this.setState({ loading: false }));
  };

  onFinish2 = () => {
    if (this.state.sell2.length == 0 || this.state.buy2.length == 0) {
      message.error('转入转出基金设置不完整');
      return;
    }
    this.setState({ loading: true });
    http
      .post('/warehouse/complex/bulk/', {
        data: {
          portCode: this.state.portfolio,
          src: this.state.sell2,
          dst: this.state.buy2,
          rise: this.state.rise,
        },
      })
      .then(r => {
        this.setState({ loading: false, result: r, showTable: true });
      })
      .catch(() => this.setState({ loading: false }));
  };

  onDownload = () => {
    window.location.href = basicUrl + '/warehouse/complex/download/';
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
          onChange={this.selectPortfolio}
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
        <Button className={styles.downloadButton} onClick={this.onDownload}>
          下载
        </Button>
        <Row className={styles.complex}>
          <Col span={12} className={styles.emulate}>
            <Tag color="#f50" className={styles.tag}>
              待转出基金
            </Tag>
            <Select
              placeholder={'请选择待转出基金'}
              onChange={i => {
                this.onSelectFund(i);
              }}
              className={styles.selectFund}
            >
              {(this.state.holding || []).map((item: any, i: number) => (
                <Option key={i} value={i}>
                  {`${item.secucode} | ${item.secuname}`}
                </Option>
              ))}
            </Select>
            {this.state.sell.map((e: any, i: number) => {
              return (
                <Row key={i} className={styles.selectedFundWrapper}>
                  <Col span={8}>
                    <Input
                      value={e.secuname}
                      disabled={true}
                      addonBefore="基金代码"
                    />
                  </Col>
                  <Col span={8}>
                    <Input
                      value={(e.ratio * 100).toFixed(4)}
                      disabled={true}
                      addonBefore="当前持仓"
                      addonAfter="%"
                      className={styles.selectedFund}
                    />
                  </Col>
                  <Col span={8}>
                    <Input
                      value={e.target}
                      addonBefore="目标持仓"
                      addonAfter="%"
                      className={styles.selectedFund}
                      onChange={event => this.check(event, i)}
                    />
                  </Col>
                </Row>
              );
            })}
            <Tag color="#f50" className={styles.tag}>
              待转入基金
            </Tag>
            <Select
              placeholder={'请选择待转出基金'}
              onChange={i => {
                this.setState({ buy: this.state.holding[Number(i)] });
              }}
              className={styles.selectFund}
            >
              {(this.state.holding || []).map((item: any, i: number) => (
                <Option key={i} value={i}>
                  {`${item.secucode} | ${item.secuname}`}
                </Option>
              ))}
            </Select>
            {this.state.buy.secuname ? (
              <Row className={styles.selectedFundWrapper}>
                <Col span={12}>
                  <Input
                    value={this.state.buy.secuname}
                    disabled={true}
                    addonBefore="基金代码"
                  />
                </Col>
                <Col span={12}>
                  <Input
                    value={(this.state.buy.ratio * 100).toFixed(4)}
                    disabled={true}
                    addonBefore="当前持仓"
                    addonAfter="%"
                    className={styles.selectedFund}
                  />
                </Col>
              </Row>
            ) : (
              <></>
            )}
            <div style={{ height: '42px' }} />
            <Button
              loading={this.state.loading}
              type="primary"
              htmlType="submit"
              onClick={this.onFinish}
              className={styles.submitButton}
            >
              提交
            </Button>
          </Col>

          {/*第二种调仓方式*/}
          <Col span={12} className={styles.emulate}>
            <Tag color="#f50" className={styles.tag}>
              待转入基金
            </Tag>
            <Select
              placeholder={'请选择待转入基金'}
              onChange={i => {
                this.onSelectFund2(i);
              }}
              className={styles.selectFund}
            >
              {(this.state.holding || []).map((item: any, i: number) => (
                <Option key={i} value={i}>
                  {`${item.secucode} | ${item.secuname}`}
                </Option>
              ))}
            </Select>
            {this.state.buy2.map((e: any, i: number) => {
              return (
                <Row key={i} className={styles.selectedFundWrapper}>
                  <Col span={12}>
                    <Input
                      value={e.secuname}
                      disabled={true}
                      addonBefore="基金代码"
                    />
                  </Col>
                  <Col span={12}>
                    <Input
                      value={(e.ratio * 100).toFixed(4)}
                      disabled={true}
                      addonBefore="当前持仓"
                      addonAfter="%"
                      className={styles.selectedFund}
                    />
                  </Col>
                </Row>
              );
            })}
            <Tag color="#f50" className={styles.tag}>
              待转出基金
            </Tag>
            <Select
              placeholder={'请选择待转出基金'}
              onChange={i => {
                this.onSelectFundSell(i);
              }}
              className={styles.selectFund}
            >
              {(this.state.holding || []).map((item: any, i: number) => (
                <Option key={i} value={i}>
                  {`${item.secucode} | ${item.secuname}`}
                </Option>
              ))}
            </Select>
            {this.state.sell2.map((e: any, i: number) => {
              return (
                <Row key={i} className={styles.selectedFundWrapper}>
                  <Col span={12}>
                    <Input
                      value={e.secuname}
                      disabled={true}
                      addonBefore="基金代码"
                    />
                  </Col>
                  <Col span={12}>
                    <Input
                      value={(e.ratio * 100).toFixed(4)}
                      disabled={true}
                      addonBefore="当前持仓"
                      addonAfter="%"
                      className={styles.selectedFund}
                    />
                  </Col>
                </Row>
              );
            })}
            <Input
              addonBefore="仓位提升"
              addonAfter="%"
              value={this.state.rise}
              className={styles.riseTo}
              onChange={this.check2}
            />
            <Button
              loading={this.state.loading}
              type="primary"
              htmlType="submit"
              onClick={this.onFinish2}
              className={styles.submitButton}
            >
              提交
            </Button>
          </Col>
        </Row>
        {this.state.showTable ? (
          <ChangeResult
            data={this.state.result}
            className={styles.resultTable}
          />
        ) : (
          <div />
        )}
      </>
    );
  }
}

// 调仓结果表格展示
class ChangeResult extends React.Component<any, any> {
  render() {
    const columns: Array<Object> | [] = [
      {
        title: '序号',
        dataIndex: 'key',
        key: 'key',
        align: 'center',
      },
      {
        title: '基金代码',
        dataIndex: 'secucode',
        key: 'secucode',
        align: 'center',
      },
      {
        title: '交易方向',
        dataIndex: 'operate',
        key: 'operate',
        align: 'center',
      },
      {
        title: '交易数量',
        dataIndex: 'amount',
        key: 'amount',
        align: 'right',
        render: (text: any, record: changeResultType) =>
          numeralNum(record.amount),
      },
      {
        title: '交易费用',
        dataIndex: 'fee',
        key: 'fee',
        align: 'right',
        render: (text: any, record: changeResultType) => numeralNum(record.fee),
      },
    ];
    return (
      <Table
        size={'small'}
        bordered
        columns={columns}
        pagination={false}
        style={{ marginTop: '10px' }}
        dataSource={this.props.data}
      />
    );
  }
}
