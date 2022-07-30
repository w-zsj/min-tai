<template>
  <view class="my-car">
    <view v-for="(item, index) in list" :key="index" class="wrap">
      <sidesLip
        :item="item"
        :data_transit="{ index: index, item: item }"
        @delItem="delItem"
      >
        <view style="color: #000000">
          <unit></unit>
        </view>
      </sidesLip>
    </view>
  </view>
</template>
<script>
import sidesLip from "@/components/sides-lip/index.vue";
import unit from "./comps/unit.vue";
export default {
  components: { sidesLip, unit },
  data() {
    return{
      list:[
      {},
      {},
      {}
    ]
    }
  },
};
</script>
<style lang="scss" scoped>
.wrap{
  margin-bottom: 32rpx;
}
@import "./inedx.scss";
</style>
