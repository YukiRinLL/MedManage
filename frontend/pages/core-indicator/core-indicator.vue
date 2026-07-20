<template>
  <view class="indicator-container">
    <view class="section-header animate-fade-in">
      <view class="header-bg"></view>
      <view class="header-content">
        <text class="section-title">核心指标</text>
        <text class="section-desc">查血指标与趋势追踪</text>
      </view>
    </view>

    <view class="tab-bar">
      <view 
        class="tab-item" 
        :class="{ active: activeTab === 'latest' }"
        @click="activeTab = 'latest'"
      >
        最新查血
      </view>
      <view 
        class="tab-item" 
        :class="{ active: activeTab === 'trend' }"
        @click="activeTab = 'trend'"
      >
        指标趋势
      </view>
      <view 
        class="tab-item" 
        :class="{ active: activeTab === 'report' }"
        @click="activeTab = 'report'"
      >
        历史报告
      </view>
    </view>

    <view class="content-area">
      <view v-if="activeTab === 'latest'">
        <view v-if="latestTest" class="latest-test-card">
          <view class="test-header">
            <text class="test-date">检查日期：{{ formatDate(latestTest.testDate) }}</text>
            <text class="test-type">{{ latestTest.testType || '生化检查' }}</text>
          </view>
          
          <view class="indicators-grid">
            <view 
              class="indicator-item" 
              v-for="indicator in indicatorList" 
              :key="indicator.key"
            >
              <text class="indicator-name">{{ indicator.name }}</text>
              <text class="indicator-value" :class="getIndicatorStatus(indicator)">{{ getIndicatorValue(indicator) }}</text>
              <text class="indicator-range">{{ indicator.range }}</text>
              <text class="indicator-status" :class="getIndicatorStatusClass(indicator)">
                {{ getIndicatorStatusText(indicator) }}
              </text>
            </view>
          </view>
        </view>
        
        <view v-else class="empty-state">
          <text class="empty-icon">📋</text>
          <text class="empty-text">暂无检查记录</text>
        </view>
      </view>

      <view v-if="activeTab === 'trend'">
        <view class="trend-selector">
          <picker mode="selector" :range="indicatorOptions" @change="onIndicatorChange">
            <view class="picker-item">
              {{ currentIndicator.name }}
              <text class="picker-arrow">▼</text>
            </view>
          </picker>
        </view>

        <view class="chart-container">
          <view class="chart-placeholder">
            <text class="chart-icon">📈</text>
            <text class="chart-text">指标趋势图表</text>
            <text class="chart-subtext">展示近12个月指标变化曲线</text>
          </view>
        </view>

        <view class="trend-data">
          <view class="trend-summary">
            <view class="summary-item">
              <text class="summary-label">平均值</text>
              <text class="summary-value">{{ calculateAverage() }}</text>
            </view>
            <view class="summary-item">
              <text class="summary-label">最高值</text>
              <text class="summary-value">{{ calculateMax() }}</text>
            </view>
            <view class="summary-item">
              <text class="summary-label">最低值</text>
              <text class="summary-value">{{ calculateMin() }}</text>
            </view>
          </view>
        </view>
      </view>

      <view v-if="activeTab === 'report'">
        <view class="year-filter">
          <picker mode="selector" :range="yearOptions" @change="onYearChange">
            <view class="picker-item">
              {{ selectedYear }}年
              <text class="picker-arrow">▼</text>
            </view>
          </picker>
        </view>

        <view class="quarter-list">
          <view 
            class="quarter-card" 
            v-for="quarter in quarters" 
            :key="quarter.value"
            @click="viewQuarterReport(quarter)"
          >
            <view class="quarter-header">
              <text class="quarter-title">{{ quarter.label }}</text>
              <text class="quarter-arrow">›</text>
            </view>
            <text class="quarter-date">{{ quarter.dateRange }}</text>
          </view>
        </view>
      </view>
    </view>

    <view class="bottom-space"></view>
  </view>
</template>

<script>
import { get } from '../../utils/request.js'

