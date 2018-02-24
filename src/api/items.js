import axios from 'axios'
import config from './config'

export function getItems() {
	return new Promise(function(resolve, reject){
		axios.get(config.apiHost + 'item2.php?m=get').then((res) => {
			if(res.data.errno === 0) {
				let items = res.data.items
        for (let i in items) {
          if (!items[i].images) items[i].images = '[]'
          items[i].images = JSON.parse(items[i].images)
          items[i].price = Number(items[i].price).toFixed(2)
        }
				resolve(items)
			}
		})
	})
}