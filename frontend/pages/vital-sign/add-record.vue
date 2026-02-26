<template>
  <view class="add-record-container">
    <view class="form">
      <view class="form-item">
        <text class="form-label">体温 (℃)</text>
        <input 
          class="form-input" 
          type="number" 
          v-model="formData.temperature" 
          placeholder="请输入体温"
          placeholder-class="form-input-placeholder"
          :focus="temperatureFocus"
          @focus="temperatureFocus = true"
          @blur="temperatureFocus = false"
        />
      </view>
      
      <view class="form-item">
        <text class="form-label">收缩压 (mmHg)</text>
        <input 
          class="form-input" 
          type="number" 
          v-model="formData.systolicPressure" 
          placeholder="请输入收缩压"
          placeholder-class="form-input-placeholder"
          :focus="systolicFocus"
          @focus="systolicFocus = true"
          @blur="systolicFocus = false"
        />
      </view>
      
      <view class="form-item">
        <text class="form-label">舒张压 (mmHg)</text>
        <input 
          class="form-input" 
          type="number" 
          v-model="formData.diastolicPressure" 
          placeholder="请输入舒张压"
          placeholder-class="form-input-placeholder"
          :focus="diastolicFocus"
          @focus="diastolicFocus = true"
          @blur="diastolicFocus = false"
        />
      </view>
      
      <view class="form-item">
        <text class="form-label">血糖 (mmol/L)</text>
        <input 
          class="form-input" 
          type="number" 
          v-model="formData.bloodSugar" 
          placeholder="请输入血糖"
          placeholder-class="form-input-placeholder"
          :focus="sugarFocus"
          @focus="sugarFocus = true"
          @blur="sugarFocus = false"
        />
      </view>
      
      <view class="form-item">
        <text class="form-label">心率 (bpm)</text>
        <input 
          class="form-input" 
          type="number" 
          v-model="formData.heartRate" 
          placeholder="请输入心率"
          placeholder-class="form-input-placeholder"
          :focus="heartRateFocus"
          @focus="heartRateFocus = true"
          @blur="heartRateFocus = false"
        />
      </view>
      
      <view class="form-item">
        <text class="form-label">备注</text>
        <textarea 
          class="form-textarea" 
          v-model="formData.notes" 
          placeholder="请输入备注信息（可选）"
          placeholder-class="form-textarea-placeholder"
          :focus="notesFocus"
          @focus="notesFocus = true"
          @blur="notesFocus = false"
        ></textarea>
      </view>
      
      <view class="form-actions">
        <button class="btn-cancel" @click="cancel">取消</button>
        <button class="btn-save" @click="saveRecord">保存记录</button>
      </view>
    </view>
  </view>
</template>

<script>
import { post } from '../../utils/request.js'

export default {
  data() {
    return {
      formData: {
        temperature: '',
        systolicPressure: '',
        diastolicPressure: '',
        bloodSugar: '',
        heartRate: '',
        notes: ''
      },
      temperatureFocus: false,
      systolicFocus: false,
      diastolicFocus: false,
      sugarFocus: false,
      heartRateFocus: false,
      notesFocus: false
    }
  },
  methods: {
    async saveRecord() {
      // 表单验证
      if (!this.formData.temperature) {
        uni.showToast({
          title: '请输入体温',
          icon: 'none'
        })
        return
      }
      if (!this.formData.systolicPressure || !this.formData.diastolicPressure) {
        uni.showToast({
          title: '请输入血压',
          icon: 'none'
        })
        return
      }
      if (!this.formData.bloodSugar) {
        uni.showToast({
          title: '请输入血糖',
          icon: 'none'
        })
        return
      }
      if (!this.formData.heartRate) {
        uni.showToast({
          title: '请输入心率',
          icon: 'none'
        })
        return
      }
      
      try {
        const token = uni.getStorageSync('token')
        if (!token) {
          uni.navigateTo({
            url: '/pages/login/login'
          })
          return
        }
        
        const recordData = {
          temperature: parseFloat(this.formData.temperature),
          systolicPressure: parseInt(this.formData.systolicPressure),
          diastolicPressure: parseInt(this.formData.diastolicPressure),
          bloodSugar: parseFloat(this.formData.bloodSugar),
          heartRate: parseInt(this.formData.heartRate),
          notes: this.formData.notes
        }
        
        await post('/vital-sign/add', recordData)
        uni.showToast({
          title: '记录保存成功',
          icon: 'success'
        })
        setTimeout(() => {
          uni.navigateBack()
        }, 1000)
      } catch (err) {
        console.log(err)
        uni.showToast({
          title: '保存失败，请检查网络连接',
          icon: 'none'
        })
      }
    },
    cancel() {
      uni.navigateBack()
    }
  }
}
</script>

<style scoped>
.add-record-container {
  padding: 16px;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.form {
  background-color: #FFFFFF;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-item {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.form-input {
  width: 100%;
  height: 48px;
  padding: 0 14px;
  border: 1px solid #E5E5E5;
  border-radius: 8px;
  font-size: 14px;
  background-color: #FFFFFF;
  box-sizing: border-box;
  line-height: 48px;
}

.form-input-placeholder {
  color: #999999;
}

.form-textarea {
  width: 100%;
  min-height: 100px;
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

/* 操作按钮 */
.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 30px;
}

.btn-cancel {
  flex: 1;
  background-color: #F5F7FA;
  color: #606266;
  border-radius: 8px;
  padding: 14px;
  font-size: 16px;
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
  padding: 14px;
  font-size: 16px;
  font-weight: 500;
  text-align: center;
  border: none;
}

.btn-save:active {
  background-color: #007D6B;
}
</style>