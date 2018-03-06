<template>
	<div class="actionsheet" :style="'height:'+height+'px'">
		<div class="actionsheet-mask" v-if="height"></div>
		<div class="actionsheet-list">
			<div class="actionsheet-item" @click="action(0)">往前移</div>
			<div class="actionsheet-item" @click="action(1)">往后移</div>
			<div class="actionsheet-item" @click="action(2)">删除</div>
			<div class="actionsheet-item actionsheet-item-separator"></div>
			<div class="actionsheet-item actionsheet-item-cancel" @click="cancel">取消</div>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">

	export default {
 		model: {
      prop: 'show',
      event: 'change'
    },			
		props: {
			show: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				height: 0
			}
		},
		watch: {
			show(newValue, oldValue) {
				this.height = this.show ? 210 : 0
			}
		},
		methods: {
			action(index) {
				this.$emit('action', index)
				this.$emit('change', false)
			},
			cancel() {
				this.$emit('change', false)
			}
		}
	}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
		.actionsheet
			position: fixed
			left: 0
			right: 0
			bottom: 0
			z-index: 9999
			height: 0
			transition: all 300ms ease
			.actionsheet-mask
				position: fixed
				top: 0
				left: 0
				right: 0
				bottom: 0
				z-index: 1
				background: rgba(0, 0, 0, 0.6)
			.actionsheet-list
				position: absolute
				z-index: 2
				width: 100%
				height: 100%
				background-color: #fff
				.actionsheet-item
					display: flex
					align-items: center
					justify-content: center
					width: 100%
					height: 50px
					color: #345
					cursor: pointer
					letter-spacing: 2px
					border-bottom: 1px solid #eee
				.actionsheet-item-separator
					height: 10px
					background: #eee
				.actionsheet-item-cancel
					color: #f63
</style>