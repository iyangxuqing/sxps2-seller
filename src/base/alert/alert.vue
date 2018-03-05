<template>
	<div class="alert" v-if="alert.content">
		<div class="alert-mask"></div>
		<div class="alert-wrapper">
			<div class="alert-title" v-if="alert.title">{{alert.title}}</div>
			<div class="alert-content" v-if="alert.content">{{alert.content}}</div>
			<div class="alert-buttons">
				<div class="alert-button alert-button-cancel" v-if="alert.showCancel" @click="cancel">取消</div>
				<div class="alert-button alert-button-confirm" @click="confirm">确定</div>
			</div>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">

	export default {
		model: {
			prop: 'alert',
			event: 'change'
		},
		props: {
			alert: {
				type: Object,
				default: () => {}
			}
		},
		methods: {
			cancel() {
				this.Show = false
				this.$emit('change', {})
				this.$emit('confirm', {confirm: false})
				this.alert.cancel && this.alert.cancel({confirm: false, cancel: true})
			},
			confirm() {
				this.Show = false
				this.$emit('change', {})
				this.$emit('confirm', {confirm: true})
				this.alert.confirm && this.alert.confirm({confirm: true, cancel: false})
			}
		}
	}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
	.alert
		.alert-mask
			position: fixed
			top: 0
			left: 0
			right: 0
			bottom: 0
			z-index: 1000
			background: rgba(0, 0, 0, 0.5)
		.alert-wrapper
			position: fixed
			top: 45%
			left: 50%
			z-index: 1001
			transform: translate(-50%, -50%)
			width: 280px
			height: 180px
			color: #345
			border-radius: 5px
			background: #fff
			display: flex
			flex-direction: column
		.alert-title
			height: 44px
			display: flex
			align-items: center
			justify-content: center
			letter-spacing: 2px
		.alert-content
			flex-grow: 1
			padding: 20px
			letter-spacing: 1px
		.alert-title + .alert-content
			padding-top: 2px
		.alert-buttons
			height: 44px
			display: flex
			align-items: center
			justify-content: center
			border-top: 1px solid #ddd
			.alert-button
				width: 100%
				height: 100%
				display: flex
				align-items: center
				justify-content: center
				letter-spacing: 2px
				&.alert-button-confirm
					color: #f63
				&.alert-button-cancel
					color: #678
					border-right: 1px solid #ddd
</style>