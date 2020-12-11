import React from 'react';
import moment from 'moment';
import { Button, DatePicker, Dropdown, Menu } from 'antd';
import styles from '@/common/common.less';
import { DownOutlined } from '@ant-design/icons';
import { BacktestContext } from '@/common/localstorage';
import { basicUrl } from '@/common/http';

export interface dropdownType {
  id: number;
  name: string;
  comp: React.ComponentElement<any, any>;
}

export default class BackTestDropdown extends React.Component<any, any> {
  static contextType = BacktestContext;

  state = {
    active: 0,
    items: this.props.items,
    date: moment(new Date()),
  };

  onClick = (obj: any) => {
    const { key } = obj;
    const keyNum = Number(key);
    this.setState({ active: keyNum });
  };

  selectDate = (d: moment.Moment) => {
    this.context.setDate(d);
  };

  download = () => {
    switch (this.state.active) {
      case 0:
        window.location.href = basicUrl + '/backtest/download/';
        break;
      case 1:
        window.location.href = basicUrl + '/backtest/weight/download/';
        break;
      default:
        window.location.href = basicUrl + '/backtest/download/';
        break;
    }
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
        <div className={styles.dropdownWithDatePicker}>
          <div>
            <Dropdown
              overlay={menu}
              placement="bottomLeft"
              arrow
              className={styles.item}
            >
              <Button>
                {this.state.items[this.state.active].name}
                <DownOutlined />
              </Button>
            </Dropdown>
            <Button className={styles.item} onClick={this.download}>
              下载
            </Button>
          </div>
          <DatePicker
            className={styles.item}
            placeholder="回测截止日期"
            onSelect={this.selectDate}
          />
        </div>
        {this.state.items[this.state.active].comp}
      </>
    );
  }
}
