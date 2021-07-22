/**
 * admin的类品管理页面
 */
import React, { Component } from 'react';
import { Card, Table, Button, message, Modal } from "antd";
import { PlusOutlined, ArrowRightOutlined } from "@ant-design/icons";

import LinkButton from '@/components/link-button';
import AddForm from './add-form'
import UpdateForm from './update-form';
import { getCategorys, AddCategory, UpdateCategory } from "@/api/admin";

import './index.less';

export class Category extends Component {
  state = {
    loading: false, //是否正在获取
    categorys: [],  //一级分类列表
    tableColumns: [], //table中所有列
    parentId: '0',  //当前需要显示的分类列表的parentId
    parentName: '',   //当前需要显示的分类列表的parent名称
    subCategorys: [], //耳机分类列表
    showStatus: '0',  //显示modal标识， 0：都不显示，1：显示添加，2：显示更新
  };

  //获取分类列表
  getCategorys = async (parentId) => {
    this.setState({loading: true});
    parentId = parentId || this.state.parentId;
    //发送异步请求
    const result = await getCategorys(parentId);
    if (result.status === 0) {  //请求成功
      const categorys = result.data;
      if (parentId === '0') {
        this.setState({ categorys });
      } else {
        this.setState({ subCategorys: categorys });
      }
    } else {  //请求失败
      message.error("获取分类列表失败");
    }
    this.setState({loading: false});
  };
  
  //展示二级列表
  showSubCategorys = (category) => {
    this.setState({parentId: category._id, parentName: category.name}, () => {
      this.getCategorys();
    });
  };

  //初始化table所有列的数组
  initColumns = () => {
    const tableColumns = [
      {
        title: '分类的名称',
        dataIndex: 'name',//指定显示数据对应的属性名
      },
      {
        title: '操作',
        width: 300,
        render: (category) => {
          return ( //指定返回需要显示的界面标签
            <span>
              <LinkButton onClick={() => {this.category = category; this.setState({showStatus: '2'});}}>修改分类</LinkButton>
              {this.state.parentId === '0' ? <LinkButton onClick={() => { this.showSubCategorys(category) }}>查看子分类</LinkButton> : null}
            </span>
          )
        }
      }
    ];
    this.setState({tableColumns});
  };
  //响应点击取消按钮的事件
  handleCancel = () => {
    this.setState({showStatus: '0'});
  };
  //添加分类
  addCategory = async () => {
    this.setState({ showStatus: '0' });
    //收集数据，提交添加请求
    const parentId = this.classes;
    const categoryName = this.input.state.value;
    if (!categoryName) {
      message.error("名称不能为空");
      return;
    }
    const result = await AddCategory(parentId, categoryName);
    if (result.status === 0) {
      //重新显示列表
      message.success("添加成功");
      if (parentId === this.state.parentId)
        this.getCategorys();
      else if (parentId === '0')
        this.getCategorys(parentId);
    } else {
      message.error("添加失败");
    }
    
  };
  //更新分类
  UpdateCategory = async () => {
    this.setState({showStatus: '0'});
    const categoryId = this.category._id;
    const categoryName = this.catename.state.value;
    if (!categoryName) {
      message.error("名称不能为空");
      return;
    }
    //发送请求更新列表
    const result = await UpdateCategory(categoryId, categoryName);
    if (result.status === 0) {
      //重新显示列表
      this.getCategorys();
      message.success("修改成功");
    } else {
      message.error("修改失败");
    }
    
  }

  componentDidMount() {
    this.initColumns();
    this.getCategorys();
  };
  
  render() {
    //获取state中的值
    const { categorys, subCategorys, parentId, parentName, tableColumns, loading, showStatus } = this.state;
    //读取指定分类
    const category = this.category || {name: ''};
    //card的左上角标题
    const title = parentId === '0' ? "一级分类列表" : (
      <span>
        <LinkButton
          onClick={() => {
            this.setState(
              {
                parentId: "0",
                parentName: "",
                subCategorys: [],
              },
              () => {
                //在状态更新后重新render后执行
                this.getCategorys();
              }
            );
          }}
          >
          一级分类列表
        </LinkButton>
        <ArrowRightOutlined /> {parentName}
      </span>
    );
    //card右上角按钮
    const extra = (
      <Button
        icon={<PlusOutlined />}
        type="primary"
        onClick={() => {this.setState({showStatus: '1'})}}
        >
        添加
      </Button>
    );
    return (
      <Card title={title} extra={extra}>
        <Table 
          bordered
          rowKey="_id"
          dataSource={parentId === '0' ? categorys: subCategorys} 
          columns={tableColumns}
          loading={loading}
          pagination={{ defaultPageSize: 5, showQuickJumper: true, showSizeChanger: false}}
        />

        <Modal 
          title="添加分类" 
          visible={showStatus==='1'}
          onOk={this.addCategory}
          destroyOnClose={true}
          onCancel={this.handleCancel}>
          <AddForm 
            categorys={categorys}
            setClasses={classes => this.classes = classes}
            setInput={input => this.input = input} />
        </Modal>

        <Modal 
          title="修改分类"
          visible={showStatus==='2'}
          onOk={this.UpdateCategory}
          destroyOnClose={true}
          onCancel={this.handleCancel}>
          <UpdateForm
            categoryName={category.name}
            setCateName={(catename) => this.catename = catename} />
        </Modal>
      </Card>
    )
  }
}

export default Category
