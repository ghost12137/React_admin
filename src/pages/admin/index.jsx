/**
 * 后台管理的路由页面
 */

import React, { Component } from 'react'
import { Redirect, Route, Switch } from "react-router-dom";
import { Layout } from 'antd';

//浏览器缓存的相关方法
import storageUtils from "@/utils/storageUtils";
//导入左侧导航栏
import LeftNav from '../../components/admin/left-nav';
//导入头部
import Header from '../../components/admin/header';
//导入路由组件
import Home from './childPages/home';
import Category from './childPages/category';
import Product from './childPages/product';
import Role from './childPages/role';
import User from './childPages/user';
import Bar from './childPages/charts/bar';
import Line from './childPages/charts/line';
import Pie from './childPages/charts/pie';

const { Footer, Sider, Content } = Layout;

export class Admin extends Component {
  render() {
    const user = storageUtils.getUser();
    if (!user || !user._id) {
      //自动跳转到登录界面
      return <Redirect to="/login" />
    }
    return (
      <Layout style={{ minHeight: '100%' }}>
        <Sider>
          {/* 左侧导航栏 */}
          <LeftNav />
        </Sider>
        <Layout>
          {/* 头部 */}
          <Header />
          {/* 中间内容 */}
          <Content style={{ margin: 20, backgroundColor: '#fff' }}>
            <Switch>
              <Route path='/home' component={Home} /> 
              <Route path='/category' component={Category} /> 
              <Route path='/product' component={Product} /> 
              <Route path='/role' component={Role} /> 
              <Route path='/user' component={User} /> 
              <Route path='/charts/bar' component={Bar} /> 
              <Route path='/charts/line' component={Line} /> 
              <Route path='/charts/pie' component={Pie} /> 
              <Redirect to='/home' />
            </Switch>
          </Content>
          {/* 页脚 */}
          <Footer style={{ textAlign: 'center', color: '#ccc' }}>推荐使用谷歌浏览器，可以获得更佳页面操作体验</Footer>
        </Layout>
      </Layout>
    )
  }
}

export default Admin
