// 用户相关类型
export interface User {
  id: number
  username: string
  realName: string
  avatar?: string
  email?: string
  phone?: string
  status: number
  role: string
  createTime?: string
}

export interface LoginForm {
  username: string
  password: string
  captcha?: string
  remember?: boolean
}

export interface LoginResult {
  token: string
  userInfo: User
}

// 员工相关类型
export interface Employee {
  id: number
  employeeNo: string
  name: string
  gender: number
  birthDate?: string
  idCard?: string
  phone?: string
  email?: string
  address?: string
  departmentId: number
  departmentName?: string
  positionId: number
  positionName?: string
  entryDate: string
  leaveDate?: string
  status: number
  education?: string
  major?: string
  school?: string
  createTime?: string
  updateTime?: string
}

export interface EmployeeQuery {
  keyword?: string
  departmentId?: number
  status?: number
  pageNum: number
  pageSize: number
}

// 部门相关类型
export interface Department {
  id: number
  name: string
  code: string
  parentId: number
  managerId?: number
  managerName?: string
  description?: string
  sort: number
  status: number
  createTime?: string
  children?: Department[]
}

// 职位相关类型
export interface Position {
  id: number
  name: string
  code: string
  departmentId: number
  departmentName?: string
  level: number
  description?: string
  status: number
  createTime?: string
}

// 考勤相关类型
export interface Attendance {
  id: number
  employeeId: number
  employeeName?: string
  departmentName?: string
  attendanceDate: string
  checkIn?: string
  checkOut?: string
  status: number
  workHours?: number
  overtimeHours?: number
  remark?: string
  createTime?: string
}

export interface AttendanceQuery {
  employeeId?: number
  departmentId?: number
  startDate?: string
  endDate?: string
  status?: number
  pageNum: number
  pageSize: number
}

// 薪资相关类型
export interface Salary {
  id: number
  employeeId: number
  employeeName?: string
  departmentName?: string
  salaryMonth: string
  baseSalary: number
  positionAllowance: number
  overtimePay: number
  bonus: number
  socialInsurance: number
  housingFund: number
  personalTax: number
  otherDeduction: number
  netSalary: number
  status: number
  createTime?: string
}

export interface SalaryQuery {
  employeeId?: number
  departmentId?: number
  salaryMonth?: string
  pageNum: number
  pageSize: number
}

// 通用响应类型
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

export interface PageResult<T> {
  list: T[]
  total: number
  pageNum: number
  pageSize: number
  pages: number
}

// 仪表盘数据类型
export interface DashboardData {
  employeeCount: number
  departmentCount: number
  todayAttendance: number
  monthSalary: number
  attendanceStats: {
    date: string
    normal: number
    late: number
    absent: number
  }[]
  departmentDistribution: {
    name: string
    value: number
  }[]
  recentEmployees: Employee[]
}
