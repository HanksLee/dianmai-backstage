<template>
	<div class="page page-customer">
		<div class="page-header">
			<span>SEO配置</span>
		</div>
		<div class="page-con seoBox" style="padding:20px 0 0 0;" v-loading="loading" element-loading-text="加载中...">
			<div class="submit-data basics">
				<el-form ref="form">
					<el-row>
						<el-col :span="3"><span class="label" style="width:100%">网站网址：</span></el-col>
						<el-col :span="9">
							<el-form-item>
								<el-input v-model="seoForm.url" placeholder="请输入网站网址"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="3"><span class="label" style="width:100%">网站标题：</span></el-col>
						<el-col :span="9">
							<el-form-item>
								<el-input v-model="seoForm.head" placeholder="请输入网站标题"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="3"><span class="label" style="width:100%">SEO标题：</span></el-col>
						<el-col :span="9">
							<el-form-item>
								<el-input v-model="seoForm.title" placeholder="请输入SEO标题"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="3"><span class="label" style="width:100%">SEO关键字：</span></el-col>
						<el-col :span="9">
							<el-form-item>
								<el-input v-model="seoForm.keywords" placeholder="请输入SEO关键字"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="3"><span class="label" style="width:100%">SEO描述：</span></el-col>
						<el-col :span="9">
							<el-form-item>
								<el-input v-model="seoForm.description" placeholder="请输入SEO描述"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="3"><span class="label" style="width:100%">联系方式：</span></el-col>
						<el-col :span="9">
							<el-form-item>
								<el-input v-model="seoForm.tel" placeholder="请输入联系方式"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="3"><span class="label" style="width:100%">客服电话：</span></el-col>
						<el-col :span="9">
							<el-form-item>
								<el-input v-model="seoForm.customer" placeholder="请输入客服电话"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="3"><span class="label" style="width:100%">工作时间：</span></el-col>
						<el-col :span="9">
							<el-form-item>
								<el-input v-model="seoForm.work" placeholder="请输入工作时间"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="3"><span class="label" style="width:100%">客服QQ：</span></el-col>
						<el-col :span="9">
							<el-form-item>
								<el-input v-model="seoForm.qq" placeholder="请输入客服QQ"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="3"><span class="label" style="width:100%">分享内容：</span></el-col>
						<el-col :span="9">
							<el-form-item>
								<el-input v-model="seoForm.share_des" placeholder="请输入分享内容"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="3"><span class="label" style="width:100%">安卓版本号：</span></el-col>
						<el-col :span="9">
							<el-form-item>
								<el-input v-model="seoForm.androidversion" placeholder="请输入安卓版本号"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="3"><span class="label" style="width:100%">苹果版本号：</span></el-col>
						<el-col :span="9">
							<el-form-item>
								<el-input v-model="seoForm.iosversion" placeholder="请输入苹果版本号"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="3"><span class="label" style="width:100%">安卓App下载地址：</span></el-col>
						<el-col :span="9">
							<el-form-item>
								<el-input v-model="seoForm.androiduploadurl" placeholder="请输入安卓App下载地址"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="3"><span class="label" style="width:100%">苹果App下载地址：</span></el-col>
						<el-col :span="9">
							<el-form-item>
								<el-input v-model="seoForm.iosuploadurl" placeholder="请输入苹果App下载地址"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="3"><span class="label" style="width:100%">微博链接：</span></el-col>
						<el-col :span="9">
							<el-form-item>
								<el-input v-model="seoForm.weibo" placeholder="请输入微博链接"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="3"><span class="label" style="width:100%">地址：</span></el-col>
						<el-col :span="9">
							<el-form-item>
								<el-input v-model="seoForm.address" placeholder="请输入地址"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="3"><span class="label" style="width:100%">版权设置：</span></el-col>
						<el-col :span="9">
							<el-form-item>
								<el-input v-model="seoForm.copyright" placeholder="请输入版权设置"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="3"><span class="label" style="width:100%">网站logo：</span></el-col>
						<el-col :span="9">
							<el-form-item>
								<div class="logoBox" @click="choiceImg('uploadImgBtn1')">
									<img :src="seoForm.logo">
									<input type="file" accept="image/jpg,image/jpeg,image/png" id="uploadImgBtn1" @change="getImg($event,'file_name1',1)" style="display:none;">
								</div>
								<p>{{ textFrom.showToast1 }}</p>
							</el-form-item>
						</el-col>
						<el-col :span="3"><span class="label" style="width:100%">顶部标志logo(小)：</span></el-col>
						<el-col :span="9">
							<el-form-item>
								<div class="logoBox" @click="choiceImg('uploadImgBtn2')">
									<img :src="seoForm.logo1">
									<input type="file" accept="image/ico" id="uploadImgBtn2" @change="getImg($event,'file_name2',2)" style="display:none;">
								</div>
								<p>{{textFrom.showToast2}}</p>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="3"><span class="label" style="width:100%">APP首页图片一：</span></el-col>
						<el-col :span="9">
							<el-form-item>
								<div class="logoBox" @click="choiceImg('uploadImgBtn3')">
									<img :src="seoForm.bg1">
									<input type="file" accept="image/jpg,image/jpeg,image/png" id="uploadImgBtn3" @change="getImg($event,'file_name3',3)" style="display:none;">
								</div>
								<p>{{textFrom.showToast3}}</p>
							</el-form-item>
						</el-col>
						<el-col :span="3"><span class="label" style="width:100%">APP首页图片一链接地址：</span></el-col>	
						<el-col :span="9">
							<el-form-item>
								<el-input v-model="seoForm.bg1_url" placeholder="请输入APP首页图片一链接地址"></el-input>
							</el-form-item>	
						</el-col>
					</el-row>	
					<el-row>	
						<el-col :span="3"><span class="label" style="width:100%">APP首页图片二：</span></el-col>
						<el-col :span="9">
							<el-form-item>
								<div class="logoBox" @click="choiceImg('uploadImgBtn4')">
									<img :src="seoForm.bg2">
									<input type="file" accept="image/jpg,image/jpeg,image/png" id="uploadImgBtn4" @change="getImg($event,'file_name4',4)" style="display:none;">
								</div>
								<p>{{textFrom.showToast4}}</p>
							</el-form-item>
						</el-col>
						<el-col :span="3"><span class="label" style="width:100%">APP首页图片二链接地址：</span></el-col>	
						<el-col :span="9">
							<el-form-item>
								<el-input v-model="seoForm.bg2_url" placeholder="请输入APP首页图片二链接地址"></el-input>
							</el-form-item>	
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="3"><span class="label" style="width:100%">APP首页图片三：</span></el-col>
						<el-col :span="9">
							<el-form-item>
								<div class="logoBox" @click="choiceImg('uploadImgBtn5')">
									<img :src="seoForm.bg3">
									<input type="file" accept="image/jpg,image/jpeg,image/png" id="uploadImgBtn5" @change="getImg($event,'file_name5',5)" style="display:none;">
								</div>
								<p>{{textFrom.showToast5}}</p>
							</el-form-item>
						</el-col>
						<el-col :span="3"><span class="label" style="width:100%">APP首页图片三链接地址：</span></el-col>	
						<el-col :span="9">
							<el-form-item>
								<el-input v-model="seoForm.bg3_url" placeholder="请输入APP首页图片三链接地址"></el-input>
							</el-form-item>	
						</el-col>
						</el-row>
						<el-row>	
						<el-col :span="3"><span class="label" style="width:100%">APP首页图片四：</span></el-col>
						<el-col :span="9">
							<el-form-item>
								<div class="logoBox" @click="choiceImg('uploadImgBtn6')">
									<img :src="seoForm.bg4">
									<input type="file" accept="image/jpg,image/jpeg,image/png" id="uploadImgBtn6" @change="getImg($event,'file_name6',6)" style="display:none;">
								</div>
								<p>{{textFrom.showToast6}}</p>
							</el-form-item>
						</el-col>
						<el-col :span="3"><span class="label" style="width:100%">APP首页图片四链接地址：</span></el-col>	
						<el-col :span="9">
							<el-form-item>
								<el-input v-model="seoForm.bg4_url" placeholder="请输入首页图片四链接地址"></el-input>
							</el-form-item>	
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="3"><span class="label" style="width:100%">PC首页图片一：</span></el-col>
						<el-col :span="9">
							<el-form-item>
								<div class="logoBox" @click="choiceImg('uploadImgBtn13')">
									<img :src="seoForm.pc_bg1">
									<input type="file" accept="image/jpg,image/jpeg,image/png" id="uploadImgBtn13" @change="getImg($event,'file_name13',13)" style="display:none;">
								</div>
								<p>{{textFrom.showToast13}}</p>
							</el-form-item>
						</el-col>
						<el-col :span="3"><span class="label" style="width:100%">PC首页图片一链接地址：</span></el-col>	
						<el-col :span="9">
							<el-form-item>
								<el-input v-model="seoForm.bg5_url" placeholder="请输入PC首页图片一链接地址"></el-input>
							</el-form-item>	
						</el-col>
						</el-row>
						<el-row>	
						<el-col :span="3"><span class="label" style="width:100%">PC首页图片二：</span></el-col>
						<el-col :span="9">
							<el-form-item>
								<div class="logoBox" @click="choiceImg('uploadImgBtn14')">
									<img :src="seoForm.pc_bg2">
									<input type="file" accept="image/jpg,image/jpeg,image/png" id="uploadImgBtn14" @change="getImg($event,'file_name14',14)" style="display:none;">
								</div>
								<p>{{textFrom.showToast14}}</p>
							</el-form-item>
						</el-col>
						<el-col :span="3"><span class="label" style="width:100%">PC首页图片二链接地址：</span></el-col>	
						<el-col :span="9">
							<el-form-item>
								<el-input v-model="seoForm.bg6_url" placeholder="请输入PC首页图片二链接地址"></el-input>
							</el-form-item>	
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="3"><span class="label" style="width:100%">PC首页图片三：</span></el-col>
						<el-col :span="9">
							<el-form-item>
								<div class="logoBox" @click="choiceImg('uploadImgBtn15')">
									<img :src="seoForm.pc_bg3">
									<input type="file" accept="image/jpg,image/jpeg,image/png" id="uploadImgBtn15" @change="getImg($event,'file_name15',15)" style="display:none;">
								</div>
								<p>{{textFrom.showToast15}}</p>
							</el-form-item>
						</el-col>
						<el-col :span="3"><span class="label" style="width:100%">PC首页图片三链接地址：</span></el-col>	
						<el-col :span="9">
							<el-form-item>
								<el-input v-model="seoForm.bg7_url" placeholder="请输入首页图片三链接地址"></el-input>
							</el-form-item>	
						</el-col>
						</el-row>
						
					<el-row>
						<el-col :span="3"><span class="label" style="width:100%">IOS二维码：</span></el-col>
						<el-col :span="9">
							<el-form-item>
								<div class="logoBox" @click="choiceImg('uploadImgBtn7')">
									<img :src="seoForm.ios">
									<input type="file" accept="image/jpg,image/jpeg,image/png" id="uploadImgBtn7" @change="getImg($event,'file_name7',7)" style="display:none;">
								</div>
								<p>{{textFrom.showToast7}}</p>
							</el-form-item>
						</el-col>
						<el-col :span="3"><span class="label" style="width:100%">Android二维码：</span></el-col>
						<el-col :span="9">
							<el-form-item>
								<div class="logoBox" @click="choiceImg('uploadImgBtn8')">
									<img :src="seoForm.android">
									<input type="file" accept="image/jpg,image/jpeg,image/png" id="uploadImgBtn8" @change="getImg($event,'file_name8',8)" style="display:none;">
								</div>
								<p>{{textFrom.showToast8}}</p>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="3"><span class="label" style="width:100%">分享图片：</span></el-col>
						<el-col :span="9">
							<el-form-item>
								<div class="logoBox" @click="choiceImg('uploadImgBtn9')">
									<img :src="seoForm.share_img">
									<input type="file" accept="image/jpg,image/jpeg,image/png" id="uploadImgBtn9" @change="getImg($event,'file_name9',9)" style="display:none;">
								</div>
								<p>{{textFrom.showToast9}}</p>
							</el-form-item>
						</el-col>
						<el-col :span="3"><span class="label" style="width:100%">微信二维码：</span></el-col>
						<el-col :span="9">
							<el-form-item>
								<div class="logoBox" @click="choiceImg('uploadImgBtn10')">
									<img :src="seoForm.weixin">
									<input type="file" accept="image/jpg,image/jpeg,image/png" id="uploadImgBtn10" @change="getImg($event,'file_name10',10)" style="display:none;">
								</div>
								<p>{{textFrom.showToast10}}</p>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="3"><span class="label" style="width:100%">登录/注册背景图：</span></el-col>
						<el-col :span="9">
							<!-- <el-form-item>
								<div class="logoBox" @click="choiceImg('uploadImgBtn11')">
									<img :src="seoForm.login_bg">
									<input type="file" accept="image/jpg,image/jpeg,image/png" id="uploadImgBtn11" @change="getImg($event,'file_name11',11)" style="display:none;">
								</div>
								<p>{{textFrom.showToast11}}</p>
							</el-form-item> -->
							<el-upload
							class="avatar-uploader"
							:action="action"
							:show-file-list="false"
							:data="formData"
							:on-success="handleAvatarSuccess">
							<img v-if="seoForm.login_bg" :src="seoForm.login_bg" class="avatar">
							<i v-else class="el-icon-plus avatar-uploader-icon"></i>
							</el-upload>
						</el-col>
						<el-col :span="3"><span class="label" style="width:100%">首页背景图：</span></el-col>
						<el-col :span="9">
							<!-- <el-form-item>
								<div class="logoBox" @click="choiceImg('uploadImgBtn12')">
									<img :src="seoForm.index_bg">
									<input type="file" accept="image/jpg,image/jpeg,image/png" id="uploadImgBtn12" @change="getImg($event,'file_name12',12)" style="display:none;">
								</div>
								<p>{{textFrom.showToast12}}</p>
							</el-form-item> -->
							<el-upload
							class="avatar-uploader"
							:action="action"
							:show-file-list="false"
							:data="formData"
							:on-success="handleAvatarSuccess1">
							<img v-if="seoForm.index_bg" :src="seoForm.index_bg" class="avatar">
							<i v-else class="el-icon-plus avatar-uploader-icon"></i>
							</el-upload>
						</el-col>
					</el-row>
					<el-row>
						<!-- <el-col :span="3"><span class="label" style="width:100%">官网APP下载背景：</span></el-col> -->
						<!-- <el-col :span="9">
							<el-upload
							class="avatar-uploader"
							:action="action"
							:show-file-list="false"
							:data="formData"
							:on-success="handleAvatarSuccess2">
							<img v-if="seoForm.login_bg" :src="seoForm.login_bg" class="avatar">
							<i v-else class="el-icon-plus avatar-uploader-icon"></i>
							</el-upload>
						</el-col> -->
					</el-row>	
					<el-row>
						<dl style="oveflow:hinnde;">
							<dt style="width:12.5%;text-align:right;float:left;">关于我们：</dt>
							<dd style="width:87.5%;float:right;">
								<div class="editor-container" style="width:750px;height:500px;margin-bottom:15px;">
								<editor :contentData="contentData" ref="editorData"></editor>
								</div>  
							</dd>
						</dl>
					</el-row>
					<el-row style="bottom: 0; text-align: center; margin: 30px 0;">
						<el-button type="primary" style="width:100px;" @click="editFn">保存</el-button>
					</el-row>
				</el-form>
			</div>
		</div>
	</div>
