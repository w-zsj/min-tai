<template>
  <view class="c-list flex-aic">
    <view @click.stop="changeSelect(copyItem)" class="checkbox-wrap">
      <view class="checkbox" :class="['checkbox', copyItem.checked && 'act',!copyItem.isValid && 'disabled']">
        <image class="img" v-if="copyItem.checked" src="/static/images/checked_icon.png" />
      </view>
    </view>
    <view class="pic" @click.stop="toDetail(copyItem)">
      <image :src="copyItem.productPic" />
    </view>
    <view class="base-info flex-col-btwn">
      <view>
        <view class="name ellip">
          {{ copyItem.productName }}
        </view>
        <view class="sku">{{ copyItem.attr }}</view>
      </view>
      <view class="price"><text class="rb">฿</text>{{ copyItem.price }}</view>
      <view :class="['add-num flex-aic']">
        <view class="div flex-ctr" data-type="div" @click.stop="addcount">-</view>
        <input :disabled="!copyItem.isValid" type="number flex-ctr" v-model="copyItem.quantity" @blur="addcount" />
        <view class="add flex-ctr" data-type="add" @click.stop="addcount">+</view>
      </view>
    </view>
  </view>
</template>
<script>
import { ToastInfo } from "@/utils/util";
export default {
  props: {
    changeSelect: {
      type: Function,
      default: () => { },
    },
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      copyItem: {},
    };
  },
  watch: {
    item: {
      handler: function (newVal, oldVal) {
        this.copyItem = JSON.parse(JSON.stringify(newVal));
        let str = "",
          o = this.copyItem.productAttr;
        for (let v in o) str += o[v].key + ":" + o[v].value + " ";
        this.copyItem["attr"] = str;
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    toDetail({ productId: id, isValid }) {
      if (!isValid) {
        ToastInfo('商品已下架')
      } else this.$to("/packPages/goods-detail/index?id=" + id);
    },
    // 购买数量更新
    addcount: function (e) {
      let _ = this,
        { copyItem } = _,
        { type } = e?.currentTarget?.dataset;
      copyItem.originQuantity = copyItem.quantity;
      if (!copyItem.isValid) return
      if (!Number(copyItem.quantity)) copyItem.quantity = 1;
      else if (type) {
        //代表加减
        if (type == "add") copyItem.quantity++;
        else {
          if (copyItem.quantity <= 1) copyItem.quantity = 1;
          else copyItem.quantity--;
        }
      }
      // 输入框 以及 最后结果校验
      if (copyItem.quantity <= 1) copyItem.quantity = 1;
      else if (copyItem.quantity > 200) copyItem.quantity = 200;
      _.copyItem = copyItem;

      _.changeSelect(copyItem, "changeCount");
    },
  },
};
</script>
<style scoped lang="scss">
.c-list {
  padding: 24rpx;
  padding-left: 0;
  background: #fff;
  border-radius: 8rpx;
  .disabled {
    background: #faf7f7 !important;
  }
  .checkbox-wrap {
    padding: 40rpx 32rpx 40rpx 24rpx;
    .checkbox {
      width: 30rpx;
      height: 30rpx;
      border: 1px solid #807b7b;
      border-radius: 50%;
      // margin-right: 32rpx;
      &.act {
        border: 0;
        .img {
          display: block;
          width: 100%;
          height: 100%;
        }
      }
      &.disabled {
        background: #ccc9c9;
      }
    }
  }

  .pic {
    width: 154rpx;
    height: 154rpx;
    border-radius: 4rpx;
    background: #e4e2e2;
    margin-right: 32rpx;
    image {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
  .base-info {
    height: 154rpx;
    position: relative;
    .name {
      font-size: 28rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #272727;
      line-height: 40rpx;
      width: 350rpx;
    }
    .sku {
      background: #fafafa;
      border-radius: 4rpx;
      padding: 2rpx 8rpx;
      font-size: 24rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #807b7b;
      display: inline-block;
    }
    .price {
      .rb {
        font-size: 24rpx;
        font-family: OPPOSans-M, OPPOSans;
        font-weight: normal;
        color: #ec0d0d;
        line-height: 32rpx;
        margin-right: 6rpx;
      }
      font-size: 30rpx;
      font-family: OPPOSans-H, OPPOSans;
      font-weight: bold;
      color: #ec0d0d;
      line-height: 48rpx;
    }
    .add-num {
      border-radius: 4rpx;
      height: 50rpx;
      border: 1px solid #e4e2e2;
      position: absolute;
      right: 0;
      bottom: 0;
      .div {
        width: 50rpx;
        height: 50rpx;
        font-size: 20px;
        color: #ccc9c9;
        border-right: 1px solid #e4e2e2;
      }
      .add {
        width: 50rpx;
        height: 50rpx;
        font-size: 20px;
        color: #ccc9c9;
        border-left: 1px solid #e4e2e2;
      }
      input {
        width: 70rpx;
        font-size: 24rpx;
        font-family: OPPOSans-H, OPPOSans;
        font-weight: bold;
        color: #272727;
        line-height: 30px;
        text-align: center;
      }
    }
  }
}
</style>
