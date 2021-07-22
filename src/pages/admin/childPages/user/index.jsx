/**
 * admin的用户管理界面
 */
import React, { Component } from 'react';
import { 
  Card,
  Button,
  Table,
  Modal,
  message
 } from "antd";
import LinkButton from '@/components/link-button';
import { formateDate } from '../../../../utils/dateUtils';
import { getUsers, deleteUser, addOrUpdateUser } from '../../../../api/admin';
import { PAGE_SIZE } from "@/utils/constants";
import UserForm from './user-form';

export class User extends Component {
  state = {
    users: [],  // 所有用户列表
    roles: [],  // 所有角色的列表
    tableColumns: [], // 列表项
    showStatus: 0, // 是否展示弹出框；0：不显示；1：添加用户；2：修改用户
    user: {}
  };

  //初始化列表项
  initColumns = () => {
    const tableColumns = [
      {
        title: '用户名',
        dataIndex: 'username'
      },
      {
        title: '邮箱',
        dataIndex: 'email'
      },
      {
        title: '电话',
        dataIndex: 'phone'
      },
      {
        title: '注册时间',
        dataIndex: 'create_time',
        render: formateDate
      },
      {
        title: '所属角色',
        dataIndex: 'role_id',
        //render: (role_id) => this.state.roles.find(role => role._id === role_id).name
        render: (role_id) => this.roleNames[role_id]
      },
      {
        title: '操作',
        render: (user) => (
          <span>
            <LinkButton onClick={() => {
              this.setState({ showStatus: 2 });
              this.setState({user});
            }}>修改</LinkButton>
            <LinkButton onClick={() => this.deleteUser(user)}>删除</LinkButton>
          </span>
        )
      }
    ];
  };
  
  // 根据role的数组，生成包含所有角色名的对象(属性名用角色id)
  initRoleNames = (roles) => {
    const roleNames = roles.reduce((pre, role) => {
      pre[role._id] = role.name
      return pre
    }, {});
    this.roleNames = roleNames;
  };

  //获取所有用户列表
  getUsers = async () => {
    const result = await getUsers();
    if (result.status === 0) {
      const {users, roles} = result.data;
      this.initRoleNames(roles);
      this.setState({users, roles});
    }
  };

  // 添加或更新用户
  addOrUpdateUser = async () => {
    // 收集数据
    let user = this.us.current.addOrUpdateUser();
    user.create_time = Date.now();
    if (this.state.user._id) {
      user._id = this.state.user._id;
    }
    
    // 提交添加的请求
    const result = await addOrUpdateUser(user);
    if (result.status === 0) {
      message.success(`${this.state.user._id ? '修改' : '添加'}角色成功`);
      this.getUsers();
      this.setState({showStatus: 0});
    } else {
      message.success(`${this.state.user._id ? '修改' : '添加'}角色失败`);
    }
  };

  // 删除用户
  deleteUser = (user) => {
    Modal.confirm({
      title: `确认删除${user.username}吗?`,
      onOk: async () => {
        const result = await deleteUser(user._id);
        if (result.status === 0) {
          message.success('删除用户成功');
          this.getUsers();
        }
      }
    });
  };

  // 取消显示
  handleCancel = () => {
    this.setState({ showStatus: 0 });
  };

  componentDidMount() {
    this.initColumns();
    this.getUsers();
  };

  render() {
    const {users, tableColumns} = this.state;
    const user = this.state.user || {};

    const title = <Button type="primary" onClick={() => {
      this.setState({ showStatus: 1 });
      this.setState({user: {}});
    }}>创建用户</Button>

    return (
      <Card title={title}>
        <Table
          bordered
          rowKey="_id"
          dataSource={users}
          columns={tableColumns}
          pagination={{
            total,
            defaultPageSize: PAGE_SIZE,
            showQuickJumper: true,
            showSizeChanger: false }}
        />

        <Modal
          title={user ? '修改用户' : "添加用户"}
          visible={showStatus === 1}
          onOk={this.addOrUpdateUser}
          destroyOnClose={true}
          onCancel={this.handleCancel}>
          <UserForm 
            roles={roles} 
            ref={userform => this.us = userform} 
            user={user}
          />
        </Modal>
      </Card>
    )
  }
}

export default User
