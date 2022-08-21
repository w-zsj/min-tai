<template>
  <view class="category">
    <!-- 搜索 -->
    <view class="search content-height">
      <serachInput :goto="goto" :disabled="true"></serachInput>
    </view>
    <!-- 正文 -->
    <view class="content flex-aic" :style="'height:' + contentHeight">
      <!-- 一级类目 -->
      <view class="one-category skeleton-rect">
        <scroll-view scroll-y="true" :scroll-into-view="'item_'+oneCateIndex" :scroll-with-animation="true">
          <view class="item flex-ctr" :class="idx == oneCateIndex ? 'act' : ''" v-for="(item, idx) in list" :key="idx"
            @click.stop="select(item, idx, 'one')" :id="'item_'+idx">
            <view class="" style="padding: 0 20rpx; text-align: center">
              {{ item.name }}
            </view>
            <view class="before" v-if="idx == oneCateIndex">
              <view class="in"></view>
            </view>
            <view class="after" v-if="idx == oneCateIndex">
              <view class="in"></view>
            </view>
          </view>
        </scroll-view>
      </view>
      <!-- 右侧 -->
      <view class="prod-list">
        <!-- 二级类目 -->
        <view class="calc-height content-height">
          <view class="two-category" v-if="isShowTwoCategory">
            <view class="horizontal-row">
              <scroll-view scroll-x="true" :scrollIntoView="
                  'key_' + (twoCateIndex > 0 ? twoCateIndex - 1 : twoCateIndex)
                " class="renwu-title-items" scroll-with-animation>
                <view class="item flex-ctr" :class="idx == twoCateIndex ? 'act' : ''" :id="'key_' + idx"
                  v-for="(item, idx) in list[oneCateIndex].children" :key="idx" @click.stop="select(item, idx, 'two')">
                  {{ item.name }}
                </view>
              </scroll-view>
              <view class="icon" @click="isExpand = !isExpand">
                <image class="img" src="/static/images/arrow_icon.png" mode=""></image>
              </view>
            </view>
          </view>
          <!-- 展开二级类目 -->
          <view class="expand" :class="isExpand ? 'show' : ''" v-if="isShowTwoCategory">
            <view class="all flex-aic-btwn">
              <view class="item">全部分类</view>
              <view class="icon flex-ctr" @click="isExpand = !isExpand">
                <image class="_img" src="/static/images/arrow_icon.png" mode=""></image>
              </view>
            </view>
            <view class="other">
              <view class="item flex-ctr" :class="idx == twoCateIndex ? 'act' : ''" :id="'key_' + idx"
                v-for="(item, idx) in list[oneCateIndex].children" :key="idx" @click.stop="select(item, idx, 'two')">
                {{ item.name }}
              </view>
            </view>
          </view>
          <view class="bg" v-show="isExpand" @click="isExpand = !isExpand"></view>
        </view>
        <!-- 搜索结果商品 -->

        <view class="search-list" :style="{ height: calcHeight }" @touchstart="touchStart" @touchmove="touchMove"
          @touchend="touchEnd">
          <view class="empt flex-col-ctr" :class="isShowTwoCategory ? 'pad-top' : ''" v-if="prodList.length == 0">
            <image class="_img" src="/static/images/add-empty-icon.png" mode=""></image>
            <view class="txt">暂无商品</view>
          </view>
          <scroll-view lower-threshold="100" :scroll-top="scrollTop" scroll-y="true" @scrolltolower="bindscrolltolower"
            v-else>
            <view class="item">
              <block v-for="(item, index) in prodList" :key="index">
                <view class="skeleton-rect">
                  <product-unit className="catetory" :index="index" :itemClone="item" @customevent="customevent">
                  </product-unit>
                </view>
              </block>
            </view>
            <view class="end flex-ctr" v-if="prodList.length && oneCateIndex < list.length && isEnd">上拉 至下一分类</view>
            <view class="end flex-ctr" v-else-if="isEnd && prodList.length">—— 暂无更多商品 ——</view>
          </scroll-view>
        </view>
      </view>
    </view>
    <!-- 加入购物车 -->
    <sku-modal v-if="selectSkuModalShow" :productId="item.id" source="catetory" @close="selectSkuModalShow = false">
    </sku-modal>
    <!-- 授权手机号 -->
    <authority-phone-modal @closemodal="closePhoneModal" :isShowAuthPhone="isShowAuthPhone"></authority-phone-modal>
  </view>
</template>

