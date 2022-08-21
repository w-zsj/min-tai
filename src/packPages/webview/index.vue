<template>
  <view class="web">
    <web-view :src="url" v-if="!isImg" />
    <view class="flex-aic pic" v-else>
      <image class="img" :src="url" mode="widthFix" show-menu-by-longpress />
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      url: "",
      isImg: true
    };
  },
  onLoad(options) {
    this.url = decodeURIComponent(options.url) || "";
    this.isImg = options.type == 'img';
  },
};
</script>
<style scoped lang="scss">
.web {
  .pic {
    width: 100%;
    .img {
      width: 100%;
      font-size: 0;
    }
  }
}
</style>
