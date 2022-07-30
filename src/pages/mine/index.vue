<template>
  <view class="mine-page">
    <view class="userInfo flex-aic-btwn">
      <view class="user flex-aci">
        <view class="header">
          <image src="/static/images/logo.png" />
        </view>
        <view class="flex-col-btwn">
          <view class="phone">17601335937</view>
          <view class="gold flex-aic-ard">
            <view class="flex-aic">
              <image class="gold_icon" src="/static/images/gold_icon.png" />
              <view>90</view>
            </view>
            <image class="arrow_icon" src="/static/images/arrow_icon.png" />
          </view>
        </view>
      </view>
      <view class="account-management flex-aic">
        <text>账户管理</text>
        <image class="arrow_icon" src="/static/images/arrow_icon.png" />
      </view>
    </view>
    <view class="cont">
      <!-- 轮播 -->
      <mySwiper :bannerList="bannerList" :bannerTap="bannerTap"></mySwiper>
      <!-- 菜单导航 -->
      <view class="menu flex-aic-btwn">
        <view class="menu-item flex-col-ctr">
          <view class="icon flex-ctr">
            <image class="" src="/static/images/order_icon.png" />
          </view>
          <view>全部订单</view>
        </view>
        <view class="menu-item flex-col-ctr">
          <view class="icon flex-ctr">
            <image class="" src="/static/images/pending_payment_icon.png" />
          </view>
          <view>待付款</view>
        </view>
        <view class="menu-item flex-col-ctr">
          <view class="icon flex-ctr">
            <image class="" src="/static/images/shipping_address_icon.png" />
          </view>
          <view>收货地址</view>
        </view>
        <view class="menu-item flex-col-ctr">
          <view class="icon flex-ctr">
            <image class="" src="/static/images/customer_service_icon.png" />
          </view>
          <view>联系客服</view>
        </view>
      </view>
      <!-- 广告位 -->
      <view class="advertisement-container">
        <image
          class="advertisement-img"
          src="https://file.9jinhuan.com/mall/images/t/fe1067de5e2545d6b0f689116adbb16e.png"
        />
      </view>

      <!-- 描述 -->
      <view class='desc'>如果您购买的商品有任何问题,请于客服联系,客服会专门为您处理,让您售后无忧。</view>
      <!-- 客服 -->
      <view class="customer-service flex-ctr"> 联系客服 </view>
    </view>
  </view>
</template>
<script>
import mySwiper from "@comps/my-swiper/index.vue";
export default {
  components: { mySwiper },
  data() {
    return {
      bannerList: new Array(6),
    };
  },
  methods: {
    // 轮播图点击
    bannerTap: function (url, type) {
      const urlTypeArr = [1, 4]; //小程序内页面跳转
      const tabBarPages = [
        "/pages/mall/index",
        "/pages/category/index",
        "/pages/home/index",
      ]; //tabar页面
      if (tabBarPages.includes(url)) {
        uni.switchTab({ url: url });
      } else {
        uni.navigateTo({ url: url });
      }
    },
  },
};
</script>
<style scoped lang="scss">
@import "./index.scss";
</style>
