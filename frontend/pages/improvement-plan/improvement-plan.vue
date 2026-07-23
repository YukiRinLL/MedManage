<template>
  <view class="plan-container">
    <view class="section-header animate-fade-in">
      <view class="header-content">
        <text class="section-title">指标提升方案</text>
        <text class="section-desc">个性化干预，持续改善健康</text>
      </view>
    </view>

    <view class="plan-content">
      <view class="section-card animate-fade-in-up" :style="{ animationDelay: '0.1s' }">
        <view class="card-header">
          <image src="/static/icons/png/filled/symbols/alert_triangle@2x.png" class="card-icon" mode="aspectFit" />
          <text class="card-title">异常指标提醒</text>
          <view class="alert-badge" v-if="abnormalIndicators.length > 0">{{ abnormalIndicators.length }}</view>
        </view>
        
        <view v-if="abnormalIndicators.length > 0" class="abnormal-list">
          <view 
            class="abnormal-item" 
            v-for="(item, index) in abnormalIndicators" 
            :key="index"
            :class="item.level"
          >
            <view class="indicator-icon">
              <image :src="getIndicatorIcon(item.key)" class="icon-img" mode="aspectFit" />
            </view>
            <view class="indicator-info">
              <text class="indicator-name">{{ item.name }}</text>
              <text class="indicator-value">当前值: <text class="value-number">{{ item.value }}</text> {{ item.unit }}</text>
              <text class="indicator-range">正常范围: {{ item.min }} - {{ item.max }} {{ item.unit }}</text>
            </view>
            <view class="indicator-status">
              <text class="status-text" :class="item.level">{{ item.level === 'high' ? '偏高' : '偏低' }}</text>
            </view>
          </view>
        </view>
        
        <view v-else class="normal-state">
          <image src="/static/icons/png/filled/symbols/info@2x.png" class="normal-icon" mode="aspectFit" />
          <text class="normal-text">所有指标正常</text>
          <text class="normal-subtext">继续保持良好的生活习惯</text>
        </view>
      </view>

      <view class="section-card animate-fade-in-up" :style="{ animationDelay: '0.2s' }">
        <view class="card-header">
          <image src="/static/icons/png/filled/symbols/risk_analysis@2x.png" class="card-icon" mode="aspectFit" />
          <text class="card-title">提升方案</text>
        </view>
        
        <view v-if="plan && plan.dietPlan" class="plan-section">
          <view class="plan-item">
            <image src="/static/icons/png/filled/nutrition/fruits@2x.png" class="plan-icon" mode="aspectFit" />
            <view class="plan-body">
              <text class="plan-title">饮食调整方案</text>
              <text class="plan-desc">{{ plan.dietPlan }}</text>
            </view>
          </view>
        </view>
        
        <view v-if="plan && plan.waterControlPlan" class="plan-section">
          <view class="plan-item">
            <image src="/static/icons/png/filled/objects/running_water.png" class="plan-icon" mode="aspectFit" />
            <view class="plan-body">
              <text class="plan-title">饮水管控方案</text>
              <text class="plan-desc">{{ plan.waterControlPlan }}</text>
            </view>
          </view>
        </view>
        
        <view v-if="plan && plan.lifestyleSuggestions" class="plan-section">
          <view class="plan-item">
            <image src="/static/icons/png/filled/exercise/walking@2x.png" class="plan-icon" mode="aspectFit" />
            <view class="plan-body">
              <text class="plan-title">生活作息建议</text>
              <text class="plan-desc">{{ plan.lifestyleSuggestions }}</text>
            </view>
          </view>
        </view>
        
        <view v-if="plan && plan.medicationAdjustments" class="plan-section">
          <view class="plan-item">
            <image src="/static/icons/png/filled/medications/pill_1@2x.png" class="plan-icon" mode="aspectFit" />
            <view class="plan-body">
              <text class="plan-title">用药调整建议</text>
              <text class="plan-desc">{{ plan.medicationAdjustments }}</text>
            </view>
          </view>
        </view>
        
        <view v-if="plan && plan.followUpNotes" class="plan-section">
          <view class="plan-item">
            <image src="/static/icons/png/filled/symbols/i_note_action@2x.png" class="plan-icon" mode="aspectFit" />
            <view class="plan-body">
              <text class="plan-title">随访注意事项</text>
              <text class="plan-desc">{{ plan.followUpNotes }}</text>
            </view>
          </view>
        </view>
        
        <view v-if="(!plan || (!plan.dietPlan && !plan.waterControlPlan && !plan.lifestyleSuggestions && !plan.medicationAdjustments && !plan.followUpNotes)) && !isLoading" class="empty-plan">
          <image src="/static/icons/png/filled/symbols/i_note_action@2x.png" class="empty-icon" mode="aspectFit" />
          <text class="empty-text">暂无提升方案</text>
          <text class="empty-subtext">您的专属方案将由医护团队根据您的指标情况制定</text>
        </view>
      </view>

      <view v-if="plan" class="section-card animate-fade-in-up" :style="{ animationDelay: '0.3s' }">
        <view class="plan-meta">
          <view class="meta-item">
            <text class="meta-label">方案状态</text>
            <text class="meta-value" :class="plan.status === 'active' ? 'active' : 'completed'">
              {{ plan.status === 'active' ? '进行中' : '已完成' }}
            </text>
          </view>
          <view class="meta-item">
            <text class="meta-label">开始日期</text>
            <text class="meta-value">{{ formatDate(plan.startDate) }}</text>
          </view>
        </view>
      </view>
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
      abnormalIndicators: [],
      isLoading: true
    }
  },
  onLoad() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      this.isLoading = true
      try {
        const userId = uni.getStorageSync('userId')
        
        const [planRes, testRes] = await Promise.all([
          get(`/improvement-plan/current/${userId}`),
          get(`/blood-test/latest/${userId}`)
        ])
        
        if (planRes.code === 200) {
          this.plan = planRes.data
        }
        
        if (testRes.code === 200 && testRes.data) {
          this.abnormalIndicators = this.calculateAbnormal(testRes.data)
        }
      } catch (err) {
        console.log(err)
      } finally {
        this.isLoading = false
      }
    },
    calculateAbnormal(test) {
      const indicators = [
        { key: 'hemoglobin', name: '血红蛋白', unit: 'g/L', min: 110, max: 130 },
        { key: 'ureaNitrogen', name: '尿素氮', unit: 'mmol/L', min: 3.2, max: 7.1 },
        { key: 'uricAcid', name: '尿酸', unit: 'μmol/L', min: 208, max: 428 },
        { key: 'potassium', name: '钾', unit: 'mmol/L', min: 3.5, max: 5.5 },
        { key: 'sodium', name: '钠', unit: 'mmol/L', min: 135, max: 145 },
        { key: 'calcium', name: '钙', unit: 'mmol/L', min: 2.1, max: 2.6 },
        { key: 'phosphorus', name: '磷', unit: 'mmol/L', min: 0.8, max: 1.45 },
        { key: 'albumin', name: '白蛋白', unit: 'g/L', min: 35, max: 50 },
        { key: 'parathyroidHormone', name: '甲状旁腺激素', unit: 'pg/mL', min: 150, max: 300 }
      ]
      
      const abnormal = []
      indicators.forEach(ind => {
        const value = test[ind.key]
        if (value !== null && value !== undefined) {
          if (value < ind.min) {
            abnormal.push({ ...ind, value, level: 'low' })
          } else if (value > ind.max) {
            abnormal.push({ ...ind, value, level: 'high' })
          }
        }
      })
      
      return abnormal
    },
    getIndicatorIcon(key) {
      const iconMap = {
        hemoglobin: '/static/icons/png/filled/symbols/heart_cardiogram@2x.png',
        ureaNitrogen: '/static/icons/png/filled/graphs/chart_bar@2x.png',
        uricAcid: '/static/icons/png/filled/graphs/chart_bar@2x.png',
        potassium: '/static/icons/png/filled/graphs/chart_bar@2x.png',
        sodium: '/static/icons/png/filled/graphs/chart_bar@2x.png',
        calcium: '/static/icons/png/filled/graphs/chart_bar@2x.png',
        phosphorus: '/static/icons/png/filled/graphs/chart_bar@2x.png',
        albumin: '/static/icons/png/filled/graphs/chart_bar@2x.png',
        parathyroidHormone: '/static/icons/png/filled/graphs/chart_bar@2x.png'
      }
      return iconMap[key] || '/static/icons/png/filled/graphs/chart_bar@2x.png'
    },
    formatDate(dateString) {
      if (!dateString) return '-'
      const date = new Date(dateString)
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
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
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.4s ease-out both;
}

