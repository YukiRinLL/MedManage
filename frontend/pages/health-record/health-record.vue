<template>
  <view class="health-record-container">
    <!-- 健康评估卡片 -->
    <view class="health-assessment-card" v-if="healthRecord">
      <text class="assessment-title">健康评估</text>
      <view class="assessment-score">
        <text class="score-number">{{ healthScore }}</text>
        <text class="score-label">健康评分</text>
      </view>
      <view class="assessment-status" :class="getHealthStatusClass(healthScore)">
        {{ getHealthStatusText(healthScore) }}
      </view>
      <view class="health-suggestions">
        <text class="suggestion-title">健康建议</text>
        <view class="suggestion-item" v-for="(suggestion, index) in healthSuggestions" :key="index">
          <text class="suggestion-icon">💡</text>
          <text class="suggestion-text">{{ suggestion }}</text>
        </view>
      </view>
    </view>
    
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
            <textarea 
              class="form-textarea" 
              v-model="editForm.pastMedicalHistory" 
              placeholder="请输入过往病史，若无请填写'无'"
              placeholder-class="form-textarea-placeholder"
              :focus="pastMedicalHistoryFocus"
              @focus="pastMedicalHistoryFocus = true"
              @blur="pastMedicalHistoryFocus = false"
            ></textarea>
          </view>
          <view class="form-item">
            <text class="form-label">过敏史</text>
            <textarea 
              class="form-textarea" 
              v-model="editForm.allergicHistory" 
              placeholder="请输入过敏史，若无请填写'无'"
              placeholder-class="form-textarea-placeholder"
              :focus="allergicHistoryFocus"
              @focus="allergicHistoryFocus = true"
              @blur="allergicHistoryFocus = false"
            ></textarea>
          </view>
          <view class="form-item">
            <text class="form-label">家族病史</text>
            <textarea 
              class="form-textarea" 
              v-model="editForm.familyMedicalHistory" 
              placeholder="请输入家族病史，若无请填写'无'"
              placeholder-class="form-textarea-placeholder"
              :focus="familyMedicalHistoryFocus"
              @focus="familyMedicalHistoryFocus = true"
              @blur="familyMedicalHistoryFocus = false"
            ></textarea>
          </view>
          <view class="form-item">
            <text class="form-label">血型</text>
            <picker mode="selector" :range="bloodTypes" @change="onBloodTypeChange">
              <view class="picker">{{ editForm.bloodType || '请选择血型' }}</view>
            </picker>
          </view>
          <view class="form-item">
            <text class="form-label">其他信息</text>
            <textarea 
              class="form-textarea" 
              v-model="editForm.otherInfo" 
              placeholder="请输入其他健康相关信息，若无请填写'无'"
              placeholder-class="form-textarea-placeholder"
              :focus="otherInfoFocus"
              @focus="otherInfoFocus = true"
              @blur="otherInfoFocus = false"
            ></textarea>
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
      bloodTypes: ['A', 'B', 'AB', 'O', '其他'],
      pastMedicalHistoryFocus: false,
      allergicHistoryFocus: false,
      familyMedicalHistoryFocus: false,
      otherInfoFocus: false,
      healthScore: 85,
      healthSuggestions: [
        '保持规律作息，保证充足睡眠',
        '均衡饮食，多吃蔬菜水果',
        '适量运动，增强体质',
        '定期体检，关注健康状况'
      ]
    }
  },
  computed: {
    // 根据健康记录计算健康评分
    calculatedHealthScore() {
      if (!this.healthRecord) return 85
      
      let score = 100
      
      // 根据过往病史扣分
      if (this.healthRecord.pastMedicalHistory && this.healthRecord.pastMedicalHistory !== '无') {
        score -= 10
      }
      
      // 根据过敏史扣分
      if (this.healthRecord.allergicHistory && this.healthRecord.allergicHistory !== '无') {
        score -= 5
      }
      
      // 根据家族病史扣分
      if (this.healthRecord.familyMedicalHistory && this.healthRecord.familyMedicalHistory !== '无') {
        score -= 8
      }
      
      return Math.max(score, 60)
    }
  },
  watch: {
    healthRecord: {
      handler() {
        if (this.healthRecord) {
          this.healthScore = this.calculatedHealthScore
          this.updateHealthSuggestions()
        }
      },
      deep: true
    }
  },
  onLoad() {
    this.getHealthRecord()
  },
  methods: {
    getHealthStatusClass(score) {
      if (score >= 90) return 'status-excellent'
      if (score >= 80) return 'status-good'
      if (score >= 70) return 'status-normal'
      return 'status-poor'
    },
    getHealthStatusText(score) {
      if (score >= 90) return '健康状态优秀'
      if (score >= 80) return '健康状态良好'
      if (score >= 70) return '健康状态一般'
      return '健康状态需要关注'
    },
    updateHealthSuggestions() {
      if (!this.healthRecord) return
      
      const suggestions = ['保持规律作息，保证充足睡眠', '均衡饮食，多吃蔬菜水果', '适量运动，增强体质']
      
      if (this.healthRecord.pastMedicalHistory && this.healthRecord.pastMedicalHistory !== '无') {
        suggestions.push('定期复查，遵医嘱治疗')
      }
      
      if (this.healthRecord.allergicHistory && this.healthRecord.allergicHistory !== '无') {
        suggestions.push('避免接触过敏原')
      }
      
      if (this.healthRecord.familyMedicalHistory && this.healthRecord.familyMedicalHistory !== '无') {
        suggestions.push('关注家族遗传疾病风险，定期体检')
      }
      
      this.healthSuggestions = suggestions
    },
    async getHealthRecord() {
      try {
        const token = uni.getStorageSync('token')
        if (!token) {
          uni.navigateTo({
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
          uni.navigateTo({
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

/* 健康评估卡片 */
.health-assessment-card {
  background-color: #009D85;
  color: #FFFFFF;
  padding: 24px;
  margin: 16px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 157, 133, 0.3);
}

.assessment-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  display: block;
}

.assessment-score {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 16px;
}

.score-number {
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 4px;
}

.score-label {
  font-size: 14px;
  opacity: 0.9;
}

.assessment-status {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 20px;
  align-self: center;
}

.status-excellent {
  background-color: rgba(255, 255, 255, 0.2);
  color: #FFFFFF;
}

.status-good {
  background-color: rgba(255, 255, 255, 0.2);
  color: #FFFFFF;
}

.status-normal {
  background-color: rgba(255, 255, 255, 0.2);
  color: #FFFFFF;
}

.status-poor {
  background-color: rgba(245, 108, 108, 0.2);
  color: #FFFFFF;
}

.health-suggestions {
  margin-top: 20px;
}

.suggestion-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  display: block;
}

.suggestion-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 10px;
}

.suggestion-icon {
  font-size: 16px;
  margin-right: 8px;
  margin-top: 2px;
}

.suggestion-text {
  flex: 1;
  font-size: 14px;
  line-height: 1.4;
  opacity: 0.95;
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
  min-height: 80px;
  padding: 12px;
  border: 1px solid #E5E5E5;
  border-radius: 8px;
  font-size: 14px;
  resize: none;
  font-family: inherit;
  box-sizing: border-box;
  line-height: 1.5;
}

.form-textarea-placeholder {
  color: #999999;
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
  background-color: #009D85;
  color: #FFFFFF;
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  margin-top: 20px;
  border: none;
  width: 100%;
}

.btn-edit:active {
  background-color: #007D6B;
}

.btn-cancel {
  flex: 1;
  background-color: #F5F7FA;
  color: #606266;
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
  text-align: center;
  border: 1px solid #DCDFE6;
}

.btn-cancel:active {
  background-color: #EBEEF5;
}

.btn-save {
  flex: 1;
  background-color: #009D85;
  color: #FFFFFF;
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  border: none;
}

.btn-save:active {
  background-color: #007D6B;
}
</style>