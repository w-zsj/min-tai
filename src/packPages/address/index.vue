<template>
  <view class="add-address">
    <view class="list flex-aic-star">
      <label class="label" for="name">收件人</label>
      <view class="input">
        <input :value="name" maxlength="20" class="weui-input" id="name" placeholder-class="phcolor" placeholder="请输入名字"
          @input="bindinput" data-type="name" />
      </view>
    </view>
    <view class="list flex-aic-star">
      <label class="label" for="phoneNumber">手机号</label>
      <view class="input">
        <input :value="phoneNumber" class="weui-input" id="phoneNumber" placeholder-class="phcolor" placeholder="请输入手机号"
          @input="bindinput" data-type="phoneNumber" />
      </view>
    </view>
    <view class="list flex-aic-star">
      <label class="label" for="detailAddress">详细地址</label>
      <view class="input">
        <textarea :value="detailAddress" maxlength="100" id="detailAddress" @input="bindinput" data-type="detailAddress"
          auto-height placeholder-class="phcolor" placeholder="请输入您的街道门牌信息" />
      </view>
    </view>
    <!-- 设置默认地址 -->
    <view class="default flex-aic-btwn">
      <view class="selsct flex flex-ctr" @click.stop.prevent="selet">
        <image :src="
            defaultStatus
              ? '/static/images/checked_icon.png'
              : '/static/images/unselected_radio.png'
          " mode="widthFix" />
        <view class="font28">设置默认地址</view>
      </view>
    </view>
    <view class="app-btn" @click.stop.prevent="save">保存信息</view>
  </view>
</template>

<script>
import { Resource } from "@/server/resource-api";
import { debounce, ToastInfo } from "@/utils/util";
const regPhone = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
const tPhone = /^[0][0-9]{9}$/
const app = getApp();
let _;
export default {
  data() {
    return {
      defaultStatus: 1,
      name: "",
      phoneNumber: "",
      detailAddress: "",
      addressId: "",
    };
  },
  /**
   * 生命周期函数--监听页面加载
   */ onLoad: function (options) {
    uni.hideShareMenu({
      menus: ["shareAppMessage", "shareTimeline"],
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    _ = this;
    let addr = app.globalData["addrInfo"];
    if (addr) {
      Object.assign(_, {
        name: addr["name"],
        phoneNumber: addr["phoneNumber"],
        defaultStatus: addr["defaultStatus"],
        detailAddress: addr["detailAddress"],
        addressId: addr["id"],
      });
    }
  },
  methods: {
    // 监听输入框变化
    bindinput: debounce((e) => {
      let { type } = e.target.dataset;
      let val = e.detail.value;
      if (type == "name") {
        _.name = val;
      } else {
        if (type == "phoneNumber") {
          _.phoneNumber = val;
        } else {
          if (type == "detailAddress") {
            _.detailAddress = val;
          }
        }
      }
    }, 10),

    // 保存数据
    save: debounce(function () {
      let { addressId, detailAddress, name, phoneNumber, defaultStatus } = this,
        params = {
          detailAddress,
          name,
          phoneNumber,
          defaultStatus,
        };
      if (!params.name) {
        ToastInfo("请输入名字");
        return;
      } else {
        if (!params.phoneNumber) {
          ToastInfo("请输入手机号");
          return;
        }
      }
      if (tPhone.test(params.phoneNumber) || regPhone.test(params.phoneNumber)) {
        let api = Resource.addAddress.post,
          type = { type: "add" };
        if (addressId) {
          params.id = addressId;
          type.type = "update";
        }

        api(type, params)
          .then((res) => {
            if (res.code == 1) {
              ToastInfo("添加成功");
              this.$to("/packPages/address-list/index");
            }
          })
          .catch((e) => {
            ToastInfo(e?.msg);
          });
      } else ToastInfo("手机号格式不正确");

    }, 300),

    // 选择默认地址
    selet() {
      let defaultStatus = this.defaultStatus;
      this.defaultStatus = defaultStatus == 1 ? 0 : 1;
    },
  },
};
</script>
<style scoped>
@import "./index.css";
</style>
