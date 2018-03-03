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
	</div>
</template>

<script type="text/ecmascript-6">
	import {getCates} from '@/api/cates'
	import HScroll from '@/base/hscroll/hscroll'
	import CateEditor from './cate-editor'

	export default {
		data() {
			return {
				cates: [],
				cate1Title: '',
				cate2Title: '',
				editCate: {},
				cateEditorShow: false
			}
		},
		created() {
			getCates().then((cates) => {
				this.cates = cates
				let selectedCate = null
				for(let i in this.cates){
					if(this.cates[i].active == true) {
						for(let j in this.cates[i].children){
							if(this.cates[i].children[j].active == true) {
								selectedCate = this.cates[i].children[j]
								break
							}
						}
						break
					}
				}
				this.$emit('change', selectedCate)
			})
		},
		watch: {
			cates: {
				handler: function(val, oldVal) {
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
				if (pid == 0) {
					if(!this.cate1Title) return
					this.cates.push({
						id: String(Date.now()),
						pid: pid,
						title: this.cate1Title,
						children: [],
						sort: Date.now(),
						active: false
					})
					this.cate1Title = ''
				} else {
					if(!this.cate2Title) return
					for(let i in this.cates){
						if(this.cates[i].id==pid){
							this.cates[i].children.push({
								id: String(Date.now()),
								pid: pid,
								title: this.cate2Title,
								sort: Date.now(),
								active: false
							})
							this.cate2Title = ''
							break
						}
					}
				}
			},
			cateTap(cate) {
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
				let selectedCate = null
				for(let i in this.cates){
					if(this.cates[i].active == true) {
						for(let j in this.cates[i].children){
							if(this.cates[i].children[j].active == true) {
								selectedCate = this.cates[i].children[j]
								break
							}
						}
						break
					}
				}
				this.$emit('change', selectedCate)
			},
			cateLongtap(cate) {
				this.editCate = cate
				this.cateEditorShow = true
			}
		},
		components: {
			HScroll,
			CateEditor
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