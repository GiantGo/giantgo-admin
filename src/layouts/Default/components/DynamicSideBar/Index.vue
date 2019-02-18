<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      mode="vertical"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF">
      <sidebar-item v-for="menu in menus" :key="menu.path" :item="menu" :base-path="menu.path"/>
    </el-menu>
  </el-scrollbar>
</template>

<script>
  import { mapGetters } from 'vuex'
  import SidebarItem from './SidebarItem'

  export default {
    components: {SidebarItem},
    computed: {
      ...mapGetters([
        'sidebar'
      ]),
      isCollapse () {
        return !this.sidebar.opened
      }
    },
    data () {
      return {
        menus: [
          {
            title: '首页',
            icon: 'chart',
            path: '/dashboard'
          }, {
            title: '图标',
            icon: 'icon',
            path: '/icon/index'
          }, {
            title: '系统设置',
            icon: 'chart',
            path: '/system',
            children: [
              {
                title: '用户管理',
                icon: 'peoples',
                path: 'user'
              }, {
                title: '角色管理',
                icon: 'user',
                path: 'role'
              }
            ]
          }
        ]
      }
    },
    mounted () {
    }
  }
</script>
