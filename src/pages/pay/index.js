import balance_icon from '@/static/images/balance_icon.png'
import artificial_icon from '@/static/images/artificial_icon.png'
let _;
export default {
    data() {
        _ = this;
        return {
            orderSn,
            payAmount,
            coin,
            paySource: 2,
            // paySource	支付来源 1:订单支付 2：金币支付
            list: [{
                icon: balance_icon,
                title: '金币支付',
                id: 1
            },
            {
                icon: artificial_icon,
                title: '人工支付',
                id: 2
            }
            ]
        }
    },
    onLoad(options) {
        let {
            orderSn,
            payAmount,
            coin
        } = options;
        Object.assign(_, {
            orderSn,
            payAmount,
            coin
        })
    },
    methods: {
        changeSelect(item) {
            _.paySource = item.id
        },
        pay() {
            console.log('iii', this.paySource);
            this.$to(`payment-voucher/index?source=1&paySource=${paySource}&orderno=${orderSn}}`)
        }
    }
}