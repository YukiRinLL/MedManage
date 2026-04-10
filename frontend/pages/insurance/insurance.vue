<template>
  <view class="insurance-container">
    <!-- <view class="page-title">参保信息</view> -->
    
    <view class="insurance-card" v-if="insuranceInfo">
      <view class="info-section">
        <text class="section-title">基本信息</text>
        
        <view class="info-item">
          <text class="info-label">参保地区：</text>
          <text class="info-value" :class="{ placeholder: !insuranceInfo.insuredAreaName }">{{ insuranceInfo.insuredAreaName || '未填写' }}</text>
        </view>
        
        <view class="info-item">
          <text class="info-label">参保日期：</text>
          <text class="info-value" :class="{ placeholder: !insuranceInfo.insuredDate }">{{ formatDate(insuranceInfo.insuredDate) || '未填写' }}</text>
        </view>
        
        <view class="info-item">
          <text class="info-label">人员类型：</text>
          <text class="info-value" :class="{ placeholder: !insuranceInfo.psnTypeText }">{{ insuranceInfo.psnTypeText || '未填写' }}</text>
        </view>
        
        <view class="info-item">
          <text class="info-label">公务员标识：</text>
          <text class="info-value" :class="{ placeholder: insuranceInfo.civilServantFlag === null }">{{ insuranceInfo.civilServantFlag === 1 ? '是' : '否' }}</text>
        </view>
      </view>
      
      <view class="info-section">
        <text class="section-title">参保详情</text>
        
        <view class="info-item">
          <text class="info-label">参保单位：</text>
          <text class="info-value" :class="{ placeholder: !insuranceInfo.unitName }">{{ insuranceInfo.unitName || '未填写' }}</text>
        </view>
        
        <view class="info-item">
          <text class="info-label">参保状态：</text>
          <text class="info-value" :class="{ placeholder: insuranceInfo.insuranceStatus === null }">{{ getInsuranceStatusText(insuranceInfo.insuranceStatus) }}</text>
        </view>
        
        <view class="info-item">
          <text class="info-label">险种类型：</text>
          <text class="info-value" :class="{ placeholder: !insuranceInfo.insuranceTypeCode }">{{ insuranceInfo.insuranceTypeCode || '未填写' }}</text>
        </view>
        
        <view class="info-item">
          <text class="info-label">个人账户余额：</text>
          <text class="info-value" :class="{ placeholder: insuranceInfo.personalAccountBalance === null }">{{ insuranceInfo.personalAccountBalance || 0 }} 元</text>
        </view>
        
        <view class="info-item" v-if="insuranceInfo.suspendDate">
          <text class="info-label">暂停参保日期：</text>
          <text class="info-value">{{ formatDate(insuranceInfo.suspendDate) }}</text>
        </view>
      </view>
      
      <view class="info-section">
        <text class="section-title">其他信息</text>
        
        <view class="info-item">
          <text class="info-label">患者ID：</text>
          <text class="info-value">{{ insuranceInfo.patientId }}</text>
        </view>
        
        <view class="info-item">
          <text class="info-label">透析号：</text>
          <text class="info-value" :class="{ placeholder: !insuranceInfo.dialysisNumber }">{{ insuranceInfo.dialysisNumber || '未填写' }}</text>
        </view>
        
        <view class="info-item">
          <text class="info-label">参保地区代码：</text>
          <text class="info-value" :class="{ placeholder: !insuranceInfo.insuredAreaCode }">{{ insuranceInfo.insuredAreaCode || '未填写' }}</text>
        </view>
        
        <view class="info-item">
          <text class="info-label">人员类别代码：</text>
          <text class="info-value" :class="{ placeholder: !insuranceInfo.psnTypeCode }">{{ insuranceInfo.psnTypeCode || '未填写' }}</text>
        </view>
      </view>
      
    </view>
    
    <view class="empty-state" v-else>
      <text class="empty-text">暂无参保信息</text>
    </view>
  </view>
</template>

<script>
import { getUserInfo } from '../../utils/userInfoManager.js'
import request from '../../utils/request.js'

export default {
  data() {
    return {
      insuranceInfo: null,
      loading: false
    }
  },
  onLoad() {
    this.fetchInsuranceInfo()
  },
  onShow() {
    this.fetchInsuranceInfo()
  },
  methods: {
    async fetchInsuranceInfo() {
      this.loading = true
      try {
        const userInfo = await getUserInfo()
        if (userInfo) {
          const response = await request.get(`/insurance/by-patient/${userInfo.id}`)
          if (response.code === 200 && response.data && response.data.length > 0) {
            this.insuranceInfo = response.data[0]
          } else {
            this.insuranceInfo = null
          }
        }
      } catch (error) {
        console.error('获取参保信息失败:', error)
        this.insuranceInfo = null
      } finally {
        this.loading = false
      }
    },
    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
    },
    getInsuranceStatusText(status) {
      switch (status) {
        case 0:
          return '暂停/中断'
        case 1:
          return '正常参保'
        case 2:
          return '终止'
        default:
          return '未填写'
      }
    },

  }
}
</script>

<style scoped>
.insurance-container {
  padding: 20rpx;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.page-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #303133;
  text-align: center;
  margin: 40rpx 0;
}

.insurance-card {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 12rpx 0 rgba(0, 0, 0, 0.06);
}

.info-section {
  margin-bottom: 30rpx;
}

.section-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #303133;
  margin-bottom: 20rpx;
  padding-bottom: 10rpx;
  border-bottom: 1rpx solid #e4e7ed;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.info-label {
  font-size: 26rpx;
  color: #606266;
  flex: 1;
}

.info-value {
  font-size: 26rpx;
  color: #303133;
  flex: 2;
  text-align: right;
}

.placeholder {
  color: #909399;
}

.edit-button {
  margin-top: 40rpx;
  background-color: #009D85;
  color: #fff;
  border-radius: 8rpx;
  font-size: 28rpx;
  padding: 20rpx 0;
  text-align: center;
  border: none;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 200rpx 0;
}

.empty-text {
  font-size: 28rpx;
  color: #909399;
  margin-bottom: 40rpx;
}

.add-button {
  background-color: #009D85;
  color: #fff;
  border-radius: 8rpx;
  font-size: 28rpx;
  padding: 20rpx 60rpx;
  border: none;
}
</style>