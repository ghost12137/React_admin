/**
 * 添加/修改用户的form组件
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types'
import {
  Form,
  Input,
  Select
} from "antd";

const Item = Form.Item;
const Option = Select.Option;

export class UserForm extends PureComponent {
  static propTypes = {
    roles: PropTypes.array.isRequired,
    user: PropTypes.object
  };

  state = {};

  //当表单变化时的回调函数
  onValuesChange = (values) => {
    this.setState(values);
  };

  //父组件调用的回调函数
  addOrUpdateUser = () => {
    const user = this.state;
    return user;
  };

  render() {
    const formItemLayout = {
      labelCol: { span: 4 }, //左侧label宽度
      wrapperCol: { span: 10 }, //右侧包裹输入框宽度
    };
    const {roles, user} = this.props;
    return (
      <Form onValuesChange={this.onValuesChange}
        {...formItemLayout}
        >
        <Item
          label="用户名"
          name="username"
          rules={[{ required: true, message: "用户名必须输入!" }]}
          initialValue={user.username}
          >
          <Input placeholder="请输入用户名"></Input>
        </Item>
        {
          user._id ? null : (
            <Item
              label="密码"
              name="password"
              rules={[{ required: true, message: "密码必须输入!" }]}
              initialValue={user.password}
            >
              <Input placeholder="请输入密码" type="password" />
            </Item>
          )
        }
        <Item
          label="手机号"
          name="phone"
          rules={[{ required: true, message: "手机号必须输入!" }]}
          initialValue={user.phone}
          >
          <Input placeholder="请输入手机号" />
        </Item>
        <Item
          label="邮箱"
          name="email"
          rules={[{ required: true, message: "邮箱必须输入!" }]}
          initialValue={user.email}
          >
          <Input placeholder="请输入邮箱" />
        </Item>
        <Item
          label="角色"
          name="role_id"
          rules={[{ required: true, message: "角色必须选择!" }]}
          initialValue={user._id}
          >
          <Select>
            {
              roles.map(role => <Option value={role._id} key={role._id}>{role.name}</Option>)
            }
          </Select>
        </Item>
      </Form>
    )
  }
}

export default UserForm
