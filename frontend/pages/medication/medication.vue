<template>
  <view class="medication-container">
    <!-- 用药记录表单 -->
    <view class="card">
      <text class="section-title">记录用药情况</text>
      
      <view class="form-item">
        <text class="form-label">药品名称</text>
        <input class="form-input" type="text" v-model="medication.medicationName" placeholder="请输入药品名称" placeholder-class="placeholder-style" />
      </view>
      
      <view class="form-item">
        <text class="form-label">剂量</text>
        <input class="form-input" type="text" v-model="medication.dosage" placeholder="请输入剂量" placeholder-class="placeholder-style" />
      </view>
      
      <view class="form-item">
        <text class="form-label">频率</text>
        <input class="form-input" type="text" v-model="medication.frequency" placeholder="请输入服药频率" placeholder-class="placeholder-style" />
      </view>
      
      <view class="form-item">
        <text class="form-label">服药时间</text>
        <input class="form-input" type="datetime" v-model="medication.medicationTime" placeholder="请选择服药时间" placeholder-class="placeholder-style" />
      </view>
      
      <view class="form-item">
        <text class="form-label">备注</text>
        <textarea class="form-textarea" v-model="medication.notes" placeholder="请输入备注信息" placeholder-class="placeholder-style" />
      </view>
      
      <view class="btn-primary" @click="saveMedication">保存</view>
    </view>
    
    <!-- 历史记录 -->
    <view class="card" style="margin-top: 20px;">
      <text class="section-title">历史用药记录</text>
      
      <view v-if="medicationList.length > 0" class="record-list">
        <view class="record-item" v-for="(item, index) in medicationList" :key="index">
          <view class="record-header">
            <text class="medication-name">{{ item.medicationName }}</text>
            <view class="taken-status" :class="{ taken: item.taken }" @click="updateTakenStatus(item.id, !item.taken)">
              <text>{{ item.taken ? '已服用' : '未服用' }}</text>
            </view>
          </view>
          <view class="record-body">
            <view class="record-info">
              <text class="info-label">剂量:</text>
              <text class="info-value">{{ item.dosage }}</text>
            </view>
            <view class="record-info">
              <text class="info-label">频率:</text>
              <text class="info-value">{{ item.frequency }}</text>
            </view>
            <view class="record-info">
              <text class="info-label">时间:</text>
              <text class="info-value">{{ formatDate(item.medicationTime) }}</text>
            </view>
            <view class="record-info" v-if="item.notes">
              <text class="info-label">备注:</text>
              <text class="info-value">{{ item.notes }}</text>
            </view>
          </view>
        </view>
      </view>
      
      <view v-else class="empty-state">
        <view class="empty-state-icon">💊</view>
        <text class="empty-state-text">暂无用药记录</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      medication: {
        medicationName: '',
        dosage: '',
        frequency: '',
        medicationTime: new Date().toISOString().slice(0, 16),
        notes: ''
      },
      medicationList: []
    };
  },
  onLoad() {
    this.getMedicationList();
  },
  methods: {
    saveMedication() {
      // 验证必填项
      if (!this.medication.medicationName) {
        uni.showToast({ title: '请输入药品名称', icon: 'none' });
        return;
      }
      if (!this.medication.dosage) {
        uni.showToast({ title: '请输入剂量', icon: 'none' });
        return;
      }
      if (!this.medication.medicationTime) {
        uni.showToast({ title: '请选择服药时间', icon: 'none' });
        return;
      }
      
      this.$axios.post('/medication/save', this.medication).then(res => {
        uni.showToast({ title: '保存成功', icon: 'success' });
        // 重置表单
        this.medication = {
          medicationName: '',
          dosage: '',
          frequency: '',
          medicationTime: new Date().toISOString().slice(0, 16),
          notes: ''
        };
        // 刷新历史记录
        this.getMedicationList();
      }).catch(err => {
        console.log(err);
      });
    },
    getMedicationList() {
      this.$axios.get('/medication/list').then(res => {
        if (res.data) {
          this.medicationList = res.data;
        }
      }).catch(err => {
        console.log(err);
      });
    },
    updateTakenStatus(id, taken) {
      this.$axios.put(`/medication/update-taken/${id}?taken=${taken}`).then(res => {
        uni.showToast({ title: '更新成功', icon: 'success' });
        // 刷新历史记录
        this.getMedicationList();
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
.medication-container {
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #F0F0F0;
}

.medication-name {
  font-size: 16px;
  font-weight: 600;
  color: #333333;
}

.taken-status {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  background-color: #F0F0F0;
  color: #666666;
}

.taken-status.taken {
  background-color: #E8F5E8;
  color: #4CAF50;
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
