<template>
  <div class="vital-sign-container">
    <!-- 顶部导航栏 -->
    <div class="top-nav">
      <button class="nav-btn back-btn" @click="goBack">
        <span class="nav-icon">←</span>
      </button>
      <h1 class="nav-title">生命体征</h1>
      <button class="nav-btn add-btn" @click="addVitalSign">
        <span class="nav-icon">+</span>
      </button>
    </div>
    
    <!-- 生命体征内容 -->
    <div class="vital-sign-content">
      <div class="vital-card">
        <h2 class="card-title">最近记录</h2>
        
        <div v-if="vitalSigns.length > 0" class="vital-list">
          <div v-for="sign in vitalSigns" :key="sign.id" class="vital-item">
            <div class="vital-header">
              <span class="vital-time">{{ formatDate(sign.recordTime) }}</span>
              <span class="vital-status" :class="{ normal: isNormal(sign) }">
                {{ isNormal(sign) ? '正常' : '异常' }}
              </span>
            </div>
            <div class="vital-details">
              <div class="vital-detail-item">
                <span class="detail-label">体温</span>
                <span class="detail-value">{{ sign.temperature }}℃</span>
              </div>
              <div class="vital-detail-item">
                <span class="detail-label">血压</span>
                <span class="detail-value">{{ sign.systolicPressure }}/{{ sign.diastolicPressure }}mmHg</span>
              </div>
              <div class="vital-detail-item">
                <span class="detail-label">血糖</span>
                <span class="detail-value">{{ sign.bloodSugar }}mmol/L</span>
              </div>
              <div class="vital-detail-item">
                <span class="detail-label">心率</span>
                <span class="detail-value">{{ sign.heartRate }}bpm</span>
              </div>
            </div>
            <div v-if="sign.notes" class="vital-notes">
              {{ sign.notes }}
            </div>
          </div>
        </div>
        
        <div v-else class="empty-state">
          <div class="empty-icon">📊</div>
          <p class="empty-text">暂无生命体征记录</p>
          <p class="empty-subtext">点击右上角添加按钮记录您的生命体征</p>
        </div>
      </div>
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
      <router-link to="/profile" class="nav-item">
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
const vitalSigns = ref([])

const goBack = () => {
  router.back()
}

const addVitalSign = () => {
  // 这里可以跳转到添加页面或显示添加表单
  alert('添加功能开发中')
}

const getVitalSigns = async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/')
      return
    }
    const res = await axios.get('/vital-sign/list', {
      headers: {
        Authorization: token
      }
    })
    if (res.code === 200) {
      vitalSigns.value = res.data
    }
  } catch (err) {
    console.log(err)
    alert('获取生命体征数据失败')
  }
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleString()
}

const isNormal = (sign) => {
  // 简单的正常范围判断
  const tempNormal = sign.temperature >= 36.0 && sign.temperature <= 37.3
  const pressureNormal = sign.systolicPressure >= 90 && sign.systolicPressure <= 140 && 
                        sign.diastolicPressure >= 60 && sign.diastolicPressure <= 90
  const sugarNormal = sign.bloodSugar >= 3.9 && sign.bloodSugar <= 6.1
  const heartRateNormal = sign.heartRate >= 60 && sign.heartRate <= 100
  
  return tempNormal && pressureNormal && sugarNormal && heartRateNormal
}

onMounted(() => {
  getVitalSigns()
})
</script>

<style scoped>
.vital-sign-container {
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

.add-btn {
  font-size: 24px;
}

.nav-icon {
  font-size: 20px;
}

/* 生命体征内容 */
.vital-sign-content {
  padding: 16px;
}

.vital-card {
  background-color: #FFFFFF;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.vital-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.vital-item {
  padding: 16px;
  border-radius: 8px;
  background-color: #f9f9f9;
  border: 1px solid #f0f0f0;
}

.vital-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.vital-time {
  font-size: 12px;
  color: #666;
}

.vital-status {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 10px;
  background-color: #ff3b30;
  color: white;
}

.vital-status.normal {
  background-color: #34c759;
}

.vital-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 12px;
}

.vital-detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-label {
  font-size: 14px;
  color: #666;
}

.detail-value {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.vital-notes {
  font-size: 12px;
  color: #666;
  padding-top: 8px;
  border-top: 1px dashed #f0f0f0;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

.empty-subtext {
  font-size: 14px;
  color: #666;
  margin: 0;
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