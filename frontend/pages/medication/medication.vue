<template>
  <view class="medication-container">
    <!-- 加载状态 -->
    <view v-if="isLoading" class="loading-container">
      <view class="loading-spinner"></view>
      <text class="loading-text">加载中...</text>
    </view>
    
    <!-- 内容区域 -->
    <view v-else>
      <!-- 用药记录内容 -->
      <view class="medication-content">
        <view class="medication-card">
          <text class="card-title">今日用药</text>
          
          <view v-if="medications.length > 0" class="medication-list">
            <view 
              v-for="(med, index) in medications" 
              :key="med.id" 
              class="medication-item animate-fade-in-up"
              :style="{ animationDelay: index * 0.05 + 's' }"
            >
              <view class="medication-header">
                <text class="medication-name">{{ med.medicationName }}</text>
                <text class="medication-time">{{ formatDate(med.medicationTime) }}</text>
              </view>
              <view class="medication-details">
                <view class="detail-item">
                  <text class="detail-label">剂量</text>
                  <text class="detail-value">{{ med.dosage }}</text>
                </view>
                <view class="detail-item">
                  <text class="detail-label">频率</text>
                  <text class="detail-value">{{ med.frequency }}</text>
                </view>
              </view>
              <view class="medication-actions">
                <view 
                  class="taken-button" 
                  :class="{ taken: med.taken }"
                  @click="toggleTaken(med)"
                >
                  <view class="checkbox-circle" :class="{ checked: med.taken }">
                    <text v-if="med.taken" class="check-icon">✓</text>
                  </view>
                  <text class="checkbox-label">{{ med.taken ? '已服用' : '未服用' }}</text>
                </view>
              </view>
              <view v-if="med.notes" class="medication-notes">
                {{ med.notes }}
              </view>
            </view>
          </view>
          
          <view v-else class="empty-state">
            <view class="empty-icon"></view>
            <text class="empty-text">暂无用药记录</text>
            <text class="empty-subtext">点击右上角添加按钮记录您的用药情况</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { get, put } from '../../utils/request.js'

export default {
  data() {
    return {
      medications: [],
      isLoading: true
    }
  },
  onLoad() {
    this.getMedications()
  },
  methods: {
    async getMedications() {
      this.isLoading = true
      try {
        const token = uni.getStorageSync('token')
        if (!token) {
          uni.navigateTo({
            url: '/pages/login/login'
          })
          return
        }
        const res = await get('/medication/list')
        if (res.code === 200) {
          this.medications = res.data
        }
      } catch (err) {
        console.log(err)
        uni.showToast({
          title: '获取用药记录失败',
          icon: 'none'
        })
      } finally {
        this.isLoading = false
      }
    },
    async toggleTaken(med) {
      uni.vibrateShort({})
      med.taken = !med.taken
      try {
        const token = uni.getStorageSync('token')
        await put(`/medication/update-taken/${med.id}`, { taken: med.taken })
        uni.showToast({
          title: med.taken ? '已标记为服用' : '已标记为未服用',
          icon: 'none',
          duration: 1500
        })
      } catch (err) {
        console.log(err)
        uni.showToast({
          title: '更新用药状态失败',
          icon: 'none'
        })
        med.taken = !med.taken
      }
    },
    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleString()
    }
  }
}
</script>

<style scoped>
.medication-container {
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

/* 用药记录内容 */
.medication-content {
  padding: 16px;
}

.medication-card {
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

.medication-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
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

.medication-item {
  padding: 16px;
  border-radius: 8px;
  background-color: #f9f9f9;
  border: 1px solid #f0f0f0;
  transition: all 0.2s ease;
}

.medication-item:active {
  background-color: #FFFFFF;
  transform: scale(0.98);
}

.medication-header {
  margin-bottom: 12px;
}

.medication-name {
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.medication-time {
  display: block;
  font-size: 12px;
  color: #666;
}

.medication-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-bottom: 12px;
}

.detail-item {
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

.medication-actions {
  margin-bottom: 12px;
}

.taken-button {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  border-radius: 20px;
  background-color: #F5F7FA;
  border: 1px solid #DCDFE6;
  transition: all 0.25s ease;
}

.taken-button:active {
  transform: scale(0.96);
}

.taken-button.taken {
  background-color: rgba(0, 157, 133, 0.1);
  border-color: #009D85;
}

.checkbox-circle {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #C0C4CC;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s ease;
}

.checkbox-circle.checked {
  background-color: #009D85;
  border-color: #009D85;
  transform: scale(1.1);
}

.check-icon {
  color: #FFFFFF;
  font-size: 12px;
  font-weight: 600;
}

.checkbox-label {
  font-size: 14px;
  color: #606266;
}

.taken-button.taken .checkbox-label {
  color: #009D85;
}

.medication-notes {
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
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  background-color: #F0F0F0;
  border-radius: 16px;
  position: relative;
}

.empty-icon::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 28px;
  height: 12px;
  background-color: #C0C4CC;
  border-radius: 6px;
  transform: translate(-50%, -50%) rotate(45deg);
}

.empty-icon::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 28px;
  height: 12px;
  background-color: #C0C4CC;
  border-radius: 6px;
  transform: translate(-50%, -50%) rotate(-45deg);
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