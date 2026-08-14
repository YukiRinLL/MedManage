<script>
export default {
  onLaunch: function() {
    console.log('App Launch')
  },
  onShow: function() {
    console.log('App Show')
  },
  onHide: function() {
    console.log('App Hide')
  }
}
</script>

<style>
:root {
  --primary-color: #009D85;
  --primary-light: #26B99A;
  --primary-dark: #007D6B;
  --secondary-color: #ABCD07;
  --secondary-light: #C4E02A;
  --success-color: #67C23A;
  --warning-color: #E6A23C;
  --danger-color: #F56C6C;
  --text-primary: #303133;
  --text-regular: #606266;
  --text-secondary: #909399;
  --text-placeholder: #C0C4CC;
  --border-base: #DCDFE6;
  --background-base: #F5F7FA;
  --white: #FFFFFF;
  /* 全局设计稿等比缩放因子（以 iPhone SE 375px 为基准） */
  --s: calc(100vw / 375);
  /* 字体尺寸（scaled） */
  --fs-xs:  calc(10px * var(--s));
  --fs-sm:  calc(12px * var(--s));
  --fs-md:  calc(14px * var(--s));
  --fs-lg:  calc(16px * var(--s));
  --fs-xl:  calc(17px * var(--s));
  --fs-2xl: calc(20px * var(--s));
  /* 间距（scaled） */
  --sp-1:  calc(4px * var(--s));
  --sp-2:  calc(8px * var(--s));
  --sp-3:  calc(12px * var(--s));
  --sp-4:  calc(16px * var(--s));
  --sp-5:  calc(20px * var(--s));
  /* 圆角（scaled） */
  --r-sm: calc(6px * var(--s));
  --r-md: calc(10px * var(--s));
  --r-lg: calc(14px * var(--s));
  --r-xl: calc(16px * var(--s));
  /* 图标（scaled） */
  --ic-sm: calc(20px * var(--s));
  --ic-md: calc(28px * var(--s));
  --ic-lg: calc(40px * var(--s));
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

page {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background-color: var(--background-base);
  color: var(--text-primary);
  min-height: 100vh;
}

.btn-primary {
  background-color: var(--primary-color);
  color: var(--white);
  border: none;
  border-radius: 8px;
}

.btn-primary:active {
  background-color: var(--primary-dark);
}

.card-hover {
  transition: all 0.3s ease;
}

.card-hover:active {
  background-color: var(--background-base);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

.animate-slide-up {
  animation: slideUp 0.4s ease-out;
}
</style>
