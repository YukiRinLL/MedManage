<template>
  <view class="health-manage-container">
    <!-- Top Background (same as homepage: #009D85 top 40%) -->
    <view class="top-bg"></view>

    <!-- Sticky Top: Header + Greeting -->
    <view class="sticky-top" :class="{ 'frost-visible': pageVisible }">
      <!-- Header -->
      <view class="status-bar">
        <view class="status-content">
          <image src="/static/design/home/图层 0 4.png" class="logo-layer-img" mode="aspectFit" />
          <text class="header-title">健康管理</text>
        </view>
      </view>

      <!-- Greeting -->
      <view class="greeting-section animate-fade-in" :style="{ animationDelay: '0.1s' }">
        <view class="avatar-wrap">
          <image src="/static/design/health/Frame 1739330068.svg" class="avatar-img" mode="aspectFit" />
        </view>
        <text class="greeting-line">{{ greeting }}{{ userName ? '，' + userName : '' }}～</text>
      </view>
    </view>

    <!-- Health Advice Section -->
    <view class="advice-section" :class="{ 'frost-visible': pageVisible }" style="transition-delay: 0.2s;">
      <view class="tips-frosted-tray">
        <!-- Green Trapezoid Banner with rounded corners + dip -->
        <view class="advice-banner">
          <svg class="banner-svg" viewBox="0 0 343 92" preserveAspectRatio="none">
            <defs>
              <!-- 110deg: dark green (upper-left) → light green (lower-right) -->
              <linearGradient id="adviceBannerGrad" x1="0" y1="0" x2="1" y2="0.36">
                <stop offset="4%" stop-color="#19a280"/>
                <stop offset="107%" stop-color="#77ebce"/>
              </linearGradient>
            </defs>
            <!-- Rounded rectangle with smooth dip in top middle -->
            <path d="M 0 8
              Q 0 0, 8 0

              L 128 0
              Q 140 0, 159 9
              Q 165 12, 171 12
              Q 177 12, 183 9
              Q 202 0, 214 0

              L 335 0
              Q 343 0, 343 8
              L 343 84
              Q 343 92, 335 92
              L 8 92
              Q 0 92, 0 84
              Z" fill="url(#adviceBannerGrad)"/>
          </svg>
          <!-- Inverted obtuse isosceles triangle in the dip (with rounded corners + gradient) -->
          <view class="banner-triangle">
            <svg viewBox="0 0 25.11 6.75" preserveAspectRatio="none" style="width:100%;height:100%;display:block;">
              <defs>
                <!-- 106deg: dark green → light green -->
                <linearGradient id="triangleGrad" x1="0" y1="0" x2="1" y2="0.29">
                  <stop offset="3%" stop-color="#19a280"/>
                  <stop offset="104%" stop-color="#77ebce"/>
                </linearGradient>
              </defs>
              <!-- Downward obtuse isosceles triangle with rounded corners (r=1) -->
              <path d="M 1.4 0 Q 12.65 -0.9, 24.11 0 Q 24.95 0.42, 23.85 0.95 Q 17.2 4.4, 12.4 6.5 Q 11.6 6.65, 10.9 6.2 Q 4.8 3.9, 0.85 0.92 Q 0.15 0.4, 1.4 0 Z"
              fill="url(#triangleGrad)"/>
            </svg>
          </view>
          <text class="banner-title">健康建议</text>
          <!-- Right side decorative icon -->
          <view class="banner-icon">
            <image src="/static/design/health/健康建议右侧.svg" mode="aspectFit" style="width:100%;height:100%;opacity:1;"/>
          </view>
        </view>
      </view>
      <!-- Frosted Translucent Tray (overlaps banner bottom) -->
      <view class="advice-tray">
        <text class="advice-text">{{ healthAdvice }}</text>
      </view>
    </view>

    <!-- Feature Cards Row -->
    <view class="feature-row">
      <view class="feature-card feature-blue animate-fade-in-up" :style="{ animationDelay: '0.3s' }" @click="handleItemClick('/pages/improvement-plan/improvement-plan')">
        <view class="feature-icon-wrap">
          <image src="/static/design/health/Vector-3.svg" class="feature-icon" mode="aspectFit" />
        </view>
        <view class="priority-badge">重要</view>
        <text class="feature-title">指标提升方案</text>
        <text class="feature-desc">个性化干预方案针对性改善健康指标</text>
      </view>

      <view class="feature-card feature-green animate-fade-in-up" :style="{ animationDelay: '0.4s' }" @click="handleItemClick('/pages/diagnosis/diagnosis')">
        <view class="feature-icon-wrap">
          <image src="/static/design/health/Vector-2.svg" class="feature-icon" mode="aspectFit" />
        </view>
        <view class="priority-badge">重要</view>
        <text class="feature-title">透析评估</text>
        <text class="feature-desc">反馈当天透析情况，评估治疗效果</text>
      </view>
    </view>

    <!-- Menu Section with frosted tray -->
    <view class="menu-section animate-fade-in-up" :style="{ animationDelay: '0.5s' }">
      <!-- 顶部淡蓝色渐变 -->
      <view class="menu-top-gradient"></view>
      <!-- <view class="menu-header">
        <text class="menu-section-title">健康管理</text>
      </view> -->
      <!-- Menu Grid 2x2 -->
      <view class="menu-grid">
        <view class="menu-item" @click="handleItemClick('/pages/health-record/health-record')">
          <view class="menu-info">
            <text class="menu-title">健康档案</text>
            <text class="menu-desc">查看个人健康信息</text>
          </view>
          <view class="menu-bottom">
            <view class="menu-view-btn">查看</view>
            <image src="/static/design/home/Group 1000007254.svg" class="menu-icon" mode="aspectFit" />
          </view>
        </view>

        <view class="menu-item" @click="handleItemClick('/pages/vital-sign/vital-sign')">
          <view class="menu-info">
            <text class="menu-title">居家生命体征记录</text>
            <text class="menu-desc">记录日常体征指数</text>
          </view>
          <view class="menu-bottom">
            <view class="menu-view-btn">查看</view>
           <image src="/static/design/home/Group 1000007257.svg" class="menu-icon" mode="aspectFit" />
          </view>
        </view>

        <view class="menu-item" @click="handleItemClick('/pages/medication/medication')">
          <view class="menu-info">
            <text class="menu-title">用药记录</text>
            <text class="menu-desc">管理每日用药提醒</text>
          </view>
          <view class="menu-bottom">
            <view class="menu-view-btn">查看</view>
            <image src="/static/design/home/Group 1000007258.svg" class="menu-icon" mode="aspectFit" />
          </view>
        </view>

        <view class="menu-item" @click="handleItemClick('/pages/core-indicator/core-indicator')">
          <view class="menu-info">
            <text class="menu-title">核心指标</text>
            <text class="menu-desc">查血指标趋势追踪</text>
          </view>
          <view class="menu-bottom">
            <view class="menu-view-btn">查看</view>
            <image src="/static/design/health/核心指标.svg" class="menu-icon" mode="aspectFit" />
          </view>
        </view>
      </view>
    </view>

    <view class="bottom-space"></view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      isNavigating: false,
      userName: '',
      pageVisible: true,
      healthAdvice: '"健康身体指标"是减少并发症重要因素，最终成效依赖于我们双方的紧密配合，医疗团队的专业处置与您对饮食、用药、自我管理等方案的严格执行同等重要。'
    }
  },
  computed: {
    greeting() {
      const hour = new Date().getHours()
      if (hour < 6) return '凌晨好'
      if (hour < 9) return '早上好'
      if (hour < 12) return '上午好'
      if (hour < 14) return '中午好'
      if (hour < 18) return '下午好'
      return '晚上好'
    }
  },
  onLoad() {
    this.loadUserInfo()
  },
  onShow() {
    this.loadUserInfo()
    this.pageVisible = false
    this.$nextTick(() => {
      this.pageVisible = true
    })
  },
  methods: {
    loadUserInfo() {
      const userStr = uni.getStorageSync('user')
      if (userStr) {
        try {
          const user = typeof userStr === 'string' ? JSON.parse(userStr) : userStr
          if (user) {
            this.userName = user.name || user.realName || user.nickname || user.username || '用户'
          }
        } catch (e) {
          console.log('解析用户信息失败', e)
        }
      }
    },
    handleItemClick(url) {
      if (this.isNavigating) return
      this.isNavigating = true
      uni.vibrateShort({})
      uni.navigateTo({
        url,
        success: () => {
          setTimeout(() => { this.isNavigating = false }, 300)
        },
        fail: () => { this.isNavigating = false }
      })
    }
  }
}
</script>

