<template>
  <view class="service-container">
    <view class="section-header animate-fade-in">
      <view class="header-bg"></view>
      <view class="header-content">
        <text class="section-title">服务中心</text>
        <text class="section-desc">医疗服务与保障</text>
      </view>
    </view>
    
    <view class="menu-grid">
      <view 
        class="menu-item animate-fade-in-up" 
        :style="{ animationDelay: '0.1s' }"
        @click="handleItemClick('/pages/insurance/insurance', '参保信息')"
      >
        <view class="menu-icon-wrapper bg-orange">
          <image src="/static/icons/png/filled/objects/credit_card@2x.png" class="menu-icon-img" mode="aspectFit" />
        </view>
        <text class="menu-text">参保信息</text>
        <text class="menu-hint">查询医保参保状态</text>
      </view>
      
      <view 
        class="menu-item animate-fade-in-up" 
        :style="{ animationDelay: '0.15s' }"
        @click="handleItemClick('/pages/schedule/schedule', '透析排班')"
      >
        <view class="menu-icon-wrapper bg-cyan">
          <image src="/static/icons/png/filled/objects/calendar@2x.png" class="menu-icon-img" mode="aspectFit" />
        </view>
        <text class="menu-text">透析排班</text>
        <text class="menu-hint">查看透析安排时间</text>
      </view>
      
      <view 
        class="menu-item animate-fade-in-up" 
        :style="{ animationDelay: '0.2s' }"
        @click="handleItemClick('/pages/health-education/health-education', '科普宣教')"
      >
        <view class="menu-icon-wrapper bg-green">
          <image src="/static/icons/png/filled/objects/book@2x.png" class="menu-icon-img" mode="aspectFit" />
        </view>
        <text class="menu-text">科普宣教</text>
        <text class="menu-hint">健康知识学习</text>
      </view>
    </view>
    
    <view class="service-info animate-fade-in" :style="{ animationDelay: '0.25s' }">
      <view class="info-card">
        <image src="/static/icons/png/filled/objects/phone@2x.png" class="info-icon" mode="aspectFit" />
        <view class="info-content">
          <text class="info-title">服务热线</text>
          <text class="info-value">400-888-8888</text>
        </view>
      </view>
      <view class="info-card">
        <image src="/static/icons/png/filled/objects/clock@2x.png" class="info-icon" mode="aspectFit" />
        <view class="info-content">
          <text class="info-title">服务时间</text>
          <text class="info-value">周一至周日 8:00-20:00</text>
        </view>
      </view>
      <view class="info-card">
        <image src="/static/icons/png/filled/symbols/geo_location@2x.png" class="info-icon" mode="aspectFit" />
        <view class="info-content">
          <text class="info-title">机构地址</text>
          <text class="info-value">北京市朝阳区健康路88号</text>
        </view>
      </view>
    </view>

    <view class="medical-staff-section animate-fade-in" :style="{ animationDelay: '0.3s' }">
      <view class="section-title-wrap">
        <image src="/static/icons/png/filled/people/nurse@2x.png" class="section-icon" mode="aspectFit" />
        <text class="section-label">专属医护团队</text>
      </view>
      
      <view class="staff-list">
        <view class="staff-card" v-if="nurse">
          <view class="staff-avatar">
            <image src="/static/icons/png/filled/people/nurse@2x.png" class="avatar-icon" mode="aspectFit" />
          </view>
          <view class="staff-info">
            <text class="staff-name">{{ nurse.name }}</text>
            <text class="staff-position">责任护士</text>
            <text class="staff-department">{{ nurse.department }}</text>
          </view>
          <view class="staff-action" @click="callStaff(nurse.phone)">
            <image src="/static/icons/png/filled/objects/phone@2x.png" class="action-icon" mode="aspectFit" />
            <text class="action-text">联系</text>
          </view>
        </view>
        
        <view class="staff-card" v-if="doctor">
          <view class="staff-avatar">
            <image src="/static/icons/png/filled/people/doctor.png" class="avatar-icon" mode="aspectFit" />
          </view>
          <view class="staff-info">
            <text class="staff-name">{{ doctor.name }}</text>
            <text class="staff-position">主治医生</text>
            <text class="staff-department">{{ doctor.department }}</text>
          </view>
          <view class="staff-action" @click="callStaff(doctor.phone)">
            <image src="/static/icons/png/filled/objects/phone@2x.png" class="action-icon" mode="aspectFit" />
            <text class="action-text">联系</text>
          </view>
        </view>
        
        <view class="staff-card empty-staff" v-if="!nurse && !doctor">
          <image src="/static/icons/png/filled/people/people@2x.png" class="empty-icon" mode="aspectFit" />
          <text class="empty-text">暂无专属医护人员</text>
        </view>
      </view>
    </view>
    
    <view class="bottom-space"></view>
  </view>
</template>

<script>
import { get } from '../../utils/request.js'

