<template>
  <div class="notification-container">
    <!-- 顶部导航栏 -->
    <div class="top-nav">
      <button class="nav-btn back-btn" @click="goBack">
        <span class="nav-icon">←</span>
      </button>
      <h1 class="nav-title">通知中心</h1>
      <button class="nav-btn setting-btn" @click="notificationSettings">
        <span class="nav-icon">⚙️</span>
      </button>
    </div>
    
    <!-- 通知内容 -->
    <div class="notification-content">
      <div class="notification-card">
        <h2 class="card-title">消息通知</h2>
        
        <div v-if="notifications.length > 0" class="notification-list">
          <div v-for="notification in notifications" :key="notification.id" class="notification-item" :class="{ unread: !notification.read }">
            <div class="notification-icon">
              {{ getNotificationIcon(notification.type) }}
            </div>
            <div class="notification-body">
              <div class="notification-header">
                <h3 class="notification-title">{{ notification.title }}</h3>
                <span class="notification-time">{{ formatDate(notification.createTime) }}</span>
              </div>
              <p class="notification-message">{{ notification.content }}</p>
            </div>
            <button v-if="!notification.read" class="mark-read-btn" @click="markAsRead(notification.id)">
              标记已读
            </button>
          </div>
        </div>
        
        <div v-else class="empty-state">
          <div class="empty-icon">🔔</div>
          <p class="empty-text">暂无通知</p>
          <p class="empty-subtext">当有新消息时，会显示在这里</p>
        </div>
      </div>
    </div>
    
    <!-- 底部导航栏 -->
    <div class="bottom-nav">
      <router-link to="/home" class="nav-item">
        <span class="nav-icon">🏠</span>
        <span class="nav-text">首页</span>
      </router-link>
      <router-link to="/health-record" class="nav-item">
        <span class="nav-icon">📋</span>
        <span class="nav-text">健康</span>
      </router-link>
      <router-link to="/medication" class="nav-item">
        <span class="nav-icon">💊</span>
        <span class="nav-text">用药</span>
      </router-link>
      <router-link to="/notification" class="nav-item active">
        <span class="nav-icon">🔔</span>
        <span class="nav-text">通知</span>
      </router-link>
      <router-link to="/profile" class="nav-item">
        <span class="nav-icon">👤</span>
        <span class="nav-text">我的</span>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAxios } from '../composables/useAxios.js'

const router = useRouter()
const { axios } = useAxios()
const notifications = ref([])

const goBack = () => {
  router.back()
}

const notificationSettings = () => {
  // 这里可以跳转到通知设置页面
  alert('通知设置功能开发中')
}

const getNotifications = async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/')
      return
    }
    const res = await axios.get('/notification/list', {
      headers: {
        Authorization: token
      }
    })
    if (res.code === 200) {
      notifications.value = res.data
    }
  } catch (err) {
    console.log(err)
    alert('获取通知失败')
  }
}

const markAsRead = async (id) => {
  try {
    const token = localStorage.getItem('token')
    await axios.put(`/notification/read/${id}`, {}, {
      headers: {
        Authorization: token
      }
    })
    // 更新本地状态
    const notification = notifications.value.find(n => n.id === id)
    if (notification) {
      notification.read = true
    }
  } catch (err) {
    console.log(err)
    alert('标记已读失败')
  }
}

const getNotificationIcon = (type) => {
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
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleString()
}

onMounted(() => {
  getNotifications()
})
</script>

<style scoped>
.notification-container {
  padding: 0;
  min-height: 100vh;
  background-color: #f5f5f5;
  position: relative;
  padding-bottom: 60px;
}

/* 顶部导航栏 */
.top-nav {
  background-color: #007AFF;
  color: white;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.nav-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  flex: 1;
  text-align: center;
}

.nav-btn {
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-btn:active {
  background-color: rgba(255, 255, 255, 0.2);
}

.back-btn {
  font-size: 24px;
}

.setting-btn {
  font-size: 20px;
}

.nav-icon {
  font-size: 20px;
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
  margin: 0;
}

.notification-time {
  font-size: 12px;
  color: #666;
}

.notification-message {
  font-size: 13px;
  color: #666;
  margin: 0;
  line-height: 1.4;
}

.mark-read-btn {
  background-color: #007AFF;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 12px;
  cursor: pointer;
  margin-top: 8px;
}

.mark-read-btn:active {
  background-color: #0056b3;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

.empty-subtext {
  font-size: 14px;
  color: #666;
  margin: 0;
}

/* 底部导航栏 */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: white;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 8px 0;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  z-index: 99;
  height: 60px;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: #666;
  font-size: 12px;
  padding: 4px 0;
  flex: 1;
}

.nav-item.active {
  color: #007AFF;
}

.nav-item .nav-icon {
  font-size: 20px;
  margin-bottom: 4px;
}

.nav-item .nav-text {
  font-size: 10px;
}
</style>