import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  // State
  const sidebarCollapsed = ref<boolean>(false)
  const device = ref<'desktop' | 'mobile'>('desktop')
  const loading = ref<boolean>(false)
  const loadingText = ref<string>('加载中...')

  // Actions
  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  const setSidebarCollapsed = (collapsed: boolean) => {
    sidebarCollapsed.value = collapsed
  }

  const setDevice = (deviceType: 'desktop' | 'mobile') => {
    device.value = deviceType
  }

  const setLoading = (status: boolean, text = '加载中...') => {
    loading.value = status
    loadingText.value = text
  }

  return {
    sidebarCollapsed,
    device,
    loading,
    loadingText,
    toggleSidebar,
    setSidebarCollapsed,
    setDevice,
    setLoading
  }
})
