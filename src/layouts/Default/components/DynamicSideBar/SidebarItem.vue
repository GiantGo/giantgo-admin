<template>
  <div class="menu-wrapper">
    <template v-if="!item.children || !item.children.length">
      <router-link :to="resolvePath(item.path)">
        <el-menu-item :index="resolvePath(item.path)" :class="{'submenu-title-noDropdown' : !isNest}">
          <svg-icon :icon-class="item.icon"></svg-icon>
          <span slot="title">{{item.title}}</span>
        </el-menu-item>
      </router-link>
    </template>
    <el-submenu v-else ref="submenu" :index="resolvePath(item.path)">
      <template slot="title">
        <svg-icon :icon-class="item.icon"></svg-icon>
        <span slot="title">{{item.title}}</span>
      </template>
      <template v-for="child in item.children">
        <sidebar-item
          v-if="child.children && child.children.length > 0"
          :is-nest="true"
          :item="child"
          :key="child.path"
          :base-path="resolvePath(child.path)"
          class="nest-menu"/>
        <router-link v-else :to="resolvePath(child.path)" :key="child.path">
          <el-menu-item :index="resolvePath(child.path)">
            <svg-icon :icon-class="child.icon"></svg-icon>
            <span slot="title">{{child.title}}</span>
          </el-menu-item>
        </router-link>
      </template>
    </el-submenu>
  </div>
</template>

<script>
  import path from 'path'
  import { isExternal } from '@/utils'
  import FixIOSBug from '@/mixins/FixIOSBug'

  export default {
    name: 'SidebarItem',
    components: {},
    mixins: [FixIOSBug],
    props: {
      // route object
      item: {
        type: Object,
        required: true
      },
      isNest: {
        type: Boolean,
        default: false
      },
      basePath: {
        type: String,
        default: ''
      }
    },
    data () {
      return {}
    },
    methods: {
      resolvePath (routePath) {
        if (!routePath) {
          return ''
        }

        if (this.isExternalLink(routePath)) {
          return routePath
        }
        return path.resolve(this.basePath, routePath)
      },
      isExternalLink (routePath) {
        return isExternal(routePath)
      }
    }
  }
</script>
