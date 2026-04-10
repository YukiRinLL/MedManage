<template>
  <view class="home-container">
    <!-- 欢迎信息 -->
    <view class="welcome-section">
      <image src="/static/logo.png" class="welcome-logo" mode="aspectFit" />
      <text class="welcome-title">重庆圣通尚诺医疗管理™</text>
      <text class="welcome-subtitle">您的健康管理助手</text>
    </view>
    
    <!-- 功能菜单 -->
    <view class="menu-grid">
      <view class="menu-item" @click="navigateTo('/pages/health-record/health-record')">
        <text class="menu-icon">📋</text>
        <text>健康档案</text>
      </view>
      
      <view class="menu-item" @click="navigateTo('/pages/vital-sign/vital-sign')">
        <text class="menu-icon">❤️</text>
        <text>生命体征</text>
      </view>
      
      <view class="menu-item" @click="navigateTo('/pages/medication/medication')">
        <text class="menu-icon">💊</text>
        <text>用药记录</text>
      </view>
      
      <view class="menu-item" @click="navigateTo('/pages/activities/list')">
        <text class="menu-icon">🎉</text>
        <text>活动中心</text>
      </view>
      
      <view class="menu-item" @click="navigateTo('/pages/notification/notification')">
        <text class="menu-icon">🔔</text>
        <text>通知中心</text>
      </view>

      <view class="menu-item" @click="navigateTo('/pages/news/list')">
        <text class="menu-icon">📰</text>
        <text>新闻资讯</text>
      </view>
      
      <view class="menu-item" @click="navigateTo('/pages/diagnosis/diagnosis')">
        <text class="menu-icon">🩺</text>
        <text>诊断信息</text>
      </view>
      
      <view class="menu-item" @click="navigateTo('/pages/insurance/insurance')">
        <text class="menu-icon">💳</text>
        <text>参保信息</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      showUserMenu: false
    }
  },
  methods: {
    navigateTo(url) {
      // 标签栏页面列表
      const tabBarPages = [
        '/pages/home/home',
        '/pages/health-record/health-record',
        '/pages/activities/list',
        '/pages/medication/medication',
        '/pages/profile/profile'
      ]
      
      // 检查目标页面是否是标签栏页面
      if (tabBarPages.includes(url)) {
        uni.switchTab({ url })
      } else {
        uni.navigateTo({ url })
      }
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

/* 欢迎信息 */
.welcome-section {
  padding: 50px 20px 35px;
  text-align: center;
  background-color: #FFFFFF;
  margin-bottom: 16px;
}

.welcome-logo {
  width: 160px;
  height: 160px;
  margin-bottom: 20px;
  border-radius: 36px;
  background-color: #FFFFFF;
  padding: 24px;
  border: 2px solid #EBEEF5;
}

.welcome-title {
  display: block;
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 10px;
}

.welcome-subtitle {
  display: block;
  font-size: 15px;
  color: #009D85;
  font-weight: 500;
}

/* 功能菜单 */
.menu-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  padding: 0 16px;
  margin-bottom: 16px;
}

.menu-item {
  background-color: #FFFFFF;
  padding: 20px 12px;
  border-radius: 12px;
  text-align: center;
  color: #303133;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  min-height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.menu-item:active {
  background-color: #F5F7FA;
}

.menu-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.menu-item text {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: #606266;
}
</style>