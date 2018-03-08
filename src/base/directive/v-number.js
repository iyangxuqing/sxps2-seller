import Vue from 'vue'

//<input v-model="num" v-number />
Vue.directive('number', {
    bind: function (el, binding) {
    		el.$handler = function(e) {
    			e.target.value = e.target.value.replace(/[^\d.]/, '')
    		}
        el.addEventListener('input', el.$handler)
    },
    unbind: function (el, binding) {
        el.removeEventListener('input', el.$handler)
    }
})