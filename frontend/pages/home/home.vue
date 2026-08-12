<template>
  <view class="home-container">
    <!-- Sticky Top: Header + Greeting (fixed on scroll, covered by content) -->
    <view class="sticky-top" :class="{ 'frost-visible': pageVisible }">
      <!-- Header -->
      <view class="status-bar">
        <view class="status-content">
          <image src="/static/design/home/图层 0 4.png" class="logo-layer-img" mode="aspectFit" />
          <text class="header-title">首页</text>
        </view>
      </view>

      <!-- Greeting Section with Shield Decoration -->
      <view class="greeting-section animate-fade-in" :style="{ animationDelay: '0.1s' }">
        <view class="greeting-text">
          <text class="greeting-main">为您健康护航</text>
          <text class="greeting-days">第{{ daysProtected }}天</text>
        </view>
      <view class="shield-wrap">
        <!-- 光环 - 后半部分（盾牌后面，z-index:1） -->
        <view class="shield-ring-back">
          <svg class="ring-svg" viewBox="0 0 160 160" preserveAspectRatio="xMidYMid meet">
            <defs>
              <!-- 环1（白色）渐变：178度≈从上到下微偏右（透明23%→白79%） -->
              <linearGradient id="ring1GradBack" x1="0.482" y1="0" x2="0.518" y2="1">
                <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0"/>
                <stop offset="23%" stop-color="#FFFFFF" stop-opacity="0"/>
                <stop offset="79%" stop-color="#FFFFFF" stop-opacity="1"/>
                <stop offset="100%" stop-color="#FFFFFF" stop-opacity="1"/>
              </linearGradient>
              <!-- 环2（蓝色）渐变：182度（蓝实3%→透明80%） -->
              <linearGradient id="ring2GradBack" x1="0.518" y1="0" x2="0.482" y2="1">
                <stop offset="0%" stop-color="#5DD9F4" stop-opacity="1"/>
                <stop offset="3%" stop-color="#5DD9F4" stop-opacity="1"/>
                <stop offset="80%" stop-color="#5DD9F4" stop-opacity="0"/>
                <stop offset="100%" stop-color="#5DD9F4" stop-opacity="0"/>
              </linearGradient>
              <!-- 辉光滤镜：不同强度用于三层淡出 -->
              <filter id="gBackCore" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="1.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <filter id="gBackMid" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2.0" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <filter id="gBackOut" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3.0" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <filter id="wBackCore" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="1.0" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <filter id="wBackMid" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="1.8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <filter id="wBackOut" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2.8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <!-- 白色环：后半部分裁剪上半 -->
              <clipPath id="backClipWhite"><rect x="0" y="0" width="160" height="80"/></clipPath>
              <!-- 蓝色环：后半部分裁剪下半 -->
              <clipPath id="backClipBlue"><rect x="0" y="80" width="160" height="80"/></clipPath>
            </defs>
            <!-- ========== 环1（白色）底环 ========== -->
            <ellipse cx="80" cy="80" rx="65.105" ry="30.465" fill="none"
              stroke="url(#ring1GradBack)" stroke-width="3"
              transform="rotate(32.26 80 80)" clip-path="url(#backClipWhite)"/>
            <!-- ========== 环1 高亮（绿色三层淡出） ========== -->
            <!-- 外层淡出（最长，最淡，强辉光） -->
            <ellipse cx="80" cy="80" rx="65.105" ry="30.465" fill="none"
              stroke="#9FF9E0" stroke-width="3"
              stroke-dasharray="30 290" stroke-dashoffset="0"
              transform="rotate(32.26 80 80)" clip-path="url(#backClipWhite)"
              filter="url(#gBackOut)" opacity="0.3">
              <animate attributeName="stroke-dashoffset" from="0" to="-320" dur="4.5s" repeatCount="indefinite"/>
            </ellipse>
            <!-- 中层淡出 -->
            <ellipse cx="80" cy="80" rx="65.105" ry="30.465" fill="none"
              stroke="#9FF9E0" stroke-width="3"
              stroke-dasharray="22 298" stroke-dashoffset="0"
              transform="rotate(32.26 80 80)" clip-path="url(#backClipWhite)"
              filter="url(#gBackMid)" opacity="0.6">
              <animate attributeName="stroke-dashoffset" from="0" to="-320" dur="4.5s" repeatCount="indefinite"/>
            </ellipse>
            <!-- 核心亮段（最短，最实） -->
            <ellipse cx="80" cy="80" rx="65.105" ry="30.465" fill="none"
              stroke="#9FF9E0" stroke-width="3" stroke-linecap="round"
              stroke-dasharray="14 306" stroke-dashoffset="0"
              transform="rotate(32.26 80 80)" clip-path="url(#backClipWhite)"
              filter="url(#gBackCore)" opacity="1">
              <animate attributeName="stroke-dashoffset" from="0" to="-320" dur="4.5s" repeatCount="indefinite"/>
            </ellipse>
            <!-- ========== 环2（蓝色）底环 ========== -->
            <ellipse cx="80" cy="80" rx="63.055" ry="30.465" fill="none"
              stroke="url(#ring2GradBack)" stroke-width="3"
              transform="rotate(-17.36 80 80)" clip-path="url(#backClipBlue)"/>
            <!-- ========== 环2 高亮（白色三层淡出） ========== -->
            <ellipse cx="80" cy="80" rx="63.055" ry="30.465" fill="none"
              stroke="#FFFFFF" stroke-width="3"
              stroke-dasharray="28 283" stroke-dashoffset="0"
              transform="rotate(-17.36 80 80)" clip-path="url(#backClipBlue)"
              filter="url(#wBackOut)" opacity="0.25">
              <animate attributeName="stroke-dashoffset" from="0" to="-311" dur="4.5s" begin="0.8s" repeatCount="indefinite"/>
            </ellipse>
            <ellipse cx="80" cy="80" rx="63.055" ry="30.465" fill="none"
              stroke="#FFFFFF" stroke-width="3"
              stroke-dasharray="20 291" stroke-dashoffset="0"
              transform="rotate(-17.36 80 80)" clip-path="url(#backClipBlue)"
              filter="url(#wBackMid)" opacity="0.55">
              <animate attributeName="stroke-dashoffset" from="0" to="-311" dur="4.5s" begin="0.8s" repeatCount="indefinite"/>
            </ellipse>
            <ellipse cx="80" cy="80" rx="63.055" ry="30.465" fill="none"
              stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"
              stroke-dasharray="12 299" stroke-dashoffset="0"
              transform="rotate(-17.36 80 80)" clip-path="url(#backClipBlue)"
              filter="url(#wBackCore)" opacity="1">
              <animate attributeName="stroke-dashoffset" from="0" to="-311" dur="4.5s" begin="0.8s" repeatCount="indefinite"/>
            </ellipse>
          </svg>
        </view>
        <!-- 盾牌图片 -->
        <image src="/static/design/home/Simple 3D.svg" class="deco-shield" mode="aspectFit" />
        <!-- Shield shadow -->
        <view class="shield-shadow"></view>
        <!-- 光环 - 前半部分（盾牌前面，z-index:3） -->
        <view class="shield-ring-front">
          <svg class="ring-svg" viewBox="0 0 160 160" preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="ring1GradFront" x1="0.482" y1="0" x2="0.518" y2="1">
                <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0"/>
                <stop offset="23%" stop-color="#FFFFFF" stop-opacity="0"/>
                <stop offset="79%" stop-color="#FFFFFF" stop-opacity="1"/>
                <stop offset="100%" stop-color="#FFFFFF" stop-opacity="1"/>
              </linearGradient>
              <linearGradient id="ring2GradFront" x1="0.518" y1="0" x2="0.482" y2="1">
                <stop offset="0%" stop-color="#5DD9F4" stop-opacity="1"/>
                <stop offset="3%" stop-color="#5DD9F4" stop-opacity="1"/>
                <stop offset="80%" stop-color="#5DD9F4" stop-opacity="0"/>
                <stop offset="100%" stop-color="#5DD9F4" stop-opacity="0"/>
              </linearGradient>
              <!-- 绿色高亮三层辉光 -->
              <filter id="gFrontCore" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="1.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <filter id="gFrontMid" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2.0" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <filter id="gFrontOut" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3.0" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <!-- 白色高亮三层辉光 -->
              <filter id="wFrontCore" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="1.0" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <filter id="wFrontMid" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="1.8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <filter id="wFrontOut" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2.8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <clipPath id="frontClipWhite"><rect x="0" y="80" width="160" height="80"/></clipPath>
              <clipPath id="frontClipBlue"><rect x="0" y="0" width="160" height="80"/></clipPath>
            </defs>
            <!-- ========== 环1（白色）底环前半 ========== -->
            <ellipse cx="80" cy="80" rx="65.105" ry="30.465" fill="none"
              stroke="url(#ring1GradFront)" stroke-width="3"
              transform="rotate(32.26 80 80)" clip-path="url(#frontClipWhite)"/>
            <!-- ========== 环1 高亮（绿色三层淡出） ========== -->
            <ellipse cx="80" cy="80" rx="65.105" ry="30.465" fill="none"
              stroke="#9FF9E0" stroke-width="3"
              stroke-dasharray="35 285" stroke-dashoffset="0"
              transform="rotate(32.26 80 80)" clip-path="url(#frontClipWhite)"
              filter="url(#gFrontOut)" opacity="0.35">
              <animate attributeName="stroke-dashoffset" from="0" to="-320" dur="4.5s" repeatCount="indefinite"/>
            </ellipse>
            <ellipse cx="80" cy="80" rx="65.105" ry="30.465" fill="none"
              stroke="#9FF9E0" stroke-width="3"
              stroke-dasharray="26 294" stroke-dashoffset="0"
              transform="rotate(32.26 80 80)" clip-path="url(#frontClipWhite)"
              filter="url(#gFrontMid)" opacity="0.65">
              <animate attributeName="stroke-dashoffset" from="0" to="-320" dur="4.5s" repeatCount="indefinite"/>
            </ellipse>
            <ellipse cx="80" cy="80" rx="65.105" ry="30.465" fill="none"
              stroke="#9FF9E0" stroke-width="3" stroke-linecap="round"
              stroke-dasharray="16 304" stroke-dashoffset="0"
              transform="rotate(32.26 80 80)" clip-path="url(#frontClipWhite)"
              filter="url(#gFrontCore)" opacity="1">
              <animate attributeName="stroke-dashoffset" from="0" to="-320" dur="4.5s" repeatCount="indefinite"/>
            </ellipse>
            <!-- ========== 环2（蓝色）底环前半 ========== -->
            <ellipse cx="80" cy="80" rx="63.055" ry="30.465" fill="none"
              stroke="url(#ring2GradFront)" stroke-width="3"
              transform="rotate(-17.36 80 80)" clip-path="url(#frontClipBlue)"/>
            <!-- ========== 环2 高亮（白色三层淡出） ========== -->
            <ellipse cx="80" cy="80" rx="63.055" ry="30.465" fill="none"
              stroke="#FFFFFF" stroke-width="3"
              stroke-dasharray="32 279" stroke-dashoffset="0"
              transform="rotate(-17.36 80 80)" clip-path="url(#frontClipBlue)"
              filter="url(#wFrontOut)" opacity="0.3">
              <animate attributeName="stroke-dashoffset" from="0" to="-311" dur="4.5s" begin="0.8s" repeatCount="indefinite"/>
            </ellipse>
            <ellipse cx="80" cy="80" rx="63.055" ry="30.465" fill="none"
              stroke="#FFFFFF" stroke-width="3"
              stroke-dasharray="24 287" stroke-dashoffset="0"
              transform="rotate(-17.36 80 80)" clip-path="url(#frontClipBlue)"
              filter="url(#wFrontMid)" opacity="0.6">
              <animate attributeName="stroke-dashoffset" from="0" to="-311" dur="4.5s" begin="0.8s" repeatCount="indefinite"/>
            </ellipse>
            <ellipse cx="80" cy="80" rx="63.055" ry="30.465" fill="none"
              stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"
              stroke-dasharray="14 297" stroke-dashoffset="0"
              transform="rotate(-17.36 80 80)" clip-path="url(#frontClipBlue)"
              filter="url(#wFrontCore)" opacity="1">
              <animate attributeName="stroke-dashoffset" from="0" to="-311" dur="4.5s" begin="0.8s" repeatCount="indefinite"/>
            </ellipse>
          </svg>
        </view>
      </view>
    </view>
    </view>

    <!-- Health Management Tips Card -->
    <view class="tips-card" :class="{ 'frost-visible': pageVisible }" style="transition-delay: 0.2s;">
      <!-- 绿色头部（提醒/梯形形状：左上方大矩形+右侧凸起梯形，中间圆角弧过渡） -->
      <view class="tips-green-header">
        <view class="tips-header-backplate"></view>
        <svg class="green-header-svg" viewBox="0 0 342 85" preserveAspectRatio="none">
          <defs>
            <!-- 原型渐变方向1.18°近似垂直：底部浅绿→顶部深绿，向下延伸渐变淡出 -->
            <linearGradient id="greenGradFinal" x1="1.5" y1="1" x2="0.5" y2="0">
              <stop offset="0%" stop-color="#77EACE" stop-opacity="0"/>
              <stop offset="35%" stop-color="#77EACE" stop-opacity="1"/>
              <stop offset="100%" stop-color="#19A280" stop-opacity="1"/>
            </linearGradient>
          </defs>
          
          <path d="
            M 0 18
            Q 0 0, 18 0
            L 153 0
            Q 162 0, 168 5
            Q 175 14, 183 22
            Q 188 28, 196 29
            L 324 29
            Q 342 29, 342 47
            L 342 77
            Q 342 85, 334 85
            L 8 85
            Q 0 85, 0 77
            Z" fill="url(#greenGradFinal)"/>
        </svg>
        <!-- 健康管理提示：绿色部分靠左下角 -->
        <text class="tips-title">健康管理提示</text>
        <!-- 快捷管理健康状态：梯形（凸起）内部靠右上角 -->
        <text class="tips-subtitle">快捷管理健康状态</text>
      </view>
      <!-- 磨砂半透明托盘：放在绿色下方，部分重叠在绿色凸起底部凹陷处 -->
      <view class="tips-frosted-tray">
        <view class="tips-content">
          <view class="tips-left-column">
            <view class="tip-item" @click="handleTipClick(tipCards[0])">
              <view class="tip-icon-wrap">
                <image src="/static/design/home/Frame-7.svg" class="tip-icon" mode="aspectFit" />
              </view>
              <view class="tip-text-wrap">
                <text class="tip-label">定期记录</text>
                <text class="tip-label">生命体征数据</text>
              </view>
            </view>
            <view class="tip-item" @click="handleTipClick(tipCards[1])">
              <view class="tip-icon-wrap">
                <image src="/static/design/home/Frame-6.svg" class="tip-icon" mode="aspectFit" />
              </view>
              <view class="tip-text-wrap">
                <text class="tip-label">按时查看</text>
                <text class="tip-label">用药提醒</text>
              </view>
            </view>
          </view>
          <view class="tips-right-column">
            <view class="indicator-chart" @click="goToIndicator">
              <view class="chart-circles">
                <view class="chart-circle circle-cyan"></view>
                <view class="chart-circle circle-light"></view>
                <view class="chart-circle circle-purple"></view>
              </view>
              <image src="/static/design/home/Vector.svg" class="chart-ring-icon" mode="aspectFit" />
              <view class="chart-text-area">
                <text class="chart-title">待提升指标</text>
                <text class="chart-link">查看详情</text>
              </view>
              <view class="indicator-tags">
                <text class="indicator-tag" v-for="(tag, i) in indicatorTags" :key="i" :style="tagStyles[i]">{{ tag.label }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- Quick Feature Cards -->
    <view class="feature-row">
      <view class="feature-card animate-fade-in-up" :style="{ animationDelay: '0.3s' }" @click="handleNavClick('/pages/schedule/schedule', '透析排班')">
        <view class="feature-info">
          <text class="feature-title">透析排班查询</text>
          <text class="feature-desc">一键查透析排班</text>
        </view>
        <image src="/static/design/home/路径.svg" class="feature-icon" mode="aspectFit" />
      </view>
      <view class="feature-card animate-fade-in-up" :style="{ animationDelay: '0.4s' }" @click="handleNavClick('/pages/health-manage/health-manage', '健康管理')">
        <view class="feature-info">
          <text class="feature-title">最新透析状态查询</text>
          <text class="feature-desc">精准查询透析状态</text>
        </view>
        <image src="/static/design/home/联集 1.svg" class="feature-icon" mode="aspectFit" />
      </view>
    </view>

    <!-- Notification Section -->
    <view class="notification-section animate-fade-in-up" :style="{ animationDelay: '0.5s' }">
      <!-- 顶部淡蓝色渐变 -->
      <view class="notification-top-gradient"></view>
      <view class="notification-header">
        <view class="notification-title-wrap">
          <image src="/static/design/home/image 2875.png" class="notification-icon" mode="aspectFit" />
          <text class="notification-title">通知消息</text>
        </view>
        <view class="notification-more-wrap" @click="goToNotification">
          <text class="notification-more">查看更多</text>
          <view class="notification-arrow"></view>
        </view>
      </view>
      <view class="notification-list" v-if="notificationList.length > 0">
        <view
          class="notification-item"
          v-for="(item, index) in notificationList"
          :key="index"
          @click="goToNotificationDetail(item)"
        >
          <view class="notification-dot"></view>
          <view class="notification-body">
            <text class="notification-text">{{ item.content }}</text>
            <view class="notification-meta">
              <text class="notification-time">{{ item.time }}</text>
              <text class="notification-view">查看</text>
            </view>
          </view>
        </view>
      </view>
      <view v-else class="notification-empty">
        <text class="empty-text">暂无通知消息</text>
      </view>
    </view>

    <view class="bottom-space"></view>
  </view>
</template>

<script>
import { get } from '../../utils/request.js'

export default {
  data() {
    return {
      tipCards: [
        { key: 'vital', title: '定期记录生命体征数据', action: 'vital' },
        { key: 'medication', title: '按时查看用药提醒', action: 'medication' }
      ],
      isNavigating: false,
      newsList: [],
      notificationList: [],
      daysProtected: 1,
      indicatorTags: [],
      tagAnimOffset: 720,
      pageVisible: true
    }
  },
  computed: {
    tagStyles() {
      return this.indicatorTags.map(tag => {
        const angle = (tag.angle + this.tagAnimOffset) * Math.PI / 180
        const x = tag.radius * Math.cos(angle)
        const y = tag.radius * Math.sin(angle)
        return {
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `translate(calc(-50% + ${x.toFixed(1)}px), calc(-50% + ${y.toFixed(1)}px))`
        }
      })
    }
  },
  onLoad() {
    this.fetchNews()
    this.fetchNotifications()
    this.calculateDaysProtected()
    this.initIndicatorTags()
  },
  onReady() {
    this.animateIndicatorTags()
  },
  onShow() {
    this.fetchNotifications()
    this.animateIndicatorTags()
    this.pageVisible = false
    this.$nextTick(() => {
      this.pageVisible = true
    })
  },
  methods: {
    initIndicatorTags() {
      const labels = ['血红蛋白', '钾', '钠', '尿酸']
      const angles = [-40, 0, 90, 180]
      this.indicatorTags = labels.map((label, i) => ({
        label,
        angle: angles[i],
        radius: 45 + Math.floor(Math.random() * 15)
      }))
    },
    animateIndicatorTags() {
      const duration = 3000
      const start = Date.now()
      const initialOffset = 270
      const step = () => {
        const elapsed = Date.now() - start
        const progress = Math.min(elapsed / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        this.tagAnimOffset = initialOffset * (1 - eased)
        if (progress < 1) {
          requestAnimationFrame(step)
        }
      }
      requestAnimationFrame(step)
    },
    async fetchNews() {
      try {
        const res = await get('/news?page=1&size=2')
        if (res.code === 200) {
          const data = res.data
          if (data.list && data.list.length > 0) {
            this.newsList = data.list.map(item => ({
              title: item.title,
              time: this.formatDate(item.createdAt),
              isTop: item.isTop || false,
              id: item.id
            }))
          }
        }
      } catch (err) {
        console.log('获取新闻失败:', err)
      }
    },
    async fetchNotifications() {
      try {
        const user = uni.getStorageSync('user')
        let userId = ''
        if (user) {
          try {
            const parsed = typeof user === 'string' ? JSON.parse(user) : user
            userId = parsed.id
          } catch (e) {
            console.log('解析用户信息失败', e)
          }
        }
        if (!userId) {
          console.log('未获取到用户ID，跳过通知查询')
          return
        }
        const res = await get(`/notification/list/${userId}?page=1&size=2`)
        if (res.code === 200) {
          let notifications = []
          const data = res.data
          if (Array.isArray(data)) {
            notifications = data
          } else if (data.list && data.list.length > 0) {
            notifications = data.list
          }
          const unreadNotifications = notifications.filter(item => !item.isRead).slice(0, 2)
          if (unreadNotifications.length > 0) {
            this.notificationList = unreadNotifications.map(item => ({
              content: item.content,
              time: this.formatDate(item.createdAt),
              id: item.id
            }))
          }
        }
      } catch (err) {
        console.log('获取通知失败:', err)
      }
    },
    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      const now = new Date()
      const m = date.getMonth() + 1
      const d = date.getDate()
      const nowM = now.getMonth() + 1
      const nowD = now.getDate()
      if (m === nowM && d === nowD) return '今天'
      return `${m}-${String(d).padStart(2, '0')}`
    },
    handleNavClick(url) {
      if (this.isNavigating) return
      this.isNavigating = true
      uni.vibrateShort({})
      uni.switchTab({
        url,
        success: () => {
          setTimeout(() => { this.isNavigating = false }, 300)
        },
        fail: () => { this.isNavigating = false }
      })
    },
    handleTipClick(tip) {
      if (tip.action === 'vital') {
        uni.navigateTo({ url: '/pages/vital-sign/vital-sign' })
      } else if (tip.action === 'medication') {
        uni.navigateTo({ url: '/pages/medication/medication' })
      }
    },
    goToIndicator() {
      uni.navigateTo({ url: '/pages/improvement-plan/improvement-plan' })
    },
    goToNews() {
      uni.navigateTo({ url: '/pages/news/list' })
    },
    goToNewsDetail(news) {
      uni.navigateTo({ url: `/pages/news/detail?id=${news.id}` })
    },
    goToNotification() {
      uni.navigateTo({ url: '/pages/notification/notification' })
    },
    goToNotificationDetail(item) {
      uni.navigateTo({ url: '/pages/notification/notification' })
    },
    calculateDaysProtected() {
      const userStr = uni.getStorageSync('user')
      if (!userStr) {
        this.daysProtected = 1
        return
      }
      let user = null
      try {
        user = typeof userStr === 'string' ? JSON.parse(userStr) : userStr
      } catch (e) {
        this.daysProtected = 1
        return
      }
      if (!user) {
        this.daysProtected = 1
        return
      }
      const createdAtStr = user.createdAt || user.created_at || ''
      if (!createdAtStr) {
        this.daysProtected = 1
        return
      }
      const createdAt = new Date(createdAtStr)
      if (isNaN(createdAt.getTime())) {
        this.daysProtected = 1
        return
      }
      const now = new Date()
      const diffTime = Math.abs(now - createdAt)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      this.daysProtected = diffDays > 0 ? diffDays : 1
    }
  }
}
</script>

<style>
@font-face {
  font-family: 'Alimama ShuHeiTi';
  src: url('/static/fonts/AlimamaShuHeiTi-Bold.woff2') format('woff2');
  font-weight: bold;
  font-style: normal;
  font-display: swap;
}
</style>

<style scoped>
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
  animation: fadeInUp 0.4s ease-out both;
}

@keyframes fadeInOnly {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-fade-in-only {
  animation: fadeInOnly 0.4s ease-out both;
}

.frost-visible {
  opacity: 1 !important;
}

.home-container {
  padding: 0;
  min-height: 100vh;
  background: linear-gradient(180deg, #b3fff4 0%, #FFFFFF 40%, #FFFFFF 100%);
  position: relative;
  overflow: visible;
}

/* Sticky Top Section - fixed on scroll, covered by content below */
.sticky-top {
  position: sticky;
  top: 0;
  z-index: 1;
  background: transparent;
  opacity: 0;
  transition: opacity 0.4s ease-out;
}

/* Status Bar / Header */
.status-bar {
  padding: calc(var(--status-bar-height, 20px) + 8px) 16px 8px;
  background: transparent;
  position: relative;
  z-index: 2;
}

.status-content {
  display: flex;
  align-items: center;
  position: relative;
}

.logo-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}


.logo-layer-img {
  width: 120px;
  height: 32px;
  display: block;
}


.logo-text-group {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.logo-cn {
  font-size: 15px;
  font-weight: 700;
  color: #0A2540;
}

.logo-en {
  font-size: 10px;
  color: #7A8BA4;
  letter-spacing: 0.5px;
}

.header-title {
  font-size: 17px;
  font-weight: 700;
  color: #0A2540;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  white-space: nowrap;
}



.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  justify-content: flex-end;
}

.header-btn {
  width: 36px;
  height: 36px;
  border: 1.5px solid #0A2540;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
}

.btn-dots {
  font-size: 14px;
  color: #0A2540;
  font-weight: 700;
  line-height: 1;
}

.btn-circle {
  font-size: 14px;
  color: #0A2540;
  line-height: 1;
}

/* Greeting Section */
.greeting-section {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 8px 26px 0px;
  position: relative;
  z-index: 2;
}

.greeting-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.greeting-main {
  font-family: 'Alimama ShuHeiTi', sans-serif;
  font-size: 32px;
  font-weight: bold;
  line-height: 38px;
  letter-spacing: 0.06em;
  white-space: nowrap;
  background: linear-gradient(90deg, #19a280 0%, #00a17d 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  display: flex;
  align-items: center;
}

.greeting-days {
  font-family: 'Alimama ShuHeiTi', sans-serif;
  font-size: 32px;
  font-weight: bold;
  line-height: 38px;
  letter-spacing: 0.06em;
  white-space: nowrap;
  background: linear-gradient(90deg, #a2bc1b 0%, #bfda41 52%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  display: flex;
  align-items: center;
}

.shield-wrap {
  position: relative;
  width: 160px;
  height: 160px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.deco-shield {
  width: 104.05px;
  height: 119.32px;
  position: relative;
  z-index: 2;
}

/* Shield shadow below the shield */
.shield-shadow {
  position: absolute;
  bottom: 25px;
  left: 60%;
  transform: translateX(-50%);
  width: 80.00px;
  height: 34.00px;
  background: linear-gradient(197deg, rgba(32, 157, 135, 0) 14%, rgba(32, 157, 135, 1) 84%);
  filter: blur(10.5px);
  -webkit-filter: blur(10.5px);
  z-index: 1;
  pointer-events: none;
}

/* 椭圆光圈 - 后半部分（盾牌后面） */
.shield-ring-back {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
}

/* 椭圆光圈 - 前半部分（盾牌前面，只显示下半部分） */
.shield-ring-front {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 3;
  pointer-events: none;
}

.ring-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

/* Tips Card - 容器透明，仅做布局 */
.tips-card {
  margin: 0 16px 16px;
  position: relative;
  z-index: 2;
  opacity: 0;
  transition: opacity 0.4s ease-out;
}

/* 绿色头部的磨砂半透明背板，覆盖标题与快捷状态 */
.tips-header-backplate {
  position: absolute;
  left: 0px;
  right: 0px;
  top: 0px;
  height: 66px;
  background: rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.28);
  box-shadow: 0 4px 16px rgba(255, 255, 255, 0.06) inset;
  z-index: 0;
  border: 0.5px solid #FFFFFF;
}

/* 绿色头部（提醒/梯形形状：左上方大矩形+右侧凸起梯形，中间圆角弧过渡） */
.tips-green-header {
  position: relative;
  height: 88px;
  overflow: visible;
  z-index: 1;
}

.green-header-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: block;
  z-index: 1;
}

/* 健康管理提示 - 绿色部分靠左下角（避免被下方托盘遮挡） */
.tips-title {
  position: absolute;
  left: 20px;
  top: 10px;
  font-size: 17px;
  font-weight: 700;
  color: #FFFFFF;
  z-index: 4;
  letter-spacing: 0.5px;
}


/* 快捷管理健康状态 - 梯形(凸起)内部靠右上角 */
.tips-subtitle {
  position: absolute;
  right: 20px;
  top: 10px;
  width: 96px;
  height: 12px;
  font-family: MiSans, sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 12px;
  letter-spacing: normal;
  color: #145248;
  z-index: 4;
  text-align: center;
  white-space: nowrap;
}


/* 磨砂半透明托盘：放在绿色下方，部分重叠在绿色底部渐变淡出区域 */
.tips-frosted-tray {
  position: relative;
  margin-top: -40px;
  z-index: 3;
  background: rgba(255, 255, 255, 0.24);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-radius: 14px;
  padding: 18px 12px 16px;
  margin-left: 0;
  margin-right: 0;
  border: 1px solid rgba(255, 255, 255, 0.58);
  box-shadow: 0 6px 24px rgba(25, 162, 128, 0.12);
}


.tips-content {
  display: flex;
  gap: 12px;
  align-items: stretch;
}

.tips-left-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.tip-item {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  border-radius: 10px;
  padding: 10px 12px;
  flex: 1 1 0;
  min-height: 0;
  overflow: hidden;
}

.tip-text-wrap {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

.tip-icon-wrap {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background: #F0FBF7;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.tip-icon {
  width: 22px;
  height: 22px;
}

.tip-label {
  font-size: 13px;
  color: #333333;
  font-weight: 500;
  line-height: 1.3;
}

.tips-right-column {
  flex: 1;
  width: 0;
  position: relative;
  display: flex;
  flex-direction: column;
}

.indicator-chart {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.4);
}

/* 三个重叠光圈 */
.chart-circles {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  z-index: 1;
}

.chart-circle {
  position: absolute;
  border-radius: 50%;
}

.circle-cyan {
  width: 80px;
  height: 80px;
  left: 0;
  top: 0;
  background: #E0FBFE;
  animation: circleBreathe 4s ease-in-out infinite;
}

.circle-light {
  width: 60px;
  height: 60px;
  left: 10px;
  top: 10px;
  background: #F3F9FF;
  animation: circleBreathe 4s ease-in-out infinite;
  animation-delay: 0.8s;
}

.circle-purple {
  width: 80px;
  height: 80px;
  left: 20px;
  top: 0;
  background: #F0F2FF;
  animation: circleBreathe 4s ease-in-out infinite;
  animation-delay: 1.6s;
}

@keyframes circleBreathe {
  0%, 100% {
    transform: scale(0.9);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.05);
    opacity: 1;
  }
}

/* 圆环图标 */
.chart-ring-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 80px;
  height: 80px;
  margin-top: -40px;
  margin-left: -40px;
  z-index: 2;
}

.chart-text-area {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  z-index: 3;
}

.chart-title {
  font-size: 13px;
  font-weight: 700;
  color: #333333;
  text-align: center;
}

.chart-link {
  font-size: 11px;
  color: #99C8DE;
}

/* Tags container: centered on circle */
.indicator-tags {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 4;
}

.indicator-tag {
  font-size: 10px;
  color: #879FBB;
  background: #DCF0F9;
  padding: 3px 6px;
  border-radius: 10px;
  white-space: nowrap;
  font-weight: 500;
}

/* Feature Cards */
.feature-row {
  display: flex;
  gap: 12px;
  margin: 0 16px 16px;
  position: relative;
  z-index: 2;
}

.feature-card {
  flex: 1;
  border-radius: 14px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  box-shadow: 0 4px 16px rgba(173, 180, 212, 0.15);
  border: none;
  opacity: 1;
  position: relative;
  min-height: 80px;
}

.feature-card:first-child {
  background: linear-gradient(0deg, rgba(245, 255, 251, 1) 0%, rgba(255, 255, 255, 1) 50%);
}

.feature-card:last-child {
  background: linear-gradient(0deg, rgba(246, 250, 255, 1) 0%, rgba(255, 255, 255, 1) 50%);
}

.feature-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
}

