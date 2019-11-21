import Cookies from 'js-cookie'
const user = {
  state: {
    token: Cookies.get('token') || '',
    bs: Cookies.get('bs') || '',
    userinfo: {},
    // Astlvk update
    user_info: {}
  },

  mutations: {
    // Astlvk update
    SET_USER_INFO: (state, user) => {
      state.user_info = user
    },
    SET_LOGIN: (state, token) => {
      state.token = token
    },
    ClLEAR_LOGIN: (state) => {
      state.token = ''
    },
    SET_BS: (state, bs) => {
      state.bs = bs
    },
    SET_USERINFO: (state, userinfo) => {
      state.userinfo = userinfo
      // if (state.userinfo.user_tree_name) {
      //   const user_tree_name = state.userinfo.user_tree_name
      //   const real_name = state.userinfo.real_name
      //   const findIndex = user_tree_name.lastIndexOf(real_name)
      //   if (findIndex > -1) {
      //     let left_str = user_tree_name.substring(0, findIndex)
      //     if (left_str) {
      //       if(left_str.charAt(left_str.length-1) == '/'){
      //         left_str = left_str.substring(0, left_str.length-1)
      //       }
      //       const findLastIndex = left_str.lastIndexOf('/')
      //       if (findLastIndex > -1) {
      //         state.userinfo.parentName = left_str.substring(findLastIndex+1, left_str.length)
      //       } else {
      //         state.userinfo.parentName = left_str
      //       }
      //     }
      //   }
      // }
    }
  },

  actions: {
  }
}

export default user
