<template>
  <div class="employee-container">
    <!-- 搜索栏 -->
    <el-card shadow="never" class="search-card">
      <el-form :model="queryParams" inline>
        <el-form-item label="关键字">
          <el-input
            v-model="queryParams.keyword"
            placeholder="姓名/工号/手机号"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="部门">
          <el-select
            v-model="queryParams.departmentId"
            placeholder="请选择部门"
            clearable
            style="width: 150px"
          >
            <el-option
              v-for="dept in departmentList"
              :key="dept.id"
              :label="dept.name"
              :value="dept.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="queryParams.status"
            placeholder="请选择状态"
            clearable
            style="width: 150px"
          >
            <el-option label="在职" :value="1" />
            <el-option label="离职" :value="0" />
            <el-option label="试用期" :value="2" />
            <el-option label="实习" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
          <el-button :icon="Refresh" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 操作栏 -->
    <el-card shadow="never" class="table-card">
      <template #header>
        <div class="table-header">
          <div class="left">
            <el-button type="primary" :icon="Plus" @click="handleAdd">新增员工</el-button>
            <el-button type="danger" :icon="Delete" :disabled="!selectedIds.length" @click="handleBatchDelete">
              批量删除
            </el-button>
          </div>
          <div class="right">
            <el-button :icon="Download" @click="handleExport">导出</el-button>
            <el-button :icon="Upload" @click="handleImport">导入</el-button>
          </div>
        </div>
      </template>

      <!-- 数据表格 -->
      <el-table
        v-loading="loading"
        :data="employeeList"
        @selection-change="handleSelectionChange"
        stripe
        border
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="employeeNo" label="工号" width="120" />
        <el-table-column prop="name" label="姓名" width="100" />
        <el-table-column prop="gender" label="性别" width="70">
          <template #default="{ row }">
            {{ formatGender(row.gender) }}
          </template>
        </el-table-column>
        <el-table-column prop="departmentName" label="部门" />
        <el-table-column prop="positionName" label="职位" />
        <el-table-column prop="phone" label="手机号" width="130" />
        <el-table-column prop="entryDate" label="入职日期" width="110">
          <template #default="{ row }">
            {{ formatDate(row.entryDate) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ formatEmployeeStatus(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link :icon="View" @click="handleView(row)">查看</el-button>
            <el-button type="primary" link :icon="Edit" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" link :icon="Delete" @click="handleDelete(row)">删除</el-button>
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

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="700px"
      destroy-on-close
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
        class="employee-form"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="员工编号" prop="employeeNo">
              <el-input v-model="formData.employeeNo" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="formData.name" placeholder="请输入姓名" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="性别" prop="gender">
              <el-radio-group v-model="formData.gender">
                <el-radio :label="1">男</el-radio>
                <el-radio :label="0">女</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出生日期" prop="birthDate">
              <el-date-picker
                v-model="formData.birthDate"
                type="date"
                placeholder="选择日期"
                style="width: 100%"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="身份证号" prop="idCard">
              <el-input v-model="formData.idCard" placeholder="请输入身份证号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="formData.phone" placeholder="请输入手机号" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="formData.email" placeholder="请输入邮箱" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门" prop="departmentId">
              <el-select v-model="formData.departmentId" placeholder="请选择部门" style="width: 100%">
                <el-option
                  v-for="dept in departmentList"
                  :key="dept.id"
                  :label="dept.name"
                  :value="dept.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="职位" prop="positionId">
              <el-select v-model="formData.positionId" placeholder="请选择职位" style="width: 100%">
                <el-option
                  v-for="pos in positionList"
                  :key="pos.id"
                  :label="pos.name"
                  :value="pos.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="入职日期" prop="entryDate">
              <el-date-picker
                v-model="formData.entryDate"
                type="date"
                placeholder="选择日期"
                style="width: 100%"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="学历" prop="education">
              <el-select v-model="formData.education" placeholder="请选择学历" style="width: 100%">
                <el-option label="博士" value="博士" />
                <el-option label="硕士" value="硕士" />
                <el-option label="本科" value="本科" />
                <el-option label="大专" value="大专" />
                <el-option label="高中及以下" value="高中及以下" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-select v-model="formData.status" placeholder="请选择状态" style="width: 100%">
                <el-option label="在职" :value="1" />
                <el-option label="离职" :value="0" />
                <el-option label="试用期" :value="2" />
                <el-option label="实习" :value="3" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="地址" prop="address">
          <el-input v-model="formData.address" type="textarea" placeholder="请输入地址" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 查看详情对话框 -->
    <el-dialog v-model="detailVisible" title="员工详情" width="600px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="工号">{{ currentRow?.employeeNo }}</el-descriptions-item>
        <el-descriptions-item label="姓名">{{ currentRow?.name }}</el-descriptions-item>
        <el-descriptions-item label="性别">{{ formatGender(currentRow?.gender || 2) }}</el-descriptions-item>
        <el-descriptions-item label="出生日期">{{ formatDate(currentRow?.birthDate!) }}</el-descriptions-item>
        <el-descriptions-item label="身份证号">{{ currentRow?.idCard }}</el-descriptions-item>
        <el-descriptions-item label="手机号">{{ currentRow?.phone }}</el-descriptions-item>
        <el-descriptions-item label="邮箱">{{ currentRow?.email }}</el-descriptions-item>
        <el-descriptions-item label="部门">{{ currentRow?.departmentName }}</el-descriptions-item>
        <el-descriptions-item label="职位">{{ currentRow?.positionName }}</el-descriptions-item>
        <el-descriptions-item label="入职日期">{{ formatDate(currentRow?.entryDate!) }}</el-descriptions-item>
        <el-descriptions-item label="学历">{{ currentRow?.education }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getStatusType(currentRow?.status || 0)">
            {{ formatEmployeeStatus(currentRow?.status || 0) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="地址" :span="2">{{ currentRow?.address }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>

    <!-- 导入对话框 -->
    <el-dialog v-model="importVisible" title="导入员工数据" width="500px">
      <el-upload
        drag
        action="/api/employee/import"
        :headers="{ Authorization: `Bearer ${userStore.token}` }"
        :on-success="handleImportSuccess"
        :on-error="handleImportError"
        accept=".xlsx,.xls"
      >
        <el-icon class="el-icon--upload"><Upload /></el-icon>
        <div class="el-upload__text">
          将文件拖到此处，或<em>点击上传</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            仅支持 .xlsx, .xls 格式文件，<el-link type="primary" @click="downloadTemplate">下载模板</el-link>
          </div>
        </template>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Plus, Delete, Edit, View, Download, Upload } from '@element-plus/icons-vue'
import { getEmployeeList, addEmployee, updateEmployee, deleteEmployee, batchDeleteEmployee, exportEmployee } from '@/api/employee'
import { getAllDepartments } from '@/api/department'
import { useUserStore } from '@/store/user'
import type { Employee, EmployeeQuery, Department } from '@/types'
import { formatDate, formatGender, formatEmployeeStatus, getStatusType, generateEmployeeNo, downloadFile } from '@/utils/format'

const userStore = useUserStore()

// 查询参数
const queryParams = reactive<EmployeeQuery>({
  keyword: '',
  departmentId: undefined,
  status: undefined,
  pageNum: 1,
  pageSize: 10
})

// 数据列表
const employeeList = ref<Employee[]>([])
const departmentList = ref<Department[]>([])
const positionList = ref([
  { id: 1, name: '软件工程师' },
  { id: 2, name: '产品经理' },
  { id: 3, name: '销售经理' },
  { id: 4, name: '人事专员' },
  { id: 5, name: '财务主管' }
])
const total = ref(0)
const loading = ref(false)
const selectedIds = ref<number[]>([])

// 对话框
const dialogVisible = ref(false)
const dialogTitle = ref('')
const detailVisible = ref(false)
const importVisible = ref(false)
const currentRow = ref<Employee>()

// 表单
const formRef = ref()
const formData = reactive<Partial<Employee>>({
  employeeNo: '',
  name: '',
  gender: 1,
  departmentId: undefined,
  positionId: undefined,
  status: 1
})
const formRules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
  departmentId: [{ required: true, message: '请选择部门', trigger: 'change' }],
  positionId: [{ required: true, message: '请选择职位', trigger: 'change' }],
  entryDate: [{ required: true, message: '请选择入职日期', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
}
const submitLoading = ref(false)

// 获取员工列表
const fetchEmployeeList = async () => {
  loading.value = true
  try {
    const res = await getEmployeeList(queryParams)
    employeeList.value = res.list
    total.value = res.total
  } catch (error) {
    console.error('获取员工列表失败:', error)
  } finally {
    loading.value = false
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
  fetchEmployeeList()
}

// 重置
const handleReset = () => {
  queryParams.keyword = ''
  queryParams.departmentId = undefined
  queryParams.status = undefined
  queryParams.pageNum = 1
  fetchEmployeeList()
}

// 选择变化
const handleSelectionChange = (selection: Employee[]) => {
  selectedIds.value = selection.map(item => item.id)
}

// 分页
const handleSizeChange = (val: number) => {
  queryParams.pageSize = val
  fetchEmployeeList()
}

const handleCurrentChange = (val: number) => {
  queryParams.pageNum = val
  fetchEmployeeList()
}

// 新增
const handleAdd = () => {
  dialogTitle.value = '新增员工'
  Object.assign(formData, {
    employeeNo: generateEmployeeNo(),
    name: '',
    gender: 1,
    birthDate: '',
    idCard: '',
    phone: '',
    email: '',
    address: '',
    departmentId: undefined,
    positionId: undefined,
    entryDate: new Date().toISOString().split('T')[0],
    status: 1,
    education: ''
  })
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row: Employee) => {
  dialogTitle.value = '编辑员工'
  Object.assign(formData, { ...row })
  dialogVisible.value = true
}

// 查看
const handleView = (row: Employee) => {
  currentRow.value = row
  detailVisible.value = true
}

// 删除
const handleDelete = (row: Employee) => {
  ElMessageBox.confirm(`确定要删除员工「${row.name}」吗？`, '提示', {
    type: 'warning'
  }).then(async () => {
    await deleteEmployee(row.id)
    ElMessage.success('删除成功')
    fetchEmployeeList()
  })
}

// 批量删除
const handleBatchDelete = () => {
  ElMessageBox.confirm(`确定要删除选中的 ${selectedIds.value.length} 名员工吗？`, '提示', {
    type: 'warning'
  }).then(async () => {
    await batchDeleteEmployee(selectedIds.value)
    ElMessage.success('批量删除成功')
    fetchEmployeeList()
  })
}

// 提交表单
const handleSubmit = async () => {
  const valid = await formRef.value?.validate()
  if (!valid) return

  submitLoading.value = true
  try {
    if (formData.id) {
      await updateEmployee(formData.id, formData)
      ElMessage.success('修改成功')
    } else {
      await addEmployee(formData)
      ElMessage.success('新增成功')
    }
    dialogVisible.value = false
    fetchEmployeeList()
  } finally {
    submitLoading.value = false
  }
}

// 导出
const handleExport = async () => {
  const blob = await exportEmployee(queryParams)
  downloadFile(blob, `员工列表_${new Date().toISOString().split('T')[0]}.xlsx`)
}

// 导入
const handleImport = () => {
  importVisible.value = true
}

const handleImportSuccess = () => {
  ElMessage.success('导入成功')
  importVisible.value = false
  fetchEmployeeList()
}

const handleImportError = () => {
  ElMessage.error('导入失败')
}

const downloadTemplate = () => {
  // 下载导入模板
  ElMessage.info('模板下载功能开发中...')
}

onMounted(() => {
  fetchEmployeeList()
  fetchDepartmentList()
})
</script>

<style scoped lang="scss">
.employee-container {
  .search-card {
    margin-bottom: 20px;
  }

  .table-card {
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
  }

  .employee-form {
    .el-select {
      width: 100%;
    }
  }
}
</style>
