import React, { Component } from 'react';
import {  
  Form,
  Input,
  Button,
  message
} from "antd";
import { 
  UserOutlined, 
  LockOutlined 
} from '@ant-design/icons';
import { Redirect } from "react-router-dom";

import './login.less';
//引入图片
import logo from '@/assets/images/logo.png'

//引入后台验证登录函数
import {HandleLogin} from '../../api/login';
//引入保存本地的函数
import storageUtils from "@/utils/storageUtils";
/**
 * 登录的路由组件
 */

export class Login extends Component {

  /**
   * 事件处理
   */
  //处理提交事件
   handleFinsh = async (values) => {
    const { username, password } = values;
    try {
      const data = await HandleLogin(username, password);
      // console.log('请求成功, 数据为: ', data);
      if (data.status === 0) {  //登录成功
        message.success('登录成功');

        storageUtils.saveUser(data.data);

        //转到管理界面
        this.props.history.replace('/');
      }
    }
    catch (error) {
      console.log("请求错误: ", error);
    }
  };
  //自定义密码验证
  validatePwd = (rule, value, callback) => {
    if (!value)
      callback('请输入密码');
    else if (value.length < 4)
      callback('密码至少4位');
    else if (value.length > 12)
      callback('密码至多12位');
    else if (!/^[a-zA-Z0-9_@]+$/.test(value))
      callback('密码格式错误');
    else 
      callback(); //验证通过
  };

  render() {
    const user = storageUtils.getUser();
    console.log(user);
    if (user && user._id) {
      //自动跳转到登录界面
      return <Redirect to="/" />
    }
    return (
        <div className="login">
          <header className="login-header">
            <img src={logo} alt=""/>
            <h1>后台管理系统</h1>
          </header>
          <section className="login-content">
            <h2>用户登录</h2>
            <Form className="login-form"
              initialValues={{ remember: true }}
              onFinish={this.handleFinsh}
              >
              {/* 用户名 */}
              <Form.Item name="username" rules={[
                                                  //声明式验证
                                                  { required: true,whitespace: true, message: '请输入用户名' },
                                                  { max: 12, message: '用户名至多12位' },
                                                  { min: 4, message: '用户名至少4位' },
                                                  { pattern: /^[a-zA-Z0-9_@]+$/, message: '用户名格式错误' },
                                                ]}>
                <Input prefix={<UserOutlined />} placeholder="Username" autoComplete='off' />
              </Form.Item>
              {/* 密码 */} 
              <Form.Item name="password" rules={[{validator: this.validatePwd}]}>
                <Input prefix={<LockOutlined />} type="password" placeholder="Password"/>
              </Form.Item>
              {/* 登录按钮 */}
              <Form.Item>
                <Button type="primary" htmlType="submit" className="login-form-button">登录</Button>
              </Form.Item>
            </Form>
          </section>
        </div>
    )
  }
}

export default Login
