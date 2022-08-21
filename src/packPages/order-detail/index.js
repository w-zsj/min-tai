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
        receiverPhone: '',
        receiverName: '',
        receiverDetailAddress: '',
      },
      productList: [],
      enmuStatus: {
        0: "待付款",
        1: "待审核",
        2: "审核失败待付款",
        3: "待收货",
        4: "已取消",
        5: "已收货",
      },
      orderStatus: "", // 订单状态：0->待付款；1->待审核 3 待收货->4已取消；5->已完成
      note: "", // 订单备注

      payTimer: "",

      createTime: "",
      orderSn: "",
      paymentTime: "",
      tradeNo: "", // 交易单号
      payAmount: "", // 应付金额（实际支付金额）
      totalAmount: "", // 订单总金额
      useCoin: 0,
      freightAmount: "", //配送费金额
      productQuantity: 1,
      countDown: 0,
      payImageUrl: '',
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
    checkGoodDetail(id) {
      console.log("item>>>", id);
      this.$to(`/packPages/goods-detail/index?id=${id}`);
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
            payType,
            paymentTime = "",
            totalAmount,
            freightAmount,
            useCoin,
            productQuantity = 1,
            payAmount,
            receiverDetailAddress,
            receiverName,
            receiverPhone,
            countDown,
            payImageUrl
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
            useCoin,
            countDown,
            payImageUrl
          });
          const obj = {
            receiverPhone: receiverPhone,
            receiverName: receiverName,
            receiverDetailAddress: receiverDetailAddress,
          };
          _.address = obj;
          // console.log('status', _.countDown)
          if (status == 0 && _.countDown > 0) {
            customCountDown(
              { time: _.countDown, type: "m" },
              (d, T) => {
                _.date = d;
                timerInterval = T;
                clearTimeout(T);
                this.$forceUpdate();
              },
              (d) => {
                console.log("d---", d == "end");
                if (timerInterval) clearTimeout(timerInterval);
                _.initData();
              }
            );
          }
        } else ToastInfo(res.message);
      });
    },

    // 取消 删除订单
    handleBtnOrder: debounce(
      function (type) {
        let params = {}, { orderSn, productList } = _;
        console.log('orderSn', productList, orderSn, type)
        if (type == 'again') {
          let promiseAll = [];
          for (let k in productList) {
            let p = Resource.cart.post(
              { type: "add" },
              {
                productId: productList[k].productId,
                productSkuId: productList[k].productSkuId,
                quantity: productList[k].productQuantity || 1,
              }
            );
            promiseAll.push(p);
          }
          if (promiseAll.length) {
            Promise.all(promiseAll)
              .then((result) => {
                if (result.every((i) => i.code == 1)) {
                  console.log("--->>>>", "再次购买");
                  _.$to('mall/index', 'switchTab')
                }
              })
              .catch((error) => {
                console.log(error);
                _.$to("home/index", "reLaunch");
              });
          }
          return
        }
        if (type == "goShopping") {
          _.$to("home/index", "reLaunch");
          return;
        }
        if (type == 'pay') {
          _.$to(`/packPages/payment-voucher/index?orderSn=${orderSn}&source=1`)
          return
        }

        params.orderSn = orderSn;
        Resource.order
          .post({ type: type }, params, { loadingDelay: true })
          .then(({ code }) => {
            if (code == 1) {
              ToastInfo(type == 'confirmReceiveOrder' ? '已确认收货' : '已取消');
              if (type == 'confirmReceiveOrder') _.orderStatus = 5;
              else if (type == 'cancelUserOrder') _.orderStatus = 4;
            }
          })
      }, 500, true),
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
    previewImg(url) {
      uni.previewImage({
        current: 0,
        urls: [url],
        loop: true,
        indicator: 'number'
      });
    }
  },
};