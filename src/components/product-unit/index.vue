<template>
  <view class="product-unit" @click.stop="toDetail(item.id)">
    <view class="pic flex-ctr">
      <image :src="item.pic" mode="widthFix" class="img" />
    </view>
    <view class="flex-aic-btwn">
      <view class="product-info">
        <view class="product-name _ellip">
          {{ item.name }}
        </view>
        <!-- <view class="get-product-date">提货时间8月21日</view> -->
        <view class="product-price flex-aic">
          <view class="mark-price flex-aic">
            <text class="rb">฿</text>
            <text>{{ item.skuPrice }}</text>
          </view>
          <text class="origin-price" v-if="item.price>0 && item.skuPrice !=item.price">
            <text class="txt">市场价:</text>฿{{item.price}}</text>
        </view>
        <view class="sale-count">已售{{ item.sale }}件</view>
      </view>
      <view class="add-car flex-ctr" @click.stop="selectSku">加入购物车</view>
    </view>
    <!-- 加入购物车 -->
    <sku-modal v-if="selectSkuModalShow" :productId="item.id" source="catetory" @close="selectSkuModalShow = false">
    </sku-modal>
    <!-- 授权手机号 -->
    <authority-phone-modal @closemodal="isShowAuthPhone = false" :isShowAuthPhone="isShowAuthPhone">
    </authority-phone-modal>
  </view>
</template>
<script>
import skuModal from "@/components/sku-modal/index.vue";
import { debounce } from "@/utils/util.js";
const app = getApp();
export default {
  components: { skuModal },
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      selectSkuModalShow: false,
      isShowAuthPhone: false,
    };
  },
  methods: {
    selectSku: debounce(
      function (e) {
        if (!!app.globalData.hasmobile()) {
          this.selectSkuModalShow = true;
        } else this.isShowAuthPhone = true;
      },
      500,
      true
    ),
    toDetail(id) {
      this.$to("/packPages/goods-detail/index?id=" + id);
    },
  },
};
</script>
<style scoped lang="scss">
.product-unit {
  ._ellip {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  background: #fff;
  border-radius: 16rpx;
  padding: 32rpx 16rpx;
  margin-bottom: 20rpx;
  .pic {
    // height: 300rpx;
    overflow: hidden;
    margin-bottom: 24rpx;
    border-radius: 16rpx;
    .img {
      width: 100%;
    }
  }
  .product-name {
    font-size: 28rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #272727;
    width: 200px;
  }

  .product-info {
    flex: 1;
    padding-right: 32rpx;
    font-size: 28rpx;
    color: #272727;
    .get-product-date {
      margin: 20rpx 0;
      color: #333;
    }
    .product-name {
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
    }
    .product-price {
      font-size: 28rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #808080;
      .mark-price {
        font-size: 40rpx;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: bold;
        color: #ec0d0d;
        padding-right: 20rpx;
        .txt {
          font-size: 28rpx;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #ec0d0d;
        }
      }
      .origin-price {
        text-decoration: line-through;
        font-size: 24rpx;
      }
      .rb {
        font-size: 28rpx;
        padding-right: 8rpx;
      }
    }
    .sale-count {
      font-size: 28rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #808080;
    }
  }
  .add-car {
    width: 230px;
    height: 80rpx;
    background: #ec0d0d;
    border-radius: 40rpx;
    font-size: 28rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #ffffff;
  }
}
</style>
