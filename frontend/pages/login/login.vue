<template>
  <view class="login-container">
    <view class="logo">
      <image src="/static/logo.png" class="logo-icon" mode="aspectFit" />
      <text class="app-name">重庆圣通尚诺医疗管理™</text>
      <text class="app-subtitle">健康管理系统</text>
    </view>
    
    <view class="form">
      <view class="form-item">
        <text class="form-label">手机号</text>
        <input 
          class="form-input" 
          type="number" 
          v-model="phone" 
          placeholder="请输入手机号"
          placeholder-class="form-input-placeholder"
          :focus="phoneFocus"
          @focus="phoneFocus = true"
          @blur="phoneFocus = false"
        />
      </view>
      
      <view class="form-item">
        <text class="form-label">密码</text>
        <input 
          class="form-input" 
          type="password" 
          v-model="password" 
          placeholder="请输入密码"
          placeholder-class="form-input-placeholder"
          :focus="passwordFocus"
          @focus="passwordFocus = true"
          @blur="passwordFocus = false"
        />
      </view>
      
      <button class="btn-primary" @click="login">登录</button>
      
      <view class="register-link">
        <text>还没有账号？</text>
        <text class="link" @click="goToRegister">立即注册</text>
      </view>
    </view>
  </view>
</template>

<script>
import { post } from '../../utils/request.js'

export default {
  data() {
    return {
      phone: '',
      password: '',
      phoneFocus: false,
      passwordFocus: false
    }
  },
  methods: {
    async login() {
      if (!this.phone) {
        uni.showToast({
          title: '请输入手机号',
          icon: 'none'
        })
        return
      }
      if (!this.password) {
        uni.showToast({
          title: '请输入密码',
          icon: 'none'
        })
        return
      }
      
      try {
        const res = await post('/user/login', {
          phone: this.phone,
          password: this.password
        })
        uni.setStorageSync('token', res.data.token)
        uni.setStorageSync('user', JSON.stringify(res.data.user))
        uni.showToast({
          title: '登录成功',
          icon: 'success'
        })
        uni.switchTab({
          url: '/pages/home/home'
        })
      } catch (err) {
        console.log(err)
        uni.showToast({
          title: err.message || '登录失败',
          icon: 'none'
        })
      }
    },
    goToRegister() {
      uni.navigateTo({
        url: '/pages/register/register'
      })
    }
  }
}
</script>

<style scoped>
.login-container {
  padding: 60px 20px 40px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #F5F7FA;
}

.logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 50px;
  padding-top: 40px;
}

.logo-icon {
  width: 180px;
  height: 180px;
  background-color: #FFFFFF;
  border-radius: 40px;
  margin-bottom: 28px;
  padding: 30px;
  border: 2px solid #EBEEF5;
}

.app-name {
  font-size: 26px;
  font-weight: 600;
  color: #303133;
}

.app-subtitle {
  font-size: 16px;
  color: #009D85;
  margin-top: 12px;
  font-weight: 500;
}

.form {
  flex: 1;
  max-width: 400px;
  margin: 0 auto;
  width: 100%;
  background-color: #FFFFFF;
  border-radius: 16px;
  padding: 35px 25px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.form-item {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  font-size: 14px;
  color: #606266;
  margin-bottom: 8px;
  font-weight: 500;
}

.form-input {
  width: 100%;
  height: 48px;
  padding: 0 16px;
  border: 1px solid #DCDFE6;
  border-radius: 8px;
  font-size: 16px;
  background-color: #F5F7FA;
  box-sizing: border-box;
  line-height: 48px;
}

.form-input:focus {
  background-color: #FFFFFF;
  border-color: #009D85;
}

.form-input-placeholder {
  color: #C0C4CC;
}

.btn-primary {
  background-color: #009D85;
  color: #FFFFFF;
  border-radius: 8px;
  padding: 14px;
  font-size: 16px;
  font-weight: 500;
  text-align: center;
  margin-top: 30px;
  margin-bottom: 20px;
  border: none;
  width: 100%;
}

.btn-primary:active {
  background-color: #007D6B;
}

.register-link {
  text-align: center;
  font-size: 14px;
  color: #909399;
}

.link {
  color: #009D85;
  margin-left: 5px;
  font-weight: 500;
}
</style>