<template>
  <view class="vajra-position">
    <view class="list" v-for="(item, idx) in list" :key="idx">
      <view class="item" @click="bannerTap(item,'gg')">
        <view class="pic flex-ctr">
          <image :src="item.icon" />
        </view>
        <view class="name">{{ item.name }}</view>
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
    bannerTap: {
      type: Function,
      default: () => { },
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
  padding: 20rpx 28rpx 0 28rpx;
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
      width: 116rpx;
      .pic {
        width: 116rpx;
        height: 116rpx;
        border-radius: 50%;
        overflow: hidden;
        margin-bottom: 14rpx;
        image {
          display: block;
          width: 100%;
          height: 100%;
        }
      }
      .name {
        width: 116rpx;
        font-size: 24rpx;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
  }
}
</style>
