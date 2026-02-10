<template>
  <div class="profile-container">
    <!-- 顶部导航栏 -->
    <div class="top-nav">
      <button class="nav-btn back-btn" @click="goBack">
        <span class="nav-icon">←</span>
      </button>
      <h1 class="nav-title">个人信息</h1>
      <div class="nav-btn-placeholder"></div>
    </div>
    
    <!-- 个人信息卡片 -->
    <div class="profile-card" v-if="userInfo">
      <div class="form">
        <div class="form-item">
          <label class="form-label">手机号</label>
          <input class="form-input" type="number" v-model="userInfo.phone" disabled />
        </div>
        
        <div class="form-item">
          <label class="form-label">姓名</label>
          <input class="form-input" type="text" v-model="userInfo.name" />
        </div>
        
        <div class="form-item">
          <label class="form-label">性别</label>
          <div class="gender-selector">
            <label class="gender-option" :class="{ active: userInfo.gender === 0 }">
              <input type="radio" v-model="userInfo.gender" :value="0" style="display: none;" />
              <span>女</span>
            </label>
            <label class="gender-option" :class="{ active: userInfo.gender === 1 }">
              <input type="radio" v-model="userInfo.gender" :value="1" style="display: none;" />
              <span>男</span>
            </label>
          </div>
        </div>
        
        <div class="form-item">
          <label class="form-label">年龄</label>
          <input class="form-input" type="number" v-model="userInfo.age" />
        </div>
        
        <div class="form-item">
          <label class="form-label">身份证号</label>
          <input class="form-input" type="text" v-model="userInfo.idCard" />
        </div>
        
        <div class="form-item">
          <label class="form-label">紧急联系人</label>
          <input class="form-input" type="text" v-model="userInfo.emergencyContact" />
        </div>
        
        <div class="form-item">
          <label class="form-label">紧急联系电话</label>
          <input class="form-input" type="number" v-model="userInfo.emergencyPhone" />
        </div>
        
        <button class="btn-primary" @click="updateProfile">保存修改</button>
      </div>
    </div>
    
    <!-- 退出登录按钮 -->
    <div class="logout-section">
      <button class="btn-logout" @click="logout">退出登录</button>
    </div>
    
    <!-- 底部导航栏 -->
    <div class="bottom-nav">
      <router-link to="/home" class="nav-item">
        <span class="nav-icon">🏠</span>
        <span class="nav-text">首页</span>
      </router-link>
      <router-link to="/health-record" class="nav-item">
        <span class="nav-icon">📋</span>
        <span class="nav-text">健康</span>
      </router-link>
      <router-link to="/medication" class="nav-item">
        <span class="nav-icon">💊</span>
        <span class="nav-text">用药</span>
      </router-link>
      <router-link to="/notification" class="nav-item">
        <span class="nav-icon">🔔</span>
        <span class="nav-text">通知</span>
      </router-link>
      <router-link to="/profile" class="nav-item active">
        <span class="nav-icon">👤</span>
        <span class="nav-text">我的</span>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAxios } from '../composables/useAxios.js'

const router = useRouter()
const { axios } = useAxios()
const userInfo = ref(null)

const getUserInfo = async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/')
      return
    }
    const res = await axios.get('/user/info', {
      headers: {
        Authorization: token
      }
    })
    if (res.code === 200) {
      userInfo.value = res.data
    }
  } catch (err) {
    console.log(err)
    alert('获取个人信息失败')
  }
}

const updateProfile = async () => {
  try {
    const token = localStorage.getItem('token')
    const res = await axios.put('/user/update', userInfo.value, {
      headers: {
        Authorization: token
      }
    })
    if (res.code === 200) {
      alert('更新成功')
    }
  } catch (err) {
    console.log(err)
    alert('更新失败，请检查网络连接')
  }
}

const goBack = () => {
  router.back()
}

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/')
}

onMounted(() => {
  getUserInfo()
})
</script>

<style scoped>
.profile-container {
  padding: 0;
  min-height: 100vh;
  background-color: #f5f5f5;
  position: relative;
  padding-bottom: 60px;
}

/* 顶部导航栏 */
.top-nav {
  background-color: #007AFF;
  color: white;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.nav-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  flex: 1;
  text-align: center;
}

.nav-btn {
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-btn:active {
  background-color: rgba(255, 255, 255, 0.2);
}

.back-btn {
  font-size: 24px;
}

.nav-btn-placeholder {
  width: 36px;
}

.nav-icon {
  font-size: 20px;
}

/* 个人信息卡片 */
.profile-card {
  background-color: #FFFFFF;
  border-radius: 12px;
  margin: 16px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form {
  width: 100%;
}

.form-item {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: 14px;
  color: #666666;
  margin-bottom: 8px;
}

.form-input {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #E5E5E5;
  border-radius: 8px;
  font-size: 16px;
  background-color: #FFFFFF;
  box-sizing: border-box;
}

.form-input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.gender-selector {
  display: flex;
  gap: 12px;
}

.gender-option {
  flex: 1;
  padding: 12px;
  border: 1px solid #E5E5E5;
  border-radius: 8px;
  text-align: center;
  font-size: 16px;
  cursor: pointer;
}

.gender-option.active {
  background-color: #007AFF;
  color: #FFFFFF;
  border-color: #007AFF;
}

.btn-primary {
  background-color: #007AFF;
  color: #FFFFFF;
  border-radius: 8px;
  padding: 14px;
  font-size: 16px;
  text-align: center;
  margin-top: 20px;
  margin-bottom: 10px;
  border: none;
  cursor: pointer;
  width: 100%;
}

.btn-primary:active {
  background-color: #0056b3;
}

/* 退出登录按钮 */
.logout-section {
  padding: 0 16px;
  margin-top: 20px;
}

.btn-logout {
  background-color: #ffffff;
  color: #ff3b30;
  border: 1px solid #ff3b30;
  border-radius: 8px;
  padding: 14px;
  font-size: 16px;
  text-align: center;
  cursor: pointer;
  width: 100%;
}

.btn-logout:active {
  background-color: #ffebee;
}

/* 底部导航栏 */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: white;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 8px 0;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  z-index: 99;
  height: 60px;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: #666;
  font-size: 12px;
  padding: 4px 0;
  flex: 1;
}

.nav-item.active {
  color: #007AFF;
}

.nav-item .nav-icon {
  font-size: 20px;
  margin-bottom: 4px;
}

.nav-item .nav-text {
  font-size: 10px;
}
</style>