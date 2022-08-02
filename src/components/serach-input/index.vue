<template>
  <div class="search-input" @click="goto">
    <view class="flex-aic">
      <view class="ipt">
        <input
          type="text"
          placeholder="搜索商品-好物等你"
          placeholder-class="placeholder"
          @confirm="changeValue"
          v-model="content"
          :disabled="source == 1"
        />
        <view class="searcch_icon" @click.stop="changeValue(content)">
          <image class="searcch_icon" src="/static/images/search_icon.png" />
        </view>
      </view>
      <view class="btn flex-ctr" v-if="source == 2" @click.stop="changeValue(content)">
        搜索
      </view>
    </view>
  </div>
</template>
<script>
export default {
  props: {
    source: {
      type: Number,
      default: 1, // 首页
    },
    changeValue: {
      type: Function,
      default: () => () => {},
    },
    goto: {
      type: Function,
      default: () => () => {},
    },
  },
  data() {
    return {
      content: "",
    };
  },
  methods: {
    confirm(value) {
      console.log("", value);
    },
  },
};
</script>
<style>
.placeholder {
  font-size: 24rpx;
  color: #c9c9c9;
}
</style>
<style scoped lang="scss">
.search-input {
  height: 80rpx;

  border-radius: 8rpx;
  margin-bottom: 20rpx;

  .btn {
    font-size: 24rpx;
    color: #272727;
    padding: 0 16rpx;
    height: 80rpx;
    border-radius: 8rpx;
    border: 1px solid #ececec;
    margin-left: 10rpx;
  }
  .ipt {
    position: relative;
    flex: 1;
    background: #fff;
    border-radius: 8rpx;
    overflow: hidden;
    input {
      height: 80rpx;
      width: 100%;
      padding-left: 10rpx;
    }
    .searcch_icon {
      position: absolute;
      right: 0;
      top: 0;
      width: 80rpx;
      height: 80rpx;
      padding-right: 32rpx;
      z-index: 2;
      image {
        width: 40rpx;
        height: 40rpx;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }
}
</style>