</template>
<style rel="stylesheet/scss" lang="scss" scoped>
	.seoBox {
		.el-input {
			min-width: 250px;
			max-width: 440px;
		}
		.el-form-item__content {
			margin-left: 30px !important;
		}
		.el-col-10 {
			min-width: 250px;
		}
		.el-col-2 {
			min-width: 110px;
			text-align:right;
		}
		.logoBox {
			width: 280px;
			height: 66px;
			cursor: pointer;
			margin-bottom: 5px;
			border: none;
			position: relative;
			border:1px solid #ccc;
			.fa-upload {
				font-size: 34px;
				color: #ddd;
				position: absolute;
				left: 124px;
				top: 16px;
			}
			img {
				width: 280px;
				height: 66px;
				border: none;
				border-radius: 5px;
			}
		}
		p {
			color: #f00;
			line-height: 25px;
			margin-bottom: 15px;
		}
	}
	.avatar-uploader{
		width:280px;
		height:66px;
		position: relative;
        overflow: hidden;
		border:1px solid #ccc;
		text-align:center;
		line-height:66px;
		.avatar-uploader-icon{
			font-size:20px;
			color:#ccc;
		}
		.avatar{
			position:absolute;
			top:0;
			left:0;
			width:280px;
			height:66px;
		}
	}
	// .basics.submit-data .label {
	// 	text-align: center;
	// }
</style>
<script src="./index.js"></script>