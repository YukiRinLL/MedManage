<template>
  <view class="admin-login-container">
    <view class="login-form">
      <text class="login-title">管理员登录</text>
      <view class="form-item">
        <text class="form-label">手机号</text>
        <input 
          class="form-input" 
          type="tel" 
          v-model="loginForm.phone" 
          placeholder="请输入管理员手机号"
        />
      </view>
      <view class="form-item">
        <text class="form-label">密码</text>
        <input 
          class="form-input" 
          type="password" 
          v-model="loginForm.password" 
          placeholder="请输入密码"
        />
      </view>
      <button class="login-btn" @click="handleLogin" :disabled="isLoading">
        {{ isLoading ? '登录中...' : '登录' }}
      </button>
      <text v-if="errorMessage" class="error-message">{{ errorMessage }}</text>
    </view>
  </view>
</template>

<script>
import { post } from '../../utils/request.js'

export default {
  data() {
    return {
      loginForm: {
        phone: '',
        password: ''
      },
      isLoading: false,
      errorMessage: ''
    }
  },
  methods: {
    async handleLogin() {
      try {
        this.isLoading = true
        this.errorMessage = ''

        const res = await post('/admin/login', this.loginForm)
        
        if (res.code === 200) {
          uni.setStorageSync('token', res.token)
          uni.setStorageSync('user', JSON.stringify(res.user))
          uni.setStorageSync('isAdmin', 'true')
          
          uni.showToast({
            title: '登录成功',
            icon: 'success'
          })
          
          uni.navigateTo({
            url: '/pages/admin-dashboard/admin-dashboard'
          })
        } else {
          this.errorMessage = res.message || '登录失败'
        }
      } catch (error) {
        console.error('登录错误:', error)
        this.errorMessage = '登录失败，请检查网络连接'
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>

<style scoped>
.admin-login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-form {
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.login-title {
  display: block;
  text-align: center;
  margin-bottom: 30px;
  color: #333;
  font-size: 24px;
  font-weight: 600;
}

.form-item {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  color: #666;
  font-size: 14px;
}

.form-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  box-sizing: border-box;
}

.login-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  margin-top: 10px;
}

.login-btn:disabled {
  opacity: 0.7;
}

.error-message {
  display: block;
  color: #ff4d4f;
  text-align: center;
  margin-top: 15px;
  font-size: 14px;
}
</style>