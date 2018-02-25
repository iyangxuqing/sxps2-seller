<template>
	<transition name="slide">
		<div class="page-item">
			<div class="page-head">
				<div class="page-head-left" @click="back">&lt;</div>
				<div class="page-head-center"><span v-if="item">{{item.title}}</span></div>
				<div class="page-head-right"></div>
			</div>
			<div class="item" v-if="item">
				<div class="item-info">
					<imageUploader v-model="item.images[0]"></imageUploader>
					<div class="specs">
						<div class="specs-name">{{item.specs[0].name}}</div>
						<div class="specs-desc">{{item.specs[0].desc}}</div>
						<div class="specs-price"><span class="yuan">￥</span>{{item.specs[0].price}}</div>
					</div>
					<div class="item-specs-container">
						<v-touch class="specs" :class="{'active': spec.active}" v-for="spec in item.specs" :key="spec.name" @press="press" @tap="tap">{{spec.name}}</v-touch>
						<v-touch class="specs specs-new" v-on:tap="tap">+</v-touch>
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

	Vue.use(VueTouch, {name: 'v-touch'})
	
	const specs = [
		{
			active: true,
			name: '大头大青菜',
			desc: '这是大头的大青菜，不是小头的。',
			price: '3.80'
		},
		{
			name: '小头大青菜'
		},
		{
			name: '长杆'
		},
		{
			name: '山东大庄'
		},
		{
			name: '本地小种'
		}
	]

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
				xyz: '123'
			}
		},
		created() {
			this.touch = {}
			if (!this.item) {
				this.$router.push('/goods')
				return
			}
			Vue.set(this.item, 'specs', specs)
			Vue.set(this.item, 'descs', "这是一段商品附注说明")
		},
		watch: {
			'$route'(to, from) {
				console.log(to, from)
			}
		},
		methods: {
			onTest(){
				console.log(this.item.images[0])
			},
			imageChange(e) {
				console.log(e)
				console.log(e.target)
				console.log(e.target.files)
			},
			tap(e) {
				console.log('tap', e)
			},
			press(e) {
				console.log('press', e)
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
	.slide-enter-active, .slide-leave-active
		transition: all 0.3s
	.slide-enter, .slide-leave-to
		transform: translate3d(100%, 0, 0)
	.item
		.item-title
			height: 44px
			line-height: 44px
			text-align: center
		.item-info
			.item-image
				width: 100vw
				height: 90vw
				img
					width: 100%
					height: 100%
			.specs
				position: relative
				padding: 10px
				border-bottom: 1px solid #ddd
				.specs-name
					font-size: 16px
					margin-bottom: 10px
				.specs-desc
					font-size: 12px
					color: #888
				.specs-price
					position: absolute
					top: 50%
					right: 10px
					transform: translateY(-50%)
					font-size: 20px
					color: #f63
					.yuan
						font-size: 16px
		.item-specs-container
			display: flex
			flex-wrap: wrap
			font-size: 12px
			color: #345
			padding: 10px 10px 0
			border-bottom: 1px solid #ccc
			.specs
				padding: 8px
				margin-right: 8px
				margin-bottom: 8px
				border-radius: 8px
				min-width: 28px
				text-align: center
				border: 1px solid #ccc
				&.active
					color: #f63
					border: 1px solid #f63
</style>