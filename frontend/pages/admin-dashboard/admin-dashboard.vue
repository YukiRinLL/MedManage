<template>
  <view class="admin-dashboard">
    <!-- 统计卡片 -->
    <view class="stats-grid">
      <view class="stat-card">
        <text class="stat-icon users-icon">👥</text>
        <view class="stat-info">
          <text class="stat-label">总用户数</text>
          <text class="stat-value">{{ dashboardData.totalUsers || 0 }}</text>
        </view>
      </view>
      <view class="stat-card">
        <text class="stat-icon admins-icon">👑</text>
        <view class="stat-info">
          <text class="stat-label">管理员数</text>
          <text class="stat-value">{{ dashboardData.totalAdmins || 0 }}</text>
        </view>
      </view>
      <view class="stat-card">
        <text class="stat-icon records-icon">📋</text>
        <view class="stat-info">
          <text class="stat-label">健康档案</text>
          <text class="stat-value">{{ dashboardData.totalRecords || 0 }}</text>
        </view>
      </view>
    </view>

    <!-- 最近活动 -->
    <view class="recent-activity">
      <text class="section-title">最近活动</text>
      <view class="activity-list">
        <view class="activity-item">
          <text class="activity-icon">🔐</text>
          <view class="activity-content">
            <text class="activity-text">管理员登录</text>
            <text class="activity-time">{{ currentTime }}</text>
          </view>
        </view>
        <view class="activity-item">
          <text class="activity-icon">📱</text>
          <view class="activity-content">
            <text class="activity-text">用户注册</text>
            <text class="activity-time">10分钟前</text>
          </view>
        </view>
        <view class="activity-item">
          <text class="activity-icon">📊</text>
          <view class="activity-content">
            <text class="activity-text">健康数据更新</text>
            <text class="activity-time">30分钟前</text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 退出登录按钮 -->
    <view class="logout-section">
      <button class="btn-logout" @click="handleLogout">退出登录</button>
    </view>
  </view>
</template>

<script>
import { get } from '../../utils/request.js'

export default {
  data() {
    return {
      dashboardData: {},
      adminName: '管理员',
      currentTime: ''
    }
  },
  onLoad() {
    this.checkAdminPermission()
    this.fetchDashboardData()
    this.updateTime()
  },
  methods: {
    checkAdminPermission() {
      const isAdmin = uni.getStorageSync('isAdmin')
      const token = uni.getStorageSync('token')
      
      if (!isAdmin || !token) {
        uni.navigateTo({
          url: '/pages/admin-login/admin-login'
        })
        return false
      }
      
      const userStr = uni.getStorageSync('user')
      if (userStr) {
        const user = JSON.parse(userStr)
        this.adminName = user.name || '管理员'
      }
      
      return true
    },
    async fetchDashboardData() {
      try {
        const res = await get('/admin/dashboard')
        if (res.code === 200) {
          this.dashboardData = res.data
        }
      } catch (error) {
        console.error('获取仪表盘数据失败:', error)
        uni.navigateTo({
          url: '/pages/admin-login/admin-login'
        })
      }
    },
    updateTime() {
      const now = new Date()
      this.currentTime = now.toLocaleTimeString('zh-CN')
    },
    handleLogout() {
      uni.removeStorageSync('token')
      uni.removeStorageSync('user')
      uni.removeStorageSync('isAdmin')
      uni.navigateTo({
        url: '/pages/admin-login/admin-login'
      })
    }
  }
}
</script>

<style scoped>
.admin-dashboard {
  padding: 20px;
  min-height: 100vh;
  background: #f5f7fa;
}

/* 统计卡片 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.stat-info {
  text-align: center;
}

.stat-label {
  display: block;
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.stat-value {
  display: block;
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

/* 最近活动 */
.recent-activity {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.section-title {
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.activity-item {
  display: flex;
  align-items: center;
  padding: 12px;
  background: #f9f9f9;
  border-radius: 8px;
}

.activity-icon {
  font-size: 24px;
  margin-right: 12px;
}

.activity-content {
  flex: 1;
}

.activity-text {
  display: block;
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
}

.activity-time {
  display: block;
  font-size: 12px;
  color: #999;
}

/* 退出登录按钮 */
.logout-section {
  padding: 16px;
}

.btn-logout {
  background-color: #ff3b30;
  color: #FFFFFF;
  border-radius: 8px;
  padding: 14px;
  font-size: 16px;
  text-align: center;
  border: none;
  width: 100%;
}
</style>