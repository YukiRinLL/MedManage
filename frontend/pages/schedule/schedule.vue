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
    
    <view class="schedule-list" v-if="filteredList.length > 0">
      <view class="schedule-item" v-for="(item, index) in filteredList" :key="index" @click="openRatingModal(item)">
        <view class="schedule-header">
          <text class="patient-name">{{ item.name }}</text>
          <text class="patient-number">{{ item.number }}</text>
        </view>
        
        <view class="schedule-info">
          <view class="info-row">
            <text class="label">透析方式：</text>
            <text class="value">{{ item.txTxfsAlias }}</text>
          </view>
          
          <view class="info-row">
            <text class="label">透析器：</text>
            <text class="value">{{ item.txTxq }}</text>
          </view>
          
          <view class="info-row">
            <text class="label">血管通路：</text>
            <text class="value">{{ item.txXgtlId }}</text>
          </view>
          
          <view class="info-row">
            <text class="label">排班日期：</text>
            <text class="value">{{ item.txPdrq }}</text>
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
        
        <view class="schedule-footer">
          <text class="rate-hint">点击进行评分评价</text>
          <text class="arrow-right">›</text>
        </view>
      </view>
    </view>
    
    <view class="empty-state" v-else>
      <text class="empty-text">暂无排班数据</text>
    </view>
    
    <view class="rating-modal" v-if="showRatingModal" @click.self="closeRatingModal">
      <view class="rating-content">
        <view class="rating-header">
          <text class="rating-title">透析服务评价</text>
          <text class="rating-close" @click="closeRatingModal">×</text>
        </view>
        
        <view class="rating-body">
          <view class="rating-info">
            <text class="rating-name">{{ currentItem.name }}</text>
            <text class="rating-date">{{ currentItem.txPdrq }} · {{ getShiftText(currentItem.txPdrqType) }}</text>
          </view>
          
          <view class="rating-item">
            <text class="rating-label">整体评分</text>
            <view class="star-rating">
              <text 
                v-for="i in 5" 
                :key="i" 
                class="star" 
                :class="{ active: rating >= i }"
                @click="rating = i"
              >★</text>
            </view>
          </view>
          
          <view class="rating-item">
            <text class="rating-label">医护态度</text>
            <view class="star-rating">
              <text 
                v-for="i in 5" 
                :key="i" 
                class="star" 
                :class="{ active: nurseRating >= i }"
                @click="nurseRating = i"
              >★</text>
            </view>
          </view>
          
          <view class="rating-item">
            <text class="rating-label">透析环境</text>
            <view class="star-rating">
              <text 
                v-for="i in 5" 
                :key="i" 
                class="star" 
                :class="{ active: envRating >= i }"
                @click="envRating = i"
              >★</text>
            </view>
          </view>
          
          <view class="rating-item">
            <text class="rating-label">设备状况</text>
            <view class="star-rating">
              <text 
                v-for="i in 5" 
                :key="i" 
                class="star" 
                :class="{ active: equipRating >= i }"
                @click="equipRating = i"
              >★</text>
            </view>
          </view>
          
          <view class="rating-item-textarea">
            <text class="rating-label">评价内容</text>
            <textarea 
              class="rating-textarea" 
              v-model="comment" 
              placeholder="请输入您的评价和建议..."
              maxlength="200"
            />
          </view>
        </view>
        
        <view class="rating-footer">
          <button class="btn-cancel" @click="closeRatingModal">取消</button>
          <button class="btn-submit" @click="submitRating">提交评价</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      scheduleList: [
        {
          name: '罗璨雨',
          number: '13032302510',
          txTxfsAlias: '血液透析',
          txTxq: 'FX60 聚砜膜',
          txXgtlId: '左前臂内瘘',
          txPdrq: '2026-07-29',
          txPdrqType: 0,
          txStatus: 1,
          txComment: '透析器凝血风险较高，需密切监测'
        },
        {
          name: '罗璨雨',
          number: '13032302510',
          txTxfsAlias: '血液透析滤过',
          txTxq: 'FX80 聚砜膜',
          txXgtlId: '左前臂内瘘',
          txPdrq: '2026-08-01',
          txPdrqType: 1,
          txStatus: 1,
          txComment: '高通量透析，关注电解质平衡'
        },
        {
          name: '罗璨雨',
          number: '13032302510',
          txTxfsAlias: '血液透析',
          txTxq: 'FX60 聚砜膜',
          txXgtlId: '左前臂内瘘',
          txPdrq: '2026-08-03',
          txPdrqType: 2,
          txStatus: 2,
          txComment: '临时调整时间，因医生会诊'
        },
        {
          name: '罗璨雨',
          number: '13032302510',
          txTxfsAlias: '血液透析',
          txTxq: 'APS-650 聚丙烯腈',
          txXgtlId: '左前臂内瘘',
          txPdrq: '2026-08-06',
          txPdrqType: 0,
          txStatus: 1,
          txComment: '常规透析，干体重监测'
        }
      ],
      weekOptions: ['全部', '周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      selectedWeekIndex: 0,
      selectedDate: '',
      showRatingModal: false,
      currentItem: null,
      rating: 0,
      nurseRating: 0,
      envRating: 0,
      equipRating: 0,
      comment: ''
    }
  },
  
  computed: {
    filteredList() {
      return this.scheduleList.filter(item => {
        if (this.selectedDate) {
          return item.txPdrq === this.selectedDate
        }
        if (this.selectedWeekIndex > 0) {
          const date = new Date(item.txPdrq)
          const dayOfWeek = date.getDay()
          const weekMap = { 0: 7, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6 }
          return weekMap[dayOfWeek] === this.selectedWeekIndex
        }
        return true
      })
    }
  },
  
  methods: {
    onWeekChange(e) {
      this.selectedWeekIndex = parseInt(e.detail.value)
    },
    
    onDateChange(e) {
      this.selectedDate = e.detail.value
    },
    
    getShiftText(type) {
      const shiftMap = {
        0: '早班 (08:00-12:00)',
        1: '中班 (14:00-18:00)',
        2: '晚班 (19:00-23:00)'
      }
      return shiftMap[type] || '-'
    },
    
    getStatusText(status) {
      const statusMap = {
        1: '已确认',
        2: '待确认',
        0: '已取消'
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
    },
    
    openRatingModal(item) {
      this.currentItem = item
      this.showRatingModal = true
      this.rating = 0
      this.nurseRating = 0
      this.envRating = 0
      this.equipRating = 0
      this.comment = ''
    },
    
    closeRatingModal() {
      this.showRatingModal = false
      this.currentItem = null
    },
    
    submitRating() {
      if (this.rating === 0) {
        uni.showToast({
          title: '请至少选择一项评分',
          icon: 'none'
        })
        return
      }
      
      uni.showModal({
        title: '提交评价',
        content: `您的综合评分：${this.rating}星\n医护态度：${this.nurseRating}星\n透析环境：${this.envRating}星\n设备状况：${this.equipRating}星`,
        confirmText: '确认提交',
        cancelText: '再想想',
        success: (res) => {
          if (res.confirm) {
            uni.showToast({
              title: '评价提交成功',
              icon: 'success'
            })
            this.closeRatingModal()
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.schedule-container {
  min-height: 100vh;
  background-color: #F5F7FA;
  padding-bottom: 40px;
}

.page-title {
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  padding: 15px 0;
  background-color: #FFFFFF;
  color: #303133;
}

.filter-bar {
  display: flex;
  justify-content: space-between;
  padding: 12px 16px;
  background-color: #FFFFFF;
  margin-bottom: 12px;
  gap: 12px;
}

.picker-item {
  display: flex;
  align-items: center;
  padding: 10px 14px;
  background-color: #F5F7FA;
  border-radius: 8px;
  font-size: 14px;
  color: #606266;
  flex: 1;
  justify-content: space-between;
}

.arrow {
  margin-left: 8px;
  font-size: 10px;
}

.schedule-list {
  padding: 0 16px;
}

.schedule-item {
  background-color: #FFFFFF;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.schedule-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
  border-bottom: 1px solid #EBEEF5;
  margin-bottom: 10px;
}

.patient-name {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
}

.patient-number {
  font-size: 12px;
  color: #909399;
}

.schedule-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.info-row {
  display: flex;
  align-items: center;
  font-size: 13px;
}

.label {
  color: #909399;
  min-width: 85px;
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

.schedule-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px solid #EBEEF5;
}

.rate-hint {
  font-size: 13px;
  color: #009D85;
}

.arrow-right {
  font-size: 18px;
  color: #C0C4CC;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 80px 0;
}

.empty-text {
  font-size: 14px;
  color: #909399;
}

.rating-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.rating-content {
  background-color: #FFFFFF;
  border-radius: 16px;
  width: 100%;
  max-width: 340px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.rating-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #EBEEF5;
}

.rating-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.rating-close {
  font-size: 24px;
  color: #909399;
  line-height: 1;
  padding: 0 8px;
}

.rating-body {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
}

.rating-info {
  margin-bottom: 16px;
}

.rating-name {
  display: block;
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}

.rating-date {
  font-size: 13px;
  color: #909399;
}

.rating-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.rating-label {
  font-size: 14px;
  color: #606266;
}

.star-rating {
  display: flex;
  gap: 4px;
}

.star {
  font-size: 22px;
  color: #DCDFE6;
  cursor: pointer;
}

.star.active {
  color: #FFB800;
}

.rating-item-textarea {
  margin-top: 12px;
}

.rating-textarea {
  width: 100%;
  height: 80px;
  padding: 10px;
  border: 1px solid #EBEEF5;
  border-radius: 8px;
  font-size: 14px;
  margin-top: 8px;
  box-sizing: border-box;
}

.rating-footer {
  display: flex;
  gap: 10px;
  padding: 16px;
  border-top: 1px solid #EBEEF5;
}

.btn-cancel {
  flex: 1;
  padding: 10px;
  background-color: #F5F7FA;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  color: #606266;
}

.btn-submit {
  flex: 1;
  padding: 10px;
  background-color: #009D85;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  color: #FFFFFF;
}
</style>
