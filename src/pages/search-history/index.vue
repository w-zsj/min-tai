<template>
  <view class="search-history">
    <!-- 搜索 -->
    <serachInput :changeValue="changeValue" :source="2"></serachInput>
    <!-- 历史记录 -->
    <view class="history">
      <view class="title flex-aic">
        历史记录
        <image src="/static/images/delete_icon.png" @click="clearAll" />
      </view>
      <view class="list flex-aic flex-wrap">
        <view class="item" v-for="(item, idx) in historyData" :key="idx">{{ item }}</view>
      </view>
    </view>
    <!-- 大家都在搜 -->
    <view class="history">
      <view class="title flex-aic"> 大家都在搜 </view>
      <view class="list flex-aic flex-wrap">
        <view class="item" v-for="(item, idx) in historyData" :key="idx">{{ item }}</view>
      </view>
    </view>
  </view>
</template>
<script>
import { localStorage } from "@/utils/extend";
import { SK } from "@/utils/constant";
import serachInput from "@comps/serach-input/index.vue";
let _;
export default {
  components: { serachInput },
  data() {
    _ = this;
    return {
      historyData: JSON.parse(localStorage.get(SK.SEARCH_HISTORY) || "[]"),
      recdList: [], // 推荐
      value: "",
    };
  },
  methods: {
    changeValue(value) {
      if (typeof value !== "string") value = value.detail.value;
      value = value.replace(/\s+/g, "");
      console.log('搜索内容', value)
      let history = JSON.parse(localStorage.get(SK.SEARCH_HISTORY) || "[]");
      if (value && !history.includes(value)) {
        history.unshift(value);
        localStorage.set(SK.SEARCH_HISTORY, JSON.stringify(history));
        _.historyData = [...history];
        console.log("value", _.handleData);
      }
    },
    clearAll() {
      this.historyData = [];
      localStorage.del(SK.SEARCH_HISTORY);
    },
  },
};
</script>
<style scoped lang="scss">
page {
  background: #faf7f7;
}
.search-history {
  min-height: 100vh;
  padding: 32rpx;
  background: #faf7f7;
  .title {
    font-size: 32rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: bold;
    color: #272727;
    margin: 30rpx 0;
    image {
      width: 48rpx;
      height: 48rpx;
    }
  }
  .history {
    margin-top: 100rpx;
    .list {
      .item {
        padding: 8rpx 20rpx;
        background: #c9c3c3;
        color: #333;
        font-size: 28rpx;
        border-radius: 8rpx;
        margin-right: 20rpx;
        margin-bottom: 20rpx;
      }
    }
  }
}
</style>
