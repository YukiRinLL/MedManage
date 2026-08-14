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
              </view>
              <view class="vital-details">
                <view class="vital-detail-item">
                  <text class="detail-label">今日体重</text>
                  <text class="detail-value">{{ sign.weight ? sign.weight + 'kg' : '-' }}</text>
                </view>
                <view class="vital-detail-item">
                  <text class="detail-label">早上血压</text>
                  <text class="detail-value">{{ sign.morningSystolicPressure ? sign.morningSystolicPressure + '/' + sign.morningDiastolicPressure + 'mmHg' : '-' }}</text>
                </view>
                <view class="vital-detail-item">
                  <text class="detail-label">晚上血压</text>
                  <text class="detail-value">{{ sign.eveningSystolicPressure ? sign.eveningSystolicPressure + '/' + sign.eveningDiastolicPressure + 'mmHg' : '-' }}</text>
                </view>
                <view class="vital-detail-item">
                  <text class="detail-label">血糖</text>
                  <text class="detail-value">{{ sign.bloodSugar ? sign.bloodSugar + 'mmol/L' : '-' }}</text>
                </view>
                <view class="vital-detail-item">
                  <text class="detail-label">今日饮水量</text>
                  <text class="detail-value">{{ sign.waterIntake != null ? sign.waterIntake + 'ml' : '-' }}</text>
                </view>
              </view>
              <view v-if="sign.dietRecord" class="vital-notes">
                <text class="notes-label">饮食记录：</text>
                <text class="notes-content">{{ sign.dietRecord }}</text>
              </view>
              <text class="vital-arrow">›</text>
            </view>
          </view>

          <view v-else class="empty-state">
            <image src="/static/icons/png/filled/graphs/chart_bar@2x.png" class="empty-icon" mode="aspectFit" />
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
    handleItemClick(sign) {
      uni.vibrateShort({})
      let content = ''
      if (sign.weight) content += `今日体重: ${sign.weight}kg\n`
      if (sign.morningSystolicPressure) content += `早上血压: ${sign.morningSystolicPressure}/${sign.morningDiastolicPressure}mmHg\n`
      if (sign.eveningSystolicPressure) content += `晚上血压: ${sign.eveningSystolicPressure}/${sign.eveningDiastolicPressure}mmHg\n`
      if (sign.bloodSugar) content += `血糖: ${sign.bloodSugar}mmol/L\n`
      if (sign.waterIntake != null) content += `今日饮水量: ${sign.waterIntake}ml\n`
      if (sign.dietRecord) content += `饮食记录: ${sign.dietRecord}`
      uni.showModal({
        title: '记录详情',
        content: content || '无详细数据',
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
  background: linear-gradient(180deg, #b3fff4 0%, #FFFFFF 40%, #FFFFFF 100%);
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(180deg, #b3fff4 0%, #FFFFFF 40%, #FFFFFF 100%);
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

.vital-sign-content {
  padding: 16px;
  padding-bottom: 100px;
}

.vital-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 4px 16px rgba(25, 162, 128, 0.08);
  border-radius: 12px;
  padding: 20px;
}

.card-title {
  display: block;
  font-size: 16px;
  font-weight: 500;
  color: #1A2B44;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(25, 162, 128, 0.08);
}

.vital-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.vital-item {
  padding: 16px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(25, 162, 128, 0.08);
  transition: all 0.2s ease;
  position: relative;
}

.vital-item:active {
  background-color: #FFFFFF;
  transform: scale(0.98);
  box-shadow: 0 2px 8px rgba(25, 162, 128, 0.12);
}

.vital-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.vital-time {
  font-size: 12px;
  color: #909399;
}

.vital-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 8px;
}

.vital-detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-label {
  font-size: 14px;
  color: #909399;
}

.detail-value {
  font-size: 14px;
  font-weight: 500;
  color: #1A2B44;
}

.vital-notes {
  font-size: 12px;
  color: #909399;
  padding-top: 8px;
  border-top: 1px dashed rgba(25, 162, 128, 0.08);
}

.notes-label {
  font-weight: 500;
  color: #606266;
}

.notes-content {
  color: #909399;
}

.vital-arrow {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 20px;
  color: #C0C4CC;
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

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
}

.empty-icon {
  width: 48px;
  height: 48px;
  margin-bottom: 20px;
}

.empty-text {
  display: block;
  font-size: 16px;
  color: #1A2B44;
  margin-bottom: 8px;
}

.empty-subtext {
  display: block;
  font-size: 14px;
  color: #909399;
}
</style>
