import React from 'react';
import http from '@/common/http';
import styles from './overiew.less';
import { formatPercent } from '@/common/util';


export default class ValueHistory extends React.Component<any, any> {

  state = {
    data: [],
    data2: [],
    data3: [],
  }

  fetchData = ()=>{
    http.get('/overview/compare/', {params:{portCode: this.props.portCode}}).then(r=>{
      let data = r.data
      let l = data.length
      this.setState({data: data.slice(l-7, l), data2: data.slice(l-14, l-7), data3: data.slice(l-21, l-14)})
      console.log(r.data)
    })
  }

  componentDidMount() {
    this.fetchData()
  }

  render() {
    return (
      <div className={styles.chartWrapper}>
        <div className={styles.chart}>
          {[this.state.data, this.state.data2, this.state.data3].map((data)=>{
            return data.length !=0 ?(
              <table className={styles.historyTable}>
                <thead>
                <tr>
                  <th className={styles.leftHead}>日期</th>
                  {data.map((x: any)=><th>{x.date}</th>)}
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td className={styles.leftHead}>实际</td>
                  {data.map((x: any)=><td>{formatPercent(x.change_pct)}</td>)}
                </tr>
                <tr>
                  <td className={styles.leftHead}>估算</td>
                  {data.map((x: any)=><td>{formatPercent(x.value)}</td>)}
                </tr>
                </tbody>
              </table>
            ): <></>
          })}
        </div>
      </div>
    );
  }
}
