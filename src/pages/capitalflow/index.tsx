import React from 'react';
import BreadCrumb, { routes } from '@/common/breadcrumb';
import CustomDropdown, { dropdownType } from '@/common/dropdown';
import styles from './capitaflow.less';
import Industry from '@/pages/capitalflow/industry';

const breads: routes = [
  {
    name: '资金流向',
    route: '/capitalflow',
  },
];

const dropdownItems: Array<dropdownType> = [
  { id: 0, name: '行业流向', comp: <Industry /> },
  { id: 1, name: '整体概览', comp: <div>概览</div> },
];

export default class CapitalFlow extends React.Component<any, any> {
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
