<template>
  <view class="about-container">
    <view class="section-header animate-fade-in">
      <view class="header-content">
        <text class="section-title">关于我们</text>
        <text class="section-desc">了解圣通尚诺医疗</text>
      </view>
    </view>

    <view class="about-content">
      <view class="about-card">
        <view class="about-logo">
          <image src="/static/icons/png/filled/symbols/heart_cardiogram@2x.png" class="logo-img" mode="aspectFit" />
        </view>
        <text class="company-name">圣通尚诺医疗</text>
        <text class="company-slogan">专注透析患者健康管理</text>
      </view>

      <view class="about-card">
        <text class="card-title">公司简介</text>
        <text class="about-text">
          重庆圣通尚诺医疗管理有限公司成立于2018年，是一家专注于透析患者综合管理服务的医疗健康企业。我们致力于为透析患者提供全方位的健康管理支持，包括医疗服务、健康监测、生活指导等。
        </text>
        <text class="about-text">
          公司拥有专业的医疗团队和先进的医疗设备，秉承"以患者为中心"的服务理念，努力提升患者的生活质量和健康水平。
        </text>
      </view>

      <view class="about-card">
        <text class="card-title">服务理念</text>
        <view class="service-list">
          <view class="service-item">
            <image src="/static/icons/png/filled/symbols/heart@2x.png" class="service-icon" mode="aspectFit" />
            <text class="service-text">以患者为中心</text>
          </view>
          <view class="service-item">
            <image src="/static/icons/png/filled/symbols/shield@2x.png" class="service-icon" mode="aspectFit" />
            <text class="service-text">专业可靠</text>
          </view>
          <view class="service-item">
            <image src="/static/icons/png/filled/symbols/users@2x.png" class="service-icon" mode="aspectFit" />
            <text class="service-text">贴心服务</text>
          </view>
          <view class="service-item">
            <image src="/static/icons/png/filled/symbols/trending_up@2x.png" class="service-icon" mode="aspectFit" />
            <text class="service-text">持续改进</text>
          </view>
        </view>
      </view>

      <view class="about-card">
        <text class="card-title">联系方式</text>
        <view class="contact-list">
          <view class="contact-item">
            <image src="/static/icons/png/filled/symbols/phone@2x.png" class="contact-icon" mode="aspectFit" />
            <view class="contact-info">
              <text class="contact-label">服务热线</text>
              <text class="contact-value">400-888-8888</text>
            </view>
          </view>
          <view class="contact-item">
            <image src="/static/icons/png/filled/symbols/clock@2x.png" class="contact-icon" mode="aspectFit" />
            <view class="contact-info">
              <text class="contact-label">服务时间</text>
              <text class="contact-value">周一至周日 8:00-20:00</text>
            </view>
          </view>
          <view class="contact-item">
            <image src="/static/icons/png/filled/places/home@2x.png" class="contact-icon" mode="aspectFit" />
            <view class="contact-info">
              <text class="contact-label">机构地址</text>
              <text class="contact-value">重庆市渝北区龙溪街道金龙路259号</text>
            </view>
          </view>
          <view class="contact-item">
            <image src="/static/icons/png/filled/symbols/mail@2x.png" class="contact-icon" mode="aspectFit" />
            <view class="contact-info">
              <text class="contact-label">电子邮箱</text>
              <text class="contact-value">service@stsnmedical.com</text>
            </view>
          </view>
        </view>
      </view>

      <view class="version-info">
        <text class="version-text">版本 1.0.0</text>
        <text class="copyright">© 2026 圣通尚诺医疗管理有限公司</text>
      </view>
    </view>

    <view class="bottom-space"></view>
  </view>
</template>

<script>
export default {
  data() {
    return {}
  }
}
</script>

<style scoped>
.about-container {
  padding: 0;
  min-height: 100vh;
  background-color: #F5F7FA;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-20px); }
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

.about-content {
  padding: 16px;
}

.about-card {
  background-color: #FFFFFF;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.about-logo {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: rgba(0, 157, 133, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}

.logo-img {
  width: 50px;
  height: 50px;
}

.company-name {
  display: block;
  font-size: 22px;
  font-weight: 700;
  color: #303133;
  text-align: center;
  margin-bottom: 8px;
}

.company-slogan {
  display: block;
  font-size: 14px;
  color: #909399;
  text-align: center;
}

.card-title {
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #F0F0F0;
}

.about-text {
  display: block;
  font-size: 14px;
  color: #606266;
  line-height: 1.7;
  margin-bottom: 12px;
}

.about-text:last-child {
  margin-bottom: 0;
}

.service-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.service-item {
  flex: 1;
  min-width: 45%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  background-color: #F5F7FA;
  border-radius: 8px;
}

.service-icon {
  width: 32px;
  height: 32px;
  margin-bottom: 8px;
}

.service-text {
  font-size: 14px;
  color: #303133;
}

.contact-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.contact-item {
  display: flex;
  align-items: center;
}

.contact-icon {
  width: 24px;
  height: 24px;
  margin-right: 12px;
}

.contact-info {
  flex: 1;
}

.contact-label {
  display: block;
  font-size: 12px;
  color: #909399;
  margin-bottom: 4px;
}

.contact-value {
  font-size: 14px;
  color: #303133;
}

.version-info {
  text-align: center;
  padding: 24px;
}

.version-text {
  display: block;
  font-size: 12px;
  color: #909399;
  margin-bottom: 8px;
}

.copyright {
  font-size: 12px;
  color: #C0C4CC;
}

.bottom-space {
  height: 100px;
}
</style>