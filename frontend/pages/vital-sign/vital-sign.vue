<template>
  <view class="vital-sign-container">
    <!-- 生命体征记录表单 -->
    <view class="card">
      <text class="section-title">记录生命体征</text>
      
      <view class="form-item">
        <text class="form-label">体温 (℃)</text>
        <input class="form-input" type="number" v-model="vitalSign.temperature" placeholder="请输入体温" placeholder-class="placeholder-style" />
      </view>
      
      <view class="form-item">
        <text class="form-label">血压 (mmHg)</text>
        <view class="blood-pressure-input">
          <input class="form-input" type="number" v-model="vitalSign.systolicPressure" placeholder="收缩压" placeholder-class="placeholder-style" />
          <text class="separator">/</text>
          <input class="form-input" type="number" v-model="vitalSign.diastolicPressure" placeholder="舒张压" placeholder-class="placeholder-style" />
        </view>
      </view>
      
      <view class="form-item">
        <text class="form-label">血糖 (mmol/L)</text>
        <input class="form-input" type="number" v-model="vitalSign.bloodSugar" placeholder="请输入血糖" placeholder-class="placeholder-style" />
      </view>
      
      <view class="form-item">
        <text class="form-label">心率 (次/分)</text>
        <input class="form-input" type="number" v-model="vitalSign.heartRate" placeholder="请输入心率" placeholder-class="placeholder-style" />
      </view>
      
      <view class="form-item">
        <text class="form-label">记录时间</text>
        <input class="form-input" type="datetime" v-model="vitalSign.recordTime" placeholder="请选择记录时间" placeholder-class="placeholder-style" />
      </view>
      
      <view class="form-item">
        <text class="form-label">备注</text>
        <textarea class="form-textarea" v-model="vitalSign.notes" placeholder="请输入备注信息" placeholder-class="placeholder-style" />
      </view>
      
      <view class="btn-primary" @click="saveVitalSign">保存</view>
    </view>
    
    <!-- 历史记录 -->
    <view class="card" style="margin-top: 20px;">
      <text class="section-title">历史记录</text>
      
      <view v-if="vitalSignList.length > 0" class="record-list">
        <view class="record-item" v-for="(item, index) in vitalSignList" :key="index">
          <view class="record-header">
            <text class="record-time">{{ formatDate(item.recordTime) }}</text>
          </view>
          <view class="record-body">
            <view class="record-info">
              <text class="info-label">体温:</text>
              <text class="info-value">{{ item.temperature }}℃</text>
            </view>
            <view class="record-info">
              <text class="info-label">血压:</text>
              <text class="info-value">{{ item.systolicPressure }}/{{ item.diastolicPressure }}mmHg</text>
            </view>
            <view class="record-info">
              <text class="info-label">血糖:</text>
              <text class="info-value">{{ item.bloodSugar }}mmol/L</text>
            </view>
            <view class="record-info">
              <text class="info-label">心率:</text>
              <text class="info-value">{{ item.heartRate }}次/分</text>
            </view>
            <view class="record-info" v-if="item.notes">
              <text class="info-label">备注:</text>
              <text class="info-value">{{ item.notes }}</text>
            </view>
          </view>
        </view>
      </view>
      
      <view v-else class="empty-state">
        <view class="empty-state-icon">📊</view>
        <text class="empty-state-text">暂无历史记录</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      vitalSign: {
        temperature: '',
        systolicPressure: '',
        diastolicPressure: '',
        bloodSugar: '',
        heartRate: '',
        recordTime: new Date().toISOString().slice(0, 16),
        notes: ''
      },
      vitalSignList: []
    };
  },
  onLoad() {
    this.getVitalSignList();
  },
  methods: {
    saveVitalSign() {
      // 验证必填项
      if (!this.vitalSign.temperature) {
        uni.showToast({ title: '请输入体温', icon: 'none' });
        return;
      }
      if (!this.vitalSign.systolicPressure || !this.vitalSign.diastolicPressure) {
        uni.showToast({ title: '请输入血压', icon: 'none' });
        return;
      }
      if (!this.vitalSign.heartRate) {
        uni.showToast({ title: '请输入心率', icon: 'none' });
        return;
      }
      
      this.$axios.post('/vital-sign/save', this.vitalSign).then(res => {
        uni.showToast({ title: '保存成功', icon: 'success' });
        // 重置表单
        this.vitalSign = {
          temperature: '',
          systolicPressure: '',
          diastolicPressure: '',
          bloodSugar: '',
          heartRate: '',
          recordTime: new Date().toISOString().slice(0, 16),
          notes: ''
        };
        // 刷新历史记录
        this.getVitalSignList();
      }).catch(err => {
        console.log(err);
      });
    },
    getVitalSignList() {
      this.$axios.get('/vital-sign/list').then(res => {
        if (res.data) {
          this.vitalSignList = res.data;
        }
      }).catch(err => {
        console.log(err);
      });
    },
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    }
  }
};
</script>

<style scoped>
.vital-sign-container {
  padding: 20px;
  min-height: 100vh;
  background-color: #F5F5F5;
}

.card {
  background-color: #FFFFFF;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  display: block;
}

.form-item {
  margin-bottom: 20px;
}

.form-label {
  font-size: 14px;
  color: #666666;
  margin-bottom: 8px;
  display: block;
}

.form-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #E5E5E5;
  border-radius: 8px;
  font-size: 16px;
}

.form-textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #E5E5E5;
  border-radius: 8px;
  font-size: 16px;
  min-height: 100px;
  resize: none;
}

.blood-pressure-input {
  display: flex;
  align-items: center;
  gap: 10px;
}

.blood-pressure-input .form-input {
  flex: 1;
}

.separator {
  font-size: 16px;
  color: #666666;
}

.placeholder-style {
  color: #999999;
}

.btn-primary {
  background-color: #007AFF;
  color: #FFFFFF;
  border-radius: 8px;
  padding: 14px;
  font-size: 16px;
  text-align: center;
  margin-top: 20px;
}

.record-list {
  margin-top: 16px;
}

.record-item {
  padding: 16px;
  border: 1px solid #F0F0F0;
  border-radius: 8px;
  margin-bottom: 12px;
}

.record-header {
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #F0F0F0;
}

.record-time {
  font-size: 14px;
  color: #666666;
}

.record-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.record-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-label {
  font-size: 14px;
  color: #666666;
  min-width: 60px;
}

.info-value {
  font-size: 14px;
  color: #333333;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  color: #999999;
}

.empty-state-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-state-text {
  font-size: 16px;
}
</style>
