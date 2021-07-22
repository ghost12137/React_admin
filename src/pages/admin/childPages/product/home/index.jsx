/**
 * product的默认子路由
 */
import React, { Component } from 'react';
import { 
  Card,
  Select,
  Input,
  Button,
  Table,
  message
 } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import LinkButton from '@/components/link-button';
import { getProducts, getProductsFromSearch, UpdateProductStatus } from "@/api/admin";
import { PAGE_SIZE } from "@/utils/constants";

const Option = Select.Option;

export class ProductHome extends Component {
  state = {
    total: 0,   //商品总数量
    products: [],   //商品数组
    tableColumns: [], //列表项
    loading: false, //是否在加载中
    searchType: 'productName', // 根据哪个字段搜索
    searchName: '', // 搜索的关键字
  };

  //初始化列表列
  initColumns = () => {
    const tableColumns = [
      {
        title: '商品名称',
        dataIndex: 'name',
      },
      {
        title: '商品描述',
        dataIndex: 'desc',
      },
      {
        title: '价格',
        dataIndex: 'price',
        render: (price) => '￥' + price
      },
      {
        width: 100,
        title: '状态',
        dataIndex: 'status',
        render: (status, _id) => {
          const newStatus = status === 1 ? 2 : 1;
          return (
            <span>
              <Button type="primary" onClick={() => { this.updateStatus(_id, newStatus) }}>{status === 1 ? '下架' : '上架'}</Button>
              <span>{status === 1 ? '在售' : '已下架'}</span>
            </span>
          )
        }
      },
      {
        width: 100,
        title: '操作',
        render: (product) => {
          return (
            <span>
              {/* 将product对象使用state传递给目标路由组件 */}
              <LinkButton onClick={() => this.props.history.push('/product/detail', { product })}>详情</LinkButton>
              <LinkButton onClick={() => this.props.history.push('/product/addupdate', product)}>修改</LinkButton>
            </span>
          )
        }
      },
    ];
    this.setState({ tableColumns});
  };
  //获取指定页码的列表数据
  getProducts = async (pageNum) => {
    this.pageNum = pageNum; //保存pageNum， 让其他方法可以看见
    this.setState({loading: true});
    const {searchName, searchType} = this.state;
    let result;
    if (searchName) {
      result = await getProductsFromSearch(pageNum, PAGE_SIZE, searchName, searchType);
    } else {
      result = await getProducts(pageNum, PAGE_SIZE);
    }
    this.setState({ loading: false });
    if (result.status === 0) {
      //取出分页状态
      const {total, list} = result.data;
      this.setState({
        total,
        products: list
      });
    }
  };
  //更新指定商品的状态
  updateStatus = async (productId, status) => {
    const result = await UpdateProductStatus(productId, status);
    if (result.status === 0) {
      //更新成功
      message.success('更新商品成功');
      this.getProducts(this.pageNum);
    } else {
      message.error('更新商品失败');
    }
  };

  componentDidMount() {
    this.initColumns();
    this.getProducts(1);
  };

  render() {
    const { products, tableColumns, total, loading, searchName, searchType } = this.state;

    const title = (
      <span>
        <Select 
          onChange={value => this.setState({searchType: value})}
          value={searchType}
          style={{width: 150}}>
          <Option value='productName'>按名称搜索</Option>
          <Option value='productDesc'>按描述搜索</Option>
        </Select>
        <Input style={{ width: 200, margin: '0 15px' }} placeholder="关键字" value={searchName} onChange={event => this.setState({searchName: event.target.value})}/>
        <Button type="primary" onClick={() => { this.getProducts(1)}} >搜索</Button>
      </span>
    );
    const extra = (
      <Button onClick={() => this.props.history.push('/product/addupdate')} icon={<PlusOutlined />} type="primary">
        添加商品
      </Button>
    );
    return (
      <Card title={title} extra={extra}>
        <Table
          bordered 
          loading={loading}
          rowKey="_id"
          dataSource={products}
          pagination={{ 
                        total, 
                        current: this.pageNum,
                        defaultPageSize: PAGE_SIZE, 
                        showQuickJumper: true, 
                        showSizeChanger: false,
                        onChange: this.getProducts
                      }}
          columns={tableColumns} />
      </Card>
    )
  }
}

export default ProductHome
