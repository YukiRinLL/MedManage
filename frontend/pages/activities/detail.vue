<template>
  <view class="activity-detail-container">
    <view class="loading" v-if="loading">
      <text>加载中...</text>
    </view>

    <scroll-view scroll-y class="content" v-else-if="activity">
      <image class="activity-cover" :src="activity.coverImage || '/static/default-cover.png'" mode="aspectFill"></image>
      
      <view class="activity-header">
        <text class="activity-title">{{ activity.title }}</text>
        <text class="activity-type">{{ activity.activityType }}</text>
      </view>

      <view class="activity-info">
        <view class="info-item">
          <text class="info-label">活动时间</text>
          <text class="info-value">{{ formatTime(activity.startTime) }} - {{ formatTime(activity.endTime) }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">活动地点</text>
          <text class="info-value">{{ activity.location }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">参与人数</text>
          <text class="info-value">{{ activity.currentParticipants || 0 }}/{{ activity.maxParticipants || '不限' }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">活动状态</text>
          <text class="info-value status-tag" :class="'status-' + activity.status">
            {{ getStatusText(activity.status) }}
          </text>
        </view>
      </view>

      <view class="activity-description">
        <text class="section-title">活动描述</text>
        <text class="description-text">{{ activity.description || '暂无描述' }}</text>
      </view>

      <view class="action-bar">
        <button 
          class="join-btn" 
          :class="{ 'joined': hasJoined }" 
          :disabled="hasJoined || activity.status !== 1"
          @click="handleJoin"
        >
          {{ hasJoined ? '已报名' : '立即报名' }}
        </button>
        <button 
          class="cancel-btn" 
          v-if="hasJoined" 
          @click="handleCancel"
        >
          取消报名
        </button>
      </view>
    </scroll-view>

    <view class="error" v-else>
      <text>活动不存在</text>
    </view>
  </view>
</template>

<script>
import request from '@/utils/request.js'

export default {
  data() {
    return {
      activityId: null,
      activity: null,
      loading: false,
      hasJoined: false
    }
  },
  onLoad(options) {
    if (options.id) {
      this.activityId = options.id
      this.fetchActivityDetail()
    }
  },
  methods: {
    async fetchActivityDetail() {
      this.loading = true
      try {
        const res = await request.get(`/activity/${this.activityId}`)
        if (res.code === 200) {
          this.activity = res.data
          this.checkJoined()
        }
      } catch (error) {
        console.error('获取活动详情失败:', error)
        uni.showToast({
          title: '获取活动详情失败',
          icon: 'none'
        })
      } finally {
        this.loading = false
      }
    },
    async checkJoined() {
      try {
        const res = await request.get('/activity-participant/my-activities')
        if (res.code === 200) {
          const myActivities = res.data || []
          this.hasJoined = myActivities.some(item => item.activityId === this.activityId && item.status === 1)
        }
      } catch (error) {
        console.error('检查参与状态失败:', error)
      }
    },
    async handleJoin() {
      if (!this.activity) return
      
      if (this.activity.status !== 1) {
        uni.showToast({
          title: '活动未开始或已结束',
          icon: 'none'
        })
        return
      }

      if (this.activity.maxParticipants && this.activity.currentParticipants >= this.activity.maxParticipants) {
        uni.showToast({
          title: '活动已满员',
          icon: 'none'
        })
        return
      }

      try {
        const res = await request.post('/activity-participant/join', {
          activityId: this.activityId
        })
        if (res.code === 200) {
          uni.showToast({
            title: '报名成功',
            icon: 'success'
          })
          this.hasJoined = true
          this.activity.currentParticipants = (this.activity.currentParticipants || 0) + 1
        }
      } catch (error) {
        console.error('报名失败:', error)
        uni.showToast({
          title: error.message || '报名失败',
          icon: 'none'
        })
      }
    },
    async handleCancel() {
      try {
        await uni.showModal({
          title: '提示',
          content: '确定要取消报名吗？'
        })
        
        const res = await request.post('/activity-participant/cancel', {
          activityId: this.activityId
        })
        if (res.code === 200) {
          uni.showToast({
            title: '取消成功',
            icon: 'success'
          })
          this.hasJoined = false
          this.activity.currentParticipants = Math.max((this.activity.currentParticipants || 1) - 1, 0)
        }
      } catch (error) {
        if (error.errMsg !== 'showModal:fail cancel') {
          console.error('取消报名失败:', error)
          uni.showToast({
            title: error.message || '取消失败',
            icon: 'none'
          })
        }
      }
    },
    formatTime(timeString) {
      if (!timeString) return ''
      const date = new Date(timeString)
      const year = date.getFullYear()
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const day = date.getDate().toString().padStart(2, '0')
      const hour = date.getHours().toString().padStart(2, '0')
      const minute = date.getMinutes().toString().padStart(2, '0')
      return `${year}-${month}-${day} ${hour}:${minute}`
    },
    getStatusText(status) {
      const texts = { 0: '已结束', 1: '进行中', 2: '未开始' }
      return texts[status] || '未知'
    }
  }
}
</script>

<style scoped>
.activity-detail-container {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.loading, .error {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  color: #999;
  font-size: 28rpx;
}

.content {
  height: 100vh;
  padding-bottom: 120rpx;
}

.activity-cover {
  width: 100%;
  height: 400rpx;
}

.activity-header {
  padding: 30rpx;
  background-color: white;
  border-bottom: 1rpx solid #f0f0f0;
}

.activity-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 16rpx;
}

.activity-type {
  font-size: 26rpx;
  color: #666;
  display: block;
}

.activity-info {
  padding: 30rpx;
  background-color: white;
  margin-top: 20rpx;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 28rpx;
  color: #666;
}

.info-value {
  font-size: 28rpx;
  color: #333;
  text-align: right;
  flex: 1;
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

.activity-description {
  padding: 30rpx;
  background-color: white;
  margin-top: 20rpx;
}

.section-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 20rpx;
}

.description-text {
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
  display: block;
}

.action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20rpx 30rpx;
  background-color: white;
  box-shadow: 0 -2rpx 12rpx rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 20rpx;
}

.join-btn {
  flex: 1;
  height: 88rpx;
  line-height: 88rpx;
  border-radius: 44rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 32rpx;
  border: none;
}

.join-btn.joined {
  background-color: #f0f0f0;
  color: #999;
}

.join-btn[disabled] {
  opacity: 0.6;
}

.cancel-btn {
  width: 200rpx;
  height: 88rpx;
  line-height: 88rpx;
  border-radius: 44rpx;
  background-color: white;
  color: #f56c6c;
  font-size: 28rpx;
  border: 1rpx solid #f56c6c;
}
</style>
