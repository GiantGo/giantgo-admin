<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="addRole">
        添加
      </el-button>
    </div>
    <el-table
      :data="roleList.items"
      v-loading="roleList.loading"
      border
      style="width: 100%">
      <el-table-column
        prop="name"
        label="名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="slug"
        label="编码"
        width="180">
      </el-table-column>
      <el-table-column
        prop="description"
        label="描述">
      </el-table-column>
      <el-table-column
        prop="createAt"
        label="创建日期"
        width="160px"
        align="center">
        <template slot-scope="scope">
          {{parseTime(scope.row.createdAt)}}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="320" class-name="small-padding">
        <template slot-scope="scope">
          <el-button type="primary" @click="editRole(scope.row)">编辑</el-button>
          <el-button type="danger" @click="deleteRole(scope.row)" v-if="!scope.row.isSystem">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="getRoleList"
        @current-change="getRoleList"
        :current-page.sync="roleList.pager.page"
        :page-sizes="[5, 10, 20, 30, 40]"
        :page-size.sync="roleList.pager.limit"
        layout="total, sizes, prev, pager, next"
        :total="roleList.pager.total">
      </el-pagination>
    </div>
    <el-dialog :title="roleDialog.title" :visible.sync="roleDialog.isShow" :close-on-click-modal="false">
      <el-form ref="roleForm" :model="roleForm" :rules="roleRule" label-position="left" label-width="120px"
               style="width: 400px; margin-left:50px;">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="编码" prop="slug">
          <el-input v-model="roleForm.slug"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input v-model="roleForm.description" rows="3" type="textarea"/>
        </el-form-item>
        <el-form-item label="权限" prop="permissions">
          <tree-select v-model="roleForm.permissions" :multiple="true" :options="permissions"
                       value-consists-of="BRANCH_PRIORITY"
                       placeholder="请选择权限" :normalizer="treeSelectNormalizer({label: 'name'})">
          </tree-select>
        </el-form-item>
        <el-form-item label="菜单" prop="menus">
          <tree-select v-model="roleForm.menus" :multiple="true" :options="menus"
                       value-consists-of="ALL_WITH_INDETERMINATE"
                       placeholder="请选择菜单" :normalizer="treeSelectNormalizer({label: 'title'})">
          </tree-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="closeRoleDialog">取 消</el-button>
        <el-button type="primary" @click="saveRole" :loading="roleForm.isSubmitting">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { parseTime } from '@/utils'
  import { treeSelectNormalizer } from '@/utils/tree'
  import treeSelect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'

  export default {
    name: 'Role',
    components: {treeSelect},
    data () {
      return {
        matchKeys: ['name'],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        roleDialog: {
          isShow: false,
          title: ''
        },
        roleForm: {
          id: '',
          name: '',
          slug: '',
          description: '',
          permissions: [],
          menus: [],
          isSubmitting: false
        },
        roleRule: {
          name: [
            {required: true, message: '请输入角色名称', trigger: 'change'}
          ],
          slug: [
            {required: true, message: '请输入编码', trigger: 'change'}
          ]
        },
        roleList: {
          items: [],
          loading: false,
          pager: {
            page: 1,
            limit: 5,
            total: 0
          }
        },
        permissions: [],
        menus: []
      }
    },
    computed: {
      ...mapGetters([])
    },
    methods: {
      parseTime,
      treeSelectNormalizer,
      getRoleList () {
        this.roleList.loading = true
        this.$store.dispatch('getRoleList', {
          page: this.roleList.pager.page,
          limit: this.roleList.pager.limit
        }).then(res => {
          this.roleList.items = res.data.rows
          this.roleList.pager.total = res.data.count
          this.roleList.loading = false
        }).catch(() => {
          this.$message.error('获取角色失败')
          this.roleList.loading = false
        })
      },
      getPermissionTree () {
        this.$store.dispatch('getPermissionTree', {
          page: -1
        }).then(res => {
          this.permissions = res.data
        }).catch(() => {
          this.$message.error('获取权限列表失败')
        })
      },
      getMenuTree () {
        this.$store.dispatch('getMenuTree').then(res => {
          this.menus = res.data
        }).catch(() => {
          this.$message.error('获取菜单列表失败')
        })
      },
      addRole () {
        this.roleDialog.isShow = true
        this.roleDialog.title = '创建角色'
        this.roleForm.id = ''
        this.roleForm.name = ''
        this.roleForm.slug = ''
        this.roleForm.description = ''
        this.roleForm.permissions = []
        this.roleForm.menus = []
        this.$nextTick(() => {
          this.$refs.roleForm && this.$refs.roleForm.clearValidate()
        })
      },
      editRole (role) {
        this.roleDialog.isShow = true
        this.roleDialog.title = '编辑角色'
        this.roleForm.id = role.id
        this.roleForm.name = role.name
        this.roleForm.slug = role.slug
        this.roleForm.description = role.description
        this.$store.dispatch('getRole', {
          roleId: role.id
        }).then(res => {
          this.roleForm.permissions = res.data.permissions.map(permission => permission.id)
          this.roleForm.menus = res.data.menus.map(menu => menu.id)
        })
        this.$nextTick(() => {
          this.$refs.roleForm && this.$refs.roleForm.clearValidate()
        })
      },
      deleteRole (role) {
        this.$confirm('确定要删除角色信息吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store.dispatch('deleteRole', {
            roleId: role.id
          }).then(() => {
            this.$message.success('删除成功')
            this.getRoleList()
          })
        }).catch(() => {
          this.$message.info('已取消')
        })
      },
      closeRoleDialog () {
        this.roleDialog.isShow = false
      },
      saveRole () {
        this.$refs.roleForm.validate((valid) => {
          if (valid) {
            this.roleForm.isSubmitting = true

            this.$store.dispatch(!this.roleForm.id ? 'createRole' : 'updateRole', {
              id: this.roleForm.id,
              name: this.roleForm.name,
              slug: this.roleForm.slug,
              description: this.roleForm.description,
              permissions: this.roleForm.permissions,
              menus: this.roleForm.menus
            }).then(() => {
              this.roleForm.isSubmitting = false
              this.roleDialog.isShow = false
              this.getRoleList()
              this.$message.success('保存成功')
            }).catch(({response}) => {
              this.roleForm.isSubmitting = false
              this.$message.error(response.data.desc)
            })
          }
        })
      }
    },
    mounted () {
      this.getRoleList()
      this.getPermissionTree()
      this.getMenuTree()
    }
  }
</script>
