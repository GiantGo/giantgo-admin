<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="addUser">
        添加
      </el-button>
    </div>
    <el-table
      :data="userList.items"
      border
      style="width: 100%">
      <el-table-column
        prop="name"
        label="姓名"
        width="100">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        width="180">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="手机"
        width="120px">
      </el-table-column>
      <el-table-column
        prop="company"
        label="公司">
      </el-table-column>
      <el-table-column
        label="最后登录时间"
        width="160px"
        align="center">
        <template slot-scope="scope">
          {{formatTime(scope.row.lastSignInAt)}}
        </template>
      </el-table-column>
      <el-table-column
        label="角色"
        width="160"
        header-align="center">
        <template slot-scope="scope">
          <el-tag v-for="role in scope.row.roles" :key="role.id">{{role.name}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="是否启用"
        width="80"
        align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.enabled">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="320" class-name="small-padding">
        <template slot-scope="scope">
          <el-button type="primary" @click="editUser(scope.row)">编 辑</el-button>
          <el-button type="primary" @click="resetPassword(scope.row)">重置密码</el-button>
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
    <el-dialog :title="userDialog.title" :visible.sync="userDialog.isShow" :close-on-click-modal="false" width="600px">
      <el-alert
        :title="'默认密码：' + userForm.password"
        type="warning"
        show-icon
        :closable="false"
        v-if="!userForm.id">
      </el-alert>
      <el-form ref="userForm" :model="userForm" :rules="userRule" label-position="left" label-width="120px"
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
        <el-form-item label="角色" prop="roles">
          <el-select v-model="userForm.roles" multiple placeholder="请选择" clearable>
            <el-option
              v-for="role in roles"
              :key="role.id"
              :label="role.name"
              :value="role.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="closeUserDialog">取 消</el-button>
        <el-button type="primary" @click="saveUser" :loading="userForm.isSubmitting">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="重置密码" :visible.sync="passwordDialog.isShow" :close-on-click-modal="false" width="600px">
      <el-form ref="passwordForm" :model="passwordForm" :rules="passwordRule" label-position="left" label-width="120px"
               style="width: 400px; margin-left:50px;">
        <el-form-item label="密码" prop="password">
          <el-input v-model="passwordForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="passwordForm.confirmPassword" type="password"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="closePasswordDialog">取 消</el-button>
        <el-button type="primary" @click="savePassword" :loading="passwordForm.isSubmitting">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { formatTime } from '@/utils'
  import { validateEmail } from '@/utils/validate'

  export default {
    name: 'User',
    components: {},
    data () {
      const passwordValidator = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'))
        } else {
          if (this.passwordForm.confirmPassword !== '') {
            this.$refs.passwordForm.validateField('confirmPassword')
          }
          callback()
        }
      }
      const confirmPasswordValidator = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.passwordForm.password) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      const emailValidator = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入邮箱'))
        } else if (!validateEmail(value)) {
          callback(new Error('邮箱格式不正确!'))
        } else {
          callback()
        }
      }
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
          password: '123456',
          roles: [],
          isSubmitting: false
        },
        userRule: {
          name: [
            {required: true, message: '请输入姓名', trigger: 'change'}
          ],
          mobile: [
            {required: true, message: '请输入手机', trigger: 'change'}
          ],
          email: [
            {required: true, message: '请输入邮箱', trigger: 'change'},
            {validator: emailValidator, trigger: 'blur'}
          ]
        },
        userList: {
          items: [],
          loading: false,
          pager: {
            page: 1,
            limit: 5,
            total: 0
          }
        },
        roles: [],
        passwordDialog: {
          isShow: false
        },
        passwordForm: {
          password: '',
          confirmPassword: '',
          isSubmitting: false
        },
        passwordRule: {
          password: [
            {required: true, message: '请输入密码', trigger: 'change'},
            {validator: passwordValidator, trigger: 'blur'}
          ],
          confirmPassword: [
            {required: true, message: '请再输入一次密码', trigger: 'change'},
            {validator: confirmPasswordValidator, trigger: 'blur'}
          ]
        }
      }
    },
    computed: {
      ...mapGetters([])
    },
    methods: {
      formatTime,
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
      getRoleList () {
        this.$store.dispatch('getRoleList', {
          page: -1
        }).then(res => {
          this.roles = res.data.rows
        }).catch(() => {
          this.$message.error('获取角色失败')
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
        this.userForm.confirmPassword = ''
        this.userForm.roles = []
        this.$nextTick(() => {
          this.$refs.userForm && this.$refs.userForm.clearValidate()
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
        this.userForm.roles = user.roles.map(role => role.id)
        this.$nextTick(() => {
          this.$refs.userForm && this.$refs.userForm.clearValidate()
        })
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
              password: this.userForm.password,
              roles: this.userForm.roles
            }).then(() => {
              this.userForm.isSubmitting = false
              this.userDialog.isShow = false
              this.getUserList()
              this.$message.success('保存成功')
            }).catch(({response}) => {
              this.userForm.isSubmitting = false
              this.$message.error(response.data.desc)
            })
          }
        })
      },
      resetPassword (user) {
        this.passwordDialog.isShow = true
        this.passwordForm.userId = user.id
        this.passwordForm.password = ''
        this.passwordForm.confirmPassword = ''
        this.$nextTick(() => {
          this.$refs.passwordForm && this.$refs.passwordForm.clearValidate()
        })
      },
      closePasswordDialog () {
        this.passwordDialog.isShow = false
      },
      savePassword () {
        this.$refs.passwordForm.validate((valid) => {
          if (valid) {
            this.passwordForm.isSubmitting = true

            this.$store.dispatch('changePassword', {
              userId: this.passwordForm.userId,
              password: this.passwordForm.password
            }).then(() => {
              this.passwordForm.isSubmitting = false
              this.passwordDialog.isShow = false
              this.$message.success('保存成功')
            }).catch(({response}) => {
              this.passwordForm.isSubmitting = false
              this.$message.error(response.data.desc)
            })
          }
        })
      }
    },
    mounted () {
      this.getUserList()
      this.getRoleList()
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  .el-alert {
    width: 410px;
    margin: 0 50px 20px 40px;
  }
</style>
