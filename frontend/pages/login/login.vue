<template>
  <view class="login-container">
    <view class="logo">
      <view class="logo-icon">
        <text class="logo-text">医</text>
      </view>
      <text class="app-name">医院患者管理</text>
    </view>
    
    <view class="form">
      <view class="form-item">
        <text class="form-label">手机号</text>
        <input class="form-input" type="number" v-model="phone" placeholder="请输入手机号" />
      </view>
      
      <view class="form-item">
        <text class="form-label">密码</text>
        <input class="form-input" type="password" v-model="password" placeholder="请输入密码" />
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
      password: ''
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
        uni.setStorageSync('token', res.token)
        uni.setStorageSync('user', JSON.stringify(res.user))
        uni.showToast({
          title: '登录成功',
          icon: 'success'
        })
        uni.switchTab({
          url: '/pages/home/home'
        })
      } catch (err) {
        console.log(err)
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
  padding: 40px 20px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

.logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 60px;
}

.logo-icon {
  width: 120px;
  height: 120px;
  background-color: #007AFF;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.logo-text {
  font-size: 60px;
  color: #FFFFFF;
  font-weight: bold;
}

.app-name {
  font-size: 24px;
  font-weight: 600;
  color: #333333;
}

.form {
  flex: 1;
  max-width: 400px;
  margin: 0 auto;
  width: 100%;
}

.form-item {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  font-size: 14px;
  color: #666666;
  margin-bottom: 8px;
}

.form-input {
  width: 100%;
  padding: 14px;
  border: 1px solid #E5E5E5;
  border-radius: 8px;
  font-size: 16px;
  background-color: #FFFFFF;
  box-sizing: border-box;
}

.btn-primary {
  background-color: #007AFF;
  color: #FFFFFF;
  border-radius: 8px;
  padding: 14px;
  font-size: 16px;
  text-align: center;
  margin-top: 30px;
  margin-bottom: 20px;
  border: none;
  width: 100%;
}

.register-link {
  text-align: center;
  font-size: 14px;
  color: #666666;
}

.link {
  color: #007AFF;
  margin-left: 5px;
}
</style>