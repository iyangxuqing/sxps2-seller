<template>
	<transition name="slide">
		<div class="page">
			<div class="page-head">
				<div class="page-head-left" @tap="back"><img src="@/common/image/enter.png"/></div>
				<div class="page-head-center"><span v-if="item">{{item.specs[0].title || '新建商品'}}</span></div>
				<div class="page-head-right"></div>
			</div>
			<div class="item" v-if="item">
				<div class="item-edit">
					<div class="item-edit-image">
						<imageUploader v-model="editor.image" @change="imageInput"></imageUploader>
					</div>
					<div class="item-edit-text">
						<input class="title" :value="editor.title" placeholder="输入名称" maxlength="6" @blur="titleInput" @keyup.enter="inputEnter">
						<input class="descs" :value="editor.descs" placeholder="输入附注说明" maxlength="14" @blur="descsInput" @keyup.enter="inputEnter">
						<div class="price">
							<input :value="editor.price" placeHolder="0.00" maxlength="6" v-money @blur="priceInput" @keyup.enter="inputEnter"><div class="yuan">元</div>
						</div>
					</div>
				</div>
				<div class="item-specs-header">商品规格</div>
				<div class="item-specs-selector">
					<div class="specs-label" :class="{'active': currentSpecsIndex==index, 'offShelf': specs.onShelf=='0'}" v-for="(specs, index) in item.specs" :key="specs.id" @tap="specsTap(index)" @longtap="specsLongTap(index)">{{specs.title || '未命名'}}</div>
					<div class="specs-label specs-label-new" @tap="specsAdd">+</div>
				</div>
			</div>
		</div>
	</transition>
</template>

<script type="text/ecmascript-6">
	import Vue from 'vue'
	import Bus from '@/common/js/bus'
	import BScroll from '@/base/better-scroll/src/index'
	import imageUploader from '@/base/imageUploader/imageUploader'
	import { setItem } from '@/api/items'

	export default {
		props: {
			id: {
				type: String,
				default: ''
			},
			item: {
				type: Object,
				default: () => {}
			}
		},
		data() {
			return {
				currentSpecsIndex: 0,
				editor: {}
			}
		},
		created() {
			setTimeout(() => {
				this.scroll = new BScroll('.page', {
					tap: true,
					click: true,
					longtap: true
				})
			}, 20)
		},
		activated() {
			if (!this.item) {
				this.$router.push('/goods')
				return
			}
			this.currentSpecsIndex = 0
			this.editor = {
				title: this.item.specs[0].title,
				descs: this.item.specs[0].descs,
				price: this.item.specs[0].price,
				image: this.item.specs[0].image
			}			
		},
		watch: {
			currentSpecsIndex() {
				let i = this.currentSpecsIndex
				this.editor = {
					title: this.item.specs[i].title,
					descs: this.item.specs[i].descs,
					price: this.item.specs[i].price,
					image: this.item.specs[i].image
				}
			}
		},
		methods: {
			keydown(e) {
				let value = e.target.value
				value = value.replace(/[^\d^\.]+/g,'')
				this.editor.price = value
			},
			inputEnter(e) {
				e.target.blur()
			},
			titleInput(e) {
				let value = e.target.value
				/* title字段不允许输入为空 */
				if (!value) {
					e.target.focus()
					return
				}
				this.editor.title = value
				let index = this.currentSpecsIndex
				this.item.specs[index].title = value
			},
			descsInput(e) {
				let value = e.target.value
				let index = this.currentSpecsIndex
				this.editor.descs = value
				this.item.specs[index].descs = value
			},
			priceInput(e) {
				let value = e.target.value
				value = Number(value).toFixed(2)
				let index = this.currentSpecsIndex
				this.editor.price = value
				this.item.specs[index].price = value
			},
			imageInput(image) {
				let index = this.currentSpecsIndex
				this.item.specs[index].image = image
			},
			specsTap(index) {
				setTimeout(() => {
					this.currentSpecsIndex = index
				}, 20)
			},
			specsAdd() {
				let specs = this.item.specs
				/* 当前还有一个空字段时，不允许再新增字段 */
				if(specs[specs.length-1].title=='') return
				specs.push({
					id: '' + Date.now(),
					image: '',
					title: '',
					descs: '',
					price: '',
					onShelf: '1'
				})
				this.currentSpecsIndex = specs.length - 1
			},
			specsLongTap(index) {
				let specs = this.item.specs
				Bus.$emit('actionsheet', {
					data: specs,
					dataIndex: index,
					items: [{
						title: '往前移',
						disable: index==0 || index==1
					},{
						title: '往后移',
						disable: index==0
					},{
						title: '上下架',
						disable: index==0,
						action: () => {
							let onShelf = specs[index].onShelf == '1' ? '0' : '1'
							specs[index].onShelf = onShelf
						}
					},{
						title: '删除',
						disable: index==0,
						action: () => {
							if(this.currentSpecsIndex == index) {
								this.currentSpecsIndex = 0
							}
						}
					}]
				})
			},
			back() {
				this.$router.back()
			}
		},
		components: {
			imageUploader
		}
	}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

	.slide-enter-active, .slide-leave-active
		transition: all 0.3s
	.slide-enter, .slide-leave-to
		transform: translate3d(100%, 0, 0)

	.page
		position: absolute
		top: 0
		left: 0
		right: 0
		bottom: 0
		z-index: 100
		background: #fff
		.page-head
			display: flex
			align-items: center
			height: 45px
			font-size: 14px
			box-sizing: border-box
			border-bottom: 1px solid #eee
			.page-head-left
				flex-shrink: 0
				display: flex
				align-items: center
				justify-content: center
				width: 44px
				height: 100%
				cursor: pointer
				padding: 12px
				img
					width: 100%
					height: 100%
					transform: rotate(180deg)
			.page-head-center
				flex-grow: 1
				text-align: center
				letter-spacing: 1px
			.page-head-right
				display: flex
				align-items: center
				justify-content: center
				width: 44px
				height: 100%

	.item
		.item-edit
			.item-edit-image
				width: 100%
				height: 280px
				border-bottom: 1px solid #eee
			.item-edit-text
				position: relative
				padding: 12px 10px 0
				border-bottom: 1px solid #eee
				.title
					font-size: 16px
				.descs
					font-size: 13px
					color: #888
					padding: 12px 0
				.price
					position: absolute
					top: 35%
					right: 10px
					transform: translateY(-50%)
					display: flex
					align-items: center
					width: 100px
					font-size: 16px
					input
						color: #f63
						font-size: 20px
						font-weight: 200
						text-align: right
						margin-right: 5px
		.item-specs-header
			display: flex
			align-items: center
			height: 45px
			padding: 10px
			background: #eee
		.item-specs-selector
			display: flex
			flex-wrap: wrap
			font-size: 12px
			color: #345
			padding: 10px
			.specs-label
				position: relative
				min-width: 54px
				height: 30px
				display: flex
				align-items: center
				justify-content: center
				padding-left: 8px
				padding-right: 8px
				margin-right: 8px
				margin-bottom: 10px
				box-sizing: border-box
				border-radius: 8px
				border: 1px solid #ddd
				cursor: pointer
				&:first-child
					background: #eee
				&.active
					color: #f63
					border: 1px solid #f63
				&.offShelf::after
					content: ''
					position: absolute
					top: 13px
					left: 15%
					width: 70%
					height: 1px
					background: red

</style>