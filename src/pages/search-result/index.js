import serachInput from "@comps/serach-input/index.vue";
import productUnit from "@/components/product-unit/cell.vue";
import skuModal from "@/components/sku-modal/index.vue";
import {debounce} from '@/utils/util'
const app = getApp();
let _;
export default {
    components: { serachInput, productUnit, skuModal },
    data() {
        _ = this;
        return {
            prodList: [],
            productId:'',
            isShowAuthPhone: false,
            selectSkuModalShow:false
        }
    },
    methods: {
        customevent: debounce(
            function (params) {
              if (app.hasmobile()) {
                Object.assign(_, {
                  selectSkuModalShow: true,
                  productId: params.item.id,
                });
              } else _.isShowAuthPhone = true;
            },
            500,
            true
          ),
          checkHasMobile(cb) {
            if (app.globalData.hasmobile()) {
              cb();
            } else {
              _.isShowAuthPhone = true;
            }
        },
        changeValue(val) {
            console.log('val',val)
        }
    },
}