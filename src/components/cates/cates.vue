<template>
	<div>
		<div class="cates">
			<div class="cates-wrapper" v-if="cates.length">
				<HScroll :data="cates">
					<div class="cate" v-for="cate in cates" :class="{active: cate.active}" @tap="cateTap(cate)" @longtap="cateLongtap(cate)">{{cate.title}}</div>
					<input class="cate-input" v-model="cate1Title" placeholder="新增" @keyup.enter="inputEnter" @blur="cateAdd({pid: 0})">
				</HScroll>
			</div>
			<div class="cates-wrapper" v-for="cate in cates" v-if="cate.active">
				<HScroll :data="cate.children">
					<div class="cate" v-for="child in cate.children" :class="{active: child.active}" @tap="cateTap(child)" @longtap="cateLongtap(child)">{{child.title}}</div>
					<input class="cate-input" v-model="cate2Title" placeholder="新增" @keyup.enter="inputEnter" @blur="cateAdd({pid: cate.id})">
				</HScroll>
			</div>
		</div>
		<CateEditor v-model="cateEditorShow" :cate="editCate" :cates="cates"></CateEditor>
		<Alert v-model="alert"></Alert>
	</div>
</template>

<script type="text/ecmascript-6">
	import {getCates, setCate} from '@/api/cates'
	import HScroll from '@/base/hscroll/hscroll'
	import CateEditor from './cate-editor'
	import Alert from '@/base/alert/alert'

	export default {
		data() {
			return {
				cates: [],
				cate1Title: '',
				cate2Title: '',
				editCate: {},
				cateEditorShow: false,
				alert: {}
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
					let activeCateId = ''
					for(let i in this.cates) {
						if(this.cates[i].active == true) {
							for(let j in this.cates[i].children) {
								if(this.cates[i].children[j].active == true) {
									activeCateId = this.cates[i].children[j].id
									break
								}
							}
							break
						}
					}
					this.$emit('change', activeCateId)
					console.log('watch cates')
				},
				deep: true
			}
		},
		methods: {
			inputEnter(e) {
				e.target.blur()
			},
			cateAdd({pid}) {
				if(!this.cate1Title && !this.cate2Title) return /* input 输入空时，不反应 */

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
				
				let _cate = {
					id: cate.id,
					pid: cate.pid,
					title: cate.title
				}
				setCate(_cate, 'insert')
			},
			cateTap(cate) {
				this.alertShow = true
				this.alert = {
					title: '删除类目',
					content: '确定要删除这个类目吗？',
					showCancel: true,
					confirm: function(res) {
						console.log('abc', res)
					},
					cancel: function(res) {
						console.log('abc', res)
					}
				}
				return;

				if (cate.pid==0) {
					for(let i in this.cates) {
						this.cates[i].active = false
						if(this.cates[i].id == cate.id) {
							this.cates[i].active = true
						}
					}
				} else {
					for(let i in this.cates) {
						if(this.cates[i].id == cate.pid) {
							for(let j in this.cates[i].children) {
								this.cates[i].children[j].active = false
								if (this.cates[i].children[j].id == cate.id) {
									this.cates[i].children[j].active = true
								}
							}
							break
						}
					}
				}
				// let selectedCate = null
				// for(let i in this.cates){
				// 	if(this.cates[i].active == true) {
				// 		for(let j in this.cates[i].children){
				// 			if(this.cates[i].children[j].active == true) {
				// 				selectedCate = this.cates[i].children[j]
				// 				break
				// 			}
				// 		}
				// 		break
				// 	}
				// }
			},
			cateLongtap(cate) {
				this.editCate = cate
				this.cateEditorShow = true
			}
		},
		components: {
			HScroll,
			CateEditor,
			Alert
		}
	}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
	.cates
		.cates-wrapper
			padding: 0 20px
			border-bottom: 1px solid #ddd
			.cate
				flex-shrink: 0
				display: flex
				align-items: center
				justify-content: center
				height: 44px;
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