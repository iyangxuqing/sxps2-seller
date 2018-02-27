<template>  
  <div class="image-uploader">
  	<div class="preview" :style="'backgroundImage:url('+imageUrl+')'"></div>
 		<input type="file" id="upload" accept="image/png,image/jpeg,image/jpg,image/gif" @change="change">
 		<label for="upload"></label>
 		<div class="placeholder" v-if="!imageUrl">{{placeholder}}</div>
  </div>  
</template>

<script>
	import { uploadFile } from '@/common/js/cos'

	export default {
 		model: {
      prop: 'image',
      event: 'change'
    },		
		props: {
			image: {
				type: String,
				default: ''
			}
		},
	  data () {
	    return {
	      imageUrl: '',
	      placeholder: '点击选择图片'
	    }
	  },
	  created() {
  		this.imageUrl = this.image
	  },
	  watch: {
	  	image() {
	  		this.imageUrl = this.image
	  	}
	  },
	  methods: {
	  	change(e) {
	      let files = e.target.files
	      if (!files.length) return
	      this._imgPreview(files[0])
	    }, 
	    _imgPreview(file) {
	      let self = this
	      // 看支持不支持FileReader
	      if (!file || !window.FileReader) return
	      if (/^image/.test(file.type)) {
          // 创建一个reader
          let reader = new FileReader()
          // 将图片转成 base64 格式
          reader.readAsDataURL(file)
          // 读取成功后的回调
          reader.onloadend = function() {
            let result = this.result
            let img = new Image()
            img.src = result
            //判断图片是否大于100K,是就直接上传，反之压缩图片
            if (this.result.length <= (100 * 1024)) {
              let dataURL = this.result
              self.imageUrl = dataURL
              self._imgPost(dataURL, file.name)
            } else {
            	img.onload = function() {
                let dataURL = self._compress(img)
                self.imageUrl = dataURL
                self._imgPost(dataURL, file.name)
            	}
            }
          }
        }
	    },
	    _imgPost(dataURL, fileName) {
	    	let self = this
	    	uploadFile({
	      	dataURL: dataURL,
	      	fileName: fileName,
	      	success: function(res) {
	      		self.$emit('change', res.url)
	      	}
	      })
	    },
	    _compress(img, debug=false) {  
	      let canvas = document.createElement("canvas")
	      let ctx = canvas.getContext('2d')
	      let srcWidth = img.width 
	      let srcHeight = img.height
	      let dstWidth = Math.floor(srcWidth)
	      let dstHeight = Math.floor(srcHeight)

	      // 如果图片大于40万像素，计算压缩比并将大小压至40万以下  
	      let ratio
	      if ((ratio = srcWidth * srcHeight / 400000) > 1) {  
	        ratio = Math.sqrt(ratio)
	        dstWidth = Math.floor(srcWidth/ratio)
	        dstHeight = Math.floor(srcHeight/ratio)
	      } else {  
	        ratio = 1
	      }  
	      canvas.width = dstWidth
	      canvas.height = dstHeight
	  		// 铺底色  
	      ctx.fillStyle = "#fff"
	      ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0, dstWidth, dstHeight)

	      let ndata = canvas.toDataURL('image/jpeg', 0.92)
	      let srcSize = img.src.length
	      let dstSize = ndata.length
	      if(debug) {
		      console.log(`压缩前：width=${srcWidth}, height=${srcHeight}, size=${srcSize}`)
		      console.log(`压缩后：width=${dstWidth}, height=${dstHeight}, size=${dstSize}`)
		      console.log(`压缩率：${~~(100 * (srcSize - dstSize) / srcSize)}%`)
	      }
	      canvas.width = canvas.height = 0
	      return ndata
			}
	  }
	}
</script>  
  
<style scoped lang="stylus" rel="stylesheet/stylus">
	.image-uploader
		position: relative
		width: 100%
		height: 100%
		min-width: 100%
		min-height: 200px
		border-bottom: 1px solid #ddd
		input
			position: absolute
			left: -9999px
		label
			position: absolute
			top: 0
			left: 0
			z-index: 3
			width: 100%
			height: 100%
		.preview
			position: absolute
			top: 0
			left: 0
			right: 0
			bottom: 0
			z-index: 2
			background-size: 100% 100%
			background-repeat: no-repeat
		.placeholder
			position: absolute
			top: 50%
			left: 50%
			transform: translate3d(-50%, -50%, 0)
</style>