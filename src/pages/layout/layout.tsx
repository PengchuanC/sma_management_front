import React from "react";
import {Link} from "umi";
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
    LineChartOutlined,
    FileWordOutlined,
    CommentOutlined,
    LogoutOutlined
} from '@ant-design/icons';
import './layout.less';
import logo from '@/assets/images/logoNew.png';

interface Storage {
  active: string,
  openKeys: string[]
}

const data: Storage = {
  active: '1',
  openKeys: ['s1']
}
const { Header, Content, Sider } = Layout;
const sideStyle: object = {backgroundColor: '#C2C8D5'};
let DefaultMenu = <div className="sma-header-item" />;


class MainLayout extends React.Component {
    state = {
      collapsed: false,
      menuBar: DefaultMenu,
      selected: data.active
    };

    toggle = () => {
        this.setState({
          collapsed: !this.state.collapsed,
        });
    };

    onSelect = (obj: any) => {
        const {key} = obj;
        data.active = key;
        switch (key){
            case '1':
              DefaultMenu = <div className="sma-header-item">组合一览</div>
              break
            case '5':
                DefaultMenu = <div className="sma-header-item">资产配置</div>
                break
            default:
                DefaultMenu = <div className="sma-header-item" />
        }
        this.setState({menuBar: DefaultMenu, selected: key})
    };

    openChange = (keys: any) => {
      data.openKeys = keys
    }

    render() {
        return (
            <Layout className="sma-layout">
                <Sider trigger={null} collapsible collapsed={this.state.collapsed} style={sideStyle}>
                    <div className="logo">
                        {this.state.collapsed?<div className="letter">NOI</div>:<img src={logo} alt=""/>}
                    </div>
                    <Menu theme="light" mode="inline"
                          defaultSelectedKeys={[data.active]} defaultOpenKeys={data.openKeys}
                          onSelect={this.onSelect} onOpenChange={this.openChange}
                    >
                        <Menu.SubMenu key="s1" icon={<FundViewOutlined />} title="组合管理">
                            <Menu.Item key="1" icon={<AppstoreOutlined />}><Link to='/portfolio'>组合一览</Link></Menu.Item>
                            <Menu.Item key="2" icon={<BarChartOutlined />}>行业分布</Menu.Item>
                            <Menu.Item key="3" icon={<LineChartOutlined />}>盘中估值</Menu.Item>
                        </Menu.SubMenu>
                        <Menu.Item key="4" icon={<PercentageOutlined />}>
                            <Link to='/portfolio'>调仓试算</Link>
                        </Menu.Item>
                        <Menu.Item key="5" icon={<FunctionOutlined />}>
                            <Link to='/allocate'>资产配置</Link>
                        </Menu.Item>
                        <Menu.Item key="6" icon={<FileWordOutlined />}>
                            <Link to='/allocate'>问卷分析</Link>
                        </Menu.Item>
                        <Menu.Divider />
                        <Menu.SubMenu key="s2" icon={<ExperimentOutlined />} title="其他">
                            <Menu.Item key="7" icon={<CommentOutlined />}>客户问答</Menu.Item>
                            <Menu.Item key="8" icon={<UserOutlined />}>用户</Menu.Item>
                        </Menu.SubMenu>
                    </Menu>
                </Sider>
                <Layout className="site-layout">
                    <Header className="site-layout-background" style={{ padding: 0}}>
                        <div className='sma-site-header'>
                            <div className="trigger" onClick={this.toggle}>
                                {this.state.collapsed? <MenuUnfoldOutlined />: <MenuFoldOutlined/>}
                            </div>
                            <div className="sma-header">
                                {this.state.menuBar}
                                <div className="trigger sma-header-item"><LogoutOutlined twoToneColor="#eb2f96"/></div>
                            </div>
                        </div>
                    </Header>
                    <Content
                        className="site-layout-background"
                        style={{
                            margin: '16px 9px',
                            minHeight: 280,
                        }}
                    >
                      {this.props.children}
                    </Content>
                </Layout>
            </Layout>
        );
    }
}

export default MainLayout;
