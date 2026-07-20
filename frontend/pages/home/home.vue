<template>
  <view class="home-container">
    <view class="welcome-section animate-fade-in-up">
      <view class="logo-container">
        <image src="/static/logo.png" class="welcome-logo" mode="aspectFit" />
        <view class="logo-ring"></view>
      </view>
      <text class="welcome-title">重庆圣通尚诺医疗管理™</text>
      <text class="welcome-subtitle">您的健康管理助手</text>
    </view>
    
    <view class="quick-nav">
      <view 
        class="nav-card animate-slide-in-right" 
        :style="{ animationDelay: '0.1s' }"
        @click="handleNavClick('/pages/health-manage/health-manage', '健康管理')"
      >
        <view class="nav-icon-wrapper bg-green">
          <image src="/static/icons/png/filled/symbols/heart_cardiogram@2x.png" class="nav-icon-img" mode="aspectFit" />
        </view>
        <view class="nav-content">
          <text class="nav-title">健康管理</text>
          <text class="nav-desc">查看健康档案、生命体征等</text>
        </view>
        <view class="nav-arrow-wrap">
          <text class="nav-arrow">›</text>
        </view>
      </view>
      
      <view 
        class="nav-card animate-slide-in-right" 
        :style="{ animationDelay: '0.2s' }"
        @click="handleNavClick('/pages/service-center/service-center', '服务中心')"
      >
        <view class="nav-icon-wrapper bg-orange">
          <image src="/static/icons/png/filled/objects/insurance_card@2x.png" class="nav-icon-img" mode="aspectFit" />
        </view>
        <view class="nav-content">
          <text class="nav-title">服务中心</text>
          <text class="nav-desc">参保信息、透析排班</text>
        </view>
        <view class="nav-arrow-wrap">
          <text class="nav-arrow">›</text>
        </view>
      </view>
      
      <view 
        class="nav-card animate-slide-in-right" 
        :style="{ animationDelay: '0.3s' }"
        @click="handleNavClick('/pages/interaction/interaction', '互动中心')"
      >
        <view class="nav-icon-wrapper bg-pink">
          <image src="/static/icons/png/filled/objects/megaphone@2x.png" class="nav-icon-img" mode="aspectFit" />
        </view>
        <view class="nav-content">
          <text class="nav-title">互动中心</text>
          <text class="nav-desc">活动、新闻、通知</text>
        </view>
        <view class="nav-arrow-wrap">
          <text class="nav-arrow">›</text>
        </view>
      </view>
    </view>
    
    <view class="alert-section animate-fade-in" :style="{ animationDelay: '0.4s' }" v-if="hasAlert">
      <view class="alert-card" @click="handleAlertClick">
        <image src="/static/icons/png/filled/symbols/alert_triangle@2x.png" class="alert-icon" mode="aspectFit" />
        <view class="alert-content">
          <text class="alert-title">指标异常提醒</text>
          <text class="alert-desc">您有 {{ alertCount }} 项指标超出正常范围</text>
        </view>
        <view class="alert-arrow">›</view>
      </view>
    </view>

    <view class="tips-section animate-fade-in" :style="{ animationDelay: '0.4s' }">
      <view class="tips-header">
        <view class="tips-title-wrap">
          <image src="/static/icons/png/filled/symbols/info@2x.png" class="tips-icon" mode="aspectFit" />
          <text class="tips-title">使用提示</text>
        </view>
        <view class="tips-badge">3</view>
      </view>
      <view class="tips-list">
        <view class="tips-item" v-for="(tip, index) in tips" :key="index">
          <view class="tip-dot"></view>
          <text class="tip-text">{{ tip }}</text>
        </view>
      </view>
    </view>

    <view class="notice-section animate-fade-in" :style="{ animationDelay: '0.5s' }">
      <view class="section-header-wrap">
        <text class="section-title">📢 最新公告</text>
        <text class="section-more" @click="goToNotification">查看更多 ›</text>
      </view>
      <scroll-view class="notice-scroll" scroll-x>
        <view class="notice-list">
          <view 
            class="notice-item" 
            v-for="(notice, index) in notices" 
            :key="index"
            @click="goToNotificationDetail(notice)"
          >
            <text class="notice-tag" v-if="notice.isTop">置顶</text>
            <text class="notice-title">{{ notice.title }}</text>
            <text class="notice-time">{{ notice.time }}</text>
          </view>
        </view>
      </scroll-view>
    </view>
    
    <view class="bottom-space"></view>
  </view>
</template>

<script>
import { get } from '../../utils/request.js'

