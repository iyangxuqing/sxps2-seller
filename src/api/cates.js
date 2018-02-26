import axios from 'axios'
import config from './config.js'

export function getCates() {
	return new Promise(function(resolve, reject){
		axios.get(config.apiHost + 'seller/cate2.php?m=get').then((res) => {
			if(res.data.errno === 0) {
				let cates = []
				for(let i in res.data.cates){
					let cate = res.data.cates[i]
					if(cate.pid==0){
						cates.push(cate)
					} else {
						for(let j in cates){
							if(cates[j].id == cate.pid){
								if(!cates[j].children) cates[j].children = [];
								cates[j].children.push(cate)
								break
							}
						}
					}
				}
				for(let i in cates){
					if(i==0){
						cates[i].active = true
					} else {
						cates[i].active = false	
					}
					for(let j in cates[i].children){
						if(j==0){
							cates[i].children[j].active = true
						} else {
							cates[i].children[j].active = false
						}
					}
				}
				resolve(cates)
			}
		})
	})
}