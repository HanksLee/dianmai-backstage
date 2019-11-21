<template>
  <div class="page page-zerocycle">
    <div class="page-header">
      <span>T+0股票池</span>
    </div>
    <div class="page-con">
      <div class="operation-container">
        <div class="item">
          <el-button type="primary" icon="el-icon-plus" @click="add">新增</el-button>
        </div>
        <div class="item">
          <el-upload class="upload-demo" 
              :action="api_root" 
              accept="xls,xlsx" 
              :data="dataObj" 
              :show-file-list="false" 
              :on-success="successFn" 
              :on-error="errorFn" 
              :before-upload="handbeforeupload">
							<el-button class="el-blue-btn" 
                 :loading="is_importdata" 
                 size="small" 
                 type="primary" icon="el-icon-upload2">
                 导入excel
              </el-button>
						</el-upload>
        </div>
        <div class="item">
					<el-button type="primary" icon="el-icon-download" @click="downloadTemplate" :loading="downloadLoading">下载excel模板</el-button>
        </div>
        <div class="item">
          <el-select v-model="market" placeholder="交易市场" @change="changeStatus">
            <el-option v-for="item in marketTypeOpts" :key="item.key" :label="item.name" :value="item.key">
            </el-option>
          </el-select>
        </div>
        <div class="item">
          <el-select v-model="selltype" multiple placeholder="融买融卖" @change="changeStatus">
            <el-option v-for="item in marginStatusOpts" :key="item.key" :label="item.name" :value="item.key">
            </el-option>
          </el-select>
        </div>
        <div class="item">
          <el-input placeholder="股票名称/股票代码" v-model="keyword">
            <el-button slot="append" icon="el-icon-search" @click="searchList"></el-button>
          </el-input>
        </div>
      </div>
      <div class="table-data">
        <el-table :data="list" :emptyText="emptyText" border style="width:100%">
          <el-table-column prop="market_id" label="交易市场" label-class-name="labelClass" min-width="100" fixed="left">
            <template slot-scope="scope">
              <span v-if="scope.row.market_id=='0'">上证</span>
              <span v-if="scope.row.market_id=='1'">深圳主板</span>
              <span v-if="scope.row.market_id=='2'">深圳创业主板</span>
              <span v-if="scope.row.market_id=='3'">港股</span>
              <span v-if="scope.row.market_id=='4'">美股</span>
              <span v-if="scope.row.market_id=='5'">ETF</span>
              <span v-if="scope.row.market_id=='6'">上期所<em v-if="scope.row.grounding_status == '1'" style="color:#f00">(下架)</em></span>
							<span v-if="scope.row.market_id=='7'">大商所<em v-if="scope.row.grounding_status == '1'" style="color:#f00">(下架)</em></span>
							<span v-if="scope.row.market_id=='8'">郑商所<em v-if="scope.row.grounding_status == '1'" style="color:#f00">(下架)</em></span>
							<span v-if="scope.row.market_id=='9'">中金所<em v-if="scope.row.grounding_status == '1'" style="color:#f00">(下架)</em></span>
							<span v-if="scope.row.market_id=='10'">上期所<em v-if="scope.row.grounding_status == '1'" style="color:#f00">(下架)</em></span>
              <span v-if="scope.row.market_id=='-1'">-1</span>
              <span v-if="scope.row.market_id==null">--</span>
              <span v-if="scope.row.market_id=='11'">科创板</span>
            </template>
          </el-table-column>  
          <el-table-column prop="stock_name" label="股票名称" label-class-name="labelClass" min-width="100">
          </el-table-column>
          <el-table-column prop="stock_code" label="股票代码" label-class-name="labelClass" min-width="100"></el-table-column>
          <el-table-column prop="stock_type" label="交易类型" label-class-name="labelClass" min-width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.stock_type=='0'">股票</span>
              <span v-if="scope.row.stock_type=='1'">指数.</span>
              <span v-if="scope.row.stock_type=='2'">指数</span>
            </template>
          </el-table-column> 
          <el-table-column prop="margin_left" label="股票数量" label-class-name="labelClass" min-width="100"></el-table-column>
          <el-table-column prop="margin_status_name" label="融买融卖" label-class-name="labelClass" min-width="170">
          </el-table-column>
          <el-table-column prop="broker_withhold_name" label="券商代扣方式" label-class-name="labelClass" min-width="170">
          </el-table-column>
          <el-table-column prop="commis_type" label="手续费" label-class-name="labelClass" min-width="100">
             <template slot-scope="scope">
               <div v-if="scope.row.commis_type == '1'">{{scope.row.commission}}/每手</div>
               <div v-if="scope.row.commis_type == '2'">{{scope.row.commission}}</div>
             </template>
          </el-table-column>
           <el-table-column prop="price_min_charge" label="最小波动价位" label-class-name="labelClass" min-width="100">
          </el-table-column>
          <el-table-column prop="margin_rate" label="最低交易操作资金(百分比)" label-class-name="labelClass" min-width="100">
          </el-table-column>
          <el-table-column prop="spread" label="点差" label-class-name="labelClass" min-width="100">
          </el-table-column>
          <el-table-column prop="contract_size" label="合约大小" label-class-name="labelClass" min-width="100">
          </el-table-column>
          <el-table-column prop="digits" label="小数点位数" label-class-name="labelClass" min-width="100">
          </el-table-column>
          <el-table-column prop="pip_value" label="单位" label-class-name="labelClass" min-width="100">
          </el-table-column>
          <el-table-column prop="user_admin_name" label="操作人" label-class-name="labelClass" min-width="100"></el-table-column>
          <el-table-column prop="time_stamp" label="更新时间" label-class-name="labelClass" min-width="100"></el-table-column>
          <el-table-column label="操作" label-class-name="labelClass" min-width="100" fixed="right">
            <template slot-scope="scope">
              <el-dropdown @command="handleCommand">
                <span class="el-dropdown-link">更多<i class="el-icon-caret-bottom el-icon--right"></i></span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item :command="{cmd:1, row:scope.row}">编辑</el-dropdown-item>
                  <el-dropdown-item :command="{cmd:2, row:scope.row}" v-if="scope.row.market_id !=='6' && scope.row.market_id !=='7' && scope.row.market_id !=='8' && scope.row.market_id !=='9' &&scope.row.market_id !=='10'">删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页开始 -->
      <!-- 分页 -->
      <paging :getList="getList" :page="page" ref="subassemblyData"></paging>
      <!-- 分页结束 -->
    </div>
    <el-dialog :title="dialogTitle" class="dialog1 dialog-s" :visible.sync="dialogShow">
      <div class="dialog-page">
        <div class="dialog-section" style="margin-top: 0;">
          <el-form>
            <el-row>
              <el-col :span="4"><span class="label">交易类型：</span></el-col>
              <el-col :span="10">
                <div class="label-val">
                  <el-radio v-model="stockParams.stock_type" label="0">股票</el-radio>
                  <el-radio v-model="stockParams.stock_type" label="1">指数.</el-radio>
                  <el-radio v-model="stockParams.stock_type" label="2">指数</el-radio>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4"><span class="label">股票代码：</span></el-col>
              <el-col :span="6">
                <div class="label-val">
                  <el-autocomplete popper-class="my-autocomplete" v-model="stockParams.stock_code" :disabled="disabled" :fetch-suggestions="querySearch" custom-item="my-item-zh" placeholder="股票代码" @select="handleSelect" style="width: 145px !important">
                    <template slot-scope="{ item }">
                      <span class="name">{{item.stock_name}}</span>
                      <span>{{item.stock_code}}</span>
                    </template>
                  </el-autocomplete>
                </div>
              </el-col>
              <el-col :span="4"><span class="label">股票市场：</span></el-col>
              <el-col :span="6">
                <div class="label-val">
                  <el-input :disabled="true" v-model="stockParams.market_name" placeholder="股票市场"></el-input>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4"><span class="label">股票名称：</span></el-col>
              <el-col :span="6">
                <div class="label-val">
                  <el-input :disabled="true" v-model="stockParams.stock_name" placeholder="股票名称"></el-input>
                </div>
              </el-col>
              <el-col :span="4"><span class="label">股票数量：</span>
              </el-col>
              <el-col :span="6">
                <div class="label-val">
                  <el-input v-model="stockParams.margin_left" placeholder="股票数量"></el-input>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4"><span class="label">融买融卖：</span></el-col>
              <el-col :span="6">
                <div class="label-val">
                  <el-select v-model="stockParams.margin_status" multiple placeholder="请选择">
                    <el-option v-for="item in marginStatusOpts" :key="item.key" :label="item.name" :value="item.key">
                    </el-option>
                  </el-select>
                </div>
              </el-col>
            </el-row>
            <div style="border-top:1px solid #ccc;"></div>
            <el-row>
              <el-col :span="4"><span class="label">券商代扣方式：</span></el-col>
              <el-col :span="6">
                <div class="label-val">
                  <el-select v-model="stockParams.broker_withhold" multiple :disabled="disabled1" placeholder="请选择">
                    <el-option v-for="item in collectArr" :key="item.key" :label="item.name" :value="item.key">
                    </el-option>
                  </el-select>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4"><span class="label">收费方式：</span></el-col>
              <el-col :span="8">
                <div class="radio-8">
                  <el-radio :disabled="disabled1" v-model="stockParams.commis_type" label="1">按手数</el-radio>
                  <el-radio :disabled="disabled1" v-model="stockParams.commis_type" label="2">按百分比</el-radio>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="label-val" style="width:100%;">
                  <el-tooltip class="item" effect="dark" content="请输入按手数金额或百分比比率收费，例如：3元/每手或0.0001" placement="top">
                  <el-input :disabled="disabled1" v-model="stockParams.commission" placeholder="请输入按手数金额或百分比比率"></el-input>
                  </el-tooltip>
                </div>
              </el-col>
            </el-row>
            <el-row v-if="stockParams.stock_type == '1' || stockParams.stock_type == '2'">
              <el-col :span="4"><span class="label">最小波动价位：</span></el-col>
              <el-col :span="6">
                <div class="label-val">
                  <el-input v-model="stockParams.price_min_charge" placeholder="请输入最小波动价位"></el-input>
                </div>
              </el-col>
              <el-col :span="7"><span class="label" style="width:174px;">最低交易操作资金比率(百分比)：</span></el-col>
              <el-col :span="7">
                <div class="label-val">
                  <el-tooltip class="item" effect="dark" content="请输入大于0小于1的值" placement="top">
                    <el-input v-model="stockParams.margin_rate" placeholder="请输入大于0小于1的值"></el-input>
                  </el-tooltip>
                </div>
              </el-col>
            </el-row>
            <el-row v-if="stockParams.stock_type == '1' || stockParams.stock_type == '2'">
              <el-col :span="4"><span class="label">点差：</span></el-col>
              <el-col :span="6">
                <div class="label-val"><el-input v-model="stockParams.spread" placeholder="请输入点差"></el-input></div>
              </el-col>  
              <el-col :span="4"><span class="label">合约大小：</span></el-col>
              <el-col :span="6">
                <div class="label-val"><el-input v-model="stockParams.contract_size" placeholder="请输入合约大小"></el-input></div>
              </el-col>  
            </el-row>
            <el-row v-if="stockParams.stock_type == '1' || stockParams.stock_type == '2'">
              <el-col :span="4"><span class="label">小数点位数：</span></el-col>
              <el-col :span="6">
                <div class="label-val"><el-input v-model="stockParams.digits" placeholder="请输入小数点位数"></el-input></div>
              </el-col>  
              <el-col :span="4"><span class="label">pip单位：</span></el-col>
              <el-col :span="6">
                <div class="label-val"><el-input v-model="stockParams.pip_value" placeholder="请输入pip单位"></el-input></div>
              </el-col>  
            </el-row>
            <!--<el-row>
              <el-col :span="4"><span class="label">上下架状态：</span></el-col>
              <el-col :span="6">
                <div class="label-val">
                  <el-select v-model="stockParams.grounding_status" placeholder="请选择">
                    <el-option v-for="item in groundingStatusOpts" :key="item.key" :label="item.name" :value="item.key">
                    </el-option>
                  </el-select>
                </div>
              </el-col>
              <el-col :span="4"><span class="label">上下架时间：</span></el-col>
              <el-col :span="6">
                <div class="label-val">
                  <el-date-picker v-model="stockParams.grounding_date" type="datetime" placeholder="请选择上下架时间" default-time="00:00:00">
                  </el-date-picker>
                </div>
              </el-col>
            </el-row>-->
          </el-form>
        </div>
        <div class="dialog-bottom">
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogShow = false">取 消</el-button>
            <el-button type="primary" @click="submit">提交</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script src="./index.js">
</script>

<style rel="stylesheet/scss" lang="scss">
 .page-zerocycle .el-input .el-input__inner {
 	height: 40px;
 }
 .radio-8{
   line-height:38px;
 }
 .main-container .app-main .el-col-4{
   margin:0;
 }
</style>