export default {
  data() {
    return {
      tips: [
        '定期记录生命体征数据',
        '按时查看用药提醒',
        '关注最新活动通知'
      ],
      isNavigating: false,
      hasAlert: false,
      alertCount: 0,
      notices: []
    }
  },
  onLoad() {
    this.fetchNotices()
    this.fetchAbnormalIndicators()
  },
  methods: {
    async fetchNotices() {
      try {
        const res = await get('/news?page=1&size=5')
        if (res.code === 200) {
          const data = res.data
          if (data.list && data.list.length > 0) {
            this.notices = data.list.map(item => ({
              title: item.title,
              time: this.formatDate(item.createdAt),
              isTop: item.isTop || false,
              id: item.id
            }))
          }
        }
      } catch (err) {
        console.log('获取公告失败:', err)
      }
    },
    async fetchAbnormalIndicators() {
      try {
        const userId = uni.getStorageSync('userId')
        const res = await get(`/blood-test/latest/${userId}`)
        if (res.code === 200 && res.data) {
          const test = res.data
          let count = 0
          const indicators = [
            { key: 'hemoglobin', min: 110, max: 130 },
            { key: 'ureaNitrogen', min: 3.2, max: 7.1 },
            { key: 'uricAcid', min: 208, max: 428 },
            { key: 'potassium', min: 3.5, max: 5.5 },
            { key: 'sodium', min: 135, max: 145 },
            { key: 'calcium', min: 2.1, max: 2.6 },
            { key: 'phosphorus', min: 0.8, max: 1.45 },
            { key: 'albumin', min: 35, max: 50 },
            { key: 'parathyroidHormone', min: 150, max: 300 }
          ]
          indicators.forEach(ind => {
            const value = test[ind.key]
            if (value !== null && value !== undefined && (value < ind.min || value > ind.max)) {
              count++
            }
          })
          this.alertCount = count
          this.hasAlert = count > 0
        }
      } catch (err) {
        console.log('获取异常指标失败:', err)
      }
    },
    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    },
    handleNavClick(url, title) {
      if (this.isNavigating) return
      this.isNavigating = true
      
      uni.vibrateShort({
        success: () => {}
      })
      
      uni.switchTab({ 
        url,
        success: () => {
          setTimeout(() => {
            this.isNavigating = false
          }, 300)
        },
        fail: () => {
          this.isNavigating = false
        }
      })
    },
    handleAlertClick() {
      uni.navigateTo({
        url: '/pages/core-indicator/core-indicator'
      })
    },
    goToNotification() {
      uni.navigateTo({
        url: '/pages/notification/notification'
      })
    },
    goToNotificationDetail(notice) {
      uni.navigateTo({
        url: '/pages/notification/notification'
      })
    }
  }
}
</script>

