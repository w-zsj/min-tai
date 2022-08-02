import balance_icon from '@/static/images/balance_icon.png'
import artificial_icon from '@/static/images/artificial_icon.png'
export default {
    data() {
        return {
            curStatus:0,
            list: [
                {
                    icon: balance_icon,
                    title: '余额支付',
                    id:1
                },
                {
                    icon: artificial_icon,
                    title: '人工支付',
                    id:2
                }
            ]
        }
    },
    methods: {
        changeSelect(item) {
            this.curStatus = item.id
        },
        pay() {
            console.log('iii', this.curStatus);
            this.$to('payment-voucher/index')
        }
    }
}