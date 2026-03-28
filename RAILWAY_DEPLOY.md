# Railway 一键部署指南

## 部署步骤（只需3步）

### 第1步：注册 Railway 账号
1. 访问 https://railway.app
2. 点击 "Login" → "Continue with GitHub"
3. 授权 GitHub 登录

### 第2步：创建项目
1. 登录后点击 "New Project"
2. 选择 "Deploy from GitHub repo"
3. 如果是第一次使用，需要授权 Railway 访问你的 GitHub
4. 选择你上传的 `hr-system` 仓库

### 第3步：部署
1. Railway 会自动检测到 `nixpacks.toml` 配置文件
2. 点击 "Deploy" 按钮
3. 等待构建完成（约5-10分钟）
4. 部署完成后，点击生成的域名即可访问

---

## 部署后操作

### 查看日志
- 在 Railway 控制台点击你的项目
- 选择 "Deployments" 标签
- 点击最新的部署查看日志

### 获取域名
- 部署完成后，Railway 会自动分配一个域名
- 格式：`https://hr-system-xxxx.up.railway.app`
- 你也可以在 Settings → Domains 中查看

### 设置自定义域名（可选）
1. 在 Railway 控制台点击 "Settings"
2. 找到 "Domains" 部分
3. 点击 "+ Custom Domain"
4. 输入你的域名（如：`hr.yourdomain.com`）
5. 按照提示配置 DNS 记录

---

## 项目信息

### 访问地址
部署完成后，你将获得一个类似这样的链接：
```
https://hr-system-production-xxxx.up.railway.app
```

### 登录账号
- **管理员**：admin / 123456
- **普通用户**：user / 123456

### 功能模块
- 仪表盘 - 数据统计展示
- 员工管理 - 增删改查员工信息
- 部门管理 - 部门组织架构
- 考勤管理 - 打卡、考勤记录
- 薪资管理 - 工资计算、薪资记录
- 个人中心 - 修改密码、个人信息

---

## 注意事项

### 免费版限制
- **休眠机制**：15分钟无访问会自动休眠
- **首次访问**：休眠后首次访问需要等待约10-30秒唤醒
- **月额度**：每月有免费的执行时间额度（通常足够展示使用）

### 数据持久化
- 当前使用 H2 内存数据库
- **重启后数据会重置**（包括添加的员工、考勤记录等）
- 如需持久化，需要切换到 PostgreSQL 或 MySQL

### 更新部署
1. 修改代码后推送到 GitHub
2. Railway 会自动重新部署
3. 或手动在 Railway 控制台点击 "Redeploy"

---

## 故障排查

### 部署失败
1. 检查 GitHub 仓库是否包含所有文件
2. 查看 Railway 部署日志，检查错误信息
3. 确保 `nixpacks.toml` 文件存在

### 无法访问
1. 检查部署是否成功（Status 为 Success）
2. 查看日志是否有错误
3. 等待 1-2 分钟后刷新页面（可能正在启动）

### 页面显示错误
1. 清除浏览器缓存
2. 检查浏览器控制台（F12）查看错误信息
3. 在 Railway 日志中查看后端错误

---

## 写进简历的示例

部署成功后，你可以这样写进简历：

```markdown
## 项目经验

### 人力资源管理系统
- **技术栈**：Spring Boot 3 + Vue 3 + MyBatis-Plus + H2
- **功能模块**：员工管理、部门管理、考勤打卡、薪资计算
- **在线演示**：https://hr-system-xxxx.up.railway.app
- **源码地址**：https://github.com/你的用户名/hr-system
- **部署平台**：Railway（云原生部署）

**主要功能**：
- 实现员工信息的增删改查，支持批量导入导出
- 部门组织架构管理，支持多级部门
- 考勤打卡系统，自动计算工作时长
- 薪资管理模块，自动计算社保、公积金、个税
- JWT 认证鉴权，角色权限控制
```

---

## 需要帮助？

- Railway 官方文档：https://docs.railway.app
- 常见问题：https://docs.railway.app/reference/faq
- 社区支持：https://discord.gg/railway

---

**部署完成后，你就拥有了一个可以写进简历的在线项目！** 🎉
