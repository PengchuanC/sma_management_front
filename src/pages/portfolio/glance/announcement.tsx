import React from 'react';
import { Card, List, Modal } from 'antd';
import styles from './list.less';
import http from '@/common/http';
import moment from 'moment';
import { ExpandOutlined } from '@ant-design/icons';
import { history } from 'umi';

/*
 * 基金公告
 * */

interface announceType {
  id: number;
  title: string;
  secucode: string;
  secuabbr: string;
  date: string;
}

export default class Announcement extends React.Component<any, any> {
  state: {
    data: Array<announceType>;
    content: string;
    visible: boolean;
  } = {
    data: [],
    content: '',
    visible: false,
  };

  fetchData = () => {
    http.get('/basic/announcement/', { params: { num: 6 } }).then(r => {
      this.setState({ data: r });
    });
  };

  onClick = () => {
    history.push('/announcement');
  };

  setUnVisible = () => {
    this.setState({ visible: false });
  };
  showContent = (id: number) => {
    http.post('/basic/announcement/', { data: { id: id } }).then(r => {
      this.setState({ visible: true, content: r });
    });
  };

  componentDidMount() {
    this.fetchData();
  }

  render() {
    return (
      <div className={styles.announcement}>
        <Card
          headStyle={{
            fontSize: '14px',
            padding: '0 20px',
            backgroundColor: '#fafafa',
          }}
          bodyStyle={{ padding: '0 10px' }}
          title="基金公告"
          size="small"
          extra={
            <ExpandOutlined
              className={styles.expanded}
              onClick={this.onClick}
            />
          }
        >
          <List size="small" item-layout="vertical">
            {this.state.data.map((e, i) => {
              return (
                <List.Item
                  key={i}
                  className={styles.listItem}
                  onClick={() => {
                    this.showContent(e.id);
                  }}
                >
                  <List.Item.Meta
                    title={e.title}
                    description={`${moment(e.date).format('ll')}   ${
                      e.secuabbr
                    }`}
                  />
                </List.Item>
              );
            })}
          </List>
        </Card>
        <Modal
          title={false}
          centered
          visible={this.state.visible}
          onOk={() => this.setUnVisible()}
          onCancel={() => this.setUnVisible()}
          width={1000}
        >
          {this.state.content.split('\n').map((e, i) => {
            return (
              <p key={i} className={styles.announceContent}>
                {e}
              </p>
            );
          })}
        </Modal>
      </div>
    );
  }
}
