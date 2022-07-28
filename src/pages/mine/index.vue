<template>
  <view class="mine-page">
    <view class="userInfo">
      <view class="left">
        <image class="" src="/static/images/nav_catetory.png"></image>
        <view class="sub_left">
          <text>17601330133</text>
          <view class="add-money">
            <text class="sub-money" decode>0金币</text>
            <text class="iconfont icon-quxiao1"></text>
            <text class="iconfont icon-chaoshi"></text>
          </view>
        </view>
      </view>
      <view class="right">
        <text>账号管理</text>
        <text class="iconfont icon-quxiao1"></text>
      </view>
    </view>
    <view class="uni-margin-wrap">
      <swiper class="swiper">
        <swiper-item>
          <view class="swiper-item uni-bg-red">
            <image src="https://api-hmugo-web.itheima.net/pyg/banner1.png" />
          </view>
        </swiper-item>
        <swiper-item>
          <view class="swiper-item uni-bg-green">
            <image src="https://api-hmugo-web.itheima.net/pyg/banner1.png" />
          </view>
        </swiper-item>
        <swiper-item>
          <view class="swiper-item uni-bg-blue">
            <image src="https://api-hmugo-web.itheima.net/pyg/banner1.png" />
          </view>
        </swiper-item>
      </swiper>
    </view>
    <!-- 菜单导航 -->
    <view class="nav">
      <view class="menus-item">
        <image src="/static/images/nav_selected_mine.png"></image>
        <text>全部订单</text>
      </view>
      <view class="menus-item">
        <image src="/static/images/nav_selected_mine.png"></image>
        <text>待付款</text>
      </view>
      <view class="menus-item">
        <image src="/static/images/nav_selected_mine.png"></image>
        <text>配送中</text>
      </view>
      <view class="menus-item">
        <image src="/static/images/nav_selected_mine.png"></image>
        <text>联系客服</text>
      </view>
    </view>
    <!-- 广告位 -->
    <view class="advertisement-container">
      <image
        class="advertisement-img"
        src="https://file.9jinhuan.com/mall/images/t/fe1067de5e2545d6b0f689116adbb16e.png"
      />
    </view>
    <!-- 地址 -->
    <view class="mine-address">
      <text>我的收货地址</text>
      <text>编辑</text>
    </view>
    <view class="address_info">
      <text>地址</text>
      <text>XXXXX小区</text>
    </view>
    <view class="address_info">
      <text>联系人</text>
      <text>大时代</text>
    </view>
    <view class="address_info">
      <text>联系电话</text>
      <text>17522222</text>
    </view>
    <view class="info-service">
      <text class="iconfont icon-quxiao1"></text>
      <text
        >如您购买的商品有任何问题，请与客服联系，客服会专门为你处理，让您售后无忧</text
      >
    </view>
    <view class="customer-service">
      <button type="warn" open-type="contact" size="default">联系客服</button>
    </view>
  </view>
</template>
<script>
export default {

  methods: {

  }
};
</script>
<style scoped>
@import "./mine.css";
</style>