<template>
	<div class="goods">
		<div class="cates-container">
			<cates @change="cateChange"></cates>
		</div>
		<div class="items-container">
			<items :cid="cid"></items>	
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
	import Cates from '@/components/cates/cates'
	import Items from '@/components/items/items'

	export default {
		data() {
			return {
				cid: ''
			}
		},
		methods: {
			cateChange(currentCateId) {
				this.cid = currentCateId
			}
		},
		components: {
			Cates,
			Items
		}
	}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
	.goods
		height: 100%
		.cates-container
			height: 90px
		.items-container
			height: calc(100% - 90px)
</style>