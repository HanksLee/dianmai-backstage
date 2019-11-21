<template>
  <div class="page">
    <div class="page-header">权限管理</div>
    <div class="page-con" v-loading="loading" element-loading-text="加载中...">
      <div class="operation-container">
        <div class="item">
          <el-button type="primary" icon="el-icon-plus"  @click="add">新增</el-button>
        </div>
        <div class="item">
          <input type="text" class="c-input w200" v-model="keyword" placeholder="模块/路由/页面" @keyup="search">
        </div>
        <div class="item">
          <el-button type="primary" @click="search">搜索</el-button>
        </div>
      </div>
      <div class="table-data">
        <el-table :data="list" :empty-text="emptyText" stripe border style="width: 100%">
          <el-table-column prop="func" label="路由" min-width="220"></el-table-column>
          <el-table-column prop="module_name" label="模块" min-width="100"></el-table-column>
          <el-table-column prop="menu_name" label="页面" min-width="150"></el-table-column>
          <el-table-column prop="func_name" label="说明" min-width="250"></el-table-column>
          <el-table-column prop="address" label="操作" min-width="150" align="center">
              <template slot-scope="scope">
                <span class="table-btn-text" @click="edit(scope.row)">编辑</span>
                <span class="table-btn-text" @click="del(scope.row)">删除</span>
              </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页 -->
      <paging :getList="getList" :page="page" ref="subassemblyData"></paging>
      <!-- 创建/编辑权限 -->
      <el-dialog :title="edit_title" class="dialog1 dialog-s" :visible.sync="edit_dialog_show">
        <div class="dialog-page">
          <div class="dialog-page-con">
             <div class="dialog-dl">
                <dl class="mt5">
                  <dt>路由</dt>
                  <dd>
                    <el-input  placeholder="请输入路由" v-model="permission.func"></el-input>
                  </dd>
                </dl>
                <dl>
                  <dt>模块</dt>
                  <dd>
                    <el-select  placeholder="请选择模块"  v-model="permission.module" @change="changeMoudle">
                      <el-option
                        v-for="item in menuList"
                        :key="item.id"
                        :label="item.menu_name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </dd>
                </dl>
                <dl>
                  <dt>页面</dt>
                  <dd>
                    <el-select  placeholder="请选择页面" v-model="permission.page">
                      <el-option
                        v-for="item in pageList"
                        :key="item.id"
                        :label="item.menu_name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </dd>
                </dl>
                <dl>
                  <dt>说明</dt>
                  <dd>
                    <el-input type="textarea" :autosize="{minRows:2, maxRows: 6}" placeholder="请输入说明"  v-model.trim="permission.func_name"></el-input>
                  </dd>
                </dl>
                <dl>
                  <dt>&nbsp;</dt>
                  <dd>
                    <el-button class="el-blue-btn commit-btn" @click="submitPermission" :loading="loading">提交</el-button>
                  </dd>
                </dl>
              </div>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<style rel="stylesheet/scss" lang="scss" scoped>
</style>
<script type="text/javascript" src="./index.js"></script>
