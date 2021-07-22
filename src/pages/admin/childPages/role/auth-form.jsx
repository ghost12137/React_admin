/**
 * 设置角色权限的组件
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types'
import {
  Form,
  Input,
  Tree
} from "antd";
import menuConfig from "../../../../config/menuConfig";

const Item = Form.Item;

export class AuthForm extends Component {
  static propTypes = {
    role: PropTypes.object.isRequired
  };

  constructor (props) {
    super(props);

    const {menus} = this.props.role;
    this.state = {
      checkedKeys: menus
    };
  };

  // 为父组件提交最新的menus数据
  getMenus = () => this.state.checkedKeys;
  
  // 选择
  onCheck = (checkedKeys) => {
    this.setState({checkedKeys});
  };
  
  // 当组件接收到新的属性时自动调用
  componentWillReceiveProps(nextProps) {
    const menus = nextProps.role.menus;
    this.setState({checkedKeys: menus});
  };

  render() {
    const {role} = this.props;
    const {checkedKeys} = this.state;
    const treeData = menuConfig;
    const formItemLayout = {
      labelCol: { span: 4 }, //左侧label宽度
      wrapperCol: { span: 10 }, //右侧包裹输入框宽度
    };
    return (
      <Form {...formItemLayout}>
        <Item label="角色名称">
          <Input value={role.name} disabled />
        </Item>
        <Item>
          <Tree
            checkable
            defaultExpandAll={true}
            checkedKeys={checkedKeys}
            onCheck={this.onCheck}
            treeData={treeData}
          />
        </Item>
      </Form>
    )
  }
}

export default AuthForm
