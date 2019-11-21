import { commonRequest } from "@/api/api-officialWebsite"
import paging from 'components/paging/index.vue'
import editor from 'components/editor/index.vue'
export default {
  components: {
    paging,
    editor
	},
    data() {
        return {
          loading: false,
          emptyText: '数据加载中...',
          activeName: 'contentClassify',
          title: '',
          title1: '',
          list:[],
          page: {},//存放分页数据
          list1:[],
          classifyForm:{
            row: {},
            dialogVisible:false,
            classifyName: '',
            classifyDescribe: '',
          },
          keyword: '',
          contentListForm: {
            dialogVisible:false,
            serialNumber: '',
            contentTitle: '',
            checked: false,
          },
          contentTypeUrl: '',
          content_name: '',
          content_key: '',
          value: '',
          options:[],
          contentRow: '',
          contentUrl: '',
          content: '',
          contentData: {},
          radio: '0',
          radio1:'0'

        }
    },
    methods: {
        handleClick(val) {
          if(val === 'contentList'){
              this.getList()
          }
        },
     //新增内容分类
     addContentType(){
       this.title = '新增分类'
       this.classifyForm.dialogVisible = true
       this.contentTypeUrl = 'addContenttype'
       this.classifyForm.row = {}
       this.radio = '0'
       for(let i in this.classifyForm){
        this.classifyForm[i] = ''
       }
     },
     //内容分类列表
     getcontenttypeList(){
      this.loading = true
      commonRequest('contenttypeList').then(res =>{
        this.loading = false
        if(res.code == '200'){
              this.list = res.data.page_data
        }
      }).catch(error =>{
				this.loading = false
			  })
     },
      //内容分类编辑
      editClassify(row){
          this.title = '编辑分类'
          this.contentTypeUrl = 'contenttypeEdit'
          this.classifyForm.dialogVisible = true
          this.classifyForm.row = row
          this.classifyForm.classifyName = row.content_name
          this.classifyForm.classifyDescribe = row.content_desc
          this.radio = ""+row.system_flag
      },
      //内容分类编辑提交
      addSubmit(){
        commonRequest(this.contentTypeUrl,{
          id: this.classifyForm.row.id,
          broker_id: this.classifyForm.row.broker_id,
          content_name: this.classifyForm.classifyName,
          content_desc: this.classifyForm.classifyDescribe,
          system_flag:this.radio
        }).then( res=>{
          if(res.code == '200'){
             this.$message(res.msg)
             this.classifyForm.dialogVisible = false
             this.getcontenttypeList()
          }else{
            this.$message(res.msg)
          }
        })
      },
      //内容分类列表删除
      delContenttypeFn(row){
        this.$confirm('确定将"' + row.content_name + '"这条分类删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          beforeClose: (action, instance, done) => {
              if (action === 'confirm') {
              commonRequest('delContenttype',{
                id:row.id
              }).then(res =>{
                if(res.code == '200'){
                  this.$message(res.msg)
                  this.getcontenttypeList()
                  done()
                }else{
                  this.$message(res.msg)
                }
              })
              } else {
                  done()
              }
          }
      })
      },
      //获取内容列表
      getList(){
        this.loading = true
        commonRequest('contentList',{
          page_no: this.$refs.subassemblyData.page_no,
			    page_size: this.$refs.subassemblyData.page_size,
          keyword: this.keyword
        }).then(res =>{
          this.loading = false
          if(res.code == '200'){
              this.list1 =res.data.page_data
              this.page = res.data.page || {}
              this.emptyText = '暂无数据'
				}else{
					this.emptyText = '暂无数据'
				}
			  }).catch(error =>{
				this.loading = false
			  })
      },
      //获取分类类型
      gettypelist(){
        commonRequest('typelist').then(res =>{
          if(res.code == '200'){
              this.options = res.data
          }
        })
      },
      //内容列表添加
      addContent(){
        this.contentUrl = 'addContent'
        this.title1 = '新增内容'
        this.contentRow = {}
        for(let i in this.contentListForm){
          this.contentListForm[i] = ''
        }
        this.value = ''
        this.contentListForm.checked = false
        this.contentListForm.dialogVisible = true
        this.$refs.editorData.editor.txt.html('')
            },
      //内容列表编辑
      editContent(row){
        this.contentUrl = 'editContent'
        this.title1 = '编辑内容'
        this.contentRow = row
        this.contentListForm.dialogVisible = true
        this.contentListForm.contentTitle = row.title
        this.value = row.content_type
        this.contentListForm.checked = Number(row.show_flag) === 1 ? true : false
        this.contentData = row
      },
      //内容列表添加编辑提交
      submitContent(){
        const checkedId = this.contentListForm.checked === true ? 1 : 0
        commonRequest(this.contentUrl,{
          id: this.contentRow.id ,
          title: this.contentListForm.contentTitle,
          show_flag: checkedId,
          content_type: this.value,
          content_key: this.content_key,
          content_name: this.contentRow.content_name || this.content_name,
          content: this.$refs.editorData.editorContent,
        }).then(res=>{
          if(res.code == '200'){
              this.getList()
              this.$message(res.msg)
              this.contentListForm.dialogVisible = false
          }else{
              this.$message(res.msg)
          }
        })
      },
      //内容列表新增应后台参数要求，根据选中得val反查
      changeValue(val){
          for(let i=0;i<this.options.length;i++){
              if(val === this.options[i].content_type){
                this.content_key = this.options[i].content_key
                this.content_name = this.options[i].content_name
              } 
          } 
      },
      //内容列表删除
      del(row){
        this.$confirm('确定将"' + row.title + '"这条内容删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          beforeClose: (action, instance, done) => {
              if (action === 'confirm') {
              commonRequest('delContent',{
                broker_id:row.broker_id,
                id:row.id
              }).then(res =>{
                if(res.code == '200'){
                  this.$message(res.msg)
                  this.getList()
                  done()
                }else{
                  this.$message(res.msg)
                }
              })
              } else {
                  done()
              }
          }
      })
      },
      //内容列表搜索
      search(){
        this.getList()
      },
      //复制链接地址
      copyUrl(val) {
				var textArea = document.createElement('textarea')
				textArea.style.position = 'fixed'
				textArea.style.left = '-10000px'
				textArea.style.top = '-10000px'
				document.body.appendChild(textArea)
				textArea.value = 'news_'+val.id
				this.$message('已复制到剪贴板')
				textArea.select()
				document.execCommand('copy')
				document.body.removeChild(textArea)
			},
    },
    mounted(){
      this.getcontenttypeList()
      this.gettypelist()   
  }
}