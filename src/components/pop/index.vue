<template>
  <!--components/modal/index.wxml-->
  <view :class="'_modal ' + (isShow ? 'act' : '') + ' ' + direction + ' ' + className" @touchmove.stop.prevent="trueFun"
    @click.stop="close">
    <view class="cont" :class="{ipx:Inipx}" @click.stop.prevent="trueFun">
      <!-- <text class="bor"></text> -->
      <view class="close">
        <view @click.stop="close" v-if="isShowCancel">{{ cancelTxt }}</view>
        <view class="tit" v-if="tit">{{ tit }}</view>
        <view class="conf" @click.stop="conf" v-if="isShowConf">确认</view>
        <view class="icon-close" @click.stop="close" v-if="isShowIcon"></view>
      </view>
      <slot></slot>
    </view>
  </view>
</template>

<script>
// components/modal/index.js
const app = getApp();
export default {
  data() {
    return {
      Inipx: app.globalData['Inipx']
    };
  },
  /**
   * 组件的属性列表
   */
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    direction: {
      type: String,
      default: ''
    },
    className: {
      type: String,
      default: ''
    },
    tit: {
      type: String,
      default: ''
    },
    isShowCancel: {
      type: Boolean,
      default: true
    },
    cancelTxt: {
      type: String,
      default: '取消'
    },
    isShowConf: {
      type: Boolean,
      default: true
    },
    isShowIcon: {
      type: Boolean,
      default: false
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    close() {
      this.$emit('close', {
        detail: '关闭弹框'
      });
    },

    conf() {
      this.$emit('conf', {
        detail: '确认'
      });
    },

    trueFun() {
    }
  }
};
</script>
<style scoped>
@import "./index.css";
</style>
