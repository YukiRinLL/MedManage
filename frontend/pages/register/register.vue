<template>
  <view class="register-container">
    <image src="/static/logo.png" class="page-logo" mode="aspectFit" />
    <text class="page-title">重庆圣通尚诺医疗管理™</text>
    <text class="page-subtitle">患者注册</text>
    
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
          :disabled="loading"
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
          :disabled="loading"
        />
      </view>
      
      <view class="form-item">
        <text class="form-label">确认密码</text>
        <input 
          class="form-input" 
          type="password" 
          v-model="confirmPassword" 
          placeholder="请确认密码"
          placeholder-class="form-input-placeholder"
          :focus="confirmPasswordFocus"
          @focus="confirmPasswordFocus = true"
          @blur="confirmPasswordFocus = false"
          :disabled="loading"
        />
      </view>
      
      <view class="form-item">
        <text class="form-label">姓名</text>
        <input 
          class="form-input" 
          type="text" 
          v-model="name" 
          placeholder="请输入姓名"
          placeholder-class="form-input-placeholder"
          :focus="nameFocus"
          @focus="nameFocus = true"
          @blur="nameFocus = false"
          :disabled="loading"
        />
      </view>
      
      <view class="form-item">
        <text class="form-label">身份证号</text>
        <input 
          class="form-input" 
          type="text" 
          v-model="idCard" 
          placeholder="请输入身份证号"
          placeholder-class="form-input-placeholder"
          :focus="idCardFocus"
          @focus="idCardFocus = true"
          @blur="idCardFocus = false"
          :disabled="loading"
        />
      </view>
      
      <button class="btn-primary" @click="register" :disabled="loading">
        {{ loading ? '注册中...' : '注册' }}
      </button>
      
      <view class="login-link">
        <text>已有账号？</text>
        <text class="link" @click="goToLogin" :disabled="loading">立即登录</text>
      </view>
    </view>
    
    <!-- 加载遮罩 -->
    <view class="loading-mask" v-if="loading">
      <view class="loading-content">
        <view class="loading-spinner"></view>
        <text class="loading-text">注册中，请稍候...</text>
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
      confirmPassword: '',
      name: '',
      idCard: '',
      phoneFocus: false,
      passwordFocus: false,
      confirmPasswordFocus: false,
      nameFocus: false,
      idCardFocus: false,
      loading: false
    }
  },
  methods: {
    async register() {
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
      if (this.password !== this.confirmPassword) {
        uni.showToast({
          title: '两次输入的密码不一致',
          icon: 'none'
        })
        return
      }
      if (!this.name) {
        uni.showToast({
          title: '请输入姓名',
          icon: 'none'
        })
        return
      }
      if (!this.idCard) {
        uni.showToast({
          title: '请输入身份证号',
          icon: 'none'
        })
        return
      }
      // 简单的身份证号验证
      const idCard = this.idCard.trim()
      // 移除空格和其他特殊字符
      const cleanIdCard = idCard.replace(/\s/g, '')
      // 检查长度
      if (cleanIdCard.length !== 18) {
        uni.showToast({
          title: '身份证号长度必须为18位',
          icon: 'none'
        })
        return
      }
      // 检查格式
      const idCardRegex = /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/
      if (!idCardRegex.test(cleanIdCard)) {
        uni.showToast({
          title: '身份证号格式不正确',
          icon: 'none'
        })
        return
      }
      // 使用清理后的身份证号
      this.idCard = cleanIdCard
      
      this.loading = true
      try {
        const registerData = {
          phone: this.phone,
          password: this.password,
          name: this.name,
          idCard: this.idCard
        }
        
        const res = await post('/user/register', registerData)
        if (res.code === 200) {
          if (res.token) {
            uni.setStorageSync('token', res.token)
          }
          uni.showToast({
            title: '注册成功',
            icon: 'success'
          })
          setTimeout(() => {
            uni.navigateTo({
              url: '/pages/register/complete-info'
            })
          }, 1000)
        } else {
          uni.showToast({
            title: res.message || '注册失败',
            icon: 'none'
          })
        }
      } catch (err) {
        console.log(err)
        const errorMessage = err.message || err.data?.message || '注册失败，请检查网络连接'
        uni.showToast({
          title: errorMessage,
          icon: 'none',
          duration: 2000
        })
      } finally {
        this.loading = false
      }
    },
    goToLogin() {
      uni.navigateBack()
    }
  }
}
</script>

<style scoped>
.register-container {
  padding: 40px 20px;
  min-height: 100vh;
  background-color: #F5F7FA;
  position: relative;
}

.page-logo {
  width: 70px;
  height: 70px;
  margin: 0 auto 20px;
  display: block;
  border-radius: 16px;
  background-color: #FFFFFF;
  padding: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.page-title {
  text-align: center;
  color: #303133;
  font-size: 20px;
  font-weight: 600;
  display: block;
  margin-bottom: 8px;
}

.page-subtitle {
  text-align: center;
  display: block;
  color: #909399;
  font-size: 14px;
  margin-bottom: 30px;
  margin-top: 8px;
}

.form {
  max-width: 400px;
  margin: 0 auto;
  width: 100%;
  background-color: #FFFFFF;
  border-radius: 16px;
  padding: 30px 25px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.form-item {
  margin-bottom: 20px;
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
  height: 46px;
  padding: 0 14px;
  border: 1px solid #DCDFE6;
  border-radius: 8px;
  font-size: 16px;
  background-color: #F5F7FA;
  box-sizing: border-box;
  line-height: 46px;
}

.form-input:focus {
  background-color: #FFFFFF;
  border-color: #009D85;
}

.form-input:disabled {
  background-color: #F0F0F0;
  color: #999999;
}

.form-input-placeholder {
  color: #C0C4CC;
}

.gender-selector {
  display: flex;
  gap: 16px;
}

.gender-option {
  flex: 1;
  padding: 12px;
  border: 1px solid #DCDFE6;
  border-radius: 8px;
  text-align: center;
  font-size: 16px;
  color: #606266;
  background-color: #F5F7FA;
}

.gender-option.active {
  background-color: #009D85;
  color: #FFFFFF;
  border-color: #009D85;
}

.role-selector {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.role-option {
  display: flex;
  align-items: center;
  padding: 12px;
  border: 1px solid #DCDFE6;
  border-radius: 8px;
  cursor: pointer;
  background-color: #F5F7FA;
}

.role-option.active {
  border-color: #009D85;
  background-color: rgba(0, 157, 133, 0.1);
}

.role-icon {
  font-size: 24px;
  margin-right: 12px;
}

.role-name {
  font-size: 16px;
  color: #303133;
  font-weight: 500;
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

.btn-primary:disabled {
  background-color: #B3D9D2;
  color: #FFFFFF;
}

.login-link {
  text-align: center;
  font-size: 14px;
  color: #909399;
}

.link {
  color: #009D85;
  margin-left: 5px;
  font-weight: 500;
}

.link:disabled {
  color: #B3D9D2;
}

/* 加载遮罩 */
.loading-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loading-content {
  background-color: #FFFFFF;
  border-radius: 12px;
  padding: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #F3F3F3;
  border-top: 4px solid #009D85;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-text {
  font-size: 16px;
  color: #303133;
  font-weight: 500;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>