<template>
  <view class="interaction-container">
    <!-- Top Background -->
    <view class="top-bg"></view>

    <!-- Sticky Top: Header -->
    <view class="sticky-top" :class="{ 'frost-visible': pageVisible }">
      <view class="status-bar">
        <view class="status-content">
          <image src="/static/design/home/图层 0 4.png" class="logo-layer-img" mode="aspectFit" />
          <text class="header-title">互动中心</text>
        </view>
      </view>
    </view>

    <!-- Main Content -->
    <view class="main-content" :class="{ 'frost-visible': pageVisible }">
      <!-- Section 1: Activities & News -->
      <view class="content-section" :style="{ animationDelay: '0.1s' }">
        <view class="section-green-header animate-fade-in">
          <view class="section-title-row-section">
            <!-- <image src="/static/icons/png/filled/objects/award_trophy@2x.png" class="section-icon" mode="aspectFit" /> -->
            <text class="section-title-text">活动与资讯</text>
          </view>
        </view>
        <view class="section-frosted-tray">
          <view class="menu-list menu-list-row">
            <view
              class="menu-item-row menu-card animate-fade-in-up"
              @click="handleItemClick('/pages/activities/list', '活动中心')"
            >
              <view class="menu-icon-wrap bg-teal">
                <image src="/static/icons/png/filled/objects/award_trophy@2x.png" class="menu-icon-img" mode="aspectFit" />
              </view>
              <view class="menu-item-main">
                <text class="menu-title">活动中心</text>
                <text class="menu-desc">参与健康互动</text>
              </view>
            </view>

            <view
              class="menu-item-row menu-card animate-fade-in-up"
              @click="handleItemClick('/pages/news/list', '新闻资讯')"
            >
              <view class="menu-icon-wrap bg-blue">
                <image src="/static/icons/png/filled/objects/spreadsheets@2x.png" class="menu-icon-img" mode="aspectFit" />
              </view>
              <view class="menu-item-main">
                <text class="menu-title">新闻资讯</text>
                <text class="menu-desc">了解医疗动态</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- Section 2: Messages & Feedback (notification-style) -->
      <view class="msg-section animate-fade-in-up" :style="{ animationDelay: '0.2s' }">
        <view class="msg-top-gradient"></view>
        <view class="msg-header">
          <view class="msg-title-wrap">
            <text class="msg-title">消息与反馈</text>
          </view>
          <view class="msg-more-wrap" @click="handleItemClick('/pages/notification/notification', '通知中心')">
            <text class="msg-more">查看全部</text>
            <view class="msg-arrow"></view>
          </view>
        </view>
        <view class="msg-list">
          <view
            class="msg-card"
            @click="handleItemClick('/pages/notification/notification', '通知中心')"
          >
            <view class="msg-dot" :class="{ 'msg-dot-unread': unreadCount > 0 }"></view>
            <view class="msg-body">
              <text class="msg-text">通知中心</text>
              <view class="msg-meta">
                <view class="msg-time-wrap">
                  <image src="/static/design/home/Frame-4.svg" class="msg-time-icon" mode="aspectFit" />
                  <text class="msg-time">查看系统通知消息</text>
                </view>
                <text class="msg-unread" v-if="unreadCount > 0">{{ unreadCount }}条未读</text>
              </view>
            </view>
          </view>

          <view
            class="msg-card"
            @click="showFeedbackModal"
          >
            <view class="msg-dot"></view>
            <view class="msg-body">
              <text class="msg-text">问题反馈</text>
              <view class="msg-meta">
                <view class="msg-time-wrap">
                  <image src="/static/design/home/Frame-4.svg" class="msg-time-icon" mode="aspectFit" />
                  <text class="msg-time">反馈意见，帮助我们改进服务</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { get } from '../../utils/request.js'

export default {
  data() {
    return {
      isNavigating: false,
      pageVisible: false,
      unreadCount: 0
    }
  },
  onLoad() {
    this.fetchUnreadCount()
  },
  onShow() {
    this.pageVisible = true
  },
  onHide() {
    this.pageVisible = false
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
    },
    showFeedbackModal() {
      uni.showModal({
        title: '问题反馈及满意度调查',
        content: '感谢您的反馈！我们非常重视您的意见。您可以通过以下方式联系我们：\n\n服务热线：400-888-8888\n服务时间：周一至周日 8:00-20:00\n\n您也可以在门诊大厅的意见箱中留下您的宝贵意见。',
        showCancel: false,
        confirmText: '知道了'
      })
    }
  }
}
</script>

<style scoped>
.interaction-container {
  --s: calc(100vw / 375);
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
  font-weight: 500;
  color: #0A2540;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  white-space: nowrap;
}

/* Main Content - fixed below header */
.main-content {
  position: fixed;
  top: calc(var(--status-bar-height, 20px) + 56px);
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  padding: 12px 16px 20px;
  opacity: 0;
  transition: opacity 0.5s ease-out;
  overflow: hidden;
}

.main-content.frost-visible {
  opacity: 1;
}

/* Content Section - green header + frosted tray */
.content-section {
  position: relative;
  margin-bottom: 16px;
}

