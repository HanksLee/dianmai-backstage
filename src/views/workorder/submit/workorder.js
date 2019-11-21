import Cookies from 'js-cookie'
import axios from 'axios'
export default {
  data() {
    var validateMobile = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'))
      } else if (!/^1[3-9]{1}[0-9]{9}$/.test(value)) {
        return callback(new Error('手机号不正确..'))
      } else {
        callback()
      }
    }
    return {
      timer: '',
      apiurl: '',
      bigImg: '',
      aWorkOrkOrder: { }, // 工单信息
      knowledgeBase: { }, // 知识库信息
      replyType: '', // 发送聊天内容
      fileLis: [], // 聊天文件
      listId: '', // 聊天记录id
      pn1: 1,
      pn2: 1,
      total1: 1,
      total2: 1,
      pageNo1: '1', // 工单分页
      pageNo2: '1', // 知识库分页
      knowledgeTitle: '', // 知识库搜索标题
      zsknowList: [], // 知识库列表
      activeTable: '1', // 切换知识库
      submitActiveName: '1',
      workOrderTitle: '', //
      fileListReply: [], // 聊天时的文件内容
      fileData: [],
      activTab: '1',
      chatContent: '', // 回复信息
      chatContentList: [],
      chatContentLists: [],
      token: Cookies.get('token'),
      fileList2: [],
      fileList: [], // 新增时的文件内容
      isSubmitWorkOrder: true,
      uid: '',
      wid: '',
      showDialog: false,
      knowList: [],
      value: '',
      uploadProgress: {},
      imgs: [],
      pics: [],
      files: [

      ],
      uploader: {},
      ret: '',
      fileBase64: '',
      problemList: [],
      rules: {
        priority: [
          { required: true, message: '请选择优先级' }
        ],
        contactName: [
          { required: true, message: '姓名不能为空' }
        ],
        contactWay: [
          { validator: validateMobile, required: true }
        ],
        content: [
          { required: true, message: '详情不能为空' }
        ],
        // source_platform: [
        //   { required: true, message: '请输入来源平台', trigger: 'blur' },
        // ],
        title: [
          { required: true, message: '主题不能为空' }
        ],
        Introduction: [
          { required: true, message: '简介不能为空' }
        ]
      },
      form: {
        name: '',
        level: '',
        description: '',
        details: '',
        source_platform: '',
        creator_name: '',
        creator_contact: '',
        endcustomer_service_number: '',
        remark: '',
        images_urls: '',
        file_urls: ''
        // problem_type: '',
        // content: '',
        // picture: '',
        // file: '',
      },
      api_root: '//api.',
      uploadData: {
        name: '',
        filetype: '',
        file_ext: '',
        base64_data: ''
      }
    }
  },
  created() {
    this.timer = setInterval(this.workOrderDetail, 3000)
    var link = location.hostname
    if (link === 'localhost') {
      this.apiurl = 'http://api.dpay361.com'
    } else {
      //var index = link.indexOf('.')
      this.apiurl = 'http://api.dpay365.com'
    }
  },

  mounted() {
    this.workOrderList()
    this.knowledgeList()
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    // 处理时间
    processing(news, olds) {
      var date2
      var date1 = new Date(news) // 开始时间
      if (olds == null) {
        date2 = new Date()
      } else {
        date2 = new Date(olds) // 结束时间
      }
      var date3 = date2.getTime() - date1.getTime() // 时间差的毫秒数
      var days = Math.floor(date3 / (24 * 3600 * 1000))
      var leave1 = date3 % (24 * 3600 * 1000)
      var hours = Math.floor(leave1 / (3600 * 1000))
      var leave2 = leave1 % (3600 * 1000)
      var minutes = Math.floor(leave2 / (60 * 1000))
      var leave3 = leave2 % (60 * 1000)
      var seconds = Math.round(leave3 / 1000)
      if (days < 0) {
        return ('0天0小时0分钟0秒')
      }
      return (days + '天 ' + hours + '小时' + minutes + '分钟' + seconds + '秒')
    },
    // 聊天大图
    bigShow(url) {
      this.bigImg = url
      this.showDialog = true
    },
    // 工单列表选中某一行
    workOrderrow(row, event, column) {
      this.listId = row.id
      this.aWorkOrkOrder = row
      this.isSubmitWorkOrder = false
      this.workOrderDetail()
      this.chatFileList()
      this.activTab = '1'
    },
    // 点击工单
    clickGd() {
      this.activeTable = '1'
      this.workOrderList()
    },
    // 点击知识库
    clickZsk() {
      this.isSubmitWorkOrder = true
      this.activeTable = '2'
      this.knowledgeList()
      this.knowledgeXq()
    },
    // 知识库选中某一行
    knowledgerow(row, event, column) {
      this.knowledgeBase = row
    },
    handleCurrentChange1(pn) {
      this.pn1 = pn
      this.workOrderList()
    },
    handleCurrentChange2(pn) {
      this.pn2 = pn
      this.knowledgeList()
    },
    // 清空搜索
    resetTitle(text) {
      if (text == 'gd') {
        this.workOrderTitle = ''
        this.workOrderList()
      } else {
        this.knowledgeTitle = ''
        this.knowledgeList()
      }
    },
    addFile(file, fileList) {
      this.fileList = fileList
    },
    addFile2(file, fileList) {
      this.fileListReply = fileList
    },
    beforeRemove(file, fileList) {
      console.log(1)
    },
    // 工单列表
    workOrderList() {
      var workOrderFiledata = new FormData()
      workOrderFiledata.append('token', this.token)
      workOrderFiledata.append('platform', '2')
      workOrderFiledata.append('history', '1')
      // workOrderFiledata.append('data[assignTo]', 'true')
      workOrderFiledata.append('data[title]', this.workOrderTitle)
      workOrderFiledata.append('pageNo', this.pn1)
      workOrderFiledata.append('pageSize', '10')
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      axios.post(this.apiurl + '/common/work-order/list', workOrderFiledata, config).then(res => {
        for (var i = 0; i < res.data.data.data.length; i++) {
          res.data.data.data[i].processingTime = this.processing(res.data.data.data[i].createTime, res.data.data.data[i].endTime)
        }
        this.knowList = res.data.data.data
        this.total1 = parseInt(res.data.data.pager.total)
        this.aWorkOrkOrder = this.knowList[0]
      }).catch(res => {
        console.log('失败')
      })
    },
    // 工单列表详情
    workOrderDetail() {
      if (this.isSubmitWorkOrder == false) {
        var knowledgeFiledata = new FormData()
        knowledgeFiledata.append('token', this.token)
        knowledgeFiledata.append('platform', '2')
        knowledgeFiledata.append('data[id]', this.listId)
        const config = {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
        axios.post(this.apiurl + '/common/work-order/detail', knowledgeFiledata, config).then(res => {
          if (res.data.code == '200') {
            this.chatContentList = res.data.data
            this.chatContentLists = res.data.data.content
          }
        }).catch(res => {
          console.log('失败')
        })
      }
    },
    // 知识库列表
    knowledgeList() {
      var knowledgeFiledata = new FormData()
      knowledgeFiledata.append('token', this.token)
      knowledgeFiledata.append('platform', '2')
      knowledgeFiledata.append('title', this.knowledgeTitle)
      knowledgeFiledata.append('pageNo', this.pageNo2)
      knowledgeFiledata.append('pageSize', '10')
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      axios.post(this.apiurl + '/common/work-repository/list', knowledgeFiledata, config).then(res => {
        this.zsknowList = res.data.data.data
      }).catch(res => {
        console.log('失败')
      })
    },
    // 知识库详情
    knowledgeXq() {
      var knowledgeFiledata = new FormData()
      knowledgeFiledata.append('token', this.token)
      knowledgeFiledata.append('platform', '2')
      knowledgeFiledata.append('id', this.zsknowList[0].id)
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      axios.post(this.apiurl + '/common/work-repository/detail', knowledgeFiledata, config).then(res => {
        this.knowledgeBase = res.data.data
      }).catch(res => {
        console.log('失败')
      })
    },
    // 聊天回复
    chatFileReply() {
      var knowledgeFiledata = new FormData()
      knowledgeFiledata.append('token', this.token)
      knowledgeFiledata.append('platform', '2')
      knowledgeFiledata.append('data[workId]', this.listId)
      knowledgeFiledata.append('data[content]', this.chatContent)
      knowledgeFiledata.append('data[replyType]', '1')
      knowledgeFiledata.append('data[replyName]', this.aWorkOrkOrder.contactName)
      for (var i = 0; i < this.fileListReply.length; i++) {
        knowledgeFiledata.append('file[' + i + ']', this.fileListReply[i].raw, this.fileListReply[i].raw.name)
      }
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      axios.post(this.apiurl + '/common/work-reply/add', knowledgeFiledata, config).then(res => {
        if (res.data.code == '200') {
          this.chatContent = ''
          this.fileListReply = []
          this.workOrderDetail()
          this.chatFileList()
        }
      }).catch(res => {
        console.log('失败')
      })
    },
    // 聊天文件列表
    chatFileList() {
      var knowledgeFiledata = new FormData()
      knowledgeFiledata.append('token', this.token)
      knowledgeFiledata.append('platform', '2')
      knowledgeFiledata.append('workId', this.listId)
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      axios.post(this.apiurl + '/common/work-attach/list', knowledgeFiledata, config).then(res => {
        if (res.data.code == '200') {
          this.fileLis = res.data.data.data
        }
      }).catch(res => {
        console.log('失败')
      })
    },
    addgongdan() {
      this.form = {}
      this.isSubmitWorkOrder = true
    },
    // 新增工单
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          var addFiledata = new FormData()
          addFiledata.append('token', this.token)
          addFiledata.append('platform', '2')
          addFiledata.append('data[priority]', this.form.priority)
          addFiledata.append('data[contactName]', this.form.contactName)
          addFiledata.append('data[contactWay]', this.form.contactWay)
          addFiledata.append('data[content]', this.form.content)
          addFiledata.append('data[title]', this.form.title)
          addFiledata.append('data[Introduction]', this.form.Introduction)
          for (var i = 0; i < this.fileList.length; i++) {
            addFiledata.append('file[' + i + ']', this.fileList[i].raw, this.fileList[i].raw.name)
          }
          // for (var i = 0; i < this.fileData.length; i++) {
          //   addFiledata.append('data[attachList][' + i + ']', this.fileData[i])
          // }
          const config = {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
          axios.post(this.apiurl + '/common/work-order/add', addFiledata, config).then(res => {
            if (res.data.code == 200) {
              this.$message('提交成功!')
              this.listId = res.data.data.workId
              this.chatFileList()
              this.workOrderList()
              this.workOrderDetail()
              this.isSubmitWorkOrder = false
            }
          }).catch(res => {
            console.log('失败')
          })
        } else {
          return false
        }
      })
    },
    // 上传多文件
    edits() {
      console.log(this.fileList)
      var filedata = new FormData()
      for (var i = 0; i < this.fileList.length; i++) {
        filedata.append('file[' + i + ']', this.fileList[i].raw, this.fileList[i].raw.name)
      }
      filedata.append('token', this.token)
      filedata.append('platform', '2')
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      axios.post(this.apiurl + '/common/work-attach/upload-file', filedata, config).then(res => {
        this.fileData.push(res.data.data)
        this.fileList = []
        // this.$message({
        //   type: 'success',
        //   message: '上传成功!'
        // })
        this.$message('上传成功!')
      }).catch(res => {
        console.log('失败')
      })
    },
    // 上传文件
    edit(f) {
      console.log(this.fileList)
      var filedata = new FormData()
      this.fileList.forEach(file => {
        console.log(file)
        filedata.append('reportFile', file.raw, file.raw.name)
      })
      filedata.append('file', f.file)
      filedata.append('token', this.token)
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      axios.post(this.apiurl + '/common/work-attach/upload-file', filedata, config).then(res => {
        this.fileData.push(res.data.data)
        this.fileList = []
        this.$message('上传成功!')
      }).catch(res => {
        console.log('失败')
      })
    },
    submitUpload() {
      this.$refs.upload.submit()
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    // ss
    test2() {
      const arr = [{ title: '标题1', content: '处理状态', creattime: '2018-09-10 11:20:24' }, { title: '反馈问题', content: '描述.....' }, { title: '测试问题', content: '描述.....' }]
      for (let i = 0; i < 20; i++) {
        arr.push({ title: `标题${i}`, content: `处理状态${i}` })
      }
      this.knowList = arr
    },

    closeWindow() {
      window.close()
    },
    removeFile(file, fileList) {
      // 删除files中相应元素
      for (let i = 0; i < this.files.length; i++) {
        if (this.files[i].uid == file.uid) {
          this.files.splice(i, 1)
          break
        }
      }
    }
  }
}
