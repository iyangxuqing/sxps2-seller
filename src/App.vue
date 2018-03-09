<template>
  <div id="app" :class="{'pc': isPc()}">
 		<keep-alive>
    	<router-view></router-view>
 		</keep-alive>
 		<Alert></Alert>
    <ActionSheet></ActionSheet>
  </div>
</template>

<script type="text/ecmascript-6">

import Alert from '@/components/alert/alert'
import ActionSheet from '@/components/actionsheet/actionsheet'

export default {
  name: 'App',
  methods: {
  	isPc() {
  		let uaInfo = navigator.userAgent
  		let agents = ["Android", "iPhone", "Windows Phone", "iPad", "iPod"]
  		let flag = true
  		for ( let i in agents ) {
	    	if (uaInfo.indexOf(agents[i]) > 0) {
	      	flag = false
	      	break
	    	}
	  	}
  		return flag
		}
  },
  components: {
  	Alert,
  	ActionSheet
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
	#app
		position: absolute
		width: 100%
		height: 100%
		overflow: hidden
		&.pc
			top: 50%
			left: 50%
			width: 375px
			height: 667px
			margin-top: -333px
			margin-left: -187px
			font-size: 14px
			border: 1px solid #ccc
			box-shadow: 0px 0px 10px 2px #ccc
		.pages
			position: relative
			width: 100%
			height: 100%
			.page
				width: 100%
				heihgt: 100%
				background: #fff
</style>