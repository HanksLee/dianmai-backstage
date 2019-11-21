<template>
	<div v-loading="loading" element-loading-text="图片上传中..." element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.9)">
		<div id="editorTop" class="toolbar" style="border:1px solid #ccc;border-bottom:none;"></div>
		<div id="editorElem" style="text-align:left;height:500px;border:1px solid #ccc;"></div>
	</div>
</template>
<script>
import UE from 'wangeditor'
import Cookies from 'js-cookie'
import config from '@/api/config-client'
import { getCookieUuid } from '@/utils/user'
	export default {
		name: 'editor',
		data() {
			return {
				editor: null,
				editorContent: '',
				loading:false,
			}
		},
		props:{
		  contentData: Object,
		},
		watch: {
			'contentData'(){
				this.getContent()
			}
		},
		methods: {
             getContent(){
				let _t = this
				this.editor = new UE('#editorTop','#editorElem')
			// '//api.' + domain.substring(domain.indexOf('.') + 1, domain.length) + '/v1/upload/image',
			this.editor.customConfig.uploadImgServer = config.api + '/v1/upload/image'
			this.editor.customConfig.uploadImgParams = {
				   token: Cookies.get('token') || '',
				   uuid:getCookieUuid()
			   }
			this.editor.customConfig.uploadFileName = 'file'
			this.editor.customConfig.uploadImgMaxSize = 2 * 1024 * 1024
			this.editor.customConfig.uploadImgHooks = {
			before: function (xhr, editor, files) {
                    _t.loading = true
			},
		    success: function (xhr, editor, result) {
				_t.loading = false
			}, 
			error: function (xhr, editor) {
                 _t.loading = false
            },
			timeout: function (xhr, editor) {
			    _t.loading = false
			},
		    customInsert: function (insertImg, result, editor) {
		        let url = result.data.file
                    insertImg(url)
		    }
		}
		this.editor.customConfig.onchange = function (html) {
		   _t.editorContent = html
		}		
		this.editor.create()
		if(this.contentData.content){
           this.editor.txt.html(this.contentData.content)
		}else{
           this.editor.txt.html(this.contentData.about_us)
		}
		this.editorContent = this.editor.txt.html()
		//this.editor.$textElem.attr('contenteditable', false)
			 }
		},
		mounted(){
          this.getContent()
		}
	}
</script>