<style scoped>
.home-container {
  padding: 0;
  min-height: 100vh;
  background-color: #F5F7FA;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

@keyframes ringPulse {
  0% {
    transform: scale(1);
    opacity: 0.5;
  }
  100% {
    transform: scale(1.2);
    opacity: 0;
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-out both;
}

.animate-slide-in-right {
  animation: slideInRight 0.4s ease-out both;
}

.animate-fade-in {
  animation: fadeIn 0.4s ease-out both;
}

.welcome-section {
  padding: 50px 20px 35px;
  text-align: center;
  background-color: #FFFFFF;
  margin-bottom: 16px;
  position: relative;
}

.logo-container {
  position: relative;
  display: inline-block;
  margin-bottom: 20px;
}

.welcome-logo {
  width: 160px;
  height: 160px;
  border-radius: 36px;
  background-color: #FFFFFF;
  padding: 24px;
  border: 2px solid #EBEEF5;
  animation: float 3s ease-in-out infinite;
  box-shadow: 0 8px 24px rgba(0, 157, 133, 0.15);
}

.logo-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 180px;
  height: 180px;
  border: 2px solid rgba(0, 157, 133, 0.3);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: ringPulse 2s ease-out infinite;
}

.welcome-title {
  display: block;
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 10px;
  letter-spacing: 1px;
}

.welcome-subtitle {
  display: block;
  font-size: 15px;
  color: #009D85;
  font-weight: 500;
}

.quick-nav {
  padding: 0 16px;
}

.nav-card {
  display: flex;
  align-items: center;
  background-color: #FFFFFF;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.nav-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  border-radius: 0 2px 2px 0;
  background-color: #E4E7ED;
}

.nav-card:active {
  transform: scale(0.98);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.nav-card:nth-child(1)::before {
  background-color: #009D85;
}

.nav-card:nth-child(2)::before {
  background-color: #FAA31A;
}

.nav-card:nth-child(3)::before {
  background-color: #EC4899;
}

.nav-icon-wrapper {
  width: 60px;
  height: 60px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  transition: transform 0.2s ease;
}

.nav-card:active .nav-icon-wrapper {
  transform: scale(1.1);
}

.bg-green {
  background-color: rgba(0, 157, 133, 0.1);
}

.bg-green .nav-icon-img {
  filter: brightness(0) saturate(100%) invert(42%) sepia(93%) saturate(389%) hue-rotate(131deg) brightness(93%) contrast(94%);
}

.bg-orange {
  background-color: rgba(250, 173, 20, 0.1);
}

.bg-orange .nav-icon-img {
  filter: brightness(0) saturate(100%) invert(64%) sepia(56%) saturate(694%) hue-rotate(356deg) brightness(103%) contrast(101%);
}

.bg-pink {
  background-color: rgba(236, 72, 153, 0.1);
}

.bg-pink .nav-icon-img {
  filter: brightness(0) saturate(100%) invert(37%) sepia(64%) saturate(726%) hue-rotate(290deg) brightness(95%) contrast(95%);
}

.nav-icon {
  font-size: 28px;
}

.nav-icon-img {
  width: 28px;
  height: 28px;
}

.nav-content {
  flex: 1;
}

.nav-title {
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}

.nav-desc {
  display: block;
  font-size: 13px;
  color: #909399;
}

.nav-arrow-wrap {
  padding: 8px;
  border-radius: 8px;
  background-color: #F5F7FA;
  transition: all 0.2s ease;
}

.nav-card:active .nav-arrow-wrap {
  background-color: rgba(0, 157, 133, 0.1);
}

.nav-arrow {
  font-size: 24px;
  color: #C0C4CC;
  transition: transform 0.2s ease;
}

.nav-card:active .nav-arrow {
  transform: translateX(4px);
  color: #009D85;
}

.alert-section {
  padding: 0 16px;
  margin-bottom: 16px;
}

.alert-card {
  display: flex;
  align-items: center;
  background-color: rgba(250, 173, 20, 0.08);
  padding: 16px 20px;
  border-radius: 12px;
  border-left: 4px solid #E6A23C;
}

.alert-card .alert-icon {
  filter: brightness(0) saturate(100%) invert(64%) sepia(56%) saturate(694%) hue-rotate(356deg) brightness(103%) contrast(101%);
}

.alert-icon {
  width: 24px;
  height: 24px;
  margin-right: 12px;
}

.alert-content {
  flex: 1;
}

.alert-title {
  display: block;
  font-size: 15px;
  font-weight: 600;
  color: #E6A23C;
  margin-bottom: 4px;
}

.alert-desc {
  font-size: 13px;
  color: #909399;
}

.alert-arrow {
  font-size: 20px;
  color: #C0C4CC;
}

.tips-section {
  margin-top: 16px;
  padding: 0 16px;
}

.tips-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.tips-title-wrap {
  display: flex;
  align-items: center;
}

.tips-icon {
  width: 18px;
  height: 18px;
  margin-right: 6px;
}

.tips-title {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
}

.tips-badge {
  background-color: #009D85;
  color: #FFFFFF;
  font-size: 12px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 10px;
  margin-left: 8px;
}

.tips-list {
  background-color: #FFFFFF;
  padding: 16px 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.tips-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
}

.tip-dot {
  width: 6px;
  height: 6px;
  background-color: #009D85;
  border-radius: 50%;
  margin-right: 12px;
  flex-shrink: 0;
}

.tip-text {
  font-size: 13px;
  color: #606266;
  line-height: 1.6;
}

.notice-section {
  margin-top: 20px;
  padding: 0 16px;
}

.section-header-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
}

.section-more {
  font-size: 13px;
  color: #009D85;
}

.notice-scroll {
  white-space: nowrap;
}

.notice-list {
  display: inline-flex;
  gap: 12px;
  padding-bottom: 8px;
}

.notice-item {
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  background-color: #FFFFFF;
  padding: 12px 16px;
  border-radius: 8px;
  min-width: 200px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.notice-tag {
  font-size: 11px;
  color: #FFFFFF;
  background-color: #F56C6C;
  padding: 2px 6px;
  border-radius: 4px;
  margin-bottom: 6px;
}

.notice-title {
  font-size: 14px;
  color: #303133;
  font-weight: 500;
  margin-bottom: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 170px;
}

.notice-time {
  font-size: 12px;
  color: #909399;
}

.bottom-space {
  height: 100px;
}
</style>