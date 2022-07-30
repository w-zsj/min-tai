/*
 * @Author: zhangsanjun 
 * @Date: 2022-07-25 11:01:10 
 * @Last Modified by: zhangsanjun
 * @Last Modified time: 2022-07-30 16:28:16
 */

import {
  HttpResource
} from './http-request';
import {
  SERVER
} from '../utils/constant.js'; 
const API_HOST = SERVER
const SERVICE_NAME = `/api`;
export const Resource = {
  // token获取
  token: HttpResource(`${API_HOST}${SERVICE_NAME}/account/open/:type`),
  //获取手机号/api/account/userInfo/addMobile
  addMobile: HttpResource(`${API_HOST}${SERVICE_NAME}/account/userInfo/:type`),
  //上传图片
  uploadImage: HttpResource(`${API_HOST}${SERVICE_NAME}/file/oss/upload`),
  // 分类
  classifyList: HttpResource(`${API_HOST}${SERVICE_NAME}/mall-portal/productClassify/:type`),

};