.content-section:last-child {
  margin-bottom: 0;
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
  font-size: clamp(14px, 4vw, 16px);
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

/* Animation */
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

.animate-fade-in-up {
  animation: fadeInUp 0.4s ease-out both;
}

.section-icon {
  width: 18px;
  height: 18px;
  filter: brightness(0) saturate(100%) invert(36%) sepia(85%) saturate(538%) hue-rotate(126deg) brightness(92%) contrast(91%);
}

/* Menu List */
.menu-list {
  display: flex;
  flex-direction: column;
}

.menu-list.menu-list-row {
  flex-direction: row;
  gap: clamp(8px, 3vw, 10px);
  align-items: stretch;
}

.menu-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 14px 8px;
  margin-bottom: 0;
  min-height: clamp(80px, 22vw, 100px);
}

.menu-card .menu-icon-wrap {
  margin-right: 0;
  margin-bottom: 6px;
}

.menu-item-row {
  display: flex;
  align-items: center;
  padding: 12px 8px;
  position: relative;
  background: #FFFFFF;
  border-radius: 10px;
  margin-bottom: 6px;
  box-shadow: 0 4px 20px rgba(100, 120, 160, 0.18), 0 1px 4px rgba(100, 120, 160, 0.1);
  border: 1px solid rgba(100, 120, 160, 0.1);
}

.menu-card.menu-item-row {
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 14px 8px;
  margin-bottom: 0;
  margin-top: 0;
}

.menu-item-row:last-child {
  margin-bottom: 0;
}

.menu-item-row + .menu-item-row {
  margin-top: 6px;
  border-top: none;
}

.menu-card.menu-item-row + .menu-card.menu-item-row {
  margin-top: 0;
}

.menu-icon-wrap {
  width: clamp(32px, 9vw, 40px);
  height: clamp(32px, 9vw, 40px);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  position: relative;
  flex-shrink: 0;
}

.menu-icon-img {
  width: clamp(18px, 5.5vw, 22px);
  height: clamp(18px, 5.5vw, 22px);
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

.menu-card .menu-item-main {
  flex: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.menu-title {
  display: block;
  font-size: clamp(13px, 3.5vw, 15px);
  font-weight: 600;
  color: #1A2B44;
  margin-bottom: 2px;
}

.menu-desc {
  display: block;
  font-size: clamp(10px, 3vw, 12px);
  color: #909399;
}

.menu-arrow {
  font-size: 20px;
  color: #C0C4CC;
}

.red-dot {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #F56C6C;
}

/* Messages & Feedback Section - notification-style (参考首页通知消息设计) */
.msg-section {
  position: relative;
  margin-bottom: 16px;
  background: linear-gradient(180deg, rgba(232, 236, 247, 1) 0%, rgba(250, 251, 253, 1) 12%, rgba(255, 255, 255, 1) 25%);
  border-radius: 14px;
  padding: 16px;
  box-shadow: 0 4px 20px rgba(100, 120, 160, 0.15), 0 1px 4px rgba(100, 120, 160, 0.08);
  border: 1px solid rgba(100, 120, 160, 0.1);
  overflow: hidden;
}

/* 顶部淡蓝色渐变 */
.msg-top-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50px;
  background: linear-gradient(180deg, rgba(224, 232, 248, 0.6) 0%, rgba(232, 236, 247, 0.3) 40%, rgba(255, 255, 255, 0) 100%);
  pointer-events: none;
  z-index: 0;
}

.msg-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  position: relative;
  z-index: 1;
}

.msg-title-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}

.msg-title {
  font-size: clamp(14px, 4vw, 16px);
  font-weight: 500;
  color: #1A2B44;
}

.msg-more-wrap {
  display: flex;
  align-items: center;
  gap: 4px;
}

.msg-more {
  font-size: 13px;
  color: #3497E3;
}

.msg-arrow {
  width: 6px;
  height: 6px;
  border-top: 1.5px solid #3497E3;
  border-right: 1.5px solid #3497E3;
  transform: rotate(45deg);
  flex-shrink: 0;
}

.msg-list {
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
}

.msg-card {
  display: flex;
  gap: 8px;
  padding: 14px 12px;
  background: #FFFFFF;
  border-radius: 12px;
  margin-bottom: 10px;
  box-shadow: 0 4px 20px rgba(100, 120, 160, 0.15), 0 1px 4px rgba(100, 120, 160, 0.08);
  border: 1px solid rgba(100, 120, 160, 0.1);
}

.msg-card:last-child {
  margin-bottom: 0;
}

.msg-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #19A280;
  flex-shrink: 0;
  margin-top: 6px;
}

.msg-dot-unread {
  background: #F56C6C;
}

.msg-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.msg-text {
  font-size: clamp(13px, 3.5vw, 14px);
  color: #1A2B44;
  font-weight: 500;
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.msg-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.msg-time-wrap {
  display: flex;
  align-items: center;
  gap: 4px;
  min-width: 0;
  flex: 1;
}

.msg-time-icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

.msg-time {
  font-size: 12px;
  color: #97A2B5;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.msg-unread {
  font-size: 12px;
  color: #F56C6C;
  flex-shrink: 0;
}

@media (max-height: 700px) {
  .content-section { margin-bottom: 10px; }
  .section-green-header { padding: 10px 16px 30px; }
  .section-frosted-tray { padding: 8px 10px; }
  .menu-item-row { padding: 8px; }
  .msg-section { padding: 12px; }
  .msg-card { padding: 10px 12px; margin-bottom: 8px; }
  .msg-header { margin-bottom: 8px; }
}

/* 小屏幕仅用 --s 等比缩放，不改变排版结构 */
</style>
