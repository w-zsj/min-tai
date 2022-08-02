<template>
  <view class="my-car">
    <view v-for="(item, index) in list" :key="index" class="wrap">
      <sidesLip
        :item="item"
        :data_transit="{ index: index, item: item }"
        @delItem="delItem"
      >
        <view style="color: #000000">
          <unit :item="item" :changeSelect="changeSelect"></unit>
        </view>
      </sidesLip>
    </view>
    <view class="bottom line">
      <view class="bottom-detail flex-aic">
        共{{ productCount }}件, 合计
        <view class="bottom-detail-amount">
          <text>
            <text class="bottom-detail-amount-bigger">฿</text>
            <text class="bottom-detail-amount-bigger">222 </text>
          </text>
        </view>
      </view>
      <view class="bottom-btn" @click="handleOrder"> 下单 </view>
    </view>
    <!-- 授权手机号 -->
    <authority-phone-modal
      @closemodal="isShowAuthPhone = false"
      :isShowAuthPhone="isShowAuthPhone"
    ></authority-phone-modal>
  </view>
</template>
<script>
import sidesLip from "@/components/sides-lip/index.vue";
import unit from "./comps/unit.vue";
export default {
  components: { sidesLip, unit },
  data() {
    return {
      list: [{}, {}, {}],
      isShowAuthPhone: false,
    };
  },
  onLoad() {},
  onShow() {
    this.checkHasMobile((isLoged) => {
      this.isShowAuthPhone = isLoged;
    });
  },
  methods: {
    changeSelect(item) {
      console.log("选择商品");
    },
    // 删除
    delItem(data) {
      console.log("删除商品");
    },
  },
};
</script>
<style lang="scss" scoped>
.wrap {
  margin-bottom: 32rpx;
}
@import "./inedx.scss";
</style>
