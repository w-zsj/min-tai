<template>
  <view>
    <view class="list" @click.stop="toDetail(copyItem.orderSn)" v-if="copyItem.orderSn">
      <view class="header flex-aic-btwn">
        <view class="order-no">订单号:{{ copyItem.orderSn }}</view>
        <view class="status"> {{ orderStatus[copyItem.status] }}</view>
      </view>
      <view class="item">
        <view>
          <view class="flex-aic-btwn subItem" v-for="goodsItem in copyItem.list" :key="goodsItem.id">
            <view class="pic">
              <image class="img" :src="goodsItem.productPic" />
            </view>
            <view class="base-info flex-col-btwn">
              <view class="name">
                <view class="ellip">
                  {{ goodsItem.productName }}
                </view>
                <view class="sku">
                  <block class="wine-size" v-for="(attItem, attIndex) in goodsItem.productAttrList" :key="attIndex">
                    {{ attItem.key }}:{{ attItem.value }}
                  </block>
                </view>
              </view>
              <view class="timer">下单时间 {{ copyItem.createTime }}</view>
            </view>
            <view class="price flex-col">
              ฿&nbsp;{{ goodsItem.productPrice||0 }}
              <view class="count">x{{ goodsItem.productQuantity || 1 }}</view>
            </view>
          </view>
        </view>
        <!-- 实付款 -->
        <view class="real-payment flex-aic-btwn">
          <view class="count">已使用金币 {{copyItem.useCoin||0}}</view>
          <view>
            <text class="count">共{{ copyItem.count || 0 }}件,</text>
            <text class="txt">实付款</text>
            <text class="money">
              <text class="rb">฿</text>
              &nbsp; <text class="price-int">{{ copyItem.priceInt }}</text>
              <text class="price-point">{{ copyItem.pricePoint }}</text>
            </text>
          </view>
        </view>
        <!-- wait-pay -->
        <view class="flex-end">
          <view class="handel-btn" v-if="copyItem.status == 4 || copyItem.status == 5"
            @click.stop="handleBtnOrder(copyItem, 'again')">
            再次购买
          </view>
          <view class="handel-btn" v-if="copyItem.status == 3"
            @click.stop="handleBtnOrder(copyItem, 'confirmReceiveOrder')">
            确认收货
          </view>
          <view class="handel-btn" v-if="copyItem.status == 0"
            @click.stop="handleBtnOrder(copyItem, 'cancelUserOrder')">取消订单
          </view>
          <view class="handel-btn wait-pay" v-if="copyItem.status == 0" @click.stop="handleBtnOrder(copyItem, 'pay')">
            待付款
            <text v-if="copyItem.countDown">
              {{ copyItem.date.m }}:{{ copyItem.date.s }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
import { customCountDown } from "@/utils/countDown.js";
import { _clone } from "@/utils/util.js";
let _;
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
    handleBtnOrder: {
      type: Function,
      default: () => { },
    },
  },
  data() {
    _ = this;
    let clearTimer = clearTimer + "_" + _.index;
    return {
      copyItem: {},
      clearTimer,
      orderStatus: {
        0: "待付款",
        1: "待审核",
        2: "审核失败待付款",
        3: "待收货",
        4: "已取消",
        5: "已收货",
      },
    };
  },
  watch: {
    item: {
      handler: function (newVal, oldVal) {
        // let copyItem = { ..._clone(newVal || {}) };
        this.copyItem = newVal;
        if (_.clearTimer) clearTimeout(_.clearTimer);
        if (newVal.status == 0 && newVal.countDown) {
          customCountDown(
            { time: newVal.countDown, type: "m" },
            (d, T) => {
              newVal["date"] = d;
              this.copyItem = newVal;
              this.$set(this.copyItem, "date", d);
              // console.log("date", d, this.copyItem);
              this.clearTimer = T;
              clearTimeout(T);
              this.$forceUpdate();
            },
            (d) => {
              console.log("d---", d == "end");
              if (_.clearTimer) clearTimeout(_.clearTimer);
            }
          );
        }
      },
      immediate: true,
      deep: true,
    },
  },
  mounted() { },
  methods: {
    toDetail(orderSn) {
      _.$to(`order-detail/index?orderSn=${orderSn}`);
    },
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
    padding-bottom: 32rpx;
    border-bottom: 1px solid #d7cbcb;
    .status {
      color: #a7002d;
      font-weight: normal;
    }
  }
  .item {
    .subItem {
      margin-bottom: 20rpx;
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
          white-space: nowrap;
        }
      }
      .price {
        height: 138rpx;
        font-size: 28rpx;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: bold;
        color: #272727;
        .integral {
          font-size: 28rpx;
          font-weight: 400;
          color: #808080;
        }
        .integral .red {
          color: #a7002d !important;
        }

        .count {
          height: 40rpx;
          font-size: 28rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #808080;
          line-height: 40rpx;
        }
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
        .price-int {
          font-size: 30rpx;
          font-family: OPPOSans-H, OPPOSans;
          font-weight: normal;
          color: #272727;
          font-weight: 500;
        }
        .price-point {
          font-size: 20rpx;
          font-family: OPPOSans-H, OPPOSans;
          font-weight: normal;
          color: #272727;
          font-weight: 500;
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
      margin-left: 16rpx;
      &.wait-pay {
        color: #fff;
        background: #a7002d;
        border: 0;
      }
    }
  }
}
</style>
