/**
 * 添加分类的form组件
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { 
  Form,
  Select,
  Input
 } from "antd";

const Item = Form.Item;
const Option = Select.Option;

export class AddForm extends Component {
  static propTypes = {
    categorys: PropTypes.array.isRequired,  //一级分类的数组
    setClasses: PropTypes.func.isRequired,
    setInput: PropTypes.func.isRequired
  };

  render() {
    const { categorys } = this.props;
    return (
      <Form>
        <Item>
          <Select onSelect={value => this.props.setClasses(value)}>
            <Option value="0" key="0">一级分类</Option>
            {
              categorys.map(c => <Option value={c._id} key={c._id}>{c.name}</Option>)
            }
          </Select>
        </Item>
        <Item rules={[{required: true, message: '名称必须输入!'}]}>
          <Input placeholder="请输入分类名称" ref={input => this.props.setInput(input)} />
        </Item>
      </Form>
    )
  }
}

export default AddForm
