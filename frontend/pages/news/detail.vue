<template>
  <view class="news-detail-page">
    <view class="article-header">
      <text class="article-title">{{ title }}</text>
      <view class="article-meta" v-if="source || publishTime">
        <text class="article-source" v-if="source">{{ source }}</text>
        <text class="article-time" v-if="publishTime">{{ formatDate(publishTime) }}</text>
      </view>
    </view>

    <view class="article-content-wrapper">
      <rich-text
        v-if="articleContent"
        class="article-content"
        :nodes="articleContent"
      />
      <view class="loading-state" v-else-if="loading">
        <text class="loading-text">加载中...</text>
      </view>
      <view class="error-state" v-else>
        <text class="error-text">无法加载文章内容</text>
        <text class="error-tip">请检查网络连接或稍后重试</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { fetchNewsContent } from '@/api/news'

const title = ref('')
const source = ref('')
const publishTime = ref('')
const articleContent = ref('')
const loading = ref(false)
const articleUrl = ref('')

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

const loadArticleContent = async () => {
  if (!articleUrl.value) return

  loading.value = true
  try {
    const res = await fetchNewsContent(articleUrl.value)
    if (res.code === 200 && res.data) {
      articleContent.value = processContent(res.data)
    } else {
      uni.showToast({
        title: '获取文章内容失败',
        icon: 'none'
      })
    }
  } catch (error) {
    console.error('获取文章内容失败:', error)
    uni.showToast({
      title: '获取文章内容失败',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

const processContent = (html) => {
  let processed = html

  processed = processed.replace(/<script[^>]*>.*?<\/script>/gi, '')
  processed = processed.replace(/<style[^>]*>.*?<\/style>/gi, '')
  processed = processed.replace(/onclick="[^"]*"/gi, '')
  processed = processed.replace(/onload="[^"]*"/gi, '')

  processed = processed.replace(/data-src="([^"]*)"/gi, 'src="$1"')

  processed = processed.replace(/<img([^>]*)>/gi, '<img$1 style="max-width:100%;height:auto;display:block;margin:20rpx auto;"/>')

  processed = processed.replace(/<p[^>]*>/gi, '<p style="margin-bottom:30rpx;line-height:1.8;font-size:32rpx;color:#333;">')

  processed = processed.replace(/<h1[^>]*>/gi, '<h1 style="font-size:44rpx;font-weight:bold;margin:40rpx 0 20rpx;color:#222;">')
  processed = processed.replace(/<h2[^>]*>/gi, '<h2 style="font-size:40rpx;font-weight:bold;margin:36rpx 0 18rpx;color:#222;">')
  processed = processed.replace(/<h3[^>]*>/gi, '<h3 style="font-size:36rpx;font-weight:bold;margin:32rpx 0 16rpx;color:#222;">')

  processed = processed.replace(/<section[^>]*>/gi, '<div style="margin-bottom:30rpx;">')
  processed = processed.replace(/<\/section>/gi, '</div>')

  return processed
}

onLoad((options) => {
  if (options.id) {
    console.log('新闻ID:', options.id)
  }
  if (options.url) {
    articleUrl.value = decodeURIComponent(options.url)
  }
  if (options.title) {
    title.value = decodeURIComponent(options.title)
  }

  uni.setNavigationBarTitle({
    title: title.value || '新闻详情'
  })

  loadArticleContent()
})

onMounted(() => {
})
</script>

<style scoped>
.news-detail-page {
  min-height: 100vh;
  background: #fff;
}

.article-header {
  padding: 40rpx 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.article-title {
  font-size: 40rpx;
  font-weight: bold;
  color: #222;
  line-height: 1.5;
  display: block;
}

.article-meta {
  display: flex;
  align-items: center;
  margin-top: 24rpx;
}

.article-source {
  font-size: 26rpx;
  color: #009D85;
  margin-right: 24rpx;
  padding: 6rpx 16rpx;
  background: rgba(0, 157, 133, 0.1);
  border-radius: 8rpx;
}

.article-time {
  font-size: 26rpx;
  color: #999;
}

.article-content-wrapper {
  padding: 30rpx;
}

.article-content {
  font-size: 32rpx;
  line-height: 1.8;
  color: #333;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 200rpx 40rpx;
}

.loading-text {
  font-size: 28rpx;
  color: #999;
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
}

.error-tip {
  font-size: 26rpx;
  color: #999;
}
</style>
