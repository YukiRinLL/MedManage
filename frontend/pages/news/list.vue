<template>
  <view class="news-container">
    <view class="news-list">
      <view class="news-item" v-for="news in newsList" :key="news.id" @click="viewDetail(news)">
        <image class="news-cover" :src="news.coverImage || '/static/default-cover.png'" mode="aspectFill"></image>
        <view class="news-info">
          <text class="news-title">{{ news.title }}</text>
          <view class="news-meta">
            <text class="news-source" v-if="news.source">{{ news.source }}</text>
            <text class="news-time">{{ formatDate(news.createdAt) }}</text>
          </view>
        </view>
      </view>
    </view>

    <view class="loading" v-if="loading">
      <text>加载中...</text>
    </view>

    <view class="empty" v-if="!loading && newsList.length === 0">
      <text>暂无新闻</text>
    </view>

    <view class="error" v-if="!loading && error">
      <text>连接服务器超时，点击屏幕重试</text>
      <button class="retry-button" @click="fetchNews">重试</button>
    </view>
  </view>
</template>

<script>
import request from '@/utils/request.js'

export default {
  data() {
    return {
      newsList: [],
      loading: false,
      error: false
    }
  },
  onLoad() {
    this.fetchNews()
  },
  onPullDownRefresh() {
    this.fetchNews()
    setTimeout(() => {
      uni.stopPullDownRefresh()
    }, 1000)
  },
  methods: {
    async fetchNews() {
      this.loading = true
      this.error = false
      try {
        const res = await request.get('/news/published', { page: 0, size: 10 })
        if (res.code === 200) {
          this.newsList = res.data.content || []
        }
      } catch (error) {
        console.error('获取新闻列表失败:', error)
        this.error = true
        uni.showToast({
          title: '获取新闻列表失败',
          icon: 'none'
        })
      } finally {
        this.loading = false
      }
    },
    viewDetail(news) {
      uni.navigateTo({
        url: `/pages/news/detail?id=${news.id}&url=${encodeURIComponent(news.url)}&title=${encodeURIComponent(news.title)}`
      })
    },
    formatDate(dateStr) {
      if (!dateStr) return ''
      const date = new Date(dateStr)
      const year = date.getFullYear()
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const day = date.getDate().toString().padStart(2, '0')
      return `${year}-${month}-${day}`
    }
  }
}
</script>

<style scoped>
.news-container {
  min-height: 100vh;
  background-color: #F5F7FA;
}

.news-list {
  padding: 16rpx;
}

.news-item {
  background-color: white;
  border-radius: 12rpx;
  margin-bottom: 16rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
}

.news-item:active {
  background-color: #FAFAFA;
}

.news-cover {
  width: 100%;
  height: 300rpx;
}

.news-info {
  padding: 28rpx;
}

.news-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #303133;
  display: block;
  margin-bottom: 12rpx;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-meta {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
}

.news-source {
  font-size: 24rpx;
  color: #009D85;
  margin-right: 20rpx;
  padding: 4rpx 12rpx;
  background: rgba(0, 157, 133, 0.1);
  border-radius: 8rpx;
}

.news-time {
  font-size: 24rpx;
  color: #999;
}

.loading, .empty, .error {
  text-align: center;
  padding: 100rpx 0;
  color: #909399;
  font-size: 28rpx;
}

.error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.retry-button {
  margin-top: 20rpx;
  background-color: #009D85;
  color: #fff;
  padding: 20rpx 40rpx;
  border-radius: 8rpx;
  border: none;
  font-size: 28rpx;
  font-weight: 500;
}
</style>
