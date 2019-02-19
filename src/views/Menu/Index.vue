<template>
  <div class="app-container">
    <el-row>
      <el-col el-col :xs="24" :sm="24" :lg="8">
        <el-tree
          :data="menus"
          node-key="id"
          default-expand-all
          :expand-on-click-node="true"
          :props="defaultProps"
          draggable
          @node-drop="handleDrop">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <el-button
            type="text"
            size="mini"
            @click="() => addMenu(data)">
            添加
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="() => removeMenu(data)">
            删除
          </el-button>
        </span>
      </span>
        </el-tree>
      </el-col>
    </el-row>
    <el-dialog :title="menuDialog.title" :visible.sync="menuDialog.isShow" :close-on-click-modal="false">
      <el-form ref="menuForm" :model="menuForm" :rules="menuRule" label-position="left" label-width="120px"
               style="width: 400px; margin-left:50px;">
        <el-form-item label="标题" prop="title">
          <el-input v-model="menuForm.title"></el-input>
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input v-model="menuForm.icon"></el-input>
        </el-form-item>
        <el-form-item label="路径" prop="path">
          <el-input v-model="menuForm.path"></el-input>
        </el-form-item>
        <el-form-item label="权限名称" prop="permissionName">
          <el-input v-model="menuForm.permissionName"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeMenuDialog">取 消</el-button>
        <el-button type="primary" @click="saveMenu">确 定</el-button>
      </div>
    </el-dialog>
    <el-tooltip placement="top" content="返回顶部">
      <back-to-top :visibility-height="300" :back-position="50" transition-name="fade"></back-to-top>
    </el-tooltip>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import BackToTop from '@/components/BackToTop/Index'

  export default {
    name: 'Dashboard',
    components: {
      BackToTop
    },
    data () {
      return {
        defaultProps: {
          children: 'children',
          label: 'title'
        },
        menuDialog: {
          isShow: false,
          title: ''
        },
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
            id: '',
            title: 'root',
            children: res.data
          }]
        }).catch(() => {
          this.$message.error('获取菜单失败')
        })
      },
      addMenu (data) {
        this.menuDialog.isShow = true
        this.menuDialog.title = '创建菜单'
        this.menuForm.id = ''
        this.menuForm.parentId = data.id
        this.menuForm.title = ''
        this.menuForm.icon = ''
        this.menuForm.path = ''
        this.menuForm.permissionName = ''
        this.$nextTick(() => {
          this.$refs.menuForm.clearValidate()
        })
      },
      editMenu (menu) {
        this.menuDialog.isShow = true
        this.menuDialog.title = '编辑菜单'
        this.menuForm.id = menu.id
        this.menuForm.parentId = menu.parentId
        this.menuForm.title = menu.title
        this.menuForm.icon = menu.icon
        this.menuForm.path = menu.path
        this.menuForm.permissionName = menu.permissionName
        this.$nextTick(() => {
          this.$refs.menuForm.clearValidate()
        })
      },
      closeMenuDialog () {
        this.menuDialog.isShow = false
      },
      removeMenu (menu) {
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
              this.menuDialog.isShow = false
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
        console.log('tree drop: ', draggingNode.data.id, dropNode.data.id, dropType)
      }
    },
    mounted () {
      this.getMenuList()
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
