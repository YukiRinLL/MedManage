<template>
  <view class="health-record-container">
    <view class="card">
      <text class="section-title">健康档案</text>
      
      <view class="form-item">
        <text class="form-label">既往病史</text>
        <textarea class="form-textarea" v-model="healthRecord.pastMedicalHistory" placeholder="请输入既往病史" placeholder-class="placeholder-style" />
      </view>
      
      <view class="form-item">
        <text class="form-label">过敏史</text>
        <textarea class="form-textarea" v-model="healthRecord.allergicHistory" placeholder="请输入过敏史" placeholder-class="placeholder-style" />
      </view>
      
      <view class="form-item">
        <text class="form-label">家族病史</text>
        <textarea class="form-textarea" v-model="healthRecord.familyMedicalHistory" placeholder="请输入家族病史" placeholder-class="placeholder-style" />
      </view>
      
      <view class="form-item">
        <text class="form-label">血型</text>
        <input class="form-input" type="text" v-model="healthRecord.bloodType" placeholder="请输入血型" placeholder-class="placeholder-style" />
      </view>
      
      <view class="form-item">
        <text class="form-label">其他信息</text>
        <textarea class="form-textarea" v-model="healthRecord.otherInfo" placeholder="请输入其他健康信息" placeholder-class="placeholder-style" />
      </view>
      
      <view class="btn-primary" @click="saveHealthRecord">保存</view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      healthRecord: {
        pastMedicalHistory: '',
        allergicHistory: '',
        familyMedicalHistory: '',
        bloodType: '',
        otherInfo: ''
      }
    };
  },
  onLoad() {
    this.getHealthRecord();
  },
  methods: {
    getHealthRecord() {
      this.$axios.get('/health-record/info').then(res => {
        if (res.data) {
          this.healthRecord = res.data;
        }
      }).catch(err => {
        console.log(err);
      });
    },
    saveHealthRecord() {
      this.$axios.post('/health-record/save', this.healthRecord).then(res => {
        uni.showToast({ title: '保存成功', icon: 'success' });
      }).catch(err => {
        console.log(err);
      });
    }
  }
};
</script>

<style scoped>
.health-record-container {
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
</style>
