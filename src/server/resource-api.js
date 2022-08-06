/*
 * @Author: zhangsanjun 
 * @Date: 2022-07-25 11:01:10 
 * @Last Modified by: zhangsanjun
 * @Last Modified time: 2022-08-06 15:12:47
 */

import {
  HttpResource
} from './http-request';
import {
  SERVER
} from '../utils/constant.js';
const API_HOST = SERVER
const SERVICE_NAME = ``;
console.log('API_HOST', API_HOST)
export const Resource = {
  // open
  open: HttpResource(`${API_HOST}/open/:type`),
  //上传图片
  uploadImage: HttpResource(`${API_HOST}/oss/upload`),
  // 分类
  classifyList: HttpResource(`${API_HOST}/productClassify/:type`),
  // 首页
  home: HttpResource(`${API_HOST}/home/:type`),
  //商品
  product: HttpResource(`${API_HOST}/product/:type`),
  // 地址
  addAddress: HttpResource(`${API_HOST}/member/address/:type`),
  //订单
  order: HttpResource(`${API_HOST}/order/:type`),
  //购物车
  cart: HttpResource(`${API_HOST}/cart/:type`),
  //购物车-选中商品
  promotion: HttpResource(`${API_HOST}/cart/list/:type`),
  //购物车-修改商品数量
  updatePromotion: HttpResource(`${API_HOST}/cart/update/:type`),
  // 小程序支付
  pay: HttpResource(`${API_HOST}/pay/:type`),
};