<style scoped>
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

@keyframes fadeInOnly {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-fade-in-only {
  animation: fadeInOnly 0.4s ease-out both;
}

.frost-visible {
  opacity: 1 !important;
}

.health-manage-container {
  --s: calc(100vw / 375);
  padding: 0;
  min-height: 100vh;
  background: #FFFFFF;
  position: relative;
}

/* Top Background: #009D85 theme color, top 40% (same as homepage) */
.top-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 40vh;
  background: linear-gradient(180deg, #b3fff4 0%, #FFFFFF 100%);
  z-index: 0;
}

/* Sticky Top Section - fixed on scroll, covered by content below */
.sticky-top {
  position: sticky;
  top: 0;
  z-index: 1;
  background: transparent;
  opacity: 0;
  transition: opacity 0.4s ease-out;
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
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px 0;
}

.avatar-wrap {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  border: 2px solid #FFFFFF;
  box-shadow: 0 2px 8px rgba(45, 174, 133, 0.25);
  overflow: hidden;
  background: #23B357;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.avatar-img {
  width: 100%;
  height: 100%;
}

.greeting-line {
  font-size: 18px;
  font-weight: 400;
  color: #1A2B44;
  white-space: nowrap;
}

/* Advice Section */
.advice-section {
  position: relative;
  z-index: 1;
  margin: 20px 16px 0;
  opacity: 0;
  transition: opacity 0.4s ease-out;
}

/* 磨砂半透明托盘：放在绿色下方，部分重叠在绿色底部渐变淡出区域 */
.tips-frosted-tray {
  position: relative;
  background: rgba(255, 255, 255, 0);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-radius: 14px;
  margin-left: 0;
  margin-right: 0;
  border: 1px solid rgba(255, 255, 255, 0.58);
  box-shadow: 0 6px 24px rgba(25, 162, 128, 0.12);
}

/* Green Trapezoid Banner */
.advice-banner {
  position: relative;
  width: 100%;
  height: 92px;
  overflow: visible;
  z-index: 1;
}

.banner-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: block;
}