.feature-title {
  font-size: 14px;
  font-weight: 700;
  color: #1A2B44;
  display: block;
  white-space: nowrap;
}

.feature-desc {
  font-size: 12px;
  color: #7A8BA4;
  display: block;
  white-space: nowrap;
}

.feature-icon {
  width: 30px;
  height: 30px;
  flex-shrink: 0;
  position: absolute;
  right: 12px;
  bottom: 12px;
}

/* Notification Section */
.notification-section {
  margin: 0 0;
  background: linear-gradient(180deg, rgba(232, 236, 247, 1) 0%, rgba(250, 251, 253, 1) 12%, rgba(255, 255, 255, 1) 25%);
  border-radius: 14px;
  padding: 16px;
  box-shadow: 0 4px 20px rgba(13, 66, 49, 0.08);
  border: 1px solid rgba(255, 255, 255, 1);
  position: relative;
  z-index: 2;
  overflow: hidden;
}

/* 顶部淡蓝色渐变 */
.notification-top-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50px;
  background: linear-gradient(180deg, rgba(224, 232, 248, 0.6) 0%, rgba(232, 236, 247, 0.3) 40%, rgba(255, 255, 255, 0) 100%);
  pointer-events: none;
  z-index: 0;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  position: relative;
  z-index: 1;
}

