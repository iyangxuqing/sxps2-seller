import Vue from 'vue'

let touch = {}
let mouse = {}

function isPc() {
  var uaInfo = navigator.userAgent;
  var agents = ["Android", "iPhone", "Windows Phone", "iPad", "iPod"];
  var flag = true;
  for ( var i = 0; i < agents.length; i++ ) {
    if (uaInfo.indexOf(agents[i]) > 0) {
      flag = false;
      break;
    }
  }
  return flag;
}

function mousedown(e, binding) {
	mouse.startX = e.screenX
	mouse.startY = e.screenY
	mouse.startTime = Date.now()

	/* longtap */
	mouse.timer = setTimeout(() => {
		let method = binding.value.method
		let params = JSON.parse(JSON.stringify(binding.value))
		delete params.method
		if(binding.name === 'longtap') {
			mouse.longtap = true
			method(params)
		}
	}, 500)
}

function mouseup(e, binding) {
	mouse.endX = e.screenX
	mouse.endY = e.screenY
	mouse.endTime = Date.now()
	clearTimeout(mouse.timer)

	/* tap */
	let method = binding.value.method
	let params = JSON.parse(JSON.stringify(binding.value))
	delete params.method
	if(binding.name === 'tap') {
		/* 如果已经触发longtap，就不再触发tap */
		if(mouse.longtap == true) {
			mouse.longtap = false
			return
		}
		method(params)		
	}
}

function touchstart(e, binding) {
	touch.startX = e.touches[0].pageX
	touch.startY = e.touches[0].pageY
	touch.startTime = Date.now()

	/* longtap */
	touch.timer = setTimeout(() => {
		let method = binding.value.method
		let params = JSON.parse(JSON.stringify(binding.value))
		delete params.method
		if(binding.name === 'longtap') {
			touch.longtap = true
			method(params)
		}
	}, 500)
}

function touchend(e, binding) {
	touch.endX = e.changedTouches[0].pageX
	touch.endY = e.changedTouches[0].pageY
	touch.endTime = Date.now()
	clearTimeout(touch.timer)

	/* tap */
	let method = binding.value.method
	let params = JSON.parse(JSON.stringify(binding.value))
	delete params.method
	if(binding.name === 'tap') {
		/* 如果已经触发longtap，就不再触发tap */
		if(touch.longtap == true) {
			touch.longtap = false
			return
		}
		method(params)		
	}
}

Vue.directive('tap', {
    bind: function (el, binding) {
    	if(isPc()) {
	      el.addEventListener('mousedown', function(e) { mousedown(e, binding) }, false)
	      el.addEventListener('mouseup', function(e) { mouseup(e, binding) }, false)
    	} else {
	      el.addEventListener('touchstart', function(e) { touchstart(e, binding) }, false)
	      el.addEventListener('touchend', function(e) { touchend(e, binding) }, false)
    	}
    },
    update: function(el, binding) {
    	// if(isPc()) {
	    //   el.addEventListener('mousedown', function(e) { mousedown(e, binding) }, false)
	    //   el.addEventListener('mouseup', function(e) { mouseup(e, binding) }, false)
    	// } else {
	    //   el.addEventListener('touchstart', function(e) { touchstart(e, binding) }, false)
	    //   el.addEventListener('touchend', function(e) { touchend(e, binding) }, false)
    	// }
    }	
})

Vue.directive('longtap', {
    bind: function (el, binding) {
    	if(isPc()) {
	      el.addEventListener('mousedown', function(e) { mousedown(e, binding) }, false)
	      el.addEventListener('mouseup', function(e) { mouseup(e, binding) }, false)
    	} else {
	      el.addEventListener('touchstart', function(e) { touchstart(e, binding) }, false)
	      el.addEventListener('touchend', function(e) { touchend(e, binding) }, false)
    	}
    },
    update: function(el, binding) {
    	// if(isPc()) {
	    //   el.addEventListener('mousedown', function(e) { mousedown(e, binding) }, false)
	    //   el.addEventListener('mouseup', function(e) { mouseup(e, binding) }, false)
    	// } else {
	    //   el.addEventListener('touchstart', function(e) { touchstart(e, binding) }, false)
	    //   el.addEventListener('touchend', function(e) { touchend(e, binding) }, false)
    	// }
    }	
})