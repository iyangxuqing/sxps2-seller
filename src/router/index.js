import Vue from 'vue'
import Router from 'vue-router'
import Goods from '@/components/goods/goods'
import Item from '@/components/item/item'

Vue.use(Router)

export default new Router({
  routes: [
    {
			path: '/',
			redirect: '/goods'
    },
    {
			path: '/goods',
			component: Goods,
      children: [
      	{
          path: ':id',
          name: 'item',
          props: true,
      		component: Item
      	}
      ]
    }
  ]
})
