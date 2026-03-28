import request from '@/utils/request'
import type { Salary, SalaryQuery, PageResult } from '@/types'

// 获取薪资列表
export const getSalaryList = (params: SalaryQuery): Promise<PageResult<Salary>> => {
  return request.get('/salary/list', { params })
}

// 获取薪资详情
export const getSalaryById = (id: number): Promise<Salary> => {
  return request.get(`/salary/${id}`)
}

// 计算薪资
export const calculateSalary = (employeeId: number, salaryMonth: string): Promise<Salary> => {
  return request.post('/salary/calculate', { employeeId, salaryMonth })
}

// 批量计算薪资
export const batchCalculateSalary = (salaryMonth: string): Promise<void> => {
  return request.post('/salary/batch-calculate', { salaryMonth })
}

// 确认薪资
export const confirmSalary = (id: number): Promise<void> => {
  return request.put(`/salary/${id}/confirm`)
}

// 批量确认薪资
export const batchConfirmSalary = (ids: number[]): Promise<void> => {
  return request.put('/salary/batch-confirm', ids)
}

// 修改薪资
export const updateSalary = (id: number, data: Partial<Salary>): Promise<void> => {
  return request.put(`/salary/${id}`, data)
}

// 删除薪资记录
export const deleteSalary = (id: number): Promise<void> => {
  return request.delete(`/salary/${id}`)
}

// 获取薪资统计
export const getSalaryStats = (salaryMonth?: string): Promise<{
  totalAmount: number
  totalCount: number
  avgSalary: number
  maxSalary: number
  minSalary: number
}> => {
  return request.get('/salary/stats', { params: { salaryMonth } })
}

// 导出薪资数据
export const exportSalary = (params: Partial<SalaryQuery>): Promise<Blob> => {
  return request.get('/salary/export', { 
    params,
    responseType: 'blob'
  })
}
