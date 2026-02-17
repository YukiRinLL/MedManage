import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('admin_token') || '')
  const userInfo = ref(JSON.parse(localStorage.getItem('admin_user') || 'null'))
  const isAdmin = ref(localStorage.getItem('admin_isAdmin') === 'true')
  const isSuperAdmin = ref(localStorage.getItem('admin_isSuperAdmin') === 'true')

  function setToken(newToken) {
    token.value = newToken
    localStorage.setItem('admin_token', newToken)
  }

  function setUserInfo(info) {
    userInfo.value = info
    localStorage.setItem('admin_user', JSON.stringify(info))
  }

  function setIsAdmin(value) {
    isAdmin.value = value
    localStorage.setItem('admin_isAdmin', value)
  }

  function setIsSuperAdmin(value) {
    isSuperAdmin.value = value
    localStorage.setItem('admin_isSuperAdmin', value)
  }

  function logout() {
    token.value = ''
    userInfo.value = null
    isAdmin.value = false
    isSuperAdmin.value = false
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    localStorage.removeItem('admin_isAdmin')
    localStorage.removeItem('admin_isSuperAdmin')
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
