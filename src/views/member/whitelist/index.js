import { commonRequest } from '@/api/api-member'
import paging from 'components/paging/index.vue'
import authorize from 'components/authorize/index.vue'
import { trim } from '@/utils/data'
export default {
  components: {
    paging,
    authorize
	},
    data() {
        return {
            loading: false,
            emptyText: '数据加载中...',
            keyword: '',
            list: [],
            page: {},
            url: '',
            whitelisMessageBox: false,
            title: '',
            whitelistForm:{
              company: '',
              short_name: '',
              contact: '',
              mobile: '',
              email: '',
              address: '',
              web_domain: '',
              lock_status: '',
              charging_time: '',
              expire_time: '',
              pay_channel: '',
              id: '',
              id_domain: '',
              market_trade_type:[],
              Identification:'',
            },
            pay_channel: [],
            channelData:[],
            payment: [],
            cancellationData: [{
                value: '0',
                label: '正常'
              },{
                value:'1',
                label: '锁定'
              }],
            passwordTf: true,//是否显示密码
            //跳转
            jumpData: {
              token: '',
              is_post: false,
              loading: false,
              domain: '',
              userinfo: ''
            },
            marketOpts:[],
            checkList:[]
        }
    },
    filters: {
      //到期时间
      lastLoginTime(val) {
          if (val) {
              val = trim(val)
              const val_split = val.split(' ')
              const day = val_split[0].split('-')
              const time = val_split[1].split(':')
              const time_ms = new Date(day[0], day[1] - 1, day[2], time[0], time[1], time[2]).getTime()
              const time_ms_now = new Date().getTime()
              const d_time = Number(Math.floor(((time_ms+86400000) - time_ms_now) / 86400000))
              let res = /^-[1-9]\d*$/
              if(!res.test(d_time)){
                   if (d_time < 1) {
                       return '剩1天'
                    } else{
                       return '剩余' + (d_time + 1) + '天'
                    }
              }else{
                return '逾期'+Math.abs(d_time)+'天'
              }
          }
      }
  },
    methods: {
      getSysList() {
        commonRequest('getSysList').then(res => {
          if(res.code == '200') {
            this.marketOpts = res.data.market_type
          }
        })
      },
       //新增
        add(){
          this.whitelisMessageBox = true
          this.passwordTf = true
          this.title = '新增经纪商'
          this.url = 'brokerAdd'
          for(let i in this.whitelistForm){
            this.whitelistForm[i] = ''
          }
          this.whitelistForm.market_trade_type = []
          this.pay_channel = []
        },
        handleCommand(command){
           let row = command.row
           let cmd = command.cmd
           if(cmd === 1){
              this.whitelisMessageBox = true
              this.url = 'brokerEdit'
              this.title = '编辑经纪商'
              this.passwordTf = false
              for(let i in row){
                  for(let k in  this.whitelistForm){
                      if(i === k){
                        this.whitelistForm[k] = row[i]
                      }
                      if(i == 'market_trade_type'){
                        this.whitelistForm.market_trade_type = row[i].split(',')
                      }
                  }
              }
              this.pay_channel = row.pay_channel == '' ? [] : row.pay_channel.split(',')
              this.whitelistForm.id = row.id
           }
           if(cmd === 2){
              this.$refs.authorizeFn.roleAuthorize(row,row.company,'名称','brokerAuthorization','3')
           } 
           if(cmd === 3){
              this.jumpLogin(row)
           }   
        },
        //获取支付通道
        getPaymentList(){
          commonRequest('paymentList').then(res =>{
            if(res.code == '200'){
                this.payment = res.data
            }
          })
        },
        //获取经纪商管理
        getList(){
          this.loading = true
          commonRequest('whitelist',{
            keyword: this.keyword,
            page_no: this.$refs.subassemblyData.page_no,
		        page_size: this.$refs.subassemblyData.page_size,
          }).then(res=>{
            this.loading = false
            if(res.code == '200'){
                this.list = res.data.page_data
                this.page = res.data.page || {}
                this.emptyText = '暂无数据'
              }else{
                this.emptyText = '暂无数据'
              }
              }).catch(error =>{
              this.loading = false
              })
        },
        //新增编辑提交
        submitWhiteInfo(){
          this.whitelistForm.pay_channel = this.pay_channel.join(',')
          this.whitelistForm.market_trade_type = this.whitelistForm.market_trade_type.join(',')
          commonRequest(this.url,this.whitelistForm).then(res=>{
            if(res.code == '200'){
              this.whitelisMessageBox = false
              this.$message(res.msg)
              this.getList()
            }else{
              this.$message(res.msg)
            }
          })
        },
    //搜索
    searchList(){
      this.getList()
    },
//跳转
jumpLogin(row) { // 跳转登录
  this.jumpData.is_post = false
  this.jumpData.token = ''
  this.jumpData.loading = true
  this.jumpData.domain = ''
  commonRequest('brokerRedirectlogin',{
    id: row.id
  }).then(res => {
    this.jumpData.loading = false
    if (res.code === 200 && res.data) {
      this.jumpData.token = res.data.token
      this.jumpData.domain = row.web_domain
      this.jumpData.userinfo = res.data
      document.getElementById('message').src = '//broker.' + row.web_domain + this.jumpData.port + '/static/html/message.html'
    } else {
      res.msg = res.msg || '跳转失败，请重试'
      this.$message(res.msg)
    }
  }, () => {
    this.jumpData.loading = false
    this.$message('跳转失败，请重试')
  })
},
jumpLoginInit() {
  const _t = this
  this.jumpData.port = window.location.port ? ':' + window.location.port : ''
  window.addEventListener('message', function(e) {
    if (e.data == 'ready' && _t.jumpData.domain) {
      window.open('//broker.' + _t.jumpData.domain + _t.jumpData.port)
    }
  }, false);
  document.getElementById('message').onload = function() {
    if (!_t.jumpData.is_post && _t.jumpData.domain) {
      document.getElementById('message').contentWindow.postMessage({ userinfo: _t.jumpData.userinfo}, window.location.protocol + '//broker.' + _t.jumpData.domain + _t.jumpData.port)
      _t.jumpData.is_post = true
    }
  }
},

  },
    mounted(){
      this.getList()
      this.getPaymentList()
      this.jumpLoginInit()
      this.getSysList()
    }
}