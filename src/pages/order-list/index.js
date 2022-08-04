import unit from './comps/unit.vue'
import { Resource } from "@/server/resource-api";
import { ToastInfo, debounce } from "@/utils/util";
export default {
    components: { unit },
    data() {
        return {
            statusOptions: [
                {
                    label: "全部",
                    value: null,
                },
                {
                    label: "待付款",
                    value: 0,
                },
                {
                    label: "待审核",
                    value: 1,
                },
                {
                    label: "已完成",
                    value: 5,
                },
            ],
            curIdx: 0,

            pageNum: 1,
            pageSize: 10,
            isend: false,

            list: []
        };
    },
    onLoad(option) {
        this.curIdx = option.type || 0;
    },
    onReachBottom: function () {
        const { isend, list } = this;
        if (!isend && list.length) {
            this.pageNum += 1;
            this.getList();
        }
    },
    methods: {
        selectTab(item, idx) {
            console.log('item', item)
            if (this.curIdx == idx) return;
            this.curIdx = idx;
        },
        // 获取订单列表
        getList(status = null) {
            let _ = this,
                { pageNum, list, isend, pageSize } = _,
                params = {
                    pageNum: pageNum || 1,
                    pageSize,
                    status
                };
            Resource.order
                .post({ type: "list" }, params, { loadingDelay: true })
                .then((res) => {
                    if (res.code == 1) {
                        if (res?.data?.list?.length) {
                            isend = !!(pageNum >= res?.data?.totalPage);
                            let data = res.data?.list || [];
                            if (pageNum == 1) list = data;
                            else list = [...list, ...data];
                            list = _.formatList(list);
                            Object.assign(_, { list, isend });
                            console.log("list", list);
                        }
                    }
                });
        }
    },
    // 列表数据格式化
    formatList: function (list) {
        const newList = list.map(item => {
            const {
                priceInt,
                pricePoint
            } = this.formatPrice(item.payAmount || item.returnAmount);
            item.priceInt = priceInt;
            item.pricePoint = pricePoint;
            return item;
        });
        return newList;
    },

    // 价格格式化
    formatPrice: function (itemPrice) {
        let priceInt = '';
        let pricePoint = '';
        itemPrice = itemPrice || '';

        if (itemPrice) {
            let price = itemPrice + '';

            if (price.indexOf('.') !== -1) {
                priceInt = price.split('.')[0];
                pricePoint = '.' + price.split('.')[1] || '';
            } else {
                priceInt = itemPrice;
                pricePoint = '';
            }
        } else {
            priceInt = 0;
            pricePoint = '';
        }

        return {
            priceInt,
            pricePoint
        };
    },

};