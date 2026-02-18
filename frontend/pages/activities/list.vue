<template>
  <view class="activities-container">
    <view class="header">
      <text class="title">活动中心</text>
    </view>

    <view class="activity-list">
      <view class="activity-item" v-for="activity in activities" :key="activity.id" @click="viewDetail(activity)">
        <image class="activity-cover" :src="activity.coverImage || '/static/default-cover.png'" mode="aspectFill"></image>
        <view class="activity-info">
          <text class="activity-title">{{ activity.title }}</text>
          <text class="activity-type">{{ activity.activityType }}</text>
          <view class="activity-meta">
            <text class="meta-item">
              <text class="icon">📍</text>
              {{ activity.location }}
            </text>
            <text class="meta-item">
              <text class="icon">⏰</text>
              {{ formatTime(activity.startTime) }}
            </text>
          </view>
          <view class="activity-participants">
            <text class="participants-count">{{ activity.currentParticipants || 0 }}/{{ activity.maxParticipants || '不限' }}</text>
            <text class="participants-text">人已报名</text>
          </view>
          <view class="activity-status">
            <text class="status-tag" :class="'status-' + activity.status">
              {{ getStatusText(activity.status) }}
            </text>
          </view>
        </view>
      </view>
    </view>

    <view class="loading" v-if="loading">
      <text>加载中...</text>
    </view>

    <view class="empty" v-if="!loading && activities.length === 0">
      <text>暂无活动</text>
    </view>
  </view>
</template>

<script>
import request from '@/utils/request.js'

export default {
  data() {
    return {
      activities: [],
      loading: false
    }
  },
  onLoad() {
    this.fetchActivities()
  },
  onPullDownRefresh() {
    this.fetchActivities()
    setTimeout(() => {
      uni.stopPullDownRefresh()
    }, 1000)
  },
  methods: {
    async fetchActivities() {
      this.loading = true
      try {
        const res = await request.get('/activity/active')
        if (res.code === 200) {
          this.activities = res.data || []
        }
      } catch (error) {
        console.error('获取活动列表失败:', error)
        uni.showToast({
          title: '获取活动列表失败',
          icon: 'none'
        })
      } finally {
        this.loading = false
      }
    },
    viewDetail(activity) {
      uni.navigateTo({
        url: `/pages/activities/detail?id=${activity.id}`
      })
    },
    formatTime(timeString) {
      if (!timeString) return ''
      const date = new Date(timeString)
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const day = date.getDate().toString().padStart(2, '0')
      const hour = date.getHours().toString().padStart(2, '0')
      const minute = date.getMinutes().toString().padStart(2, '0')
      return `${month}-${day} ${hour}:${minute}`
    },
    getStatusText(status) {
      const texts = { 0: '已结束', 1: '进行中', 2: '未开始' }
      return texts[status] || '未知'
    }
  }
}
</script>

<style scoped>
.activities-container {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.header {
  padding: 30rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.title {
  font-size: 40rpx;
  font-weight: bold;
}

.activity-list {
  padding: 20rpx;
}

.activity-item {
  background-color: white;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
}

.activity-cover {
  width: 100%;
  height: 300rpx;
}

.activity-info {
  padding: 24rpx;
}

.activity-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 12rpx;
}

.activity-type {
  font-size: 24rpx;
  color: #666;
  display: block;
  margin-bottom: 16rpx;
}

.activity-meta {
  margin-bottom: 16rpx;
}

.meta-item {
  font-size: 24rpx;
  color: #999;
  display: block;
  margin-bottom: 8rpx;
}

.icon {
  margin-right: 8rpx;
}

.activity-participants {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
}

.participants-count {
  font-size: 28rpx;
  color: #409EFF;
  font-weight: bold;
  margin-right: 8rpx;
}

.participants-text {
  font-size: 24rpx;
  color: #999;
}

.activity-status {
  text-align: right;
}

.status-tag {
  display: inline-block;
  padding: 8rpx 24rpx;
  border-radius: 24rpx;
  font-size: 24rpx;
}

.status-0 {
  background-color: #f0f0f0;
  color: #999;
}

.status-1 {
  background-color: #e1f3d8;
  color: #67c23a;
}

.status-2 {
  background-color: #ecf5ff;
  color: #409EFF;
}

.loading, .empty {
  text-align: center;
  padding: 60rpx 0;
  color: #999;
  font-size: 28rpx;
}
</style>
