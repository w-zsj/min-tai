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
            orderno: '',
            payImageUrl: "",// 支付截图 
        }
    },
    onLoad(option) {
        // source 1 支付 2 充值
        let { source, orderSn: orderno } = option;
        Object.assign(_, {
            source, orderno
        })
        uni.setNavigationBarTitle({
            title: source == 1 ? "支付凭证" : '充值凭证'
        })
    },
    methods: {
        uploadCall(data) {
            console.log('data--', data)
        },
        pay: debounce(function () {
            let { payImageUrl, orderno, source } = _;
            Resource.pay({}, { paySource: source, payImageUrl, orderno })
                .then(res => {
                    if (res.code == 1) {
                        ToastInfo('上传成功')
                        if (source == 1) _.$to(`order-list/index?type=1`)
                    }
                })
        }, 500, true)
    },
}