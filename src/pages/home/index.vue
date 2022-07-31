<template>
  <view class="home">
    <!-- 搜索 -->
    <serachInput :goto="goto"></serachInput>
    <!-- 轮播 -->
    <mySwiper :bannerList="bannerList" :bannerTap="bannerTap"></mySwiper>
    <!-- 金刚位 -->
    <mySwiper :bannerList="catetoryList" :bannerTap="bannerTap" source="gg"></mySwiper>
    <!-- 商品列表 -->
    <view class="content">
      <productUnit></productUnit>
    </view>

    <!-- 登录提示 -->
    <view class="login-hint flex-aic-btwn" v-if="!isShowLoginHint">
      <view class="txt flex-aic">
        <image
          class="icon"
          src="/static/images/close_icon.png"
          @click.stop="isShowLoginHint = false"
        />
        登录抢爆款商品
      </view>
      <view class="btn flex-ctr" @click.stop="isShowAuthPhone = true">立即登录</view>
    </view>
    <!-- 授权手机号 -->
    <authority-phone-modal
      @closemodal="closemodal"
      :isShowAuthPhone="isShowAuthPhone"
    ></authority-phone-modal>
  </view>
</template>

<script>
import productUnit from "@comps/product-unit/index.vue";
import mySwiper from "@comps/my-swiper/index.vue";
import serachInput from "@comps/serach-input/index.vue";
const app = getApp();
export default {
  components: { productUnit, mySwiper, serachInput },
  data() {
    return {
      bannerList: new Array(6),
      catetoryList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
      isShowAuthPhone: false,
      isShowLoginHint: true,
    };
  },
  async onLoad() {
   
    await this.$onLaunched;
     var result = [];
    for (var i = 0; i < this.catetoryList.length; i += 10) {
      result.push(this.catetoryList.slice(i, i + 10));
    }
    this.catetoryList = result
    if (!app.globalData.hasmobile()) this.isShowLoginHint = false;
  },
  // 上拉加载
  onReachBottom: function () {},
  methods: {
    // 轮播图点击
    bannerTap: function (url, type, source) {
      console.log("e---", url, type, source); //type 2h5  3图片
      const tabBarPages = [
        "/pages/mall/index",
        "/pages/category/index",
        "/pages/mine/index",
      ]; //tabar页面
      return;
      if (tabBarPages.includes(url)) {
        uni.switchTab({ url: url });
      } else {
        uni.navigateTo({ url: url });
      }
    },
    closemodal(e) {
      this.isShowAuthPhone = false;
      if (e.detail == "success") {
        this.isShowLoginHint = false;
      }
    },
    goto() {
      this.$to("search-history/index");
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
    margin-top: 20rpx;
  }
  .login-hint {
    height: 60rpx;
    border-radius: 30rpx;
    padding: 0 32rpx;
    font-size: 28rpx;
    color: #fff;
    background: rgba(0, 0, 0, 0.5);
    position: fixed;
    bottom: 40rpx;
    left: 32rpx;
    right: 32rpx;
    .icon {
      width: 26rpx;
      height: 26rpx;
      margin-right: 16rpx;
    }
    .btn {
      height: 40rpx;
      background: #a7002d;
      border-radius: 20rpx;
      font-size: 24rpx;
      padding: 0 16rpx;
    }
  }
}
</style>
