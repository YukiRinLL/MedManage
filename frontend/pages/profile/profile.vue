<template>
  <view class="profile-container">
    <!-- Top Background -->
    <view class="top-bg"></view>

    <!-- Sticky Top: Header -->
    <view class="sticky-top" :class="{ 'frost-visible': pageVisible }">
      <view class="status-bar">
        <view class="status-content">
          <image src="/static/design/home/图层 0 4.png" class="logo-layer-img" mode="aspectFit" />
          <text class="header-title">我的</text>
        </view>
      </view>
    </view>

    <view v-if="isLoading" class="loading-container">
      <view class="loading-spinner"></view>
      <text class="loading-text">加载中...</text>
    </view>

    <view v-else class="page-content" :class="{ 'frost-visible': pageVisible }">
      <!-- User Card -->
      <view class="user-card-section" v-if="userInfo">
        <!-- <view class="user-green-header animate-fade-in-up" :style="{ animationDelay: '0.05s' }">
          <text class="user-header-title">个人信息</text>
        </view> -->
        <view class="user-frosted-tray">
          <view class="user-info-inner">
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
        </view>
      </view>

      <!-- Section 1: Account & Services -->
      <view class="content-section">
        <view class="section-green-header animate-fade-in-up" :style="{ animationDelay: '0.1s' }">
          <view class="section-title-row-section">
            <image src="/static/icons/png/filled/people/person@2x.png" class="section-icon" mode="aspectFit" />
            <text class="section-title-text">账户与服务</text>
          </view>
        </view>
        <view class="section-frosted-tray">
          <view class="menu-list">
            <view class="menu-item-row animate-fade-in-up" :style="{ animationDelay: '0.15s' }" @click="navigateToPersonalInfo">
              <view class="menu-icon-wrap bg-teal">
                <image src="/static/icons/png/filled/people/person@2x.png" class="menu-icon-img" mode="aspectFit" />
              </view>
              <view class="menu-item-main">
                <text class="menu-title">个人信息</text>
                <text class="menu-desc">查看和编辑个人资料</text>
              </view>
              <text class="menu-arrow">›</text>
            </view>

            <view class="menu-item-row animate-fade-in-up" :style="{ animationDelay: '0.2s' }" @click="navigateToInsurance">
              <view class="menu-icon-wrap bg-blue">
                <image src="/static/icons/png/filled/objects/credit_card@2x.png" class="menu-icon-img" mode="aspectFit" />
              </view>
              <view class="menu-item-main">
                <text class="menu-title">参保信息</text>
                <text class="menu-desc">医保参保状态查询</text>
              </view>
              <text class="menu-arrow">›</text>
            </view>

            <view class="menu-item-row animate-fade-in-up" :style="{ animationDelay: '0.25s' }" @click="navigateToSettings">
              <view class="menu-icon-wrap bg-cyan">
                <image src="/static/icons/png/filled/symbols/ui_settings@2x.png" class="menu-icon-img" mode="aspectFit" />
              </view>
              <view class="menu-item-main">
                <text class="menu-title">设置</text>
                <text class="menu-desc">通知、隐私与通用设置</text>
              </view>
              <text class="menu-arrow">›</text>
            </view>
          </view>
        </view>
      </view>

      <!-- Section 2: About & Help -->
      <view class="content-section">
        <view class="section-green-header animate-fade-in-up" :style="{ animationDelay: '0.3s' }">
          <view class="section-title-row-section">
            <image src="/static/icons/png/filled/symbols/info@2x.png" class="section-icon" mode="aspectFit" />
            <text class="section-title-text">关于与帮助</text>
          </view>
        </view>
        <view class="section-frosted-tray">
          <view class="menu-list">
            <view class="menu-item-row animate-fade-in-up" :style="{ animationDelay: '0.35s' }" @click="navigateToAbout">
              <view class="menu-icon-wrap bg-green">
                <image src="/static/icons/png/filled/symbols/info@2x.png" class="menu-icon-img" mode="aspectFit" />
              </view>
              <view class="menu-item-main">
                <text class="menu-title">关于我们</text>
                <text class="menu-desc">了解圣通尚诺医疗</text>
              </view>
              <text class="menu-arrow">›</text>
            </view>

            <view class="menu-item-row animate-fade-in-up" :style="{ animationDelay: '0.4s' }" @click="navigateToHelp">
              <view class="menu-icon-wrap bg-teal">
                <image src="/static/icons/png/filled/symbols/question_circle@2x.png" class="menu-icon-img" mode="aspectFit" />
              </view>
              <view class="menu-item-main">
                <text class="menu-title">帮助中心</text>
                <text class="menu-desc">常见问题解答</text>
              </view>
              <text class="menu-arrow">›</text>
            </view>
          </view>
        </view>
      </view>

      <!-- Logout -->
      <view class="logout-section">
        <view class="logout-btn" @click="logout">
          <text class="logout-text">退出登录</text>
        </view>
      </view>

      <view class="version-info">
        <text class="version-text">版本 1.0.0</text>
      </view>
    </view>
  </view>
