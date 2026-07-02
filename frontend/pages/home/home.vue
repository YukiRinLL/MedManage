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
          <text class="nav-icon">❤️</text>
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
          <text class="nav-icon">💳</text>
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
          <text class="nav-icon">🎉</text>
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
    
    <view class="tips-section animate-fade-in" :style="{ animationDelay: '0.4s' }">
      <view class="tips-header">
        <text class="tips-title">💡 使用提示</text>
        <view class="tips-badge">3</view>
      </view>
      <view class="tips-list">
        <view class="tips-item" v-for="(tip, index) in tips" :key="index">
          <view class="tip-dot"></view>
          <text class="tip-text">{{ tip }}</text>
        </view>
      </view>
    </view>
    
    <view class="bottom-space"></view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      tips: [
        '定期记录生命体征数据',
        '按时查看用药提醒',
        '关注最新活动通知'
      ],
      isNavigating: false
    }
  },
  methods: {
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
  background: linear-gradient(180deg, #FFFFFF 0%, #F5F7FA 100%);
  margin-bottom: 16px;
  position: relative;
  overflow: hidden;
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
}

.nav-card:active {
  transform: scale(0.98);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.nav-card:nth-child(1)::before {
  background: linear-gradient(180deg, #009D85 0%, #00C4A7 100%);
}

.nav-card:nth-child(2)::before {
  background: linear-gradient(180deg, #FAA31A 0%, #FFC53D 100%);
}

.nav-card:nth-child(3)::before {
  background: linear-gradient(180deg, #EC4899 0%, #F472B6 100%);
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
  background: linear-gradient(135deg, rgba(0, 157, 133, 0.15) 0%, rgba(0, 157, 133, 0.05) 100%);
}

.bg-orange {
  background: linear-gradient(135deg, rgba(250, 173, 20, 0.15) 0%, rgba(250, 173, 20, 0.05) 100%);
}

.bg-pink {
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(236, 72, 153, 0.05) 100%);
}

.nav-icon {
  font-size: 28px;
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

.tips-section {
  margin-top: 20px;
  padding: 0 16px;
}

.tips-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
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

.bottom-space {
  height: 100px;
}
</style>