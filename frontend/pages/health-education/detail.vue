<template>
  <view class="detail-container">
    <view v-if="isLoading" class="loading-container">
      <view class="loading-spinner"></view>
      <text class="loading-text">加载中...</text>
    </view>

    <view v-else-if="education" class="detail-content">
      <image 
        v-if="education.coverImage" 
        class="detail-cover" 
        :src="education.coverImage" 
        mode="widthFix"
      />
      
      <view class="detail-header">
        <text class="detail-title">{{ education.title }}</text>
        <view class="detail-meta">
          <text class="category-tag">{{ education.category }}</text>
          <text class="publish-time">{{ formatDate(education.createdAt) }}</text>
        </view>
      </view>

      <view class="detail-body">
        <rich-text :nodes="education.content"></rich-text>
      </view>

      <view v-if="education.tags" class="detail-tags">
        <text class="tags-label">相关标签</text>
        <view class="tags-list">
          <text 
            v-for="tag in education.tags.split(',')" 
            :key="tag" 
            class="tag-item"
          >
            {{ tag }}
          </text>
        </view>
      </view>

      <view class="bottom-space"></view>
    </view>

    <view v-else class="empty-state">
      <text class="empty-text">内容不存在</text>
    </view>
  </view>
</template>

<script>
import { get } from '../../utils/request.js'

export default {
  data() {
    return {
      education: null,
      isLoading: true
    }
  },
  onLoad(options) {
    if (options.id) {
      this.fetchDetail(options.id)
    }
  },
  methods: {
    async fetchDetail(id) {
      this.isLoading = true
      try {
        const res = await get(`/health-education/detail/${id}`)
        if (res.code === 200) {
          this.education = res.data
        }
      } catch (err) {
        console.log(err)
        uni.showToast({
          title: '获取内容失败',
          icon: 'none'
        })
      } finally {
        this.isLoading = false
      }
    },
    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    }
  }
}
</script>

<style scoped>
.detail-container {
  padding: 0;
  min-height: 100vh;
  background-color: #F5F7FA;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 157, 133, 0.2);
  border-radius: 50%;
  border-top-color: #009D85;
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 16px;
}

.loading-text {
  font-size: 14px;
  color: #606266;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.detail-content {
  padding: 0;
}

.detail-cover {
  width: 100%;
}

.detail-header {
  padding: 20px;
  background-color: #FFFFFF;
}

.detail-title {
  font-size: 20px;
  font-weight: 700;
  color: #303133;
  line-height: 1.4;
  margin-bottom: 12px;
}

.detail-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.category-tag {
  font-size: 12px;
  color: #009D85;
  background-color: rgba(0, 157, 133, 0.1);
  padding: 4px 12px;
  border-radius: 12px;
}

.publish-time {
  font-size: 13px;
  color: #909399;
}

.detail-body {
  padding: 20px;
  background-color: #FFFFFF;
  margin-top: 12px;
  font-size: 15px;
  color: #606266;
  line-height: 1.8;
}

.detail-body :deep(p) {
  margin-bottom: 16px;
}

.detail-body :deep(h2) {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin-top: 24px;
  margin-bottom: 12px;
}

.detail-body :deep(h3) {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-top: 20px;
  margin-bottom: 10px;
}

.detail-body :deep(ul), .detail-body :deep(ol) {
  padding-left: 24px;
  margin-bottom: 16px;
}

.detail-body :deep(li) {
  margin-bottom: 8px;
}

.detail-tags {
  padding: 20px;
  background-color: #FFFFFF;
  margin-top: 12px;
}

.tags-label {
  display: block;
  font-size: 14px;
  color: #909399;
  margin-bottom: 12px;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-item {
  font-size: 13px;
  color: #606266;
  background-color: #F5F7FA;
  padding: 6px 14px;
  border-radius: 16px;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

.empty-text {
  font-size: 16px;
  color: #909399;
}

.bottom-space {
  height: 40px;
}
</style>