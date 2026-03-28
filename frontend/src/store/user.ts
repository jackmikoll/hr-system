import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginForm } from '@/types'
import { login, getUserInfo } from '@/api/auth'

export const useUserStore = defineStore('user', () => {
  // State
  const token = ref<string>(localStorage.getItem('token') || '')
  const userInfo = ref<User | null>(null)
  const permissions = ref<string[]>([])

  // Getters
  const isLoggedIn = computed(() => !!token.value)
  const username = computed(() => userInfo.value?.username || '')
  const realName = computed(() => userInfo.value?.realName || '')
  const avatar = computed(() => userInfo.value?.avatar || '')
  const role = computed(() => userInfo.value?.role || '')

  // Actions
  const setToken = (newToken: string) => {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  const clearToken = () => {
    token.value = ''
    userInfo.value = null
    permissions.value = []
    localStorage.removeItem('token')
  }

  const loginAction = async (loginForm: LoginForm): Promise<void> => {
    console.log('登录请求:', loginForm)
    const res = await login(loginForm)
    setToken(res.token)
    userInfo.value = res.userInfo
    permissions.value = [res.userInfo.role]
  }

  const getUserInfoAction = async (): Promise<void> => {
    const res = await getUserInfo()
    userInfo.value = res
    permissions.value = [res.role]
  }

  const logout = () => {
    clearToken()
  }

  const checkLoginStatus = async (): Promise<void> => {
    if (token.value && !userInfo.value) {
      try {
        await getUserInfoAction()
      } catch {
        clearToken()
      }
    }
  }

  return {
    token,
    userInfo,
    permissions,
    isLoggedIn,
    username,
    realName,
    avatar,
    role,
    setToken,
    clearToken,
    loginAction,
    getUserInfoAction,
    logout,
    checkLoginStatus
  }
})
