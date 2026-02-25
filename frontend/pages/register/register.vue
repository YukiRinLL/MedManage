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
        />
      </view>
      
      <view class="form-item">
        <text class="form-label">性别</text>
        <view class="gender-selector">
          <view class="gender-option" :class="{ active: gender === 0 }" @click="gender = 0">
            <text>女</text>
          </view>
          <view class="gender-option" :class="{ active: gender === 1 }" @click="gender = 1">
            <text>男</text>
          </view>
        </view>
      </view>
      
      <view class="form-item">
        <text class="form-label">年龄</text>
        <input 
          class="form-input" 
          type="number" 
          v-model="age" 
          placeholder="请输入年龄"
          placeholder-class="form-input-placeholder"
          :focus="ageFocus"
          @focus="ageFocus = true"
          @blur="ageFocus = false"
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
        />
      </view>
      
      <view class="form-item">
        <text class="form-label">紧急联系人</text>
        <input 
          class="form-input" 
          type="text" 
          v-model="emergencyContact" 
          placeholder="请输入紧急联系人"
          placeholder-class="form-input-placeholder"
          :focus="emergencyContactFocus"
          @focus="emergencyContactFocus = true"
          @blur="emergencyContactFocus = false"
        />
      </view>
      
      <view class="form-item">
        <text class="form-label">紧急联系电话</text>
        <input 
          class="form-input" 
          type="number" 
          v-model="emergencyPhone" 
          placeholder="请输入紧急联系电话"
          placeholder-class="form-input-placeholder"
          :focus="emergencyPhoneFocus"
          @focus="emergencyPhoneFocus = true"
          @blur="emergencyPhoneFocus = false"
        />
      </view>
      
      <view v-if="isSuperAdmin" class="form-item">
        <text class="form-label">用户角色</text>
        <view class="role-selector">
          <view 
            v-for="role in roles" 
            :key="role.value" 
            class="role-option" 
            :class="{ active: selectedRole === role.value }"
            @click="selectRole(role.value)"
          >
            <text class="role-icon">{{ role.icon }}</text>
            <text class="role-name">{{ role.label }}</text>
          </view>
        </view>
      </view>
      
      <button class="btn-primary" @click="register">注册</button>
      
      <view class="login-link">
        <text>已有账号？</text>
        <text class="link" @click="goToLogin">立即登录</text>
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
      gender: 0,
      age: '',
      idCard: '',
      emergencyContact: '',
      emergencyPhone: '',
      phoneFocus: false,
      passwordFocus: false,
      confirmPasswordFocus: false,
      nameFocus: false,
      ageFocus: false,
      idCardFocus: false,
      emergencyContactFocus: false,
      emergencyPhoneFocus: false,
      isSuperAdmin: false,
      selectedRole: 0,
      roles: [
        { value: 0, label: '普通用户', icon: '👤' },
        { value: 1, label: '管理员', icon: '👨‍💼' },
        { value: 2, label: '超级管理员', icon: '👑' }
      ]
    }
  },
  onLoad() {
    this.checkSuperAdminPermission()
  },
  methods: {
    checkSuperAdminPermission() {
      const isSuperAdmin = uni.getStorageSync('isSuperAdmin')
      this.isSuperAdmin = isSuperAdmin === true
    },
    selectRole(role) {
      this.selectedRole = role
    },
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
      if (!this.age) {
        uni.showToast({
          title: '请输入年龄',
          icon: 'none'
        })
        return
      }
      
      try {
        const registerData = {
          phone: this.phone,
          password: this.password,
          name: this.name,
          gender: this.gender,
          age: parseInt(this.age),
          idCard: this.idCard,
          emergencyContact: this.emergencyContact,
          emergencyPhone: this.emergencyPhone
        }
        
        if (this.isSuperAdmin) {
          registerData.role = this.selectedRole
        }
        
        await post('/user/register', registerData)
        uni.showToast({
          title: '注册成功',
          icon: 'success'
        })
        uni.navigateBack()
      } catch (err) {
        console.log(err)
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
</style>