import dayjs from 'dayjs'

// 日期格式化
export const formatDate = (date: string | Date, format = 'YYYY-MM-DD'): string => {
  if (!date) return '-'
  return dayjs(date).format(format)
}

export const formatDateTime = (date: string | Date): string => {
  if (!date) return '-'
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
}

// 金额格式化
export const formatMoney = (amount: number): string => {
  if (amount === undefined || amount === null) return '-'
  return '¥' + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
}

// 数字格式化
export const formatNumber = (num: number): string => {
  if (num === undefined || num === null) return '-'
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// 性别格式化
export const formatGender = (gender: number): string => {
  const map: Record<number, string> = {
    0: '女',
    1: '男',
    2: '保密'
  }
  return map[gender] || '未知'
}

// 员工状态格式化
export const formatEmployeeStatus = (status: number): string => {
  const map: Record<number, string> = {
    0: '离职',
    1: '在职',
    2: '试用期',
    3: '实习'
  }
  return map[status] || '未知'
}

// 考勤状态格式化
export const formatAttendanceStatus = (status: number): string => {
  const map: Record<number, string> = {
    0: '缺勤',
    1: '正常',
    2: '迟到',
    3: '早退',
    4: '请假',
    5: '加班'
  }
  return map[status] || '未知'
}

// 获取状态标签类型
export const getStatusType = (status: number): string => {
  const map: Record<number, string> = {
    0: 'danger',
    1: 'success',
    2: 'warning',
    3: 'info'
  }
  return map[status] || 'info'
}

// 获取考勤状态标签类型
export const getAttendanceType = (status: number): string => {
  const map: Record<number, string> = {
    0: 'danger',
    1: 'success',
    2: 'warning',
    3: 'warning',
    4: 'info',
    5: 'primary'
  }
  return map[status] || 'info'
}

// 生成员工编号
export const generateEmployeeNo = (): string => {
  const date = dayjs().format('YYYYMMDD')
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `EMP${date}${random}`
}

// 下载文件
export const downloadFile = (blob: Blob, filename: string): void => {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}
