<template>
  <view class="header-container" :style="{marginTop:marginTop+'rpx'}">
    <swiper class="detail-swiper" :indicator-dots="indicatorDots" :indicator-active-color="activeColor"
      :autoplay="autoplay" :interval="interval" :circular="circular" :duration="duration"
      @animationfinish="changeGoodsSwip" :current="goodsIndex" @change="swiperChange">
      <swiper-item v-if="detail.video">
        <view class="video-swiper-item">
          <video class="video-container" id="demoVideo" :poster="detail.video+'?x-oss-process=video/snapshot,t_0,f_jpg'"
            :show-center-play-btn="false" :controls="controls" :src="detail.video" :enable-progress-gesture="false"
            @fullscreenchange="onVideoFullScreen">
            <image v-if="isShowPlayBtn" src="@/static/images/video.png" class="detail-play-btn" @click="parsePlay">
            </image>
          </video>
        </view>
      </swiper-item>
      <block v-for="(item, index) in imageList" :key="index">
        <swiper-item>
          <image class="cover-image" :src="item"></image>
        </swiper-item>
      </block>
    </swiper>
    <view :class="{'swiper-dot-container': true,'video-swiper-dot': detail.video}"
      v-if="imageList.length || detail.video ">
      <view class="dot-item">{{swiperCurrent+1}}/{{detail.video?imageList.length+1:imageList.length}}</view>
    </view>
  </view>
</template>

<script>
let _;
export default {
  name: "swiper-component",
  props: {
    detail: { //商品详情
      type: Object,
      default: {}
    },
    imageList: { //banner图片列表
      type: Array,
      default: []
    }
  },
  data() {
    _ = this;
    return {
      indicatorDots: false,
      indicatorColor: '#8a8536',
      activeColor: '#ffffff',
      circular: true,
      autoplay: false,
      interval: 2000,
      duration: 500,
      goodsIndex: 0,
      isShowPlayBtn: true,
      controls: false,
      swiperCurrent: 0,
      marginTop: 104,
      swiperError: 0,
      preIndex: 0
    }
  },
  mounted() {
    // #ifndef MP-ALIPAY
    this.videoContext = uni.createVideoContext('demoVideo', this);
    // #endif
  },
  methods: {
    // 改变轮播图
    changeGoodsSwip: function (detail) {
      if (detail.detail.source == 'touch') {
        //当页面卡死的时候，current的值会变成0
        if (detail.detail.current == 0) {
          //有时候这算是正常情况，所以暂定连续出现3次就是卡了
          let swiperError = this.swiperError;
          swiperError += 1;

          Object.assign(_, { swiperError: swiperError });
          if (swiperError >= 2) {
            //在开关被触发3次以上
            console.error(this.swiperError);
            Object.assign(_, { goodsIndex: this.preIndex }); //，重置current为正确索引
            Object.assign(_, { swiperError: 0 });
          }
        } else {
          //正常轮播时，记录正确页码索引
          Object.assign(_, { preIndex: detail.detail.current }); //将开关重置为0
          Object.assign(_, { swiperError: 0 });
        }
      }
      this.videoContext.pause();
    },
    // 全屏事件
    onVideoFullScreen(e) {
      if (!this.fullScreenStatus) {
        this.videoContext.requestFullScreen();
        this.fullScreenStatus = true;
        Object.assign(_, { marginTop: 0 });
      } else {
        this.videoContext.exitFullScreen();
        this.fullScreenStatus = false;
        Object.assign(_, { marginTop: 104 });
      }
    },
    // 播放
    parsePlay: function () {
      this.videoContext.play();
      Object.assign(_, { isShowPlayBtn: false, controls: true });
    },
    // 轮播图切换
    swiperChange: function (e) {
      const { current } = e.detail;
      Object.assign(_, { swiperCurrent: current });
    },
  }
}
</script>

<style lang="scss" scoped>
.header-container {
  width: 750rpx;
  height: 750rpx;
  font-size: 0;
  position: relative;
  margin-top: 104rpx;
  .detail-swiper {
    height: 100% !important;
  }
  .cover-image {
    width: 750rpx;
    height: 750rpx;
  }
  .detail-play-btn {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 116rpx;
    height: 116rpx;
  }
  .video-container {
    width: 750rpx;
    height: 750rpx;
  }
  .video-swiper-item {
    position: relative;
    width: 750rpx;
    height: 750rpx;
  }
  .swiper-dot-container {
    position: absolute;
    right: 32rpx;
    bottom: 32rpx;
  }
  .video-swiper-dot {
    bottom: 64rpx !important;
  }
  .dot-item {
    width: 78rpx;
    height: 47rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #ffffff;
    background: #272727;
    border-radius: 24rpx;
    opacity: 0.4;
  }
}
</style>