<template>
	<div class="items">
		<div class="item" v-for="item in categoryItems" @click="selectItem(item.id)">
			<div class="item-image"><img :src="item.images[0]"></div>
			<div class="item-title">{{item.title}}</div>
		</div>
		<router-view></router-view>
	</div>
</template>

<script type="text/ecmascript-6">
	import {getItems} from '@/api/items'
	export default {
		props: {
			cid: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				items: []
			}
		},
		created() {
			getItems().then((items) => {
				this.items = items
			})
		},
		methods: {
			selectItem(id) {
				let item = null
				for(let i in this.items){
					if(this.items[i].id==id){
						item = this.items[i]
						break
					}
				}
				if(!item) return
				this.$router.push({
					name: 'item',
					params: {
						id: id,
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
				return _items
			}
		}
	}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
	.items
		display: flex
		flex-wrap: wrap
		padding: 20px
		.item
			width: calc((100vw - 80px)/3)
			margin-bottom: 10px
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
				height: 30px
				line-height: 30px
				text-align: center
</style>