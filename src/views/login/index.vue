<template>
	<div class="login-container">
		<el-form class="card-box login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
			<h3 class="title">{{ title }}</h3>
			<div class="login-logo" :class="noneLogo">
				<img :src="logoUrl">
			</div>
			<el-form-item prop="email">
				<span class="svg-container"><i class="fa fa-user" aria-hidden="true"></i></span>
				<el-input name="email" type="text" v-model="loginForm.email" autoComplete="on" placeholder="请输入您的邮箱账号" />
			</el-form-item>
			<el-form-item prop="pwd">
				<span class="svg-container"><i class="fa fa-lock" aria-hidden="true"></i></span>
				<el-input name="pwd" :type="pwdType" @keyup.enter.native="handleLogin" v-model="loginForm.pwd" autoComplete="on" placeholder="密码" />
				<span class='show-pwd' @click='showPwd'><i class="fa fa-eye"></i></span>
			</el-form-item>
			<el-form-item prop="code">
				<span class="svg-container"><i class="fa fa-shield" aria-hidden="true"></i></span>
				<el-input name="code" @keyup.enter.native="handleLogin" v-model="loginForm.code" autoComplete="on" placeholder="验证码" />
				<span class="vcode"><img :src="codeUrl" @click="getCode"></span>
			</el-form-item>
			<el-button type="primary" style="width:100%;margin-bottom:30px; height:40px;" :loading="loading" @click.native.prevent="handleLogin">登录</el-button>
		</el-form>
		<div>
			<h3>v1.2.0_20180412</h3>
		</div>
	</div>
</template>
<style rel="stylesheet/scss" lang="scss">
	@import "login"
</style>
<script type="text/javascript" src="./login.js"></script>