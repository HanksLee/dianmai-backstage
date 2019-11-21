<template>
  <div class="page">
    <div class="page-header">角色管理</div>
    <div class="page-con" v-loading="loading" element-loading-text="加载中...">
      <div class="operation-container">
        <div class="item" v-if="globalPermission('v1_admin/role/add')">
          	<el-button type="primary" icon="el-icon-plus" @click="add">新增</el-button>
        </div>
      </div>
      <div class="table-data">
        <el-table :data="list" stripe border class="width100 op" :emptyText="emptyText" >
          <el-table-column prop="role_name" label="角色名称"></el-table-column>
          <el-table-column prop="address" label="操作"  width="330" align="center">
              <template slot-scope="scope">
								  <el-button type="text" size="mini" @click="edit(scope.row)" v-if="globalPermission('v1_admin/role/edit')">编辑</el-button>
									<el-button type="text" size="mini" @click="$refs.authorizeFn.roleAuthorize(scope.row,scope.row.role_name,'角色名称','jurisdiction','1')" v-if="globalPermission('v1_admin/role/setrole')">授权</el-button>
									<!-- <el-button type="text" size="mini" @click="del(scope.row)">删除</el-button> -->
									<!-- @click="delRole(scope.row)" 删除 -->
              </template>
          </el-table-column>
        </el-table>
      </div>
       <!-- 新增角色 -->
      <el-dialog :title="title" class="dialog1 dialog-s" :visible.sync="createDialogShow">
        <div class="dialog-page">
          <div class="dialog-page-con">
             <div class="dialog-dl">
                <dl class="mt5">
                  <dt>角色名称</dt>
                  <dd>
                    <el-input  placeholder="请输入角色名称" v-model="newRole.name"></el-input>
                  </dd>
                </dl>
                <dl>
                  <dt>&nbsp;</dt>
                  <dd>
                    <el-button class="el-blue-btn commit-btn" @click="createRole" :loading="creating">提交</el-button>
                  </dd>
                </dl>
              </div>
          </div>
        </div>
      </el-dialog>
      <!-- //授权 -->
      <authorize ref="authorizeFn"></authorize>
    </div>
  </div>
</template>
<style rel="stylesheet/scss" lang="scss" scoped>
</style>
<script type="text/javascript" src="./index.js"></script>
