import { commonRequest } from '@/api/api-marketFee'
import userScreening from 'components/userScreening/index.vue'
import paging from 'components/paging/index.vue'
export default {
	components: {
		userScreening,
		paging
	},
	data() {
		return {
			loading: false,
			emptyText:'数据加载中...',
			checkTime: [new Date(new Date() - 6 * 24 * 3600 * 1000), new Date()],
			pickerOptions1: this.timeData(),
			list: [],
			page: {},//存放分页数据
			keyword: '',
			screenOptions:[
				{
				  label: '姓名',
				  value: '1'	
				},{
					label: '股票编码',
					value: '3' 
				},{
					label: '股票名称',
					value: '4' 
				},{
					label: '订单号',
					value: '5' 
				}
			],
			screenValue: '1',
		}
	},
	methods: {
	  getList(){
			const dataTimeObj = this.timeFormatFn(this.checkTime)  //获取全局时间处理方法
		  this.loading = true
		  commonRequest('inviteprofitList',{
				page_no: this.$refs.subassemblyData.page_no,
				page_size: this.$refs.subassemblyData.page_size,
			  active_start_time: dataTimeObj.active_start_time,
			  active_end_time: dataTimeObj.active_end_time,
			  keyword: this.keyword,
				screenValue: this.screenValue,
			  organ_id:  this.$refs.userScreeningDataInterface.mechanism.value,
			  zone_id: this.$refs.userScreeningDataInterface.zone_id,
				user_id: this.$refs.userScreeningDataInterface.user_id
		  }).then(res =>{
			this.loading = false
			if(res.code == 200){
				this.list = res.data.page_data || []
				this.page = res.data.page || {}
				this.emptyText = '暂无数据'
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
		this.list[i].div_rate = Number(this.list[i].div_rate) 
		this.list[i].div_profit = Number(this.list[i].div_profit) 
}
},
//计算合计
getSummaries(param) {
	const { columns, data } = param
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
     if(index === 7){
			sums[index] = Math.round(Number(sums[index]) * 100) / 100
		 }else{
			sums[index] = '--'
		 }
	  } else {
		sums[index] = '--'
	  }
	})
	return sums
  },		
		//搜索
searchList(){
	this.getList()
},
//时间筛选
selectTime(){
	this.getList()
}
	},
	mounted() {
		this.getList()
	}
}