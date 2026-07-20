<template>
  <view class="health-manage-container">
    <view class="section-header animate-fade-in">
      <view class="header-bg"></view>
      <view class="header-content">
        <text class="section-title">健康管理</text>
        <text class="section-desc">管理您的健康数据</text>
      </view>
    </view>
    
    <view class="menu-grid">
      <view 
        class="menu-item animate-fade-in-up" 
        :style="{ animationDelay: '0.1s' }"
        @click="handleItemClick('/pages/health-record/health-record', '健康档案')"
      >
        <view class="menu-icon-wrapper bg-green">
          <image src="/static/icons/png/filled/symbols/i_note_action@2x.png" class="menu-icon-img" mode="aspectFit" />
          <view class="ripple-effect"></view>
        </view>
        <text class="menu-text">健康档案</text>
        <text class="menu-hint">查看个人健康信息</text>
      </view>
      
      <view 
        class="menu-item animate-fade-in-up" 
        :style="{ animationDelay: '0.15s' }"
        @click="handleItemClick('/pages/vital-sign/vital-sign', '生命体征')"
      >
        <view class="menu-icon-wrapper bg-red">
          <image src="/static/icons/png/filled/symbols/heart_cardiogram@2x.png" class="menu-icon-img" mode="aspectFit" />
          <view class="ripple-effect"></view>
        </view>
        <text class="menu-text">生命体征</text>
        <text class="menu-hint">记录体温血压血糖</text>
      </view>
      
      <view 
        class="menu-item animate-fade-in-up" 
        :style="{ animationDelay: '0.2s' }"
        @click="handleItemClick('/pages/medication/medication', '用药记录')"
      >
        <view class="menu-icon-wrapper bg-blue">
          <image src="/static/icons/png/filled/medications/pill_1@2x.png" class="menu-icon-img" mode="aspectFit" />
          <view class="ripple-effect"></view>
        </view>
        <text class="menu-text">用药记录</text>
        <text class="menu-hint">管理每日用药提醒</text>
      </view>
      
      <view 
        class="menu-item animate-fade-in-up" 
        :style="{ animationDelay: '0.25s' }"
        @click="handleItemClick('/pages/diagnosis/diagnosis', '诊断信息')"
      >
        <view class="menu-icon-wrapper bg-purple">
          <image src="/static/icons/png/filled/devices/stethoscope@2x.png" class="menu-icon-img" mode="aspectFit" />
          <view class="ripple-effect"></view>
        </view>
        <text class="menu-text">诊断信息</text>
        <text class="menu-hint">查看诊断报告结果</text>
      </view>
      
      <view 
        class="menu-item animate-fade-in-up" 
        :style="{ animationDelay: '0.3s' }"
        @click="handleItemClick('/pages/core-indicator/core-indicator', '核心指标')"
      >
        <view class="menu-icon-wrapper bg-orange">
          <image src="/static/icons/png/filled/graphs/chart_bar@2x.png" class="menu-icon-img" mode="aspectFit" />
          <view class="ripple-effect"></view>
        </view>
        <text class="menu-text">核心指标</text>
        <text class="menu-hint">查血指标趋势追踪</text>
      </view>
      
      <view 
        class="menu-item animate-fade-in-up" 
        :style="{ animationDelay: '0.35s' }"
        @click="handleItemClick('/pages/improvement-plan/improvement-plan', '指标提升方案')"
      >
        <view class="menu-icon-wrapper bg-cyan">
          <image src="/static/icons/png/filled/symbols/risk_analysis@2x.png" class="menu-icon-img" mode="aspectFit" />
          <view class="ripple-effect"></view>
        </view>
        <text class="menu-text">指标提升方案</text>
        <text class="menu-hint">个性化干预方案</text>
      </view>
    </view>
    
    <view class="bottom-space"></view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      isNavigating: false
    }
  },
  methods: {
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
    }
  }
}
</script>

<style scoped>
.health-manage-container {
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

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
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
  position: relative;
}

.menu-item:active .menu-icon-wrapper {
  transform: scale(1.1);
}

.bg-green {
  background-color: rgba(0, 157, 133, 0.1);
}

.bg-green .menu-icon-img {
  filter: brightness(0) saturate(100%) invert(42%) sepia(93%) saturate(389%) hue-rotate(131deg) brightness(93%) contrast(94%);
}

.bg-red {
  background-color: rgba(245, 108, 108, 0.1);
}

.bg-red .menu-icon-img {
  filter: brightness(0) saturate(100%) invert(35%) sepia(66%) saturate(654%) hue-rotate(349deg) brightness(100%) contrast(99%);
}

.bg-blue {
  background-color: rgba(59, 130, 246, 0.1);
}

.bg-blue .menu-icon-img {
  filter: brightness(0) saturate(100%) invert(37%) sepia(98%) saturate(2963%) hue-rotate(212deg) brightness(97%) contrast(104%);
}

.bg-purple {
  background-color: rgba(147, 51, 234, 0.1);
}

.bg-purple .menu-icon-img {
  filter: brightness(0) saturate(100%) invert(28%) sepia(96%) saturate(3882%) hue-rotate(271deg) brightness(91%) contrast(100%);
}

.bg-orange {
  background-color: rgba(251, 146, 60, 0.1);
}

.bg-orange .menu-icon-img {
  filter: brightness(0) saturate(100%) invert(54%) sepia(96%) saturate(1288%) hue-rotate(11deg) brightness(99%) contrast(99%);
}

.bg-cyan {
  background-color: rgba(6, 182, 212, 0.1);
}

.bg-cyan .menu-icon-img {
  filter: brightness(0) saturate(100%) invert(53%) sepia(90%) saturate(383%) hue-rotate(141deg) brightness(95%) contrast(105%);
}

.menu-icon {
  font-size: 36px;
  position: relative;
  z-index: 1;
}

.menu-icon-img {
  width: 36px;
  height: 36px;
  position: relative;
  z-index: 1;
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

.bottom-space {
  height: 100px;
}
</style>