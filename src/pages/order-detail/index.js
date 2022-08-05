import { ToastInfo, debounce } from "@/utils/util";
import { Resource } from "@/server/resource-api";
import { customCountDown } from "@/utils/countDown.js";
let timerInterval,
  app = getApp(), _;
export default {
  data() {
    _ = this;
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

      date: {},// 倒计时
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
    checkGoodDetail(item) {
      console.log("item>>>", item);
      this.$to(`goods-detail/index?id=${item.id}`);
    },
    initData: function () {
      const { orderSn, date } = _;
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

          Object.assign(_, {
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
            _.address = obj;
          }
          if (status == 0) {
            let timer = remainingTime.second * 1000 || 0;
            if (remainingTime.hour) {
              timer += remainingTime.hour * 60 * 60 * 1000
            } else if (remainingTime.minute) timer += remainingTime.minute * 60 * 1000;
            customCountDown(
              { time: copyItem.countDown, type: "m" },
              (d, T) => {
                date = d;
                console.log('---', date);
                timerInterval = T;
                _.date = date;
                clearTimeout(T);
              },
              (d) => {
                console.log("d---", d == "end");
                if (timerInterval) clearTimeout(timerInterval);
              }
            );
          }
        } else ToastInfo(res.message);
      });
    },

    // 不想买了
    handleCancelOrder: function () {
      Resource.order
        .post({ type: `cancelUserOrder` }, { orderSn: _.orderSn })
        .then((res) => {
          if (res.code == 1) {
            ToastInfo('已取消');
            this.orderStatus = 4;
          }
        })
    },
    // 我要付款
    handleOrder: debounce(
      function () {
        const { orderSn } = this;
        _.$to(`payment-voucher/index?orderSn=${orderSn}&source=1`)
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