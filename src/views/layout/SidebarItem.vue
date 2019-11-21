<template>
  <div class='menu-wrapper'>
    <template v-for="item in routes">
      <router-link v-if="!item.hidden&&item.noDropdown&&item.children.length > 0" :to="item.path+'/'+item.children[0].path" :key="item.path">
        <el-menu-item :index="item.path+'/'+item.children[0].path" class='submenu-title-noDropdown'>
          <i class="fa" :class="item.icon"></i><span>{{item.children[0].name}}</span>
        </el-menu-item>
      </router-link>
      <el-submenu :index="item.name" v-if="!item.noDropdown&&!item.hidden" :key="item.path">
        <template slot="title">
          <i class="fa" :class="item.icon"></i><span>{{item.name}}</span>
        </template>
        <template v-for="child in item.children" v-if='!child.hidden'>
          <sidebar-item class='nest-menu' v-if='child.children&&child.children.length>0' :routes='[child]' :key="child.children"> </sidebar-item>
          <router-link v-else :to="item.path+'/'+child.path" :key="child.children">
            <el-menu-item :index="item.path+'/'+child.path">
            <template>  
                <i class="fa" :class="child.icon" v-if='child.icon'></i><span>{{child.name}}</span>
            </template> 
            </el-menu-item>
          </router-link>
        </template>
      </el-submenu>
    </template>
    <!-- <div 
    style="color:#fff;
    margin-top:30px;
    padding:15px 0;
    text-align:center;
    background:#fff;
    color:#3a8ee6;
    position:fixed;
    left:0;
    bottom:0;
    font-size:16px;
    width: 170px;"><router-link to="/workorder/submit">工单管理</router-link></div> -->
  </div>
</template>
<style rel="stylesheet/scss" lang="scss" scoped>
  .menu-wrapper{
    i.fa{
      width: 16px;
      margin-right: 10px;
      font-size: 14px;
      color: #fff;
      vertical-align: middle;
      margin-bottom: 2px;
    }
    i.fa-home{
      font-size: 17px;
    }
    i.fa-wrench{
      font-size: 16px;
    }
    i.fa-user{
      font-size: 16px;
    }
    i.fa-pencil-square{
      font-size: 15px;
    }
    i.fa-shield{
      font-size: 15px;
    }
  }
  .is-active.is-opened{
        i.fa{color: #fff;}
  }
.el-submenu__title:hover i.fa{color: #fff;}
.submenu-title-noDropdown.is-active i.fa{color: #fff;}
</style>
<script>
export default {
  name: 'SidebarItem',
  props: {
    routes: {
      type: Array
    },
    unaudited: {
      type: Object
    }
  },
}
</script>
