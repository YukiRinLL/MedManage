<template>
  <view class="interaction-container">
    <view class="section-header animate-fade-in">
      <view class="header-bg"></view>
      <view class="header-content">
        <text class="section-title">互动中心</text>
        <text class="section-desc">获取最新资讯与活动</text>
      </view>
    </view>
    
    <view class="menu-grid">
      <view 
        class="menu-item animate-fade-in-up" 
        :style="{ animationDelay: '0.1s' }"
        @click="handleItemClick('/pages/activities/list', '活动中心')"
      >
        <view class="menu-icon-wrapper bg-pink">
          <image src="/static/icons/png/filled/objects/award_trophy@2x.png" class="menu-icon-img" mode="aspectFit" />
        </view>
        <text class="menu-text">活动中心</text>
        <text class="menu-hint">参与健康互动活动</text>
      </view>
      
      <view 
        class="menu-item animate-fade-in-up" 
        :style="{ animationDelay: '0.15s' }"
        @click="handleItemClick('/pages/news/list', '新闻资讯')"
      >
        <view class="menu-icon-wrapper bg-yellow">
          <image src="/static/icons/png/filled/objects/spreadsheets@2x.png" class="menu-icon-img" mode="aspectFit" />
        </view>
        <text class="menu-text">新闻资讯</text>
        <text class="menu-hint">了解医疗健康动态</text>
      </view>
      
      <view 
        class="menu-item menu-item-wide animate-fade-in-up" 
        :style="{ animationDelay: '0.2s' }"
        @click="handleItemClick('/pages/notification/notification', '通知中心')"
      >
        <view class="wide-content">
          <view class="menu-icon-wrapper bg-indigo">
            <image src="/static/icons/png/filled/objects/megaphone@2x.png" class="menu-icon-img" mode="aspectFit" />
            <view class="notification-badge" v-if="unreadCount > 0">{{ unreadCount }}</view>
          </view>
          <view class="wide-text">
            <text class="menu-text">通知中心</text>
            <text class="menu-hint">查看系统通知消息</text>
          </view>
        </view>
        <text class="nav-arrow">›</text>
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
      isNavigating: false,
      unreadCount: 0
    }
  },
  onLoad() {
    this.fetchUnreadCount()
  },
  methods: {
    async fetchUnreadCount() {
      try {
        const userId = uni.getStorageSync('userId')
        const res = await get(`/notification/unread/${userId}`)
        if (res.code === 200) {
          this.unreadCount = res.data || 0
        }
      } catch (err) {
        console.log('获取未读通知失败:', err)
      }
    },
    handleItemClick(url, title) {
      if (this.isNavigating) return
      this.isNavigating = true
      
      uni.vibrateShort({})
      
      uni.navigateTo({ 
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
    }
  }
}
</script>

<style scoped>
.interaction-container {
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

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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

.menu-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  padding: 20px 16px;
}

.menu-item {
  background-color: #FFFFFF;
  padding: 28px 16px;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.menu-item:active {
  transform: scale(0.96);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.menu-item-wide {
  grid-column: span 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
}

.wide-content {
  display: flex;
  align-items: center;
}

.wide-text {
  text-align: left;
  margin-left: 16px;
}

.menu-icon-wrapper {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 14px;
  transition: all 0.25s ease;
  position: relative;
}

.menu-item-wide .menu-icon-wrapper {
  margin: 0;
}

.menu-item:active .menu-icon-wrapper {
  transform: scale(1.1);
}

.notification-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background-color: #F56C6C;
  color: #FFFFFF;
  font-size: 12px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 10px;
  animation: badgePulse 2s ease-in-out infinite;
}

@keyframes badgePulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.bg-pink {
  background-color: rgba(236, 72, 153, 0.1);
}

.bg-pink .menu-icon-img {
  filter: brightness(0) saturate(100%) invert(37%) sepia(64%) saturate(726%) hue-rotate(290deg) brightness(95%) contrast(95%);
}

.bg-yellow {
  background-color: rgba(234, 179, 8, 0.1);
}

.bg-yellow .menu-icon-img {
  filter: brightness(0) saturate(100%) invert(71%) sepia(94%) saturate(443%) hue-rotate(36deg) brightness(99%) contrast(103%);
}

.bg-indigo {
  background-color: rgba(99, 102, 241, 0.1);
}

.bg-indigo .menu-icon-img {
  filter: brightness(0) saturate(100%) invert(32%) sepia(52%) saturate(1612%) hue-rotate(239deg) brightness(96%) contrast(99%);
}

.menu-icon {
  font-size: 36px;
}

.menu-icon-img {
  width: 36px;
  height: 36px;
}

.menu-text {
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 6px;
}

.menu-hint {
  display: block;
  font-size: 12px;
  color: #909399;
}

.nav-arrow {
  font-size: 24px;
  color: #C0C4CC;
}

.bottom-space {
  height: 100px;
}
</style>