export default {
  data() {
    return {
      activeTab: 'latest',
      latestTest: null,
      testList: [],
      currentIndicator: { key: 'hemoglobin', name: '血红蛋白' },
      selectedYear: new Date().getFullYear(),
      yearOptions: [2024, 2025, 2026, 2027],
      indicatorOptions: [
        { key: 'hemoglobin', name: '血红蛋白' },
        { key: 'serumCreatinine', name: '血清肌酐' },
        { key: 'ureaNitrogen', name: '尿素氮' },
        { key: 'uricAcid', name: '尿酸' },
        { key: 'potassium', name: '钾' },
        { key: 'sodium', name: '钠' },
        { key: 'calcium', name: '钙' },
        { key: 'phosphorus', name: '磷' },
        { key: 'albumin', name: '白蛋白' },
        { key: 'parathyroidHormone', name: '甲状旁腺激素' }
      ],
      indicatorList: [
        { key: 'hemoglobin', name: '血红蛋白', range: '110-130g/L', unit: 'g/L' },
        { key: 'serumCreatinine', name: '血清肌酐', range: '-', unit: 'μmol/L' },
        { key: 'ureaNitrogen', name: '尿素氮', range: '3.2-7.1mmol/L', unit: 'mmol/L' },
        { key: 'uricAcid', name: '尿酸', range: '208-428μmol/L', unit: 'μmol/L' },
        { key: 'potassium', name: '钾', range: '3.5-5.5mmol/L', unit: 'mmol/L' },
        { key: 'sodium', name: '钠', range: '135-145mmol/L', unit: 'mmol/L' },
        { key: 'calcium', name: '钙', range: '2.1-2.6mmol/L', unit: 'mmol/L' },
        { key: 'phosphorus', name: '磷', range: '0.8-1.45mmol/L', unit: 'mmol/L' },
        { key: 'albumin', name: '白蛋白', range: '35-50g/L', unit: 'g/L' },
        { key: 'parathyroidHormone', name: '甲状旁腺激素', range: '150-300pg/mL', unit: 'pg/mL' }
      ],
      quarters: [
        { value: 1, label: '第一季度', dateRange: '2026年1月-3月' },
        { value: 2, label: '第二季度', dateRange: '2026年4月-6月' },
        { value: 3, label: '第三季度', dateRange: '2026年7月-9月' },
        { value: 4, label: '第四季度', dateRange: '2026年10月-12月' }
      ]
    }
  },
  onLoad() {
      this.fetchLatestTest()
      this.fetchTestList()
      this.fetchRecentData()
    },
    methods: {
      async fetchLatestTest() {
        try {
          const userId = uni.getStorageSync('userId')
          const res = await get(`/blood-test/latest/${userId}`)
          if (res.code === 200) {
            this.latestTest = res.data
          }
        } catch (err) {
          console.log(err)
        }
      },
      async fetchTestList() {
        try {
          const userId = uni.getStorageSync('userId')
          const res = await get(`/blood-test/list/${userId}`)
          if (res.code === 200) {
            this.testList = res.data
          }
        } catch (err) {
          console.log(err)
        }
      },
      async fetchRecentData() {
        try {
          const userId = uni.getStorageSync('userId')
          const res = await get(`/blood-test/recent/${userId}`)
          if (res.code === 200) {
            this.testList = res.data
          }
        } catch (err) {
          console.log(err)
        }
      },
      formatDate(dateString) {
        if (!dateString) return ''
        const date = new Date(dateString)
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
      },
      getIndicatorValue(indicator) {
        if (!this.latestTest) return '-'
        const value = this.latestTest[indicator.key]
        if (value === null || value === undefined) return '-'
        return value + indicator.unit
      },
      getIndicatorStatus(indicator) {
        if (!this.latestTest) return 'normal'
        const value = this.latestTest[indicator.key]
        if (value === null || value === undefined) return 'normal'
        const ranges = {
          hemoglobin: { min: 110, max: 130 },
          ureaNitrogen: { min: 3.2, max: 7.1 },
          uricAcid: { min: 208, max: 428 },
          potassium: { min: 3.5, max: 5.5 },
          sodium: { min: 135, max: 145 },
          calcium: { min: 2.1, max: 2.6 },
          phosphorus: { min: 0.8, max: 1.45 },
          albumin: { min: 35, max: 50 },
          parathyroidHormone: { min: 150, max: 300 },
          serumCreatinine: { min: 0, max: 9999 }
        }
        const range = ranges[indicator.key]
        if (!range) return 'normal'
        if (value < range.min) return 'low'
        if (value > range.max) return 'high'
        return 'normal'
      },
      getIndicatorStatusClass(indicator) {
        return this.getIndicatorStatus(indicator)
      },
      getIndicatorStatusText(indicator) {
        const status = this.getIndicatorStatus(indicator)
        if (status === 'low') return '偏低'
        if (status === 'high') return '偏高'
        return '正常'
      },
      onIndicatorChange(e) {
        this.currentIndicator = this.indicatorOptions[e.detail.value]
      },
      onYearChange(e) {
        this.selectedYear = this.yearOptions[e.detail.value]
      },
      calculateAverage() {
        const values = this.testList.map(t => t[this.currentIndicator.key]).filter(v => v !== null && v !== undefined)
        if (values.length === 0) return '-'
        const avg = values.reduce((a, b) => a + b, 0) / values.length
        return avg.toFixed(1)
      },
      calculateMax() {
        const values = this.testList.map(t => t[this.currentIndicator.key]).filter(v => v !== null && v !== undefined)
        if (values.length === 0) return '-'
        return Math.max(...values).toFixed(1)
      },
      calculateMin() {
        const values = this.testList.map(t => t[this.currentIndicator.key]).filter(v => v !== null && v !== undefined)
        if (values.length === 0) return '-'
        return Math.min(...values).toFixed(1)
      },
      viewQuarterReport(quarter) {
        uni.showToast({
          title: `${quarter.label}报告`,
          icon: 'none'
        })
      }
    }
}
</script>