export default {
  data() {
    return {
      isNavigating: false,
      nurse: null,
      doctor: null
    }
  },
  onLoad() {
    this.fetchMedicalStaff()
  },
  methods: {
    async fetchMedicalStaff() {
      try {
        const userId = uni.getStorageSync('userId')
        const nurseRes = await get(`/medical-staff/patient/${userId}/nurse`)
        const doctorRes = await get(`/medical-staff/patient/${userId}/doctor`)
        
        if (nurseRes.code === 200) {
          this.nurse = nurseRes.data
        }
        if (doctorRes.code === 200) {
          this.doctor = doctorRes.data
        }
      } catch (err) {
        console.log(err)
      }
    },
    handleItemClick(url, title) {
      if (this.isNavigating) return
      this.isNavigating = true
      
      uni.vibrateShort({})
      
      uni.navigateTo({ 
        url,
        success: () => {
          setTimeout(() => {
            this.isNavigating = false
          }, 300)
        },
        fail: () => {
          this.isNavigating = false
        }
      })
    },
    callStaff(phone) {
      if (phone) {
        uni.makePhoneCall({
          phoneNumber: phone,
          fail: () => {
            uni.showToast({
              title: '拨号失败',
              icon: 'none'
            })
          }
        })
      } else {
        uni.showToast({
          title: '暂无联系电话',
          icon: 'none'
        })
      }
    }
  }
}
</script>

<style scoped>
.service-container {
  padding: 0;
  min-height: 100vh;
  background-color: #F5F7FA;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.4s ease-out both;
}

.animate-fade-in-up {
  animation: fadeInUp 0.4s ease-out both;
}

.section-header {
  padding: 30px 20px 20px;
  background-color: #009D85;
  color: #FFFFFF;
}

.section-title {
  display: block;
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
  letter-spacing: 2px;
}

.section-desc {
  display: block;
  font-size: 15px;
  opacity: 0.9;
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  padding: 20px 16px;
}

.menu-item {
  background-color: #FFFFFF;
  padding: 28px 16px;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.menu-item:active {
  transform: scale(0.96);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.menu-icon-wrapper {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 14px;
  transition: all 0.25s ease;
}

.menu-item:active .menu-icon-wrapper {
  transform: scale(1.1);
}

.bg-orange {
  background-color: rgba(250, 173, 20, 0.1);
}

.bg-orange .menu-icon-img {
  filter: brightness(0) saturate(100%) invert(64%) sepia(56%) saturate(694%) hue-rotate(356deg) brightness(103%) contrast(101%);
}

.bg-cyan {
  background-color: rgba(14, 165, 233, 0.1);
}

.bg-cyan .menu-icon-img {
  filter: brightness(0) saturate(100%) invert(46%) sepia(92%) saturate(1833%) hue-rotate(197deg) brightness(101%) contrast(103%);
}

.bg-green {
  background-color: rgba(0, 157, 133, 0.1);
}

.bg-green .menu-icon-img {
  filter: brightness(0) saturate(100%) invert(42%) sepia(93%) saturate(389%) hue-rotate(131deg) brightness(93%) contrast(94%);
}

.menu-icon {
  font-size: 36px;
}

.menu-icon-img {
  width: 36px;
  height: 36px;
}

.menu-text {
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 6px;
}

.menu-hint {
  display: block;
  font-size: 12px;
  color: #909399;
}

.service-info {
  padding: 0 16px;
}

.info-card {
  display: flex;
  align-items: center;
  background-color: #FFFFFF;
  padding: 16px 20px;
  border-radius: 12px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease;
}

.info-card:active {
  background-color: #F5F7FA;
}

.info-icon {
  width: 28px;
  height: 28px;
  margin-right: 16px;
}

.info-content {
  flex: 1;
}

.info-title {
  display: block;
  font-size: 14px;
  color: #909399;
  margin-bottom: 4px;
}

.info-value {
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.medical-staff-section {
  padding: 16px;
  margin-top: 12px;
}

.section-title-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.section-icon {
  width: 20px;
  height: 20px;
}

.section-label {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.staff-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.staff-card {
  display: flex;
  align-items: center;
  background-color: #FFFFFF;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.staff-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(0, 157, 133, 0.2) 0%, rgba(0, 157, 133, 0.05) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
}

.avatar-icon {
  width: 28px;
  height: 28px;
}

.staff-info {
  flex: 1;
}

.staff-name {
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}

.staff-position {
  display: block;
  font-size: 14px;
  color: #009D85;
  margin-bottom: 2px;
}

.staff-department {
  font-size: 13px;
  color: #909399;
}

.staff-action {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 16px;
  background-color: rgba(0, 157, 133, 0.1);
  border-radius: 8px;
}

.action-icon {
  width: 18px;
  height: 18px;
  margin-bottom: 2px;
}

.action-text {
  font-size: 12px;
  color: #009D85;
}

.empty-staff {
  justify-content: center;
  padding: 30px;
}

.empty-icon {
  width: 36px;
  height: 36px;
  margin-right: 12px;
}

.empty-text {
  font-size: 14px;
  color: #909399;
}

.bottom-space {
  height: 100px;
}
</style>