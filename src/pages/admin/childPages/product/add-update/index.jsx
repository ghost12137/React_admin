/**
 * product的添加和更新的子路由
 */
import React, { Component } from 'react';
import { 
  Card,
  Form,
  Input,
  Cascader,
  Button,
  message,
 } from "antd";
import LinkButton from '@/components/link-button';
import { RollbackOutlined } from '@ant-design/icons';
import { getCategorys, AddOrUpdateProduct } from "../../../../../api/admin";
import PictruesWall from '../picture-wall';
import RichTextEditor from '../rich-text-editor'

const {Item} = Form;
const { TextArea } = Input;

export class ProductAddUpdate extends Component {

  state = {
    options: [],  //显示选择列表项
  };

  //用于加载下一级列表的回调函数
  loadData = async selectedOptions => {
    //得到选中的option对象
    const targetOption = selectedOptions[0];
    //显示获取下一级列表的loading图标
    targetOption.loading = true;

    //根据选择的分类，请求二级分类列表
    const subCategorys = await this.getCategorys(targetOption.value);
    if (subCategorys && subCategorys.length > 0) {
      const cOptions = subCategorys.map(c => ({
        value: c._id,
        label: c.name,
        isLeaf: true
      }));
      targetOption.children = cOptions;
    } else {  //当前选择的分类没有二级分类
      targetOption.isLeaf = true;
    }
    targetOption.loading = false;
    //更新options状态
    this.setState({
      options: [...this.state.options]
    });
  };

  //初始化列表选项
  initOptions = (categorys) => {
    //根据categorys生成option数组
    const options = categorys.map(c => ({
      value: c._id,
      label: c.name,
      isLeaf: false //假设不是叶子
    }));

    //如果是一个二级分类商品的更新
    const {isUpdate, product} = this;
    const {pCategoryId, categoryId} =product;
    if (isUpdate && pCategoryId !== '0') {
      //获取对应的二级分类列表
      const subCategorys = await this.getCategorys(pCategoryId);
      const childOptions = subCategorys.map(c => ({
        value: c._id,
        label: c.name,
        isLeaf: true
      }));

      //找到当前商品对应的一级option对象
      const targetOption = options.find(option => option.value === pCategoryId);

      //关联对应的一级option上
      targetOption.children = childOptions;
    }

    this.setState({options});
  };
  
  /**
   *获取一级/二级分类列表，并且显示
   */
  getCategorys = async (parentId) => {
    const result = await getCategorys(parentId);
    if (result.status === 0) {
      const categorys = result.data;
      if (parentId === '0') { //如果是一级列表
        this.initOptions(categorys);
      } else {//二级列表
        return categorys; //返回二级列表 ==>当前async函数返回的promise就会成功且返回结果为categorys
      }
    }
  };

  // 提交时的回调
  onFinish = async (values) => {
    const imgs = this.pw.current.getImgs();
    const detail = this.editor.current.getDetail();
    const { name, desc, price, categoryIds } = values;
    const pCategoryId = categoryIds[0];
    const categoryId = categoryIds[1];
    const product = { name, desc, price, imgs, detail, pCategoryId, categoryId };
    if (this.isUpdate) {
      product._id = this.product._id;
    }
    const result = await AddOrUpdateProduct(product);
    if (result.status === 0) {
      message.success(`${this.isUpdate ? '更新' : '添加'}商品成功`);
      this.props.history.goBack();
    } else {
      message.error(`${this.isUpdate ? '更新' : '添加'}商品失败`);
    }
  };

  //提交失败时的回调
  onFinishFailed = (errorInfo) => {
    message.error('提交失败');
    console.log('submit failed: ', errorInfo);
  };

  //判断进入该页面的是添加还是修改
  UNSAFE_componentWillMount() {
    let product;
    try {
      //取出携带的sate
      product = this.props.location.state;
    } catch {
      product = {};
    }
    this.product = product || {};
    //保存是否是更新的标识
    this.isUpdate = !!product;
  };

  componentDidMount() {
    this.getCategorys('0');
  };

  render() {
    const {isUpdate, product} = this;
    const title = (
      <span>
        <LinkButton onClick={() => this.props.history.goBack()}>
          <RollbackOutlined />
        </LinkButton>
        <span>{isUpdate ? '修改商品' : '添加商品'}</span>
      </span>
    );
    // 指定item布局的配置对象
    const formItemLayout = {
      labelCol: { span: 3 }, //左侧label宽度
      wrapperCol: { span: 8 }, //右侧包裹输入框宽度
    };
    //指定按钮布局的配置对象
    const tailLayout = {
      wrapperCol: { offset: 8, span: 16 },
    };

    //从商品对象中取出属性
    const {
      name,
      desc,
      price,
      detail,
      imgs,
      pCategoryId,
      categoryId
    } = product;

    //商品分类的id数组
    const categoryIds = [];
    if (isUpdate) {
      if (pCategoryId !== '0')  //商品是一个二级分类列表
        categoryIds.push(pCategoryId);
    }
    //二级分类列表
    categoryIds.push(categoryId);
    return (
      <Card title={title}>
        <Form 
          {...formItemLayout} 
          onFinish={this.onFinish} 
          onFinishFailed={this.onFinishFailed}
          >
          <Item 
            name="name"
            label="商品名称"
            initialValue={name}
            rules={[{
              required: true,
              message: '必须输入商品名称'
            }]}
            >
            <Input placeholder="请输入商品名称" />
          </Item>
          <Item name="desc" label="商品描述" initialValue={desc}>
            <TextArea placeholder="请输入商品描述" autoSize={{ minRows: 2,maxRows: 6 }} />
          </Item>
          <Item label="商品价格"
            name="price"
            initialValue={price}
            rules={[
              {
                required: true,
                message: '必须输入商品价格'
              },
              {
                validator: (_, value) => 
                  !value || value * 1 > 0 
                  ? Promise.resolve()
                  : Promise.reject(new Error('商品价格必须大于0'))
              }
            ]}
            >
            <Input type="number" placeholder="请输入商品价格" addonAfter="元" />
          </Item>
          <Item 
            label="商品分类"
            name="categoryIds"
            initialValue={categoryIds}
            rules={[{required: true, message: '必须选择商品类别'}]}
            >
            <Cascader
              placeholder="请选择"
              options={this.state.optiosn}  //需要显示的列表数据数组
              loadData={this.loadData}  //回调函数，当选择某个列表项时，加载下一级列表
            />
          </Item>
          <Item label="商品图片">
            <PictruesWall ref={c => this.pw = c} imgs={imgs} />
          </Item>
          <Item name="detail" label="商品详情">
            <RichTextEditor ref={c => this.editor = c} detail={detail} />
          </Item>
          <Item {...tailLayout}>
            <Button type="primary" htmlType="submit">提交</Button>
          </Item>
        </Form>
      </Card>
    )
  }
}

export default ProductAddUpdate
