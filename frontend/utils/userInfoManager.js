// 用户信息管理模块，用于全局存储和管理用户信息

// 存储用户信息
const USER_INFO_KEY = 'userInfo'

// 获取用户信息
export function getUserInfo() {
  try {
    const userInfo = uni.getStorageSync(USER_INFO_KEY)
    return userInfo ? JSON.parse(userInfo) : null
  } catch (e) {
    console.error('获取用户信息失败:', e)
    return null
  }
}

// 设置用户信息
export function setUserInfo(userInfo) {
  try {
    uni.setStorageSync(USER_INFO_KEY, JSON.stringify(userInfo))
  } catch (e) {
    console.error('保存用户信息失败:', e)
  }
}

// 清除用户信息
export function clearUserInfo() {
  try {
    uni.removeStorageSync(USER_INFO_KEY)
  } catch (e) {
    console.error('清除用户信息失败:', e)
  }
}

// 从API获取用户信息并更新全局存储
import { get } from './request.js'

export async function fetchUserInfo() {
  try {
    const token = uni.getStorageSync('token')
    if (!token) {
      return null
    }
    const res = await get('/user/info')
    if (res.code === 200 && res.data && res.data.data && res.data.data.data) {
      const userInfo = res.data.data.data
      setUserInfo(userInfo)
      return userInfo
    }
    return null
  } catch (err) {
    console.error('获取用户信息失败:', err)
    return null
  }
}
