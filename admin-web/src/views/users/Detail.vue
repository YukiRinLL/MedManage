<template>
  <div class="patient-detail">
    <el-page-header @back="goBack">
      <template #content>
        <span>{{ patient.name || '患者详情' }}</span>
      </template>
    </el-page-header>

    <el-card class="patient-card" v-loading="patientLoading">
      <template #header><span>患者基本信息</span></template>
      <el-descriptions :column="4" border>
        <el-descriptions-item label="姓名">{{ patient.name || '-' }}</el-descriptions-item>
        <el-descriptions-item label="手机号">{{ patient.phone || '-' }}</el-descriptions-item>
        <el-descriptions-item label="透析号">{{ patient.txNumber || '-' }}</el-descriptions-item>
        <el-descriptions-item label="性别">{{ genderText(patient.gender) }}</el-descriptions-item>
        <el-descriptions-item label="年龄">{{ patient.age || '-' }}</el-descriptions-item>
        <el-descriptions-item label="身份证号">{{ patient.idCard || '-' }}</el-descriptions-item>
        <el-descriptions-item label="保险类型">{{ patient.insuranceType || '-' }}</el-descriptions-item>
        <el-descriptions-item label="住院状态">{{ patient.hospitalizationStatus === 1 ? '住院' : '非住院' }}</el-descriptions-item>
        <el-descriptions-item label="诊断信息" :span="4">{{ patient.diagnosis || '-' }}</el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card class="records-card">
      <template #header>
        <div class="records-header">
          <span>患者关联记录</span>
          <el-button link type="primary" @click="loadActiveTab(true)">刷新当前模块</el-button>
        </div>
      </template>
      <el-tabs v-model="activeTab" @tab-change="loadActiveTab">
        <el-tab-pane label="健康档案" name="health">
          <el-descriptions v-if="healthRecord" :column="2" border>
            <el-descriptions-item label="血型">{{ healthRecord.bloodType || '-' }}</el-descriptions-item>
            <el-descriptions-item label="透析年限">{{ healthRecord.dialysisYears ?? '-' }}</el-descriptions-item>
            <el-descriptions-item label="既往病史">{{ healthRecord.pastMedicalHistory || '-' }}</el-descriptions-item>
            <el-descriptions-item label="过敏史">{{ healthRecord.allergicHistory || '-' }}</el-descriptions-item>
            <el-descriptions-item label="家族病史">{{ healthRecord.familyMedicalHistory || '-' }}</el-descriptions-item>
            <el-descriptions-item label="基础疾病">{{ healthRecord.basicDiseases || '-' }}</el-descriptions-item>
            <el-descriptions-item label="并发症">{{ healthRecord.complications || '-' }}</el-descriptions-item>
            <el-descriptions-item label="其他信息">{{ healthRecord.otherInfo || '-' }}</el-descriptions-item>
          </el-descriptions>
          <el-empty v-else description="暂无健康档案" />
        </el-tab-pane>

        <el-tab-pane label="生命体征" name="vital">
          <el-table :data="vitals" v-loading="tabLoading" stripe border>
            <el-table-column prop="recordTime" label="记录时间" min-width="160" />
            <el-table-column prop="temperature" label="体温" />
            <el-table-column prop="weight" label="体重" />
            <el-table-column label="晨间血压"><template #default="{ row }">{{ pressure(row.morningSystolicPressure, row.morningDiastolicPressure) }}</template></el-table-column>
            <el-table-column label="晚间血压"><template #default="{ row }">{{ pressure(row.eveningSystolicPressure, row.eveningDiastolicPressure) }}</template></el-table-column>
            <el-table-column prop="bloodSugar" label="血糖" />
            <el-table-column prop="heartRate" label="心率" />
            <el-table-column prop="waterIntake" label="饮水量" />
            <el-table-column prop="notes" label="备注" show-overflow-tooltip />
          </el-table>
          <el-empty v-if="!tabLoading && !vitals.length" description="暂无生命体征记录" />
        </el-tab-pane>

        <el-tab-pane label="核心指标" name="blood">
          <el-table :data="bloodTests" v-loading="tabLoading" stripe border>
            <el-table-column prop="testDate" label="检查日期" />
            <el-table-column prop="testType" label="检查类型" />
            <el-table-column prop="hemoglobin" label="血红蛋白" />
            <el-table-column prop="potassium" label="血钾" />
            <el-table-column prop="calcium" label="血钙" />
            <el-table-column prop="phosphorus" label="血磷" />
            <el-table-column prop="albumin" label="白蛋白" />
            <el-table-column prop="ktV" label="Kt/V" />
            <el-table-column prop="idwg" label="IDWG" />
          </el-table>
          <el-empty v-if="!tabLoading && !bloodTests.length" description="暂无核心指标记录" />
        </el-tab-pane>

        <el-tab-pane label="用药记录" name="medication">
          <el-table :data="medications" v-loading="tabLoading" stripe border>
            <el-table-column prop="medicationName" label="药品名称" />
            <el-table-column prop="dosage" label="剂量" />
            <el-table-column prop="frequency" label="频率" />
            <el-table-column prop="medicationTime" label="服药时间" />
            <el-table-column prop="taken" label="状态"><template #default="{ row }"><el-tag :type="row.taken ? 'success' : 'info'">{{ row.taken ? '已服用' : '未服用' }}</el-tag></template></el-table-column>
            <el-table-column prop="notes" label="备注" />
          </el-table>
          <el-empty v-if="!tabLoading && !medications.length" description="暂无用药记录" />
        </el-tab-pane>

        <el-tab-pane label="诊断信息" name="diagnosis">
          <el-table :data="diagnoses" v-loading="tabLoading" stripe border>
            <el-table-column prop="diagnosisName" label="诊断名称" />
            <el-table-column prop="diagnosisDate" label="诊断日期" />
            <el-table-column prop="doctorName" label="医生" />
            <el-table-column prop="notes" label="备注" />
          </el-table>
          <el-empty v-if="!tabLoading && !diagnoses.length" description="暂无诊断信息" />
        </el-tab-pane>

        <el-tab-pane label="参保信息" name="insurance">
          <el-table :data="insurance" v-loading="tabLoading" stripe border>
            <el-table-column prop="insuranceType" label="保险类型" />
            <el-table-column prop="insuranceNumber" label="保险编号" />
            <el-table-column prop="effectiveDate" label="生效日期" />
            <el-table-column prop="expiryDate" label="失效日期" />
            <el-table-column prop="notes" label="备注" />
          </el-table>
          <el-empty v-if="!tabLoading && !insurance.length" description="暂无参保信息" />
        </el-tab-pane>

        <el-tab-pane label="提升方案" name="plan">
          <el-table :data="plans" v-loading="tabLoading" stripe border>
            <el-table-column prop="planName" label="方案名称" />
            <el-table-column prop="healthScore" label="健康评分" />
            <el-table-column prop="riskLevel" label="风险等级" />
            <el-table-column prop="status" label="状态"><template #default="{ row }"><el-tag :type="row.status === 'completed' ? 'success' : 'warning'">{{ row.status === 'completed' ? '已完成' : '进行中' }}</el-tag></template></el-table-column>
            <el-table-column prop="startDate" label="开始日期" />
            <el-table-column prop="endDate" label="结束日期" />
            <el-table-column prop="abnormalIndicators" label="异常指标" show-overflow-tooltip />
          </el-table>
          <el-empty v-if="!tabLoading && !plans.length" description="暂无提升方案" />
        </el-tab-pane>

        <el-tab-pane label="透析排班" name="schedule">
          <el-table :data="schedules" v-loading="tabLoading" stripe border>
            <el-table-column prop="scheduleDate" label="日期" />
            <el-table-column prop="week" label="星期" />
            <el-table-column prop="shift" label="班次" />
            <el-table-column prop="machineNumber" label="机位" />
            <el-table-column prop="status" label="状态" />
          </el-table>
          <el-empty v-if="!tabLoading && !schedules.length" description="暂无透析排班" />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'

