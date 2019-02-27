<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit"
                 @click="addPermission">
        添加
      </el-button>
    </div>
    <tree-table :data="permissionTable" :expand-all="true" :columns="columns" border>
      <el-table-column prop="createdAt" label="创建日期">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createdAt) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200px" align="center">
        <template slot-scope="scope">
          <el-button type="primary" @click="editPermission(scope.row)">编 辑</el-button>
          <el-button type="danger" @click="deletePermission(scope.row)">删 除</el-button>
        </template>
      </el-table-column>
    </tree-table>
    <el-dialog :title="permissionDialog.title" :visible.sync="permissionDialog.isShow" :close-on-click-modal="false"
               width="600px">
      <el-form ref="permissionForm" :model="permissionForm" :rules="permissionRule" label-position="left"
               label-width="120px"
               style="width: 400px; margin-left:50px;">
        <el-form-item label="名称" prop="name">
          <el-input v-model="permissionForm.name"></el-input>
        </el-form-item>
        <el-form-item label="编码" prop="slug">
          <el-input v-model="permissionForm.slug"></el-input>
        </el-form-item>
        <el-form-item label="所属上级" prop="parentId">
          <tree-select v-model="permissionForm.parentId" :options="permissionTree"
                       :normalizer="treeSelectNormalizer({label: 'name'})"
                       placeholder="请选择所属上级"
                       @input="parentIdChange">
          </tree-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="closePermissionDialog">取 消</el-button>
        <el-button type="primary" @click="savePermission" :loading="permissionForm.isSubmitting">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import iconPicker from '@/components/Icon/Index'
  import treeTable from '@/components/TreeTable/Index'
  import { parseTime, treeSelectNormalizer } from '@/utils'
  import treeSelect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'

  export default {
    name: 'Dictionary',
    components: {
      iconPicker,
      treeTable,
      treeSelect
    },
    data () {
      const parentValidator = (rule, value, callback) => {
        console.log(123)
        if (value === this.permissionForm.id) {
          callback(new Error('所属上级不能是本身'))
        } else {
          callback()
        }
      }
      return {
        defaultProps: {
          children: 'children',
          label: 'title'
        },
        columns: [
          {
            text: '名称',
            value: 'name'
          },
          {
            text: '编码',
            value: 'slug'
          }
        ],
        permissionDialog: {
          isShow: false,
          title: ''
        },
        permissionForm: {
          id: '',
          name: '',
          slug: '',
          parentId: '',
          isSubmitting: false
        },
        permissionRule: {
          name: [
            {required: true, message: '请输入名称', trigger: 'change'}
          ],
          slug: [
            {required: true, message: '请输入编码', trigger: 'change'}
          ],
          parentId: [
            {required: true, message: '请选择所属上级', trigger: 'change'},
            {validator: parentValidator, trigger: 'change'}
          ]
        },
        permissionTable: [],
        permissionTree: []
      }
    },
    computed: {
      ...mapGetters([])
    },
    methods: {
      parseTime,
      treeSelectNormalizer,
      getPermissionTree () {
        this.$store.dispatch('getPermissionTree', {}).then(res => {
          this.permissionTable = res.data
          this.permissionTree = [{id: -1, name: '顶级', children: res.data}]
        })
      },
      parentIdChange () {
        this.$refs.permissionForm.validateField('parentId')
      },
      addPermission () {
        this.permissionDialog.isShow = true
        this.permissionDialog.title = '创建权限'
        this.permissionForm.id = ''
        this.permissionForm.name = ''
        this.permissionForm.slug = ''
        this.permissionForm.parentId = -1
        this.$nextTick(() => {
          this.$refs.permissionForm.clearValidate()
        })
      },
      editPermission (permission) {
        this.permissionDialog.isShow = true
        this.permissionDialog.title = '编辑权限'
        this.permissionForm.id = permission.id
        this.permissionForm.name = permission.name
        this.permissionForm.slug = permission.slug
        this.permissionForm.parentId = permission.parentId
      },
      deletePermission (permission) {
        this.$confirm('确定要删除权限' + permission.name + '吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store.dispatch('deletePermission', {
            permissionId: permission.id
          }).then(() => {
            this.$message.success('删除成功')
            this.getPermissionTree()
          })
        }).catch(() => {
          this.$message.info('已取消')
        })
      },
      closePermissionDialog () {
        this.permissionDialog.isShow = false
      },
      savePermission () {
        this.$refs.permissionForm.validate((valid) => {
          if (valid) {
            this.permissionForm.isSubmitting = true

            this.$store.dispatch(!this.permissionForm.id ? 'createPermission' : 'updatePermission', {
              id: this.permissionForm.id,
              name: this.permissionForm.name,
              slug: this.permissionForm.slug,
              parentId: this.permissionForm.parentId
            }).then(() => {
              this.permissionForm.isSubmitting = false
              this.permissionDialog.isShow = false
              this.getPermissionTree()
              this.$message.success('保存成功')
            }).catch(({response}) => {
              this.permissionForm.isSubmitting = false
              this.$message.error(response.data.desc)
            })
          }
        })
      }
    },
    mounted () {
      this.getPermissionTree()
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  @import '../../../styles/variables';
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import '../../../styles/variables';
</style>
