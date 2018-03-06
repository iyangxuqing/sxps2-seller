<template>
  <div id="app" :class="{'pc': isPc()}">
    <router-view/>
  </div>
</template>

<script type="text/ecmascript-6">
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
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
	#app
		width: 100%
		height: 100%
		overflow: hidden
		&.pc
			width: 375px
			height: 667px
			margin: 40px auto
			font-size: 14px
			border: 1px solid #ccc
			box-shadow: 0px 0px 10px 3px #ccc
</style>
