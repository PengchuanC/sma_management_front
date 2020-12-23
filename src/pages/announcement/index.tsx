import React from 'react';
import styles from './announcement.less';
import { Card, Button, List, Modal } from 'antd';
import { CompressOutlined } from '@ant-design/icons';
import { history } from 'umi';
import http from '@/common/http';
import moment from 'moment';

interface announceType {
  id: number;
  title: string;
  secucode: string;
  secuabbr: string;
  date: string;
}

export default class FullScreenAnnouncement extends React.Component<any, any> {
  state: {
    list: Array<announceType>;
    data: Array<announceType>;
    initLoading: boolean;
    loading: boolean;
    page: number;
    visible: boolean;
    content: string;
  } = {
    initLoading: true,
    loading: false,
    data: [],
    list: [],
    page: 1,
    visible: false,
    content: '',
  };

  fetchData = () => {
    const page = this.state.page;
    let list = this.state.list;
    http
      .get('/basic/announcement/', { params: { num: 20, page: page } })
      .then(r => {
        list.push(...r);
        this.setState({ list: list, initLoading: false, page: page + 1 });
      });
  };

  onLoadMore = () => {
    this.fetchData();
  };

  onClick = (id: number) => {
    http.post('/basic/announcement/', { data: { id: id } }).then(r => {
      this.setState({ visible: true, content: r });
    });
  };

  setUnVisible() {
    this.setState({ visible: false });
  }

  componentDidMount() {
    this.fetchData();
  }

  render() {
    const { initLoading, loading, list } = this.state;
    const loadMore =
      !initLoading && !loading ? (
        <div className={styles.loadingMore}>
          <Button onClick={this.onLoadMore}>加载更多</Button>
        </div>
      ) : null;
    return (
      <>
        <Card
          headStyle={{
            fontSize: '14px',
            padding: '0 20px',
            backgroundColor: '#fafafa',
          }}
          bodyStyle={{ padding: '0 10px' }}
          title="基金公告"
          extra={
            <CompressOutlined
              className={styles.expanded}
              onClick={() => {
                history.go(-1);
              }}
            />
          }
          size="small"
          className={styles.card}
        >
          <List
            loading={initLoading}
            itemLayout="horizontal"
            dataSource={list}
            loadMore={loadMore}
            renderItem={item => (
              <List.Item
                onClick={() => this.onClick(item.id)}
                className={styles.listItem}
              >
                <List.Item.Meta
                  title={item.title}
                  description={`${moment(item.date).format('ll')}   ${
                    item.secuabbr
                  }`}
                />
              </List.Item>
            )}
          />
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
      </>
    );
  }
}
