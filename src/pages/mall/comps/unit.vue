<template>
  <view class="c-list flex-aic">
    <view @click.stop="changeSelect(item)" style="height:100%;">
      <view class="checkbox"></view>
    </view>
    <view class="pic">
      <!-- <image src="" /> -->
    </view>
    <view class="base-info flex-col-btwn">
      <view>
        <view class="name ellip">大华股份绝对是规范甲方大华股份绝对是规范甲方大华股份绝对是规范甲方</view>
        <view class="sku">规格22</view>
      </view>
      <view class="price"><text class="rb">฿</text>77777</view>
      <view class="add-num flex-aic">
        <view class="div flex-ctr">-</view>
        <input type="number" v-model="count" />
        <view class="add flex-ctr">+</view>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  props: {
    changeSelect: {
      type: Function,
      default: () => {},
    },
    item: {
      type: Object,
      default: () => ({}),
    },
  },
};
</script>
<style scoped lang="scss">
.c-list {
  padding: 32rpx;
  background: #fff;
  border-radius: 8rpx;
  .checkbox {
    width: 30rpx;
    height: 30rpx;
    border: 1px solid #807b7b;
    border-radius: 50%;
    margin-right: 32rpx;
  }
  .pic {
    width: 154rpx;
    height: 154rpx;
    border-radius: 4rpx;
    background: #e4e2e2;
    margin-right: 32rpx;
    image {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
  .base-info {
    height: 154rpx;
    position: relative;
    .name {
      font-size: 28rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #272727;
      line-height: 40rpx;
      width: 350rpx;
    }
    .sku {
      background: #fafafa;
      border-radius: 4rpx;
      padding: 2rpx 8rpx;
      font-size: 24rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #807b7b;
      display: inline-block;
    }
    .price {
      .rb {
        font-size: 24rpx;
        font-family: OPPOSans-M, OPPOSans;
        font-weight: normal;
        color: #a7002d;
        line-height: 32rpx;
        margin-right: 6rpx;
      }
      font-size: 30rpx;
      font-family: OPPOSans-H, OPPOSans;
      font-weight: bold;
      color: #a7002d;
      line-height: 48rpx;
    }
    .add-num {
      border-radius: 4rpx;
      height: 50rpx;
      border: 1px solid #e4e2e2;
      position: absolute;
      right: 0;
      bottom: 0;
      .div {
        width: 50rpx;
        height: 50rpx;
        font-size: 20px;
        color: #ccc9c9;
        border-right: 1px solid #e4e2e2;
      }
      .add {
        width: 50rpx;
        height: 50rpx;
        font-size: 20px;
        color: #ccc9c9;
        border-left: 1px solid #e4e2e2;
      }
      input {
        width: 70rpx;
        font-size: 24rpx;
        font-family: OPPOSans-H, OPPOSans;
        font-weight: bold;
        color: #272727;
        line-height: 30px;
        padding-left: 6rpx;
      }
    }
  }
}
</style>
