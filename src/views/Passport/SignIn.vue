<template>
  <el-container class="passport-container">
    <el-main>
      <el-form class="passport-form" ref="passportForm" :model="passportForm" :rules="rules" label-position="left"
               label-width="0px">
        <h3 class="title">登录</h3>
        <el-form-item prop="userName">
          <el-input type="text" v-model="passportForm.userName" auto-complete="off" placeholder="手机/邮箱"/>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="passportForm.password" auto-complete="off" placeholder="密码"/>
        </el-form-item>
        <el-form-item style="width:100%;">
          <el-button type="primary" style="width:100%;" @click.native.prevent="signIn"
                     :loading="passportForm.isSubmitting">
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>
<script>
  export default {
    data () {
      return {
        passportForm: {
          userName: '15930181489',
          password: '123123',
          isSubmitting: false
        },
        rules: {
          userName: [
            {required: true, message: '请输入用户名'},
            {max: 255, message: '长度不超过255个字符'}
          ],
          password: [
            {required: true, message: '请输入密码'},
            {max: 255, message: '长度不超过255个字符'}
          ]
        }
      }
    },
    components: {},
    methods: {
      signIn () {
        this.$refs['passportForm'].validate((valid) => {
          if (valid) {
            this.passportForm.isSubmitting = true
            this.$store.dispatch('signIn', {
              userName: this.passportForm.userName,
              password: this.passportForm.password
            }).then(() => {
              let redirectUrl = this.$route.query.redirect
              this.$router.push({path: redirectUrl || '/'})
            }).catch(({response}) => {
              this.passportForm.isSubmitting = false
              this.$message.warning(response.data.desc)
            })
          }
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .passport-form {
    position: absolute;
    width: 350px;
    height: 300px;
    top: 50%;
    left: 50%;
    margin-top: -150px;
    margin-left: -200px;
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    .title {
      margin: 0 auto 40px auto;
      font-size: 20px;
      text-align: center;
      color: #505458;
    }
    .remember {
      margin: 0 0 35px 0;
    }
  }

  .passport-container {
    height: 100%;
    background-size: cover;
    background-image: url('../../assets/images/background.png');
    background-repeat: no-repeat;
  }
</style>
