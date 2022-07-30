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

    <!-- 登录提示 -->
    <view class="login-hint flex-aic-btwn" v-if="isShowLoginHint">
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
import vajraPosition from "@comps/vajra-position/index.vue";
import mySwiper from "@comps/my-swiper/index.vue";
import serachInput from "@comps/serach-input/index.vue";
import { tr } from "@dcloudio/vue-cli-plugin-uni/packages/postcss/tags";
export default {
  components: { productUnit, vajraPosition, mySwiper, serachInput },
  data() {
    return {
      bannerList: new Array(6),
      isShowAuthPhone: false,
      isShowLoginHint: true,
    };
  },
  async onLoad() {
    await this.$onLaunched;
    if (!app.hasmobile()) this.isShowLoginHint = false;
  },
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
    closemodal(e) {
      this.isShowAuthPhone = false;
      if (e.detail == "success") {
        this.isShowLoginHint = false;
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
