<template>
  <view class="health-record-container">
    <!-- 健康档案内容 -->
    <view class="health-record-content">
      <view class="record-card">
        <text class="card-title">健康基本信息</text>
        
        <!-- 查看模式 -->
        <view v-if="!isEditing">
          <view class="record-item">
            <text class="item-label">过往病史</text>
            <text class="item-value">{{ healthRecord?.pastMedicalHistory || '无' }}</text>
          </view>
          <view class="record-item">
            <text class="item-label">过敏史</text>
            <text class="item-value">{{ healthRecord?.allergicHistory || '无' }}</text>
          </view>
          <view class="record-item">
            <text class="item-label">家族病史</text>
            <text class="item-value">{{ healthRecord?.familyMedicalHistory || '无' }}</text>
          </view>
          <view class="record-item">
            <text class="item-label">血型</text>
            <text class="item-value">{{ healthRecord?.bloodType || '未填写' }}</text>
          </view>
          <view class="record-item">
            <text class="item-label">其他信息</text>
            <text class="item-value">{{ healthRecord?.otherInfo || '无' }}</text>
          </view>
          
          <button class="btn-edit" @click="startEditing">编辑档案</button>
        </view>
        
        <!-- 编辑模式 -->
        <view v-else>
          <view class="form-item">
            <text class="form-label">过往病史</text>
            <textarea class="form-textarea" v-model="editForm.pastMedicalHistory" placeholder="请输入过往病史，若无请填写'无'" rows="3"></textarea>
          </view>
          <view class="form-item">
            <text class="form-label">过敏史</text>
            <textarea class="form-textarea" v-model="editForm.allergicHistory" placeholder="请输入过敏史，若无请填写'无'" rows="3"></textarea>
          </view>
          <view class="form-item">
            <text class="form-label">家族病史</text>
            <textarea class="form-textarea" v-model="editForm.familyMedicalHistory" placeholder="请输入家族病史，若无请填写'无'" rows="3"></textarea>
          </view>
          <view class="form-item">
            <text class="form-label">血型</text>
            <picker mode="selector" :range="bloodTypes" @change="onBloodTypeChange">
              <view class="picker">{{ editForm.bloodType || '请选择血型' }}</view>
            </picker>
          </view>
          <view class="form-item">
            <text class="form-label">其他信息</text>
            <textarea class="form-textarea" v-model="editForm.otherInfo" placeholder="请输入其他健康相关信息，若无请填写'无'" rows="3"></textarea>
          </view>
          
          <view class="form-actions">
            <button class="btn-cancel" @click="cancelEditing">取消</button>
            <button class="btn-save" @click="saveHealthRecord">保存</button>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { get, put } from '../../utils/request.js'

export default {
  data() {
    return {
      healthRecord: null,
      isEditing: false,
      editForm: {
        pastMedicalHistory: '',
        allergicHistory: '',
        familyMedicalHistory: '',
        bloodType: '',
        otherInfo: ''
      },
      bloodTypes: ['A', 'B', 'AB', 'O', '其他']
    }
  },
  onLoad() {
    this.getHealthRecord()
  },
  methods: {
    async getHealthRecord() {
      try {
        const token = uni.getStorageSync('token')
        if (!token) {
          uni.switchTab({
            url: '/pages/login/login'
          })
          return
        }
        const res = await get('/health-record/info')
        if (res.code === 200) {
          this.healthRecord = res.data
        }
      } catch (err) {
        console.log(err)
        uni.showToast({
          title: '获取健康档案失败',
          icon: 'none'
        })
      }
    },
    startEditing() {
      this.editForm = {
        pastMedicalHistory: this.healthRecord?.pastMedicalHistory || '',
        allergicHistory: this.healthRecord?.allergicHistory || '',
        familyMedicalHistory: this.healthRecord?.familyMedicalHistory || '',
        bloodType: this.healthRecord?.bloodType || '',
        otherInfo: this.healthRecord?.otherInfo || ''
      }
      this.isEditing = true
    },
    cancelEditing() {
      this.isEditing = false
    },
    onBloodTypeChange(e) {
      this.editForm.bloodType = this.bloodTypes[e.detail.value]
    },
    async saveHealthRecord() {
      try {
        const token = uni.getStorageSync('token')
        if (!token) {
          uni.switchTab({
            url: '/pages/login/login'
          })
          return
        }
        
        const res = await put('/health-record/update', this.editForm)
        
        if (res.code === 200) {
          this.healthRecord = { ...this.editForm }
          this.isEditing = false
          uni.showToast({
            title: '保存成功',
            icon: 'success'
          })
        }
      } catch (err) {
        console.log(err)
        uni.showToast({
          title: '保存失败，请检查网络连接',
          icon: 'none'
        })
      }
    }
  }
}
</script>

<style scoped>
.health-record-container {
  padding: 0;
  min-height: 100vh;
  background-color: #f5f5f5;
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
  display: block;
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

.picker {
  width: 100%;
  padding: 12px;
  border: 1px solid #E5E5E5;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  box-sizing: border-box;
  background-color: #fff;
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
  width: 100%;
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
}
</style>