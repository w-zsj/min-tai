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
            curStatus: 0,
            list: [{
                icon: balance_icon,
                title: '余额支付',
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
            this.curStatus = item.id
        },
        pay() {
            console.log('iii', this.curStatus);
            this.$to('payment-voucher/index?source=1')
        }
    }
}