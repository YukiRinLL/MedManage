<template>
  <view class="medication-container">
    <!-- 用药记录内容 -->
    <view class="medication-content">
      <view class="medication-card">
        <text class="card-title">今日用药</text>
        
        <view v-if="medications.length > 0" class="medication-list">
          <view v-for="med in medications" :key="med.id" class="medication-item">
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
              <label class="taken-checkbox" @click="toggleTaken(med)">
                <checkbox :checked="med.taken" />
                <text class="checkbox-label">{{ med.taken ? '已服用' : '未服用' }}</text>
              </label>
            </view>
            <view v-if="med.notes" class="medication-notes">
              {{ med.notes }}
            </view>
          </view>
        </view>
        
        <view v-else class="empty-state">
          <text class="empty-icon">💊</text>
          <text class="empty-text">暂无用药记录</text>
          <text class="empty-subtext">点击右上角添加按钮记录您的用药情况</text>
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
      medications: []
    }
  },
  onLoad() {
    this.getMedications()
  },
  methods: {
    async getMedications() {
      try {
        const token = uni.getStorageSync('token')
        if (!token) {
          uni.switchTab({
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
      }
    },
    async toggleTaken(med) {
      med.taken = !med.taken
      try {
        const token = uni.getStorageSync('token')
        await put(`/medication/update-taken/${med.id}`, { taken: med.taken })
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

.medication-item {
  padding: 16px;
  border-radius: 8px;
  background-color: #f9f9f9;
  border: 1px solid #f0f0f0;
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

.taken-checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
}

.checkbox-label {
  font-size: 14px;
  color: #333;
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