<template>
  <view class="search-result">
    <!-- 搜索 -->
    <serachInput :changeValue="changeValue" :source="2"></serachInput>
    <view class="prd-list">
      <block v-for="(item, index) in prodList" :key="index">
        <view class="skeleton-rect">
          <product-unit
            className="catetory"
            :index="index"
            :itemClone="item"
            @customevent="customevent"
          >
          </product-unit>
        </view>
      </block>
    </view>

    <!-- 加入购物车 -->
    <sku-modal
      v-if="selectSkuModalShow"
      :productId="item.id"
      source="catetory"
      @close="selectSkuModalShow = false"
    >
    </sku-modal>
    <!-- 授权手机号 -->
    <authority-phone-modal
      @closemodal="isShowAuthPhone=false"
      :isShowAuthPhone="isShowAuthPhone"
    ></authority-phone-modal>
  </view>
</template>
<script src="./index.js"></script>
<style scoped lang="scss">
@import "./index.scss";
</style>