.animate-fade-in-up {
  animation: fadeInUp 0.4s ease-out both;
}

.section-header {
  padding: 30px 20px 20px;
  background-color: #009D85;
  color: #FFFFFF;
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

.section-card {
  background-color: #FFFFFF;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #F0F0F0;
}

.card-icon {
  width: 22px;
  height: 22px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.alert-badge {
  background-color: #F56C6C;
  color: #FFFFFF;
  font-size: 12px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 10px;
  margin-left: auto;
}

.abnormal-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.abnormal-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  background-color: #F5F7FA;
  border-left: 3px solid #E6A23C;
}

.abnormal-item.high {
  border-left-color: #F56C6C;
  background-color: rgba(245, 108, 108, 0.05);
}

.abnormal-item.low {
  border-left-color: #3B82F6;
  background-color: rgba(59, 130, 246, 0.05);
}

.indicator-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background-color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
}

.icon-img {
  width: 22px;
  height: 22px;
}

.indicator-info {
  flex: 1;
}

.indicator-name {
  display: block;
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}

.indicator-value {
  display: block;
  font-size: 13px;
  color: #606266;
  margin-bottom: 2px;
}

.value-number {
  font-weight: 600;
  color: #303133;
}

.indicator-range {
  font-size: 12px;
  color: #909399;
}

