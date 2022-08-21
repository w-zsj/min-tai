import gUploadPic from '@/components/g-upload-pic'
import { Resource } from "@/server/resource-api";
import { ToastInfo, debounce } from "@/utils/util";
let _;
export default {
    components: { gUploadPic },
    data() {
        _ = this;
        return {
            source: 1,
            photoList: [],
            payPic: '',
            orderno: '',
            payImageUrl: "",// 支付截图 
        }
    },
    onLoad(option) {
        // source 1 支付 2 充值
        let { source, orderSn: orderno = '' } = option;
        Object.assign(_, {
            source, orderno
        })
        uni.setNavigationBarTitle({
            title: source == 1 ? "支付凭证" : '充值凭证'
        })
        _.getPayCodePic();
    },
    methods: {
        uploadCall(data) {
            console.log('data--', data)
            _.photoList = data;
            _.payImageUrl = data[0];
        },
        getPayCodePic() {
            Resource.pay.get({ type: 'payUrl?type=' + _.source })
                .then(res => {
                    if (res.code == 1) {
                        _.payPic = res.data || ''
                    }
                })
        },
        pay: debounce(function () {
            let { payImageUrl, orderno, source } = _;
            if (payImageUrl)
                Resource.pay.post({ type: "xcxpay" }, { paySource: source, payImageUrl, orderno })
                    .then(res => {
                        if (res.code == 1) {
                            ToastInfo(source == 1 ? '已提交支付凭证' : '已提交充值凭证')
                            if (source == 1) _.$to(`/packPages/order-detail/index?orderSn=${orderno}`, 'redirectTo')
                            else {
                                setTimeout(() => {
                                    _.$to('home/index', 'reLaunch')
                                }, 2000);
                            }
                        } else ToastInfo(res.message)
                    })
        }, 500, true)
    },
}