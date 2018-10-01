<template>
    <el-menu :default-active="currentIndex">
        <div v-for="(menu) in menus" :key="menu.title">
            <el-menu-item v-if="!menu.subMenus || !menu.subMenus.length" :index="menu.url">
                <router-link :to="{name: menu.url}">
                    <i :class="menu.icon"></i>{{menu.title}}
                </router-link>
            </el-menu-item>
            <el-submenu :index="menu.url" v-if="menu.subMenus && menu.subMenus.length">
                <template slot="title">
                    <i :class="menu.icon"></i>
                    <span>{{menu.title}}</span>
                </template>
                <el-menu-item v-for="(subMenu) in menu.subMenus" :key="subMenu.title"
                              :index="subMenu.url">
                    <router-link :to="{name: subMenu.url}">
                        {{subMenu.title}}
                    </router-link>
                </el-menu-item>
            </el-submenu>
        </div>
    </el-menu>
</template>
<style lang="scss" rel="stylesheet/scss" scoped>
    .el-aside {
        position: absolute;
        left: 0;
        height: 100%;
    }

    .el-menu {
        height: 100%;
        border-radius: 2px;
        list-style: none;
        position: relative;
        margin: 0;
        padding-left: 0;
        background-color: #eef1f6;
        .el-menu-item a {
            display: block;
            .active {
                color: #20a0ff;
            }
        }
    }
</style>
<script>
  export default {
    name: 'side-menu',
    data () {
      return {
        currentIndex: ''
      }
    },
    props: {
      menus: Array
    },
    components: {},
    created () {
      this.routeChange()
    },
    watch: {
      '$route': 'routeChange'
    },
    methods: {
      routeChange () {
        this.currentIndex = this.$route.name
      }
    },
    mounted () {
    }
  }
</script>
