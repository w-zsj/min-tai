<template>
  <view class="search-result">
    <!-- 搜索 -->
    <serachInput :changeValue="changeValue" :source="2" :keyword="keyword" @canl="canl"></serachInput>
    <view class="prd-list">
      <block v-for="(item, index) in prodList" :key="index">
        <view class="skeleton-rect">
          <product-unit className="catetory" :index="index" :itemClone="item" @customevent="customevent">
          </product-unit>
        </view>
      </block>
      <view class="empt flex-col-ctr" v-if="prodList.length == 0">
        <image class="_img" src="/static/images/add-empty-icon.png" mode=""></image>
        <view class="txt">暂无商品</view>
      </view>
      <view class="end flex-ctr" v-if="isEnd && prodList.length">—— 暂无更多商品 ——</view>
    </view>

    <!-- 加入购物车 -->
    <sku-modal v-if="selectSkuModalShow" :productId="productId" source="catetory" @close="selectSkuModalShow = false">
    </sku-modal>
    <!-- 授权手机号 -->
    <authority-phone-modal @closemodal="isShowAuthPhone=false" :isShowAuthPhone="isShowAuthPhone">
    </authority-phone-modal>
  </view>
</template>
<script src="./index.js"></script>
<style scoped lang="scss">
@import "./index.scss";
</style>
