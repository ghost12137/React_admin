/**
 * admin的角色管理页面
 */
import React, { Component } from 'react';
import { 
  Card,
  Button,
  Table,
  Modal,
  message
 } from "antd";
import { PAGE_SIZE } from "@/utils/constants";
import { getRoles, AddRole, setRole } from '../../../../api/admin';
import AddForm from './add-form';
import AuthForm from './auth-form';
import storageUtils from '../../../../utils/storageUtils'
import {formateDate} from '../../../../utils/dateUtils';
import { connect } from "react-redux";
import { loginOut } from "@redux/actions";

export class Role extends Component {
  state = {
    roles: [],  //角色数组
    tableColumns: [], //列表项
    role: {}, //选中的role
    showStatus: 0,  // 是否显示添加界面
  };

  //初始化列表项
  initColumns = () => {
    const tableColumns = [
      {
        title: '角色名称',
        dataIndex: 'name'
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        render: (create_time) => formateDate(create_time)
      },
      {
        title: '授权时间',
        dataIndex: 'auth_time',
        render: formateDate
      },
      {
        title: '授权人',
        dataIndex: 'auth_name'
      },
    ];

    this.setState({tableColumns});
  };

  // 获取所有角色的列表
  getRoles = async () => {
    const result = await getRoles();
    if (result.status === 0) {
      const roles = result.data;
      this.setState({roles});
    }
  };

  // 设置行的点击动作
  onRow = (role) => {
    return {
      onSelect: (event) => {
        this.setState({ role });
      },
      onClick: (event) => {
        this.setState({ role });
      }, // 点击行
      onDoubleClick: (event) => { },
      onContextMenu: (event) => { },
      onMouseEnter: (event) => { }, // 鼠标移入行
      onMouseLeave: (event) => { },
    };
  };

  // 添加角色
  addRole = async () => {
    const result = await AddRole(this.form.props.value);
    if (result.status === 0) {
      message.success('添加角色成功');
      const role = result.data;
      this.setState(state => ({
        roles: [...state.roles, role]
      }));
    } else {
      message.error('添加角色失败');
    }
    this.setState({showStatus: 0});
  };

  // 设置角色权限
  setRole = async () => {
    const role = this.state.role;
    //得到最新的menus
    const menus = this.auth.current.getMenus();
    role.menus = menus;
    role.auth_time = Date.now();
    // role.auth_name = storageUtils.getUser().username;
    role.auth_name = this.props.user.username;

    const result = await setRole(role);
    if (result.status === 0) {
      //如果当前更新的是自己角色的权限，强制退出
      if (role._id === this.props.user.role_id) {
        // storageUtils.removeUser();
        this.props.loginOut();
        this.props.history.replace('/login');
        message.success('当前用户角色修改成功');
      } else {
        message.success('设置角色权限成功');
        this.setState({
          roles: [this.state.roles]
        });
      }
    } else {
      message.error('设置角色权限失败');
    }

    this.setState({ showStatus: 0 });
  };

  // 取消显示
  handleCancel = () => {
    this.setState({showStatus: 0});
  };

  componentDidMount() {
    this.initColumns();
    this.getRoles();
  };
  
  render() {
    const { roles, tableColumns, role, showStatus } = this.state;
    const title = (
      <span>
        <Button type="primary" onClick={() => this.setState({showStatus: 1})}>创建角色</Button> &nbsp;&nbsp;
        <Button type="primary" disabled={role._id} onClick={() => this.setState({ showStatus: 2 })}>设置角色权限</Button>
      </span>
    );
    return (
      <Card
        title={title}
        >
        <Table
          bordered
          rowKey='_id'
          dataSource={roles}
          columns={tableColumns}
          rowSelection={{
            type: 'radio',
            selectedRowKeys: [role._id],
            onSelect: role => this.setState({role}) //设置单选
          }}
          pagination={{
            total,
            defaultPageSize: PAGE_SIZE,
            showQuickJumper: true,
            showSizeChanger: false
          }}
          onRow={this.onRow}
        />

        <Modal
          title="添加角色"
          visible={showStatus === 1}
          onOk={this.addRole}
          destroyOnClose={true}
          onCancel={this.handleCancel}>
          <AddForm
            setForm={form => this.form = form} />
        </Modal>

        <Modal
          title="设置角色权限"
          visible={showStatus === 2}
          onOk={this.setRole}
          destroyOnClose={true}
          onCancel={this.handleCancel}>
          <AuthForm
             role={role}
             ref={auth => this.auth = auth}
          />
        </Modal>
      </Card>
    )
  }
}

export default connect(
  state => ({user: state.user}),
  {loginOut}
)(Role)
