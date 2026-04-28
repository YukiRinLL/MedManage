<template>
  <view class="schedule-container">
    <view class="page-title">透析排班</view>
    
    <view class="filter-bar">
      <picker mode="selector" :range="weekOptions" @change="onWeekChange" :value="selectedWeekIndex">
        <view class="picker-item">
          <text>{{ weekOptions[selectedWeekIndex] }}</text>
          <text class="arrow">▼</text>
        </view>
      </picker>
      
      <picker mode="date" @change="onDateChange" :value="selectedDate">
        <view class="picker-item">
          <text>{{ selectedDate || '选择日期' }}</text>
          <text class="arrow">▼</text>
        </view>
      </picker>
    </view>
    
    <view class="schedule-list" v-if="scheduleList.length > 0">
      <view class="schedule-item" v-for="(item, index) in scheduleList" :key="index">
        <view class="schedule-header">
          <text class="patient-name">{{ item.name }}</text>
          <text class="patient-number">{{ item.number }}</text>
        </view>
        
        <view class="schedule-info">
          <view class="info-row">
            <text class="label">透析方式：</text>
            <text class="value">{{ item.txTxfsAlias || '-' }}</text>
          </view>
          
          <view class="info-row">
            <text class="label">透析器：</text>
            <text class="value">{{ item.txTxq || '-' }}</text>
          </view>
          
          <view class="info-row">
            <text class="label">血管通路：</text>
            <text class="value">{{ item.txXgtlId || '-' }}</text>
          </view>
          
          <view class="info-row">
            <text class="label">排班日期：</text>
            <text class="value">{{ item.txPdrq || '-' }}</text>
          </view>
          
          <view class="info-row">
            <text class="label">班次：</text>
            <text class="value">{{ getShiftText(item.txPdrqType) }}</text>
          </view>
          
          <view class="info-row">
            <text class="label">状态：</text>
            <text class="value" :class="getStatusClass(item.txStatus)">{{ getStatusText(item.txStatus) }}</text>
          </view>
          
          <view class="info-row" v-if="item.txComment">
            <text class="label">备注：</text>
            <text class="value">{{ item.txComment }}</text>
          </view>
        </view>
      </view>
    </view>
    
    <view class="empty-state" v-else>
      <text class="empty-text">暂无排班数据</text>
    </view>
    
    <view class="loading" v-if="loading">
      <text>加载中...</text>
    </view>
  </view>
</template>

<script>
import request from '@/utils/request.js'

export default {
  data() {
    return {
      scheduleList: [],
      weekOptions: ['全部', '周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      selectedWeekIndex: 0,
      selectedDate: '',
      loading: false
    }
  },
  
  onLoad() {
    this.fetchScheduleList()
  },
  
  onShow() {
    this.fetchScheduleList()
  },
  
  methods: {
    async fetchScheduleList() {
      this.loading = true
      try {
        let url = '/api/dialysis-schedule/list'
        
        if (this.selectedWeekIndex > 0) {
          url = `/api/dialysis-schedule/week/${this.selectedWeekIndex}`
        } else if (this.selectedDate) {
          url = `/api/dialysis-schedule/date/${this.selectedDate}`
        }
        
        const response = await request.get(url)
        
        if (response.code === 200) {
          this.scheduleList = response.data || []
        } else {
          uni.showToast({
            title: response.message || '获取排班数据失败',
            icon: 'none'
          })
        }
      } catch (error) {
        console.error('获取排班数据失败:', error)
        uni.showToast({
          title: '获取排班数据失败',
          icon: 'none'
        })
      } finally {
        this.loading = false
      }
    },
    
    onWeekChange(e) {
      this.selectedWeekIndex = parseInt(e.detail.value)
      this.fetchScheduleList()
    },
    
    onDateChange(e) {
      this.selectedDate = e.detail.value
      this.fetchScheduleList()
    },
    
    getShiftText(type) {
      const shiftMap = {
        0: '早班',
        1: '中班',
        2: '晚班'
      }
      return shiftMap[type] || '-'
    },
    
    getStatusText(status) {
      const statusMap = {
        1: '正常',
        2: '暂停',
        0: '取消'
      }
      return statusMap[status] || '未知'
    },
    
    getStatusClass(status) {
      const classMap = {
        1: 'status-normal',
        2: 'status-paused',
        0: 'status-cancelled'
      }
      return classMap[status] || ''
    }
  }
}
</script>

<style scoped>
.schedule-container {
  min-height: 100vh;
  background-color: #F5F7FA;
  padding-bottom: 20rpx;
}

.page-title {
  font-size: 36rpx;
  font-weight: bold;
  text-align: center;
  padding: 30rpx 0;
  background-color: #FFFFFF;
  color: #303133;
}

.filter-bar {
  display: flex;
  justify-content: space-between;
  padding: 20rpx;
  background-color: #FFFFFF;
  margin-bottom: 20rpx;
}

.picker-item {
  display: flex;
  align-items: center;
  padding: 15rpx 30rpx;
  background-color: #F5F7FA;
  border-radius: 8rpx;
  font-size: 28rpx;
  color: #606266;
}

.arrow {
  margin-left: 10rpx;
  font-size: 20rpx;
}

.schedule-list {
  padding: 0 20rpx;
}

.schedule-item {
  background-color: #FFFFFF;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.schedule-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid #EBEEF5;
  margin-bottom: 20rpx;
}

.patient-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #303133;
}

.patient-number {
  font-size: 24rpx;
  color: #909399;
}

.schedule-info {
  display: flex;
  flex-direction: column;
  gap: 15rpx;
}

.info-row {
  display: flex;
  align-items: center;
  font-size: 28rpx;
}

.label {
  color: #909399;
  min-width: 150rpx;
}

.value {
  color: #606266;
  flex: 1;
}

.status-normal {
  color: #67C23A;
}

.status-paused {
  color: #E6A23C;
}

.status-cancelled {
  color: #F56C6C;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 100rpx 0;
}

.empty-text {
  font-size: 28rpx;
  color: #909399;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 50rpx 0;
  color: #909399;
}
</style>