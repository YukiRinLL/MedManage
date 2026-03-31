import { get, post, put, del } from '../utils/request'

// 获取患者的诊断信息
export function getDiagnosesByUserId(userId) {
  return get(`/diagnosis/user/${userId}`)
}

// 获取诊断信息详情
export function getDiagnosisById(id) {
  return get(`/diagnosis/${id}`)
}

// 创建诊断信息
export function createDiagnosis(data) {
  return post('/diagnosis', data)
}

// 更新诊断信息
export function updateDiagnosis(id, data) {
  return put(`/diagnosis/${id}`, data)
}

// 删除诊断信息
export function deleteDiagnosis(id) {
  return del(`/diagnosis/${id}`)
}
