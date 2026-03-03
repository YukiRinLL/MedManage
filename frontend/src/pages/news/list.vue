<template>
  <view class="news-page">
    <view class="news-header">
      <text class="header-title">新闻资讯</text>
    </view>

    <view class="news-list" v-if="newsList.length > 0">
      <view
        class="news-item"
        v-for="item in newsList"
        :key="item.id"
        @click="goToDetail(item)"
      >
        <view class="news-content">
          <text class="news-title">{{ item.title }}</text>
          <view class="news-meta">
            <text class="news-source" v-if="item.source">{{ item.source }}</text>
            <text class="news-time">{{ formatDate(item.createdAt) }}</text>
          </view>
        </view>
        <image
          v-if="item.coverImage"
          class="news-cover"
          :src="getImageUrl(item.coverImage)"
          mode="aspectFill"
        />
        <view v-else class="news-cover-placeholder">
          <text class="placeholder-text">新闻</text>
        </view>
      </view>
    </view>

    <view class="empty-state" v-else-if="!loading && !error">
      <text class="empty-text">暂无新闻</text>
    </view>

    <view class="error-state" v-else-if="error">
      <text class="error-text">连接服务器超时，点击屏幕重试</text>
      <text class="error-tip">请检查网络连接或稍后重试</text>
      <view class="retry-button" @click="loadNews(true)">
        <text class="retry-text">重试</text>
      </view>
    </view>

    <view class="loading-more" v-if="loading">
      <text class="loading-text">加载中...</text>
    </view>

    <view class="no-more" v-if="!hasMore && newsList.length > 0">
      <text class="no-more-text">没有更多了</text>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'
import { getPublishedNews } from '@/api/news'

const newsList = ref([])
const loading = ref(false)
const error = ref(false)
const page = ref(1)
const size = ref(10)
const hasMore = ref(true)

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

const loadNews = async (isRefresh = false) => {
  if (loading.value) return
  loading.value = true
  error.value = false

  try {
    if (isRefresh) {
      page.value = 1
      hasMore.value = true
    }

    const res = await getPublishedNews(page.value - 1, size.value)

    if (res.code === 200) {
      const newData = res.data.content || []

      if (isRefresh) {
        newsList.value = newData
      } else {
        newsList.value = [...newsList.value, ...newData]
      }

      hasMore.value = newData.length === size.value
    } else {
      error.value = true
      uni.showToast({
        title: res.message || '获取新闻失败',
        icon: 'none'
      })
    }
  } catch (err) {
    console.error('获取新闻失败:', err)
    error.value = true
    uni.showToast({
      title: '获取新闻失败',
      icon: 'none'
    })
  } finally {
    loading.value = false
    if (isRefresh) {
      uni.stopPullDownRefresh()
    }
  }
}

const goToDetail = (item) => {
  uni.navigateTo({
    url: `/pages/news/detail?id=${item.id}&url=${encodeURIComponent(item.url)}&title=${encodeURIComponent(item.title)}`
  })
}

const getImageUrl = (coverImage) => {
  if (!coverImage) {
    return ''
  }
  if (coverImage.startsWith('http')) {
    return coverImage
  }
  return 'http://localhost:8080' + coverImage
}

onPullDownRefresh(() => {
  loadNews(true)
})

onReachBottom(() => {
  if (hasMore.value && !loading.value) {
    page.value++
    loadNews()
  }
})

onMounted(() => {
  loadNews(true)
})
</script>

<style scoped>
.news-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.news-header {
  background: linear-gradient(135deg, #009D85 0%, #00b894 100%);
  padding: 40rpx 30rpx;
}

.header-title {
  font-size: 40rpx;
  font-weight: bold;
  color: #fff;
}

.news-list {
  padding: 20rpx;
}

.news-item {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
  display: flex;
  align-items: center;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
}

.news-content {
  flex: 1;
  margin-right: 20rpx;
  min-width: 0;
}

.news-title {
  font-size: 30rpx;
  color: #333;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 16rpx;
}

.news-meta {
  display: flex;
  align-items: center;
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

.news-cover {
  width: 200rpx;
  height: 140rpx;
  border-radius: 12rpx;
  flex-shrink: 0;
}

.news-cover-placeholder {
  width: 200rpx;
  height: 140rpx;
  border-radius: 12rpx;
  background: linear-gradient(135deg, #e0e0e0 0%, #f0f0f0 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.placeholder-text {
  font-size: 32rpx;
  color: #999;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 200rpx 40rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
}

.loading-more {
  text-align: center;
  padding: 30rpx;
}

.loading-text {
  font-size: 26rpx;
  color: #999;
}

.no-more {
  text-align: center;
  padding: 30rpx;
}

.no-more-text {
  font-size: 24rpx;
  color: #ccc;
}

.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 200rpx 40rpx;
}

.error-text {
  font-size: 32rpx;
  color: #666;
  margin-bottom: 16rpx;
  text-align: center;
}

.error-tip {
  font-size: 26rpx;
  color: #999;
  margin-bottom: 32rpx;
  text-align: center;
}

.retry-button {
  background-color: #009D85;
  color: #fff;
  padding: 20rpx 40rpx;
  border-radius: 8rpx;
}

.retry-text {
  font-size: 28rpx;
  font-weight: 500;
}
</style>
