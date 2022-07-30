/*
 * @Author: TerryMin
 * @Date: 2022-02-14 15:04:19
 * @LastEditors: TerryMin
 * @LastEditTime: 2022-02-15 14:47:04
 * @Description: file not
 */
export default {
	name: "product-unit",
	props: {
		itemClone: {
			//item.type  0:正常价格 1:vip价格 2:至尊vip 3:秒杀价
			type: Object
		},
		index: {
			type: Number
		},
		className: {
			type: String,
			default: ''
		},
	},
	data() {
		return {
			sheng: '',
			item: {}
		};
	},
	methods: {
		changeEvent: function (e) {
			e.preventDefault();
			e.stopPropagation();
			this.$emit('customevent', {
				item: this.itemClone
			});
		},
		// 跳转到精品酒详情
		toDetail: function (e) {
			const { id, name } = this.itemClone;
			try {
				this.report('home_product', {
					product_id: id,
					paroduct_name: name
				});
			} catch (e) { }
			this.$to(`mall/goods-detail/goods-detail?id=${id}`);
		},
	},
	watch: {
		itemClone: {
			handler: function (newVal, oldVal) {
				this.item = newVal;
			},
			immediate: true,
			deep: true
		}
	}
}