<style scoped>
.indicator-container {
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
  background: linear-gradient(135deg, #009D85 0%, #00B59D 100%);
  color: #FFFFFF;
  position: relative;
  overflow: hidden;
}

.header-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
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

.tab-bar {
  display: flex;
  background-color: #FFFFFF;
  border-bottom: 1px solid #EBEEF5;
}

.tab-item {
  flex: 1;
  padding: 16px;
  text-align: center;
  font-size: 15px;
  color: #606266;
  position: relative;
  transition: all 0.25s ease;
}

.tab-item.active {
  color: #009D85;
  font-weight: 600;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 25%;
  right: 25%;
  height: 3px;
  background-color: #009D85;
  border-radius: 2px;
}

.content-area {
  padding: 16px;
}

.latest-test-card {
  background-color: #FFFFFF;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.test-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #F0F0F0;
}

.test-date {
  font-size: 14px;
  color: #606266;
}

.test-type {
  font-size: 13px;
  color: #009D85;
  background-color: rgba(0, 157, 133, 0.1);
  padding: 4px 12px;
  border-radius: 12px;
}

.indicators-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.indicator-item {
  background-color: #F9F9F9;
  padding: 16px;
  border-radius: 8px;
  text-align: center;
}

.indicator-name {
  display: block;
  font-size: 13px;
  color: #606266;
  margin-bottom: 8px;
}

.indicator-value {
  display: block;
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}

.indicator-range {
  display: block;
  font-size: 12px;
  color: #909399;
  margin-bottom: 8px;
}

.indicator-status {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 8px;
}

.indicator-status.normal {
  background-color: rgba(0, 157, 133, 0.1);
  color: #009D85;
}

.indicator-status.high {
  background-color: rgba(245, 108, 108, 0.1);
  color: #F56C6C;
}

.indicator-status.low {
  background-color: rgba(250, 173, 20, 0.1);
  color: #E6A23C;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  background-color: #FFFFFF;
  border-radius: 12px;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 16px;
  color: #909399;
}

.trend-selector, .year-filter {
  background-color: #FFFFFF;
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 16px;
}

.picker-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
  color: #303133;
}

.picker-arrow {
  font-size: 14px;
  color: #C0C4CC;
}

.chart-container {
  background-color: #FFFFFF;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
}

.chart-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.chart-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.chart-text {
  font-size: 16px;
  color: #303133;
  margin-bottom: 8px;
}

.chart-subtext {
  font-size: 14px;
  color: #909399;
}

.trend-summary {
  display: flex;
  background-color: #FFFFFF;
  border-radius: 12px;
  padding: 16px;
}

.summary-item {
  flex: 1;
  text-align: center;
  padding: 12px;
}

.summary-label {
  display: block;
  font-size: 13px;
  color: #909399;
  margin-bottom: 8px;
}

.summary-value {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.quarter-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.quarter-card {
  background-color: #FFFFFF;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.quarter-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.quarter-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.quarter-arrow {
  font-size: 20px;
  color: #C0C4CC;
}

.quarter-date {
  font-size: 13px;
  color: #909399;
}

.bottom-space {
  height: 100px;
}
</style>