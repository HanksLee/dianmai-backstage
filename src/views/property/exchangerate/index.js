import { commonRequest } from '@/api/api-property'
import paging from 'components/paging/index.vue'
export default {
  components: {
    paging
  },
  data(){
    return{
      loading: false,
			emptyText: '数据加载中...',
      rateList:[],
      list: [],
      page: {}, // 存放分页数据
      params: { // 搜索接口的数据
        page_no: '',
        page_size: 20
      },
    }
  },
  methods:{
    getList(){
      this.loading = true
      this.params.page_no = this.$refs.subassemblyData.page_no
      this.params.page_size = this.$refs.subassemblyData.page_size || 20 // 条数
      commonRequest('currencyrateList',this.params).then( res=>{
        this.loading = false
        if(res.code == '200'){
            this.rateList = res.data.currency || []
            this.list = res.data.history.page_data || []
            this.page = res.data.history.page || {}
            this.emptyText = '暂无数据'
        }else{
          this.emptyText = res.msg || '暂无数据'
        }
      }).catch(error => {
				this.loading = false
			})
    },
    handleClick(row){
      commonRequest('currencyrateEdit',row).then(res=>{
        if(res.code == '200'){
            this.$message(res.msg) 
            this.getList()
        }else{
            this.$message(res.msg) 
        }
      })
    }
  },
  mounted(){
    this.getList()
  }
}