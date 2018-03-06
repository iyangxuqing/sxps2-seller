<template>
	<div class="actionsheet" :style="'height:'+height+'px'">
		<div class="actionsheet-mask" v-if="height"></div>
		<div class="actionsheet-list">
			<div class="actionsheet-item" @click="action(item, 0)">往前移</div>
			<div class="actionsheet-item" @click="action(item, 1)">往后移</div>
			<div class="actionsheet-item" @click="action(item, 2)">上下架</div>
			<div class="actionsheet-item" @click="action(item, 3)">删除</div>
			<div class="actionsheet-item actionsheet-item-separator"></div>
			<div class="actionsheet-item actionsheet-item-cancel" @click="cancel">取消</div>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
	import { setItem, delItem } from '@/api/items'
	import Alert from '@/base/alert/alert'

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
				let index = -1
				for(let i in items) {
					if(items[i].id == item.id){
						index = i
						break
					}
				}
				if(index > 0) {
					let temp = items[index]
					items[index] = items[index - 1]
					items[index - 1] = temp
				}
			},
			_sortDown(item, items) {
				let index = -1
				for(let i in items) {
					if(items[i].id == item.id){
						index = i
						break
					}
				}
				if(index < items.length - 1) {
					let temp = items[index]
					items[index] = items[Number(index) + 1]
					items[Number(index) + 1] = temp
				}
			},
			_onShelf(item, items) {
				item.onShelf = item.onShelf == '1' ? '0' : '1'
			},
			_delete(item, items) {
				let index = -1
				for(let i in items) {
					if(items[i].id == item.id){
						index = i
						break
					}
				}
				items.splice(index, 1)
			},
			action(item, index) {
				/* 往前移 */
				if (index==0) {
					this._sortUp(item, this.items)
					setItem(item, 'sortUp')
				}
				/* 往后移 */
				else if (index == 1) {
					this._sortDown(item, this.items)
					setItem(item, 'sortDown')
				}
				/* 上下架 */
				else if (index == 2) {
					this._onShelf(item, this.items)
					setItem(item, 'set')
				}
				/* 删除 */
				else if (index == 3) {
					this._delete(item, this.items)
					setItem(item, 'delete')
				}
				this.$emit('action', item, index)
				this.$emit('change', false)
			},
			/* 重命名 */
			inputEnter(e) {
				e.target.blur()
			},
			/* 重命名 */
			inputBlur(e) {
				let value = this.$refs.input.value
				if(!value) {
					e.target.focus()
					return
				}
				this.item.title = value
				let _item = {
					id: this.item.id,
					title: this.item.title
				}
				setItem(_item, 'update')
				this.$emit('change', false)
			},
			/* 取消 */
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