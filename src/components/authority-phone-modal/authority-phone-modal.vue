<template>
  <view>
    <view v-if="isShowAuthPhone" class="authority-phone-mask"></view>
    <view class="authority-phone-modal" v-if="isShowAuthPhone">
      <view class="authority-context">
        <view class="authority-title">授权头像、昵称</view>
        <view class="authority-rectangle">
          <image src="/static/images/logo.png" class="rectangle-image img"></image>
        </view>
       
        <view class="authority-phone"></view>
        <view class="authority-btns">
          <button class="btn" @click.stop="reject" v-if="isShowReject">取消</button>
          <button class="btn" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">
            确认
          </button>
          <!-- 头像 -->
          <!-- <button class="btn" @click="wechatLogin">确认</button> -->
        </view>
      </view>
    </view>
  </view>
</template>

<script>
/*
 * @Author: lusuqin
 * @Date: 2021-04-29 20:04:46
 * @LastEditors: lusuqin
 * @LastEditTime: 2021-05-14 13:25:58
 * @Description: file not
 */
import { Resource } from "../../server/resource-api";
import { ToastInfo } from "../../utils/util";
import { localStorage } from "../../utils/extend";
import { SK } from "../../utils/constant";
const app = getApp();
let _loginCode = "";
export default {
  data() {
    return {
      isShow: true,
    };
  },
  options: {
    multipleSlots: true, // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  props: {
    isShowAuthPhone: {
      type: Boolean,
      default: false,
    },
    isShowReject: {
      // 是否显示拒绝按钮
      type: Boolean,
      default: true,
    },
  },
  onShow() {
    this.wechatLogin();
  },
  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  beforeMount: function () {
    // #ifndef H5
    uni.login().then((res) => (_loginCode = res[1].code));
    // #endif
  },
  /**
   * 组件的方法列表
   */
  methods: {
    changeEvent: function (e) {
      this.$emit("customevent", {
        detail: e.currentTarget.dataset,
      });
    },
    reject: function (e) {
      this.$emit("closemodal", {
        detail: e == "success" ? "success" : false,
      });
    },
    // 用户昵称
    wechatLogin() {
      // 获取用户信息
      uni.getUserProfile({
        desc: "获取你的昵称、头像、地区及性别",
        success: (res) => {
          console.log(res);
          console.log(1);
        },
        fail: (res) => {
          console.log(2);
          console.log(res);
        },
      });
    },

    //手机号授权
    getPhoneNumber: function (e) {
      let { errMsg, encryptedData = "", iv = "" } = e.detail,
        params = {
          code: _loginCode,
          phonedata: encryptedData,
          iv: iv,
        };
      if (app.globalData["inviteUid"]) params["inviteuid"] = app.globalData["inviteUid"];
      console.log("授权params>>>", params);
      if (errMsg == "getPhoneNumber:ok") {
        Resource.addMobile
          .post({ type: "addMobile" }, params)
          .then((res) => {
            if (res.code == 1) {
              ToastInfo("授权成功"); // 更新标识符
              let {
                token,
                nickname,
                image,
                uid = "",
                hasmobile,
                uservipinfo = {},
              } = res.data;
              if (res.data) {
                localStorage.set({
                  [SK.TOKEN]: token,
                  [SK.NICK_NAME]: nickname,
                  [SK.USER_IMAGE]: image,
                  [SK.HAS_MOBILE]: hasmobile ? 1 : 0,
                  [SK.USER_UID]: uid,
                  [SK.USER_VIP_INFO]: JSON.stringify(uservipinfo),
                });
              }
              this.reject("success");
              this.getCarCount(); // 授权成功 更新购物车数量
            } else {
              ToastInfo((res && res.msg) || res.message);
              setTimeout(() => this.reject(), 1000);
            }
          })
          .catch((e) => {
            ToastInfo((e && e.msg) || e.message);
            this.reject();
          });
      } else this.reject();
    },
  },
};
</script>
<style scoped>
@import "./authority-phone-modal.css";
</style>
