<template>
  <view class="my-car">
    <view v-for="(item, index) in list" :key="index" class="wrap">
      <sidesLip :item="item" :data_transit="{ index: index, item: item }" @delItem="delItem">
        <view style="color: #000000">
          <unit :item="item" :changeSelect="changeSelect"></unit>
        </view>
      </sidesLip>
    </view>
    <view class="footer">
      <view class="footer-main-container">
        <view class="footer-container line-lighter">
          <view class="left flex-aic" @click.stop="changeCheckAll">
            <view v-if="!isCheckAll" class="circle-point"></view>
            <image v-else class="circle-point-image" src="/static/images/radio_checked.png">
            </image>
            <view class="check-all-tetx">全选</view>
          </view>
          <view class="right">
            <view class="total-container">
              <text class="total-number">共{{ productCount || 0 }}件, 合计</text>
              <text class="total-unit">฿</text>
              <text class="total-price">{{ totalPriceInt || 0 }}</text>
              <text class="total-point">{{ totalPricePoint }}</text>
            </view>
            <view class="btn">
              <button class="purchase" @click="goToPurchase">去结算</button>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="empt flex-col-ctr" v-if="list.length == 0">
      <image class="_img" src="/static/images/add-empty-icon.png" mode=""></image>
      <view class="txt">暂无数据</view>
    </view>
    <!-- 授权手机号 -->
    <authority-phone-modal @closemodal="closeModal" :isShowReject="false" :isShowAuthPhone="isShowAuthPhone">
    </authority-phone-modal>
  </view>
