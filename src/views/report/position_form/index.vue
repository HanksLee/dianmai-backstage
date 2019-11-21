<template>
  <div class="page">
    <div class="page-header">
      持仓报表
    </div>
    <div class="operation-container">
      <div class="item">
					<!-- 用户筛选 -->
					<userScreening :getList="getList" ref="userScreeningDataInterface"></userScreening>
			</div>
      <div class="item">
        <el-date-picker
          v-model="listParam.checkTime"
          @change="timeChange"
          type="daterange"
          :picker-options="pickerOptions"
          placeholder="选择时间范围"
          align="left">
        </el-date-picker>
      </div>
      <div class="item">
        <el-button type="primary" @click="search">搜索</el-button>
      </div>
      <div class="item">
        <el-button style='margin-bottom:20px;' type="primary" icon="document" @click="handleDownload" :loading="downloadLoading">导出excel</el-button>
      </div>
    </div>

    <div class="table-data">
      <el-table :data="list" border show-summary :summary-method="formatCount" v-loading="loading" element-loading-text="数据加载中....">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <tree-grid :columns="columns" :defaultExpandAll="false" :tree-structure="true" :id="scope.row.user_id" :list="list" :listParam="listParam"></tree-grid>
          </template>
        </el-table-column>
        <el-table-column prop="user_name" label="姓名"></el-table-column>
        <el-table-column prop="user_tree_name" label="归属">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" :content="scope.row.user_tree_name" placement="right">
              <span>{{scope.row.user_tree_name}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="nums" label="操作资金" :sortable="true">
          <template slot-scope="scope">
            <span>{{ scope.row.nums | formats }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="lots" label="持仓量" :sortable="true">
          <template slot-scope="scope">
            <span>{{ scope.row.lots | formats }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="nums" label="持仓市值" :sortable="true">
          <template slot-scope="scope">
            <span>{{ scope.row.nums | formats }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="profit" label="浮动盈亏" :sortable="true">
          <template slot-scope="scope">
            <span>{{ scope.row.profit | formats }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="commission" label="递延费" :sortable="true">
          <template slot-scope="scope">
            <span>{{ scope.row.commission | formats }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="pagination">
      <el-pagination layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[50, 100, 200, 500]"
        :page-size="listParam.page_size" :total="listParam.total" :current-page="listParam.page_no">
      </el-pagination>
    </div>
    <!-- {{ this.customerFiltrate.belongTreeData }} -->
  </div>
</template>

<script src="./index.js"></script>
<script src="./pf.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .filtrate-btn{
    text-align: center;
    margin-top: 20px;
    .el-blue-btn{
      padding: 0px 20px;
    }
  }
  .dialog10 {
    .el-col-12{font-size:14px;}
    .margin-high{padding-left:100px;}
    .label{font-size:14px;text-align: left;text-indent:6px;}
  }
</style>
