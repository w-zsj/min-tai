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
          <view class="coupon-tag-list">
            <block v-if="item.couponDtoListuponDto && item.couponDtoListuponDto[0]">
              <text class="activity-tag" v-if="item.couponDtoListuponDto[0].couponType === 1">
                满{{ item.couponDtoListuponDto[0].minPoint }}减{{ item.couponDtoListuponDto[0].amount }}
              </text>
              <text class="activity-tag" v-if="item.couponDtoListuponDto[0].couponType === 2">
                满{{ item.couponDtoListuponDto[0].minPoint }}享{{ item.couponDtoListuponDto[0].discount }}折
              </text>
            </block>
            <view class="present-tag" v-if="item.isGift === 1">赠品</view>
          </view>
        </view>

        <view class="product-right-second">
          <view class="vip-price" v-if="item.memberSkuPrice">
            <view class="vip-price-number">{{ item.memberSkuPrice }}</view>
            <!-- promotionType活动类型 0:普通商品 1：秒杀商品 2：团购商品 4:新人活动商品 -->
            <image v-if="item.promotionType == 1" src="/static/images/flash-price-icon.png" class="flash-price-icon">
            </image>
            <image class="new-price-icon" v-else-if="item.promotionType == 4"
              src="//file.9jinhuan.com/mall/images/t/c5a74c3c4c954914b5c51a588d91df74.png">
            </image>
            <image v-else src="/static/images/vvip-icon.png" class="home-vip-icon"></image>
          </view>
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
@import './cell.css';
</style>
