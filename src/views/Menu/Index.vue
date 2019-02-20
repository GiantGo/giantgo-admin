<template>
  <div class="app-container bg-color">
    <el-row>
      <el-col :xs="24" :sm="24" :lg="8" style="padding: 10px;">
        <div class="menu-tree">
          <el-tree
            :data="menus"
            node-key="id"
            default-expand-all
            :expand-on-click-node="false"
            :props="defaultProps"
            draggable
            @node-drop="handleDrop"
            @node-click="editMenu">
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span>
                <svg-icon class-name="drag-icon" icon-class="menu" v-if="data.id !== -1"/>{{ node.label }}
              </span>
              <span>
                <el-button
                  type="text"
                  size="mini"
                  @click="($event) => addMenu(data, node, $event)">
                  添加
                </el-button>
                <el-button
                  type="text"
                  size="mini"
                  v-if="data.id !== -1"
                  @click="($event) => removeMenu(data, node, $event)">
                  删除
                </el-button>
              </span>
            </span>
          </el-tree>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="16" style="padding: 10px;">
        <div class="menu-form">
          <div class="menu-breadcrumb">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item
                v-for="(item, index) in menuBreadcrumbs"
                :key="index">
                {{item.title}}
              </el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <el-form ref="menuForm" :model="menuForm" :rules="menuRule" label-position="left" label-width="120px">
            <el-form-item label="标题" prop="title">
              <el-input v-model="menuForm.title" :disabled="menuForm.id === -1"></el-input>
            </el-form-item>
            <el-form-item label="图标" prop="icon">
              <el-input v-model="menuForm.icon" :disabled="menuForm.id === -1"></el-input>
            </el-form-item>
            <el-form-item label="路径" prop="path">
              <el-input v-model="menuForm.path" :disabled="menuForm.id === -1"></el-input>
            </el-form-item>
            <el-form-item label="权限名称" prop="permissionName">
              <el-input v-model="menuForm.permissionName" :disabled="menuForm.id === -1"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="default" @click="resetMenu">重 置</el-button>
              <el-button type="primary" @click="saveMenu">保 存</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'Menu',
    data () {
      return {
        defaultProps: {
          children: 'children',
          label: 'title'
        },
        menuBreadcrumbs: [],
        menuForm: {
          id: '',
          title: '',
          icon: '',
          path: '',
          permissionName: '',
          isSubmitting: false
        },
        menuRule: {
          title: [
            {required: true, message: '请输入标题', trigger: 'change'}
          ],
          icon: [
            {required: true, message: '请输入图标', trigger: 'change'}
          ],
          path: [
            {required: true, message: '请输入路径', trigger: 'change'}
          ]
        },
        menus: []
      }
    },
    computed: {
      ...mapGetters([])
    },
    methods: {
      getMenuList () {
        this.$store.dispatch('getMenuTree').then(res => {
          this.menus = [{
            id: -1,
            title: '根',
            path: '/',
            children: res.data
          }]
        }).catch(() => {
          this.$message.error('获取菜单失败')
        })
      },
      generateMenuBreadcrumb (breadcrumbs, node) {
        if (node && node.level > 0) {
          breadcrumbs.unshift(node.data)
        }

        if (node.parent && node.parent.level > 0) {
          this.generateMenuBreadcrumb(breadcrumbs, node.parent)
        }

        return breadcrumbs
      },
      addMenu (data, node, e) {
        e.stopPropagation()
        this.menuForm.id = ''
        this.menuForm.parentId = data.id
        this.menuForm.title = ''
        this.menuForm.icon = ''
        this.menuForm.path = ''
        this.menuForm.permissionName = ''
        this.menuBreadcrumbs = this.generateMenuBreadcrumb([this.menuForm], node)
        this.$nextTick(() => {
          this.$refs.menuForm.clearValidate()
        })
      },
      editMenu (menu, node) {
        this.menuForm.id = menu.id
        this.menuForm.parentId = menu.parentId
        this.menuForm.title = menu.title
        this.menuForm.icon = menu.icon
        this.menuForm.path = menu.path
        this.menuForm.permissionName = menu.permissionName
        this.menuBreadcrumbs = this.generateMenuBreadcrumb([this.menuForm], node.parent)
        this.$nextTick(() => {
          this.$refs.menuForm.clearValidate()
        })
      },
      removeMenu (menu, node, e) {
        e.stopPropagation()
        this.$confirm('确定要删除菜单信息吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store.dispatch('deleteMenu', {
            menuId: menu.id
          }).then(() => {
            this.$message.success('删除成功')
            this.getMenuList()
          })
        }).catch(() => {
          this.$message.info('已取消')
        })
      },
      resetMenu () {
        this.$refs.menuForm.resetFields()
      },
      saveMenu () {
        this.$refs.menuForm.validate((valid) => {
          if (valid) {
            this.menuForm.isSubmitting = true

            this.$store.dispatch(!this.menuForm.id ? 'createMenu' : 'updateMenu', {
              id: this.menuForm.id,
              parentId: this.menuForm.parentId,
              title: this.menuForm.title,
              icon: this.menuForm.icon,
              path: this.menuForm.path,
              permissionName: this.menuForm.permissionName
            }).then(() => {
              this.menuForm.isSubmitting = false
              this.getMenuList()
              this.$message.success('保存成功')
            }).catch(() => {
              this.menuForm.isSubmitting = false
              this.$message.error('保存失败')
            })
          }
        })
      },
      handleDrop (draggingNode, dropNode, dropType, ev) {
        console.log('tree drop: ', draggingNode, dropNode, dropType)
      }
    },
    mounted () {
      this.getMenuList()
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  .menu-tree {
    padding: 20px;
    background: #ffffff;
    .el-tree-node__content {
      height: 30px;
    }
  }
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }

  .drag-icon {
    margin-right: 5px;
  }

  .menu-form {
    padding: 20px;
    background: #ffffff;

    .menu-breadcrumb {
      margin-bottom: 20px;
      height: 15px;
    }
  }
</style>
