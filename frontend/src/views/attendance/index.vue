<template>
  <div class="attendance-container">
    <!-- 快捷打卡区域 -->
    <el-card shadow="hover" class="checkin-card">
      <div class="checkin-content">
        <div class="time-display">
          <h2>{{ currentTime }}</h2>
          <p>{{ currentDate }}</p>
        </div>
        <div class="checkin-btns">
          <el-button
            type="primary"
            size="large"
            :disabled="todayAttendance.checkedIn"
            @click="handleCheckIn"
          >
            <el-icon><CircleCheck /></el-icon>
            {{ todayAttendance.checkedIn ? '已打卡' : '上班打卡' }}
          </el-button>
          <el-button
            type="success"
            size="large"
            :disabled="!todayAttendance.checkedIn || todayAttendance.checkedOut"
            @click="handleCheckOut"
          >
            <el-icon><CircleCheck /></el-icon>
            {{ todayAttendance.checkedOut ? '已签退' : '下班签退' }}
          </el-button>
        </div>
        <div class="checkin-info" v-if="todayAttendance.checkedIn">
          <p>上班时间：{{ todayAttendance.checkInTime }}</p>
          <p v-if="todayAttendance.checkedOut">下班时间：{{ todayAttendance.checkOutTime }}</p>
        </div>
      </div>
    </el-card>

    <!-- 搜索栏 -->
    <el-card shadow="never" class="search-card">
      <el-form :model="queryParams" inline>
        <el-form-item label="员工">
          <el-select v-model="queryParams.employeeId" placeholder="请选择员工" clearable style="width: 150px">
            <el-option
              v-for="emp in employeeList"
              :key="emp.id"
              :label="emp.name"
              :value="emp.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="部门">
          <el-select v-model="queryParams.departmentId" placeholder="请选择部门" clearable style="width: 150px">
            <el-option
              v-for="dept in departmentList"
              :key="dept.id"
              :label="dept.name"
              :value="dept.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            style="width: 240px"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.status" placeholder="请选择状态" clearable style="width: 120px">
            <el-option label="正常" :value="1" />
            <el-option label="迟到" :value="2" />
            <el-option label="早退" :value="3" />
            <el-option label="缺勤" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
          <el-button :icon="Refresh" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 数据表格 -->
    <el-card shadow="never">
      <template #header>
        <div class="table-header">
          <span>考勤记录</span>
          <el-button type="primary" :icon="Download" @click="handleExport">导出</el-button>
        </div>
      </template>
      <el-table v-loading="loading" :data="attendanceList" stripe border>
        <el-table-column prop="employeeName" label="姓名" width="100" />
        <el-table-column prop="departmentName" label="部门" />
        <el-table-column prop="attendanceDate" label="考勤日期" width="120">
          <template #default="{ row }">
            {{ formatDate(row.attendanceDate) }}
          </template>
        </el-table-column>
        <el-table-column prop="checkIn" label="上班时间" width="100">
          <template #default="{ row }">
            <span :class="{ 'text-warning': row.status === 2 }">
              {{ row.checkIn || '-' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="checkOut" label="下班时间" width="100">
          <template #default="{ row }">
            <span :class="{ 'text-warning': row.status === 3 }">
              {{ row.checkOut || '-' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="workHours" label="工作时长" width="100">
          <template #default="{ row }">
            {{ row.workHours ? row.workHours + '小时' : '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="overtimeHours" label="加班时长" width="100">
          <template #default="{ row }">
            {{ row.overtimeHours ? row.overtimeHours + '小时' : '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="90">
          <template #default="{ row }">
            <el-tag :type="getAttendanceType(row.status)">
              {{ formatAttendanceStatus(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" show-overflow-tooltip />
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link :icon="Edit" @click="handleEdit(row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="queryParams.pageNum"
          v-model:page-size="queryParams.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 编辑对话框 -->
    <el-dialog v-model="dialogVisible" title="编辑考勤" width="500px">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px">
        <el-form-item label="员工">
          <el-input :model-value="formData.employeeName" disabled />
        </el-form-item>
        <el-form-item label="考勤日期">
          <el-input :model-value="formatDate(formData.attendanceDate!)" disabled />
        </el-form-item>
        <el-form-item label="上班时间" prop="checkIn">
          <el-time-picker
            v-model="formData.checkIn"
            placeholder="选择时间"
            style="width: 100%"
            value-format="HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="下班时间" prop="checkOut">
          <el-time-picker
            v-model="formData.checkOut"
            placeholder="选择时间"
            style="width: 100%"
            value-format="HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="formData.status" placeholder="请选择状态" style="width: 100%">
            <el-option label="正常" :value="1" />
            <el-option label="迟到" :value="2" />
            <el-option label="早退" :value="3" />
            <el-option label="缺勤" :value="0" />
            <el-option label="请假" :value="4" />
            <el-option label="加班" :value="5" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="formData.remark" type="textarea" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Refresh, Download, Edit, CircleCheck } from '@element-plus/icons-vue'
import { getAttendanceList, checkInOut, updateAttendance, getTodayAttendance } from '@/api/attendance'
import { getEmployeeList } from '@/api/employee'
import { getAllDepartments } from '@/api/department'
import type { Attendance, AttendanceQuery, Employee, Department } from '@/types'
import { formatDate, formatAttendanceStatus, getAttendanceType } from '@/utils/format'
import dayjs from 'dayjs'

// 当前时间
const currentTime = ref('')
const currentDate = ref('')
let timeInterval: NodeJS.Timeout

// 今日考勤
const todayAttendance = reactive({
  checkedIn: false,
  checkInTime: '',
  checkedOut: false,
  checkOutTime: ''
})

// 查询参数
const queryParams = reactive<AttendanceQuery>({
  employeeId: undefined,
  departmentId: undefined,
  startDate: '',
  endDate: '',
  status: undefined,
  pageNum: 1,
  pageSize: 10
})
const dateRange = ref<string[]>([])

// 数据列表
const attendanceList = ref<Attendance[]>([])
const employeeList = ref<Employee[]>([])
const departmentList = ref<Department[]>([])
const total = ref(0)
const loading = ref(false)

// 对话框
const dialogVisible = ref(false)
const formRef = ref()
const formData = reactive<Partial<Attendance>>({
  employeeName: '',
  attendanceDate: '',
  checkIn: '',
  checkOut: '',
  status: 1,
  remark: ''
})
const formRules = {
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
}
const submitLoading = ref(false)

// 更新时间
const updateTime = () => {
  currentTime.value = dayjs().format('HH:mm:ss')
  currentDate.value = dayjs().format('YYYY年MM月DD日 dddd')
}

// 获取今日考勤状态
const fetchTodayAttendance = async () => {
  try {
    const res = await getTodayAttendance()
    Object.assign(todayAttendance, res)
  } catch (error) {
    console.error('获取今日考勤失败:', error)
  }
}

// 上班打卡
const handleCheckIn = async () => {
  try {
    await checkInOut('in')
    ElMessage.success('上班打卡成功')
    fetchTodayAttendance()
    fetchAttendanceList()
  } catch (error) {
    console.error('打卡失败:', error)
  }
}

// 下班签退
const handleCheckOut = async () => {
  try {
    await checkInOut('out')
    ElMessage.success('下班签退成功')
    fetchTodayAttendance()
    fetchAttendanceList()
  } catch (error) {
    console.error('签退失败:', error)
  }
}

// 获取考勤列表
const fetchAttendanceList = async () => {
  loading.value = true
  try {
    if (dateRange.value?.length === 2) {
      queryParams.startDate = dateRange.value[0]
      queryParams.endDate = dateRange.value[1]
    }
    const res = await getAttendanceList(queryParams)
    attendanceList.value = res.list
    total.value = res.total
  } catch (error) {
    console.error('获取考勤列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 获取员工列表
const fetchEmployeeList = async () => {
  try {
    const res = await getEmployeeList({ pageNum: 1, pageSize: 1000 })
    employeeList.value = res.list
  } catch (error) {
    console.error('获取员工列表失败:', error)
  }
}

// 获取部门列表
const fetchDepartmentList = async () => {
  try {
    const res = await getAllDepartments()
    departmentList.value = res
  } catch (error) {
    console.error('获取部门列表失败:', error)
  }
}

// 搜索
const handleSearch = () => {
  queryParams.pageNum = 1
  fetchAttendanceList()
}

// 重置
const handleReset = () => {
  queryParams.employeeId = undefined
  queryParams.departmentId = undefined
  queryParams.status = undefined
  queryParams.startDate = ''
  queryParams.endDate = ''
  dateRange.value = []
  queryParams.pageNum = 1
  fetchAttendanceList()
}

// 分页
const handleSizeChange = (val: number) => {
  queryParams.pageSize = val
  fetchAttendanceList()
}

const handleCurrentChange = (val: number) => {
  queryParams.pageNum = val
  fetchAttendanceList()
}

// 编辑
const handleEdit = (row: Attendance) => {
  Object.assign(formData, { ...row })
  dialogVisible.value = true
}

// 提交
const handleSubmit = async () => {
  const valid = await formRef.value?.validate()
  if (!valid) return

  submitLoading.value = true
  try {
    await updateAttendance(formData.id!, formData)
    ElMessage.success('修改成功')
    dialogVisible.value = false
    fetchAttendanceList()
  } finally {
    submitLoading.value = false
  }
}

// 导出
const handleExport = () => {
  ElMessage.info('导出功能开发中...')
}

onMounted(() => {
  updateTime()
  timeInterval = setInterval(updateTime, 1000)
  fetchTodayAttendance()
  fetchAttendanceList()
  fetchEmployeeList()
  fetchDepartmentList()
})

onUnmounted(() => {
  clearInterval(timeInterval)
})
</script>

<style scoped lang="scss">
.attendance-container {
  .checkin-card {
    margin-bottom: 20px;

    .checkin-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 20px;

      .time-display {
        h2 {
          font-size: 36px;
          margin: 0;
          color: #303133;
        }

        p {
          margin: 5px 0 0;
          color: #909399;
        }
      }

      .checkin-btns {
        display: flex;
        gap: 20px;

        .el-button {
          width: 150px;
          height: 50px;
          font-size: 16px;

          .el-icon {
            margin-right: 5px;
          }
        }
      }

      .checkin-info {
        text-align: right;
        color: #606266;

        p {
          margin: 5px 0;
        }
      }
    }
  }

  .search-card {
    margin-bottom: 20px;
  }

  .table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }

  .text-warning {
    color: #e6a23c;
  }
}
</style>
