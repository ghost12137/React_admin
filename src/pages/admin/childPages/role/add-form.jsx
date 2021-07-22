/**
 * 添加角色的form组件
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types'
import {
  Form,
  Input
} from "antd";

const Item = Form.Item;

export class AddForm extends PureComponent {
  static propTypes = {
    setForm: PropTypes.func.isRequired
  };

  render() {
    const formItemLayout = {
      labelCol: { span: 4 }, //左侧label宽度
      wrapperCol: { span: 10 }, //右侧包裹输入框宽度
    };
    return (
      <Form
        {...formItemLayout}
        >
        <Item label="角色名称" name="username" rules={[{ required: true, message: '名称必须输入!' }]}>
          <Input placeholder="请输入角色名称" ref={form => this.props.setForm(form)} />
        </Item>
      </Form>
    )
  }
}

export default AddForm
