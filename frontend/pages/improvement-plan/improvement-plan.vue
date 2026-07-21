<template>
  <view class="plan-container">
    <view class="section-header animate-fade-in">
      <view class="header-bg"></view>
      <view class="header-content">
        <text class="section-title">指标提升方案</text>
        <text class="section-desc">个性化干预，持续改善健康</text>
      </view>
    </view>

    <view v-if="plan" class="plan-content">
      <view v-if="plan.abnormalIndicators" class="abnormal-alert">
        <view class="alert-header">
          <image src="/static/icons/png/filled/symbols/alert_triangle@2x.png" class="alert-icon" mode="aspectFit" />
          <text class="alert-title">异常指标预警</text>
        </view>
        <view class="alert-content">
          <text class="alert-text">{{ plan.abnormalIndicators }}</text>
        </view>
        <view class="risk-level" :class="plan.riskLevel">
          风险等级：{{ getRiskText(plan.riskLevel) }}
        </view>
      </view>

      <view class="plan-detail">
        <view class="detail-section">
          <view class="section-header-mini">
            <image src="/static/icons/png/filled/nutrition/fruits@2x.png" class="section-icon" mode="aspectFit" />
            <text class="section-title-mini">饮食调整方案</text>
          </view>
          <view class="section-content">
            <text class="content-text">{{ plan.dietPlan || '暂无饮食调整方案' }}</text>
          </view>
        </view>

        <view class="detail-section">
          <view class="section-header-mini">
            <image src="/static/icons/png/filled/objects/running_water.png" class="section-icon" mode="aspectFit" />
            <text class="section-title-mini">饮水管控方案</text>
          </view>
          <view class="section-content">
            <text class="content-text">{{ plan.waterControlPlan || '暂无饮水管控方案' }}</text>
          </view>
        </view>

        <view class="detail-section">
          <view class="section-header-mini">
            <image src="/static/icons/png/filled/exercise/walking@2x.png" class="section-icon" mode="aspectFit" />
            <text class="section-title-mini">生活作息建议</text>
          </view>
          <view class="section-content">
            <text class="content-text">{{ plan.lifestyleSuggestions || '暂无生活作息建议' }}</text>
          </view>
        </view>

        <view class="detail-section">
          <view class="section-header-mini">
            <image src="/static/icons/png/filled/medications/pill_1@2x.png" class="section-icon" mode="aspectFit" />
            <text class="section-title-mini">用药调整建议</text>
          </view>
          <view class="section-content">
            <text class="content-text">{{ plan.medicationAdjustments || '暂无用药调整建议' }}</text>
          </view>
        </view>

        <view class="detail-section">
          <view class="section-header-mini">
            <image src="/static/icons/png/filled/symbols/i_note_action@2x.png" class="section-icon" mode="aspectFit" />
            <text class="section-title-mini">随访注意事项</text>
          </view>
          <view class="section-content">
            <text class="content-text">{{ plan.followUpNotes || '暂无随访注意事项' }}</text>
          </view>
        </view>
      </view>

      <view class="plan-footer">
        <text class="plan-status">方案状态：{{ plan.status === 'active' ? '进行中' : '已完成' }}</text>
        <text class="plan-date">开始日期：{{ formatDate(plan.startDate) }}</text>
      </view>
    </view>

    <view v-else-if="!isLoading" class="empty-state">
      <image src="/static/icons/png/filled/symbols/i_note_action@2x.png" class="empty-icon" mode="aspectFit" />
      <text class="empty-text">暂无提升方案</text>
      <text class="empty-subtext">您的专属方案将由医护团队制定</text>
    </view>

    <view class="loading-container" v-if="isLoading">
      <view class="loading-spinner"></view>
      <text class="loading-text">加载中...</text>
    </view>

    <view class="bottom-space"></view>
  </view>
</template>

<script>
import { get } from '../../utils/request.js'

export default {
  data() {
    return {
      plan: null,
      isLoading: true
    }
  },
  onLoad() {
    this.fetchPlan()
  },
  methods: {
    async fetchPlan() {
      this.isLoading = true
      try {
        const userId = uni.getStorageSync('userId')
        const res = await get(`/improvement-plan/current/${userId}`)
        if (res.code === 200) {
          this.plan = res.data
        }
      } catch (err) {
        console.log(err)
      } finally {
        this.isLoading = false
      }
    },
    formatDate(dateString) {
      if (!dateString) return '-'
      const date = new Date(dateString)
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    },
    getRiskText(riskLevel) {
      const riskMap = {
        'high': '高风险',
        'medium': '中风险',
        'low': '低风险'
      }
      return riskMap[riskLevel] || '无风险'
    }
  }
}
</script>

<style scoped>
.plan-container {
  padding: 0;
  min-height: 100vh;
  background-color: #F5F7FA;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.4s ease-out both;
}

.section-header {
  padding: 30px 20px 20px;
  background-color: #009D85;
  color: #FFFFFF;
}

.header-content {
  position: relative;
  z-index: 1;
}

.section-title {
  display: block;
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
  letter-spacing: 2px;
}

.section-desc {
  display: block;
  font-size: 15px;
  opacity: 0.9;
}

.plan-content {
  padding: 16px;
}

.abnormal-alert {
  background-color: #FFFFFF;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  border-left: 4px solid #F56C6C;
}

.alert-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.alert-icon {
  width: 20px;
  height: 20px;
}

.alert-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.alert-content {
  margin-bottom: 12px;
}

.alert-text {
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
}

.risk-level {
  display: inline-block;
  padding: 6px 16px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 500;
}

.risk-level.high {
  background-color: rgba(245, 108, 108, 0.1);
  color: #F56C6C;
}

.risk-level.medium {
  background-color: rgba(250, 173, 20, 0.1);
  color: #E6A23C;
}

.risk-level.low {
  background-color: rgba(0, 157, 133, 0.1);
  color: #009D85;
}

.plan-detail {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail-section {
  background-color: #FFFFFF;
  border-radius: 12px;
  padding: 16px;
}

.section-header-mini {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid #F0F0F0;
}

.section-icon {
  width: 18px;
  height: 18px;
}

.section-title-mini {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
}

.section-content {
  padding: 8px 0;
}

.content-text {
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
}

.plan-footer {
  background-color: #FFFFFF;
  border-radius: 12px;
  padding: 16px;
  margin-top: 12px;
}

.plan-status {
  display: block;
  font-size: 14px;
  color: #009D85;
  margin-bottom: 8px;
}

.plan-date {
  font-size: 14px;
  color: #909399;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
}

.empty-icon {
  width: 48px;
  height: 48px;
  margin-bottom: 20px;
}

.empty-text {
  font-size: 16px;
  color: #333;
  margin-bottom: 8px;
}

.empty-subtext {
  font-size: 14px;
  color: #999;
}

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

.bottom-space {
  height: 100px;
}
</style>