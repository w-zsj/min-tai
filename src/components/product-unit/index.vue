<template>
  <view class="product-unit">
    <view class="pic flex-ctr">
      <image
        src="http://www.youtaidu.com/uploads/down/20210529094352103.jpg"
        mode="widthFix"
      />
    </view>
    <view class="flex-aic-btwn">
      <view class="product-info">
        <view class="product-name ellip">
          火锅店缸发动机身高多少估计合计过火锅店缸发动机身高多少估计合计过
        </view>
        <view class="get-product-date">提货时间8月21日</view>
        <view class="product-price">
          <text class="mark-price">
            <text class="txt">市场价:</text><text class="rb">฿</text>88
          </text>
          <text class="origin-price">฿888</text>
        </view>
        <view class="sale-count">已售3700件</view>
      </view>
      <view class="add-car flex-ctr">加入购物车</view>
    </view>
  </view>
</template>
<script>
export default {};
</script>
<style scoped lang="scss">
.product-unit {
  background: #fff;
  border-radius: 16rpx;
  padding: 32rpx;
  .pic {
    height: 300rpx;
    overflow: hidden;
    margin-bottom: 24rpx;
    border-radius: 16rpx;
  }
  .product-name {
    font-size: 28rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #272727;
    width: 200px;
  }

  .product-info {
    flex: 1;
    padding-right: 32rpx;
    font-size: 28rpx;
    color: #272727;
    .get-product-date {
      margin: 20rpx 0;
      color: #333;
    }
    .product-name {
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
    }
    .product-price {
      font-size: 28rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #808080;
      .mark-price {
        font-size: 40rpx;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: bold;
        color: #a7002d;
        padding-right: 20rpx;
        .txt {
          font-size: 28rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #a7002d;
        }
      }
      .origin-price {
        text-decoration: line-through;
      }
      .rb {
        font-size: 28rpx;
      }
    }
    .sale-count {
      font-size: 28rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #808080;
    }
  }
  .add-car {
    width: 230px;
    height: 80rpx;
    background: #a7002d;
    border-radius: 40rpx;
    font-size: 28rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #ffffff;
  }
  .ellip {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
}
</style>
