import React from 'react';
import { Table } from 'antd'
import styles from '@/pages/portfolio/[portcode$]/history/history.less';
import api from '@/common/http';
import { PortfolioContext } from '@/common/localstorage';
import { numeralNum } from '@/common/util';

interface dataType {
  date: string,
  secucode: string,
  secuname: string,
  operation: string,
  amount: number,
  cap: number,
  price: number,
  fee: number

}


export default class HistoryTable extends React.Component<any, any> {
  static contextType = PortfolioContext

  state: {portCode: string, data: Array<dataType>, filter: {operation: Array<string>, name: Array<string>, date: Array<string>}} = {
    portCode: this.context.portCode,
    data: [],
    filter: {
      operation: [],
      name: [],
      date: []
    }
  }

  fetchData =()=>{
    api.post('/history/summary/', {data: {portCode: this.state.portCode}}).then(r=>{
      this.setState({data: r.data, filter: r.filter})
    })
  }

  componentDidMount() {
    const portCode = this.context.portCode
    this.setState({portCode: this.context.portCode})
    this.fetchData()
  }

  render() {
    const columns: Array<Object> | [] = [
      {
        title: '序号',
        align: 'center',
        render:(text: string, record: dataType, index: number)=>`${index+1}`,
      },
      {
        title: '交易日期',
        dataIndex: 'date',
        key: 'date',
        align: 'center',
        sorter: (a: dataType, b: dataType) => a.date > b.date,
        filters: this.state.filter.date,
        onFilter: (value: string, record: dataType) => value === record.date
      },
      {
        title: '基金代码',
        dataIndex: 'secucode',
        key: 'secucode',
        align: 'center',
      },
      {
        title: '基金简称',
        dataIndex: 'secuname',
        key: 'secuname',
        align: 'left',
        filters: this.state.filter.name,
        onFilter: (value: string, record: dataType) => value === record.secuname,
      },
      {
        title: '交易方向',
        dataIndex: 'operation',
        key: 'operation',
        align: 'center',
        filters: this.state.filter.operation,
        onFilter: (value: string, record: dataType) => value === record.operation,
      },
      {
        title: '交易金额(元)',
        dataIndex: 'cap',
        key: 'cap',
        align: 'right',
        render: (text: any, record: dataType) => numeralNum(record.cap),
      },
      {
        title: '交易数量(份)',
        dataIndex: 'amount',
        key: 'amount',
        align: 'right',
        render: (text: any, record: dataType) => numeralNum(record.amount),
      },
      {
        title: '交易价格(元)',
        dataIndex: 'price',
        key: 'price',
        align: 'right',
        render: (text: any, record: dataType) => record.price.toFixed(4),
      },
      {
        title: '交易费用(元)',
        dataIndex: 'fee',
        key: 'fee',
        align: 'right',
        render: (text: any, record: dataType) => numeralNum(record.fee),
      },
    ]
    return (
      <Table
        bordered size='small' sticky className={styles.historyTable}
        columns={columns}
        pagination={{defaultPageSize: 15, pageSizeOptions: ['20', '25', '50', '100', '200']}}
        dataSource={this.state.data}
      />
    );
  }
}
