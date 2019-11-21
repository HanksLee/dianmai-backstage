import config from '@/api/config-client'
import { commonRequest } from '@/api/api-officialWebsite'
import Cookies from 'js-cookie'
import { getCookieUuid } from '@/utils/user'
import editor from 'components/editor/index.vue'
export default {
  components: {
    editor
  },
  data() {
    return {
      loading: false,
      seoForm: {
        url: '',
        head: '',
        title: '',
        keywords: '',
        description: '',
        tel: '',
        customer: '',
        work: '',
        qq: '',
        share_des: '',
        androidversion: '',
        iosversion: '',
        androiduploadurl: '',
        iosuploadurl: '',
        weibo: '',
        address: '',
        copyright: '',
        logo: '',
        logo1: '',
        bg1: '',
        bg1_url: '',
        bg2: '',
        bg2_url: '',
        bg3: '',
        bg3_url: '',
        bg4: '',
        bg4_url: '',
        pc_bg1: '',
        bg5_url: '',
        bg6_url: '',
        bg7_url: '',
        ios: '',
        android: '',
        share_img: '',
        weixin: '',
        login_bg: '',
        index_bg: ''
      },
      textFrom: {
        showToast1: '请上传网站logo，宽度为280px，高度为66px',
        showToast2: '请上传顶部标志logo，宽度为36px，高度为36px',
        showToast3: '请上传APP首页图片一，宽度为750px，高度为400px',
        showToast4: '请上传APP首页图片二，宽度为750px，高度为400px',
        showToast5: '请上传APP首页图片三，宽度为750px，高度为400px',
        showToast6: '请上传APP首页图片四，宽度为750px，高度为400px',
        showToast7: '请上传IOS二维码，宽度为210px，高度为210px',
        showToast8: '请上传Android二维码，宽度为210px，高度为210px',
        showToast9: '请上传分享图片，宽度为210px，高度为210px',
        showToast10: '请上传微信二维码，宽度为210px，高度为210px',
        showToast11: '请上传背景图，宽度为1920px，高度为1080px',
        showToast12: '请上传背景图，宽度为1920px，高度为1080px',
        showToast13: '请上传PC首页图片一，宽度为1920px，高度为540px',
        showToast14: '请上传PC首页图片二，宽度为1920px，高度为540px',
        showToast15: '请上传PC首页图片二，宽度为1920px，高度为540px',
        showToast: '图片上传中...',
        about_us: ''
      },
      contentData: {},
      action: config.api + '/v1/upload/image',
      formData: {
        uuid: getCookieUuid(),
        token: Cookies.get('token') || ''
      }
    }
  },
  methods: {
    getSeoList() {
      this.loading = true
      commonRequest('seoList').then(res => {
        this.loading = false
        if (res.code == '200') {
          this.seoForm = res.data
          this.contentData = this.seoForm
        }
      })
    },
    choiceImg(documentId) {
      document.getElementById(documentId).click()
    },
    getImg(elem, name, index) {
      let target = elem.srcElement || elem.target,
        file = target.files[0],
        file_name = file.name
      let text = 'showToast' + index
      this.textFrom[text] = this.textFrom.showToast
      if (name === 'file_name2') {
        if (!/\.(ico|ICO)$/.test(file.name)) {
          this.textFrom.showToast2 = '文件类型必须是ico格式 '
          return false
        } else {
          this.fileToDataURL(name, file, index, file_name)
        }
      } else {
        if (!/\.(jpg|jpeg|png|JPG|PNG)$/.test(file.name)) {
          this.textFrom[text] = '文件类型必须是jpeg,jpg,png中的一种格式 '
          return false
        } else if (file.size > 1 * 1024 * 1024) {
          this.textFrom[text] = '图片大小不能超过1M'
          return false
        } else {
          this.fileToDataURL(name, file, index, file_name)
        }
      }
    },
    fileToDataURL(name, file, index, file_name) {
      const reader = new window.FileReader(),
        _t = this
      reader.onload = function (e) {
        let dataUrl = e.target.result
        let pos = dataUrl.indexOf('4') + 2
        dataUrl = dataUrl.substring(pos, dataUrl.length - pos) // 去掉Base64:开头的标识字符
        _t.uploadImg(dataUrl, name, index, file_name)
      }
      reader.readAsDataURL(file)
    },
    uploadImg(dataUrl, name, index, file_name) {
      commonRequest('fileup', {
        pic: encodeURI(dataUrl),
        file_name: file_name
      }).then(res => {
        if (res.code == '200') {
          if (name === 'file_name1') {
            this.seoForm.logo = res.data.file
            this.textFrom.showToast1 = '请上传网站logo，宽度为280px，高度为66px'
          }
          if (name === 'file_name2') {
            this.seoForm.logo1 = res.data.file
            this.textFrom.showToast2 = '请上传顶部标志logo(小)，宽度为280px，高度为66px'
          }
          if (name === 'file_name3') {
            this.seoForm.bg1 = res.data.file
            this.textFrom.showToast3 = '请上传首页图片一，宽度为280px，高度为66px'
          }
          if (name === 'file_name4') {
            this.seoForm.bg2 = res.data.file
            this.textFrom.showToast4 = '请上传首页图片二，宽度为280px，高度为66px'
          }
          if (name === 'file_name5') {
            this.seoForm.bg3 = res.data.file
            this.textFrom.showToast5 = '请上传首页图片三，宽度为280px，高度为66px'
          }
          if (name === 'file_name6') {
            this.seoForm.bg4 = res.data.file
            this.textFrom.showToast6 = '请上传首页图片四，宽度为280px，高度为66px'
          }
          if (name === 'file_name7') {
            this.seoForm.ios = res.data.file
            this.textFrom.showToast7 = '请上传IOS二维码，宽度为280px，高度为66px'
          }
          if (name === 'file_name8') {
            this.seoForm.android = res.data.file
            this.textFrom.showToast8 = '请上传Android二维码，宽度为280px，高度为66px'
          }
          if (name === 'file_name9') {
            this.seoForm.share_img = res.data.file
            this.textFrom.showToast9 = '请上传分享图片，宽度为280px，高度为66px'
          }
          if (name === 'file_name10') {
            this.seoForm.weixin = res.data.file
            this.textFrom.showToast10 = '请上传微信二维码，宽度为280px，高度为66px'
          }
          if (name === 'file_name11') {
            this.seoForm.login_bg = res.data.file
            this.textFrom.showToast11 = '请上传背景图，宽度为1920px，高度为1080px'
          }
          if (name === 'file_name12') {
            this.seoForm.index_bg = res.data.file
            this.textFrom.showToast12 = '请上传背景图，宽度为1920px，高度为1080px'
          }
          if (name === 'file_name13') {
            this.seoForm.pc_bg1 = res.data.file
            this.textFrom.showToast13 = '请上传PC首页图片一，宽度为1920px，高度为540px'
          }
          if (name === 'file_name14') {
            this.seoForm.pc_bg2 = res.data.file
            this.textFrom.showToast14 = '请上传PC首页图片二，宽度为1920px，高度为540px'
          }
          if (name === 'file_name15') {
            this.seoForm.pc_bg3 = res.data.file
            this.textFrom.showToast15 = '请上传PC首页图片三，宽度为1920px，高度为540px'
          }
          this.$message(res.msg)
        } else {
          this.$message(res.msg)
        }
      })
    },
    editFn() {
      this.seoForm.about_us = this.$refs.editorData.editorContent
      commonRequest('edit', this.seoForm).then(res => {
        if (res.code == '200') {
          this.$message(res.msg)
        } else {
          this.$message(res.msg)
        }
      })
    },
    handleAvatarSuccess(res, file) {
      this.seoForm.login_bg = res.data.file
    },
    handleAvatarSuccess1(res, file) {
      this.seoForm.index_bg = res.data.file
    },
    handleAvatarSuccess2(res, file) {
      this.seoForm.index_bg = res.data.file
    }
  },
  mounted() {
    this.getSeoList()
  }
}