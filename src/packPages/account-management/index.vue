<template>
  <view class="account-management">
    <view class="list">
      <view class="item flex-aic-btwn" v-for="(item, idx) in list" :key="idx" @click.stop="goto(item)">
        <view class="flex-aic">
          <text class="tit">{{ item.title }}</text>
          <image class="img" :src="item.name" v-if="item.id == 'header'" />
          <text v-else-if="item.name">{{ item.name }}</text>
        </view>
        <view v-if="item.id == 'addr'" class="">
          <image class="arrow_icon" src="/static/images/arrow_gray_icon.png" />
        </view>
      </view>
    </view>
  </view>
</template>
<script>
import { localStorage } from "@/utils/extend";
import { SK } from "@/utils/constant";
export default {
  data() {
    return {
      list: [
        {
          title: "头像:",
          id: "header",
          name: localStorage.get(SK.USER_IMAGE),
        },
        {
          title: "昵称:",
          name: localStorage.get(SK.NICK_NAME),
        },
        {
          title: "手机号:",
          name: localStorage.get(SK.USER_PHONE),
        },
        {
          title: "收货地址",
          id: "addr",
        },
      ],
    };
  },
  methods: {
    goto(item) {
      if (item.id == 'addr')
        this.$to('/packPages/address-list/index')
    }
  }
};
</script>
<style scoped lang="scss">
@import "./index.scss";
</style>
