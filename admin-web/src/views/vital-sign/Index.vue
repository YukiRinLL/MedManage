<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">生命体征管理</h2>
      <el-button type="primary" @click="handleAdd"><el-icon><Plus /></el-icon>添加记录</el-button>
    </div>

    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="患者">
         <el-select v-model="searchForm.userId" placeholder="请选择患者" clearable filterable style="width: 240px" @change="handlePatientChange">
            <el-option v-for="patient in patientOptions" :key="patient.id" :label="patient.name + ' (' + patient.phone + ')'" :value="patient.id" />
          </el-select>
        </el-form-item>
        <el-form-item><el-button type="primary" @click="handleSearch"><el-icon><Search /></el-icon>搜索</el-button><el-button @click="resetSearch"><el-icon><Refresh /></el-icon>重置</el-button></el-form-item>
      </el-form>
    </el-card>

    <el-card>
       <el-empty v-if="!searchForm.userId" description="请选择患者查看生命体征" />
       <el-table v-else :data="tableData" v-loading="loading" border stripe>
        <el-table-column label="患者" width="120" fixed><template #default="{ row }">{{ getPatientName(row.userId) }}</template></el-table-column>
        <el-table-column prop="recordTime" label="记录时间" width="165"><template #default="{ row }">{{ formatDateTime(row.recordTime) }}</template></el-table-column>
        <el-table-column prop="temperature" label="体温(°C)" width="105" />
        <el-table-column prop="weight" label="体重(kg)" width="105" />
        <el-table-column label="晨间血压" width="130"><template #default="{ row }">{{ pressure(row.morningSystolicPressure, row.morningDiastolicPressure) }}</template></el-table-column>
        <el-table-column label="晚间血压" width="130"><template #default="{ row }">{{ pressure(row.eveningSystolicPressure, row.eveningDiastolicPressure) }}</template></el-table-column>
        <el-table-column prop="bloodSugar" label="血糖" width="90" />
        <el-table-column prop="heartRate" label="心率(bpm)" width="105" />
        <el-table-column prop="waterIntake" label="饮水(ml)" width="100" />
        <el-table-column prop="dietRecord" label="饮食记录" min-width="150" show-overflow-tooltip />
        <el-table-column prop="notes" label="备注" min-width="150" show-overflow-tooltip />
        <el-table-column label="操作" width="130" fixed="right"><template #default="{ row }"><el-button type="primary" link @click="editRow(row)">编辑</el-button><el-button type="danger" link @click="deleteRow(row)">删除</el-button></template></el-table-column>
      </el-table>
      <div class="pagination-wrap"><el-pagination v-model:current-page="pagination.page" v-model:page-size="pagination.size" :total="pagination.total" :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="fetchData" /></div>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="760px" :close-on-click-modal="false">
      <el-form :model="formData" label-width="125px">
        <el-row :gutter="20"><el-col :span="12"><el-form-item label="患者" required><el-select v-model="formData.userId" filterable style="width: 100%"><el-option v-for="patient in patientOptions" :key="patient.id" :label="patient.name + ' (' + patient.phone + ')'" :value="patient.id" /></el-select></el-form-item></el-col><el-col :span="12"><el-form-item label="记录时间" required><el-date-picker v-model="formData.recordTime" type="datetime" value-format="YYYY-MM-DDTHH:mm:ss" style="width: 100%" /></el-form-item></el-col></el-row>
        <el-row :gutter="20"><el-col :span="12"><el-form-item label="体温(°C)"><el-input-number v-model="formData.temperature" :precision="1" :min="0" /></el-form-item></el-col><el-col :span="12"><el-form-item label="体重(kg)"><el-input-number v-model="formData.weight" :precision="1" :min="0" /></el-form-item></el-col></el-row>
        <el-row :gutter="20"><el-col :span="12"><el-form-item label="晨间收缩压"><el-input-number v-model="formData.morningSystolicPressure" :min="0" /></el-form-item></el-col><el-col :span="12"><el-form-item label="晨间舒张压"><el-input-number v-model="formData.morningDiastolicPressure" :min="0" /></el-form-item></el-col></el-row>
        <el-row :gutter="20"><el-col :span="12"><el-form-item label="晚间收缩压"><el-input-number v-model="formData.eveningSystolicPressure" :min="0" /></el-form-item></el-col><el-col :span="12"><el-form-item label="晚间舒张压"><el-input-number v-model="formData.eveningDiastolicPressure" :min="0" /></el-form-item></el-col></el-row>
        <el-row :gutter="20"><el-col :span="12"><el-form-item label="血糖"><el-input-number v-model="formData.bloodSugar" :precision="1" :min="0" /></el-form-item></el-col><el-col :span="12"><el-form-item label="心率(bpm)"><el-input-number v-model="formData.heartRate" :min="0" /></el-form-item></el-col></el-row>
        <el-form-item label="饮水量(ml)"><el-input-number v-model="formData.waterIntake" :min="0" /></el-form-item><el-form-item label="饮食记录"><el-input v-model="formData.dietRecord" type="textarea" :rows="2" /></el-form-item><el-form-item label="备注"><el-input v-model="formData.notes" type="textarea" :rows="2" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="dialogVisible = false">取消</el-button><el-button type="primary" @click="handleSave">保存</el-button></template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Plus, Search, Refresh } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '@/utils/request'

