import axios from 'axios'
import config from './config'

export function getItems() {
	return new Promise(function(resolve, reject){
		axios.get(config.apiHost + 'seller/_item.php?m=get').then((res) => {
			if(res.data.errno === 0) {
				let items = res.data.items
        for (let i in items) {
        	items[i].cid = Number(items[i].cid)
        	items[i].image = items[i].images[0]
          items[i].price = Number(items[i].price).toFixed(2)
        }
				resolve(items)
			}
		})
	})
}

export function setItem(item, method) {
	return new Promise(function(resolve, reject){
		let url = config.apiHost + 'seller/_item.php?m=' + method
		axios.post(url, item).then((res) => {
			console.log(res)
		})
	})
}