.notification-title-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}

.notification-icon {
  width: 20px;
  height: 20px;
}

.notification-title {
  font-size: 16px;
  font-weight: 700;
  color: #1A2B44;
}

.notification-more-wrap {
  display: flex;
  align-items: center;
  gap: 4px;
}

.notification-more {
  font-size: 13px;
  color: #3497E3;
}

.notification-arrow {
  width: 6px;
  height: 6px;
  border-top: 1.5px solid #3497E3;
  border-right: 1.5px solid #3497E3;
  transform: rotate(45deg);
  flex-shrink: 0;
}

.notification-list {
  display: flex;
  flex-direction: column;
}

.notification-item {
  display: flex;
  gap: 8px;
  padding: 12px 0;
  border-bottom: 1px solid #F2F3F5;
}

.notification-item:last-child {
  border-bottom: none;
}

.notification-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #19A280;
  flex-shrink: 0;
  margin-top: 6px;
}

.notification-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.notification-text {
  font-size: 14px;
  color: #4A5568;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.notification-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.notification-time {
  font-size: 12px;
  color: #97A2B5;
}

.notification-view {
  font-size: 12px;
  color: #2D9CDB;
}

.notification-empty {
  padding: 20px 0;
  text-align: center;
}

.empty-text {
  font-size: 14px;
  color: #C0C4CC;
}

.bottom-space {
  height: 100px;
}
</style>
