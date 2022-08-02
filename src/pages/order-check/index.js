/*
 * @Author: zhangsanjun 
 * @Date: 2022-05-17 17:37:18 
 * @Last Modified by: zhangsanjun
 * @Last Modified time: 2022-08-02 10:08:40
 */

import Pop from "@/components/pop";
import { ToastInfo, openMiniProgramPay, debounce } from "@/utils/util";
import { localStorage } from "@/utils/extend";
import { Resource } from "@/server/resource-api";
import confirmModal from './comps/confirm-modal.vue'
let app = getApp(), _;
export default {
  components: {
    Pop,confirmModal
  },
  data() {
    _ = this;
    return {
      Inipx: app.globalData["Inipx"],
      sourceType: 1, //普通商品 商品详情下单 2 购物车下单 3、积分兑换商品 商品详情下单
      showModal: false,
      note: "",
      textAreaNote: "",
      productList: [],
      address: null, // 地址
      cartIds: [],
      productCount: 1,
      payAmount: "",//应付金额
      totalAmount: '',//订单商品总金额
      reqError: false,

    };
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {
      cartIds = "",
      productId,
      productSkuId,
      quantity = 1,
      sourceType = 1,
    } = options;
    if (productId && !cartIds) {
      Object.assign(_, {
        productId: parseInt(productId),
        productSkuId: parseInt(productSkuId),
        quantity,
        sourceType: Number(sourceType),
      })
    } else {
      console.log('cartIds',cartIds)
      Object.assign(_, {
        cartIds: JSON.parse(cartIds),
        sourceType: 2,
      });
    }
    _.initData();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const { sourceType } = _, address = app.globalData["addrInfo"];
    if (address) {
      _.setData({ address });
      _.getOrderData(sourceType == 1);
    }
  },
  methods: {
    closePromotionModal() {
      // 关闭弹框 刷新接口
      let { $to, invalidType, getOrderData } = _;
      _.setData({ filterPromotionModal: false }, () => {
        if (invalidType == 2) $to();
        else getOrderData();
      });
    },
    showCouponPop: function () {
      const { couponHistoryDetailList } = _,
        currentCouponList = JSON.parse(JSON.stringify(couponHistoryDetailList));
      _.setData({
        currentCouponList,
        isShowCouponPop: true,
      });
    },
    handleChooseAdd: function () {
      _.$to('address-list/index?source=1');
    },
    cacelModal: function () {
      _.setData({
        showModal: false,
        note: _.note,
      });
    },
    isShowModal: function () {
      _.setData({
        showModal: true,
        textAreaNote: _.note,
      });
    },
    inputs: function (e) {
      let value = e.detail.value;
      _.setData({ textAreaNote: value });
    },
    addNote: function () {
      _.setData({
        showModal: false,
        note: _.textAreaNote,
      });
    },
    // 确认订单
    onConfirmModal() { },
    // 取消确认订单
    onClose(){},
    initData: function () {
      Resource.addAddress
        .post({ type: "queryDefaultAddress" })
        .then((res) => {
          const { code, data = {} } = res || {};
          if (code === 1) {
            if (data.id) _.setData({ address: data, });
            _.getOrderData();
          }
        });
    },

    getOrderData: function () {
      let id = _?.address?.id,
        {
          cartIds,
          sourceType,
          productId,
          productSkuId,
          quantity = 1,
        } = _,
        params = {
          addressId: id || null,
        },
        api = "",
        resource = Resource.order;
      switch (sourceType) {
        case 1: //普通商品 商品详情下单
          api = "generateConfirmOrderByProducts";
          params = {
            ...params,
            productId,
            productSkuId,
            quantity,
          };
          break;
        case 2: // 购物车下单
          api = "generateConfirmOrderByCars";
          params = { ...params, cartIds };
          break;
      }
      uni.showLoading({ title: "加载中" });
      resource
        .post({ type: api }, params)
        .then((res) => {
          let { code, data = {} } = res || {};
          if (code === 1) {
            let {
              calcAmount: {
                payAmount = 0,
                totalAmount = 0,
              },
              cartPromotionItemList = [],
              productCount = 1,
            } = data;
            Object.assign(_, {
              productList: data.productInfo ? [data.productInfo] : cartPromotionItemList, // 区分兑换商品 和 正常商品
              payAmount, totalAmount, productCount
            });
          } else {
            const { currentCouponList } = _;
            Object.assign(_, {
              reqError: true,
            });
            ToastInfo(res.message || res.msg);
          }
        })
        .catch(() => Object.assign(_, { reqError: true }))
        .finally(uni.hideLoading);
    },
    // 下单 判断收货地址
    handleOrder: function () {
      if (_.reqError) return;
      if (!_.address) {
        ToastInfo("请选择地址~");
        return;
      }
      _.generateOrder();
    },
    // 下单
    generateOrder: debounce(
      function () {
        let {
          address, note, cartIds,
          productList, sourceType, productId, productSkuId,
          quantity = 1
        } = _,
          api = "generateOrderByCar",
          params = {
            memberReceiveAddressId: address.id,
            note,
          },
          resource = Resource.order;
        switch (sourceType) {
          case 1:
            api = "generateOrderByProduct";
            params = {
              ...params,
              productId, productSkuId, quantity
            };
            break;
          case 2:
            api = "generateOrderByCar";
            params = { ...params, cartIds };
            break;
        }
        uni.showLoading({
          title: "加载中...",
          mask: true,
        });
        resource
          .post({ type: api }, params)
          .then((res) => {
            

          })
          .finally(uni.hideLoading);
      }, 2000, true),

  },
};