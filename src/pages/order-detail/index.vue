<template>
  <view>
    <view class="main-wrapper">
      <view class="header">
        <view class="order-status">
          <view>{{ enmuStatus[orderStatus] }}</view>
        </view>
        <view class="header-address">
          <image class="address-icon" src="/static/images/shipping_address_icon.png" />
          <view class="address-detail">
            <view class="address-detail-info">
              <view class="address-detail-name">{{ address.receiverName }}</view>
              <view class="address-detail-phone">{{ address.receiverPhone }}</view>
            </view>
            <view class="address-detail-add">{{ address.receiverDetailAddress }}</view>
          </view>
        </view>
      </view>
      <view class="section">
        <view class="section-title">商品信息</view>
        <view>
          <view class="section-list" v-for="item in productList" :key="item.id">
            <view class="section-detail" @click="checkGoodDetail(item.productId)">
              <image class="section-detail-image" :src="item.productPic" />
              <view class="section-detail-center flex-col-btwn">
                <view class="section-detail-title">{{ item.productName }}</view>
                <view class="section-detail-type">
                  <text class="txt" v-for="item in item.productAttr"
                    :key="item.key">{{ item.key }}:{{ item.value }}</text>
                </view>
              </view>
              <view class="section-detail-right flex-col-btwn">
                <view>
                  <view class="section-detail-amount">
                    <view class="integra" v-if="item.useCoin > 0">
                      {{ item.useCoin }}金币
                    </view>
                    <!-- 普通商品价格 -->
                    <view v-if="item.productPrice > 0">{{ item.useCoin > 0 ? "+" : "" }}￥{{ item.productPrice }}</view>
                  </view>
                  <view class="section-detail-num">x{{ item.productQuantity }}</view>
                </view>
              </view>
            </view>
            <view class="line"></view>
          </view>
        </view>

        <view class="section-item section-num">
          <view class="section-item-title">商品总价</view>
          <view class="section-item-right flex-aic">
            <text v-if="totalAmount > 0">￥{{ totalAmount }}</text>
          </view>
        </view>
        <view class="section-item section-deliver">
          <view class="section-item-title">金币</view>
          <view class="section-item-right">￥{{ useCoin }}</view>
        </view>

        <view class="real-amount">
          <text>共{{ productQuantity }}件, 实付款</text>
          <text class="real-amount-num">￥{{ payAmount }}</text>
        </view>
      </view>

      <view class="section">
        <view class="section-title">订单信息</view>
        <view class="section-item" v-if="payImageUrl">
          <view class="section-item-title">支付凭证</view>
          <view class="section-item-right flex-aic" @click.stop="previewImg(payImageUrl)">
            <text class="txt">点击查看</text>
            <image class="payImageUrl" show-menu-by-longpress :src="payImageUrl" />
          </view>
        </view>
        <view class="section-item">
          <view class="section-item-title">订单编号</view>
          <view class="section-item-right">
            {{ orderSn }}
            <text class="section-item-right-copy" :data-ordersn="orderSn" @click="copyOrderSn">复制</text>
          </view>
        </view>
        <view class="section-item">
          <view class="section-item-title">下单时间</view>
          <view class="section-item-right">{{ createTime }}</view>
        </view>
        <view class="section-item" v-if="paymentTime">
          <view class="section-item-title">支付时间</view>
          <view class="section-item-right">{{ paymentTime }}</view>
        </view>
        <view class="section-item" v-if="tradeNo">
          <view class="section-item-title">交易单号</view>
          <view class="section-item-right">{{ tradeNo }}</view>
        </view>
        <view class="section-item">
          <view class="section-item-title">备注信息</view>
          <view class="section-item-right">{{ note }}</view>
        </view>
      </view>

      <view class="bottom line" :class="{ ipx: Inipx }">
        <view class="bottom-btn bottom-btn-left" v-if="orderStatus === 3"
          @click.stop="handleBtnOrder(copyItem, 'confirmReceiveOrder')">确认收货
        </view>
        <view class="bottom-btn bottom-btn-left" v-if="orderStatus === 0"
          @click.stop="handleBtnOrder(copyItem, 'cancelUserOrder')">取消订单</view>
        <view class="bottom-btn bottom-btn-left" v-if="orderStatus == 4 || orderStatus == 5"
          @click.stop="handleBtnOrder(copyItem, 'again')">再次购买</view>
        <view class="bottom-btn" v-if="orderStatus === 0" @click.stop="handleBtnOrder(copyItem, 'pay')">立即支付
          <text v-if="countDown"> {{ date.m }}:{{ date.s }} </text>
        </view>
      </view>
    </view>
  </view>
</template>
<script src="./index.js"></script>
<style scoped lang="scss">
@import "./index.scss";
</style>
