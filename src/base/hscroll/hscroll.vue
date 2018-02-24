<template>
  <div class="hscroll" ref="hscroll">
    <div class="hscroll-wrapper" ref="hscrollWrapper">
    	<slot></slot>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
	import { addClass } from '@/common/js/dom'
  import BScroll from 'better-scroll'

  export default {
  	props: {
  		data : {
  			type: Array,
  			default: []
  		}
  	},
    created() {
      this.$nextTick(() => {
        this._setWidth()
        this._initScroll()
      });
    },
    watch: {
    	data() {
    		this._initScroll()
    	}
    },
    methods: {
			_setWidth() {
				let width = 0
				this.children = this.$refs.hscrollWrapper.children
				for (let i = 0; i < this.children.length; i++) {
					let child = this.children[i]
					addClass(child, 'hscroll-item')
					width += child.clientWidth
				}
				this.$refs.hscrollWrapper.style.width = width + 'px'
			},
			_initScroll() {
				this.$nextTick(() => {
					let width = 0
					this.children = this.$refs.hscrollWrapper.children
					for (let i = 0; i < this.children.length; i++) {
						let child = this.children[i]
						addClass(child, 'hscroll-item')
						width += child.clientWidth
					}
					this.$refs.hscrollWrapper.style.width = width + 'px'

					if (!this.hscroll) {
						this.hscroll = new BScroll(this.$refs.hscroll, {
							click: true,
							scrollX: true,
							scrollY: false,
							momentum: false,
							eventPassthrough: 'vertical'
						})
					} else {
						this.hscroll.refresh()
					}
				})
    	}
  	}
	}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .hscroll
    width: 100%
    overflow: hidden
    .hscroll-wrapper
      display: flex
      align-items: center
</style>
