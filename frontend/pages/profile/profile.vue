<template>
  <view class="profile-container">
    <!-- 用户信息卡片 -->
    <view class="user-info-card" v-if="userInfo">
      <view class="user-avatar">
        <text class="avatar-icon">{{ getUserInitial(userInfo.name) }}</text>
      </view>
      <view class="user-details">
        <text class="user-name">{{ userInfo.name }}</text>
        <text class="user-phone">{{ userInfo.phone }}</text>
      </view>
      <view class="user-arrow" @click="navigateToPersonalInfo">
        <text>›</text>
      </view>
    </view>
    
    <!-- 功能菜单 -->
    <view class="menu-section">
      <view class="menu-card">
        <view class="menu-item" @click="navigateToPersonalInfo">
          <text class="menu-icon">👤</text>
          <text class="menu-text">个人信息</text>
          <text class="menu-arrow">›</text>
        </view>
        
        <view class="menu-item" @click="navigateToInsurance">
          <text class="menu-icon">💳</text>
          <text class="menu-text">参保信息</text>
          <text class="menu-arrow">›</text>
        </view>
        
        <view class="menu-item" @click="navigateToSettings">
          <text class="menu-icon">⚙️</text>
          <text class="menu-text">设置</text>
          <text class="menu-arrow">›</text>
        </view>
      </view>
      
      <view class="menu-card">
        <view class="menu-item" @click="navigateToAbout">
          <text class="menu-icon">ℹ️</text>
          <text class="menu-text">关于我们</text>
          <text class="menu-arrow">›</text>
        </view>
        
        <view class="menu-item" @click="navigateToHelp">
          <text class="menu-icon">❓</text>
          <text class="menu-text">帮助中心</text>
          <text class="menu-arrow">›</text>
        </view>
      </view>
    </view>
    
    <!-- 退出登录按钮 -->
    <view class="logout-section">
      <button class="btn-logout" @click="logout">退出登录</button>
    </view>
    
    <!-- 版本信息 -->
    <view class="version-info">
      <text class="version-text">版本 1.0.0</text>
    </view>
  </view>
</template>

<script>
import { getUserInfo, fetchUserInfo } from '../../utils/userInfoManager.js'

export default {
  data() {
    return {
      userInfo: null
    }
  },
  onLoad() {
    this.getUserInfo()
  },
  methods: {
    async getUserInfo() {
      try {
        const token = uni.getStorageSync('token')
        if (!token) {
          uni.navigateTo({
            url: '/pages/login/login'
          })
          return
        }
        // 先尝试从本地存储获取
        let userInfo = getUserInfo()
        if (userInfo) {
          this.userInfo = userInfo
        } else {
          // 本地没有则从API获取
          userInfo = await fetchUserInfo()
          if (userInfo) {
            this.userInfo = userInfo
          }
        }
      } catch (err) {
        console.log(err)
        uni.showToast({
          title: '获取个人信息失败',
          icon: 'none'
        })
      }
    },
    getUserInitial(name) {
      if (!name) return '?'
      return name.charAt(0).toUpperCase()
    },
    navigateToPersonalInfo() {
      uni.navigateTo({
        url: '/pages/profile/personal-info'
      })
    },
    navigateToInsurance() {
      uni.navigateTo({
        url: '/pages/insurance/insurance'
      })
    },
    navigateToSettings() {
      uni.showToast({
        title: '设置功能开发中',
        icon: 'none'
      })
    },

    navigateToAbout() {
      uni.showToast({
        title: '关于我们功能开发中',
        icon: 'none'
      })
    },
    navigateToHelp() {
      uni.showToast({
        title: '帮助中心功能开发中',
        icon: 'none'
      })
    },
    logout() {
      uni.removeStorageSync('token')
      uni.removeStorageSync('user')
      uni.navigateTo({
        url: '/pages/login/login'
      })
    }
  }
}
</script>

<style scoped>
.profile-container {
  padding: 0;
  min-height: 100vh;
  background-color: #f5f5f5;
}

/* 用户信息卡片 */
.user-info-card {
  background-color: #009D85;
  padding: 30px 20px;
  display: flex;
  align-items: center;
  color: #FFFFFF;
}

.user-avatar {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
}

.avatar-icon {
  font-size: 32px;
  font-weight: bold;
}

.user-details {
  flex: 1;
}

.user-name {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;
  display: block;
}

.user-phone {
  font-size: 14px;
  opacity: 0.9;
}

.user-arrow {
  font-size: 24px;
  opacity: 0.8;
}

/* 功能菜单 */
.menu-section {
  padding: 16px;
  margin-top: 16px;
}

.menu-card {
  background-color: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-icon {
  font-size: 20px;
  margin-right: 12px;
}

.menu-text {
  flex: 1;
  font-size: 16px;
  color: #333;
}

.menu-arrow {
  font-size: 20px;
  color: #999;
}

/* 退出登录按钮 */
.logout-section {
  padding: 0 16px;
  margin-top: 24px;
}

.btn-logout {
  background-color: #FFFFFF;
  color: #F56C6C;
  border: 1px solid #F56C6C;
  border-radius: 8px;
  padding: 14px;
  font-size: 16px;
  font-weight: 500;
  text-align: center;
  width: 100%;
}

.btn-logout:active {
  background-color: #FEF0F0;
}

/* 版本信息 */
.version-info {
  padding: 24px;
  text-align: center;
}

.version-text {
  font-size: 12px;
  color: #999;
}
</style>