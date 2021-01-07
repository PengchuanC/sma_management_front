import React from 'react';
import { Table, Row, Col } from 'antd';
import { AnalysisTabContext } from '@/common/localstorage';
import { formatPercent } from '@/common/util';
import http from '@/common/http';
import style from '@/pages/portfolio/[portcode$]/analysis/analysis.less';
import { sum } from 'lodash';
import { Moment } from 'moment';


const windowHeight = window.innerHeight - 64 - 30 - 46 - 40 - 30  + 'px'


export default class HoldingStock extends React.Component<any, any> {

  static contextType = AnalysisTabContext

  state: {portCode: string, date: Moment, stock: Array<holdingStockType>, industry: Array<industryType>} = {
    portCode: this.props.portCode,
    date: this.context.date,
    stock: [],
    industry: []
  }

  fetchData = ()=>{
    http.get('/analysis/fundholding/stock/', {
      params: {portCode: this.state.portCode, date: this.state.date.format('YYYY-MM-DD')}
    }).then(r=>{
      this.setState({date: this.context.date, stock: r.stock, industry: r.industry})
    }).catch(e=>{
      console.log(e)
    })
  }

  componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any) {
    if (this.state.date.date() !== this.context.date.date()) {
      this.fetchData()
    }
  }

  componentDidMount() {
    this.fetchData()
  }

  render() {
    const columns: Array<Object> | [] = [
      {
        title: '序号',
        dataIndex: 'key',
        key: 'key',
        align: 'center',
      },
      {
        title: '股票代码',
        dataIndex: 'stockcode',
        key: 'stockcode',
        align: 'center',
      },
      {
        title: '股票名称',
        dataIndex: 'stockname',
        key: 'stockname',
        align: 'left',
      },
      {
        title: '占净值比',
        dataIndex: 'ratio',
        key: 'ratio',
        align: 'right',
        render: (text: any, record: holdingStockType) => formatPercent(record.ratio),
        sorter: (a: holdingStockType, b: holdingStockType) => a.ratio - b.ratio,
      },
      {
        title: '占净值比累计',
        dataIndex: 'ratio',
        key: 'ratio',
        align: 'right',
        render: (text: any, record: holdingStockType) => formatPercent(record.cumsum),
        sorter: (a: holdingStockType, b: holdingStockType) => a.cumsum - b.cumsum,
      },
      {
        title: '占权益比',
        dataIndex: 'ofnv',
        key: 'ofnv',
        align: 'right',
        render: (text: any, record: holdingStockType) => formatPercent(record.ofnv),
        sorter: (a: holdingStockType, b: holdingStockType) => a.ofnv - b.ofnv,
      },
      ]
    const columns2: Array<Object> | [] = [
      {
        title: '序号',
        dataIndex: 'key',
        key: 'key',
        align: 'center',
      },
      {
        title: '行业名称',
        dataIndex: 'firstindustryname',
        key: 'firstindustryname',
        align: 'left',
      },
      {
        title: '占净值比',
        dataIndex: 'ratio',
        key: 'ratio',
        align: 'right',
        render: (text: any, record: industryType) => formatPercent(record.ratio),
        sorter: (a: holdingStockType, b: holdingStockType) => a.ratio - b.ratio,
      },
      {
        title: '占权益市值比',
        dataIndex: 'ratioinequity',
        key: 'ratioinequity',
        align: 'right',
        render: (text: any, record: industryType) => formatPercent(record.ratioinequity),
      },
    ]
    return (
      <Row>
        <Col span={10}>
          <Table
            className={style.holdingFundTable}
            bordered
            size='small'
            columns={columns}
            dataSource={this.state.stock}
            pagination={{defaultPageSize: 30, pageSizeOptions: ['15', '30', '50', '100', '200']}}
            style={{maxHeight: windowHeight}}
          />
        </Col>
        <Col span={13} offset={1}>
          <Table
            className={style.holdingFundTable}
            bordered
            size='small'
            columns={columns2}
            dataSource={this.state.industry}
            pagination={false}
            style={{maxHeight: windowHeight}}
            summary={() => (
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} />
                <Table.Summary.Cell index={1}>合计</Table.Summary.Cell>
                <Table.Summary.Cell index={2} className={style.summaryRight}>{formatPercent(sum(this.state.industry.map(e=>e.ratio)))}</Table.Summary.Cell>
                <Table.Summary.Cell index={3} className={style.summaryRight}>{formatPercent(sum(this.state.industry.map(e=>e.ratioinequity)))}</Table.Summary.Cell>
              </Table.Summary.Row>
            )}
          />
        </Col>
      </Row>
    );
  }
}
