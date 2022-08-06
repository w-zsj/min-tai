import serachInput from "@comps/serach-input/index.vue";
import productUnit from "@/components/product-unit/cell.vue";
import skuModal from "@/components/sku-modal/index.vue";
import { debounce } from '@/utils/util'
import { Resource } from "@/server/resource-api";
const app = getApp();
let _;
export default {
    components: { serachInput, productUnit, skuModal },
    data() {
        _ = this;
        return {
            prodList: [],
            productId: '',
            isShowAuthPhone: false,
            selectSkuModalShow: false,

            pageNum: 1,
            pageSize: 10,
            isEnd: false,
            keyword: ''
        }
    },
    onLoad(options) {
        _.keyword = options.keyword || '';
        _.searchBykeyWord(_.keyword);
    },
    onReachBottom: function () {
        const { isEnd, prodList } = this;
        if (!isEnd && prodList.length) {
            this.pageNum += 1;
            this.searchBykeyWord();
        }
    },
    methods: {
        customevent: debounce(
            function (params) {
                if (app.globalData.hasmobile()) {
                    Object.assign(_, {
                        selectSkuModalShow: true,
                        productId: params.item.id,
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
        canl() {
            _.keyword = '';
            _.searchBykeyWord();
        },
        // 搜索查询商品
        changeValue(val) {
            console.log("搜索关键字", val);
            if (val && typeof val !== 'string') val = val.detail.value;
            _.keyword = val;
            _.searchBykeyWord(val);
        },
        searchBykeyWord(keyword = "") {
            let { pageNum, prodList, isEnd } = _;
            Resource.open
                .post(
                    { type: "product/search" },
                    {
                        productClassifyId: "",
                        keyword,
                        pageNum,
                        pageSize: 10,
                    },
                    { loadingDelay: true }
                )
                .then((res) => {
                    let { code, data } = res;
                    if (code == 1) {
                        if (_.pageNum == 1) prodList = data.list || [];
                        else prodList = prodList.concat(data.list);
                        isEnd = data.pageNum * data.pageSize >= data.total;
                        Object.assign(_, {
                            prodList,
                            isEnd,
                            total: data.total,
                        });
                    }
                    // else _.reset();
                });
        },
    },
}