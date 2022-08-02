<template>
  <view class="payment-voucher">
    <view class="code">
      <view class="tit flex-ctr">{{ source == 1 ? "支付码" : "充值码" }}</view>
      <view class="pic flex-ctr">
        <image class="img" show-menu-by-longpress src="" />
      </view>
    </view>
    <view class="desc flex-aic">
      点击咖啡馆黑客帝国河科大干哈考拉放大干哈看得见高开了个蝶恋蜂狂
      三个地块联建光电垃圾活动假单胞菌点击咖啡馆黑客帝国河科大干哈考拉放大干哈看得见高开了个蝶恋蜂狂三个地块联建光电垃圾活动假单胞菌
    </view>
    <view class="uploader">
      <view class="tit flex-ctr">上传支付凭证</view>
      <view class="flex-ctr">
        <gUploadPic :photoList="photoList" :max="1" @uploadCall="uploadCall"></gUploadPic>
      </view>
    </view>
  </view>
</template>
<script src="./index.js"></script>
<style scoped lang="scss">
@import "./index.scss";
</style>
