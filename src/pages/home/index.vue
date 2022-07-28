<template>
  <view class="content">
    <productUnit></productUnit>
  </view>
</template>

<script>
import productUnit from '@comps/product-unit/index.vue'
export default {
  components:{productUnit},
  data() {
    return {
     
    };
  },
  onLoad() { },
  methods: {},
};
</script>

<style lang='scss' scope>
.content{
  padding: 32rpx;
  background: #F6F6F6;
  min-height: 100vh;
}
</style>