</template>

<script>
import { getUserInfo, fetchUserInfo } from '../../utils/userInfoManager.js'

export default {
  data() {
    return {
      userInfo: null,
      isLoading: true,
      pageVisible: false
    }
  },
  onLoad() {
    this.getUserInfo()
  },
  onShow() {
    this.pageVisible = true
  },
  onHide() {
    this.pageVisible = false
  },
  methods: {
    async getUserInfo() {
      this.isLoading = true
      try {
        const token = uni.getStorageSync('token')
        if (!token) {
          uni.navigateTo({
            url: '/pages/login/login'
          })
          return
        }
        let userInfo = getUserInfo()
        if (userInfo) {
          this.userInfo = userInfo
        } else {
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
      } finally {
        this.isLoading = false
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
      uni.navigateTo({
        url: '/pages/profile/settings'
      })
    },
    navigateToAbout() {
      uni.navigateTo({
        url: '/pages/profile/about'
      })
    },
    navigateToHelp() {
      uni.showToast({
        title: '帮助中心功能开发中',
        icon: 'none'
      })
    },
    logout() {
      uni.showModal({
        title: '提示',
        content: '确定要退出登录吗？',
        success: (res) => {
          if (res.confirm) {
            uni.removeStorageSync('token')
            uni.removeStorageSync('user')
            uni.navigateTo({
              url: '/pages/login/login'
            })
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.profile-container {
  padding: 0;
  min-height: 100vh;
  background: #FFFFFF;
}

/* Top Background */
.top-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 45vh;
  background: linear-gradient(180deg, #b3fff4 0%, #FFFFFF 100%);
  z-index: 0;
}

/* Sticky Top Section */
.sticky-top {
  position: sticky;
  top: 0;
  z-index: 1;
  background: transparent;
  opacity: 0;
  transition: opacity 0.4s ease-out;
}

.sticky-top.frost-visible {
  opacity: 1;
}

/* Status Bar */
.status-bar {
  position: relative;
  z-index: 1;
  padding: calc(var(--status-bar-height, 20px) + 8px) 16px 8px;
}

.status-content {
  display: flex;
  align-items: center;
  position: relative;
}

.logo-layer-img {
  width: 120px;
  height: 32px;
  display: block;
}

.header-title {
  font-size: 17px;
  font-weight: 700;
  color: #000000;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  white-space: nowrap;
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
  border: 4px solid rgba(25, 162, 128, 0.15);
  border-radius: 50%;
  border-top-color: #19A280;
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-text {
  font-size: 14px;
  color: #606266;
}

/* Page Content */
.page-content {
  position: relative;
  z-index: 2;
  padding: 12px 16px 20px;
  opacity: 0;
  transition: opacity 0.5s ease-out;
}

.page-content.frost-visible {
  opacity: 1;
}

/* Animation */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in-up {
  animation: fadeInUp 0.4s ease-out both;
}

/* User Card Section */
.user-card-section {
  position: relative;
  margin-bottom: 16px;
}

.user-green-header {
  background: linear-gradient(330deg, rgba(119, 234, 206, 1) 0%, rgb(83, 204, 174) 35%, rgba(25, 162, 128, 1) 100%);
  border-radius: 16px;
  padding: 14px 18px 36px;
  box-shadow: 0 4px 20px rgba(25, 162, 128, 0.15);
  position: relative;
  z-index: 2;
}

.user-header-title {
  font-size: 16px;
  font-weight: 700;
  color: #FFFFFF;
}

.user-frosted-tray {
  position: relative;
  margin-top: 0px;
  z-index: 3;
  background: rgba(255, 255, 255, 0.24);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-radius: 14px;
  padding: 5px;
  border: 1px solid rgba(255, 255, 255, 0.58);
  box-shadow: 0 6px 24px rgba(25, 162, 128, 0.12);
}

.user-info-inner {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  padding: 12px 14px;
  box-shadow: 0 2px 10px rgba(13, 66, 49, 0.08);
  border: 1px solid rgba(255, 255, 255, 1);
}

.user-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(25, 162, 128, 0.15) 0%, rgba(52, 151, 227, 0.15) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 14px;
  flex-shrink: 0;
}

.avatar-icon {
  font-size: 24px;
  font-weight: 700;
  color: #19A280;
}

.user-details {
  flex: 1;
}

.user-name {
  display: block;
  font-size: 17px;
  font-weight: 700;
  color: #1A2B44;
  margin-bottom: 3px;
}

.user-phone {
  display: block;
  font-size: 13px;
  color: #909399;
}

.user-arrow {
  font-size: 22px;
  color: #C0C4CC;
}

/* Content Section - green header + frosted tray */
.content-section {
  position: relative;
  margin-bottom: 16px;
}

/* Section Green Header */
.section-green-header {
  background: linear-gradient(330deg, rgba(119, 234, 206, 1) 0%, rgb(83, 204, 174) 35%, rgba(25, 162, 128, 1) 100%);
  border-radius: 16px;
  padding: 14px 18px 36px;
  box-shadow: 0 4px 20px rgba(25, 162, 128, 0.15);
  position: relative;
  z-index: 2;
}

.section-title-row-section {
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-title-text {
  font-size: 16px;
  font-weight: 700;
  color: #FFFFFF;
}

/* Section Frosted Tray */
.section-frosted-tray {
  position: relative;
  margin-top: -26px;
  z-index: 3;
  background: rgba(255, 255, 255, 0.24);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-radius: 14px;
  padding: 12px 14px;
  border: 1px solid rgba(255, 255, 255, 0.58);
  box-shadow: 0 6px 24px rgba(25, 162, 128, 0.12);
}

.section-icon {
  width: 18px;
  height: 18px;
  filter: brightness(0) invert(1);
}

/* Menu List */
.menu-list {
  display: flex;
  flex-direction: column;
}

.menu-item-row {
  display: flex;
  align-items: center;
  padding: 12px 8px;
  position: relative;
  background: #FFFFFF;
  border-radius: 10px;
  margin-bottom: 6px;
  box-shadow: 0 2px 10px rgba(13, 66, 49, 0.08);
  border: 1px solid rgba(255, 255, 255, 1);
}

.menu-item-row:last-child {
  margin-bottom: 0;
}

.menu-item-row + .menu-item-row {
  margin-top: 6px;
  border-top: none;
}

.menu-icon-wrap {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  position: relative;
  flex-shrink: 0;
}

.menu-icon-img {
  width: 22px;
  height: 22px;
  filter: brightness(0) saturate(100%) invert(36%) sepia(85%) saturate(538%) hue-rotate(126deg) brightness(92%) contrast(91%);
}

.bg-teal {
  background: rgba(25, 162, 128, 0.12);
}

.bg-blue {
  background: rgba(52, 151, 227, 0.12);
}

.bg-cyan {
  background: rgba(0, 188, 212, 0.12);
}

.bg-green {
  background: rgba(25, 162, 128, 0.12);
}

.menu-item-main {
  flex: 1;
}

.menu-title {
  display: block;
  font-size: 15px;
  font-weight: 600;
  color: #1A2B44;
  margin-bottom: 2px;
}

.menu-desc {
  display: block;
  font-size: 12px;
  color: #909399;
}

.menu-arrow {
  font-size: 20px;
  color: #C0C4CC;
}

/* Logout */
.logout-section {
  padding: 8px 0 0;
  margin-top: 8px;
}

.logout-btn {
  background: rgba(255, 255, 255, 0.24);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-radius: 14px;
  padding: 14px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.58);
  box-shadow: 0 6px 24px rgba(25, 162, 128, 0.12);
}

.logout-text {
  font-size: 15px;
  font-weight: 600;
  color: #F56C6C;
}

/* Version Info */
.version-info {
  padding: 20px;
  text-align: center;
}

.version-text {
  font-size: 12px;
  color: #909399;
}
</style>
