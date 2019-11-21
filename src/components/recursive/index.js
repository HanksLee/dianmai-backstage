import { commonRequest } from "@/api/api-user"
import recursiveHtml from './index.vue'
export default {
  name:'recursiveHtml',
  data() {
    return {
      emptyText: '数据加载中...',
      list: [],
  }
},
props:{
  row:Object,
},
methods: {
  getTreeList(row){
      commonRequest('next',{
          customer_id: this.row.customer_id
      }).then(res=>{
          if(res.code == '200'){
            if(res.data.length > 0){
              this.list = res.data
            }else{
              this.emptyText = '没有下级数据了'
            }
        }else{
          this.emptyText = res.msg
        }
      })
  }
},
created(){
  this.getTreeList()
 }
}



