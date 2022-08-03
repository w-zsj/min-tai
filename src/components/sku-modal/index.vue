<template>
  <pop :isShow="info.skuInfoList && info.skuInfoList.length > 0" :isShowConf="false" :isShowIcon="true"
    :isShowCancel="false" @close="close">
    <view class="select-sku flex-col" v-show="!ShowPntegrationPop">
      <!-- 商品 -->
      <view class="product flex-aic-star">
        <view class="pic flex-ctr">
          <image class="img" :src="modelType.pic" mode="aspectFill" />
        </view>
        <view class="price">
          <!-- 市场价 -->
          <view :class="['member', 'flex-aic']">
            <view>
              <text class="txt rb">¥</text>
              <text class="txt">{{ modelType.curPrice }}</text>
            </view>
          </view>
        </view>
      </view>
      <!-- 选择 sku -->
      <view class="sku">
        <block v-for="(item, idx) in modelTypeLists" :key="idx">
          <view class="_wrap">
            <view class="tit">{{ item.name }}</view>
            <view class="list flex-aic flex-wrap">
              <block v-for="(subItem, idxj) in item.specificationName" :key="idxj">
                <view :class="['flex-ctr', 'item', subIndex[idx] === idxj && 'act', !subItem.isDisplay && 'gray',]"
                  :data-value="subItem.value" :data-index="idxj" :data-isShow="subItem.isShow" :data-parent-index="idx"
                  :data-isdisplay="subItem.isDisplay" @click.stop="chooseModelType">
                  {{ subItem.value }}
                </view>
              </block>
            </view>
          </view>
        </block>
        <!-- 购买数量  购物车修改sku不展示-->
        <view :class="['count','flex-aic-btwn', classNameStatus && 'disabled']"
          v-if="source != 'mall-edit-sku'">
          <view class="title flex-ctr">数量</view>
          <view class="ipt flex-aic">
            <view class="div flex-ctr" data-type="div" @click.stop="addcount">-</view>
            <view class="number">
              <input class="section-input" type="number"
                :disabled="classNameStatus" v-model="count"
                @blur="addcount" />
            </view>
            <view class="div flex-ctr" data-type="add" @click.stop="addcount">+</view>
          </view>
        </view>
      </view>
      <!-- 底部 -->
      <view :class="['buy-btn', 'flex-aic-btwn' , classNameStatus && 'disabled']">
        <button :class="['group-car-btn','flex-ctr',selectBtnType == 'buy'&&'red-bg']" @click.stop="submit">
          <!-- 正常商品 -->
          <view>
            <text class="txt" v-if="selectBtnType == 'addcar'">加入购物车</text>
            <text class="txt" v-else>
              立即购买
            </text>
          </view>
        </button>
      </view>
    </view>
  </pop>
</template>
<script src='./index.js'></script>
<style scoped lang='scss'>
@import './index.scss';
</style>