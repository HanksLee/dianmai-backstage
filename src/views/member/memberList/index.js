import { commonRequest } from '@/api/api-member'
import paging from 'components/paging/index.vue'
import authorize from 'components/authorize/index.vue'
export default {
	components: {
    paging,
    authorize
	},
    data() {
        return {
            loading: false,
            keyword: '',
            emptyText: '数据加载中...',
            list: [],
            page:{},
            url: '',
            memberMessageBox: false,
            title: '',
            market_div_type: [],
            memberForm:{
                short_name: '',
                contact: '',
                mobile: '',
                password: '',
                email: '',
                company: '',
                address: '',
                market_div_type: '',
                div_commission: '',
                div_delayfee: '',
                div_profit: '',
                div_servicefee: '',
                id: ''
            },
            creating: false,
            deleting: false,
            authorize: {
                show: false,
                row: {},
                list: []
            },
            form4: {
                id_file_name1: '',
                img_name1:'',
                showToast1: true,
                toastTaxt1: '请上传营业执照',
                is_agent: 0 // 是否注册成代理
            },
            options: [],
            authorize:{
              show: false,
              role_name: '',
              row: {},
              list: [],
              id: '',
            },  
            passwordTf: true,
            div_commissionTf: false,
            div_delayfeeTf: false,
            div_servicefeeTf: false,
            div_profitTf: false,
        }
    },
    methods: {
        //机构新增
        add(){
          this.memberMessageBox = true
          this.title = '新增机构'
          this.url = 'organAdd'
          for(let i in this.memberForm){
            this.memberForm[i] = ''
          }
          this.market_div_type = []
          this.passwordTf = true
        },
        //提交
        memberSubmit(){
          this.memberForm.market_div_type = this.market_div_type.join(',')
          commonRequest(this.url,this.memberForm).then(res =>{
            if(res.code == '200'){
              this.$message(res.msg)
              this.memberMessageBox = false
              this.getList()
            }else{
              this.$message(res.msg)
            }
          })
        },
        //编辑
        edit(row){
            this.memberMessageBox = true
            this.title = '编辑机构'
            this.url = 'organEdit'
            console.log(row)
            for(let i in this.memberForm){
                 for(let k in row){
                   if(i === k){
                    this.memberForm[i] = row[k]
                   } 
                }
            } 
            this.market_div_type = row.market_div_type == ''? [] : row.market_div_type.split(',')
            this.passwordTf = false
        },
        //获取推广分成
        getmarketspread(){
          commonRequest('marketspread').then(res=>{
            if(res.code == '200'){
                 this.options = res.data
                 for(let i = 0;i<this.options.length;i++){
                    if(this.options[i].key == '0'){
                        this.div_commissionTf = true
                    }
                    if(this.options[i].key == '1'){
                        this.div_delayfeeTf = true
                    }
                    if(this.options[i].key == '2'){
                      this.div_servicefeeTf = true
                    }
                  if(this.options[i].key == '3'){
                    this.div_profitTf = true
                    }
                 }
            }
          })
        },
        //获取列表
        getList(){
          this.loading = true
          commonRequest('organList',{
            page_no: this.$refs.subassemblyData.page_no,
				    page_size: this.$refs.subassemblyData.page_size,
            keyword: this.keyword
          }).then(res =>{
            this.loading = false
              if(res.code == '200'){
                 this.list = res.data.page_data || []
                 this.page = res.data.page || {}
                  this.emptyText = '暂无数据'
                  this.formattedData()
                }else{
                  this.emptyText = '暂无数据'
                }
                }).catch(error =>{
                this.loading = false
                })
        },
   // 格式化数据
formattedData(){
	for(let i = 0;i<this.list.length;i++){
		this.list[i].div_commission = Number(this.list[i].div_commission) 
        this.list[i].div_delayfee = Number(this.list[i].div_delayfee) 
        this.list[i].div_servicefee = Number(this.list[i].div_servicefee) 
        this.list[i].div_profit = Number(this.list[i].div_profit) 
	}
},     
    //搜索
    searchList(){
      this.getList()
    }
  },
    mounted(){
      this.getList()
      this.getmarketspread()
    }
}