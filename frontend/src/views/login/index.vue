<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <el-icon :size="48" color="#409eff"><Management /></el-icon>
        <h2>人力资源管理系统</h2>
        <p>Human Resource Management System</p>
      </div>

      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        @keyup.enter="handleLogin"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="用户名"
            :prefix-icon="User"
            size="large"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="密码"
            :prefix-icon="Lock"
            size="large"
            show-password
          />
        </el-form-item>

        <el-form-item prop="captcha">
          <div class="captcha-row">
            <el-input
              v-model="loginForm.captcha"
              placeholder="验证码"
              :prefix-icon="Key"
              size="large"
              style="flex: 1"
            />
            <div class="captcha-img" @click="refreshCaptcha">
              {{ captchaCode }}
            </div>
          </div>
        </el-form-item>

        <el-form-item>
          <div class="login-options">
            <el-checkbox v-model="loginForm.remember">记住我</el-checkbox>
            <el-link type="primary" underline="never">忘记密码？</el-link>
          </div>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            size="large"
            :loading="loading"
            class="login-btn"
            @click="handleLogin"
          >
            登 录
          </el-button>
        </el-form-item>

        <div class="login-tips">
          <p>演示账号：admin / 123456</p>
          <p>普通用户：user / 123456</p>
        </div>
      </el-form>
    </div>

    <div class="login-footer">
      <p>© 2024 HR Management System. All rights reserved.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock, Key } from '@element-plus/icons-vue'
import { useUserStore } from '@/store/user'
import type { FormInstance, FormRules } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()

const loginFormRef = ref<FormInstance>()
const loading = ref(false)
const captchaCode = ref('')

const loginForm = reactive({
  username: 'admin',
  password: '123456',
  captcha: '',
  remember: false
})

const loginRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  captcha: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 4, message: '验证码为4位字符', trigger: 'blur' }
  ]
}

// 生成验证码
const generateCaptcha = () => {
  const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
  let result = ''
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  captchaCode.value = result
}

const refreshCaptcha = () => {
  generateCaptcha()
  loginForm.captcha = ''
}

const handleLogin = async () => {
  if (!loginFormRef.value) return

  await loginFormRef.value.validate(async (valid) => {
    if (valid) {
      // 验证验证码
      if (loginForm.captcha.toLowerCase() !== captchaCode.value.toLowerCase()) {
        ElMessage.error('验证码错误')
        refreshCaptcha()
        return
      }

      loading.value = true
      try {
        await userStore.loginAction({
          username: loginForm.username,
          password: loginForm.password
        })
        ElMessage.success('登录成功')
        router.push('/')
      } catch (error) {
        refreshCaptcha()
      } finally {
        loading.value = false
      }
    }
  })
}

onMounted(() => {
  generateCaptcha()
})
</script>

<style scoped lang="scss">
.login-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;

  .login-box {
    width: 420px;
    padding: 40px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);

    .login-header {
      text-align: center;
      margin-bottom: 30px;

      h2 {
        margin: 15px 0 5px;
        font-size: 24px;
        color: #333;
      }

      p {
        color: #999;
        font-size: 14px;
      }
    }

    .login-form {
      .captcha-row {
        display: flex;
        gap: 10px;

        .captcha-img {
          width: 100px;
          height: 40px;
          background: #f5f5f5;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          font-weight: bold;
          color: #409eff;
          letter-spacing: 4px;
          cursor: pointer;
          user-select: none;
        }
      }

      .login-options {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .login-btn {
        width: 100%;
      }

      .login-tips {
        margin-top: 20px;
        padding-top: 20px;
        border-top: 1px dashed #ddd;
        text-align: center;
        color: #999;
        font-size: 12px;

        p {
          margin: 5px 0;
        }
      }
    }
  }

  .login-footer {
    position: absolute;
    bottom: 20px;
    color: rgba(255, 255, 255, 0.8);
    font-size: 12px;
  }
}
</style>
