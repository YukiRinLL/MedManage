<template>
  <view class="personal-info-container">
    <!-- 个人信息卡片 -->
    <view class="info-card" v-if="userInfo">
      <view class="info-item">
        <text class="info-label">手机号</text>
        <text class="info-value">{{ userInfo.phone }}</text>
      </view>
      
      <view class="info-item">
        <text class="info-label">姓名</text>
        <text class="info-value">{{ userInfo.name }}</text>
      </view>
      
      <view class="info-item">
        <text class="info-label">性别</text>
        <text class="info-value">{{ userInfo.gender === 0 ? '女' : '男' }}</text>
      </view>
      
      <view class="info-item">
        <text class="info-label">年龄</text>
        <text class="info-value">{{ userInfo.age || '未填写' }}</text>
      </view>
      
      <view class="info-item">
        <text class="info-label">身份证号</text>
        <text class="info-value">{{ userInfo.idCard || '未填写' }}</text>
      </view>
      
      <view class="info-item">
        <text class="info-label">紧急联系人</text>
        <text class="info-value">{{ userInfo.emergencyContact || '未填写' }}</text>
      </view>
      
      <view class="info-item">
        <text class="info-label">紧急联系电话</text>
        <text class="info-value">{{ userInfo.emergencyPhone || '未填写' }}</text>
      </view>
    </view>
    
    <!-- 修改按钮 -->
    <view class="action-section">
      <button class="btn-edit" @click="navigateToEdit">修改个人信息</button>
    </view>
  </view>
</template>

<script>
import { get } from '../../utils/request.js'

export default {
  data() {
    return {
      userInfo: null
    }
  },
  onLoad() {
    this.getUserInfo()
  },
  methods: {
    async getUserInfo() {
      try {
        const token = uni.getStorageSync('token')
        if (!token) {
          uni.navigateTo({
            url: '/pages/login/login'
          })
          return
        }
        const res = await get('/user/info')
        if (res.code === 200) {
          this.userInfo = res.data
        }
      } catch (err) {
        console.log(err)
        uni.showToast({
          title: '获取个人信息失败',
          icon: 'none'
        })
      }
    },
    navigateToEdit() {
      uni.navigateTo({
        url: '/pages/profile/edit-info'
      })
    }
  }
}
</script>

<style scoped>
.personal-info-container {
  padding: 0;
  min-height: 100vh;
  background-color: #f5f5f5;
}

/* 个人信息卡片 */
.info-card {
  background-color: #FFFFFF;
  margin: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.info-item {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 14px;
  color: #666;
  width: 100px;
}

.info-value {
  flex: 1;
  font-size: 14px;
  color: #333;
  text-align: right;
}

/* 操作按钮 */
.action-section {
  padding: 0 16px;
  margin-top: 24px;
}

.btn-edit {
  background-color: #009D85;
  color: #FFFFFF;
  border-radius: 8px;
  padding: 14px;
  font-size: 16px;
  font-weight: 500;
  text-align: center;
  border: none;
  width: 100%;
}

.btn-edit:active {
  background-color: #007D6B;
}
</style>