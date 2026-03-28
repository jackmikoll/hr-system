<template>
  <div class="department-container">
    <el-row :gutter="20">
      <!-- 左侧部门树 -->
      <el-col :xs="24" :sm="8" :lg="6">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span>部门结构</span>
              <el-button type="primary" link :icon="Plus" @click="handleAdd">
                新增
              </el-button>
            </div>
          </template>
          <el-tree
            :data="deptTree"
            :props="{ label: 'name', children: 'children' }"
            node-key="id"
            highlight-current
            default-expand-all
            @node-click="handleNodeClick"
          >
            <template #default="{ node, data }">
              <span class="tree-node">
                <span>{{ node.label }}</span>
                <span class="tree-actions">
                  <el-icon @click.stop="handleEdit(data)"><Edit /></el-icon>
                  <el-icon @click.stop="handleDelete(data)"><Delete /></el-icon>
                </span>
              </span>
            </template>
          </el-tree>
        </el-card>
      </el-col>

      <!-- 右侧部门详情/员工列表 -->
      <el-col :xs="24" :sm="16" :lg="18">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span>{{ currentDept?.name || '部门详情' }}</span>
              <el-button v-if="currentDept" type="primary" link @click="showDeptDetail">
                查看详情
              </el-button>
            </div>
          </template>
          <div v-if="currentDept" class="dept-info">
            <el-descriptions :column="2" border>
              <el-descriptions-item label="部门名称">{{ currentDept.name }}</el-descriptions-item>
              <el-descriptions-item label="部门编码">{{ currentDept.code }}</el-descriptions-item>
              <el-descriptions-item label="负责人">{{ currentDept.managerName || '-' }}</el-descriptions-item>
              <el-descriptions-item label="排序">{{ currentDept.sort }}</el-descriptions-item>
              <el-descriptions-item label="状态">
                <el-tag :type="currentDept.status === 1 ? 'success' : 'danger'">
                  {{ currentDept.status === 1 ? '正常' : '停用' }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="创建时间">{{ formatDate(currentDept.createTime!) }}</el-descriptions-item>
              <el-descriptions-item label="描述" :span="2">{{ currentDept.description || '-' }}</el-descriptions-item>
            </el-descriptions>

            <div class="section-title">
              <h4>部门员工</h4>
            </div>
            <el-table :data="deptEmployees" stripe border>
              <el-table-column prop="employeeNo" label="工号" width="120" />
              <el-table-column prop="name" label="姓名" width="100" />
              <el-table-column prop="positionName" label="职位" />
              <el-table-column prop="phone" label="手机号" />
              <el-table-column prop="entryDate" label="入职日期">
                <template #default="{ row }">
                  {{ formatDate(row.entryDate) }}
                </template>
              </el-table-column>
            </el-table>
          </div>
          <el-empty v-else description="请选择部门查看详情" />
        </el-card>
      </el-col>
    </el-row>

    <!-- 新增/编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px">
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入部门名称" />
        </el-form-item>
        <el-form-item label="部门编码" prop="code">
          <el-input v-model="formData.code" placeholder="请输入部门编码" />
        </el-form-item>
        <el-form-item label="上级部门" prop="parentId">
          <el-tree-select
            v-model="formData.parentId"
            :data="deptTree"
            :props="{ label: 'name', value: 'id' }"
            placeholder="请选择上级部门"
            clearable
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="负责人" prop="managerId">
          <el-select v-model="formData.managerId" placeholder="请选择负责人" clearable style="width: 100%">
            <el-option
              v-for="emp in employeeList"
              :key="emp.id"
              :label="emp.name"
              :value="emp.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="formData.sort" :min="0" style="width: 100%" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="0">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="formData.description" type="textarea" placeholder="请输入描述" />
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
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Edit, Delete } from '@element-plus/icons-vue'
import { getDepartmentTree, addDepartment, updateDepartment, deleteDepartment } from '@/api/department'
import { getEmployeeList } from '@/api/employee'
import type { Department, Employee } from '@/types'
import { formatDate } from '@/utils/format'

const deptTree = ref<Department[]>([])
const currentDept = ref<Department>()
const deptEmployees = ref<Employee[]>([])
const employeeList = ref<Employee[]>([])

// 对话框
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref()
const formData = reactive<Partial<Department>>({
  name: '',
  code: '',
  parentId: 0,
  managerId: undefined,
  sort: 0,
  status: 1,
  description: ''
})
const formRules = {
  name: [{ required: true, message: '请输入部门名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入部门编码', trigger: 'blur' }],
  sort: [{ required: true, message: '请输入排序', trigger: 'blur' }]
}
const submitLoading = ref(false)

// 获取部门树
const fetchDeptTree = async () => {
  try {
    const res = await getDepartmentTree()
    deptTree.value = res
  } catch (error) {
    console.error('获取部门树失败:', error)
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

// 节点点击
const handleNodeClick = (data: Department) => {
  currentDept.value = data
  // 获取部门员工
  deptEmployees.value = employeeList.value.filter(emp => emp.departmentId === data.id).slice(0, 10)
}

// 显示部门详情
const showDeptDetail = () => {
  // 已在右侧显示
}

// 新增
const handleAdd = () => {
  dialogTitle.value = '新增部门'
  Object.assign(formData, {
    name: '',
    code: '',
    parentId: currentDept.value?.id || 0,
    managerId: undefined,
    sort: 0,
    status: 1,
    description: ''
  })
  dialogVisible.value = true
}

// 编辑
const handleEdit = (data: Department) => {
  dialogTitle.value = '编辑部门'
  Object.assign(formData, { ...data })
  dialogVisible.value = true
}

// 删除
const handleDelete = (data: Department) => {
  ElMessageBox.confirm(`确定要删除部门「${data.name}」吗？`, '提示', {
    type: 'warning'
  }).then(async () => {
    await deleteDepartment(data.id)
    ElMessage.success('删除成功')
    fetchDeptTree()
  })
}

// 提交
const handleSubmit = async () => {
  const valid = await formRef.value?.validate()
  if (!valid) return

  submitLoading.value = true
  try {
    if (formData.id) {
      await updateDepartment(formData.id, formData)
      ElMessage.success('修改成功')
    } else {
      await addDepartment(formData)
      ElMessage.success('新增成功')
    }
    dialogVisible.value = false
    fetchDeptTree()
  } finally {
    submitLoading.value = false
  }
}

onMounted(() => {
  fetchDeptTree()
  fetchEmployeeList()
})
</script>

<style scoped lang="scss">
.department-container {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 8px;

    .tree-actions {
      display: none;

      .el-icon {
        margin-left: 8px;
        cursor: pointer;
        color: #409eff;

        &:hover {
          color: #66b1ff;
        }

        &:last-child {
          color: #f56c6c;

          &:hover {
            color: #f78989;
          }
        }
      }
    }

    &:hover .tree-actions {
      display: inline-flex;
    }
  }

  .dept-info {
    .section-title {
      margin: 20px 0 15px;
      padding-bottom: 10px;
      border-bottom: 1px solid #ebeef5;

      h4 {
        margin: 0;
        font-size: 16px;
        color: #303133;
      }
    }
  }
}
</style>