</template>
<script>
import { Resource } from "@/server/resource-api";
import sidesLip from "@/components/sides-lip/index.vue";
import unit from "./comps/unit.vue";
import { ToastInfo, debounce } from "@/utils/util";
import { th } from '@dcloudio/vue-cli-plugin-uni/packages/postcss/tags';
let _,
  app = getApp();
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
      isCheckAll: true, // 是否全选
      productCount: 0, // 选购数量
      totalPriceInt: "", // 价格 整数部分
      totalPricePoint: "", // 价格 小数部分
      ids: [], // 选中商品id
      total: 0,
    };
  },
  onShow() {
    _.checkHasMobile((isLoged) => {
      _.isShowAuthPhone = !isLoged;
    });
    if (app.globalData["isNeedUpdetaCarList"]) {
      app.globalData["isNeedUpdetaCarList"] = false;
      Object.assign(_, {
        pageNum: 1,
        pageSize: 10,
        isend: false,
        isCheckAll: true,
        list: []
      })
      _.getCarList();
    }
  },
  onReachBottom: function () {
    const { isend, list } = _;
    if (!isend && list.length) {
      _.pageNum += 1;
      _.getCarList();
    }
  },
  methods: {
    // 全选
    changeCheckAll: function () {
      const { list = [] } = _;
      if (_.isCheckAll) {
        const newList = list.map((item) => {
          item.checked = false;
          item.realAmount = 0;
          item.reduceAmount = 0;
          return item;
        });
        Object.assign(_, {
          list: [...newList],
          isCheckAll: false,
        });
      } else {
        const newList = list.map((item) => {
          // && item.isValid
          if (!item.stockStatus) {
            item.checked = true;
          }
          return item;
        });
        Object.assign(_, {
          list: [...newList],
          isCheckAll: true,
        });
      }
      _.promotion();
    },
    changeSelect(item, type) {
      let list = JSON.parse(JSON.stringify(_.list));
      // if (!item.isValid) return;
      for (let key in list) {
        if (list[key].id == item.id) {
          list[key].quantity = item.quantity;
          if (type == "changeCount") {
            _.list = list;
            _.updateQuantity(item);
          } else {
            list[key].checked = !list[key].checked;
            _.list = list;
            _.promotion();
          }
        }
      }

      console.log("选择商品", _.list, item);
    },
    // 修改购物车商品数量
    updateQuantity: function (item) {
      const that = this;
      const { list = [] } = that;
      const { id, quantity } = item || {};
      const index = list.findIndex((listItem) => item.id === listItem.id);
      Resource.updatePromotion
        .post(
          { type: "quantity" },
          { id: id, quantity: quantity, },
          { loadingDelay: true }
        )
        .then((res) => {
          const { code, data = {} } = res || {};
          if (code === 1) {
            const { itemList = [], toastInfo = {} } = data || {};
            if (Object.keys(toastInfo).length > 0) {
              toastInfo.message && ToastInfo(toastInfo.message);
              itemList.forEach((item) => {
                const checkedIndex = list.findIndex(
                  (listItem) => item.id === listItem.id
                );
                list[checkedIndex].quantity = item.quantity;
                // list[checkedIndex].isValid = item.isValid;
                // if (!item.isValid) {
                //   list[checkedIndex].checked = false;
                // }
              });
              that.list = [...list];
              that.promotion();
              return;
            }
            list[index] = item;
            that.list = [...list];
            that.promotion();
          } else {
            ToastInfo(res.message);
            item.quantity = item.originQuantity;
            list[index] = item;
            that.list = [...list];
          }
        })
        .catch((e) => { });
    },
    // 获取购物车选中内容信息,包括促销信息
    promotion: function () {
      const that = this;
      const { list } = that;
      const ids = [];
      const unValidIds = [];
      list.forEach((item, index) => {
        // stockStatus	赠品库存状态：1:有库存 0:库存不足
        if (item.checked) {
          ids.push(item.id);
        }
        // !item.isValid ||
        if (item.stockStatus) {
          unValidIds.push(item.id);
        }
      });
      that.ids = ids;
      if (!ids.length) {
        Object.assign(that, {
          productCount: 0,
          totalPriceInt: "",
          totalPricePoint: "",
          isCheckAll: false,
        });
        return;
      }
      that.isCheckAll = ids.length + unValidIds.length === list.length;

      Resource.promotion
        .post(
          {
            type: "promotion",
          },
          {
            cartIds: ids,
          }
        )
        .then((res) => {
          const { code, data = {} } = res || {};

          if (code === 1) {
            const { payAmount, productCount, cartPromotionItemList = [] } = data;
            cartPromotionItemList.forEach((item) => {
              const checkedIndex = list.findIndex((listItem) => item.id === listItem.id);
              list[checkedIndex].realAmount = item.realAmount;
              list[checkedIndex].reduceAmount = item.reduceAmount;
            });
            const { priceInt, pricePoint } = that.formatPrice(payAmount);
            Object.assign(that, {
              list: [...list],
              totalPriceInt: priceInt,
              totalPricePoint: pricePoint,
              productCount: productCount,
            });
          } else {
            ToastInfo(res.msg || res.message || "服务异常");
          }
        })
        .catch((e) => { });
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
            let total = _.total - 1;
            total = total > 99 ? "99+" : total + "";
            if (total == 0) uni.removeTabBarBadge({ index: 2 });
            else
              uni.setTabBarBadge({
                index: 2,
                text: total,
              });
            _.promotion();
          } else ToastInfo(res.message || res.msg);
        });
    },
    getCarList() {
      let { pageNum, list, isend, pageSize } = _,
        params = {
          pageNum: pageNum || 1,
          pageSize,
        };
      Resource.cart.post({ type: "list" }, params, { loadingDelay: true }).then((res) => {
        if (res.code == 1) {
          if (res?.data?.list?.length) {
            isend = !!(pageNum >= res?.data?.totalPage);
            let data = res.data?.list || [];
            let total = res?.data?.total;
            if (pageNum == 1) list = data;
            else list = [...list, ...data];
            list = _.formatList(list);
            Object.assign(_, { list, isend, total });
            _.promotion();
            console.log("list", list);
          } else _.isCheckAll = false;
        }
      });
    },
    // 列表数据格式化
    formatList: function (list) {
      const newList = list.map((item, index) => {
        const { priceInt, pricePoint } = _.formatPrice(item.price);
        item.priceInt = priceInt;
        item.pricePoint = pricePoint;
        item.realAmount = 0;
        item.reduceAmount = 0;
        // && item.isValid
        if (!item.stockStatus && _.isCheckAll) {
          item.checked = true;
        } else {
          item.checked = false;
        }
        return item;
      });
      return newList;
    },
    // 价格格式化
    formatPrice: function (itemPrice) {
      let priceInt = "";
      let pricePoint = "";
      itemPrice = itemPrice || "";

      if (itemPrice) {
        let price = itemPrice + "";

        if (price.indexOf(".") !== -1) {
          priceInt = price.split(".")[0];
          pricePoint = "." + price.split(".")[1] || "";
        } else {
          priceInt = itemPrice;
          pricePoint = "";
        }
      } else {
        priceInt = 0;
        pricePoint = "";
      }

      return {
        priceInt,
        pricePoint,
      };
    },
    // 下单
    goToPurchase: debounce(
      function () {
        const { ids } = _;
        if (!ids.length) {
          ToastInfo("您还没有选择商品宝贝哦");
          return;
        }
        // const flag = await _.checkOrder();
        // if (!flag) return;
        let path = `/pages/order-check/index?cartIds=${JSON.stringify(ids)}&sourceType=2`;
        uni.navigateTo({ url: path });
      },
      1500,
      true
    ),
    //下单库存校验
    checkOrder: async function () {
      const that = _;
      let flag = true;
      await Resource.cart
        .post({ type: "updateCartItemQuantity" }, { cartIds: _.ids })
        .then((res) => {
          const { code, data = {} } = res || {};
          if (code === 1) {
            const { itemList = [], toastInfo = {} } = data || {};
            if (Object.keys(toastInfo).length > 0) {
              toastInfo.message && ToastInfo(toastInfo.message);
              const { list = [] } = that;
              itemList.forEach((item) => {
                const checkedIndex = list.findIndex(
                  (listItem) => item.id === listItem.id
                );
                list[checkedIndex].quantity = item.quantity;
                // list[checkedIndex].isValid = item.isValid;
                // list[checkedIndex].checked = item.isValid ? true : false;
              });
              that.list = [...list];
              that.promotion();
              flag = false;
            }
          }
        });
      return flag;
    },

    // 关闭授权手机号弹窗
    closeModal: function (e) {
      if (e.detail == 'success') {
        Object.assign(this, {
          pageNum: 1,
          pageSize: 10,
          isend: false,
          isCheckAll: true
        });
        this.getCarList();
      } else {
        uni.reLaunch({ url: '/pages/home/index' });
        this.isShowAuthPhone = false;
      }
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
