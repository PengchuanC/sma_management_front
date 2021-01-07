import React from 'react';
import { history } from 'umi';
import { Layout, Menu } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  FundViewOutlined,
  AppstoreOutlined,
  BarChartOutlined,
  UserOutlined,
  PercentageOutlined,
  FunctionOutlined,
  ExperimentOutlined,
  CommentOutlined,
  LogoutOutlined,
  HistoryOutlined,
  FundOutlined,
  DotChartOutlined,
} from '@ant-design/icons';
import './index.less';
import logo from '@/assets/images/logoNew.png';
import { PortfolioContext } from '@/common/localstorage';

interface Storage {
  active: string;
  openKeys: string[];
}

interface menuOptions {
  [key: string]: pathOptions;
}

interface pathOptions {
  name: string;
  path: string;
}

const data: Storage = {
  active: '1',
  openKeys: ['s1'],
};

const { Header, Content, Sider } = Layout;

function defaultMenu(name: string) {
  return <div className="sma-header-item">{name}</div>;
}

let DefaultMenu = defaultMenu('');

const re = /:id/gi;

class MainLayout extends React.Component {
  setPortCode = (portcode: string) => {
    this.setState({ portCode: portcode });
  };

  state: any = {
    collapsed: false,
    menuBar: DefaultMenu,
    selected: data.active,
    portCode: '',
    setPortCode: this.setPortCode,
  };

  menu: menuOptions = {
    1: { name: '首页概览', path: '/portfolio/glance' },
    2: { name: '账户总览', path: '/portfolio/:id/overview' },
    3: { name: '投资分析', path: '/portfolio/:id/analysis' },
    4: { name: '投资记录', path: '/portfolio/:id/history' },
    5: { name: '调仓贡献', path: '/portfolio/:id/mock' },
    6: { name: '模拟投资', path: '/warehouse' },
    7: { name: '资产配置', path: '/allocate' },
    // 8: { name: '问卷分析', path: '/questionnaire' },
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  onSelect = (obj: any) => {
    const { key } = obj;
    data.active = key;
    let index: string = String(key);
    let DefaultMenu = defaultMenu(this.menu[index].name);
    this.setState({ menuBar: DefaultMenu, selected: key });
    let path = this.menu[index].path.replace(re, this.state.portCode);
    history.push(path);
  };

  openChange = (keys: any) => {
    data.openKeys = keys;
  };

  componentDidMount() {
    // 网络请求获取默认的组合代码
    const portcode = 'SA5001';
    this.setState({ portCode: portcode });
  }

  render() {
    return (
      <PortfolioContext.Provider value={this.state}>
        <Layout className="sma-layout">
          <Sider
            trigger={null}
            collapsible
            collapsed={this.state.collapsed}
            className="side"
          >
            <div className="logo">
              {this.state.collapsed ? (
                <div className="letter">NOI</div>
              ) : (
                <img src={logo} alt="" />
              )}
            </div>
            <Menu
              theme="light"
              mode="inline"
              defaultSelectedKeys={[data.active]}
              defaultOpenKeys={data.openKeys}
              onSelect={this.onSelect}
              onOpenChange={this.openChange}
            >
              <Menu.SubMenu
                key="s1"
                icon={<FundViewOutlined />}
                title="组合管理"
              >
                <Menu.Item key="1" icon={<AppstoreOutlined />}>
                  首页概览
                </Menu.Item>
                <Menu.Item key="2" icon={<FundOutlined />}>
                  账户总览
                </Menu.Item>
                <Menu.Item key="3" icon={<BarChartOutlined />}>
                  投资分析
                </Menu.Item>
                <Menu.Item key="4" icon={<HistoryOutlined />}>
                  投资记录
                </Menu.Item>
                <Menu.Item key="5" icon={<DotChartOutlined />}>
                  调仓贡献
                </Menu.Item>
              </Menu.SubMenu>
              <Menu.Item key="6" icon={<PercentageOutlined />}>
                模拟投资
              </Menu.Item>
              <Menu.Item key="7" icon={<FunctionOutlined />}>
                资产配置
              </Menu.Item>
              {/*<Menu.Item key="8" icon={<FileWordOutlined />}>*/}
              {/*  问卷分析*/}
              {/*</Menu.Item>*/}
              <Menu.Divider />
              <Menu.SubMenu key="s2" icon={<ExperimentOutlined />} title="其他">
                <Menu.Item key="9" icon={<CommentOutlined />}>
                  客户问答
                </Menu.Item>
                <Menu.Item key="10" icon={<UserOutlined />}>
                  用户
                </Menu.Item>
              </Menu.SubMenu>
            </Menu>
          </Sider>
          <Layout className="site-layout">
            <Header className="site-layout-background" style={{ padding: 0 }}>
              <div className="sma-site-header">
                <div className="trigger" onClick={this.toggle}>
                  {this.state.collapsed ? (
                    <MenuUnfoldOutlined />
                  ) : (
                    <MenuFoldOutlined />
                  )}
                </div>
                <div className="sma-header">
                  {this.state.menuBar}
                  <div className="trigger sma-header-item">
                    <LogoutOutlined
                      onClick={window.close}
                      twoToneColor="#eb2f96"
                    />
                  </div>
                </div>
              </div>
            </Header>
            <Content className="site-content">{this.props.children}</Content>
          </Layout>
        </Layout>
      </PortfolioContext.Provider>
    );
  }
}

export default MainLayout;
