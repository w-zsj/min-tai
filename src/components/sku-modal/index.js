import { Resource } from "@/server/resource-api";
import { ToastInfo } from "@/utils/util";
// #ifdef H5
import { getWxCode } from "@/utils/wxConfig/wxPay.js";
// #endif
import { localStorage } from "@/utils/extend";
import { SK } from "@/utils/constant";
import pop from "@/components/pop/index";
const app = getApp(),
  Enum = {
    1: "您已享有最佳优惠，请下单",
    100601: "该优惠券已过期，领取失败",
    100602: "该优惠券已失效，领取失败",
    100603: "手慢了，已被抢光",
    100604: "该优惠券未到领取时间",
    100605: "该优惠券已达最大领取张数",
    100606: "该优惠券领取失败",
    100702: "您已享有最佳优惠，请下单",
  };
export default {
  name: "sku-modal",
  components: { pop },
  props: {
    productId: {
      type: String,
      default: "",
    },
    expand: {
      // 扩展属性
      type: Object,
      default: () => ({}), //isIntegration 是否是兑换商品
    },
    source: {
      // 来源 用于埋点
      type: String,
      default: "product-detail",
      // home 首页 coupon 使用优惠券和领取优惠券页  catetory 分类  mall购物车 mall-edit-sku 购物车修改 sku  vip 会员 product-detail 商品详情
    },
  },
  data() {
    return {
      userStyle: localStorage.get(SK.USER_STYLE) || "A",
      memberleve: app.globalData.uservipinfo(),

      modelTypeLists: [], // sku 渲染列表
      selectArr: [], //存放被选中的值
      shopItemInfo: {}, //存放要和选中的值进行匹配的数据
      subIndex: [], //是否选中 因为不确定是多规格还是单规格，所以这里定义数组来判断

      teamPromotionCode: "", // 参团code
      selectBtnType: "addcar",
      teamId: "", // 参团id
      modelType: {}, // 选中sku
      info: {},
      isJoinGroup: false, //是否是拼团活动
      count: 1, // 购买数量

      leftIntegrationCount: 0, // 个人所有积分
      ShowPntegrationPop: false, // 积分不足弹框
      allNotStock: false, // 所有商品都无库存
    };
  },
  computed: {
    // 按钮样式
    className() {
      let color = "",
        { userStyle, selectBtnType, teamId, source, expand, modelType } = this;
      if (userStyle === "A") {
        if (selectBtnType == "addcar") color = "black-bg";
        else color = "red-bg";
      } else {
        if (selectBtnType == "addcar") color = "red-bg";
        else color = "black-bg";
      }
      // 参团按钮红色
      if (teamId || source == "mall-edit-sku") color = color + " " + "red-bg";
      // 积分按钮红色
      if (expand.isIntegration && modelType.leftStock) color = color + " " + "red-bg";
      return color;
    },
    // 会员价格以及秒杀价显示判断
    showMemberSkuPricePrice() {
      let { isJoinGroup, selectBtnType, modelType } = this,
        bol = false;
      // 发起拼团不展示会员价
      if (isJoinGroup && selectBtnType == "buy") bol = false;
      else if (modelType.activityPrice) {
        if ((isJoinGroup && selectBtnType == "addcar") || !isJoinGroup) bol = true;
      }
      return bol;
    },
    classNameStatus() {
      let { modelType, expand, allNotStock } = this;
      if (
        !(modelType.promotionLeftStock || modelType.leftStock) ||
        expand.isGift && !expand.isIntegration ||
        allNotStock
      )
        return true;
      else return false;
    },
  },
  mounted() {
    this.getProductSkuInfo();
  },
  methods: {
    // 获取商品sku信息
    getProductSkuInfo() {
      let _ = this, { productId, init, expand, allNotStock } = _;
      // type 1 积分 2 普通商品 
      Resource.product
        .post({ type: `queryProductSkuDetail` }, { id: productId, type: expand.isIntegration ? 1 : 2 })
        .then((res) => {
          let { code, data } = res;
          if (code == 1) {
            if (data?.skuInfoList?.length) {
              // 积分sku时判断 全部sku 是否有库存
              allNotStock = !data?.skuInfoList.some((i) => i.leftStock);
              _.setData({
                info: data || {},
                leftIntegrationCount: data.leftIntegrationCount, // 我的所有积分
                allNotStock,
              }, init);
            }
          } else {
            ToastInfo(res.message || res.msg);
            _.close();
          }
        })
        .catch(_.close);
    },
    // 初始化数据
    init: function (e) {
      let _ = this,
        {
          info,
          info: { skuInfoList = [] },
          isJoinGroup,
          expand: {
            type = "addcar",
            teamPromotionCode = "",
            teamid = "",
            limitCountOrRob,
          } = {},
        } = _;
      if (!skuInfoList || skuInfoList.length == 0) return ToastInfo("商品已下架");
      if (teamid) type = "buy"; // 商品详情 拼团列表  ‘去参团按钮’ 进入
      // priceType	价格类型  0:正常价格 1:vip价格 2:至尊vip 3:秒杀价 4:团购价 5:低价团" 6新人价 7 积分
      // limitCountOrRob 秒杀达到限购件数或者已抢光
      // 判断是不是拼团
      isJoinGroup = skuInfoList.every((i) => i.priceType == 4 || i.priceType == 5);
      // 拼团原价购买时 校验的时leftStock
      skuInfoList = skuInfoList.map((i) => {
        if ((type == "addcar" && isJoinGroup) || limitCountOrRob) i.priceType = 0; // 拼团原价购买相当于 普通商品购买
        if (i.priceType == 0) delete i.promotionLeftStock; // promotionLeftStock 活动库存 普通商品不需要
        return i;
      });
      _.$set(info, "skuInfoList", skuInfoList);
      // 处理规格属性的数据类型
      skuInfoList.forEach((item) => {
        item.spData = item.spData || [];
        if (item.spData) {
          if (!Array.isArray(item.spData)) item.spData = JSON.parse(item.spData);
        }
      });
      _.setData({
        selectBtnType: type,
        teamPromotionCode,
        isJoinGroup,
        teamId: teamid,
      });
      _.rewriteDataFormat(skuInfoList);
    },
    // 关闭弹框
    close() {
      if (this.ShowPntegrationPop) this.ShowPntegrationPop = false;
      else this.$emit("close");
    },
    goto() {
      this.$to("/packPages/integral/integral-list/index");
    },
    // 加入购物车
    addShopping: function (productId, productSkuId) {
      const _ = this,
        { source, modelType, count, expand } = _;
      // 购物车修改sku  单独接口
      let type = "add",
        params = { productId, productSkuId, quantity: count };
      if (source == "mall-edit-sku") {
        type = "update/attr";
        params = {
          productSkuCode: modelType.productSkuCode,
          price: modelType.price,
          id: expand.carItemId,
          productSkuId,
          productAttr: JSON.stringify(modelType.spData),
          quantity: expand.reElection ? 1 : expand.quantity,
        };
      }
      Resource.cart
        .post({ type: type }, params)
        .then((res) => {
          if (res && res.code === 1) {
            _.$emit("close", "addcar");
            _.skuModalClose();
            // 加入购物车 再次进入购物车页面 为了刷新购物车列表接口 注释 购物车不是每次都刷新
            getApp().globalData.hasAddCarAction = true;
            // 刷新tabbar 购物车角标数量
            _.getCarCount(true);
            if (source == "mall-edit-sku") ToastInfo("已更新", "none", 1500);
            else ToastInfo("已加入购物车", "none", 1000);
          } else ToastInfo(res.message);
        })
        .finally(_.close);
    },
    rewriteDataFormat(skuInfoList) {
      let _ = this,
        shopItemInfo = {}; // 将规格名称格式转换为键值对；
      // 从后台拿到数据之后，进行数据处理
      skuInfoList.map((item, index) => {
        let itemKey = "";
        item["spData"].map((i, i_j) => {
          // 属性名拼接
          itemKey = itemKey + "," + i.value;
        }); // 去掉属性名拼接中第一个逗号

        let reg = new RegExp(",", "");
        let a = itemKey.replace(reg, "");
        shopItemInfo[a] = item;
      });
      _.setData({ shopItemInfo }, () => _.distachAttrValue(skuInfoList));
    },
    /* 处理数据 */
    distachAttrValue: function (skuInfoList) {
      let _ = this,
        {
          modelTypeLists,
          modelType,
          shopItemInfo,
          source,
          expand,
          checkItem,
        } = _; // 把数据对象的数据（视图使用），写到局部内
      // 遍历获取的数据
      for (var i = 0; i < skuInfoList.length; i++) {
        for (var j = 0; j < skuInfoList[i].spData.length; j++) {
          var attrIndex = _.getAttrIndex(skuInfoList[i].spData[j].key, modelTypeLists);
          // 如果还没有属性索引为-1，此时新增属性并设置属性值数组的第一个值；索引大于等于0，表示已存在的属性名的位置
          if (attrIndex >= 0) {
            // 如果属性值数组中没有该值，push新值；否则不处理
            if (!_.isValueExist(skuInfoList[i].spData[j], modelTypeLists[attrIndex].specificationName)) {
              modelTypeLists[attrIndex].specificationName.push({
                ...skuInfoList[i].spData[j],
              });
              modelTypeLists[attrIndex].name = skuInfoList[i].spData[j].key;
            }
          } else {
            modelTypeLists.push({
              name: skuInfoList[i].spData[j].key,
              specificationName: [{ ...skuInfoList[i].spData[j] }],
            });
          }
        }
      }
      // 初始化默认选中 一组有库存的sku
      let strKey = "", selectArr = [], subIndex = [];
      function initFirstCheck() {
        // 默认选中秒杀的sku 其次拼团 最后正常商品 leftStock
        // countDownTime 有值代表 秒杀活动进行中 ; startTime 有值countDownTime没有值代表秒杀活动即将开始
        // 新人价
        let newPeopleEq = skuInfoList.findIndex((i) => i.priceType == 6 && i.promotionLeftStock > 0);
        // 是否存在秒杀活动
        let flashEq = skuInfoList.findIndex((i) => i.priceType == 3 && i.promotionLeftStock > 0 && (i.countDownTime || i.startTime));
        //  拼团活动、正常商品
        let eq = skuInfoList.findIndex((i) => i.promotionLeftStock > 0 || i.leftStock > 0);

        if (newPeopleEq > -1) eq = newPeopleEq;
        else if (flashEq > -1) eq = flashEq;

        if (eq > -1) {
          let spData = skuInfoList[eq].spData, arr = [];
          for (let attr in spData) {
            arr.push(spData[attr].value);
          }
          strKey = arr.join(",");
        }
        // 购物车进来默认选中 已选的sku
        if (source == "mall-edit-sku" && expand.productAttr) {
          let arr = [];
          for (let attr in expand.productAttr) {
            arr.push(expand.productAttr[attr].value);
          }
          let attr = shopItemInfo[arr];
          if (attr && (attr.promotionLeftStock > 0 || attr.leftStock > 0))
            strKey = arr.join(",");
        }
        console.log('strKey', strKey, 'skuInfoList', skuInfoList)
        if (!strKey) {
          // 所有规格都无库存
          for (let s in shopItemInfo) {
            modelType = _.dealShowPrice(shopItemInfo[s]);
            break;
          }
          console.log("所有规格都无库存::modelType", modelType);
        }
        // 反推 获取每组属性 对应的索引
        else
          for (let i in modelTypeLists) {
            for (let j in modelTypeLists[i].specificationName) {
              let item = modelTypeLists[i].specificationName[j];
              if (strKey.includes(item.value)) {
                selectArr.push(item.value);
                subIndex.push(Number(j));
                if (shopItemInfo[selectArr]) return false;
              }
            }
          }
      }
      initFirstCheck();
      _.setData({ modelType, modelTypeLists, selectArr, subIndex, },
        () => _.subIndex.length && checkItem()
      );
    },
    getAttrIndex: function (attrName, modelTypeLists) {
      // 判断数组中的key是否有该属性值
      for (var i = 0; i < modelTypeLists.length; i++) {
        if (attrName == modelTypeLists[i].name) {
          break;
        }
      }
      return i < modelTypeLists.length ? i : -1;
    },
    isValueExist: function (obj, valueArr) {
      // 判断是否已有属性值
      for (var i = 0; i < valueArr.length; i++) {
        if (valueArr[i].value == obj.value) {
          break;
        }
      }
      return i < valueArr.length;
    },
    // 获取当前点击的sku value 值 以及所在位置
    chooseModelType(event) {
      let _ = this,
        eventData = event.currentTarget.dataset,
        { value, index: curIndex, parentIndex: curIndexParent, isdisplay } = eventData,
        { selectArr, subIndex } = _;
      if (!isdisplay) return;
      if (selectArr[curIndexParent] != value) {
        selectArr[curIndexParent] = value;
        subIndex[curIndexParent] = curIndex;
      } else {
        selectArr[curIndexParent] = "";
        subIndex[curIndexParent] = -1; //去掉选中的颜色
      }
      _.setData({ selectArr, subIndex }, _.checkItem);
    },
    //  根据已选择的sku 判断其他sku 是否可选择
    checkItem: function () {
      let _ = this,
        {
          selectArr,
          modelTypeLists,
          shopItemInfo,
          info: { skuInfoList = [] },
        } = _,
        option = modelTypeLists,
        result = []; //定义数组储存被选中的值
      _.modelTypeLists = []; // 防止数据不更新
      for (var i in option) {
        if (selectArr[i]) result[i] = selectArr[i];
        else result[i] = "";
      }
      for (var i in option) {
        var last = result[i]; //把选中的值存放到字符串last去
        // 关键处理
        for (var k in option[i].specificationName) {
          result[i] = option[i].specificationName[k].value;
          option[i].specificationName[k]["isDisplay"] = _.isDisplay(result);
        }
        result[i] = last; //还原，目的是记录点下去那个值，避免下一次执行循环时被覆盖
      }
      // 匹配到对应的规格信息
      let modelType = {};
      if (shopItemInfo[result])
        modelType = Object.assign(shopItemInfo[result], _.dealShowPrice(shopItemInfo[result]));
      // 已选规格
      else {
        // 未选择规则时 获取第一个有库存的sku
        for (let k in skuInfoList) {
          if (skuInfoList[k].promotionLeftStock > 0 || skuInfoList[k].leftStock > 0) {
            modelType = _.dealShowPrice(skuInfoList[k]);
            break;
          }
        }
      }
      // 格式化 modelType.startTime
      if (modelType.startTime) {
        let t = modelType.startTime.replace(/-/g, "/").split(" "),
          second = t[1].split(":");
        modelType.month = t[0].replace(/(?=\/)/, "#").split("#/")[1];
        modelType.hours = second[0] + ":" + second[1];
      }
      _.setData({
        modelTypeLists: option,
        modelType,
        count: 1,
      });
      console.log("已选择sku", this.selectArr, "modelType", this.modelType);
    },
    /**
     * 处理页面需要展示的价格
     * obj
     */
    dealShowPrice(obj = {}) {
      // 会员价以及秒杀价 统一用memberSkuPrice字段表示
      let { isJoinGroup, selectBtnType, deepClone, expand } = this,
        mode = deepClone(obj);
      // 未选中时 删除库存字段  因为其他操作会依赖库存判断
      delete mode.promotionLeftStock;
      delete mode.leftStock;
      // 积分不展示 秒杀 拼团、会员价
      if (!expand.isIntegration) {
        // 活动价和会员价用一个字段表示 activityPrice
        if (obj.promotionPrice && (mode.priceType == 3 || mode.priceType == 6))
          mode.activityPrice = Number(obj.promotionPrice).toFixed(2);
        else if (obj.memberSkuPrice)
          // 会员价
          mode.activityPrice = Number(obj.memberSkuPrice).toFixed(2);
      }
      if (isJoinGroup && selectBtnType == "buy") {
        // 拼团购买
        mode.curPrice = Number(obj.promotionPrice).toFixed(2);
      } else if (obj.price) mode.curPrice = Number(obj.price).toFixed(2);
      // 原价购买
      else mode.curPrice = "暂无报价";
      return mode;
    },
    //  判断 其他sku 是否有库存
    isDisplay(result) {
      let _ = this,
        { shopItemInfo, expand } = _;
      // 关键所在 判断是否可以选择规格 为空时可以选择
      for (var i in result) {
        if (result[i] == "") return true;
      }
      //  如果秒杀商品  秒杀库存没有 普通库存有的 这时候 priceType 会变成0普通商品
      // 购物车校验库存 以及购买校验库存
      return (
        !!(shopItemInfo[result]?.promotionLeftStock > 0) ||
        !!(shopItemInfo[result]?.leftStock > 0)
      );
    },
    //  提交操作
    submit: function (e) {
      let _ = this,
        {
          modelType: {
            promotionLeftStock = 0,
            leftStock = 0,
            skuId = "",
            productId = "",
            integration = "",
          } = {},
          selectBtnType,
          teamId = "",
          isJoinGroup,
          teamPromotionCode,
          expand,
          count,
          leftIntegrationCount,
        } = _;
      if (!productId) productId = _.productId;
      // 非卖品 不支持购买 但支持积分兑换
      if (expand.isGift && !expand.isIntegration) return;
      // 积分活动 // 代表积分不足
       if (leftStock && expand.isIntegration && integration * count > leftIntegrationCount) {
        _.ShowPntegrationPop = true;
       }
       else if (promotionLeftStock || leftStock) {
        if (selectBtnType == "addcar" && !isJoinGroup) _.addShopping(productId, skuId);
        else {
          if (selectBtnType == "addcar" || !isJoinGroup) teamPromotionCode = "";
          // 拼团原价购买 或 立即购买
          else teamPromotionCode = teamPromotionCode; // 发起拼团
          // 判断是否支持领券购买
          _.orderCheck(productId, skuId, teamId, teamPromotionCode);
        }
        _.skuModalClose();
      }
    },
    /**
     *
     * @param {signed}   // 单个规格校验库存
     */
    //  判断是否可领券下单
    orderCheck(productId, skuId, teamId, teamPromotionCode) {
      let _ = this,
        { isJoinGroup, selectBtnType, count, expand } = _,
        fn = () => {
          let path =
            `/pages/mall/order-check/order-check` +
            `?productId=${productId}` +
            `&productSkuId=${skuId}` +
            `&teamId=${teamId}` +
            `&teamPromotionCode=${teamPromotionCode}` +
            `&quantity=${count}` +
            `&sourceType=${expand.isIntegration ? 3 : 1}`; // sourceType 3 积分下单 1 普通商品下单
          if (_.isWx()) {
            uni.removeStorageSync("wxCode");
            getWxCode(path);
          } else uni.navigateTo({ url: path });
        };
      // 发起拼团、积分 不参与领券购买  // 秒杀需要领券购买
      if (((isJoinGroup || expand.isIntegration) && selectBtnType == "buy") || !expand.hasCoupons) fn();
      else if (expand.hasCoupons) {
        Resource.coupon
          .post({ type: "addCouponByProduct" }, { id: productId })
          .then((res) => {
            if (Enum[res.code]) ToastInfo(Enum[res.code], "none", 1500);
          })
          .finally((e) => setTimeout(fn, 1500));
      }
      _.$emit("close");
    },
    // 重置数据
    skuModalClose() {
      this.setData({
        modelTypeLists: [],
        selectArr: [],
        shopItemInfo: {},
        subIndex: [],
        modelType: {},
        teamId: "",
        teamPromotionCode: "",
        selectBtnType: "",
        count: 1,
        info: {},
      });
    },
    // 购买数量更新
    addcount: function (e) {
      let _ = this,
        {
          modelType: { promotionLeftStock = 0, leftStock = 0 } = {},
          selectBtnType,
          isJoinGroup,
          expand,
        } = _,
        { type } = e?.currentTarget?.dataset,
        total = promotionLeftStock || leftStock;
      if (expand.isGift && !expand.isIntegration) return;
      else if (!total || (selectBtnType == "buy" && isJoinGroup)) return;
      else if (!Number(_.count)) _.count = 1;
      else if (type) {
        //代表加减
        if (type == "add") _.count++;
        else {
          if (_.count <= 1) _.count = 1;
          else _.count--;
        }
      }
      // 输入框 以及 最后结果校验
      if (_.count <= 1) _.count = 1;
      else if (_.count > total) {
        _.count = total;
        ToastInfo(`数量超出范围`, "none", 1500);
        return;
      }
    },
  },
};