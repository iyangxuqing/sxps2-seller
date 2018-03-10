<template>
	<div class="actionsheet" :class="{'show': show}">
		<div class="actionsheet-list" :style="'height:'+height+'px'">
			<div class="actionsheet-item" :class="{'disable': item.disable}" v-for="(item, index) in items">
				<div class="actionsheet-item-title" v-if="item.title" @touchstart="touchstart(index, $event)" @mousedown="mousedown(index, $event)">{{item.title}}</div>
				<div class="actionsheet-item-input" v-if="item.value"><input :value="item.value" :placeholder="item.placeholder" @keyup.enter="inputEnter(index, $event)"/></div>
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
			})
		},
		watch: {
			show(val, oldVal) {
				this.height = this.show ? this.items.length * 50 + 60 : 0
			}
		},
		methods: {
			touchstart(index, e) {
				if (this.isPc) return
				this.action(index)
			},
			mousedown(index, e) {
				if (!this.isPc) return
				this.action(index, {ctrlKey: e.ctrlKey, shiftKey: e.shiftKey})
			},
			inputEnter(index, e) {
				if (e.target.value) {
					e.target.blur()
					this.action(index, {value: e.target.value})
				}
			},
			action(index, options) {
				let item = this.items[index]
				if (item.disable) return

				let data = this.data
				let dataIndex = this.dataIndex

				if (data && item.title == '往前移') {
					let step = options.ctrlKey ? 6 : 1
					let i1 = dataIndex
					let i2 = i1 - step
					if (i2 < 0) i2 = 0
					let temp = data[i1]
					Vue.set(data, i1, data[i2])
					Vue.set(data, i2, temp)
				}
				else if ( data && item.title == '往后移') {
					let step = options.ctrlKey ? 6 : 1
					let i1 = dataIndex
					let i2 = Number(i1) + step
					if (i2 > data.length - 1) i2 = data.length - 1
					let temp = data[i1]
					Vue.set(data, i1, data[i2])
					Vue.set(data, i2, temp)
				}
				else if (item.title == '删除') {
					Bus.$emit('alert', {
						title: '删除提示',
						content: '确定要删除该项吗？删除后无法恢复。',
						showCancel: true,
						confirm: () => {
							this.data && data.splice(dataIndex, 1)
							item.action && item.action(item)
						}
					})
				}
				if (item.title != '删除') {
					item.action && item.action(options.value)
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
					&.disable
						color: #aaa
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