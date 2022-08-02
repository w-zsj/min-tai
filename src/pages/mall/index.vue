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
      :isShowReject="false"
      :isShowAuthPhone="isShowAuthPhone"
    ></authority-phone-modal>
  </view>
</template>
<script>
import sidesLip from "@/components/sides-lip/index.vue";
import unit from "./comps/unit.vue";
let _;
export default {
  components: { sidesLip, unit },
  data() {
    _ = this;
    return {
      list: [{ id: 1 }, { id: 2 }, { id: 3 }],
      isShowAuthPhone: false,
    };
  },
  onLoad() {},
  onShow() {
    this.checkHasMobile((isLoged) => {
      this.isShowAuthPhone = !isLoged;
    });
  },
  methods: {
    changeSelect(item) {
      let list = JSON.parse(JSON.stringify(_.list));
      console.log("选择商品", list);
      for (let key in list) {
        if (list[key].id == item.id) list[key].checked = !list[key].checked;
      }
      _.list = list;
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
