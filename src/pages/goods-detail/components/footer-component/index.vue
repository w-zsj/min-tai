<template>
  <view :class="'footer ' + (Inipx ? 'ipxHeight' : '')">
    <view class="footer-container line-lighter">
      <view class="left">
        <view class="menu-icon-container" @click="customerService">
          <view class="menu-icon">
            <image src="@/static/images/customer_service.png"></image>
          </view>
          <view class="menu-text">客服</view>
        </view>
        <view class="menu-icon-container" @click="goToShopping">
          <view class="menu-icon">
            <image src="@/static/images/shopping_cart.png"></image>
            <text v-if="detail.cartQuantity" class="shopping-number flex-ctr">{{
              detail.cartQuantity
            }}</text>
          </view>
          <view class="menu-text">购物车</view>
        </view>
      </view>
      <view class="right">
        <block>
          <button class="btn  group-car-btn black-bg" data-type="addcar" @click="selectSku">
            加入购物车
          </button>
          <button class="btn group-buy-btn red-bg" data-type="buy" @click="selectSku">
            立即购买
          </button>
        </block>
      </view>
    </view>
  </view>
</template>

<script>
import { localStorage } from "@/utils/extend";
import { SK } from "@/utils/constant";
import { openCustomerService, ToastInfo } from "@/utils/util";
const app = getApp();
export default {
  name: "flash-activity",
  props: {
    detail: {
      //商品详情
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      Inipx: !!app.globalData.Inipx,
    };
  },
  mounted() { },
  methods: {
    // 客服
    customerService: function () {
      openCustomerService();
    },
    // 跳转到购物车
    goToShopping: function () {
      this.checkHasMobile(() => {
        try {
          this.report("detai_enter_car", {
            product_id: this.detail.id,
            product_name: this.detail.name,
          });
        } catch (e) { }
        uni.switchTab({ url: `/pages/mall/index` });
      });
    },
    // 赠品按钮点击事件
    giftBuy: function () {
      const { isDetailDisplay } = this.detail;
      if (isDetailDisplay) {
        ToastInfo("抱歉，该商品不支持单独购买");
      } else {
        ToastInfo("抱歉，该商品库存不足");
      }
    },
    // sku弹窗
    selectSku: function (e) {
      this.$emit("selectSku", e);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
