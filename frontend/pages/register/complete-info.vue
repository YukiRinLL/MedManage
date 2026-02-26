<template>
  <view class="complete-info-container">
    <image src="/static/logo.png" class="page-logo" mode="aspectFit" />
    <text class="page-title">完善个人信息</text>
    <text class="page-subtitle">请填写以下详细信息，以便我们为您提供更好的服务</text>
    
    <view class="form">
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
      
      <button class="btn-primary" @click="completeInfo">保存信息</button>
      
      <view class="skip-link">
        <text class="skip-text" @click="skipComplete">暂不填写，稍后完善</text>
      </view>
    </view>
  </view>
</template>

<script>
import { put } from '../../utils/request.js'

export default {
  data() {
    return {
      gender: 0,
      age: '',
      idCard: '',
      emergencyContact: '',
      emergencyPhone: '',
      ageFocus: false,
      idCardFocus: false,
      emergencyContactFocus: false,
      emergencyPhoneFocus: false
    }
  },
  methods: {
    async completeInfo() {
      try {
        const token = uni.getStorageSync('token')
        if (!token) {
          uni.navigateTo({
            url: '/pages/login/login'
          })
          return
        }
        
        const userInfo = {
          gender: this.gender,
          age: parseInt(this.age),
          idCard: this.idCard,
          emergencyContact: this.emergencyContact,
          emergencyPhone: this.emergencyPhone
        }
        
        await put('/user/update', userInfo)
        uni.showToast({
          title: '信息保存成功',
          icon: 'success'
        })
        setTimeout(() => {
          uni.switchTab({
            url: '/pages/home/home'
          })
        }, 1000)
      } catch (err) {
        console.log(err)
        uni.showToast({
          title: '保存失败，请检查网络连接',
          icon: 'none'
        })
      }
    },
    skipComplete() {
      uni.switchTab({
        url: '/pages/home/home'
      })
    }
  }
}
</script>

<style scoped>
.complete-info-container {
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
  line-height: 1.4;
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

.skip-link {
  text-align: center;
  font-size: 14px;
}

.skip-text {
  color: #009D85;
  font-weight: 500;
}
</style>