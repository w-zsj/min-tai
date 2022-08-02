<template>
  <view class="account-management">
    <view class="list">
      <view class="item flex-aic" v-for="(item,idx) in list" :key="idx">
        {{ item.title }}
      </view>
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      list: [
        {
          title: "我的金币",
        },
      ],
    };
  },
};
</script>
<style scoped lang="scss">
@import "./index.scss";
</style>
