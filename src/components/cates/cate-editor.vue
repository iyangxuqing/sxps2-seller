<template>
	<div class="actionsheet" :style="'height:'+height+'px'">
		<div class="actionsheet-mask" v-if="height"></div>
		<div class="actionsheet-list">
			<div class="actionsheet-item">
				<div class="input"><input :value="cate.title" placeholder="类目不可为空" ref="input" @keyup.enter="inputEnter" @blur="inputBlur"></div>
			</div>
			<div class="actionsheet-item" @click="action(cate, 0)">往前移</div>
			<div class="actionsheet-item" @click="action(cate, 1)">往后移</div>
			<div class="actionsheet-item" @click="action(cate, 2)">删除</div>
			<div class="actionsheet-item actionsheet-item-separator"></div>
			<div class="actionsheet-item actionsheet-item-cancel" @click="cancel">取消</div>
		</div>
		<alert v-model="alert"></alert>
	</div>
</template>

<script type="text/ecmascript-6">
	import { setCate } from '@/api/cates'
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
			cate: {
				type: Object,
				default: () => {}
			},
			cates: {
				type: Array,
				default: () => []
			}
		},
		data() {
			return {
				Show: false,
				height: 0,
				alert: {}
			}
		},
		watch: {
			show(newValue, oldValue) {
				this.height = this.show ? 260 : 0
			}
		},
		methods: {
			_sortUp(cate, cates) {
				if (cate.pid==0) {
					let index = -1
					for(let i in cates) {
						if(cates[i].id == cate.id) {
							index = i
							break
						}
					}
					if (index > 0) {
						let temp = cates[index]
						cates[index] = cates[index - 1]
						cates[index - 1] = temp
					}
				} else {
					for (let i in cates) {
						if (cates[i].id == cate.pid) {
							let index = -1
							for (let j in cates[i].children) {
								if (cates[i].children[j].id == cate.id) {
									index = j
									break
								}
							}
							if (index > 0) {
								let temp = cates[i].children[index]
								cates[i].children[index] = cates[i].children[index - 1]
								cates[i].children[index - 1] = temp
							}
							break
						}
					}
				}
			},
			_sortDown(cate, cates) {
				if (cate.pid==0) {
					let index = -1
					for(let i in cates) {
						if(cates[i].id == cate.id) {
							index = i
							break
						}
					}
					if (index < cates.length - 1) {
						let temp = cates[index]
						cates[index] = cates[Number(index) + 1]
						cates[Number(index) + 1] = temp
					}
				} else {
					for (let i in cates) {
						if (cates[i].id == cate.pid) {
							let index = -1
							for (let j in cates[i].children) {
								if (cates[i].children[j].id == cate.id) {
									index = j
									break
								}
							}
							if (index < cates.length - 1) {
								let temp = cates[i].children[index]
								cates[i].children[index] = cates[i].children[Number(index) + 1]
								cates[i].children[Number(index) + 1] = temp
							}
							break
						}
					}
				}
			},
			_delete(cate, cates) {
				if (cate.pid==0) {
					let index = -1
					for(let i in cates) {
						if(cates[i].id == cate.id) {
							index = i
							break
						}
					}
					let active = cates[index].active
					cates.splice(index, 1)
					if (active && cates.length) {
						cates[0].active = true
					}
				} else {
					for (let i in cates) {
						if (cates[i].id == cate.pid) {
							let index = -1
							for (let j in cates[i].children) {
								if (cates[i].children[j].id == cate.id) {
									index = j
									break
								}
							}
							let active = cates[i].children[index].active
							cates[i].children.splice(index, 1)
							if (active && cates[i].children.length) {
									cates[i].children[0].active = true
							}
							break
						}
					}
				}
			},
			action(cate, index) {
				/* 往前移 */
				if (index==0) {
					this._sortUp(cate, this.cates)
					setCate(cate, 'sortUp')
				}
				/* 往后移 */
				else if (index == 1) {
					this._sortDown(cate, this.cates)
					setCate(cate, 'sortDown')
				}
				/* 删除 */
				else if (index == 2) {
					this.alert = {
						content: '确定要删除该项类目吗？',
						showCancel: true,
						confirm: function(res) {
							console.log(res)
							this._delete(cate, this.cates)
						}
					}
				}
				this.$emit('action', cate, index)
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
				this.cate.title = value
				let _cate = {
					id: this.cate.id,
					title: this.cate.title
				}
				setCate(_cate, 'update')
				this.$emit('change', false)
			},
			/* 取消 */
			cancel() {
				this.$emit('change', false)
			}
		},
		components: {
			Alert
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