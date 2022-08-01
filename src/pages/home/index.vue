<template>
  <view class="home">
    <!-- 搜索 -->
    <serachInput :goto="goto"></serachInput>
    <!-- 轮播 -->
    <view style="margin-bottom: 20rpx">
      <mySwiper :bannerList="bannerList" :bannerTap="bannerTap"></mySwiper>
    </view>
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
import { Resource } from "@/server/resource-api";
import productUnit from "@comps/product-unit/index.vue";
import mySwiper from "@comps/my-swiper/index.vue";
import serachInput from "@comps/serach-input/index.vue";
const app = getApp();
export default {
  components: { productUnit, mySwiper, serachInput },
  data() {
    return {
      bannerList: new Array(6),
      catetoryList: [],
      isShowAuthPhone: false,
      isShowLoginHint: true,
    };
  },
  async onLoad() {
    await this.$onLaunched;
    if (!app.globalData.hasmobile()) this.isShowLoginHint = false;
    // 获取分类
    this.getClassifyList();
    // 获取banner
    this.getHomeBannerList();
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
    getHomeBannerList() {
      Resource.open
        .post({ type: "home/getHomePageAdvertiseList" }, { type: 1 })
        .then((res) => {
          if (res.code == 1) {
            if (res?.data?.length) {
            }
          }
        });
    },
    getClassifyList() {
      Resource.classifyList.post({ type: "classifyList" }, {}).then((res) => {
        // 渲染骨架屏异步数据
        if (res.code == 1) {
          if (res?.data?.length) {
            var result = [];
            for (var i = 0; i < res?.data.length; i += 10) {
              result.push(res?.data.slice(i, i + 10));
            }
            this.catetoryList = result;
          }
        }
      });
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