const route = useRoute()
const patient = ref({})
const patientLoading = ref(false)
const tabLoading = ref(false)
const activeTab = ref('health')
const healthRecord = ref(null)
const vitals = ref([])
const bloodTests = ref([])
const medications = ref([])
const diagnoses = ref([])
const insurance = ref([])
const plans = ref([])
const schedules = ref([])
const loaded = new Set()

const asList = (data) => data?.list || data?.content || (Array.isArray(data) ? data : [])
const genderText = (gender) => gender === 0 ? '女' : gender === 1 ? '男' : '-'
const pressure = (systolic, diastolic) => systolic || diastolic ? `${systolic || '-'}/${diastolic || '-'}` : '-'
const goBack = () => window.location.assign('/patients')

const loaders = {
  health: async () => {
    const res = await request.get(`/health-record/list?userId=${route.params.id}&page=1&size=1`)
    healthRecord.value = res.data?.list?.[0] || null
  },
  vital: async () => { vitals.value = asList((await request.get('/vital-sign/admin/list', { params: { userId: route.params.id, page: 1, size: 100 } })).data) },
  blood: async () => { bloodTests.value = asList((await request.get(`/blood-test/list/${route.params.id}`)).data) },
  medication: async () => { medications.value = asList((await request.get(`/medication/list?userId=${route.params.id}&page=1&size=100`)).data) },
  diagnosis: async () => { diagnoses.value = asList((await request.get(`/diagnosis/user/${route.params.id}`)).data) },
  insurance: async () => { insurance.value = asList((await request.get(`/insurance/by-patient/${route.params.id}`)).data) },
  plan: async () => { plans.value = asList((await request.get('/improvement-plan/admin/list', { params: { userId: route.params.id, page: 1, size: 100 } })).data) },
  schedule: async () => { schedules.value = asList((await request.get(`/api/dialysis-schedule/user/${route.params.id}`)).data) }
}

const loadActiveTab = async (force = false) => {
  if (loaded.has(activeTab.value) && !force) return
  tabLoading.value = true
  try {
    await loaders[activeTab.value]()
    loaded.add(activeTab.value)
  } catch (error) {
    ElMessage.error('获取患者关联记录失败')
  } finally {
    tabLoading.value = false
  }
}

const fetchPatient = async () => {
  patientLoading.value = true
  try {
    const res = await request.get(`/user/${route.params.id}`)
    patient.value = res.data?.data || res.data || {}
  } catch {
    ElMessage.error('获取患者信息失败')
  } finally {
    patientLoading.value = false
  }
}

onMounted(async () => {
  await fetchPatient()
  await loadActiveTab()
})
</script>

<style scoped>
.patient-detail { padding: 20px; }
.patient-card, .records-card { margin-top: 20px; }
.records-header { display: flex; align-items: center; justify-content: space-between; }
</style>
