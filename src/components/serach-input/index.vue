<template>
  <div class="search-input">
    <input type="text" placeholder="搜索商品-好物等你" placeholder-class="placeholder" />
  </div>
</template>
<script>
export default {
  props: {
    source: {
      type: Number,
      default: 1, // 首页
    },
  },
  data() {
    return {};
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
  background: #fff;
  border-radius: 8rpx;
  margin-bottom: 20rpx;
  input {
    height: 80rpx;
    width: 100%;
    padding-left: 20rpx;
  }
}
</style>
