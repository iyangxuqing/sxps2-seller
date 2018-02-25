<template>
	<transition name="slide">
		<div class="page-item">
			<div class="page-head">
				<div class="page-head-left" @click="back">&lt;</div>
				<div class="page-head-center"><span v-if="item">{{item.title}}</span></div>
				<div class="page-head-right"></div>
			</div>
			<div class="item" v-if="item">
				<div class="item-specs-info">
					<div class="item-specs" v-for="(specs, index) in item.specs" :key="specs.name" v-if="currentIndex==index">
						<imageUploader v-model="specs.image"></imageUploader>
						<div class="item-specs-text">
							<div class="specs-name">{{specs.name}}</div>
							<div class="specs-desc">{{specs.desc || '商品附注'}}</div>
							<div class="specs-price"><span class="yuan">￥</span>{{specs.price || '0.00'}}</div>
						</div>
					</div>
				</div>
				<div class="item-specs-selector">
					<v-touch class="specs-label" :class="{'active': currentIndex==index}" v-for="(specs, index) in item.specs" :key="specs.name" @tap="tap" @press="press" :data-index="index">{{specs.name}}</v-touch>
					<v-touch class="specs-label specs-label-new" v-on:tap="tap">+</v-touch>
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
				currentIndex: 0
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
			tap(e) {
				console.log('tap', e)
				let index = e.target.dataset.index
				console.log(index)
				this.currentIndex = index
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
		.item-specs-info
			.item-specs
				.image-uploader
					width: 100vw
					height: 280px
					img
						width: 100%
						height: 100%
				.item-specs-text
					position: relative
					padding: 10px
					border-bottom: 1px solid #ddd
					.specs-name
						height: 26px
						font-size: 16px
					.specs-desc
						height: 12px
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
		.item-specs-selector
			display: flex
			flex-wrap: wrap
			font-size: 12px
			color: #345
			padding: 10px 10px 0
			border-bottom: 1px solid #ccc
			.specs-label
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