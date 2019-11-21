<template>
  <el-table
    :data="data"
    border
    :show-header="false"
    style="width: 100%; text-align: left;"
    :row-style="showTr">
    <!-- <el-table-column
      type="selection"
      width="55">
    </el-table-column> -->
    <el-table-column v-for="(column, index) in columns" :key="column.dataIndex"
      :label="column.text" :type="column.type">
      <template alot-scope="scope">
        <div :class="[column.text == '姓名' ? 'textal' : '']">
          <span v-if="spaceIconShow(index)" v-for="(space, levelIndex) in scope.row._level" class="ms-tree-space"></span>
          <!-- toggleIconShow(index,scope.row) -->
          <button v-if="showBtn(column.text)" @click="toggle(scope.$index);fun(scope.row, scope.row._expanded, scope.$index)" style="border:0;background:transparent;outline:none;" class="button is-outlined is-primary is-small "  >
            <i v-if="!scope.row._expanded" class="el-icon el-icon-arrow-right" aria-hidden="true"></i>
            <i v-if="scope.row._expanded" class="el-icon el-icon-arrow-right el-table__expand-icon--expanded" aria-hidden="true"></i>
          </button>
          <span v-else-if="index===0" class="ms-tree-space"></span>
          <span v-if="column.text == 'IB级别'">
            <span v-for="(dx, index) in ibList" v-if="scope.row[column.dataIndex] == index">{{ dx }}</span>
          </span>
          <span v-else>
            {{scope.row[column.dataIndex] | formats}}
          </span>
        </div>

      </template>
    </el-table-column>
    <!-- <el-table-column label="操作" v-if="treeType === 'normal'" width="260">
      <template scope="scope">
        <el-checkbox v-model="checked">备选项</el-checkbox>
      </template>
    </el-table-column> -->
    <!-- <el-table-column label="操作" v-if="treeType === 'normal'" width="260">
      <template scope="scope">
        <button type="button" class="el-button el-button--default el-button--small">
          <router-link
            :to="{ path: requestUrl + 'edit', query: {id: scope.row.Oid} }"
            tag="span">
            编辑
          </router-link>
        </button>
      </template>
    </el-table-column> -->
  </el-table>
</template>
<script>
	import { commonRequest } from '@/api/api-user'
  import Utils from '../utils/index.js'
