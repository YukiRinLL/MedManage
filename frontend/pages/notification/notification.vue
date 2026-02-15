<template>
  <view class="notification-container">
    <!-- 通知内容 -->
    <view class="notification-content">
      <view class="notification-card">
        <text class="card-title">消息通知</text>
        
        <view v-if="notifications.length > 0" class="notification-list">
          <view v-for="notification in notifications" :key="notification.id" class="notification-item" :class="{ unread: !notification.read }">
            <text class="notification-icon">
              {{ getNotificationIcon(notification.type) }}
            </text>
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
          <text class="empty-icon">🔔</text>
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
    getNotificationIcon(type) {
      switch (type) {
        case 'MEDICATION':
          return '💊'
        case 'VITAL_SIGN':
          return '📊'
        case 'APPOINTMENT':
          return '📅'
        case 'SYSTEM':
          return '📢'
        default:
          return '🔔'
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
  background-color: #e6f2ff;
  border-color: #007AFF;
}

.notification-icon {
  font-size: 24px;
  margin-right: 12px;
  flex-shrink: 0;
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
  background-color: #007AFF;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 12px;
  margin-left: 8px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 60px;
  margin-bottom: 20px;
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