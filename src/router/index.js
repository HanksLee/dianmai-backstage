import Vue from 'vue'
import Router from 'vue-router'
import NProgress from 'nprogress'
const _import = require('./_import_' + process.env.NODE_ENV)
// in development env not use Lazy Loading,because Lazy Loading too many pages will cause webpack hot update too slow.so only in production use Lazy Loading
Vue.use(Router)
/* layout */
import Layout from '../views/layout/Layout'
/**
 * icon : the icon show in the sidebar
 * hidden : if `hidden:true` will not show in the sidebar
 * redirect : if `redirect:noredirect` will no redirct in the levelbar
 * noDropdown : if `noDropdown:true` will has no submenu
 * meta : { role: ['admin'] }  will control the page role
 **/
export const constantRouterMap = [
    { path: '/login', component: _import('login/index'), hidden: true },
    { path: '/404', component: _import('errorPage/404'), hidden: true },
    { path: '/401', component: _import('errorPage/401'), hidden: true },
    {
        path: '',
        component: Layout,
        redirect: '/dashboard',
        name: '',
        icon: 'fa-home',
        noDropdown: true,
        children: [{ path: 'dashboard', component: _import('dashboard/index'), name: '系统首页' }]
    }
]

export default new Router({
    mode: 'history', // 后端支持可开
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRouterMap
})

