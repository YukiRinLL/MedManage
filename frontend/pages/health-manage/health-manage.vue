<template>
  <view class="health-manage-container">
    <!-- Header with Green Gradient -->
    <view class="header-bg">
      <view class="status-bar">
        <view class="status-content">
          <view class="logo-wrap">
            <image src="/static/logo.png" class="logo-img" mode="aspectFit" />
            <view class="logo-text-group">
              <text class="logo-cn">圣通尚诺</text>
              <text class="logo-en">For Better Life</text>
            </view>
          </view>
          <text class="header-title">健康管理</text>
          <view class="header-right">
            <view class="header-btn">
              <text class="btn-dots">···</text>
            </view>
            <view class="header-btn">
              <text class="btn-circle">○</text>
            </view>
          </view>
        </view>
      </view>

      <!-- Greeting -->
      <view class="greeting-section">
        <view class="avatar-wrap">
          <image src="/static/design/health/Frame 1739330068.svg" class="avatar-img" mode="aspectFit" />
        </view>
        <text class="greeting-line">早上好，{{ userName }}～</text>
      </view>
    </view>

    <!-- Health Advice Card -->
    <view class="advice-card">
      <view class="advice-header">
        <text class="advice-title">健康建议</text>
        <image src="/static/design/home/Frame.svg" class="advice-deco" mode="aspectFit" />
      </view>
      <view class="advice-body">
        <text class="advice-text">{{ healthAdvice }}</text>
      </view>

      <!-- Feature Cards Row -->
      <view class="feature-row">
        <view class="feature-card feature-blue" @click="handleItemClick('/pages/improvement-plan/improvement-plan')">
          <view class="priority-badge">重要</view>
          <view class="feature-icon-wrap">
            <image src="/static/design/home/Frame-3.svg" class="feature-icon" mode="aspectFit" />
          </view>
          <view class="feature-info">
            <text class="feature-title">指标提升方案</text>
            <text class="feature-desc">个性化干预方案针对性改善健康指标</text>
          </view>
        </view>

        <view class="feature-card feature-green" @click="handleItemClick('/pages/diagnosis/diagnosis')">
          <view class="priority-badge">重要</view>
          <view class="feature-icon-wrap">
            <image src="/static/design/home/Frame-4.svg" class="feature-icon" mode="aspectFit" />
          </view>
          <view class="feature-info">
            <text class="feature-title">透析评估</text>
            <text class="feature-desc">反馈当天透析情况，评估治疗效果</text>
          </view>
        </view>
      </view>
    </view>

    <!-- Menu Grid 2x2 -->
    <view class="menu-grid">
      <view class="menu-item" @click="handleItemClick('/pages/health-record/health-record')">
        <view class="menu-info">
          <text class="menu-title">健康档案</text>
          <text class="menu-desc">查看个人健康信息</text>
        </view>
        <view class="menu-bottom">
          <view class="menu-view-btn">查看</view>
          <image src="/static/design/home/Frame-5.svg" class="menu-icon icon-blue" mode="aspectFit" />
        </view>
      </view>

      <view class="menu-item" @click="handleItemClick('/pages/vital-sign/vital-sign')">
        <view class="menu-info">
          <text class="menu-title">生命体征</text>
          <text class="menu-desc">记录体温血压血糖</text>
        </view>
        <view class="menu-bottom">
          <view class="menu-view-btn">查看</view>
          <image src="/static/design/home/Frame-6.svg" class="menu-icon icon-red" mode="aspectFit" />
        </view>
      </view>

      <view class="menu-item" @click="handleItemClick('/pages/medication/medication')">
        <view class="menu-info">
          <text class="menu-title">用药记录</text>
          <text class="menu-desc">管理每日用药提醒</text>
        </view>
        <view class="menu-bottom">
          <view class="menu-view-btn">查看</view>
          <image src="/static/design/home/Frame-7.svg" class="menu-icon icon-purple" mode="aspectFit" />
        </view>
      </view>

      <view class="menu-item" @click="handleItemClick('/pages/core-indicator/core-indicator')">
        <view class="menu-info">
          <text class="menu-title">核心指标</text>
          <text class="menu-desc">查血指标趋势追踪</text>
        </view>
        <view class="menu-bottom">
          <view class="menu-view-btn">查看</view>
          <image src="/static/design/home/Frame-8.svg" class="menu-icon icon-green" mode="aspectFit" />
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
      userName: '何先生',
      healthAdvice: '"健康身体指标"是减少并发症重要因素，最终成效依赖于我们双方的紧密配合，医疗团队的专业处置与您对饮食、用药、自我管理等方案的严格执行同等重要。'
    }
  },
  onLoad() {
    this.loadUserInfo()
  },
  onShow() {
    this.loadUserInfo()
  },
  methods: {
    loadUserInfo() {
      const userStr = uni.getStorageSync('user')
      if (userStr) {
        try {
          const user = typeof userStr === 'string' ? JSON.parse(userStr) : userStr
          if (user && user.name) {
            this.userName = user.name
          } else if (user && user.nickname) {
            this.userName = user.nickname
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
.health-manage-container {
  padding: 0;
  min-height: 100vh;
  background: #F4FAF8;
}

/* Header Background with Gradient */
.header-bg {
  background: linear-gradient(180deg, #D0F3E8 0%, #A9EBD1 30%, #74DFB8 70%, #4ADBB0 100%);
  padding-bottom: 20px;
  position: relative;
}

/* Status Bar */
.status-bar {
  padding: calc(var(--status-bar-height, 20px) + 12px) 16px 8px;
}

.status-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.logo-img {
  width: 40px;
  height: 40px;
}

.logo-text-group {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.logo-cn {
  font-size: 14px;
  font-weight: 700;
  color: #0A2540;
}

.logo-en {
  font-size: 9px;
  color: #5A7A99;
  letter-spacing: 0.5px;
}

.header-title {
  font-size: 17px;
  font-weight: 700;
  color: #0A2540;
  flex: 1;
  text-align: center;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  justify-content: flex-end;
}

.header-btn {
  width: 36px;
  height: 36px;
  border: 1.5px solid #0A2540;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
}

.btn-dots {
  font-size: 14px;
  color: #0A2540;
  font-weight: 700;
  line-height: 1;
}

.btn-circle {
  font-size: 14px;
  color: #0A2540;
  line-height: 1;
}

/* Greeting Section */
.greeting-section {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px 0;
}

.avatar-wrap {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #FFFFFF;
  box-shadow: 0 2px 8px rgba(25, 162, 128, 0.2);
  overflow: hidden;
}

.avatar-img {
  width: 44px;
  height: 44px;
}

.greeting-line {
  font-size: 18px;
  font-weight: 700;
  color: #0A2540;
}

/* Advice Card */
.advice-card {
  margin: 16px 16px 0;
  background: #FFFFFF;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(13, 66, 49, 0.08);
  position: relative;
  z-index: 2;
  overflow: hidden;
}

.advice-header {
  background: linear-gradient(180deg, #19A280 0%, #3FCBA5 100%);
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
}

.advice-header::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 12px;
  background: #FFFFFF;
  border-radius: 12px 12px 0 0;
}

.advice-title {
  font-size: 17px;
  font-weight: 700;
  color: #FFFFFF;
}

.advice-deco {
  width: 28px;
  height: 28px;
}

.advice-body {
  padding: 14px 16px 16px;
}

.advice-text {
  font-size: 13px;
  color: #4A5568;
  line-height: 1.7;
}

/* Feature Cards */
.feature-row {
  display: flex;
  gap: 10px;
  padding: 0 16px 16px;
}

.feature-card {
  flex: 1;
  background: #FFFFFF;
  border-radius: 12px;
  padding: 14px 12px;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(13, 66, 49, 0.06);
}

.feature-blue {
  border-top: 3px solid #0083FF;
}

.feature-green {
  border-top: 3px solid #00C67C;
}

.priority-badge {
  position: absolute;
  top: 0;
  right: 12px;
  background: #19A280;
  color: #FFFFFF;
  font-size: 11px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 0 0 6px 6px;
}

.feature-icon-wrap {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.feature-blue .feature-icon-wrap {
  background: #E6F0FF;
}

.feature-green .feature-icon-wrap {
  background: #E6FFF5;
}

.feature-icon {
  width: 22px;
  height: 22px;
}

.feature-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.feature-title {
  font-size: 13px;
  font-weight: 700;
  color: #0A2540;
}

.feature-desc {
  font-size: 11px;
  color: #7A8BA4;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

/* Menu Grid */
.menu-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin: 16px;
}

.menu-item {
  background: #FFFFFF;
  border-radius: 12px;
  padding: 14px 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: 0 4px 12px rgba(13, 66, 49, 0.06);
}

.menu-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.menu-title {
  font-size: 14px;
  font-weight: 700;
  color: #0A2540;
}

.menu-desc {
  font-size: 12px;
  color: #7A8BA4;
}

.menu-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.menu-view-btn {
  font-size: 12px;
  color: #19A280;
  font-weight: 600;
  background: #E8F9F0;
  padding: 4px 14px;
  border-radius: 12px;
}

.menu-icon {
  width: 52px;
  height: 52px;
}

.icon-blue {
  background: linear-gradient(135deg, #0083FF 0%, #6CB7FF 100%);
  border-radius: 12px;
}

.icon-red {
  background: linear-gradient(135deg, #FF373A 0%, #FF6B6E 100%);
  border-radius: 12px;
}

.icon-purple {
  background: linear-gradient(135deg, #DD7AD8 0%, #FF97F2 100%);
  border-radius: 12px;
}

.icon-green {
  background: linear-gradient(135deg, #1ACF90 0%, #3EE4B8 100%);
  border-radius: 12px;
}

.bottom-space {
  height: 100px;
}
</style>
