<template>
	<div class="items" ref="items">
		<div class="items-wrapper">
			<div class="item" v-for="item in categoryItems" v-if="item.title" @tap="itemTap(item)" @longtap="itemLongTap(item)">
				<div class="item-image"><img :src="item.image"></div>
				<div class="item-title">{{item.title}}</div>
			</div>
			<div class="item item-new" @tap="itemTap({id:''})" v-if="cid">
				<div class="item-image">
					<img src="@/common/image/plus.png">
				</div>
			</div>
		</div>
		<router-view></router-view>
		<ItemEditor v-model="itemEditorShow" :item="editItem" :items="categoryItems"></ItemEditor>
	</div>
 </template>

<script type="text/ecmascript-6">
	// import BScroll from 'better-scroll'
	import BScroll from '@/base/better-scroll/src/index'
	import { getItems } from '@/api/items'
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
	 			itemEditorShow: false,
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
						if(this.items[i].title===''){
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