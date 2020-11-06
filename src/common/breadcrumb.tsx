import React from 'react';
import { Link, history } from 'umi';
import { Breadcrumb } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import './common.less';
import { PortfolioContext } from '@/common/localstorage';

export interface route {
  name: string;
  route: string;
}

export type routes = Array<route>;

interface props {
  routes: routes;
  className?: string;
}

export default class BreadCrumb extends React.Component<props, {}> {
  routes: routes;
  static contextType = PortfolioContext;

  constructor(props: props) {
    super(props);
    this.routes = props.routes;
  }

  createRoute() {
    return this.routes.map(x => {
      return (
        <Breadcrumb.Item key={this.routes.indexOf(x)}>
          <Link to={x.route.replace(/:id/gi, this.context.portCode)}>
            {x.name}
          </Link>
        </Breadcrumb.Item>
      );
    });
  }

  render() {
    const route = this.createRoute();
    return (
      <div className="breadcrumb">
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to="/">
              <HomeOutlined />
            </Link>
          </Breadcrumb.Item>
          {route}
        </Breadcrumb>
      </div>
    );
  }
}
