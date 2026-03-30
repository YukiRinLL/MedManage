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
          :disabled="hasJoined || activity.status === 0"
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
import { getImageUrl } from '@/utils/request'

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
          this.activity = {
            ...res.data,
            coverImage: getImageUrl(res.data.coverImage)
          }
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
      
      if (this.activity.status === 0) {
        uni.showToast({
          title: '活动已结束',
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
          content: '确定要取消报名吗？',
          confirmText: '确定',
          confirmColor: '#009D85',
          cancelText: '再想想',
          cancelColor: '#909399'
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
  background-color: #F5F7FA;
}

.loading, .error {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  color: #909399;
  font-size: 28rpx;
}

.content {
  height: 100vh;
  padding-bottom: 140rpx;
}

.activity-cover {
  width: 100%;
  height: 400rpx;
}

.activity-header {
  padding: 32rpx;
  background-color: white;
  border-bottom: 1rpx solid #EBEEF5;
}

.activity-title {
  font-size: 38rpx;
  font-weight: 600;
  color: #303133;
  display: block;
  margin-bottom: 16rpx;
}

.activity-type {
  font-size: 26rpx;
  color: #009D85;
  display: inline-block;
  padding: 6rpx 20rpx;
  background-color: rgba(0, 157, 133, 0.1);
  border-radius: 10rpx;
}

.activity-info {
  padding: 32rpx;
  background-color: white;
  margin-top: 20rpx;
  border-radius: 16rpx;
  margin-left: 20rpx;
  margin-right: 20rpx;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 0;
  border-bottom: 1rpx solid #F2F6FC;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 28rpx;
  color: #606266;
  font-weight: 500;
}

.info-value {
  font-size: 28rpx;
  color: #303133;
  text-align: right;
}

.info-value.status-tag {
  display: inline-block;
  padding: 8rpx 24rpx;
  border-radius: 24rpx;
  font-size: 24rpx;
  font-weight: 500;
  flex: none;
}

.status-0 {
  background-color: #F0F0F0;
  color: #909399;
}

.status-1 {
  background-color: rgba(0, 157, 133, 0.1);
  color: #009D85;
}

.status-2 {
  background-color: rgba(0, 157, 133, 0.1);
  color: #009D85;
}

.activity-description {
  padding: 32rpx;
  background-color: white;
  margin-top: 20rpx;
  border-radius: 16rpx;
  margin-left: 20rpx;
  margin-right: 20rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #303133;
  display: block;
  margin-bottom: 20rpx;
  padding-bottom: 16rpx;
  border-bottom: 2rpx solid #009D85;
}

.description-text {
  font-size: 28rpx;
  color: #606266;
  line-height: 1.8;
  display: block;
}

.action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 24rpx 32rpx;
  background-color: white;
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.08);
  display: flex;
  gap: 20rpx;
}

.join-btn {
  flex: 1;
  height: 88rpx;
  line-height: 88rpx;
  border-radius: 8rpx;
  background-color: #009D85;
  color: white;
  font-size: 32rpx;
  font-weight: 500;
  border: none;
}

.join-btn:active {
  background-color: #007D6B;
}

.join-btn.joined {
  background-color: #F0F0F0;
  color: #909399;
}

.join-btn[disabled] {
  opacity: 0.6;
}

.cancel-btn {
  width: 200rpx;
  height: 88rpx;
  line-height: 88rpx;
  border-radius: 8rpx;
  background-color: white;
  color: #F56C6C;
  font-size: 28rpx;
  border: 2rpx solid #F56C6C;
  font-weight: 500;
}

.cancel-btn:active {
  background-color: #FEF0F0;
}
</style>
