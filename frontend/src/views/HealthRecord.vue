<template>
  <div class="health-record-container">
    <!-- 顶部导航栏 -->
    <div class="top-nav">
      <button class="nav-btn back-btn" @click="goBack">
        <span class="nav-icon">←</span>
      </button>
      <h1 class="nav-title">健康档案</h1>
      <div class="nav-btn-placeholder"></div>
    </div>
    
    <!-- 健康档案内容 -->
    <div class="health-record-content">
      <div class="record-card">
        <h2 class="card-title">健康基本信息</h2>
        <div class="record-item">
          <span class="item-label">过往病史</span>
          <span class="item-value">{{ healthRecord?.pastMedicalHistory || '无' }}</span>
        </div>
        <div class="record-item">
          <span class="item-label">过敏史</span>
          <span class="item-value">{{ healthRecord?.allergicHistory || '无' }}</span>
        </div>
        <div class="record-item">
          <span class="item-label">家族病史</span>
          <span class="item-value">{{ healthRecord?.familyMedicalHistory || '无' }}</span>
        </div>
        <div class="record-item">
          <span class="item-label">血型</span>
          <span class="item-value">{{ healthRecord?.bloodType || '未填写' }}</span>
        </div>
        <div class="record-item">
          <span class="item-label">其他信息</span>
          <span class="item-value">{{ healthRecord?.otherInfo || '无' }}</span>
        </div>
        
        <button class="btn-edit" @click="editHealthRecord">编辑档案</button>
      </div>
    </div>
    
    <!-- 底部导航栏 -->
    <div class="bottom-nav">
      <router-link to="/home" class="nav-item">
        <span class="nav-icon">🏠</span>
        <span class="nav-text">首页</span>
      </router-link>
      <router-link to="/health-record" class="nav-item active">
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
const healthRecord = ref(null)

const goBack = () => {
  router.back()
}

const getHealthRecord = async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/')
      return
    }
    const res = await axios.get('/health-record/info', {
      headers: {
        Authorization: token
      }
    })
    if (res.code === 200) {
      healthRecord.value = res.data
    }
  } catch (err) {
    console.log(err)
    alert('获取健康档案失败')
  }
}

const editHealthRecord = () => {
  // 这里可以跳转到编辑页面或显示编辑表单
  alert('编辑功能开发中')
}

onMounted(() => {
  getHealthRecord()
})
</script>

<style scoped>
.health-record-container {
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

/* 健康档案内容 */
.health-record-content {
  padding: 16px;
}

.record-card {
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

.record-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 12px 0;
  border-bottom: 1px solid #f5f5f5;
}

.record-item:last-child {
  border-bottom: none;
}

.item-label {
  font-size: 14px;
  color: #666;
  flex: 1;
}

.item-value {
  font-size: 14px;
  color: #333;
  flex: 2;
  text-align: right;
}

.btn-edit {
  background-color: #007AFF;
  color: #FFFFFF;
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
  text-align: center;
  margin-top: 20px;
  border: none;
  cursor: pointer;
  width: 100%;
}

.btn-edit:active {
  background-color: #0056b3;
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