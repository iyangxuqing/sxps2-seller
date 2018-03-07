<template>
	<div class="actionsheet" :class="{'show': show}">
		<div class="actionsheet-list" :style="'height:'+height+'px'">
			<div class="actionsheet-item" v-for="(item, index) in items">
				<div class="actionsheet-item-title" v-if="item.title" @touchstart="touchstart(index)" @mousedown="mousedown(index)">{{item.title}}</div>
				<div class="actionsheet-item-input" v-if="item.value"><input v-model="item.value" :placeholder="item.placeholder" @keyup.enter="inputEnter(index, $event)"/></div>
			</div>
			<div class="actionsheet-item actionsheet-item-separator"></div>
			<div class="actionsheet-item actionsheet-item-cancel" @touchstart="cancel" @mousedown="cancel">取消</div>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">

	import Vue from 'vue'
	import Bus from '@/common/js/bus'

	export default {
		data() {
			return {
				items: [],
				height: 0,
				show: false
			}
		},
		created() {
			this.isPc = this._isPc()
			Bus.$on('actionsheet', (options) => {
				this.show = true
				this.items = options.items
				/* 当options中带有data字段和dataIndex字段时，执行内部'往前移'、'往后移'、'删除'操作 */
				this.data = options.data
				this.dataIndex = options.dataIndex
				this.baseAction = 'data' in options && 'dataIndex' in options
			})
		},
		watch: {
			show(val, oldVal) {
				this.height = this.show ? this.items.length * 50 + 60 : 0
			}
		},
		methods: {
			touchstart(index) {
				if (this.isPc) return
				this.action(index)
			},
			mousedown(index) {
				if (!this.isPc) return
				this.action(index)
			},
			inputEnter(index, e) {
				if(this.items[index].value) {
					e.target.blur()
					this.action(index, this.items[index].value)
				}
			},
			action(index, value) {
				let item = this.items[index]
				let data = this.data
				let dataIndex = this.dataIndex
				if (this.baseAction && item.title == '往前移') {
					if (dataIndex > 0) {
						let temp = data[dataIndex]
						Vue.set(data, dataIndex, data[dataIndex - 1])
						Vue.set(data, dataIndex - 1, temp)
					}
				}
				else if (this.baseAction && item.title == '往后移') {
					if (dataIndex < data.length - 1) {
						let temp = data[dataIndex]
						Vue.set(data, dataIndex, data[Number(dataIndex) + 1])
						Vue.set(data, Number(dataIndex) + 1, temp)
					}
				}
				else if (item.title == '删除') {
					Bus.$emit('alert', {
						title: '删除提示',
						content: '确定要删除该项吗？删除后无法恢复。',
						showCancel: true,
						confirm: () => {
							this.baseAction && data.splice(dataIndex, 1)
							item.action && item.action()
						}
					})
				}
				if (item.title != '删除') {
					item.action && item.action(value)
				}
				this.show = false
			},
			cancel() {
				this.show = false
			},
			_isPc() {
			  let uaInfo = navigator.userAgent
			  let agents = ['Android', 'iPhone', 'Windows Phone', 'iPad', 'iPod']
			  let flag = true
			  for ( let i in agents ) {
			    if (uaInfo.indexOf(agents[i]) > 0) {
			      flag = false
			      break
			    }
			  }
			  return flag
			}
		}
	}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
		.actionsheet
			position: absolute
			left: 0
			right: 0
			bottom: 0
			height: 0
			z-index: 9999
			background: rgba(0, 0, 0, 0.6)
			&.show
				height: 100%
			.actionsheet-list
				position: absolute
				left: 0
				right: 0
				bottom: 0
				height: 0
				background-color: #fff
				transition: all 300ms ease
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
					.actionsheet-item-title
						display: flex
						align-items: center
						justify-content: center
						width: 100%
						height: 100%
					.actionsheet-item-input
						width: 100%
						padding: 10px 20px
						input
							color: #393
							text-align: center
							letter-spacing: 2px
				.actionsheet-item-separator
					height: 10px
					background: #eee
				.actionsheet-item-cancel
					color: #f63
</style>