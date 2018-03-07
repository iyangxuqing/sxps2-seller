import axios from 'axios'
import config from './config'

const apiUrl = config.apiHost + 'seller/_item.php'

export function getItems() {
	return new Promise(function(resolve, reject){
		axios.get(apiUrl + '?m=get').then((res) => {
			if(res.data.errno === 0) {
				let items = res.data.items
        for (let i in items) {
        	items[i].cid = Number(items[i].cid)
        	items[i].image = items[i].image || items[i].images[0]
          items[i].price = Number(items[i].price).toFixed(2)
          if(!items[i].specs) items[i].specs = []
        }
				resolve(items)
			}
		})
	})
}

export function setItem(cate, method) {
	let url = apiUrl + '?m=' + method
	return new Promise(function(resolve, reject) {
		axios.post(url, cate).then((res) => {
			if (res.data.errno === 0) {
				resolve(res.data)
			} else {
				console.error('res.data')
				reject(res)
			}
		}).catch((res) => {
			reject(res)
		})
	})
}
