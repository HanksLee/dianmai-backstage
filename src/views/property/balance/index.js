import { commonRequest } from '@/api/api-property'
import { formatDate } from '@/utils/data.js'
import paging from 'components/paging/index.vue'

export default {
  components: {
    paging,
  },
  data() {
    return {
      s_time: [new Date(new Date() - 7 * 24 * 3600 * 1000), new Date()],
      pickerOptions1: this.timeData(),

      loading: false,
      emptyText: '数据加载中...',

      list: [],
      page: {}, // 存放分页数据
      detailInfo: {}, // 详细信息数据\

      account_select: "",

      params: { // 搜索接口的数据
        start_time: '',
        end_time: '',
        direct_type: '',
        user_name: '',
        page_no: '',
        page_size:'',
        excel:null
      },

      options: [{
        value: '',
        label: '全部'
      }, {
        value: '0',
        label: '入金'
      }, {
        value: '1',
        label: '出金'
      }],

      options_add: [{
        value: '0',
        label: '入金'
      }, {
        value: '1',
        label: '出金'
      }],

      options_repay_type: [ //冲账类型4-赠金奖励,5-信用利息,6-交易返现,7-积分兑换,8-出金手续费,9-账户闲置费,10-其它
        {
          value: 0,
          label: "客户入金 "
        },
        {
          value: 1,
          label: "客户出金 "
        },
        {
          value: 3,
          label: "虚拟入金 "
        },
        {
          value: 4,
          label: "平台赠送 "
        },
        //				{
        //					value: 2,
        //					label: "内部转账 "
        //				},
        //				{
        //					value: 3,
        //					label: "代理返佣 "
        //				},
        //				{
        //					value: 4,
        //					label: "赠金奖励",
        //				},
        //				{
        //					value: 5,
        //					label: "信用利息",
        //				},
        //				{
        //					value: 6,
        //					label: "交易返现",
        //				},
        //				{
        //					value: 7,
        //					label: "积分兑换",
        //				},
        //				{
        //					value: 8,
        //					label: "出金手续费",
        //				},
        //				{
        //					value: 9,
        //					label: "账户闲置费",
        //				},
        {
          value: 10,
          label: "其它",
        }
      ],

      // 搜索出来的 用户信息
      userDetail: {
        real_name: '',
        id: '',
        short_name: '',
        demo_flag: '',
        currency: '',
        unit: '',
      },

      // 新增冲账的参数
      addBalanceParams: {
        id: '', // 记录id， 账户
        broker_id: '',
        organ_id: '',
        customer_id: '',
        currency_type: '',
        currency_symbol: '',
        direct_type: '',
        repay_type: '',
        balance: '',
        create_time: '',
        comment: '',
        status: '',

      },

      downloadLoading: false,
      loadingA: false,
      dialogShow: false,
      dialogShowDetail: false, // 详细信息弹窗
    }

  },
  computed: { // 做详细信息时候的偷懒
    is_notify: {
      get() {
        return this.addBalanceParams.is_notify == "1";
      },
      set(newvalue) {
        newvalue ? this.addBalanceParams.is_notify = "1" : this.addBalanceParams.is_notify = "0";
      }
    },

  },
  methods: {
    //  简单格式化
    dateFormat(date) {
      return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
    },

    //计算合计
    getSummaries(param) {
      const {
        columns,
        data
      } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          if (index === 4) {
            sums[index] = Math.round(Number(sums[index]) * 100) / 100
          } else {
            sums[index] = '--'
          }
        } else {
          sums[index] = '--'
        }
      })
      return sums
    },

    querySearch(arg, cb) { // 自动检索
    	console.log(arg)
      commonRequest("getCusomersInfo", {
        keyword: arg
      }).then(res => {
        if (res.code == '200') {
          let results = res.data;
          cb(results);
        } else {
          this.$message(res.msg)
        }
      });
    },

    handleSelect(arg) {
      this.userDetail = arg;
      this.userDetail.customer_id = arg.id;
      this.addBalanceParams.customer_id = arg.id;
    },

    search() { // 搜索栏
      this.params.page_no = 1;
      this.params.start_time = this.s_time[0] ? this.dateFormat(this.s_time[0]) : "";
      this.params.end_time = this.s_time[1] ? this.dateFormat(this.s_time[1]) : "";
      this.getList();
    },

    // 新增加冲账
    createBalance() {
      this.dialogShow = true
      this.loadingA = false
      this.originData()
    },

    // 初始化数据
    originData() {
      this.id = ""
      const userDetail = {},
        addBalanceParams = {
          broker_id: '', // string 用户所属经纪商id
          organ_id: '', // string 用户所属机构id
          customer_id: '', // string 用户id
          currency_type: '0', // 货币类型
          currency_symbol: 'RMB', // 货币名称
          direct_type: '', // 出入金类型0入金1出金
          repay_type: '', // 冲账类型
          balance: '',
          create_time: '', // 创建时间
          comment: '', // 评论
          status: '0',

        };
      this.userDetail = {};
      this.addBalanceParams = addBalanceParams;
    },

    changeDirectType() {
      if (this.addBalanceParams.direct_type == '1') {}
      if (this.addBalanceParams.direct_type == '0') {}
    },

    // addBalance
    submit() {
      this.loadingA = true
      commonRequest("addBalance", this.addBalanceParams).then(res => {
        if (res.code == '200') {
          this.loadingA = false
          this.dialogShow = false
          this.$message(res.msg)
          this.getList()
        } else {
          this.loadingA = false
          this.$message(res.msg)
        }
      })
    },

    // 展示详细信息
    showDetail(row) {
      this.dialogShowDetail = true;
      this.getDetailInfo(row);
    },

    getDetailInfo(row) {
      commonRequest('getBalanceDetail', {
        id: row.id
      }).then(res => {
        if (res.code == '200') {
          this.detailInfo = res.data
        } else {
          this.$message(res.msg)
        }
      })
    },

    getList() {
      this.params.excel = null
      this.loading = true
      this.params.page_no = this.$refs.subassemblyData.page_no
      this.params.page_size = this.$refs.subassemblyData.page_size
      if (this.s_time != "" && this.s_time[0] != null) {
        this.params.start_time = formatDate(this.s_time[0], 'yyyy-MM-dd');
        this.params.end_time = formatDate(this.s_time[1], 'yyyy-MM-dd');
      }
      commonRequest('getBalanceList', this.params).then(res => {
        this.loading = false
        if (res.code == '200') {
          this.list = res.data.page_data || []
          this.page = res.data.page || {}
          this.emptyText = '暂无数据'
        } else {
          this.$msg(res.msg)
          this.emptyText = '暂无数据'
        }
      }).catch(error => {
        this.loading = false
      })
    },
    formattedData() {
      for (let i = 0; i < this.list.length; i++) {
        this.list[i].balance = Math.round(Number(this.list[i].balance) * 100) / 100
      }
    },
    //导出excel表格
   //导出excel表格
		handleDownload() {
			this.downloadLoading = true
			this.params.excel = 1
			if (this.s_time != "" && this.s_time[0] != null) { // 默认选择时间范围
				this.params.start_time = formatDate(this.s_time[0], 'yyyy-MM-dd');
				this.params.end_time = formatDate(this.s_time[1], 'yyyy-MM-dd');
			}
			commonRequest("getBalanceList", this.params).then(res => {
				this.downloadLoading = false
				if (res.code == 200) {
					let link = document.createElement('a')
					link.style.display = 'none'
					link.href = res.data.page_data.file
					//link.setAttribute('download', '持仓明细.csv')
					document.body.appendChild(link)
					link.click()
				} else {
					this.$message(res.msg)
				}
			}).catch(error => {
				this.downloadLoading = false
			})

		},
  },

  mounted() {
    this.getList();
  }

}