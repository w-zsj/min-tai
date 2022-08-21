<template>
  <view class="order-list">
    <!-- 菜单 -->
    <view class="nav flex-aic-ard">
      <view class="list flex-ctr" :class="curIdx == idx ? 'act' : ''" v-for="(item, idx) in statusOptions" :key="idx"
        @click.stop="selectTab(item, idx)">
        <text>{{ item.label }}</text>
      </view>
    </view>
    <!-- 列表 -->
    <view class="product-list">
      <view class="loop" v-for="(item, idx) in list" :key="idx">
        <unit :item="item" :index="idx" :handleBtnOrder="handleBtnOrder"></unit>
      </view>
    </view>
    <view class="loading" v-if="isend && list.length">已加载全部</view>
    <view class="empt flex-col-ctr" v-if="list.length == 0">
      <image class="_img" src="/static/images/add-empty-icon.png" mode=""></image>
      <view class="txt">暂无数据</view>
    </view>
  </view>
</template>
<script src="./index.js"></script>
<style scoped lang="scss">
@import "./index.scss";
</style>
