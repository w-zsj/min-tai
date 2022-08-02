<template>
  <view class="category">
    <!-- 正文 -->
    <view class="content flex-aic" :style="'height:' + contentHeight">
      <!-- 一级类目 -->
      <view class="one-category skeleton-rect">
        <scroll-view scroll-y="true">
          <view
            class="item flex-ctr"
            :class="idx == oneCateIndex ? 'act' : ''"
            v-for="(item, idx) in list"
            :key="idx"
            @click.stop="select(item, idx, 'one')"
          >
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
        <view class="calc-height">
          <view class="two-category" v-if="isShowTwoCategory">
            <view class="horizontal-row">
              <scroll-view
                scroll-x="true"
                :scrollIntoView="
                  'key_' + (twoCateIndex > 0 ? twoCateIndex - 1 : twoCateIndex)
                "
                class="renwu-title-items"
                scroll-with-animation
              >
                <view
                  class="item flex-ctr"
                  :class="idx == twoCateIndex ? 'act' : ''"
                  :id="'key_' + idx"
                  v-for="(item, idx) in list[oneCateIndex].children"
                  :key="idx"
                  @click.stop="select(item, idx, 'two')"
                >
                  {{ item.name }}
                </view>
              </scroll-view>
              <view class="icon" @click="isExpand = !isExpand">
                <image
                  class="img"
                  src="https://file.9jinhuan.com/wine/wechat/arrow_icon.png"
                  mode=""
                ></image>
              </view>
            </view>
          </view>
          <!-- 展开二级类目 -->
          <view class="expand" :class="isExpand ? 'show' : ''" v-if="isShowTwoCategory">
            <view class="all flex-aic-btwn">
              <view class="item">全部分类</view>
              <view class="icon flex-ctr" @click="isExpand = !isExpand">
                <image
                  class="_img"
                  src="https://file.9jinhuan.com/wine/wechat/arrow_icon.png"
                  mode=""
                ></image>
              </view>
            </view>
            <view class="other">
              <view
                class="item flex-ctr"
                :class="idx == twoCateIndex ? 'act' : ''"
                :id="'key_' + idx"
                v-for="(item, idx) in list[oneCateIndex].children"
                :key="idx"
                @click.stop="select(item, idx, 'two')"
              >
                {{ item.name }}
              </view>
            </view>
          </view>
          <view class="bg" v-show="isExpand" @click="isExpand = !isExpand"></view>
          <!-- 价格销量筛选 -->
          <view class="filter flex-ctr" v-if="prodList.length">
            <view class="price flex-aic" @click.stop="filter('rise')">
              <view class="txt flex-ctr" :class="rise ? 'act' : ''">价格</view>
              <view
                class="icon flex-col-ctr"
                :class="rise == 1 ? 'act' : rise == 0 ? 'stop' : ''"
              >
                <image
                  class="ic gray"
                  src="@/static/imgs/triangle-gray.png"
                  v-if="rise == 0"
                />
                <image
                  class="ic"
                  src="@/static/imgs/triangle-act.png"
                  v-else
                  style="margin-bottom: 2rpx"
                />
                <image class="ic" src="@/static/imgs/triangle-gray.png" />
              </view>
            </view>
            <view
              class="sale txt flex-ctr"
              :class="sale ? 'act' : ''"
              @click.stop="filter('sale')"
              >销量</view
            >
          </view>
        </view>
        <!-- 搜索结果商品 -->
        <view class="search-list" :style="{ height: calcHeight }">
          <view
            class="empt flex-col-ctr"
            :class="isShowTwoCategory ? 'pad-top' : ''"
            v-if="prodList.length == 0"
          >
            <image class="_img" src="/static/images/add-empty-icon.png" mode=""></image>
            <view class="txt">暂无商品</view>
          </view>
          <scroll-view
            lower-threshold="100"
            :scroll-top="scrollTop"
            scroll-y="true"
            @scrolltolower="bindscrolltolower"
            v-else
          >
            <view class="item">
              <block v-for="(item, index) in prodList" :key="index">
                <view class="skeleton-rect">
                  <product-unit
                    className="catetory"
                    :index="index"
                    :itemClone="item"
                    @customevent="customevent"
                  >
                  </product-unit>
                </view>
              </block>
            </view>
            <view class="end flex-ctr" v-if="total && total == prodList.length"
              >—— 暂无更多商品 ——</view
            >
          </scroll-view>
        </view>
      </view>
    </view>
    <!-- 加入购物车 -->
    <sku-modal
      v-if="selectSkuModalShow"
      :productId="item.id"
      source="catetory"
      @close="selectSkuModalShow = false"
    >
    </sku-modal>
    <!-- 授权手机号 -->
    <authority-phone-modal
      @closemodal="closePhoneModal"
      :isShowAuthPhone="isShowAuthPhone"
    ></authority-phone-modal>
  </view>
</template>

