<template>
  <view>
    <!-- 收货地址部分 -->
    <view class="address">
      <text class="iconfont icon-search"></text>
      <view class="address2-bottom">湖南省长沙市</view>
    </view>
    <!-- 购物车标题 -->
    <view class="cart-title"></view>
    <!-- 购物车元素列表 -->
    <view class="cart">
      <view class="cart1">
        <checkbox-group>
          <checkbox checked></checkbox>
        </checkbox-group>
      </view>
      <view class="cart2">
        <image mode="widthFix" src="/static/images/food.jpg"></image>
      </view>
      <view class="cart3">
        <view class="cart3-top line2">散装土鸡蛋</view>
        <view class="cart3-center">40斤 正负25g</view>
        <view class="cart3-bottom">
          <view class="price">¥ 28.8</view>
          <view class="edit">
            <view class="calc" bindtap="setCount">-</view>
            <view class="num">1</view>
            <view class="calc" bindtap="setCount">+</view>
          </view>
        </view>
      </view>
    </view>
    <view class="cart">
      <view class="cart1">
        <checkbox-group>
          <checkbox checked></checkbox>
        </checkbox-group>
      </view>
      <view class="cart2">
        <image mode="widthFix" src="/static/images/food.jpg"></image>
      </view>
      <view class="cart3">
        <view class="cart3-top line2">散装土鸡蛋</view>
        <view class="cart3-center">40斤 正负25g</view>
        <view class="cart3-bottom">
          <view class="price">¥ 28.8</view>
          <view class="edit">
            <view class="calc" bindtap="setCount">-</view>
            <view class="num">1</view>
            <view class="calc" bindtap="setCount">+</view>
          </view>
        </view>
      </view>
    </view>
    <!-- 底部工具 -->
    <view class="tool">
      <view class="tool1">
        <checkbox-group>
          <checkbox checked>全选</checkbox>
        </checkbox-group>
      </view>
      <view class="tool2">
        <view class="tool2-top">
          合计:
          <text>¥ 57.6</text>
        </view>
      </view>
      <view class="tool3" bindtap="goPay">去结算(2)</view>
    </view>
  </view>
</template>
<style>
@import "./mall.css";
</style>