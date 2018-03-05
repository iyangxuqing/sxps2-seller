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
      name: 'goods',
			path: '/goods',
			component: Goods,
      children: [
      	{
          name: 'item',
          path: ':id',
          props: true,
      		component: Item
      	}
      ]
    }
  ]
})
