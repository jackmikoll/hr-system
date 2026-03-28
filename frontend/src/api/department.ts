import request from '@/utils/request'
import type { Department, PageResult } from '@/types'

// 获取部门列表（树形）
export const getDepartmentTree = (): Promise<Department[]> => {
  return request.get('/department/tree')
}

// 获取部门列表（分页）
export const getDepartmentList = (params: { pageNum: number; pageSize: number; keyword?: string }): Promise<PageResult<Department>> => {
  return request.get('/department/list', { params })
}

// 获取部门详情
export const getDepartmentById = (id: number): Promise<Department> => {
  return request.get(`/department/${id}`)
}

// 新增部门
export const addDepartment = (data: Partial<Department>): Promise<void> => {
  return request.post('/department', data)
}

// 修改部门
export const updateDepartment = (id: number, data: Partial<Department>): Promise<void> => {
  return request.put(`/department/${id}`, data)
}

// 删除部门
export const deleteDepartment = (id: number): Promise<void> => {
  return request.delete(`/department/${id}`)
}

// 获取所有部门（下拉选择）
export const getAllDepartments = (): Promise<Department[]> => {
  return request.get('/department/all')
}
