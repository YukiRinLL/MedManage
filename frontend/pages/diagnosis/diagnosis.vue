<template>
  <view class="diagnosis-container">
    <view class="page-header">
      <text class="page-title">诊断信息</text>
    </view>

    <view class="diagnosis-list" v-if="diagnoses.length > 0">
      <view class="diagnosis-item" v-for="(item, index) in diagnoses" :key="item.id">
        <view class="diagnosis-header">
          <text class="diagnosis-name">{{ item.diseName }}</text>
          <text class="diagnosis-sort">排序: {{ item.sort }}</text>
        </view>
        <view class="diagnosis-info" v-if="item.diseCode">
          <text class="info-label">疾病编码: </text>
          <text class="info-value">{{ item.diseCode }}</text>
        </view>
      </view>
    </view>

    <view v-else class="empty-state">
      <text class="empty-text">暂无诊断信息</text>
    </view>
  </view>
</template>

<script>
import { getDiagnosesByUserId } from '../../api/diagnosis'

export default {
  data() {
    return {
      diagnoses: []
    }
  },
  onLoad() {
    this.fetchDiagnoses()
  },
  methods: {
    async fetchDiagnoses() {
      try {
        const userId = uni.getStorageSync('userId')
        if (!userId) {
          uni.showToast({
            title: '用户未登录',
            icon: 'none'
          })
          return
        }

        const response = await getDiagnosesByUserId(userId)
        if (response.code === 200) {
          this.diagnoses = response.data || []
          // 按排序号排序
          this.diagnoses.sort((a, b) => a.sort - b.sort)
        }
      } catch (error) {
        console.error('获取诊断信息失败:', error)
        uni.showToast({
          title: '获取诊断信息失败',
          icon: 'none'
        })
      }
    }
  }
}
</script>

<style scoped>
.diagnosis-container {
  padding: 20rpx;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.page-header {
  padding: 20rpx 0;
  margin-bottom: 20rpx;
  border-bottom: 1rpx solid #e8e8e8;
}

.page-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.diagnosis-list {
  background-color: #fff;
  border-radius: 12rpx;
  padding: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.diagnosis-item {
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.diagnosis-item:last-child {
  border-bottom: none;
}

.diagnosis-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10rpx;
}

.diagnosis-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

.diagnosis-sort {
  font-size: 24rpx;
  color: #999;
  background-color: #f0f0f0;
  padding: 4rpx 12rpx;
  border-radius: 16rpx;
}

.diagnosis-info {
  display: flex;
  align-items: center;
  font-size: 24rpx;
  color: #666;
}

.info-label {
  margin-right: 8rpx;
}

.empty-state {
  background-color: #fff;
  border-radius: 12rpx;
  padding: 80rpx 0;
  text-align: center;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.empty-text {
  font-size: 28rpx;
  color: #999;
}
</style>
