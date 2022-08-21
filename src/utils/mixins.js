import { Resource } from '@/server/resource-api';
export default {
    onShow() {
        this.getCarCount();
    },
    methods: {
        getCarCount() {
            if (!getApp()?.globalData?.hasmobile()) return
            const pages = getCurrentPages();
            const page = this.$mp?.page || pages[pages.length - 1];
            const arr = ['pages/home/index', 'pages/category/index', 'pages/mine/index']
            if (page && arr.includes(page.route))
                Resource.cart
                    .post({ type: 'list' }, {
                        "pageNum": 1,
                        "pageSize": 99999
                    })
                    .then(res => {
                        if (res.code == 1 && res?.data?.total) {
                            let num = res?.data?.total > 99 ? '99+' : (res?.data?.total + '');
                            // console.log('num', num)
                            uni.setTabBarBadge({
                                index: 2,
                                text: num
                            })
                        }
                    });
        },
        // 设置订阅消息 只能真机调试
        // TEMPLATE_ID 接口返回
        requestMessage(TEMPLATE_ID, call = () => { }) {
            let _ = this,
                acceptIds = [],
                rejectIds = [];
            uni.requestSubscribeMessage({
                tmplIds: TEMPLATE_ID,
                success(res) {
                    console.log("成功唤起订阅消息弹框----", res);
                    // if (res.errMsg === "requestSubscribeMessage:ok") {
                    //   acceptIds = TEMPLATE_ID.filter(i => res[i] === "accept") || []  // 暂时可不用
                    //   rejectIds = TEMPLATE_ID.filter(i => res[i] === "reject") || []
                    // }
                    call();
                    // 拒绝授权的id 数据埋点
                    // if (rejectIds.length)
                    //   _.logReport({ e: 'TEMPLATE_ID', p: { rejectids: rejectIds } }, 1)
                },
                fail(err) {
                    console.error("唤起订阅消息弹框失败----", err);
                    call("error:" + err);
                },
            });

        },
    },
}