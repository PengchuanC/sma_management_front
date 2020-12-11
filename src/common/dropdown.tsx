import React from 'react';
import { Button, Dropdown, Menu } from 'antd';
import styles from './common.less';
import { DownOutlined } from '@ant-design/icons';

export interface dropdownType {
  id: number;
  name: string;
  comp: React.ComponentElement<any, any>;
}

export default class CustomDropdown extends React.Component<any, any> {
  state = {
    active: 0,
    items: this.props.items,
  };

  onClick = (obj: any) => {
    const { key } = obj;
    this.setState({ active: key });
  };

  render() {
    const menu = (
      <Menu onClick={this.onClick}>
        {this.state.items.map((x: dropdownType) => {
          return <Menu.Item key={x.id}>{x.name}</Menu.Item>;
        })}
      </Menu>
    );
    return (
      <>
        <Dropdown
          overlay={menu}
          placement="bottomLeft"
          arrow
          className={styles.dropdown}
        >
          <Button>
            {this.state.items[this.state.active].name}
            <DownOutlined />
          </Button>
        </Dropdown>
        {this.state.items[this.state.active].comp}
      </>
    );
  }
}
