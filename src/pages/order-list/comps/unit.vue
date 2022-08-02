<template>
  <view class="list">
    <view class="header flex-aic-btwn">
      <view class="order-no">订单号:</view>
      <view class="status"> 待付款 </view>
    </view>
    <view class="item">
      <view class="flex-aic-btwn">
        <view class="pic">
          <!-- <image class='img' src="" /> -->
        </view>
        <view class="base-info flex-col-btwn">
          <view class="name">
            <view class="ellip"
              >尽快回复都快死了恢复了双打卡合法尽快回复都快死了恢复了双打卡合法</view
            >
            <view class="sku">规格1斤</view>
          </view>
          <view class="timer">下单时间 2022-08-01</view>
        </view>
        <view class="price flex-col">
          <view>฿&nbsp;333</view>
          <view class="count">x2</view>
        </view>
      </view>
      <!-- 实付款 -->
      <view class="real-payment flex-end">
        <text class="count">共2件,</text>
        <text class="txt">实付款</text>
        <text class="money">
          <text class="rb">฿</text>
          &nbsp;430
        </text>
      </view>
      <!-- wait-pay -->
      <view class="flex-end">
        <view class="handel-btn wait-pay">
          待付款
          {{ copyItem.date.h }}:{{ copyItem.date.m }}:{{ copyItem.date.s }}
        </view>
      </view>
    </view>
  </view>
</template>
<script>
import { customCountDown } from "@/utils/countDown.js";
import { _clone } from "@/utils/util.js";
export default {
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
    index: {
      type: Number,
      default: 0,
    },
  },
  data() {
    let copyItem = { ..._clone(this.item || {}), date: {} };
    let clearTimer = clearTimer + "_" + this.index;
    return {
      copyItem: copyItem,
      clearTimer,
    };
  },
  mounted() {
    let _ = this;
    // customCountDown(
    //   { time: _.copyItem.time, type: "h" },
    //   (d, T) => {
    //     _.$set(_.copyItem, "date", d);
    //     console.log(_.copyItem);
    //     _.clearTimer = T;
    //     clearTimeout(T);
    //   },
    //   (d) => {
    //     console.log("d---", d == "end");
    //     if (_.clearTimer) clearTimeout(_.clearTimer);
    //   }
    // );
  },
};
</script>
<style scoped lang="scss">
.list {
  .ellip {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .header {
    font-size: 32rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: bold;
    color: #272727;
    margin-bottom: 40rpx;
    .status {
      color: #a7002d;
      font-weight: normal;
    }
  }
  .item {
    .pic {
      width: 138rpx;
      height: 138rpx;
      border-radius: 8rpx;
      background: #272727;
      margin-right: 32rpx;
      .img {
        display: block;
        width: 100%;
        height: 100%;
      }
    }
    .base-info {
      width: 306rpx;
      height: 138rpx;
      .name {
        width: 100%;
        font-size: 28rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #272727;
        margin-bottom: 18rpx;
        .sku {
          display: inline-block;
          background: #fafafa;
          border-radius: 4px;
          padding: 4rpx 8rpx;
          border-radius: 4rpx;
          font-size: 22rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #808080;
        }
      }

      .timer {
        font-size: 24rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #272727;
      }
    }
    .price {
      height: 138rpx;
      font-size: 28rpx;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: bold;
      color: #272727;
      .count {
        height: 40rpx;
        font-size: 28rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #808080;
        line-height: 40rpx;
      }
    }
    .real-payment {
      margin: 32rpx 0;
      align-items: center;
      .count {
        font-size: 28rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #808080;
      }
      .txt {
        font-size: 32rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: bold;
        color: #272727;
        padding-right: 10rpx;
      }
      .money {
        font-size: 36rpx;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: bold;
        color: #272727;
        .rb {
          font-size: 24rpx;
          padding-right: 10rpx;
        }
      }
    }
    .handel-btn {
      height: 68rpx;
      border: 1px solid #807b7b;
      border-radius: 34rpx;
      padding: 14rpx 28rpx;
      font-size: 28rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #272727;
      &.wait-pay {
        color: #fff;
        background: #a7002d;
        border: 0;
      }
    }
  }
}
</style>
