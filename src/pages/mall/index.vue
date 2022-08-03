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
import { Resource } from "@/server/resource-api";
import sidesLip from "@/components/sides-lip/index.vue";
import unit from "./comps/unit.vue";
import { ToastInfo } from "@/utils/util";
let _;
export default {
  components: { sidesLip, unit },
  data() {
    _ = this;
    return {
      isShowAuthPhone: false,
      pageNum: 1,
      pageSize: 10,
      isend: false,
      list: [],
    };
  },
  onLoad() {},
  onShow() {
    this.checkHasMobile((isLoged) => {
      this.isShowAuthPhone = !isLoged;
    });
    this.getCarList();
  },
  onReachBottom: function () {
    const { isend, list } = this;
    if (!isend && list.length) {
      this.pageNum += 1;
      this.getCarList();
    }
  },
  methods: {
    handleOrder() {
      console.log("下单", this.list);
    },
    changeSelect(item, type) {
      let list = JSON.parse(JSON.stringify(_.list));
      for (let key in list) {
        if (list[key].id == item.id) {
          if (type != "addCount") list[key].checked = !list[key].checked;
          list[key].quantity = item.quantity;
        }
      }

      _.list = list;
      console.log("选择商品", _.list, item);
    },
    // 删除
    delItem(data) {
      console.log("删除商品", data);
      Resource.cart
        .post({ type: "delete" }, { cartId: data.item.id }, { loadingDelay: true })
        .then((res) => {
          if (res.code == 1) {
            ToastInfo("已删除");
            _.list = _.list.filter((i) => i.id != data.item.id);
          } else ToastInfo(res.message || res.msg);
        });
    },
    getCarList() {
      let _ = this,
        { pageNum, list, isend, pageSize } = _,
        params = {
          pageNum: pageNum || 1,
          pageSize,
        };
      Resource.cart.post({ type: "list" }, params, { loadingDelay: true }).then((res) => {
        if (res.code == 1) {
          if (res?.data?.list?.length) {
            isend = !!(pageNum >= res?.data?.totalPage);
            let data = res.data?.list || [];

            if (pageNum == 1) list = data;
            else list = [...list, ...data];
            console.log("list", list);
            Object.assign(_, { list, isend });
          }
        }
      });
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
