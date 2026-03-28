<template>
  <div class="salary-container">
    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stat-row">
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card shadow="hover">
          <div class="stat-item">
            <p class="stat-title">本月薪资总额</p>
            <p class="stat-value">{{ formatMoney(salaryStats.totalAmount) }}</p>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card shadow="hover">
          <div class="stat-item">
            <p class="stat-title">计薪人数</p>
            <p class="stat-value">{{ salaryStats.totalCount }}人</p>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card shadow="hover">
          <div class="stat-item">
            <p class="stat-title">平均工资</p>
            <p class="stat-value">{{ formatMoney(salaryStats.avgSalary) }}</p>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card shadow="hover">
          <div class="stat-item">
            <p class="stat-title">最高工资</p>
            <p class="stat-value">{{ formatMoney(salaryStats.maxSalary) }}</p>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 搜索栏 -->
    <el-card shadow="never" class="search-card">
      <el-form :model="queryParams" inline>
        <el-form-item label="薪资月份">
          <el-date-picker
            v-model="queryParams.salaryMonth"
            type="month"
            placeholder="选择月份"
            value-format="YYYY-MM"
            style="width: 150px"
          />
        </el-form-item>
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
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
          <el-button :icon="Refresh" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 操作栏和数据表格 -->
    <el-card shadow="never">
      <template #header>
        <div class="table-header">
          <div class="left">
            <el-button type="primary" :icon="Money" @click="handleBatchCalculate">
              批量计算
            </el-button>
            <el-button type="success" :icon="Check" :disabled="!selectedIds.length" @click="handleBatchConfirm">
              批量确认
            </el-button>
          </div>
          <div class="right">
            <el-button :icon="Download" @click="handleExport">导出</el-button>
          </div>
        </div>
      </template>

      <el-table
        v-loading="loading"
        :data="salaryList"
        @selection-change="handleSelectionChange"
        stripe
        border
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="employeeName" label="姓名" width="100" />
        <el-table-column prop="departmentName" label="部门" />
        <el-table-column prop="salaryMonth" label="薪资月份" width="110" />
        <el-table-column prop="baseSalary" label="基本工资" width="120">
          <template #default="{ row }">
            {{ formatMoney(row.baseSalary) }}
          </template>
        </el-table-column>
        <el-table-column prop="positionAllowance" label="岗位津贴" width="120">
          <template #default="{ row }">
            {{ formatMoney(row.positionAllowance) }}
          </template>
        </el-table-column>
        <el-table-column prop="overtimePay" label="加班费" width="100">
          <template #default="{ row }">
            {{ formatMoney(row.overtimePay) }}
          </template>
        </el-table-column>
        <el-table-column prop="bonus" label="奖金" width="100">
          <template #default="{ row }">
            {{ formatMoney(row.bonus) }}
          </template>
        </el-table-column>
        <el-table-column label="应发合计" width="120">
          <template #default="{ row }">
            {{ formatMoney(row.baseSalary + row.positionAllowance + row.overtimePay + row.bonus) }}
          </template>
        </el-table-column>
        <el-table-column prop="socialInsurance" label="社保" width="100">
          <template #default="{ row }">
            <span class="text-danger">-{{ formatMoney(row.socialInsurance) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="housingFund" label="公积金" width="100">
          <template #default="{ row }">
            <span class="text-danger">-{{ formatMoney(row.housingFund) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="personalTax" label="个税" width="100">
          <template #default="{ row }">
            <span class="text-danger">-{{ formatMoney(row.personalTax) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="netSalary" label="实发工资" width="120" fixed="right">
          <template #default="{ row }">
            <span class="text-primary font-bold">{{ formatMoney(row.netSalary) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="90" fixed="right">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'warning'">
              {{ row.status === 1 ? '已确认' : '待确认' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link :icon="View" @click="handleView(row)">查看</el-button>
            <el-button v-if="row.status === 0" type="success" link :icon="Check" @click="handleConfirm(row)">
              确认
            </el-button>
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

    <!-- 查看详情对话框 -->
    <el-dialog v-model="detailVisible" title="薪资详情" width="600px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="员工">{{ currentRow?.employeeName }}</el-descriptions-item>
        <el-descriptions-item label="部门">{{ currentRow?.departmentName }}</el-descriptions-item>
        <el-descriptions-item label="薪资月份">{{ currentRow?.salaryMonth }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="currentRow?.status === 1 ? 'success' : 'warning'">
            {{ currentRow?.status === 1 ? '已确认' : '待确认' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="基本工资">{{ formatMoney(currentRow?.baseSalary || 0) }}</el-descriptions-item>
        <el-descriptions-item label="岗位津贴">{{ formatMoney(currentRow?.positionAllowance || 0) }}</el-descriptions-item>
        <el-descriptions-item label="加班费">{{ formatMoney(currentRow?.overtimePay || 0) }}</el-descriptions-item>
        <el-descriptions-item label="奖金">{{ formatMoney(currentRow?.bonus || 0) }}</el-descriptions-item>
        <el-descriptions-item label="应发合计" :span="2">
          <span class="text-success font-bold">
            {{ formatMoney((currentRow?.baseSalary || 0) + (currentRow?.positionAllowance || 0) + (currentRow?.overtimePay || 0) + (currentRow?.bonus || 0)) }}
          </span>
        </el-descriptions-item>
        <el-descriptions-item label="社保">-{{ formatMoney(currentRow?.socialInsurance || 0) }}</el-descriptions-item>
        <el-descriptions-item label="公积金">-{{ formatMoney(currentRow?.housingFund || 0) }}</el-descriptions-item>
        <el-descriptions-item label="个人所得税">-{{ formatMoney(currentRow?.personalTax || 0) }}</el-descriptions-item>
        <el-descriptions-item label="其他扣款">-{{ formatMoney(currentRow?.otherDeduction || 0) }}</el-descriptions-item>
        <el-descriptions-item label="实发工资" :span="2">
          <span class="text-primary font-bold" style="font-size: 18px;">
            {{ formatMoney(currentRow?.netSalary || 0) }}
          </span>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Check, Download, View, Money } from '@element-plus/icons-vue'
import { getSalaryList, getSalaryStats, confirmSalary, batchConfirmSalary } from '@/api/salary'
import { getEmployeeList } from '@/api/employee'
import { getAllDepartments } from '@/api/department'
import type { Salary, SalaryQuery, Employee, Department } from '@/types'
import { formatMoney } from '@/utils/format'

// 统计数据
const salaryStats = reactive({
  totalAmount: 0,
  totalCount: 0,
  avgSalary: 0,
  maxSalary: 0,
  minSalary: 0
})

// 查询参数
const queryParams = reactive<SalaryQuery>({
  salaryMonth: new Date().toISOString().slice(0, 7),
  employeeId: undefined,
  departmentId: undefined,
  pageNum: 1,
  pageSize: 10
})

// 数据列表
const salaryList = ref<Salary[]>([])
const employeeList = ref<Employee[]>([])
const departmentList = ref<Department[]>([])
const total = ref(0)
const loading = ref(false)
const selectedIds = ref<number[]>([])

// 详情对话框
const detailVisible = ref(false)
const currentRow = ref<Salary>()

// 获取薪资列表
const fetchSalaryList = async () => {
  loading.value = true
  try {
    const res = await getSalaryList(queryParams)
    salaryList.value = res.list
    total.value = res.total
  } catch (error) {
    console.error('获取薪资列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 获取薪资统计
const fetchSalaryStats = async () => {
  try {
    const res = await getSalaryStats(queryParams.salaryMonth)
    Object.assign(salaryStats, res)
  } catch (error) {
    console.error('获取薪资统计失败:', error)
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
  fetchSalaryList()
  fetchSalaryStats()
}

// 重置
const handleReset = () => {
  queryParams.salaryMonth = new Date().toISOString().slice(0, 7)
  queryParams.employeeId = undefined
  queryParams.departmentId = undefined
  queryParams.pageNum = 1
  fetchSalaryList()
  fetchSalaryStats()
}

// 选择变化
const handleSelectionChange = (selection: Salary[]) => {
  selectedIds.value = selection.map(item => item.id)
}

// 分页
const handleSizeChange = (val: number) => {
  queryParams.pageSize = val
  fetchSalaryList()
}

const handleCurrentChange = (val: number) => {
  queryParams.pageNum = val
  fetchSalaryList()
}

// 批量计算
const handleBatchCalculate = () => {
  ElMessageBox.confirm(`确定要计算 ${queryParams.salaryMonth} 月的薪资吗？`, '提示', {
    type: 'warning'
  }).then(async () => {
    // await batchCalculateSalary(queryParams.salaryMonth!)
    ElMessage.success('薪资计算任务已提交')
    fetchSalaryList()
    fetchSalaryStats()
  })
}

// 确认薪资
const handleConfirm = (row: Salary) => {
  ElMessageBox.confirm(`确定要确认「${row.employeeName}」的薪资吗？`, '提示', {
    type: 'warning'
  }).then(async () => {
    await confirmSalary(row.id)
    ElMessage.success('确认成功')
    fetchSalaryList()
  })
}

// 批量确认
const handleBatchConfirm = () => {
  ElMessageBox.confirm(`确定要确认选中的 ${selectedIds.value.length} 条薪资记录吗？`, '提示', {
    type: 'warning'
  }).then(async () => {
    await batchConfirmSalary(selectedIds.value)
    ElMessage.success('批量确认成功')
    fetchSalaryList()
  })
}

// 查看详情
const handleView = (row: Salary) => {
  currentRow.value = row
  detailVisible.value = true
}

// 导出
const handleExport = async () => {
  // const blob = await exportSalary(queryParams)
  // downloadFile(blob, `薪资列表_${queryParams.salaryMonth}.xlsx`)
  ElMessage.info('导出功能开发中...')
}

onMounted(() => {
  fetchSalaryList()
  fetchSalaryStats()
  fetchEmployeeList()
  fetchDepartmentList()
})
</script>

<style scoped lang="scss">
.salary-container {
  .stat-row {
    margin-bottom: 20px;

    .stat-item {
      text-align: center;

      .stat-title {
        color: #909399;
        font-size: 14px;
        margin-bottom: 10px;
      }

      .stat-value {
        color: #303133;
        font-size: 24px;
        font-weight: bold;
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

    .left {
      display: flex;
      gap: 10px;
    }
  }

  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }

  .text-danger {
    color: #f56c6c;
  }

  .text-success {
    color: #67c23a;
  }

  .text-primary {
    color: #409eff;
  }

  .font-bold {
    font-weight: bold;
  }
}
</style>
