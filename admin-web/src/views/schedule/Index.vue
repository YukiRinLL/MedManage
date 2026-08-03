<template>
  <div class="schedule-container">
    <!-- 筛选栏 -->
    <el-card class="filter-card">
      <div class="filter-row">
        <el-form :inline="true" :model="filterForm" class="filter-form">
          <el-form-item label="患者">
            <el-select
              v-model="filterForm.userId"
              placeholder="请选择患者"
              clearable
              filterable
              style="width: 220px"
            >
              <el-option
                v-for="patient in patientOptions"
                :key="patient.id"
                :label="patient.name + ' (' + patient.phone + ')'"
                :value="patient.id"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="周次">
            <el-select v-model="filterForm.week" placeholder="请选择周次" clearable>
              <el-option label="本周" :value="'current'" />
              <el-option label="上周" :value="'last'" />
              <el-option label="下周" :value="'next'" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="班次">
            <el-select v-model="filterForm.shift" placeholder="请选择班次" clearable>
              <el-option label="全部" :value="null" />
              <el-option label="上午" :value="0" />
              <el-option label="下午" :value="1" />
              <el-option label="晚上" :value="2" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="日期">
            <el-date-picker
              v-model="filterForm.date"
              type="date"
              placeholder="选择日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
          
          <el-form-item label="分区">
            <el-select v-model="filterForm.zone" placeholder="请选择分区" clearable>
              <el-option label="全部" :value="null" />
              <el-option label="A1区" :value="'A1'" />
              <el-option label="A2区" :value="'A2'" />
              <el-option label="A3区" :value="'A3'" />
            </el-select>
          </el-form-item>
          
          <el-form-item>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
        
        <div class="week-info">
          <span class="week-label">当前周：</span>
          <span class="week-date">{{ weekDateRange }}</span>
        </div>
      </div>
    </el-card>
    
    <!-- 排班表格容器 -->
    <el-card class="schedule-card">
      <div class="schedule-table-wrapper">
        <div class="fixed-columns">
          <div class="fixed-header">
            <div class="zone-header">分区</div>
            <div class="machine-header">机号</div>
          </div>
          <div class="fixed-body">
            <div 
              v-for="(group, groupIndex) in scheduleGroups" 
              :key="groupIndex"
              class="schedule-group"
            >
              <div class="zone-cell" :class="`zone-${group.zone}`">
                {{ group.zone }}区
              </div>
              <div 
                v-for="machine in group.machines" 
                :key="machine.id"
                class="machine-cell"
                :class="{ 'highlight-row': machine.highlight }"
              >
                {{ machine.number }}
              </div>
            </div>
            <div class="total-row">
              <div class="zone-cell total-label">合计</div>
              <div class="machine-cell total-value">{{ totalScheduleCount }}</div>
            </div>
          </div>
        </div>
        
        <div class="scrollable-columns">
          <div class="scrollable-header">
            <div 
              v-for="(day, dayIndex) in weekDays" 
              :key="dayIndex"
              class="day-column"
              :class="`day-${dayIndex}`"
            >
              <div class="day-header">
                <div class="day-name">{{ day.name }}</div>
                <div class="day-date">{{ day.date }}</div>
              </div>
              <div class="shift-header">
                <div class="shift-cell">上午</div>
                <div class="shift-cell">下午</div>
                <div class="shift-cell">晚上</div>
              </div>
            </div>
          </div>
          
          <div class="scrollable-body">
            <div 
              v-for="(group, groupIndex) in scheduleGroups" 
              :key="groupIndex"
              class="group-body"
            >
              <div 
                v-for="machine in group.machines" 
                :key="machine.id"
                class="machine-row"
                :class="{ 'highlight-row': machine.highlight }"
              >
                <div 
                  v-for="(day, dayIndex) in weekDays" 
                  :key="dayIndex"
                  class="day-column-body"
                >
                  <div 
                    v-for="(shift, shiftIndex) in [0, 1, 2]" 
                    :key="shiftIndex"
                    class="schedule-cell"
                    :class="{ 
                      'selected': machine.selectedShift === `${dayIndex}-${shift}`,
                      'has-note': getScheduleNote(machine.id, dayIndex, shift)
                    }"
                    @click="handleCellClick(machine, dayIndex, shift)"
                  >
                    <template v-if="getSchedule(machine.id, dayIndex, shift)">
                      <span class="patient-name">{{ getSchedule(machine.id, dayIndex, shift).name }}</span>
                      <span class="device-id">{{ getSchedule(machine.id, dayIndex, shift).device }}</span>
                      <i v-if="getScheduleNote(machine.id, dayIndex, shift)" class="note-icon">⚠</i>
                    </template>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="total-row-body">
              <div 
                v-for="(day, dayIndex) in weekDays" 
                :key="dayIndex"
                class="day-column-body"
              >
                <div 
                  v-for="(shift, shiftIndex) in [0, 1, 2]" 
                  :key="shiftIndex"
                  class="schedule-cell total-cell"
                >
                  {{ getDayShiftCount(dayIndex, shift) }}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="total-column">
          <div class="total-header">合计</div>
          <div class="total-body">
            <div 
              v-for="(group, groupIndex) in scheduleGroups" 
              :key="groupIndex"
              class="group-total"
            >
              <div 
                v-for="machine in group.machines" 
                :key="machine.id"
                class="machine-total"
              >
                {{ machine.totalCount }}
              </div>
            </div>
            <div class="grand-total">{{ grandTotal }}</div>
          </div>
        </div>
      </div>
    </el-card>
    
    <!-- 图例说明 -->
    <el-card class="legend-card">
      <div class="legend-title">图例说明</div>
      <div class="legend-items">
        <div class="legend-item">
          <span class="legend-color zone-A1"></span>
          <span>A1区</span>
        </div>
        <div class="legend-item">
          <span class="legend-color zone-A2"></span>
          <span>A2区</span>
        </div>
        <div class="legend-item">
          <span class="legend-color zone-A3"></span>
          <span>A3区</span>
        </div>
        <div class="legend-item">
          <span class="legend-icon">⚠</span>
          <span>备注/异常标记</span>
        </div>
      </div>
    </el-card>
    
    <!-- 排班详情弹窗 -->
    <el-dialog v-model="detailDialogVisible" title="排班详情" width="700px">
      <el-descriptions v-if="currentSchedule" :column="2" border>
        <el-descriptions-item label="患者姓名">{{ currentSchedule.name }}</el-descriptions-item>
        <el-descriptions-item label="透析号">{{ currentSchedule.number }}</el-descriptions-item>
        <el-descriptions-item label="设备编号">{{ currentSchedule.device }}</el-descriptions-item>
        <el-descriptions-item label="班次">{{ getShiftText(currentSchedule.shift) }}</el-descriptions-item>
        <el-descriptions-item label="日期">{{ currentSchedule.date }}</el-descriptions-item>
        <el-descriptions-item label="透析方式">{{ currentSchedule.txType }}</el-descriptions-item>
        <el-descriptions-item label="透析器">{{ currentSchedule.dialyzer }}</el-descriptions-item>
        <el-descriptions-item label="血管通路">{{ currentSchedule.access }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getStatusType(currentSchedule.status)">
            {{ getStatusText(currentSchedule.status) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="分区">{{ currentSchedule.zone }}区</el-descriptions-item>
        <el-descriptions-item label="传染病标识">
          <el-tag :type="currentSchedule.infectionMark === '阳性' ? 'danger' : 'success'">
            {{ currentSchedule.infectionMark || '阴性' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="治疗模式">{{ currentSchedule.treatmentMode || '-' }}</el-descriptions-item>
        <el-descriptions-item label="血透处方" :span="2">{{ currentSchedule.prescription || '-' }}</el-descriptions-item>
        <el-descriptions-item label="治疗计划" :span="2">{{ currentSchedule.treatmentPlan || '-' }}</el-descriptions-item>
        <el-descriptions-item label="备注" :span="2">{{ currentSchedule.comment || '-' }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="viewRatings(currentSchedule)">查看评价</el-button>
      </template>
    </el-dialog>
    
    <!-- 评价查看弹窗 -->
    <el-dialog v-model="ratingDialogVisible" title="排班评价" width="800px">
      <div v-if="ratingList.length > 0">
        <el-table :data="ratingList" border>
          <el-table-column prop="userName" label="评价用户" width="100" />
          <el-table-column label="整体评分" width="100">
            <template #default="{ row }">
              <el-rate :model-value="row.overallRating" disabled />
            </template>
          </el-table-column>
          <el-table-column label="护士评分" width="100">
            <template #default="{ row }">
              <el-rate :model-value="row.nurseRating" disabled />
            </template>
          </el-table-column>
          <el-table-column label="环境评分" width="100">
            <template #default="{ row }">
              <el-rate :model-value="row.envRating" disabled />
            </template>
          </el-table-column>
          <el-table-column label="设备评分" width="100">
            <template #default="{ row }">
              <el-rate :model-value="row.equipRating" disabled />
            </template>
          </el-table-column>
          <el-table-column prop="comment" label="评价内容" show-overflow-tooltip />
          <el-table-column prop="createdAt" label="评价时间" width="160">
            <template #default="{ row }">
              {{ formatDate(row.createdAt) }}
            </template>
          </el-table-column>
        </el-table>
        <el-descriptions :column="4" border style="margin-top: 16px">
          <el-descriptions-item label="评价总数">{{ ratingList.length }}</el-descriptions-item>
          <el-descriptions-item label="平均评分">
            {{ getAverageRating() }}
          </el-descriptions-item>
          <el-descriptions-item label="最高评分">{{ getMaxRating() }}</el-descriptions-item>
          <el-descriptions-item label="最低评分">{{ getMinRating() }}</el-descriptions-item>
        </el-descriptions>
      </div>
      <el-empty v-else description="暂无评价" />
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'

export default {
  setup() {
    const scheduleData = ref([])
    const loading = ref(false)
    const detailDialogVisible = ref(false)
    const currentSchedule = ref(null)
    const ratingDialogVisible = ref(false)
    const ratingList = ref([])
    
    const patientOptions = ref([])
    
    const filterForm = reactive({
      week: 'current',
      shift: null,
      date: '',
      zone: null,
      userId: null
    })
    
    const fetchScheduleData = async () => {
      loading.value = true
      try {
        const params = new URLSearchParams()
        if (filterForm.userId) params.append('userId', filterForm.userId)
        if (filterForm.zone) params.append('zone', filterForm.zone)
        if (filterForm.shift !== null) params.append('shift', filterForm.shift)
        if (filterForm.date) params.append('date', filterForm.date)
        
        const response = await request.get(`/dialysis-schedule/list?${params.toString()}`)
        if (response.code === 200) {
          const data = response.data
          if (data && data.content) {
            scheduleData.value = transformScheduleData(data.content)
          } else if (Array.isArray(data)) {
            scheduleData.value = transformScheduleData(data)
          } else {
            scheduleData.value = transformScheduleData(data || [])
          }
        }
      } catch (error) {
        console.error('获取排班数据失败:', error)
      } finally {
        loading.value = false
      }
    }
    
    const transformScheduleData = (backendData) => {
      return backendData.map(item => {
        const week = item.week || 0
        const day = (week - 1 + 7) % 7
        const deviceSeq = item.txDeviceSequence || 'A1-01'
        const match = deviceSeq.match(/^([A-Za-z]\d+)-(\d+)$/)
        return {
          id: item.id,
          zone: match ? match[1] : 'A1',
          machineNumber: match ? match[2] : (item.txDeviceSequence || '1'),
          day: day,
          shift: item.txPdrqType || 0,
          name: item.name || '',
          device: item.txTxq || '',
          number: item.number || '',
          status: item.txStatus || 1,
          comment: item.txComment || '',
          txTxjId: item.txTxjId || '',
          txInfo: item.txInfo || '',
          txXtcf: item.txXtcf || '',
          txZljh: item.txZljh || '',
          infectionMark: item.crb || '阴性',
          treatmentMode: item.txZlms || '',
          txTxfsAlias: item.txTxfsAlias || '血液透析',
          userid: item.txUserid || ''
        }
      })
    }
    
    const getWeekDays = () => {
      const today = new Date()
      const dayOfWeek = today.getDay() || 7
      const monday = new Date(today)
      monday.setDate(today.getDate() - dayOfWeek + 1)
      
      const days = []
      const dayNames = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      
      for (let i = 0; i < 7; i++) {
        const date = new Date(monday)
        date.setDate(monday.getDate() + i)
        days.push({
          name: dayNames[i],
          date: date.toISOString().split('T')[0],
          dayOfWeek: i + 1
        })
      }
      return days
    }
    
    const weekDays = ref(getWeekDays())
    
    const weekDateRange = computed(() => {
      if (weekDays.value.length >= 2) {
        return `${weekDays.value[0].date} 至 ${weekDays.value[6].date}`
      }
      return ''
    })
    
    const scheduleGroups = computed(() => {
      const filteredData = scheduleData.value.filter(item => {
        if (filterForm.zone && item.zone !== filterForm.zone) return false
        if (filterForm.shift !== null && item.shift !== filterForm.shift) return false
        if (filterForm.date && item.day !== getDayIndex(filterForm.date)) return false
        return true
      })
      
      const groups = {}
      ;['A1', 'A2', 'A3'].forEach(zone => {
        groups[zone] = []
      })
      
      filteredData.forEach(item => {
        if (!groups[item.zone].includes(item.machineNumber)) {
          groups[item.zone].push(item.machineNumber)
        }
      })
      
      return Object.keys(groups).map(zone => ({
        zone,
        machines: groups[zone].map(number => ({
          id: `${zone}-${number}`,
          number,
          highlight: number === '1' && zone === 'A2',
          totalCount: filteredData.filter(d => d.zone === zone && d.machineNumber === number).length,
          selectedShift: null
        }))
      }))
    })
    
    const getDayIndex = (dateStr) => {
      const date = new Date(dateStr)
      const monday = new Date(weekDays.value[0].date)
      return Math.floor((date - monday) / (1000 * 60 * 60 * 24))
    }
    
    const getSchedule = (machineId, dayIndex, shift) => {
      const [zone, number] = machineId.split('-')
      const schedule = scheduleData.value.find(
        item => item.zone === zone && 
                item.machineNumber === number && 
                item.day === dayIndex && 
                item.shift === shift
      )
      
      if (!schedule) return null
      
      return {
        id: schedule.id,
        name: schedule.name,
        device: schedule.device,
        number: schedule.number,
        shift: schedule.shift,
        date: weekDays.value[dayIndex]?.date || '',
        txType: schedule.txTxfsAlias || '血液透析',
        dialyzer: schedule.device || 'FX80',
        access: '动静脉内瘘',
        status: schedule.status,
        comment: schedule.comment,
        zone: schedule.zone,
        infectionMark: schedule.infectionMark,
        treatmentMode: schedule.treatmentMode,
        prescription: schedule.txXtcf,
        treatmentPlan: schedule.txZljh
      }
    }
    
    const getScheduleNote = (machineId, dayIndex, shift) => {
      const [zone, number] = machineId.split('-')
      const schedule = scheduleData.value.find(
        item => item.zone === zone && 
                item.machineNumber === number && 
                item.day === dayIndex && 
                item.shift === shift
      )
      return schedule?.comment
    }
    
    const getDayShiftCount = (dayIndex, shift) => {
      return scheduleData.value.filter(
        item => item.day === dayIndex && item.shift === shift
      ).length
    }
    
    const totalScheduleCount = computed(() => {
      let count = 0
      scheduleGroups.value.forEach(group => {
        group.machines.forEach(machine => {
          count += machine.totalCount
        })
      })
      return count
    })
    
    const grandTotal = computed(() => {
      return scheduleData.value.length
    })
    
    const handleSearch = () => {
      fetchScheduleData()
    }
    
    const handleReset = () => {
      filterForm.week = 'current'
      filterForm.shift = null
      filterForm.date = ''
      filterForm.zone = null
      filterForm.userId = null
    }
    
    const fetchPatientList = async () => {
      try {
        const res = await request.get('/user/list')
        if (res.code === 200) {
          if (res.data && res.data.content) {
            patientOptions.value = res.data.content
          } else if (Array.isArray(res.data)) {
            patientOptions.value = res.data
          } else {
            patientOptions.value = res.data || []
          }
        }
      } catch (err) {
        console.error('获取患者列表失败:', err)
      }
    }
    
    const getPatientName = (userId) => {
      if (!userId) return '-'
      const patient = patientOptions.value.find(p => p.id === userId)
      return patient ? patient.name : userId
    }
    
    const handleCellClick = (machine, dayIndex, shift) => {
      const schedule = getSchedule(machine.id, dayIndex, shift)
      if (schedule) {
        currentSchedule.value = schedule
        detailDialogVisible.value = true
      }
    }
    
    const viewRatings = async (schedule) => {
      if (!schedule || !schedule.id) {
        ElMessage.warning('无法查看评价')
        return
      }
      try {
        const res = await request.get(`/dialysis-schedule-rating/schedule/${schedule.id}`)
        if (res.code === 200) {
          ratingList.value = res.data || []
        }
        ratingDialogVisible.value = true
        detailDialogVisible.value = false
      } catch (error) {
        console.error('获取评价失败:', error)
        ElMessage.error('获取评价失败')
      }
    }
    
    const formatDate = (dateStr) => {
      if (!dateStr) return ''
      return new Date(dateStr).toLocaleString('zh-CN')
    }
    
    const getAverageRating = () => {
      if (ratingList.value.length === 0) return '-'
      const sum = ratingList.value.reduce((acc, r) => acc + (r.overallRating || 0), 0)
      return (sum / ratingList.value.length).toFixed(1)
    }
    
    const getMaxRating = () => {
      if (ratingList.value.length === 0) return '-'
      return Math.max(...ratingList.value.map(r => r.overallRating || 0))
    }
    
    const getMinRating = () => {
      if (ratingList.value.length === 0) return '-'
      return Math.min(...ratingList.value.map(r => r.overallRating || 5))
    }
    
    const getShiftText = (shift) => {
      const shiftMap = {
        0: '上午',
        1: '下午',
        2: '晚上'
      }
      return shiftMap[shift] || '-'
    }
    
    const getStatusText = (status) => {
      const statusMap = {
        1: '正常',
        2: '暂停',
        0: '取消'
      }
      return statusMap[status] || '未知'
    }
    
    const getStatusType = (status) => {
      const typeMap = {
        1: 'success',
        2: 'warning',
        0: 'danger'
      }
      return typeMap[status] || 'info'
    }
    
    onMounted(() => {
      fetchPatientList()
      fetchScheduleData()
    })
    
    return {
      loading,
      patientOptions,
      filterForm,
      weekDays,
      weekDateRange,
      scheduleGroups,
      totalScheduleCount,
      grandTotal,
      detailDialogVisible,
      currentSchedule,
      ratingDialogVisible,
      ratingList,
      getSchedule,
      getScheduleNote,
      getDayShiftCount,
      handleSearch,
      handleReset,
      handleCellClick,
      viewRatings,
      formatDate,
      getAverageRating,
      getMaxRating,
      getMinRating,
      getShiftText,
      getStatusText,
      getStatusType,
      getPatientName
    }
  }
}
</script>

<style scoped>
.schedule-container {
  padding: 20px;
}

.filter-card {
  margin-bottom: 20px;
}

.filter-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-form {
  flex: 1;
}

.week-info {
  margin-left: 20px;
}

.week-label {
  font-weight: bold;
  color: #666;
}

.week-date {
  color: #409EFF;
  font-weight: 500;
}

.schedule-card {
  overflow: hidden;
}

.schedule-table-wrapper {
  display: flex;
  overflow-x: auto;
}

/* 固定列 - 左侧 */
.fixed-columns {
  flex-shrink: 0;
  width: 120px;
  border-right: 2px solid #ddd;
}

.fixed-header {
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
  border-bottom: 1px solid #ddd;
}

.zone-header {
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  text-align: center;
  border-bottom: 1px solid #ddd;
  background: #e8f4fc;
  color: #108ee9;
}

.machine-header {
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  text-align: center;
  border-bottom: 1px solid #ddd;
}

.fixed-body {
  max-height: 400px;
  overflow-y: auto;
}

.schedule-group {
  display: flex;
  flex-direction: column;
}

.zone-cell {
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #fff;
  border-bottom: 1px solid #ddd;
}

.zone-A1 {
  background: #5B8FF9;
}

.zone-A2 {
  background: #5AD8A6;
}

.zone-A3 {
  background: #F6BD16;
  color: #333;
}

.machine-cell {
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #eee;
}

.highlight-row {
  background: #fffbe6;
}

.total-row {
  display: flex;
  flex-direction: column;
  background: #fafafa;
}

.total-label {
  background: #e8eaed;
  color: #666;
}

.total-value {
  font-weight: bold;
  color: #108ee9;
}

/* 滚动列 - 中间 */
.scrollable-columns {
  flex: 1;
  min-width: 800px;
}

.scrollable-header {
  display: flex;
  background: #f5f7fa;
  position: sticky;
  top: 0;
  z-index: 10;
}

.day-column {
  flex: 1;
  min-width: 150px;
  border-right: 1px solid #ddd;
}

.day-header {
  height: 34px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #ddd;
}

.day-name {
  font-size: 12px;
  font-weight: bold;
  color: #333;
}

.day-date {
  font-size: 10px;
  color: #999;
}

.shift-header {
  display: flex;
  border-bottom: 1px solid #ddd;
}

.shift-cell {
  flex: 1;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #666;
  border-right: 1px solid #eee;
}

.shift-cell:last-child {
  border-right: none;
}

.scrollable-body {
  max-height: 400px;
  overflow-y: auto;
}

.group-body {
  display: flex;
  flex-direction: column;
}

.machine-row {
  display: flex;
}

.day-column-body {
  flex: 1;
  min-width: 150px;
  border-right: 1px solid #eee;
  display: flex;
}

.schedule-cell {
  flex: 1;
  height: 36px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2px;
  border-right: 1px solid #eee;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 12px;
}

.schedule-cell:hover {
  background: #e8f4fc;
}

.schedule-cell.selected {
  background: #fff3cd;
  border: 1px solid #ffeeba;
}

.schedule-cell.has-note {
  position: relative;
}

.patient-name {
  font-weight: 500;
  color: #333;
}

.device-id {
  font-size: 10px;
  color: #999;
  margin-top: 2px;
}

.note-icon {
  position: absolute;
  top: 2px;
  right: 2px;
  font-size: 12px;
  color: #f5a623;
}

.total-cell {
  background: #fafafa;
  font-weight: bold;
  color: #666;
}

.total-row-body {
  display: flex;
  background: #fafafa;
}

/* 合计列 - 右侧 */
.total-column {
  flex-shrink: 0;
  width: 60px;
  border-left: 2px solid #ddd;
}

.total-header {
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
  font-weight: bold;
  border-bottom: 1px solid #ddd;
}

.total-body {
  max-height: 400px;
  overflow-y: auto;
}

.group-total {
  display: flex;
  flex-direction: column;
}

.machine-total {
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #eee;
  font-weight: 500;
  color: #666;
}

.grand-total {
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e8eaed;
  font-weight: bold;
  color: #108ee9;
}

/* 图例卡片 */
.legend-card {
  margin-top: 20px;
}

.legend-title {
  font-weight: bold;
  margin-bottom: 10px;
}

.legend-items {
  display: flex;
  gap: 20px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-color {
  width: 24px;
  height: 24px;
  border-radius: 4px;
}

.legend-color.zone-A1 {
  background: #5B8FF9;
}

.legend-color.zone-A2 {
  background: #5AD8A6;
}

.legend-color.zone-A3 {
  background: #F6BD16;
}

.legend-icon {
  font-size: 18px;
}

/* 日期列背景色 */
.day-0 .day-header {
  background: #fff7e6;
}

.day-1 .day-header {
  background: #fffbf0;
}

.day-2 .day-header {
  background: #fff7e6;
}

.day-3 .day-header {
  background: #fffbf0;
}

.day-4 .day-header {
  background: #fff7e6;
}

.day-5 .day-header {
  background: #f6ffed;
}

.day-6 .day-header {
  background: #f6ffed;
}
</style>