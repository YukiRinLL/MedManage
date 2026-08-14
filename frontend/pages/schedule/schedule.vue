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
            <text class="rating-label">穿刺技术</text>
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
import request from '@/utils/request.js'

export default {
  data() {
    return {
      scheduleList: [],
      weekOptions: ['全部', '周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      selectedWeekIndex: 0,
      selectedDate: '',
      showRatingModal: false,
      currentItem: null,
      rating: 0,
      nurseRating: 0,
      envRating: 0,
      equipRating: 0,
      comment: '',
      ratedSchedules: []
    }
  },
  
  onLoad() {
    this.fetchScheduleList()
  },
  
  onShow() {
    this.fetchScheduleList()
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
    async fetchScheduleList() {
      try {
        const user = uni.getStorageSync('user')
        let userId = ''
        if (user) {
          try {
            const parsed = typeof user === 'string' ? JSON.parse(user) : user
            userId = parsed.id
          } catch (e) {}
        }
        
        let url = '/dialysis-schedule/list'
        if (this.selectedWeekIndex > 0) {
          url = `/dialysis-schedule/week/${this.selectedWeekIndex}`
        } else if (this.selectedDate) {
          url = `/dialysis-schedule/date/${this.selectedDate}`
        } else if (userId) {
          url = `/dialysis-schedule/user/${userId}`
        }
        
        const response = await request.get(url)
        
        if (response.code === 200) {
          let data = response.data
          if (data && data.content) {
            data = data.content
          } else if (data && Array.isArray(data)) {
            // already an array
          } else if (data && data.list) {
            data = data.list
          }
          
          this.scheduleList = Array.isArray(data) && data.length > 0 ? data.map(item => ({
            ...item,
            name: item.name || item.patientName || '',
            number: item.number || item.phone || '',
            txTxfsAlias: item.txTxfsAlias || (item.txTxfsId ? '血液透析' : '-'),
            txTxq: item.txTxq || '-',
            txXgtlId: item.txXgtlId || '-',
            txPdrq: item.txPdrq || '',
            txPdrqType: item.txPdrqType ?? 0,
            txStatus: item.txStatus ?? 1,
            txComment: item.txComment || '',
            id: item.id
          })) : this.getMockData()
          
          if (userId) {
            this.fetchRatedStatus(userId)
          }
        } else {
          this.scheduleList = this.getMockData()
        }
      } catch (error) {
        console.error('获取排班数据失败:', error)
        this.scheduleList = this.getMockData()
      }
    },
    
    getMockData() {
      const today = new Date()
      const formatDate = (d) => {
        const y = d.getFullYear()
        const m = String(d.getMonth() + 1).padStart(2, '0')
        const day = String(d.getDate()).padStart(2, '0')
        return `${y}-${m}-${day}`
      }
      const tomorrow = new Date(today)
      tomorrow.setDate(today.getDate() + 1)
      const dayAfter = new Date(today)
      dayAfter.setDate(today.getDate() + 2)
      const yesterday = new Date(today)
      yesterday.setDate(today.getDate() - 1)
      
      return [
        {
          id: 1,
          name: '张三',
          number: 'HD20240001',
          txTxfsAlias: '血液透析',
          txTxq: 'FX80',
          txXgtlId: '动静脉内瘘',
          txPdrq: formatDate(today),
          txPdrqType: 0,
          txStatus: 1,
          txComment: '',
          txDeviceSequence: 'A1-01',
          zone: 'A1'
        },
        {
          id: 2,
          name: '李四',
          number: 'HD20240002',
          txTxfsAlias: '血液透析滤过',
          txTxq: 'FX100',
          txXgtlId: '中心静脉导管',
          txPdrq: formatDate(today),
          txPdrqType: 1,
          txStatus: 1,
          txComment: '首次透析',
          txDeviceSequence: 'A2-03',
          zone: 'A2'
        },
        {
          id: 3,
          name: '王五',
          number: 'HD20240003',
          txTxfsAlias: '血液透析',
          txTxq: 'FX60',
          txXgtlId: '动静脉内瘘',
          txPdrq: formatDate(tomorrow),
          txPdrqType: 0,
          txStatus: 2,
          txComment: '',
          txDeviceSequence: 'A1-05',
          zone: 'A1'
        },
        {
          id: 4,
          name: '赵六',
          number: 'HD20240004',
          txTxfsAlias: '血液灌流',
          txTxq: 'FX80',
          txXgtlId: '人工血管',
          txPdrq: formatDate(tomorrow),
          txPdrqType: 2,
          txStatus: 1,
          txComment: '注意血糖监测',
          txDeviceSequence: 'A3-02',
          zone: 'A3'
        },
        {
          id: 5,
          name: '孙七',
          number: 'HD20240005',
          txTxfsAlias: '血液透析',
          txTxq: 'FX100',
          txXgtlId: '动静脉内瘘',
          txPdrq: formatDate(dayAfter),
          txPdrqType: 1,
          txStatus: 1,
          txComment: '',
          txDeviceSequence: 'A2-01',
          zone: 'A2'
        },
        {
          id: 6,
          name: '周八',
          number: 'HD20240006',
          txTxfsAlias: '血液透析滤过',
          txTxq: 'FX80',
          txXgtlId: '中心静脉导管',
          txPdrq: formatDate(yesterday),
          txPdrqType: 0,
          txStatus: 0,
          txComment: '患者取消',
          txDeviceSequence: 'A1-03',
          zone: 'A1'
        }
      ]
    },
    
    async fetchRatedStatus(userId) {
      try {
        const response = await request.get(`/dialysis-schedule-rating/user/${userId}`)
        if (response.code === 200 && Array.isArray(response.data)) {
          this.ratedSchedules = response.data.map(r => r.scheduleId)
        }
      } catch (e) {}
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
    
    isRated(item) {
      return item.id && this.ratedSchedules.includes(item.id)
    },
    
    openRatingModal(item) {
      if (this.isRated(item)) {
        uni.showToast({
          title: '您已评价过该排班',
          icon: 'none'
        })
        return
      }
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
    
    async submitRating() {
      if (this.rating === 0) {
        uni.showToast({
          title: '请至少选择一项评分',
          icon: 'none'
        })
        return
      }
      
      const user = uni.getStorageSync('user')
      let userId = ''
      let userName = ''
      if (user) {
        try {
          const parsed = typeof user === 'string' ? JSON.parse(user) : user
          userId = parsed.id
          userName = parsed.name || ''
        } catch (e) {}
      }
      
      try {
        const response = await request.post('/dialysis-schedule-rating/create', {
          scheduleId: this.currentItem.id,
          userId: userId,
          userName: userName,
          overallRating: this.rating,
          nurseRating: this.nurseRating,
          envRating: this.envRating,
          equipRating: this.equipRating,
          comment: this.comment
        })
        
        if (response.code === 200) {
          uni.showToast({
            title: '评价提交成功',
            icon: 'success'
          })
          this.closeRatingModal()
          if (this.currentItem.id) {
            this.ratedSchedules.push(this.currentItem.id)
          }
        } else {
          uni.showToast({
            title: response.message || '提交失败',
            icon: 'none'
          })
        }
      } catch (error) {
        console.error('提交评价失败:', error)
        uni.showToast({
          title: '提交失败，请重试',
          icon: 'none'
        })
      }
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
