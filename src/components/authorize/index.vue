<template>
	<div>
	<!-- 授权 -->
      <el-dialog title="授权" class="dialog1 dialog-large dialog-bottom-fixed2" :visible.sync="authorize.show">
        <div class="dialog-page" v-loading="authorize.loading">
          <div class="dialog-page-con">
            <div class="dialog-dl">
                <dl class="mt-30">
                  <dt>{{name}}</dt>
                  <dd>
                    <el-input disabled v-model="authorize.role_name"></el-input>
                  </dd>
                </dl>
                <dl>
                  <dt>权限列表</dt>
                  <dd>
                      <table class="authorize-table">
                        <thead>
                          <tr>
                            <th width="120">模块</th>
                            <th width="120">菜单</th>
                            <th>权限名称</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="item in authorize.list" :key="item.name" >
                            <td>
                              <div style="margin-bottom:7px;">{{item.name}}</div>
                              <el-checkbox :true-label="1" :false-label="0" v-model="item.selection" @change="checkAllFn(item)">全选</el-checkbox>
                            </td>
                            <td colspan="2">
                              <table> 
                                <tbody>
                                  <tr v-for="item2 in item.menu" :key="item2.name" >
                                    <td width="120px">{{item2.name}}</td>
                                    <td class="align-left">
                                      <el-row style="background-color:#f5f5f5; margin: 0px;"  v-if="item2.func&&item2.func.length>0">
                                        <el-col :span="8">
                                          <el-checkbox :true-label="1" :false-label="0" v-model="item2.checkAll" :key="item2.id" @change="selectAll(item2,item)">全选</el-checkbox>
                                        </el-col>
                                      </el-row>
                                      <el-row>
                                        <el-col :span="8" v-for="item3 in item2.func" :key="item3.id">
                                          <el-checkbox :true-label="1" :false-label="0" :key="item3.id" v-model="item3.checked" @change="handleCheckedCitiesChange(item2.func,item2,item)">{{item3.name}}</el-checkbox>
                                        </el-col>
                                      </el-row>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                  </dd>
                </dl>
            </div>
          </div>
          <div class="dialog-bottom">
            <div class="dialog-bottom-btn">
              <el-button class="el-blue-btn" @click="submitAuthorize">授权</el-button>
              <el-button class="el-gray-btn" @click="authorize.show=false">关闭</el-button>
            </div>
          </div>
        </div>
      </el-dialog>
	</div>
