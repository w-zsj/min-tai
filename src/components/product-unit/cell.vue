<!--
 * @Author: TerryMin
 * @Date: 2022-02-14 15:04:09
 * @LastEditors: TerryMin
 * @LastEditTime: 2022-04-08 14:47:47
 * @Description: file not
-->

<template>
  <view>
    <view :class="['product-unit-item', className]" @click="toDetail">
      <view class="product-image">
        <image :src="item.pic" mode="scaleToFill" class="img"></image>
        <image v-if="item.videoFlag===1" src="/static/images/video.png" class="video-img"></image>
      </view>
      <view class="product-right-item">
        <view>
          <view class="product-title">
            <text class="new-price-tag" v-if="item.newStatus === 1">上新</text>
            <text class="price-tag" v-if="item.recommandStatus === 1 && item.newStatus !== 1">推荐</text>
            {{ item.name }}
          </view>
        </view>

        <view class="product-right-second">
          <view class="product-sale-price">{{ item.price || 0 }}</view>
          <view class="product-right-bottom">
            <view class="recommend-sale-number">销量 {{ item.sale || 0 }}</view>
            <image src="/static/images/add-btn-icon.png" class="add-cart-btn" @click.stop="changeEvent"></image>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script src="./cell.js"></script>

<style scoped>
@import "./cell.css";
</style>
