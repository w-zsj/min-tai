<template>
  <view>
    <search-header />
    <view class="cates">
      <scroll-view class="cates_left" scroll-y="true">
        <view> AAAA </view>
      </scroll-view>
      <scroll-view class="cates_right">
        <view class="banner">
          <image src="/static/images/food.jpg">
        </view>
        <view class="list">
          <view class="title">
            <text class="line">/</text>
            <text decode>&emsp;张三&emsp;</text>
            <text class="line">/</text>
          </view>
          <view class="content">
            <view>
              <image src="/static/images/food.jpg" />
              <text>张三</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>
<style>
@import "./category.css";
</style>
<script src="./category.js"></script>