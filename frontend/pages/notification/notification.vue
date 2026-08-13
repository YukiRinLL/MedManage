<template>
  <view class="notification-container">
    <!-- 加载状态 -->
    <view v-if="isLoading" class="loading-container">
      <view class="loading-spinner"></view>
      <text class="loading-text">加载中...</text>
    </view>
    
    <!-- 通知内容 -->
    <view v-else class="notification-content">
      <view class="notification-card">
        <text class="card-title">消息通知</text>
        
        <view v-if="notifications.length > 0" class="notification-list">
          <view v-for="notification in notifications" :key="notification.id" class="notification-item" :class="{ unread: !notification.isRead }">
            <view class="notification-icon" :class="'type-' + notification.type.toLowerCase()"></view>
            <view class="notification-body">
              <view class="notification-header">
                <text class="notification-title">{{ notification.title }}</text>
                <text class="notification-time">{{ formatDate(notification.createTime) }}</text>
              </view>
              <text class="notification-message">{{ notification.content }}</text>
            </view>
            <button v-if="!notification.isRead" class="mark-read-btn" @click="markAsRead(notification.id)">
              标记已读
            </button>
          </view>
        </view>
        
        <view v-else class="empty-state">
          <view class="empty-icon"></view>
          <text class="empty-text">暂无通知</text>
          <text class="empty-subtext">当有新消息时，会显示在这里</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { get, put } from '../../utils/request.js'

export default {
  data() {
    return {
      notifications: [],
      isLoading: true
    }
  },
  onLoad() {
    this.getNotifications()
  },
  methods: {
    async getNotifications() {
      this.isLoading = true
      try {
        const token = uni.getStorageSync('token')
        if (!token) {
          uni.navigateTo({
            url: '/pages/login/login'
          })
          return
        }
        const userId = uni.getStorageSync('userId')
        const res = await get(`/notification/list/${userId}`)
        if (res.code === 200) {
          this.notifications = res.data
        }
      } catch (err) {
        console.log(err)
        uni.showToast({
          title: '获取通知失败',
          icon: 'none'
        })
      } finally {
        this.isLoading = false
      }
    },
    async markAsRead(id) {
      try {
        const token = uni.getStorageSync('token')
        await put(`/notification/read/${id}`)
        const notification = this.notifications.find(n => n.id === id)
        if (notification) {
          notification.read = true
        }
      } catch (err) {
        console.log(err)
        uni.showToast({
          title: '标记已读失败',
          icon: 'none'
        })
      }
    },
    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleString()
    }
  }
}
</script>

<style scoped>
.notification-container {
  padding: 0;
  min-height: 100vh;
  background: linear-gradient(180deg, #b3fff4 0%, #FFFFFF 40%, #FFFFFF 100%);
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(180deg, #b3fff4 0%, #FFFFFF 40%, #FFFFFF 100%);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 157, 133, 0.2);
  border-radius: 50%;
  border-top-color: #009D85;
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 16px;
}

.loading-text {
  font-size: 14px;
  color: #606266;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 通知内容 */
.notification-content {
  padding: 16px;
}

.notification-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 16px rgba(25, 162, 128, 0.08);
}

.card-title {
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(25, 162, 128, 0.08);
}

.notification-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  padding: 16px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 4px 16px rgba(25, 162, 128, 0.08);
}

.notification-item.unread {
  background: rgba(0, 157, 133, 0.08);
  border: 1px solid rgba(0, 157, 133, 0.3);
}

.notification-icon {
  width: 36px;
  height: 36px;
  margin-right: 12px;
  flex-shrink: 0;
  background-color: rgba(0, 157, 133, 0.1);
  border: 2px solid rgba(0, 157, 133, 0.3);
  border-radius: 50%;
  position: relative;
}

.notification-icon::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 2px;
  height: 9px;
  background-color: #009D85;
  border-radius: 1px;
  transform: translate(-50%, -100%);
}

.notification-icon::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 6px;
  height: 2px;
  background-color: #009D85;
  border-radius: 1px;
  transform: translate(0%, -50%);
}

.notification-icon.type-medication {
  background-color: rgba(0, 157, 133, 0.1);
}

.notification-icon.type-medication::after {
  width: 14px;
  height: 6px;
  border: none;
  background-color: #009D85;
  border-radius: 3px;
  transform: translate(-50%, -50%) rotate(45deg);
}

.notification-icon.type-medication::before {
  width: 14px;
  height: 6px;
  background-color: #009D85;
  border-radius: 3px;
  transform: translate(-50%, -50%) rotate(-45deg);
  bottom: auto;
  top: 50%;
}

.notification-body {
  flex: 1;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.notification-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.notification-time {
  font-size: 12px;
  color: #666;
}

.notification-message {
  font-size: 13px;
  color: #666;
  line-height: 1.4;
}

.mark-read-btn {
  background-color: #009D85;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 12px;
  margin-left: 8px;
}

.mark-read-btn:active {
  background-color: #007D6B;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
}

.empty-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  background-color: rgba(0, 157, 133, 0.08);
  border-radius: 16px;
  position: relative;
}

.empty-icon::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -60%);
  width: 24px;
  height: 24px;
  border: 3px solid rgba(0, 157, 133, 0.4);
  border-bottom: none;
  border-radius: 12px 12px 0 0;
}

.empty-icon::before {
  content: '';
  position: absolute;
  bottom: calc(50% - 20px);
  left: 50%;
  transform: translateX(-50%);
  width: 12px;
  height: 6px;
  background-color: rgba(0, 157, 133, 0.4);
  border-radius: 0 0 6px 6px;
}

.empty-text {
  display: block;
  font-size: 16px;
  color: #333;
  margin-bottom: 8px;
}

.empty-subtext {
  display: block;
  font-size: 14px;
  color: #999;
}
</style>