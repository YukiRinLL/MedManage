import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const token = ref('')
  const userInfo = ref(null)
  const isAdmin = ref(false)
  const isSuperAdmin = ref(false)

  try {
    token.value = localStorage.getItem('admin_token') || ''
    userInfo.value = JSON.parse(localStorage.getItem('admin_user') || 'null')
    isAdmin.value = localStorage.getItem('admin_isAdmin') === 'true'
    isSuperAdmin.value = localStorage.getItem('admin_isSuperAdmin') === 'true'
  } catch (error) {
    console.error('读取localStorage失败:', error)
  }

  function setToken(newToken) {
    token.value = newToken
    try {
      localStorage.setItem('admin_token', newToken)
    } catch (error) {
      console.error('保存token到localStorage失败:', error)
    }
  }

  function setUserInfo(info) {
    userInfo.value = info
    try {
      localStorage.setItem('admin_user', JSON.stringify(info))
    } catch (error) {
      console.error('保存userInfo到localStorage失败:', error)
    }
  }

  function setIsAdmin(value) {
    isAdmin.value = value
    try {
      localStorage.setItem('admin_isAdmin', value)
    } catch (error) {
      console.error('保存isAdmin到localStorage失败:', error)
    }
  }

  function setIsSuperAdmin(value) {
    isSuperAdmin.value = value
    try {
      localStorage.setItem('admin_isSuperAdmin', value)
    } catch (error) {
      console.error('保存isSuperAdmin到localStorage失败:', error)
    }
  }

  function logout() {
    token.value = ''
    userInfo.value = null
    isAdmin.value = false
    isSuperAdmin.value = false
    try {
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_user')
      localStorage.removeItem('admin_isAdmin')
      localStorage.removeItem('admin_isSuperAdmin')
    } catch (error) {
      console.error('清除localStorage失败:', error)
    }
  }

  return {
    token,
    userInfo,
    isAdmin,
    isSuperAdmin,
    setToken,
    setUserInfo,
    setIsAdmin,
    setIsSuperAdmin,
    logout
  }
})
