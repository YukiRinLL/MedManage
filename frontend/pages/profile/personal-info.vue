<template>
  <view class="personal-info-container">
    <!-- 个人信息卡片 -->
    <view class="info-card" v-if="userInfo">
      <view class="info-item">
        <text class="info-label">手机号</text>
        <text class="info-value" :class="{ placeholder: !userInfo.phone }">{{ userInfo.phone || '未填写' }}</text>
      </view>
      
      <view class="info-item">
        <text class="info-label">姓名</text>
        <text class="info-value" :class="{ placeholder: !userInfo.name }">{{ userInfo.name || '未填写' }}</text>
      </view>
      
      <view class="info-item">
        <text class="info-label">性别</text>
        <text class="info-value">{{ userInfo.gender === 0 ? '女' : '男' }}</text>
      </view>
      
      <view class="info-item">
        <text class="info-label">年龄</text>
        <text class="info-value" :class="{ placeholder: !userInfo.birthDate }">{{ userInfo.birthDate ? this.calculateAge(userInfo.birthDate) : '未填写' }}</text>
      </view>
      
      <view class="info-item">
        <text class="info-label">身份证号</text>
        <text class="info-value" :class="{ placeholder: !userInfo.idCard }">{{ userInfo.idCard || '未填写' }}</text>
      </view>
      
      <view class="info-item">
        <text class="info-label">紧急联系人</text>
        <text class="info-value" :class="{ placeholder: !userInfo.emergencyContact }">{{ userInfo.emergencyContact || '未填写' }}</text>
      </view>
      
      <view class="info-item">
        <text class="info-label">紧急联系电话</text>
        <text class="info-value" :class="{ placeholder: !userInfo.emergencyPhone }">{{ userInfo.emergencyPhone || '未填写' }}</text>
      </view>
      
      <view class="info-item">
        <text class="info-label">透析号</text>
        <text class="info-value" :class="{ placeholder: !userInfo.txNumber }">{{ userInfo.txNumber || '未填写' }}</text>
      </view>
      
      <view class="info-item">
        <text class="info-label">民族</text>
        <text class="info-value" :class="{ placeholder: !userInfo.nation }">{{ userInfo.nation || '未填写' }}</text>
      </view>
      
      <view class="info-item">
        <text class="info-label">出生日期</text>
        <text class="info-value" :class="{ placeholder: !userInfo.birthDate }">{{ userInfo.birthDate ? this.formatDate(userInfo.birthDate) : '未填写' }}</text>
      </view>
      
      <view class="info-item">
        <text class="info-label">邮政编码</text>
        <text class="info-value" :class="{ placeholder: !userInfo.postalCode }">{{ userInfo.postalCode || '未填写' }}</text>
      </view>
      
      <view class="info-item">
        <text class="info-label">邮箱</text>
        <text class="info-value" :class="{ placeholder: !userInfo.email }">{{ userInfo.email || '未填写' }}</text>
      </view>
      
      <view class="info-item">
        <text class="info-label">保险类型</text>
        <text class="info-value" :class="{ placeholder: !userInfo.insuranceType }">{{ userInfo.insuranceType || '未填写' }}</text>
      </view>
      
      <view class="info-item">
        <text class="info-label">就医凭证类型</text>
        <text class="info-value" :class="{ placeholder: !userInfo.medicalCertType }">{{ userInfo.medicalCertType || '未填写' }}</text>
      </view>
      
      <view class="info-item">
        <text class="info-label">电子医保号</text>
        <text class="info-value" :class="{ placeholder: !userInfo.electronicMedicalId }">{{ userInfo.electronicMedicalId || '未填写' }}</text>
      </view>
      
      <view class="info-item" @click="navigateToDiagnosis">
        <text class="info-label">诊断信息</text>
        <text class="info-value" :class="{ placeholder: !userInfo.diagnosis }">{{ userInfo.diagnosis ? '查看详情 ›' : '未填写' }}</text>
      </view>
      
      <view class="info-item">
        <text class="info-label">住院状态</text>
        <text class="info-value">{{ userInfo.hospitalizationStatus === 1 ? '住院' : '非住院' }}</text>
      </view>
      
      <view class="info-item">
        <text class="info-label">患者类型</text>
        <text class="info-value">{{ userInfo.patientType === 0 ? '普通患者' : '其他' }}</text>
      </view>
      
      <view class="info-item">
        <text class="info-label">入院日期</text>
        <text class="info-value" :class="{ placeholder: !userInfo.admissionDate }">{{ userInfo.admissionDate ? this.formatDate(userInfo.admissionDate) : '未填写' }}</text>
      </view>
      
      <view class="info-item">
        <text class="info-label">出院日期</text>
        <text class="info-value" :class="{ placeholder: !userInfo.dischargeDate }">{{ userInfo.dischargeDate ? this.formatDate(userInfo.dischargeDate) : '无' }}</text>
      </view>
    </view>
    
    <!-- 修改按钮 -->
    <view class="action-section">
      <button class="btn-edit" @click="navigateToEdit">修改个人信息</button>
    </view>
  </view>
</template>

<script>
import { getUserInfo, fetchUserInfo } from '../../utils/userInfoManager.js'

export default {
  data() {
    return {
      userInfo: null
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
        // 先尝试从本地存储获取
        let userInfo = getUserInfo()
        if (userInfo) {
          this.userInfo = userInfo
        } else {
          // 本地没有则从API获取
          userInfo = await fetchUserInfo()
          if (userInfo) {
            this.userInfo = userInfo
          }
        }
      } catch (err) {
        console.log(err)
        uni.showToast({
          title: '获取个人信息失败',
          icon: 'none'
        })
      }
    },
    navigateToEdit() {
      uni.navigateTo({
        url: '/pages/profile/edit-info'
      })
    },
    navigateToDiagnosis() {
      uni.navigateTo({
        url: '/pages/diagnosis/diagnosis'
      })
    },
    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    },
    calculateAge(birthDate) {
      if (!birthDate) return ''
      const birth = new Date(birthDate)
      const today = new Date()
      let age = today.getFullYear() - birth.getFullYear()
      const monthDiff = today.getMonth() - birth.getMonth()
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--
      }
      return age
    }
  }
}
</script>

<style scoped>
.personal-info-container {
  padding: 0;
  min-height: 100vh;
  background-color: #f5f5f5;
}

/* 个人信息卡片 */
.info-card {
  background-color: #FFFFFF;
  margin: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.info-item {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 14px;
  color: #666;
  width: 100px;
}

.info-value {
  flex: 1;
  font-size: 14px;
  color: #333;
  text-align: right;
}

.info-value.placeholder {
  color: #999;
}

/* 操作按钮 */
.action-section {
  padding: 0 16px;
  margin-top: 24px;
}

.btn-edit {
  background-color: #009D85;
  color: #FFFFFF;
  border-radius: 8px;
  padding: 14px;
  font-size: 16px;
  font-weight: 500;
  text-align: center;
  border: none;
  width: 100%;
}

.btn-edit:active {
  background-color: #007D6B;
}
</style>