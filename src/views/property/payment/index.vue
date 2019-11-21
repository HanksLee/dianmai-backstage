<template>
  <div class="page">
    <div class="page-header">
      <span>支付方式</span>
    </div>
    <div class="page-con" v-loading="loading" element-loading-text="加载中...">
      <div class="operation-container">
				<div class="item" v-if="globalPermission('v1_admin/paychannel/add')">
					 <el-button type="primary" icon="el-icon-plus" @click="add">新增</el-button>
				</div>
      </div>  
      <div class="table-data">
        <el-table :data="list"  :emptyText="emptyText" style="width: 100%">
          <el-table-column prop="id" label="ID" width="100"></el-table-column>
          <el-table-column prop="ctype" label="支付类型"></el-table-column>
          <el-table-column prop="direct_type" label="连接方式">
              <template slot-scope="scope">
                <div v-if="scope.row.direct_type == '0'">非直连</div>
                <div v-if="scope.row.direct_type == '1'">直连</div>
                <div v-if="scope.row.direct_type == '2'">快捷</div>
                <div v-if="scope.row.direct_type == '3'">扫码</div>
                <div v-if="scope.row.direct_type == '4'">快捷非直连</div>
              </template>
          </el-table-column>
          <el-table-column prop="show_name" label="通道名称"></el-table-column>
          <el-table-column prop="bussiness_name" label="商户名称"></el-table-column>
          <el-table-column prop="bussiness_no" label="商户号"></el-table-column>
          <el-table-column prop="create_time" label="时间" align="center"></el-table-column>
          <el-table-column prop="in_money_limit_min" label="最低入金" sortable>
            <template slot-scope="scope">
							<div>{{scope.row.in_money_limit_min | numberFormat}}</div>
						</template>	
          </el-table-column>
          <el-table-column prop="in_money_limit" label="最高入金" sortable>
            <template slot-scope="scope">
							<div>{{scope.row.in_money_limit | numberFormat}}</div>
						</template>	
          </el-table-column>
          <el-table-column prop="in_money_rate" label="入金手续费" sortable>
              <template slot-scope="scope">
							<div>{{scope.row.in_money_rate | numberFormat}}</div>
						</template>
          </el-table-column>
          <el-table-column prop="status" label="状态"  align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.status=='1'" style="color:rgb(103, 194, 58)">启用</div>
              <div v-else style="color:#f00">禁用</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150" align="center">
            <template slot-scope="scope">
              <el-dropdown @command="handleCommand" :row = scope.row>
                <span class="el-dropdown-link">更多<i class="el-icon-caret-bottom el-icon--right"></i></span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item :command="{cmd:1,row: scope.row}" v-if="globalPermission('v1_admin/paychannel/edit')">编辑</el-dropdown-item>
                  <el-dropdown-item :command="{cmd:2,row: scope.row}" v-if="globalPermission('v1_admin/paychannel/switch')">
                       <div v-if="scope.row.status == '1'">禁用</div>
                       <div v-else>启用</div>
                  </el-dropdown-item>
                  <!--点击这里跳转路由 转到新模块 —— > 通道管理  -->
                  <el-dropdown-item :command="{row: scope.row, type: 'passM'}">通道管理</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页-->
		   <paging :getList="getList" :page="page" ref="subassemblyData"></paging>
      <div>
      </div>
      <!-- 创建/编辑管理员 -->
      <el-dialog :title="dialogTitle" class="dialog1 dialog-m" :visible.sync="dialogShow" :before-close="closeFn">
        <div class="dialog-page">
          <div class="dialog-page-con">
            <div :class="[isDH ? [dialogDl,dialogDl2,lukeDl] : [dialogDl,dialogDl2]]">

              <dl class="mt5">
                <dt>通道类型</dt>
                <dd>
                  <el-select :disabled="isSelect" v-model="payMentInfo.pay_channel_id" placeholder="请选择" @change="changeChooseType()">
                    <el-option
                      v-for="item in payTypes"
                      :key="item.id"
                      :label="item.channel_name"
                      :value="item.id"
                      >
                    </el-option>
                  </el-select>
                </dd>
                <dt v-if="!isDH">通道名称</dt>
                <dd>
                  <el-input v-if="!isDH" v-model="payMentInfo.show_name" placeholder="通道名称"></el-input>
                </dd>
              </dl>

              <div v-if="!isDH">

                <dl>
                  <dt v-if="!isDH">商户名称</dt>
                <dd>
                  <el-input v-if="!isDH" v-model="payMentInfo.bussiness_name" placeholder="商户名称"></el-input>
                </dd>

                  <dt>商户编号</dt>
                  <dd>
                    <el-input v-model="payMentInfo.bussiness_no"  placeholder="商户编号"></el-input>
                  </dd>

                </dl>
                <dl>
                   <dt>结算账户</dt>
                  <dd>
                    <el-input v-model="payMentInfo.card_no" placeholder="账号"></el-input>
                  </dd>
                  <dt>公钥</dt>
                  <dd>
                    <el-input v-model="payMentInfo.public_key" placeholder="公钥"></el-input>
                  </dd>
                </dl>
                <dl>
                    <dt>私钥</dt>
                  <dd>
                    <el-input  v-model="payMentInfo.secret_key" placeholder="私钥"></el-input>
                  </dd>
                  <dt>支持货币</dt>
                  <dd>
                    <!--multiple-->
                    <el-select v-model="currency_pay_type" multiple placeholder="请选择">
                      <el-option
                        v-for="item in options"
                        :key="item.key"
                        :label="item.name"
                        :value="item.key">
                      </el-option>
                    </el-select>
                  </dd>
                </dl>
                <dl>
                  <dt>商户key</dt>
                  <dd>
                    <el-input v-model="payMentInfo.partner_key"  placeholder="商户key"></el-input>
                  </dd>
                <dt>银行/三方</dt>
                  <dd>
                    <el-select v-model="payMentInfo.bank_union">
                      <el-option label="网银支付" value="0"></el-option>
                      <el-option label="跳转第三方官网" value="1"></el-option>
                    </el-select>
                  </dd>
                </dl>
                <dl>
                  <dt>支付域名</dt>
                  <dd>
                    <el-input v-model="payMentInfo.pay_domain"  placeholder="支付域名"></el-input>
                  </dd>
                  <dt>直连方式</dt>
                  <dd>
                    <!--multiple-->
                    <el-select v-model="payMentInfo.direct_type"  placeholder="请选择">
                      <el-option
                        v-for="item in directTypeOptions"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </dd>
                </dl>
                <dl>
                <dt>最低入金</dt>
                  <dd>
                    <el-input v-model="payMentInfo.in_money_limit_min"  placeholder="最低入金限额"></el-input>
                  </dd>
                  <dt>最高入金</dt>
                  <dd>
                    <el-input v-model="payMentInfo.in_money_limit"  placeholder="最高入金限额"></el-input>
                  </dd>
                </dl>
                <dl>
                	<dt>入金手续费</dt>
                  <dd>
                    <el-input v-model="payMentInfo.in_money_rate"  placeholder="入金手续费"></el-input>
                  </dd>
                	<dt>适用范围</dt>
                	<dd>
                		<el-select v-model="client_type" multiple style="width: 100%;">
											<el-option v-for="item in payTypeOps" :key="item.value" :label="item.name" :value="item.value" placeholder="请选择适用范围"></el-option>
										</el-select>
                	</dd>
                </dl>
                <dl>
                  <dt>实名认证</dt>
                  <dd>
                    <el-select v-model="payMentInfo.in_money_cond" style="width: 100%;">
											<el-option v-for="item in certificationData" :key="item.value" :label="item.label" :value="item.value" placeholder="请选择是否需要实名认证"></el-option>
										</el-select>
                  </dd>
                </dl>
                <!-- <dl v-if="payMentInfo.direct_type == '3'">
                  <dt>金额列表</dt>
                  <dd class="sumListBox">
                  <el-input v-model="payMentInfo.code_money" placeholder="请输入金额列表"></el-input>
                  <p style="color:#f00">输入多个金额，用逗号分开，例：100,200,300,400,500</p>
                  </dd>
                </dl> -->
                <dl v-if="payMentInfo.bank_union != 0">
                  <dt>登陆地址</dt>
                  <dd>
                    <el-input placeholder="请输入内容" v-model="payMentInfo.login_url"></el-input>
                  </dd>
                  <dt>注册地址</dt>
                  <dd style="margin-top: 3px;">
                    <el-input placeholder="请输入内容" v-model="payMentInfo.register_url"></el-input>
                    <!-- <el-input v-model="payMentInfo.in_money_rate"  placeholder="入金手续费"></el-input> -->
                  </dd>
                </dl>
                <dl style="border-top:1px solid #ccc;"></dl>
                <div class="htmlClass" v-if="htmlData.length>0">
                      <el-row>
                        <el-col :span="12" v-for="item in htmlData" :key="item.name">
                             <dt>{{item.text}}</dt>
                              <dd v-if="item.type ==='input' || item.type === 'textarea'">
                                <el-input :placeholder='"请输入"+item.text' v-model="htmlObj[item.name]" :type="item.type"></el-input>
                              </dd>
                              <dd v-else>
                                <el-select v-model="htmlObj[item.name]" :placeholder='"请选择"+item.text'>
                                  <el-option
                                    v-for="ite in item.data"
                                    :key="ite.value"
                                    :label="ite.text"
                                    :value="ite.value">
                                  </el-option>
                                </el-select>
                              </dd>
                        </el-col> 
                    </el-row>
                </div>
                 <dl>
                  <dt>备注</dt>
                  <dd class="textareaBox">
                    <el-input
                      type="textarea"
                      :rows="2"
                      :autosize="{ minRows: 3, maxRows: 6}"
                      placeholder="请输入内容"
                      v-model="payMentInfo.comment"
                      class="l-input">
                    </el-input>
                  </dd>
                </dl>
              </div>
              <div v-else class="dl-luke">
                <dl>
                  <dt>通道名称</dt>
                  <dd>
                    <el-input v-model="payDH.channel_name" placeholder="通道名称"></el-input>
                  </dd>
                </dl>
                <dl>
                  <dt>收款人名称（Company）</dt>
                  <dd>
                    <el-input v-model="payDH.bussiness_name" placeholder="收款人名称（Company）"></el-input>
                  </dd>
                </dl>
                <dl>
                  <dt>收款行所在国家（地区）</dt>
                  <dd>
                    <el-input v-model="payDH.country"  placeholder="收款行所在国家（地区）"></el-input>
                  </dd>
                </dl>
                <dl>
                  <dt>收款人账号（Account）</dt>
                  <dd>
                    <el-input v-model="payDH.card_no"  placeholder="收款人账号（Account）"></el-input>
                  </dd>
                </dl>
                <dl>
                  <dt>收款银行机构鉴定代码（Swift）</dt>
                  <dd>
                    <el-input v-model="payDH.identification_code"  placeholder="收款银行机构鉴定代码（Swift）"></el-input>
                  </dd>
                </dl>
                <dl>
                  <dt>收款人开户行（Bank）</dt>
                  <dd>
                    <el-input v-model="payDH.bank"  placeholder="收款人开户行（Bank）"></el-input>
                  </dd>
                </dl>
                <dl>
                  <dt>清算号（BSB）</dt>

                  <dd>
                    <el-input v-model="payDH.clearing_number"  placeholder="清算号（BSB）"></el-input>
                  </dd>
                </dl>
                <dl>
                  <dt>收款人地址（Address）</dt>
                  <dd>
                    <el-input v-model="payDH.address"  placeholder="收款人地址（Address）"></el-input>
                  </dd>
                </dl>
                <dl>
                  <dt>入金限额</dt>
                  <dd>
                    <el-input v-model="payDH.in_money_limit"  placeholder="入金限额"></el-input>
                  </dd>
                </dl>
                <dl>
                  <dt>入金手续费</dt>
                  <dd>
                    <el-input v-model="payDH.in_money_rate"  placeholder="入金手续费"></el-input>
                  </dd>
                </dl>
                <dl>
                  <dt>备注</dt>
                  <dd>
                    <el-input
                      type="textarea"
                      :rows="2"
                      :autosize="{ minRows: 3, maxRows: 6}"
                      placeholder="请输入内容"
                      v-model="payDH.remark"
                      class="l-input">
                    </el-input>
                  </dd>
                </dl>
              </div>
              </div>
            <div style="text-align: center;padding-top: 15px;">
            	<el-button @click="dialogShow = false" class="btn-m">取消</el-button>
              <el-button type="primary" @click="submit" class="btn-m">提交</el-button>
            </div>
            </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<style scoped  rel="stylesheet/scss" lang="scss">
  .page-header{
     padding-bottom: 20px;
  }
  .el-blue-btn{
    float: right;
  }
  .dialog-dl2{
    dl{
      padding-left: 10px;
    }
  }
  .dl-luke{
    display: flex;
    flex-direction:column;
    align-items: center;
  }

  .dl-luke dl{
    width: 600px;
    dt{
      width: 250px !important;
      text-align: left;
    }
  }
  .dialog-dl2 dd.textareaBox .l-input{width:450px !important;}

.dialog-m{
  dt{padding-right:12px;width:90px;}
  dd:nth-child(n){margin-right:50px;}
}
.htmlClass{
  .el-col-12{
       margin-bottom:15px;
  }  
}

 .dialog-dl2 dd.sumListBox .el-input{
   width:550px !important;
   margin-bottom:5px;
 }

</style>

<script src="./index.js">
</script>
