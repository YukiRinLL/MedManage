<template>
  <view class="admin-users">
    <!-- 搜索栏 -->
    <view class="search-bar">
      <input 
        class="search-input"
        type="text" 
        v-model="searchQuery" 
        placeholder="搜索用户手机号或姓名"
        @input="handleSearch"
      />
    </view>

    <!-- 用户列表 -->
    <view class="users-list">
      <view v-for="user in filteredUsers" :key="user.id" class="user-card">
        <view class="user-info">
          <text class="user-name">{{ user.name || '未设置' }}</text>
          <text class="user-phone">{{ user.phone }}</text>
        </view>
        <view class="user-details">
          <view class="detail-row">
            <text class="detail-label">性别:</text>
            <text class="detail-value">{{ user.gender === 1 ? '男' : '女' }}</text>
          </view>
          <view class="detail-row">
            <text class="detail-label">年龄:</text>
            <text class="detail-value">{{ user.age || '未设置' }}</text>
          </view>
          <view class="detail-row">
            <text class="detail-label">注册时间:</text>
            <text class="detail-value">{{ formatDate(user.createdAt) }}</text>
          </view>
        </view>
        <view class="user-actions">
          <button class="action-btn role-btn" @click="toggleAdminRole(user)">
            {{ user.isAdmin ? '移除管理员' : '设为管理员' }}
          </button>
          <button class="action-btn delete-btn" @click="deleteUser(user.id)">删除</button>
        </view>
      </view>
      
      <view v-if="filteredUsers.length === 0" class="empty-state">
        <text class="empty-text">暂无用户数据</text>
      </view>
    </view>
    
    <!-- 退出登录按钮 -->
    <view class="logout-section">
      <button class="btn-logout" @click="handleLogout">退出登录</button>
    </view>
  </view>
</template>

<script>
import { get, del, put } from '../../utils/request.js'

export default {
  data() {
    return {
      users: [],
      searchQuery: '',
      adminName: '管理员'
    }
  },
  computed: {
    filteredUsers() {
      if (!this.searchQuery) {
        return this.users
      }
      const query = this.searchQuery.toLowerCase()
      return this.users.filter(user => 
        (user.phone && user.phone.includes(query)) ||
        (user.name && user.name.toLowerCase().includes(query))
      )
    }
  },
  onLoad() {
    this.checkAdminPermission()
    this.fetchUsers()
  },
  methods: {
    checkAdminPermission() {
      const isAdmin = uni.getStorageSync('isAdmin')
      const token = uni.getStorageSync('token')
      
      if (!isAdmin || !token) {
        uni.navigateTo({
          url: '/pages/admin-login/admin-login'
        })
        return false
      }
      
      const userStr = uni.getStorageSync('user')
      if (userStr) {
        const user = JSON.parse(userStr)
        this.adminName = user.name || '管理员'
      }
      
      return true
    },
    async fetchUsers() {
      try {
        const res = await get('/admin/users')
        if (res.code === 200) {
          this.users = res.data
        }
      } catch (error) {
        console.error('获取用户列表失败:', error)
        uni.showToast({
          title: '获取用户列表失败',
          icon: 'none'
        })
      }
    },
    handleSearch() {
      // 搜索逻辑在computed中处理
    },
    async deleteUser(id) {
      uni.showModal({
        title: '确认删除',
        content: '确定要删除该用户吗？',
        success: async (res) => {
          if (res.confirm) {
            try {
              await del(`/admin/users/${id}`)
              uni.showToast({
                title: '删除成功',
                icon: 'success'
              })
              this.fetchUsers()
            } catch (error) {
              console.error('删除用户失败:', error)
              uni.showToast({
                title: '删除失败',
                icon: 'none'
              })
            }
          }
        }
      })
    },
    async toggleAdminRole(user) {
      const action = user.isAdmin ? '移除管理员权限' : '设为管理员'
      uni.showModal({
        title: '确认操作',
        content: `确定要${action}吗？`,
        success: async (res) => {
          if (res.confirm) {
            try {
              await put(`/admin/users/${user.id}/role`, { isAdmin: !user.isAdmin })
              uni.showToast({
                title: '操作成功',
                icon: 'success'
              })
              this.fetchUsers()
            } catch (error) {
              console.error('修改用户角色失败:', error)
              uni.showToast({
                title: '操作失败',
                icon: 'none'
              })
            }
          }
        }
      })
    },
    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString()
    },
    handleLogout() {
      uni.removeStorageSync('token')
      uni.removeStorageSync('user')
      uni.removeStorageSync('isAdmin')
      uni.navigateTo({
        url: '/pages/admin-login/admin-login'
      })
    }
  }
}
</script>

<style scoped>
.admin-users {
  padding: 20px;
  min-height: 100vh;
  background: #f5f7fa;
}

/* 搜索栏 */
.search-bar {
  margin-bottom: 20px;
}

.search-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  box-sizing: border-box;
}

/* 用户列表 */
.users-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.user-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.user-info {
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.user-name {
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.user-phone {
  display: block;
  font-size: 14px;
  color: #666;
}

.user-details {
  margin-bottom: 12px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.detail-label {
  font-size: 14px;
  color: #666;
}

.detail-value {
  font-size: 14px;
  color: #333;
}

.user-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  flex: 1;
  padding: 8px;
  border-radius: 6px;
  font-size: 12px;
  border: none;
}

.role-btn {
  background-color: #007AFF;
  color: white;
}

.delete-btn {
  background-color: #ff3b30;
  color: white;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px 20px;
}

.empty-text {
  font-size: 16px;
  color: #999;
}

/* 退出登录按钮 */
.logout-section {
  padding: 16px;
}

.btn-logout {
  background-color: #ff3b30;
  color: #FFFFFF;
  border-radius: 8px;
  padding: 14px;
  font-size: 16px;
  text-align: center;
  border: none;
  width: 100%;
}
</style>