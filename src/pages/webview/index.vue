<template>
  <view>
    <web-view src="{{url}}" bindmessage="msgHandle" />
  </view>
</template>
<script>
export default {
  data() {
    return {
      url: "",
    };
  },
  onLoad(options) {
    this.url = decodeURIComponent(options.url) || "";
  },
};
</script>
