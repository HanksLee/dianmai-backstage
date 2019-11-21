import { commonRequest } from '@/api/api-dashboard'
import accountChart from './accountChart'
import positionNumChart from './positionNumChart'
import entryAndExit from './entryAndExit'
import transactionPenNumber from './transactionPenNumber'
import profitAndLoss from './profitAndLoss'
import maid from './maid'
export default {
  components: {
    accountChart,
    positionNumChart,
    entryAndExit,
    transactionPenNumber,
    profitAndLoss,
    maid
  },
  data() {
    return {
      loading: true,
      stasticsData: {},
      items: [
        { message: '今日' },
        { message: '昨日' },
        { message: '本周' },
        { message: '本月' }
      ],
      isActive: 3,
      checkTime: [],
      statistics_chart: {
        start_time: '',
        end_time: ''
      },
      isActive2: 0,
      width: '',
      activeName: '1',
      account_chart: [],
      position_num_chart: [],
      entryAndExit_chart:{
        deposit: [],
        outOfGold: []
      },
      transactionPenNumber_chart: [],
      profitAndLoss_chart: [],
      maid_chart: []
      
    }
  },

  
methods: {
  //获取统计信息
  getStastics(){
    //获取全局时间处理方法
    const dataTimeObj = this.timeFormatFn(this.checkTime) || ''
    commonRequest('stastics',{
      start_time: dataTimeObj.active_start_time,
      end_time: dataTimeObj.active_end_time
    }).then(res =>{
      if(res.code == '200'){
           this.stasticsData = res.data
           this.account_chart = res.data.customer_add_list
           this.position_num_chart = res.data.position_num_list
           this.entryAndExit_chart.deposit =  res.data.deposite_list
           this.entryAndExit_chart.outOfGold =  res.data.withdraw_list
           this.transactionPenNumber_chart = res.data.trader_num_list
           this.profitAndLoss_chart = res.data.cal_profit_list
           this.maid_chart = res.data.fanyong_list
           this.loading = false
           this.handleClick(this.activeName)
      }
    })
  },
 // 今天，昨天，本周，本月
 tabFn($index) {
  this.isActive = $index
  if ($index === 0) {
    this.getToday()
  } else if ($index === 1) {
    this.getYesterday()
  } else if ($index === 2) {
    this.getThisWeek()
  } else if ($index === 3) {
    this.getThisMonth()
  }
  this.getStastics()
},
// 自定义时间
changeTm() {
  this.getStastics()
},
// 获取本月
getThisMonth() {
  const end = new Date()
  const start = new Date()
  const d = end.getDate()
  const m = end.getMonth() + 1
  var dd = ''
  if (m === 1 || m === 3 || m === 5 || m === 7 || m === 8 || m === 10 || m === 12) {
    dd = d - 1
  } else if (m === 2) {
    dd = d + 2
  } else if (m === 4 || m === 6 || m === 9 || m === 11) {
    dd = d
  }
  start.setTime(start.getTime() - 3600 * 1000 * 24 * (d - 1))
  end.setTime(end.getTime() + 3600 * 1000 * 24 * (30 - dd))
  this.checkTime = [start, end]
},
// 获取本周
getThisWeek() {
  const end = new Date()
  const start = new Date()
  const weekday = new Array(7)
  weekday[0] = '星期日'
  weekday[1] = '星期一'
  weekday[2] = '星期二'
  weekday[3] = '星期三'
  weekday[4] = '星期四'
  weekday[5] = '星期五'
  weekday[6] = '星期六'
  if (end.getDay() == 0) {
    end.setTime(end.getTime() - 3600 * 1000 * 24 * 6)
    this.checkTime = [end, start]
  } else if (end.getDay() == 1) {
    start.setTime(start.getTime() + 3600 * 1000 * 24 * 6)
    this.checkTime = [end, start]
  } else if (end.getDay() == 2) {
    end.setTime(end.getTime() - 3600 * 1000 * 24 * 1)
    start.setTime(start.getTime() + 3600 * 1000 * 24 * 5)
    this.checkTime = [end, start]
  } else if (end.getDay() == 3) {
    end.setTime(end.getTime() - 3600 * 1000 * 24 * 2)
    start.setTime(start.getTime() + 3600 * 1000 * 24 * 4)
    this.checkTime = [end, start]
  } else if (end.getDay() == 4) {
    end.setTime(end.getTime() - 3600 * 1000 * 24 * 3)
    start.setTime(start.getTime() + 3600 * 1000 * 24 * 3)
    this.checkTime = [end, start]
  } else if (end.getDay() == 5) {
    end.setTime(end.getTime() - 3600 * 1000 * 24 * 4)
    start.setTime(start.getTime() + 3600 * 1000 * 24 * 2)
    this.checkTime = [end, start]
  } else if (end.getDay() == 6) {
    end.setTime(end.getTime() - 3600 * 1000 * 24 * 5)
    start.setTime(start.getTime() + 3600 * 1000 * 24 * 1)
    this.checkTime = [end, start]
  }
},
// 获取昨日
getYesterday() {
  const start = new Date()
  start.setTime(start.getTime() - 3600 * 1000 * 24)
  this.checkTime = [start, start]
},
// 获取今日
getToday() {
  const end = new Date()
  const start = new Date()
  this.checkTime = [end, start]
},    
handleClick(val) {
  this.loading = true
  if(val === '1' ){
    setTimeout(() => {
      this.$refs.account_fn.initChart()
      this.loading = false
    },400)
  }else if(val == '2'){
    setTimeout(() => {
    this.$refs.position_num_fn.initChart()
    this.loading = false
  },400)
  }else if(val == '3'){
    setTimeout(() => {
      this.$refs.entryAndExit_fn.initChart()
      this.loading = false
    },400)
  }else if(val == '4'){
    console.log(1234)
    setTimeout(() => {
      this.$refs.transactionPenNumber_fn.initChart()
      this.loading = false
    },400)
  }else if(val == '5'){
    setTimeout(() => {
      this.$refs.profitAndLoss_fn.initChart()
      this.loading = false
    },400)
  }else if(val == '6'){
    setTimeout(() => {
      this.$refs.maid_fn.initChart()
      this.loading = false
    },400)
  }
},
//曲线图
tendency(){
  this.isActive2 = 0
  this.$refs.account_fn.option.series[0].type = 'line'
  this.$refs.position_num_fn.option.series[0].type = 'line'
  this.$refs.entryAndExit_fn.option.series[0].type = 'line'
  this.$refs.entryAndExit_fn.option.series[1].type = 'line'
  this.$refs.transactionPenNumber_fn.option.series[0].type = 'line'
  this.$refs.profitAndLoss_fn.option.series[0].type = 'line'
  this.$refs.maid_fn.option.series[0].type = 'line'
  this.handleClick(this.activeName)
},
//柱状图 
columnar(){
  this.isActive2 = 1
  this.$refs.account_fn.option.series[0].type = 'bar'
  this.$refs.position_num_fn.option.series[0].type = 'bar'
  this.$refs.entryAndExit_fn.option.series[0].type = 'bar'
  this.$refs.entryAndExit_fn.option.series[1].type = 'bar'
  this.$refs.transactionPenNumber_fn.option.series[0].type = 'bar'
  this.$refs.profitAndLoss_fn.option.series[0].type = 'bar'
  this.$refs.maid_fn.option.series[0].type = 'bar'
  this.handleClick(this.activeName)
}
    
   
   
  },
  created() {
    this.getThisMonth()
    this.getStastics()
  },

}
