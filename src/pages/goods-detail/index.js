import mpHtml from '@/components/mp-html/mp-html';
import swiperComponent from './components/swiper-component.vue';
import footerComponent from './components/footer-component/index';
import skuModal from '@/components/sku-modal/index.vue';
import { Resource } from "@/server/resource-api";
import { ToastInfo, debounce } from '@/utils/util';
const app = getApp();
let _
export default {
    components: { mpHtml, swiperComponent, footerComponent, skuModal },
    data() {
        _ = this;
        return {
            tabMenu: [{   //菜单
                title: '商品',
                ele: '.goods-detail'
            },
            {
                title: '详情',
                ele: '.detail-text'
            }],
            currTabIndex: 0, //当前高亮菜单
            topList: [],//喵点高度
            isScroll: true,//是否滚动

            detail: {}, //商品详情数据
            expand: {}, //sku弹窗数据
            propertyList: [], //属性列表
            imageList: [], //轮播图图片
            showModal: false, //加入购物车提示弹窗
            isShowAuthPhone: false,
            selectSkuModalShow:false,
        };
    },
    onLoad(options) {
        let scene = options.scene && decodeURIComponent(options.scene),
            id = (scene && scene.split('&')[0]) || options.id
        this.id = id;
    },
    async onShow() {
        await this.$onLaunched;
        this.getDetail(this.id)
    },
    onReady: function () {
        this.getNodesInfo();
    },
    // 监听页面滚动
    onPageScroll: function (res) {
        if (this.isScroll) {
            const { scrollTop } = res;
            const { topList } = this;
            if (scrollTop < topList[1]) {
                this.currTabIndex = 0;
            } else if (scrollTop >= topList[1]) {
                this.currTabIndex = 1;
            }
        }
    },
    methods: {
        // 获取商品详情
        getDetail: function (id) {
            let that = this;
            Resource.open
                .post({ type: 'product/detail' }, { id: id })
                .then(res => {
                    if (res && res.code === 1) {
                        const data = res.data || {},
                            propertyList = data.manualproductAttributeDtoList || [],
                            imageList = data.picList || [],
                            skuStockList = data.skuStockList || [],
                            isDisplay = skuStockList[0] && skuStockList[0].isDisplay

                        Object.assign(that, {
                            detail: data,
                            propertyList: propertyList,
                            imageList: imageList,
                            isDisplay: isDisplay,
                            skuTeamPromotionList: skuStockList || [],
                            expand: {
                            },
                        });
                    } else {
                        ToastInfo(res.message || '请求失败');
                        if (+res.code === 100620 || +res.code === 100621) {
                            setTimeout(() => {
                                uni.switchTab({
                                    url: '/pages/home/index'
                                })
                            }, 1000)
                        }
                    }
                })
                .catch(e => {
                    Object.assign(that, {
                        detail: {},
                        propertyList: [],
                        imageList: []
                    });
                });
        },
        // sku弹窗
        selectSku: debounce(function (e) {
			let { type = 'buy' } = e.currentTarget.dataset,
			{ expand } = _;
			expand = Object.assign(expand, { type });
            _.checkHasMobile((loged) => {
                if (loged)
                    _.selectSkuModalShow = true;
                else _.isShowAuthPhone = true;
            });
        }, 500, true),
        // 关闭授权手机号弹窗
        closeModal: function (e) {
            if (e.detail == 'success') {
                this.getDetail(this.id);
            }
            this.isShowAuthPhone = false;
        },
        //关闭sku弹窗
        closeSkuModal(type) {
            this.selectSkuModalShow = false;
            type == 'addcar' &&
                setTimeout(() => {
                    this.getDetail(this.id);
                }, 300);
        },
        //瞄点定位
        goAnchor: function (ele, index) {
            const that = this;
            that.isScroll = false;
            that.currTabIndex = index;
            const query = uni.createSelectorQuery().in(this);
            query.select(ele).boundingClientRect();
            query.selectViewport().scrollOffset();
            query.exec((res) => {
                if (ele == '.goods-detail') {
                    uni.pageScrollTo({
                        scrollTop: 0,
                        duration: 300
                    });
                    setTimeout(() => {
                        that.isScroll = true;
                    }, 1000)
                    return;
                }
                if (res[0] && res[1]) {
                    uni.pageScrollTo({
                        scrollTop: ele == '.detail-text' ? res[0].top + res[1].scrollTop - 40 : res[0].top + res[1].scrollTop,
                        duration: 300
                    })
                    setTimeout(() => {
                        that.isScroll = true;
                    }, 1000)
                }
            })
        },
        // 获取节点详情
        getNodesInfo() {
            const query = uni.createSelectorQuery().in(this);
            setTimeout(() => {
                query.select('.goods-detail').boundingClientRect();
                query.select('.detail-text').boundingClientRect();
                query.exec((res) => {
                    let rel = [];
                    res.map((item, index) => {
                        rel.push(item.top)
                    })
                    this.topList = rel;
                })
            }, 500)
        },
    },
};