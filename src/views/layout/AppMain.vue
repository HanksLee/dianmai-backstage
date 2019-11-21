<template>
	<section class="app-main">
	<!-- <el-button class="sus" type="primary" @click="work" v-if="userinfo.role_zone == '2'">工单管理</el-button> -->
		<transition name="fade" mode="out-in">
			<router-view :key="key"></router-view>
		</transition>
	</section>
</template>
<script>
export default {
  name: 'AppMain',
  computed: {
    key() {
      return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
		},
		userinfo(){
      return JSON.parse(localStorage.getItem("userinfo"))
		}
  },
	methods: {
		work () {
			window.open('/workorder', '_blank')
		}
	}
}
</script>

<style>
	.sus {
		position: fixed;
		top: 58px;
		right: 3px;
		z-index: 30;
	}
</style>
