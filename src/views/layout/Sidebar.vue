<template>
	<div class="logoWrap">
		<!-- <div class="logo" :class="noneLogo">
			<img :src="logoUrl">
		</div> -->
		<!-- <el-button @click="test">btn</el-button> -->
		<el-menu mode="vertical" theme="dark" unique-opened :default-active="$route.path" :collapse="isCollapse">
			<sidebar-item :routes='permission_routers' :unaudited="unaudited"></sidebar-item>
		</el-menu>
	</div>

</template>

<script>
	import { mapGetters } from 'vuex'
	import SidebarItem from './SidebarItem'
	import { eventDelegate } from '@/utils/event'
	export default {
		created() {
			// 这里做初始化 初始最初未审核的提示
			// console.log(this.permission_routers)
			// 这里更新vuex
			// this.$store.dispatch('getUnaudited')
		},
		data() {
			return {
				// Astlvk
				logoUrl: '',
				noneLogo: ''
			}
		},
		components: {
			SidebarItem
		},
		// 这里获取vuex管理的数据
		computed: {
			...mapGetters([
				'permission_routers',
				'unaudited',
				'sidebar'
			]),
			isCollapse() {
				return !this.sidebar.opened
			}
		},
		methods: {
			test() {
				this.$store.dispatch('test', 'test')
			},
			menuHover() {
				eventDelegate('#sideBar', '.miniSideBar .el-submenu', 'mouseover', function() {
					const submenu = this.querySelector('.el-menu')
					const offsetTop = this.offsetTop
					const windowH = window.innerHeight || document.body.clientHeight
					setTimeout(function() {
						const submenuH = submenu.offsetHeight
						if(offsetTop + submenuH > windowH) {
							submenu.style.top = (windowH - offsetTop - submenuH) + 'px'
						} else {
							submenu.style.top = 0
						}
					}, 500)
				})
			}
		},
		mounted() {
			console.log(this.permission_routers)
			this.menuHover()
			// var firstDomain = window.location.hostname.replace('broker.', '')
			// if(firstDomain == 'songshu361.com') {
			// 	this.logoUrl = ''
			// 	this.noneLogo = 'noneLogo'
			// } else {
			// 	this.logoUrl = '//api.' + firstDomain + '/logo/' + firstDomain + '/1.png'
			// }
		}
	}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.logoWrap{background:#1f75cc;}
	.logo {
		width: 100%;
		padding: 20px 10px;
		background-color:#fff;
		img {
			width: 90%;
			vertical-align: middle;
		}
	}
	
	.noneLogo {
		display: none;
	}
</style>