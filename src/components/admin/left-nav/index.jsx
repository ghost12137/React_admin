/**
 * admin首页左侧导航栏
 */
import React, { Component } from 'react';
import { Link, withRouter } from "react-router-dom";
import { Menu } from 'antd';

import  "./index.less";
//引入图片
import logo from '@/assets/images/logo.png';
//引入左侧菜单文件
import menuList from '../../../config/menuConfig';
// import storageUtils from "@/utils/storageUtils";
import { setHeadTitle } from "../../../redux/actions";
import { connect } from "react-redux";

const { SubMenu } = Menu;

export class LeftNav extends Component {

  //判断当前登录用户对item是否有权限
  hasAuth = (item) => {
    const {key, isPublic} = item;
    /* const menus = storageUtils.getUser().role.menus;
    const username = storageUtils.getUser().username; */
    const menus = this.props.user.role.menus;
    const username = this.props.user.username;
    /**
     * 1、如果当前用户是admin
     * 2、如果当前item是公开的
     * 3、当前用户有此item的权限：key有没有在items里
     */
    if (username === 'admin' || isPublic || menus.indexOf(key) !== -1) {
      return true;
    } else if (item.children) {
      //4、如果当前用户有此item的某个子item的权限
      return !!item.children.find(child => menus.indexOf(child.key) !== -1);
    }
    return false;
  };

  //根据menu的数据数组生成对应的标签数组
  //使用递归+map方法
  getMenuNodes_map = menuList => {
    return menuList.map(item => {
      /*
        {
          title: "首页", // 菜单标题名称
          key: "/home", // 对应的 path
          icon: <HomeOutlined />, // 图标名称
          children: [] //对应的子路由，可能有
        }
      */
     if (!item.children) {  //无子路由，直接返回Menu.item
      return (
        <Menu.Item key={item.key} icon={item.icon} >
          <Link to={item.key}>
            {item.title}
          </Link>
        </Menu.Item>
      );
     } else {
       return (
         <SubMenu key={item.key} icon={item.icon} title={item.title}>
           {/* 递归生成children的节点 */}
           {
             this.getMenuNodes_map(item.children)
           }
         </SubMenu>
       );
     }
    });
  };
  //根据menu的数据数组生成对应的标签数组
  //使用递归+reduce方法
  getMenuNodes = menuList => {
    //得到当前请求的路由路径
    const path = this.props.location.pathname;
    return menuList.reduce((pre, item) => {

      // 如果当前用户有item对应的权限，才需要显示对应的菜单项
      if (this.hasAuth(item)) {
        //向pre中添加<Menu.item>或者<SubMenu>
        if (!item.children) {
          // 判断item是否是当前对应的item
          if (item.key === path || path.indexOf(item.key) === 0) {
            // 更新redux中的headTitle状态
            this.props.setHeadTitle(item.title);
          }

          pre.push((
            <Menu.Item key={item.key} icon={item.icon} >
              <Link to={item.key} title={item.title} onClick={() => this.props.setHeadTitle(item.title)}>
                {item.title}
              </Link>
            </Menu.Item>
          ));
        } else {
          //查找一个与当前请求路径匹配的子item
          const curItem = item.children.find(cItem => path.indexOf(cItem.key) === 0)
          if (curItem) {
            this.openKey = item.key;
          }

          pre.push((
            <SubMenu key={item.key} icon={item.icon} title={item.title}>
              {/* 递归生成children的节点 */}
              {
                this.getMenuNodes(item.children)
              }
            </SubMenu>
          ));
        }
      }
      return pre;
    }, []);
  };

  UNSAFE_componentWillMount() {
    this.menuNodes = this.getMenuNodes(menuList);
  };

  render() {
    //得到当前请求的路由路径
    let path = this.props.location.pathname;
    if (path.indexOf('/product') === 0) { //当前请求的是商品或者子路由界面
      path = '/product';
    }
    return (
      <div>
        <Link
          to="/"
          className="left-nav">
          <header className="left-nav-header">
            <img src={logo} alt="logo" />
            <h1>农林后台</h1>
          </header>
        </Link>

        <Menu
          mode="inline"
          theme="dark"
          selectedKeys={[path]}
          defaultOpenKeys={[this.openKey]}
        >
          {
            this.menuNodes
          }



          {/* <Menu.Item key="/home" icon={<HomeOutlined />}>
            <Link to="/home">
              首页
            </Link>
          </Menu.Item>
          <SubMenu key="goods" icon={<MailOutlined />} title="商品">
            <Menu.Item key="/category" icon={<HomeOutlined />}>
              <Link to="/category">
                品类管理
              </Link>
            </Menu.Item>
            <Menu.Item key="/product" icon={<HomeOutlined />}>
              <Link to="/product">
                商品管理
              </Link>
            </Menu.Item>
          </SubMenu>
          <Menu.Item key="/user" icon={<HomeOutlined />}>
            <Link to="/user">
              用户管理
            </Link>
          </Menu.Item>
          <Menu.Item key="/role" icon={<HomeOutlined />}>
            <Link to="/role">
              角色管理
            </Link>
          </Menu.Item>
          <SubMenu key="charts" icon={<MailOutlined />} title="图形图表">
            <Menu.Item key="/charts/bar" icon={<HomeOutlined />}>
              <Link to="/charts/bar">
                柱形图
              </Link>
            </Menu.Item>
            <Menu.Item key="/charts/line" icon={<HomeOutlined />}>
              <Link to="/charts/line">
                折线图
              </Link>
            </Menu.Item>
            <Menu.Item key="/charts/pie" icon={<HomeOutlined />}>
              <Link to="/charts/pie">
                饼图
              </Link>
            </Menu.Item>
          </SubMenu> */}
        </Menu>
      </div>
    )
  }
}

export default connect(
  state => ({user: state.user}),
  {setHeadTitle}
)(withRouter(LeftNav));
