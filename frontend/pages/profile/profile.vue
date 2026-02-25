<template>
  <view class="profile-container">
    <!-- 个人信息卡片 -->
    <view class="profile-card" v-if="userInfo">
      <view class="form">
        <view class="form-item">
          <text class="form-label">手机号</text>
          <input 
            class="form-input" 
            type="number" 
            v-model="userInfo.phone" 
            disabled 
            placeholder-class="form-input-placeholder"
          />
        </view>
        
        <view class="form-item">
          <text class="form-label">姓名</text>
          <input 
            class="form-input" 
            type="text" 
            v-model="userInfo.name"
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
            <view class="gender-option" :class="{ active: userInfo.gender === 0 }" @click="userInfo.gender = 0">
              <text>女</text>
            </view>
            <view class="gender-option" :class="{ active: userInfo.gender === 1 }" @click="userInfo.gender = 1">
              <text>男</text>
            </view>
          </view>
        </view>
        
        <view class="form-item">
          <text class="form-label">年龄</text>
          <input 
            class="form-input" 
            type="number" 
            v-model="userInfo.age"
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
            v-model="userInfo.idCard"
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
            v-model="userInfo.emergencyContact"
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
            v-model="userInfo.emergencyPhone"
            placeholder="请输入紧急联系电话"
            placeholder-class="form-input-placeholder"
            :focus="emergencyPhoneFocus"
            @focus="emergencyPhoneFocus = true"
            @blur="emergencyPhoneFocus = false"
          />
        </view>
        
        <button class="btn-primary" @click="updateProfile">保存修改</button>
      </view>
    </view>
    
    <!-- 退出登录按钮 -->
    <view class="logout-section">
      <button class="btn-logout" @click="logout">退出登录</button>
    </view>
  </view>
</template>

<script>
import { get, put } from '../../utils/request.js'

export default {
  data() {
    return {
      userInfo: null,
      nameFocus: false,
      ageFocus: false,
      idCardFocus: false,
      emergencyContactFocus: false,
      emergencyPhoneFocus: false
    }
  },
  onLoad() {
    this.getUserInfo()
  },
  methods: {
    async getUserInfo() {
      try {
        const token = uni.getStorageSync('token')
        if (!token) {
          uni.navigateTo({
            url: '/pages/login/login'
          })
          return
        }
        const res = await get('/user/info')
        if (res.code === 200) {
          this.userInfo = res.data
        }
      } catch (err) {
        console.log(err)
        uni.showToast({
          title: '获取个人信息失败',
          icon: 'none'
        })
      }
    },
    async updateProfile() {
      try {
        const token = uni.getStorageSync('token')
        const res = await put('/user/update', this.userInfo)
        if (res.code === 200) {
          uni.showToast({
            title: '更新成功',
            icon: 'success'
          })
        }
      } catch (err) {
        console.log(err)
        uni.showToast({
          title: '更新失败，请检查网络连接',
          icon: 'none'
        })
      }
    },
    logout() {
      uni.removeStorageSync('token')
      uni.removeStorageSync('user')
      uni.navigateTo({
        url: '/pages/login/login'
      })
    }
  }
}
</script>

<style scoped>
.profile-container {
  padding: 0;
  min-height: 100vh;
  background-color: #f5f5f5;
}

/* 个人信息卡片 */
.profile-card {
  padding: 16px;
}

.form {
  background-color: #FFFFFF;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-item {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.form-input {
  width: 100%;
  height: 48px;
  padding: 0 14px;
  border: 1px solid #E5E5E5;
  border-radius: 8px;
  font-size: 14px;
  background-color: #FFFFFF;
  box-sizing: border-box;
  line-height: 48px;
}

.form-input-placeholder {
  color: #999999;
}

.form-input[disabled] {
  background-color: #f5f5f5;
  color: #999;
}

.gender-selector {
  display: flex;
  gap: 12px;
}

.gender-option {
  flex: 1;
  padding: 12px;
  border: 1px solid #DCDFE6;
  border-radius: 8px;
  text-align: center;
  font-size: 14px;
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
  margin-top: 24px;
  margin-bottom: 20px;
  border: none;
  width: 100%;
}

.btn-primary:active {
  background-color: #007D6B;
}

/* 退出登录按钮 */
.logout-section {
  padding: 16px;
}

.btn-logout {
  background-color: #FFFFFF;
  color: #F56C6C;
  border: 1px solid #F56C6C;
  border-radius: 8px;
  padding: 14px;
  font-size: 16px;
  font-weight: 500;
  text-align: center;
  width: 100%;
}

.btn-logout:active {
  background-color: #FEF0F0;
}
</style>