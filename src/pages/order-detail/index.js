import { ToastInfo, openMiniProgramPay, debounce } from "@/utils/util";
import { Resource } from "@/server/resource-api";
import { customCountDown } from "@/utils/countDown.js";
let timerInterval,
  app = getApp();
export default {
  data() {
    return {
      Inipx: app.globalData["Inipx"],
      address: {
        name: "",
        phone: "",
        add: "",
      },
      productList: [],
      orderStatus: "", // 订单状态：0->待付款；1->待审核 3 待收货->4已取消；5->已完成
      note: "", // 订单备注

      payTimer: "",

      createTime: "",
      orderSn: "",
      paymentTime: "",
      tradeNo: "", // 交易单号
      payAmount: "", // 应付金额（实际支付金额）
      totalAmount: "", // 订单总金额

      freightAmount: "", //运费金额
      productQuantity: 1,
    };
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    uni.hideShareMenu({
      menus: ["shareAppMessage", "shareTimeline"],
    });
    const { orderSn } = options;
    this.orderSn = orderSn;
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.initData();
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearTimeout(timerInterval);
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearTimeout(timerInterval);
  },

  methods: {
    customevent(item) {
      console.log("item", item);
      this.$to(`/pages/mall/goods-detail/goods-detail?id=${item.giftId}`);
    },
    initData: function () {
      const that = this,
        { orderSn } = that;
      Resource.order.post({ type: `detail` }, { orderSn }).then((res) => {
        const { code, data = {} } = res || {};

        if (code === 1) {
          const {
            status,
            tradeNo = "",
            createTime,
            orderItemList = [],
            note = "",
            address,
            payType,
            paymentTime = "",
            totalAmount,
            freightAmount,
            remainingTime, // 待付款剩余时间
            productQuantity = 1,
          } = data;

          that.setData({
            productList: orderItemList,
            createTime,
            tradeNo,
            note,
            paymentTime,
            totalAmount,
            freightAmount,
            payAmount,
            orderStatus: status,
            productQuantity,
          });

          if (address) {
            const { receiverPhone, receiverName } = data;
            const obj = {
              phone: receiverPhone,
              name: receiverName,
              add: address,
            };
            this.address = obj;
          }
        } else ToastInfo(res.message);
      });
    },

    // 不想买了
    handleCancelOrder: function () {},

    // 我要付款
    handleOrder: debounce(
      function () {
        const { orderSn } = this;
      },
      2000,
      true
    ),

    // 复制订单号
    copyOrderSn: function (e) {
      uni.setClipboardData({
        data: e.currentTarget.dataset.ordersn,
        success(res) {
          uni.hideKeyboard(); //  隐藏软键盘
          uni.showToast({
            title: "内容已复制",
            icon: "none",
          });
        },
        fail(res) {
          console.error("res----:", res);
        },
      });
    },
  },
};