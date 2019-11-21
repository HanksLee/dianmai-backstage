import { commonRequest } from '@/api/api-user'
import authorize from 'components/authorize/index.vue'
export default {
  components: {
		authorize
	},
  data() {
    return {
      list: [],
      loading: false,
      emptyText: '正在加载...',
      title: '',
      createDialogShow: false,
      type: '',
      url: '',
      newRole: {
        name: '',
        id: ''
      },
      creating: false,
      deleting: false,
      authorize: {
        loading: false,
        show: false,
        role_name: '',
        row: {},
        list: [],
        id: '',
      },
    }
  },
  methods: {
    //新增角色
    add(){
      this.createDialogShow = true
      this.newRole.name = ''
      this.url = 'addRole'
      this.title = '新增角色'
    },
    //编辑角色
    edit(row){
      this.createDialogShow = true
      this.newRole.name = row.role_name   
      this.newRole.id = row.id
      this.url = 'editRole'
      this.title = '编辑角色'
    },
    //新增编辑提交
    createRole(){
      commonRequest(this.url,{
        role_name: this.newRole.name,
        id: this.newRole.id 
      }).then(res=>{
        if(res.code == '200'){
          this.$message(res.msg)
          this.getList()
          this.createDialogShow = false
        }else{
          this.$message(res.msg)
        }
      })  
    },
    //获取列表
    getList() {
      this.loading = true
      commonRequest('roleList').then(res => {
        this.loading = false
        if (res.code === 200) {
          if (res.data) {
             this.list = res.data.page_data  
            if (this.list.length === 0) {
              this.emptyText = '暂无数据'
            }
          } else {
            this.emptyText = '暂无数据'
          }
        } else {
          res.msg = res.msg || '加载失败，请重试'
          this.$message(res.msg)
        }
      }, res => {
        this.$message('加载失败，请重试')
        this.loading = false
      })
    },
    // //授权
    // roleAuthorize(row) {
    //   this.authorize.role_name = row.role_name
    //   this.authorize.show = true
    //   this.authorize.id = row.id
    //   this.getRoleInfo(row)
    // },
    
  
 
  },
  mounted() {
    this.getList()
  }
}
