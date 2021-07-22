/**
 admin页面中有关的api
 */
import { message } from "antd";
import request from './request';
// import axios from 'axios';
import jsonp from "jsonp";

//获取weather天气数据
export const getWeather = city => {
  return new Promise((resolve, reject) => {
    const url = `http://restapi.amap.com/v3/weather/weatherInfo?key=98c97d10c1fda37bdc5402d15c1cdd71&city=${city}`;
    jsonp(url, {}, (err, data) => {
      //   console.log(err, data);
      if (!err && data.status === "1") {
        const { weather } = data.lives[0];
        resolve({ weather });
      } else {
        message.error("天气获取失败");
      }
    });
  });
};

/**
 * category
 */
//#region 
//获取分一级二级页列表
export const getCategorys = (parentId) => {
  return request({
    url: '/manage/category/list',
    method: 'GET',
    params: {parentId}
  });
};
//添加分类
export const AddCategory = (categoryName, parentId) => {
  return request({
    url: '/manage/category/add',
    method: 'POST',
    data: { categoryName, parentId }
  });
};
//更新分类
export const UpdateCategory = (categoryId, categoryName) => {
  return request({
    url: '/manage/category/update',
    method: 'POST',
    data: { categoryId, categoryName }
  });
};
//获取一个分类
export const getCategory = (categoryId) => {
  return request({
    url: '/manage/category/info',
    method: 'GET',
    params: {
      categoryId
    },
  });
};
//#endregion

/**
 * product
 */
//#region 
// 获取商品分页列表
export const getProducts = (pageNum, pageSize) =>{
  return request({
    url: '/manage/product/list',
    method: 'GET',
    params: {
      pageNum,
      pageSize
    }
  });
};
//搜索商品分页列表(根据商品名称)
export const getProductsFromSearch = (pageNum, pageSize, searchName, searchType) => {
  return request({
    url: '/manage/product/search',
    method: 'GET',
    params: {
      [searchType]: searchName,
      pageNum,
      pageSize
    }
  });
};
// 更新商品的状态(上架/下架)
export const UpdateProductStatus = (productId, status) => {
  return request({
    url: '/manage/product/updateStatus',
    method: 'POST',
    data: {
      productId,
      status
    },
  });
};

// 删除商品图片
export const DeleteImg = (name) => {
  return request({
    url: '/manage/img/delete',
    method: 'POST',
    data: {
      name
    },
  });
};

// 添加或更新商品
export const AddOrUpdateProduct = (product) => {
  return request({
    url: '/manage/product/' + (product._id ? 'update' : 'add'),
    method: 'POST',
    data: {
      product
    }
  });
};
//#endregion

/**
 * role
 */
//#region 
// 获取所有角色的列表
export const getRoles = () =>{
  return request({
    url: '/manage/role/list',
    method: 'GET'
  });
};

// 添加角色
export const AddRole = (name) => {
  return request({
    url: '/manage/role/add',
    method: 'POST',
    data: {
      name
    },
  });
};

// 设置角色权限
export const setRole = (role) => {
  return request({
    url: '/manage/role/update',
    method: 'POST',
    data: role,
  });
};
//#endregion

/**
 * users
 */
//#region 
// 获取用户列表
export const getUsers = () => {
  return request({
    url: '/manage/user/list',
    method: 'GET'
  });
}; 

// 删除指定用户
export const deleteUser = (userId) => {
  return request({
    url: '/manage/user/delete',
    method: 'POST',
    data: {
      userId
    },
  });
};

// 添加或修改用户
export const addOrUpdateUser = (user) => {
  return request({
    url: `/manage/user/${user._id ? 'update' : 'add'}`,
    method: 'POST',
    data: user
  });
};
//#endregion


