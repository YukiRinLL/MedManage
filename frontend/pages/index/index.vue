<template>
  <view class="index-container">
    <!-- 用户信息卡片 -->
    <view class="user-card">
      <view class="user-avatar">
        <text>{{ user.name ? user.name.charAt(0) : '用' }}</text>
      </view>
      <view class="user-info">
        <text class="user-name">{{ user.name || '未设置姓名' }}</text>
        <text class="user-detail">{{ user.gender === 0 ? '女' : '男' }} | {{ user.age }}岁</text>
      </view>
      <navigator url="/pages/profile/profile" class="edit-btn">
        <text>编辑</text>
      </navigator>
    </view>
    
    <!-- 功能快捷入口 -->
    <view class="quick-entry">
      <view class="entry-item" @click="navigateTo('/pages/health-record/health-record')">
        <view class="entry-icon">
          <text>📋</text>
        </view>
        <text class="entry-text">健康档案</text>
      </view>
      <view class="entry-item" @click="navigateTo('/pages/vital-sign/vital-sign')">
        <view class="entry-icon">
          <text>📊</text>
        </view>
        <text class="entry-text">生命体征</text>
      </view>
      <view class="entry-item" @click="navigateTo('/pages/medication/medication')">
        <view class="entry-icon">
          <text>💊</text>
        </view>
        <text class="entry-text">用药记录</text>
      </view>
      <view class="entry-item" @click="navigateTo('/pages/notification/notification')">
        <view class="entry-icon">
          <text>📱</text>
          <view class="badge" v-if="unreadCount > 0">{{ unreadCount }}</view>
        </view>
        <text class="entry-text">通知中心</text>
      </view>
    </view>
    
    <!-- 快捷操作 -->
    <view class="quick-actions">
      <view class="action-card">
        <text class="action-title">快捷操作</text>
        <view class="action-list">
          <view class="action-item">
            <view class="action-icon">
              <text>🏥</text>
            </view>
            <text class="action-text">医院导航</text>
          </view>
          <view class="action-item">
            <view class="action-icon">
              <text>📞</text>
            </view>
            <text class="action-text">一键呼叫</text>
          </view>
          <view class="action-item">
            <view class="action-icon">
              <text>⚕️</text>
            </view>
            <text class="action-text">在线咨询</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      user: {},
      unreadCount: 0
    };
  },
  onLoad() {
    this.getUserInfo();
    this.getUnreadNotifications();
  },
  methods: {
    getUserInfo() {
      const userInfo = uni.getStorageSync('user');
      if (userInfo) {
        this.user = userInfo;
      }
      // 从服务器获取最新用户信息
      this.$axios.get('/user/info').then(res => {
        if (res.data) {
          this.user = res.data;
          uni.setStorageSync('user', res.data);
        }
      }).catch(err => {
        console.log(err);
      });
    },
    getUnreadNotifications() {
      this.$axios.get('/notification/unread').then(res => {
        if (res.data) {
          this.unreadCount = res.data.length;
        }
      }).catch(err => {
        console.log(err);
      });
    },
    navigateTo(url) {
      uni.navigateTo({ url });
    }
  }
};
</script>

<style scoped>
.index-container {
  padding: 20px;
  min-height: 100vh;
  background-color: #F5F5F5;
}

.user-card {
  background-color: #FFFFFF;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.user-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #007AFF;
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 600;
  margin-right: 16px;
}

.user-info {
  flex: 1;
}

.user-name {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;
  display: block;
}

.user-detail {
  font-size: 14px;
  color: #666666;
}

.edit-btn {
  color: #007AFF;
  font-size: 14px;
}

.quick-entry {
  background-color: #FFFFFF;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.entry-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.entry-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  background-color: #F0F8FF;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  position: relative;
}

.badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #FF3B30;
  color: #FFFFFF;
  border-radius: 10px;
  min-width: 20px;
  height: 20px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 6px;
}

.entry-text {
  font-size: 14px;
  color: #333333;
}

.quick-actions {
  margin-bottom: 20px;
}

.action-card {
  background-color: #FFFFFF;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.action-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  display: block;
}

.action-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.action-icon {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  background-color: #F5F5F5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.action-text {
  font-size: 14px;
  color: #666666;
}
</style>
