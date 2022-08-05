<template>
  <div class="search-input flex-aic" @click="goto">
    <uni-easyinput :styles="{ borderColor: '#ececec' }" trim="all" prefixIcon="search" type="text" confirmType="search"
      v-model="content" placeholder="搜索商品-好物等你" @iconClick="changeValue" @confirm="changeValue">
    </uni-easyinput>
    <span class="canl" v-if="source != 1" @click.stop="goBack">取消</span>
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
      default: () => () => { },
    },
    goto: {
      type: Function,
      default: () => () => { },
    },
  },
  data() {
    return {
      content: "",
    };
  },
  methods: {
    goBack() {
      this.$to()
    }
  },
};
</script>
<style>
/* .placeholder {
  font-size: 24rpx;
  color: #c9c9c9;
} */
</style>
<style scoped lang="scss">
.search-input {
  margin-bottom: 20rpx;
  .canl {
    color: #222222;
    font-size: 28rpx;
    padding-left: 10rpx;
  }
}
</style>
