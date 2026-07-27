<template>
  <view class="settings-container">
    <view class="section-header animate-fade-in">
      <view class="header-content">
        <text class="section-title">设置</text>
        <text class="section-desc">管理您的账户设置</text>
      </view>
    </view>

    <view class="settings-content">
      <view class="settings-card">
        <text class="card-title">账户安全</text>
        
        <view class="settings-item" @click="changePassword">
          <image src="/static/icons/png/filled/symbols/lock@2x.png" class="settings-icon" mode="aspectFit" />
          <text class="settings-text">修改密码</text>
          <text class="settings-arrow">›</text>
        </view>
        
        <view class="settings-item" @click="setPaymentPassword">
          <image src="/static/icons/png/filled/objects/credit_card@2x.png" class="settings-icon" mode="aspectFit" />
          <text class="settings-text">支付密码</text>
          <text class="settings-arrow">›</text>
        </view>
      </view>

      <view class="settings-card">
        <text class="card-title">通知设置</text>
        
        <view class="settings-item">
          <image src="/static/icons/png/filled/symbols/bell@2x.png" class="settings-icon" mode="aspectFit" />
          <text class="settings-text">消息通知</text>
          <switch class="settings-switch" :checked="notificationSettings.message" @change="toggleMessageNotification" />
        </view>
        
        <view class="settings-item">
          <image src="/static/icons/png/filled/symbols/alarm_clock@2x.png" class="settings-icon" mode="aspectFit" />
          <text class="settings-text">用药提醒</text>
          <switch class="settings-switch" :checked="notificationSettings.medication" @change="toggleMedicationNotification" />
        </view>
        
        <view class="settings-item">
          <image src="/static/icons/png/filled/symbols/calendar@2x.png" class="settings-icon" mode="aspectFit" />
          <text class="settings-text">复诊提醒</text>
          <switch class="settings-switch" :checked="notificationSettings.followUp" @change="toggleFollowUpNotification" />
        </view>
      </view>

      <view class="settings-card">
        <text class="card-title">隐私设置</text>
        
        <view class="settings-item">
          <image src="/static/icons/png/filled/symbols/eye@2x.png" class="settings-icon" mode="aspectFit" />
          <text class="settings-text">允许他人查看我的健康数据</text>
          <switch class="settings-switch" :checked="privacySettings.allowViewData" @change="toggleAllowViewData" />
        </view>
        
        <view class="settings-item">
          <image src="/static/icons/png/filled/symbols/users@2x.png" class="settings-icon" mode="aspectFit" />
          <text class="settings-text">允许医护人员查看我的数据</text>
          <switch class="settings-switch" :checked="privacySettings.allowStaffView" @change="toggleAllowStaffView" />
        </view>
      </view>

      <view class="settings-card">
        <text class="card-title">关于</text>
        
        <view class="settings-item" @click="navigateToAbout">
          <image src="/static/icons/png/filled/symbols/info@2x.png" class="settings-icon" mode="aspectFit" />
          <text class="settings-text">关于我们</text>
          <text class="settings-arrow">›</text>
        </view>
        
        <view class="settings-item" @click="checkUpdate">
          <image src="/static/icons/png/filled/symbols/update@2x.png" class="settings-icon" mode="aspectFit" />
          <text class="settings-text">检查更新</text>
          <text class="settings-value">版本 1.0.0</text>
        </view>
      </view>
    </view>

    <view class="bottom-space"></view>
  </view>
</template>

<script>
import { reactive } from '@vue/reactivity'

export default {
  data() {
    return {
      notificationSettings: reactive({
        message: true,
        medication: true,
        followUp: true
      }),
      privacySettings: reactive({
        allowViewData: false,
        allowStaffView: true
      })
    }
  },
  methods: {
    changePassword() {
      uni.showModal({
        title: '修改密码',
        content: '请联系客服进行密码修改',
        showCancel: false
      })
    },
    setPaymentPassword() {
      uni.showToast({
        title: '支付密码功能开发中',
        icon: 'none'
      })
    },
    toggleMessageNotification(e) {
      this.notificationSettings.message = e.detail.value
      uni.showToast({
        title: this.notificationSettings.message ? '消息通知已开启' : '消息通知已关闭',
        icon: 'none',
        duration: 1500
      })
    },
    toggleMedicationNotification(e) {
      this.notificationSettings.medication = e.detail.value
      uni.showToast({
        title: this.notificationSettings.medication ? '用药提醒已开启' : '用药提醒已关闭',
        icon: 'none',
        duration: 1500
      })
    },
    toggleFollowUpNotification(e) {
      this.notificationSettings.followUp = e.detail.value
      uni.showToast({
        title: this.notificationSettings.followUp ? '复诊提醒已开启' : '复诊提醒已关闭',
        icon: 'none',
        duration: 1500
      })
    },
    toggleAllowViewData(e) {
      this.privacySettings.allowViewData = e.detail.value
    },
    toggleAllowStaffView(e) {
      this.privacySettings.allowStaffView = e.detail.value
    },
    navigateToAbout() {
      uni.navigateTo({
        url: '/pages/profile/about'
      })
    },
    checkUpdate() {
      uni.showLoading({ title: '检查更新中...' })
      setTimeout(() => {
        uni.hideLoading()
        uni.showToast({
          title: '当前已是最新版本',
          icon: 'success'
        })
      }, 1000)
    }
  }
}
</script>

<style scoped>
.settings-container {
  padding: 0;
  min-height: 100vh;
  background-color: #F5F7FA;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.4s ease-out both;
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

.settings-content {
  padding: 16px;
}

.settings-card {
  background-color: #FFFFFF;
  border-radius: 12px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.card-title {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #909399;
  padding: 16px 20px 12px;
  border-bottom: 1px solid #F0F0F0;
}

.settings-item {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #F5F5F5;
}

.settings-item:last-child {
  border-bottom: none;
}

.settings-icon {
  width: 22px;
  height: 22px;
  margin-right: 12px;
}

.settings-text {
  flex: 1;
  font-size: 16px;
  color: #303133;
}

.settings-arrow {
  font-size: 20px;
  color: #C0C4CC;
}

.settings-value {
  font-size: 14px;
  color: #909399;
}

.settings-switch {
  transform: scale(0.8);
}

.bottom-space {
  height: 100px;
}
</style>