</template>
<script>
import { commonRequest } from '@/api/api-user'
	export default {
		data() {
			return {
				 name: '',
				 num: '',//1角色授权，2机构授权，3经纪商授权
				 authorize: {
					loading: false,
					show: false,
					role_name: '',
					row: {},
					list: [],
					id: '',
				},
			}
		},
	methods: {
		//授权
		roleAuthorize(row,authorizeName,name,url,num) {
			this.name = name
			this.num = num
			this.authorize.role_name = authorizeName
			this.authorize.show = true
			this.authorize.id = row.id
			this.authorize.loading = true
			this.getRoleInfo(row,url,num)
		},		
		//获取权限列表
		getRoleInfo(val,url,num) {
		  let data = {}	
      if(num == '1'){
            data.id = val.id		
		  }
		  if(num == '2'){
            data.organ_id = val.id		
		  }
		  if(num == '3'){
            data.organ_id = val.id	
		  }
			commonRequest(url, data).then(res => {
				if (res.code === 200) {
				this.authorize.list = res.data 
				this.handleFn()
				this.authorize.loading = false
				}else{
					this.authorize.loading = false
				}
			}, () => {
				this.authorize.loading = false
			})
		},
		//初始化全选
		handleFn(){
			for(let i=0;i<this.authorize.list.length;i++ ){
				let checkAllArr = []
				this.authorize.list[i].selection = 0
				for(let k in this.authorize.list[i].menu){
				let funcArr = []
					for(let j=0;j<this.authorize.list[i].menu[k].func.length;j++){
						if(this.authorize.list[i].menu[k].func[j].checked === 0){
							this.authorize.list[i].menu[k].checkAll = 0
						}
						funcArr.push(this.authorize.list[i].menu[k].func[j].checked)
					}
					let s = 0
					for(let i=0;i<funcArr.length;i++){
						s += funcArr[i]
					}
					if(s == this.authorize.list[i].menu[k].func.length){
						this.authorize.list[i].menu[k].checkAll = 1
					}
					checkAllArr.push(this.authorize.list[i].menu[k].checkAll)  
				}
				let num = 0
				for(let i=0;i<checkAllArr.length;i++){
				num += checkAllArr[i]
				}
				if(num == checkAllArr.length){
				this.authorize.list[i].selection = 1
			}
			}
		},
		//菜单全选和权限名称勾选控制模块全选
		handleSelection(data){
			let inum = 0
			let num = 0
			for(let i in data.menu){
			inum++
			num += data.menu[i].checkAll
			}
			if(num == inum){
			  data.selection = 1
			}else{
				data.selection = 0
			}
		},
		//菜单全选
		selectAll(item,fatherData) {
			if (item.checkAll == '1') {
				for (const elem of item.func) {
				elem.checked = 1
				}
			} else {
				for (const elem of item.func) {
					elem.checked = 0
				}
			}
			this.handleSelection(fatherData)
		},
		//模块全选
		checkAllFn(itemData){
			if (itemData.selection == '1') {
				for (const elem in itemData.menu) {
				itemData.menu[elem].checkAll = 1
				this.selectAll(itemData.menu[elem],itemData)
				}
			} else {
				for (const elem in itemData.menu) {
				itemData.menu[elem].checkAll = 0
				this.selectAll(itemData.menu[elem],itemData)
				}
			}
		},
		//权限名称勾选
		handleCheckedCitiesChange(data,item,fatherData){
			let sum = 0
			for(let i=0;i<data.length;i++ ){
				sum += data[i].checked
			}
			if(sum === data.length){
				item.checkAll = 1
			}else{
				item.checkAll = 0
			}
			this.handleSelection(fatherData)
		},
		//授权提交
		submitAuthorize(){
			let url = ''
			if(this.num == '1'){
          url = 'setroleRole'
			}else if(this.num == '2'){
          url = 'organSetrole'
			}else if(this.num == '3'){
          url = 'brokerSetrole'
			}
			const authorizeList = this.authorize.list
			const func = []
			this.authorize.loading = true
			for(let i = 0;i<authorizeList.length;i++){
				for(let k in authorizeList[i].menu){
					for(let j = 0;j<authorizeList[i].menu[k].func.length;j++){
						if(authorizeList[i].menu[k].func[j].checked === 1){
						func.push(authorizeList[i].menu[k].func[j].id)
						}
					}
				}
			}
			commonRequest(url,{
				organ_id: this.authorize.id,
				func: func.join(','),
			}).then(res =>{
				this.authorize.loading = false
				if(res.code == '200'){
				this.$message(res.msg)
				}else{
				this.$message(res.msg)
				}
			}).catch(error =>{
				this.authorize.show = false
				})
		},
	},
	created() {
		
		}
	}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	.op{
    .table-btn-text{
      float: left;
    } 
  }
  table{
    display: table;
    border-collapse: separate;
    border-spacing: 0px;
    border-color: grey;
  }
  .authorize-table{
    border: 1px solid #dfe6ec; 
    border-bottom: 0px;
    table{
      width: 100%;
    }
    width: 900px;
    th{
      color: #1f2d3d;
      height: 40px;
      overflow: hidden;
      background-color: #eef1f6;
      text-align: center;
      border-bottom: 1px solid #dfe6ec;
      border-right: 1px solid #dfe6ec;
      &:last-child{
        border-right: 0px;
      }
    }
    td{
      height: 40px;
      overflow: hidden;
      text-align: center;
      border-bottom: 1px solid #dfe6ec;
      border-right: 1px solid #dfe6ec;
      &.align-left{
        text-align: left;
      }
      &:last-child{
        margin-bottom: -1px;
        border-right: 0px;
      }
    }
    .el-col{
      padding: 5px 0px 5px 10px;
    }
    .el-checkbox__label{
      white-space: normal;
    }
    margin-bottom: 30px;
    .border-bottom-none{
      border-bottom: 0px !important;
    }
  }
  .mt-30{
    margin-top: 28px !important;
  }
</style>