//  import Vue from 'vue'
  export default {
    name: 'tree-grid',
    filters: {
      formats(val) {
        if (!isNaN(val)) {
          const num = Number(val).toFixed(2)
          return parseFloat(num)
        } else {
          return val
        }
      },
    },
    props: {
      // ib级别列表
      list: {
        type: Array,
        default () {
          return []
        }
      },
      listParam: {
        type: Object,
        default () {
          return {}
        }
      },
// 该属性是确认父组件传过来的数据是否已经是树形结构了，如果是，则不需要进行树形格式化
      treeStructure: {
        type: Boolean,
        default: function () {
          return false
        }
      },
// 这是相应的字段展示
      columns: {
        type: Array,
        default: function () {
          return []
        }
      },
// 这是数据源
      // dataSource: {
      //   type: Array,
      //   default: function () {
      //     return []
      //   }
      // },
// 这个作用是根据自己需求来的，比如在操作中涉及相关按钮编辑，删除等，需要向服务端发送请求，则可以把url传过来
      requestUrl: {
        type: String,
        default: function () {
          return ''
        }
      },
// 这个是是否展示操作列
      treeType: {
        type: String,
        default: function () {
          return 'normal'
        }
      },
// 是否默认展开所有树
      defaultExpandAll: {
        type: Boolean,
        default: function () {
          return true
        }
      },
      id: {
        type: String,
        default () {
          return ''
        }
      }
    },
    data () {
      return {
        param: {
          user_id: this.id,
          type: 1,
        },
        dataSource: [],
      }
    },
    computed: {
    // 格式化数据源
      data: function () {
        let me = this
        if (me.treeStructure) {
          let data = Utils.MSDataTransfer.treeToArray(me.dataSource, null, null, me.defaultExpandAll)
          // console.log(data)
          return data
        }
        return me.dataSource
      }
    },
    created () {
      this.getInitTree()
    },
    methods: {
      // 处理数据以驱动视图
      handleArr (oArr, nArr, id, level) {
        // 遍历dataSource
        // 找到对应id 把新获得的数组添加进去
        // 添加进去前需要在被添加的对象扩展一个children数组 使得vue及treetable可以响应 更新视图
        for (let item of oArr) {
          if (item._level == level && item.user_id == id) {
            // 该层中存在
            // 扩展数组
            this.$set(item, 'children', nArr, id)
            // 退出递归
            return
          } else if (item.children) {
            // 当前层中如果不存在 则判断是否存在子节点 存在则继续遍历
            this.handleArr(item.children, nArr, id, level)
          }
        }
      },

      getInitTree () {
        commonRequest('getpositionreportnext', {
          user_id: this.param.user_id,
          start_time: this.listParam.begin_time,
          end_time: this.listParam.end_time
        }).then(res => {
          console.log(res)
          if (res.code == 200) {
            this.dataSource = res.data.list
            if (this.dataSource.length == 0) {
              this.$message('暂无下级')
            }
          } else {
            this.$message(res.msg)
          }
        }).catch(error => {
          console.log(error)
        })
      },

      //
      getTeamTree(trIndex, level) {
              commonRequest('getpositionreportnext', {
                user_id: this.param.user_id,
                start_time: this.listParam.begin_time,
                end_time: this.listParam.end_time
              }).then(res => {
                  console.log(res)
                  if (res.code == 200) {
                      const teamArr = res.data.list
                      if (teamArr.length > 0) {
                        this.handleArr(this.dataSource, teamArr, this.param.user_id, level)
                      } else {
                        this.toggle(trIndex)
                        this.$message('暂无下级')
                      }
                  } else {
                      this.$message(res.msg)
                  }
              }).catch(error => {
                  console.log(error)
              })
          },

          // 请求树数据
          fun (row, status, trIndex) {
            console.log(row.user_id)
            // 点击后发送请求 如果存在则尝试处理list然后显示
            // 如果不存在则提示没有
            if (status) {
              // console.log('展开......' + val)
              // 设置父级id
              this.param.user_id = row.user_id
              this.param.type = 1
              this.getTeamTree(trIndex, row._level)
            } else {
              // console.log('闭合......' + val)
            }
          },

      // 显示点击按钮
      showBtn (val) {
        if (val == '姓名') {
          return true
        } else {
          return false
        }
      },

    // 显示行
      showTr: function (row, index) {
        let show = (row._parent ? (row._parent._expanded && row._parent._show) : true)
        row._show = show
        return show ? '' : 'display:none;'
      },
    // 展开下级
      toggle: function (trIndex) {
        let me = this
        let record = me.data[trIndex]
        record._expanded = !record._expanded
      },
    // 显示层级关系的空格和图标
      spaceIconShow (index) {
        let me = this
        if (me.treeStructure && index === 0) {
          return true
        }
        return false
      },
    // 点击展开和关闭的时候，图标的切换
      toggleIconShow (index, record) {
        let me = this
        if (me.treeStructure && index === 0 && record.children && record.children.length > 0) {
          return true
        }
        return false
      },
      handleDelete () {
        this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  .textal {
    text-align: left;
  }
  .ms-tree-space{position: relative;
    top: 1px;
    display: inline-block;
    font-family: 'Glyphicons Halflings';
    font-style: normal;
    font-weight: 400;
    line-height: 1;
    width: 10px;
    height: 14px;}
  .ms-tree-space::before{content: ""}
  table td{
    line-height: 26px;
  }
  .el-table__expand-icon--expanded {
    -ms-transform: rotate(90deg);
    transform: rotate(90deg);
}
</style>
