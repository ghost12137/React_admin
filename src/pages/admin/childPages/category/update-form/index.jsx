/**
 * 添加分类的form组件
 */
import React, { Component } from 'react';
import PropTypes from "prop-types";
import { 
  Form,
  Input
 } from "antd";

const Item = Form.Item;

export class UpdateForm extends Component {
  static propTypes = {
    categoryName: PropTypes.string.isRequired,
    setCateName: PropTypes.func.isRequired
  };

  render() {
    const { categoryName } = this.props;
    return (
      <Form>
        
        <Item
          initialValue={categoryName ? categoryName : ""}
          rules={[{required: true, message: "名称必须输入!"}]}
          >
          <Input placeholder="请输入分类名称" defaultValue={categoryName} ref={input => this.props.setCateName(input)}/>
        </Item>
      </Form>
    )
  }
}

export default UpdateForm
