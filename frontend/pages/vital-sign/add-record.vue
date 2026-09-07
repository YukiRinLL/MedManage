<template>
  <view class="add-record-container">
    <view class="form">
      <!-- 体温 -->
      <view class="form-item">
        <text class="form-label">体温 (℃)</text>
        <input
          class="form-input"
          type="digit"
          v-model="formData.temperature"
          placeholder="请输入体温"
          placeholder-class="form-input-placeholder"
        />
      </view>

      <!-- 今日体重 -->
      <view class="form-item">
        <text class="form-label">今日体重 (kg)</text>
        <input
          class="form-input"
          type="digit"
          v-model="formData.weight"
          placeholder="请输入体重"
          placeholder-class="form-input-placeholder"
        />
      </view>

      <!-- 早上血压 -->
      <view class="form-group">
        <text class="form-group-title">早上血压 (mmHg)</text>
        <view class="form-row">
          <view class="form-item-half">
            <text class="form-label-sub">收缩压</text>
            <input
              class="form-input"
              type="number"
              v-model="formData.morningSystolicPressure"
              placeholder="收缩压"
              placeholder-class="form-input-placeholder"
            />
          </view>
          <view class="form-item-half">
            <text class="form-label-sub">舒张压</text>
            <input
              class="form-input"
              type="number"
              v-model="formData.morningDiastolicPressure"
              placeholder="舒张压"
              placeholder-class="form-input-placeholder"
            />
          </view>
        </view>
      </view>

      <!-- 晚上血压 -->
      <view class="form-group">
        <text class="form-group-title">晚上血压 (mmHg)</text>
        <view class="form-row">
          <view class="form-item-half">
            <text class="form-label-sub">收缩压</text>
            <input
              class="form-input"
              type="number"
              v-model="formData.eveningSystolicPressure"
              placeholder="收缩压"
              placeholder-class="form-input-placeholder"
            />
          </view>
          <view class="form-item-half">
            <text class="form-label-sub">舒张压</text>
            <input
              class="form-input"
              type="number"
              v-model="formData.eveningDiastolicPressure"
              placeholder="舒张压"
              placeholder-class="form-input-placeholder"
            />
          </view>
        </view>
      </view>

      <!-- 血糖 -->
      <view class="form-item">
        <text class="form-label">血糖 (mmol/L)</text>
        <input
          class="form-input"
          type="digit"
          v-model="formData.bloodSugar"
          placeholder="请输入血糖"
          placeholder-class="form-input-placeholder"
        />
      </view>

      <!-- 心率 -->
      <view class="form-item">
        <text class="form-label">心率 (bpm)</text>
        <input
          class="form-input"
          type="number"
          v-model="formData.heartRate"
          placeholder="请输入心率"
          placeholder-class="form-input-placeholder"
        />
      </view>

      <!-- 今日饮水量 -->
      <view class="form-item">
        <text class="form-label">今日饮水量 (ml)</text>
        <input
          class="form-input"
          type="number"
          v-model="formData.waterIntake"
          placeholder="请输入饮水量"
          placeholder-class="form-input-placeholder"
        />
      </view>

      <!-- 饮食记录 -->
      <view class="form-item">
        <text class="form-label">饮食记录</text>
        <textarea
          class="form-textarea"
          v-model="formData.dietRecord"
          placeholder="请记录今日饮食（可选）"
          placeholder-class="form-textarea-placeholder"
        ></textarea>
      </view>

      <!-- 备注 -->
      <view class="form-item">
        <text class="form-label">备注</text>
        <textarea
          class="form-textarea"
          v-model="formData.notes"
          placeholder="请输入备注信息（可选）"
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
import { isLoggedIn } from '../../utils/userInfoManager.js'

export default {
  data() {
    return {
      formData: {
        temperature: '',
        weight: '',
        morningSystolicPressure: '',
        morningDiastolicPressure: '',
        eveningSystolicPressure: '',
        eveningDiastolicPressure: '',
        bloodSugar: '',
        heartRate: '',
        waterIntake: '',
        dietRecord: '',
        notes: ''
      }
    }
  },
  methods: {
    async saveRecord() {
      try {
        if (!isLoggedIn()) {
          uni.navigateTo({ url: '/pages/login/login' })
          return
        }

        const recordData = {}
        if (this.formData.temperature) recordData.temperature = parseFloat(this.formData.temperature)
        if (this.formData.weight) recordData.weight = parseFloat(this.formData.weight)
        if (this.formData.morningSystolicPressure) recordData.morningSystolicPressure = parseInt(this.formData.morningSystolicPressure)
        if (this.formData.morningDiastolicPressure) recordData.morningDiastolicPressure = parseInt(this.formData.morningDiastolicPressure)
        if (this.formData.eveningSystolicPressure) recordData.eveningSystolicPressure = parseInt(this.formData.eveningSystolicPressure)
        if (this.formData.eveningDiastolicPressure) recordData.eveningDiastolicPressure = parseInt(this.formData.eveningDiastolicPressure)
        if (this.formData.bloodSugar) recordData.bloodSugar = parseFloat(this.formData.bloodSugar)
        if (this.formData.heartRate) recordData.heartRate = parseInt(this.formData.heartRate)
        if (this.formData.waterIntake) recordData.waterIntake = parseInt(this.formData.waterIntake)
        if (this.formData.dietRecord) recordData.dietRecord = this.formData.dietRecord
        if (this.formData.notes) recordData.notes = this.formData.notes

        await post('/vital-sign/add', recordData)
        uni.showToast({ title: '记录保存成功', icon: 'success' })
        setTimeout(() => { uni.navigateBack() }, 1000)
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
  color: #333;
  margin-bottom: 8px;
  font-weight: 500;
}

.form-group {
  margin-bottom: 20px;
}

.form-group-title {
  display: block;
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
  font-weight: 500;
}

.form-row {
  display: flex;
  gap: 12px;
}

.form-item-half {
  flex: 1;
}

.form-label-sub {
  display: block;
  font-size: 12px;
  color: #666;
  margin-bottom: 6px;
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
