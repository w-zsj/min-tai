<template>
  <view class="goods-detail-page">
    <view class="tab-container">
      <view :class="{ 'tab-item': true, 'black-text-color': currTabIndex == index }" v-for="(item, index) in tabMenu"
        :key="index" @click="goAnchor(item.ele, index)">{{ item.title }}</view>
    </view>
    <view class="goods-detail">
      <!-- 轮播图 -->
      <swiper-component :detail="detail" :imageList="imageList"></swiper-component>
      <view class="context-container">
        <view class="basic-detail-container">
          <view class="common-row row-one">
            <view class="price-container">
              <block>
                <text class="price-unit"> ฿ </text>
                <text class="price-number">
                  {{ detail.price ? detail.price : "暂无报价" }}
                </text>
                <text class="price-onsale no-line" v-if="detail.price != detail.originalPrice">
                  市场价
                </text>
                <text class="price-onsale" v-if="
                    detail.originalPrice &&
                    detail.originalPrice != 'null' &&
                    detail.price != detail.originalPrice
                  ">
                  ฿{{ detail.originalPrice }}
                </text>
              </block>
            </view>
            <view class="buy-user" v-if="detail.isDetailDisplay">
              已销售{{ detail.sale || 0 }}件
            </view>
            <view class="count-empty" v-if="!detail.isDetailDisplay">
              已售完，待卖家补货
            </view>
          </view>

          <view class="common-row row-three">
            <view class="wine-name">{{ detail.name }}</view>
          </view>
        </view>
        <view class="detail-property-container" v-if="propertyList.length">
          <view class="common-row">
            <view class="flex-aic text-ellipsis">
              <text class="common-label">参数</text>
              <view class="common-text-style text-ellipsis">
                <block v-for="(item, index) in propertyList" :key="index">
                  <text class="property-name">{{ item.name }}</text>
                </block>
              </view>
            </view>
            <image class="right-arrow" src="/static/images/arrow_icon.png"></image>
          </view>
        </view>
        <!-- 商品详情 -->
        <view class="detail-text">
          <image src="@/static/images/detail_title_icon.png" class="detail-icon"></image>
          <text class="detail-title-text">商品详情</text>
          <image src="@/static/images/detail_title_icon.png" class="detail-icon"></image>
        </view>
      </view>
      <view class="context-image" v-if="detail.detailMobileHtml">
        <mp-html :content="detail.detailMobileHtml" />
      </view>
      <!-- 底部按钮 -->
      <footer-component :detail="detail" @selectSku="selectSku"></footer-component>
    </view>

    <!-- 规格选择 -->

    <sku-modal v-if="selectSkuModalShow" :expand="expand" :productId="detail.id" source="product-detail"
      @close="closeSkuModal"></sku-modal>
    <!-- 授权手机号 -->
    <authority-phone-modal v-if="isShowAuthPhone" @closemodal="closeModal" :isShowAuthPhone="isShowAuthPhone">
    </authority-phone-modal>
  </view>
</template>
<script src="./index.js"></script>
<style scoped>
@import "./index.css";
</style>
