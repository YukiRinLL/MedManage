<template>
  <view class="home-container">
    <!-- 欢迎信息 -->
    <view class="welcome-section">
      <text class="welcome-title">欢迎使用医院患者管理系统！</text>
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
      
      <view class="menu-item" @click="navigateTo('/pages/notification/notification')">
        <text class="menu-icon">🔔</text>
        <text>通知中心</text>
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
      uni.switchTab({
        url: url
      })
    }
  }
}
</script>

<style scoped>
.home-container {
  padding: 0;
  min-height: 100vh;
  background-color: #f5f5f5;
}

/* 欢迎信息 */
.welcome-section {
  padding: 30px 20px;
  text-align: center;
  background-color: white;
  margin-bottom: 20px;
  border-radius: 0 0 20px 20px;
}

.welcome-title {
  display: block;
  font-size: 22px;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
}

.welcome-subtitle {
  display: block;
  font-size: 14px;
  color: #666;
}

/* 功能菜单 */
.menu-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  padding: 0 16px;
  margin-bottom: 20px;
}

.menu-item {
  background-color: #FFFFFF;
  padding: 24px 16px;
  border-radius: 12px;
  text-align: center;
  color: #333333;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.menu-icon {
  font-size: 36px;
  margin-bottom: 12px;
}

.menu-item text {
  display: block;
  font-size: 14px;
  font-weight: 500;
}
</style>