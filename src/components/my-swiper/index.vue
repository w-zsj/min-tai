<template>
  <view class="banner-header-container" v-if="bannerList.length">
    <view class="swiper-container" :class="source == 'gg' ? 'gg' : ''">
      <swiper
        :indicator-dots="indicatorDots"
        indicator-color="rgba(255, 255, 255, 0.7)"
        :indicator-active-color="activeColor"
        :autoplay="source == 'gg' ? false : autoplay"
        :interval="interval"
        :duration="duration"
        :circular="circular"
        class="first-swiper"
        @change="firstSwiperChange"
      >
        <block v-for="(item, index) in bannerList" :key="index">
          <swiper-item @click.stop.prevent="bannerTap(item.url, item.urlType, source)">
            <view v-if="source == 'gg'">
              <vajraPosition :list='item'></vajraPosition>
            </view>
            <image
              v-else
              class="cover-image"
              :class="source == 'gg' ? 'gg' : ''"
              src="http://www.youtaidu.com/uploads/down/20210529094352103.jpg"
            ></image
          ></swiper-item>
        </block>
      </swiper>
      <view class="swiper-dot-container" v-if="bannerList.length > 1 && source !== 'gg'">
        <block v-for="(item, index) in bannerList" :key="index"
          ><view
            :class="{
              'dot-item': true,
              'active-swiper-dot': firstBannerCurrent == index,
            }"
          ></view
        ></block>
      </view>
    </view>
  </view>
</template>
<script>
import vajraPosition from "@comps/vajra-position/index.vue";
export default {
  props: {
    bannerList: {
      type: Array,
      default: () => [],
    },
    bannerTap: {
      type: Function,
      default: () => {},
    },
    source: {
      type: String,
      default: "",
    },
  },
  components: { vajraPosition },
  data() {
    return {
      firstBannerCurrent: 0,
      indicatorDots: false,
      indicatorColor: "#8a8536",
      activeColor: "#fff",
      circular: true,
      autoplay: true,
      interval: 2000,
      duration: 500,
    };
  },
  methods: {
    firstSwiperChange: function (e) {
      const { current } = e.detail;
      this.firstBannerCurrent = current;
    },
  },
};
</script>
<style scoped lang="scss">
.banner-header-container {
  border-radius: 16rpx;
  overflow: hidden;
}
.swiper-container {
  height: 230rpx;
  width: 100%;
  position: relative;
  &.gg {
    height: 428rpx;
  }
}
.swiper-banner-content {
  width: 100%;
  display: flex;
  justify-content: space-between;
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 32rpx;
}

.banner-icon-container {
  padding-top: 16rpx;
}

.swiper-dot-container {
  position: absolute;
  width: 100%;
  bottom: 40rpx;
  display: flex;
  justify-content: center;
}

.swiper-dot-container .dot-item {
  width: 10rpx;
  height: 10rpx;
  background: #ffffff;
  border-radius: 5px;
  opacity: 0.7;
}

.swiper-dot-container .dot-item:not(:first-child) {
  margin-left: 16rpx;
}

.swiper-dot-container .active-swiper-dot {
  width: 26rpx;
  height: 10rpx;
  background: #ffffff;
  border-radius: 5rpx;
}

.first-swiper {
  height: 100%;
  width: 100%;
}

swiper-item {
  border-radius: 16rpx;
  overflow: hidden;
}
.cover-image {
  width: 100%;
  height: 230rpx;
  border-radius: 16rpx;
  &.gg {
    height: 428rpx;
  }
}
</style>
