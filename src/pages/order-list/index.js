import unit from './comps/unit.vue'
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
            loadAll: false,
            list: [
                {
                    time: 60 * 30 * 1000
                }, {
                    time: 60 * 10 * 1000
                },
                {
                    time: 60 * 1 * 1000
                }]
        };
    },
    methods: {
        selectTab(item, idx) {
            console.log('item', item)
            if (this.curIdx == idx) return;
            this.curIdx = idx;
        }
    },
};