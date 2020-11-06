import React from 'react'
import BreadCrumb, { routes } from '@/common/breadcrumb';
import styles from '@/pages/portfolio/glance/list.less';
import { PortfolioContext } from '@/common/localstorage';


export default class Overview extends React.Component<any, any> {
  routes: routes = [
    { name: '组合管理', route: '/portfolio' },
    { name: '投资分析', route: '/portfolio/:id/analysis' },
  ]

  static contextType = PortfolioContext

  render() {
    const {portcode} = this.props.match.params
    return (
      <>
          <div className={styles.breadcrumb}>
            <BreadCrumb routes={this.routes} />
          </div>
          <div className={styles.contentArea}>
            <div>{portcode}</div>
          </div>
      </>
    )
  }
}
