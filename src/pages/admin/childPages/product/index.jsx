/**
 * admin的商品管理页面
 */
import React, { Component } from 'react';
import { Switch, Route } from "react-router-dom";

import ProductHome from './home';
import ProductAddUpdate from './add-update';
import ProductDetail from './deatail';
import './product.less'

export class Product extends Component {
  render() {
    return (
      <Switch>
        <Route path="/product/addupdate" component={ProductAddUpdate} />
        <Route path="/product/detail" component={ProductDetail} />
        <Route path="/product" component={ProductHome} />
      </Switch>
    )
  }
}

export default Product