<script>
import { debounce } from "@/utils/util.js";
import { Resource } from "@/server/resource-api";
import productUnit from "@/components/product-unit/cell.vue";
import skuModal from "@/components/sku-modal/index.vue";
const app = getApp();
export default {
  components: { productUnit, skuModal },
  data() {
    return {
      queryCId: "", // 从首页 分类进来
      tabBarHeight: null,
      isFixed: true,
      statusBarHeight: app.globalData.statusBarHeight + "px",
      navBarHeight: app.globalData.navBarHeight + "px",
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
    };
  },
  onLoad(options) {
    console.log("options", options);
    this.queryCId = options.id || "";
  },
  async onShow() {
    await this.$onLaunched;
    this.twoCateIndex = 0;
    this.isEnd = false;
    this.pageNum = 1;
    this.getList();
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
  flag: true,
  methods: {
    // 类目选择
    select(item = {}, index = -1, type) {
      let _ = this;
      _.id = item.id;
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
      _.getProdList(item.id);
    },
    // 价格排序
    filter(type) {
      let _ = this,
        { rise, sale } = _;
      if (type == "rise") {
        switch (rise) {
          case 0:
            rise = 1;
            break;
          case 1:
            rise = 2;
            break;
          case 2:
            rise = 1;
            break;
        }

        Object.assign(_, {
          rise: rise,
          sale: false,
          scrollTop: -1,
        });
      } else if (type == "sale") {
        Object.assign(_, {
          sale: !sale,
          rise: 0,
          scrollTop: -1,
        });
      }
      Object.assign(this, {
        sEnd: false,
        pageNum: 1,
      });
      _.getProdList(_.id);
    },
    getList() {
      let { oneCateIndex = 0 } = this;
      Resource.classifyList.post({ type: "classifyList" }, {}).then((res) => {
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
              for (let key in res.data) {
                if (res.data[key].id == this.queryCId) {
                  select(res.data[key], i, "one");
                  this.id = this.queryCId;
                  item = res.data[key];
                }
              }
            }
            this.getProdList(item.id);
          }
        } else this.reset();
      });
    },
    getProdList(id = 0) {
      // 刚进分类tab，sortColumn: 0  sort: 1 （价格、销量都置灰）
      // 点击价格升序: sortColumn: 1  sort: 0 (销量置灰)
      // 点击价格降序:  sortColumn: 1  sort: 1 (销量置灰)
      // 点击销量: sortColumn: 2  sort: 1 (价格置灰)
      // sort:1, //排序方式 0:升序 1:降序
      // sortColumn:0, //排序字段 0:商品sort(此时参数sort不必填) 1:价格 2:销量(此时参数sort必须为1)

      // productClassifyId	分类ID 一级全部分类传0
      let _ = this,
        { rise, sale, isEnd, pageNum, prodList, flag } = _,
        sort = 1,
        sortColumn = 0;
      if (isEnd) return;
      _.isEnd = true;
      if (sale) {
        sortColumn = 2;
        sort = 1;
      } else {
        switch (rise) {
          case 0:
            sortColumn = 0;
            sort = 1;
            break;
          case 1:
            sortColumn = 1;
            sort = 0;
            break;
          case 2:
            sortColumn = 1;
            sort = 1;
            break;
          default:
            sortColumn = 0;
            sort = 1;
        }
      }
      uni.showLoading({ title: "加载中" });
      Resource.product
        .post(
          { type: "queryProductByClassify" },
          {
            productClassifyId: id,
            sort,
            sortColumn,
            pageNum,
            pageSize: 10,
          }
        )
        .then((res) => {
          let { code, data } = res;
          if (code == 1) {
            if (pageNum == 1) prodList = data.list || [];
            else prodList = prodList.concat(data.list);
            isEnd = data.pageNum * data.pageSize >= data.total;
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
                .select(".calc-height")
                .boundingClientRect((data) => {
                  _.calcHeight = `calc(100% - ${data.height}px)`;
                })
                .exec();
            });
          } else _.reset();
        })
        .finally(() => {
          uni.hideLoading();
        });
    },
    customevent: debounce(
      function (params) {
        if (app.hasmobile()) {
          Object.assign(this, {
            selectSkuModalShow: true,
            item: params.item,
          });
        } else this.isShowAuthPhone = true;
      },
      500,
      true
    ),
    checkHasMobile(cb) {
      if (app.globalData.hasmobile()) {
        cb();
      } else {
        this.isShowAuthPhone = true;
      }
    },
    closePhoneModal() {
      this.isShowAuthPhone = false;
    },
    reset() {
      Object.assign(this, {
        oneCateIndex: 0,
        twoCateIndex: 0,
        isExpand: false,
        rise: 0, // 0 无排序 1 升序 2 降序 升序降序
        sale: false, // 销售量排序
      });
    },
    // 商品滚动加载
    bindscrolltolower(e) {
      console.log("滚动到底部了", this.id);
      let { isEnd, pageNum } = this;
      if (isEnd) return;
      else {
        pageNum++;
        this.setData({ pageNum });
        this.getProdList(this.id);
      }
    },
  },
};
</script>

<style scoped>
@import "./index.css";
</style>
