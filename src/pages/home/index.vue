<template>
  <view class="home">
    <!-- 搜索 -->
    <serachInput :goto="goto" :disabled="true"></serachInput>
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
    <view class="loading" v-if="isend && hotProductList.length">已加载全部</view>

    <!-- 弹屏 -->
    <view class="popup-adv" v-if="popupAdv.pic">
      <view class="pic">
        <image :src="popupAdv.pic" class="img" mode='widthFix' @click.stop="bannerTap(item)"></image>
        <view class="close" @click.stop="popClose">
          <image class="icon" src="/static/images/close_icon.png" />
        </view>
      </view>
    </view>
    <!-- 登录提示 -->
    <view class="login-hint flex-aic-btwn" v-if="!isShowLoginHint">
      <view class="txt flex-aic">
        <image class="icon" src="/static/images/close_icon.png" @click.stop="isShowLoginHint = false" />
        登录抢爆款商品
      </view>
      <view class="btn flex-ctr" @click.stop="isShowAuthPhone = true">立即登录</view>
    </view>
    <!-- 授权手机号 -->
    <authority-phone-modal @closemodal="closemodal" :isShowAuthPhone="isShowAuthPhone"></authority-phone-modal>
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
      popupAdv: {},// 弹屏
      catetoryList: [],
      isShowAuthPhone: false,
      isShowLoginHint: true,

      pageNum: 1,
      pageSize: 10,
      isend: false,
      hotProductList: [],
    };
  },
  onLoad() {
    // 获取分类
    this.getClassifyList();
    // 获取banner
    this.getHomeBannerList();
    // 获取弹屏广告
    this.getHomeBannerList(0);
    // 新品推荐
    this.getHotProductList();
  },
  async onShow() {
    await this.$onLaunched;
    if (!app.globalData.hasmobile()) this.isShowLoginHint = false;
    else this.isShowLoginHint = true;
    this.isShowAuthPhone = false;
    uni.showTabBar();

  },
  onHide() {
    this.popupAdv = {};
    this.isShowAuthPhone = false;
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    // 获取分类
    this.getClassifyList();
    // 获取banner
    this.getHomeBannerList();
    // // 获取弹屏广告
    // this.getHomeBannerList(0);
    // 新品推荐
    this.getHotProductList();
  },
  // 上拉加载
  onReachBottom: function () {
    const { isend, list } = this;
    if (!isend && list.length) {
      this.pageNum += 1;
      this.getHotProductList();
    }
  },
  methods: {
    // 轮播图点击
    bannerTap: function ({ url, urlType, id }, source) {
      console.log("e---", url, urlType, id, source); //type 2h5Url  3图片 4 小程序路径
      const tabBarPages = [
        "/pages/mall/index",
        "/pages/category/index",
        "/pages/mine/index",
      ]; //tabar页面
      if (source == "gg") {
        uni.switchTab({
          url: "/pages/catetory/index",
        });
        getApp().globalData.categoryId = id;
      } else {
        if (urlType == 4) {
          if (tabBarPages.includes(url)) uni.switchTab({ url: url });
          else uni.navigateTo({ url: url });
        } else if (urlType == 3) {
          if (url)
            this.$to(`/packPages/webview/index?url=${encodeURIComponent(url)}&type=img`);
        }
        else if (urlType == 2) {
          this.$to(`/packPages/webview/index?url=${encodeURIComponent(url)}`);
        }
      }
    },
    popClose() {
      uni.showTabBar();
      this.popupAdv = {};
    },
    closemodal(e) {
      this.isShowAuthPhone = false;
      if (e.detail == "success") {
        this.isShowLoginHint = true;
      }
    },
    goto() {
      this.$to("/packPages/search-history/index");
    },
    // 新品推荐
    getHotProductList() {
      let _ = this,
        { pageNum, hotProductList, isend, pageSize } = _,
        params = {
          pageNum: pageNum || 1,
          pageSize,
        };
      Resource.open.post({ type: "product/hotProductList" }, params, { loadingDelay: true }).then((res) => {
        if (res.code == 1) {
          uni.stopPullDownRefresh();
          if (res?.data?.list?.length) {
            isend = !!(pageNum >= res?.data?.totalPage);
            let data = res.data?.list || [];

            if (pageNum == 1) hotProductList = data;
            else hotProductList = [...hotProductList, ...data];
            console.log("hotProductList", hotProductList);
            Object.assign(_, { hotProductList, isend });
          }
        }
      });
    },
    // banner
    getHomeBannerList(type = 1) {
      Resource.open
        .post({ type: "home/getHomePageAdvertiseList" }, { type })
        .then((res) => {
          if (res.code == 1) {
            uni.stopPullDownRefresh();
            if (res?.data?.length) {
              if (type == 1) this.bannerList = res?.data;
              else if (type == 0) {
                uni.hideTabBar();
                this.popupAdv = res?.data[0] || {};
              }
            } else {
              if (type == 1) this.bannerList = [];
              else if (type == 0) {
                this.popupAdv = {};
                uni.showTabBar();
              }
            }
          }
        });
    },
    // 分类
    getClassifyList() {
      Resource.open.post({ type: "home/classifyList" }, {}).then((res) => {
        // 渲染骨架屏异步数据
        if (res.code == 1) {
          if (res?.data?.length) {
            var result = [];
            for (var i = 0; i < res?.data.length; i += 10) {
              result.push(res?.data.slice(i, i + 10));
            }
            this.catetoryList = result;
          }
          uni.stopPullDownRefresh();
        }
      });
    },
  },
  onReachBottom: function () {
    const { isend, hotProductList } = this;
    if (!isend && hotProductList.length) {
      this.pageNum += 1;
      this.getHotProductList();
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
  padding: 16rpx;
  .loading {
    text-align: center;
    color: #ccc9c9;
    font-size: 24rpx;
    // padding-bottom: 48rpx;
    padding-bottom: constant(safe-area-inset-bottom); /* 兼容 iOS < 11.2 */
    padding-bottom: env(safe-area-inset-bottom); /* 兼容 iOS >= 11.2 */
  }
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
      background: #ec0d0d;
      border-radius: 20rpx;
      font-size: 24rpx;
      padding: 0 16rpx;
    }
  }

  .popup-adv {
    position: fixed;
    background: rgba(0, 0, 0, 0.5);
    width: 100vw;
    height: 100vh;
    left: 0;
    top: 0;
    .pic {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 600rpx;
      .img {
        width: 600rpx;
        // height: 800rpx;
      }
      .close {
        width: 60rpx;
        height: 60rpx;
        border-radius: 50%;
        padding: 10rpx;
        border: 1px solid #fff;
        position: absolute;
        left: 50%;
        bottom: -80rpx;
        transform: translateX(-50%);
        .icon {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
</style>
