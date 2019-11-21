import { commonRequest, getLoginCode } from '@/api/api-login'
import { mapGetters } from 'vuex'
import { setUserCookie,setUserCookieBs, setCookieUWID } from '@/utils/user'
import { trim } from '@/utils/data'
export default {
  name: 'login',
  computed: {
    ...mapGetters([
      'sidebar',
      'name',
      'avatar'
    ])
  },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (trim(value) === '') {
        callback(new Error('请输入您的账号'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (trim(value) === '') {
        callback(new Error('请输入您的密码'))
      } else {
        callback()
      }
    }
    const validateCode = (rule, value, callback) => {
      if (trim(value) === '') {
        callback(new Error('请输入您的验证码'))
      } else {
        callback()
      }
    }
    return {
      title: '',
      loginForm: {
        email: '',
        pwd: '',
        code: ''
      },
      loginRules: {
        email: [{ required: true, trigger: 'blur', validator: validateUsername }],
        pwd: [{ required: true, trigger: 'blur', validator: validatePassword }],
        code: [{ required: true, trigger: 'blur', validator: validateCode }]
      },
      pwdType: 'password',
      loading: false,
      showDialog: false,
      codeUrl: '',
      logoUrl: '',
	  	noneLogo: ''
    }
  },
  methods: {
    //test
    gettitle () {
      let domain = window.location.host
      const firstDomain = domain.substring(domain.indexOf('.') + 1, domain.length)
      if (firstDomain === 'dianmai361.com') {
        this.title = '测试系统登陆'
      } else {
        this.title = '登录系统'
      }
    },
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          commonRequest('loginByUsername', {
            mobile: trim(this.loginForm.email),
            password: trim(this.loginForm.pwd),
            code: trim(this.loginForm.code),
            isLoginAjax: true // 此参数防止在登录时因为token变化引起的页面刷新，导致登录失败
          }).then(res => {
            this.loading = false
            if (res.code === 200 && res.data) {
              const data = res.data
             localStorage.setItem('userinfo',JSON.stringify(res.data))//保存用户登陆信息
             this.$store.commit('SET_USERINFO', data)
              setUserCookieBs('1')
              setUserCookie(data.token)
              // Astlvk update
              console.log(data.white_user_id)
              setCookieUWID(data.user_id, data.white_user_id)
              this.$store.commit('CLEAR_ROUTER') // 登录的时候清空一下菜单信息
              this.$router.push({ path: '/' })
            } else {
              res.msg = res.msg || '登录失败，请重试'
              this.$message(res.msg)
            }
          }, () => {
            this.loading = false
            this.$message('登录失败，请重试')
          })
        }
      })
    },
    getCode() {
      this.codeUrl = getLoginCode()
    }
  },
  created() {
    this.getCode()
    this.gettitle()
  },
  destroyed() {
  },
  mounted() {
    // var firstDomain = window.location.hostname.replace('broker.', '')
		// document.getElementsByClassName('login-container')[0].style.backgroundImage = 'url(//api.' + firstDomain + '/logo/' + firstDomain + '/bg2.jpg?v='+new Date().getTime()+')'
    // if(firstDomain == 'mt4fintech.com') {
    // 	this.logoUrl = '//api.'+ firstDomain + '/logo/' + firstDomain + '/1.png?v='+new Date().getTime()+''
    // } else {
    // 	this.noneLogo = 'noneLogo'
    // }
	}
}
