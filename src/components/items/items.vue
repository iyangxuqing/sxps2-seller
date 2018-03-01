<template>
	<div class="items" ref="items">
		<div class="items-wrapper">
			<div class="item" v-for="item in categoryItems" @tap="itemTap(item)" @touchstart="itemPressDown(item)" @touchend="itemPressUp" @mousedown="itemPressDown(item)" @mouseup="itemPressUp">
				<div class="item-image"><img :src="item.image"></div>
				<div class="item-title">{{item.title}}</div>
			</div>
			<div class="item item-new" @tap="itemTap({id:''})" v-if="ready">
				<div class="item-image">
					<img src="@/common/image/plus.png">
				</div>
			</div>
		</div>
		<router-view></router-view>
	</div>
 </template>

<script type="text/ecmascript-6">
	import BScroll from 'better-scroll'
	import { getItems } from '@/api/items'

	export default {
		props: {
			cid: {
				type: String,
				default: ''
			}
		},
	 	data() {
	 		return {
	 			items: () => [],
	 			ready: false
	 		}
 		},
		created() {
			getItems().then((items) => {
				this.items = items
				this._initScroll()
				setTimeout(() => {
					this.ready = true
				}, 200)
			})
		},
		watch: {
			'$route'(to, from) {
				if(to.path == '/goods') {
					for(let i in this.items) {
						if(this.items[i].title=='新建商品'){
							this.items.splice(i, 1)
						}
					}
				}
			}
		},
		methods: {
			_initScroll() {
				setTimeout(()=>{
					if(!this.scroll) {
						this.scroll = new BScroll(this.$refs.items, {
							tap: true,
							click: true
						})
					} else {
						this.scroll.refresh()
					}
				}, 20)
			},
			itemPressDown(item) {
				this.itemPressTimer = setTimeout(() => {
					this.itemLongPress = true
					this.itemLongTap && this.itemLongTap(item)
				}, 500)
			},
			itemPressUp() {
				clearTimeout(this.itemPressTimer)
			},
			itemLongTap(item) {
				console.log('itemLongTap', item)
			},
			itemTap(item) {
				if(this.itemLongPress) {
					this.itemLongPress = false
					return
				}
				if(item.id==='') {
					item = {
						id: 'i' + Date.now(),
						cid: this.cid,
						specs: [{
							id: 1,
							name: '新建商品',
							desc: '',
							price: '',
							image: ''
						}]
					}
					this.items.push(item)
				}
				this.$router.push({
					name: 'item',
					params: {
						id: item.id,
						item: item
					}
				})
			}
		},
		computed: {
			categoryItems() {
				let _items = []
				for(let i in this.items) {
					if(this.items[i].cid == this.cid){
						_items.push(this.items[i])
					}
				}
				this.scroll && this.scroll.scrollTo(0, 0)
				return _items
			}
		}
	}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
	.items
		height: 100%
		overflow: hidden
		.items-wrapper
			display: flex
			flex-wrap: wrap
			padding: 20px
			.item
				width: calc((100vw - 80px)/3)
				margin-bottom: 10px
				cursor: pointer
				&:nth-of-type(3n+2)
					margin-left: 20px
					margin-right: 20px
				.item-image
					width: 100%
					height: calc((100vw - 80px)/3)
					img
						width: 100%
						height: 100%
				.item-title
					height: 36px
					line-height: 30px
					text-align: center
			.item-new
				.item-image
					padding: 30px
					opacity: 0.3
					border: 1px solid #333
</style>