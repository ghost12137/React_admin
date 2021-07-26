/**
 * admin首页上部头部
 */
import React, { Component } from 'react';
import "./index.less";
import { getWeather } from "@/api/admin";
import { formateDate } from "@/utils/dateUtils";
import { CloudOutlined } from "@ant-design/icons";
import { withRouter } from "react-router-dom";
import { Modal } from "antd";
import { connect } from "react-redux";

import LinkButton from '@/components/link-button';
//引入左侧菜单文件
import menuList from '@/config/menuConfig';
import { loginOut } from "../../../redux/actions";
// import storageUtils from '@/utils/storageUtils.js'

export class Header extends Component {
  state = {
    currentTime: formateDate(Date.now()),  //当前时间字符串
    weather: '',  //天气的文本
  };

  //获取当前时间
  getTime = () => {
    this.timer = setInterval(() => {
      this.setState({ currentTime: formateDate(Date.now()) });
    }, 1000);
  };
  //获取天气
  getWeather = async () => {
    const {weather} = await getWeather('杭州');
    this.setState({ weather });
  };
  //获取标题
  getTitle = () => {
    const path = this.props.location.pathname;
    let title;
    menuList.forEach(item => {
      if (item.key === path)
        title = item.title;
      else if (item.children) {
        // 在所有子item中查找匹配的
        const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0);
        if (cItem)
          title = cItem.title;
      }
    });
    return title;
  };
  //退出登录
  logout = () => {
    //显示确认框
    Modal.confirm({
      content: '确定退出吗?',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        /* //清空后台数据
        storageUtils.removeUser();
        //跳转页面
        this.props.history.replace('/login'); */
        this.props.loginOut();
      }
    });
  };
  /* 第一次render后立即执行 */
  componentDidMount() {
   this.getTime();
   this.getWeather();
   this.getTitle();
  };
  // 清除时间定时器
  componentWillUnmount() {
    clearInterval(this.timer);
  };

  render() {
    const { currentTime, weather } = this.state;
    // 得到当前需要显示的title
    // const title = this.getTitle();
    const title = this.props.headTitle;

    const username = this.props.user.username;
    return (
      <div className="header">
        <div className="header-top">
          <span>欢迎，{username}</span>
          <LinkButton onClick={this.logout}>退出</LinkButton>
        </div>
        <div className="header-bottom">
          <div className="header-botton-left">{title}</div>
          <div className="header-botton-right">
            <span>{currentTime}</span>
            <CloudOutlined
              style={{ width: "30px", height: "20px", margin: "15 15 15 15" }}
            />
            <span>{weather}</span>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(
  state => ({headTitle: state.headTitle, user: state.user}),
  {loginOut}
)(withRouter(Header));
