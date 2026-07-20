<template>
  <view class="education-container">
    <view class="section-header animate-fade-in">
      <view class="header-bg"></view>
      <view class="header-content">
        <text class="section-title">科普宣教</text>
        <text class="section-desc">系统化透析知识，个性化健康指导</text>
      </view>
    </view>

    <view class="category-tabs">
      <view 
        class="tab-item" 
        :class="{ active: activeCategory === '' }"
        @click="activeCategory = ''"
      >
        全部
      </view>
      <view 
        class="tab-item" 
        :class="{ active: activeCategory === '透析知识' }"
        @click="activeCategory = '透析知识'"
      >
        透析知识
      </view>
      <view 
        class="tab-item" 
        :class="{ active: activeCategory === '饮食知识' }"
        @click="activeCategory = '饮食知识'"
      >
        饮食知识
      </view>
      <view 
        class="tab-item" 
        :class="{ active: activeCategory === '居家护理' }"
        @click="activeCategory = '居家护理'"
      >
        居家护理
      </view>
    </view>

    <view class="education-list" v-if="educationList.length > 0">
      <view 
        class="education-item animate-fade-in-up" 
        v-for="(item, index) in educationList" 
        :key="item.id"
        :style="{ animationDelay: index * 0.05 + 's' }"
        @click="viewDetail(item)"
      >
        <image 
          v-if="item.coverImage" 
          class="education-cover" 
          :src="item.coverImage" 
          mode="aspectFill"
        />
        <view v-else class="education-cover-placeholder">
          <image src="/static/icons/png/filled/objects/book@2x.png" class="placeholder-icon" mode="aspectFit" />
        </view>
        <view class="education-info">
          <text class="education-title">{{ item.title }}</text>
          <view class="education-meta">
            <text class="category-tag">{{ item.category }}</text>
            <text class="publish-time">{{ formatDate(item.createdAt) }}</text>
          </view>
          <text class="education-preview">{{ item.content ? item.content.substring(0, 80) + '...' : '' }}</text>
        </view>
      </view>
    </view>

    <view class="empty-state" v-else-if="!isLoading">
      <image src="/static/icons/png/filled/objects/book@2x.png" class="empty-icon" mode="aspectFit" />
      <text class="empty-text">暂无科普内容</text>
      <text class="empty-subtext">敬请期待更多健康知识</text>
    </view>

    <view class="loading-container" v-if="isLoading">
      <view class="loading-spinner"></view>
      <text class="loading-text">加载中...</text>
    </view>

    <view class="bottom-space"></view>
  </view>
</template>

<script>
import { get } from '../../utils/request.js'

export default {
  data() {
    return {
      educationList: [],
      activeCategory: '',
      isLoading: true
    }
  },
  onLoad() {
    this.fetchEducationList()
  },
  watch: {
    activeCategory() {
      this.fetchEducationList()
    }
  },
  methods: {
    async fetchEducationList() {
      this.isLoading = true
      try {
        const url = this.activeCategory 
          ? `/health-education/list?category=${encodeURIComponent(this.activeCategory)}`
          : '/health-education/list'
        const res = await get(url)
        if (res.code === 200) {
          this.educationList = res.data.list || res.data
        }
      } catch (err) {
        console.log(err)
        uni.showToast({
          title: '获取科普内容失败',
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
    },
    viewDetail(item) {
      uni.navigateTo({
        url: `/pages/health-education/detail?id=${item.id}`
      })
    }
  }
}
</script>

<style scoped>
.education-container {
  padding: 0;
  min-height: 100vh;
  background-color: #F5F7FA;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.4s ease-out both;
}

.animate-fade-in-up {
  animation: fadeInUp 0.3s ease-out both;
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

.category-tabs {
  display: flex;
  padding: 16px;
  background-color: #FFFFFF;
  gap: 8px;
  overflow-x: auto;
}

.tab-item {
  padding: 10px 20px;
  background-color: #F5F7FA;
  border-radius: 20px;
  font-size: 14px;
  color: #606266;
  white-space: nowrap;
  transition: all 0.25s ease;
}

.tab-item.active {
  background-color: #009D85;
  color: #FFFFFF;
}

.education-list {
  padding: 16px;
}

.education-item {
  display: flex;
  background-color: #FFFFFF;
  border-radius: 12px;
  margin-bottom: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.education-cover {
  width: 120px;
  height: 100px;
  flex-shrink: 0;
}

.education-cover-placeholder {
  width: 120px;
  height: 100px;
  flex-shrink: 0;
  background-color: #F5F7FA;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-icon {
  width: 36px;
  height: 36px;
}

.education-info {
  flex: 1;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
}

.education-title {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.education-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.category-tag {
  font-size: 12px;
  color: #009D85;
  background-color: rgba(0, 157, 133, 0.1);
  padding: 2px 8px;
  border-radius: 4px;
}

.publish-time {
  font-size: 12px;
  color: #909399;
}

.education-preview {
  font-size: 13px;
  color: #909399;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
}

.empty-icon {
  width: 48px;
  height: 48px;
  margin-bottom: 20px;
}

.empty-text {
  font-size: 16px;
  color: #333;
  margin-bottom: 8px;
}

.empty-subtext {
  font-size: 14px;
  color: #999;
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

.bottom-space {
  height: 100px;
}
</style>