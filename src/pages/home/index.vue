<template>
  <view class="home">
    <!-- 搜索 -->
    <serachInput></serachInput>
    <!-- 轮播 -->
    <mySwiper :bannerList="bannerList" :bannerTap="bannerTap"></mySwiper>
    <!-- 金刚位 -->
    <vajraPosition></vajraPosition>
    <!-- 商品列表 -->
    <view class="content">
      <productUnit></productUnit>
    </view>
  </view>
</template>

<script>
import productUnit from "@comps/product-unit/index.vue";
import vajraPosition from "@comps/vajra-position/index.vue";
import mySwiper from "@comps/my-swiper/index.vue";
import serachInput from "@comps/serach-input/index.vue";
export default {
  components: { productUnit, vajraPosition, mySwiper, serachInput },
  data() {
    return {
      bannerList: new Array(6),
    };
  },
  onLoad() {},
  // 上拉加载
  onReachBottom: function () {},
  methods: {
    // 轮播图点击
    bannerTap: function (url, type) {
      console.log("e---", url, type); //type: 1商品详情 2h5  3图片 4:开通vip页面
      const urlTypeArr = [1, 4]; //小程序内页面跳转
      const tabBarPages = [
        "/pages/mall/index",
        "/pages/category/index",
        "/pages/mine/index",
      ]; //tabar页面
      if (urlTypeArr.includes(type)) {
        if (tabBarPages.includes(url)) {
          uni.switchTab({ url: url });
        } else {
          uni.navigateTo({ url: url });
        }
      }
    },
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: "泰嗨乐",
      path: "/pages/home/index",
      imageUrl: "",
    };
  },

  /**
   * 用户点击右上角分享到朋友圈
   */
  onShareTimeline: function () {
    return {
      title: "泰嗨乐",
    };
  },
};
</script>

<style lang="scss" scope>
page {
  background: #f6f6f6;
}
.home {
  min-height: 100vh;
  padding: 32rpx;
  .content {
    background: #f6f6f6;
  }
}
</style>
