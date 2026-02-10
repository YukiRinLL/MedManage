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
        
        <!-- 查看模式 -->
        <div v-if="!isEditing">
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
          
          <button class="btn-edit" @click="startEditing">编辑档案</button>
        </div>
        
        <!-- 编辑模式 -->
        <div v-else>
          <div class="form-item">
            <label class="form-label">过往病史</label>
            <textarea class="form-textarea" v-model="editForm.pastMedicalHistory" placeholder="请输入过往病史，若无请填写'无'" rows="3"></textarea>
          </div>
          <div class="form-item">
            <label class="form-label">过敏史</label>
            <textarea class="form-textarea" v-model="editForm.allergicHistory" placeholder="请输入过敏史，若无请填写'无'" rows="3"></textarea>
          </div>
          <div class="form-item">
            <label class="form-label">家族病史</label>
            <textarea class="form-textarea" v-model="editForm.familyMedicalHistory" placeholder="请输入家族病史，若无请填写'无'" rows="3"></textarea>
          </div>
          <div class="form-item">
            <label class="form-label">血型</label>
            <select class="form-select" v-model="editForm.bloodType">
              <option value="">请选择血型</option>
              <option value="A">A型</option>
              <option value="B">B型</option>
              <option value="AB">AB型</option>
              <option value="O">O型</option>
              <option value="其他">其他</option>
            </select>
          </div>
          <div class="form-item">
            <label class="form-label">其他信息</label>
            <textarea class="form-textarea" v-model="editForm.otherInfo" placeholder="请输入其他健康相关信息，若无请填写'无'" rows="3"></textarea>
          </div>
          
          <div class="form-actions">
            <button class="btn-cancel" @click="cancelEditing">取消</button>
            <button class="btn-save" @click="saveHealthRecord">保存</button>
          </div>
        </div>
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
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAxios } from '../composables/useAxios.js'

const router = useRouter()
const { axios } = useAxios()
const healthRecord = ref(null)
const isEditing = ref(false)
const editForm = ref({
  pastMedicalHistory: '',
  allergicHistory: '',
  familyMedicalHistory: '',
  bloodType: '',
  otherInfo: ''
})

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

const startEditing = () => {
  // 复制当前健康档案数据到编辑表单
  editForm.value = {
    pastMedicalHistory: healthRecord.value?.pastMedicalHistory || '',
    allergicHistory: healthRecord.value?.allergicHistory || '',
    familyMedicalHistory: healthRecord.value?.familyMedicalHistory || '',
    bloodType: healthRecord.value?.bloodType || '',
    otherInfo: healthRecord.value?.otherInfo || ''
  }
  isEditing.value = true
}

const cancelEditing = () => {
  isEditing.value = false
}

const saveHealthRecord = async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/')
      return
    }
    
    const res = await axios.put('/health-record/update', editForm.value, {
      headers: {
        Authorization: token
      }
    })
    
    if (res.code === 200) {
      // 更新本地健康档案数据
      healthRecord.value = { ...editForm.value }
      isEditing.value = false
      alert('保存成功')
    }
  } catch (err) {
    console.log(err)
    alert('保存失败，请检查网络连接')
  }
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

/* 查看模式样式 */
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

/* 编辑模式样式 */
.form-item {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.form-textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #E5E5E5;
  border-radius: 8px;
  font-size: 14px;
  resize: none;
  font-family: inherit;
  box-sizing: border-box;
}

.form-select {
  width: 100%;
  padding: 12px;
  border: 1px solid #E5E5E5;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  box-sizing: border-box;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
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

.btn-cancel {
  flex: 1;
  background-color: #F2F2F7;
  color: #333;
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
  text-align: center;
  border: none;
  cursor: pointer;
}

.btn-cancel:active {
  background-color: #E5E5EA;
}

.btn-save {
  flex: 1;
  background-color: #007AFF;
  color: #FFFFFF;
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
  text-align: center;
  border: none;
  cursor: pointer;
}

.btn-save:active {
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