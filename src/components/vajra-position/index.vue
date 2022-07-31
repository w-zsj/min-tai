<template>
  <view class="vajra-position">
    <view class="list" v-for="(item, idx) in list" :key="idx">
      <view class="item">
        <view class="pic flex-ctr">
          <image
            src="https://img0.baidu.com/it/u=1554123735,539862863&fm=253&fmt=auto&app=120&f=JPEG?w=1080&h=717"
          />
        </view>
        <view class="name">蔬菜</view>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  props: {
    list: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {};
  },
};
</script>
<style scoped lang="scss">
.vajra-position {
//   border-top: 32rpx solid #f6f6f6;
  background: #fff;
  padding: 20rpx  28rpx 0 28rpx;
  margin-bottom: 20rpx;
  border-radius: 16rpx;
  margin-top: 20rpx;
  .list {
    display: inline-block;
    margin-right: 20rpx;
    margin-bottom: 20px;
    text-align: center;
    &:nth-child(5n + 5) {
      margin-right: 0;
    }
    .item {
      text-align: center;
      font-size: 28rpx;
      color: #272727;
      .pic {
        width: 110rpx;
        height: 110rpx;
        border-radius: 50%;
        overflow: hidden;
        margin-bottom: 14rpx;
        image {
          display: block;
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
</style>
