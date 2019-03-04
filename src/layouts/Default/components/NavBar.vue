<template>
  <div class="navbar">
    <hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container"/>
    <breadcrumb class="breadcrumb-container"/>
    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <error-log class="errLog-container right-menu-item"/>
        <el-tooltip content="全屏" effect="dark" placement="bottom">
          <screenfull class="screenfull right-menu-item"/>
        </el-tooltip>
        <el-tooltip content="字号" effect="dark" placement="bottom">
          <size-select class="international right-menu-item"/>
        </el-tooltip>
      </template>
      <el-dropdown class="avatar-container right-menu-item" trigger="click">
        <div class="avatar-wrapper">
          <img src="@/assets/images/logo.png" class="user-avatar">
          <i class="el-icon-caret-bottom"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/">
            <el-dropdown-item>
              首 页
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item>
            <span style="display:block;" @click="resetPassword">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">退 出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog title="修改密码" :visible.sync="passwordDialog.isShow" :close-on-click-modal="false" width="600px">
      <el-form ref="passwordForm" :model="passwordForm" :rules="passwordRule" label-position="left" label-width="120px"
               style="width: 400px; margin-left:50px;">
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input v-model="passwordForm.oldPassword" type="password"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="password">
          <el-input v-model="passwordForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="passwordForm.confirmPassword" type="password"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="closePasswordDialog">取 消</el-button>
        <el-button type="primary" @click="saveMyPassword" :loading="passwordForm.isSubmitting">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Breadcrumb from '@/components/Breadcrumb/Index'
  import Hamburger from '@/components/Hamburger/Index'
  import ErrorLog from '@/components/ErrorLog/Index'
  import Screenfull from '@/components/Screenfull/Index'
  import SizeSelect from '@/components/SizeSelect/Index'

  export default {
    components: {
      Breadcrumb,
      Hamburger,
      ErrorLog,
      Screenfull,
      SizeSelect
    },
    computed: {
      ...mapGetters([
        'sidebar',
        'name',
        'avatar',
        'device'
      ])
    },
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
      return {
        passwordDialog: {
          isShow: false
        },
        passwordForm: {
          oldPassword: '',
          password: '',
          confirmPassword: '',
          isSubmitting: false
        },
        passwordRule: {
          oldPassword: [
            {required: true, message: '请输入旧密码', trigger: 'change'}
          ],
          password: [
            {required: true, message: '请输入新密码', trigger: 'change'},
            {validator: passwordValidator, trigger: 'blur'}
          ],
          confirmPassword: [
            {required: true, message: '请再输入一次密码', trigger: 'change'},
            {validator: confirmPasswordValidator, trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      toggleSideBar () {
        this.$store.dispatch('toggleSideBar')
      },
      logout () {
        this.$store.dispatch('logout').then(() => {
          window.location.reload()// In order to re-instantiate the vue-router object to avoid bugs
        })
      },
      resetPassword () {
        this.passwordDialog.isShow = true
        this.passwordForm.oldPassword = ''
        this.passwordForm.password = ''
        this.passwordForm.confirmPassword = ''
        if (this.$refs.passwordForm) {
          this.$nextTick(() => {
            this.$refs.passwordForm.clearValidate()
          })
        }
      },
      closePasswordDialog () {
        this.passwordDialog.isShow = false
      },
      saveMyPassword () {
        this.$refs.passwordForm.validate((valid) => {
          if (valid) {
            this.passwordForm.isSubmitting = true

            this.$store.dispatch('changeMyPassword', {
              oldPassword: this.passwordForm.oldPassword,
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
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .navbar {
    height: 50px;
    line-height: 50px;
    border-radius: 0px !important;
    .hamburger-container {
      line-height: 58px;
      height: 50px;
      float: left;
      padding: 0 10px;
    }
    .breadcrumb-container {
      float: left;
    }
    .errLog-container {
      display: inline-block;
      vertical-align: top;
    }
    .right-menu {
      float: right;
      height: 100%;
      &:focus {
        outline: none;
      }
      .right-menu-item {
        display: inline-block;
        margin: 0 8px;
      }
      .screenfull {
        height: 20px;
      }
      .international {
        vertical-align: top;
      }
      .theme-switch {
        vertical-align: 15px;
      }
      .avatar-container {
        height: 50px;
        margin-right: 30px;
        .avatar-wrapper {
          margin-top: 5px;
          position: relative;
          .user-avatar {
            cursor: pointer;
            width: 40px;
            height: 40px;
            border-radius: 10px;
          }
          .el-icon-caret-bottom {
            cursor: pointer;
            position: absolute;
            right: -20px;
            top: 25px;
            font-size: 12px;
          }
        }
      }
    }
  }
</style>
