<template>
	<div class="alert" :class="{'show': show}">
		<div class="alert-wrapper">
			<div class="alert-title" v-if="title">{{title}}</div>
			<div class="alert-content" v-if="content">{{content}}</div>
			<div class="alert-buttons">
				<div class="alert-button alert-button-cancel" v-if="showCancel" @click="cancel">取消</div>
				<div class="alert-button alert-button-confirm" @click="confirm">确定</div>
			</div>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">

	import Bus from '@/common/js/bus'

	export default {
		data() {
			return {
				title: '',
				content: '',
				show: false,
				showCancel: false,
			}
		},
		created() {
			Bus.$on('alert', (options) => {
				this.show = true
				this.title = options.title
				this.content = options.content
				this.showCancel = options.showCancel
				this.options = options
			})
		},
		methods: {
			cancel() {
				this.show = false
				this.options.cancel && this.options.cancel()
			},
			confirm() {
				this.show = false
				this.options.confirm && this.options.confirm()
			}
		}
	}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
	.alert
		position: absolute
		top: 0
		left: 0
		right: 0
		bottom: 0
		z-index: 1000
		display: none
		&.show
			display: block
		background: rgba(0, 0, 0, 0.5)
		.alert-wrapper
			position: absolute
			top: 45%
			left: 50%
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
			line-height: 1.4
			text-indent: 2em
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
				cursor: pointer
				&.alert-button-confirm
					color: #f63
				&.alert-button-cancel
					color: #678
					border-right: 1px solid #ddd
</style>