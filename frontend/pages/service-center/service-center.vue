<template>
  <view class="service-container">
    <!-- Top Background -->
    <view class="top-bg"></view>

    <!-- Sticky Top: Header -->
    <view class="sticky-top" :class="{ 'frost-visible': pageVisible }">
      <view class="status-bar">
        <view class="status-content">
          <image src="/static/design/home/图层 0 4.png" class="logo-layer-img" mode="aspectFit" />
          <text class="header-title">服务中心</text>
        </view>
      </view>
    </view>

    <!-- Main Content - fixed below header, no scroll -->
    <view class="main-content" :class="{ 'frost-visible': pageVisible }">
      <!-- Staff Section (top, styled like home tips-card) -->
      <view class="staff-card-section" style="transition-delay: 0.2s;">
        <!-- 磨砂半透明背板：覆盖标题与区域 -->
        <view class="staff-header-backplate"></view>
        <!-- 绿色头部 -->
        <view class="staff-green-header">
          <svg class="staff-header-svg" viewBox="0 0 342 85" preserveAspectRatio="none">
            <defs>
              <linearGradient id="staffGreenGrad" x1="1.5" y1="1" x2="0.5" y2="0">
                <stop offset="0%" stop-color="#77EACE" stop-opacity="0"/>
                <stop offset="35%" stop-color="#77EACE" stop-opacity="1"/>
                <stop offset="100%" stop-color="#19A280" stop-opacity="1"/>
              </linearGradient>
            </defs>
            <path d="
              M 0 18
              Q 0 0, 18 0
              L 153 0
              Q 162 0, 168 5
              Q 175 14, 183 22
              Q 188 28, 196 29
              L 324 29
              Q 342 29, 342 47
              L 342 77
              Q 342 85, 334 85
              L 8 85
              Q 0 85, 0 77
              Z" fill="url(#staffGreenGrad)"/>
          </svg>
          <text class="staff-header-title">您的专属医护</text>
          <!-- <text class="staff-header-subtitle">一对一专属照护</text> -->
        </view>
        <!-- 磨砂半透明托盘：放在绿色下方，部分重叠 -->
        <view class="staff-frosted-tray">
          <view class="staff-list">
            <view
              class="staff-item animate-pop-in"
              v-if="nurse && staffLoaded"
              :style="{ animationDelay: '0.05s' }"
            >
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

            <view
              class="staff-item animate-pop-in"
              v-if="doctor && staffLoaded"
              :style="{ animationDelay: '0.15s' }"
            >
              <view class="staff-avatar">
                <image src="/static/icons/png/filled/people/doctor.png" class="avatar-icon" mode="aspectFit" />
              </view>
              <view class="staff-info">
                <text class="staff-name">{{ doctor.name }}</text>
                <text class="staff-position">主治医生</text>
              </view>
              <view class="staff-action" @click="callStaff(doctor.phone)">
                <image src="/static/icons/png/filled/objects/phone@2x.png" class="action-icon" mode="aspectFit" />
                <text class="action-text">联系</text>
              </view>
            </view>

            <view class="staff-item empty-staff" v-if="staffLoaded && !nurse && !doctor">
              <image src="/static/icons/png/filled/people/people@2x.png" class="empty-icon" mode="aspectFit" />
              <text class="empty-text">暂无专属医护人员</text>
            </view>
          </view>
        </view>
      </view>

      <!-- Buttons Section (below staff, homepage style) -->
      <view class="service-buttons animate-fade-in" :style="{ animationDelay: '0.3s' }">
        <view class="sb-top-gradient"></view>
        <view
          class="feature-card feature-card-teal animate-fade-in-up"
          :style="{ animationDelay: '0.35s' }"
          @click="handleItemClick('/pages/schedule/schedule', '透析排班')"
        >
          <view class="feature-info">
            <text class="feature-title">透析排班查询</text>
            <text class="feature-desc">透析班次与出勤记录</text>
          </view>
          <image src="/static/icons/png/filled/objects/calendar@2x.png" class="feature-icon feature-icon-teal" mode="aspectFit" />
        </view>

        <view
          class="feature-card feature-card-blue animate-fade-in-up"
          :style="{ animationDelay: '0.4s' }"
          @click="showComingSoon('医疗专项申请')"
        >
          <view class="feature-info">
            <text class="feature-title">医疗服务申请</text>
            <text class="feature-desc">个人专项服务申请</text>
          </view>
          <image src="/static/icons/png/filled/symbols/rx@2x.png" class="feature-icon feature-icon-blue" mode="aspectFit" />
        </view>

        <view
          class="feature-card feature-card-purple animate-fade-in-up"
          :style="{ animationDelay: '0.45s' }"
          @click="handleItemClick('/pages/health-education/health-education', '健康知识库')"
        >
          <view class="feature-info">
            <text class="feature-title">健康知识库</text>
            <text class="feature-desc">饮食控水用药等健康科普</text>
          </view>
          <image src="/static/icons/png/filled/objects/book@2x.png" class="feature-icon feature-icon-purple" mode="aspectFit" />
        </view>

        <view
          class="feature-card feature-card-orange animate-fade-in-up"
          :style="{ animationDelay: '0.5s' }"
          @click="showFeedbackSheet"
        >
          <view class="feature-info">
            <text class="feature-title feature-title-long">评价与投诉</text>
            <text class="feature-desc">满意度评价与投诉建议</text>
          </view>
          <image src="/static/icons/png/filled/symbols/forum.png" class="feature-icon feature-icon-orange" mode="aspectFit" />
        </view>
      </view>
    </view>

    <!-- Hospital Detail Modal -->
    <view class="detail-modal" v-if="showDetail" @click="showDetail = false">
      <view class="detail-modal-content" @click.stop>
        <view class="detail-modal-header">
          <text class="detail-modal-title">医院简介</text>
          <text class="detail-modal-close" @click="showDetail = false">x</text>
        </view>
        <view class="detail-modal-body">
          <text class="detail-modal-text">重庆圣通尚诺医疗管理有限公司成立于2018年，专注于透析患者的综合管理服务。我们拥有专业的医疗团队和先进的透析设备，致力于为患者提供高质量的医疗服务和全方位的健康管理支持。</text>
          <text class="detail-modal-text">服务理念：以患者为中心，提供专业、温馨、便捷的医疗服务。</text>
          <text class="detail-modal-text">联系方式：400-888-8888</text>
        </view>
        <view class="detail-modal-footer">
          <text class="detail-modal-btn" @click="showDetail = false">知道了</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { get } from '../../utils/request.js'

export default {
  data() {
    return {
      isNavigating: false,
      pageVisible: false,
      showDetail: false,
      staffLoaded: false,
      nurse: null,
      doctor: null,
      defaultNurse: {
        name: '黄玉遐',
        phone: '15803698235',
        department: '血液净化中心'
      },
      defaultDoctor: {
        name: '罗珊珊',
        phone: '13364021033',
        department: '肾内科'
      }
    }
  },
  onLoad() {
    this.fetchMedicalStaff()
  },
  onShow() {
    this.pageVisible = true
  },
  onHide() {
    this.pageVisible = false
  },
  methods: {
    async fetchMedicalStaff() {
      try {
        const user = uni.getStorageSync('user')
        let userId = ''
        if (user) {
          try {
            const parsed = typeof user === 'string' ? JSON.parse(user) : user
            userId = parsed.id
          } catch (e) {}
        }
        
        if (!userId) {
          this.nurse = this.defaultNurse
          this.doctor = this.defaultDoctor
          this.$nextTick(() => { this.staffLoaded = true })
          return
        }
        
        try {
          const nurseRes = await get(`/medical-staff/patient/${userId}/nurse`)
          if (nurseRes.code === 200 && nurseRes.data) {
            this.nurse = {
              name: nurseRes.data.name,
              phone: nurseRes.data.phone,
              department: nurseRes.data.department
            }
          } else {
            this.nurse = this.defaultNurse
          }
        } catch (e) {
          this.nurse = this.defaultNurse
        }
        
        try {
          const doctorRes = await get(`/medical-staff/patient/${userId}/doctor`)
          if (doctorRes.code === 200 && doctorRes.data) {
            this.doctor = {
              name: doctorRes.data.name,
              phone: doctorRes.data.phone,
              department: doctorRes.data.department
            }
          } else {
            this.doctor = this.defaultDoctor
          }
        } catch (e) {
          this.doctor = this.defaultDoctor
        }
      } catch (err) {
        console.log(err)
        this.nurse = this.defaultNurse
        this.doctor = this.defaultDoctor
      }
      this.$nextTick(() => { this.staffLoaded = true })
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
    },
    showHospitalDetail() {
      this.showDetail = true
    },
    showComingSoon(name) {
      uni.showToast({
        title: name + '功能开发中',
        icon: 'none'
      })
    },
    showFeedbackSheet() {
      uni.showActionSheet({
        itemList: ['透析服务满意度评价', '投诉意见提交', '处理进度查看'],
        success: (res) => {
          if (res.tapIndex === 1) {
            this.handleItemClick('/pages/feedback/feedback', '投诉意见提交')
          } else {
            const map = ['透析服务满意度评价', '处理进度查看']
            const idx = res.tapIndex === 0 ? 0 : 1
            this.showComingSoon(map[idx])
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.service-container {
  padding: 0;
  min-height: 100vh;
  background: #FFFFFF;
  --s: calc(100vw / 375);
}

/* Top Background */
.top-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 45vh;
  background: linear-gradient(180deg, #b3fff4 0%, #FFFFFF 100%);
  z-index: 0;
}

/* Header - sticky top */
.sticky-top {
  position: sticky;
  top: 0;
  z-index: 5;
  background: transparent;
  opacity: 0;
  transition: opacity 0.4s ease-out;
}

.sticky-top.frost-visible {
  opacity: 1;
}

/* Main Content - fixed below header, flex column so content-area can scroll */
.main-content {
  position: fixed;
  top: calc(var(--status-bar-height, 20px) + 56px);
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  padding: 8px 0 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  opacity: 0;
  transition: opacity 0.5s ease-out;
}

.main-content.frost-visible {
  opacity: 1;
}

/* Status Bar */
.status-bar {
  position: relative;
  z-index: 1;
  padding: calc(var(--status-bar-height, 20px) + 8px) 16px 8px;
}

.status-content {
  display: flex;
  align-items: center;
  position: relative;
}

.logo-layer-img {
  width: 120px;
  height: 32px;
  display: block;
}

.header-title {
  font-size: 19px;
  font-weight: 500;
  color: #0A2540;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  white-space: nowrap;
}

/* Greeting Section */
.greeting-section {
  position: relative;
  z-index: 1;
  padding: 8px 16px 16px;
}

.greeting-main {
  font-size: 18px;
  font-weight: 600;
  color: #909399;
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

@keyframes popIn {
  0% {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.animate-pop-in {
  animation: popIn 0.35s ease-out both;
}

.animate-slide-down {
  animation: slideDown 0.4s ease-out both;
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-15px); }
  to { opacity: 1; transform: translateY(0); }
}

.service-divider {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin: 0 clamp(10px, 4vw, 16px);
  padding: 8px 0 0;
  flex-shrink: 0;
}

.divider-line {
  flex: 1;
  height: 1px;
  background: rgba(25, 162, 128, 0.2);
}

.divider-text {
  font-size: 12px;
  color: #19A280;
  font-weight: 500;
  letter-spacing: 1px;
  white-space: nowrap;
}

.service-buttons {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 170px));
  justify-content: center;
  gap: clamp(8px, 3vw, 12px);
  margin: 0;
  padding: clamp(12px, 4vw, 16px);
  flex-shrink: 0;
  background: linear-gradient(180deg, rgba(232, 236, 247, 1) 0%, rgba(250, 251, 253, 1) 12%, rgba(255, 255, 255, 1) 25%);
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 1);
  box-shadow: 0 4px 20px rgba(13, 66, 49, 0.08);
  overflow: hidden;
  box-sizing: border-box;
}

/* 顶部淡蓝色渐变装饰（与质量管控菜单区一致） */
.sb-top-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50px;
  background: linear-gradient(180deg, rgba(224, 232, 248, 0.6) 0%, rgba(232, 236, 247, 0.3) 40%, rgba(255, 255, 255, 0) 100%);
  pointer-events: none;
  z-index: 0;
}

/* 满意度评价与投诉建议 标题允许换行 */
.feature-title-long {
  white-space: normal;
  line-height: 1.3;
}

.feature-card {
  min-width: 0;
  min-height: clamp(72px, 20vw, 84px);
  border-radius: clamp(10px, 3.5vw, 14px);
  padding: clamp(10px, 3vw, 14px);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  box-shadow: 0 4px 20px rgba(100, 120, 160, 0.18), 0 1px 4px rgba(100, 120, 160, 0.1);
  border: 1px solid rgba(100, 120, 160, 0.1);
  opacity: 1;
  position: relative;
}

.feature-card-teal {
  background: linear-gradient(0deg, #E8F8F0 0%, #FFFFFF 55%);
}

.feature-card-blue {
  background: linear-gradient(0deg, #E8F4FD 0%, #FFFFFF 55%);
}

.feature-card-purple {
  background: linear-gradient(0deg, #F1E8FD 0%, #FFFFFF 55%);
}

.feature-card-orange {
  background: linear-gradient(0deg, #FDF1E5 0%, #FFFFFF 55%);
}

.feature-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
}

.feature-title {
  font-size: clamp(14px, 4vw, 16px);
  font-weight: 500;
  color: #1A2B44;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.feature-desc {
  font-size: clamp(10px, 3vw, 12px);
  color: #7A8BA4;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.feature-icon {
  width: clamp(24px, 7vw, 30px);
  height: clamp(24px, 7vw, 30px);
  flex-shrink: 0;
  position: absolute;
  right: clamp(8px, 3vw, 12px);
  bottom: clamp(8px, 3vw, 12px);
}

/* 图标着色：与卡片渐变色呼应 */
.feature-icon-teal {
  filter: brightness(0) saturate(100%) invert(36%) sepia(85%) saturate(538%) hue-rotate(126deg) brightness(92%) contrast(91%);
}

.feature-icon-blue {
  filter: brightness(0) saturate(100%) invert(58%) sepia(85%) saturate(1200%) hue-rotate(197deg) brightness(96%) contrast(91%);
}

.feature-icon-purple {
  filter: brightness(0) saturate(100%) invert(44%) sepia(70%) saturate(1500%) hue-rotate(233deg) brightness(97%) contrast(92%);
}

.feature-icon-orange {
  filter: brightness(0) saturate(100%) invert(66%) sepia(55%) saturate(700%) hue-rotate(347deg) brightness(96%) contrast(90%);
}

.feature-card:active {
  transform: scale(0.98);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
}

/* === 您的专属医护 === */
.staff-card-section {
  position: relative;
  z-index: 2;
  margin: 0 clamp(10px, 4vw, 16px) 16px;
  flex-shrink: 0;
}

/* 磨砂半透明背板：参考首页 tips-header-backplate */
.staff-header-backplate {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 66px;
  background: rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.28);
  box-shadow: 0 4px 16px rgba(255, 255, 255, 0.06) inset;
  z-index: 0;
  border: 0.5px solid #FFFFFF;
}

.staff-green-header {
  position: relative;
  height: 78px;
  overflow: visible;
  z-index: 1;
}

.staff-header-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: block;
  z-index: 1;
}

.staff-header-title {
  position: absolute;
  left: 20px;
  top: 10px;
  font-size: 19px;
  font-weight: 700;
  color: #FFFFFF;
  z-index: 4;
  letter-spacing: 0.5px;
}

.staff-header-subtitle {
  position: absolute;
  right: 20px;
  top: 10px;
  width: 96px;
  height: 12px;
  font-size: 13px;
  font-weight: 400;
  line-height: 13px;
  letter-spacing: normal;
  color: #145248;
  z-index: 4;
  text-align: center;
  white-space: nowrap;
}

.staff-frosted-tray {
  position: relative;
  margin-top: -34px;
  z-index: 3;
  background: rgba(255, 255, 255, 0.24);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-radius: 14px;
  padding: 12px 12px 12px;
  margin-left: 0;
  margin-right: 0;
  border: 1px solid rgba(255, 255, 255, 0.58);
  box-shadow: 0 6px 24px rgba(25, 162, 128, 0.12);
}

.staff-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.staff-item {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  border-radius: 10px;
  padding: 8px 12px;
  box-shadow: 0 4px 16px rgba(13, 66, 49, 0.12), 0 1px 4px rgba(13, 66, 49, 0.08);
  border: 1px solid rgba(100, 120, 160, 0.25);
}

/* === 机构信息: full width === */
.org-section {
  margin: 0 -16px;
  background: linear-gradient(180deg, rgba(232, 236, 247, 1) 0%, rgba(250, 251, 253, 1) 12%, rgba(255, 255, 255, 1) 25%);
  border-radius: 14px;
  padding: 12px 16px;
  box-shadow: 0 4px 20px rgba(13, 66, 49, 0.08);
  border: 1px solid rgba(100, 120, 160, 0.1);
  position: relative;
  z-index: 2;
  overflow: hidden;
}

.org-top-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 40px;
  background: linear-gradient(180deg, rgba(224, 232, 248, 0.6) 0%, rgba(232, 236, 247, 0.3) 40%, rgba(255, 255, 255, 0) 100%);
  pointer-events: none;
  z-index: 0;
}

.org-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  position: relative;
  z-index: 1;
}

.org-title-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
}

.org-header-icon {
  width: 18px;
  height: 18px;
  filter: brightness(0) saturate(100%) invert(36%) sepia(85%) saturate(538%) hue-rotate(126deg) brightness(92%) contrast(91%);
}

.org-header-title {
  font-size: 15px;
  font-weight: 500;
  color: #1A2B44;
}

.org-more-wrap {
  display: flex;
  align-items: center;
  gap: 3px;
}

.org-more-text {
  font-size: 12px;
  color: #3497E3;
}

.org-arrow {
  width: 5px;
  height: 5px;
  border-top: 1.5px solid #3497E3;
  border-right: 1.5px solid #3497E3;
  transform: rotate(45deg);
  flex-shrink: 0;
}

/* === 机构信息（品牌介绍） === */
.org-section-block {
  margin-top: 10px;
  position: relative;
  z-index: 2;
}

.org-brand-card {
  background: #FFFFFF;
  border-radius: 10px;
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  box-shadow: 0 2px 10px rgba(13, 66, 49, 0.06);
  border: 1px solid rgba(100, 120, 160, 0.1);
}

.brand-para {
  font-size: 14px;
  color: #4A5568;
  line-height: 1.5;
  text-indent: 2em;
}

/* === 联系方式：透析中心（已移至品牌资讯页） === */
.org-content-card {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px 12px;
  background: #FFFFFF;
  border-radius: 10px;
  margin-bottom: 6px;
  box-shadow: 0 2px 10px rgba(13, 66, 49, 0.05);
  border: 1px solid rgba(100, 120, 160, 0.1);
  position: relative;
  z-index: 1;
}

.org-contact-card {
  display: flex;
  padding: 8px 12px;
  background: #FFFFFF;
  border-radius: 10px;
  margin-bottom: 6px;
  box-shadow: 0 2px 10px rgba(13, 66, 49, 0.05);
  border: 1px solid rgba(100, 120, 160, 0.1);
  position: relative;
  z-index: 1;
}

.org-contact-card:last-child {
  margin-bottom: 0;
}

.menu-icon-wrapper {
  position: absolute;
  bottom: 8px;
  right: 10px;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s ease;
}

.menu-icon-img {
  width: 22px;
  height: 22px;
}

.menu-text {
  display: block;
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 2px;
  line-height: 1.2;
  white-space: nowrap;
}

.menu-hint {
  display: block;
  font-size: 11px;
  color: #909399;
  line-height: 1.2;
  white-space: nowrap;
}

.menu-item:active {
  transform: scale(0.98);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.menu-item:active .menu-icon-wrapper {
  transform: scale(1.05);
}

/* === Staff item inner styles === */
.staff-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: rgba(0, 157, 133, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  flex-shrink: 0;
}

.avatar-icon {
  width: 24px;
  height: 24px;
}

.staff-info {
  flex: 1;
}

.staff-name {
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: #1A2B44;
  margin-bottom: 3px;
}

.staff-position {
  display: block;
  font-size: 13px;
  color: #009D85;
}

.staff-department {
  display: none;
}

.staff-action {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 12px;
  background-color: #009D85;
  border-radius: 6px;
}

.action-icon {
  width: 16px;
  height: 16px;
  margin-bottom: 1px;
  filter: brightness(0) invert(1);
}

.action-text {
  font-size: 11px;
  color: #FFFFFF;
  font-weight: 500;
}

.empty-staff {
  justify-content: center;
  padding: 20px;
  background: rgba(255, 255, 255, 0.5);
}

.empty-icon {
  width: 32px;
  height: 32px;
  margin-right: 10px;
}

.empty-text {
  font-size: 13px;
  color: #909399;
}

/* === Org content card inner styles === */
.org-intro-title {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #1A2B44;
}

.org-intro-content {
  font-size: 12px;
  color: #4A5568;
  line-height: 1.4;
  display: block;
}

.org-contact-item {
  display: flex;
  align-items: center;
}

.org-contact-icon {
  width: 18px;
  height: 18px;
  margin-right: 8px;
  filter: brightness(0) saturate(100%) invert(36%) sepia(85%) saturate(538%) hue-rotate(126deg) brightness(92%) contrast(91%);
}

.org-contact-info {
  flex: 1;
}

.org-contact-title {
  display: block;
  font-size: 11px;
  color: #909399;
  margin-bottom: 1px;
}

.org-contact-value {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: #1A2B44;
}

/* Hospital Detail Modal */
.detail-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.detail-modal-content {
  width: 82%;
  max-width: 340px;
  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 12px 40px rgba(25, 162, 128, 0.2);
  overflow: hidden;
}

.detail-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 18px 12px;
  border-bottom: 1px solid rgba(25, 162, 128, 0.08);
}

.detail-modal-title {
  font-size: 17px;
  font-weight: 500;
  color: #1A2B44;
}

.detail-modal-close {
  font-size: 18px;
  color: #909399;
  padding: 2px 8px;
}

.detail-modal-body {
  padding: 14px 18px;
}

.detail-modal-text {
  display: block;
  font-size: 14px;
  color: #303133;
  line-height: 1.6;
  margin-bottom: 10px;
}

.detail-modal-footer {
  padding: 10px 18px 16px;
  display: flex;
  justify-content: center;
}

.detail-modal-btn {
  padding: 10px 40px;
  background: rgba(25, 162, 128, 0.9);
  color: #FFFFFF;
  font-size: 15px;
  font-weight: 600;
  border-radius: 24px;
}

/* === 小屏幕适配 === */
@media (max-height: 700px) {
  .service-buttons {
    padding: 4px 0;
  }
  .feature-card {
    min-height: 90px;
    padding: 12px;
    gap: 6px;
  }
  .staff-item {
    padding: 8px 10px !important;
  }
}

/* 小屏幕仅用 --s 等比缩放，不改变排版结构 */
</style>