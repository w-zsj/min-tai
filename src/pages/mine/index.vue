<template>
  <view class="mine-page">
    <view class="userInfo flex-aic-btwn">
      <view class="user flex-aci">
        <view class="header">
          <image :src="userInfo.avatarUrl" />
        </view>
        <view class="flex-col-btwn" @click.stop="jumpPath({ path: 'payment-voucher/index?source=2' })">
          <view class="phone">{{userInfo.phone}}</view>
          <view class="gold flex-aic-ard">
            <view class="flex-aic">
              <image class="gold_icon" src="/static/images/gold_icon.png" />
              <view>{{userInfo.coin}}</view>
            </view>
            <image class="arrow_icon" src="/static/images/arrow_icon.png" />
          </view>
        </view>
      </view>
      <view class="account-management flex-aic" @click.stop="jumpPath({ path: 'account-management/index' })">
        <text>账户管理</text>
        <image class="arrow_icon" src="/static/images/arrow_icon.png" />
      </view>
    </view>
    <view class="cont">
      <!-- 轮播 -->
      <view v-if="bannerList && bannerList.length">
        <mySwiper :bannerList="bannerList" :bannerTap="bannerTap"></mySwiper>
      </view>
      <!-- 菜单导航 -->
      <view class="menu flex-aic-btwn">
        <view class="menu-item flex-col-ctr" v-for="(item, idx) in menuList" :key="idx" @click.stop="jumpPath(item)">
          <view class="icon flex-ctr">
            <image class="" :src="item.icon" />
          </view>
          <view>{{ item.title }}</view>
        </view>
      </view>
      <!-- 广告位 -->
      <view class="advertisement-container" v-if="advList && advList.length">
        <mySwiper :bannerList="advList" :bannerTap="bannerTap"></mySwiper>
      </view>

      <!-- 描述 -->
      <view class="desc">
        如果您购买的商品有任何问题,请于客服联系,客服会专门为您处理,让您售后无忧。
      </view>
      <!-- 客服 -->
      <view class="customer-service flex-ctr" @click="jumpPath({id:'service'})"> 联系客服 </view>
    </view>

    <!-- 授权手机号 -->
    <authority-phone-modal @closemodal="closeModal" :isShowReject="false" :isShowAuthPhone="isShowAuthPhone">
    </authority-phone-modal>
  </view>
</template>
<script>
import mySwiper from "@comps/my-swiper/index.vue";
import order_icon from "@/static/images/order_icon.png";
import pending_payment_icon from "@/static/images/pending_payment_icon.png";
import wait_receipt_icon from "@/static/images/wait_receipt_icon.png";
import completed_icon from "@/static/images/completed_icon.png";
import { openCustomerService } from "@/utils/util.js";
import { Resource } from "@/server/resource-api";
import { localStorage } from "@/utils/extend";
import { SK } from "@/utils/constant";
let app = getApp();
export default {
  components: { mySwiper },
  data() {
    return {
      isShowAuthPhone: false,
      bannerList: [],
      advList: [],
      menuList: [
        {
          title: "全部订单",
          icon: order_icon,
          path: "order-list/index?type=0",
        },
        {
          title: "待付款",
          icon: pending_payment_icon,
          path: "order-list/index?type=1",
        },
        {
          title: "待收货",
          icon: wait_receipt_icon,
          path: "order-list/index?type=2",
        },
        {
          title: "已完成",
          icon: completed_icon,
          path: "order-list/index?type=3",
        },
      ],
      userInfo: {
        nickName: localStorage.get(SK.NICK_NAME),
        avatarUrl: localStorage.get(SK.USER_IMAGE),
        phone: localStorage.get(SK.USER_PHONE),
        coin: localStorage.get(SK.COIN) || 0,
      },
    };
  },
  onLoad() {
    this.getHomeBannerList(2);
    this.getHomeBannerList(3);
  },
  onShow() {
    this.checkHasMobile((isLoged) => {
      this.isShowAuthPhone = !isLoged;
    });
  },
  methods: {
    // banner 2 banner 3 广告位
    getHomeBannerList(type = 2) {
      Resource.open
        .post({ type: "home/getHomePageAdvertiseList" }, { type })
        .then((res) => {
          if (res.code == 1) {
            if (res?.data?.length) {
              if (type == 3) this.advList = res?.data;
              else this.bannerList = res?.data;
            }
          }
        });
    },
    // 轮播图点击
    bannerTap: function (url, type, source) {
      console.log("e---", url, type, source); //type 2h5Url  3图片 4 小程序路径
      const tabBarPages = [
        "/pages/mall/index",
        "/pages/category/index",
        "/pages/mine/index",
      ]; //tabar页面
      if (type == 4) {
        if (tabBarPages.includes(url)) {
          uni.switchTab({ url: url });
        } else {
          uni.navigateTo({ url: url });
        }
      } else if (type == 2) {
        this.$to(`webview/index?url=${encodeURIComponent(url)}`);
      }
    },
    // 菜单跳转
    jumpPath(item) {
      console.log("item", item);
      if (item.id == "service") openCustomerService();
      else this.$to(item.path);
    },

    // 关闭授权手机号弹窗
    closeModal: function (e) {
      let _ = this;
      if (e.detail == 'success') {
        app.globalData.login().then(res => {
          if (res.token) {
            Object.assign(_, {
              isShowAuthPhone: false,
              userInfo: {
                nickName: localStorage.get(SK.NICK_NAME),
                avatarUrl: localStorage.get(SK.USER_IMAGE),
                phone: localStorage.get(SK.USER_PHONE),
                coin: res.data.coin || 0
              },
            });
          }
        })

      } else {
        uni.reLaunch({ url: '/pages/home/index' });
        this.isShowAuthPhone = false;
      }
    },

  },
};
</script>
<style scoped lang="scss">
@import "./index.scss";
</style>