const loading = ref(false), dialogVisible = ref(false), dialogTitle = ref('添加生命体征记录')
const patientOptions = ref([]), tableData = ref([])
const searchForm = reactive({ userId: '' })
const pagination = reactive({ page: 1, size: 10, total: 0 })
const emptyForm = () => ({ id: '', userId: '', temperature: null, weight: null, morningSystolicPressure: null, morningDiastolicPressure: null, eveningSystolicPressure: null, eveningDiastolicPressure: null, bloodSugar: null, heartRate: null, waterIntake: null, dietRecord: '', notes: '', recordTime: '' })
const formData = reactive(emptyForm())

const unwrapList = (data) => data?.content || data?.list || (Array.isArray(data) ? data : [])
const fetchData = async () => { if (!searchForm.userId) return; loading.value = true; try { const res = await request.get('/vital-sign/admin/list', { params: { page: pagination.page, size: pagination.size, userId: searchForm.userId } }); if (res.code === 200) { tableData.value = unwrapList(res.data); pagination.total = res.data?.totalElements || res.data?.total || tableData.value.length } } catch { ElMessage.error('获取生命体征失败') } finally { loading.value = false } }
const fetchPatients = async () => { try { const res = await request.get('/user/list', { params: { page: 1, size: 100 } }); if (res.code === 200) patientOptions.value = unwrapList(res.data) } catch { ElMessage.error('获取患者列表失败') } }
const handleSearch = () => { pagination.page = 1; fetchData() }
const handlePatientChange = () => { pagination.page = 1; tableData.value = []; pagination.total = 0; fetchData() }
const resetSearch = () => { searchForm.userId = ''; handleSearch() }
const handleSizeChange = (size) => { pagination.size = size; pagination.page = 1; fetchData() }
const handleAdd = () => { if (!searchForm.userId) return ElMessage.warning('请先选择患者'); Object.assign(formData, emptyForm(), { userId: searchForm.userId }); dialogTitle.value = '添加生命体征记录'; dialogVisible.value = true }
const editRow = (row) => { Object.assign(formData, emptyForm(), row); dialogTitle.value = '编辑生命体征记录'; dialogVisible.value = true }
const handleSave = async () => { if (!formData.userId || !formData.recordTime) return ElMessage.warning('请选择患者并填写记录时间'); try { const res = formData.id ? await request.put(`/vital-sign/admin/${formData.id}`, formData) : await request.post('/vital-sign/admin', formData); if (res.code === 200) { ElMessage.success('保存成功'); dialogVisible.value = false; fetchData() } } catch { ElMessage.error('保存失败') } }
const deleteRow = async (row) => { try { await ElMessageBox.confirm('确定要删除这条生命体征记录吗？', '提示', { type: 'warning' }); const res = await request.delete(`/vital-sign/admin/${row.id}`); if (res.code === 200) { ElMessage.success('删除成功'); fetchData() } } catch (error) { if (error !== 'cancel') ElMessage.error('删除失败') } }
const getPatientName = (id) => patientOptions.value.find(p => p.id === id)?.name || id || '-'
const pressure = (s, d) => s || d ? `${s || '-'}/${d || '-'}` : '-'
const formatDateTime = (value) => value ? new Date(value).toLocaleString('zh-CN', { hour12: false }) : '-'
onMounted(() => { fetchPatients() })
</script>

<style scoped>
.page-container { padding: 20px; }.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }.page-title { margin: 0; font-size: 20px; color: #303133; }.search-card { margin-bottom: 20px; }.pagination-wrap { display: flex; justify-content: flex-end; margin-top: 20px; }
</style>
