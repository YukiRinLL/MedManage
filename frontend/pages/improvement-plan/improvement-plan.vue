<template>
  <view class="plan-container">
    <!-- Sticky Top -->
    <view class="sticky-top" :class="{ 'frost-visible': pageVisible }">
      <view class="status-bar">
        <view class="status-content">
          <image src="/static/design/home/图层 0 4.png" class="logo-layer-img" mode="aspectFit" />
          <text class="header-title">指标提升方案</text>
        </view>
      </view>
    </view>

    <!-- Top Background -->
    <view class="top-bg"></view>

    <!-- Main Content -->
    <view class="main-content" :class="{ 'frost-visible': pageVisible }">
      <!-- 健康指标追踪卡片 -->
      <view class="indicator-card animate-fade-in-up" :style="{ animationDelay: '0.1s' }">
        <view class="card-header">
          <image src="/static/icons/png/filled/symbols/risk_analysis@2x.png" class="card-icon" mode="aspectFit" />
          <text class="card-title">健康指标追踪</text>
          <view class="alert-badge" v-if="abnormalCount > 0">{{ abnormalCount }}</view>
        </view>

        <text class="card-subtitle">以下指标依据透析患者综合健康指标提升与追踪表设定</text>

        <!-- 指标列表 -->
        <view class="indicator-list">
          <view
            class="indicator-item"
            v-for="(item, index) in indicators"
            :key="index"
            :class="item.status"
          >
            <view class="indicator-left">
              <view class="indicator-name-row">
                <text class="indicator-name">{{ item.name }}</text>
                <view class="indicator-status-badge" :class="item.status">
                  <text class="status-label">{{ item.statusText }}</text>
                </view>
              </view>
              <text class="indicator-significance">{{ item.significance }}</text>
              <view class="indicator-values">
                <view class="value-block">
                  <text class="value-label">目标</text>
                  <text class="value-text target">{{ item.target }}</text>
                </view>
                <view class="value-divider"></view>
                <view class="value-block">
                  <text class="value-label">实测</text>
                  <text class="value-text current" :class="item.status">{{ item.currentText }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 提升方案卡片 -->
      <view class="plan-card animate-fade-in-up" :style="{ animationDelay: '0.2s' }">
        <view class="card-header">
          <image src="/static/icons/png/filled/symbols/i_note_action@2x.png" class="card-icon" mode="aspectFit" />
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
          <text class="empty-text">暂无提升方案</text>
          <text class="empty-subtext">您的专属方案将由医护团队根据指标情况制定</text>
        </view>
      </view>

      <!-- 方案状态 -->
      <view v-if="plan" class="meta-card animate-fade-in-up" :style="{ animationDelay: '0.3s' }">
        <view class="meta-item">
          <text class="meta-label">方案状态</text>
          <text class="meta-value" :class="plan.status === 'active' ? 'active' : 'completed'">
            {{ plan.status === 'active' ? '进行中' : '已完成' }}
          </text>
        </view>
        <view class="meta-divider"></view>
        <view class="meta-item">
          <text class="meta-label">开始日期</text>
          <text class="meta-value">{{ formatDate(plan.startDate) }}</text>
        </view>
      </view>
    </view>

    <view class="loading-container" v-if="isLoading">
      <view class="loading-spinner"></view>
      <text class="loading-text">加载中...</text>
    </view>
  </view>
</template>

<script>
import { get } from '../../utils/request.js'

export default {
  data() {
    return {
      plan: null,
      indicators: [],
      isLoading: true,
      pageVisible: false
    }
  },
  computed: {
    abnormalCount() {
      return this.indicators.filter(i => i.status === 'high' || i.status === 'low').length
    }
  },
  onLoad() {
    this.fetchData()
    this.$nextTick(() => {
      setTimeout(() => { this.pageVisible = true }, 100)
    })
  },
  methods: {
    async fetchData() {
      this.isLoading = true
      try {
        const userId = uni.getStorageSync('userId')

        const [planRes, testRes, vitalRes] = await Promise.all([
          get(`/improvement-plan/current/${userId}`),
          get(`/blood-test/latest/${userId}`),
          get(`/vital-sign/latest/${userId}`)
        ])

        if (planRes.code === 200) {
          this.plan = planRes.data
        }

        const testData = (testRes.code === 200) ? testRes.data : null
        const vitalData = (vitalRes.code === 200) ? vitalRes.data : null

        this.indicators = this.buildIndicators(testData, vitalData)
      } catch (err) {
        console.log(err)
      } finally {
        this.isLoading = false
      }
    },
    buildIndicators(test, vital) {
      // Excel 9 项指标定义
      const defs = [
        {
          key: 'ktV',
          name: '透析充分性（Kt/V）',
          significance: '评估透析治疗效果',
          target: '≥1.2',
          unit: '',
          min: 1.2,
          max: null,
          type: 'min'
        },
        {
          key: 'hemoglobin',
          name: '血红蛋白(Hb)',
          significance: '反映贫血纠正情况',
          target: '110-130 g/L',
          unit: 'g/L',
          min: 110,
          max: 130,
          type: 'range'
        },
        {
          key: 'phosphorus',
          name: '血磷',
          significance: '控制血磷是关键',
          target: '1.13-1.78 mmol/L',
          unit: 'mmol/L',
          min: 1.13,
          max: 1.78,
          type: 'range'
        },
        {
          key: 'calcium',
          name: '血钙',
          significance: '需维持平衡',
          target: '2.10-2.50 mmol/L',
          unit: 'mmol/L',
          min: 2.10,
          max: 2.50,
          type: 'range'
        },
        {
          key: 'potassium',
          name: '血钾',
          significance: '预防和治疗高钾血症',
          target: '3.5-5.5 mmol/L',
          unit: 'mmol/L',
          min: 3.5,
          max: 5.5,
          type: 'range'
        },
        {
          key: 'parathyroidHormone',
          name: 'iPTH',
          significance: '反映甲状旁腺功能',
          target: '150-600 pg/ml',
          unit: 'pg/ml',
          min: 150,
          max: 600,
          type: 'range'
        },
        {
          key: 'albumin',
          name: '血清白蛋白',
          significance: '反映长期营养状况',
          target: '>35 g/L',
          unit: 'g/L',
          min: 35,
          max: null,
          type: 'min'
        },
        {
          key: 'bloodPressure',
          name: '透析前血压/居家血压',
          significance: '评估容量负荷',
          target: '<140/90 mmHg',
          unit: 'mmHg',
          min: null,
          max: 140,
          type: 'bp'
        },
        {
          key: 'idwg',
          name: '透析间期体重增长(IDWG)',
          significance: '反映液体摄入依从性',
          target: '<干体重3%',
          unit: '%',
          min: null,
          max: 3,
          type: 'max'
        }
      ]

      return defs.map(def => {
        let rawValue = null
        let currentText = '待评估'
        let status = 'pending'
        let statusText = '待评估'

        if (def.type === 'bp') {
          // 血压：从 VitalSign 获取
          if (vital) {
            const sys = vital.morningSystolicPressure || vital.eveningSystolicPressure
            const dia = vital.morningDiastolicPressure || vital.eveningDiastolicPressure
            if (sys && dia) {
              rawValue = { sys, dia }
              currentText = `${sys}/${dia} ${def.unit}`
              if (sys > 140 || dia > 90) {
                status = 'high'
                statusText = '偏高'
              } else {
                status = 'normal'
                statusText = '正常'
              }
            }
          }
        } else {
          // 其他指标：从 BloodTest 获取
          if (test) {
            const val = test[def.key]
            if (val !== null && val !== undefined) {
              rawValue = val
              currentText = `${val} ${def.unit}`
              if (def.type === 'range') {
                if (val < def.min) {
                  status = 'low'
                  statusText = '偏低'
                } else if (val > def.max) {
                  status = 'high'
                  statusText = '偏高'
                } else {
                  status = 'normal'
                  statusText = '正常'
                }
              } else if (def.type === 'min') {
                if (val < def.min) {
                  status = 'low'
                  statusText = '偏低'
                } else {
                  status = 'normal'
                  statusText = '正常'
                }
              } else if (def.type === 'max') {
                if (val > def.max) {
                  status = 'high'
                  statusText = '偏高'
                } else {
                  status = 'normal'
                  statusText = '正常'
                }
              }
            }
          }
        }

        return {
          ...def,
          currentText,
          status,
          statusText
        }
      })
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
  background: #F5F7FA;
  --s: calc(100vw / 375);
}

/* Top Background */
.top-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 30vh;
  background: linear-gradient(180deg, #b3fff4 0%, #F5F7FA 100%);
  z-index: 0;
}

/* Sticky Top */
.sticky-top {
  position: sticky;
  top: 0;
  z-index: 5;
  opacity: 0;
  transition: opacity 0.4s ease-out;
}

.sticky-top.frost-visible {
  opacity: 1;
}

.status-bar {
  display: flex;
  align-items: center;
  height: 56px;
  padding: 0 16px;
}

.status-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-layer-img {
  width: 28px;
  height: 28px;
}

.header-title {
  font-size: calc(17px * var(--s));
  font-weight: 600;
  color: #1a3c34;
}

/* Main Content */
.main-content {
  position: relative;
  z-index: 2;
  padding: 8px 16px 40px;
  opacity: 0;
  transition: opacity 0.5s ease-out;
}

.main-content.frost-visible {
  opacity: 1;
}

/* Indicator Card */
.indicator-card {
  background: #FFFFFF;
  border-radius: 14px;
  padding: 16px;
  margin-bottom: 14px;
  box-shadow: 0 4px 16px rgba(13, 66, 49, 0.08);
  border: 1px solid rgba(100, 120, 160, 0.1);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.card-icon {
  width: 22px;
  height: 22px;
}

.card-title {
  font-size: calc(16px * var(--s));
  font-weight: 600;
  color: #303133;
}

.card-subtitle {
  display: block;
  font-size: calc(11px * var(--s));
  color: #909399;
  margin-bottom: 14px;
  line-height: 1.4;
}

.alert-badge {
  background: #F56C6C;
  color: #FFFFFF;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 10px;
  margin-left: auto;
}

/* Indicator List */
.indicator-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.indicator-item {
  padding: 12px;
  border-radius: 10px;
  background: #F8FAFC;
  border: 1px solid rgba(100, 120, 160, 0.08);
  border-left: 3px solid #C0C4CC;
}

.indicator-item.high {
  border-left-color: #F56C6C;
  background: rgba(245, 108, 108, 0.04);
}

.indicator-item.low {
  border-left-color: #3B82F6;
  background: rgba(59, 130, 246, 0.04);
}

.indicator-item.normal {
  border-left-color: #19A280;
  background: rgba(25, 162, 128, 0.03);
}

.indicator-left {
  flex: 1;
}

.indicator-name-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}

.indicator-name {
  font-size: calc(14px * var(--s));
  font-weight: 600;
  color: #303133;
}

.indicator-status-badge {
  padding: 2px 10px;
  border-radius: 8px;
}

.indicator-status-badge.high {
  background: rgba(245, 108, 108, 0.12);
}

.indicator-status-badge.low {
  background: rgba(59, 130, 246, 0.12);
}

.indicator-status-badge.normal {
  background: rgba(25, 162, 128, 0.12);
}

.indicator-status-badge.pending {
  background: rgba(144, 147, 153, 0.12);
}

.status-label {
  font-size: calc(11px * var(--s));
  font-weight: 600;
}

.status-label.high {
  color: #F56C6C;
}

.status-label.low {
  color: #3B82F6;
}

.status-label.normal {
  color: #19A280;
}

.status-label.pending {
  color: #909399;
}

.indicator-significance {
  display: block;
  font-size: calc(11px * var(--s));
  color: #909399;
  margin-bottom: 8px;
  line-height: 1.4;
}

.indicator-values {
  display: flex;
  align-items: center;
  gap: 12px;
}

.value-block {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.value-label {
  font-size: calc(10px * var(--s));
  color: #C0C4CC;
  font-weight: 500;
}

.value-text {
  font-size: calc(13px * var(--s));
  font-weight: 600;
}

.value-text.target {
  color: #19A280;
}

.value-text.current.high {
  color: #F56C6C;
}

.value-text.current.low {
  color: #3B82F6;
}

.value-text.current.normal {
  color: #303133;
}

.value-text.current.pending {
  color: #C0C4CC;
}

.value-divider {
  width: 1px;
  height: 24px;
  background: #E4E7ED;
}

/* Plan Card */
.plan-card {
  background: #FFFFFF;
  border-radius: 14px;
  padding: 16px;
  margin-bottom: 14px;
  box-shadow: 0 4px 16px rgba(13, 66, 49, 0.08);
  border: 1px solid rgba(100, 120, 160, 0.1);
}

.plan-section {
  margin-bottom: 14px;
}

.plan-section:last-child {
  margin-bottom: 0;
}

.plan-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 10px;
  border-radius: 10px;
  background: #F8FAFC;
  border: 1px solid rgba(100, 120, 160, 0.08);
}

.plan-icon {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
}

.plan-body {
  flex: 1;
}

.plan-title {
  display: block;
  font-size: calc(14px * var(--s));
  font-weight: 600;
  color: #303133;
  margin-bottom: 6px;
}

.plan-desc {
  font-size: calc(13px * var(--s));
  color: #606266;
  line-height: 1.6;
}

.empty-plan {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 0;
}

.empty-text {
  font-size: calc(14px * var(--s));
  font-weight: 600;
  color: #909399;
  margin-bottom: 6px;
}

.empty-subtext {
  font-size: calc(12px * var(--s));
  color: #C0C4CC;
  text-align: center;
  line-height: 1.5;
}

/* Meta Card */
.meta-card {
  display: flex;
  align-items: center;
  background: #FFFFFF;
  border-radius: 14px;
  padding: 16px;
  margin-bottom: 14px;
  box-shadow: 0 4px 16px rgba(13, 66, 49, 0.08);
  border: 1px solid rgba(100, 120, 160, 0.1);
}

.meta-item {
  flex: 1;
  text-align: center;
}

.meta-divider {
  width: 1px;
  height: 32px;
  background: #E4E7ED;
}

.meta-label {
  display: block;
  font-size: calc(11px * var(--s));
  color: #909399;
  margin-bottom: 4px;
}

.meta-value {
  font-size: calc(14px * var(--s));
  font-weight: 600;
  color: #303133;
}

.meta-value.active {
  color: #19A280;
}

.meta-value.completed {
  color: #909399;
}

/* Animations */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in-up {
  animation: fadeInUp 0.4s ease-out both;
}

/* Loading */
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
</style>
