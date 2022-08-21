<template>
  <div class="search-input flex-aic" @click="goto">
    <uni-easyinput :disabled="disabled" :styles="{ borderColor: '#ececec' ,disableColor:'#ffffff'}" trim="all"
      prefixIcon="search" type="text" confirmType="search" v-model="content" placeholder="搜索商品-好物等你"
      @iconClick="changeValue" @confirm="changeValue" @clear="changeValue">
    </uni-easyinput>
    <span class="canl" v-if="source == 2" @click.stop="goBack">取消</span>
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
    disabled: {
      type: Boolean,
      default: false
    },
    keyword: {
      type: String,
      default: ''
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
  mounted() {
    this.content = this.keyword;
  },
  methods: {
    goBack() {
      this.content = ''
      this.$emit('canl', '')
    }
  },
};
</script>
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
