<template>
    <el-container style="height: 100%;">
        <el-header>
            <header-menu></header-menu>
        </el-header>
        <el-container>
            <el-aside width="230px">
                <side-menu :menus="menus"></side-menu>
            </el-aside>
            <el-container>
                <el-main class="main">
                    <div class="breadcrumb-container">
                        <el-breadcrumb separator="/" class="breadcrumb-inner">
                            <el-breadcrumb-item>当前位置：首页</el-breadcrumb-item>
                        </el-breadcrumb>
                    </div>
                    <transition name="fade" mode="out-in">
                        <router-view></router-view>
                    </transition>
                </el-main>
                <el-footer>
                    <footer-menu></footer-menu>
                </el-footer>
            </el-container>
        </el-container>
    </el-container>
</template>

<script>
  import headerMenu from '../components/HeaderMenu.vue'
  import footerMenu from '../components/FooterMenu.vue'
  import sideMenu from '../components/SideMenu.vue'
  import { mapGetters } from 'vuex'

  export default {
    name: 'app',
    data () {
      return {
        menus: [
          {
            title: '控制面板',
            url: 'dashboard',
            icon: 'el-icon-bell'
          },
          {
            title: '推荐管理',
            url: 'recommend',
            icon: 'el-icon-star-on'
          },
          {
            title: '内容管理',
            url: 'content',
            icon: 'el-icon-document'
          },
          {
            title: '系统设置',
            icon: 'el-icon-setting',
            url: 'system',
            subMenus: [
              {
                title: '模型管理',
                url: 'system_models'
              }
            ]
          }
        ]
      }
    },
    components: {headerMenu, sideMenu, footerMenu},
    computed: {
      ...mapGetters([])
    },
    mounted () {
      return this.$store.dispatch('getMyInfo').catch(() => {
        this.$store.dispatch('logout')
        this.$router.push({name: 'signIn'})
      })
    }
  }
</script>

<style lang="scss">
</style>
