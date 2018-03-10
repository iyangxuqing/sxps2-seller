<template>
	<div>
		<div class="cates">
			<div class="cates-wrapper" v-if="cates.length">
				<HScroll :data="cates">
					<div class="cate" v-for="cate in cates" :class="{active: cate.active}" @tap="cateTap(cate)" @longtap="cateLongtap(cate)">{{cate.title}}</div>
					<input class="cate-input" v-model="cate1Title" placeholder="新增" maxlength="6" @keyup.enter="inputEnter" @blur="cateAdd({pid: 0})">
				</HScroll>
			</div>
			<div class="cates-wrapper" v-for="cate in cates" v-if="cate.active">
				<HScroll :data="cate.children">
					<div class="cate" v-for="child in cate.children" :class="{active: child.active}" @tap="cateTap(child)" @longtap="cateLongtap(child)">{{child.title}}</div>
					<input class="cate-input" v-model="cate2Title" placeholder="新增" maxlength="6" @keyup.enter="inputEnter" @blur="cateAdd({pid: cate.id})">
				</HScroll>
			</div>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">

	import Vue from 'vue'
	import Bus from '@/common/js/bus'
	import HScroll from '@/base/hscroll/hscroll'
	import { getCates, setCate, delCate } from '@/api/cates'

	export default {
		data() {
			return {
				cates: [],
				cate1Title: '',
				cate2Title: '',
			}
		},
		created() {
			getCates().then((cates) => {
				this.cates = cates
			})
		},
		watch: {
			cates: {
				handler: function(val, oldVal) {
					let activeCId = this._getCateActive()
					Bus.$emit('activeCateId', activeCId)
				},
				deep: true
			}
		},
		methods: {
			inputEnter(e) {
				e.target.blur()
			},
			cateAdd({pid}) {
				/* input 输入空时，不反应 */
				if(!this.cate1Title && !this.cate2Title) return

				let cate = {
					id: String(Date.now()),
					pid: pid,
					active: false
				}
				if (pid == 0) {
					cate.title = this.cate1Title
					cate.children = []
					this.cates.push(cate)
					this.cate1Title = ''
				} else {
					for (let i in this.cates) {
						if (this.cates[i].id==pid) {
							cate.title = this.cate2Title
							this.cates[i].children.push(cate)
							this.cate2Title = ''
							break
						}
					}
				}
				
				setCate({
					id: cate.id,
					pid: cate.pid,
					title: cate.title
				}, 'set')
			},
			cateTap(cate) {
				let {i, j} = this._getCateIndex(cate)
				if (typeof j == 'undefined') {
					for (let k in this.cates) {
						this.cates[k].active = k == i
					}
				} else {
					for (let k in this.cates[i].children) {
						this.cates[i].children[k].active = k == j
					}
				}
			},
			cateLongtap(cate) {
				Bus.$emit('actionsheet', {
					items: [{
						value: cate.title,
						placeholder: '类目名不可为空',
						action: (value) => {
							cate.title = value
							setCate({
								id: cate.id,
								pid: cate.pid,
								title: cate.title
							}, 'set')
						}
					},{
						title: '往前移',
						action: () => {
							console.log('11')
							let cates = this.cates
							let {i, j} = this._getCateIndex(cate)
							if (typeof j == 'undefined') {
								if (i > 0) {
									let temp = cates[i]
									Vue.set(cates, i, cates[i - 1])
									Vue.set(cates, i - 1, temp)
								}
							} else {
								if (j > 0) {
									let temp = cates[i].children[j]
									Vue.set(cates[i].children, j, cates[i].children[j - 1])
									Vue.set(cates[i].children, j - 1, temp)
								}
							}
							setCate(cates, 'sort')
						}
					},{
						title: '往后移',
						action: () => {
							let cates = this.cates
							let {i, j} = this._getCateIndex(cate)
							if (typeof j == 'undefined') {
								if (i < cates.length - 1) {
									let temp = cates[i]
									Vue.set(cates, i, cates[Number(i) + 1])
									Vue.set(cates, Number(i) + 1, temp)
								}
							} else {
								if (j < cates[i].children.length - 1) {
									let temp = cates[i].children[j]
									Vue.set(cates[i].children, j, cates[i].children[Number(j) + 1])
									Vue.set(cates[i].children, Number(j) + 1, temp)
								}
							}
							setCate(cates, 'sort')
						}
					},{
						title: '删除',
						action: () => {
							delCate({
								id: cate.id,
								pid: cate.pid
							}).then((res) => {
								if (res.error) {
									Bus.$emit('alert', {
										title: '删除错误',
										content: res.error
									})
								} else {
									let cates = this.cates
									let {i, j} = this._getCateIndex(cate)
									if (typeof j == 'undefined') {
										let active = cates[i].active
										cates.splice(i, 1)
										if (active && cates.length > 0) {
											cates[0].active = true
										}
									} else {
										let active = cates[i].children[j].active
										cates[i].children.splice(j, 1)
										if (active && cates[i].children.length > 0) {
											cates[i].children[0].active = true
										}
									}
								}
							})
						}
					}]
				})
			},
			_getCateIndex(cate) {
				let cates = this.cates
				if (cate.pid == 0) {
					for (let i in cates) {
						if (cates[i].id == cate.id) {
							return {i}
						}
					}
				} else {
					for (let i in cates) {
						if (cates[i].id == cate.pid) {
							for (let j in cates[i].children) {
								if (cates[i].children[j].id == cate.id) {
									return {i, j}
								}
							}
						}
					}
				}
			},
			_getCateActive() {
				let activeCId = ''
				let cates = this.cates
				for (let i in cates) {
					if (cates[i].active == true) {
						for (let j in cates[i].children) {
							if (cates[i].children[j].active == true) {
								activeCId = cates[i].children[j].id
								break
							}
						}
						break
					}
				}
				return activeCId
			}
		},
		components: {
			HScroll
		}
	}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
	.cates
		.cates-wrapper
			display: flex
			align-items: center
			height: 45px
			padding: 0 20px
			border-bottom: 1px solid #ddd
			.cate
				flex-shrink: 0
				display: flex
				align-items: center
				justify-content: center
				height: 100%
				padding: 10px
				cursor: pointer
				&:first-child
					padding-Left: 0
				&:last-child
					padding-right: 0
				&.active
					color: red
				&.cate-new
					color: #888
			.cate-input
				padding: 10px
				width: 80px
				outline: none
</style>