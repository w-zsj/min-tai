<template>
  <view class="payment-voucher">
    <view class="code">
      <view class="tit flex-ctr">{{ source == 1 ? "支付二维码" : "充值二维码" }}</view>
      <view class="pic flex-ctr">
        <image class="img" show-menu-by-longpress :src="payPic" />
      </view>
    </view>
    <view class="desc flex-aic">
      {{
        source == 1
          ? "请长按保存商家泰国银行收款二维码到手机相册自行转账支付后，上传支付成功截图，客服验证后即可完成订单支付。"
          : "请长按保存商家泰国银行收款二维码到手机相册，自行转账支付后，上传支付成功截图，客服验证后即可完成嗨币充值。泰铢和嗨币的充值兑换比例是1:1。(如您充值1000泰铢=1000嗨币)"
      }}
    </view>
    <view class="uploader">
      <view class="tit flex-ctr">{{ source == 1 ? "支付凭证" : "充值凭证" }}</view>
      <view class="flex-ctr">
        <gUploadPic :photoList="photoList" :max="1" @uploadCall="uploadCall"></gUploadPic>
      </view>
    </view>
    <view class="pay-btn flex-ctr" :class="payImageUrl?'':'disabled'" @click.stop="pay">
      {{ source == 1 ? "上传支付凭证" : "上传充值凭证" }}
    </view>
  </view>
</template>
<script src="./index.js"></script>
<style scoped lang="scss">
@import "./index.scss";
</style>
