import axios from 'axios'
import config from './config.js'

const apiUrl = config.apiHost + 'seller/_cate.php'

export function getCates() {
	return new Promise(function(resolve, reject) {
		axios.get(apiUrl + '?m=get').then((res) => {
			if(res.data.errno === 0) {
				let cates = []
				for(let i in res.data.cates) {
					let cate = res.data.cates[i]
					if(cate.pid==0) {
						cate.children = []
						cates.push(cate)
					} else {
						for(let j in cates) {
							if(cates[j].id == cate.pid){
								cates[j].children.push(cate)
								break
							}
						}
					}
				}
				for(let i in cates) {
					if(i==0) {
						cates[i].active = true
					} else {
						cates[i].active = false	
					}
					for(let j in cates[i].children) {
						if(j==0) {
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

export function setCate(cate, method) {
	let url = apiUrl + '?m=' + method
	return new Promise(function(resolve, reject) {
		axios.post(url, cate).then((res) => {
			if (res.data.errno === 0) {
				resolve(res.data)
			} else {
				reject(res)
			}
		}).catch((res) => {
			reject(res)
		})
	})
}

export function delCate(cate) {
	let url = apiUrl + '?m=delete'
	return new Promise(function(resolve, reject) {
		axios.post(url, cate).then((res) => {
			if (res.data.errno === 0) {
				resolve(res.data)
			} else {
				reject(res)
			}
		}).catch((res) => {
			reject(res)
		})
	})
}
