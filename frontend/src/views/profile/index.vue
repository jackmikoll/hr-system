<template>
  <div class="profile-container">
    <el-row :gutter="20">
      <!-- 左侧个人信息 -->
      <el-col :xs="24" :lg="8">
        <el-card shadow="hover" class="profile-card">
          <div class="profile-header">
            <el-avatar :size="100" :src="userStore.avatar || defaultAvatar" />
            <h3>{{ userStore.realName }}</h3>
            <p>{{ userStore.userInfo?.role === 'admin' ? '管理员' : '普通用户' }}</p>
          </div>
          <div class="profile-info">
            <div class="info-item">
              <span class="label">用户名：</span>
              <span>{{ userStore.username }}</span>
            </div>
            <div class="info-item">
              <span class="label">邮箱：</span>
              <span>{{ userStore.userInfo?.email || '-' }}</span>
            </div>
            <div class="info-item">
              <span class="label">手机号：</span>
              <span>{{ userStore.userInfo?.phone || '-' }}</span>
            </div>
            <div class="info-item">
              <span class="label">注册时间：</span>
              <span>{{ formatDate(userStore.userInfo?.createTime!) }}</span>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 右侧设置 -->
      <el-col :xs="24" :lg="16">
        <el-card shadow="hover">
          <el-tabs v-model="activeTab">
            <el-tab-pane label="基本设置" name="basic">
              <el-form :model="basicForm" label-width="100px" class="setting-form">
                <el-form-item label="昵称">
                  <el-input v-model="basicForm.nickname" placeholder="请输入昵称" />
                </el-form-item>
                <el-form-item label="邮箱">
                  <el-input v-model="basicForm.email" placeholder="请输入邮箱" />
                </el-form-item>
                <el-form-item label="手机号">
                  <el-input v-model="basicForm.phone" placeholder="请输入手机号" />
                </el-form-item>
                <el-form-item label="个人简介">
                  <el-input
                    v-model="basicForm.bio"
                    type="textarea"
                    :rows="4"
                    placeholder="请输入个人简介"
                  />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="handleUpdateBasic">保存</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>

            <el-tab-pane label="修改密码" name="password">
              <el-form
                ref="passwordFormRef"
                :model="passwordForm"
                :rules="passwordRules"
                label-width="120px"
                class="setting-form"
              >
                <el-form-item label="原密码" prop="oldPassword">
                  <el-input
                    v-model="passwordForm.oldPassword"
                    type="password"
                    placeholder="请输入原密码"
                    show-password
                  />
                </el-form-item>
                <el-form-item label="新密码" prop="newPassword">
                  <el-input
                    v-model="passwordForm.newPassword"
                    type="password"
                    placeholder="请输入新密码"
                    show-password
                  />
                </el-form-item>
                <el-form-item label="确认新密码" prop="confirmPassword">
                  <el-input
                    v-model="passwordForm.confirmPassword"
                    type="password"
                    placeholder="请再次输入新密码"
                    show-password
                  />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" :loading="passwordLoading" @click="handleChangePassword">
                    修改密码
                  </el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>

            <el-tab-pane label="头像设置" name="avatar">
              <div class="avatar-setting">
                <div class="current-avatar">
                  <el-avatar :size="120" :src="userStore.avatar || defaultAvatar" />
                </div>
                <el-upload
                  class="avatar-uploader"
                  action="/api/user/avatar"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload"
                >
                  <el-button type="primary">上传新头像</el-button>
                </el-upload>
                <p class="upload-tip">支持 jpg、png 格式，文件大小不超过 2MB</p>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/user'
import { changePassword } from '@/api/auth'
import { formatDate } from '@/utils/format'

const userStore = useUserStore()
const defaultAvatar = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'

const activeTab = ref('basic')

// 基本设置表单
const basicForm = reactive({
  nickname: userStore.realName,
  email: userStore.userInfo?.email || '',
  phone: userStore.userInfo?.phone || '',
  bio: ''
})

// 密码表单
const passwordFormRef = ref()
const passwordLoading = ref(false)
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const validateConfirmPassword = (_rule: any, value: string, callback: Function) => {
  if (value !== passwordForm.newPassword) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const passwordRules = {
  oldPassword: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

// 更新基本信息
const handleUpdateBasic = () => {
  ElMessage.success('保存成功')
}

// 修改密码
const handleChangePassword = async () => {
  const valid = await passwordFormRef.value?.validate()
  if (!valid) return

  passwordLoading.value = true
  try {
    await changePassword({
      oldPassword: passwordForm.oldPassword,
      newPassword: passwordForm.newPassword
    })
    ElMessage.success('密码修改成功')
    passwordForm.oldPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
  } finally {
    passwordLoading.value = false
  }
}

// 头像上传
const handleAvatarSuccess = (res: any) => {
  ElMessage.success('头像上传成功')
  userStore.userInfo!.avatar = res.data
}

const beforeAvatarUpload = (file: File) => {
  const isJPG = file.type === 'image/jpeg'
  const isPNG = file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPG && !isPNG) {
    ElMessage.error('只支持 JPG 或 PNG 格式!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB!')
    return false
  }
  return true
}
</script>

<style scoped lang="scss">
.profile-container {
  .profile-card {
    .profile-header {
      text-align: center;
      padding: 20px 0;
      border-bottom: 1px solid #ebeef5;

      h3 {
        margin: 15px 0 5px;
        font-size: 20px;
      }

      p {
        color: #909399;
      }
    }

    .profile-info {
      padding: 20px 0;

      .info-item {
        display: flex;
        justify-content: space-between;
        padding: 12px 0;
        border-bottom: 1px solid #f0f0f0;

        &:last-child {
          border-bottom: none;
        }

        .label {
          color: #909399;
        }
      }
    }
  }

  .setting-form {
    max-width: 500px;
    padding: 20px 0;
  }

  .avatar-setting {
    text-align: center;
    padding: 40px 0;

    .current-avatar {
      margin-bottom: 20px;
    }

    .upload-tip {
      margin-top: 15px;
      color: #909399;
      font-size: 12px;
    }
  }
}
</style>
