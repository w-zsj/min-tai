import unit from './comps/unit.vue'
import { Resource } from "@/server/resource-api";
import { ToastInfo, debounce } from "@/utils/util";
let _;
export default {
    components: { unit },
    data() {
        _ = this;
        return {
            statusOptions: [
                {
                    label: "全部",
                    value: 0,
                },
                {
                    label: "待付款",
                    value: 1,
                },
                {
                    label: "待收货",
                    value: 2,
                },
                {
                    label: "已完成",
                    value: 3,
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
        _.curIdx = option.type || 0;
        _.getList(_.curIdx);
    },
    onShow() {

    },
    /**
  * 页面相关事件处理函数--监听用户下拉动作
  */
    onPullDownRefresh: function () {
        _.isend = false;
        _.pageNum = 1;
        _.getList(_.curIdx)
    },
    onReachBottom: function () {
        const { isend, list } = _;
        if (!isend && list.length) {
            _.pageNum += 1;
            _.getList();
        }
    },
    methods: {
        selectTab(item, idx) {
            if (_.curIdx == idx) return;
            // console.log('item', item)
            Object.assign(_, {
                pageNum: 1,
                pageSize: 10,
                isend: false,
                curIdx: item.value,
                list: []
            })
            _.getList(_.curIdx)
        },
        // 获取订单列表
        getList(status = 0) {
            let { pageNum, list, isend, pageSize } = _,
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
                            _.list = _.formatList(list);
                            _.isend = isend;
                            console.log("list", list);
                        }
                    }
                    uni.stopPullDownRefresh();
                });
        },
        // 列表数据格式化
        formatList: function (list) {
            const newList = list.map(item => {
                const {
                    priceInt,
                    pricePoint
                } = _.formatPrice(item.payAmount || item.returnAmount);
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
        handleContact(e) {
            console.log(e.detail.path)
            console.log(e.detail.query)
        }
    }

};