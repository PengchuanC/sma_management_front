import React from 'react';
import BreadCrumb, { routes } from '@/common/breadcrumb';
import CustomDropdown, { dropdownType } from '@/common/dropdown';
import styles from './warehouse.less';
import Calculator from './calculator';
import Complex from './complex';

const breads: routes = [
  {
    name: '调仓试算',
    route: '/warehouse',
  },
];

const dropdownItems: Array<dropdownType> = [
  { id: 0, name: '费用计算', comp: <Calculator /> },
  { id: 1, name: '调仓试算', comp: <Complex /> },
];

export default class WareHouse extends React.Component<any, any> {
  render() {
    return (
      <>
        <BreadCrumb routes={breads} />
        <div className={styles.contentArea}>
          <CustomDropdown items={dropdownItems} />
        </div>
      </>
    );
  }
}
