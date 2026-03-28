import request from '@/utils/request'
import type { Attendance, AttendanceQuery, PageResult } from '@/types'

// 获取考勤列表
export const getAttendanceList = (params: AttendanceQuery): Promise<PageResult<Attendance>> => {
  return request.get('/attendance/list', { params })
}

// 获取考勤详情
export const getAttendanceById = (id: number): Promise<Attendance> => {
  return request.get(`/attendance/${id}`)
}

// 打卡
export const checkInOut = (type: 'in' | 'out'): Promise<void> => {
  return request.post(`/attendance/check-${type}`)
}

// 补卡申请
export const makeUpAttendance = (data: Partial<Attendance>): Promise<void> => {
  return request.post('/attendance/make-up', data)
}

// 修改考勤
export const updateAttendance = (id: number, data: Partial<Attendance>): Promise<void> => {
  return request.put(`/attendance/${id}`, data)
}

// 删除考勤记录
export const deleteAttendance = (id: number): Promise<void> => {
  return request.delete(`/attendance/${id}`)
}

// 获取今日考勤状态
export const getTodayAttendance = (): Promise<{
  checkedIn: boolean
  checkInTime?: string
  checkedOut: boolean
  checkOutTime?: string
}> => {
  return request.get('/attendance/today')
}

// 获取考勤统计
export const getAttendanceStats = (params: { startDate: string; endDate: string }): Promise<{
  normal: number
  late: number
  early: number
  absent: number
  leave: number
  overtime: number
}> => {
  return request.get('/attendance/stats', { params })
}

// 导出考勤数据
export const exportAttendance = (params: Partial<AttendanceQuery>): Promise<Blob> => {
  return request.get('/attendance/export', { 
    params,
    responseType: 'blob'
  })
}