.indicator-status {
  padding: 6px 12px;
  border-radius: 8px;
}

.status-text {
  font-size: 12px;
  font-weight: 600;
}

.status-text.high {
  color: #F56C6C;
}

.status-text.low {
  color: #3B82F6;
}

.normal-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 0;
}

.normal-icon {
  width: 48px;
  height: 48px;
  margin-bottom: 12px;
}

.normal-text {
  font-size: 15px;
  font-weight: 600;
  color: #009D85;
  margin-bottom: 6px;
}

.normal-subtext {
  font-size: 13px;
  color: #909399;
}

.plan-section {
  margin-bottom: 16px;
}

.plan-section:last-child {
  margin-bottom: 0;
}

.plan-item {
  display: flex;
  align-items: flex-start;
}

.plan-icon {
  width: 36px;
  height: 36px;
  margin-right: 12px;
}

.plan-body {
  flex: 1;
}

.plan-title {
  display: block;
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
}

.plan-desc {
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
}

.empty-plan {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 0;
}

.empty-icon {
  width: 48px;
  height: 48px;
  margin-bottom: 12px;
}

.empty-text {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 6px;
}

.empty-subtext {
  font-size: 13px;
  color: #909399;
  text-align: center;
  line-height: 1.5;
}

.plan-meta {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
}

.meta-item {
  flex: 1;
  text-align: center;
}

.meta-label {
  display: block;
  font-size: 13px;
  color: #909399;
  margin-bottom: 6px;
}

.meta-value {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
}

.meta-value.active {
  color: #009D85;
}

.meta-value.completed {
  color: #909399;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
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