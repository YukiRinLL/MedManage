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
