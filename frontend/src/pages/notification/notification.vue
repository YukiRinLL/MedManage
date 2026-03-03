<template>
  <view class="notification-container">
    <!-- 通知内容 -->
    <view class="notification-content">
      <view class="notification-card">
        <text class="card-title">消息通知</text>
        
        <view v-if="notifications.length > 0" class="notification-list">
          <view v-for="notification in notifications" :key="notification.id" class="notification-item" :class="{ unread: !notification.read }">
            <view class="notification-icon" :class="'type-' + notification.type.toLowerCase()"></view>
            <view class="notification-body">
              <view class="notification-header">
                <text class="notification-title">{{ notification.title }}</text>
                <text class="notification-time">{{ formatDate(notification.createTime) }}</text>
              </view>
              <text class="notification-message">{{ notification.content }}</text>
            </view>
            <button v-if="!notification.read" class="mark-read-btn" @click="markAsRead(notification.id)">
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
      notifications: []
    }
  },
  onLoad() {
    this.getNotifications()
  },
  methods: {
    async getNotifications() {
      try {
        const token = uni.getStorageSync('token')
        if (!token) {
          uni.switchTab({
            url: '/pages/login/login'
          })
          return
        }
        const res = await get('/notification/list')
        if (res.code === 200) {
          this.notifications = res.data
        }
      } catch (err) {
        console.log(err)
        uni.showToast({
          title: '获取通知失败',
          icon: 'none'
        })
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
  background-color: #f5f5f5;
}

/* 通知内容 */
.notification-content {
  padding: 16px;
}

.notification-card {
  background-color: #FFFFFF;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card-title {
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
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
  border-radius: 8px;
  background-color: #f9f9f9;
  border: 1px solid #f0f0f0;
}

.notification-item.unread {
  background-color: rgba(0, 157, 133, 0.08);
  border-color: #009D85;
}

.notification-icon {
  width: 40px;
  height: 40px;
  margin-right: 12px;
  flex-shrink: 0;
  background-color: #F0F0F0;
  border-radius: 8px;
  position: relative;
}

.notification-icon::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -60%);
  width: 12px;
  height: 12px;
  border: 2px solid #909399;
  border-bottom: none;
  border-radius: 6px 6px 0 0;
}

.notification-icon::before {
  content: '';
  position: absolute;
  bottom: calc(50% - 10px);
  left: 50%;
  transform: translateX(-50%);
  width: 6px;
  height: 3px;
  background-color: #909399;
  border-radius: 0 0 3px 3px;
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
  background-color: #F0F0F0;
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
  border: 3px solid #C0C4CC;
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
  background-color: #C0C4CC;
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