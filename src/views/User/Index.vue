<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit"
                 @click="addUser">添加
      </el-button>
    </div>
    <el-table
      :data="userList.items"
      border
      style="width: 100%">
      <el-table-column
        prop="name"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        width="220">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="手机">
      </el-table-column>
      <el-table-column
        prop="company"
        label="公司">
      </el-table-column>
      <el-table-column
        label="最后登录时间">
        <template slot-scope="scope">
          {{scope.row.lastSignInAt | moment('YYYY-MM-DD HH:mm:ss')}}
        </template>
      </el-table-column>
      <el-table-column
        label="是否启用"
        width="100"
        align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isEnable">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding">
        <template slot-scope="scope">
          <el-button type="primary" @click="editUser(scope.row)">编辑</el-button>
          <el-button type="primary" @click="assignRoles(scope.row)">分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="getUserList"
        @current-change="getUserList"
        :current-page.sync="userList.pager.page"
        :page-sizes="[5, 10, 20, 30, 40]"
        :page-size.sync="userList.pager.limit"
        layout="total, sizes, prev, pager, next"
        :total="userList.pager.total">
      </el-pagination>
    </div>
    <el-dialog :title="userDialog.title" :visible.sync="userDialog.isShow" :close-on-click-modal="false">
      <el-form ref="userForm" :model="userForm" :rules="userRule" label-position="left" label-width="70px"
               style="width: 400px; margin-left:50px;">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="userForm.name"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="userForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email"></el-input>
        </el-form-item>
        <el-form-item label="公司" prop="company">
          <el-input v-model="userForm.company"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="userForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="userForm.confirmPassword" type="password"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeUserDialog">取 消</el-button>
        <el-button type="primary" @click="saveUser">确 定</el-button>
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
        userDialog: {
          isShow: false,
          title: ''
        },
        userForm: {
          id: '',
          name: '',
          mobile: '',
          email: '',
          company: '',
          password: '',
          confirmPassword: '',
          isSubmitting: false
        },
        userRule: {
          name: [
            {required: true, message: '请输入姓名', trigger: 'change'}
          ]
        },
        userList: {
          items: [],
          pager: {
            page: 1,
            limit: 5,
            total: 0
          }
        }
      }
    },
    computed: {
      ...mapGetters([])
    },
    methods: {
      getUserList () {
        this.$store.dispatch('getUserList', {
          page: this.userList.pager.page,
          limit: this.userList.pager.limit
        }).then(res => {
          this.userList.items = res.data.rows
          this.userList.pager.total = res.data.count
        }).catch(() => {
          this.$message.error('获取用户失败')
        })
      },
      addUser () {
        this.userDialog.isShow = true
        this.userDialog.title = '创建用户'
        this.userForm.id = ''
        this.userForm.name = ''
        this.userForm.mobile = ''
        this.userForm.email = ''
        this.userForm.company = ''
        this.userForm.password = ''
        this.userForm.confirmPassword = ''
        this.$nextTick(() => {
          this.$refs.userForm.clearValidate()
        })
      },
      editUser (user) {
        this.userDialog.isShow = true
        this.userDialog.title = '编辑用户'
        this.userForm.id = user.id
        this.userForm.name = user.name
        this.userForm.mobile = user.mobile
        this.userForm.email = user.email
        this.userForm.company = user.company
        if (this.$refs.userForm) {
          this.$refs.userForm.clearValidate()
        }
      },
      closeUserDialog () {
        this.userDialog.isShow = false
      },
      saveUser () {
        this.$refs.userForm.validate((valid) => {
          if (valid) {
            this.userForm.isSubmitting = true

            this.$store.dispatch(!this.userForm.id ? 'createUser' : 'updateUser', {
              id: this.userForm.id,
              name: this.userForm.name,
              mobile: this.userForm.mobile,
              email: this.userForm.email,
              company: this.userForm.company,
              password: this.userForm.password
            }).then(() => {
              this.userForm.isSubmitting = false
              this.userDialog.isShow = false
              this.getUserList()
              this.$message.success('保存成功')
            }).catch(() => {
              this.userForm.isSubmitting = false
              this.$message.error('保存失败')
            })
          }
        })
      },
      assignRoles (user) {

      }
    },
    mounted () {
      this.getUserList()
    }
  }
</script>
