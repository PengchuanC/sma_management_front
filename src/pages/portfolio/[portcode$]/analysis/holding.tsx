import React from 'react';
import CustomDropdown, { dropdownType } from '@/common/dropdown';
import styles from './analysis.less'
import HoldingFund from '@/pages/portfolio/[portcode$]/analysis/holdingfund';
import HoldingStock from './holdingstock';


export default class Holding extends React.Component<any, any> {

  // 下拉菜单
  items: Array<dropdownType> = [
    {id: 0, name: '持股分析', comp: <HoldingStock portCode={this.props.portCode} />},
    {id: 1, name: '持基分析', comp: <HoldingFund portCode={this.props.portCode} />},
  ]

  render() {
    return (
      <div className={styles.holding}>
        <div className={styles.holdingDropdown}>
          <CustomDropdown items={this.items} className={styles.holdingDropdown} />
        </div>
      </div>
    );
  }
}
