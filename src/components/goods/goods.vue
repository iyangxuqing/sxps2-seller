<template>
	<div class="goods">
		<cates @changeCate="onChangeCate"></cates>
		<items :cid="cid"></items>
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
			onChangeCate(cate) {
				this.cid = cate.id
			}
		},
		components: {
			Cates,
			Items
		}
	}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
</style>