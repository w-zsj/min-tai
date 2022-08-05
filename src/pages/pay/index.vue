<template>
  <view class="pay">
    <view class="title">
      <view class="txt flex-ctr">支付金额</view>
      <view class="money flex-ctr"> ฿ {{ payAmount }} </view>
      <view class="order-sn flex-aic-btwn">
        <view>订单编号</view>
        <view>{{ orderSn }}</view>
      </view>
    </view>
    <view class="pay-type">
      <view class="tit flex-ctr">支付方式</view>
      <view class="list">
        <view class="item flex-aic-btwn" v-for="(item, idx) in list" :key="idx">
          <view class="flex-aic">
            <image class="img" :src="item.icon" />
            {{ item.title }}
          </view>
          <view @click.stop="changeSelect(item)" style="height: 100%">
            <view class="checkbox" :class="curStatus == item.id ? 'act' : ''"></view>
          </view>
        </view>
      </view>
    </view>
    <view class="pay-btn flex-ctr" @click.stop="pay">去支付</view>
  </view>
</template>
<script src="./index.js"></script>
<style scoped lang="scss">
@import "./index.scss";
</style>
