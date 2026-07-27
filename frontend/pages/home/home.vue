<template>
  <view class="home-container">
    <view class="welcome-section animate-fade-in-up">
      <view class="logo-container">
        <image src="/static/logo.png" class="welcome-logo" mode="aspectFit" />
        <view class="logo-ring"></view>
      </view>
      <view class="days-protected">
        <text class="days-prefix">为您健康护航第</text>
        <text class="days-number">{{ daysProtected }}</text>
        <text class="days-suffix">天</text>
      </view>
    </view>
    
    <!-- <view class="alert-section animate-fade-in" :style="{ animationDelay: '0.15s' }">
      <view class="alert-card" :class="{ 'alert-normal': !hasAlert }" @click="handleAlertClick">
        <image 
          :src="hasAlert ? '/static/icons/png/filled/symbols/alert_triangle@2x.png' : '/static/icons/png/filled/symbols/info@2x.png'" 
          class="alert-icon" 
          mode="aspectFit" 
        />
        <view class="alert-content">
          <text class="alert-title" :class="{ 'alert-title-normal': !hasAlert }">
            {{ hasAlert ? ('共有 ' + alertCount + ' 项指标异常，请及时关注') : '指标状态正常' }}
          </text>
          <text class="alert-desc">
            {{ hasAlert ? '以下为部分异常指标，完整详情请在“健康管理-核心指标”中查看' : '您的检查指标均在正常范围内，请继续保持' }}
          </text>
          <view v-if="hasAlert" class="alert-detail-list">
            <view 
              v-for="(item, index) in abnormalIndicators.slice(0, 4)" 
              :key="item.key" 
              class="alert-detail-item"
            >
              <text class="alert-detail-name">{{ item.label }}：</text>
              <text class="alert-detail-value">{{ item.value }}</text>
              <text class="alert-detail-range">（正常 {{ item.min }} - {{ item.max }}）</text>
            </view>
          </view>
        </view>
        <view class="alert-arrow">›</view>
      </view>
    </view> -->

    <view class="tips-section animate-fade-in" :style="{ animationDelay: '0.22s' }">
      <view class="tips-header">
        <view class="tips-title-wrap">
          <image src="/static/icons/png/filled/symbols/info@2x.png" class="tips-icon" mode="aspectFit" />
          <text class="tips-title">健康管理提示</text>
        </view>
        <text class="tips-subtitle">快捷管理健康状态</text>
      </view>
      <view class="tips-list">
        <view 
          v-for="tip in tipCards" 
          :key="tip.key" 
          class="tips-item" 
          :class="['tips-item-' + tip.key]"
          @click="handleTipClick(tip)"
        >
          <view class="tip-icon-wrap" :class="'tip-icon-' + tip.key">
            <image :src="tip.icon" class="tip-icon-img" mode="aspectFit" />
          </view>
          <view class="tip-content">
            <text class="tip-text">{{ tip.title }}</text>
            <text class="tip-desc">{{ tip.desc }}</text>
          </view>
          <text class="tip-arrow">›</text>
        </view>
      </view>
    </view>
    
    <!-- <view class="quick-nav">
      <view 
        class="nav-card animate-slide-in-right" 
        :style="{ animationDelay: '0.2s' }"
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
        :style="{ animationDelay: '0.3s' }"
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
        :style="{ animationDelay: '0.4s' }"
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
    </view> -->

    <view class="notification-section animate-fade-in" :style="{ animationDelay: '0.45s' }">
      <view class="section-header-wrap">
          <text class="section-title">🔔 通知消息</text>
          <text class="section-more" @click="goToNotification">查看更多 ›</text>
        </view>
      <view class="notification-list">
        <view 
          class="notification-item" 
          v-for="(item, index) in notificationList" 
          :key="index"
          @click="goToNotificationDetail(item)"
        >
          <text class="notification-content">{{ item.content }}</text>
          <text class="notification-time">{{ item.time }}</text>
        </view>
      </view>
    </view>

    <view class="news-section animate-fade-in" :style="{ animationDelay: '0.5s' }">
      <view class="section-header-wrap">
          <text class="section-title">📰 新闻资讯</text>
          <text class="section-more" @click="goToNews">查看更多 ›</text>
        </view>
      <view class="news-list">
        <view 
          class="news-item" 
          v-for="(news, index) in newsList" 
          :key="index"
          @click="goToNewsDetail(news)"
        >
          <view class="news-left">
            <text class="news-tag" v-if="news.isTop">置顶</text>
            <text class="news-title">{{ news.title }}</text>
          </view>
          <text class="news-time">{{ news.time }}</text>
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
      tips: [
        '定期记录生命体征数据',
        '按时查看用药提醒',
        '关注最新活动通知'
      ],
      tipCards: [
        { key: 'indicator', title: '健康指标提升方案', desc: '查看异常指标与干预建议', action: 'indicator', icon: '/static/icons/png/filled/symbols/risk_analysis@2x.png' },
        { key: 'vital', title: '定期记录生命体征数据', desc: '点击进入生命体征页面', action: 'vital', icon: '/static/icons/png/filled/symbols/heart_cardiogram@2x.png' },
        { key: 'medication', title: '按时查看用药提醒', desc: '点击进入用药记录页面', action: 'medication', icon: '/static/icons/png/filled/medications/pill_1@2x.png' }
      ],
      isNavigating: false,
      hasAlert: false,
      alertCount: 0,
      abnormalIndicators: [],
      newsList: [],
      notificationList: [],
      daysProtected: 0
    }
  },
  onLoad() {
    this.fetchNews()
    this.fetchNotifications()
    this.fetchAbnormalIndicators()
    this.calculateDaysProtected()
  },
  methods: {
    async fetchNews() {
      try {
        const res = await get('/news?page=1&size=5')
        if (res.code === 200) {
          const data = res.data
          if (data.list && data.list.length > 0) {
            this.newsList = data.list.map(item => ({
              title: item.title,
              time: this.formatDate(item.createdAt),
              isTop: item.isTop || false,
              id: item.id
            }))
          }
        }
      } catch (err) {
        console.log('获取新闻失败:', err)
      }
    },
    async fetchNotifications() {
      try {
        const user = uni.getStorageSync('user')
        let userId = ''
        if (user) {
          try {
            const parsed = typeof user === 'string' ? JSON.parse(user) : user
            userId = parsed.id
          } catch (e) {
            console.log('解析用户信息失败', e)
          }
        }
        if (!userId) {
          console.log('未获取到用户ID，跳过通知查询')
          return
        }
        const res = await get(`/notification/list/${userId}?page=1&size=2`)
        if (res.code === 200) {
          let notifications = []
          const data = res.data
          if (Array.isArray(data)) {
            notifications = data
          } else if (data.list && data.list.length > 0) {
            notifications = data.list
          }
          const unreadNotifications = notifications.filter(item => !item.isRead).slice(0, 2)
          if (unreadNotifications.length > 0) {
            this.notificationList = unreadNotifications.map(item => ({
              content: item.content,
              time: this.formatDate(item.createdAt),
              id: item.id
            }))
          }
        }
      } catch (err) {
        console.log('获取通知失败:', err)
      }
    },
    async fetchAbnormalIndicators() {
      try {
        this.tipCards[0].title = '异常指标数量：--'
        this.tipCards[0].desc = '点击查看指标详情'
        const user = uni.getStorageSync('user')
        let userId = ''
        if (user) {
          try {
            const parsed = typeof user === 'string' ? JSON.parse(user) : user
            userId = parsed.id
          } catch (e) {
            console.log('解析用户信息失败', e)
          }
        }
        if (!userId) {
          console.log('未获取到用户ID，跳过异常指标查询')
          this.alertCount = 0
          this.abnormalIndicators = []
          this.hasAlert = false
          this.tipCards[0].title = '异常指标数量：暂无'
          this.tipCards[0].desc = '暂无异常指标'
          return
        }
        const res = await get(`/blood-test/latest/${userId}`)
        if (res.code === 200 && res.data) {
          const test = res.data
          let count = 0
          const indicators = [
            { key: 'hemoglobin', label: '血红蛋白', min: 110, max: 130 },
            { key: 'ureaNitrogen', label: '尿素氮', min: 3.2, max: 7.1 },
            { key: 'uricAcid', label: '尿酸', min: 208, max: 428 },
            { key: 'potassium', label: '钾', min: 3.5, max: 5.5 },
            { key: 'sodium', label: '钠', min: 135, max: 145 },
            { key: 'calcium', label: '钙', min: 2.1, max: 2.6 },
            { key: 'phosphorus', label: '磷', min: 0.8, max: 1.45 },
            { key: 'albumin', label: '白蛋白', min: 35, max: 50 },
            { key: 'parathyroidHormone', label: '甲状旁腺激素', min: 150, max: 300 }
          ]
          const abnormalList = []
          indicators.forEach(ind => {
            const value = test[ind.key]
            if (value !== null && value !== undefined && (value < ind.min || value > ind.max)) {
              count++
              abnormalList.push({
                key: ind.key,
                label: ind.label,
                value,
                min: ind.min,
                max: ind.max
              })
            }
          })
          this.alertCount = count
          this.abnormalIndicators = abnormalList
          this.hasAlert = count > 0
          this.tipCards[0].title = `异常指标数量：${count}项`
          this.tipCards[0].desc = count > 0 ? '点击查看指标详情' : '暂无异常指标'
        } else {
          this.alertCount = 0
          this.abnormalIndicators = []
          this.hasAlert = false
          this.tipCards[0].title = '异常指标数量：暂无'
          this.tipCards[0].desc = '暂无异常指标'
        }
      } catch (err) {
        console.log('获取异常指标失败:', err)
        this.alertCount = 0
        this.abnormalIndicators = []
        this.hasAlert = false
        this.tipCards[0].title = '异常指标数量：暂无'
        this.tipCards[0].desc = '暂无异常指标'
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
    handleTipClick(tip) {
      if (tip.action === 'indicator') {
        uni.navigateTo({
          url: '/pages/improvement-plan/improvement-plan'
        })
        return
      }
      if (tip.action === 'vital') {
        uni.navigateTo({
          url: '/pages/vital-sign/vital-sign'
        })
        return
      }
      if (tip.action === 'medication') {
        uni.navigateTo({
          url: '/pages/medication/medication'
        })
      }
    },
    goToNews() {
      uni.navigateTo({
        url: '/pages/news/list'
      })
    },
    goToNewsDetail(news) {
      uni.navigateTo({
        url: `/pages/news/detail?id=${news.id}`
      })
    },
    goToNotification() {
      uni.navigateTo({
        url: '/pages/notification/notification'
      })
    },
    goToNotificationDetail(item) {
      uni.navigateTo({
        url: '/pages/notification/notification'
      })
    },
    calculateDaysProtected() {
      const userStr = uni.getStorageSync('user')
      console.log('用户存储数据:', userStr)
      if (!userStr) {
        console.log('用户存储数据为空')
        this.daysProtected = 0
        return
      }
      let user = null
      try {
        user = typeof userStr === 'string' ? JSON.parse(userStr) : userStr
      } catch (e) {
        console.log('解析用户信息失败', e)
        this.daysProtected = 0
        return
      }
      console.log('解析后的用户对象:', user)
      console.log('用户对象的所有键:', Object.keys(user))
      if (!user) {
        this.daysProtected = 0
        return
      }
      const createdAtStr = user.createdAt || user.created_at || ''
      console.log('注册时间字符串:', createdAtStr)
      if (!createdAtStr) {
        console.log('用户注册时间为空')
        this.daysProtected = 0
        return
      }
      const createdAt = new Date(createdAtStr)
      console.log('解析后的日期对象:', createdAt)
      console.log('日期对象的时间戳:', createdAt.getTime())
      if (isNaN(createdAt.getTime())) {
        console.log('注册时间解析失败:', createdAtStr)
        this.daysProtected = 0
        return
      }
      const now = new Date()
      const diffTime = Math.abs(now - createdAt)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      console.log('计算出的天数:', diffDays)
      this.daysProtected = diffDays > 0 ? diffDays : 1
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
  padding: 35px 20px 25px;
  text-align: center;
  background-color: #FFFFFF;
  margin-bottom: 16px;
  position: relative;
}

.logo-container {
  position: relative;
  display: inline-block;
  margin-bottom: 16px;
}

.welcome-logo {
  width: 100px;
  height: 100px;
  border-radius: 24px;
  background-color: #FFFFFF;
  padding: 16px;
  border: 2px solid #EBEEF5;
  animation: float 3s ease-in-out infinite;
  box-shadow: 0 6px 16px rgba(0, 157, 133, 0.15);
}

.logo-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 115px;
  height: 115px;
  border: 2px solid rgba(0, 157, 133, 0.3);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: ringPulse 2s ease-out infinite;
}

.welcome-title {
  display: block;
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 6px;
}

.days-protected {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 4px;
  background-color: rgba(0, 157, 133, 0.06);
  padding: 10px 20px;
  border-radius: 24px;
  border: 1px solid rgba(0, 157, 133, 0.2);
  margin: 16px auto 0;
  width: fit-content;
}

.days-prefix {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
}

.days-number {
  font-size: 30px;
  font-weight: 800;
  color: #009D85;
  line-height: 1;
  min-width: 17px;
  text-align: center;
}

.days-suffix {
  font-size: 16px;
  color: #009D85;
  font-weight: 600;
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

.alert-detail-list {
  margin-top: 10px;
  padding: 10px 12px;
  background-color: rgba(255, 255, 255, 0.65);
  border-radius: 10px;
}

.alert-detail-item {
  font-size: 12px;
  line-height: 1.5;
  margin-bottom: 6px;
  color: #606266;
}

.alert-detail-item:last-child {
  margin-bottom: 0;
}

.alert-detail-name {
  font-weight: 600;
  color: #303133;
}

.alert-detail-value {
  color: #E6A23C;
  font-weight: 600;
}

.alert-detail-range {
  color: #909399;
}

.alert-arrow {
  font-size: 20px;
  color: #C0C4CC;
}

.alert-normal {
  background-color: rgba(0, 157, 133, 0.08);
  border-left-color: #009D85;
}

.alert-normal .alert-icon {
  filter: brightness(0) saturate(100%) invert(42%) sepia(93%) saturate(389%) hue-rotate(131deg) brightness(93%) contrast(94%);
}

.alert-title-normal {
  color: #009D85;
}

.tips-section {
  padding: 0 16px;
  margin-bottom: 16px;
}

.tips-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 12px;
}

.tips-title-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tips-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.tips-title {
  font-size: 17px;
  font-weight: 700;
  color: #1F2937;
}

.tips-subtitle {
  font-size: 12px;
  color: #6B7280;
}

.tips-list {
  background-color: #FFFFFF;
  border-radius: 18px;
  border: 2px solid rgba(0, 157, 133, 0.38);
  border-left: 8px solid #009D85;
  border-top: 2px solid rgba(0, 157, 133, 0.28);
  box-shadow: 0 10px 24px rgba(0, 157, 133, 0.14);
  overflow: hidden;
}

.tips-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 20px 18px;
  border-bottom: 1px solid #EEF2F7;
}

.tips-item:last-child {
  border-bottom: none;
}

.tip-icon-wrap {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.tip-icon-img {
  width: 26px;
  height: 26px;
}

.tip-icon-indicator {
  background-color: rgba(6, 182, 212, 0.12);
}

.tip-icon-vital {
  background-color: rgba(245, 108, 108, 0.12);
}

.tip-icon-medication {
  background-color: rgba(59, 130, 246, 0.12);
}

.tip-content {
  flex: 1;
}

.tip-text {
  display: block;
  font-size: 16px;
  font-weight: 700;
  color: #1F2937;
  line-height: 1.45;
  margin-bottom: 4px;
}

.tip-desc {
  display: block;
  font-size: 12px;
  color: #6B7280;
  line-height: 1.45;
}

.tip-arrow {
  font-size: 24px;
  color: #C0C4CC;
  line-height: 1;
  padding-top: 2px;
}



.notification-section {
  margin-top: 16px;
  padding: 0 16px;
}

.notification-list {
  background-color: #FFFFFF;
  border-radius: 12px;
  padding: 8px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.notification-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f4f4f5;
  transition: background-color 0.2s;
}

.notification-item:last-child {
  border-bottom: none;
}

.notification-item:active {
  background-color: #f5f7fa;
}

.notification-dot {
  width: 8px;
  height: 8px;
  background-color: #F56C6C;
  border-radius: 50%;
  margin-right: 12px;
  flex-shrink: 0;
}

.notification-content {
  flex: 1;
  font-size: 14px;
  color: #303133;
  line-height: 1.5;
}

.notification-time {
  font-size: 12px;
  color: #909399;
  margin-left: 12px;
  flex-shrink: 0;
}

.news-section {
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

.news-section {
  padding: 0 16px;
}

.news-list {
  display: flex;
  flex-direction: column;
  background-color: #FFFFFF;
  border-radius: 12px;
  overflow: hidden;
}

.news-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid #EBEEF5;
}

.news-item:last-child {
  border-bottom: none;
}

.news-left {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  overflow: hidden;
}

.news-tag {
  font-size: 11px;
  color: #FFFFFF;
  background-color: #F56C6C;
  padding: 2px 6px;
  border-radius: 4px;
  flex-shrink: 0;
}

.news-title {
  font-size: 14px;
  color: #303133;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.news-time {
  font-size: 12px;
  color: #909399;
  flex-shrink: 0;
  margin-left: 12px;
}

.bottom-space {
  height: 100px;
}
</style>