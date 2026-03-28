import request from '@/utils/request'
import type { DashboardData } from '@/types'

// 获取仪表盘数据
export const getDashboardData = (): Promise<DashboardData> => {
  return request.get('/dashboard')
}

// 获取实时数据
export const getRealTimeData = (): Promise<{
  onlineUsers: number
  todayNewEmployees: number
  pendingApprovals: number
  systemAlerts: number
}> => {
  return request.get('/dashboard/realtime')
}