/* Small inverted triangle in the dip */
.banner-triangle {
  position: absolute;
  top: 0px;
  left: 50%;
  transform: translateX(-50%);
  width: 25.11px;
  height: 6.75px;
}

.banner-title {
  position: absolute;
  left: 20px;
  top: 10px;
  font-size: 19px;
  font-weight: 700;
  color: #FFFFFF;
  z-index: 4;
  letter-spacing: 0.5px;
  text-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

/* Right side decorative icon */
.banner-icon {
  position: absolute;
  right: 10px;
  top: 20%;
  transform: translateY(-50%);
  width: 25px;
  height: 25px;
  z-index: 3;
}

/* Frosted Translucent Tray */
.advice-tray {
  position: relative;
  margin-top: -50px;
  z-index: 2;
  width: 100%;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 10px;
  border: 1px solid rgba(100, 120, 160, 0.25);
  padding: 8px 12px 10px;
  box-sizing: border-box;
  box-shadow: 0 4px 16px rgba(13, 66, 49, 0.12), 0 1px 4px rgba(13, 66, 49, 0.08);
}

.advice-text {
  font-size: clamp(13px, 3.5vw, 15px);
  font-weight: 330;
  color: #555666;
  line-height: 16px;
}

/* Feature Cards Row */
.feature-row {
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  gap: clamp(8px, 3vw, 12px);
  margin: 16px 16px 0;
}

.feature-card {
  flex: 1;
  border-radius: 8px;
  padding: 12px;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-height: 110px;
  box-shadow: 0 4px 20px rgba(100, 120, 160, 0.18), 0 1px 4px rgba(100, 120, 160, 0.1);
}

.feature-blue {
  background: linear-gradient(180deg, #E8F4FD 0%, #FFFFFF 60%);
}

.feature-green {
  background: linear-gradient(180deg, #E8F8F0 0%, #FFFFFF 60%);
}

.feature-icon-wrap {
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.feature-icon {
  width: 26px;
  height: 26px;
}

/* Important badge: left dark, right light gradient */
.priority-badge {
  position: absolute;
  top: 0;
  right: 0;
  background: linear-gradient(90deg, #19A280 0%, #2DAE85 50%, #3FCBA5 100%);
  color: #FFFFFF;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 0 8px 0 6px;
}

.feature-title {
  font-size: 16px;
  font-weight: 500;
  color: #333333;
  margin-top: 4px;
}

.feature-desc {
  font-size: 14px;
  color: #7A91A3;
  line-height: 18px;
}

/* Menu Section - frosted tray backplate */
.menu-section {
  position: relative;
  z-index: 1;
  margin: 16px 0px 0;
  background: linear-gradient(180deg, rgba(232, 236, 247, 1) 0%, rgba(250, 251, 253, 1) 12%, rgba(255, 255, 255, 1) 25%);
  border-radius: 14px;
  padding: 16px;
  box-shadow: 0 4px 20px rgba(13, 66, 49, 0.08);
  border: 1px solid rgba(255, 255, 255, 1);
  overflow: hidden;
}

.menu-top-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50px;
  background: linear-gradient(180deg, rgba(224, 232, 248, 0.6) 0%, rgba(232, 236, 247, 0.3) 40%, rgba(255, 255, 255, 0) 100%);
  pointer-events: none;
  z-index: 0;
}

.menu-header {
  position: relative;
  z-index: 1;
  margin-bottom: 12px;
}

.menu-section-title {
  font-size: 18px;
  font-weight: 500;
  color: #1A2B44;
}

/* Menu Grid 2x2 */
.menu-grid {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.menu-item {
  background: #FFFFFF;
  border-radius: 14px;
  padding: 16px 14px;
  box-shadow: 0 4px 20px rgba(100, 120, 160, 0.15), 0 1px 4px rgba(100, 120, 160, 0.08);
  border: 1px solid rgba(100, 120, 160, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 112px;
  gap: 12px;
}

.menu-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.menu-title {
  font-size: clamp(15px, 4vw, 17px);
  font-weight: 500;
  color: #1A2B44;
}

.menu-desc {
  font-size: 14px;
  color: #7A8BA4;
}

.menu-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.menu-view-btn {
  font-size: 14px;
  color: #2DAE85;
  font-weight: 600;
  background: rgba(45, 174, 133, 0.08);
  padding: 3px 14px;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(45, 174, 133, 0.1);
}

.menu-icon {
  width: 32px;
  height: 32px;
}

.bottom-space {
  height: 100px;
}

@media (max-height: 700px) {
  .advice-section { margin-top: 12px; }
  .feature-row { margin-top: 10px; }
  .menu-grid { margin-top: 10px; gap: 8px; }
  .menu-item { min-height: 90px; padding: 10px; }
}

@media (max-width: 360px) {
  .feature-card { min-height: 90px; }
  .menu-grid { gap: 8px; }
}
</style>