export const asyncRouterMap = [{
    path: '/customer',
    component: Layout,
    redirct: '/customer/customerList',
    name: '客户管理',
    icon: 'fa-users',
    routerId: '',
    children: [
        { path: 'customerList', component: _import('customer/customerList/index'), name: '客户列表', routerId: 'v1_admin/customer/list' },
        { path: 'realName', component: _import('customer/realName/index'), name: '实名认证', routerId: 'v1_admin/customercertify/list' },
        { path: 'IBList', component: _import('customer/IBList/index'), name: '经纪人申请', routerId: 'v1_admin/agentcheck/list' }
    ]
 }, {
	path: '/strategy',
	component: Layout,
	redirct: '/strategy/strategyList',
	name: '策略管理',
	icon: 'fa-handshake-o',
	routerId: '',
	children: [
		{ path: 'position_order' , component: _import('strategy/position_order/index'), name: '持仓订单', routerId: 'v1_admin/orderbuy/list' },
		{ path: 'tally_order' , component: _import('strategy/tally_order/index'), name: '结算订单', routerId: 'v1_admin/policyhistory/list' }, 
		// { path: 'strategyList' , component: _import('strategy/strategyList/index'), name: '历史委托', routerId: '' },
	]
 }, {
    path: '/marketFee',
    component: Layout,
    redirct: '/marketFee/marketFeeList',
    name: '推广分成',
    icon: 'fa-database',
    routerId: '',
    children: [
        { path: 'marketFeeList', component: _import('marketFee/marketFeeList/index'), name: 'IB分成', routerId: 'v1_admin/marketshare/list' },
        { path: 'directGuestList', component: _import('marketFee/directGuestList/index'), name: '直客分成', routerId: 'v1_admin/inviteprofit/list' }
        
    ]
 }, {
    path: '/deferManage',
    component: Layout,
    redirct: '/deferManage/deferDetail',
    name: '递延管理',
    icon: 'fa-gg',
    routerId: '',
    children: [
        { path: 'deferDetail', component: _import('deferManage/deferDetail/index'), name: '递延明细', routerId: 'v1_admin/delayfee/list' }
    ]
 },{
    path: '/risk',
    component: Layout,
    redirct: '/risk/withdrawal',
    name: '风控管理',
    icon: 'fa-shield',
    routerId: '',
    children: [
    	{ path: 'stock' , component: _import('risk/stock/index'), name: '股票管理', routerId: 'v1_admin/riskstock/list' },
        { path: 'withdrawal', component: _import('risk/withdrawal/index'), name: '提现申请', routerId: 'v1_admin/withdraw/list' },
        { path: 'positions', component: _import('risk/positions/index'), name: '头寸管理', routerId: 'v1_admin/position/list' },
        { path: 'margin', component: _import('risk/margin/index'), name: '操作资金预警', routerId: 'v1_admin/warning/list'},
        { path: 'zerocycle', component: _import('risk/zerocycle/index'), name: 'T+0股票池', routerId: 'v1_admin/stockmargin/list' },
        {
          path: 'quotation',
          component: _import('risk/quotation/index'),
          name: '行情信息',
          routerId: 'v1_admin/quotation/list'
        },
        {
          path: 'exception',
          component: _import('risk/exception/index'),
          name: '异常信息',
          routerId: 'v1_admin/exception/list'
        },
    ]
 }, {
   path: '/property',
   component: Layout,
   redirct: '/property/deposit',
   name: '财务管理',
   icon: 'fa-credit-card',
   routerId: '',
   children: [
        { path: 'deposit', component: _import('property/deposit/index'), name: '入金管理', routerId: 'v1_admin/cashesin/list' },
        { path: 'withdraw', component: _import('property/withdraw/index'), name: '出金管理', routerId: 'v1_admin/cashesout/list' },
        { path: 'payment', component: _import('property/payment/index'), name: '支付方式', routerId: 'v1_admin/paychannel/list' },
        { path: 'balance', component: _import('property/balance/index'), name: '冲账管理', routerId: 'v1_admin/balance/list' },
        { path: 'exchangerate', component: _import('property/exchangerate/index'), name: '汇率维护', routerId: 'v1_admin/currencyrate/list' },
        { path: 'inAndOutRate', component: _import('property/inAndOutRate/index'), name: '出入金汇率', routerId: 'v1_admin/currencyrate/inout' }

   ]
 }, {
    path: '/report',
    component: Layout,
    redirct: '/report/reportList',
    name: '报表管理',
    icon: 'fa-file-text-o',
    routerId: '',
    children: [
    	{ path: 'capital_report', component: _import('report/capital_report/index'), name: '资产报表', routerId: 'v1_admin/customerfund/property' },
        { path: 'accountReport', component: _import('report/accountReport/index'), name: '账户报表', routerId: 'v1_admin/customerfund/account' },
        { path: 'history_form', component: _import('report/history_form/index'), name: '业绩报表', routerId: 'v1_admin/customerfund/earning' },
        // { path: 'varietyReports', component: _import('report/varietyReports/index'), name: '品种报表', routerId: '' },
        // { path: 'position_form', component: _import('report/position_form/index'), name: '持仓报表', routerId: '' },
        // { path: 'rebateReport', component: _import('report/rebateReport/index'), name: '推广报表', routerId: '' },
    ]
 }, {
    path: '/coupon',
    component: Layout,
    redirct: '/coupon/couponGrant',
    name: '红包管理',
    icon: 'fa-money',
    routerId: '',
    children: [
        { path: 'couponGrant', component: _import('coupon/couponGrant/index'), name: '红包发放', routerId: 'v1_admin/coupongrant/list' },
        { path: 'customerCoupon', component: _import('coupon/customerCoupon/index'), name: '红包领取', routerId: 'v1_admin/customercoupon/list' },
    ]
 }, {
    path: '/user',
    component: Layout,
    redirct: '/user/userList',
    name: '用户管理',
    icon: 'fa-address-card-o',
    routerId: '',
    children: [
        { path: 'userList', component: _import('user/userList/index'), name: '用户列表', routerId: 'v1_admin/useradmin/list' },
        { path: 'roleList', component: _import('user/roleList/index'), name: '角色列表', routerId: 'v1_admin/role/list' },
    ]
 }, {
    path: '/member',
    component: Layout,
    redirct: '/member/memberList',
    name: '机构管理',
    icon: 'fa-diamond',
    routerId: '',
    children: [
        { path: 'memberList', component: _import('member/memberList/index'), name: '机构列表', routerId: 'v1_admin/organ/list' },
        { path: 'whitelist', component: _import('member/whitelist/index'), name: '经纪商列表', routerId: 'v1_admin/broker/list' },
    ]
}, {
	path: '/systemmgmt',
	component: Layout,
	redirct: '/systemmgmt/management',
	name: '系统管理',
	icon: 'fa-wrench',
	routerId: '',
	children: [
		{ path: 'management' , component: _import('systemmgmt/management/index'), name: '产品管理', routerId: 'v1_admin/product/list' },
		{ path: 'stockList' , component: _import('systemmgmt/stockList/index'), name: '股票列表', routerId: 'v1_admin/stockinfo/list' },
		{ path: 'sysParam' , component: _import('systemmgmt/sysParam/index'), name: '系统参数', routerId: 'v1_admin/broker/syslist' },
        { path: 'smsConfig' , component: _import('systemmgmt/smsConfig/index'), name: '短信模板', routerId: 'v1_admin/smstemplate/list' },
        { path: 'noteList' , component: _import('systemmgmt/noteList/index'), name: '短信列表', routerId: 'v1/systype/smssend' },
        { path: 'brokerSelection' , component: _import('systemmgmt/brokerSelection/index'), name: '券商选择', routerId: 'v1_admin/brokerSelection/list' },
	]
 },{
    path: '/officialWebsite',
    component: Layout,
    redirct: '/officialWebsite/contentManage',
    name: '官网管理',
    icon: 'fa-desktop',
    routerId: '',
    children: [
        { path: 'contentManage' , component: _import('officialWebsite/contentManage/index'), name: '内容管理', routerId: 'v1_admin/contenttype/list' },
        { path: 'seoManage' , component: _import('officialWebsite/seoManage/index'), name: 'SEO管理', routerId: 'v1_admin/seoconfig/list' },
    ]
 }, {
    path: '/menu',
    component: Layout,
    redirct: '/menu/menuList',
    name: '开发者',
    icon: 'fa-clipboard',
    routerId: '',
    children: [
        { path: 'menuList', component: _import('menu/menuList/index'), name: '菜单管理', routerId: 'v1_admin/menu/list' },
        { path: 'permission', component: _import('menu/permission/index'), name: '权限路由', routerId: 'v1_admin/func/list' },
        { path: 'PaymentSettings', component: _import('menu/PaymentSettings/index'), name: '支付设置', routerId: 'v1_admin/paychanneltype/list' },
        { path: 'smsSetting', component: _import('menu/smsSetting/index'), name: '短信设置', routerId: 'v1_admin/smschanneltype/list' }
    ]
 },
//  {
//     path: '/workorder',
//     name: '工单管理',
//     component: _import('workorder/submit/index'),
//     hidden: true
//  },
 {
    path: '*',
    name: '404页面',
    component: _import('errorPage/404'),
    hidden: true
 },
]


