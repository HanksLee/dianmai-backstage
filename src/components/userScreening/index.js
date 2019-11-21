import { commonRequest } from '@/api/api-customer'
export default {
  data() {
    return {
      mechanism:{
        value: '0',
        options:[]
      },
      nexus:{
        belongValue: null, 
        value: '0',
        options:[]
       },
       UserScreening:{
        dialogVisible: false
       },
      userScreeningData: [],
      state: '',
      results: [],
      selectData: {
        id: '',
        name: ''
      },
      selected: null,
      userListArr: [],
      userList: [],
      isActive: false,
      switch: false,
      zone_id: '0',
      user_id: '',
  }
},
props:{
  getList: Function,
  list: Array
},
watch: {
  'nexus.value'(){
    if(this.switch){
      this.getList()
    }
  },
  // list(){ 监听数据变化
  //   this.getBelongTree()
  // }
},
methods: {
  changeMechanism(val){
     this.mechanism.value = val
     this.nexus.value = '0'
     this.zone_id = '0'
     this.user_id = ''
     this.getList()
  }, 
//用户筛选相关
getBelongTree() { // 获取客户归属下拉列表
  commonRequest('userfilter').then(res => {
      if(res.code == '200') {
        const data = res.data
        this.mechanism.options = data.organ
        this.nexus.options = data.zone
      }
  })
},  
changeBelongData(val){
    this.zone_id = val
    this.user_id = ''
    if(Number(val) === 5){
       this.UserScreening.dialogVisible = true
       this.isActive = false
       this.selected = null
       this.switch = false
       this.clickUser()
    }else{
       this.nexus.belongValue = val //设置点击关闭弹框后组件默认值
       this.switch = true
    }
  },
close(done){
    this.userListArr = []
    this.state = ''
    this.nexus.value = this.nexus.belongValue || '0'
    done();
  },
userScreeningSearch(){
    this.UserScreening.dialogVisible = false
    this.nexus.value = this.selected || '0' 
    this.nexus.belongValue = this.selected || '0'
    this.userListArr = []
    this.state = ''
    this.switch = true
    if(this.user_id === undefined){
      this.zone_id = '0'
    }
},
//输入搜索
querySearchAsync(arg, cb){
  commonRequest('searchuser',{
         organ_id:this.mechanism.value,
         keyword: arg
      }).then(res =>{
         if(res.code == '200'){
           this.results = res.data
           for(const item of this.results) {
            item.value = item.name
          }
          if (this.results.length === 0) {
            this.$message('暂无数据')
            this.userListArr = []
            if (arg === '') {
              this.clickUser()
            }
          }
          cb(this.results)
         }
      })
},
//输入搜索后点击
handleSelect(arg){
      this.selectData.id = arg.id
      this.selectData.name = arg.name
      this.selected = arg.name
      this.user_id = arg.id
      this.userListArr = []
      this.clickUser(this.user_id, this.selected, 0)
},
//删除当前选择
handleClose(val){
      this.selected = null
      this.state = ''
},
//点击列表搜索
clickUser(user_id,label,index){
      this.selected = label
      this.isActive = user_id
      this.user_id = user_id
      if(user_id == '-1'){ //用户筛选全部
        this.userListArr = this.userListArr.slice(0,1)
          return
      }
      commonRequest('nextuser',{organ_id:this.mechanism.value,user_id: user_id}).then(res =>{
        if(res.code == '200'){
            if(index == '0' && res.data != ''){
              this.userListArr = this.userListArr.slice(0,1) 
              this.userListArr.push(res.data)
            }else if(index != '0' && res.data != ''){
              this.userListArr = this.userListArr.slice(0,index+1)
              this.userListArr.push(res.data)
            }else{
              this.userListArr = this.userListArr.slice(0,index+1)
              this.$message('没有下级数据了','info',800)
            } 
        }else{
          this.$message(res.msg)
        }
      })
    }
  },
mounted(){
    this.getBelongTree()
  }
}


