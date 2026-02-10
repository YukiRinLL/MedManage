<template>
  <div class="medication-container">
    <!-- 顶部导航栏 -->
    <div class="top-nav">
      <button class="nav-btn back-btn" @click="goBack">
        <span class="nav-icon">←</span>
      </button>
      <h1 class="nav-title">用药记录</h1>
      <button class="nav-btn add-btn" @click="addMedication">
        <span class="nav-icon">+</span>
      </button>
    </div>
    
    <!-- 用药记录内容 -->
    <div class="medication-content">
      <div class="medication-card">
        <h2 class="card-title">今日用药</h2>
        
        <div v-if="medications.length > 0" class="medication-list">
          <div v-for="med in medications" :key="med.id" class="medication-item">
            <div class="medication-header">
              <h3 class="medication-name">{{ med.medicationName }}</h3>
              <span class="medication-time">{{ formatDate(med.medicationTime) }}</span>
            </div>
            <div class="medication-details">
              <div class="detail-item">
                <span class="detail-label">剂量</span>
                <span class="detail-value">{{ med.dosage }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">频率</span>
                <span class="detail-value">{{ med.frequency }}</span>
              </div>
            </div>
            <div class="medication-actions">
              <label class="taken-checkbox">
                <input type="checkbox" v-model="med.taken" @change="updateTakenStatus(med.id, med.taken)" />
                <span class="checkbox-label">{{ med.taken ? '已服用' : '未服用' }}</span>
              </label>
            </div>
            <div v-if="med.notes" class="medication-notes">
              {{ med.notes }}
            </div>
          </div>
        </div>
        
        <div v-else class="empty-state">
          <div class="empty-icon">💊</div>
          <p class="empty-text">暂无用药记录</p>
          <p class="empty-subtext">点击右上角添加按钮记录您的用药情况</p>
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
      <router-link to="/medication" class="nav-item active">
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
const medications = ref([])

const goBack = () => {
  router.back()
}

const addMedication = () => {
  // 这里可以跳转到添加页面或显示添加表单
  alert('添加功能开发中')
}

const getMedications = async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/')
      return
    }
    const res = await axios.get('/medication/list', {
      headers: {
        Authorization: token
      }
    })
    if (res.code === 200) {
      medications.value = res.data
    }
  } catch (err) {
    console.log(err)
    alert('获取用药记录失败')
  }
}

const updateTakenStatus = async (id, taken) => {
  try {
    const token = localStorage.getItem('token')
    await axios.put(`/medication/update-taken/${id}`, {}, {
      params: { taken },
      headers: {
        Authorization: token
      }
    })
  } catch (err) {
    console.log(err)
    alert('更新用药状态失败')
  }
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleString()
}

onMounted(() => {
  getMedications()
})
</script>

<style scoped>
.medication-container {
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

/* 用药记录内容 */
.medication-content {
  padding: 16px;
}

.medication-card {
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

.medication-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.medication-item {
  padding: 16px;
  border-radius: 8px;
  background-color: #f9f9f9;
  border: 1px solid #f0f0f0;
}

.medication-header {
  margin-bottom: 12px;
}

.medication-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.medication-time {
  font-size: 12px;
  color: #666;
}

.medication-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-bottom: 12px;
}

.detail-item {
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

.medication-actions {
  margin-bottom: 12px;
}

.taken-checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.checkbox-label {
  font-size: 14px;
  color: #333;
}

.medication-notes {
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