<template>
	<div class="actionsheet" :style="'height:'+height+'px'">
		<div class="actionsheet-mask" v-if="height"></div>
		<div class="actionsheet-list">
			<div class="actionsheet-item">
				<div class="input"><input v-model="item.title" @keyup.enter="inputEnter" @blur="inputBlur"></div>
			</div>
			<div class="actionsheet-item" @click="action(item, 0)">往前移</div>
			<div class="actionsheet-item" @click="action(item, 1)">往后移</div>
			<div class="actionsheet-item" @click="action(item, 2)">删除</div>
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
			},
			item: {
				type: Object,
				default: () => {}
			},
			items: {
				type: Array,
				default: () => []
			}
		},
		data() {
			return {
				Show: false,
				height: 0,
			}
		},
		watch: {
			show(newValue, oldValue) {
				this.height = this.show ? 260 : 0
			}
		},
		methods: {
			_sortUp(item, items) {
				console.log('_sortup')
			},
			_sortDown(item, items) {
				console.log('sortdown')
			},
			_delete(item, items) {
				console.log('delete')
			},
			action(item, index) {
				/* 往前移 */
				if (index==0) {
					this._sortUp(item, this.items)
				}
				/* 往后移 */
				else if (index == 1) {
					this._sortDown(item, this.items)
				}
				/* 删除 */
				else if (index == 2) {
					this._delete(item, this.items)
				}
				this.$emit('action', item, index)
				this.$emit('change', false)
			},
			cancel() {
				this.$emit('change', false)
			},
			inputEnter(e) {
				e.target.blur()
			},
			inputBlur(e) {
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
					input
						outline: none
						padding: 10px
						color: #f63
						text-align: center
						letter-spacing: 2px
				.actionsheet-item-separator
					height: 10px
					background: #eee
				.actionsheet-item-cancel
					color: #f63
</style>