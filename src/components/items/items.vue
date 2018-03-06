<template>
	<div class="items" ref="items">
		<div class="items-wrapper">
			<div class="item" :class="{'offshelf': item.onShelf=='0'}" v-for="item in categoryItems" v-if="item.title" @tap="itemTap(item)" @longtap="itemLongTap(item)">
				<div class="item-image"><img :src="item.image"/></div>
				<div class="item-title">{{item.title}}</div>
			</div>
			<div class="item item-new" @tap="itemTap({id:''})" v-show="cid">
				<div class="item-image"><img src="@/common/image/plus.png"/></div>
			</div>
		</div>
		<router-view></router-view>
		<ItemEditor v-model="itemEditorShow" :item="editItem" :items="categoryItems"></ItemEditor>
	</div>
 </template>

<script type="text/ecmascript-6">
	// import BScroll from 'better-scroll'
	import BScroll from '@/base/better-scroll/src/index'
	import { getItems, setItem } from '@/api/items'
	import ItemEditor from './item-editor'

	export default {
		props: {
			cid: {
				type: String,
				default: ''
			}
		},
	 	data() {
	 		return {
	 			items: [],
	 			editItem: {},
	 			itemEditorShow: false
	 		}
 		},
		created() {
			getItems().then((items) => {
				this.items = items
				this._initScroll()
			})
		},
		watch: {
			'$route'(to, from) {
				if (to.name == 'goods' && from.name == 'item') {
					let item = from.params.item
					if (!item) return
					/* 新建商品时，如果商品标题为空，则舍弃该商品，当成未建新商品 */
					if (item.title == '') {
						this.items.pop()
					} else {
						/* 有空的商品规格时，舍弃该空商品规格 */
						for (let i in item.specs) {
							if (!item.specs[i].title) {
								item.specs.splice(i, 1)
							}
						}
						setItem(item, 'set')
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
							longtap: true,
							click: true
						})
					} else {
						this.scroll.refresh()
					}
				}, 20)
			},
			itemTap(item) {
				if(item.id==='') {
					item = {
						id: '' + Date.now(),
						cid: this.cid,
						title: '',
						image: '',
						descs: '',
						price: '',
						specs: []
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
			},
			itemLongTap(item) {
				this.editItem = item
				this.itemEditorShow = true
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
		},
		components: {
			ItemEditor
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
				$w = calc((100vw - 80px)/3)
				width: $w
				margin-bottom: 10px
				cursor: pointer
				position: relative
				&:nth-of-type(3n+2)
					margin-left: 20px
					margin-right: 20px
				.item-image
					width: 100%
					height: $w
					img
						width: 100%
						height: 100%
				.item-title
					height: 36px
					line-height: 30px
					text-align: center
				&.offshelf::after
					content: ''
					position: absolute
					left: 10%
					bottom: 20px
					width: 80%
					height: 1px
					background: red			
			.item-new
				.item-image
					padding: 30px
					opacity: 0.3
					border: 1px solid #333

	.pc 
		.items
			.item
				width: calc((100% - 40px)/3)
				.item-image
					height: 90px					
</style>