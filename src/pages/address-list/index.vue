<template>
  <view :class="['address-container', Inipx && 'Inipx', !hasdata && 'white']">
    <view v-if="hasdata" class="list">
      <block v-for="(item, idx) in list" :key="idx">
        <view class="_in">
          <SidesLip :item="item" :data_transit="{ index: index, item: item }" @delItem="delItem" class="sit">
            <view class="cont">
              <view @click.stop.prevent="goback" data-type="back" :data-item="item">
                <view class="name flex-aic">
                  <text class="ellip">{{ item.name }}</text>
                  <text class="font28">{{ item.phoneNumber }}</text>
                </view>
                <view class="addr font28 line">
                  {{ item.detailAddress }}
                </view>
              </view>
              <view class="default flex-aic-btwn">
                <view class="selsct flex flex-ctr" :data-id="item.id" @click.stop.prevent="selet">
                  <image :src="
                      item.defaultStatus
                        ? '/static/images/checked_icon.png'
                        : '/static/images/unselected_radio.png'
                    " mode="widthFix" />
                  <view class="font28">默认地址</view>
                </view>
                <image :data-item="item" data-type="edit" @click.stop.prevent="goback"
                  src="/static/images/edit-icon.png" mode="widthFix" />
              </view>
            </view>
          </SidesLip>
        </view>
      </block>
    </view>
    <view class="empty flex-col-ctr" v-else>
      <image src="/static/images/add-empty-icon.png" mode="widthFix" />
      <text class="txt">暂无地址信息</text>
    </view>
    <view :class="[list.length && 'fixed', Inipx && 'Inipx']">
      <view class="app-btn" @click="addAddr">添加地址</view>
    </view>
  </view>
</template>

<script>
import SidesLip from "@/components/sides-lip";
import { Resource } from "@/server/resource-api";
import { ToastInfo } from "@/utils/util";
const app = getApp();
export default {
  components: {
    SidesLip,
  },
  data() {
    return {
      list: [],
      hasdata: 1,
      Inipx: !!app.globalData.Inipx,
      source: 0, // 1 各人中心 2 订单
    };
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    this.source = option?.source || 0;
    uni.hideShareMenu({
      menus: ["shareAppMessage", "shareTimeline"],
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.hasdata = 1;
    this.getList();
  },
  methods: {
    addAddr(type) {
      if (type instanceof Object) {
        delete app.globalData["addrInfo"];
      }
      let path = type == "back" ? "" : "address/index";
      this.$to(path);
    },
    delItem(data) {
      console.log("item", data);
      Resource.addAddress
        .post({ type: "delete" }, { id: data.item.id })
        .then((res) => {
          if (res.code == 1) {
            ToastInfo("已删除");
            this.getList();
          } else ToastInfo(res.message)
        })
    },
    // 获取地址列表
    getList() {
      let that = this,
        list = [],
        { hasdata } = that;
      Resource.addAddress
        .post({ type: "list" })
        .then((res) => {
          console.log('res', res)
          list = res?.data || [];
          that.hasdata = !!list.length;
          that.list = list;
        })
        .catch((e) => Object.assign(that, { list: [], hasdata: 0 }));
    },

    // 设置默认地址
    selet(e) {
      let that = this,
        { list } = that,
        { id } = e.currentTarget.dataset,
        targetItem = list.find((i) => i.id == id);
      Resource.addAddress
        .post({ type: "update" }, { defaultStatus: 1, id })
        .then((res) => {
          if (targetItem) {
            list.map((i) => {
              i.defaultStatus = 0;
              return i;
            });
            targetItem.defaultStatus = 1;
            that.list = list;
          }
        });
    },

    // 删除地址
    deladdr(e) {
      let that = this,
        { list } = that,
        { id } = e.currentTarget.dataset;
      Resource.addAddress
        .post({ type: "delete" }, { id })
        .then((res) => {
          list = list.filter((i) => i.id != id) || [];
          list = list.map((i) => {
            i.txtStyle = "";
            return i;
          });
          Object.assign(that, { list, hasdata: list.length });
        })
        .catch((e) => ToastInfo(e?.msg));
    },

    // 编辑
    goback(e) {
      let { item, type } = e.currentTarget.dataset;
      if ((type == "back" && this.source == 1) || type == "edit") {
        app.globalData["addrInfo"] = item;
        this.addAddr(type);
      }
    },
  },
};
</script>
<style scoped>
@import "./index.css";
</style>
