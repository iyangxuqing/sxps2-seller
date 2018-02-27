<template>
	<transition name="slide">
		<div class="page-item">
			<div class="page-head">
				<div class="page-head-left" @tap="back"><i class="icon-back"></i></div>
				<div class="page-head-center"><span v-if="item">{{item.specs[0].name}}</span></div>
				<div class="page-head-right"></div>
			</div>
			<div class="item" v-if="item">
				<div class="item-specs-info">
					<div class="item-specs" v-for="(specs, index) in item.specs" :key="specs.id" v-if="currentIndex==index">
						<div class="item-specs-image">
							<imageUploader v-model="specs.image"></imageUploader>
						</div>
						<div class="item-specs-text">
							<input class="specs-name" :value="specs.name" placeholder="输入名称" @blur="specsNameInput" @keyup.enter="inputEnter">
							<input class="specs-desc" :value="specs.desc" placeholder="输入附注说明" @blur="specsDescInput" @keyup.enter="inputEnter">
							<div class="specs-price">
								<input :value="specs.price" placeHolder="0.00" @blur="specsPriceInput" @keyup.enter="inputEnter">	
								<div class="yuan">元</div>
							</div>
						</div>
					</div>
				</div>
				<div class="item-specs-selector">
					<v-touch class="specs-label" :class="{'active': currentIndex==index}" v-for="(specs, index) in item.specs" :key="specs.id" @tap="specsSelect(index)" @press="specsPress(index)">{{specs.name}}</v-touch>
					<v-touch class="specs-label specs-label-new" v-on:tap="specsAdd">+</v-touch>
				</div>
			</div>
			<div class="page-foot">
				<div class="buttons">
					<div class="button cancel" @tap="cancel">取 消</div>
					<div class="button confirm" @tap="confirm">保 存</div>
				</div>
			</div>
			<div class="page-popup" :class="{'show': popup.show}">
				<div class="page-popup-mask" v-if="popup.show" @tap="popupCancel"></div>
				<div class="page-popup-content">
					<div class="button-list">
						<div class="button-item" @tap="specsSort(-1)">往前移</div>
						<div class="button-item" @tap="specsSort(1)">往后移</div>
						<div class="button-item" @tap="specsDelete">删除</div>
						<div class="button-item button-item-separator"></div>
						<div class="button-item button-item-cancel" @tap="popupCancel">取消</div>
					</div>
				</div>
			</div>
		</div>
	</transition>
</template>

<script type="text/ecmascript-6">
	import Vue from 'vue'
	import VueTouch from 'vue-touch'
	import axios from 'axios'
	import imageUploader from '@/base/imageUploader/imageUploader'
	import { setItem } from '@/api/items'

	Vue.use(VueTouch, {name: 'v-touch'})
	
	export default {
		props: {
			id: {
				type: String,
				default: ''
			},
			item: {
				type: Object,
				default: function (){
        	return null
  			}
			}
		},
		data() {
			return {
				currentIndex: 0,
				popup: {
					show: false
				}
			}
		},
		created() {
			console.log('item created', this.item)
			if (!this.item) {
				this.$router.push('/goods')
				return
			}
			if(!this.item.specs){
				let specs = [{
					id: 1,
					name: this.item.title,
					desc: this.item.descs,
					price: this.item.price,
					image: this.item.images && this.item.images[0]
				}]
				Vue.set(this.item, 'specs', specs)
			}
		},
		methods: {
			inputEnter(e) {
				e.target.blur()
			},
			specsNameInput(e) {
				let value = e.target.value
				let index = this.currentIndex
				this.item.specs[index].name = value
			},
			specsDescInput(e) {
				let value = e.target.value
				let index = this.currentIndex
				this.item.specs[index].desc = value
			},
			specsPriceInput(e) {
				let value = e.target.value
				let index = this.currentIndex
				this.item.specs[index].price = value
			},
			specsSelect(index) {
				setTimeout(() => {
					this.currentIndex = index
				}, 20)
			},
			specsAdd() {
				let length = this.item.specs.length
				let lastSpecs = this.item.specs[length-1]
				if(lastSpecs.name == '未命名') return

				let maxId = 0
				for(let i in this.item.specs){
					if(maxId < this.item.specs[i].id){
						maxId = this.item.specs[i].id
					}
				}
				let newId = maxId + 1
				this.item.specs.push({
					id: newId,
					image: '',
					name: '未命名',
					desc: '',
					price: ''
				})
				this.currentIndex = length
			},
			specsPress(index) {
				this.popup.specsIndex = index
				if(index > 0) {
					this.popup.show = true
				}
			},
			specsSort(num) {
				let index = this.popup.specsIndex
				let specses = this.item.specs
				if(num > 0 && index < specses.length){
					let temp = specses[index]
					specses[index] = specses[index+1]
					specses[index+1] = temp
				}
				if(num < 0 && index > 1){
					let temp = specses[index]
					specses[index] = specses[index-1]
					specses[index-1] = temp
				}
				this.popup.show = false
			},
			specsDelete() {
				let index = this.popup.specsIndex
				this.item.specs.splice(index, 1)
				this.currentIndex = 0
				this.popup.show = false
			},
			confirm() {
				let item = this.item
				let length = item.specs.length
				if(item.specs[length-1].name=='未命名'){
					item.specs.pop()
					if(this.currentIndex == length-1){
						this.currentIndex = 0
					}
				}
				// setItem(this.item, 'update')
				this.$emit('itemUpdate', item)
			},
			cancel() {
				this.$router.back()
			},
			back() {
				this.$router.back()
			},
			popupCancel() {
				this.popup.show = false
			}
		},
		components: {
			imageUploader
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

	.info-image
		height: 260px
	.info-text
		position: relative
		padding: 10px 10px 0
		border-bottom: 1px solid #ddd
		.info-name
			font-size: 16px
		.info-desc
			font-size: 12px
			color: #888
			padding: 10px 0
		.info-price
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

	.item
		.item-specs-info
			.item-specs
				.item-specs-image
					width: 100%
					height: 280px
				.item-specs-text
					position: relative
					padding: 10px 10px 0
					border-bottom: 1px solid #ddd
					.specs-name
						font-size: 16px
					.specs-desc
						font-size: 12px
						color: #888
						padding: 10px 0
					.specs-price
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
				&.active
					color: #f63
					border: 1px solid #f63
				&:first-child
					background: #eee
</style>