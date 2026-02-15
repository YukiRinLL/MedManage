import App from './App.vue'
import { createSSRApp, createApp as createVueApp } from 'vue'

export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}

if (typeof window !== 'undefined') {
  const app = createVueApp(App)
  app.mount('#app')
}