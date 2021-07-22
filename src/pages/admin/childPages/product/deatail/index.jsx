/**
 * product的详情子路由
 */
import React, { Component } from 'react';
import { 
  Card,
  List,
  message
 } from "antd";
import { RollbackOutlined } from "@ant-design/icons";
import LinkButton from "@/components/link-button";
import { BASE_IMG_URL } from "@/utils/constants";
import { getCategory } from "../../../../../api/admin";

const Item = List.Item;

export class ProductDetail extends Component {

  state = {
    cName1: '', //一级分类名称
    cName2: '', //二级分类名称
  };

  async componentDidMount() {
    // 得到当前商品的分类ID
    const {pCategoryId, categoryId} = this.props.location.state.product;
    if (pCategoryId === '0') { //一级分类下的商品
      const result = await getCategory(categoryId);
      const cName1 = result.data.name;
      this.setState({cName1});
    } else {  //二级分类下的商品
      /* //多个await发送多个请求
      const result1 = await getCategory(pCategoryId);
      const result2 = await getCategory(categoryId);
      const cName1 = result1.data.name;
      const cName2 = result2.data.name;
      this.setState({
        cName1,
        cName2
      }); */
      // 一次发送多个请求，只有都成功了才处理
      const results = await Promise.all([getCategory(pCategoryId), getCategory(categoryId)]);
      if (results[0].status === 0 && results[1].status === 0) {//全部发送成功
        const cName1 = results[0].data.name;
        const cName2 = results[1].data.name;
        this.setState({
          cName1,
          cName2
        });
      } else {//请求失败
        message.error("请求分类失败");
      }
    }
  };

  render() {
    const title = (
      <span>
        <LinkButton>
          <RollbackOutlined 
            style={{ color: '#0f0', marginRight: 15, fontSize: 20 }} 
            onClick={() => this.props.history.goBack()}
            />{" "}
        </LinkButton>
        <span>商品详情</span>
      </span>
    );

    // 读取携带过来的state数据
    const { name, desc, price, detail, imgs } = this.props.location.state.product;
    const { cName1, cName2 } = this.state;

    return (
      <Card
        className="product-detail"
        title={title}
        >
        <List>
          <Item>
            <span className="left">商品名称：</span>
            <span>{name}</span>
          </Item>

          <Item>
            <span className="left">商品描述：</span>
            <span>{desc}</span>
          </Item>

          <Item>
            <span className="left">商品价格：</span>
            <span>{price}元</span>
          </Item>

          <Item>
            <span className="left">所属分类：</span>
            <span>{cName1}{cName2 ? '-->' + cName2 : ''}</span>
          </Item>

          <Item>
            <span className="left">商品图片：</span>
            <span>
              {/* <img className="product-img" src="https://img2cdn.clubstatic.lenovo.com.cn/pic/22595275629664/0" alt="img"/>
              <img className="product-img" src="https://img2cdn.clubstatic.lenovo.com.cn/pic/22595275629664/0" alt="img"/> */}
              {
                imgs.map(img => (
                  <img className="product-img" 
                    key={img}
                    src={BASE_IMG_URL + img}
                    alt="img" 
                  />
                ))
              }
            </span>
          </Item>

          <Item>
            <span className="left">商品详情：</span>
            <span dangerouslySetInnerHTML={{ __html: detail}}></span>
          </Item>
        </List>
      </Card>
    )
  }
}

export default ProductDetail
