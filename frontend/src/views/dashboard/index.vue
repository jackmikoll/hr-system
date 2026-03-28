<template>
  <div class="dashboard-container">
    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stat-cards">
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-item">
            <div class="stat-icon" style="background: #409eff;">
              <el-icon><User /></el-icon>
            </div>
            <div class="stat-info">
              <p class="stat-title">员工总数</p>
              <p class="stat-value">{{ dashboardData?.employeeCount || 0 }}</p>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-item">
            <div class="stat-icon" style="background: #67c23a;">
              <el-icon><OfficeBuilding /></el-icon>
            </div>
            <div class="stat-info">
              <p class="stat-title">部门数量</p>
              <p class="stat-value">{{ dashboardData?.departmentCount || 0 }}</p>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-item">
            <div class="stat-icon" style="background: #e6a23c;">
              <el-icon><Calendar /></el-icon>
            </div>
            <div class="stat-info">
              <p class="stat-title">今日考勤</p>
              <p class="stat-value">{{ dashboardData?.todayAttendance || 0 }}</p>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-item">
            <div class="stat-icon" style="background: #f56c6c;">
              <el-icon><Money /></el-icon>
            </div>
            <div class="stat-info">
              <p class="stat-title">本月薪资</p>
              <p class="stat-value">{{ formatMoney(dashboardData?.monthSalary || 0) }}</p>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :xs="24" :lg="16">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>考勤统计</span>
              <el-radio-group v-model="attendancePeriod" size="small">
                <el-radio-button label="week">本周</el-radio-button>
                <el-radio-button label="month">本月</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div ref="attendanceChartRef" class="chart-container" style="height: 350px;"></div>
        </el-card>
      </el-col>
      <el-col :xs="24" :lg="8">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>部门分布</span>
            </div>
          </template>
          <div ref="deptChartRef" class="chart-container" style="height: 350px;"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 最新员工和快捷操作 -->
    <el-row :gutter="20" class="bottom-row">
      <el-col :xs="24" :lg="16">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>最新入职员工</span>
              <el-button type="primary" link @click="$router.push('/employee')">
                查看更多
              </el-button>
            </div>
          </template>
          <el-table :data="recentEmployees" style="width: 100%">
            <el-table-column prop="employeeNo" label="工号" width="120" />
            <el-table-column prop="name" label="姓名" width="100" />
            <el-table-column prop="departmentName" label="部门" />
            <el-table-column prop="positionName" label="职位" />
            <el-table-column prop="entryDate" label="入职日期">
              <template #default="{ row }">
                {{ formatDate(row.entryDate) }}
              </template>
            </el-table-column>
            <el-table-column label="状态" width="80">
              <template #default="{ row }">
                <el-tag :type="getStatusType(row.status)">
                  {{ formatEmployeeStatus(row.status) }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :xs="24" :lg="8">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>快捷操作</span>
            </div>
          </template>
          <div class="quick-actions">
            <el-button type="primary" :icon="Plus" @click="$router.push('/employee')">
              新增员工
            </el-button>
            <el-button type="success" :icon="Calendar" @click="handleCheckIn">
              今日打卡
            </el-button>
            <el-button type="warning" :icon="Money" @click="$router.push('/salary')">
              薪资计算
            </el-button>
            <el-button type="info" :icon="Download" @click="handleExport">
              导出报表
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import { Plus, Calendar, Money, Download } from '@element-plus/icons-vue'
import { getDashboardData } from '@/api/dashboard'
import { checkInOut } from '@/api/attendance'
import type { DashboardData, Employee } from '@/types'
import { formatDate, formatMoney, formatEmployeeStatus, getStatusType } from '@/utils/format'

const dashboardData = ref<DashboardData>()
const recentEmployees = ref<Employee[]>([])
const attendancePeriod = ref('week')
const attendanceChartRef = ref<HTMLElement>()
const deptChartRef = ref<HTMLElement>()
let attendanceChart: echarts.ECharts | null = null
let deptChart: echarts.ECharts | null = null

// 初始化考勤统计图表
const initAttendanceChart = () => {
  if (!attendanceChartRef.value) return
  
  attendanceChart = echarts.init(attendanceChartRef.value)
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    legend: {
      data: ['正常', '迟到', '缺勤']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '正常',
        type: 'bar',
        stack: 'total',
        data: [120, 132, 101, 134, 90, 30, 20],
        itemStyle: { color: '#67c23a' }
      },
      {
        name: '迟到',
        type: 'bar',
        stack: 'total',
        data: [10, 5, 8, 3, 12, 2, 0],
        itemStyle: { color: '#e6a23c' }
      },
      {
        name: '缺勤',
        type: 'bar',
        stack: 'total',
        data: [2, 1, 3, 0, 5, 0, 0],
        itemStyle: { color: '#f56c6c' }
      }
    ]
  }
  attendanceChart.setOption(option)
}

// 初始化部门分布图表
const initDeptChart = () => {
  if (!deptChartRef.value) return
  
  deptChart = echarts.init(deptChartRef.value)
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}人 ({d}%)'
    },
    legend: {
      orient: 'vertical',
      right: '5%',
      top: 'center'
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold'
          }
        },
        data: [
          { value: 35, name: '技术部', itemStyle: { color: '#409eff' } },
          { value: 25, name: '销售部', itemStyle: { color: '#67c23a' } },
          { value: 20, name: '人事部', itemStyle: { color: '#e6a23c' } },
          { value: 15, name: '财务部', itemStyle: { color: '#f56c6c' } },
          { value: 10, name: '行政部', itemStyle: { color: '#909399' } }
        ]
      }
    ]
  }
  deptChart.setOption(option)
}

// 获取仪表盘数据
const fetchDashboardData = async () => {
  try {
    const res = await getDashboardData()
    dashboardData.value = res
    recentEmployees.value = res.recentEmployees || []
  } catch (error) {
    console.error('获取仪表盘数据失败:', error)
  }
}

// 打卡
const handleCheckIn = async () => {
  try {
    await checkInOut('in')
    ElMessage.success('打卡成功')
  } catch (error) {
    console.error('打卡失败:', error)
  }
}

// 导出报表
const handleExport = () => {
  ElMessage.info('导出功能开发中...')
}

// 窗口大小改变时重新渲染图表
const handleResize = () => {
  attendanceChart?.resize()
  deptChart?.resize()
}

onMounted(() => {
  fetchDashboardData()
  nextTick(() => {
    initAttendanceChart()
    initDeptChart()
  })
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  attendanceChart?.dispose()
  deptChart?.dispose()
})
</script>

<style scoped lang="scss">
.dashboard-container {
  .stat-cards {
    margin-bottom: 20px;

    .stat-card {
      .stat-item {
        display: flex;
        align-items: center;

        .stat-icon {
          width: 60px;
          height: 60px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 15px;

          .el-icon {
            font-size: 28px;
            color: #fff;
          }
        }

        .stat-info {
          .stat-title {
            color: #909399;
            font-size: 14px;
            margin-bottom: 8px;
          }

          .stat-value {
            color: #303133;
            font-size: 24px;
            font-weight: bold;
          }
        }
      }
    }
  }

  .chart-row {
    margin-bottom: 20px;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .chart-container {
      width: 100%;
    }
  }

  .bottom-row {
    .quick-actions {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;

      .el-button {
        width: 100%;
      }
    }
  }
}
</style>
