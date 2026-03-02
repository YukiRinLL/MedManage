<template>
  <view class="news-detail-container">
    <view class="loading" v-if="loading">
      <text>加载中...</text>
    </view>

    <scroll-view scroll-y class="content" v-else-if="articleContent">
      <view class="article-header">
        <text class="article-title">{{ title }}</text>
        <view class="article-meta" v-if="source || publishTime">
          <text class="article-source" v-if="source">{{ source }}</text>
          <text class="article-time" v-if="publishTime">{{ formatDate(publishTime) }}</text>
        </view>
      </view>

      <view class="article-content-wrapper">
        <rich-text class="article-content" :nodes="articleContent" />
      </view>
    </scroll-view>

    <view class="error" v-else>
      <text>连接服务器超时，点击屏幕重试</text>
      <button class="retry-button" @click="loadArticleContent">重试</button>
    </view>
  </view>
</template>

<script>
import request from '@/utils/request.js'

export default {
  data() {
    return {
      title: '',
      source: '',
      publishTime: '',
      articleContent: '',
      loading: false,
      articleUrl: ''
    }
  },
  onLoad(options) {
    if (options.id) {
      console.log('新闻ID:', options.id)
    }
    if (options.url) {
      this.articleUrl = decodeURIComponent(options.url)
    }
    if (options.title) {
      this.title = decodeURIComponent(options.title)
      uni.setNavigationBarTitle({
        title: this.title || '新闻详情'
      })
    }

    this.loadArticleContent()
  },
  methods: {
    async loadArticleContent() {
      if (!this.articleUrl) return

      this.loading = true
      try {
        const res = await request.post('/news/fetch-content', { url: this.articleUrl })
        if (res.code === 200 && res.data) {
          this.articleContent = this.processContent(res.data)
        }
      } catch (error) {
        console.error('获取文章内容失败:', error)
        uni.showToast({
          title: '获取文章内容失败',
          icon: 'none'
        })
      } finally {
        this.loading = false
      }
    },
    processContent(html) {
      let processed = html

      processed = processed.replace(/<script[^>]*>.*?<\/script>/gi, '')
      processed = processed.replace(/<style[^>]*>.*?<\/style>/gi, '')
      processed = processed.replace(/onclick="[^"]*"/gi, '')
      processed = processed.replace(/onload="[^"]*"/gi, '')

      processed = processed.replace(/data-src="([^"]*)"/gi, 'src="$1"')

      processed = processed.replace(/<img([^>]*)>/gi, '<img$1 style="max-width:100%;height:auto;display:block;margin:30rpx auto;"/>')

      processed = processed.replace(/<p[^>]*>/gi, '<p style="margin-bottom:36rpx;line-height:1.8;font-size:34rpx;color:#333;text-align:justify;">')

      processed = processed.replace(/<h1[^>]*>/gi, '<h1 style="font-size:44rpx;font-weight:bold;margin:40rpx 0 20rpx;color:#222;text-align:center;">')
      processed = processed.replace(/<h2[^>]*>/gi, '<h2 style="font-size:40rpx;font-weight:bold;margin:36rpx 0 18rpx;color:#222;text-align:center;">')
      processed = processed.replace(/<h3[^>]*>/gi, '<h3 style="font-size:36rpx;font-weight:bold;margin:32rpx 0 16rpx;color:#222;text-align:center;">')

      processed = processed.replace(/<section[^>]*>/gi, '<div style="margin-bottom:30rpx;">')
      processed = processed.replace(/<\/section>/gi, '</div>')

      processed = processed.replace(/<strong[^>]*>/gi, '<strong style="font-weight:bold;">')
      processed = processed.replace(/<em[^>]*>/gi, '<em style="font-style:italic;">')

      return processed
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
.news-detail-container {
  min-height: 100vh;
  background-color: #F5F7FA;
}

.loading, .error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  color: #909399;
  font-size: 28rpx;
}

.error {
  padding: 0 40rpx;
  text-align: center;
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

.content {
  height: 100vh;
  padding-bottom: 40rpx;
}

.article-header {
  padding: 40rpx 32rpx;
  background-color: white;
  border-bottom: 1rpx solid #EBEEF5;
}

.article-title {
  font-size: 44rpx;
  font-weight: bold;
  color: #222;
  display: block;
  margin-bottom: 24rpx;
  line-height: 1.5;
  text-align: center;
}

.article-meta {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 24rpx;
}

.article-source {
  font-size: 26rpx;
  color: #009D85;
  display: inline-block;
  padding: 6rpx 20rpx;
  background-color: rgba(0, 157, 133, 0.1);
  border-radius: 10rpx;
  margin-right: 20rpx;
  margin-bottom: 10rpx;
}

.article-time {
  font-size: 24rpx;
  color: #999;
  margin-bottom: 10rpx;
}

.article-content-wrapper {
  padding: 40rpx 32rpx;
  background-color: white;
  margin-top: 20rpx;
  min-height: 500rpx;
}

.article-content {
  font-size: 34rpx;
  line-height: 1.8;
  color: #333;
  word-break: break-all;
}

.article-content img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 30rpx auto;
}

.article-content p {
  margin-bottom: 36rpx;
  text-align: justify;
}

.article-content strong {
  font-weight: bold;
}

.article-content em {
  font-style: italic;
}
</style>
