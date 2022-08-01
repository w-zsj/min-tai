<template>
  <view>
    <view class="main-wrapper">
      <view class="header" @click="handleChooseAdd">
        <image
          class="address-icon"
          src="/static/images/shipping_address_icon.png"
        />
        <view class="address-detail" v-if="address">
          <view class="address-detail-info">
            <view class="address-detail-name">{{ address.name }}</view>
            <view class="address-detail-phone">{{ address.phoneNumber }}</view>
          </view>
          <view class="address-detail-add">
            {{ address.detailAddress }}
          </view>
        </view>
        <view class="address-tip" v-else>请选择收货地址</view>
        <image
          class="address-arrow"
          src="/static/images/arrow_gray_icon.png"
        />
      </view>
      <view class="section">
        <view class="section-title">商品信息</view>
        <view>
          <view class="section-list" v-for="item in productList" :key="item.skuId">
            <view class="section-detail">
              <image class="section-detail-image" :src="item.productPic" />
              <view class="section-detail-center flex-col-btwn">
                <view class="section-detail-title">{{ item.productName }}</view>
                <view class="section-detail-type">
                  <text class="txt" v-for="item in item.productAttr" :key="item.key">
                    {{ item.key }}:{{ item.value }}
                  </text>
                </view>
              </view>
              <view class="section-detail-right flex-col-btwn">
                <view>
                  <view class="section-detail-amount">
                    <!-- 正常显示价格 -->
                    <view v-if="item.realAmount > 0 || item.price > 0">
                      ￥{{ item.realAmount || item.price }}
                    </view>
                  </view>
                  <view class="section-detail-num">x{{ item.quantity }}</view>
                </view>
              </view>
            </view>
          </view>
        </view>

        <view class="section-item section-deliver">
          <view class="section-item-title">配送方式</view>
          <view class="section-item-right">包邮</view>
        </view>
        <view class="section-item section-remark" @click="isShowModal">
          <view class="section-item-title">备注信息</view>
          <view class="section-item-right">
            <view class="section-item-remark-detail">{{ note }}</view>
            <image
              class="section-item-remark-arrow"
              src="//file.9jinhuan.com/wine/wechat/arrow_icon.png"
            />
          </view>
        </view>
        <view class="_line"></view>
        <view class="section-item section-total">
          <view class="section-item-title">订单总额</view>
          <view class="section-item-right section-total-amount">
            <!-- 普通商品 价格 -->
            <text v-if="totalAmount > 0 || payAmount > 0"
              >￥{{ totalAmount || payAmount }}
            </text>
          </view>
        </view>
      </view>
      <view class="bottom line" :class="{ ipx: Inipx }">
        <view class="bottom-detail flex-aic">
          共{{ productCount }}件, 合计
          <view class="bottom-detail-amount">
            <text>
              <text class="bottom-detail-amount-bigger">￥</text>
              <text class="bottom-detail-amount-bigger"> {{payAmount}} </text>
            </text>
          </view>
        </view>
        <view class="bottom-btn" :class="{ gray: reqError }" @click="handleOrder">
          下单
        </view>
      </view>
    </view>

    <Pop :isShow="showModal" @conf="addNote" @close="cacelModal">
      <view class="modal-pop-title">添加备注</view>
      <textarea
        class="modal-textarea"
        placeholder-style="color: #CCC9C9;font-size: 28rpx;font-weight: normal;"
        placeholder="请输入…"
        maxlength="100"
        name="note"
        cursor-spacing="100"
        :value="textAreaNote"
        @input="inputs"
      />
    </Pop>
  </view>
</template>
<script src="./index.js"></script>
<style scoped>
@import "./index.css";
</style>
