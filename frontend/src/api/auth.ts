import request from '@/utils/request'
import type { LoginForm, LoginResult, User } from '@/types'

// 登录
export const login = (data: LoginForm): Promise<LoginResult> => {
  return request.post('/auth/login', data)
}

// 注册
export const register = (data: { username: string; password: string; realName: string }): Promise<void> => {
  return request.post('/auth/register', data)
}

// 获取用户信息
export const getUserInfo = (): Promise<User> => {
  return request.get('/auth/info')
}

// 登出
export const logout = (): Promise<void> => {
  return request.post('/auth/logout')
}

// 修改密码
export const changePassword = (data: { oldPassword: string; newPassword: string }): Promise<void> => {
  return request.put('/auth/password', data)
}
