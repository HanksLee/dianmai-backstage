import { commonRequest } from '@/api/api-user'
export default {
	data() {
		return {
			loading: false,
			pickerOptions1: this.timeData(),
			belongTree: [],
			belong_type: '',
			belong_value: '',
			belong_store: {},
			time: '',
			positionList: [],
			customerFiltrate: {
				show: false
			}, // 用户筛选
			belongTreeData: {},
			page: [],
			pageNo: 1,
			pageSize: 50,
			total: 1,
			belong_to_id: '',
			checkTime: [new Date(new Date() - 6 * 24 * 3600 * 1000), new Date(new Date() - 1 * 24 * 3600 * 1000)],
			start_time: '',
			end_time: '',
			DefaultTm: '',
			clearable: true,
			downloadLoading: false
		}
	},
	components: {
	},
	filters: {
		fl_tree(val) {
			if(val) {
				var split_array = val.split('/')
				return split_array[split_array.length - 1]
			} else {
				return ''
			}
		},
		format(val) {
			if(val == 0) {
				const num = 0
				return num
			} else {
				const num = parseFloat(Number(val).toFixed(2))
				return num
			}
		},
		formats(val, value) {
			const num = parseFloat(val * parseFloat(value.points)).toFixed(2)
			return parseFloat(num)
		}
	},
	methods: {
		//添加收益自定义字段
		formatter(row, column){
	      if(column.label == '收益'){
	          column.property = 'earnings'
	          const profit = parseFloat(row.profit * parseFloat(row.points)).toFixed(2)
	          const payback = parseFloat(row.payback * parseFloat(row.points)).toFixed(2)
	          const swap = parseFloat(row.swap * parseFloat(row.points)).toFixed(2)
	          const commission = parseFloat(row.commission * parseFloat(row.points)).toFixed(2)
	          row.earnings = Number(parseFloat(parseFloat(profit) + parseFloat(payback) + parseFloat(swap) - parseFloat(commission)).toFixed(2))
	          if(row.earnings == 0){
	              row.earnings = 0  
	          }
	          return row.earnings
	      }      
	      if(column.label == '胜率'){
	      	column.property = 'ratewin'
	      	if(row.trading_count == '0'){
                 row.ratewin = Number(parseFloat(row.trading_win_count).toFixed(2))
	      	}else{
                 row.ratewin = Number((row.trading_win_count / row.trading_count).toFixed(2))
	      	}
	      	return row.ratewin
	      }
	      if(column.label == '浮动盈亏'){
	      	column.property = 'floating'
	      	row.floating = Number((row.equity - row.balance).toFixed(2)) 
	      	return row.floating
	      }
    },
		getSummaries(param) {
			const {
				columns,
				data
			} = param
			const sums = []
			columns.forEach((column, index) => {
				if(index === 0) {
					sums[index] = '合计'
					return
				}
				if(index === 1) {
					sums[index] = ''
					return
				}
				if(index === 2) {
					sums[index] = ''
					return
				}
				const values = data.map(item => Number(item[column.property]))
				if(!values.every(value => isNaN(value))) {
					sums[index] = values.reduce((prev, curr) => {
						const value = Number(curr)
						if(!isNaN(value)) {
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
		tableRowClassName(row, index) {
			return 'row-cell'
		},
		handleCurrentChange(val) {
			this.pageNo = parseInt(val)
			this.getList()
			scrollTo(0, 0)
		},
		handleSizeChange(val) {
			this.pageSize = val
			this.pageNo = 1
			this.getList()
			scrollTo(0, 0)
		},
		getList() {
			this.loading = true
			this.getTm()
			commonRequest('accountReportList', {
				page_no: this.pageNo,
				page_size: this.pageSize,
				belong_type: this.belong_store.type == '6' ? this.belong_store.type : this.belong_type,
				belong_value: this.belong_value,
				start_time: this.start_time,
				end_time: this.end_time
			}).then(res => {
				if(res.code === 200) {
					this.positionList = res.data.page_data.list
					this.formatData()
					this.page = res.data.page
					this.pageNo = parseInt(this.page.page_no)
					this.total = parseInt(this.page.total)
				
					//        console.log(this.positionList)
				} else {
					this.$message(res.msg)
				}
				this.loading = false
			}).catch(error => {
				this.loading = false
			})
		},

		getTm: function() {
			const self = this
			if(self.checkTime === undefined || self.checkTime === '') {
				return
			}
			const y1 = self.checkTime[0].getFullYear()
			let m1 = self.checkTime[0].getMonth() + 1
			if(m1 < 10) {
				m1 = '0' + m1
			}
			let d1 = self.checkTime[0].getDate()
			if(d1 < 10) {
				d1 = '0' + d1
			}
			const y2 = self.checkTime[1].getFullYear()
			let m2 = self.checkTime[1].getMonth() + 1
			if(m2 < 10) {
				m2 = '0' + m2
			}
			let d2 = self.checkTime[1].getDate()
			if(d2 < 10) {
				d2 = '0' + d2
			}
			this.start_time = y1 + '-' + m1 + '-' + d1
			this.end_time = y2 + '-' + m2 + '-' + d2
		},
		getBelongTree() { // 获取客户归属下拉列表
			commonRequest('customerownership', {
				type: 5
			}).then(res => {
				if(res.code === 200 && res.data) {
					this.belongTree = res.data.retdata
					this.belong_type = 1
					for(const item of this.belongTree) {
						if(item.belong_type == '6') { // 用户筛选
							this.customerFiltrate.belongTreeData = item.data
							break
						}
					}
				}
			})
		},
		changeStatus(val) { // val为null时，为输入姓名等关键词搜索时主动清空数据，此时值变更引起的改变不刷新数据
			if(val == null) {
				return false
			} else {
				this.pageNo = 1
				this.getList()
			}
		},
		customerFiltrateSearch() {
			this.belong_value = this.$refs.filtrateData.selectData.id
			if(!(this.belong_value + '')) {
				this.customerFiltrate.show = false
				return false
			}
			this.pageNo = 1
			this.getList()
			this.customerFiltrate.show = false
		},
		handleFiltrateClose() {
			if(this.belong_type == '6') {
				const id = this.$refs.filtrateData.selectData.id
				if(id + '' && this.belong_value == id) {
					this.belong_store.type = this.belong_type
					this.belong_store.name = this.$refs.filtrateData.selectData.name
					this.belong_store.value = this.belong_value
					this.belong_type = this.belong_store.name
				} else {
					if(this.belong_store.type == '6') {
						this.belong_type = this.belong_store.name
						this.belong_value = this.belong_store.value
					} else {
						this.belong_type = this.belong_store.type
					}
				}
			}
		},
		changeBelongData() { // belong_type为null时，为输入姓名等关键词搜索时主动清空数据，此时值变更引起的改变不刷新数据
			const node = this.belongTree.find((value, index, arr) => {
				if(this.belong_type == value.belong_type) {
					return value
				}
			})
			if(this.belong_type === null || !node) {
				return false
			} else {
				if(this.belong_type == '6') { // 为用户条件筛选
					this.customerFiltrate.show = true
				} else {
					this.belong_store.type = this.belong_type
					this.belong_store.name = ''
					this.belong_store.value = ''
					this.belong_value = null
					this.pageNo = 1
					this.getList()
				}
			}
		},
		/* 排序*/
		formatData() {
			for(let i = 0; i < this.positionList.length; i++) {
				this.positionList[i].payment_in = parseFloat(Number(this.positionList[i].payment_in)) // 入金
				this.positionList[i].payment_out = parseFloat(Number(this.positionList[i].payment_out)) // 出金
				this.positionList[i].commission = parseFloat(Number(this.positionList[i].commission)) // 手续费
				this.positionList[i].swap = parseFloat(Number(this.positionList[i].swap)) // 利息
				this.positionList[i].trading_lots = parseFloat(Number(this.positionList[i].trading_lots))  // 手数
				this.positionList[i].trading_count = parseFloat(Number(this.positionList[i].trading_count)) // 笔数
				this.positionList[i].profit = parseFloat(Number(this.positionList[i].profit)) // 盈亏
				this.positionList[i].ratewin = parseFloat(Number(this.positionList[i].ratewin)) // 胜率
				this.positionList[i].income = parseFloat(Number(this.positionList[i].income)) // 收益
				this.positionList[i].payback = parseFloat(Number(this.positionList[i].payback)) //返佣
				this.positionList[i].equity = parseFloat(Number(this.positionList[i].equity)) // 净值
				this.positionList[i].balance = parseFloat(Number(this.positionList[i].balance)) // 余额
			}
		},

		/*导出excel表格*/
		handleDownload() {
			this.downloadLoading = true
			this.$confirm('确定将账户报表导出excel表格?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				const nameData = ['姓名', '账户', '归属', '入金','其它入金', '出金','其它出金', '返佣', '手续费', '利息', '手数', '笔数', '平仓盈亏', '胜率', '收益', '净值', '余额','浮动盈亏']
				const fieldData = ['account_name', 'account_id', 'user_tree', 'payment_in','other_in_money', 'payment_out','other_out_money', 'payback', 'commission', 'swap', 'trading_lots', 'trading_count', 'profit', 'ratewin', 'earnings', 'equity', 'balance','floating']
				const listData = this.positionList
				this.downloadLoading = false
				//导出excel表格全局处理方法
				this.exportExcel('账户报表', nameData, fieldData, listData)
			}).catch(() => {
				this.downloadLoading = false
			})
		}
	},
	created() {
		//this.getList()
		this.getBelongTree()
	}
}