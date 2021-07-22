import React, { Component, lazy, Suspense } from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";

//引入组件
//登录
const Login = lazy(() => import('@/pages/login'));
//主页
const Admin = lazy(() => import('@/pages/admin'));


class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <Switch>
            <Route path="/login" component={Login}></Route>
            <Route path="/" component={Admin}></Route>
          </Switch>
        </Suspense>
      </BrowserRouter>
    );
  }
}

export default App;