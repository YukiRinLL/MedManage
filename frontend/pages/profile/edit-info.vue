<template>
  <view class="edit-info-container">
    <!-- 编辑表单 -->
    <view class="form" v-if="userInfo">
      <view class="form-item">
        <text class="form-label">手机号</text>
        <input 
          class="form-input" 
          type="number" 
          v-model="editForm.phone" 
          disabled 
          placeholder-class="form-input-placeholder"
        />
      </view>
      
      <view class="form-item">
        <text class="form-label">姓名</text>
        <input 
          class="form-input" 
          type="text" 
          v-model="editForm.name"
          placeholder="请输入姓名"
          placeholder-class="form-input-placeholder"
          :focus="nameFocus"
          @focus="nameFocus = true"
          @blur="nameFocus = false"
        />
      </view>
      
      <view class="form-item">
        <text class="form-label">性别</text>
        <view class="gender-selector">
          <view class="gender-option" :class="{ active: editForm.gender === 0 }" @click="editForm.gender = 0">
            <text>女</text>
          </view>
          <view class="gender-option" :class="{ active: editForm.gender === 1 }" @click="editForm.gender = 1">
            <text>男</text>
          </view>
        </view>
      </view>
      
      <view class="form-item">
        <text class="form-label">紧急联系人</text>
        <input 
          class="form-input" 
          type="text" 
          v-model="editForm.emergencyContact"
          placeholder="请输入紧急联系人"
          placeholder-class="form-input-placeholder"
          :focus="emergencyContactFocus"
          @focus="emergencyContactFocus = true"
          @blur="emergencyContactFocus = false"
        />
      </view>
      
      <view class="form-item">
        <text class="form-label">紧急联系电话</text>
        <input 
          class="form-input" 
          type="number" 
          v-model="editForm.emergencyPhone"
          placeholder="请输入紧急联系电话"
          placeholder-class="form-input-placeholder"
          :focus="emergencyPhoneFocus"
          @focus="emergencyPhoneFocus = true"
          @blur="emergencyPhoneFocus = false"
        />
      </view>
      
      <view class="form-item">
        <text class="form-label">民族</text>
        <input 
          class="form-input" 
          type="text" 
          v-model="editForm.nation"
          placeholder="请输入民族"
          placeholder-class="form-input-placeholder"
        />
      </view>
      
      <view class="form-item">
        <text class="form-label">出生日期</text>
        <input 
          class="form-input" 
          type="text" 
          v-model="editForm.birthDate"
          placeholder="请输入出生日期"
          placeholder-class="form-input-placeholder"
        />
      </view>
      
      <view class="form-item">
        <text class="form-label">邮政编码</text>
        <input 
          class="form-input" 
          type="number" 
          v-model="editForm.postalCode"
          placeholder="请输入邮政编码"
          placeholder-class="form-input-placeholder"
        />
      </view>
      
      <view class="form-item">
        <text class="form-label">邮箱</text>
        <input 
          class="form-input" 
          type="text" 
          v-model="editForm.email"
          placeholder="请输入邮箱"
          placeholder-class="form-input-placeholder"
        />
      </view>
      
      <view class="form-actions">
        <button class="btn-cancel" @click="cancelEdit">取消</button>
        <button class="btn-save" @click="saveChanges">保存修改</button>
      </view>
    </view>
  </view>
</template>

<script>
import { put } from '../../utils/request.js'
import { getUserInfo, fetchUserInfo, setUserInfo } from '../../utils/userInfoManager.js'

export default {
  data() {
    return {
      userInfo: null,
      editForm: {
        phone: '',
        name: '',
        gender: 0,
        idCard: '',
        emergencyContact: '',
        emergencyPhone: '',
        txNumber: '',
        nation: '',
        birthDate: '',
        postalCode: '',
        email: '',
        insuranceType: '',
        medicalCertType: '',
        electronicMedicalId: '',
        diagnosis: '',
        hospitalizationStatus: 0,
        admissionDate: '',
        dischargeDate: '',
        patientType: 0
      },
      nameFocus: false,
      idCardFocus: false,
      emergencyContactFocus: false,
      emergencyPhoneFocus: false
    }
  },
  onLoad() {
    this.getUserInfo()
  },
  methods: {
    async getUserInfo() {
      try {
        const token = uni.getStorageSync('token')
        if (!token) {
          uni.navigateTo({
            url: '/pages/login/login'
          })
          return
        }
        // 先尝试从本地存储获取
        let userInfo = getUserInfo()
        if (userInfo) {
          this.userInfo = userInfo
          this.editForm = { ...userInfo }
        } else {
          // 本地没有则从API获取
          userInfo = await fetchUserInfo()
          if (userInfo) {
            this.userInfo = userInfo
            this.editForm = { ...userInfo }
          }
        }
      } catch (err) {
        console.log(err)
        uni.showToast({
          title: '获取个人信息失败',
          icon: 'none'
        })
      }
    },
    async saveChanges() {
      try {
        const token = uni.getStorageSync('token')
        const res = await put('/user/update', this.editForm)
        if (res.code === 200) {
          uni.showToast({
            title: '更新成功',
            icon: 'success'
          })
          // 更新本地存储的用户信息
          if (res.data && res.data.data) {
            setUserInfo(res.data.data)
          }
          setTimeout(() => {
            uni.navigateBack()
          }, 1000)
        }
      } catch (err) {
        console.log(err)
        uni.showToast({
          title: '更新失败，请检查网络连接',
          icon: 'none'
        })
      }
    },
    cancelEdit() {
      uni.navigateBack()
    }
  }
}
</script>

<style scoped>
.edit-info-container {
  padding: 0;
  min-height: 100vh;
  background-color: #f5f5f5;
}

/* 编辑表单 */
.form {
  background-color: #FFFFFF;
  margin: 16px;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-item {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.form-input {
  width: 100%;
  height: 48px;
  padding: 0 14px;
  border: 1px solid #E5E5E5;
  border-radius: 8px;
  font-size: 14px;
  background-color: #FFFFFF;
  box-sizing: border-box;
  line-height: 48px;
}

.form-input-placeholder {
  color: #999999;
}

.form-input[disabled] {
  background-color: #f5f5f5;
  color: #999;
}

.gender-selector {
  display: flex;
  gap: 12px;
}

.gender-option {
  flex: 1;
  padding: 12px;
  border: 1px solid #DCDFE6;
  border-radius: 8px;
  text-align: center;
  font-size: 14px;
  color: #606266;
  background-color: #F5F7FA;
}

.gender-option.active {
  background-color: #009D85;
  color: #FFFFFF;
  border-color: #009D85;
}

/* 操作按钮 */
.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 30px;
}

.btn-cancel {
  flex: 1;
  background-color: #F5F7FA;
  color: #606266;
  border-radius: 8px;
  padding: 14px;
  font-size: 16px;
  text-align: center;
  border: 1px solid #DCDFE6;
}

.btn-cancel:active {
  background-color: #EBEEF5;
}

.btn-save {
  flex: 1;
  background-color: #009D85;
  color: #FFFFFF;
  border-radius: 8px;
  padding: 14px;
  font-size: 16px;
  font-weight: 500;
  text-align: center;
  border: none;
}

.btn-save:active {
  background-color: #007D6B;
}
</style>