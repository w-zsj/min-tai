import gUploadPic from '@/components/g-upload-pic'
export default {
    components:{gUploadPic},
    data() {
        return {
            source: 1,
            photoList:[]
        }
    },
    onLoad(option) { 
        // source 1 支付 2 充值
        this.source = option.source||1
    },
    methods: {
        uploadCall(data) {
            console.log('data--',data)
        }
    },
}