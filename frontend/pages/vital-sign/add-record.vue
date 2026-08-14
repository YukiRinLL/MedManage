<template>
  <view class="add-record-container">
    <view class="form">
      <view class="form-item">
        <text class="form-label">今日体重 (kg)</text>
        <input
          class="form-input"
          type="digit"
          v-model="formData.weight"
          placeholder="请输入今日体重"
          placeholder-class="form-input-placeholder"
        />
      </view>

      <view class="form-item">
        <text class="form-label">早上血压 (mmHg)</text>
        <view class="bp-row">
          <input
            class="form-input bp-input"
            type="number"
            v-model="formData.morningSystolicPressure"
            placeholder="收缩压"
            placeholder-class="form-input-placeholder"
          />
          <text class="bp-separator">/</text>
          <input
            class="form-input bp-input"
            type="number"
            v-model="formData.morningDiastolicPressure"
            placeholder="舒张压"
            placeholder-class="form-input-placeholder"
          />
        </view>
      </view>

      <view class="form-item">
        <text class="form-label">晚上血压 (mmHg)</text>
        <view class="bp-row">
          <input
            class="form-input bp-input"
            type="number"
            v-model="formData.eveningSystolicPressure"
            placeholder="收缩压"
            placeholder-class="form-input-placeholder"
          />
          <text class="bp-separator">/</text>
          <input
            class="form-input bp-input"
            type="number"
            v-model="formData.eveningDiastolicPressure"
            placeholder="舒张压"
            placeholder-class="form-input-placeholder"
          />
        </view>
      </view>

      <view class="form-item">
        <text class="form-label">血糖记录 (mmol/L)</text>
        <input
          class="form-input"
          type="digit"
          v-model="formData.bloodSugar"
          placeholder="请输入血糖值"
          placeholder-class="form-input-placeholder"
        />
      </view>

      <view class="form-item">
        <text class="form-label">今日饮水量 (ml)</text>
        <input
          class="form-input"
          type="number"
          v-model="formData.waterIntake"
          placeholder="请输入今日饮水量"
          placeholder-class="form-input-placeholder"
        />
      </view>

      <view class="form-item">
        <text class="form-label">饮食记录</text>
        <textarea
          class="form-textarea"
          v-model="formData.dietRecord"
          placeholder="请输入今日饮食记录（可选）"
          placeholder-class="form-textarea-placeholder"
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
        weight: '',
        morningSystolicPressure: '',
        morningDiastolicPressure: '',
        eveningSystolicPressure: '',
        eveningDiastolicPressure: '',
        bloodSugar: '',
        waterIntake: '',
        dietRecord: ''
      }
    }
  },
  methods: {
    async saveRecord() {
      if (!this.formData.weight) {
        uni.showToast({ title: '请输入今日体重', icon: 'none' })
        return
      }
      if (!this.formData.morningSystolicPressure || !this.formData.morningDiastolicPressure) {
        uni.showToast({ title: '请输入早上血压', icon: 'none' })
        return
      }
      if (!this.formData.eveningSystolicPressure || !this.formData.eveningDiastolicPressure) {
        uni.showToast({ title: '请输入晚上血压', icon: 'none' })
        return
      }
      if (!this.formData.bloodSugar) {
        uni.showToast({ title: '请输入血糖值', icon: 'none' })
        return
      }

      try {
        const token = uni.getStorageSync('token')
        if (!token) {
          uni.navigateTo({ url: '/pages/login/login' })
          return
        }

        const recordData = {
          weight: parseFloat(this.formData.weight),
          morningSystolicPressure: parseInt(this.formData.morningSystolicPressure),
          morningDiastolicPressure: parseInt(this.formData.morningDiastolicPressure),
          eveningSystolicPressure: parseInt(this.formData.eveningSystolicPressure),
          eveningDiastolicPressure: parseInt(this.formData.eveningDiastolicPressure),
          bloodSugar: parseFloat(this.formData.bloodSugar),
          waterIntake: this.formData.waterIntake ? parseInt(this.formData.waterIntake) : null,
          dietRecord: this.formData.dietRecord || null
        }

        await post('/vital-sign/add', recordData)
        uni.showToast({ title: '记录保存成功', icon: 'success' })
        setTimeout(() => {
          uni.navigateBack()
        }, 1000)
      } catch (err) {
        console.log(err)
        uni.showToast({ title: '保存失败，请检查网络连接', icon: 'none' })
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
  background: linear-gradient(180deg, #b3fff4 0%, #FFFFFF 40%, #FFFFFF 100%);
}

.form {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 4px 16px rgba(25, 162, 128, 0.08);
  border-radius: 12px;
  padding: 20px;
}

.form-item {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: 14px;
  color: #606266;
  margin-bottom: 8px;
}

.form-input {
  width: 100%;
  height: 48px;
  padding: 0 14px;
  border: 1px solid rgba(25, 162, 128, 0.15);
  border-radius: 8px;
  font-size: 14px;
  background: rgba(255, 255, 255, 0.6);
  box-sizing: border-box;
  line-height: 48px;
}

.form-input-placeholder {
  color: #C0C4CC;
}

.bp-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.bp-input {
  flex: 1;
}

.bp-separator {
  font-size: 18px;
  color: #909399;
}

.form-textarea {
  width: 100%;
  min-height: 100px;
  padding: 12px;
  border: 1px solid rgba(25, 162, 128, 0.15);
  border-radius: 8px;
  font-size: 14px;
  background: rgba(255, 255, 255, 0.6);
  resize: none;
  font-family: inherit;
  box-sizing: border-box;
  line-height: 1.5;
}

.form-textarea-placeholder {
  color: #C0C4CC;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 30px;
}

.btn-cancel {
  flex: 1;
  background: rgba(255, 255, 255, 0.6);
  color: #606266;
  border-radius: 8px;
  padding: 14px;
  font-size: 16px;
  text-align: center;
  border: 1px solid rgba(25, 162, 128, 0.15);
}

.btn-cancel:active {
  background: rgba(25, 162, 128, 0.08);
}

.btn-save {
  flex: 1;
  background-color: #009D85;
  color: #FFFFFF;
  border-radius: 8px;
  padding: 14px;
  font-size: 16px;
  text-align: center;
  border: none;
}

.btn-save:active {
  background-color: #007D6B;
}
</style>
