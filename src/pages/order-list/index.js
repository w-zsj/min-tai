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
        // 取消 删除订单
        handleBtnOrder: debounce(
            function ({ orderSn, id }, type) {
                console.log('orderSn', orderSn, id, type)
                let params = {};
                if (type == 'pay') {
                    _.$to(`payment-voucher/index?orderSn=${orderSn}&source=1`)
                    return
                }
                if (type == 'again') {
                    _.$to('home/index', 'reLaunch')
                    return
                }
                params.orderSn = orderSn;
                Resource.order
                    .post({ type: type }, params, { loadingDelay: true })
                    .then(({ code }) => {
                        if (code == 1) {
                            ToastInfo(type == 'deleteOrder' ? '已删除' : type == 'confirmReceiveOrder' ? '已确认收货' : '已取消');
                            _.list = _.list.filter((i) => i.orderSn != orderSn);
                        }
                    })
            }, 500, true),
        handleContact(e) {
            console.log(e.detail.path)
            console.log(e.detail.query)
        }
    }

};