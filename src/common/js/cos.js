const APPID = '1253299728'
const BUCKET = 'sxps'
const REGION = 'ap-shanghai'

const authUrl = 'https://yixing01.applinzi.com/sxps2/seller/cosAuth.php'
const targetPath = 'v2'
const targetHost = 'http://sxps-1253299728.picsh.myqcloud.com/'

function dataURLtoBlob(dataurl) {
	let arr = dataurl.split(',')
	let mime = arr[0].match(/:(.*?);/)[1]
  let bstr = atob(arr[1])
  let n = bstr.length
  let u8arr = new Uint8Array(n)
	while(n--) {
  	u8arr[n] = bstr.charCodeAt(n)
	}
	return new Blob([u8arr], {type: mime})
}

// 计算cos签名
function getAuthorization(options, callback) {
	var method = (options.Method || 'get').toLowerCase()
	var key = options.Key || ''
	var pathname = key.indexOf('/') === 0 ? key : '/' + key
	var url = authUrl + '?method=' + method + '&pathname=' + encodeURIComponent(pathname)
	var xhr = new XMLHttpRequest()
	xhr.open('GET', url, true)
	xhr.onload = function (e) {
		callback(null, e.target.responseText)
	}
	xhr.onerror = function (e) {
		callback('获取签名出错')
	}
	xhr.send()
}

/**
 *	options.file,
 *	options.blob,
 *	options.dataURL,
 *	options.fileName,
 *	options.success,
 *	options.fail
 */
export function uploadFile(options) {
	let file = null
	let fileName = ''
	if('file' in options) {
		file = options.file
		fileName = options.file.name
	} else if('blob' in options) {
		file = options.blob
		fileName = options.fileName
	} else if('dataURL' in options) {
		file = dataURLtoBlob(options.dataURL)
		fileName = options.fileName
	}

  let extension = fileName.split('.').pop()
  let targetFile = targetPath + '/' + Date.now() + '.' + extension
  var protocol = location.protocol == 'https:' ? 'https://' : 'http://'
	var url = protocol + BUCKET + '-' + APPID + '.cos.' + REGION + '.myqcloud.com/'

  getAuthorization({Method: 'POST', Key: ''}, function (err, auth) {
		var formData = new FormData()
		formData.append('key', targetFile)
		formData.append('Signature', auth)
		formData.append('success_action_status', '200')
		formData.append('file', file)
		var xhr = new XMLHttpRequest()
		xhr.open('POST', url, true)
		xhr.onload = function () {
    	if (xhr.status === 200 || xhr.status === 206) {
      	options.success && options.success({
        	errno: 0,
          error: '',
          url: targetHost + targetFile
        })
      } else {
      	options.fail && options.fail({
      		errno: 1,
      		error: '文件 ' + fileName + ' 上传失败，状态码：' + xhr.status
      	})
      }
    }
    xhr.onerror = function () {
    	options.fail && options.fail({
    		errno: 2,
    		error: '文件 ' + fileName + ' 上传失败，请检查是否没配置 CORS 跨域规则'
    	})
    }
    xhr.send(formData)
  })
}