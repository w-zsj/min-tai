<template>
  <div>
    <pop
      :isShow="isVisible"
      :isShowConf="false"
      :isShowIcon="true"
      :isShowCancel="false"
      @close="closeModal"
      class="integral-modal-container"
    >
      <view class="modal-body">
        <view class="header">请确认收货地址是否正确</view>
        <view class="integral-short">
          <view class="text">{{ address.detailAddress }}</view>
          <view class="user-info flex-aic-btwn">
            <view class="">姓名：{{ item.name }}</view>
            <view>手机号：{{ address.phoneNumber }}</view>
          </view>
        </view>
        <view class="footr-btn">
          <view class="btn-left" @click="closeModal">取消</view>
          <view class="btn-right" @click="confirmModal">确定</view>
        </view>
      </view>
    </pop>
  </div>
</template>
<script>
import pop from "@/components/pop/index";
import { debounce } from "@/utils/util";
const app = getApp();
export default {
  components: {
    pop,
  },
  props: {
    address: {
      type: Object,
      default: null,
    },
    isVisible: {
      type: Boolean,
      default: false,
    },
    className: {
      type: String,
      default: "",
    },
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {
    // 弹窗取消
    closeModal() {
      this.$emit("onClose");
    },
    // 弹窗确定
    confirmModal: debounce(
      function () {
        this.$emit("confirmModal");
      },
      2000,
      true
    ),
  },
};
</script>
<style lang="scss" scoped>
::v-deep .integral-modal-container {
  .bor {
    display: none;
  }
  .modal-body {
    display: flex;
    flex-direction: column;
    align-items: center;
    .header {
      font-size: 32rpx;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #272727;
    }
    .integral-short {
      margin-top: 32rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 28rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #808080;
      .text {
		margin-bottom: 50rpx;
      }
      .amount {
        color: #a7002d;
      }
    }
    .footr-btn {
      display: flex;
      margin-top: 90rpx;
      .btn-left {
        width: 331rpx;
        height: 80rpx;
        line-height: 80rpx;
        text-align: center;
        border-radius: 40rpx;
        border: 1px solid #808080;
        font-size: 32rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #808080;
        background: #ffffff;
      }
      .btn-right {
        width: 331rpx;
        height: 80rpx;
        margin-left: 32rpx;
        line-height: 80rpx;
        text-align: center;
        border-radius: 40rpx;
        font-size: 32rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #ffffff;
        background: #a7002d;
      }
    }
  }
}
</style>
