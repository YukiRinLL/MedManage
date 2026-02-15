<template>
  <view class="vital-sign-container">
    <!-- 生命体征内容 -->
    <view class="vital-sign-content">
      <view class="vital-card">
        <text class="card-title">最近记录</text>
        
        <view v-if="vitalSigns.length > 0" class="vital-list">
          <view v-for="sign in vitalSigns" :key="sign.id" class="vital-item">
            <view class="vital-header">
              <text class="vital-time">{{ formatDate(sign.recordTime) }}</text>
              <text class="vital-status" :class="{ normal: isNormal(sign) }">
                {{ isNormal(sign) ? '正常' : '异常' }}
              </text>
            </view>
            <view class="vital-details">
              <view class="vital-detail-item">
                <text class="detail-label">体温</text>
                <text class="detail-value">{{ sign.temperature }}℃</text>
              </view>
              <view class="vital-detail-item">
                <text class="detail-label">血压</text>
                <text class="detail-value">{{ sign.systolicPressure }}/{{ sign.diastolicPressure }}mmHg</text>
              </view>
              <view class="vital-detail-item">
                <text class="detail-label">血糖</text>
                <text class="detail-value">{{ sign.bloodSugar }}mmol/L</text>
              </view>
              <view class="vital-detail-item">
                <text class="detail-label">心率</text>
                <text class="detail-value">{{ sign.heartRate }}bpm</text>
              </view>
            </view>
            <view v-if="sign.notes" class="vital-notes">
              {{ sign.notes }}
            </view>
          </view>
        </view>
        
        <view v-else class="empty-state">
          <text class="empty-icon">📊</text>
          <text class="empty-text">暂无生命体征记录</text>
          <text class="empty-subtext">点击右上角添加按钮记录您的生命体征</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { get } from '../../utils/request.js'

export default {
  data() {
    return {
      vitalSigns: []
    }
  },
  onLoad() {
    this.getVitalSigns()
  },
  methods: {
    async getVitalSigns() {
      try {
        const token = uni.getStorageSync('token')
        if (!token) {
          uni.switchTab({
            url: '/pages/login/login'
          })
          return
        }
        const res = await get('/vital-sign/list')
        if (res.code === 200) {
          this.vitalSigns = res.data
        }
      } catch (err) {
        console.log(err)
        uni.showToast({
          title: '获取生命体征数据失败',
          icon: 'none'
        })
      }
    },
    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleString()
    },
    isNormal(sign) {
      const tempNormal = sign.temperature >= 36.0 && sign.temperature <= 37.3
      const pressureNormal = sign.systolicPressure >= 90 && sign.systolicPressure <= 140 && 
                            sign.diastolicPressure >= 60 && sign.diastolicPressure <= 90
      const sugarNormal = sign.bloodSugar >= 3.9 && sign.bloodSugar <= 6.1
      const heartRateNormal = sign.heartRate >= 60 && sign.heartRate <= 100
      
      return tempNormal && pressureNormal && sugarNormal && heartRateNormal
    }
  }
}
</script>

<style scoped>
.vital-sign-container {
  padding: 0;
  min-height: 100vh;
  background-color: #f5f5f5;
}

/* 生命体征内容 */
.vital-sign-content {
  padding: 16px;
}

.vital-card {
  background-color: #FFFFFF;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card-title {
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.vital-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.vital-item {
  padding: 16px;
  border-radius: 8px;
  background-color: #f9f9f9;
  border: 1px solid #f0f0f0;
}

.vital-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.vital-time {
  font-size: 12px;
  color: #666;
}

.vital-status {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 10px;
  background-color: #ff3b30;
  color: white;
}

.vital-status.normal {
  background-color: #34c759;
}

.vital-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 12px;
}

.vital-detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-label {
  font-size: 14px;
  color: #666;
}

.detail-value {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.vital-notes {
  font-size: 12px;
  color: #666;
  padding-top: 8px;
  border-top: 1px dashed #f0f0f0;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 60px;
  margin-bottom: 20px;
}

.empty-text {
  display: block;
  font-size: 16px;
  color: #333;
  margin-bottom: 8px;
}

.empty-subtext {
  display: block;
  font-size: 14px;
  color: #999;
}
</style>