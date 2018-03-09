import Vue from 'vue'

//<input v-model="num" v-money />
Vue.directive('money', {
    bind: function (el, binding) {
    		el.$handler = function(e) {
    			let value = e.target.value

    			/* 去除所有非数字和小数点（.）的字符 */
    			value = value.replace(/[^\d.]/, '')

    			/* 当首位为0时，第二位只能为小数点（.） */
    			if (value.length == 2) {
    				if (value[0] == '0' && value[1] != '.') value = value[0]
    			}

    			/* 当已经存在一个小数点（.）时，不可再输入小数点（.） */
    			if (value[value.length - 1] == '.') {
    				if (value.indexOf('.') != value.length - 1) {
    					value = value.slice(0, length -1)
    				}
    			}

    			/* 小数点（.）后面只可以输入两位数字 */
    			if (value[value.length - 4] == '.') {
    				value = value.slice(0, length - 1)
    			}

    			e.target.value = value
    		}
        el.addEventListener('input', el.$handler)
    },

    unbind: function (el, binding) {
        el.removeEventListener('input', el.$handler)
    }
})