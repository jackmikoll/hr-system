import request from '@/utils/request'
import type { Employee, EmployeeQuery, PageResult } from '@/types'

// 获取员工列表
export const getEmployeeList = (params: EmployeeQuery): Promise<PageResult<Employee>> => {
  return request.get('/employee/list', { params })
}

// 获取员工详情
export const getEmployeeById = (id: number): Promise<Employee> => {
  return request.get(`/employee/${id}`)
}

// 新增员工
export const addEmployee = (data: Partial<Employee>): Promise<void> => {
  return request.post('/employee', data)
}

// 修改员工
export const updateEmployee = (id: number, data: Partial<Employee>): Promise<void> => {
  return request.put(`/employee/${id}`, data)
}

// 删除员工
export const deleteEmployee = (id: number): Promise<void> => {
  return request.delete(`/employee/${id}`)
}

// 批量删除员工
export const batchDeleteEmployee = (ids: number[]): Promise<void> => {
  return request.delete('/employee/batch', { data: ids })
}

// 导出员工数据
export const exportEmployee = (params?: Partial<EmployeeQuery>): Promise<Blob> => {
  return request.get('/employee/export', { 
    params,
    responseType: 'blob'
  })
}

// 导入员工数据
export const importEmployee = (file: File): Promise<void> => {
  const formData = new FormData()
  formData.append('file', file)
  return request.post('/employee/import', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 获取员工统计
export const getEmployeeStats = (): Promise<{
  total: number
  onJob: number
  probation: number
  internship: number
}> => {
  return request.get('/employee/stats')
}
