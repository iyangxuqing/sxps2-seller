<template>
	<div>
		<div class="cates">
			<div class="cates-wrapper" v-if="cates.length">
				<HScroll :data="cates">
					<div class="cate" v-for="cate in cates" :class="{active: cate.active}" @click="onCateClick(cate)">{{cate.title}}</div>
					<input class="cate-input" v-model="cate1Title" placeholder="新增" @keyup.enter="onCateAdd({pid: 0})" @blur="onCateAdd({pid: 0})" ref="cate1Input">
				</HScroll>
			</div>
			<div class="cates-wrapper" v-for="cate in cates" v-if="cate.active">
				<HScroll :data="cate.children">
					<div class="cate" v-for="child in cate.children" :class="{active: child.active}" @click="onCateClick(child)">{{child.title}}</div>
					<input class="cate-input" v-model="cate2Title" placeholder="新增" @keyup.enter="onCateAdd({pid: cate.id})" @blur="onCateAdd({pid: cate.id})" ref="cate2Input">
				</HScroll>
			</div>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
	import {getCates} from '@/api/cates'
	import HScroll from '@/base/hscroll/hscroll'

	export default {
		data() {
			return {
				cates: [],
				cate1Title: '',
				cate2Title: ''
			}
		},
		created() {
			getCates().then((cates) => {
				this.cates = cates
				for(let i in this.cates){
					if(this.cates[i].active == true) {
						for(let j in this.cates[i].children){
							if(this.cates[i].children[j].active == true) {
								this.$emit('changeCate', this.cates[i].children[j])
								break
							}
						}
						break
					}
				}
			})
		},
		methods: {
			onCateAdd({pid}) {
				if (pid == 0) {
					if(!this.cate1Title) return
					this.cates.push({
						pid: pid,
						title: this.cate1Title
					})
					this.cate1Title = ''
				} else {
					if(!this.cate2Title) return
					for(let i in this.cates){
						if(this.cates[i].id==pid){
							this.cates[i].children.push({
								pid: pid,
								title: this.cate2Title
							})
							this.cate2Title = ''
						}
						break
					}
				}
				this.$refs.cate1Input.blur()
				this.$refs.cate2Input[0].blur()
			},
			onCateClick(cate) {
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
				for(let i in this.cates){
					if(this.cates[i].active == true) {
						for(let j in this.cates[i].children){
							if(this.cates[i].children[j].active == true) {
								this.$emit('changeCate', this.cates[i].children[j])
								break
							}
						}
						break
					}
				}
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
			padding: 0 20px
			border-bottom: 1px solid #ddd
			.cate
				flex-shrink: 0
				display: flex
				align-items: center
				justify-content: center
				height: 44px;
				padding: 10px
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