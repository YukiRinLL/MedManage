<template>
  <view class="feedback-container">
    <view class="section-header animate-fade-in">
      <view class="header-content">
        <text class="section-title">问题反馈及满意度调查</text>
        <text class="section-desc">您的意见对我们很重要</text>
      </view>
    </view>

    <view class="feedback-content">
      <view class="feedback-card">
        <view class="form-item">
          <text class="form-label">反馈类型</text>
          <view class="type-options">
            <view 
              class="type-option" 
              :class="{ active: formData.type === 'problem' }"
              @click="formData.type = 'problem'"
            >
              <image src="/static/icons/png/filled/symbols/alert_triangle@2x.png" class="type-icon" mode="aspectFit" />
              <text class="type-text">问题反馈</text>
            </view>
            <view 
              class="type-option" 
              :class="{ active: formData.type === 'suggestion' }"
              @click="formData.type = 'suggestion'"
            >
              <image src="/static/icons/png/filled/symbols/lightbulb@2x.png" class="type-icon" mode="aspectFit" />
              <text class="type-text">功能建议</text>
            </view>
            <view 
              class="type-option" 
              :class="{ active: formData.type === 'complaint' }"
              @click="formData.type = 'complaint'"
            >
              <image src="/static/icons/png/filled/symbols/error@2x.png" class="type-icon" mode="aspectFit" />
              <text class="type-text">投诉</text>
            </view>
          </view>
        </view>

        <view class="form-item">
          <text class="form-label">满意度评分</text>
          <view class="rating-stars">
            <view 
              class="star" 
              :class="{ filled: formData.satisfactionScore >= 1 }"
              @click="formData.satisfactionScore = 1"
            >★</view>
            <view 
              class="star" 
              :class="{ filled: formData.satisfactionScore >= 2 }"
              @click="formData.satisfactionScore = 2"
            >★</view>
            <view 
              class="star" 
              :class="{ filled: formData.satisfactionScore >= 3 }"
              @click="formData.satisfactionScore = 3"
            >★</view>
            <view 
              class="star" 
              :class="{ filled: formData.satisfactionScore >= 4 }"
              @click="formData.satisfactionScore = 4"
            >★</view>
            <view 
              class="star" 
              :class="{ filled: formData.satisfactionScore >= 5 }"
              @click="formData.satisfactionScore = 5"
            >★</view>
          </view>
          <text class="rating-text">{{ getRatingText() }}</text>
        </view>

        <view class="form-item">
          <text class="form-label">反馈内容</text>
          <textarea 
            class="form-textarea" 
            v-model="formData.content" 
            placeholder="请详细描述您的问题或建议..."
            placeholder-class="form-textarea-placeholder"
            :maxlength="500"
          ></textarea>
          <text class="textarea-count">{{ formData.content.length }}/500</text>
        </view>

        <view class="form-item">
          <text class="form-label">联系方式（选填）</text>
          <view class="contact-row">
            <view class="contact-item">
              <text class="contact-label">姓名</text>
              <input 
                class="form-input" 
                v-model="formData.userName" 
                placeholder="请输入姓名"
                placeholder-class="form-input-placeholder"
              />
            </view>
            <view class="contact-item">
              <text class="contact-label">电话</text>
              <input 
                class="form-input" 
                v-model="formData.userPhone" 
                placeholder="请输入手机号"
                placeholder-class="form-input-placeholder"
              />
            </view>
          </view>
        </view>
      </view>

      <view class="submit-section">
        <button class="btn-submit" @click="submitFeedback">提交反馈</button>
      </view>
    </view>

    <view class="bottom-space"></view>
  </view>
</template>

<script>
import { post } from '../../utils/request.js'

export default {
  data() {
    return {
      formData: {
        type: 'problem',
        satisfactionScore: 3,
        content: '',
        userName: '',
        userPhone: ''
      },
      isSubmitting: false
    }
  },
  methods: {
    getRatingText() {
      const texts = ['非常不满意', '不满意', '一般', '满意', '非常满意']
      return texts[this.formData.satisfactionScore - 1] || ''
    },
    async submitFeedback() {
      if (!this.formData.content.trim()) {
        uni.showToast({
          title: '请输入反馈内容',
          icon: 'none'
        })
        return
      }
      
      this.isSubmitting = true
      try {
        const res = await post('/feedback/submit', this.formData)
        if (res.code === 200) {
          uni.showToast({
            title: '提交成功',
            icon: 'success'
          })
          setTimeout(() => {
            uni.navigateBack()
          }, 1500)
        } else {
          uni.showToast({
            title: res.message || '提交失败',
            icon: 'none'
          })
        }
      } catch (err) {
        console.log(err)
        uni.showToast({
          title: '提交失败，请稍后重试',
          icon: 'none'
        })
      } finally {
        this.isSubmitting = false
      }
    }
  }
}
</script>

<style scoped>
.feedback-container {
  padding: 0;
  min-height: 100vh;
  background-color: #F5F7FA;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.4s ease-out both;
}

.section-header {
  padding: 30px 20px 20px;
  background-color: #009D85;
  color: #FFFFFF;
}

.section-title {
  display: block;
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
  letter-spacing: 2px;
}

.section-desc {
  display: block;
  font-size: 15px;
  opacity: 0.9;
}

.feedback-content {
  padding: 16px;
}

.feedback-card {
  background-color: #FFFFFF;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.form-item {
  margin-bottom: 20px;
}

.form-item:last-child {
  margin-bottom: 0;
}

.form-label {
  display: block;
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 12px;
}

.type-options {
  display: flex;
  gap: 12px;
}

.type-option {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 12px;
  border-radius: 8px;
  background-color: #F5F7FA;
  border: 2px solid transparent;
  transition: all 0.25s ease;
}

.type-option.active {
  background-color: rgba(0, 157, 133, 0.08);
  border-color: #009D85;
}

.type-icon {
  width: 32px;
  height: 32px;
  margin-bottom: 8px;
}

.type-text {
  font-size: 13px;
  color: #303133;
}

.rating-stars {
  display: flex;
  gap: 12px;
}

.star {
  font-size: 36px;
  color: #E4E7ED;
  cursor: pointer;
  transition: all 0.25s ease;
}

.star.filled {
  color: #E6A23C;
}

.rating-text {
  display: block;
  font-size: 14px;
  color: #909399;
  margin-top: 8px;
}

.form-textarea {
  width: 100%;
  height: 120px;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #DCDFE6;
  font-size: 14px;
  color: #303133;
  background-color: #FFFFFF;
}

.form-textarea-placeholder {
  color: #C0C4CC;
}

.textarea-count {
  display: block;
  font-size: 12px;
  color: #909399;
  text-align: right;
  margin-top: 6px;
}

.contact-row {
  display: flex;
  gap: 12px;
}

.contact-item {
  flex: 1;
}

.contact-label {
  display: block;
  font-size: 13px;
  color: #909399;
  margin-bottom: 6px;
}

.form-input {
  width: 100%;
  height: 44px;
  padding: 0 12px;
  border-radius: 8px;
  border: 1px solid #DCDFE6;
  font-size: 14px;
  color: #303133;
}

.form-input-placeholder {
  color: #C0C4CC;
}

.submit-section {
  padding: 20px 0;
}

.btn-submit {
  width: 100%;
  height: 48px;
  background-color: #009D85;
  color: #FFFFFF;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
}

.btn-submit:active {
  background-color: #007D6B;
}

.bottom-space {
  height: 100px;
}
</style>