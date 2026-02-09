<template>
  <view class="notification-container">
    <view class="header">
      <text class="section-title">通知中心</text>
      <text class="mark-all-read" @click="markAllAsRead" v-if="notificationList.some(item => !item.read)">
        全部标为已读
      </text>
    </view>
    
    <view v-if="notificationList.length > 0" class="notification-list">
      <view class="notification-item" v-for="(item, index) in notificationList" :key="index" :class="{ unread: !item.read }" @click="markAsRead(item.id)">
        <view class="notification-icon">
          <text v-if="item.type === '1'">🏥</text>
          <text v-else-if="item.type === '2'">💊</text>
          <text v-else-if="item.type === '3'">🔬</text>
          <text v-else-if="item.type === '4'">📞</text>
          <text v-else-if="item.type === '5'">⏰</text>
          <text v-else>📱</text>
        </view>
        <view class="notification-content">
          <text class="notification-title">{{ item.title }}</text>
          <text class="notification-body">{{ item.content }}</text>
          <text class="notification-time">{{ formatDate(item.createdAt) }}</text>
        </view>
        <view v-if="!item.read" class="unread-dot"></view>
      </view>
    </view>
    
    <view v-else class="empty-state">
      <view class="empty-state-icon">📱</view>
      <text class="empty-state-text">暂无通知</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      notificationList: []
    };
  },
  onLoad() {
    this.getNotificationList();
  },
  methods: {
    getNotificationList() {
      this.$axios.get('/notification/list').then(res => {
        if (res.data) {
          this.notificationList = res.data;
        }
      }).catch(err => {
        console.log(err);
      });
    },
    markAsRead(id) {
      this.$axios.put(`/notification/mark-read/${id}`).then(res => {
        // 更新本地状态
        const notification = this.notificationList.find(item => item.id === id);
        if (notification) {
          notification.read = true;
        }
      }).catch(err => {
        console.log(err);
      });
    },
    markAllAsRead() {
      this.$axios.put('/notification/mark-all-read').then(res => {
        // 更新本地状态
        this.notificationList.forEach(item => {
          item.read = true;
        });
        uni.showToast({ title: '全部标为已读', icon: 'success' });
      }).catch(err => {
        console.log(err);
      });
    },
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    }
  }
};
</script>

<style scoped>
.notification-container {
  padding: 20px;
  min-height: 100vh;
  background-color: #F5F5F5;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #333333;
}

.mark-all-read {
  font-size: 14px;
  color: #007AFF;
}

.notification-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background-color: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  position: relative;
}

.notification-item.unread {
  background-color: #F0F8FF;
}

.notification-icon {
  font-size: 24px;
  margin-top: 4px;
}

.notification-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.notification-title {
  font-size: 16px;
  font-weight: 600;
  color: #333333;
}

.notification-body {
  font-size: 14px;
  color: #666666;
  line-height: 1.4;
}

.notification-time {
  font-size: 12px;
  color: #999999;
  margin-top: 4px;
}

.unread-dot {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #FF3B30;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  color: #999999;
}

.empty-state-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-state-text {
  font-size: 16px;
}
</style>
