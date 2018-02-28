<template>
	<transition name="slide">
		<div class="page-item">
			<div class="page-head">
				<div class="page-head-left" @tap="back"><i class="icon-back"></i></div>
				<div class="page-head-center"><span v-if="item">{{item.title}}</span></div>
				<div class="page-head-right"></div>
			</div>
			<div class="item" v-if="item">
				<div class="item-edit">
					<div class="item-edit-image">
						<imageUploader v-model="editImage" @change="imageInput"></imageUploader>
					</div>
					<div class="item-edit-text">
						<input class="title" :value="editTitle" placeholder="输入名称" @blur="titleInput" @keyup.enter="inputEnter">
						<input class="descs" :value="editDescs" placeholder="输入附注说明" @blur="descsInput" @keyup.enter="inputEnter">
						<div class="price">
							<input :value="editPrice" placeHolder="0.00" @blur="priceInput" @keyup.enter="inputEnter">	
							<div class="yuan">元</div>
						</div>
					</div>
				</div>
				<div class="item-specs-selector">
					<div class="specs-label" :class="{'active': currentIndex==index}" v-for="(specs, index) in item.specs" :key="specs.id" @tap="specsTap(index)" @touchstart="specsPressDown(index)" @endstart="specsPressUp" @mousedown="specsPressDown(index)" @mouseup="specsPressUp">{{specs.title || '未命名'}}</div>
					<div class="specs-label specs-label-new" @tap="specsAdd">+</div>
				</div>
			</div>
			<div class="page-foot">
				<div class="buttons">
					<div class="button cancel" @tap="cancel">取 消</div>
					<div class="button confirm" @tap="confirm">保 存</div>
				</div>
			</div>
			<actionsheet v-model="actionsheetShow" :items="['往前移', '往后移', '删除']" @action="specsAction"></actionsheet>
		</div>
	</transition>
</template>