<script>
import { debounce } from "@/utils/util.js";
import { Resource } from "@/server/resource-api";
import productUnit from "@/components/product-unit/cell.vue";
import skuModal from "@/components/sku-modal/index.vue";
import serachInput from "@comps/serach-input/index.vue";
const app = getApp();
let _;
export default {
  components: { productUnit, skuModal, serachInput },
  data() {
    _ = this;
    return {
      queryCId: "", // 从首页 分类进来

      contentHeight: "100vh",
      isExpand: false, // 二级类目是否展开
      oneCateId: "", // 一级类类目id
      oneCateIndex: 0, // 一级类目索引
      twoCateIndex: 0, // 二级类目索引
      rise: 0, // 0 无排序 1 升序 2 降序 升序降序 映射 0 升序 1 降序
      sale: false, // 销售量排序 0 首次进来 1 价格 2 销量
      list: [], // 分类数据
      prodList: [], // 搜索商品数据
      calcHeight: "100%",
      // 购物车弹框使用
      isShowAuthPhone: false, // 小程序授权手机号弹框
      selectSkuModalShow: false,
      skuEventParams: null,
      item: {},
      scrollTop: -1,

      isEnd: false,
      total: 0,
      pageNum: 1,

      touchStartX: 0, //触摸时的原点
      touchStartY: 0, //触摸时的原点
      time: 0, // 时间记录，用于滑动时且时间小于1s则执行左右滑动
      interval: "", // 记录/清理时间记录
      touchMoveX: 0, // x轴方向移动的距离
      touchMoveY: 0, // y轴方向移动的距离
      direction: "all",
      distance: 50,
      isBottom: false,
      scrollCount: 0,
      islowContentHeight: false,
    };
  },
  onLoad(options) {
    this.getList();
  },
  onShow() {
    this.queryCId = app.globalData.categoryId || "";
    console.log("this.queryCId", this.queryCId);
    if (this.queryCId || getApp().globalData.needUpdeta) {
      delete app.globalData.categoryId || "";
      delete getApp().globalData.needUpdeta;
      this.twoCateIndex = 0;
      this.oneCateIndex = 0;
      this.isEnd = false;
      this.pageNum = 1;
      this.id = "";
      this.getList();
    }
  },
  computed: {
    isShowTwoCategory() {
      let { list, oneCateIndex } = this;
      return !!(
        list[oneCateIndex] &&
        list[oneCateIndex].children &&
        list[oneCateIndex].children.length
      );
    },
  },
  id: "",
  methods: {
    touchStart(e) {
      console.log("开始滚动", this.isEnd);
      this.touchStartX = e.changedTouches[0].pageX; // 获取触摸时的原点
      this.touchStartY = e.changedTouches[0].pageY; // 获取触摸时的原点
      // 使用js计时器记录时间
      this.interval = setInterval(() => {
        this.time++;
      }, 100);
    },
    // 触摸移动事件
    touchMove(e) {
      this.touchMoveX = e.changedTouches[0].pageX;
      this.touchMoveY = e.changedTouches[0].pageY;
    },
    // 触摸结束事件
    // 触摸结束事件
    touchEnd(e) {
      let that = this;
      let moveX = this.touchMoveX - this.touchStartX;
      let moveY = this.touchMoveY - this.touchStartY;
      if (Math.sign(moveX) == -1) {
        moveX = moveX * -1;
      }
      if (Math.sign(moveY) == -1) {
        moveY = moveY * -1;
      }
      if (2 * moveX <= moveY) {
        // 上下
        if (this.direction != "all" && this.direction != "vertical") return;
        // 向上滑动
        if (this.touchMoveY - this.touchStartY <= -this.distance && this.time < 10) {
          if (this.isEnd && this.scrollCount >= 2 || this.islowContentHeight) {
            console.log("1_1_11 向上滑动", this.scrollCount, this.islowContentHeight, this.oneCateIndex);
            this.scrollCount = 0;
            if (this.oneCateIndex < this.list.length - 1) {
              let eq = this.oneCateIndex + 1;
              let item = this.list[eq];
              this.select(item, eq, "one");
            } else {
              let item = this.list[0];
              this.select(item, 0, "one");
            }
          }
        }
        // 向下滑动
        if (this.touchMoveY - this.touchStartY >= this.distance && this.time < 10) {
          console.log("1_2 向下滑动");
        }
      }
      clearInterval(this.interval); // 清除setInterval
      this.time = 0;
    },
    // 类目选择
    select(item = {}, index = -1, type) {
      console.log("item", item, index);

      if (
        (type == "one" && index == _.oneCateIndex) ||
        (type == "two" && index == _.twoCateIndex)
      )
        return;

      switch (type) {
        case "one":
          Object.assign(this, {
            oneCateIndex: index,
            twoCateIndex: 0,
            isExpand: false,
            sale: false,
            rise: 0,
            scrollTop: -1,
          });
          break;
        case "two":
          Object.assign(this, {
            twoCateIndex: index,
            isExpand: false,
            scrollTop: -1,
          });
          break;
        case "all":
      }
      Object.assign(this, {
        isEnd: false,
        pageNum: 1,
      });
      _.id = item.id;
      console.log("item.id>>", item.id);
      _.getProdList(item.id);
    },
    // 获取分类
    getList() {
      let { oneCateIndex = 0 } = this;
      Resource.open.post({ type: "home/classifyList" }, {}).then((res) => {
        this.list = res?.data || [];
        // 渲染骨架屏异步数据
        if (res.code == 1) {
          if (res?.data?.length) {
            if (oneCateIndex >= res.data.length) {
              oneCateIndex = 0;
              this.oneCateIndex = 0;
            }
            let item = res.data[oneCateIndex];
            this.id = item.id;
            // 处理从首页进来
            if (this.queryCId) {
              for (let i = 0; i < res.data.length; i++) {
                if (res.data[i].id == this.queryCId) {
                  this.select(res.data[i], i, "one");
                  this.id = this.queryCId;
                  item = res.data[i];
                }
              }
            }
            this.getProdList(item.id);
          }
        } else this.reset();
      });
    },
    goto() {
      this.$to("/packPages/search-history/index");
    },
    // 搜索商品
    getProdList(id = 0) {
      // productClassifyId	分类ID 一级全部分类传0
      let { isEnd, pageNum, prodList } = _;
      if (isEnd) return;
      _.isEnd = true;
      console.log("id>>", id);
      Resource.open
        .post(
          { type: "product/queryProductByClassify" },
          {
            productClassifyId: id,
            sort: 1,
            sortColumn: 1,
            pageNum,
            pageSize: 10,
          },
          { loadingDelay: true }
        )
        .then((res) => {
          let { code, data } = res;
          if (code == 1) {
            if (pageNum == 1) prodList = data.list || [];
            else prodList = prodList.concat(data.list);
            setTimeout(() => {
              _.isEnd = data.pageNum * data.pageSize >= data.total;
            }, 500);
            Object.assign(_, {
              prodList,
              isEnd,
              total: data.total,
            });
            // 渲染骨架屏异步数据
            _.$nextTick(function () {
              _.scrollTop = 0;
              const query = uni.createSelectorQuery().in(_);
              query
                .selectAll(".content-height")
                .boundingClientRect((data) => {
                  let tal = data.reduce(function getSum(pre, next) {
                    return pre.height + next.height;
                  });
                  _.calcHeight = `calc(100vh - ${tal}px)`;
                  console.log("data", tal, _.calcHeight);
                })
                .exec();

              // 内容高度
              query
                .select(".search")
                .boundingClientRect((data) => {
                  console.log(".search", data);
                  _.contentHeight = `calc(100vh - ${data.height + 10}px)`;
                })
                .exec();
              let searchListH = 0,
                itemH = 0;
              setTimeout(() => {
                query
                  .select(".search-list")
                  .boundingClientRect((data) => {
                    searchListH = data.height;
                  })
                  .exec();
              }, 0);
              setTimeout(() => {
                query
                  .select(".search-list .item")
                  .boundingClientRect((data) => {
                    itemH = data?.height || 0;

                    _.islowContentHeight = searchListH - itemH > 0;
                    console.log("3333", _.islowContentHeight, searchListH, itemH);
                  })
                  .exec();
              }, 100);

            });
          }
          // else _.reset();
        });
    },
    customevent: debounce(
      function (params) {
        if (app.globalData.hasmobile()) {
          Object.assign(_, {
            selectSkuModalShow: true,
            item: params.item,
          });
        } else _.isShowAuthPhone = true;
      },
      500,
      true
    ),
    checkHasMobile(cb) {
      if (app.globalData.hasmobile()) {
        cb();
      } else {
        _.isShowAuthPhone = true;
      }
    },
    closePhoneModal() {
      _.isShowAuthPhone = false;
    },
    reset() {
      Object.assign(_, {
        oneCateIndex: 0,
        twoCateIndex: 0,
        isExpand: false,
        rise: 0, // 0 无排序 1 升序 2 降序 升序降序
        sale: false, // 销售量排序
      });
    },
    // 商品滚动加载
    bindscrolltolower(e) {
      console.log("滚动到底部了", _.id);
      let { isEnd, pageNum } = _;
      if (isEnd) {
        _.isBottom = true;
        _.scrollCount++;
        return;
      } else {
        pageNum++;
        _.pageNum = pageNum;
        _.getProdList(_.id);
      }
    },
  },
};
</script>

<style scoped>
@import "./index.css";
</style>
