<template>
  <view class="home">
    <!-- 搜索 -->
    <serachInput :goto="goto"></serachInput>
    <!-- 轮播 -->
    <view style="margin-bottom: 20rpx" v-if="bannerList && bannerList.length">
      <mySwiper :bannerList="bannerList" :bannerTap="bannerTap"></mySwiper>
    </view>
    <!-- 金刚位 -->
    <mySwiper :bannerList="catetoryList" :bannerTap="bannerTap" source="gg"></mySwiper>
    <!-- 商品列表 -->
    <view class="content" v-if="hotProductList && hotProductList.length">
      <block v-for="(item, idx) in hotProductList" :key="idx">
        <productUnit :item="item"></productUnit>
      </block>
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
      bannerList: [],
      catetoryList: [],
      isShowAuthPhone: false,
      isShowLoginHint: true,

      pageNum: 1,
      pageSize: 10,
      isend: false,
      hotProductList: [],
    };
  },
  async onLoad() {
    await this.$onLaunched;
    if (!app.globalData.hasmobile()) this.isShowLoginHint = false;
    // 获取分类
    this.getClassifyList();
    // 获取banner
    this.getHomeBannerList();
    // 新品推荐
    this.getHotProductList();
  },
  // 上拉加载
  onReachBottom: function () {},
  methods: {
    // 轮播图点击
    bannerTap: function ({ url, type, id }, source) {
      console.log("e---", url, type, id, source); //type 2h5Url  3图片 4 小程序路径
      const tabBarPages = [
        "/pages/mall/index",
        "/pages/category/index",
        "/pages/mine/index",
      ]; //tabar页面
      if (source == "gg") {
        uni.switchTab({
          url: "/pages/catetory/index",
        });
        getApp().globalData.categoryId=id;
      } else {
        if (type == 4) {
          if (tabBarPages.includes(url)) {
            uni.switchTab({ url: url });
          } else {
            uni.navigateTo({ url: url });
          }
        } else if (type == 2) {
          this.$to(`webview/index?url=${encodeURIComponent(url)}`);
        }
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
    // 新品推荐
    getHotProductList() {
      let _ = this,
        { pageNum, hotProductList, isend } = _,
        params = {
          pageNum: pageNum || 1,
          pageSize: 10,
        };
      Resource.open.post({ type: "product/hotProductList" }, params).then((res) => {
        if (res.code == 1) {
          if (res?.data?.list?.length) {
            isend = !!(pageNum >= res?.data?.totalPage);
            let data = res.data?.list || [];

            if (pageNum == 1) hotProductList = data;
            else list = [...hotProductList, ...data];
            console.log("hotProductList", hotProductList);
            Object.assign(_, { hotProductList, isend });
          }
        }
      });
    },
    // banner
    getHomeBannerList() {
      Resource.open
        .post({ type: "home/getHomePageAdvertiseList" }, { type: 1 })
        .then((res) => {
          if (res.code == 1) {
            if (res?.data?.length) {
              this.bannerList = res?.data;
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
  onReachBottom: function () {
    const { isend, hotProductList } = this;
    if (!isend && hotProductList.length) {
      this.pageNum += 1;
      this.initData();
    }
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
