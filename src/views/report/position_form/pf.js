import TreeGrid from './treeTable/vue/TreeGrid.vue'
//import filtrate from '../../user/customer/filtrate.vue'
import { commonRequest } from '@/api/api-user'
export default {
  components: {
    TreeGrid,
  },
  data () {
    return {
      loading: false,
      downloadLoading: false,
      // loadProgress: {},
      cache: {
        id: '',
        type: '',
      },
      list: [
        {}
      ],
      customerFiltrate: {
        show: false,
        belongTreeData: []
      }, // 用户筛选
      belongTreeData: {},
      belongTree: [],
      // belong_type: '',
      pickerOptions: this.timeData(),
      listParam: {
        page_no: 1,
        page_size: 50,
        total: 0,
        belong_type: 1,
        belong_value: '',
        checkTime: [new Date(new Date() - 6 * 24 * 3600 * 1000), new Date(new Date() - 1 * 24 * 3600 * 1000)],
        begin_time: '',
        end_time: '',
      },
      columns: [
        {text: '姓名', dataIndex: 'user_name'},
        {text: '手数', dataIndex: 'lots'},
        {text: '笔数', dataIndex: 'nums'},
        {text: '盈亏', dataIndex: 'profit'},
        {text: '手续费', dataIndex: 'commission'},
        {text: '利息', dataIndex: 'swap'},
      ]
    }
  },
  filters: {
    formats(val) {
      const num = Number(val).toFixed(2)
      return parseFloat(num)
    },
  },
  created () {
    this.getBelongTree()
    this.getList()
  },
  methods: {
    search () {
      this.getList()
    },
    formatCount (param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        // if (index === 1) {
        //   sums[index] = ''
        //   return
        // }
        // if (index === 2) {
        //   sums[index] = ''
        //   return
        // }
        // if (index === 14) {
        //   sums[index] = ''
        //   return
        // }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              const s = prev + curr
              return s
            } else {
              return prev
            }
          }, 0)
          sums[index] = sums[index].toFixed(2)
        } else {
          sums[index] = ' '
        }
      })

      return sums
    },
    getList () {
      this.loading = true
      this.dateFormatImpl()
      const param = {}
      param.belong_type = isNaN(this.listParam.belong_type) ? 6 : this.listParam.belong_type
      param.belong_value = isNaN(this.listParam.belong_type) ? this.listParam.belong_value : ''
      param.page_no = this.listParam.page_no
      param.page_size = this.listParam.page_size
      // param.begin_time = this.listParam.begin_time
      param.start_time = this.listParam.begin_time
      param.end_time = this.listParam.end_time
      return commonRequest('getpositionreport', param).then(res => {
        console.log(res)
        if (res.code == 200) {
          this.list = res.data.page_data.list
          this.listParam.total = parseInt(res.data.page.total)
        } else {
          this.$message(res.msg)
        }
        this.loading = false
        // return Promise.resolve()
      }).catch(error => {
        console.log(error)
        this.loading = false
        // return Promise.reject()
      })
    },
    changeHandler (val) {
      this.listParam.belong_type = val
      if (val == '6') {
        this.customerFiltrate.show = true
      } else if (!isNaN(val)) {
        this.getList()
      }
    },
    customerFiltrateSearch() {
      // this.loadProgress = this.$loading({
      //   lock: true,
      //   text: '数据加载中',
      //   spinner: 'el-icon-loading',
      //   background: 'rgba(0, 0, 0, 0.3)'
      // })
      this.listParam.belong_type = this.$refs.filtrateData.selectData.name
      this.listParam.belong_value = this.$refs.filtrateData.selectData.id
      console.log(this.listParam.belong_value)
      if (!(this.listParam.belong_value + '')) {
        this.customerFiltrate.show = false
        return false
      }
      this.listParam.page_no = 1
      this.getList()
      // this.getList().then(() => {
      //   this.loadProgress.close()
      // }).catch(() => {
      //   this.loadProgress.close()
      // })
      this.customerFiltrate.show = false
    },
    vc (visible) {
      if (visible) {
        this.cache.type = this.listParam.belong_type
        console.log(this.cache.type)
      }
    },
    openDialog () {

    },
    handleFiltrateClose() {
      if (isNaN(this.listParam.belong_type)) {
        // 这里表示选中且确定
      } else {
        // 这里表示没选中
        this.listParam.belong_type = this.cache.type
      }
    },
    getBelongTree() { // 获取客户归属下拉列表
      commonRequest('customerownership', { type: 5 }).then(res => {
        if (res.code === 200 && res.data) {
          this.belongTree = res.data.retdata
          this.belong_type = 1
          for (const item of this.belongTree) {
            if (item.belong_type == '6') { // 用户筛选
              this.customerFiltrate.belongTreeData = item.data
              break
            }
          }
        }
      })
    },
    handleSizeChange (val) {
      this.listParam.page_size = val
      this.getList()
      scrollTo(0,0)
    },
    handleCurrentChange (val) {
      this.listParam.page_no = val
      this.getList()
      scrollTo(0,0)
    },

    dateFormat(date) {
        return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
    },

    dateFormatImpl() {
      this.listParam.begin_time = this.listParam.checkTime[0] != null ? this.dateFormat(this.listParam.checkTime[0]) : null;
      this.listParam.end_time = this.listParam.checkTime[1] != null ? this.dateFormat(this.listParam.checkTime[1]) : null;
    },

    timeChange () {
      this.dateFormatImpl()
      this.getList()
    },

    handleDownload(){
      this.downloadLoading = true
      this.$confirm('确定将持仓报表导出excel表格?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
        }).then(() => {
          const nameData = ['姓名', '手数', '笔数', '盈亏', '手续费', '利息']
          const fieldData = ['user_name', 'lots', 'nums', 'swap', 'commission', 'profit']
          const listData = this.list
          this.downloadLoading = false
          //导出excel表格全局处理方法
          this.exportExcel('持仓',nameData,fieldData,listData)
        }).catch(() => {
          this.downloadLoading = false
      })
    }
  }
}
