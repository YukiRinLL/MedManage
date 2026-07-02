<template>
  <view class="vital-sign-container">
    <!-- 加载状态 -->
    <view v-if="isLoading" class="loading-container">
      <view class="loading-spinner"></view>
      <text class="loading-text">加载中...</text>
    </view>
    
    <!-- 内容区域 -->
    <view v-else>
      <!-- 添加记录按钮 -->
      <view class="add-button-container">
        <button class="add-button" @click="navigateToAddRecord">+ 添加记录</button>
      </view>
      
      <!-- 生命体征内容 -->
      <view class="vital-sign-content">
        <view class="vital-card">
          <text class="card-title">最近记录</text>
          
          <view v-if="vitalSigns.length > 0" class="vital-list">
            <view 
              v-for="(sign, index) in vitalSigns" 
              :key="sign.id" 
              class="vital-item animate-fade-in-up"
              :style="{ animationDelay: index * 0.05 + 's' }"
              @click="handleItemClick(sign)"
            >
              <view class="vital-header">
                <text class="vital-time">{{ formatDate(sign.recordTime) }}</text>
                <view class="vital-status" :class="isNormal(sign) ? 'status-normal' : 'status-abnormal'">
                  {{ isNormal(sign) ? '✓ 正常' : '! 异常' }}
                </view>
              </view>
              <view class="vital-details">
                <view class="vital-detail-item">
                  <text class="detail-label">体温</text>
                  <text class="detail-value" :class="{ abnormal: !isTempNormal(sign.temperature) }">{{ sign.temperature }}℃</text>
                </view>
                <view class="vital-detail-item">
                  <text class="detail-label">血压</text>
                  <text class="detail-value" :class="{ abnormal: !isPressureNormal(sign.systolicPressure, sign.diastolicPressure) }">{{ sign.systolicPressure }}/{{ sign.diastolicPressure }}mmHg</text>
                </view>
                <view class="vital-detail-item">
                  <text class="detail-label">血糖</text>
                  <text class="detail-value" :class="{ abnormal: !isSugarNormal(sign.bloodSugar) }">{{ sign.bloodSugar }}mmol/L</text>
                </view>
                <view class="vital-detail-item">
                  <text class="detail-label">心率</text>
                  <text class="detail-value" :class="{ abnormal: !isHeartRateNormal(sign.heartRate) }">{{ sign.heartRate }}bpm</text>
                </view>
              </view>
              <view v-if="sign.notes" class="vital-notes">
                {{ sign.notes }}
              </view>
              <text class="vital-arrow">›</text>
            </view>
          </view>
          
          <view v-else class="empty-state">
            <text class="empty-icon">📊</text>
            <text class="empty-text">暂无生命体征记录</text>
            <text class="empty-subtext">点击下方添加按钮记录您的生命体征</text>
          </view>
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
      vitalSigns: [],
      isLoading: true
    }
  },
  onLoad() {
    this.getVitalSigns()
  },
  methods: {
    async getVitalSigns() {
      this.isLoading = true
      try {
        const token = uni.getStorageSync('token')
        if (!token) {
          uni.navigateTo({
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
      } finally {
        this.isLoading = false
      }
    },
    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleString()
    },
    isNormal(sign) {
      return this.isTempNormal(sign.temperature) && 
             this.isPressureNormal(sign.systolicPressure, sign.diastolicPressure) && 
             this.isSugarNormal(sign.bloodSugar) && 
             this.isHeartRateNormal(sign.heartRate)
    },
    isTempNormal(temp) {
      return temp >= 36.0 && temp <= 37.3
    },
    isPressureNormal(systolic, diastolic) {
      return systolic >= 90 && systolic <= 140 && diastolic >= 60 && diastolic <= 90
    },
    isSugarNormal(sugar) {
      return sugar >= 3.9 && sugar <= 6.1
    },
    isHeartRateNormal(rate) {
      return rate >= 60 && rate <= 100
    },
    handleItemClick(sign) {
      uni.vibrateShort({})
      uni.showModal({
        title: '记录详情',
        content: `体温: ${sign.temperature}℃\n血压: ${sign.systolicPressure}/${sign.diastolicPressure}mmHg\n血糖: ${sign.bloodSugar}mmol/L\n心率: ${sign.heartRate}bpm${sign.notes ? '\n备注: ' + sign.notes : ''}`,
        showCancel: false,
        confirmText: '知道了'
      })
    },
    navigateToAddRecord() {
      uni.vibrateShort({})
      uni.navigateTo({
        url: '/pages/vital-sign/add-record'
      })
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

/* 加载状态样式 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 157, 133, 0.2);
  border-radius: 50%;
  border-top-color: #009D85;
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 16px;
}

.loading-text {
  font-size: 14px;
  color: #606266;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 添加记录按钮 */
.add-button-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 999;
}

.add-button {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #009D85;
  color: #FFFFFF;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 157, 133, 0.4);
}

.add-button:active {
  background-color: #007D6B;
  transform: scale(0.95);
}

/* 生命体征内容 */
.vital-sign-content {
  padding: 16px;
  padding-bottom: 100px;
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
  background-color: rgba(245, 108, 108, 0.15);
  color: #F56C6C;
}

.vital-status.normal {
  background-color: rgba(0, 157, 133, 0.15);
  color: #009D85;
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

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.3s ease-out both;
}

.vital-item {
  padding: 16px;
  border-radius: 8px;
  background-color: #f9f9f9;
  border: 1px solid #f0f0f0;
  transition: all 0.2s ease;
  position: relative;
}

.vital-item:active {
  background-color: #FFFFFF;
  transform: scale(0.98);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.vital-status {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 10px;
}

.status-normal {
  background-color: rgba(0, 157, 133, 0.15);
  color: #009D85;
}

.status-abnormal {
  background-color: rgba(245, 108, 108, 0.15);
  color: #F56C6C;
}

.detail-value.abnormal {
  color: #F56C6C;
  font-weight: 600;
}

.vital-arrow {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 20px;
  color: #C0C4CC;
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