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
          <!-- 秒杀时间段 即将开始时显示-->
          <view class="flash" v-if="modelType.priceType == 3 && modelType.startTime && !modelType.countDownTime">
            <view class="timer flex-aic">
              <view class="year flex-ctr">{{ modelType.month }}</view>
              <view class="flex-ctr">{{ modelType.hours }} 开抢</view>
            </view>
          </view>
          <!-- 会员价、秒杀 -->
          <view class="flex-aic" v-if="showMemberSkuPricePrice">
            <view class="txt" v-if="modelType.priceType == 6">新人价</view>
            <view class="txt" v-else-if="modelType.priceType == 3">秒杀价</view>
            <view class="txt" v-else-if="!modelType.integration">
              {{ memberleve.memberlevelid == 5 ? "至尊价" : "VIP价" }}
            </view>
            <view>
              <text class="rb">¥</text>
              <text>{{ modelType.activityPrice }}</text>
            </view>
          </view>
          <!-- 市场价 -->
          <view :class="['member', 'flex-aic', expand.isIntegration ? 'integra' : '']">
            <!-- 如果是积分兑换的商品 显示积分+ 价格  积分商品价格可以为0 正常商品不能为0 -->
            <text class="txt" v-if="modelType.integration">
              <text class="integration-count txt">
                {{modelType.integration * count}}
              </text>
              积分{{ modelType.curPrice > 0 ? "+" : "" }}
            </text>
            <!-- 积分商品可能价格为0 不显示 与普通商品 无价格展示不同  -->
            <view v-if="(modelType.curPrice > 0 && modelType.integration) ||!modelType.integration">
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
        <view :class="['count','flex-aic-btwn', selectBtnType == 'buy' && isJoinGroup || classNameStatus && 'disabled']"
          v-if="source != 'mall-edit-sku'">
          <view class="title flex-ctr">数量</view>
          <view class="ipt flex-aic">
            <view class="div flex-ctr" data-type="div" @click.stop="addcount">-</view>
            <view class="number">
              <input class="section-input" type="number"
                :disabled="(selectBtnType == 'buy' && isJoinGroup) || classNameStatus" v-model="count"
                @blur="addcount" />
            </view>
            <view class="div flex-ctr" data-type="add" @click.stop="addcount">+</view>
          </view>
        </view>
      </view>
      <!-- 底部 -->
      <view :class="['buy-btn', 'flex-aic-btwn' , classNameStatus && 'disabled']">
        <button :class="['group-car-btn','flex-ctr',selectBtnType == 'buy'&&'red-bg']" @click.stop="submit">
          <!-- 积分活动 -->
          <view v-if="expand.isIntegration">
            <text class="txt" v-if="allNotStock">暂无库存</text>
            <text class="txt" v-else-if="modelType.integration * count <= leftIntegrationCount">
              立即兑换
            </text>
            <text class="txt" v-else>积分不足</text>
          </view>
          <!-- 非卖品不可点击 -->
          <view v-else-if="expand.isGift">不支持单独购买</view>
          <!-- 购物车修改sku -->
          <view v-else-if="source == 'mall-edit-sku'">确认</view>
          <!-- 拼团 -->
          <view v-else-if="isJoinGroup">
            <text class="txt" v-if="selectBtnType == 'addcar'">
              {{expand.hasCoupons ? "领券购买" : "原价购买"}}
            </text>
            <text class="txt" v-else-if="teamId">去参团</text>
            <text v-else>发起拼团</text>
          </view>
          <!-- 正常商品 -->
          <view v-else>
            <text class="txt" v-if="selectBtnType == 'addcar'">加入购物车</text>
            <text class="txt" v-else>
              {{ expand.hasCoupons ? "领券购买" : "立即购买"}}
            </text>
          </view>
        </button>
      </view>
    </view>
    <!-- 积分不足弹框内容 -->
    <view class="integration" v-if="ShowPntegrationPop">
      <view class="tit flex-ctr">提示</view>
      <view class="item flex-col-ctr">
        <view>现有积分余额不足 </view>
        <view>是否前往任务中心赚取积</view>
      </view>
      <view class="flex-aic-btwn">
        <view class="no btn flex-ctr" @click.stop="close">否</view>
        <view class="yes btn flex-ctr" @click.stop="goto">是</view>
      </view>
    </view>
  </pop>
</template>
<script src='./index.js'></script>
<style scoped lang='scss'>
@import './index.scss';
</style>