<script type="text/ecmascript-6">
	import Vue from 'vue'
	import axios from 'axios'
	import imageUploader from '@/base/imageUploader/imageUploader'
	import actionsheet from '@/components/actionsheet/actionsheet'
	import { setItem } from '@/api/items'

	export default {
		props: {
			id: {
				type: String,
				default: ''
			},
			item: {
				type: Object,
				default: null
			}
		},
		data() {
			return {
				currentIndex: 0,
				editTitle: '',
				editDescs: '',
				editPrice: '',
				editImage: '',
				actionsheetShow: false
			}
		},
		created() {
			if (!this.item) {
				this.$router.push('/goods')
				return
			}
			this.currentIndex = -1
			this.editTitle = this.item.title
			this.editDescs = this.item.descs
			this.editPrice = this.item.price
			this.editImage = this.item.image
			if(!this.item.specs){
				Vue.set(this.item, 'specs', [])
			}
		},
		watch: {
			currentIndex() {
				let i = this.currentIndex
				if(i < 0) {
					this.editTitle = this.item.title
					this.editDescs = this.item.descs
					this.editPrice = this.item.price
					this.editImage = this.item.image
				} else {
					this.editTitle = this.item.specs[i].title
					this.editDescs = this.item.specs[i].descs
					this.editPrice = this.item.specs[i].price
					this.editImage = this.item.specs[i].image
				}
			}
		},
		methods: {
			inputEnter(e) {
				e.target.blur()
			},
			titleInput(e) {
				let value = e.target.value
				let index = this.currentIndex
				this.editTitle = value
				if(index < 0) {
					this.item.title = value
				} else {
					this.item.specs[index].title = value
				}
			},
			descsInput(e) {
				let value = e.target.value
				let index = this.currentIndex
				this.editDescs = value
				if(index < 0) {
					this.item.descs = value
				} else {
					this.item.specs[index].descs = value
				}
			},
			priceInput(e) {
				let value = e.target.value
				let index = this.currentIndex
				this.editPrice = value
				if(index < 0) {
					this.item.price = value
				} else {
					this.item.specs[index].price = value
				}
			},
			imageInput(image) {
				let index = this.currentIndex
				if(index < 0) {
					this.item.image = image
				} else {
					this.item.specs[index].image = image
				}
			},
			specsTap(index) {
				setTimeout(() => {
					if(this.currentIndex == index) {
						this.currentIndex = -1
					} else {
						this.currentIndex = index
					}
				}, 20)
			},
			specsAdd() {
				let specs = this.item.specs
				if(specs.length && specs[specs.length-1].title=='') return

				this.item.specs.push({
					id: Date.now(),
					image: '',
					title: '',
					descs: '',
					price: ''
				})
				this.currentIndex = specs.length - 1
			},
			specsPressDown(index) {
				this.specsPressTimer = setTimeout(() => {
					this.specsLongTap && this.specsLongTap(index)
				}, 500)
			},
			specsPressUp() {
				clearTimeout(this.specsPressTimer)
			},
			specsLongTap(index) {
				this.specsSelectedIndex = index
				this.actionsheetShow = !this.actionsheetShow
			},
			specsAction(item, index) {
				let i = this.specsSelectedIndex
				let specs = this.item.specs
				if(index == 0) { // 往前移
					if(i > 0) {
						let temp = specs[i]
						specs[i] = specs[i - 1]
						specs[i - 1] = temp
					}
				} else if(index == 1) { // 往后移
					if(i < specs.length - 1) {
						let temp = specs[i]
						specs[i] = specs[i + 1]
						specs[i + 1] = temp
					}
				} else if(index == 2) { // 删除
					specs.splice(i, 1)
					this.currentIndex = -1
				}
			},
			confirm() {
				let item = this.item
				let length = item.specs.length
				if(item.specs[length-1].title=='未命名'){
					item.specs.pop()
					if(this.currentIndex == length-1){
						this.currentIndex = 0
					}
				}
				// setItem(this.item, 'update')
			},
			cancel() {
				this.$router.back()
			},
			back() {
				this.$router.back()
			}
		},
		components: {
			imageUploader,
			actionsheet
		}
	}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
	.page-item
		position: fixed
		z-index: 100
		top: 0
		left: 0
		right: 0
		bottom: 0
		background: #fff
		.page-head
			display: flex
			align-items: center
			height: 44px
			font-size: 14px
			border-bottom: 1px solid #ddd
			.page-head-left
				display: flex
				align-items: center
				justify-content: center
				width: 40px
				height: 100%
				cursor: pointer
				.icon-back
					padding: 10px
					font-size: 14px
					color: #666
			.page-head-center
				flex-grow: 1
				text-align: center
				letter-spacing: 1px
			.page-head-right
				display: flex
				align-items: center
				justify-content: center
				width: 40px
				height: 100%
		.page-foot
			position: fixed
			left: 0
			bottom: 0
			z-index: 20
			width: 100%
			height: 50px
			background: #f2f2f2
			border-top: 1px solid #eee
			.buttons
				display: flex
				align-items: center
				height: 50px
				.button
					flex-basis: 0
					flex-grow: 1
					display: flex
					align-items: center
					justify-content: center
					height: 28px
					color: #345
					background: #fff
					margin: 0 30px
					border-radius: 5px
					border: 1px solid #ccc
					&.confirm
						color: #fff
						background: #f83
		.page-popup
			position: fixed
			left: 0
			right: 0
			bottom: 0
			z-index: 9999
			height: 0
			transition: all 300ms ease
			&.show
				height: 210px
			.page-popup-mask
				position: fixed
				top: 0
				left: 0
				right: 0
				bottom: 0
				z-index: 1
				background: rgba(0, 0, 0, 0.6)
			.page-popup-content
				position: absolute
				z-index: 2
				width: 100%
				height: 100%
				background-color: #fff
				.button-list
					width: 100%
					.button-item
						display: flex
						align-items: center
						justify-content: center
						width: 100%
						height: 50px
						color: #345
						letter-spacing: 2px
						border-bottom: 1px solid #eee
					.button-item-separator
						height: 10px
						background: #eee
					.button-item-cancel
						color: #f63

	.slide-enter-active, .slide-leave-active
		transition: all 0.3s
	.slide-enter, .slide-leave-to
		transform: translate3d(100%, 0, 0)

	input
		width: 100%
		outline: none
		box-sizing: border-box
	.item-title
		text-align: center
		padding: 10px

	.item
		.item-edit
			.item-edit-image
				width: 100%
				height: 280px
			.item-edit-text
				position: relative
				padding: 12px 10px 0
				border-bottom: 1px solid #ddd
				.title
					font-size: 16px
				.descs
					font-size: 12px
					color: #888
					padding: 12px 0
				.price
					position: absolute
					top: 50%
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
		.item-specs-selector
			display: flex
			flex-wrap: wrap
			font-size: 12px
			color: #345
			min-height: 91px
			padding: 10px 10px 0
			border-bottom: 1px solid #ddd
			.specs-label
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
				&.active
					color: #f63
					border: 1px solid #f63
</style>